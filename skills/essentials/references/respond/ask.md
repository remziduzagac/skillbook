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

The round of questions or the proposal, shown to the user, with the turn ended on it. When the user replies, each answer said back as accepted, changed, assumed or parked, by rule 4.

## Rules

1. **Ask only about the user's choices that would change the result.** Each question costs the user a turn. Which choices those are is the `understand-clarify` guide's test. "Pick a laptop for my studies" asks budget, weight and the programs it must run. "Format the dates in this table" uses the document's existing format. Show the choices you make yourself by the `understand` guide's who-decides rule.
2. **Number each question with a recommended answer and short reason.** Give one wherever you have a basis: it lets the user settle the question with one word. Where you have no basis, write "No recommended answer:" and why, so the user sees the question is open on purpose.
   - Word the recommended answer so that "yes" accepts it as it stands: "Recommended answer: two 45-minute sessions", not "whatever suits your team". Call it "Recommended answer" every time.
   - Give none for a fact only the user knows, such as which versions they support. "Go ahead" leaves it open, and rule 4 parks it. A recommendation with no basis is a guess that "go ahead" would turn into a decision.
   - Before you ask about a consequential recommendation, one hard to undo or shaping much of the work, challenge it with the `understand-challenge` guide. Put its verdict, in that guide's terms, on one line beside the recommendation, such as "Challenge: holds with changes: keep the old server for a week". Routine questions need no challenge.
3. **Put each question under its own numbered heading.** Example: "### 2. How a round is laid out". The user can answer by number and find it again. In the question tool, follow its form as instruction 1 says.
4. **List parked and assumed questions.** Open choices stay visible only if they are listed. When the user says "go ahead" or stops, give each question's status with one of these labels:
   - **Accepted:** the user said yes, or said "go ahead" to a question that has your recommended answer.
   - **Changed:** the user gave an answer of their own: a different one from your recommended answer, or one to a question that had none.
   - **Assumed:** the user stopped without answering, and the question has your recommended answer. Only a recommended answer you gave can be assumed.
   - **Parked:** the user set the question aside, or it has no recommended answer when the user says "go ahead" or stops. Give why.
   - Stopping means saying so, such as "let's leave the questions there", or starting different work without answering. Not replying yet is not stopping.
   - Keep assumed and parked questions listed until the user answers them.
   - Never take a proposal as approved. Park an open proposal and apply nothing it covers: approval must be given.
5. **Put questions in your report when delegated.** Follow the `act` guide's delegated-agent rule so the main agent can put them to the user. Never use the question tool when delegated.
6. **End the turn after a question round or proposal.** Never answer it yourself. Do no work in that turn that an answer could change. Your own answer would make a choice for the user. Take their reply by instruction 3 and rule 4.
   - If the question tool returns the user's answers in the same turn, continue the work those answers settle. The turn has not ended on the question.
   - An empty or cancelled result is no answer, and never an approval.

## Instructions

Ask questions in a form the user can answer and keep every choice accounted for. A recommendation needs a basis, and an unanswered proposal never becomes approval. **Choose the question form, present the round, then take actual answers without filling the user’s choices yourself.**

1. **Choose the question tool or numbered text using rules 2, 3 and 5.** The wrong form can hide needed explanation or make a simple closed choice harder to answer.
   - Use the tool when all three hold: at most four questions, a few short choices each and all reasoning fits above it. Otherwise use numbered text, including likely free answers, explanations per option, larger rounds or item-by-item work accepted with “ok”.
   - Follow the user's instruction-file preference. With no question tool, use text. Delegated agents put questions in their report rather than using the tool.
   - In the tool, put the recommended option first and mark it; keep the other requirements in its form, the challenge verdict included.
2. **Present one round, or one question at a time when requested, under rule 6.** Losing question numbers or remaining choices makes the user's partial answer hard to interpret.
   - Keep all questions and their numbers. For item-by-item work, name the current question and those remaining. In text, give each its own numbered heading.
   - Give each question a grounded recommended answer and short reason, or "No recommended answer:" and why, by rule 2. Present proposals the same way and recommend approval when you recommend the proposal.
   - Before you present the round, challenge each consequential recommendation with the `understand-challenge` guide. Put its verdict line beside the recommendation, by rule 2. Routine questions need none.
   - End the turn with the round or proposal, by rule 6.
3. **Take replies and update affected questions under rule 4.** Treating silence or a partial answer as acceptance can change the result without the user's decision.
   - Say back each answer you took, with its status from rule 4.
   - For partial answers, name what is still open and the answers you would take, then end the turn.
   - If an answer changes another question, update that question and say what changed.
   - Before you rely on a consequential decision the user made without a recommendation, or against one, challenge it with the `understand-challenge` guide.
4. **Check the round, answers and “Gives back” before returning.** Always do this last. A tidy question list can still conceal an unanswered choice or unapproved action.
   - Check numbering and form. Check that each question has a grounded recommended answer or a "No recommended answer:" line, and each consequential recommendation its challenge verdict. In the tool, check the recommended option is first and marked.
   - Check partial answers are named back, statuses remain distinct and proposed approval was not assumed. Fix missing questions or incorrect statuses.
   - Check that the turn ends with the round or proposal, and that nothing an answer could change was done, by rule 6.
