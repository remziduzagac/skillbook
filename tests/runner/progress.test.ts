import { test, expect } from "bun:test";
import { check } from "./checks";
import { progressFindings } from "./progress";

test("final-answer checks ignore skill names in progress, but not in a known final answer", () => {
  const t = { answer: "Using act-guardrails.\nDone.", final_answer: "Done.",
    between_tools: ["Using act-guardrails."] };
  expect(check({ names_no_skill: true }, { agent: "codex", turns: [t] })["answer names no skill or skill file"])
    .toBe(true);
  t.final_answer = "I'll load the essentials skill.\nDone.";
  expect(check({ names_no_skill: true }, { agent: "codex", turns: [t] })["answer names no skill or skill file"])
    .toBe(false);
});
test("progress flags are review aids and never verdicts", () => {
  const findings = progressFindings([{ between_tools: ["Using act-guardrails.", "I'll check it.", "word ".repeat(50)] }]);
  expect(findings.map(f => f.flags)).toEqual([["internal-skill"], ["unclear-reference"], ["long"]]);
  expect(findings.every(f => f.scored === false && !("verdict" in f))).toBe(true);
});
