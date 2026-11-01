import historicalBook from "../calibration/scenario-traces.json";
import { readFileSync } from "node:fs";
import { ruleChecks, resultChecks } from "./rule-checks";
import type { Case, Event } from "./types";

export interface RubricBook {
  scope?: "historical" | "active";
  sources: Record<string, Record<string, string>>;
  chapter_sources?: Record<string, Record<string, string>>;
  traces: Record<string, Event>;
  checks: { case: string; turn: number; id: string; tag: string; criterion: string;
    positive: string; negative: string; alternatives?: string[] }[];
}
// This immutable book is historical evidence; it has no dependency on executable cases.
export const rubricFixtures: RubricBook = historicalBook;
export function rubricTrace(ref: string, book: RubricBook = rubricFixtures, seen = new Set<string>()): Event {
  const trace = book.traces[ref];
  if (!trace) throw Error("missing rubric trace " + ref);
  if (seen.has(ref)) throw Error("cyclic rubric trace " + ref);
  seen.add(ref);
  if (!trace.base) return trace;
  const base = rubricTrace(trace.base, book, seen);
  return { ...base, observation: { ...base.observation, ...trace.observation } };
}
export function resolveRubricTrace(ref: string, book: RubricBook = rubricFixtures) {
  const trace = rubricTrace(ref, book);
  const sources = trace.chapter === undefined ? book.sources[trace.case] : book.chapter_sources?.[`${trace.case}:${trace.chapter}`];
  if (!sources) throw Error("missing rubric sources: " + trace.case);
  let files = { ...sources };
  const turns = [...(trace.prior ?? []), ref].map((key: string) => {
    const row = rubricTrace(key, book);
    if (row.case !== trace.case || row.chapter !== trace.chapter) throw Error("trace history crosses case or chapter");
    const observation = structuredClone(row.observation), before = { ...files };
    Object.assign(files, observation.files_changed);
    for (const removed of observation.files_removed ?? []) delete files[removed];
    return { ...observation, files_before: before, files_after: { ...files } };
  });
  return { sources, turns };
}
export function validateRubricFixtures(book: RubricBook = rubricFixtures, cases?: Case[]) {
  if (book.scope === "active" && !cases) throw Error("active rubric validation requires current cases");
  const expected = cases ? new Map<string, { tag: string; criterion: string }>(cases.flatMap(c => c.turns.flatMap((t, i) =>
    (t.rubric ?? []).map(r => [`${c.id}:${i + 1}:${r.id}`, r] as const)))) : undefined;
  if (!book.checks.length) throw Error("rubric book has no checks");
  const seen = new Set<string>();
  for (const row of book.checks) {
    const key = `${row.case}:${row.turn}:${row.id}`, criterion = expected?.get(key);
    if (seen.has(key) || !row.tag?.trim() || !row.criterion?.trim() ||
      expected && (!criterion || criterion.tag !== row.tag || criterion.criterion !== row.criterion))
      throw Error("rubric fixture does not match current criterion: " + key);
    seen.add(key);
    const refs = [row.positive, ...(row.alternatives ?? []), row.negative];
    if (new Set(refs).size !== refs.length) throw Error("rubric needs distinct correct/alternative/wrong traces");
    for (const ref of refs) {
      const trace = rubricTrace(ref, book);
      if (trace.case !== row.case) throw Error("rubric trace belongs to another case");
      resolveRubricTrace(ref, book);
    }
  }
  if (expected && seen.size !== expected.size) throw Error("rubric fixtures have uncovered checks");
  return seen.size;
}
export function activeRubricBook(path: string | undefined, cases: Case[]) {
  if (!path) throw Error("active scoring needs --rubric-book FILE; historical validation cannot enable active scoring");
  const book = JSON.parse(readFileSync(path, "utf8")) as RubricBook;
  if (book.scope !== "active") throw Error("active scoring requires an active rubric book");
  validateRubricFixtures(book, cases);
  return book;
}
export function rubricFixtureHash(book: RubricBook = rubricFixtures) {
  // Active judgments expire on semantic definition drift as well as trace/criterion drift.
  const data = book.scope === "active" ? { book, rules: ruleChecks(), results: resultChecks() } : book;
  return new Bun.CryptoHasher("sha256").update(JSON.stringify(data)).digest("hex");
}
export function rubricCandidates(book: RubricBook = rubricFixtures) {
  return book.checks.flatMap(row => [
    { ref: row.positive, expected: true },
    ...(row.alternatives ?? []).map(ref => ({ ref, expected: true })),
    { ref: row.negative, expected: false },
  ].map(candidate => ({ ...candidate, check: `${row.case}:${row.turn}:${row.id}` })));
}
export function validateRubricReport(report: Event, book: RubricBook = rubricFixtures) {
  const active = book.scope === "active";
  const expected = new Set(rubricCandidates(book).map(c => `${c.check}:${active ? c.ref : c.expected}`));
  if (report.model !== "gpt-6.1-sol" || report.fixture_hash !== rubricFixtureHash(book) ||
    !Array.isArray(report.results) || report.results.length !== expected.size)
    throw Error("rubric validation is incomplete or stale");
  const seen = new Set<string>();
  for (const row of report.results) {
    const key = `${row.check}:${active ? row.ref : row.expected}`;
    const candidate = rubricCandidates(book).find(c => c.check === row.check && (active ? c.ref === row.ref : c.expected === row.expected));
    if (!expected.has(key) || seen.has(key) || row.expected !== candidate?.expected || row.judgment?.verdict !== candidate?.expected)
      throw Error("rubric correct/wrong trace validation did not pass");
    seen.add(key);
  }
  return seen.size;
}
