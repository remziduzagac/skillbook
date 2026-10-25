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

**Use `respond-ask` when the user supplies the exact question to ask.** Shallow and deep find the request’s open choices; a preselected question needs neither.

Follow the `understand` skill for facts first, who decides, keeping nothing, result shape and marked guesses. Use `respond-ask` for questions and recommended answers. Return the `understand` shape with assumptions left unconfirmed. Each part's own form is in its file.

## Advice

- Start shallow. Load deep directly when the user asks for an interview to find open choices. Depth becomes clear only after seeing the whole level. One round costs little. Many small tasks end there.
- Use dependence to trigger deep, never question count. An answer must open questions that would change the work. Plans and designs usually have dependent parts. Usually offer deep after shallow for those.
- When, after the shallow round, you are unsure whether a part needs depth, offer deep rather than going deep.

## Instructions

- **shallow** (`understand-clarify-shallow`): **Read `understand-clarify-shallow` when clarify starts finding open choices without a request for an interview, or deep reaches a new level inside a part.**
  - Not for: a user-supplied exact question (`respond-ask`), the user asking for an interview or a part whose answers depend on each other (deep), or questions only someone else can answer (questionnaire).
  - Gives back: the "going with" line, with an offer of deep for a part whose answers depend on each other.
- **deep** (`understand-clarify-deep`): **Read `understand-clarify-deep` when the user accepts shallow’s offer to explore a part whose answers open questions that would change the work, or asks for an interview to find open choices.** When the user asks for an interview to find open choices, read it at once without another offer. Example: “question me on this plan”.
  - Not for: a user-supplied exact question (`respond-ask`), a level not yet seen whole (shallow first), a topic still to be decided together (`understand-discuss`), or questions only someone else can answer (questionnaire).
  - Gives back: the summary the user confirmed, or saw after telling you to start the work: decided, parked, accepted and assumed.
- **questionnaire** (`understand-clarify-questionnaire`): **Read `understand-clarify-questionnaire` when questions remain that only someone other than the user can answer, after the user has answered theirs.** The user may say that someone else holds the answer. If you see it instead, ask the user rather than deciding alone.
  - Not for: a user-supplied exact question (`respond-ask`), anything the user can answer, or anything the files say.
  - Gives back: the document, in the response by default, for the user to send. Later, its answers, taken back here.
- **Ask whether independent work should proceed while a questionnaire is out.** Ask through `respond-ask` only if independent work remains. Otherwise say what waits for answers. Park the questionnaire's questions until answers return. Start no dependent work.

Not here:

- The user not following you goes to `respond-explain`.
- "What do you think?" goes to the `act` skill's rule that an opinion is not a task.
- A topic to decide together goes to `understand-discuss`. Options wanted go to `understand-brainstorm`.

## The last instruction

Before you act on anything an open question could change, check:

- Every question that is the user's to decide is answered, taken with its recommended answer by the user's acceptance, parked, or in a questionnaire.
- "Going with" is said, with the choices the work rests on, or the summary is confirmed, or it is shown where the user told you to start the work.
- The `understand` skill's rules hold.
