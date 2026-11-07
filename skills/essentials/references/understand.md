# understand

## Purpose

Works out what a request means, with the user and from sources. The main task applies the result.

## When to use

Use before acting when the request leaves something open or needs facts, options or a decision. For example, an audience that has not been named can change the answer.

## When not

- Project changes you will keep after this analysis, or putting a decision into practice: return that work to the main task. This guide keeps no changes in the project.
- A view, such as "what do you think of this pricing page?": follow the `act` guide's rule 2. A view is not a task, so nothing needs settling before it.
- The user did not follow you: use the `respond-explain` guide. The gap is in your explanation, not in their request.

## Gives back

Decisions and their reasons, questions set aside and why, and next steps. Give these to the caller, or in the response for a direct request. Add each used method’s own results; save nothing here.

## Rules

1. **Hand back every result.** Understanding keeps nothing.
   - Called by a guide or skill: hand the result to that caller.
   - Used directly: hand it to the skill the project’s instructions name for saving records, if any. That skill chooses the location and format.
   - If no skill saves records: keep the result in the response. Offer a long result, or one the user wants kept, as a file they name.
2. **Use one result shape.** Give what was decided and why, what was parked and why, and what comes next. Add each guide's own part. A caller can then keep any result without knowing which guide made it.
   - Use the shape to locate parts, not as a form to fill. Omit empty fields. Keep "Not found" when something was looked for. Omit fields the user already has, such as their question.
   - Combine results from several guides into one shape. Keep each guide's additions. The caller gets one result back.
3. **Mark guesses and assumptions.** Name each unknown that would change the result. Say what would settle it. An unmarked guess gets relied on as a fact.
4. **Read the facts before asking or assuming.** Read what can settle a question, such as which version, plan or provider is meant. Asking what the files already say wastes the user's time and hides what only they know.
5. **Who decides:** some choices are the user's, and some are yours.
   - The user's: their intent, taste or preferences, anything hard to undo, and what only they know. Ask through the `respond-ask` guide, with a recommended answer.
   - One exception: a preference in a short draft, such as the tone of a thank-you card or who a short notice is for. Write the likely version, name the choice in a "Going with" line and offer the other. A draft the user can react to costs less than a round of questions.
   - Short means one piece of a few lines or paragraphs. Work in several parts, such as a week's itinerary or a handbook chapter, is long: ask about the user's choices first, because a guess repeats through every part.
   - The exception never covers a fact or decision only the user can supply, such as a fee or a club rule. Ask for it however quick the edit, because a guessed value reads as settled.
   - Yours: what the project's conventions settle, and a default easy to undo. Make these choices yourself.
   - **Show the choices the result rests on in one "Going with: …" line.** When the work is quick to redo, such as a short draft or an edit under version control, do the work and put the line in your final answer. When it is slow or hard to undo, show the line first and end the turn. Change nothing until the user replies, because a choice seen only after such work is too late to correct.
   - If the user told you to choose, or has just answered your questions, go ahead. Put the "Going with" line in your final answer, with the work. After a question round, give each question its status label there, by the `respond-ask` guide's rule 4.
   - This holds for a change made by a command too, such as one that rewrites, moves or renames files.
   - Minor choices need no line. Give the reason if the user asks.
   - Easy to undo means the effects, not just the file: a change that sends messages, migrates data or reaches users is hard to undo.
6. **Make no lasting change while understanding.** A change now decides for the user. Put probes and experiments in a scratch place, or remove them through the `act-cleanup` guide before returning the result. Acting on it is the caller's job, or waits for the user.
7. **Read the `understand-clarify` guide before the first change** if a request leaves a choice or unknown that would change the result. Do this even when the answer seems plain. That guide decides whether to ask or show a choice, and when a shown choice must come before the work.

## Advice

- Give as much understanding as the decision deserves; a plan needs more.
- The question itself may be wrong. Reframing it with the `understand-frame` guide is always an option.
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
3. **Settle what only the user can decide through the `understand-clarify` guide, round by round, until you could state the intent, the goal and what done looks like.** Work built on a guess has to be undone, and the user pays for it.
   - That guide, and the child guide it sends you to, choose the questions and how deep to go. The `respond-ask` guide sets how each question is put, with a recommended answer.
   - After each answer, ask again only about what is still open.
   - If the result rests on choices you made yourself, show them in one "Going with" line, before the work or in your final answer, by rule 5.
   - A request with nothing open after steps 1 and 2 needs no questions.
4. **Read the guide for each open part's method before you work on that part.** Each guide below does one kind of understanding well, with checks this guide does not repeat. A request may need several, in any order. A part that fits none is your own judgment, under the rules above.
   - With the user: the `understand-discuss` guide works through the open parts of a topic. The `understand-clarify` guide settles choices that change the result: in a round of questions, in an interview the user asks for, or in questions for someone else who holds the answers.
   - Options: the `understand-brainstorm` guide generates distinct options.
   - Thinking it through: the `understand-frame` guide defines the problem and goal. The `understand-weigh` guide compares named options. The `understand-challenge` guide finds weaknesses in an idea. The `understand-argue` guide makes an honest one-sided case.
   - Names: the `understand-naming` guide checks and proposes shared names.
   - Sources: the `understand-research` guide finds sourced facts, existing options or the cause of a problem, even from local files.
   - A whole design belongs to the `devise-design` guide.
5. **Hand back the result in one shape, and keep nothing yourself.** The caller acts on the result, so it must find each part without knowing which guide made it, by rules 1 and 2.
   - Give what was decided and why, what was set aside and why, and what comes next. Add each used guide's own part.
   - Make no lasting change while understanding, by rule 6. Put probes in a scratch place, or remove them through the `act-cleanup` guide before you return.
6. **Check the result before you return it.** Always do this last. A wrong understanding passes its fault into all the work built on it.
   - Check the result shape, the marked guesses, the named unknowns, and that no lasting change was made.
   - Follow the final step of each guide you used. Fix what falls short before you return.
