import { test, expect } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { loadCases } from "./cases";
import { activeRubricBook, resolveRubricTrace, rubricCandidates } from "./rubric-fixtures";
import { traceChecks } from "./trace-checks";
import { check } from "./checks";
import { judgeCriterion } from "./judge-protocol";

// The todo-app scenario's own tests go in this file, as the festival's go in festival.test.ts.
// Its case and trace book are written apart from the runner; each test waits until the files it needs exist.
const CASE = "tests/cases/essentials/todo-app.yaml", BOOK = "tests/calibration/todo-app-traces.json";
const todoApp = () => loadCases().find(c => c.id === "essentials/todo-app")!;

test.skipIf(!existsSync(CASE))("the todo-app case is selected by id beside the festival and requires python3", () => {
  const all = loadCases(), c = todoApp();
  expect(all.map(x => x.id)).toEqual(expect.arrayContaining(["essentials/festival", "essentials/todo-app"]));
  expect(c.requires).toContain("python3");
});
test.skipIf(!existsSync(CASE) || !existsSync(BOOK))("the todo-app book covers exactly what its own case needs", () => {
  expect(activeRubricBook(BOOK, [todoApp()]).scope).toBe("active");
});
test.skipIf(!existsSync(CASE) || !existsSync(BOOK))("each todo-app turn's automatic checks pass on its correct trace", () => {
  const c = todoApp(), book = activeRubricBook(BOOK, [c]);
  for (const [i, t] of c.turns.entries()) {
    const ref = `t${i + 1}:correct`;
    if (!t.checks || !book.traces[ref]) continue;
    expect(Object.entries(traceChecks(t.checks, ref, book)).filter(([, v]) => v !== true), `turn ${i + 1}`).toEqual([]);
  }
});

test.skipIf(!existsSync(CASE))("the todo-app case has 37 turns across its six checkpoint chapters", () => {
  const c = todoApp(), starts = c.chapters!.map(ch => ch.start_turn);
  expect(c.turns).toHaveLength(37);
  expect(starts).toEqual([1, 8, 15, 21, 28, 35]);
  expect(starts.map((start, i) => (starts[i + 1] ?? c.turns.length + 1) - start)).toEqual([7, 7, 6, 7, 7, 3]);
});
test.skipIf(!existsSync(CASE))("turn 6 allows one new glossary but rejects other edits", () => {
  const checks = todoApp().turns[5]!.checks!;
  const passes = (changes: string[]) => Object.values(check(checks, {changes})).every(v => v === true);
  expect(passes([])).toBe(true);
  expect(passes(["added glossary.md"])).toBe(true);
  for (const changes of [["added glossary.md", "added terms.md"], ["changed notes/idea.md"], ["added glossary.txt"]])
    expect(passes(changes)).toBe(false);
});
test.skipIf(!existsSync(CASE))("turn 16 sends the plan-update condition to the judge with its source rule", () => {
  const t = todoApp().turns[15]!, id = "devise-plan:rule:9";
  const rubric = t.rubric!.find(r => r.id === `rule:${id}`)!;
  expect(t.rule_marks!.find(m => m.id === id)!.applies).toBe(true);
  expect(rubric.source_check).toBeDefined();
  const criterion = judgeCriterion(rubric);
  expect(criterion.criterion).toContain("plan.md");
  expect(criterion.criterion).toContain("null");
  expect(criterion.full_rule).toBeTruthy();
});

test.skipIf(!existsSync(CASE))("turn 29 accepts test references moving with the split", () => {
  const checks = todoApp().turns[28]!.checks!;
  const changes = ["changed jotdown/cli.py", "added jotdown/summary.py", "changed tests/test_summary.py"];
  const observation = {changes, test_runs: [{command: "python3 -m unittest", status: 0}],
    start_snapshot: {"tests/test_summary.py": "from jotdown.cli import summary"},
    project_snapshot: {"tests/test_summary.py": "from jotdown.summary import summary"}};
  expect(Object.values(check(checks, observation)).every(v => v === true)).toBe(true);
  expect(Object.values(check(checks, {...observation, test_runs: [{command: "python3 -m unittest", status: 1}]})))
    .toContain(false);
});
test.skipIf(!existsSync(CASE))("turn 33 rejects stale data guidance in README and docs while allowing current facts and history", () => {
  const checks = {tree_lacks: todoApp().turns[32]!.checks!.tree_lacks!};
  expect(Object.keys(checks.tree_lacks).sort()).toEqual(["README.md", "docs"]);
  const checkpoint = "tests/fixtures/scenarios/todo-app-checkpoints/chapter-5/";
  const old = readFileSync(checkpoint + "docs/install.md", "utf8");
  const current = readFileSync(checkpoint + "README.md", "utf8");
  const history = "The design had named data/tasks.json without saying what it was relative to.";
  const verdicts = (files: Record<string, string>) => Object.values(check(checks, {files, project_snapshot: files}));
  expect(verdicts({"README.md": current + "\n" + history, "docs/usage.md": current})).toEqual([true, true]);
  expect(verdicts({"README.md": old, "docs/usage.md": current})).toEqual([false, true]);
  expect(verdicts({"README.md": current, "docs/install.md": old})).toEqual([true, false]);
  expect(verdicts({"README.md": current + "\nThe list is kept in data/tasks.json in the current working folder.",
    "docs/usage.md": current})).toEqual([false, true]);
});

test.skipIf(!existsSync(CASE) || !existsSync(BOOK))("turn 16 leaves an unchanged plan unjudged for the plan-update rule", () => {
  const c = todoApp(), book = activeRubricBook(BOOK, [c]), ref = "t16:plan-unchanged";
  const row = book.checks.find(r => r.turn === 16 && r.id === "rule:devise-plan:rule:9")!;
  expect(row.alternatives).toContain(ref);
  expect(rubricCandidates(book).find(candidate => candidate.ref === ref &&
    candidate.check === `${c.id}:16:${row.id}`)!.expected).toBeNull();
  const trace = resolveRubricTrace(ref, book).turns.at(-1)!;
  expect(trace.files_before["plan.md"]).toBeDefined();
  expect(trace.files_after["plan.md"]).toBe(trace.files_before["plan.md"]);
});
