import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { spawnSync, spawn } from "node:child_process";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { FIXTURES } from "./paths";
import { normalize, validateCase } from "./cases";
import { parseArgs } from "./cli";
import { runOne } from "./run";
import { runTurn } from "./process";
import { judgeEvidence } from "./scenario";
import { recheckScenario } from "./recheck";
import { ratingItem } from "./rating-walk";
import { summarize } from "./reports";
import { ALWAYS_NEEDED } from "./needs";
import type { Case, Event } from "./types";

const encode = (events: Event[], status: number | null = 0) => ({
  stdout: events.map(e => JSON.stringify(e)).join("\n"), stderr: "synthetic failure", status,
  left: [], left_why: null, tmp: null, tmp_paths: [],
});
const answer = (text: string) => ({ type: "item.completed", item: { type: "agent_message", text } });
const usage = { type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } };
async function fixture(fn: (c: Case, out: string) => Promise<void>) {
  const root = mkdtempSync(join(FIXTURES, "unit-chapters-")), out = mkdtempSync(join(tmpdir(), "chapter-results-"));
  try {
    for (const dir of ["base", "second", "third"]) mkdirSync(join(root, dir));
    writeFileSync(join(root, "base", "AGENTS.md"), "Local instructions\nKeep every earlier line.\n");
    writeFileSync(join(root, "base", "keep.md"), "checkpoint one\n");
    writeFileSync(join(root, "base", "remove.md"), "remove at chapter two\n");
    writeFileSync(join(root, "base", "private.csv"), "private\n");
    writeFileSync(join(root, "second", "keep.md"), "checkpoint two is deliberately longer than chapter one\n");
    writeFileSync(join(root, "third", "overlay.md"), "second overlay\n");
    const base = relative(FIXTURES, join(root, "base")), overlay = relative(FIXTURES, join(root, "second"));
    const c = normalize({ fixture: base, gitignore: ["*.csv"], chapters: [
      { number: 1, start_turn: 1, checkpoint: { fixture: base } },
      { number: 2, start_turn: 3, checkpoint: { fixture: base, overlays: [overlay, relative(FIXTURES, join(root, "third"))],
        remove: ["remove.md", "private.csv"] } },
    ], turns: [1, 2, 3, 4].map(n => ({ prompt: `Turn ${n}`,
      tagged_checks: [{ id: "kept", tag: "state", assert: { unchanged: ["AGENTS.md"] } }],
      rubric: [{id: "result", tag: "task", criterion: "Gives the result"}],
    })) }, "essentials/chapter-unit");
    await fn(c, out);
  } finally { rmSync(root, { recursive: true, force: true }); rmSync(out, { recursive: true, force: true }); }
}
const options = () => parseArgs(["--agents", "codex", "--model", "codex=gpt-6.1-sol", "--yes"]);

for (const no_skill of [false, true]) test(`two chapters restore exact checkpoints and fresh sessions (${no_skill ? "no skill" : "installed"})`, () =>
  fixture(async (c, out) => {
    const calls: string[][] = [];
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, {...options(), no_skill, keep: true}, out, 1,
      async (cmd, work, env) => {
        calls.push(cmd); const n = calls.length;
        expect(spawnSync("git", ["branch", "--show-current"], {cwd: work}).stdout.toString().trim()).toBe("main");
        if (n === 1 || n === 3) {
          expect(readFileSync(join(work, ".gitignore"), "utf8")).toBe("*.csv\n");
          expect(spawnSync("git", ["status", "--porcelain"], {cwd: work}).stdout.toString()).toBe("");
          expect(spawnSync("git", ["ls-files", "*.csv"], {cwd: work}).stdout.toString()).toBe("");
        }
        if (n === 1) {
          writeFileSync(join(work, "keep.md"), "agent edit\n");
          writeFileSync(join(work, "rogue.md"), "chapter one only\n");
          rmSync(join(work, "remove.md"));
          writeFileSync(join(env.TMPDIR!, "leftover"), "chapter one\n");
        }
        if (n === 3) {
          expect(cmd).not.toContain("resume");
          expect(readFileSync(join(work, "keep.md"), "utf8")).toContain("checkpoint two");
          expect(readFileSync(join(work, "overlay.md"), "utf8")).toBe("second overlay\n");
          for (const path of ["rogue.md", "remove.md", "private.csv"]) expect(existsSync(join(work, path))).toBe(false);
          expect(existsSync(join(env.TMPDIR!, "leftover"))).toBe(false);
        }
        return encode([{type: "thread.started", thread_id: n < 3 ? "chapter-one" : "chapter-two"},
          ...(n === 1 ? [{type: "item.completed", item: {id: "read", type: "command_execution",
            command: "cat /sandbox/skills/essentials/references/respond.md",
            aggregated_output: readFileSync("skills/essentials/references/respond.md", "utf8"), exit_code: 0}}] : []),
          answer(`Result ${n}`), usage]);
      });
    expect(result.error).toBeNull();
    expect(result.turns.map((t: Event) => [t.turn, t.chapter, t.fresh_session])).toEqual(
      [[1, 1, true], [2, 1, false], [3, 2, true], [4, 2, false]]);
    expect(calls[1]).toContain("resume"); expect(calls[3]).toContain("resume");
    expect(result.turns[1].access.prior_whole).toContain("respond");
    expect(result.turns[2].access.prior_whole).toEqual([]);
    expect(result.turns[2].access.reused_whole).toEqual([]);
    expect(result.turns[2].changes).toEqual([]);
    expect(result.turns[2].baseline_files["keep.md"]).toContain("checkpoint two");
    expect(result.changes).not.toContain("removed private.csv");
    for (const skill of ALWAYS_NEEDED) expect(result.turns[2].resolved_needs.some((n: Event) => n.skill === skill && n.needed)).toBe(true);
    expect(readdirSync(out).filter(p => p.endsWith(".jsonl"))).toHaveLength(4);
    const replay = recheckScenario(result, c);
    expect(replay.turns.map((t: Event) => t.tagged_checks)).toEqual(result.turns.map((t: Event) => t.tagged_checks));
  }));

test("selecting chapter two preserves global turn numbers in records, dependencies, recordings and replay", () =>
  fixture(async (c, out) => {
    c.turns[3]!.tagged_checks![0]!.depends_on = {turn: 3, check: "kept"};
    let count = 0;
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, {...options(), chapter: 2, keep: true}, out, 1,
      async cmd => { expect(cmd.at(-1)).toBe(`Turn ${++count + 2}`); return encode([answer("result"), usage]); });
    expect(result.error).toBeNull(); expect(count).toBe(2);
    expect(result.turns.map((t: Event) => t.turn)).toEqual([3, 4]);
    expect(result.selected_turns).toEqual([3, 4]); expect(result.expected_turns).toBe(2);
    expect(result.expected_fit_transitions).toBe(1);
    expect(summarize([result], 0)).toContain("turn 3 (chapter 2)");
    expect(ratingItem(result, 0, {id: "kept", tag: "state"}, "tuning").turn).toBe(3);
    expect(result.unreached_turn_checks).toEqual([]);
    expect(result.turns[1].tagged_checks[0].verdict).toBe(true);
    expect(readdirSync(out).every(p => /turn[34]\.jsonl$/.test(p))).toBe(true);
    expect(recheckScenario(result, c).turns[1].tagged_checks[0].verdict).toBe(true);
  }));

for (const failure of [null, 1, "throw"] as const) test(`process failure ${failure} skips only its chapter and continues at the next checkpoint`, () =>
  fixture(async (c, out) => {
    const prompts: string[] = [];
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, options(), out, 1, async (cmd, work) => {
      prompts.push(cmd.at(-1)!);
      if (prompts.length === 1) {
        writeFileSync(join(work, "rogue.md"), "partial change");
        if (failure === "throw") throw Error("transport failed");
        return encode([answer("partial")], failure);
      }
      expect(existsSync(join(work, "rogue.md"))).toBe(false);
      return encode([answer("result"), usage]);
    });
    expect(prompts).toEqual(["Turn 1", "Turn 3", "Turn 4"]);
    expect(result.error).not.toBeNull(); expect(result.cost_unknown).toBe(true);
    expect(result.chapter_errors).toHaveLength(1);
    expect(result.turns[0].trace_complete).toBe(false);
    expect(result.unreached_turns).toEqual([{ turn: 2, chapter: 1, reason: "chapter interrupted" }]);
    expect(result.unreached_turn_checks.every((t: Event) => t.turn === 2)).toBe(true);
    expect(recheckScenario(result, c).unreached_turn_checks).toEqual(result.unreached_turn_checks.map(({chapter: _c, ...r}: Event) => r));
  }));

test("chapter boundary ends a process left by the agent before restoring files", () => fixture(async (c, out) => {
  let processDone: Promise<void> | undefined, pid: number | undefined, calls = 0;
  const driver: typeof runTurn = async (_cmd, _work, env, _timeout, groups) => {
    calls++;
    if (calls === 1) {
      const child = spawn("sleep", ["30"], { detached: true, env, stdio: "ignore" });
      pid = child.pid!; groups.push(pid);
      processDone = new Promise(resolve => child.once("exit", () => resolve()));
    }
    if (calls === 3) {
      await processDone;
      expect(() => process.kill(pid!, 0)).toThrow();
    }
    return encode([answer("result"), usage]);
  };
  const result = await runOne(c, "codex", "gpt-6.1-sol", 1, options(), out, 1, driver);
  expect(result.error).toBeNull(); expect(calls).toBe(4);
}));

test("judges and simulated users receive current chapter sources, conversation and script only", () =>
  fixture(async (c, out) => {
    c.user = {mode: "simulated", description: "chair", facts: {budget: "$1000"}}; c.goal = "prepare";
    let agentTurns = 0, userCalls = 0, judgeCalls = 0;
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, {...options(), judge: true}, out, 1,
      async (_cmd, work, _env, _timeout, _groups, input) => {
        if (!input) {
          agentTurns++;
          writeFileSync(join(work, "made.md"), `made in turn ${agentTurns}`);
          return encode([answer(`Result ${agentTurns}`), usage]);
        }
        const data = JSON.parse(input.split("\nDATA:\n")[1]!);
        let response: Event;
        if (input.includes("Play the user")) {
          userCalls++;
          expect(data.script.map((t: Event) => t.prompt)).toEqual(userCalls < 3 ? ["Turn 1", "Turn 2"] : ["Turn 3", "Turn 4"]);
          expect(data.history).toHaveLength(userCalls % 2 ? 0 : 1);
          expect(data.user.facts.budget).toBe("$1000");
          if (userCalls >= 3) expect(data.sources["keep.md"]).toContain("checkpoint two");
          response = {message: `Turn ${userCalls}`, steered: false};
        } else if (input.includes("Mark claims")) response = {claims: [], marks: []};
        else {
          judgeCalls++;
          expect(data.evidence.turns.every((t: Event) => t.chapter === (agentTurns < 3 ? 1 : 2))).toBe(true);
          expect(data.evidence.turns).toHaveLength(agentTurns % 2 ? 1 : 2);
          expect(data.evidence.turns.at(-1).files["made.md"]).toBe(`made in turn ${agentTurns}`);
          response = {results: data.criteria.map((r: Event) => ({id: r.id, verdict: null, reason: "synthetic unknown"}))};
        }
        return encode([answer(JSON.stringify(response)), usage]);
      });
    expect(result.error).toBeNull(); expect(userCalls).toBe(4); expect(judgeCalls).toBe(4);
    const evidence = judgeEvidence(result.turns, result.chapter_checkpoints[2].sources);
    expect(evidence.current_turn).toBe(4); expect(evidence.turns).toHaveLength(2);
    const item = ratingItem(result, 2, {id: "result", tag: "task", criterion: "result"}, "tuning");
    expect(item.conversation_so_far).toEqual([]);
    expect(item.source_files["keep.md"]).toContain("checkpoint two");
  }));

test("chapter validation rejects invalid starts, paths, removals and cross-checkpoint dependencies", () =>
  fixture(async (c) => {
    const {id: _id, set: _set, ...raw} = c;
    expect(() => validateCase(raw)).not.toThrow();
    for (const chapters of [[], [{...c.chapters![0]!, start_turn: 2}],
      [c.chapters![0]!, {...c.chapters![1]!, number: 3}],
      [{...c.chapters![0]!, checkpoint: {fixture: "../../outside"}}],
      [{...c.chapters![0]!, checkpoint: {fixture: c.fixture, remove: ["../outside"]}}]])
      expect(() => validateCase({...raw, chapters})).toThrow();
    const copy = structuredClone(raw);
    copy.turns[2]!.tagged_checks![0]!.depends_on = {turn: 1, check: "kept"};
    expect(() => validateCase(copy)).toThrow("earlier turn");
    for (const chapter of ["0", "-1", "1.5", "NaN"]) expect(() => parseArgs(["--chapter", chapter])).toThrow();
    await expect(runOne(c, "codex", "gpt-6.1-sol", 1, {...options(), chapter: 3}, "/tmp", 1)).rejects.toThrow("no chapter");
  }));

test("before comparisons use the current chapter checkpoint and retain made files for judges", () =>
  fixture(async (c, out) => {
    c.turns[2]!.checks = {shorter: ["keep.md"]};
    c.turns[3]!.tagged_checks = [{id: "preservation", tag: "automatic", assert: {
      only_replacement: {"AGENTS.md": {from: "Local instructions", to: "Updated instructions"}},
      keeps_lines: ["keep.md"], words_under: {"made.md": 3},
    }}];
    let n = 0;
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, {...options(), chapter: 2}, out, 1,
      async (_cmd, work) => {
        if (++n === 1) writeFileSync(join(work, "keep.md"), "checkpoint one and more\n");
        else {
          writeFileSync(join(work, "AGENTS.md"), "Updated instructions\nKeep every earlier line.\n");
          writeFileSync(join(work, "keep.md"), "checkpoint two is deliberately longer than chapter one\nAdded line\n");
          writeFileSync(join(work, "made.md"), "two words");
        }
        return encode([answer("result"), usage]);
      });
    expect(result.error).toBeNull();
    expect(result.checks["turn 3: keep.md shorter"]).toBe(true);
    expect(result.turns[1].tagged_checks[0].verdict).toBe(true);
    expect(result.turns[1].files["made.md"]).toBe("two words");
    expect(recheckScenario(result, c).checks["turn 3: keep.md shorter"]).toBe(true);
  }));

test("Claude process failure also resumes at the next checkpoint with total unknown cost retained", () =>
  fixture(async (c, out) => {
    const prompts: string[] = [];
    const result = await runOne(c, "claude", "gpt-6.1-sol", 1, options(), out, 1, async cmd => {
      prompts.push(cmd[2]!);
      if (prompts.length === 1) return encode([], null);
      return encode([{type: "assistant", session_id: "chapter-two", message: {content: [{type: "text", text: "result"}]}},
        {type: "result", total_cost_usd: 0.001}]);
    });
    expect(prompts).toEqual(["Turn 1", "Turn 3", "Turn 4"]);
    expect(result.cost_unknown).toBe(true);
    expect(result.turns.map((t: Event) => t.turn)).toEqual([1, 3, 4]);
  }));

test("an auxiliary call of unknown cost does not stop a Claude run, and stays reported", () =>
  fixture(async (c, out) => {
    const prompts: string[] = [];
    const withUser = { ...c, user: { mode: "fixed" as const, description: "A resident", facts: {note: "One fact"} }, goal: "Finish" };
    const result = await runOne(withUser, "claude", "sonnet", 1, options(), out, 1, async cmd => {
      if (cmd[0] !== "claude") return encode([answer('{"off_script":false,"reason":"The next message fits."}')]);
      prompts.push(cmd[2]!);
      return encode([{type: "assistant", session_id: "s", message: {content: [{type: "text", text: "result"}]}},
        {type: "result", total_cost_usd: 0.001}]);
    });
    expect(prompts).toEqual(["Turn 1", "Turn 2", "Turn 3", "Turn 4"]);
    expect(result.error ?? "").not.toContain("budget");
    expect(result.cost_unknown).toBe(true);
  }));
