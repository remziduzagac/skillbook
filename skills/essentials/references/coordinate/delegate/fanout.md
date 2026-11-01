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

The goal is an answer supported by validated findings from separate reading tasks. Combine the findings with the steps below.

1. **Divide the material or questions into separate parts.** This gives each worker a separate part. Use the active delegate call to select permitted controls, handle cost approval, track tasks and start workers. Do not restart its selection step or delegate from a worker.
2. **Brief workers through the `coordinate-brief` guide.** This gets findings in a usable form. Use low effort for reading workers through permitted controls because validation follows. Keep the parent's tier and fork restrictions. Report an unavailable effort control rather than claiming it was set. Include the findings contract, their own output file, scope, baseline, report and cleanup requirements.
3. **Consolidate the returned files with `fanout/scripts/consolidate.py` beside this guide.** This preserves findings and source checks. Consolidation must use the returned findings files. Supply an explicit allowed source root. The script reads local approved source files or snapshots. It never fetches a URL or executes source text. If a source cannot be read, report that the source check is unverified. Malformed input returns an error rather than a trusted partial output.
4. **Get the validation in rule 4 through the active parent.** This checks the claims independently. Validation must follow consolidation and come before claims support the answer. A missing validator leaves the required check pending. The main agent's own second look is not independent validation.
5. **Write the answer from the validated evidence.** This supports the answer with checked evidence. Return it with sources, coverage limits and paths to the full findings. Preserve each worker's actual status and cleanup result through the parent.

6. **Check findings and evidence status.** Always do this last.

   Check that all input findings and negative results survived consolidation. Separate quote matches from claim validation. Relevant findings are validated, refuted with evidence, or explicitly unverified with what would settle them. Return unfinished stages and their next owner. Never turn uncertainty or missing capability into a successful check.
