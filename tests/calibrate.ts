import { judgeTimeout } from "./runner/judge-options";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ownLogin, agentEnv } from "./runner/files";
import { structuredCall, SCENARIO_MODEL } from "./runner/scenario";
import { endRun } from "./runner/process";
import { calibrationReport, calibrationItems, calibrateItems, authorizeCalibration } from "./runner/calibration";

const { values, positionals } = parseArgs({ args: Bun.argv.slice(2), allowPositionals: true, options: {
  login: { type: "boolean", default: false }, source: { type: "string" }, jobs: { type: "string", default: "2" },
  heldout: { type: "boolean", default: false }, previous: { type: "string" },
  "judge-timeout": { type: "string" },
} });
const output = positionals[0], jobs = Number(values.jobs), timeout = judgeTimeout(values["judge-timeout"]);
if (positionals.length !== 1 || !values.login || !Number.isInteger(jobs) || jobs < 1)
  throw Error("usage: bun tests/calibrate.ts OUTPUT --login [--source FILE] [--jobs N] [--judge-timeout SECONDS] [--heldout] [--previous FILE]");
const sourcePath = values.source ?? new URL("./calibration/scenario-judge.json", import.meta.url);
const original = JSON.parse(readFileSync(sourcePath, "utf8"));
const source = authorizeCalibration(original, values.heldout);
const previous = values.previous ? JSON.parse(readFileSync(values.previous, "utf8")).samples : undefined;
const samples = calibrationItems(source);
if (source !== original) writeFileSync(sourcePath, JSON.stringify(source, null, 2) + "\n");
const root = mkdtempSync(join(tmpdir(), "skillbook-calibration-")), groups: number[] = [];
let known = 0, unknown = 0;
const save = () => writeFileSync(output!, JSON.stringify({ ...source, model: SCENARIO_MODEL,
  known_cost: known, unknown_cost_calls: unknown, samples, report: calibrationReport(samples, previous) }, null, 2) + "\n");
console.log(`${samples.filter(s => !s.skip).length} items to judge; ` +
  `${samples.filter(s => !s.skip && typeof s.human === "boolean").length} human-rated; ` +
  "Sol cost is unknown, not zero; no hard cap. No other rubric or answer scoring runs.");
try {
  const home = join(root, "home"), work = join(root, "work"), tmp = join(root, "tmp");
  for (const path of [join(home, ".codex"), work, tmp]) mkdirSync(path, { recursive: true });
  copyFileSync(ownLogin("codex"), join(home, ".codex", "auth.json"));
  writeFileSync(join(home, ".codex", "config.toml"),
    '[features]\napps = false\nplugins = false\nremote_plugin = false\n');
  const call = structuredCall(work, agentEnv(home, "codex", true, tmp), timeout, groups, amount => {
    known += amount ?? 0; unknown += Number(amount === null);
  });
  await calibrateItems(call, samples, jobs, save);
  save();
  console.log(JSON.stringify(calibrationReport(samples, previous)));
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
