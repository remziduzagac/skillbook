import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  lstatSync,
  readlinkSync,
  realpathSync,
  copyFileSync,
  cpSync,
} from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { REPO, POINTER, MARKER } from "./paths";
import { written } from "./checks";
import {
  skills_read,
  turn_answer,
  text_before_change,
  action_evidence,
  agents_started,
  agents_unseen,
  TARGET_KEYS,
} from "./trace";
import type { Agent, Checks, Event, Observation } from "./types";
export { skill_name } from "./shell";
const IGNORED = new Set([".claude", ".codex", ".agents", "__pycache__", ".git"]);
export function projectPaths(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => !IGNORED.has(e.name))
    .flatMap((e) => (e.isDirectory() ? projectPaths(join(root, e.name)) : [join(root, e.name)]));
}
const digest = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
export function snapshot(folder: string): Record<string, string> {
  return Object.fromEntries(
    projectPaths(folder).map((p) => [
      relative(folder, p),
      lstatSync(p).isSymbolicLink() ? "symlink:" + digest(readlinkSync(p)) : digest(readFileSync(p)),
    ]),
  );
}
export function changes(before: Record<string, string>, after: Record<string, string>): string[] {
  return [
    ...Object.keys(after)
      .filter((p) => !(p in before))
      .map((p) => "added " + p),
    ...Object.keys(before)
      .filter((p) => !(p in after))
      .map((p) => "removed " + p),
    ...Object.keys(before)
      .filter((p) => p in after && before[p] !== after[p])
      .map((p) => "changed " + p),
  ].sort();
}
const secrets = [
  "refresh_token",
  "refreshToken",
  "access_token",
  "accessToken",
  "sk-ant-",
  "OPENAI_API_KEY",
  "CODEX_API_KEY",
  "ANTHROPIC_API_KEY",
];
export const withheld = (data: Buffer | string) => secrets.some((marker) => data.includes(marker));
export function fixtureText(work: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(snapshot(work)).map(([name, hash]) => {
      const path = join(work, name),
        stat = lstatSync(path);
      if (stat.isSymbolicLink()) return [name, `(symlink to ${readlinkSync(path)})\n`];
      const data = readFileSync(path);
      if (stat.nlink > 1 || withheld(data))
        return [name, `(content withheld: a hard link or credential-like content, sha256 ${hash})\n`];
      try {
        return [name, new TextDecoder("utf-8", { fatal: true }).decode(data)];
      } catch {
        return [name, `(binary file, sha256 ${hash})\n`];
      }
    }),
  );
}
export function fixtureDiffs(before: Record<string, string>, after: Record<string, string>) {
  const diffs: Record<string, string> = {};
  for (const p of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort())
    if (before[p] !== after[p]) {
      // Retain full before and after text in a simple unified hunk. No external diff process sees credentials.
      const a = (before[p] ?? "").split("\n"),
        b = (after[p] ?? "").split("\n");
      diffs[p] =
        `--- before/${p}\n+++ after/${p}\n@@ -1,${a.length} +1,${b.length} @@\n` +
        a.map((x) => "-" + x).join("\n") +
        "\n" +
        b.map((x) => "+" + x).join("\n") +
        "\n";
    }
  return diffs;
}
export function safeContent(work: string, path: string): string | null {
  const full = resolve(work, path);
  try {
    if (
      relative(resolve(work), full).startsWith("..") ||
      lstatSync(full).isSymbolicLink() ||
      !lstatSync(full).isFile() ||
      lstatSync(full).nlink > 1 ||
      relative(realpathSync(work), realpathSync(full)).startsWith("..")
    )
      return null;
    const data = readFileSync(full);
    return withheld(data) ? null : data.toString("utf8");
  } catch {
    return null;
  }
}
export function observe(
  agent: Agent,
  events: Event[][],
  set: string,
  before: Record<string, string>,
  work: string,
  checks: Checks,
): Observation {
  let [said, changed, uncertain] = text_before_change(agent, events);
  const delta = changes(before, snapshot(work));
  if (delta.length && !changed && !uncertain) {
    said = "";
    uncertain = "a change no action shows";
  }
  const paths = new Set([...Object.keys(checks.file_contains ?? {}), ...(checks.shorter ?? [])]),
    folders = Object.keys(checks.folder_lacks ?? {});
  for (const p of written(delta)) if (folders.some((f) => p.startsWith(f))) paths.add(p);
  return {
    reads: [...skills_read(agent, events, null, set)].sort(),
    changes: delta,
    answer: events
      .map((e) => turn_answer(agent, e))
      .filter(Boolean)
      .join("\n\n"),
    targets: events
      .flatMap((e) => action_evidence(agent, e))
      .flatMap((a) =>
        Object.entries(a)
          .filter(([k, v]) => TARGET_KEYS.includes(k) && typeof v === "string")
          .map(([, v]) => v),
      ),
    agents_started: agents_started(agent, events),
    agents_unseen: agents_unseen(agent, events, uncertain === "a change no action shows"),
    before_change: said,
    changed_files: changed || delta.length > 0,
    sequencing_unknown: uncertain,
    paths_present: Object.fromEntries((checks.absent ?? []).map(p => {
      try { lstatSync(join(work, p)); return [p, true]; }
      catch (error: any) { return [p, error.code === "ENOENT" ? false : null]; }
    })),
    files: Object.fromEntries([...paths].map((p) => [p, safeContent(work, p)])),
  };
}
export const ownLogin = (agent: Agent) =>
  join(homedir(), agent === "claude" ? ".claude/.credentials.json" : ".codex/auth.json");
export function prepareHome(
  home: string,
  agent: Agent,
  c: { set: string; pointer: boolean; project_skills?: string[] },
  login: boolean,
  instruction = "",
) {
  // Refuse a real agent home even if a caller accidentally passes it here.
  if (resolve(home) === resolve(homedir()) || [".codex", ".claude", ".agents"].includes(home.split("/").at(-1)!))
    throw Error("home must be a throwaway root");
  const dir = join(home, agent === "claude" ? ".claude" : ".codex");
  mkdirSync(dir, { recursive: true });
  const installed = spawnSync(join(REPO, "install.sh"), ["--agents", agent], {
    env: { ...process.env, HOME: home },
    encoding: "utf8",
  });
  if (installed.status !== 0) throw Error("sandbox install failed: " + installed.stderr);
  const skills = join(home, agent === "claude" ? ".claude" : ".agents", "skills");
  for (const name of c.project_skills ?? [])
    cpSync(join(REPO, ".agents/skills", name), join(skills, name), {
      recursive: true,
      filter: (p) => !p.split("/").at(-1)!.startsWith("."),
    });
  if (agent === "claude")
    writeFileSync(
      join(dir, "settings.json"),
      JSON.stringify(
        {
          permissions: {
            allow: ["Read(~/.claude/skills/**)", "Bash"],
            deny: ["RemoteTrigger", "PushNotification", "DesignSync"],
          },
          sandbox: {
            enabled: true,
            failIfUnavailable: true,
            autoAllowBashIfSandboxed: true,
            allowUnsandboxedCommands: false,
          },
          disableClaudeAiConnectors: true,
          syncClaudeAiSkills: false,
          syncClaudeAiPlugins: false,
        },
        null,
        2,
      ) + "\n",
    );
  else
    writeFileSync(
      join(dir, "config.toml"),
      "[features]\napps = false\nplugins = false\nremote_plugin = false\n" +
        "\n[sandbox_workspace_write]\nexclude_slash_tmp = true\n",
    );
  const lines = [...(c.pointer ? [POINTER] : []), ...(instruction ? [instruction] : [])];
  if (lines.length) writeFileSync(join(dir, agent === "claude" ? "CLAUDE.md" : "AGENTS.md"), lines.join("\n\n") + "\n");
  if (login) copyFileSync(ownLogin(agent), join(dir, agent === "claude" ? ".credentials.json" : "auth.json"));
}
export function agentEnv(home: string, agent: Agent, login: boolean, tmp: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const key of ["PATH", "LANG", "LC_ALL", "TERM", "USER", "LOGNAME", "SHELL"])
    if (process.env[key]) env[key] = process.env[key]!;
  env.HOME = home;
  env.TMPDIR = tmp;
  env[MARKER] = tmp;
  if (agent === "codex") env.CODEX_HOME = join(home, ".codex");
  if (!login)
    for (const key of ["ANTHROPIC_API_KEY", "CODEX_API_KEY", "OPENAI_API_KEY"])
      if (process.env[key]) env[key] = process.env[key]!;
  if (agent === "codex" && !login && !env.CODEX_API_KEY && env.OPENAI_API_KEY) env.CODEX_API_KEY = env.OPENAI_API_KEY;
  return env;
}
export function commitFixture(work: string) {
  const env = { PATH: process.env.PATH, HOME: work, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" };
  for (const args of [
    ["init", "-q"],
    ["add", "-A"],
    ["-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-q", "-m", "fixture"],
  ]) {
    const p = spawnSync("git", ["-c", "core.hooksPath=/dev/null", ...args], { cwd: work, env });
    if (p.status !== 0) throw Error("fixture commit failed");
  }
}
