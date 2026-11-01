import { copiedExamples } from "./runner/examples";
import { REPO } from "./runner/paths";
const copied = copiedExamples(Bun.argv[2] ?? REPO);
for (const problem of copied) console.error(problem);
process.exitCode = copied.length ? 1 : 0;
