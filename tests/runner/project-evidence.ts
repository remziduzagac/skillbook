import { spawnSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { cached, MARKER } from "./paths";
import { runTurn, endRun } from "./process";
import { redact } from "./trace";
import type { Case, Checks, TestRun } from "./types";

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
// The runner's own check runs in a copy of the project as the turn left it, with its own fresh, empty home and
// temporary folder, all removed afterwards; so it changes nothing the agent sees, in the project or in the home.
export async function runTestCommands(commands: string[], work: string, scratch: string,
  timeout = TEST_TIMEOUT): Promise<TestRun[]> {
  const runs: TestRun[] = [];
  for (const command of commands) {
    const root = mkdtempSync(join(scratch, "test-run-")), project = join(root, "project"), tmp = join(root, "tmp"),
      home = join(root, "home");
    try {
      mkdirSync(tmp); mkdirSync(home);
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
