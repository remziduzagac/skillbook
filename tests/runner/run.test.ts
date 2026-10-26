import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runOne, runPlan, planRuns } from "./run";
import { parseArgs } from "./cli";
import { normalize } from "./cases";
import type { Event } from "./types";
const message = (text: string) => ({ type: "item.completed", item: { type: "agent_message", text } });
const args = () => parseArgs(["--agents", "codex", "--yes"]);
const sample = () =>
  normalize(
    {
      fixture: "tiny-weather",
      turns: [
        { prompt: "first", checks: { answer_contains: ["first"], no_changes: true } },
        { prompt: "second", checks: { answer_contains: ["second"], unchanged: ["NOTES.md"] } },
      ],
      checks: { answer_contains: ["first", "second"] },
      review: ["Useful answer"],
    },
    "essentials/port-unit",
  );

test("turn observations, resume, kept logs and copied homes have separate lifetimes", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-output-"));
  const calls: Event[] = [];
  try {
    const options = { ...args(), keep: true };
    const driver = async (cmd: string[], work: string, env: NodeJS.ProcessEnv) => {
      calls.push({ cmd, work, home: env.HOME, tmp: env.TMPDIR });
      const text = calls.length === 1 ? "first" : "second";
      return {
        stdout:
          JSON.stringify({ type: "thread.started", thread_id: "unit-session" }) +
          "\n" +
          JSON.stringify(message(text)) +
          "\n" +
          JSON.stringify({ type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } }),
        stderr: "",
        status: 0,
        left: [],
        left_why: null,
        tmp: { entries: [], cut: false },
        tmp_paths: [],
      };
    };
    const result = await runOne(sample(), "codex", "gpt-6-luna", 1, options, out, 1, driver);
    expect(result.error).toBeNull();
    expect(Object.values(result.checks).every((v) => v === true)).toBe(true);
    expect(result.turns.map((t: Event) => t.answer)).toEqual(["first", "second"]);
    expect(calls[1]!.cmd).toContain("resume");
    expect(calls[1]!.cmd).toContain("unit-session");
    expect(readdirSync(out).filter((p) => p.endsWith(".jsonl"))).toHaveLength(2);
    expect(existsSync(calls[0]!.home)).toBe(false);
    expect(existsSync(calls[0]!.tmp)).toBe(false);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("timeout and runner exceptions retain evidence, unknown spending and cleanup", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-failure-"));
  let home = "";
  try {
    const driver = async (_cmd: string[], _work: string, env: NodeJS.ProcessEnv) => {
      home = env.HOME!;
      return {
        stdout: JSON.stringify(message("partial")),
        stderr: "",
        status: null,
        left: [],
        left_why: null,
        tmp: null,
        tmp_paths: null,
      };
    };
    const result = await runOne(sample(), "codex", "gpt-6-luna", 1, args(), out, 1, driver);
    expect(result.error).toContain("took longer");
    expect(result.cost_unknown).toBe(true);
    expect(result.turns).toHaveLength(1);
    expect(result.turns[0].trace_complete).toBe(false);
    expect(result.turns[0].answer).toBe("partial");
    expect(existsSync(home)).toBe(false);
    const error = await runOne(sample(), "codex", "gpt-6-luna", 1, args(), out, 1, async () => {
      throw Error("synthetic");
    });
    expect(error.error).toContain("synthetic");
    expect(error.cost_unknown).toBe(true);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("scheduler stops at known budget and tracks unknown cost separately", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-budget-"));
  const options = { ...args(), budget: 0.5, jobs: 1, runs: 4 };
  let calls = 0;
  try {
    const fake = async () => ({
      case: "x",
      agent: "codex",
      model: "unpriced",
      run: ++calls,
      error: null,
      cost: calls === 1 ? 0 : 0.5,
      cost_unknown: calls === 1,
      checks: {},
      turns: [],
      review: [],
    });
    const results = await runPlan(planRuns([sample()], options), options, out, fake);
    expect(results).toHaveLength(2);
    expect(readFileSync(join(out, "summary.md"), "utf8")).toContain("unquantified spending in 1 runs");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("fresh-session turns retain work files but never resume the prior conversation", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-fresh-"));
  const commands: string[][] = [];
  const c = sample();
  c.turns[1]!.fresh_session = true;
  try {
    const result = await runOne(c, "codex", "gpt-6-luna", 1, args(), out, 1, async (command, work) => {
      commands.push(command);
      expect(existsSync(join(work, "NOTES.md"))).toBe(true);
      return { stdout: [JSON.stringify({ type: "thread.started", thread_id: "old-session" }),
        JSON.stringify(message(commands.length === 1 ? "first" : "second")),
        JSON.stringify({ type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } })].join("\n"),
        status: 0, stderr: "", left: [], left_why: null, tmp: null, tmp_paths: null };
    });
    expect(result.error).toBeNull();
    expect(commands[1]).not.toContain("resume");
    expect(commands[1]).not.toContain("old-session");
    expect(result.turns[1].fresh_session).toBe(true);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
