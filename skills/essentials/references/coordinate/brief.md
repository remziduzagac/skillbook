# coordinate-brief

## Purpose

Writes the task context a worker starting now needs, so it can begin without guessing and return a useful report.

## When to use

Use when you write instructions for an agent you are starting now. It may share this conversation as a fork, or start with only its brief as a fresh worker. A fresh worker, for example, needs context that the files do not hold.

## When not

- Choosing the agent, model or cost: use the `coordinate-delegate` guide. A brief describes work already assigned.
- Recording state for later or for an agent the user starts: use the `coordinate-carryover` guide. That reader needs the work’s current state, not startup instructions from you.

## Gives back

The worker’s starting instructions and the report it must return. The task that asked for the brief sends it. Writing it starts no worker.

## Rules

1. **Give the worker what it needs to start without guessing.** Include context the files do not hold. For facts the worker can read in files, give paths and line numbers. Report a missing input as a gap. Never invent the missing fact.
2. **Include decisions and constraints recorded nowhere else.** The worker cannot recover them from code alone.
3. **Include ways of doing the work that were ruled out or already tried, with why.** This prevents repeated work.
4. **Give the first step and a success criterion.** Without them, the worker can stop early or go on without end.
5. **Point to references instead of pasting their contents.** Pasted contents cost output tokens when you write the brief, and input tokens when the worker reads it. Give file paths, line numbers and where decisions are recorded. Check that the worker can use each reference. Report an input it cannot reach, rather than calling the brief enough.
6. **Name no tool available only to the writer.** Describe the action, so another harness can perform it. For a tool the user chose, follow its own skill or documentation, if it has one.
7. **Ask for a report sized for its main-agent reader, with every line of this request.** A part left out is one the worker never reports, such as a choice it then settles alone. Size the report with the `act-rightsize` guide. Put each line in the brief. Word it for the task, and add what the task needs.

   ```text
   Report back, in this order:
   - Task: say first if it changed or narrowed.
   - Outcome: what you did and found, naming the task.
   - Decisions for the user: each choice you could not settle alone, with any proposal.
   - Evidence: paths to the files or output that show it, not pasted.
   - Not done or not found: what you could not do, check or find, and why.
   - Cleanup: what you cleaned, kept and why, and propose to remove.
   ```

   Ask for a line on what was asked and why when tasks run together, the work is long, or the report will be kept for later. Ask the worker to put longer detail in a named scratch file. Ask it to return the file's path and the summary the caller needs.
8. **Bootstrap a fresh worker through the actual essentials folder.** Mark the task as delegated work. Give the worker the essentials folder's absolute path. Tell it to load the `essentials` skill and use its name rule. The main skill's rule on limits for a delegated worker says what the worker reads, and bounds every step. Do not copy that rule into the brief. Name every guide its task needs, such as `act-verify` when it must show that a fix works. The worker reads each named guide with its parents. It reads no guide you do not name. A settled brief can still meet an unknown that would change the result. The worker then puts it in its report.
9. **Ask the worker to clean up before reporting.** Ask it to follow the `act-cleanup` guide: remove its temporary material, stop what it started and respect its limits. Ask it to check the cleanup result, and to report what it cleaned, kept or proposes to remove. A read-only task can still create a report or a process. Do not infer no leftovers from its label.

## Advice

- A fork needs only the task, success criterion and report request when its visible context already holds the rest. A fork after context loss needs the missing instructions too. Fresh workers get findings and pointers, not a pasted conversation.
- Reuse only context the worker actually holds.

## Instructions

These steps give a worker starting now enough context to act without guessing, and to return a report the caller can use. Give missing decisions in words, and facts it can read as references. **Identify what the worker lacks, write its brief and explicit report request, then return them to the caller for startup.**

1. **Identify the worker, its task and its missing context under rule 1.** A brief that assumes shared knowledge can send a fresh worker toward the wrong result.
   - Name the allowed work and what the worker actually holds. A fork may need less, by the first Advice item.
2. **Write task context with usable references, by rules 1–6.** Missing decisions make workers guess. Pasted files make both sessions pay for the same content.
   - Give the context, decisions and constraints recorded nowhere else. Give the ways ruled out or tried, and why.
   - Give the first step and success criterion. Point to readable paths and lines instead of pasting. Mark missing or unreachable inputs as gaps.
   - Describe actions without tools only you have. Follow a user-chosen tool through its skill or documentation.
3. **Request a usable report and checked cleanup, by rules 7 and 9.** A success sentence can hide unfinished work, and leave the caller with forgotten processes or files.
   - Put every line of rule 7's report request in the brief, decisions for the user and what was not done included. Ask for the line on the task when the work is long, combined or kept for later.
   - Size the report through the `act-rightsize` guide. Ask for bulk detail in a named scratch file, with its path and a useful summary.
   - Explicitly ask the worker to clean up through the `act-cleanup` guide, check it and report it, by rule 9.
4. **Include the missing operating baseline under rule 8.** A task brief without authority limits can make a worker treat a called guide as permission to exceed its task.
   - Mark the work as delegated, and give the essentials folder's absolute path. Tell the worker to load the `essentials` skill and use its name rule.
   - Name each guide its task needs, such as the `organize` or `act-verify` guide, by rule 8.
   - Keep the main skill's rule on limits for a delegated worker as the worker's authority home. Copy no other rule set. Return unresolved questions to the caller.
5. **Lay out the brief through the `respond-layout` guide.** Buried scope or report requirements are easy for the worker to miss.
   - Make task, references, first step, success criterion and requested report easy to find.
6. **Return the brief and requested report shape to the caller.** Drafting startup instructions alone does not choose or authorize a running worker.
   - Leave sending and startup with the caller. Start no worker from this guide.
7. **Check the brief and “Gives back” before returning.** Always do this last. A readable brief can still be unusable if an essential reference cannot be reached.
   - Check inputs, missing decisions, constraints, ways ruled out, first step and success criterion. Check that the baseline is visible or explicitly requested, the guides its task needs are named, and the name rule can be reached.
   - Check that the brief carries every line of rule 7's report request and an explicit cleanup request. Fix omissions through the `act-rightsize` guide. Report remaining gaps, rather than claiming the worker can start without asking.
