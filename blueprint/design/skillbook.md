# Design: skillbook, the main skill

What a builder needs for the main skill, the only skill listed to the model (D56, D71); ideas not yet decided are in [../ideas/skillbook.md](../ideas/skillbook.md). It is designed last, once the roots it routes to are designed (D80). Every section answers the same questions (D80); an empty field is not designed yet.

## skillbook

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:** in the shape every main skill takes (D112); its content is designed when the flows are revisited (D108). Decided so far:
  1. **Rules:**
     - act's and respond's rules hold for every request (D63, D115);
     - every response and every file is laid out with author's markdown; this is the rule's one home, and respond and act point here (D111, D115);
     - every skill a request needs is used, together or in turn; a skill limits this only where it says why (D112, D115);
     - the pointer's exception for a one-line answer is the pointer's: once the main skill is loaded, its rules hold for every request (D78, D115).
  2. **Advice:** project work usually runs design → plan → implement → test → review → ship → maintain, the order in which each stage has what it needs from the one before. The work decides: a stage that adds nothing is skipped, and work can start at any stage, a bug fix at implement, test-first work with test before implement. Each stage's own skill says what usually comes next (D76, D115).
  3. **Instructions:** read act, respond and author's markdown by path, once per conversation (D72, D111). Then one instruction per root: when to use it, when not, and what it gives back (D112). For the first baseline only conduct and understand are built, since starting small gives something to test early (D108); a request for a root not built yet is done directly, under act's rules, until it exists, and so is a request no root covers (D115).
  4. **The last instruction:** every response is checked against respond before the person sees it, and what fails the check is fixed first (D81, D115).

  The earlier draft, a diagram of steps routing to one root, gave way to this shape (D108, D112).
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** the instructions for each root, written when the flows are revisited (D108, D112).
