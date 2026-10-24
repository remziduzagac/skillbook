# understand

Understanding before acting, with the user and from sources. It holds the rules every way of understanding follows, and says which skill to use. It understands nothing itself and never does the work.

## Rules

1. **Understanding keeps nothing:** hand back every result.
   - Called by a skill: to that skill.
   - Used directly: to the keeper the project's instruction files point to, if any. The keeper says where it goes and in what form.
   - With no keeper: it stays in the response. Offer a long result, or one the user wants kept, as a file they name.
2. **One result shape:** what was decided and why, what was parked and why, and what comes next, plus each skill's own part. A caller can then keep any result without knowing which skill made it.
   - The shape says where to find a part; it is not a form to fill. Leave out a field with nothing to say, except "Not found" when something was looked for. Leave out of what the user sees a field they already have, such as their question.
   - When several skills serve one request, combine their results into one shape, keeping each one's own additions, so the caller gets one result back.
3. **Mark guesses and assumptions, and name an unknown that would change the result, with what would settle it.** An unmarked guess gets relied on as a fact.
4. **Facts first:** read what can be read before asking the user or assuming what the files could settle, such as which version, plan or provider is meant. Asking what the files already say wastes the user's time and hides what only they know.
5. **Who decides:** a choice that changes what the user gets is theirs when it is about their intent, taste or preferences, anything hard to undo, or what only they know: put it through `respond-ask`, with a recommended answer. A choice the project's conventions settle, or a default easy to undo, is yours: make it and state it in a "going with" line before the work, so the user can correct it. Make minor choices without a "going with" line; give the reason if the user asks.
   - A choice of both kinds is the user's: a wedding toast's style, though easy to rewrite. Ease of undoing decides only what they left to you.
   - Easy to undo means the effects, not just the file: a change that sends messages, migrates data or reaches users is hard to undo.
6. **Nothing in the work is changed for good while understanding,** because a change made now decides for the user. Make probes and experiments in a scratch place, or remove them through `act-cleanup` before you return the result. Acting on the result is the caller's job, or waits for the user.
7. **Read `understand-clarify` before the first change on a request that leaves a choice or an unknown that would change the result,** even when the answer seems plain. Whether to ask or state it, and that a stated choice comes before the work, are decided there.

## Advice

- Give as much understanding as the decision deserves; a plan needs more.
- The question itself may be wrong. Reframing it is always an option.
- Show what the user would want to correct, such as how you framed the question or what you assumed.

## Instructions

**With the user:**

- **clarify** (`understand-clarify`): when the request leaves a choice or an unknown that would change the result, such as where, how long or which kind; when it asks for a plan or a way to do something, which usually leaves several; when an answer it needs is one only someone else holds, such as a supplier or another team; or when the user asks to be questioned. "Clean up the old branches" leaves which ones go and which stay.
  - Not for: what the files already say (rule 4), a topic still to be decided together, or the user not following you (`respond-explain`).
  - Gives back: the "going with" line and what was assumed, or a questionnaire for whoever holds the answers.

Anything else about understanding that fits no line here is your own judgment, under the rules above, such as a topic to discuss, a fact to find, options, a choice, an idea to test, a case to make, or a name.

## The last instruction

Before you return anything, check the rules above: the result's shape, guesses marked, unknowns named, nothing changed for good. The used skill's own last instruction holds too.
