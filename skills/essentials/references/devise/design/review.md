# devise-design-review

Checks whether a design holds together, covers its requirements and can be built.

Needs: an independent reviewer for the required review. If one cannot start, follow the `act-verify` guide's rule 2 and return findings with the independent check still pending. Name the unfinished check and who should arrange it.

## When to use

Use for a full design, a large change or a request to review a design. For example, walk through whether a builder can handle the design’s main cases and failure paths.

## When not

- Code review: use a skill in the harness’s list for reviewing code, if one fits. Otherwise use your judgment. This review checks a design, not its implementation.
- Completion evidence: use the `act-verify` guide to check a claim about finished work.
- One idea: use the `understand-challenge` guide for weak points. It does not need a full design review.
- A skill’s design: use the project’s skill-making method, otherwise your judgment. That method holds its design checks.

## Gives back

Ranked findings with fixes, or a list of checks run when no problem was found. Mark unfinished checks. The design owner resolves findings before approval.

## Rules

1. **Keep each check in its home.** Consistency and the builder walk-through are here. Use the `understand-challenge` guide for weaknesses, the `act-rightsize-lean` guide for what is extra and the `act-verify` guide for built work against its design. Use the `organize` guide's bounded check for parts against requirements, including coverage and overlap.
2. **Use an independent reviewer.** Follow the `act-verify` guide's rule 2. Use the `coordinate-delegate` guide to start a permitted fresh reviewer for this check; the writer's second look and a fork sharing its context do not count. They share blind spots.
   - For a large review, use the `coordinate-delegate-fanout` guide within the `coordinate-delegate` guide for an available fresh agent per lens. Keep this review's independence and rules for results with the independent check still pending.
   - If no independent reviewer is available, return findings with the independent check still pending. Name the unfinished independent check and who should arrange it. A delegated worker asks its caller to arrange that check. A log that records no helper does not prove that no helper was available.
3. **Propose changes only.** The design owner decides what to fix, accept or park. Editing during a review would decide for them.
4. **Finish by returning the findings.** Do not wait for the caller to resolve the findings. Name required checks you did not complete. Returning findings does not mean every required check is complete.

## Instructions

1. To understand what the design must satisfy, read the design and its basis. Include the frame, requirements and decisions.
2. To find contradictions, run the consistency lens. Find conflicting parts, decisions or requirements and terms used two ways.
3. To check that someone can build it, walk the builder through main and edge cases. Each must have a responsible part and enough information to act.
4. To find missing or overlapping parts, check coverage and overlap through the `organize` guide. Use its bounded check and return here. Set parts against requirements: none missing, none owned twice.
5. To test assumptions that matter, use the `understand-challenge` guide for assumptions that could change a decision that is hard to undo or shapes much of the work. Reuse a current result only with the same idea, goal, constraints and evidence. Check again when those inputs change.
6. To find parts that add no value, identify what the `act-rightsize-lean` guide would remove. Report proposed cuts, not an applied removal.
7. To check software architecture where supported, use a skill in the harness’s list for that review, if one fits. Otherwise skip that review and report the skip.
8. To give the owner actionable findings, return ranked findings with evidence. Use must fix before approval, should fix and note. For each finding, give its location, the problem, why it matters and a suggested fix. If you find no problems, name the lenses you ran. Name unfinished checks and who should arrange them.

## The last instruction

Check that every required lens has a result or is marked unfinished. Support findings with evidence. Leave the design unchanged. Return the findings to the caller to fix, accept or park before design approval. Never claim independent completion without another reviewer's result.
