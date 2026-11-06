import { candidateKey, type CandidateName } from "./fixture-validation";
import type { Event } from "./types";
// A full report's errored batches, judged again in a preview on the same contract, complete that full report.
// The merge judges nothing, so it stays outside the contract hash and keeps every judgment it copies valid.
export function filledFullReport(full: Event, preview: Event, source: string): Event {
  if (full?.mode !== "full" || full.scoring_authorized === false || !Array.isArray(full.results) ||
    !Array.isArray(full.candidates)) throw Error("fill needs a full report");
  if (preview?.mode !== "preview" || preview.model !== full.model || preview.fixture_hash !== full.fixture_hash ||
    !Array.isArray(preview.results) || !Array.isArray(preview.candidates))
    throw Error("fill needs a preview on the same contract as the full report");
  const errored = full.results.filter((row: Event) => row.error);
  if (!errored.length) throw Error("the full report has no errored batches");
  const wanted = new Set<string>(errored.flatMap((row: Event) =>
    row.candidates.map((name: CandidateName) => candidateKey(name))));
  const judged = preview.results.filter((row: CandidateName & Event) => !row.error && wanted.has(candidateKey(row)));
  if (judged.length !== wanted.size || new Set(judged.map(candidateKey)).size !== wanted.size)
    throw Error("the preview does not judge every errored candidate exactly once");
  const printed = new Map(full.candidates.map((row: CandidateName & Event) => [candidateKey(row), row.fingerprint]));
  for (const row of preview.candidates)
    if (wanted.has(candidateKey(row)) && printed.get(candidateKey(row)) !== row.fingerprint)
      throw Error("a filled candidate changed since the full report");
  return {...full, results: [...full.results.filter((row: Event) => !row.error), ...judged],
    filled: {from: source, candidates: [...wanted], errors: errored.map(({batch, error}: Event) => ({batch, error}))},
    known_cost: (full.known_cost ?? 0) + (preview.known_cost ?? 0),
    unknown_cost_calls: (full.unknown_cost_calls ?? 0) + (preview.unknown_cost_calls ?? 0)};
}
