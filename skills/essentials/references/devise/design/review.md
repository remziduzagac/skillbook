# devise-design-review

Checks whether a design holds together, covers its requirements and can be built.

Needs: an independent reviewer for the required review. If one cannot start, follow `act-verify` rule 2 and return provisional findings with the outstanding check and its next owner.

## Rules

1. **Keep each check in its home.** Consistency and the builder walk-through are here. Use `understand-challenge` for weaknesses, `act-rightsize-lean` for what is extra and `act-verify` for built work against its design. Check parts against requirements for coverage and overlap.
2. **Use an independent reviewer.** Follow `act-verify` rule 2. A fresh reviewer may perform this check; the writer's second look and a fork sharing its context do not count. They share blind spots.
   - For a large review, use an available fresh agent per lens through the harness.
   - If unavailable, return provisional findings with the independent check outstanding and its next owner. A delegated worker returns that need to its caller. Missing log events alone prove no unavailability.
3. **Propose changes only.** The design owner decides what to fix, accept or park. Editing during a review would decide for them.
4. **Finish by returning the findings.** Do not wait for caller-owned resolution. Mark required checks not done so delivery cannot be mistaken for completed review.

## Instructions

1. **Read the design and its basis.** Include the frame, requirements and decisions.
2. **Run the consistency lens.** Find conflicting parts, decisions or requirements and terms used two ways.
3. **Walk the builder through main and edge cases.** Each must have a responsible part and enough information to act.
4. **Check coverage and overlap.** Set parts against requirements: none missing, none owned twice.
5. **Use `understand-challenge` for consequential assumptions.** Reuse a current result only with the same idea, goal, constraints and evidence. Changed inputs need renewed scrutiny.
6. **Identify what `act-rightsize-lean` would remove.** Report proposed cuts, not an applied removal.
7. **Use the architecture lens when `softeng` is installed.** Load its main skill and use that lens by its name rule. Otherwise skip it and report the skip.
8. **Return ranked findings with evidence.** Use must fix before approval, should fix and note. Each gives where, what, why and a suggested fix. With none, name the lenses run. Include missing checks and their next owner.

## The last instruction

Check every required lens has a result or an explicit outstanding status. Keep findings grounded and the design unchanged. Hand them to the caller for disposition before design approval. Never claim independent completion without another reviewer's result.
