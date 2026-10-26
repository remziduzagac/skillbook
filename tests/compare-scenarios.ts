import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { compareModes, offScriptCases } from "./runner/comparison";

const [output, ...folders] = Bun.argv.slice(2);
if (!output || !folders.length) throw Error("usage: bun tests/compare-scenarios.ts OUTPUT FOLDER...");
const runs = folders.flatMap(folder => existsSync(join(folder, "summary.json")) ?
  JSON.parse(readFileSync(join(folder, "summary.json"), "utf8")) :
  readdirSync(folder).filter(p => /^run-\d+\.json$/.test(p))
    .map(p => JSON.parse(readFileSync(join(folder, p), "utf8"))));
writeFileSync(output, compareModes(runs));
console.log(JSON.stringify({ runs: runs.length, rerun_simulated: offScriptCases(runs) }));
