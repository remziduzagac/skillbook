# act-rightsize-enrich

## Purpose

Adds missing parts to existing material from checked sources and marks answers that could not be found as gaps.

## When to use

Use when existing material leaves its reader unable to understand or act without asking again. Examples include a README without install steps, a report without evidence or a next step, or a guide missing its “when not” cases.

## When not

- Writing from scratch: use a skill in the harness’s list that makes that kind of thing, if one fits. Otherwise use your judgment under the `act` guide. Enrich fills gaps in existing material.
- Finding out for its own sake: use the `understand-research` guide for sourced investigation, otherwise read directly. There is no existing work to fill.
- Checking whether work is correct: use the `act-verify` guide for evidence.

## Gives back

The material with missing parts added, and the gaps that could not be filled. The approval list gives each addition's source and reason, and each gap with what would settle it. The report after applying gives the result, its check and the gaps that remain.

## Rules

1. **Find what the reader would still ask.** Follow the `act-rightsize` guide's second rule. A missing part costs a question or redo.
2. **Source every addition.** Never invent one. Use:
   - the project's files;
   - the user, when only they know;
   - outside sources, for outside facts.
   - Mark an unfound answer as a gap only after searching the project files, and outside sources for outside facts. Inventions read as true. Premature gaps send the user to find what you could have found.
3. **Check each addition is true.** Use the `act-verify` guide for project facts, such as install steps tried or read in the current build file. Use a current, authoritative source for outside facts, under the `understand` guide's rules.
   - Use a source only if it is current and authoritative for the addition. An outdated wiki page, or a comment the code contradicts, proves nothing.
   - Give each source in the approval list: file and line, command or page showing it.
   - Add nothing the reader would not ask for, by the `act-rightsize` guide's final step of Instructions. Enriching must not become padding.
4. **Get approval for the list first.** Follow the `act-rightsize` guide's approval rule through the `respond-ask` guide. List each addition with its source and reason. List each gap too, with what would settle it, since the user may know the answer. Report the result and the gaps that remain.
5. **Follow the `act-rightsize` guide's code rule for proposed code changes.** Examples: a missing error path or test.

## Instructions

Fill the reader’s remaining gaps from checked sources. Distinguish an answer you have not looked for from one a completed search could not find. **Find the reader’s questions, source each needed answer, then apply and verify only approved additions.**

1. **Identify reader and purpose through the `act-rightsize` guide.** Without a reader's goal, adding more facts can pad the material while its real gap remains.
   - Name what this reader needs to understand or do without asking again.
2. **Read as that reader under rule 1, and list their questions before you look for answers.** Familiarity can hide a missing install step, evidence or next action that a new reader cannot supply. A list built from the facts you can find leaves out the questions no file answers, and those are the gaps.
   - Use a fitting reader-check skill in the harness's list. Otherwise list the questions this reader still needs answered.
3. **Find each answer from checked sources under rule 2.** Invented additions read as facts, while premature gaps pass research you could do back to the user.
   - Search project files first. Ask through the `respond-ask` guide when only the user knows, such as supported versions. Use outside sources for outside facts.
   - Mark a gap only after checking project sources and, for outside facts, outside sources. Keep what would settle the missing answer visible.
4. **Get approval for additions before applying, by rule 4.** This order is firm: filling another writer's work changes what later readers rely on.
   - List each addition with its source and reason, and each gap with what would settle it, through the `respond-ask` guide. Then end the turn. Apply only the approved list.
   - Follow rule 5 and the `act-rightsize` guide's code rule for code changes, with a fitting skill or project tests before and after.
5. **Verify each addition under rule 3.** A citation to a stale page or contradicted comment cannot establish that the new answer is true.
   - Use the `act-verify` guide for project facts, such as install steps checked against the current build file or tried. Use current authoritative sources for outside facts.
   - Point to the approved list for each source, and give the check's result. Remove padding that answers no reader question.
6. **Check additions, gaps and “Gives back” before returning.** Always do this last. A fuller document still fails if its new material is unsupported.
   - Check nothing is invented, every addition has an applicable current source and was checked, and no unnecessary part was added.
   - Check each reader question from step 2 is in the approval list, as an addition or as a gap with what would settle it, by rule 4.
   - Check the list was approved where others' work changed, and code tests pass. Fix unsupported or missing parts before reporting the actual additions and gaps.
