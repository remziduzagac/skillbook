# devise-design-review

Checks whether a design holds together, covers its requirements and can be built.

Needs: an independent reviewer for the required review. If one cannot start, follow `act-verify` rule 2 and return provisional findings. Name the unfinished check and who should arrange it.

## Rules

1. **Keep each check in its home.** Consistency and the builder walk-through are here. Use `understand-challenge` for weaknesses, `act-rightsize-lean` for what is extra and `act-verify` for built work against its design. Use the `organize` skill's bounded check for parts against requirements, including coverage and overlap.
2. **Use an independent reviewer.** Follow `act-verify` rule 2. Use `coordinate-delegate` to start a permitted fresh reviewer for this check; the writer's second look and a fork sharing its context do not count. They share blind spots.
   - For a large review, use `coordinate-delegate` for an available fresh agent per lens.
   - If no independent reviewer is available, return provisional findings. Name the unfinished independent check and who should arrange it. A delegated worker asks its caller to arrange that check. A log that records no helper does not prove that no helper was available.
3. **Propose changes only.** The design owner decides what to fix, accept or park. Editing during a review would decide for them.
4. **Finish by returning the findings.** Do not wait for the caller to resolve the findings. Name required checks you did not complete. Returning findings does not mean every required check is complete.

## Instructions

1. **Read the design and its basis.** Include the frame, requirements and decisions.
2. **Run the consistency lens.** Find conflicting parts, decisions or requirements and terms used two ways.
3. **Walk the builder through main and edge cases.** Each must have a responsible part and enough information to act.
4. **Check coverage and overlap through `organize`.** Use its bounded check and return here. Set parts against requirements: none missing, none owned twice.
5. **Use `understand-challenge` for consequential assumptions.** Reuse a current result only with the same idea, goal, constraints and evidence. Changed inputs need renewed scrutiny.
6. **Identify what `act-rightsize-lean` would remove.** Report proposed cuts, not an applied removal.
7. **Use the architecture lens when `softeng` is installed.** Load its main skill and use that lens by its name rule. Otherwise skip it and report the skip.
8. **Return ranked findings with evidence.** Use must fix before approval, should fix and note. For each finding, give its location, the problem, why it matters and a suggested fix. If you find no problems, name the lenses you ran. Name unfinished checks and who should arrange them.

## The last instruction

Check that every required lens has a result or is marked unfinished. Support findings with evidence. Leave the design unchanged. Return the findings to the caller to fix, accept or park before design approval. Never claim independent completion without another reviewer's result.
