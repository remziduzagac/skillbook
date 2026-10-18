# understand-clarify

Finds out what the person means before acting: decides what to ask and how deep, and sends the work to the part that asks. It asks nothing itself.

## Rules

1. **Ask only what would change the work.** When every answer leads to the same work, decide yourself, as understand's rule on who decides says. An unneeded question costs the person a turn.
2. **Act on nothing an open question could change until the answers are in.**
   - Reading and finding facts go on meanwhile.
   - Work that no answer would change may go ahead; say so in a line. The exception is while a questionnaire is out (below).
   - "Go ahead" accepts the recommended answers, as `respond-ask` says.

   This rule is stricter than understand's rule that nothing is changed for good while understanding. It is a variation of that rule, because it is the person's own wish.

These are understand's rules: facts first, who decides, keeping nothing, the result shape, and marking guesses. How a question is put, with its recommended answer, is `respond-ask`'s. The result is in understand's shape, plus what was assumed when anything was left unconfirmed. Each part's own form is in its file.

## Advice

- Start shallow, unless the person asks to be questioned. Which part needs depth shows only once the whole level is seen, and one round costs little. Many small tasks end there.
- The trigger for deep is dependence, never the number of questions: an answer that opens questions that would change the work. A plan or a design usually has parts that depend on each other, so it usually goes deep after the shallow round.
- When, after the shallow round, you are unsure whether a part needs depth, go deep on it.

## Instructions

- **shallow** (`understand-clarify-shallow`): when a level is not yet seen whole. That is the start of most clarifying, and each new level inside a part, for deep.
  - Not for: the person asking to be questioned or a part whose answers depend on each other (deep), or questions only someone else can answer (questionnaire).
  - Gives back: the "going with" line, or a part handed to deep.
- **deep** (`understand-clarify-deep`): when a part's answers open questions that would change the work, as for a plan or a design after the shallow round. Load it from the start when the person asks to be questioned, such as "question me on this plan".
  - Not for: a level not yet seen whole (shallow first), a topic still to be decided together, or questions only someone else can answer (questionnaire).
  - Gives back: the summary the person confirmed, or saw where they said to go on: decided, parked, accepted and assumed.
- **questionnaire** (`understand-clarify-questionnaire`): when questions remain that only someone other than the person can answer, after the person answers theirs. Either the person says so, or you see it. If you see it, ask the person whether someone else holds the answer, rather than deciding alone.
  - Not for: anything the person can answer, or anything the files say.
  - Gives back: the document, in the response by default, for the person to send. Later, its answers, taken back here.
- **While a questionnaire is out:** its questions are parked until the answers return, and what depends on them waits. Work that no outstanding answer touches goes ahead; say so in a line.

Not here:

- The person not following you goes to `respond-explain`.
- "What do you think?" goes to the `act` skill's rule that an opinion is not a task.
- A topic to decide together, or options wanted, is your own judgment, under understand's rules.

## The last instruction

Before you act on anything an open question could change, check:

- Every question that would change the work is answered, taken with its recommended answer by the person's acceptance, parked, or in a questionnaire.
- "Going with" is said, or the summary is confirmed, or it is shown where the person said to go on.
- understand's rules hold.
