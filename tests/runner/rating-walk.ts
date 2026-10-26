import { finalAnswer } from "./answers";
import type { Event } from "./types";

// Allowlisted fields keep stored judge labels out of a blind rating walk.
export function ratingItem(run: Event, index: number, check: Event, set: "tuning" | "heldout") {
  const turn = run.turns[index];
  return {
    id: `${run.case}|${run.model}|${run.run}|${run.user_mode}|${index + 1}|${check.id}`,
    set, scenario: run.case, model: run.model, run: run.run, user_mode: run.user_mode,
    turn: index + 1, prompt: turn.sent_message ?? turn.scripted_message,
    conversation_so_far: run.turns.slice(0, index).map((t: Event, i: number) => ({
      turn: i + 1, prompt: t.sent_message ?? t.scripted_message,
      answer_excerpt: finalAnswer(t).length > 500 ? finalAnswer(t).slice(0, 500) + "… [excerpt]" : finalAnswer(t),
    })),
    answer: finalAnswer(turn),
    file_changes: { paths: turn.changes ?? [], diffs: turn.file_diffs ?? {}, files: turn.files ?? {} },
    source_files: run.fixture_sources ?? {},
    check: { id: check.id, tag: check.tag, ...(check.criterion ? { criterion: check.criterion } : {}),
      ...(check.assert ? { assert: check.assert } : {}) },
  };
}
export function isHeldoutScenario(id: string) { return /\/scenario-(03|07|14)-/.test(id); }
export function heldoutRuns(runs: Event[]) {
  const selected = new Map<string, Event>();
  for (const run of runs) {
    if (!isHeldoutScenario(run.case) || run.model !== "gpt-6-luna" || run.user_mode !== "fixed") continue;
    const prior = selected.get(run.case);
    if (!prior || run.run < prior.run) selected.set(run.case, run);
  }
  if (selected.size !== 3) throw Error("need one fixed Luna run for each held-out scenario");
  return [...selected.values()].sort((a, b) => a.case.localeCompare(b.case));
}
