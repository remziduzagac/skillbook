import { spawnSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { cached, MARKER } from "./paths";
import { runTurn, endRun } from "./process";
import { redact } from "./trace";
import type { Case, Checks, Observation, TestRun } from "./types";

// A case's `requires` names programs the project's own work needs; each is probed with `--version`.
export function missingPrograms(cases: Pick<Case, "id" | "requires">[]): { program: string; cases: string[] }[] {
  const needed = new Map<string, string[]>();
  for (const c of cases) for (const program of c.requires ?? []) needed.set(program, [...needed.get(program) ?? [], c.id]);
  return [...needed].filter(([program]) => {
    const probe = spawnSync(program, ["--version"], { encoding: "utf8", timeout: 30_000 });
    return probe.error !== undefined || probe.status !== 0;
  }).map(([program, ids]) => ({ program, cases: ids }));
}
export const missingMessage = (missing: ReturnType<typeof missingPrograms>) => missing.map(m =>
  `missing program: ${m.program} (\`${m.program} --version\` failed), required by ${m.cases.join(", ")}`).join("\n");

// The project's repository may hold agent-written config, so only plumbing commands run, with hooks and monitors off.
function git(work: string, args: string[], input?: string) {
  const env = { PATH: process.env.PATH, HOME: work, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1",
    GIT_TERMINAL_PROMPT: "0" };
  const ran = spawnSync("git", ["-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", ...args],
    { cwd: work, env, input, encoding: "utf8", maxBuffer: 256 * 1024 * 1024, timeout: 60_000 });
  return ran.status === 0 ? ran.stdout : null;
}
// Every ref tip and HEAD before a turn; null when the project has no readable repository.
export function gitTips(work: string): string[] | null {
  if (!existsSync(join(work, ".git"))) return null;
  const refs = git(work, ["for-each-ref", "--format=%(objectname)"]);
  if (refs === null) return null;
  const head = git(work, ["rev-parse", "--verify", "-q", "HEAD"]);
  return [...new Set([...refs.split("\n"), head ?? ""].map(s => s.trim()).filter(Boolean))].sort();
}
// Commits reachable from a ref after the turn and from none before it, each with the paths in its tree;
// tags with the commits they point at; and HEAD. A field the repository cannot supply stays absent, so unknown.
export function gitEvidence(work: string, before: string[] | null): Pick<Observation, "commits" | "tags" | "head"> {
  if (before === null || !existsSync(join(work, ".git"))) return {};
  const evidence: Pick<Observation, "commits" | "tags" | "head"> = {};
  const head = git(work, ["rev-parse", "--verify", "-q", "HEAD^{commit}"])?.trim();
  if (head) evidence.head = head;
  const tags = git(work, ["for-each-ref", "--format=%(refname:strip=2)%00%(objectname)%00%(*objectname)", "refs/tags"]);
  if (tags !== null) evidence.tags = Object.fromEntries(tags.split("\n").filter(Boolean).map(line => {
    const [name, object, peeled] = line.split("\0");
    return [name!, peeled || object!];
  }));
  const made = git(work, ["rev-list", "--all", "--ignore-missing", "--stdin"], before.map(sha => `^${sha}\n`).join(""));
  if (made !== null) {
    const commits = made.split("\n").filter(Boolean).map(sha => {
      const tree = git(work, ["ls-tree", "-r", "--name-only", "-z", sha]);
      return tree === null ? null : { sha, paths: tree.split("\0").filter(Boolean).sort() };
    });
    if (!commits.includes(null)) evidence.commits = commits as { sha: string; paths: string[] }[];
  }
  return evidence;
}

export const TEST_TIMEOUT = 300;
export const testCommands = (assertions: (Checks | undefined)[]) =>
  [...new Set(assertions.flatMap(a => a?.tests_pass === undefined ? [] : [a.tests_pass]))];
export const needsTurnStart = (assertions: (Checks | undefined)[]) => assertions.some(a => a?.compare_to === "turn");
export function unittestCounts(output: string): Pick<TestRun, "tests_run" | "failures" | "errors" | "failed"> {
  const ran = output.match(/^Ran (\d+) tests? in /m), summary = output.match(/^(?:FAILED|OK)\b.*$/m)?.[0] ?? "";
  const count = (name: string) => ran ? Number(summary.match(new RegExp(`\\b${name}=(\\d+)`))?.[1] ?? 0) : null;
  return { tests_run: ran ? Number(ran[1]) : null, failures: count("failures"), errors: count("errors"),
    failed: [...output.matchAll(/^(?:FAIL|ERROR): (.+)$/gm)].map(m => m[1]!.trim()) };
}
// The runner's own check runs in a copy of the project as the turn left it, so it changes nothing the agent sees.
export async function runTestCommands(commands: string[], work: string, home: string, scratch: string,
  timeout = TEST_TIMEOUT): Promise<TestRun[]> {
  const runs: TestRun[] = [];
  for (const command of commands) {
    const root = mkdtempSync(join(scratch, "test-run-")), project = join(root, "project"), tmp = join(root, "tmp");
    try {
      mkdirSync(tmp);
      cpSync(work, project, { recursive: true, verbatimSymlinks: true, filter: source => {
        const stat = lstatSync(source);
        return !cached(source) && (stat.isFile() || stat.isDirectory() || stat.isSymbolicLink());
      } });
      const marker = `tests-${crypto.randomUUID()}`, groups: number[] = [], env: Record<string, string> = {};
      for (const key of ["PATH", "LANG", "LC_ALL", "TERM", "USER", "LOGNAME"]) if (process.env[key]) env[key] = process.env[key]!;
      Object.assign(env, { HOME: home, TMPDIR: tmp, PYTHONDONTWRITEBYTECODE: "1", [MARKER]: marker });
      const started = Date.now(), ran = await runTurn(["sh", "-c", command], project, env, timeout, groups);
      await endRun(groups, marker);
      const output = ran.stderr + (ran.stderr && ran.stdout ? "\n" : "") + ran.stdout;
      // A null status is a time-out or a signal; either way the command did not exit 0.
      runs.push({ command, status: ran.status, timed_out: ran.status === null && Date.now() - started >= timeout * 1000,
        ...unittestCounts(output),
        output_tail: redact(output.slice(-2000)) });
    } catch (error) {
      runs.push({ command, status: null, error: String(error) });
    } finally { rmSync(root, { recursive: true, force: true }); }
  }
  return runs;
}
