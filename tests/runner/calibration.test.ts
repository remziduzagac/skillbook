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

test("calibration reports class intervals and self-agreement separately by set", () => {
  const a = { ...sample("a", true), set: "tuning" as const, judgment: { tag: "x", verdict: true, reason: "yes" } };
  const b = { ...sample("b", false), set: "heldout" as const, judgment: { tag: "x", verdict: false, reason: "no" } };
  const report = calibrationReport([a, b], [a, b]);
  expect(report.by_set.tuning.by_human.pass).toMatchObject({ agreed: 1, total: 1, rate: 1 });
  expect(report.by_set.tuning.by_human.pass.interval[0]).toBeCloseTo(0.20655, 4);
  expect(report.by_set.heldout.by_human.fail.total).toBe(1);
  expect(report.by_set.tuning.self_agreement).toMatchObject({ agreed: 1, total: 1, unresolved: 0 });
  expect(() => calibrationReport([a], [{ ...a, answer: "different" }])).toThrow("identical evidence");
});
test("held-out attempts require authorization and retain earlier dates", async () => {
  const { authorizeCalibration } = await import("./calibration");
  const source = { samples: [{ ...sample("h", true), set: "heldout" as const }], heldout_runs: ["first"] };
  expect(() => authorizeCalibration(source, false)).toThrow("--heldout");
  expect(authorizeCalibration(source, true, "second").heldout_runs).toEqual(["first", "second"]);
  expect(source.heldout_runs).toEqual(["first"]);
});

test("the CLI refuses held-out data before writing output or starting a call", async () => {
  const { mkdtempSync, writeFileSync, existsSync, rmSync, readFileSync } = await import("node:fs");
  const { spawnSync } = await import("node:child_process");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const root = mkdtempSync(join(tmpdir(), "calibration-guard-"));
  try {
    const source = join(root, "source.json"), output = join(root, "output.json");
    const text = JSON.stringify({ samples: [{ ...sample("h", true), set: "heldout" }] });
    writeFileSync(source, text);
    const result = spawnSync(process.execPath, ["tests/calibrate.ts", output, "--login", "--source", source], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("requires --heldout");
    expect(existsSync(output)).toBe(false);
    expect(readFileSync(source, "utf8")).toBe(text);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test("unknown judgments stay in class denominators and unresolved self-agreement pairs", () => {
  const rows = [sample("pass", true), sample("fail", false)];
  rows[0]!.judgment = { tag: "x", verdict: true, reason: "observed" };
  const prior = structuredClone(rows);
  rows[0]!.judgment!.verdict = null;
  const report = calibrationReport(rows, prior).by_set.tuning;
  expect(report.by_human.pass).toMatchObject({ agreed: 0, total: 1, rate: 0 });
  expect(report.by_human.fail).toMatchObject({ agreed: 0, total: 1, rate: 0 });
  expect(report.self_agreement).toMatchObject({ agreed: 0, total: 0, eligible: 2, unresolved: 2 });
  rows[1]!.judgment = { tag: "x", verdict: false, reason: "observed fail" };
  prior[1]!.judgment = { tag: "x", verdict: false, reason: "observed fail" };
  expect(calibrationReport(rows, prior).by_set.tuning.self_agreement)
    .toMatchObject({ agreed: 1, total: 1, rate: 1, eligible: 2, unresolved: 1 });
});
test("split fixture inheritance keeps evidence and uses concrete conditional counterexamples", async () => {
  const { rubricFixtures, resolveRubricTrace } = await import("./rubric-fixtures");
  for (const id of ["scope-intent", "scope-choices", "scope-approval", "continuity-loading", "continuity-reuse"]) {
    const row = rubricFixtures.checks.find(r => r.id === id)!;
    const good = resolveRubricTrace(row.positive).turns.at(-1)!;
    const bad = resolveRubricTrace(row.negative).turns.at(-1)!;
    expect(bad.final_answer).not.toBe(good.final_answer);
    if (id === "scope-intent") {
      expect(good.sent_message).toContain("undecided");
      expect(bad.sent_message).toBe(good.sent_message);
    }
    if (id === "scope-approval") {
      expect(bad.actions[0].tool).toBe("write_file");
      expect(good.files_changed).toEqual({});
    }
    if (id === "continuity-reuse") expect(bad.actions[0]).toEqual(bad.actions[1]);
  }
});
