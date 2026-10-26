import { test, expect } from "bun:test";
import { ratingItem, heldoutRuns } from "./rating-walk";
test("rating walks carry requested evidence without stored verdicts or reasons", () => {
  const run = { case: "essentials/scenario-03-records", model: "gpt-6-luna", run: 1, user_mode: "fixed",
    fixture_sources: { "source.md": "fact" }, judgments: [{ reason: "SECRET" }],
    turns: [{ sent_message: "Earlier", final_answer: "Earlier result" },
      { sent_message: "Current", final_answer: "Current result", answer: "Progress and answer",
        judgments: [{ verdict: false, reason: "SECRET" }], changes: ["changed a.md"], file_diffs: { "a.md": "diff" } }] };
  const item = ratingItem(run, 1, { id: "one", tag: "habit:x", criterion: "Do it", verdict: false, reason: "SECRET" }, "heldout");
  expect(JSON.stringify(item)).not.toContain("SECRET");
  expect(JSON.stringify(item)).not.toContain("verdict");
  expect(item.answer).toBe("Current result");
  expect(item.conversation_so_far[0]!.answer_excerpt).toBe("Earlier result");
  expect(item.file_changes.diffs["a.md"]).toBe("diff");
});
test("blind selection uses fixed Luna runs and covers every held-out scenario once", () => {
  const rows = ["03-records", "07-board", "14-quick"].flatMap(id => [2, 1].map(run => ({
    case: "essentials/scenario-" + id, model: "gpt-6-luna", user_mode: "fixed", run,
  })));
  const chosen = heldoutRuns([...rows, { ...rows[0]!, model: "gpt-6.1-sol" }]);
  expect(chosen).toHaveLength(3);
  expect(chosen.every(r => r.run === 1)).toBe(true);
  expect(() => heldoutRuns(rows.slice(0, 2))).toThrow();
});

test("action lists retain failed commands, repeated calls, helper results and incomplete starts", async () => {
  const { actionList } = await import("./rating-walk");
  const actions = [1, 0].flatMap(exit_code => [
    { tool: "command_execution", phase: "item.started", command: "python test.py", exit_code: null },
    { tool: "command_execution", phase: "item.completed", command: "python test.py", exit_code },
  ]);
  const rows = actionList({ reads: ["test.py"], actions: [...actions,
    { tool: "collab_tool_call", phase: "item.completed", call: "spawn_agent",
      status: "completed", receiver_thread_ids: ["worker"], agents_states: { worker: { status: "running" } } },
    { tool: "collab_tool_call", phase: "item.completed", call: "wait",
      status: "completed", receiver_thread_ids: ["worker"], agents_states: { worker: { status: "completed", message: "Checked" } } },
    { tool: "command_execution", phase: "item.started", command: "unfinished\n" + "x".repeat(600) },
  ] });
  expect(rows).toHaveLength(6);
  expect(rows[0]).toContain("exit 1");
  expect(rows[1]).toContain("exit 0");
  expect(rows[3]).toContain("Checked");
  expect(rows[4]).toContain("unknown");
  expect(rows[4]).toContain("[cut]");
  expect(rows.every(row => !row.includes("\n"))).toBe(true);
  expect(rows[5]).toBe("Read: test.py");
});

test("small walk selection excludes automatic checks and rotates habits without reading verdicts", async () => {
  const { walkChecks } = await import("./rating-walk");
  const checks = [
    { id: "automatic", assert: { exists: "x" } },
    ...["a", "b", "c"].map(id => ({ id, tag: "skill:lookup", criterion: id })),
    ...["point", "glance"].map(id => ({ id, tag: "habit:" + id, criterion: id })),
  ];
  for (let turn = 0; turn < 4; turn++) {
    const picked = walkChecks(checks, turn);
    expect(picked).toHaveLength(3);
    expect(picked.every(c => c.criterion)).toBe(true);
    expect(picked[2]!.id).toBe(turn % 2 ? "glance" : "point");
  }
});
