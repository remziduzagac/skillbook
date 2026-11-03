# devise-design-review

## Purpose

Checks whether a design holds together, covers its requirements and can be built.

Needs: an independent reviewer for the required review. If one cannot start, follow the `act-verify` guide's rule 2 and return findings with the independent check still pending. Name the unfinished check and who should arrange it.

## When to use

Use for a full design, a large change to a design, or a request to review a design. For example, walk through whether a builder can handle the design’s main cases and failure paths.

## When not

- Code review: use a skill in the harness’s list for reviewing code, if one fits. Otherwise use your judgment. This review checks a design, not its implementation.
- Completion evidence: use the `act-verify` guide to check a claim about finished work.
- One idea: use the `understand-challenge` guide for weak points. It does not need a full design review.
- A skill’s design: use the project’s skill-making method, otherwise your judgment. That method holds its design checks.

## Gives back

Ranked findings with fixes, or a list of checks run when no problem was found. Mark unfinished checks. The design owner resolves findings before approval.

## Rules

1. **Keep each check in its home.** Consistency and the builder walk-through are here. Use the `understand-challenge` guide for weaknesses, the `act-rightsize-lean` guide for what is extra and the `act-verify` guide for built work against its design. Use the `organize` guide's gap-and-overlap check for parts against requirements, including coverage and overlap.
2. **Use an independent reviewer.** Follow the `act-verify` guide's rule 2. Use the `coordinate-delegate` guide to start a permitted fresh reviewer for this check; the writer's second look and a fork sharing its context do not count. They share blind spots.
   - For a large review, start one fresh agent per lens through the `coordinate-delegate-fanout` guide. Each one follows this guide's rules.
   - If no independent reviewer is available, return findings with the independent check still pending. Name the unfinished independent check and who should arrange it. A delegated worker asks its caller to arrange that check. A log that records no helper does not prove that no helper was available.
3. **Propose changes only.** The design owner decides what to fix, accept or park. Editing during a review would decide for them.
4. **Finish by returning the findings.** Do not wait for the caller to resolve the findings. Name required checks you did not complete. Returning findings does not mean every required check is complete.

## Instructions

Give the design owner evidence-backed findings they can fix, accept or park. Keep review separate from editing and distinguish a returned report from completion of every required check. **Read the design’s basis, run the review lenses, then return ranked findings with actual review status.**

1. **Arrange an independent reviewer, then read the design's basis.** A writer's own review shares the blind spots that made the faults, and a review without its basis can mistake a deliberate constraint for a fault.
   - If you wrote the design, start a fresh reviewer through the `coordinate-delegate` guide, and name this guide in its brief. It runs steps 2 to 9. Check its report when it returns, and use its findings as this review's result.
   - If you are that fresh reviewer, your review is the independent check. Run steps 2 to 9 yourself.
   - If no fresh reviewer can start, run the steps yourself and mark the independent check still open, with who should arrange it, by rule 2.
   - Read the design with its frame, requirements and decisions.
2. **Run the consistency lens under rule 1.** Conflicting parts let builders follow different versions of the design.
   - Check parts against decisions and requirements. Find terms used for different meanings.
3. **Walk a builder through main, edge and failure cases under rule 1.** A design can look complete yet leave the builder no owner or instructions at the point of failure.
   - For each case, find the responsible part and enough information to act. Judge from a builder without this conversation.
4. **Check coverage and overlap through the `organize` guide's gap-and-overlap check.** A responsibility owned twice can conflict; one owned nowhere can be omitted.
   - Set parts against every requirement. Return here after the check without restarting the parent operation chooser.
5. **Challenge assumptions that could change consequential decisions through the `understand-challenge` guide.** A hidden false assumption can invalidate much of the design after building starts.
   - Target decisions hard to undo or shaping much of the work. Reuse an earlier challenge only as that guide's rule 7 allows.
6. **Identify proposed cuts through the `act-rightsize-lean` guide.** Extra parts cost builders effort without serving a requirement.
   - Report what could go and why. Apply no removal; the owner decides under rule 3.
7. **For a software design, use a skill in the harness's list that reviews software architecture, if one fits.** General checks do not replace an architecture review.
   - If none fits, say in the findings that the architecture review was not done.
   - Other designs skip this step.
8. **Return ranked findings under rules 3 and 4.** Findings without locations, effects or fixes leave the owner to repeat the review.
   - Rank must fix before approval, should fix and note. Give location, problem, why it matters and a suggested fix for each.
   - If no problems were found, name the lenses run. Name unfinished checks and their next owner. Return without waiting for resolution or changing the design.
9. **Check findings and “Gives back” before returning.** Always do this last. A finished report must not hide an unfinished independent review.
   - Check every required lens has a result or pending status, and every finding has evidence. Fix unsupported findings or missing statuses.
   - Leave the design unchanged. Return to the owner for fixes, acceptance or parking before approval. Claim independence only after another reviewer's result is seen.
