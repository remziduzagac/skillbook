# understand-frame

## Purpose

States one problem, its goal, scope, constraints and a good answer.

## When to use

Use when the problem, goal or way to judge an answer is missing, or work loops or drifts. Also use when the user asks what is being solved. For example, repeated work that does not move toward a stated goal may need a new frame.

## When not

- A request with a clear problem, goal and way to judge the answer: use your judgment under the `understand` guide. A new frame adds nothing.
- Facts or intent only the user can supply: use the `understand-clarify` guide when the answer changes the result.
- Several problems: return them to the main task to divide first. Each frame needs one problem.
- Factual gaps: find sources. A frame names a missing fact; it does not prove it.

## Gives back

The problem, goal, limits and test for a good answer, plus unknowns and what would settle them.

## Rules

1. **Fill every part or mark it unknown.** Cover the problem, goal, exclusions, constraints and a good answer. Leaving a part empty lets later work treat an assumption as a fact and head the wrong way.
2. **Mark guesses where they stand.** Use "(guess)", by the `understand` guide's rule, so the user can correct them.
3. **Frame one problem.** Name a second problem and return it to the caller. Two problems cannot share one good answer.

## Advice

- Keep the problem statement to about one to three sentences: enough to state it, short enough to hold in mind.
- Describe how to check a good answer where possible, with a test, measure or example.
- Include anti-goals: failure even when it technically works.
- Describe what exists now and what has been tried, even badly.
- Make each part specific to this work. Define terms the work depends on. Use the `understand-naming` guide for a shared term that needs defining.
- Frame at the requested level. One question does not call for the whole product.
- Reframe loops. The question itself may be wrong.

## Instructions

Define one problem and how to judge its answer. Build the frame with these steps.

Return this short default form, with guesses marked:

```text
Problem:       one to three sentences
Goal:          what it serves and why
Out of scope:  what the work will not do
Constraints:   what is fixed
A good answer: how it will be recognized, checkable where possible
Unknown:       missing facts or choices and what would settle them
```

Keep no lasting record yourself. Return the frame to the caller. The `understand-brainstorm` guide opens with it, the `understand-weigh` guide uses its good-answer terms, and any design caller carries it into its purpose. The skill that saves records needs the frame and discussion it opens. Return an updated frame for the caller to replace an old record. Describe the change in the returned result. Two frames for one problem let work aim at the old one.

1. **State what is known first.** Facts can settle questions before the user is asked. Read the request, conversation and project files before asking, by the `understand` guide’s facts-first rule.
2. **Fill the frame.** Missing parts can become assumptions. Cover the problem, goal, exclusions, constraints and a good answer under the rules above.
3. **Route unknowns by what would settle them.** A missing fact must not become an unnecessary question or assumed preference. Read available facts first. Use the `understand-research` guide for factual gaps needing sources. Return its fact to this active frame without another framing round. Use the `understand-clarify` guide for user choices or knowledge that would change the result. Mark other gaps unknown without forcing a question.
4. **Show the frame with the read-only answer.** A wrong frame wastes later work, so show relevant assumptions and the problem. Add no checkpoint of your own. Before changes, follow the `understand` guide’s who-decides rule and the `act` guide’s plan rule.

5. **Check that you have filled each part or marked it unknown.** Always do this last. Check that you have marked guesses and routed each gap by what would settle it. Return the frame under the `understand` guide's rules. Add no separate turn-ending checkpoint and make no lasting change.
