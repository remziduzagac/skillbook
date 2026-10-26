import { spawn, spawnSync } from "node:child_process";
import { readFileSync, readdirSync, lstatSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { MARKER } from "./paths";
import { redact } from "./trace";
export type Owned = Record<number, { group: number; started: string | null; command: string }>;
export function startTime(pid: number): string | null {
  try {
    return readFileSync(`/proc/${pid}/stat`, "utf8").split(")").at(-1)!.trim().split(/\s+/)[19] ?? null;
  } catch {
    return null;
  }
}
export function carries(pid: number, marker?: string): boolean {
  try {
    return !!marker && readFileSync(`/proc/${pid}/environ`, "utf8").split("\0").includes(`${MARKER}=${marker}`);
  } catch {
    return false;
  }
}
export function owned(groups: number[], marker?: string): Owned | null {
  if (!groups.length) return {};
  const result = spawnSync("ps", ["-A", "-o", "pid=,pgid=,stat=,args="], { encoding: "utf8", timeout: 10000 });
  if (result.status !== 0) return null;
  const found: Owned = {};
  for (const line of result.stdout.split("\n")) {
    const m = line.trim().match(/^(\d+)\s+(\d+)\s+(\S+)(?:\s+(.*))?$/);
    if (!m || m[3]!.startsWith("Z")) continue;
    const pid = Number(m[1]),
      group = Number(m[2]);
    if (pid !== process.pid && (groups.includes(group) || carries(pid, marker)))
      found[pid] = { group, started: startTime(pid), command: m[4] ?? "" };
  }
  return found;
}
function signal(pid: number, sig: NodeJS.Signals) {
  try {
    process.kill(pid, sig);
  } catch {
    /* Process already ended or inaccessible. */
  }
}
export async function endRun(groups: number[], marker?: string) {
  if (owned(groups, marker) === null) {
    for (const g of groups) signal(-g, "SIGKILL");
    return;
  }
  for (const sig of ["SIGTERM", "SIGKILL"] as const) {
    const sent = new Set<string>(),
      deadline = Date.now() + 2000;
    do {
      const found = owned(groups, marker);
      if (!found || !Object.keys(found).length) return;
      const groupSignals = new Set<number>();
      for (const [pidString, p] of Object.entries(found)) {
        const pid = Number(pidString),
          key = `${pid}:${p.started}`;
        if (sent.has(key)) continue;
        sent.add(key);
        if (groups.includes(p.group)) groupSignals.add(p.group);
        else if (p.started !== null && startTime(pid) === p.started) signal(pid, sig);
      }
      for (const group of groupSignals) signal(-group, sig);
      if (Date.now() >= deadline) break;
      await Bun.sleep(50);
    } while (true);
  }
}
export function tmpPaths(root?: string): string[] | null {
  if (!root) return null;
  const found: string[] = [];
  try {
    function visit(folder: string) {
      for (const e of readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const path = join(folder, e.name);
        found.push(relative(root!, path) + (e.isDirectory() ? "/" : ""));
        if (e.isDirectory()) visit(path);
      }
    }
    visit(root);
    return found;
  } catch {
    return null;
  }
}
export function tmpListing(root?: string, cap = 50) {
  const paths = tmpPaths(root);
  if (paths === null) return null;
  return {
    entries: paths.slice(0, cap).flatMap((p) => {
      try {
        return [[redact(p).slice(0, 200), lstatSync(join(root!, p)).size]];
      } catch {
        return [];
      }
    }),
    cut: paths.length > cap,
  };
}
export function leftReport(found: Owned | null, skip?: number): [string[] | null, string | null] {
  if (found === null) return [null, "the process list could not be read"];
  const left = Object.entries(found)
    .filter(([pid]) => Number(pid) !== skip)
    .map(([, p]) => redact(p.command).slice(0, 200))
    .sort();
  if (!left.length && !existsSync("/proc/self/environ"))
    return [null, "this system does not show a process's environment, so one that left its group is not seen"];
  return [left, null];
}
export interface TurnExecution {
  stdout: string;
  stderr: string;
  status: number | null;
  left: string[] | null;
  left_why: string | null;
  tmp: ReturnType<typeof tmpListing>;
  tmp_paths: string[] | null;
}
export async function runTurn(
  cmd: string[],
  work: string,
  env: NodeJS.ProcessEnv,
  timeout: number,
  groups: number[],
): Promise<TurnExecution> {
  const proc = spawn(cmd[0]!, cmd.slice(1), { cwd: work, env, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "",
    stderr = "",
    timedOut = false,
    spawnError: Error | undefined;
  if (proc.pid) groups.push(proc.pid);
  proc.stdout.on("data", (b) => (stdout += b));
  proc.stderr.on("data", (b) => (stderr += b));
  let exited = false,
    status: number | null = null;
  proc.on("exit", (code) => {
    exited = true;
    status = code;
  });
  proc.on("error", (error) => {
    spawnError = error;
  });
  let saved:
    | { left: string[] | null; left_why: string | null; tmp: ReturnType<typeof tmpListing>; tmp_paths: string[] | null }
    | undefined;
  let cleanup: Promise<void> | undefined;
  const timer = setTimeout(async () => {
    timedOut = !exited;
    const [left, left_why] = leftReport(owned(groups, env[MARKER]), proc.pid);
    saved = { left, left_why, tmp: tmpListing(env.TMPDIR), tmp_paths: tmpPaths(env.TMPDIR) };
    cleanup = endRun(groups, env[MARKER]);
    await cleanup;
    proc.kill("SIGKILL");
    // A foreign process holding the pipes cannot keep this turn alive forever.
    proc.stdout.destroy();
    proc.stderr.destroy();
  }, timeout * 1000);
  await new Promise<void>((resolve) => {
    proc.once("close", () => resolve());
    proc.once("error", () => resolve());
  });
  clearTimeout(timer);
  await cleanup;
  if (spawnError) throw spawnError;
  if (!saved) {
    const [left, left_why] = leftReport(owned(groups, env[MARKER]));
    saved = { left, left_why, tmp: tmpListing(env.TMPDIR), tmp_paths: tmpPaths(env.TMPDIR) };
  }
  return { stdout, stderr, status: timedOut ? null : status, ...saved };
}
