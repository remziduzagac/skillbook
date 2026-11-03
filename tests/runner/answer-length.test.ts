import { test, expect } from "bun:test";
import { wordCount, lengthSummary } from "./answers";
import { summarize } from "./reports";

test("a word is a token with a letter or digit, so Markdown markers add nothing", () => {
  expect(wordCount("")).toBe(0);
  expect(wordCount("   \n ")).toBe(0);
  expect(wordCount("## Plan\n- one two\n| --- | --- |\n| a | b |\n**yes**")).toBe(6);
  expect(wordCount("café costs $5, not 5\u00a0euros")).toBe(6);
});

test("length summary uses the recorded count when present and counts the text for older runs", () => {
  expect(lengthSummary([])).toEqual({ turns: 0, total: 0, median: null });
  expect(lengthSummary([{ final_answer: "one two three" }, { final_answer: "one" }, { final_answer: "a b c d e f" }]))
    .toEqual({ turns: 3, total: 10, median: 3 });
  // An even number of turns takes the middle pair; an old turn without final_words keeps working from its answer.
  expect(lengthSummary([{ final_words: 10, final_answer: "x" }, { answer: "two words" }, { final_words: 4, final_answer: "y" },
    { final_words: 100, final_answer: "z" }])).toEqual({ turns: 4, total: 116, median: 7 });
});

test("the report prints each run's median and total beside the scores and never judges length", () => {
  const run = (n: number, answers: string[]) => ({ case: "unit", agent: "codex", model: "m", run: n, cost: 0, checks: {},
    user_mode: "fixed", turns: answers.map(final_answer => ({ final_answer, tagged_checks: [{ id: "a", tag: "habit:x", verdict: true }] })) });
  const report = summarize([run(1, ["a b", "c d e f", "g"]), run(2, [])], 0);
  const scores = report.indexOf("## Scores: codex/m/fixed"), length = report.indexOf("## Final-answer length"),
    fit = report.indexOf("## Fixed-script fit");
  expect(scores).toBeGreaterThan(-1);
  expect(length).toBeGreaterThan(scores);
  expect(fit).toBeGreaterThan(length);
  expect(report).toContain("- unit, codex (m), run 1: median 2 words, total 7 words, over 3 turns");
  // A run with no turns has no length to report.
  expect(report).not.toContain("run 2: median");
  expect(report.slice(length, fit)).not.toMatch(/pass|fail|too long|too short/i);
});
