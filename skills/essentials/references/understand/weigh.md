# understand-weigh

## Purpose

Compares named options on common terms and recommends one, or says what would settle the choice.

## When to use

Use when two or more named options need comparison and a recommendation. A requested debate is one example.

## When not

- One option or a settled choice to check: use the `understand-challenge` guide for weak points. There are no alternatives to compare.
- No options yet: use the `understand-brainstorm` guide to generate them.
- A fact that would decide the choice: use sources or a test. Scoring options cannot establish the fact.
- Independent agents gave different answers: keep each answer and the disagreement. Use this comparison only if the user asks for a recommendation.

## Gives back

A comparison and recommendation, or no clear winner with what would settle it. Return options needing more development to the task that asked; do not start another brainstorm.

## Rules

1. **Compare every option on every term.** Different terms cannot support a comparison.
2. **Give benefits, costs, risks and unknowns for each option.** Search for real downsides. If none is found within the agreed terms, say so with where you looked. A forced downside invents evidence; an unexamined option hides costs.
3. **Name unknowns that could change the recommendation.** Use the `understand-research` guide or a permitted test for deciding facts. Use the `understand-clarify` guide for the user's preference. Give what would settle each unknown.
4. **Recommend with why it beats the next best, or say "no clear winner".** Give what would settle a tie. Giving no recommendation leaves the decision undone. Forcing a recommendation hides a tie.
5. **Follow the `understand` guide's who-decides rule.** When a caller asks for a comparison, return it without starting that caller's choice round. When the user asks directly, give your recommendation as the recommended answer for their choice. Give the reason. Apply the shared rule to agent-made choices. A bare choice cannot be judged.

## Advice

- Screen options that break constraints first. Name exclusions and why.
- Scale the comparison with the `act-stakes` guide. Say whether the choice is easy or hard to undo.
- Include the cost of being wrong.
- For high stakes or a requested debate, use the `understand-argue` guide and the `understand-challenge` guide for each option to equal depth. Reuse the challenge returned with the case while its idea, goal, constraints and evidence stay unchanged. A missing challenge or changed input needs a new one. Weaknesses serve the case; the verdict serves comparison. The `understand-challenge` guide owns independent checking under the `act-verify` guide's rule 2.
- Include costs that appear only later.
- Use scores and weights only with a meaningful measure. Words usually say more than an unsupported number.
- If a combination may beat options that fail on different terms, return the development need to the caller. Do not call the active `understand-brainstorm` guide again.

## Instructions

Compare named options on common terms and recommend one, or explain what would settle a tie. Evidence and an honest search for downsides matter more than a score that merely looks exact. **Set the terms first, compare every option, then return the recommendation or unresolved choice.**

Use the `understand-research` guide or a permitted test for a fact that would decide the choice. When candidate discovery is needed, the `understand-research-survey` guide returns it to this active comparison without another weigh call. Use the `understand-challenge` guide for one option. Return undeveloped options to the caller with the specific development they need. The caller owns the next generation pass. When a council returns disagreements, preserve them. Compare its members' answers when the user asks for a recommendation.

Return this default shape:

```text
Terms:         what matters to the question
Options:       each one's benefits, costs, risks and unknowns
Dropped:       excluded options and reasons
Recommended:   why it beats the next best; easy or hard to undo; or no clear winner
Would change:  unknowns and what would settle them
```

Use the `respond-layout` guide: a short table may serve, and a list remains valid when rows would fit. Keep no lasting record yourself. Return the comparison, why a chosen option won and the options set aside for the skill that saves records. The shared who-decides rule sets what the user sees of an agent-made choice.

1. **Set comparison terms from the `understand-frame` guide before scoring.** Terms chosen after a favorite appears can make the comparison justify it rather than test it.
   - Reuse the frame's good-answer terms, otherwise what matters to the question. Screen options that break constraints and name each exclusion.
   - Scale depth with the `act-stakes` guide. Include the cost of being wrong and how easily the choice can be undone.
2. **Compare every option on every term, by rules 1 and 2.** Unequal scrutiny can make the least examined option look safest.
   - Give benefits, costs, risks and unknowns, including later costs. Search for real downsides; if none is found, say where you looked rather than inventing one.
   - At high stakes or for a requested debate, use the `understand-argue` guide and the `understand-challenge` guide equally for each option. Reuse only current checks; keep case and challenge verdict separate.
   - Use scores or weights only when the measure means something. A short table or list may carry the comparison.
3. **Resolve or name deciding unknowns under rule 3.** A missing fact or user preference can reverse the recommendation after the user relies on it.
   - Use the `understand-research` guide or a permitted test for facts, and the `understand-clarify` guide for the user's preference. Give what would settle each gap.
   - Return survey findings to this active comparison. Return undeveloped options or a needed combination to the caller without restarting generation.
4. **Return the recommendation or tie under rules 4 and 5.** A winner without a reason cannot be judged; forcing one conceals a real tie.
   - Explain why it beats the next best, or give “no clear winner” with what would settle it. Include exclusions and what would change the result.
   - Return a caller's comparison without starting its choice round. For a direct request, give the recommendation as the recommended answer for the user's choice. Preserve council disagreements.
5. **Check the comparison and “Gives back” before returning it.** Always do this last. The caller needs a grounded basis for choice, including its limits.
   - Check common terms, evidence, downside searches, current challenges and deciding unknowns. Return a recommendation, a tie or a specific development need preventing comparison.
   - Fix unsupported or unequal parts before returning under the `understand` guide's rules. Leave decisions and lasting changes with their owner.
