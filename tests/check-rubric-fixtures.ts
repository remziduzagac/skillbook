import { fixtureEntries, fixtureBatches, fixtureManifest, previewEntries, loadingFixtureResults, runFixtureBatch } from "./runner/fixture-validation";
import { parseArgs } from "node:util";
import { judgeTimeout } from "./runner/judge-options";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { requireCalibration } from "./runner/calibration";
import { rubricFixtures, validateRubricFixtures, rubricFixtureHash, activeRubricBook } from "./runner/rubric-fixtures";
import { loadCases } from "./runner/cases";
import { structuredCall } from "./runner/scenario";
import { ownLogin, agentEnv } from "./runner/files";
import { endRun } from "./runner/process";
import type { Event } from "./runner/types";
const { values, positionals } = parseArgs({ args: Bun.argv.slice(2), allowPositionals: true, options: {
  book: { type: "string" }, historical: { type: "boolean" },
  login: { type: "boolean", default: false }, "judge-timeout": { type: "string" },
  preview: { type: "boolean", default: false }, candidates: { type: "string" }, since: { type: "string" },
  "baseline-book": { type: "string" }, "dry-run": { type: "boolean", default: false },
} });
const [output, calibration] = positionals;
const BATCH_CHARACTERS = 600_000;
const timeout = judgeTimeout(values["judge-timeout"]);
if (!output || !values.login && !values["dry-run"])
  throw Error("usage: bun tests/check-rubric-fixtures.ts OUTPUT CALIBRATION --login (--book FILE | --historical) [--preview --candidates FILE | --since REPORT [--baseline-book FILE]] [--dry-run] [--judge-timeout SECONDS]");
if ((values.candidates || values.since || values["baseline-book"] || values["dry-run"]) && !values.preview)
  throw Error("candidate selection and dry runs require --preview");
if (values["baseline-book"] && !values.since) throw Error("--baseline-book requires --since REPORT");
if (!values.book && !values.historical) throw Error("choose --book FILE for active validation or --historical");
if (values.book && values.historical) throw Error("choose one rubric scope");
const activeData = values.book ? JSON.parse(readFileSync(values.book, "utf8")) : undefined;
const activeIds = new Set<string>(activeData?.checks?.map((r: Event) => r.case) ?? []);
const activeCases = values.book ? loadCases().filter(c => activeIds.has(c.id)) : undefined;
const selectedBook = values.book ? activeRubricBook(values.book, activeCases!) : rubricFixtures;
validateRubricFixtures(selectedBook, activeCases);
const allEntries = fixtureEntries(selectedBook,activeCases);
const baseline = values["baseline-book"] ? fixtureEntries(JSON.parse(readFileSync(values["baseline-book"],"utf8")),activeCases) : undefined;
const entries = values.preview ? previewEntries(allEntries,
  values.candidates ? JSON.parse(readFileSync(values.candidates,"utf8")) : [],
  values.since ? JSON.parse(readFileSync(values.since,"utf8")) : undefined,baseline) : allEntries;
const batches = fixtureBatches(entries,BATCH_CHARACTERS);
const manifest = fixtureManifest(entries);
const reportBase = {mode:values.preview ? "preview" : "full", ...(values.preview ? {scoring_authorized:false} : {}),
  model:"gpt-6.1-sol",fixture_hash:rubricFixtureHash(selectedBook),expected_judgments:entries.length,candidates:manifest};
if (values["dry-run"]) {
  writeFileSync(output,JSON.stringify({...reportBase,status:"planned",model_calls:0,
    batches:batches.map(batch=>batch.map(entry=>entry.id)),results:[]},null,2)+"\n");
  console.log(`Preview only: ${entries.length} candidates, ${batches.length} batches; no model calls; cannot authorize scoring.`);
  process.exit(0);
}
const humanCalibration = requireCalibration(calibration);
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
  const results: Event[] = loadingFixtureResults(entries);
  const save = () => writeFileSync(output,JSON.stringify({...reportBase,humanCalibration,known_cost:known,
    unknown_cost_calls:unknown,results},null,2)+"\n");
  save();
  async function worker() {
    while (next < batches.length) {
      const index=next++, batch=batches[index]!;
      try {
        const accepted=await runFixtureBatch(call,batch,BATCH_CHARACTERS);
        results.push(...accepted);
      } catch(error) {
        results.push({batch:index+1,ids:batch.map(e=>e.id),candidates:batch.map(e=>({check:e.check,ref:e.ref})),error:String(error),matches:false});
      }
      save();
    }
  }
  console.log(`${values.preview ? "Preview, cannot authorize scoring" : "Full rubric gate"}: ${entries.length} candidates; ` +
    "Sol has no hard spending cap. Actual usage is priced after each call; missing usage remains unknown.");
  await Promise.all(Array.from({ length: 4 }, worker));
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
