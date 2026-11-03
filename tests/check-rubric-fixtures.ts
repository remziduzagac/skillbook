import { fixtureEntries, fixtureBatches, fixtureManifest, candidateKey, rerunFixtureMisses, previewEntries, loadingFixtureResults, runFixtureBatch, FIXTURE_RETRY_POLICY } from "./runner/fixture-validation";
import { parseArgs } from "node:util";
import { judgeTimeout } from "./runner/judge-options";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { requireCalibration } from "./runner/calibration";
import { rubricFixtures, validateRubricFixtures, rubricFixtureHash, activeRubricBook, rubricMisses } from "./runner/rubric-fixtures";
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
  "rerun-misses": { type: "string" },
} });
const [output, calibration] = positionals;
const BATCH_CHARACTERS = 600_000;
const timeout = judgeTimeout(values["judge-timeout"]);
if (!output || !values.login && !values["dry-run"])
  throw Error("usage: bun tests/check-rubric-fixtures.ts OUTPUT CALIBRATION --login (--book FILE | --historical) [--preview --candidates FILE | --since REPORT [--baseline-book FILE] | --rerun-misses FULL_REPORT] [--dry-run] [--judge-timeout SECONDS]");
if (values["rerun-misses"] && (values.preview || values.candidates || values.since || values["baseline-book"]))
  throw Error("--rerun-misses cannot be combined with preview selectors");
if ((values.candidates || values.since || values["baseline-book"]) && !values.preview ||
  values["dry-run"] && !values.preview && !values["rerun-misses"])
  throw Error("candidate selection and dry runs require --preview or --rerun-misses");
if (values["baseline-book"] && !values.since) throw Error("--baseline-book requires --since REPORT");
if (values["rerun-misses"] && resolve(output) === resolve(values["rerun-misses"]))
  throw Error("reruns need a new output; preserve the original full report");
if (!values.book && !values.historical) throw Error("choose --book FILE for active validation or --historical");
if (values.book && values.historical) throw Error("choose one rubric scope");
const activeData = values.book ? JSON.parse(readFileSync(values.book, "utf8")) : undefined;
const activeIds = new Set<string>(activeData?.checks?.map((r: Event) => r.case) ?? []);
const activeCases = values.book ? loadCases().filter(c => activeIds.has(c.id)) : undefined;
const selectedBook = values.book ? activeRubricBook(values.book, activeCases!) : rubricFixtures;
validateRubricFixtures(selectedBook, activeCases);
const allEntries = fixtureEntries(selectedBook,activeCases);
const baseline = values["baseline-book"] ? fixtureEntries(JSON.parse(readFileSync(values["baseline-book"],"utf8")),activeCases) : undefined;
const full = values["rerun-misses"] ? JSON.parse(readFileSync(values["rerun-misses"],"utf8")) : undefined;
const missed = values["rerun-misses"] !== undefined ? new Set(rubricMisses(full,selectedBook).map(candidateKey)) : undefined;
const entries = missed ? allEntries.filter(e=>missed.has(candidateKey(e))) : values.preview ? previewEntries(allEntries,
  values.candidates ? JSON.parse(readFileSync(values.candidates,"utf8")) : [],
  values.since ? JSON.parse(readFileSync(values.since,"utf8")) : undefined,baseline) : allEntries;
const batches = fixtureBatches(entries,BATCH_CHARACTERS), manifest = fixtureManifest(entries);
const mode=full ? "rerun" : values.preview ? "preview" : "full";
const reportBase = {mode, ...(mode!=="full" ? {scoring_authorized:false} : {}),
  model:"gpt-6.1-sol",fixture_hash:rubricFixtureHash(selectedBook),expected_judgments:entries.length,candidates:manifest,
  retry_policy:FIXTURE_RETRY_POLICY};
if (values["dry-run"]) {
  writeFileSync(output,JSON.stringify({...reportBase,status:"planned",model_calls:0,
    ...(full ? {rounds:2} : {}),batches:batches.map(batch=>batch.map(entry=>entry.id)),results:[]},null,2)+"\n");
  console.log(`${full ? "Rerun plan" : "Preview only"}: ${entries.length} candidates, ${batches.length} batches` +
    `${full ? " per round, two rounds" : ""}; no model calls; cannot authorize scoring.`);
  process.exit(0);
}
const humanCalibration = requireCalibration(calibration);
const root = mkdtempSync(join(tmpdir(), "skillbook-rubrics-")), groups: number[] = [];
let known = 0, unknown = 0;
try {
  const home = join(root, "home"), work = join(root, "work"), tmp = join(root, "tmp");
  for (const p of [join(home, ".codex"), work, tmp]) mkdirSync(p, { recursive: true });
  copyFileSync(ownLogin("codex"), join(home, ".codex", "auth.json"));
  writeFileSync(join(home, ".codex", "config.toml"),
    '[features]\napps = false\nplugins = false\nremote_plugin = false\n');
  const call = structuredCall(work, agentEnv(home, "codex", true, tmp), timeout, groups, amount => {
    known += amount ?? 0; unknown += Number(amount === null);
  });
  const save=(report:Event)=>writeFileSync(output,JSON.stringify(report,null,2)+"\n");
  async function round(phaseEntries:typeof entries, ordinal:number|undefined, checkpoint:(report:Event)=>void) {
    let next=0;
    const startKnown=known,startUnknown=unknown,results:Event[]=loadingFixtureResults(phaseEntries),retries:Event[]=[];
    const phaseBatches=fixtureBatches(phaseEntries,BATCH_CHARACTERS);
    const report=()=>({...reportBase,...(ordinal ? {round:ordinal} : {}),humanCalibration,
      expected_judgments:phaseEntries.length,candidates:fixtureManifest(phaseEntries),
      known_cost:known-startKnown,unknown_cost_calls:unknown-startUnknown,retries,results});
    checkpoint(report());
    async function worker() {
      while (next < phaseBatches.length) {
        if (rubricFixtureHash(selectedBook)!==reportBase.fixture_hash) throw Error("rubric contract changed during validation");
        const index=next++,batch=phaseBatches[index]!;
        try {results.push(...await runFixtureBatch(call,batch,BATCH_CHARACTERS,{onRetry:retry=>{
          retries.push({batch:index+1,candidates:batch.map(e=>({check:e.check,ref:e.ref})),...retry});
          checkpoint(report());
        }}));}
        catch(error) {results.push({batch:index+1,ids:batch.map(e=>e.id),
          candidates:batch.map(e=>({check:e.check,ref:e.ref})),error:String(error),matches:false});}
        checkpoint(report());
      }
    }
    await Promise.all(Array.from({length:4},worker));
    return report();
  }
  console.log(`${full ? "Two reruns of full-report misses" : values.preview ? "Preview, cannot authorize scoring" : "Full rubric gate"}: ` +
    `${entries.length} candidates; Sol has no hard spending cap. Usage is priced after calls; missing usage remains unknown.`);
  if (full) {
    const saveCombined=(report:Event)=>save({...report,known_cost:(full.known_cost??0)+known,
      unknown_cost_calls:(full.unknown_cost_calls??0)+unknown});
    const result=await rerunFixtureMisses(full,selectedBook,allEntries,
      (selected,ordinal,checkpoint)=>round(selected,ordinal,checkpoint),saveCombined);
    console.log(`Noise: ${result.noise_candidates.length}; blocking misses: ${result.blocking_candidates.length}; ` +
      `measured flips ${result.flip_rate.changed}/${result.flip_rate.compared} (${(100*result.flip_rate.rate).toFixed(1)}%).`);
  } else await round(entries,undefined,save);
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
