import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync, lstatSync, existsSync } from "node:fs";
import { join, resolve, relative, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import { FIXTURES } from "./paths";
import type { Case, Chapter } from "./types";

export function inside(root: string, path: string): string {
  const full = resolve(root, path), rel = relative(root, full);
  if (!path || isAbsolute(path) || rel === ".." || rel.startsWith("../") || !rel)
    throw Error(`path must stay inside its root: ${path}`);
  return full;
}
export function chapterAt(c: Pick<Case, "chapters">, turn: number): Chapter | undefined {
  return c.chapters?.find((ch, i, all) => turn >= ch.start_turn && turn < (all[i + 1]?.start_turn ?? Infinity));
}
export function selectedTurns(c: Case, chapter?: number) {
  if (chapter !== undefined && !c.chapters?.some(ch => ch.number === chapter))
    throw Error(`no chapter ${chapter} in ${c.id}`);
  return c.turns.map((turn, index) => ({ turn, index, chapter: chapterAt(c, index + 1) }))
    .filter(t => chapter === undefined || t.chapter?.number === chapter);
}
function copyTree(source: string, target: string) {
  if (lstatSync(source).isSymbolicLink()) throw Error("checkpoint root cannot be a symlink");
  // Fixture metadata cannot redirect a copy outside the throwaway project.
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === ".git") throw Error("checkpoint cannot supply .git");
    const path = join(source, entry.name);
    if (lstatSync(path).isSymbolicLink()) throw Error("checkpoint cannot contain symlinks");
    const dest = join(target, entry.name);
    if (entry.isDirectory()) {
      if (existsSync(dest) && !lstatSync(dest).isDirectory()) rmSync(dest, { force: true });
      mkdirSync(dest, { recursive: true }); copyTree(path, dest);
    } else {
      rmSync(dest, { force: true, recursive: true }); cpSync(path, dest);
    }
  }
}
export function putCheckpoint(work: string, ch: Chapter, gitignore: string[] = []) {
  // Recreate even .git: agent-controlled hooks, branches and config must not survive a checkpoint.
  rmSync(work, { recursive: true, force: true }); mkdirSync(work, { recursive: true });
  for (const fixture of [ch.checkpoint.fixture, ...(ch.checkpoint.overlays ?? [])])
    copyTree(inside(FIXTURES, fixture), work);
  for (const path of ch.checkpoint.remove ?? []) {
    if (path.split("/").includes(".git")) throw Error("checkpoint removal cannot name .git");
    rmSync(inside(work, path), { recursive: true, force: true });
  }
  writeFileSync(join(work, ".gitignore"), gitignore.join("\n") + (gitignore.length ? "\n" : ""));
}
// The agent's own settings, skills and login live under these names in its home; checkpoint files never touch them.
export const AGENT_HOME = [".agents", ".claude", ".claude.json", ".codex"];
// The names a checkpoint's home folders place at the top of the home.
export const homeEntries = (ch: Chapter) =>
  (ch.checkpoint.home ?? []).flatMap(folder => readdirSync(inside(FIXTURES, folder)));
// A checkpoint's home folders are copied in order into the throwaway home, before the chapter's first agent call.
// First every top-level entry that any chapter's home folders place is removed, so files from an earlier chapter, and
// the agent's changes to them, never cross into a later one, whichever chapter the run starts at.
export function putHome(home: string, ch: Chapter, chapters: Chapter[] = [ch]) {
  for (const name of new Set(chapters.flatMap(homeEntries))) {
    if (AGENT_HOME.includes(name)) throw Error(`checkpoint home cannot supply ${name}`);
    rmSync(join(home, name), { recursive: true, force: true });
  }
  for (const folder of ch.checkpoint.home ?? []) copyTree(inside(FIXTURES, folder), home);
}
// Paths named `untracked` stay in the project but out of the checkpoint's commit, as a file the user never added.
export function commitCheckpoint(work: string, chapter: number, untracked: string[] = []) {
  const env = { PATH: process.env.PATH, HOME: work, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" };
  for (const args of [["init", "-q", "-b", "main"], ["add", "-A"],
    ...(untracked.length ? [["rm", "-r", "-q", "--cached", "--ignore-unmatch", "--", ...untracked]] : []),
    ["-c", "user.name=Test harness", "-c", "user.email=test@example.invalid", "commit", "-q", "--allow-empty",
      "-m", `checkpoint chapter ${chapter}`]]) {
    const ran = spawnSync("git", ["-c", "core.hooksPath=/dev/null", ...args], { cwd: work, env });
    if (ran.status !== 0) throw Error(`checkpoint commit failed: ${ran.stderr}`);
  }
}
