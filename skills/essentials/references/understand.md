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

Understanding comes before acting, so the work answers what the user meant, not a guess. What matters is to find every open point that would change the result, and settle it: from the sources where they can, and with the user where only they can. **Explore first, settle what is open, then hand back one result.**

1. **Explore the sources before you ask or assume anything.** A question the files already answer wastes the user's time and hides what only they know, by rule 4.
   - Read the conversation, the files the request touches and any other source that can answer a question, such as which version, plan or audience is meant.
   - Keep track of what the sources settle and what stays open.
2. **Name what is still open, and decide who settles each point.** An open point left unnamed becomes a guess that the work relies on as a fact, by rule 3.
   - List each unknown or choice that would change the result, with what would settle it.
   - Leave to the user what is theirs: their intent, taste, anything hard to undo, and what only they know. Settle what is yours: what the project's conventions settle, and defaults easy to undo, by rule 5.
   - If a choice or unknown would change the result, read the `understand-clarify` guide before the first change, by rule 7, even when the answer seems plain.
3. **Ask the user, round by round, until you could state the intent, the goal and what done looks like.** Work built on a guess has to be undone, and the user pays for it.
   - Ask through the `respond-ask` guide, with a recommended answer. After each answer, ask again only about what is still open.
   - If the result rests on choices you made yourself, show them in one "Going with" message, then end the turn before any change, by rule 5. If the user told you to choose, or has just answered, put the line in your final answer instead.
   - A request with nothing open after steps 1 and 2 needs no questions.
4. **Use the method each open part needs.** Each guide below does one kind of understanding well. A request may need several, in any order. A part that fits none is your own judgment, under the rules above.
   - With the user: the `understand-discuss` guide works through the open parts of a topic. The `understand-clarify` guide settles choices that change the result.
   - Options: the `understand-brainstorm` guide generates distinct options.
   - Thinking it through: the `understand-frame` guide defines the problem and goal. The `understand-weigh` guide compares named options. The `understand-challenge` guide finds weaknesses in an idea. The `understand-argue` guide makes an honest one-sided case.
   - Names: the `understand-naming` guide checks and proposes shared names.
   - Sources: the `understand-research` guide investigates questions that need sourced facts.
   - A whole design belongs to the work designing it.
5. **Hand back the result in one shape, and keep nothing yourself.** The caller acts on the result, so it must find each part without knowing which guide made it, by rules 1 and 2.
   - Give what was decided and why, what was set aside and why, and what comes next. Add each used guide's own part.
   - Make no lasting change while understanding, by rule 6. Put probes in a scratch place, or remove them through the `act-cleanup` guide before you return.
6. **Check the result before you return it.** Always do this last. A wrong understanding passes its fault into all the work built on it.
   - Check the result shape, the marked guesses, the named unknowns, and that no lasting change was made.
   - Follow the final step of each guide you used. Fix what falls short before you return.
