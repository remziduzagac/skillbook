# act-rightsize-enrich

Adds what is missing to something that exists: it answers what its reader would still ask, from the project, the user or research. Each addition has a source and is checked, and what cannot be found is marked as a gap.

## Rules

1. **What the reader would still ask decides what is missing,** by `act-rightsize`'s second rule, because a missing part costs a question or a redo.
2. **Never invent:** each addition comes from one of these:
   - the project's files;
   - the user, when only they know;
   - outside sources, for outside facts.
   - Mark as a gap what you did not find after searching the project's files, and an outside source where the fact is from outside the project. An invented answer reads as true, and a gap marked too early sends the user to find what you could have found.
3. **Check that each addition is true:** it comes with its source, such as a file and line, or the command or page that shows it. A source supports an addition only if it is current and authoritative for it: an outdated wiki page, or a comment the code contradicts, proves nothing. **Add nothing the reader would not ask for,** by `act-rightsize`'s last instruction, so enriching does not become padding.
4. **The user approves first,** by `act-rightsize`'s approval rule, which puts the list through `respond-ask`. The list holds each addition with its source and why. Report the result with the gaps.
5. **Propose code changes, and make them under tests,** by `act-rightsize`'s code rule. For example, a missing error path or test.

## Instructions

1. **Find the reader,** and what the thing is for.
2. **Find what the reader would still ask** by reading as that reader would. If the `authoring` skill is in your skill list, load it, then read its `reader` skill (`references/reader.md` in its folder). Otherwise, list the questions a newcomer would ask.
3. **Find each answer,** by rule 2:
   - the project's files first;
   - the user, through `respond-ask`, when only they know, such as which versions are supported;
   - outside sources for outside facts.
   - Mark a gap only as rule 2 says.
4. **Apply** each addition with its source, after the approval that rule 4 asks for. For code, follow rule 5.
5. **Check,** by rule 3.

## The last instruction

Before you return anything, check:

- nothing is invented;
- every addition has a current, authoritative source and was checked;
- nothing is there that the reader would not ask for;
- the gaps are listed;
- where the user's or others' work changed, the list was approved;
- for code, the tests pass.
