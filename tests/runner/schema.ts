import { createGenerator } from "ts-json-schema-generator";
import { resolve } from "node:path";
import { REPO } from "./paths";
export function generateSchema() {
  return createGenerator({
    path: resolve(REPO, "tests/runner/types.ts"),
    tsconfig: resolve(REPO, "tsconfig.json"),
    type: "CaseFile",
    additionalProperties: false,
  }).createSchema("CaseFile");
}
if (import.meta.main) {
  const path = resolve(REPO, "tests/case.schema.json");
  const output = JSON.stringify(generateSchema(), null, 2) + "\n";
  if (Bun.argv.includes("--check")) {
    if ((await Bun.file(path).text()) !== output) throw new Error("case.schema.json is stale; run bun run schema");
  } else await Bun.write(path, output);
}
