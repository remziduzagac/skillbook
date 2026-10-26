import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ownLogin, agentEnv } from "./runner/files";
import { structuredCall, rubricJudge, SCENARIO_MODEL } from "./runner/scenario";
import { endRun } from "./runner/process";
import { calibrationReport } from "./runner/calibration";

const source = JSON.parse(readFileSync(new URL("./calibration/scenario-judge.json", import.meta.url), "utf8"));
const output = Bun.argv[2];
if (!output || !Bun.argv.includes("--login")) throw Error("usage: bun tests/calibrate.ts OUTPUT --login");
const root = mkdtempSync(join(tmpdir(), "skillbook-calibration-"));
const groups: number[] = [];
let known = 0, unknown = 0;
try {
  const home = join(root, "home"), work = join(root, "work"), tmp = join(root, "tmp");
  for (const path of [join(home, ".codex"), work, tmp]) mkdirSync(path, { recursive: true });
  copyFileSync(ownLogin("codex"), join(home, ".codex", "auth.json"));
  writeFileSync(join(home, ".codex", "config.toml"),
    '[features]\napps = false\nplugins = false\nremote_plugin = false\n');
  const call = structuredCall(work, agentEnv(home, "codex", true, tmp), 120, groups, amount => {
    known += amount ?? 0; unknown += Number(amount === null);
  });
  const samples = [];
  for (const sample of source.samples) samples.push({ ...sample, human: null,
    judgment: await rubricJudge(call, { rubric: { id: sample.id, tag: "skill:devise-design",
      criterion: source.criterion }, answer: sample.answer, evidence: { prompt: source.prompt } }) });
  const result = { prompt: source.prompt, criterion: source.criterion, model: SCENARIO_MODEL, known_cost: known, unknown_cost_calls: unknown,
    samples, report: calibrationReport(samples) };
  writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result.report));
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
