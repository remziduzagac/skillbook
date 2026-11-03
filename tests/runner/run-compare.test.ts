import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { digestRuns, compareDigests, renderComparison, compareFiles, loadRuns } from "./run-compare";
import type { Event, Verdict } from "./types";

const sol = { agent: "codex", model: "gpt-6.1-sol" }, sonnet = { agent: "claude", model: "sonnet" };
// One turn: its final answer, an optional recorded count and one verdict per check id.
const turn = (n: number, answer: string, verdicts: Record<string, Verdict>, words?: number): Event => ({
  turn: n, final_answer: answer, ...(words === undefined ? {} : { final_words: words }),
  tagged_checks: [{ id: "automatic", tag: "habit:x", verdict: true }],
  judgments: Object.entries(verdicts).map(([id, verdict]) => ({ id, tag: "t", verdict })),
});
const run = (turns: Event[], judge: Event | null = sol, extra: Event = {}): Event =>
  ({ case: "festival", agent: "claude", model: "haiku", run: 1, ...(judge ? { judge } : {}), turns, ...extra });

const earlier = [run([
  turn(1, "one two three four", { point: true, glance: false, rule: null }),
  turn(2, "one two", { point: true, glance: true, rule: true }, 40),
  turn(3, "only in the earlier run", { point: false }),
])];
const later = [run([
  turn(1, "one two three four five six", { point: true, glance: true, rule: false }),
  turn(2, "one two", { point: false, glance: true, rule: "not reached" }, 100),
  turn(4, "only in the later run", { point: true }),
])];

test("counts fails, passes and undecided overall and per check, over the turns and checks both runs cover", () => {
  const c = compareDigests(digestRuns(earlier), digestRuns(later));
  expect(c.model).toBe("claude/haiku");
  expect(c.turns).toBe(2);
  const j = c.judges[0]!;
  expect(j.judge).toBe("codex/gpt-6.1-sol");
  expect(j.turns).toBe(2);
  // automatic, point, glance and rule on turns 1 and 2.
  expect(j.checks).toBe(8);
  expect(j.before).toEqual({ fail: 1, pass: 6, undecided: 1 });
  expect(j.after).toEqual({ fail: 2, pass: 5, undecided: 1 });
  expect(j.perCheck.point!.before).toEqual({ fail: 0, pass: 2, undecided: 0 });
  expect(j.perCheck.point!.after).toEqual({ fail: 1, pass: 1, undecided: 0 });
  expect(j.perCheck.rule!.before).toEqual({ fail: 0, pass: 1, undecided: 1 });
  expect(j.perCheck.rule!.after).toEqual({ fail: 1, pass: 0, undecided: 1 });
});

test("lists the checks that changed to or from fail and the flip share over checks decided in both", () => {
  const j = compareDigests(digestRuns(earlier), digestRuns(later)).judges[0]!;
  expect(j.toFail).toEqual([
    { turn: "festival#1:1", check: "rule", before: null, after: false },
    { turn: "festival#1:2", check: "point", before: true, after: false },
  ]);
  expect(j.fromFail).toEqual([{ turn: "festival#1:1", check: "glance", before: false, after: true }]);
  // Decided in both: automatic x2, point x2, glance x2, rule on turn 2 is undecided later and turn 1 earlier.
  expect(j.decided).toBe(6);
  expect(j.changed).toBe(2);
  expect(j.flipShare).toBeCloseTo(2 / 6);
  expect(j.perCheck.point).toMatchObject({ decided: 2, changed: 1 });
  expect(j.perCheck.rule).toMatchObject({ decided: 0, changed: 0 });
});

test("reports word counts over the shared turns: the recorded count first, the text count for older runs", () => {
  const c = compareDigests(digestRuns(earlier), digestRuns(later));
  expect(c.words).toEqual([{ turn: "festival#1:1", before: 4, after: 6 }, { turn: "festival#1:2", before: 40, after: 100 }]);
  expect(c.before).toEqual({ median: 22, total: 44 });
  expect(c.after).toEqual({ median: 53, total: 106 });
});

test("each judge is compared with its own earlier verdicts, and a judge in one file only is named, not compared", () => {
  const sonnetEarlier = run([turn(1, "a b", { point: false })], sonnet);
  const sonnetLater = run([turn(1, "a b", { point: true })], sonnet);
  const c = compareDigests(digestRuns([...earlier, sonnetEarlier]), digestRuns([...later, sonnetLater]));
  expect(c.judges.map(j => j.judge).sort()).toEqual(["claude/sonnet", "codex/gpt-6.1-sol"]);
  expect(c.judges.find(j => j.judge === "claude/sonnet")!.fromFail).toHaveLength(1);
  expect(c.judges.find(j => j.judge === "codex/gpt-6.1-sol")!.fromFail).toHaveLength(1);
  const solo = compareDigests(digestRuns([...earlier, sonnetEarlier]), digestRuns(later));
  expect(solo.judges.map(j => j.judge)).toEqual(["codex/gpt-6.1-sol"]);
  expect(solo.onlyIn).toEqual({ before: ["claude/sonnet"], after: [] });
  const text = renderComparison(solo);
  expect(text).toContain("Judges only in the before file, not compared: claude/sonnet.");
});

test("a model is compared only with itself, and a file holds one agent and model", () => {
  const other = [run([turn(1, "a", { point: true })], sol, { model: "sonnet" })];
  expect(() => compareDigests(digestRuns(earlier), digestRuns(other))).toThrow("its own earlier run");
  expect(() => digestRuns([...earlier, ...other])).toThrow("one agent and model");
  expect(() => digestRuns([])).toThrow("one agent and model");
});

test("runs of one case and judge pair by order, and a run with no recorded judge is its own judge", () => {
  const two = [run([turn(1, "a b", { point: true })], null), run([turn(1, "a b", { point: false })], null, { run: 2 })];
  const changed = [run([turn(1, "a b", { point: true })], null), run([turn(1, "a b", { point: true })], null, { run: 2 })];
  const c = compareDigests(digestRuns(two), digestRuns(changed));
  expect(c.turns).toBe(2);
  expect(c.judges[0]!.judge).toBe("unrecorded judge");
  expect(c.judges[0]!.fromFail).toEqual([{ turn: "festival#2:1", check: "point", before: false, after: true }]);
});

test("the report names counts, changes, flip share and words, and does not rank or judge length", () => {
  const text = renderComparison(compareDigests(digestRuns(earlier), digestRuns(later)), { before: "a.json", after: "b.json" });
  expect(text).toContain("Before: 1 fail, 6 pass, 1 undecided");
  expect(text).toContain("Flip share: 2/6 (33.3%)");
  expect(text).toContain("- festival#1:2 point: pass to fail");
  expect(text).toContain("- festival#1:1 glance: fail to pass");
  expect(text).toContain("| point | 0 fail, 2 pass, 0 undecided | 1 fail, 1 pass, 0 undecided | 1/2 (50.0%) |");
  expect(text).toContain("- After: median 53 words, total 106 words.");
  expect(text).toContain("| festival#1:2 | 40 | 100 |");
  expect(text).toContain("It ranks nothing.");
});

test("reads one run file at a time: an array, a single run, or a folder holding summary.json", () => {
  const dir = mkdtempSync(join(tmpdir(), "run-compare-"));
  try {
    const a = join(dir, "a.json"), b = join(dir, "run-1.json"), folder = join(dir, "judged");
    writeFileSync(a, JSON.stringify(earlier));
    writeFileSync(b, JSON.stringify(later[0]));
    mkdirSync(folder);
    writeFileSync(join(folder, "summary.json"), JSON.stringify(later));
    expect(loadRuns(b)).toHaveLength(1);
    const text = compareFiles(a, b);
    expect(text).toContain(`Before: ${a}. After: ${b}.`);
    expect(text).toContain("Flip share: 2/6 (33.3%)");
    expect(compareFiles(a, folder)).toContain("Flip share: 2/6 (33.3%)");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
