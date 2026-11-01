# act-rightsize-lean

Removes extra parts from existing material. Judges each part for its reader. Cuts useless parts, replaces pasted content with pointers and merges repeats. Keeps everything a rule requires.

## When to use

Use when the user asks to trim or shorten existing material, or you notice parts that do nothing for its reader. Examples include a report that repeats itself, an instruction file grown to 400 lines, an unused code option or a design part that serves no requirement.

## When not

- Your own draft from this conversation: use the `act-rightsize` guide’s final check. The draft is still being made.
- Rewording within a sentence: use the `respond` guide, or a skill in the harness’s list for editing documents, if one fits. That changes wording rather than removing extra parts.
- Dividing or merging across files: use the `organize` guide, because each original part needs a place.
- Your own leftovers: use the `act-cleanup` guide to remove task material no longer needed.
- Deleting whole files: use the `act-guardrails` guide, because deletion is a separate risky action.

## Gives back

The material with extra parts removed, plus what was removed and why.

## Rules

1. **Judge each part for its reader.** Follow the `act-rightsize` guide's first rule. What is extra depends on who reads it and why.
2. **Remove what does nothing for the reader:**
   - Cut a part whose removal loses nothing.
   - Where a pointer would do, turn pasted content into a pointer.
   - Keep a repeated part in one home, with the others pointing to it, by the `act-rightsize` guide's fourth rule.
   - Merge whole items that say the same thing into one.
   - Keep this work inside the thing being trimmed. Use the `organize-normalize` guide for repeats across files and the `organize-merge` guide for duplicate whole files. Keep single-file trimming here.
   - Why: an extra part costs the reader's attention and, for an agent, tokens on every later turn.
3. **Keep everything a rule requires.** Follow the `act-rightsize` guide's sixth rule. What a rule requires is needed by definition.
4. **Get approval for the list first.** Use the `act-rightsize` guide's approval rule and the `respond-ask` guide. List every part to remove or replace with a pointer. Give each reason.
5. **Follow the `act-rightsize` guide's code rule for proposed code changes.** Examples: unused options, dead code or duplication. Passing tests alone do not prove nothing needed was lost. Public interfaces, documented behaviour and untested requirements count too.

## Instructions

1. To judge what the reader needs, find the reader and purpose.
2. To see which parts earn their place, list each part and its job for that reader. Use a script when listing is mechanical. Use the `coordinate-delegate` guide for the listing if the material exceeds one whole read, such as several files or a file returned only in part. A delegated agent does not delegate again. Never read everything twice in the main session: each read costs again on later turns.
3. To choose cuts without losing needed content, mark what goes by rules 2 and 3.
4. To keep changes within the agreement, apply the approved list. Get approval by rule 4. Follow rule 5 for code.
5. To preserve every needed part, check that every needed part remains or has a working pointer. For code, check passing tests and preservation of public interfaces, documented behaviour and untested requirements.

## The last instruction

Before you return anything, check:

- Nothing a rule requires was cut;
- Every pointer resolves;
- The list of what went, with why, is ready;
- Where the user's or others' work changed, the list was approved;
- For code, the tests pass, and no public interface, documented behaviour or untested requirement was removed.
