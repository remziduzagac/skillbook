import { parseArgs } from "node:util";
import { judgeTimeout } from "./runner/judge-options";
import { finalAnswer } from "./runner/answers";
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validateRubricReport } from "./runner/rubric-fixtures";
import { requireCalibration } from "./runner/calibration";
import { loadCases } from "./runner/cases";
import { recheckScenario } from "./runner/recheck";
import { ownLogin, agentEnv } from "./runner/files";
import { structuredCall, rubricBatch, judgeEvidence } from "./runner/scenario";
import { score, scoreRuns, evaluateTagged, scenarioReliability } from "./runner/scoring";
import { endRun } from "./runner/process";
import type { Event, Verdict, JudgeRequest } from "./runner/types";

const { values, positionals } = parseArgs({ args: Bun.argv.slice(2), allowPositionals: true, options: {
  login: { type: "boolean", default: false }, "judge-timeout": { type: "string" },
} });
const [source, output, calibration, validation] = positionals;
const timeout = judgeTimeout(values["judge-timeout"]);
if (!source || !output || source === output || !values.login)
  throw Error("usage: bun tests/judge-scenarios.ts SOURCE NEW_OUTPUT CALIBRATION RUBRIC_VALIDATION --login [--judge-timeout SECONDS]");
const calibrated = requireCalibration(calibration);
if (!validation) throw Error("rubric validation file required");
validateRubricReport(JSON.parse(readFileSync(validation, "utf8")));
const cases = new Map(loadCases().map(c => [c.id, c]));
const original: Event[] = JSON.parse(readFileSync(join(source, "summary.json"), "utf8"));
const root = mkdtempSync(join(tmpdir(), "skillbook-judge-")), groups: number[] = [];
let known = 0, unknown = 0;
console.log("Saved-answer judging only. Sol cost is unknown; no hard spending cap. Originals remain unchanged.");
try {
  const home = join(root, "home"), work = join(root, "work"), tmp = join(root, "tmp");
  for (const p of [join(home, ".codex"), work, tmp]) mkdirSync(p, { recursive: true });
  copyFileSync(ownLogin("codex"), join(home, ".codex", "auth.json"));
  writeFileSync(join(home, ".codex", "config.toml"),
    '[features]\napps = false\nplugins = false\nremote_plugin = false\n');
  const call = structuredCall(work, agentEnv(home, "codex", true, tmp), timeout, groups, amount => {
    known += amount ?? 0; unknown += Number(amount === null);
  });
  const results = [];
  mkdirSync(output, { recursive: true });
  for (const r of original) {
    const c = cases.get(r.case);
    if (!c) throw Error("case missing: " + r.case);
    const result = recheckScenario(r, c), history: Record<string, Verdict> = {};
    for (const [index, t] of result.turns.entries()) {
      t.tagged_checks = evaluateTagged(c.turns[index]!.tagged_checks ?? [], t, history, c.fixture);
      const pending: JudgeRequest[] = [];
      t.judgments = [];
      for (const rubric of c.turns[index]!.rubric ?? []) {
        const dep = rubric.depends_on, prior = dep ? history[`${dep.turn}:${dep.check}`] : true;
        if (prior !== true || t.trace_complete === false) t.judgments.push({ id: rubric.id, tag: rubric.tag,
          verdict: prior === false || prior === "not reached" ? "not reached" : null,
          reason: "prerequisite or complete trace unavailable" });
        else pending.push({ rubric, answer: finalAnswer(t),
          evidence: judgeEvidence(result.turns.slice(0, index + 1), result.fixture_sources) });
      }
      try { t.judgments.push(...await rubricBatch(call, pending)); }
      catch (error) { t.judgments.push(...pending.map(p => ({ id: p.rubric.id, tag: p.rubric.tag,
        verdict: null, reason: String(error) }))); }
      for (const row of [...t.tagged_checks, ...t.judgments]) history[`${index + 1}:${row.id}`] = row.verdict;
      t.rubric_pending = [];
    }
    result.scores = score([...result.turns.flatMap((t: Event) => [...t.tagged_checks, ...t.judgments]),
      ...result.unreached_turn_checks, ...result.run_checks]);
    result.calibration = calibrated;
    results.push(result);
    writeFileSync(join(output, `run-${results.length}.json`), JSON.stringify(result, null, 2) + "\n");
  }
  writeFileSync(join(output, "summary.json"), JSON.stringify(results, null, 2) + "\n");
  writeFileSync(join(output, "reliability.json"), JSON.stringify(scenarioReliability(results), null, 2) + "\n");
  writeFileSync(join(output, "scores.json"), JSON.stringify(scoreRuns(results as any), null, 2) + "\n");
  writeFileSync(join(output, "judging-cost.json"), JSON.stringify({ known, unknown_calls: unknown }) + "\n");
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
