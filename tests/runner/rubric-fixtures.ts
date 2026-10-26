import book from "../calibration/scenario-traces.json";
import { loadCases } from "./cases";
import type { Event } from "./types";

export const rubricFixtures = book;
export function resolveRubricTrace(ref: string) {
  const traces = book.traces as Record<string, Event>, trace = traces[ref];
  if (!trace) throw Error("missing rubric trace " + ref);
  const sources = (book.sources as Record<string, Record<string, string>>)[trace.case]!;
  let files = { ...sources };
  const turns = [...trace.prior, ref].map((key: string) => {
    const observation = structuredClone(traces[key]!.observation), before = { ...files };
    Object.assign(files, observation.files_changed);
    for (const removed of observation.files_removed) delete files[removed];
    return { ...observation, files_before: before, files_after: { ...files } };
  });
  return { sources, turns };
}
export function validateRubricFixtures() {
  const expected = new Map<string, { tag: string; criterion: string }>(loadCases("scenario-").flatMap(c => c.turns.flatMap((t, i) =>
    (t.rubric ?? []).map(r => [`${c.id}:${i + 1}:${r.id}`, r] as const))));
  const seen = new Set<string>();
  for (const row of book.checks) {
    const key = `${row.case}:${row.turn}:${row.id}`, criterion = expected.get(key);
    if (!criterion || criterion.tag !== row.tag || criterion.criterion !== row.criterion || seen.has(key))
      throw Error("rubric fixture does not match current criterion: " + key);
    seen.add(key);
    resolveRubricTrace(row.positive);
    resolveRubricTrace(row.negative);
    if (row.positive === row.negative) throw Error("rubric needs distinct correct/wrong traces");
  }
  if (seen.size !== expected.size) throw Error("rubric fixtures have uncovered checks");
  return seen.size;
}

export function rubricFixtureHash() {
  return new Bun.CryptoHasher("sha256").update(JSON.stringify(book)).digest("hex");
}
export function validateRubricReport(report: Event) {
  const expected = new Set(book.checks.flatMap(row => [true, false].map(value =>
    `${row.case}:${row.turn}:${row.id}:${value}`)));
  if (report.model !== "gpt-6.1-sol" || report.fixture_hash !== rubricFixtureHash() ||
    !Array.isArray(report.results) || report.results.length !== expected.size)
    throw Error("rubric validation is incomplete or stale");
  const seen = new Set<string>();
  for (const row of report.results) {
    const key = `${row.check}:${row.expected}`;
    if (!expected.has(key) || seen.has(key) || row.judgment?.verdict !== row.expected)
      throw Error("rubric correct/wrong trace validation did not pass");
    seen.add(key);
  }
  return seen.size;
}
