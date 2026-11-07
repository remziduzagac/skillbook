# coordinate-brief

## Purpose

Writes the task context a worker starting now needs, so it can begin without guessing and return a useful report.

## When to use

Use when writing instructions for an agent you are starting now. It may share this conversation as a fork or start with only its brief as a fresh worker. A fresh worker, for example, needs context that cannot be found in the files.

## When not

- Choosing the agent, model or cost: use the `coordinate-delegate` guide. A brief describes already assigned work.
- Recording state for later or for an agent the user starts: use the `coordinate-carryover` guide. That reader needs the work’s current state rather than startup instructions from you.

## Gives back

The worker’s starting instructions and the report it must return. The task that asked for the brief sends it; writing it starts no worker.

## Rules

1. **Give the worker what it needs to start without guessing.** Include context unavailable in the files. Give paths and line numbers for information the worker can read in files. Report a missing input as a gap. Never invent the missing fact.
2. **Include decisions and constraints recorded nowhere else.** The worker cannot recover them from code alone.
3. **Include ways of doing the work that were ruled out or already tried, with why.** This prevents repeated work.
4. **Give the first step and a success criterion.** Otherwise the worker can stop early or continue indefinitely.
5. **Point to references instead of pasting their contents.** Give file paths, line numbers and the location of recorded decisions. Pasting file contents costs output tokens when you write the brief and input tokens when the worker reads it. Check the references are usable by that reader. Report an inaccessible input rather than claiming the brief is sufficient.
6. **Name no tool available only to the writer.** Describe the action so another harness can perform it. Follow a user-chosen tool through its own skill or documentation where available.
7. **Ask for a report sized for its main-agent reader, with every line of this request.** Use the `act-rightsize` guide to size the report. Put each line in the brief; word it for the task and add what the task needs. A part left out is one the worker never reports, such as a choice it then settles alone.

   ```text
   Report back, in this order:
   - Task: say first if it changed or narrowed.
   - Outcome: what you did and found, naming the task.
   - Decisions for the user: each choice you could not settle alone, with any proposal.
   - Evidence: paths to the files or output that show it, not pasted.
   - Not done or not found: what you could not do, check or find, and why.
   - Cleanup: what you cleaned, kept and why, and propose to remove.
   ```

   Ask for a line on what was asked and why when tasks run together, the work is long, or the report will be kept for later. Put longer detail in a named scratch file. Ask the worker to return its path and the summary the caller needs.
8. **Bootstrap a fresh worker through the actual essentials folder.** Mark the task as delegated work. Give the worker the essentials folder's absolute path. Tell it to load the `essentials` skill and use its guide map and name rule; the main skill says which guides a delegated worker reads. Name every guide its task needs beyond the `act`, `act-rightsize`, `respond` and `respond-layout` guides, such as `act-verify` when it must show that a fix works. The worker reads each named guide with its parents, and a guide you do not name is not read. A settled brief can still meet an unknown that would change the result, so the worker may read the `understand` guide when one appears. Rule 10 of the `act` guide bounds every step. Do not copy it into the brief.
9. **Ask the worker to clean up before reporting.** Ask the worker to follow the `act-cleanup` guide: remove its temporary material, stop what it started and respect its limits. Ask it to report what it cleaned, kept or proposes to remove, and to check the cleanup result. A read-only task can still create a report or a process. Do not infer no leftovers from its label.

## Advice

- A fork needs only the task, success criterion and report request when its visible context already contains the rest. A fork after context loss needs the missing instructions too. Fresh workers get findings and pointers, not a pasted conversation.
- Reuse only context the worker actually holds. Give unresolved questions to the caller.

## Instructions

Give a worker starting now enough context to act without guessing and return a report the caller can use. Supply missing decisions in words and readable facts as references. **Identify what the worker lacks, write its brief and explicit report request, then return them to the caller for startup.**

1. **Identify the worker, its task and its missing context under rule 1.** A brief that assumes shared knowledge can send a fresh worker toward the wrong result.
   - Name allowed work and what the worker actually holds. A fork may need only task, success criterion and report request; after context loss it needs the missing instructions too.
2. **Write task context with usable references, by rules 1–6.** Missing decisions make workers guess, while pasted files make both sessions pay for the same content.
   - Include context, decisions and constraints recorded nowhere else. Give rejected or tried approaches and why they were ruled out.
   - Give the first step and success criterion. Point to readable paths and lines rather than pasting their contents; mark missing or inaccessible inputs as gaps.
   - Describe actions without tools available only to you. Follow a user-chosen tool through its skill or documentation.
3. **Request a usable report and checked cleanup, by rules 7 and 9.** A success sentence can hide unfinished work and leave the caller with forgotten processes or files.
   - Put every line of rule 7's report request in the brief, decisions for the user and what was not done included. Request task context when work is long, combined or kept later.
   - Size the report through the `act-rightsize` guide. Put bulk detail in a named scratch file and request its path and useful summary.
   - Explicitly ask the worker to use the `act-cleanup` guide: remove temporary material, stop what it started, check removal and report cleaned, kept and proposed items.
4. **Include the missing operating baseline under rule 8.** A task brief without authority limits can make a worker treat a called guide as permission to exceed its task.
   - Mark delegated work and give the absolute essentials folder. Tell the worker to load the `essentials` skill and use its guide map and name rule.
   - Name the guides its task needs beyond `act`, `act-rightsize`, `respond` and `respond-layout`, which every worker reads. A worker reads no other main guide unless the brief names it, so include the `understand`, `devise`, `organize` or `coordinate` guide where the task needs it.
   - Keep rule 10 of the `act` guide as the worker's authority home rather than copying another rule set. Return unresolved questions to the caller.
5. **Lay out the brief through the `respond-layout` guide.** Buried scope or report requirements are easy for the worker to miss.
   - Make task, references, first step, success criterion and requested report easy to find.
6. **Return the brief and requested report shape to the caller.** Drafting startup instructions alone does not choose or authorize a running worker.
   - Leave sending and startup with the caller. Start no worker from this guide.
7. **Check the brief and “Gives back” before returning.** Always do this last. A readable brief can still be unusable if an essential reference is inaccessible.
   - Check inputs, missing decisions, constraints, rejected approaches, first step and success criterion. Check the baseline is visible or explicitly requested, the guides its task needs are named, and the guide map can be reached.
   - Check the brief carries every line of rule 7's report request and an explicit cleanup request. Fix omissions through the `act-rightsize` guide and report remaining gaps rather than claiming the worker can start without asking.
