# respond-ask

How the agent asks the user anything (a question, a round of questions or a proposal to approve), and how it takes the answers.

## Rules

1. **Ask only about the user's choices that would change the result.** Follow the `understand` skill's who-decides rule and `understand-clarify`'s test. Each question costs a turn. Make your own choices. Show them in a "going with" line before work. "Plan the team offsite" asks where, when and budget. "Format the dates in this table" uses the document's existing format.
2. **Number each question with a recommended answer and short reason.** Give a recommendation where you have a basis. Word the question so "yes" accepts it.
   - Give no recommendation for facts only the user knows, such as supported versions. Say why it has none. "Go ahead" leaves it open. A baseless recommendation is a guess that "go ahead" would turn into a decision.
   - "Recommended answer" is the one term for it throughout.
   - Use `understand-challenge` before asking about a consequential recommendation: one hard to undo or shaping much of the work. Give a one-line verdict beside it. Routine questions need no challenge.
   - Use `understand-challenge` for a consequential decision the user makes without a recommendation, or against one, before you rely on it.
3. **Put each question under its own numbered heading.** Example: "### 2. How a round is laid out". The user can answer by number and find it again.
4. **Ask one round, or one question at a time on request.** Keep numbers and all questions. At each step, name the question's number and those remaining.
5. **Take "go ahead" as accepting recommendations for all unanswered questions.** Say them back. Partial answers alone leave the rest open: the user has neither accepted nor stopped. Name open questions with answers you would take. End the turn, by rule 11.
6. **Update a question when another answer changes it.** Say what changed.
7. **List parked and assumed questions:**
   - A question the user sets aside is parked. List it with why.
   - When the user stops, take each open question's recommended answer as assumed. Without one, park it. Stopping means saying so, such as "enough questions, just build it", or starting different work without answering.
   - Both stay listed until answered.
   - Never assume approval of a proposal. Park open proposals. Apply nothing they cover: approval must be given.
8. **Put proposals to approve the same way.** Recommend approval when you recommend the proposal.
9. **Put questions in your report when delegated.** Follow the `act` skill's delegated-agent rule.
10. **Use the harness's question tool for a few closed choices:**
    - Use it if all three hold: at most four questions, each with a few short choices, and all reasoning fits above the tool.
    - Otherwise use numbered text, by rules 2 and 3. Use text for explanations per option, likely free answers, more than four questions, or item-by-item work accepted with "ok".
    - The user's own instruction file can set a preference: always the tool, always text, or this default. That preference wins.
    - In the tool, the other rules hold in its form: the recommended option comes first and is marked, and partial answers are named back.
    - A delegated agent never uses it, by rule 9.
    - Where the harness has no question tool, use text.
    - Why: the tool saves keystrokes and cannot be misread for a closed choice. Text keeps the explanation, lets "ok" accept every question at once, and keeps the user's refinements.
11. **End the turn after a question round or proposal.** Never answer it yourself. Do no work in that turn that an answer could change. Your own answer would make a choice for the user. Take their reply by rules 5 to 7.
    - If the question tool returns the user's answers in the same turn, continue the work those answers settle. The turn has not ended on the question.
    - An empty or cancelled result is no answer, and never an approval.

## The last instruction

Before a round goes out, check:

- Every question is numbered under its own heading, with a recommended answer. Where only the user knows, the question says it has none.
- Or, where rule 10 says, the questions go through the question tool, with the recommended option first and marked.
- Any partial answer is named back, with what would be taken, and the turn ends with it.
- The turn ends with the round or proposal, unless the question tool returned the user's answers: you answered nothing yourself and did no work an answer could change.
