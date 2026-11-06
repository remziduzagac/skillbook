import { join } from "node:path";
import { fixtureText } from "./files";
import { FIXTURES } from "./paths";
import { progressFindings } from "./progress";
import { check } from "./checks";
import { finalAnswer, wordCount } from "./answers";
import type { Case, Event, Verdict } from "./types";

// A saved run is checked again with the current case's checks. Its messages must still match the case.
export function recheckScenario(original: Event, c: Case): Event {
  if (!c) throw Error(`missing or retired case: ${original.case}`);
  const result = structuredClone(original);
  const selected: number[] = original.selected_turns ?? c.turns.map((_, i) => i + 1);
  result.expected_turns = selected.length;
  result.fixture_sources ??= fixtureText(join(FIXTURES, c.fixture));
  const turnChecks: Record<string, Verdict> = {};
  for (const [index, observation] of result.turns.entries()) {
    const number = observation.turn ?? index + 1, turn = c.turns[number - 1];
    if (!turn || !selected.includes(number)) throw Error("saved run has an unexpected turn");
    if (observation.scripted_message !== turn.prompt) throw Error("script changed; replay cannot compare these results");
    observation.baseline_files ??= result.fixture_sources;
    observation.final_words ??= wordCount(finalAnswer(observation));
    for (const [name, value] of Object.entries(check(turn.checks ?? {}, observation, c.fixture)))
      turnChecks[`turn ${number}: ${name}`] = value;
  }
  result.checks = { ...turnChecks, ...check(c.checks, result, c.fixture) };
  result.progress_findings = progressFindings(result.turns);
  result.rescored = "Current checks; original scripts must match.";
  return result;
}
