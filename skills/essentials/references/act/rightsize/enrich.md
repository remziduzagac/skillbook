# act-rightsize-enrich

## Purpose

Adds missing parts to existing material from checked sources and marks answers that could not be found as gaps.

## When to use

Use when existing material leaves its reader unable to understand or act without asking again. Examples include a README without install steps, a report without evidence or a next step, or a guide missing its “when not” cases.

## When not

- Writing from scratch: use the skill that makes that thing. Enrich fills gaps in existing material.
- Finding out for its own sake: use the `understand-research` guide for sourced investigation, otherwise read directly. There is no existing work to fill.
- Checking whether work is correct: use the `act-verify` guide for evidence.

## Gives back

The material with missing parts added, each addition’s source, and gaps that could not be filled.

## Rules

1. **Find what the reader would still ask.** Follow the `act-rightsize` guide's second rule. A missing part costs a question or redo.
2. **Source every addition.** Never invent one. Use:
   - the project's files;
   - the user, when only they know;
   - outside sources, for outside facts.
   - Mark an unfound answer as a gap only after searching the project files, and outside sources for outside facts. Inventions read as true. Premature gaps send the user to find what you could have found.
3. **Check each addition is true.** Use the `act-verify` guide for project facts, such as install steps tried or read in the current build file. Use a current, authoritative source for outside facts, under the `understand` guide's rules.
   - Use a source only if it is current and authoritative for the addition. An outdated wiki page, or a comment the code contradicts, proves nothing.
   - Give each source: file and line, command or page showing it.
   - Add nothing the reader would not ask for, by the `act-rightsize` guide's final step of Instructions. Enriching must not become padding.
4. **Get approval for the list first.** Follow the `act-rightsize` guide's approval rule through the `respond-ask` guide. List each addition, source and reason. Report the result and gaps.
5. **Follow the `act-rightsize` guide's code rule for proposed code changes.** Examples: a missing error path or test.

## Instructions

Answer the reader’s remaining questions with checked sources. Find each missing answer before proposing an addition.

1. **Find the reader and purpose.** This helps judge what is missing.
2. **Read as the reader to find their remaining questions.** This helps find the reader’s unanswered questions. Use a skill in the harness’s list that checks a document from its reader’s point of view, if one fits. Otherwise list what this reader still needs to understand or act.
3. **Find its answer by rule 2.** This helps ground each addition.
   - the project's files first;
   - the user, through the `respond-ask` guide, when only they know, such as which versions are supported;
   - outside sources for outside facts.
   - Mark a gap only as rule 2 says.
4. **Apply approved additions with their sources.** This helps fill the agreed gaps. Get approval by rule 4. Follow rule 5 for code.
5. **Check them by rule 3.** This helps confirm the additions are true.

6. **Check the result before returning it.** Always do this last.

   Before you return anything, check:

   - Nothing is invented;
   - Every addition has a current, authoritative source and was checked;
   - Nothing is there that the reader would not ask for;
   - The gaps are listed;
   - Where the user's or others' work changed, the list was approved;
   - For code, the tests pass.
