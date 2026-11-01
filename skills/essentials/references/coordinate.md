# coordinate

## Purpose

Helps agents work together, pass work to later sessions, and keep instructions and lessons in the right place.

## When to use

Use when work involves other agents, a later session, agent instructions, skillbook setup or lessons from a session. For example, a later agent may need a note to continue the work.

## When not

- A skill’s design or files: use the project’s skill-making method, otherwise your judgment. These methods cover working with agents and sessions.
- Other work outside these methods: use your judgment under the `act` guide.

## Gives back

Each used method’s result and its actual status, returned to the task that asked for it.

## Advice

- **Delegate by default.** An agent does the task, so this conversation keeps its room for the user and their decisions. This is strong advice: follow it unless the case gives a reason not to, and say when you depart from it. Do it yourself only when:
  - it is too small: you know the change or answer, it takes about three tool calls or fewer, and its reading and output are short, such as renaming a heading you have seen. Summarising a folder of reports is not small;
  - the user must decide things as it goes, not only at the start;
  - the conversation needs the content itself, such as a file the user wants to go through line by line.
  - When unsure, fork (start an agent from this conversation) without asking. Use the `coordinate-delegate` guide within the harness's limits.

## Instructions

The goal is to return the needed method’s result to the active task. Use the child guides that the task needs. There is no fixed order across these methods.

- the `coordinate-delegate` guide: choose and manage workers.
- the `coordinate-brief` guide: write a starting worker’s context.
- the `coordinate-carryover` guide: write or resume later-session context.

- the `coordinate-instruct` guide: prepare agent instruction documents.
- the `coordinate-setup` guide: prepare approved skillbook setup.
- the `coordinate-learn` guide: find homes for reusable lessons.

For a skill's design or files, use the project's method for making skills, otherwise judgment. A request fitting no route uses judgment under the `act` guide. Return each result to its active caller.

1. **Check each used method’s result.** Always do this last.

   Apply the final step of Instructions in each child guide used. Report the actual status of the child's work. Return the result without restarting the caller's work.
