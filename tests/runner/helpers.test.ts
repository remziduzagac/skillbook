import { expect, test } from "bun:test";
import { helperEvidence } from "./helpers";
import { action_evidence } from "./trace";
const call = (id: string, tool: string, extra = {}) => ({type: "item.completed", item: {
  id, type: "collab_tool_call", tool, receiver_thread_ids: ["helper"], status: "completed", ...extra}});

test("Codex helper start, brief, result, freshness and end are separate observed claims", () => {
  const spawn = call("spawn", "spawn_agent", {prompt: "Check source totals", fork_context: false});
  const wait = call("wait", "wait", {agents_states: {helper: {status: "completed", message: "Totals match"}}});
  const end = call("end", "close_agent");
  const h = helperEvidence("codex", [spawn, wait, end]);
  expect(h.controls_available).toBe(true);
  expect(h.helpers).toEqual([{id: "helper", start: {action: "spawn", order: 0, status: "completed"},
    brief: "Check source totals", result: "Totals match", end: {action: "end", order: 2, status: "completed"},
    fresh: true, actions: null}]);
  expect(action_evidence("codex", [spawn])[0]).toMatchObject({prompt: "Check source totals", fork_context: false});
});
test("a completed wait establishes its returned result without inventing startup or cleanup", () => {
  const h = helperEvidence("codex", [call("wait", "wait", {agents_states: {helper: {status: "completed", message: "Checked"}}})]).helpers[0]!;
  expect(h.result).toBe("Checked");
  expect(h.start).toBeNull(); expect(h.end).toBeNull(); expect(h.fresh).toBeNull(); expect(h.actions).toBeNull();
  expect(helperEvidence("codex", []).controls_available).toBeNull();
});
test("failed spawn and failed close cannot establish helper startup or disposal", () => {
  const h = helperEvidence("codex", [call("spawn", "spawn_agent", {status: "failed", prompt: "Check"}),
    call("end", "close_agent", {status: "failed"})]).helpers[0]!;
  expect(h.brief).toBe("Check"); expect(h.start).toBeNull(); expect(h.end).toBeNull();
});
test("split Codex call events preserve the brief from the started event", () => {
  const start = call("spawn", "spawn_agent", {prompt: "Independent check", fork_context: true});
  start.type = "item.started";
  const h = helperEvidence("codex", [start, call("spawn", "spawn_agent")]).helpers[0]!;
  expect(h.brief).toBe("Independent check"); expect(h.fresh).toBe(false);
});
test("Claude helper brief and returned report remain available without inventing freshness or termination", () => {
  const rows = [{type: "assistant", message: {content: [{type: "tool_use", id: "task", name: "Agent", input: {prompt: "Read sources"}}]}},
    {type: "assistant", parent_tool_use_id: "task", message: {content: [{type: "tool_use", id: "r", name: "Read", input: {file_path: "source.md"}}]}},
    {type: "user", message: {content: [{type: "tool_result", tool_use_id: "task", content: "Read all sources"}]}}];
  const h = helperEvidence("claude", rows).helpers[0]!;
  expect(h.start).not.toBeNull(); expect(h.brief).toBe("Read sources"); expect(h.result).toBe("Read all sources");
  expect(h.actions![0]!.id).toBe("r"); expect(h.fresh).toBeNull(); expect(h.end).toBeNull();
  expect(action_evidence("claude", rows)[0]!.input).toEqual({prompt: "Read sources"});
});

test("an interrupted helper start retains the known brief without claiming success", () => {
  const start = call("spawn", "spawn_agent", {prompt: "Check it", receiver_thread_ids: []});
  start.type = "item.started";
  const h = helperEvidence("codex", [start]).helpers[0]!;
  expect(h.brief).toBe("Check it"); expect(h.start).toBeNull(); expect(h.result).toBeNull(); expect(h.end).toBeNull();
});

test("a wait naming a helper cannot make the legacy startup counter claim a spawn", async () => {
  const {agents_started} = await import("./trace");
  expect(agents_started("codex", [[call("wait", "wait")]])).toBe(0);
  expect(agents_started("codex", [[call("spawn", "spawn_agent")]])).toBe(1);
  expect(agents_started("codex", [[call("spawn", "spawn_agent", {status: "failed"})]])).toBe(0);
});
