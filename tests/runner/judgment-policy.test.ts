import { test, expect } from "bun:test";
import { check } from "./checks";
import { rubricJudge, rubricBatch, judgeEvidence } from "./scenario";
import { calibrationItems } from "./calibration";
import { progressFindings } from "./progress";
import { loadCases } from "./cases";
import { POINT_FIRST, CLEAR_AT_A_GLANCE, REQUESTED_SCOPE } from "./judgment-policy";

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
    judgments: [{ verdict: false }] }]);
  const request = { rubric: { id: "p", tag: "habit:point-first", criterion: POINT_FIRST },
    answer: "Working.\nCurrent result.", evidence };
  const call = async (instruction: string, data: any) => {
    expect(instruction).toContain("Judge only the current turn");
    expect(instruction).toContain("Progress in between_tools is unscored");
    expect(data.answer).toBe("Current result.");
    expect(data.evidence.turns[0].between_tools).toEqual(["Working."]);
    expect(data.evidence.turns[0]).not.toHaveProperty("judgments");
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
test("every scenario turn uses the three shared checks without inheriting quality failures", () => {
  for (const c of loadCases("scenario-")) for (const turn of c.turns) {
    expect(turn.rubric!.find(r => r.id === "point")!.criterion).toBe(POINT_FIRST);
    expect(turn.rubric!.find(r => r.id === "glance")!.criterion).toBe(CLEAR_AT_A_GLANCE);
    expect(turn.rubric!.find(r => r.id === "scope")!.criterion).toBe(REQUESTED_SCOPE);
    expect(turn.rubric!.every(r => !r.depends_on)).toBe(true);
    for (const r of turn.rubric!) {
      if (/For requested reasons/.test(r.criterion)) expect(r.criterion).toContain("give no basis");
      if (r.tag.startsWith("skill:understand-discuss") || r.tag.startsWith("skill:understand-clarify-") ||
        r.tag === "skill:respond-ask") expect(r.criterion).toContain("choice stays with the user");
    }
  }
});
