# act-rightsize

## Purpose

Fits work and its results to the reader’s purpose, with nothing missing or extra and the point first. For existing material it trims what is extra and fills what is missing, each from an approved list.

## When to use

Use before returning a response or report, writing a file, code or a design, and when deciding what to read or do for a reader. Read it before changing existing material in either of two cases, each a fact you can see in the request:

- **Trim:** the user asks you to trim, cut or shorten existing material, or you notice parts that do nothing for its reader. Examples: “trim the meeting notes”, a report that repeats itself, an instruction file grown to 400 lines, an unused code option or a design part that serves no requirement.
- **Fill:** the user asks you to add what is missing to existing material, however small it is, or to complete it, or asks what it is missing. Read it before the first change. Examples: “complete the onboarding page”, “what is this README missing?”, a thin packing list to fill in, a half-written handover note, a report without evidence or a next step, or a guide missing its “when not” cases.

## When not

The main skill's step 5 holds the lines every piece of work needs. These rules go further. The alternatives below concern a rework pass, not those general lines.

- Your own draft from this conversation: use the final check here. It is still being made and needs no separate rework pass.
- Checking correctness or completion: use the `act-verify` guide for evidence. Keep the sizing rules for what you return.
- Dividing something into parts, or dividing or merging across files: use the `organize` guide to arrange it, because each original part needs a place. Keep the sizing rules for each part.
- Judging how careful to be: use the `act-stakes` guide to assess mistakes and their effects.
- A named change, such as a given section to add: make that edit. A fill or complete request still needs the Fill part, because you must find what goes in.
- Rewording within a sentence: use the main skill's step 6, or a skill in the harness’s list for editing documents, if one fits. That changes wording rather than removing extra parts.
- Your own leftovers: use the `act-cleanup` guide to remove task material no longer needed.
- Deleting whole files: use the `act-guardrails` guide, because deletion is a separate risky action.
- Writing from scratch: use a skill in the harness’s list that makes that kind of thing, if one fits. Otherwise use your judgment under the main skill's step 5. Fill works on existing material.
- Writing new work from existing material: use the guide for that kind of work, as for writing from scratch. The material itself stays as it is.
- Finding out for its own sake: use the `understand-research` guide for sourced investigation, otherwise read directly. There is no existing work to fill.

## Gives back

The output or work plan fitted to its reader, with the point first. For reworked material, also return the list of changes for approval, then the result and its check once the list is applied. The sizing check itself stays in thinking.

- For a trim, the list gives each removal and why, and the result is the material with extra parts removed. The report after applying gives the result and its check.
- For a fill, the list gives each addition’s source and reason, and each gap with what would settle it. The report after applying gives the result, its check and the gaps that remain.

## Rules

1. **Identify the reader and purpose.** What is necessary depends on that reader. Without one, “necessary” means nothing. The reader may be the user, a main agent reading a report, an agent loading a skill, the next code maintainer or a design’s builder.
2. **Include what the reader needs to understand or act without asking again.** A missing part costs a question or redo, more than the part itself.
3. **Remove parts whose removal loses nothing.** Every part must work for the reader. Extra parts cost attention and, for agents, tokens on every later turn.
4. **Give each thing one home when dividing work, and cover everything without overlap.** Overlaps drift into contradiction. Gaps are found late. Other parts point to the home.
5. **Put the point first, then its basis, then detail.** Readers who stop early get the point. Those reading on know why each part is there.
6. **Keep everything a rule requires.** A rule makes it necessary by definition. Examples: a failure, evidence, a safety note, a pending proposal, a legal notice in a newsletter or an error path in code.
7. **Read only what the task needs.** Every read and every call is paid for again on later turns. What to do stays with the main skill's step 5 (do all of what was asked, and nothing unrelated).
   - Search before reading, and read the parts needed.
   - Read a file whole if you need most of it, if finding the needed part would take more calls, or if the whole is required, such as by the guide name rule.
   - Make independent calls together.
   - Stop when the result answers the request and you have evidence. Do not search for more of the same. Asked a library’s pinned version, stop at the line that pins it.
8. **Rework material that existed before this task only on request, by the Trim or Fill part of Instructions.** Propose the rework when you notice the need. Never do it unasked beyond the task, by the main skill's step 5 (do all of what was asked, and nothing unrelated).
9. **Get approval for a list before you trim or fill existing material.**
   - A named change, such as a given section to add, is the edit itself and needs no such approval.
   - Filling, completing or making something sufficient is filling, even if the request names what is lacking. You still choose what goes in.
   - A fill with nothing to choose is a named change too: the user names the source, and every value is copied or worked out from it, such as totals copied from an agreed budget sheet. Choosing what to say, or how to word it, is choosing.
   - New work written from existing material, such as a handbook written from meeting notes, does not fill that material. The material stays as it is. The guide for that kind of work decides any approval.
   - Adding to a document that already exists, such as a sparse onboarding page, is filling that document, even when what goes in comes from other files.
   - For work written by the user or others, put the change list through the `respond-ask` guide, with each change’s reason or source. Then end the turn. Apply nothing before approval.
   - After applying the approved list, report the result and its check. Point to the list for each change’s reason or source instead of repeating them: the user already has it.
   - Your own draft in this conversation needs no approval. It is still being made, and the final check covers it.
   - One approval is enough, and the later check is enough evidence.
   - Show each change and the parts it touches, at a level the user can judge.
   - The list need not hold the finished text. For long material, a list as long as the result costs as much to read.
   - A draft may go beside the list. It never replaces the list: a draft does not show what changes or why.
   - Report later changes outside the list. Ask about them instead of folding them in.
10. **Propose code changes before making them, in Trim and Fill alike.** Examples: an unused option, dead code or duplication to remove, or a missing error path or test to add. Use a skill in the harness’s list for changing code, if one fits. Otherwise edit the code directly, and run the project’s tests before and after.
11. **When you trim, remove what does nothing for the reader, by rule 3.**
    - Where a pointer would do, turn pasted content into a pointer.
    - Keep a repeated part in one home, with the others pointing to it, by rule 4.
    - Merge whole items that say the same thing into one.
    - Keep this work inside the thing being trimmed. Use the `organize-normalize` guide for repeats across files and the `organize-merge` guide for duplicate whole files.
12. **When you trim code, passing tests do not prove nothing needed was lost.** Public interfaces, documented behaviour and untested requirements count too.
13. **When you fill, never invent an addition.** An invented answer reads as true. Each addition comes from:
    - the project’s files;
    - the user, when only they know;
    - outside sources, for outside facts.
    - Mark an unfound answer as a gap only after searching the project files, and outside sources for outside facts. A gap marked too early sends the user to find what you could have found.
14. **When you fill, check each addition is true, and give its source.** Do not add what the reader would not ask for. Filling must not become padding.
    - Use the `act-verify` guide for project facts, such as install steps tried or read in the current build file. Use a current, authoritative source for outside facts, under the main skill's step 5 (get evidence before making a claim).
    - Use a source only if it is current and authoritative for the addition. An outdated wiki page, or a comment the code contradicts, proves nothing.
    - Give each source in the list: file and line, command or page showing it.
15. **When you fill, put every gap in the list, with what would settle it.** The user may know the answer, and the proposal is where they can give it. Report the gaps that remain after applying.

## Advice

- Common extras:
  - the question restated;
  - a preamble or a closing offer;
  - hedges on what was verified;
  - how the result was reached, when only the result matters;
  - what the reader already has;
  - pasted content where a pointer would do;
  - options nobody asked for, such as an unused parameter in code or a component without a requirement in a design.
- Usually missing:
  - the reason behind a recommendation;
  - what failed or was skipped;
  - the next step;
  - where the evidence is;
  - the assumption the result rests on;
  - the error path in code;
  - the requirement each part of a design serves.
- Length follows the reader and the question, not a word count of your own. A limit that the user or the format sets holds.

## Instructions

Fit what you return, and existing material you are asked to rework, to its reader. Use the Trim part for extra parts and the Fill part for missing ones. Then check the result before another reader receives it. **Identify the reader, choose the method, get the list approved, then apply only what was approved and run the final check.**

1. **Identify the reader and purpose, by rule 1, before you judge any part.** A part that looks extra to you may be essential to the reader using it. Facts added without the reader’s goal can pad the material, and its real gap remains.
   - Name what this reader must understand or do without asking again, such as follow a report’s recommendation, maintain a public interface or install and run a tool.
2. **Choose the method, then do its steps up to the list.** The Trim part removes extra parts. The Fill part adds missing parts. A request for both uses both. Your own draft from this conversation uses neither: go to the final check. How a response is worded is the main skill's step 6.
3. **Get approval for the list before any change, by rule 9.** This order is firm. Unseen cuts can remove something the user needs. Filling another writer’s work changes what later readers rely on. Put the list to the user through the `respond-ask` guide, then end the turn. Apply only the approved items.
   - Trim: list every part to remove or replace with a pointer, each with its reason.
   - Fill: list each addition with its source and reason, and each gap with what would settle it.
   - For code, follow rules 10 and 12, with a fitting skill or the project’s tests before and after.
4. **Apply the approved list, then run the part’s own check.** Report a change outside the list and ask about it, by rule 9.

### Trim

1. **List each part and its job for that reader.** Cutting by length alone can remove the part that makes the rest usable.
   - Use a script for mechanical listing. When the material is more than one whole read, use the `coordinate-delegate` guide for the inventory. A delegated agent delegates no further.
   - Avoid reading everything twice in the main session. Keep the evidence that shows what each needed part did.
2. **Mark the removable parts, by rules 11 and 6.** Duplicate or pasted content costs attention. Required content cannot be cut to meet a target.
   - Mark each cut, pointer, one-home repeat and merge that rule 11 allows. Keep every part a rule requires, by rule 6.
3. **After applying, check that every needed part remains or has a working pointer.** A passing test or a shorter document alone cannot prove nothing useful was lost.
   - Compare the kept result with the inventory from step 1.
   - For code, check the tests, public interfaces, documented behaviour and untested requirements, by rule 12.

### Fill

1. **Read as that reader, and list their questions before you look for answers.** Familiarity can hide a missing install step, evidence or next action that a new reader cannot supply. A list built from the facts you can find leaves out the questions no file answers. Those are the gaps.
   - Use a skill in the harness’s list that checks a document from its reader’s point of view, if one fits. Otherwise list what this reader still needs to understand or act.
2. **Find each answer from checked sources, by rule 13.** Invented additions read as facts. Premature gaps send research you could do back to the user.
   - Search the project files first. Ask through the `respond-ask` guide when only the user knows, such as supported versions. Use the `understand-research` guide for outside facts.
   - Mark a gap only after those searches, by rule 13. Keep what would settle it visible.
3. **After applying, verify each addition, by rule 14.** A citation to a stale page or a contradicted comment cannot show the new answer is true.
   - Check project facts through the `act-verify` guide, and outside facts against current, authoritative sources.
   - Point to the approved list for each source, by rule 9, and give the check’s result. Remove padding that answers no reader question.

### Final check

**Always do this last.** Check the result against “Gives back” and rules 1 to 15 before writing or returning it. Missing parts cost the reader questions or rework. Extras use attention on every read. Keep this check in thinking, in proportion to what is at stake. Intermediate work, such as a probe, a scratch file or a note for your own next step, gets questions 2 and 5. What another reader receives gets all five.

1. Who reads it, and what for?
2. What could go without losing anything they need? It goes.
3. What would they still have to ask? It is added.
4. Is the point first, followed by its basis and detail? Do divided parts cover everything once?
5. Was anything a rule requires cut? Put it back, including failures, evidence and pending proposals.

For existing material, apply only an approved list, by rule 9. Do not turn this check into unapproved rework. Then check the part you used:

- Trim: nothing a rule requires was cut; every pointer resolves; the list of what went, with why, is ready; where the user’s or others’ work changed, the list was approved; for code, the tests pass and no public interface, documented behaviour or untested requirement was removed.
- Fill: nothing is invented; every addition has an applicable, current source and was checked; nothing was added the reader would not ask for; every reader question from Fill step 1 is in the list, as an addition or as a gap with what would settle it; where the user’s or others’ work changed, the list was approved; for code, the tests pass.

Fix shortfalls before returning the fitted result and any change list. Wording belongs to the main skill's step 6.
