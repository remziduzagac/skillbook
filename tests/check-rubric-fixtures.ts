import { fixtureEntries, fixtureBatches, loadingFixtureResults, runFixtureBatch } from "./runner/fixture-validation";
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
} });
const [output, calibration] = positionals;
const BATCH_CHARACTERS = 600_000;
const timeout = judgeTimeout(values["judge-timeout"]);
if (!output || !values.login)
  throw Error("usage: bun tests/check-rubric-fixtures.ts OUTPUT CALIBRATION --login (--book FILE | --historical) [--judge-timeout SECONDS]");
if (!values.book && !values.historical) throw Error("choose --book FILE for active validation or --historical");
if (values.book && values.historical) throw Error("choose one rubric scope");
const activeData = values.book ? JSON.parse(readFileSync(values.book, "utf8")) : undefined;
const activeIds = new Set<string>(activeData?.checks?.map((r: Event) => r.case) ?? []);
const activeCases = values.book ? loadCases().filter(c => activeIds.has(c.id)) : undefined;
const selectedBook = values.book ? activeRubricBook(values.book, activeCases!) : rubricFixtures;
const humanCalibration = requireCalibration(calibration);
validateRubricFixtures(selectedBook, activeCases);
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
  const entries = fixtureEntries(selectedBook,activeCases);
  const batches = fixtureBatches(entries,BATCH_CHARACTERS);
  const results: Event[] = loadingFixtureResults(entries);
  async function worker() {
    while (next < batches.length) {
      const index=next++, batch=batches[index]!;
      try {
        const accepted=await runFixtureBatch(call,batch,BATCH_CHARACTERS);
        results.push(...accepted);
      } catch(error) {
        results.push({batch:index+1,ids:batch.map(e=>e.id),candidates:batch.map(e=>({check:e.check,ref:e.ref})),error:String(error),matches:false});
      }
      writeFileSync(output,JSON.stringify({model:"gpt-6.1-sol",fixture_hash:rubricFixtureHash(selectedBook),humanCalibration,known_cost:known,unknown_cost_calls:unknown,
        expected_judgments:entries.length,results},null,2)+"\n");
    }
  }
  console.log("Rubric fixtures only: known-cost scheduling is unavailable for Sol; actual cost remains unknown.");
  await Promise.all(Array.from({ length: 4 }, worker));
} finally {
  await endRun(groups, join(root, "tmp"));
  rmSync(root, { recursive: true, force: true });
}
