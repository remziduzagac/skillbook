import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { finalAnswer, wordCount } from "./answers";
import type { Event, Verdict } from "./types";

// Compares one model's judged run with its own earlier judged run. It never ranks models and never judges length.
// A judged run file can be over 100 MB, so a file is read, reduced to a small digest and released before the next one.

export interface Digest {
  model: string;
  // judge -> "case#occurrence:turn" -> that turn's verdict per check
  judged: Record<string, Record<string, Record<string, Verdict>>>;
  // "case#occurrence:turn" -> final-answer words, the same for every judge
  words: Record<string, number>;
}
export interface Tally {
  fail: number;
  pass: number;
  undecided: number;
}
export interface JudgeComparison {
  judge: string;
  turns: number;
  checks: number;
  before: Tally;
  after: Tally;
  perCheck: Record<string, { before: Tally; after: Tally; decided: number; changed: number }>;
  decided: number;
  changed: number;
  flipShare: number | null;
  toFail: Change[];
  fromFail: Change[];
}
export interface Change {
  turn: string;
  check: string;
  before: Verdict;
  after: Verdict;
}
export interface Comparison {
  model: string;
  turns: number;
  judges: JudgeComparison[];
  onlyIn: { before: string[]; after: string[] };
  words: { turn: string; before: number; after: number }[];
  before: { median: number | null; total: number };
  after: { median: number | null; total: number };
}

const judgeName = (run: Event) => run.judge ? `${run.judge.agent}/${run.judge.model}` : "unrecorded judge";
const tally = (): Tally => ({ fail: 0, pass: 0, undecided: 0 });
const count = (t: Tally, v: Verdict) => { if (v === false) t.fail++; else if (v === true) t.pass++; else t.undecided++; };
const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b), mid = sorted.length >> 1;
  return !sorted.length ? null : sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
};

export function loadRuns(path: string): Event[] {
  const file = existsSync(path) && statSync(path).isDirectory() ? join(path, "summary.json") : path;
  const data = JSON.parse(readFileSync(file, "utf8"));
  return Array.isArray(data) ? data : [data];
}

// Reduce parsed runs to verdicts and word counts. Runs of one case and judge pair up by their order in the file.
export function digestRuns(runs: Event[]): Digest {
  const models = new Set(runs.map(r => `${r.agent}/${r.model}`));
  if (models.size !== 1) throw Error(`a run file must hold one agent and model; found ${[...models].join(", ") || "none"}`);
  const digest: Digest = { model: [...models][0]!, judged: {}, words: {} };
  const seen: Record<string, number> = {};
  for (const run of [...runs].sort((a, b) => (a.run ?? 0) - (b.run ?? 0))) {
    const judge = judgeName(run), slot = `${judge}|${run.case}`, occurrence = seen[slot] = (seen[slot] ?? -1) + 1;
    const turns = (digest.judged[judge] ??= {});
    for (const [index, turn] of (run.turns ?? []).entries()) {
      const key = `${run.case}#${occurrence + 1}:${turn.turn ?? index + 1}`;
      const verdicts: Record<string, Verdict> = {};
      for (const row of [...(turn.tagged_checks ?? []), ...(turn.judgments ?? [])]) verdicts[row.id] = row.verdict ?? null;
      turns[key] = verdicts;
      digest.words[key] ??= typeof turn.final_words === "number" ? turn.final_words : wordCount(finalAnswer(turn));
    }
  }
  return digest;
}

export function compareDigests(before: Digest, after: Digest): Comparison {
  if (before.model !== after.model)
    throw Error(`compare a model only with its own earlier run: ${before.model} and ${after.model} differ`);
  const bothTurns = Object.keys(before.words).filter(k => k in after.words);
  const judges: JudgeComparison[] = [];
  for (const judge of Object.keys(before.judged).filter(j => j in after.judged)) {
    const left = before.judged[judge]!, right = after.judged[judge]!;
    const turns = Object.keys(left).filter(k => k in right);
    const c: JudgeComparison = { judge, turns: turns.length, checks: 0, before: tally(), after: tally(), perCheck: {},
      decided: 0, changed: 0, flipShare: null, toFail: [], fromFail: [] };
    for (const turn of turns) for (const check of Object.keys(left[turn]!).filter(id => id in right[turn]!)) {
      const a = left[turn]![check]!, b = right[turn]![check]!;
      const row = (c.perCheck[check] ??= { before: tally(), after: tally(), decided: 0, changed: 0 });
      c.checks++; count(c.before, a); count(c.after, b); count(row.before, a); count(row.after, b);
      if (typeof a === "boolean" && typeof b === "boolean") {
        c.decided++; row.decided++;
        if (a !== b) { c.changed++; row.changed++; }
      }
      if (b === false && a !== false) c.toFail.push({ turn, check, before: a, after: b });
      if (a === false && b !== false) c.fromFail.push({ turn, check, before: a, after: b });
    }
    c.flipShare = c.decided ? c.changed / c.decided : null;
    judges.push(c);
  }
  const words = bothTurns.map(turn => ({ turn, before: before.words[turn]!, after: after.words[turn]! }));
  const summary = (values: number[]) => ({ median: median(values), total: values.reduce((sum, n) => sum + n, 0) });
  return { model: before.model, turns: bothTurns.length, judges,
    onlyIn: { before: Object.keys(before.judged).filter(j => !(j in after.judged)),
      after: Object.keys(after.judged).filter(j => !(j in before.judged)) },
    words, before: summary(words.map(w => w.before)), after: summary(words.map(w => w.after)) };
}

const share = (changed: number, decided: number) => decided ? `${changed}/${decided} (${(100 * changed / decided).toFixed(1)}%)` : "none decided in both";
const tallyText = (t: Tally) => `${t.fail} fail, ${t.pass} pass, ${t.undecided} undecided`;
const verdict = (v: Verdict) => v === null ? "undecided" : v === "not reached" ? "not reached" : v ? "pass" : "fail";

export function renderComparison(c: Comparison, names = { before: "before", after: "after" }): string {
  const lines = ["# Run comparison", "",
    `One model against its own earlier run: ${c.model}. It ranks nothing. Over the ${c.turns} turns both runs cover.`,
    `Before: ${names.before}. After: ${names.after}.`,
    "Undecided counts unknown and not reached verdicts. Length is a number to read, never a verdict.", ""];
  for (const side of ["before", "after"] as const) if (c.onlyIn[side].length)
    lines.push(`Judges only in the ${side} file, not compared: ${c.onlyIn[side].join(", ")}.`, "");
  if (!c.judges.length) lines.push("No judge appears in both files, so no checks are compared.", "");
  for (const j of c.judges) {
    lines.push(`## Judge ${j.judge}`, "",
      `${j.checks} checks over ${j.turns} turns, present in both runs.`, "",
      `- Before: ${tallyText(j.before)}`, `- After: ${tallyText(j.after)}`,
      `- Flip share: ${share(j.changed, j.decided)} of the checks decided in both runs changed.`, "",
      "### Checks that changed to fail", "",
      ...(j.toFail.length ? j.toFail.map(x => `- ${x.turn} ${x.check}: ${verdict(x.before)} to fail`) : ["- none"]), "",
      "### Checks that changed from fail", "",
      ...(j.fromFail.length ? j.fromFail.map(x => `- ${x.turn} ${x.check}: fail to ${verdict(x.after)}`) : ["- none"]), "",
      "### Per check", "",
      "| Check | Before | After | Flip share |", "| --- | --- | --- | --- |",
      ...Object.keys(j.perCheck).sort().map(id => {
        const r = j.perCheck[id]!;
        return `| ${id} | ${tallyText(r.before)} | ${tallyText(r.after)} | ${share(r.changed, r.decided)} |`;
      }), "");
  }
  lines.push("## Final-answer length", "",
    `- Before: median ${c.before.median ?? "none"} words, total ${c.before.total} words.`,
    `- After: median ${c.after.median ?? "none"} words, total ${c.after.total} words.`, "",
    "| Turn | Before | After |", "| --- | --- | --- |",
    ...c.words.map(w => `| ${w.turn} | ${w.before} | ${w.after} |`), "");
  return lines.join("\n");
}

// Load one file at a time so only one large file is in memory.
export function compareFiles(beforePath: string, afterPath: string): string {
  const before = digestRuns(loadRuns(beforePath));
  Bun.gc(true);
  const after = digestRuns(loadRuns(afterPath));
  return renderComparison(compareDigests(before, after), { before: beforePath, after: afterPath });
}
