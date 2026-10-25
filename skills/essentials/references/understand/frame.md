# understand-frame

States one problem, its goal, scope, constraints and a good answer.

## Rules

1. **State what is known first.** Read the request, conversation and project files before asking, by the `understand` skill's facts-first rule.
2. **Fill every part or mark it unknown.** Cover the problem, goal, exclusions, constraints and a good answer. Leaving a part empty lets later work treat an assumption as a fact and head the wrong way.
3. **Mark guesses where they stand.** Use "(guess)", by the `understand` skill's rule, so the user can correct them.
4. **Route unknowns by what would settle them.** Read available facts first. Find source-backed answers to factual gaps. Use `understand-clarify` for user choices or knowledge that would change the result. Mark other gaps unknown without forcing a question. A missing fact must not become an unnecessary question or assumed preference.
5. **Frame one problem.** Name a second problem and return it to the caller. Two problems cannot share one good answer.
6. **Show the frame with the read-only answer.** Add no checkpoint of your own. Before changes, follow the `understand` skill's who-decides rule and the `act` skill's plan rule. A wrong frame wastes later work, so show relevant assumptions and the problem.

## Advice

- Keep the problem statement to about one to three sentences: enough to state it, short enough to hold in mind.
- Describe how to check a good answer where possible, with a test, measure or example.
- Include anti-goals: failure even when it technically works.
- Describe what exists now and what has been tried, even badly.
- Make each part specific to this work. Define terms the work depends on. Use `understand-naming` for a shared term that needs defining.
- Frame at the requested level. One question does not call for the whole product.
- Reframe loops. The question itself may be wrong.

Return this short default form, with guesses marked:

```text
Problem:       one to three sentences
Goal:          what it serves and why
Out of scope:  what the work will not do
Constraints:   what is fixed
A good answer: how it will be recognized, checkable where possible
Unknown:       missing facts or choices and what would settle them
```

Keep no lasting record yourself. Return several problems to the caller to divide. Return the frame to the caller. `understand-brainstorm` opens with it, `understand-weigh` uses its good-answer terms, and any design caller carries it into its purpose. A keeper needs the frame and discussion it opens. Return an updated frame for the caller to replace an old record. Describe the change in the returned result. Two frames for one problem let work aim at the old one.

## The last instruction

Check that you have filled each part or marked it unknown. Check that you have marked guesses and routed each gap by what would settle it. Return the frame under the `understand` skill's rules. Add no separate turn-ending checkpoint and make no lasting change.
