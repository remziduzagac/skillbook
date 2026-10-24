# understand-clarify

Finds the user's meaning before acting. Decides what to ask, what to choose and show, and how deep to go. Routes to the part that asks. Asks nothing itself.

## Rules

1. **Ask only what is the user's to decide and would change the work.** An unneeded question costs the user a turn, and an unstated choice is one they cannot correct.
   - Test likely answers. If all lead to the same work, decide and continue. If two lead to different work or results, use the `understand` skill's who-decides rule. It also settles choices of both kinds:
     - the user's: ask. "Write the project overview" (for whom) and "clean up the old branches" (which ones go) ask.
     - yours: make it. Show it before work in a "going with" line, by the `understand` skill's who-decides rule. "Add retries to the API client" can use the project's HTTP library and three tries, shown first.
   - "Rename `foo` to `bar` in this file" and "fix the typo in the README" leave no such choice.
   - The result is not always code or files. It can be a document, a decision, an action or anything else.
2. **Act on nothing an open question could change until the answers are in.**
   - Reading and finding facts go on meanwhile.
   - Work that no answer would change may go ahead; say so in a line.
   - "Go ahead" accepts the recommended answers, as `respond-ask` says.
   - This is stricter than the `understand` skill's ban on lasting changes while understanding. It varies that rule because it is the user's own wish.

Follow the `understand` skill for facts first, who decides, keeping nothing, result shape and marked guesses. Use `respond-ask` for questions and recommended answers. Return the `understand` shape with assumptions left unconfirmed. Each part's own form is in its file.

## Advice

- Start shallow. Load deep directly when the user asks to be questioned. Depth becomes clear only after seeing the whole level. One round costs little. Many small tasks end there.
- Use dependence to trigger deep, never question count. An answer must open questions that would change the work. Plans and designs usually have dependent parts. Usually offer deep after shallow for those.
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
- **Ask whether independent work should proceed while a questionnaire is out.** Ask through `respond-ask` only if independent work remains. Otherwise say what waits for answers. Park the questionnaire's questions until answers return. Start no dependent work.

Not here:

- The user not following you goes to `respond-explain`.
- "What do you think?" goes to the `act` skill's rule that an opinion is not a task.
- A topic to decide together, or options wanted, is your own judgment, under the `understand` skill's rules.

## The last instruction

Before you act on anything an open question could change, check:

- Every question that is the user's to decide is answered, taken with its recommended answer by the user's acceptance, parked, or in a questionnaire.
- "Going with" is said, with the choices the work rests on, or the summary is confirmed, or it is shown where the user told you to start the work.
- The `understand` skill's rules hold.
