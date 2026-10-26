import { join } from "node:path";
import { snapshot, fixtureText } from "./files";
import { FIXTURES } from "./paths";
import { progressFindings } from "./progress";
import { check } from "./checks";
import { evaluateTagged, score } from "./scoring";
import type { Case, Event, Verdict } from "./types";

// A full recorded delta from a known fixture establishes final path membership.
// Ignored paths and incomplete turns cannot establish absence through replay.
export function recheckScenario(original: Event, c: Case): Event {
  const result = structuredClone(original);
  result.expected_turns = c.turns.length;
  const present = new Set<string>(original.initial_paths ?? Object.keys(snapshot(join(FIXTURES, c.fixture))));
  result.replay_baseline = original.initial_paths ? "saved initial paths" : "current fixture assumed unchanged";
  result.fixture_sources ??= fixtureText(join(FIXTURES, c.fixture));
  const history: Record<string, Verdict> = {};
  let complete = true;
  for (const [index, observation] of result.turns.entries()) {
    const turn = c.turns[index];
    if (!turn) throw Error("saved run has more turns than current script");
    if (observation.scripted_message !== turn.prompt) throw Error("script changed; replay cannot compare these results");
    complete &&= observation.trace_complete !== false;
    for (const change of observation.changes ?? []) {
      const [kind, ...parts] = change.split(" "), path = parts.join(" ");
      if (kind === "removed") present.delete(path);
      else if (kind === "added" || kind === "changed") present.add(path);
    }
    observation.paths_present ??= {};
    for (const path of (turn.tagged_checks ?? []).flatMap(t => t.assert.absent ?? [])) {
      const ignored = path.split("/").some(p => [".git", ".agents", ".codex", ".claude", "__pycache__"].includes(p));
      observation.paths_present[path] ??= complete && !ignored ? present.has(path) : null;
    }
    observation.tagged_checks = evaluateTagged(turn.tagged_checks ?? [], observation, history, c.fixture);
    for (const row of [...observation.tagged_checks, ...(observation.judgments ?? [])])
      history[`${index + 1}:${row.id}`] = row.verdict;
  }
  result.checks = { ...Object.fromEntries(Object.entries(result.checks ?? {}).filter(([key]) => /^turn \d+:/.test(key))),
    ...check(c.checks, result, c.fixture) };
  result.progress_findings = progressFindings(result.turns);
  result.run_checks = c.suite && c.checks.names_no_skill ? [{
    id: "no-skill-names", tag: "habit:no-skill-names",
    verdict: result.checks?.["answer names no skill or skill file"] ?? null,
  }] : [];
  result.unreached_turn_checks = c.turns.slice(result.turns.length).flatMap((t, i) =>
    [...(t.tagged_checks ?? []), ...(t.rubric ?? [])].map(row => ({ turn: result.turns.length + i + 1, id: row.id, tag: row.tag, verdict: null })));
  result.scores = score([...result.turns.flatMap((t: Event) => [...t.tagged_checks, ...(t.judgments ?? [])]),
    ...result.unreached_turn_checks, ...result.run_checks]);
  result.rescored = "Current assertions; original scripts must match. Path absence uses recorded full deltas.";
  return result;
}
