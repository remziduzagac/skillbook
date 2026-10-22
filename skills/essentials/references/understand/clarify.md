# understand-clarify

Finds out what the user means before acting: decides what to ask, what to choose and state instead, and how deep, and sends the work to the part that asks. It asks nothing itself.

## Rules

1. **Ask only what is the user's to decide and would change the work.** An unneeded question costs the user a turn, and an unstated choice is one they cannot correct.
   - The test: if every likely answer leads to the same work, decide and go on. If two likely answers would lead to different work or a different result, look at whose the choice is, by the `understand` skill's rule on who decides, which also says which side wins when a choice is both:
     - the user's: ask. "Write the project overview" (for whom) and "clean up the old branches" (which ones go) ask.
     - yours: make it, and state it in a "going with" line before the work, so the user can correct it. "Add retries to the API client" can go with the project's HTTP library and three tries, stated first.
   - "Rename `foo` to `bar` in this file" and "fix the typo in the README" leave no such choice.
   - The result is not always code or files. It can be a document, a decision, an action or anything else.
2. **Act on nothing an open question could change until the answers are in.**
   - Reading and finding facts go on meanwhile.
   - Work that no answer would change may go ahead; say so in a line.
   - "Go ahead" accepts the recommended answers, as `respond-ask` says.
   - Note: this rule is stricter than the `understand` skill's rule that nothing is changed for good while understanding. It is a variation of that rule, because it is the user's own wish.

These are the `understand` skill's rules: facts first, who decides, keeping nothing, the result shape, and marking guesses. How a question is put, with its recommended answer, is `respond-ask`'s. The result is in the `understand` skill's shape, plus what was assumed when anything was left unconfirmed. Each part's own form is in its file.

## Advice

- Start shallow, unless the user asks to be questioned. Which part needs depth shows only once the whole level is seen, and one round costs little. Many small tasks end there.
- The trigger for deep is dependence, never the number of questions: an answer that opens questions that would change the work. A plan or a design usually has parts that depend on each other, so deep is usually offered after the shallow round.
- When, after the shallow round, you are unsure whether a part needs depth, offer deep rather than going deep.

## Instructions

- **shallow** (`understand-clarify-shallow`): when clarify starts on a request, unless the user asked to be questioned; and, for deep, at each new level inside a part.
  - Not for: the user asking to be questioned or a part whose answers depend on each other (deep), or questions only someone else can answer (questionnaire).
  - Gives back: the "going with" line, with an offer of deep for a part whose answers depend on each other.
- **deep** (`understand-clarify-deep`): when the user accepted shallow's offer of deep for a part whose answers open questions that would change the work. Load it at once, with no offer, when the user asks to be questioned, such as "question me on this plan".
  - Not for: a level not yet seen whole (shallow first), a topic still to be decided together, or questions only someone else can answer (questionnaire).
  - Gives back: the summary the user confirmed, or saw after telling you to start the work: decided, parked, accepted and assumed.
- **questionnaire** (`understand-clarify-questionnaire`): when questions remain that only someone other than the user can answer, after the user answers theirs. Either the user says so, or you see it. If you see it, ask the user whether someone else holds the answer, rather than deciding alone.
  - Not for: anything the user can answer, or anything the files say.
  - Gives back: the document, in the response by default, for the user to send. Later, its answers, taken back here.
- **While a questionnaire is out:** its questions are parked until the answers return. Work that depends on them does not start. If work that does not depend on them is left, ask the user, through `respond-ask`, whether it goes ahead. If none is left, say what waits for the answers.

Not here:

- The user not following you goes to `respond-explain`.
- "What do you think?" goes to the `act` skill's rule that an opinion is not a task.
- A topic to decide together, or options wanted, is your own judgment, under the `understand` skill's rules.

## The last instruction

Before you act on anything an open question could change, check:

- Every question that is the user's to decide is answered, taken with its recommended answer by the user's acceptance, parked, or in a questionnaire.
- "Going with" is said, with the choices the work rests on, or the summary is confirmed, or it is shown where the user told you to start the work.
- The `understand` skill's rules hold.
