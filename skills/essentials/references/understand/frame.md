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

Define one problem and how to recognize a good answer. Make known facts, guesses and missing choices visible so later work aims at the same goal. **Read what is known, fill the frame, then route each gap to what can settle it.**

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

1. **Read known facts through the `understand` guide before asking.** Asking the user for what the project already says wastes their time and can miss a fixed constraint.
   - Read the request, conversation and relevant project files. Include what exists now and what has already been tried.
2. **Fill the frame's parts under rules 1–3.** An empty scope or judging term lets later work invent its own target.
   - Give one problem, its goal, exclusions, constraints and a good answer. Keep the frame at the requested level.
   - Make the good answer checkable with a test, measure or example where possible. Include anti-goals: ways the result could technically work yet fail its purpose.
   - Mark guesses where they stand and missing parts unknown. Return a second problem to the caller rather than forcing it into this frame.
3. **Route each unknown to the source or decision that can settle it.** A factual gap turned into a preference question makes the user do the research; a preference treated as fact takes away their choice.
   - Read available facts first. Use the `understand-research` guide for sourced factual gaps and return the fact here without another framing round.
   - Use the `understand-clarify` guide for user choices or knowledge that would change the result. Leave other gaps marked unknown, with what would settle them.
4. **Show the frame with the read-only answer, under the `understand` guide's rules.** An unseen interpretation can send later work toward the wrong problem.
   - Include relevant assumptions and the problem. Add no frame-only approval checkpoint.
   - Before changes, follow the `understand` guide's who-decides rule and the `act` guide's plan rule. Return an updated frame and explain its change instead of keeping two current frames.
5. **Check the frame against “Gives back” before returning it.** Always do this last. The caller needs a usable target rather than a form with hidden gaps.
   - Check every part is filled or unknown, guesses are marked and each gap has a way to settle it. Check the result concerns one problem.
   - Fix missing parts before returning under the `understand` guide's rules. Make no lasting change and add no separate checkpoint.
