import { join } from "node:path";
import { snapshot, fixtureText } from "./files";
import { FIXTURES } from "./paths";
import { chapterAt } from "./chapters";
import { progressFindings } from "./progress";
import { check } from "./checks";
import { evaluateTagged, score } from "./scoring";
import type { Case, Event, Verdict } from "./types";

function requireSavedLayout(run: Event, c: Case) {
  if (c.chapters) for (const [index,turn] of (run.turns ?? []).entries()) {
    const number=turn.turn ?? index+1, chapter=chapterAt(c,number);
    const fresh=chapter?.start_turn===number || c.turns[number-1]?.fresh_session===true;
    if (turn.chapter!==chapter?.number || typeof turn.fresh_session==="boolean" && turn.fresh_session!==fresh)
      throw Error(`saved chapter/session layout differs at turn ${number}; use the saved run's matching case revision`);
  }
}
export function requireSavedCases(runs: Event[], cases: Map<string, Case>) {
  for (const run of runs) {
    const c=cases.get(run.case);
    if (!c) throw Error(`missing or retired case: ${run.case}; recheck historical runs in the essentials-old-tests checkout`);
    requireSavedLayout(run,c);
  }
}
// Replays use saved checkpoints. Current disk fixtures are a legacy fallback only.
export function recheckScenario(original: Event, c: Case): Event {
  if (!c) throw Error(`missing or retired case: ${original.case}`);
  requireSavedLayout(original,c);
  const result = structuredClone(original);
  const selected: number[] = original.selected_turns ?? c.turns.map((_, i) => i + 1);
  result.expected_turns = selected.length;
  let present = new Set<string>(original.initial_paths ?? Object.keys(snapshot(join(FIXTURES, c.fixture))));
  result.replay_baseline = original.initial_paths ? "saved initial paths" : "current fixture assumed unchanged";
  result.fixture_sources ??= fixtureText(join(FIXTURES, c.fixture));
  const history: Record<string, Verdict> = {}, turnChecks: Record<string, Verdict> = {};
  let complete = true, chapter: number | undefined;
  for (const [index, observation] of result.turns.entries()) {
    const number = observation.turn ?? index + 1, turn = c.turns[number - 1];
    if (!turn || !selected.includes(number)) throw Error("saved run has an unexpected turn");
    if (observation.scripted_message !== turn.prompt) throw Error("script changed; replay cannot compare these results");
    const currentChapter = chapterAt(c, number)?.number;
    if (currentChapter !== chapter) {
      const saved = original.chapter_checkpoints?.[currentChapter!];
      if (!saved) throw Error(`missing saved checkpoint for chapter ${currentChapter}`);
      present = new Set(saved.paths); complete = true; chapter = currentChapter;
      for (const key of Object.keys(history)) delete history[key];
    }
    const checkpoint = original.chapter_checkpoints?.[chapter!];
    observation.baseline_files ??= checkpoint?.sources ?? result.fixture_sources;
    observation.baseline_snapshot ??= checkpoint?.snapshot;
    complete &&= observation.trace_complete !== false;
    for (const change of observation.changes ?? []) {
      const [kind, ...parts] = change.split(" "), path = parts.join(" ");
      if (kind === "removed") present.delete(path);
      else if (kind === "added" || kind === "changed") present.add(path);
    }
    observation.paths_present ??= {};
    for (const path of [turn.checks, ...(turn.tagged_checks ?? []).map(t => t.assert)].flatMap(a => a?.absent ?? [])) {
      const ignored = path.split("/").some(p => [".git", ".agents", ".codex", ".claude", "__pycache__"].includes(p));
      observation.paths_present[path] ??= complete && !ignored ? present.has(path) : null;
    }
    observation.tagged_checks = evaluateTagged(turn.tagged_checks ?? [], observation, history, c.fixture);
    for (const [name, value] of Object.entries(check(turn.checks ?? {}, observation, c.fixture)))
      turnChecks[`turn ${number}: ${name}`] = value;
    for (const row of [...observation.tagged_checks, ...(observation.judgments ?? [])])
      history[`${number}:${row.id}`] = row.verdict;
  }
  result.checks = { ...turnChecks, ...check(c.checks, result, c.fixture) };
  result.progress_findings = progressFindings(result.turns);
  result.run_checks = c.suite && c.checks.names_no_skill ? [{
    id: "no-skill-names", tag: "habit:no-skill-names",
    verdict: result.checks?.["answer names no skill or skill file"] ?? null,
  }] : [];
  result.unreached_turn_checks = selected.filter(n => !result.turns.some((t: Event, i: number) => (t.turn ?? i + 1) === n))
    .flatMap(n => [...(c.turns[n - 1]!.tagged_checks ?? []), ...(c.turns[n - 1]!.rubric ?? [])]
      .map(row => ({ turn: n, id: row.id, tag: row.tag, verdict: null })));
  result.scores = score([...result.turns.flatMap((t: Event) => [...t.tagged_checks, ...(t.judgments ?? [])]),
    ...result.unreached_turn_checks, ...result.run_checks]);
  result.rescored = "Current assertions; original scripts must match. Saved checkpoints scope before-state by chapter.";
  return result;
}
