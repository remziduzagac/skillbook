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
