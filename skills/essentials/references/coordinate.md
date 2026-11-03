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

- **Delegate by default.** An agent does the task, so this conversation keeps its room for the user and their decisions. This is strong advice: follow it unless the case gives a reason not to. When you depart from it, give that reason in your final answer. Do the task yourself only when one of these holds:
  - it is too small: you know the change or answer, it takes about three tool calls or fewer, and its reading and output are short, such as renaming a heading you have seen. Summarising a folder of reports is not small;
  - the user must decide things as it goes, not only at the start;
  - the conversation needs the content itself, such as a file the user wants to go through line by line.
- **When unsure whether a task is too small, fork it without asking.** A fork starts an agent from this conversation. When that call is hard, doing the task here and forking cost about the same, so a question would cost the user a turn and settle little. Use the `coordinate-delegate` guide within the harness's limits.

## Instructions

Coordinating keeps this conversation small and the work moving. Other agents do the tasks, later sessions pick up where this one stopped, and instructions and lessons go where the next agent will find them. Every file read and every output printed here is carried again on every later turn, so work done elsewhere saves tokens and keeps this conversation free for the user. **Decide who does each part, use the method that part needs, and check what comes back.**

1. **Decide, for each part of the approach, whether another agent should do it.** Work done here fills this conversation with reading and output the user never needs.
   - Delegate by default, as the advice above says. Do a part yourself only for one of its exceptions: it is too small, the user decides as it goes, or the conversation needs the content itself.
   - When unsure whether a part is too small, fork it without asking.
2. **Hand the work over with the method it needs.** The wrong way wastes tokens or weakens the result.
   - the `coordinate-delegate` guide: choose and manage workers, from a fork to several agents, with each worker's model and effort matched to the risk. Track them, check what they return and clean up after them.
   - the `coordinate-brief` guide: write a starting worker's context, with pointers instead of pasted files, and ask for a short report.
   - the `coordinate-carryover` guide: write or resume the context for a later session, or for an agent the user starts.
3. **Keep instructions, setup and lessons where the next agent will find them.** An instruction or a lesson in the wrong place is not read when it is needed.
   - the `coordinate-instruct` guide: prepare agent instruction documents.
   - the `coordinate-setup` guide: prepare approved skillbook setup.
   - the `coordinate-learn` guide: find homes for reusable lessons.
4. **Check each result before you use it, and return its actual status.** Always do this last. A worker's report of success is not the work itself, and an unchecked result passes its faults on as yours.
   - Follow the final step of each child guide you used.
   - Report the actual status of each child's work, such as finished and checked, finished but unchecked, or still running.
   - Return each result to its active caller without restarting the caller's work.
