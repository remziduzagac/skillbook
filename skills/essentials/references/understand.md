# understand

Understanding before acting, with the user and from sources. Its rules hold for every way of understanding. It routes to the skill needed. It understands nothing itself and never does the work.

## Rules

1. **Hand back every result.** Understanding keeps nothing.
   - Called by a skill: to that skill.
   - Used directly: to the keeper the project's instruction files point to, if any. The keeper says where it goes and in what form.
   - With no keeper: it stays in the response. Offer a long result, or one the user wants kept, as a file they name.
2. **Use one result shape.** Give what was decided and why, what was parked and why, and what comes next. Add each skill's own part. A caller can then keep any result without knowing which skill made it.
   - Use the shape to locate parts, not as a form to fill. Omit empty fields. Keep "Not found" when something was looked for. Omit fields the user already has, such as their question.
   - Combine results from several skills into one shape. Keep each skill's additions. The caller gets one result back.
3. **Mark guesses and assumptions.** Name each unknown that would change the result. Say what would settle it. An unmarked guess gets relied on as a fact.
4. **Read the facts before asking or assuming.** Read what can settle a question, such as which version, plan or provider is meant. Asking what the files already say wastes the user's time and hides what only they know.
5. **Who decides:** some choices are the user's, and some are yours.
   - The user's: their intent, taste or preferences, anything hard to undo, and what only they know. Ask through `respond-ask`, with a recommended answer.
   - Yours: what the project's conventions settle, and a default easy to undo. Make it.
   - **Show your choices before you change anything.** If the result rests on choices you made, write one "Going with: …" message that lists them. Then end the turn. Change nothing until the user replies, because a choice they see only after the work is too late to correct.
   - If the user told you to choose, or has just answered your questions, go ahead. Put the "Going with" line in your final answer, with the work. They have already shaped the work, so the line only needs to be seen.
   - A change made by a command counts too, such as one that rewrites, moves or renames files.
   - Minor choices need no line. Give the reason if the user asks.
   - A choice of both kinds is the user's: a wedding toast's style, though easy to rewrite. Ease of undoing decides only what they left to you.
   - Easy to undo means the effects, not just the file: a change that sends messages, migrates data or reaches users is hard to undo.
6. **Make no lasting change while understanding.** A change now decides for the user. Put probes and experiments in a scratch place. Otherwise remove them through `act-cleanup` before returning the result. Acting on it is the caller's job, or waits for the user.
7. **Read `understand-clarify` before the first change** if a request leaves a choice or unknown that would change the result. Do this even when the answer seems plain. That skill decides whether to ask or show a choice, and requires a shown choice before work.

## Advice

- Give as much understanding as the decision deserves; a plan needs more.
- The question itself may be wrong. Reframing it is always an option.
- Show what the user would want to correct, such as how you framed the question or what you assumed.

## Instructions

**With the user:**

- **discuss** (`understand-discuss`): when the user wants to discuss a topic with several open parts, including a plan, design or proposal. A multi-question brainstorm goes here.
  - Not for: a single question (its skill below), unclear intent (`understand-clarify`), a requested view (the `act` skill), the user not following (`respond-explain`), or lasting work (the caller).
  - Gives back: items decided, parked or handed on with reasons, side topics placed, and next steps.

- **clarify** (`understand-clarify`): when the request leaves a choice or an unknown that would change the result, such as where, how long or which kind; when it asks for a plan or a way to do something, which usually leaves several; when an answer it needs is one only someone else holds, such as a supplier or another team; or when the user asks to be questioned. "Clean up the old branches" leaves which ones go and which stay.
  - Not for: what the files already say (rule 4), a topic still to be decided together (`understand-discuss`), or the user not following you (`respond-explain`).
  - Gives back: the "going with" line and what was assumed, or a questionnaire for whoever holds the answers.

**Exploring options:**

- **brainstorm** (`understand-brainstorm`): when one question needs new options. A caller may request candidates only.
  - Not for: unclear intent (`understand-clarify`), comparing named options (`understand-weigh`), facts (read or find sources), a whole design (the work designing it), several open questions (`understand-discuss`), or a direct naming request (`understand-naming`). Called by naming, return candidates to it.
  - Gives back: requested options or candidates. Only a requested choice adds comparison and a decision or park.

**Thinking it through:**

- **frame** (`understand-frame`): when a question lacks a stated problem, goal or terms for judging an answer; when work loops or drifts; or when asked what is being solved.
  - Not for: a crisp request, facts or intent only the user can supply (`understand-clarify` where they change the result), or several problems at once (divide them). Find sources for factual gaps.
  - Gives back: the frame and unknowns with what would settle them. Adds no checkpoint beyond rule 5 and the `act` skill's plan rule.
- **weigh** (`understand-weigh`): when two or more named options need comparison and a recommendation, including a requested debate.
  - Not for: one option (`understand-challenge`), no options (`understand-brainstorm`), a deciding fact (sources or a test), a settled choice to check (`understand-challenge`), or a council preserving disagreements.
  - Gives back: comparison and recommendation, or no clear winner with what would settle it. Returns development needs to its caller, not an active brainstorm.
- **challenge** (`understand-challenge`): before relying on an idea, plan or decision, or when asked to attack one.
  - Not for: several options (`understand-weigh`), finished work or design review (the work reviewing that kind), a claim of done (`act-verify`), an unclear idea (`understand-clarify` or `understand-frame`), a doubt settled by facts (sources or a test), or a case for (`understand-argue`). Reuse a challenge only while its inputs stay unchanged.
  - Gives back: relevant weaknesses, including material costs or risks that leave the goal feasible, each with seriousness and mitigation, and a verdict.
- **argue** (`understand-argue`): when a position is wanted at its strongest as a one-sided case. The `respond` skill may use its light path to reflect an existing view.
  - Not for: the case against (`understand-challenge`), choosing or debating (`understand-weigh`), factual truth (sources), options (`understand-brainstorm`), or the persuasive document itself (the work writing it).
  - Gives back: case, evidence, objections met, weaknesses, strength, what would change it and a one-sided label. Returns its current challenge separately for caller reuse, outside the case.

**Names:**

- **naming** (`understand-naming`): when a shared or public name is open, a new concept enters the work, terms clash, or glossary changes need proposing. A supplied name gets terminology and collision checks without reopening a settled choice.
  - Not for: local code names (project conventions), repeated definitions (the work arranging the files), wording (the `respond` skill or document-writing work), an unclear domain (`understand-frame` or `understand-clarify`), or applying a rename or glossary edit (the caller).
  - Gives back: the chosen name, reasons and rejected words, or proposed glossary changes. Writes nothing.

**Finding out from sources:**

- **research** (`understand-research`): when a question needs sourced facts, an overview of existing candidates or an investigation into a cause.
  - Not for: a quick local read (read directly), user intent (`understand-clarify`), invented options (`understand-brainstorm`), choosing known options (`understand-weigh`), or claims of done (`act-verify`).
  - Gives back: sourced findings and their limits, a bounded claim verdict, compared candidates, or supported and hypothetical causal links. Returns to the active caller.

A whole design belongs to the work designing it. Anything else about understanding that fits no line here is your own judgment, under the rules above. Use `understand-research` for facts needing sourced investigation.

## The last instruction

**Check the rules above before returning anything.** Check the result shape, marked guesses, named unknowns and no lasting changes. Follow the used skill's last instruction too.
