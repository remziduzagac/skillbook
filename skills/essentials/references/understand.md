# understand

## Purpose

Works out what a request means, with the user and from sources. The main task applies the result.

## When to use

Use before acting when the request leaves something open or needs facts, options or a decision. For example, an audience that has not been named can change the answer.

## When not

- Project changes you will keep after this analysis, or putting a decision into practice: return that work to the main task. This guide keeps no changes in the project.

## Gives back

Decisions and their reasons, questions set aside and why, and next steps. Give these to the caller, or in the response for a direct request. Add each used method’s own results; save nothing here.

## Rules

1. **Hand back every result.** Understanding keeps nothing.
   - Called by a guide or skill: to that caller.
   - Used directly: to the skill the project’s instructions name for saving records, if any. That skill chooses the location and format.
   - If no skill saves records: it stays in the response. Offer a long result, or one the user wants kept, as a file they name.
2. **Use one result shape.** Give what was decided and why, what was parked and why, and what comes next. Add each guide's own part. A caller can then keep any result without knowing which guide made it.
   - Use the shape to locate parts, not as a form to fill. Omit empty fields. Keep "Not found" when something was looked for. Omit fields the user already has, such as their question.
   - Combine results from several guides into one shape. Keep each guide's additions. The caller gets one result back.
3. **Mark guesses and assumptions.** Name each unknown that would change the result. Say what would settle it. An unmarked guess gets relied on as a fact.
4. **Read the facts before asking or assuming.** Read what can settle a question, such as which version, plan or provider is meant. Asking what the files already say wastes the user's time and hides what only they know.
5. **Who decides:** some choices are the user's, and some are yours.
   - The user's: their intent, taste or preferences, anything hard to undo, and what only they know. Ask through the `respond-ask` guide, with a recommended answer.
   - Yours: what the project's conventions settle, and a default easy to undo. Make it.
   - **Show your choices before you change anything.** If the result rests on choices you made, write one "Going with: …" message that lists them. Then end the turn. Change nothing until the user replies, because a choice they see only after the work is too late to correct.
   - If the user told you to choose, or has just answered your questions, go ahead. Put the "Going with" line in your final answer, with the work. They have already shaped the work, so the line only needs to be seen.
   - A change made by a command counts too, such as one that rewrites, moves or renames files.
   - Minor choices need no line. Give the reason if the user asks.
   - A choice of both kinds is the user's: a wedding toast's style, though easy to rewrite. Ease of undoing decides only what they left to you.
   - Easy to undo means the effects, not just the file: a change that sends messages, migrates data or reaches users is hard to undo.
6. **Make no lasting change while understanding.** A change now decides for the user. Put probes and experiments in a scratch place. Otherwise remove them through the `act-cleanup` guide before returning the result. Acting on it is the caller's job, or waits for the user.
7. **Read the `understand-clarify` guide before the first change** if a request leaves a choice or unknown that would change the result. Do this even when the answer seems plain. That guide decides whether to ask or show a choice, and requires a shown choice before work.

## Advice

- Give as much understanding as the decision deserves; a plan needs more.
- The question itself may be wrong. Reframing it is always an option.
- Show what the user would want to correct, such as how you framed the question or what you assumed.

## Instructions

Work out what the request needs before acting. Use the child method each part needs; these methods have no fixed order.

**With the user:**

- the `understand-discuss` guide: work through open topic parts.

- the `understand-clarify` guide: settle choices that change the result.

**Exploring options:**

- the `understand-brainstorm` guide: generate distinct options.

**Thinking it through:**

- the `understand-frame` guide: define the problem and goal.
- the `understand-weigh` guide: compare named options.
- the `understand-challenge` guide: find weaknesses in an idea.
- the `understand-argue` guide: make an honest one-sided case.

**Names:**

- the `understand-naming` guide: check and propose shared names.

**Finding out from sources:**

- the `understand-research` guide: investigate sourced questions.

A whole design belongs to the work designing it. Anything else about understanding that fits no line here is your own judgment, under the rules above. Use the `understand-research` guide for facts needing sourced investigation.

1. **Check the rules above before returning anything.** Always do this last. Check the result shape, marked guesses, named unknowns and no lasting changes. Follow the final step of Instructions in each used guide too.
