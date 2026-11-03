import { writeFileSync } from "node:fs";
import { compareFiles } from "./runner/run-compare";

// Compares one model's judged run with its own earlier judged run. It ranks nothing.
const [before, after, output] = Bun.argv.slice(2);
try {
  if (!before || !after || before === after)
    throw Error("usage: bun tests/compare-runs.ts BEFORE AFTER [OUTPUT.md]; each is a judged run file or its folder");
  const report = compareFiles(before, after);
  if (output) writeFileSync(output, report); else console.log(report);
} catch (error) {
  console.error(String(error));
  process.exitCode = 1;
}
