# understand-clarify

## Purpose

Finds which choices need answers before work starts, who decides each, and how deep to question. Sees the whole level first, asks the smallest round that sets direction, with recommended answers where grounded, and shows a "Going with" line for answers and choices.

## When to use

Use before acting when two likely answers would lead to different work or results. This includes choices left open in a plan, answers someone else holds, and a request for an interview to find open choices. For example, "Clean up the old branches" leaves open which ones go and which stay.

- Ask a round when clarification starts finding open choices and the user asked for no interview, such as "plan the migration to Postgres".
- Ask a round also when deep reaches a new level inside a part, such as the rooms on one floor of a house renovation.

## When not

- An exact question the user supplied: use the `respond-ask` guide. The question is already chosen, so no search for open choices is needed.
- Facts already in files: read them first, by the main skill's step 1 on exploring the sources first. The user need not supply what you can find.
- A topic to decide together: use the `understand-discuss` guide. Its goal is a joint decision, not finding the user's meaning.
  - If the user also asks you to ask what only they can decide, use this guide first. One round settles what they already hold. Discussion then takes the parts still open.
- The user did not follow you: use the `respond-explain` guide. The gap is in your explanation.
- A view, such as "What do you think?": give it by the main skill's step 1 on giving your view. Do not treat it as a task.
- Generating options: use the `understand-brainstorm` guide for new ideas.
- Likely answers that all lead to the same work: decide and go on. "Rename `foo` to `bar` in this file" and "fix the typo in the README" leave no choice that changes the result.
- For the Ask a round part only: a requested interview, or a part whose answers depend on each other. Use the `understand-clarify-deep` guide when its "When to use" fits. The round does not follow dependent questions through later rounds. Deep asks its own rounds.
- For the Ask a round part only: questions only someone else can answer. Use the `understand-clarify-questionnaire` guide to write questions for that person.
- These two exclusions, and rules 3 to 5, bind the Ask a round part only. Deep and questionnaire keep their own rules and may ask several rounds.

## Gives back

The visible "Going with" line and assumptions, with an offer of deep questions for parts whose answers depend on each other. Or the summary from the `understand-clarify-deep` guide, or a questionnaire for the person who holds the answers.

## Rules

1. **Ask only what is the user's to decide and would change the work.** An unneeded question costs the user a turn. A choice left unstated is one they cannot correct.
   - For the choices this request leaves open, follow the main skill's step 1 on who decides:
     - the user's: ask. "Write the project overview" (for whom) and "clean up the old branches" (which ones go) ask.
       - A preference in a short draft is that rule's exception: "write a short notice about the hall's new hours" can be written for its regular users, with that choice named.
     - yours: make it, and show it in a "Going with" line. "Add retries to the API client" can use the project's HTTP library and three tries, named in the final answer.
   - The result is not always code or files. It can be a document, a decision, an action or anything else.
2. **Act on nothing an open question could change until the answers are in.**
   - Reading and finding facts go on meanwhile.
   - Work that no answer would change may go ahead. Report it in one line in the final answer.
   - "Go ahead" accepts the recommended answers, as the `respond-ask` guide says.
   - This is stricter than the main skill's step 1 ban on lasting change while you understand. It varies that rule because it is the user's own wish.
3. **When you ask a round, see the whole level before you go deeper into any part.** Depth becomes clear only after you see the whole. Look across the level through the parts of a frame, as the `understand-frame` guide names them: the problem, the goal, what is in and out of scope, the constraints, such as time or cost, and what a good result looks like. Start at the request's top level, or at an inner level deep has reached.
   - Ask the smallest round that sets direction. It covers every part that the sources leave open and the user owns, not only the first.
   - Ask later questions when their answers are needed. A long routine round costs more than it settles.
4. **When you ask a round, ask it as one round through the `respond-ask` guide.** The user answers at once and sees the whole level.
5. **When you ask a round, show "Going with: …" for the basis the work rests on.** The user must see that basis. Sum up decisions, assumptions and open questions.
   - Show it with the round, which ends the turn.
   - Put it in your final answer instead when no question is left and the main skill's step 1 on who decides lets the work go ahead, or when the user has just answered.
   - Repeat their latest answers only where you interpreted them. Leave out minor choices, by the main skill's step 1 on who decides. Repeating everything hides what matters.

## Advice

- Use dependence to trigger deep, never question count. An answer must open questions that would change the work. Plans and designs usually have dependent parts. Usually offer deep for those, in the round or after it. A round has no fixed number of questions.
- When you are unsure after the round whether a part needs depth, offer deep instead of going deep.

## Instructions

Settle the choices that would change the result before the work they affect starts. Each part asks in its own way, so choose the right one before your first question. **Choose the part that fits, ask through it, then check readiness before you act.**

1. **Choose the part before your first question: Ask a round by default.** A round asked without its method misses parts of the request. The user then finds the unasked choices only in the result.
   - Ask a round sees a whole level of choices in one round. Use it in every case not listed below. One round costs little, and many small tasks end there.
   - The `understand-clarify-deep` guide settles choices that depend on each other. Read it at once when the user asks you to interview them about their open choices, such as "quiz me on this course outline". Read it for a part after the user accepts your offer of deeper questions on it.
   - The `understand-clarify-questionnaire` guide writes questions for someone else. Read it when only someone other than the user can answer, such as a landlord.
2. **While a questionnaire is out, start no work that depends on its answers.** A missing reply turned into a guess decides for the user.
   - Park its questions until the answers return.
   - Name in your answer the choices that wait for the answers.
   - If work that does not depend on them is left, ask through the `respond-ask` guide whether it goes ahead. Then end the turn.
   - Ask no such question when the user has already asked for that work.

### Ask a round

See the whole level before you explore any part more deeply. Ask the smallest round that sets direction, so the user can answer the important choices together. **Read across the level, then ask one round, with the basis for the work and any deep offer in the same response.**

1. **Read across the whole level through the frame's parts, by rule 3.** Starting with one detail can hide a choice elsewhere that changes it.
   - For each part, find what the sources settle and which choices are the user's by rule 1, such as who a newsletter is for and how often it goes out.
   - Ask first about choices that others depend on.
   - Make the choices that are yours. Put a likely value the work rests on in "Going with", such as rows per page in a new list view.
2. **Remove questions that rule 1 excludes.** Asking what files settle or what changes nothing makes the user repeat work you can do.
   - If no user choice remains, ask nothing. Handle visible choices by the main skill's step 1 on who decides.
3. **Ask one round through the `respond-ask` guide, with grounded recommended answers.** A round without reasons leaves the user to work out the trade-offs alone.
   - Keep the round to what rule 3 says.
4. **When you ask a round, put in the same response everything the user must see before work starts.** A basis the user sees only after slow or hard-to-undo work is too late to correct.
   - Show "Going with: …" for your own choices that the work rests on, by rule 5.
   - For a part whose answers would depend on each other and change the work, add one question to the round: whether to question the user on that part in depth. Add it too when you are unsure whether they would. Recommend yes, with the reason. Ask no deep question before a yes.
   - Make no offer when deep called this part. The user has said yes already.
5. **End the turn with the round, as the `respond-ask` guide requires.** Answering your own questions would take the user's choice away.
6. **Take the answers, then settle what they open.** One answer may open further choices that the first round could not see.
   - Keep accepted, changed, assumed and parked answers apart, with the `respond-ask` guide's labels. Keep questionnaire items apart too.
   - When an answer opens choices that depend on each other and would change the work, offer deep on that part, as step 4 says. Then end the turn.
   - After a yes, read the `understand-clarify-deep` guide for that part. If deep called this part, return the part to deep without another offer.
   - If the user declines deep, take that part's questions with their recommended answers, and park those without one. Supply no fact only the user knows. List both in "Going with" in your final answer, with the work, each with its status by the `respond-ask` guide's rule 4. The user has just answered, so the line only needs to be seen.

### Final check

**Always do this last.** Check readiness against "Gives back" and the main skill's step 1 before acting. An unanswered choice can send the work in a direction the user never chose. The user cannot correct a basis they have not seen.

- Check each user-owned question is answered, accepted with its recommended answer, parked, or in a questionnaire, or that its part was offered to deep and the user said yes or no. Under rule 2, start no work that an open answer could change. While a questionnaire is out, check that your answer names the choices that wait for it.
- Check the choices the work rests on are shown in "Going with": the decisions, assumptions, parked questions and questionnaire items. Show them before the work or in the final answer, as the main skill's step 1 on who decides says, repeating the latest answers only where you interpreted them. Or check that the user confirmed the deep summary.
- Check that each deep offer names its part and why its answers depend on each other.
- Check the chosen part's result and its final step. Keep unconfirmed assumptions visible. Fix any missing answer, disclosure or status before you hand the result back.
