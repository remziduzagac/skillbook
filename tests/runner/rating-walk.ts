import { finalAnswer } from "./answers";
import type { Event } from "./types";

const short = (value: unknown, limit = 240) => {
  const text = (typeof value === "string" ? value : JSON.stringify(value) ?? "unknown").replace(/\s+/g, " ").trim();
  return text.length > limit ? text.slice(0, limit) + "… [cut]" : text;
};

export function actionList(turn: Event): string[] {
  const actions: Event[] = turn.actions ?? [];
  // Started/completed events describe one action. Keep unmatched starts as unknown.
  const pending: Event[] = [], recorded: Event[] = [];
  const key = (a: Event) => JSON.stringify([a.tool, a.command, a.call, a.receiver_thread_ids]);
  for (const action of actions) {
    if (action.phase === "item.started") { pending.push(action); continue; }
    const start = pending.findIndex(a => key(a) === key(action));
    if (start >= 0) pending.splice(start, 1);
    recorded.push(action);
  }
  const rows = [...recorded, ...pending].map(a => {
    if (a.command) return `Command (exit ${a.exit_code ?? a.status ?? "unknown"}): ${short(a.command)}` +
      (a.output || a.aggregated_output ? ` → ${short(a.output ?? a.aggregated_output, 120)}` : "");
    if (a.tool === "collab_tool_call") return `Helper ${a.call ?? "call"} (${a.status ?? "unknown"}): ` +
      `${short(a.receiver_thread_ids ?? [])} → ${short(a.agents_states ?? "result unavailable")}`;
    return `${a.tool ?? "Action"} (${a.status ?? a.phase ?? "unknown"}): ${short(a.changes ?? a.path ?? a.file_path ?? a.call ?? "details unavailable")}`;
  });
  for (const path of new Set<string>(turn.reads ?? [])) rows.push(`Read: ${short(path)}`);
  return rows;
}

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
    actions: actionList(turn),
    action_evidence: { trace_complete: turn.trace_complete ?? null, helpers_unseen: turn.agents_unseen ?? null },
    file_changes: { paths: turn.changes ?? [], diffs: turn.file_diffs ?? {}, files: turn.files ?? {} },
    source_files: run.fixture_sources ?? {},
    check: { id: check.id, tag: check.tag, ...(check.criterion ? { criterion: check.criterion } : {}),
      ...(check.assert ? { assert: check.assert } : {}) },
  };
}

// Pick from rubric metadata only, without looking at answers or judgment labels.
export function walkChecks(checks: Event[], turn: number): Event[] {
  const task = checks.filter(c => c.criterion && c.tag?.startsWith("skill:"));
  const habits = checks.filter(c => c.criterion && !c.tag?.startsWith("skill:"));
  const selected = task.slice(0, 2);
  if (habits.length) selected.push(habits[turn % habits.length]!);
  for (const check of checks) {
    if (selected.length >= 3) break;
    if (check.criterion && !selected.includes(check)) selected.push(check);
  }
  return selected;
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
