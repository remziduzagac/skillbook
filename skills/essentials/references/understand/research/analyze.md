# understand-research-analyze

## Purpose

Investigates why something happens and returns evidence for its cause or an honest unresolved result.

## When to use

Use when the user asks why something happens and the cause needs investigation. For example, a process may have become slower after a change.

## When not

- Applying a fix: return it to the main task. Analysis finds the cause and evidence.
- One fact: use the `understand-research-fact` guide. A cause investigation needs more than a factual answer.
- Claims that work is done: use the `act-verify` guide for completion evidence.

## Gives back

The symptom, supported causes or marked hypotheses, rejected causes, and who should investigate or fix it next, in this default shape:

```text
Symptom:    what is seen, where, since when, how often
Cause:      the chain from the symptom back to the trigger, each link with its evidence, confirmed or hypothesis
Ruled out:  each cause tested and rejected, with the evidence
Fix:        where a fix belongs, at the trigger, handed to the caller
```

## Rules

1. **Give the symptom exactly before testing causes.** Say what happened, where, since when and how often, with the actual error where one exists. Mark missing details unknown. A vague symptom fits many stories.
   - Name the symptom in a progress line before your first test, such as "Checking why the backup ran twice on Monday".
   - Open your result with the symptom in a sentence or two, then give the cause at once, even when the cause is the point. The reader checks the cause against it. This is an exception to the main skill's step 6 on fitting the answer to the question, point first.
2. **Test one cause at a time.** Give a testable hypothesis, such as "X because Y", and change one variable per test. Stacked changes hide which one mattered.
3. **Confirm a cause through evidence rather than fit.** Reproduce it, observe it through a probe or show that removing it removes the symptom. Until supported, label it a hypothesis. A familiar explanation is not an observation.
4. **Trace the chain back to its trigger.** Give evidence for each link. If a link cannot be traced further, say so. A change where the symptom appears can leave its cause intact.
5. **Return the cause before offering a fix as the answer.** The main task owns any fix. Without a confirmed cause, return hypotheses, missing evidence and what would settle them rather than inventing a fix or a completed chain.
6. **Stop and ask after about three failed hypotheses without a new lead.** Ask through the `respond-ask` guide, then end the turn. More guesses use the user's time without better evidence. The user can choose to go on, add instrumentation or reframe.
7. **Clean investigation scaffolding when its actual lifecycle ends.** Use the `act-cleanup` guide for unresolved and cancelled investigations as well as confirmed ones. Stop your own no-longer-needed processes and remove your probes or temporary edits. Preserve the caller's work and requested evidence. Keep only what cleanup permits, with where and why. Missing confirmation is not a reason to leave scaffolding running.

## Advice

- Follow the main skill's step 5 on stopping after failed attempts too. The framing or the evidence may be wrong.
- For a regression, inspect recent changes first, then the path the failure takes and a reproduction.
- Compare with a working case and list the differences. Inspect inputs and outputs at component boundaries to locate the break.
- Bisect changes, steps or inputs when that can isolate the trigger.
- Say what you do not understand. Recurring problems in one area can point to a structural cause. A fix moving a symptom elsewhere may be at the wrong layer.
- Correlation is not cause, and one case is not a pattern. Several contributing causes may need separate chains. Draw a diagram only when it helps.
- Before searching outside, strip internal names and details from the query. Follow the `act-guardrails` guide for outward data and remaining risk; sanitizing alone grants no permission.
- If no cause was found, list what was checked and the investigation's actual limits. An external cause needs evidence too.

## Instructions

Find what causes the symptom and show the evidence for each link back to its trigger. A plausible explanation remains a hypothesis until observed evidence supports it. **Describe the symptom, test one cause at a time, then return the supported or unresolved chain after cleanup.**

1. **Give the exact symptom under rule 1 and reuse the current frame.** A vague symptom fits many stories and can send the caller toward the wrong fix.
   - Give what happened, where, since when and how often, with the actual error when one exists. Mark missing details unknown.
   - Use the `understand-frame` guide only for missing framing, without reopening a settled question.
2. **Gather evidence for the hypothesis under the `understand-research` guide.** Testing a familiar explanation before inspecting the actual path can miss where the failure starts.
   - For a regression, inspect recent changes first, then the execution path and a reproduction. Compare a working case and inspect inputs and outputs at boundaries.
   - Keep probes within the main skill's step 1 limit on lasting change and the main skill's step 5 with the `act-guardrails` guide. Make no lasting change.
   - Before an outside search, strip internal names and details. Sanitizing a query does not grant approval for remaining outward data.
3. **Test one cause and one variable at a time, by rules 2 and 3.** Stacked changes prevent the caller from knowing which one mattered.
   - Give a testable hypothesis. Reproduce it, observe it through a probe or show that removing the cause removes the symptom before calling it confirmed.
   - Use the `understand-research-fact` guide for an individual sourced fact. Keep observations separate from hypotheses; correlation alone is not cause.
4. **Trace supported causes back to their triggers, by rule 4.** A change where the symptom appears can leave the original cause intact.
   - Give evidence for each link and separate chains for contributing causes. Use a scoped bisect when it can isolate the trigger.
   - Mark where tracing stops. Say what is not understood rather than inventing branches or an external cause.
5. **Ask through the `respond-ask` guide when hypotheses fail without a new lead, by rule 6.** Repeating guesses uses the user's time without improving the evidence.
   - After about three failed hypotheses without a lead, ask whether to continue, instrument further or reframe. Follow the main skill's step 5 on stopping after failed attempts too.
   - End the turn before dependent investigation. A delegated worker returns this need to its caller.
6. **Return the investigation after cleanup under rules 5 and 7.** Unresolved or cancelled work can leave the same running probes as a confirmed cause.
   - Use the `act-cleanup` guide when the investigation's lifecycle ends. Preserve caller work and requested evidence; report permitted kept material with where and why.
   - Give symptom, supported or hypothetical chains, rejected causes with evidence, missing checks and the next owner. Return fixes to the main task. For a direct request, give a next investigation or fix step without applying it.
7. **Check causal evidence and “Gives back” before returning.** Always do this last. An unsupported link can invalidate the caller's whole explanation.
   - Check the result opens with the symptom, then the cause, by rule 1, with each missing detail marked unknown.
   - Check every causal link has evidence or a hypothesis label. Check rejected causes, unresolved limits, cleanup and next owner.
   - Correct unsupported causes or missing limits before returning. Apply the `understand-research` guide's final step and make no fix here.
