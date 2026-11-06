import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { filledFullReport } from "./runner/gate-fill";
// Completes a full gate whose judge replies failed in a few batches, from a preview of only those candidates.
const [full, preview, output] = Bun.argv.slice(2);
if (!full || !preview || !output) throw Error("usage: bun tests/fill-rubric-gate.ts FULL_REPORT PREVIEW_REPORT OUTPUT");
if ([full, preview].some(p => resolve(p) === resolve(output))) throw Error("write the filled report to a new output");
const read = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const report = filledFullReport(read(full), read(preview), preview);
writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
console.log(`Filled ${report.filled.candidates.length} errored candidates from ${preview}; ` +
  "the report is a full gate again.");
