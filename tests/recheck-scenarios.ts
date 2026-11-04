import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { loadCases } from "./runner/cases";
import { recheckScenario, requireSavedCases } from "./runner/recheck";
import { summarize } from "./runner/reports";
import { scoresByCase } from "./runner/scoring";
const { values, positionals } = parseArgs({ args: Bun.argv.slice(2), allowPositionals: true,
  options: { case: { type: "string", default: "" } } });
const [source, output] = positionals;
if (!source || !output || source === output) throw Error("usage: bun tests/recheck-scenarios.ts SOURCE NEW_OUTPUT [--case TEXT]");
const cases = new Map(loadCases().map(c => [c.id, c]));
const original = existsSync(join(source, "summary.json")) ? JSON.parse(readFileSync(join(source, "summary.json"), "utf8")) :
  readdirSync(source).filter(p => /^run-\d+\.json$/.test(p)).map(p => JSON.parse(readFileSync(join(source, p), "utf8")));
const selected = original.filter((r: any) => r.case.includes(values.case!));
if (!selected.length) throw Error(`no saved run matches --case ${values.case}`);
requireSavedCases(selected, cases);
const runs = selected.map((r: any) => recheckScenario(r, cases.get(r.case)!));
mkdirSync(output, { recursive: true });
writeFileSync(join(output, "summary.json"), JSON.stringify(runs, null, 2) + "\n");
writeFileSync(join(output, "scores.json"), JSON.stringify(scoresByCase(runs), null, 2) + "\n");
writeFileSync(join(output, "summary.md"), summarize(runs, runs.reduce((n: number, r: any) => n + (r.cost ?? 0), 0),
  runs.filter((r: any) => r.cost_unknown).length));
console.log(`rescored ${runs.length} saved runs; originals preserved`);
