# understand-weigh

Compares named options on common terms and recommends one, or says what would settle the choice.

## Rules

1. **Set the terms before scoring options.** Use `understand-frame`'s good-answer terms where present, otherwise what matters to the question. Terms chosen later tend to fit the favorite.
2. **Compare every option on every term.** Different terms cannot support a comparison.
3. **Give benefits, costs, risks and unknowns for each option.** Search for real downsides. If none is found within the agreed terms, say so with where you looked. A forced downside invents evidence; an unexamined option hides costs.
4. **Name unknowns that could change the recommendation.** Use `understand-research` or a permitted test for deciding facts. Use `understand-clarify` for the user's preference. Give what would settle each unknown.
5. **Recommend with why it beats the next best, or say "no clear winner".** Give what would settle a tie. Giving no recommendation leaves the decision undone. Forcing a recommendation hides a tie.
6. **Follow the `understand` skill's who-decides rule.** When a caller asks for a comparison, return it without starting that caller's choice round. When the user asks directly, give your recommendation as the recommended answer for their choice. Give the reason. Apply the shared rule to agent-made choices. A bare choice cannot be judged.

## Advice

- Screen options that break constraints first. Name exclusions and why.
- Scale the comparison with `act-stakes`. Say whether the choice is easy or hard to undo.
- Include the cost of being wrong.
- For high stakes or a requested debate, use `understand-argue` and `understand-challenge` for each option to equal depth. Reuse the challenge returned with the case while its idea, goal, constraints and evidence stay unchanged. A missing challenge or changed input needs a new one. Weaknesses serve the case; the verdict serves comparison. `understand-challenge` owns independent checking under `act-verify` rule 2.
- Include costs that appear only later.
- Use scores and weights only with a meaningful measure. Words usually say more than an unsupported number.
- If a combination may beat options that fail on different terms, return the development need to the caller. Do not call an active `understand-brainstorm` again.

Use `understand-research` or a permitted test for a fact that would decide the choice. When candidate discovery is needed, `understand-research-survey` returns it to this active comparison without another weigh call. Use `understand-challenge` for one option. Return undeveloped options to the caller with the specific development they need. The caller owns the next generation pass. When a council returns disagreements, preserve them. Compare its members' answers when the user asks for a recommendation.

Return this default shape:

```text
Terms:         what matters to the question
Options:       each one's benefits, costs, risks and unknowns
Dropped:       excluded options and reasons
Recommended:   why it beats the next best; easy or hard to undo; or no clear winner
Would change:  unknowns and what would settle them
```

Use `respond-layout`: a short table may serve, and a list remains valid when rows would fit. Keep no lasting record yourself. Return the comparison, why a chosen option won and the options set aside for a keeper to record. The shared who-decides rule sets what the user sees of an agent-made choice.

## The last instruction

Check all options have the same terms and grounded evidence, including an honest downside search. Return a recommendation, a tie with what would settle it, or a specific development need preventing comparison. Reuse current checks. Follow the `understand` skill's rules and leave decisions and changes with their owner.
