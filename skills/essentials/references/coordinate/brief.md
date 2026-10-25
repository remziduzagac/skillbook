# coordinate-brief

Writes the task context a worker starting now needs and the report it must return.

## Rules

1. **Give the worker what it needs to start without guessing.** Include context unavailable in the files. Give paths and line numbers for information the worker can read in files. Report a missing input as a gap. Never invent the missing fact.
2. **Include decisions and constraints recorded nowhere else.** The worker cannot recover them from code alone.
3. **Include approaches ruled out or already tried, with why.** This prevents repeated work.
4. **Give the first step and a success criterion.** Otherwise the worker can stop early or continue indefinitely.
5. **Point to references instead of pasting their contents.** Give file paths, line numbers and the location of recorded decisions. Pasting file contents costs output tokens when you write the brief and input tokens when the worker reads it. Check the references are usable by that reader. Report an inaccessible input rather than claiming the brief is sufficient.
6. **Name no tool available only to the writer.** Describe the action so another harness can perform it. Follow a user-chosen tool through its own skill or documentation where available.
7. **Ask for a report sized for its main-agent reader.** Use `act-rightsize` to size the report. Ask for the task outcome, decisions needed from the user, proposals, paths to evidence, and missing or unfinished work. Ask the worker to report cleanup under cleaned, kept and proposed. Put a changed or narrowed task first. Ask for a line on what was asked and why when tasks run together, the work is long, or the report will be kept for later. Put longer detail in a named scratch file. Ask the worker to return its path and the summary the caller needs.
8. **Bootstrap a fresh worker through the actual essentials folder.** Mark the task as delegated work. Give the worker the essentials folder's absolute path. Tell the worker to read `references/act.md` whole when that text is absent from its visible context. Act rule 10 bounds every step. Give the exact Names line below as the agreed bootstrap exception. When the worker needs a named skill, tell it to read that skill's parents too. This includes the `understand` and `respond` skills. A settled brief does not prevent the worker from discovering an unknown that would change the result. Do not copy act rule 10 into a second rule set.
9. **Ask the worker to clean up before reporting.** Ask the worker to follow `act-cleanup`: remove its temporary material, stop what it started and respect its limits. Ask it to report what it cleaned, kept or proposes to remove, and to check the cleanup result. A read-only task can still create a report or a process. Do not infer no leftovers from its label.

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

Check that the worker can use the inputs. Check that the brief includes decisions recorded nowhere else, constraints, rejected approaches, the first step and the success criterion. Check that the worker has the required act instructions and exact Names line, or that those instructions are already visible in its inherited context. The report and cleanup request are explicit. Apply `act-rightsize`. Do not claim an incomplete brief lets the reader start without asking.
