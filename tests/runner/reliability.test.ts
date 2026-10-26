import { test, expect } from "bun:test";
import { scenarioReliability } from "./scoring";
const run = (n: number, verdict: boolean | null | "not reached" = true) => ({
  case: "scenario", agent: "codex", model: "luna", run: n, user_mode: "fixed", expected_turns: 1,
  turns: [{ tagged_checks: [{ id: "a", tag: "habit:a", verdict }] }],
});
const result = (rows: any[]) => Object.values(scenarioReliability(rows))[0]!;
test("pass cubed requires three passes and is separate from average", () => {
  expect(result([run(1), run(2), run(3)])).toMatchObject({ average: 1, pass3: true });
  expect(result([run(1), run(2), run(3, false)])).toMatchObject({ average: 2 / 3, pass3: false });
  expect(result([run(1)])).toMatchObject({ average: 1, pass3: null });
});
test("missing checks and unknown runs cannot silently pass reliability", () => {
  const missing = { ...run(3), turns: [] };
  expect(result([run(1), run(2), missing]).checks["1:a"]).toMatchObject({ pass3: null, unknown: 1 });
  expect(result([run(1), run(2), run(3, null)]).pass3).toBeNull();
  expect(result([run(1), run(2), run(3, "not reached")]).checks["1:a"]!.not_reached).toBe(1);
  expect(result([run(1), run(2, false), run(3, null)]).pass3).toBe(false);
});
test("models and modes stay separate and pending semantic checks remain unknown", () => {
  const pending = { ...run(3), turns: [{ rubric_pending: [{ id: "semantic" }] }] };
  expect(result([run(1), run(2), pending]).pass3).toBeNull();
  expect(Object.keys(scenarioReliability([run(1), { ...run(2), model: "sol" }]))).toHaveLength(2);
});
test("duplicate run records do not establish three-run reliability", () => {
  expect(result([run(1), run(1), run(1)]).pass3).toBeNull();
});
test("unreached checks retain their turn instead of colliding with earlier check ids", () => {
  const missing = { ...run(3), expected_turns: 2,
    unreached_turn_checks: [{ turn: 2, id: "a", tag: "habit:a", verdict: null }] };
  const row = result([run(1), run(2), missing]);
  expect(row.checks["2:a"]).toMatchObject({ pass3: null, unknown: 3 });
  expect(row.checks["1:a"]!.pass3).toBe(true);
  expect(row.pass3).toBeNull();
});
