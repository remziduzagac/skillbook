import { test, expect } from "bun:test";
import { existsSync } from "node:fs";
import { loadCases } from "./cases";
import { activeRubricBook } from "./rubric-fixtures";
import { traceChecks } from "./trace-checks";

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
