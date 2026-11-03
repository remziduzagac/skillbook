import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalize } from "./cases";
import { rubricFixtures, validateRubricFixtures, resolveRubricTrace, rubricFixtureHash, validateRubricReport,
  rubricCandidates, activeRubricBook, type RubricBook } from "./rubric-fixtures";
import { requireSavedCases } from "./recheck";
import { heldoutRuns } from "./rating-walk";
import { aspects } from "./inventory";
import { ruleChecks, resultChecks, validateSource } from "./rule-checks";
const criterion = {id: "result", tag: "task", criterion: "Returns a decision or a grounded question"};
const c = normalize({fixture: "tiny-weather", turns: [{prompt: "Inspect", rubric: [criterion]}]}, "essentials/unit");
function book(): RubricBook {
  return {scope: "active", sources: {[c.id]: {"source.md": "known facts"}}, traces: Object.fromEntries([
    ["good", "A grounded decision"], ["alternative", "A grounded question"], ["wrong", "Invented answer"],
  ].map(([key, final_answer]) => [key!, {case: c.id, prior: [], observation: {final_answer, files_removed: []}}])),
  checks: [{case: c.id, turn: 1, ...criterion, positive: "good", negative: "wrong", alternatives: ["alternative"]}]};
}
const report = (b: RubricBook) => ({model: "gpt-6.1-sol", fixture_hash: rubricFixtureHash(b),
  results: rubricCandidates(b).map(row => ({...row, judgment: {verdict: row.expected}}))});

test("historical trace validation is independent of live cases and keeps its frozen hash", () => {
  expect(validateRubricFixtures()).toBe(rubricFixtures.checks.length);
  const frozen = JSON.parse(readFileSync("tests/calibration/scenario-traces.json", "utf8"));
  expect(rubricFixtureHash()).toBe(new Bun.CryptoHasher("sha256").update(JSON.stringify(frozen)).digest("hex"));
  expect(resolveRubricTrace(rubricFixtures.checks[0]!.positive).turns.length).toBeGreaterThan(0);
});
test("active validation requires exact current criteria and every allowed alternative judgment", () => {
  const b = book(); expect(validateRubricFixtures(b, [c])).toBe(1);
  expect(validateRubricReport(report(b), b)).toBe(3);
  const valid = report(b);
  expect(() => validateRubricReport({...valid, results: valid.results.filter(r => r.ref !== "alternative")}, b)).toThrow();
  expect(() => validateRubricReport({...valid, results: [valid.results[0], valid.results[0], valid.results[2]]}, b)).toThrow();
  expect(() => validateRubricReport({...valid, fixture_hash: "wrong"}, b)).toThrow();
  expect(() => validateRubricReport({...valid, model: "other"}, b)).toThrow();
  expect(() => validateRubricReport({...valid, results: valid.results.map(r => ({...r, judgment: {verdict: true}}))}, b)).toThrow();
  expect(() => validateRubricFixtures(b)).toThrow("current cases");
  const changed = structuredClone(c); changed.turns[0]!.rubric![0]!.criterion = "changed";
  expect(() => validateRubricFixtures(b, [changed])).toThrow("current criterion");
  expect(() => validateRubricFixtures({...b, checks: []}, [c])).toThrow();
  const labels = resolveRubricTrace("good", b);
  expect(JSON.stringify(labels)).not.toContain("expected");
});
test("historical reports cannot authorize active scoring, even with the right model", () => {
  const root = mkdtempSync(join(tmpdir(), "rubric-book-unit-"));
  try {
    const path = join(root, "book.json");
    writeFileSync(path, JSON.stringify(book()));
    const active = activeRubricBook(path, [c]);
    expect(active.scope).toBe("active");
    expect(() => validateRubricReport(report(rubricFixtures), active)).toThrow("stale");
    expect(() => activeRubricBook(undefined, [c])).toThrow("historical validation");
    writeFileSync(path, JSON.stringify(rubricFixtures));
    expect(() => activeRubricBook(path, [c])).toThrow("active rubric book");
  } finally { rmSync(root, {recursive: true, force: true}); }
});
test("trace books reject cycles, duplicate positive/negative references and cross-chapter history", () => {
  const b = book(); b.traces.good!.base = "good";
  expect(() => resolveRubricTrace("good", b)).toThrow("cyclic");
  const same = book(); same.checks[0]!.negative = "good";
  expect(() => validateRubricFixtures(same, [c])).toThrow("distinct");
  const chapters = book();
  chapters.chapter_sources = {[`${c.id}:2`]: {"source.md": "chapter two facts"}};
  chapters.traces.good!.chapter = 2;
  expect(resolveRubricTrace("good", chapters).sources["source.md"]).toBe("chapter two facts");
  chapters.traces.good!.prior = ["alternative"];
  expect(() => resolveRubricTrace("good", chapters)).toThrow("crosses case or chapter");
});
test("retired cases fail before rechecking, and holdout selection can name a new cohort", () => {
  expect(() => requireSavedCases([{case: "retired"}], new Map([[c.id, c]]))).toThrow("missing or retired case");
  const runs = [{case: "new-case", model: "gpt-6.1-sol", user_mode: "fixed", run: 1}];
  expect(heldoutRuns(runs, {cases: ["new-case"], model: "gpt-6.1-sol", mode: "fixed"})).toEqual(runs);
  expect(() => heldoutRuns(runs)).toThrow();
});
test("inventory keeps displayed numbers rather than list position", () => {
  const root = mkdtempSync(join(tmpdir(), "aspect-numbering-"));
  try {
    const path = join(root, "guide.md");
    writeFileSync(path, "# guide\n\n## Rules\n\n1. **First.**\n3. **Third.**\n7. **Seventh.**\n\n## Instructions\n\n0. **Prepare.**\n2. **Finish.**\n");
    const inventory = aspects([["guide", path]]);
    expect(Object.keys(inventory)).toEqual(["guide:rule:1", "guide:rule:3", "guide:rule:7", "guide:step:0", "guide:step:2"]);
    expect(aspects()["respond-layout:rule:3"]).toContain("Keep tables");
  } finally { rmSync(root, {recursive: true, force: true}); }
});
test("source drift validation requires full numbered blocks, correct ids and current result sections", () => {
  const rules = ruleChecks(); expect(rules.length).toBeGreaterThan(0);
  for (const rule of rules) {
    expect(() => validateSource(rule)).not.toThrow();
    expect(() => validateSource({...rule, source: {...rule.source, line: rule.source.line + 1}})).toThrow();
  }
  const multiline = rules.find(r => r.source.text.includes("\n"))!;
  expect(() => validateSource({...multiline, source: {...multiline.source, text: multiline.source.text.split("\n")[0]}})).toThrow("full block");
  expect(() => validateSource({...multiline, id: "guide:rule:999"})).toThrow("number");
  for (const result of resultChecks()) {
    expect(() => validateSource(result)).not.toThrow();
    const lines = readFileSync(result.source.file, "utf8").split("\n");
    expect(lines.slice(0, result.source.line).lastIndexOf("## Gives back")).toBeGreaterThan(0);
  }
});
