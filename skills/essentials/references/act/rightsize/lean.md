# act-rightsize-lean

Removes what is extra from something that exists: each part judged by what it does for its reader, what does nothing cut, pasted content turned into pointers, repeats merged, nothing a rule requires lost.

## Rules

1. **Each part is judged by what it does for its reader,** by rightsize's first rule, since what is extra depends on who reads it and what for.
2. **What does nothing goes:** a part whose removal loses nothing is cut; pasted content where a pointer would do becomes a pointer; a repeated part is kept in one home, the others pointing to it, by rightsize's fourth rule, and whole items saying the same thing are merged into one. An extra part costs the reader's attention and, for an agent, tokens on every later turn.
3. **Never below a rule:** anything a rule requires stays, by rightsize's sixth rule, since what a rule requires is needed by definition.
4. **The person approves first,** by rightsize's approval rule: the list holds each part to go or become a pointer, with why.
5. **Code is proposed, and changed under tests,** by rightsize's code rule: lean proposes, such as an unused option, dead code or needless duplication. For code, nothing needed lost means the tests still pass.

## Instructions

1. **The reader,** and what the thing is for.
2. **List each part** with what it does for that reader: by a script where the parts can be listed mechanically, or by delegating the listing to another agent when the thing is large; never by reading everything twice in the main session, since every read is paid for again on later turns.
3. **Mark what goes,** by rules 2 and 3.
4. **Apply,** after the approval rule 4 asks for; for code, by rule 5.
5. **Check:** every needed part still there or reachable by its pointer, and every pointer resolving; for code, the tests passing.

## The last instruction

Before anything is returned: nothing a rule requires was cut; every pointer resolves; the list of what went, with why, is ready; where the person's or others' work changed, the list was approved; for code, the tests pass.
