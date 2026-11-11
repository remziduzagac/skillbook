# understand-clarify

## Purpose

Finds which choices need answers before work starts, who should decide, and how deep to question.

## When to use

Use before acting if two likely answers would lead to different work or results. This includes choices left open in a plan, answers held by someone else, and a request for an interview to find open choices. For example, “Clean up the old branches” leaves which ones go and which stay.

## When not

- An exact question supplied by the user: use the `respond-ask` guide. The question has already been chosen.
- Facts already in files: read them first, by the main skill's step 1 on exploring the sources first. The user need not supply what you can find.
- A topic to decide together: use the `understand-discuss` guide. The goal is a joint decision rather than finding the user’s meaning. If the user also asks you to ask what only they can decide, use this guide first. One round settles what they already hold. Discussion then takes the parts still open.
- The user did not follow you: use the `respond-explain` guide. The gap is in your explanation.
- A view such as “What do you think?”: follow the main skill's step 1 on giving your view. Give the view without treating it as a task.
- Generating options: use the `understand-brainstorm` guide for new ideas.
- Likely answers all lead to the same work: decide and continue. “Rename `foo` to `bar` in this file” and “fix the typo in the README” leave no choice that changes the result.

## Gives back

The visible “Going with” line and assumptions, the summary from the `understand-clarify-deep` guide, or a questionnaire for the person who holds the answers.

## Rules

1. **Ask only what is the user's to decide and would change the work.** An unneeded question costs the user a turn, and an unstated choice is one they cannot correct.
   - For the choices this request leaves open, follow the main skill's step 1 on who decides:
     - the user's: ask. "Write the project overview" (for whom) and "clean up the old branches" (which ones go) ask. A preference in a short draft is that rule's exception: "write a short notice about the hall's new hours" can be written for its regular users, with that choice named.
     - yours: make it, and show it in a "Going with" line, by the main skill's step 1 on who decides. "Add retries to the API client" can use the project's HTTP library and three tries, named in the final answer.
   - The result is not always code or files. It can be a document, a decision, an action or anything else.
2. **Act on nothing an open question could change until the answers are in.**
   - Reading and finding facts go on meanwhile.
   - Work that no answer would change may go ahead. Report that work in one line in the final answer.
   - "Go ahead" accepts the recommended answers, as the `respond-ask` guide says.
   - This is stricter than the main skill's step 1 ban on lasting change while you understand. It varies that rule because it is the user's own wish.

## Advice

- Use dependence to trigger deep, never question count. An answer must open questions that would change the work. Plans and designs usually have dependent parts. Usually offer deep for those, in the shallow round or after it.
- When, after the shallow round, you are unsure whether a part needs depth, offer deep rather than going deep.

## Instructions

Settle the choices that would change the result before the work they affect starts. Each child guide asks in its own way, so read the right one before your first question. **Read the child guide that fits, ask through it, then check readiness before you act.**

1. **Read the child guide that fits before your first question: the `understand-clarify-shallow` guide by default.** A round asked without its guide misses parts of the request, and the user finds the unasked choices only in the result.
   - The `understand-clarify-shallow` guide sees a whole level of choices in one round. Read it in every case not listed below. Which part needs depth shows only once the whole level is seen. One round costs little, and many small tasks end there.
   - The `understand-clarify-deep` guide resolves choices that depend on each other. Read it at once when the user asks you to interview them about their open choices, such as "quiz me on this course outline". Read it for a part after the user accepts your offer of deeper questions on it.
   - The `understand-clarify-questionnaire` guide writes questions for someone else. Read it when only someone other than the user can answer, such as a landlord.
2. **While a questionnaire is out, start no work that depends on its answers.** A missing reply turned into a guess decides for the user.
   - Park its questions until the answers return.
   - Name in your answer the choices that wait for the answers.
   - If work that does not depend on them is left, and the user has not asked for it already, ask through the `respond-ask` guide whether it goes ahead. Then end the turn.
3. **Check readiness against “Gives back” and the main skill's step 1 before acting.** Always do this last. An unanswered choice can send the work in a direction the user never chose.
   - Check each user-owned question is answered, accepted with its recommended answer, parked, or in a questionnaire. Under rule 2, start no work that an open answer could change. While a questionnaire is out, check that your answer names the choices that wait for it.
   - Check the choices the work rests on are shown in “Going with”, before the work or in the final answer as the main skill's step 1 on who decides says, or that the user confirmed the deep summary.
   - Check the chosen child's result and final step. Keep unconfirmed assumptions visible. Fix any missing answer, disclosure or status before handing the result back.
