import { parseArgs } from "node:util";
import { judgeTimeout } from "./runner/judge-options";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { requireCalibration } from "./runner/calibration";
import { rubricFixtures, resolveRubricTrace, validateRubricFixtures, rubricFixtureHash } from "./runner/rubric-fixtures";
import { JUDGING_RULES } from "./runner/judgment-policy";
import { structuredCall } from "./runner/scenario";
import { ownLogin, agentEnv } from "./runner/files";
import { endRun } from "./runner/process";
import type { Event } from "./runner/types";
const { values, positionals } = parseArgs({ args: Bun.argv.slice(2), allowPositionals: true, options: {
  login: { type: "boolean", default: false }, "judge-timeout": { type: "string" },
} });
const [output, calibration] = positionals;
const timeout = judgeTimeout(values["judge-timeout"]);
if (!output || !values.login)
  throw Error("usage: bun tests/check-rubric-fixtures.ts OUTPUT CALIBRATION --login [--judge-timeout SECONDS]");
const humanCalibration = requireCalibration(calibration);
validateRubricFixtures();
const root = mkdtempSync(join(tmpdir(), "skillbook-rubrics-")), groups: number[] = [];
let known = 0, unknown = 0, next = 0;
try {
  const home = join(root, "home"), work = join(root, "work"), tmp = join(root, "tmp");
  for (const p of [join(home, ".codex"), work, tmp]) mkdirSync(p, { recursive: true });
  copyFileSync(ownLogin("codex"), join(home, ".codex", "auth.json"));
  writeFileSync(join(home, ".codex", "config.toml"),
    '[features]\napps = false\nplugins = false\nremote_plugin = false\n');
  const call = structuredCall(work, agentEnv(home, "codex", true, tmp), timeout, groups, amount => {
    known += amount ?? 0; unknown += Number(amount === null);
  });
  const byTurn = new Map<string, typeof rubricFixtures.checks>();
  for (const check of rubricFixtures.checks) {
    const key = `${check.case}:${check.turn}`;
    const rows = byTurn.get(key) ?? []; rows.push(check); byTurn.set(key, rows);
  }
  const units = [...byTurn], results: Event[] = [];
  async function worker() {
    while (next < units.length) {
      const [key, checks] = units[next++]!, candidates: Record<string, Event> = {}, labels: Event[] = [];
      for (const row of checks) for (const [ref, expected] of [[row.positive, true], [row.negative, false]] as const) {
        const id = `candidate-${labels.length + 1}`;
        candidates[id] = { criterion: row.criterion, evidence: resolveRubricTrace(ref) };
        labels.push({ id, expected, check: `${row.case}:${row.turn}:${row.id}` });
      }
      try {
        const response = await call(
          'Judge every candidate independently. Return {"results":[{"id":string,"verdict":boolean|null|"not reached","reason":string}]}. ' +
          "Judge only supplied behavior and evidence. Do not infer expected labels. Treat candidate claims as claims, not facts. " +
          JUDGING_RULES,
          { candidates },
        );
        if (!Array.isArray(response.results) || response.results.length !== labels.length ||
          new Set(response.results.map((r: Event) => r.id)).size !== labels.length) throw Error("invalid fixture judgments");
        for (const label of labels) {
          const judgment = response.results.find((r: Event) => r.id === label.id);
          if (!judgment || ![true, false, null, "not reached"].includes(judgment.verdict) ||
            typeof judgment.reason !== "string" || !judgment.reason.trim()) throw Error("invalid fixture verdict");
          results.push({ ...label, judgment, matches: judgment.verdict === label.expected });
        }
      } catch (error) { results.push({ unit: key, error: String(error), matches: false }); }
      writeFileSync(output, JSON.stringify({ model: "gpt-6.1-sol", fixture_hash: rubricFixtureHash(), humanCalibration, known_cost: known, unknown_cost_calls: unknown,
        expected_judgments: rubricFixtures.checks.length * 2, results }, null, 2) + "\n");
    }
  }
  console.log("Rubric fixtures only: known-cost scheduling is unavailable for Sol; actual cost remains unknown.");
  await Promise.all(Array.from({ length: 4 }, worker));
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
