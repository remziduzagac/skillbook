import { readFileSync, writeFileSync } from "node:fs";
import {
  parse_events,
  skills_read,
  turn_answer,
  text_before_change,
  agents_started,
  agents_unseen,
  action_evidence,
  TARGET_KEYS,
} from "./trace";
import { check } from "./checks";
import { cost } from "./cost";
import type { Agent, Event } from "./types";
function observation(agent: Agent, events: Event[][], set: string, base: Event) {
  let [said, changed, uncertain] = text_before_change(agent, events);
  if (base.changes?.length && !changed && !uncertain) {
    said = "";
    uncertain = "a change no action shows";
  }
  return {
    ...base,
    agent,
    reads: [...skills_read(agent, events, null, set)].sort(),
    answer: events
      .map((t) => turn_answer(agent, t))
      .filter(Boolean)
      .join("\n\n"),
    before_change: said,
    changed_files: changed || !!base.changes?.length,
    sequencing_unknown: uncertain,
    agents_started: agents_started(agent, events),
    agents_unseen: agents_unseen(agent, events, uncertain === "a change no action shows"),
    targets: events
      .flatMap((t) => action_evidence(agent, t))
      .flatMap((a) =>
        Object.entries(a)
          .filter(([k, v]) => TARGET_KEYS.includes(k) && typeof v === "string")
          .map(([, v]) => v),
      ),
  };
}
export function replay(input: { rows: Event[]; skipped: Event[] }) {
  const mismatches: Event[] = [],
    folders: Record<string, { runs: number; matched: number; total: number }> = {};
  let total = 0,
    matched = 0;
  for (const r of input.rows) {
    const events = r.paths.map((p: string) => parse_events(readFileSync(p, "utf8"))),
      whole = observation(r.agent, events, r.set, r.base);
    const actual = check(r.checks, whole, r.fixture, null),
      expected: Record<string, unknown> = { ...r.expected };
    for (const [i, t] of (r.local as Event[]).entries()) {
      const local = check(t.checks, observation(r.agent, [events[i]], r.set, t.base), r.fixture, null);
      for (const [k, v] of Object.entries(t.expected)) expected[`turn ${i + 1}: ${k}`] = v;
      for (const [k, v] of Object.entries(local)) actual[`turn ${i + 1}: ${k}`] = v;
    }
    const f = (folders[r.folder] ??= { runs: 0, matched: 0, total: 0 });
    f.runs++;
    for (const name of new Set([...Object.keys(expected), ...Object.keys(actual)])) {
      total++;
      f.total++;
      if (expected[name] === actual[name]) {
        matched++;
        f.matched++;
      } else
        mismatches.push({
          folder: r.folder,
          case: r.case,
          run: r.run,
          check: name,
          python: expected[name],
          typescript: actual[name],
        });
    }
    if (JSON.stringify(whole.reads) !== JSON.stringify(r.reads))
      mismatches.push({ folder: r.folder, case: r.case, kind: "reads", python: r.reads, typescript: whole.reads });
    const estimated = cost(r.agent, r.model, events);
    if ((estimated === null) !== (r.cost === null) || (estimated !== null && Math.abs(estimated - r.cost) > 1e-12))
      mismatches.push({ folder: r.folder, case: r.case, kind: "cost", python: r.cost, typescript: estimated });
  }
  return {
    runs: input.rows.length,
    matched,
    total,
    mismatches,
    folders,
    skipped: input.skipped,
    limitations:
      "Deleted sandboxes cannot restore temporary or named paths. Those checks are replayed as unknown " +
      "or against paths still present, equally in both runners. Files and changes use retained observations; " +
      "reads, answers, sequence, actions, agents and costs are rebuilt from raw logs.",
  };
}
if (import.meta.main) {
  const result = replay(JSON.parse(readFileSync(Bun.argv[2]!, "utf8")));
  writeFileSync(Bun.argv[3] ?? "/tmp/skillbook-port-replay.json", JSON.stringify(result, null, 2) + "\n");
  console.log(
    `${result.matched}/${result.total} verdicts matched in ${result.runs} saved runs; ` +
      `${result.mismatches.length} mismatches`,
  );
  process.exitCode = result.mismatches.length ? 1 : 0;
}
