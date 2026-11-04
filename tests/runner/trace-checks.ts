import { resolveRubricTrace, type RubricBook } from "./rubric-fixtures";
import { check } from "./checks";
import { cached } from "./paths";
import type { Checks, Event, Observation, Verdict } from "./types";

// Trace observation fields that carry the evidence a live run records after a turn. A field the trace leaves out
// stays absent, so the checks that need it give unknown, never a pass.
export const TRACE_EVIDENCE = ["test_runs", "commits", "tags", "head", "left_running"] as const;

// One trace turn as the observation live checks read: the project after the turn, the chapter's checkpoint and
// the turn's start, the change list, the answer and the recorded evidence. Python's caches are skipped, as live.
export function traceObservation(ref: string, book: RubricBook, checks: Checks = {}): Observation {
  const trace = resolveRubricTrace(ref, book), row: Event = trace.turns.at(-1)!;
  const keep = (files: Record<string, string> = {}) => Object.fromEntries(Object.entries(files).filter(([p]) => !cached(p)));
  const before = keep(row.files_before), after = keep(row.files_after), checkpoint = keep(trace.sources);
  const changes = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(p => before[p] !== after[p]).sort()
    .map(p => `${!(p in after) ? "removed" : p in before ? "changed" : "added"} ${p}`);
  const present = (p: string) => p in after || Object.keys(after).some(k => k.startsWith(p.replace(/\/$/, "") + "/"));
  const evidence = Object.fromEntries(TRACE_EVIDENCE.filter(k => row[k] !== undefined).map(k => [k, row[k]]));
  return {
    reads: [], targets: [], agents_started: 0, agents_unseen: false, before_change: "", changed_files: changes.length > 0,
    sequencing_unknown: "", answer: row.final_answer ?? "", final_answer: row.final_answer ?? "",
    files: after, project_snapshot: after, baseline_files: checkpoint, baseline_snapshot: checkpoint,
    start_files: before, start_snapshot: before, changes,
    paths_present: Object.fromEntries([...Object.keys(after), ...(checks.absent ?? [])].map(p => [p, present(p)])),
    left_running: null, ...evidence, turn: row.turn, chapter: row.chapter,
  };
}
// A turn's automatic checks on a trace, through the same evaluation as a live run.
export function traceChecks(checks: Checks, ref: string, book: RubricBook): Record<string, Verdict> {
  const observation = traceObservation(ref, book, checks), row = resolveRubricTrace(ref, book).turns.at(-1)!;
  return check(checks, observation, null, Array.isArray(row.tmp_paths) ? row.tmp_paths : null);
}
