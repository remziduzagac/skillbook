# understand-clarify

## Purpose

Finds which choices need answers before work starts, who should decide, and how deep to question.

## When to use

Use before acting if two likely answers would lead to different work or results. This includes choices left open in a plan, answers held by someone else, and a request for an interview to find open choices. For example, “Clean up the old branches” leaves which ones go and which stay.

## When not

- An exact question supplied by the user: use the `respond-ask` guide. The question has already been chosen.
- Facts already in files: read them first, by the `understand` guide’s rule 4. The user need not supply what you can find.
- A topic to decide together: use the `understand-discuss` guide. The goal is a joint decision rather than finding the user’s meaning.
- The user did not follow you: use the `respond-explain` guide. The gap is in your explanation.
- A view such as “What do you think?”: follow the `act` guide’s rule 2. Give the view without treating it as a task.
- Generating options: use the `understand-brainstorm` guide for new ideas.
- Likely answers all lead to the same work: decide and continue. “Rename `foo` to `bar` in this file” and “fix the typo in the README” leave no choice that changes the result.

## Gives back

The visible “Going with” line and assumptions, the summary from the `understand-clarify-deep` guide, or a questionnaire for the person who holds the answers.

## Rules

1. **Ask only what is the user's to decide and would change the work.** An unneeded question costs the user a turn, and an unstated choice is one they cannot correct.
   - For the choices this request leaves open, follow the `understand` guide's who-decides rule:
     - the user's: ask. "Write the project overview" (for whom) and "clean up the old branches" (which ones go) ask.
     - yours: make it. Show it before work in a "going with" line, by the `understand` guide's who-decides rule. "Add retries to the API client" can use the project's HTTP library and three tries, shown first.
   - The result is not always code or files. It can be a document, a decision, an action or anything else.
2. **Act on nothing an open question could change until the answers are in.**
   - Reading and finding facts go on meanwhile.
   - Work that no answer would change may go ahead. Report that work in one line in the final answer.
   - "Go ahead" accepts the recommended answers, as the `respond-ask` guide says.
   - This is stricter than the `understand` guide's ban on lasting changes while understanding. It varies that rule because it is the user's own wish.

Follow the `understand` guide for facts first, who decides, keeping nothing, result shape and marked guesses. Use the `respond-ask` guide for questions and recommended answers. Return the `understand` guide shape with assumptions left unconfirmed. Each part's own form is in its file.

## Advice

- Start shallow. Load deep directly when the user asks for an interview to find open choices. Depth becomes clear only after seeing the whole level. One round costs little. Many small tasks end there.
- Use dependence to trigger deep, never question count. An answer must open questions that would change the work. Plans and designs usually have dependent parts. Usually offer deep after shallow for those.
- When, after the shallow round, you are unsure whether a part needs depth, offer deep rather than going deep.

## Instructions

Settle the choices that would change the result before affected work starts. Depth depends on whether answers open further choices and who holds them. **Use the child method that fits the open choices, then check readiness before acting.**

- the `understand-clarify-shallow` guide: see a whole level of choices.
- the `understand-clarify-deep` guide: resolve dependent choices.
- the `understand-clarify-questionnaire` guide: write questions for someone else.
- **Ask whether independent work should proceed while a questionnaire is out.** Ask through the `respond-ask` guide only if independent work remains. Otherwise say what waits for answers. Park the questionnaire's questions until answers return. Start no dependent work.

1. **Check readiness against “Gives back” and the `understand` guide before acting.** Always do this last. An unanswered choice can send the work in a direction the user never chose.
   - Check each user-owned question is answered, accepted with its recommended answer, parked, or in a questionnaire. Under rule 2, start no work that an open answer could change.
   - Check the user has seen the choices the work rests on in “Going with”, or confirmed the deep summary. Follow the `understand` guide's who-decides rule when the user already told you to start.
   - Check the chosen child's result and final step. Keep unconfirmed assumptions visible. Fix any missing answer, disclosure or status before handing the result back.
