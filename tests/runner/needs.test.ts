import { expect, test } from "bun:test";
import { resolvedNeeds, ALWAYS_NEEDED } from "./needs";
import { measurementPlan } from "./measure-turn";
import { accessTurn } from "./access";
import { measurementReport } from "./measurement-report";
import type { Turn, Event } from "./types";

test("need labels keep direct and called needs and inherit deadlines along every parent", () => {
  const turn: Turn = {prompt: "Inspect", skill_needs: [{skill: "understand-clarify-deep", deadline: 2}],
    also_called: [{skill: "act-verify", deadline: "answer"}]};
  const needs = resolvedNeeds(turn, {}, true);
  expect(needs.filter(n => n.origin === "needs").map(n => [n.skill, n.deadline, n.needed])).toEqual([
    ["understand", 2, true], ["understand-clarify", 2, true], ["understand-clarify-deep", 2, true]]);
  expect(needs.filter(n => n.origin === "also called").map(n => n.skill)).toEqual(["act", "act-verify"]);
  for (const skill of ALWAYS_NEEDED) expect(needs.some(n => n.skill === skill && n.origin === "always needed")).toBe(true);
});
test("conditional needs count only taken paths, retaining unsupported applicability as unknown", () => {
  const turn: Turn = {prompt: "Inspect", if_taken: [{skill: "understand-discuss", deadline: "first change",
    path: "ask about a new open choice"}]};
  for (const taken of [true, false]) {
    const needs = resolvedNeeds(turn, {answer: "Question about the budget?", path_marks: [
      {path: "ask about a new open choice", taken, quote: "Question about the budget?"}]});
    expect(needs.every(n => n.needed === taken)).toBe(true);
  }
  for (const evidence of [{}, {path_marks: [{path: "ask about a new open choice", taken: true, quote: "invented"}]},
    {actions: [], path_marks: [{path: "ask about a new open choice", taken: true, action: "invented"}]}])
    expect(resolvedNeeds(turn, evidence).every(n => n.needed === null)).toBe(true);
  const action = {actions: [{id: "open"}], path_marks: [{path: "ask about a new open choice", taken: true, action: "open"}]};
  expect(resolvedNeeds(turn, action).every(n => n.needed)).toBe(true);
});
test("conditional paths can be established by an automatic assertion without a judge", () => {
  const turn: Turn = {prompt: "Inspect", if_taken: [{skill: "act-cleanup", deadline: "answer", path: "kept copy",
    taken_when: {changed: ["copy.md"]}}]};
  expect(resolvedNeeds(turn, {changes: ["changed copy.md"]}).every(n => n.needed === true)).toBe(true);
  expect(resolvedNeeds(turn, {changes: []}).every(n => n.needed === false)).toBe(true);
});
test("promised results are checked for needed guides without author rule marks", () => {
  const evidence = {resolved_needs: resolvedNeeds({prompt: "Inspect", also_called: [{skill: "act-verify", deadline: "answer"}]}, {})};
  const plan = measurementPlan(evidence, [], accessTurn("codex", [], 1, {}));
  expect(plan.result_parts.some(p => p.skill === "act-verify")).toBe(true);
  expect(plan.inventory.some(o => o.definition.required_skill === "act-verify")).toBe(false);
});
test("loading counts treat unchosen paths as unneeded and unknown paths as unknown", () => {
  for (const needed of [true, false, null]) {
    const run: Event = {case: "unit", agent: "codex", model: "gpt-6.1-sol", condition: "installed", turns: [{
      access: accessTurn("codex", [], 1, {}), resolved_needs: [{skill: "understand-discuss", needed, deadline: "answer", origin: "if taken"}],
    }], skill_sources: {"understand-discuss": "source"}};
    const counts = measurementReport([run]).loading_counts["codex/gpt-6.1-sol/installed/understand-discuss"]!;
    expect(counts[needed === true ? "needed_not_loaded" : needed === false ? "not_needed_not_loaded" : "unknown"]).toBe(1);
  }
});
