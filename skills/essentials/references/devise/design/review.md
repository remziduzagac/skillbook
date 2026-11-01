# devise-design-review

## Purpose

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

Give the design owner evidence-backed findings they can fix, accept or park. Keep review separate from editing and distinguish a returned report from completion of every required check. **Read the design’s basis, run the review lenses, then return ranked findings with actual review status.**

1. **Read the design and its frame, requirements and decisions.** A review without its basis can mistake a deliberate constraint for a fault or miss a real requirement.
   - Arrange the independent reviewer under rule 2 through the `coordinate-delegate` guide. A writer's reread or shared-context fork is not independent.
   - If unavailable, keep the check pending and name who should arrange it. Return useful findings without claiming independent completion.
2. **Run the consistency lens under rule 1.** Conflicting parts let builders follow different versions of the design.
   - Check parts against decisions and requirements. Find terms used for different meanings.
3. **Walk a builder through main, edge and failure cases under rule 1.** A design can look complete yet leave the builder no owner or instructions at the point of failure.
   - For each case, find the responsible part and enough information to act. Judge from a builder without this conversation.
4. **Check coverage and overlap through the `organize` guide's bounded check.** A responsibility owned twice can conflict; one owned nowhere can be omitted.
   - Set parts against every requirement. Return here after the check without restarting the parent operation chooser.
5. **Challenge assumptions that could change consequential decisions through the `understand-challenge` guide.** A hidden false assumption can invalidate much of the design after building starts.
   - Target decisions hard to undo or shaping much of the work. Reuse a challenge only with the same idea, goal, constraints and evidence.
6. **Identify proposed cuts through the `act-rightsize-lean` guide.** Extra parts cost builders effort without serving a requirement.
   - Report what could go and why. Apply no removal; the owner decides under rule 3.
7. **Use a fitting specialist review skill from the harness's list.** Generic consistency checks alone do not establish a specialist architecture review.
   - If no fitting skill is available, skip that review and report the skip rather than claiming it was performed.
8. **Return ranked findings under rules 3 and 4.** Findings without locations, effects or fixes leave the owner to repeat the review.
   - Rank must fix before approval, should fix and note. Give location, problem, why it matters and a suggested fix for each.
   - If no problems were found, name the lenses run. Name unfinished checks and their next owner. Return without waiting for resolution or changing the design.
9. **Check findings and “Gives back” before returning.** Always do this last. A finished report must not hide an unfinished independent review.
   - Check every required lens has a result or pending status, and every finding has evidence. Fix unsupported findings or missing statuses.
   - Leave the design unchanged. Return to the owner for fixes, acceptance or parking before approval. Claim independence only after another reviewer's result is seen.
