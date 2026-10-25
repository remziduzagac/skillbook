# act-rightsize-lean

Removes extra parts from existing material. Judges each part for its reader. Cuts useless parts, replaces pasted content with pointers and merges repeats. Keeps everything a rule requires.

## Rules

1. **Judge each part for its reader.** Follow `act-rightsize`'s first rule. What is extra depends on who reads it and why.
2. **Remove what does nothing for the reader:**
   - Cut a part whose removal loses nothing.
   - Where a pointer would do, turn pasted content into a pointer.
   - Keep a repeated part in one home, with the others pointing to it, by `act-rightsize`'s fourth rule.
   - Merge whole items that say the same thing into one.
   - Keep this work inside the thing being trimmed. Use `organize-normalize` for repeats across files and `organize-merge` for duplicate whole files. Keep single-file trimming here.
   - Why: an extra part costs the reader's attention and, for an agent, tokens on every later turn.
3. **Keep everything a rule requires.** Follow `act-rightsize`'s sixth rule. What a rule requires is needed by definition.
4. **Get approval for the list first.** Use `act-rightsize`'s approval rule and `respond-ask`. List every part to remove or replace with a pointer. Give each reason.
5. **Follow `act-rightsize`'s code rule for proposed code changes.** Examples: unused options, dead code or duplication. Passing tests alone do not prove nothing needed was lost. Public interfaces, documented behaviour and untested requirements count too.

## Instructions

1. **Find the reader,** and what the thing is for.
2. **List each part and its job for that reader.** Use a script when listing is mechanical. Delegate the listing if the material exceeds one whole read, such as several files or a file returned only in part. A delegated agent does not delegate again. Never read everything twice in the main session: each read costs again on later turns.
3. **Mark what goes,** by rules 2 and 3.
4. **Apply the approved list.** Get approval by rule 4. Follow rule 5 for code.
5. **Check that every needed part remains or has a working pointer.** For code, check passing tests and preservation of public interfaces, documented behaviour and untested requirements.

## The last instruction

Before you return anything, check:

- nothing a rule requires was cut;
- every pointer resolves;
- the list of what went, with why, is ready;
- where the user's or others' work changed, the list was approved;
- for code, the tests pass, and no public interface, documented behaviour or untested requirement was removed.
