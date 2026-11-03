import { test, expect } from "bun:test";
import { check } from "./checks";
import { rubricJudge, rubricBatch, judgeEvidence } from "./scenario";
import { calibrationItems } from "./calibration";
import { progressFindings } from "./progress";
import { POINT_FIRST } from "./judgment-policy";

test("final-answer checks ignore skill names in progress, but not in a known final answer", () => {
  const t = { answer: "Using act-guardrails.\nDone.", final_answer: "Done.",
    between_tools: ["Using act-guardrails."] };
  expect(check({ names_no_skill: true }, { agent: "codex", turns: [t] })["answer names no skill or skill file"])
    .toBe(true);
  t.final_answer = "I'll load the essentials skill.\nDone.";
  expect(check({ names_no_skill: true }, { agent: "codex", turns: [t] })["answer names no skill or skill file"])
    .toBe(false);
});
test("judge inputs use current final answers while retaining unscored progress as evidence", async () => {
  const evidence = judgeEvidence([{ final_answer: "Current result.", between_tools: ["Working."],
    agents_started: 1, agents_unseen: true,
    judgments: [{ verdict: false }] }]);
  const request = { rubric: { id: "p", tag: "habit:point-first", criterion: POINT_FIRST },
    answer: "Working.\nCurrent result.", evidence };
  const call = async (instruction: string, data: any) => {
    expect(instruction).toContain("Judge only the current turn");
    expect(instruction).toContain("Progress in between_tools is unscored");
    expect(data.answer).toBe("Current result.");
    expect(data.evidence.turns[0].between_tools).toEqual(["Working."]);
    expect(data.evidence.turns[0]).not.toHaveProperty("judgments");
    expect(data.evidence.turns[0].agents_started).toBe(1);
    expect(data.evidence.turns[0].agents_unseen).toBe(true);
    return data.criteria ? { results: [{ id: "p", verdict: true, reason: "direct" }] } :
      { verdict: true, reason: "direct" };
  };
  expect((await rubricJudge(call, request)).verdict).toBe(true);
  expect((await rubricBatch(call, [request]))[0]!.verdict).toBe(true);
  expect(calibrationItems({ samples: [{ id: "s", human: true, prompt: "Report", ...request,
    criterion: request.rubric }] })[0]!.answer).toBe("Current result.");
});
test("progress flags are review aids and never verdicts", () => {
  const findings = progressFindings([{ between_tools: ["Using act-guardrails.", "I'll check it.", "word ".repeat(50)] }]);
  expect(findings.map(f => f.flags)).toEqual([["internal-skill"], ["unclear-reference"], ["long"]]);
  expect(findings.every(f => f.scored === false && !("verdict" in f))).toBe(true);
});
