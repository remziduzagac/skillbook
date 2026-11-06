import { test, expect } from "bun:test";
import { structuredCall } from "./scenario";
import { normalize } from "./cases";
import { check } from "./checks";
import { recheckScenario } from "./recheck";

test("assertions reject wrong traces rather than mere file mentions", () => {
  const checks = { removed: ["old.csv"] };
  expect(check(checks, { changes: ["removed old.csv"] })["removed old.csv"]).toBe(true);
  expect(check(checks, { changes: [], answer: "removed old.csv" })["removed old.csv"]).toBe(false);
});
test("structured model transport rejects tools, bad JSON and unsuccessful calls", async () => {
  const accounts: (number | null)[] = [];
  const result = (text: string, status = 0, action = false) => ({
    stdout: [
      ...(action ? [{ type: "item.completed", item: { type: "command_execution", command: "ls", exit_code: 0 } }] : []),
      { type: "item.completed", item: { type: "agent_message", text } },
      { type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } },
    ].map(x => JSON.stringify(x)).join("\n"), stderr: "failure", status,
    left: [], left_why: null, tmp: null, tmp_paths: null,
  });
  const caller = (text: string, status = 0, action = false) => structuredCall("/tmp", {}, 1, [],
    amount => accounts.push(amount), async command => {
      expect(command).toContain("read-only");
      expect(command).toContain("gpt-6.1-sol");
      return result(text, status, action);
    });
  expect(await caller('{"ok":true}')('test', {})).toEqual({ ok: true });
  const broken = await caller("not JSON")("test", {}).catch(error => error);
  expect(broken.message).toStartWith("judge reply is not valid JSON");
  expect(broken.raw).toBe("not JSON");
  await expect(caller('{"ok":true}', 1)("test", {})).rejects.toThrow();
  await expect(caller('{"ok":true}', 0, true)("test", {})).rejects.toThrow();
  expect(accounts).toEqual([0.00004, 0.00004, 0.00004, 0.00004]);
});
test("a recheck applies the current checks to saved turns and rejects changed scripts", () => {
  const c = normalize({ fixture: "tiny-weather", turns: [{ prompt: "Pick one", checks: { removed: ["scratch.txt"] } }] },
    "essentials/unit-recheck");
  const original = { turns: [{ scripted_message: "Pick one", changes: [] as string[], trace_complete: true }] };
  expect(recheckScenario(original, c).checks["turn 1: removed scratch.txt"]).toBe(false);
  original.turns[0]!.changes.push("removed scratch.txt");
  expect(recheckScenario(original, c).checks["turn 1: removed scratch.txt"]).toBe(true);
  original.turns[0]!.scripted_message = "changed";
  expect(() => recheckScenario(original, c)).toThrow();
});
test("the allowed Codex startup notice is checked per turn in conversation-wide assertions", async () => {
  const { check } = await import("./checks");
  const turns = [{ answer: "I'll load the essentials skill.\nFirst answer." },
    { answer: "I'll load the essentials skill.\nSecond answer." }];
  const observation = { agent: "codex", answer: turns.map(t => t.answer).join("\n"), turns };
  expect(check({ names_no_skill: true }, observation)["answer names no skill or skill file"]).toBe(true);
  turns[1]!.answer = "The act-guardrails skill forbids this.";
  expect(check({ names_no_skill: true }, observation)["answer names no skill or skill file"]).toBe(false);
});
test("large model inputs use stdin rather than exceeding operating-system argument limits", async () => {
  const { mkdtempSync, rmSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { runTurn, endRun } = await import("./process");
  const root = mkdtempSync(join(tmpdir(), "runner-large-input-")), groups: number[] = [];
  try {
    const result = await runTurn(["wc", "-c"],
      root, { ...process.env, TMPDIR: root }, 10, groups, "x".repeat(250000));
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("250000");
  } finally { await endRun(groups); rmSync(root, { recursive: true, force: true }); }
});
test("one structured-call timeout cannot terminate another judge worker", async () => {
  const { mkdtempSync, rmSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { runTurn, endRun } = await import("./process");
  const root = mkdtempSync(join(tmpdir(), "judge-isolation-")), groups: number[] = [];
  const env = { ...process.env, TMPDIR: root, SKILLBOOK_TEST_RUN: root };
  const driver = (delay: string): typeof runTurn => async (_cmd, work, callEnv, timeout, callGroups) => {
    const ran = await runTurn(["sh", "-c", `sleep ${delay}`], work, callEnv, timeout, callGroups);
    return { ...ran, stdout: JSON.stringify({ type: "item.completed", item: { type: "agent_message", text: '{"ok":true}' } }) };
  };
  try {
    const slow = structuredCall(root, env, 0.05, groups, () => {}, driver("2"));
    const other = structuredCall(root, env, 2, groups, () => {}, driver("0.2"));
    const outcomes = await Promise.allSettled([slow("test", {}), other("test", {})]);
    expect(outcomes[0]!.status).toBe("rejected");
    expect(outcomes[1]).toMatchObject({ status: "fulfilled", value: { ok: true } });
    expect(groups).toHaveLength(2);
  } finally { await endRun(groups); rmSync(root, { recursive: true, force: true }); }
});
