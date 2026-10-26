import { readFileSync, existsSync, statSync, realpathSync, readdirSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { tmpdir } from "node:os";
import { matches, regex } from "./regex";
import { skillFiles, walk } from "./inventory";
import { REPO, FIXTURES } from "./paths";
import type { Checks, Observation, Verdict } from "./types";
const words = new Set<string>(),
  parents = new Set<string>();
for (const [name, path] of skillFiles())
  if (path.startsWith(join(REPO, "skills") + "/")) {
    const named = [name, ...[...readFileSync(path, "utf8").matchAll(/`([a-z][a-z0-9-]*)` skill/g)].map((x) => x[1]!)];
    for (const n of named) {
      for (const part of n.split("-")) words.add(part);
      if (n.includes("-")) parents.add(n.split("-")[0]!);
    }
  }
const names = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b)).join("|"),
  parent = [...parents].sort().join("|") || "(?!)";
const rare = "guardrails|rightsize|stakes|clarify",
  quote = "[`'\"’]?",
  verbs = "needs?|needed|loads?|loaded|loading|reads?|reading|uses?|used|using|follows?|followed|following";
const talk = regex(
  [
    `\\b(?:${parent})-[a-z]`,
    `\\b(?:${names})${quote}(?:\\s+|-)skills?\\b`,
    "`[a-z][\\w-]*`\\s+skills?\\b",
    "\\b(?:referenced|loaded)\\s+(?:\\S+\\s+)?skills?\\b",
    `\\b(?:essentials|${rare})${quote}\\s+(?:references?|guidance|instructions)\\b|\\bessentials${quote}\\s+set\\b`,
    `\\b(?:${verbs})\\s+(?:the\\s+)?${quote}(?:${rare})\\b`,
    `\\b(?:${verbs})\\s+(?:the\\s+)?(?:${quote}[\\w-]+${quote}` +
      `(?:,\\s*|\\s+and\\s+)){1,3}${quote}(?:guardrails|rightsize|clarify)\\b`,
    "\\b(?:loads?|loaded|loading)\\s+(?:the\\s+)?(?:required\\s+)?essentials\\b",
    `\\bSKILL\\.md\\b|\\breferences/[\\w./-]*\\.md\\b|\\b(?:${parent})(?:/[\\w-]+)*\\.md\\b|\\bskills/[a-z][\\w-]*/`,
  ].join("|"),
);
const essentials = /(?:the\s+)?[`'"’]?essentials[`'"’]?(?:\s+skill)?/gi;
export function names_skill(answer: string, agent?: string | null) {
  if (regex(essentials.source + "\\s+rules?\\b").test(answer)) return true;
  if (agent === "codex") {
    const lines = answer.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!,
        rest = line.replace(essentials, "");
      if (
        line.length <= 200 &&
        regex(
          "\\b(load|loading|use|using|read|reading|follow|following|apply|applying|open|opening)" +
            "\\b[^.\\n]{0,40}\\bessentials\\b",
        ).test(line) &&
        !/\b(because|since|so that|requires?|says|forbids?|prohibits?|allows?|must)\b/i.test(line) &&
        !talk.test(rest)
      ) {
        lines.splice(i, 1);
        answer = lines.join("\n");
        break;
      }
    }
  }
  return talk.test(answer);
}
export const written = (changes: string[]) =>
  changes.filter((c) => c.startsWith("changed ") || c.startsWith("added ")).map((c) => c.slice(c.indexOf(" ") + 1));
export function named_paths(answer: string, cap = 200): string[] {
  const found: string[] = [],
    roots = [tmpdir(), "/tmp", "/var/tmp"].map((x) => resolve(x));
  for (const name of new Set(
    [...answer.matchAll(/(?<![\w.~$/-])\/[\w.@%+-]+(?:\/[\w.@%+-]+)*\/?/g)].map((m) => m[0].replace(/[.,:;]+$/, "")),
  )) {
    try {
      const real = realpathSync(name);
      if (!roots.some((root) => real !== root && !relative(root, real).startsWith("..")) || !existsSync(name)) continue;
      const dir = statSync(name).isDirectory();
      found.push(name.replace(/\/$/, "") + (dir ? "/" : ""));
      function below(folder: string): boolean {
        for (const entry of readdirSync(folder, { withFileTypes: true })) {
          if (found.length >= cap) return false;
          const child = join(folder, entry.name);
          found.push(child + (entry.isDirectory() ? "/" : ""));
          if (entry.isDirectory() && !below(child)) return false;
        }
        return true;
      }
      if (dir && !below(name)) return found;
    } catch {
      continue;
    }
  }
  return found;
}
export function check(
  checks: Checks,
  result: Partial<Observation>,
  fixture?: string | null,
  tmp: string[] | null = null,
): Record<string, Verdict> {
  const out: Record<string, Verdict> = {},
    delta = result.changes ?? [],
    answer = result.answer ?? "",
    paths = written(delta);
  for (const n of checks.reads ?? []) out[`reads ${n}`] = (result.reads ?? []).includes(n);
  for (const n of checks.reads_not ?? [])
    out[`no supported read observed for ${n}`] = !(result.reads ?? []).includes(n);
  if (checks.no_changes) out["no changes"] = !delta.length;
  for (const p of checks.unchanged ?? []) out[`unchanged ${p}`] = !delta.some((c) => c.slice(c.indexOf(" ") + 1) === p);
  for (const p of checks.removed ?? []) out[`removed ${p}`] = delta.includes(`removed ${p}`);
  for (const p of checks.changed ?? []) out[`changed ${p}`] = paths.includes(p);
  const stated = checks.states_before_change;
  if (stated) {
    const before = result.before_change ?? "",
      said = before.trim().length >= 80;
    for (const [name, found] of [
      ["text before its first change", said],
      ...(Array.isArray(stated) ? stated : []).map((p) => [
        `text before its first change has /${p}/`,
        said && matches(p, before),
      ]),
    ] as [string, boolean][])
      out[name] = !result.changed_files || found ? true : result.sequencing_unknown ? null : false;
  }
  if (checks.only_changed?.length) {
    const allowed = [...checks.only_changed].sort();
    out[`nothing changed but ${allowed.join(", ")}`] = delta.every((c) =>
      allowed.includes(c.slice(c.indexOf(" ") + 1)),
    );
  }
  for (const [p, patterns] of Object.entries(checks.file_contains ?? {}))
    for (const pattern of patterns) out[`${p} keeps /${pattern}/`] = matches(pattern, result.files?.[p] ?? "");
  for (const p of checks.shorter ?? []) {
    const text = result.files?.[p],
      original = fixture ? readFileSync(join(FIXTURES, fixture, p), "utf8") : "";
    out[`${p} shorter`] = text != null && text.length < original.length;
  }
  for (const [folder, least] of Object.entries(checks.written_under ?? {}))
    out[`at least ${least} files written under ${folder}`] = paths.filter((p) => p.startsWith(folder)).length >= least;
  for (const [folder, patterns] of Object.entries(checks.folder_lacks ?? {}))
    for (const p of patterns)
      out[`files written under ${folder} lack /${p}/`] = !Object.entries(result.files ?? {}).some(
        ([path, text]) => path.startsWith(folder) && matches(p, text ?? ""),
      );
  if (checks.nothing_left_running)
    out["nothing left running"] = result.left_running == null ? null : result.left_running.length === 0;
  for (const p of checks.tmp_has ?? [])
    out[`temporary folder has /${p}/`] = tmp === null ? null : tmp.some((x) => matches(p, x));
  for (const p of checks.tmp_lacks ?? [])
    out[`temporary folder lacks /${p}/`] = tmp === null ? null : !tmp.some((x) => matches(p, x));
  for (const p of checks.answer_contains ?? []) out[`answer has /${p}/`] = matches(p, answer);
  for (const p of checks.answer_not_contains ?? []) out[`answer lacks /${p}/`] = !matches(p, answer);
  if (checks.names_no_skill) out["answer names no skill or skill file"] = !names_skill(answer, result.agent);
  for (const p of checks.agent_started_or_answer ?? [])
    out[`an agent was started, or the answer has /${p}/`] =
      result.agents_started || matches(p, answer) ? true : result.agents_unseen ? null : false;
  for (const p of checks.answer_path_has ?? [])
    out[`a temporary path the answer names holds /${p}/`] = named_paths(answer).some((x) => matches(p, x));
  for (const p of checks.actions_lack ?? [])
    out[`no action matches /${p}/`] = !(result.targets ?? []).some((x) => matches(p, x));
  return out;
}
