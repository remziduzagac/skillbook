import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadCases, normalize } from "./cases";
import { activeRubricBook, type RubricBook } from "./rubric-fixtures";
import { ruleChecks, resultChecks } from "./rule-checks";
import { uncoveredRules, uncoveredReturns, activeBooks } from "./library-coverage";

// Whole-library coverage is shared by the scenarios: a rule or return that one case does not use belongs to another.
test("every rule definition is a criterion in at least one active case", () => {
  expect(uncoveredRules(loadCases())).toEqual([]);
});
test("every visible promised return is in at least one active book, and each book covers exactly its own case", () => {
  const books = activeBooks(loadCases());
  expect(books.map(b => b.path.split("/").at(-1))).toContain("festival-traces.json");
  for (const {path, cases} of books) {
    expect(cases.length, path).toBeGreaterThan(0);
    expect(activeRubricBook(path, cases).scope).toBe("active");
  }
  expect(uncoveredReturns(books.map(b => b.book))).toEqual([]);
});
test("the union, not any one case or book, decides whole-library coverage", () => {
  const rules = ruleChecks(), parts = resultChecks().filter(p => !p.exclusion);
  const [first, second] = [rules.slice(0, 2), rules.slice(2)];
  const holding = (id: string, keys: typeof rules) => normalize({fixture: "tiny-weather", turns: [{prompt: "x",
    rubric: keys.map((r, i) => ({id: `r${i}`, tag: `rule:${r.id}`, criterion: "Applies"}))}]}, id);
  const a = holding("essentials/a", first), b = holding("essentials/b", second);
  for (const c of [a, b]) c.turns[0]!.rubric = c.turns[0]!.rubric!.map((r, i) =>
    ({...r, source_check: (c === a ? first : second)[i]!.key}));
  expect(uncoveredRules([a])).toHaveLength(rules.length - first.length);
  expect(uncoveredRules([a, b])).toEqual([]);
  const library = (ids: string[]): RubricBook => ({scope: "active", sources: {}, traces: {}, checks: [],
    library: ids.map(id => ({case: "x", turn: 1, id, tag: "t", criterion: "c", positive: "p", negative: "n"}))});
  const half = Math.floor(parts.length / 2);
  expect(uncoveredReturns([library(parts.slice(0, half).map(p => p.id))])).toHaveLength(parts.length - half);
  expect(uncoveredReturns([library(parts.slice(0, half).map(p => p.id)), library(parts.slice(half).map(p => p.id))]))
    .toEqual([]);
  const root = mkdtempSync(join(tmpdir(), "library-books-"));
  try {
    writeFileSync(join(root, "old.json"), JSON.stringify({sources: {}, traces: {}, checks: []}));
    writeFileSync(join(root, "a-traces.json"), JSON.stringify({...library([]), checks: [{case: "essentials/a"}]}));
    expect(activeBooks([a, b], root).map(x => [x.path.split("/").at(-1), x.cases.map(c => c.id)]))
      .toEqual([["a-traces.json", ["essentials/a"]]]);
  } finally { rmSync(root, {recursive: true, force: true}); }
});
