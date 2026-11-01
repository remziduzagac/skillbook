# respond-ask

## Purpose

Helps the agent ask questions and present proposals clearly, then take the user’s answers without losing open choices.

## When to use

Use whenever you ask the user anything, including a question, a proposal to approve or the wrap-up offer.

## When not

- Choosing which questions matter or how deep to go: use the `understand-clarify` guide. This guide asks the chosen questions and takes the answers.
- Deciding when a proposal is needed and what it contains: use the `act-guardrails` guide. This guide presents the proposal.
- Plain wording: use the `respond` guide’s rules.

## Gives back

Each answer taken as accepted, changed or parked, or assumed when the user stops. Keep the distinctions defined in the rules and instructions.

## Rules

1. **Ask only about the user's choices that would change the result.** Follow the `understand` guide's who-decides rule and the `understand-clarify` guide's test. Each question costs a turn. Make your own choices. Show them in a "going with" line before work. "Plan the team offsite" asks where, when and budget. "Format the dates in this table" uses the document's existing format.
2. **Number each question with a recommended answer and short reason.** Give a recommendation where you have a basis. Word the question so "yes" accepts it.
   - Give no recommendation for facts only the user knows, such as supported versions. Say why it has none. "Go ahead" leaves it open. A baseless recommendation is a guess that "go ahead" would turn into a decision.
   - "Recommended answer" is the one term for it throughout.
   - Use the `understand-challenge` guide before asking about a consequential recommendation: one hard to undo or shaping much of the work. Give a one-line verdict beside it. Routine questions need no challenge.
   - Use the `understand-challenge` guide for a consequential decision the user makes without a recommendation, or against one, before you rely on it.
3. **Put each question under its own numbered heading.** Example: "### 2. How a round is laid out". The user can answer by number and find it again. In the question tool, follow its form as instruction 1 says.
4. **List parked and assumed questions.** This keeps open choices visible.
   - A question the user sets aside is parked. List it with why.
   - When the user stops, take each open question's recommended answer as assumed. Without one, park it. Stopping means saying so, such as "enough questions, just build it", or starting different work without answering.
   - Both stay listed until answered.
   - Never assume approval of a proposal. Park open proposals. Apply nothing they cover: approval must be given.
5. **Put questions in your report when delegated.** Follow the `act` guide's delegated-agent rule so the main agent can put them to the user. Never use the question tool when delegated.
6. **End the turn after a question round or proposal.** Never answer it yourself. Do no work in that turn that an answer could change. Your own answer would make a choice for the user. Take their reply by instruction 3 and rule 4.
   - If the question tool returns the user's answers in the same turn, continue the work those answers settle. The turn has not ended on the question.
   - An empty or cancelled result is no answer, and never an approval.

## Instructions

Ask questions in a form the user can answer and keep every choice accounted for. A recommendation needs a basis, and an unanswered proposal never becomes approval. **Choose the question form, present the round, then take actual answers without filling the user’s choices yourself.**

1. **Choose the question tool or numbered text using rules 2, 3 and 5.** The wrong form can hide needed explanation or make a simple closed choice harder to answer.
   - Use the tool when all three hold: at most four questions, a few short choices each and all reasoning fits above it. Otherwise use numbered text, including likely free answers, explanations per option, larger rounds or item-by-item work accepted with “ok”.
   - Follow the user's instruction-file preference. With no question tool, use text. Delegated agents put questions in their report rather than using the tool.
   - In the tool, put the recommended option first and mark it; keep the other requirements in its form. Challenge consequential recommendations under rule 2, without adding a challenge to routine questions.
2. **Present one round, or one question at a time when requested, under rule 6.** Losing question numbers or remaining choices makes the user's partial answer hard to interpret.
   - Keep all questions and their numbers. For item-by-item work, name the current question and those remaining. In text, give each its own numbered heading.
   - Give a grounded recommended answer and short reason. For a fact only the user knows, explain why there is none. Present proposals the same way and recommend approval when you recommend the proposal.
   - End the turn with the round or proposal before work an answer could change. Never answer it yourself. Continue settled work if the tool actually returns answers in this turn; an empty or cancelled result is no answer.
3. **Take replies and update affected questions under rule 4.** Treating silence or a partial answer as acceptance can change the result without the user's decision.
   - Take “go ahead” as accepting grounded recommendations for unanswered questions and say those answers back. Facts without recommendations stay open.
   - For partial answers, name what is still open and the answers you would take, then end the turn. If an answer changes another question, update it and say what changed.
   - Keep accepted, changed and parked answers distinct. When the user stops, take open recommendations as assumed and park those without one. Keep parked and assumed questions listed until answered.
   - Never assume proposal approval. Park it and apply nothing it covers. Challenge consequential decisions made without or against a recommendation before relying on them, by rule 2.
4. **Check the round, answers and “Gives back” before returning.** Always do this last. A tidy question list can still conceal an unanswered choice or unapproved action.
   - Check numbering, form, grounded recommendations or stated absence, and any required challenge verdict. In the tool, check the recommended option is first and marked.
   - Check partial answers are named back, statuses remain distinct and proposed approval was not assumed. Fix missing questions or incorrect statuses.
   - End with the round or proposal, without self-answered questions or answer-dependent work, except where the tool returned actual answers under rule 6.
