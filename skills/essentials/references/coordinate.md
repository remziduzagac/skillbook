# coordinate

Helps agents work together, pass work to later sessions, and keep instructions and lessons in the right place.

## When to use

Use when work involves other agents, a later session, agent instructions, skillbook setup or lessons from a session. For example, a later agent may need a note to continue the work.

## When not

- A skill’s design or files: use the project’s skill-making method, otherwise your judgment. These methods cover working with agents and sessions.
- Other work outside these methods: use your judgment under the `act` guide.

## Gives back

Each used method’s result and its actual status, returned to the task that asked for it.

## Instructions

- the `coordinate-delegate` guide: choose and manage workers.
- the `coordinate-brief` guide: write a starting worker’s context.
- the `coordinate-carryover` guide: write or resume later-session context.

- the `coordinate-instruct` guide: prepare agent instruction documents.
- the `coordinate-setup` guide: prepare approved skillbook setup.
- the `coordinate-learn` guide: find homes for reusable lessons.

For a skill's design or files, use the project's method for making skills, otherwise judgment. A request fitting no route uses judgment under the `act` guide. Return each result to its active caller.

## The last instruction

Apply the last instruction of each child used. Report the actual status of the child's work. Return the result without restarting the caller's work.
