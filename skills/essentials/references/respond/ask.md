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

Ask in a form the user can answer and keep every choice accounted for. Prepare the round and take its answers with these steps:

1. **Choose the question tool or text.** The tool saves keystrokes and cannot be misread for a closed choice. Text keeps explanations, lets "ok" accept every question at once and keeps the user's refinements.
   - You must use the tool when all three hold: at most four questions, each with a few short choices, and all reasoning fits above the tool.
   - Otherwise use numbered text, by rules 2 and 3. Use text for explanations per option, likely free answers, more than four questions, or item-by-item work accepted with "ok".
   - The user's own instruction file can set a preference: always the tool, always text, or this default. That preference wins.
   - In the tool, the other requirements hold in its form: the recommended option must come first and be marked, and partial answers must be named back.
   - Rule 5 applies to delegated agents. Where the harness has no question tool, use text.
2. **Present one round, or one question at a time on request.** Keeping the round prevents lost choices. You must keep all questions and their numbers. At each step, name the question's number and those remaining. Put proposals to approve the same way. Recommend approval when you recommend the proposal. End the turn as rule 6 requires.
3. **Take the answers and update affected questions.** This keeps the user's choices distinct from assumptions. You must take "go ahead" as accepting recommendations for all unanswered questions. Say them back. Partial answers alone leave the rest open: the user has neither accepted nor stopped. Name open questions with answers you would take. End the turn, by rule 6. When another answer changes a question, you must update it and say what changed. Apply rule 4 to parked and assumed questions.

4. **Check the question round before returning it.** Always do this last. Before a round goes out, check:

   - Every question is numbered under its own heading, with a recommended answer. Where only the user knows, the question says it has none.
   - Or, where instruction 1 says, the questions go through the question tool, with the recommended option first and marked.
   - Any partial answer is named back, with what would be taken, and the turn ends with it.
   - The turn ends with the round or proposal, unless the question tool returned the user's answers: you answered nothing yourself and did no work an answer could change.
