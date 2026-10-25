# coordinate-brief

Writes the task context a worker starting now needs and the report it must return.

## Rules

1. **Give the worker what it needs to start without guessing.** Include context unavailable in the files. Use readable file/line pointers for what the worker can find. A missing input returns as a gap, never an invented fact.
2. **Include decisions and constraints recorded nowhere else.** The worker cannot recover them from code alone.
3. **Include approaches ruled out or already tried, with why.** This prevents repeated work.
4. **Give the first step and a success criterion.** Otherwise the worker can stop early or continue indefinitely.
5. **Point to references instead of pasting their contents.** Use paths and lines and where decisions are recorded. Pasted files cost output and then input again. Check the references are usable by that reader. Report an inaccessible input rather than claiming the brief is sufficient.
6. **Name no tool available only to the writer.** Describe the action so another harness can perform it. Follow a user-chosen tool through its own skill or documentation where available.
7. **Ask for a report sized for its main-agent reader.** Use `act-rightsize`: task outcome, user decisions/proposals, evidence paths, missing or unfinished work and cleanup in cleaned/kept/proposed fields. Put a changed or narrowed task first. Ask for a line on what was asked and why when tasks run together, the work is long, or the report will be kept for later. Put longer detail in a named scratch file; return the path and needed summary.
8. **Bootstrap a fresh worker through the actual essentials folder.** Mark the task as delegated work. Give the essentials folder's absolute path and tell it to read `references/act.md` whole when absent from visible context. Act rule 10 bounds every step. Give the exact Names line below as the agreed bootstrap exception. Named dependencies open their parents when needed, including understand and respond. A settled brief does not prevent a later material unknown. Do not copy act rule 10 into a second rule set.
9. **Ask the worker to clean up before reporting.** Follow `act-cleanup`: remove its temporary material, stop what it started, respect its limits, report cleaned/kept/proposed items and check the result. A read-only task can still create a report or a process. Do not infer no leftovers from its label.

## Advice

- A fork needs only the task, success criterion and report request when its visible context already contains the rest. A fork after context loss needs the missing instructions too. Fresh workers get findings and pointers, not a pasted conversation.
- Reuse only context the worker actually holds. Give unresolved questions to the caller. A worker never delegates again merely because a named skill asks.

## Instructions

1. **Identify the worker, task, authorized scope and what its context lacks.**
2. **Write the task context by rules 1–6.**
3. **Include the report and cleanup request by rules 7 and 9.**
4. **Include the baseline by rule 8 when it is not already visible.** Copy this line exactly from the main skill:

   Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, go on with your own judgment, and name the file in your final answer.

5. **Lay out the brief through `respond-layout`.**
6. **Return the brief and its requested report shape to the caller.** The caller sends it. Drafting a brief does not start a worker.

## The last instruction

Check usable inputs, unstored decisions, constraints, rejected approaches, first step and done criterion. The worker has the act bootstrap and exact name rule, or actually visible inherited instructions. The report and cleanup request are explicit. Apply `act-rightsize`. Do not claim an incomplete brief lets the reader start without asking.
