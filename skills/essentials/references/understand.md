# understand

Understanding before acting, with the user and from sources. It holds the rules every way of understanding follows, and says which skill to use. It understands nothing itself and never does the work.

## Rules

1. **Understanding keeps nothing:** hand back every result.
   - Called by a skill: the result goes back to that skill.
   - Used directly: it goes to the keeper that the project's instruction files point to, if any. The keeper says where it goes and in what form.
   - With no keeper: it stays in the response. Offer a long result, or one the user wants kept, as a file they name.
   - Note: each skill here says only what a keeper needs from it. It names none of a keeper's steps or files, because a method tied to where results are stored cannot serve every caller.
2. **One result shape:** what was decided and why, what was parked and why, and what comes next. Each skill here adds its own part. A caller can then keep any result without knowing which skill made it.
   - The shape says where to find a part. It is not a form to fill.
   - Leave out a field with nothing to say, except "Not found" when something was looked for.
   - Leave a field the reader already has, such as the question they asked, out of what the user sees.
   - When several skills serve one request, combine their results into one shape, and keep each one's own additions. The caller then always gets one result back.
3. **Mark guesses and assumptions, and name an unknown that would change the result, with what would settle it.** An unmarked guess gets relied on as a fact.
4. **Facts first:** read what can be read before asking the user. Asking what the files already say wastes the user's time and hides what only they know.
5. **Who decides:** a choice that would change what the user gets is theirs. Put it through `respond-ask`, with a recommended answer. Make your own choices quietly, and say the reason. This rule sets where your judgment stops.
6. **Nothing in the work is changed for good while understanding:**
   - Reading, asking and searching change nothing.
   - Probes and experiments are temporary. Make them in a scratch place, or remove them before you return the result.
   - Acting on the result is the caller's job, or waits for the user.
   - Why: a change made while understanding decides for the user.

## Advice

- Several skills can serve one request, and nothing limits combining them.
- Keep it in proportion: give as much understanding as the decision deserves. A rename needs none; a plan needs more.
- The question itself may be wrong. Reframing it is always an option.
- Show what the user would want to correct, such as how you framed the question or what you assumed. Keep your own choices quiet.

## Instructions

**With the user:**

- **clarify** (`understand-clarify`): when what the user means is not clear yet, or they ask to be questioned. A request is not clear when it leaves the user a choice that would change the result, such as where, how long or which kind. "Add caching to the API" leaves where the cache lives, how long entries last and what is cached. The `act` skill's rule to clarify before acting sends here every request that is not understood.
  - Not for: what the files already say (rule 4), a topic still to be decided together, or the user not following you (`respond-explain`).
  - Gives back: the "going with" line and what was assumed, or a questionnaire for whoever holds the answers.

Anything else about understanding that fits no line here is your own judgment, under the rules above. Examples: a topic to discuss, a fact to find, options, a choice, an idea to test, a case to make, or a name.

## The last instruction

Before you return anything, check:

- the rules above hold;
- the result is in its shape;
- guesses are marked;
- unknowns are named, with what would settle them;
- nothing in the work was changed for good.

The used skill's own last instruction holds too.
