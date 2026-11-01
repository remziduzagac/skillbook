# coordinate-delegate-fanout

## Purpose

Combines findings from separate reading tasks and validates their evidence, so the answer uses checked sources.

Needs: permitted workers and Python 3 for the consolidation script. If either is unavailable, return available findings, the unfinished stage and its next owner. Do not claim that the script combined the findings or that an independent worker validated them when those steps did not run.

## When to use

Use when a search cannot narrow the work enough and large separate reading tasks, search areas or review angles remain. For example, workers may read different sources before their findings are combined and checked.

## When not

- The same whole question for every worker: use the `coordinate-delegate-council` guide for independent answers.
- Parallel changes: use the `coordinate-delegate-crew` guide to assign separate writers.
- Work one search settles: search directly. Several workers would add cost without useful coverage.

## Gives back

Combined findings, their actual check status, sources and coverage limits.

## Rules

1. **Give each worker a different part or review lens.** Search first. Use one worker when a search or a small task suffices. The same question over the same material uses the `coordinate-delegate-council` guide.
2. **Keep findings in files until the answer needs them.** Each worker writes its own findings file and returns its path, count and what it could not find. Large raw findings would fill the main conversation.
3. **Consolidate through the bundled script.** Follow [the findings contract](fanout/assets/findings.md), using the `understand-research` guide for the shared finding fields and ranking of how evidence was obtained. Preserve every finding, source, conflict and negative result. Checking a quote proves only whether those words occur in the supplied source.
4. **Validate the evidence the answer may rely on and every conflicting pair.** Use a fresh validator at high effort, its tier chosen by the parent. Ask it to try to refute each claim against its sources. Keep uncertain claims unverified. Mark a claim refuted only when evidence goes against it. List the other findings as not validated.
5. **Support the answer only with validated findings.** Report what was skipped, not found or left unverified, and what would settle relevant unknowns. You may read information about search coverage without using an unverified claim as supporting evidence.

## Advice

- Size a light worker's part below its model's price step where one is documented. Read the parent's price data only when needed. If the price step is unknown, report that uncertainty rather than inventing a threshold. Judgment still needs the tier the parent requires.

## Instructions

Combine findings from separate reading tasks into an answer supported by independently validated evidence. Keep source quote checks distinct from checks that a claim is true. **Search before dividing, consolidate returned findings, then validate before using any finding to support the answer.**

1. **Divide material or review lenses under rule 1 and the active `coordinate-delegate` guide call.** Splitting work a search already settles adds startup cost without useful coverage.
   - Search first, then give each worker a distinct part. Use the active parent for permitted controls, approved cost, tracking and startup.
   - Restart no method selection and let no worker delegate further.
2. **Brief reading workers through the `coordinate-brief` guide.** Findings without common fields or separate output files can be lost or misread during consolidation.
   - Include the findings contract, each worker's own file, scope, baseline, report and cleanup requirements.
   - Use low effort through permitted controls because validation follows. Keep the parent's tier and fork restrictions; report an unavailable control rather than claiming it was set.
3. **Consolidate returned files with `fanout/scripts/consolidate.py` beside this guide, by rule 3.** Manual summaries can drop conflicting evidence or negative results.
   - Use the returned findings files and an explicit allowed source root. The script reads approved local sources or snapshots; it fetches no URLs and executes no source text.
   - Treat malformed input as an error, not trusted partial output. Mark unreadable source checks unverified. A matching quote proves only that those words occur in that source.
4. **Obtain independent validation through the active parent, by rule 4.** A claim can quote a source accurately and still say something the source does not support.
   - Validation follows consolidation and precedes support for the answer. Use a fresh validator at high effort, with tier chosen by the parent.
   - Ask it to refute relevant claims and every conflicting pair against sources. Keep uncertain claims unverified, refuted claims backed by opposing evidence, and other findings not validated.
   - If no validator can start, return the pending check and next owner. Your own second look does not supply independence.
5. **Write the answer only from validated findings, by rule 5.** Unverified claims can become false certainty when folded into a smooth answer.
   - Give sources, coverage limits and paths to full findings. Report skipped, missing and unverified evidence with what would settle relevant unknowns.
   - Preserve actual worker states and cleanup through the parent. Missing workers or Python leave the affected stage unfinished, without a claim that it ran.
6. **Check findings, evidence states and “Gives back” before returning.** Always do this last. Consolidation success is not validation success.
   - Check all input findings, sources, conflicts and negative results survived. Check quote matches remain distinct from claim validation.
   - Fix unsupported answer claims and lost findings before returning. Give actual validation, unfinished stages and their next owners; turn no uncertainty into a successful check.
