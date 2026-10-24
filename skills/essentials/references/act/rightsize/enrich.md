# act-rightsize-enrich

Adds missing parts to existing material. Answers the reader's remaining questions from the project, user or research. Each addition has a checked source. Unfound answers are marked as gaps.

## Rules

1. **Find what the reader would still ask.** Follow `act-rightsize`'s second rule. A missing part costs a question or redo.
2. **Source every addition.** Never invent one. Use:
   - the project's files;
   - the user, when only they know;
   - outside sources, for outside facts.
   - Mark an unfound answer as a gap only after searching the project files, and outside sources for outside facts. Inventions read as true. Premature gaps send the user to find what you could have found.
3. **Check each addition is true.** Use `act-verify` for project facts, such as install steps tried or read in the current build file. Use a current, authoritative source for outside facts, under the `understand` skill's rules.
   - Give each source: file and line, command or page showing it. An old wiki or comment contradicted by code proves nothing.
   - Add nothing the reader would not ask for, by `act-rightsize`'s last instruction. Enriching must not become padding.
4. **Get approval for the list first.** Follow `act-rightsize`'s approval rule through `respond-ask`. List each addition, source and reason. Report the result and gaps.
5. **Follow `act-rightsize`'s code rule for proposed code changes.** Examples: a missing error path or test.

## Instructions

1. **Find the reader,** and what the thing is for.
2. **Read as the reader to find their remaining questions.** If `authoring` is in your skill list, load it and read its `reader` skill (`references/reader.md` in its folder). Otherwise list what this reader still needs to understand or act.
3. **Find each answer,** by rule 2:
   - the project's files first;
   - the user, through `respond-ask`, when only they know, such as which versions are supported;
   - outside sources for outside facts.
   - Mark a gap only as rule 2 says.
4. **Apply approved additions with their sources.** Get approval by rule 4. Follow rule 5 for code.
5. **Check,** by rule 3.

## The last instruction

Before you return anything, check:

- nothing is invented;
- every addition has a current, authoritative source and was checked;
- nothing is there that the reader would not ask for;
- the gaps are listed;
- where the user's or others' work changed, the list was approved;
- for code, the tests pass.
