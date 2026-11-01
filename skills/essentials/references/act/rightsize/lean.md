# act-rightsize-lean

## Purpose

Removes extra parts from existing material while keeping everything its reader and the rules need.

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

Remove parts that add nothing while keeping what the reader and every rule need. Judge the contents before proposing cuts so a shorter result still does its job. **Identify the reader, inventory each part’s job, then apply and check only the approved cuts.**

1. **Identify reader and purpose through rule 1 of the `act-rightsize` guide.** A part that looks extra to you may be essential to the reader using it.
   - Name what the reader must understand or do, such as follow a report's recommendation or maintain a public interface.
2. **List each part and its job for that reader.** Cutting by length alone can remove the part that makes the rest usable.
   - Use a script for mechanical listing. When the material exceeds one whole read, use the `coordinate-delegate` guide for the inventory; a worker delegates no further.
   - Avoid reading everything twice in the main session. Keep evidence that shows what each needed part did.
3. **Mark removable parts under rules 2 and 3.** Duplicate or pasted content costs attention, while required content cannot be cut just to meet a target.
   - Cut what loses nothing, replace paste with a usable pointer and keep repeats in one home. Merge duplicate whole items within the material being trimmed.
   - Keep every rule-required part. For repeats or duplicate wholes across files, use the appropriate `organize-normalize` or `organize-merge` guide instead.
4. **Obtain approval for the list before applying, by rule 4.** This order is firm: unseen cuts can remove something the user needs.
   - List each removal or pointer replacement with its reason through the `respond-ask` guide, then end the turn. Apply only approved cuts.
   - For code, follow rule 5 and the `act-rightsize` guide's code rule, using a fitting skill or project tests before and after.
5. **Check every needed part remains or has a working pointer.** A passing test or shorter document alone cannot prove nothing useful was lost.
   - Compare the kept result with the inventory. For code, check tests, public interfaces, documented behavior and untested requirements.
6. **Check the result and “Gives back” before returning.** Always do this last. The reader needs the useful result and the account of what was removed.
   - Check required parts, resolving pointers, approved cuts and the list of removals with reasons. Check code preservation as well as passing tests.
   - Repair losses or broken references before returning. Report actual results without treating tests alone as proof of preserved behavior.
