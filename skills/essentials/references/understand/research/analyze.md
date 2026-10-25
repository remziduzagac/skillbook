# understand-research-analyze

Investigates why something happens and returns evidence for its cause or an honest unresolved result.

## Rules

1. **Give the symptom exactly before testing causes.** Say what happened, where, since when and how often, with the actual error where one exists. Mark missing details unknown. A vague symptom fits many stories.
2. **Test one cause at a time.** Give a testable hypothesis, such as "X because Y", and change one variable per test. Stacked changes hide which one mattered.
3. **Confirm a cause through evidence rather than fit.** Reproduce it, observe it through a probe or show that removing it removes the symptom. Until supported, label it a hypothesis. A familiar explanation is not an observation.
4. **Trace the chain back to its trigger.** Give evidence for each link. If a link cannot be traced further, say so. A change where the symptom appears can leave its cause intact.
5. **Return the cause before offering a fix as the answer.** The caller owns remediation. Without a confirmed cause, return hypotheses, missing evidence and what would settle them rather than inventing a fix or a completed chain.
6. **Stop and ask when hypotheses keep failing without a new lead.** Follow `respond-ask` and end the turn. Further work may need instrumentation, continued investigation or a new frame.
7. **Clean investigation scaffolding when its actual lifecycle ends.** Use `act-cleanup` for unresolved and cancelled investigations as well as confirmed ones. Stop your own no-longer-needed processes and remove your probes or temporary edits. Preserve the caller's work and requested evidence. Keep only what cleanup permits, with where and why. Missing confirmation is not a reason to leave scaffolding running.

## Advice

- After about three failed hypotheses without a new lead, use rule 6. The framing or evidence may be wrong. Follow the `act` skill's failure limits too.
- For a regression, inspect recent changes first, then the path the failure takes and a reproduction.
- Compare with a working case and list the differences. Inspect inputs and outputs at component boundaries to locate the break.
- Bisect changes, steps or inputs when that can isolate the trigger.
- Say what you do not understand. Recurring problems in one area can point to a structural cause. A fix moving a symptom elsewhere may be at the wrong layer.
- Correlation is not cause, and one case is not a pattern. Several contributing causes may need separate chains. Draw a diagram only when it helps.
- Before searching outside, strip internal names and details from the query. Follow `act-guardrails` for outward data and remaining risk; sanitizing alone grants no permission.
- If no cause was found, list what was checked and the investigation's actual limits. An external cause needs evidence too.

## Instructions

1. **Give the symptom and reuse the current question or frame.** Use `understand-frame` only for the missing framing need, not another pass over a settled question.
2. **Gather the evidence needed for the hypothesis.** Inspect recent changes, execution paths, logs and a reproduction. Run probes only within the `understand` skill's temporary-work limits and the `act` skill's rules, including guardrails. No lasting change is made here.
3. **Test causes one at a time by rules 2 and 3.** Use `understand-research-fact` for an individual sourced fact when needed. Keep observed results distinct from hypotheses.
4. **Trace supported causes back to their triggers.** Keep each contributing chain and its evidence. Report a stopping point when further tracing is not supported.
5. **Return a question under rule 6 when the investigation stalls.** Ask whether to continue, instrument further or reframe. A delegated worker returns this need to its caller. Start no answer-dependent continuation yourself.
6. **Return the investigation after rule 7's cleanup.** Give the symptom, causal or hypothetical chain, rejected causes with their evidence, missing checks and the next owner. A code fix or incident action belongs to its caller's work; use the caller's specialist set where installed, otherwise its judgment under the `act` skill. For a direct request, give the next investigation or fix step without applying it.

## The last instruction

Check every claimed causal link has evidence or a hypothesis label. Report rejected causes and unresolved limits. Confirm cleanup or report permitted kept material and its reason. Return the result and next owner without applying a fix. Follow the parent's last instruction.
