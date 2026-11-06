import { test, expect } from "bun:test";
import { filledFullReport } from "./gate-fill";

const row = (ref: string, matches = true) => ({id: ref, ref, check: "unit:1:rule", expected: true,
  judgment: {verdict: matches}, matches});
const name = (ref: string) => ({check: "unit:1:rule", ref});
const print = (ref: string, fingerprint = "f-" + ref) => ({...name(ref), fingerprint});
const full = {mode: "full", model: "gpt-6.1-sol", fixture_hash: "h", known_cost: 2, unknown_cost_calls: 0,
  candidates: ["a", "b", "c"].map(r => print(r)),
  results: [row("a"), {batch: 2, ids: ["b"], candidates: [name("b")], error: "judge reply is not valid JSON"},
    row("c", false)]};
const preview = {mode: "preview", scoring_authorized: false, model: "gpt-6.1-sol", fixture_hash: "h", known_cost: 0.1,
  unknown_cost_calls: 0, candidates: [print("b")], results: [row("b")]};

test("a preview of a full report's errored candidates completes that report", () => {
  const filled = filledFullReport(full, preview, "preview.json");
  expect(filled.mode).toBe("full");
  expect(filled.results.map((r: any) => r.ref)).toEqual(["a", "c", "b"]);
  expect(filled.results.some((r: any) => r.error)).toBe(false);
  expect(filled.known_cost).toBeCloseTo(2.1);
  expect(filled.filled).toEqual({from: "preview.json", candidates: ["unit:1:rule@b"],
    errors: [{batch: 2, error: "judge reply is not valid JSON"}]});
});

test("a fill refuses another contract, a changed candidate, a missing judgment or nothing to fill", () => {
  expect(() => filledFullReport(full, {...preview, fixture_hash: "other"}, "p")).toThrow("same contract");
  expect(() => filledFullReport({...full, mode: "combined"}, preview, "p")).toThrow("full report");
  expect(() => filledFullReport(full, {...preview, candidates: [print("b", "changed")]}, "p")).toThrow("changed");
  expect(() => filledFullReport(full, {...preview, results: []}, "p")).toThrow("every errored candidate");
  expect(() => filledFullReport(full, {...preview, results: [row("b"), row("b")]}, "p")).toThrow("exactly once");
  expect(() => filledFullReport({...full, results: [row("a")]}, preview, "p")).toThrow("no errored batches");
});
