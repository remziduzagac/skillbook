# coordinate-delegate-fanout

## Purpose

Combines findings from separate reading tasks and validates their evidence, so the answer uses checked sources.

Needs: permitted workers, and Python 3 for the bundled script on a large set. If either is missing, return the findings you have, the unfinished stage and who should finish it. Do not claim that the script combined the findings or that a fresh validator checked them when those steps did not run.

## When to use

Use when a search cannot narrow the work enough and separate reading tasks, search areas or review angles remain, or when the user asks for several agents to read separate parts. For example, workers may read different sources before their findings are combined and checked.

## When not

- The same whole question for every worker: use the `coordinate-delegate-council` guide for independent answers.
- Parallel changes: use the `coordinate-delegate-crew` guide to assign separate writers.
- Work one search settles: search directly. Several workers would add cost without useful coverage.

## Gives back

Combined findings, how they were combined and who checked them, their actual check status, sources and coverage limits.

## Rules

In these rules, a small set has sources you could read yourself in one or two tool calls, such as six one-page policies, and findings you can compare in one read. Every other set is large.

1. **Give each worker a different part or review lens.** Search first. Use one worker when a search or a small task suffices. The same question over the same material uses the `coordinate-delegate-council` guide.
2. **Keep findings in files until the answer needs them.** Each worker writes its own findings file and returns its path, count and what it could not find. Large raw findings would fill the main conversation. On a small set, a worker may return its findings in its report instead, each with its source.
3. **Consolidate through the bundled script on a large set.** Follow [the findings contract](fanout/assets/findings.md), using the `understand-research` guide for the shared finding fields and ranking of how evidence was obtained. A hand merge of many findings can drop a conflict or a negative result unseen. A small set may be merged by hand instead. Either way, keep every finding, source, conflict and negative result. Checking a quote proves only whether those words occur in the supplied source.
4. **Validate the evidence the answer may rely on and every conflicting pair.** Ask the checker to try to refute each claim against its sources. Keep uncertain claims unverified. Mark a claim refuted only when evidence goes against it.
   - On a large set, use a fresh validator at high effort, its tier chosen by the parent. Reading every source yourself would fill this conversation.
   - On a small set, check the findings against their sources yourself when the `act-verify` guide's rule 2 lets you skip the fresh agent. Otherwise use a fresh validator, as on a large set.
5. **Support the answer only with validated findings.** In the answer, say how the findings were combined, by the script or by hand, and who validated them, a fresh validator or you. Name the findings left unvalidated, what was skipped or not found, and what would settle relevant unknowns. Without this, the user cannot tell a checked finding from a worker's guess. You may read information about search coverage without using an unverified claim as supporting evidence.

## Advice

- Keep each light worker's part below the input size at which its model's price rises, where the price data gives one. Read the parent's price data only when cost matters. If that size is unknown, say so with the cost estimate rather than guessing one. Judgment still needs the tier the parent requires.

## Instructions

Combine findings from separate reading tasks into an answer supported by validated evidence, with the checks scaled to the size of the set. Keep source quote checks distinct from checks that a claim is true. **Search before dividing, consolidate returned findings, then validate before using any finding to support the answer.**

1. **Divide material or review lenses under rule 1 and the active `coordinate-delegate` guide call.** Splitting work a search already settles adds startup cost without useful coverage.
   - Search first, then give each worker a distinct part. Use the active parent for permitted controls, approved cost, tracking and startup.
   - Restart no method selection and let no worker delegate further.
2. **Brief reading workers through the `coordinate-brief` guide.** Findings without common fields or separate output files can be lost or misread during consolidation.
   - Include scope, baseline, report and cleanup requirements. On a large set, include the findings contract and each worker's own file. On a small set, ask for the findings with their sources in the report, by rule 2.
   - Use low effort through permitted controls because validation follows. Keep the parent's tier and fork restrictions; report an unavailable control rather than claiming it was set.
3. **Consolidate the returned findings by rule 3: with `fanout/scripts/consolidate.py` beside this guide on a large set; a small one may be merged by hand.** A hand summary of many findings can drop conflicting evidence or negative results.
   - For the script, use the returned findings files and an explicit allowed source root. The script reads approved local sources or snapshots; it fetches no URLs and executes no source text.
   - Treat malformed input as an error, not trusted partial output. Mark unreadable source checks unverified. A matching quote proves only that those words occur in that source.
   - For a hand merge, list every finding with its source, and keep each conflict and not-found result.
4. **Get the findings validated by rule 4, with a fresh validator through the active parent where that rule asks for one.** A claim can quote a source accurately and still say something the source does not support.
   - Validation follows consolidation and comes before the answer relies on any finding.
   - Ask the checker to refute relevant claims and every conflicting pair against their sources. Keep uncertain claims unverified, and refuted claims backed by opposing evidence.
   - If a required validator cannot start, return the pending check and who should arrange it. Your own look does not replace it.
5. **Write the answer only from validated findings, and say how they were combined and validated, by rule 5.** Unverified claims can become false certainty when folded into a smooth answer.
   - Give sources, coverage limits and paths to any findings files. Name what was skipped, missing or unvalidated, and what would settle relevant unknowns.
   - Say what happened to each worker and its files, through the parent. Missing workers or Python leave the affected stage unfinished, without a claim that it ran.
6. **Check findings, evidence states and “Gives back” before returning.** Always do this last. Consolidation success is not validation success.
   - Check that all input findings, sources, conflicts and negative results survived. Check that quote matches stay separate from claim validation.
   - Check that the answer says how the findings were combined, who validated them and which were not. Check each claim the answer rests on is a validated finding, by rule 5. Check each unvalidated finding is named as such, kept out of that support, with what would settle it. Fix unsupported claims and lost findings before returning. Give unfinished stages and who should finish them; turn no uncertainty into a successful check.
