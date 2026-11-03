import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { copiedExamples } from "./examples";
test("YAML example guard parses quotes, folded prompts and deliberate exemptions", () => {
  const root = mkdtempSync(join(tmpdir(), "example-guard-"));
  try {
    for (const p of ["tests/cases/demo", "skills/demo"]) mkdirSync(join(root, p), {recursive: true});
    writeFileSync(join(root, "skills/demo/SKILL.md"), '# demo\nFor example, "Check this contract".');
    const path = join(root, "tests/cases/demo/example.yaml");
    for (const prompt of ['"Check this contract."', '>\n      Check this contract.']) {
      writeFileSync(path, `turns:\n  - prompt: ${prompt}\n`);
      expect(copiedExamples(root)).toHaveLength(1);
      writeFileSync(path, `uses_skill_example: true\nturns:\n  - prompt: ${prompt}\n`);
      expect(copiedExamples(root)).toEqual([]);
    }
    writeFileSync(path, 'turns:\n  - prompt: Inspect the invoice.\n');
    expect(copiedExamples(root)).toEqual([]);
  } finally { rmSync(root, {recursive: true, force: true}); }
});
