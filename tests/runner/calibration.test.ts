import { test, expect } from "bun:test";
import { calibrationItems, calibrationReport, calibrateItems } from "./calibration";
import type { CalibrationSample } from "./calibration";

const sample = (id: string, human: boolean | null): CalibrationSample => ({
  id, human, human_reason: "HIDDEN_HUMAN_REASON", prompt: "Write the note.", answer: "Wrote it.",
  criterion: { id, tag: "skill:carryover", criterion: "Write the requested note." },
  evidence: { turns: [{ sent_message: "Write the note.", final_answer: "Wrote it." }] },
});
test("legacy calibration gains per-item context and clears earlier model labels", () => {
  const items = calibrationItems({ prompt: "Design it.", criterion: "Give reasons.", samples: [{
    id: "A", answer: "Use paper because no phones.", judgment: { tag: "old", verdict: false, reason: "old" },
  }] });
  expect(items[0]!.human).toBeNull();
  expect(items[0]!.criterion?.criterion).toBe("Give reasons.");
  expect(items[0]!.evidence).toEqual({ prompt: "Design it." });
  expect(items[0]!.judgment).toBeUndefined();
});
test("agreement uses all rated items and splits human passes and fails, excluding explicit skips", () => {
  const rows = [sample("a", true), sample("b", false), sample("c", false),
    { ...sample("skip", null), skip: "request did not fit" }];
  for (const row of rows.slice(0, 3)) row.judgment = { tag: "x", verdict: false, reason: "evidence" };
  const report = calibrationReport(rows);
  expect(report).toMatchObject({ total: 4, rated: 3, skipped: 1, agreed: 2, compared: 3, complete: true,
    by_human: { pass: { rated: 1, agreed: 0 }, fail: { rated: 2, agreed: 2 } } });
  expect(report.disagreements[0]!.human_reason).toBe("HIDDEN_HUMAN_REASON");
});
test("calibration batches common evidence, keeps labels blind and does not judge skipped items", async () => {
  const rows = [sample("a", true), sample("b", false), { ...sample("skip", null), skip: "off-script" }];
  let calls = 0;
  await calibrateItems(async (_instruction, data: any) => {
    calls++;
    expect(JSON.stringify(data)).not.toContain("HIDDEN_HUMAN_REASON");
    expect(data.criteria.map((r: any) => r.id)).toEqual(["a", "b"]);
    return { results: data.criteria.map((r: any) => ({ id: r.id, verdict: true, reason: "visible result" })) };
  }, rows);
  expect(calls).toBe(1);
  expect(rows[2]!.judgment).toBeUndefined();
  expect(calibrationReport(rows).agreed).toBe(1);
});
test("unknown or not-reached judgments remain in the agreement denominator", () => {
  const rows = [sample("a", true), sample("b", false), sample("c", true)];
  rows[0]!.judgment = { tag: "x", verdict: null, reason: "unavailable" };
  rows[1]!.judgment = { tag: "x", verdict: "not reached", reason: "missing prerequisite" };
  rows[2]!.judgment = { tag: "x", verdict: true, reason: "observed" };
  expect(calibrationReport(rows)).toMatchObject({ rated: 3, judged: 3, pending_judge: 0, unresolved: 2, agreed: 1, compared: 1, complete: false });
  expect(calibrationReport(rows).disagreements).toHaveLength(2);
});
test("ambiguous ids and inconsistent skipped ratings fail before any call", async () => {
  expect(() => calibrationItems({ samples: [sample("a", true), sample("a", false)] })).toThrow();
  expect(() => calibrationItems({ samples: [{ ...sample("a", true), skip: "skip" }] })).toThrow();
  const a = sample("a", true), b = { ...sample("b", false), criterion: a.criterion };
  expect(calibrateItems(async () => { throw Error("must not call"); }, [a, b])).rejects.toThrow("duplicate criterion");
});

test("handbook normalization has repeated contact text after merge, then one shared source", async () => {
  const { resolveRubricTrace } = await import("./rubric-fixtures");
  const one = resolveRubricTrace("06:1:good").turns.at(-1)!.files_after;
  const two = resolveRubricTrace("06:2:good").turns.at(-1)!.files_after;
  const three = resolveRubricTrace("06:3:good").turns.at(-1)!.files_after;
  const homes = (files: Record<string, string>) => Object.entries(files)
    .filter(([, text]) => text.includes("rota@example.org")).map(([name]) => name).sort();
  expect(homes(one)).toEqual(["closing.md", "contact-copy.md", "contacts.md", "opening.md"]);
  expect(homes(two)).toEqual(["closing.md", "contacts.md", "opening.md"]);
  expect(homes(three)).toEqual(["contacts.md"]);
  for (const ref of ["06:4:good", "06:5:good"]) {
    const files = resolveRubricTrace(ref).turns.at(-1)!.files_after;
    expect(homes(files)).toEqual(["contacts.md"]);
    expect(files["safety.md"]).toContain("112");
    expect(files["opening.md"]).toContain("08:30");
    expect(files["closing.md"]).toContain("18:00");
  }
});
