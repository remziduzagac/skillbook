# understand

Understanding before acting, with the user and from sources. It holds the rules every way of understanding follows, and says which skill to use. It understands nothing itself and never does the work.

## Rules

1. **Understanding keeps nothing:** hand back every result.
   - Called by a skill: to that skill.
   - Used directly: to the keeper the project's instruction files point to, if any. The keeper says where it goes and in what form.
   - With no keeper: it stays in the response. Offer a long result, or one the user wants kept, as a file they name.
   - Each skill here names none of a keeper's steps or files, because a method tied to where results are stored cannot serve every caller.
2. **One result shape:** what was decided and why, what was parked and why, and what comes next, plus each skill's own part. A caller can then keep any result without knowing which skill made it.
   - The shape says where to find a part; it is not a form to fill. Leave out a field with nothing to say, except "Not found" when something was looked for. Leave out of what the user sees a field they already have, such as their question.
   - When several skills serve one request, combine their results into one shape, keeping each one's own additions, so the caller gets one result back.
3. **Mark guesses and assumptions, and name an unknown that would change the result, with what would settle it.** An unmarked guess gets relied on as a fact.
4. **Facts first:** read what can be read before asking the user. Asking what the files already say wastes the user's time and hides what only they know.
5. **Who decides:** a choice that would change what the user gets is theirs. Put it through `respond-ask`, with a recommended answer. Make your own choices quietly, and say the reason. This rule sets where your judgment stops.
6. **Nothing in the work is changed for good while understanding,** because a change made now decides for the user. Reading, asking and searching change nothing. Make probes and experiments in a scratch place, or remove them before you return the result. Acting on the result is the caller's job, or waits for the user.

## Advice

- Several skills can serve one request, and nothing limits combining them.
- Give as much understanding as the decision deserves; a plan needs more. A task that looks small but leaves an open choice still goes to `understand-clarify`, by its test: if two likely answers would lead to different work or a different result, ask. "Rename `foo` to `bar` in this file" needs none.
- The question itself may be wrong. Reframing it is always an option.
- Show what the user would want to correct, such as how you framed the question or what you assumed.

## Instructions

**With the user:**

- **clarify** (`understand-clarify`): when the request leaves the user a choice that would change the result, such as where, how long or which kind, or when the user asks to be questioned. "Clean up the old branches" leaves which ones go and which stay. The `act` skill's rule to clarify before acting sends here every request that is not understood.
  - Not for: what the files already say (rule 4), a topic still to be decided together, or the user not following you (`respond-explain`).
  - Gives back: the "going with" line and what was assumed, or a questionnaire for whoever holds the answers.

Anything else about understanding that fits no line here is your own judgment, under the rules above, such as a topic to discuss, a fact to find, options, a choice, an idea to test, a case to make, or a name.

## The last instruction

Before you return anything, check that the rules above hold: the result in its shape, guesses marked, unknowns named with what would settle them, and nothing in the work changed for good. The used skill's own last instruction holds too.
