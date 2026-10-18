# act-rightsize-lean

Removes what is extra from something that exists: it judges each part by what it does for its reader, cuts what does nothing, turns pasted content into pointers and merges repeats. Nothing a rule requires is lost.

## Rules

1. **Judge each part by what it does for its reader,** by rightsize's first rule, because what is extra depends on who reads it and what for.
2. **What does nothing goes:**
   - Cut a part whose removal loses nothing.
   - Where a pointer would do, turn pasted content into a pointer.
   - Keep a repeated part in one home, with the others pointing to it, by rightsize's fourth rule.
   - Merge whole items that say the same thing into one.

   An extra part costs the reader's attention and, for an agent, tokens on every later turn.
3. **Never below a rule:** anything a rule requires stays, by rightsize's sixth rule, because what a rule requires is needed by definition.
4. **The person approves first,** by rightsize's approval rule. The list holds each part that goes or becomes a pointer, with why.
5. **Propose code changes, and make them under tests,** by rightsize's code rule. lean proposes changes such as removing an unused option, dead code or needless duplication. For code, "nothing needed lost" means the tests still pass.

## Instructions

1. **Find the reader,** and what the thing is for.
2. **List each part** with what it does for that reader. Use a script where the parts can be listed mechanically. When the thing is large, delegate the listing to another agent. Never read everything twice in the main session, because every read is paid for again on later turns.
3. **Mark what goes,** by rules 2 and 3.
4. **Apply,** after the approval that rule 4 asks for. For code, follow rule 5.
5. **Check:** every needed part is still there, or reachable by its pointer, and every pointer resolves. For code, the tests pass.

## The last instruction

Before you return anything, check:

- nothing a rule requires was cut;
- every pointer resolves;
- the list of what went, with why, is ready;
- where the person's or others' work changed, the list was approved;
- for code, the tests pass.
