# coordinate-brief

Writes the task context a worker starting now needs and the report it must return.

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
7. **Ask for a report sized for its main-agent reader.** Use the `act-rightsize` guide to size the report. Ask for the task outcome, decisions needed from the user, proposals, paths to evidence, and missing or unfinished work. Ask the worker to report cleanup under cleaned, kept and proposed. Put a changed or narrowed task first. Ask for a line on what was asked and why when tasks run together, the work is long, or the report will be kept for later. Put longer detail in a named scratch file. Ask the worker to return its path and the summary the caller needs.
8. **Bootstrap a fresh worker through the actual essentials folder.** Mark the task as delegated work. Give the worker the essentials folder's absolute path. Tell it to load the `essentials` skill and use its guide map and name rule. Tell it to read the `act` guide, the `respond` guide and the `respond-layout` guide whole when their text is absent from its visible context. These rules shape its work and report. Rule 10 of the `act` guide bounds every step. Name other needed guides and have the worker read their parents by the main skill's name rule. This includes the `understand` guide. A settled brief does not prevent the worker from discovering an unknown that would change the result. Do not copy rule 10 of the `act` guide into a second rule set.
9. **Ask the worker to clean up before reporting.** Ask the worker to follow the `act-cleanup` guide: remove its temporary material, stop what it started and respect its limits. Ask it to report what it cleaned, kept or proposes to remove, and to check the cleanup result. A read-only task can still create a report or a process. Do not infer no leftovers from its label.

## Advice

- A fork needs only the task, success criterion and report request when its visible context already contains the rest. A fork after context loss needs the missing instructions too. Fresh workers get findings and pointers, not a pasted conversation.
- Reuse only context the worker actually holds. Give unresolved questions to the caller. A worker never delegates again merely because a named guide or skill asks.

## Instructions

1. To find the worker’s missing context, identify the worker, task, work it is allowed to do and what its context lacks.
2. To let the worker start without guessing, write the task context by rules 1–6.
3. To get a report the caller can use, include the report and cleanup request by rules 7 and 9.
4. To give the worker its work and response rules, include the baseline by rule 8 when it is not already visible. Point to the main skill's guide map and name rule. Do not paste the name rule or repeat its paths here.
5. To make the brief easy to read, lay out the brief through the `respond-layout` guide.
6. To keep startup with the caller, return the brief and its requested report shape to the caller. The caller sends it. Drafting a brief does not start a worker.

## The last instruction

Check that the worker can use the inputs. Check that the brief includes decisions recorded nowhere else, constraints, rejected ways of doing the work, the first step and the success criterion. Check that the worker has access to the main skill’s guide map and name rule. Check that the `act` guide, the `respond` guide and the `respond-layout` guide are already visible or named for it to read. The report and cleanup request are explicit. Apply the `act-rightsize` guide. Do not claim an incomplete brief lets the reader start without asking.
