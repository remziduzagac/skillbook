# understand-challenge

Attacks an idea, plan or decision before it is relied on and returns meaningful weaknesses and a verdict.

## Rules

1. **Measure against the frame.** Use `understand-frame`'s goal and constraints. Report weaknesses that block the goal or create material cost or risk in scope, even if success remains feasible. Exclude unrelated preferences. Otherwise any flaw counts and the list never ends.
2. **Give the idea fairly at its strongest first.** Use its author's case. Attacking a weak version finds weaknesses the idea does not have.
3. **Name assumptions as checked or unchecked.** Unchecked assumptions are where most ideas break.
4. **Give each weakness its seriousness, evidence and remedy.** Rank it as stops it, costs, or minor. Without these, a finding cannot be acted on.
5. **Give an honest verdict.** Use holds, holds with changes, or does not hold. Say nothing found plainly. Soften nothing to please and invent nothing to look thorough. A flattering challenge is worse than none.
6. **Change nothing.** The `understand` skill's rules hold. The caller develops or revises the idea. The user decides.
7. **Use `respond-ask`'s consequential-choice trigger when it calls you.** Routine questions need no challenge merely because they are in a plan or design.
   - Scale your check with `act-stakes`: at low stakes, make no challenge; at medium stakes, think through the strongest one or two objections; at high stakes, make a full challenge. Show medium-stakes objections when they hold and change the recommendation or add a caveat. Put the verdict beside the recommendation as `respond-ask` requires.
   - Reuse an earlier challenge only while the idea, goal, constraints and evidence stay unchanged. Accepting the same recommendation needs no second pass. Changed inputs can invalidate findings.

## Advice

- Imagine failure a year from now and explain why.
- Try relevant scenarios: tenfold size, a year later, a false main assumption, a changed dependency or the knowledgeable person gone.
- Look for missing evidence, undefined terms, unstated constraints and dependencies.
- Treat an unsupported claim as an assumption. Seek evidence rather than treating demand or preference as known.
- For who supplies independent objections, follow `act-verify` rule 2. This skill owns that check. `understand-argue` and `understand-weigh` may reuse it while inputs remain unchanged.
- Prefer a few strong weaknesses. Put the most serious first and group common causes.

Settle factual doubts from sources or a test. Use `understand-weigh` for several options. Use `understand-frame` or `understand-clarify` for an unclear idea. Use the skill that reviews that kind of work for finished work. Use `act-verify` for a claim that work is done.

Return this short default shape:

```text
Idea:         its strongest fair version
Measured by:  goal, constraints and a good answer
Assumptions:  checked or unchecked
Weaknesses:   seriousness, evidence and remedy; grouped, most serious first
Verdict:      holds, holds with changes (which), or does not hold (why)
```

Keep no lasting record yourself. Return the challenge, the weaknesses you considered, how each was met, fixed or accepted as a risk with its reason, and open weaknesses for a keeper to record. For your own idea analyzed quietly, show the verdict and serious weaknesses with reasons unless the user asks for more.

## The last instruction

Check assumptions, evidence, seriousness and remedies. Give the honest verdict without changing the idea or work. Reuse only current checks. Follow the `understand` skill's rules and `act-verify` rule 2 for independence.
