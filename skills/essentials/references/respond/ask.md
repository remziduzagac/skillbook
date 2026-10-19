# respond-ask

How the agent asks the user anything (a question, a round of questions or a proposal to approve), and how it takes the answers.

## Rules

1. **Ask a question only when two likely answers would lead to different work or a different result,** as the `understand-clarify` skill tests it, because each question costs the user a turn. If every likely answer leads to the same work, decide yourself. "Plan the team offsite" asks (where, when, what budget); "run the tests" does not.
2. **Number each question, with a recommended answer where you have a basis for one,** and a short reason. Word it so that "yes" accepts it.
   - Where only the user knows, such as which versions are supported, the question says so and has no recommended answer. "Go ahead" leaves it open, because a recommendation with no basis is a guess that "go ahead" would turn into a decision.
   - "Recommended answer" is the one term for it throughout.
   - Challenge a recommended answer first: look for its weak points, at a depth that matches what is at stake. Give its verdict in one line beside it.
   - Challenge a decision the user makes without a recommendation, or against one, the same way before you rely on it.
3. **Each question under its own heading, with its number in the heading,** such as "### 2. How a round is laid out". The user can then answer by number and find each one again.
4. **One round, or one by one on request,** without losing the round: the numbers stay and nothing is dropped. Each step names the question by its number and says which remain.
5. **Answers:** "go ahead" accepts the recommended answers for every question left unanswered. Say them back. When the user answers only some, name the rest back with the answers you will take, before you act on anything.
6. **An answer that changes another question:** say so, and update that question.
7. **Parked and assumed:**
   - A question the user sets aside is parked. List it with why.
   - A question still open when the user stops is assumed: take its recommended answer and list it as assumed. If it has none, it is parked. The user stops by saying so, such as "enough questions, just build it", or by starting different work without answering.
   - Both stay listed until answered.
   - A proposal to approve is never assumed. Left open, it stays parked, and nothing it covers is applied, because an approval must be given.
8. **A proposal to approve** is put the same way, with approval as its recommended answer where the agent recommends it.
9. **A delegated agent** puts its questions in its report, as the `act` skill's rule on running as a delegated agent says.
10. **The harness's question tool, for a few closed choices:**
    - Use it when all three hold: there are at most four questions, each is a choice among a few short options, and the reasoning fits in the text above it.
    - Otherwise, number the questions in text, by rules 2 and 3. Text fits when a question needs explaining option by option, when a free answer is likely, when there are more than four questions, or when the user works item by item and accepts with "ok".
    - The user's own instruction file can set a preference: always the tool, always text, or this default. That preference wins.
    - In the tool, the other rules hold in its form: the recommended option comes first and is marked, and partial answers are named back.
    - A delegated agent never uses it, by rule 9.
    - Where the harness has no question tool, use text.
    - Why: the tool saves keystrokes and cannot be misread for a closed choice. Text keeps the explanation, lets "ok" accept every question at once, and keeps the user's refinements.
11. **End the turn after a round of questions or a proposal.** Never answer it yourself, and do no work in that turn that an answer could change, because an answer you write is a choice the user did not make. Take the answers when the user replies, by rules 5 to 7.

## The last instruction

Before a round goes out, check:

- Every question is numbered under its own heading, with a recommended answer. Where only the user knows, the question says it has none.
- Or, where rule 10 says, the questions go through the question tool, with the recommended option first and marked.
- Any partial answer is named back, with what will be taken.
- The turn ends with the round or proposal: you answered nothing yourself and did no work an answer could change.
