# Ideas: coordinate

Ideas and open questions for coordinate, not decided. What is decided is in [../design/essentials/coordinate.md](../design/essentials/coordinate.md).

## delegate

- Decided (D99): the two reasons, the tiers, the brief, council, fanout and crew.
- Reshaped (D138), as the baseline review found (D137).
- Supervisor and experts with "stuck" and "stale" timers (AgentCrew, AgentTree): whether a long delegated job needs them.
- Codex's subagents and models, for its reference file.
- Decided (D138): delegation is the default for any task that is not too small, the person asked only when the agent cannot tell; the main session keeps the conversation, the tracking and the person's decisions; a fork for decided work, a fresh agent for independence or another tier; a running list; delegate reshaped, with routing lines for council, fanout and crew. Raised by the person 2026-10-13 and 2026-10-14. Skills name no outside tool for running agents, and the harness's limits hold (D139).
- Decided (D142): the type first, after a cost check, then fork or fresh, judged from the list of what the agent needs from the conversation and whether the task's answer is known, then the model; no token thresholds; the window's fullness only where the harness shows it. Raised by the person 2026-10-17, to cut token use; the mechanism is in [../research/token-cost.md](../research/token-cost.md).
- Decided (D143): effort beside the model in the tier table, by the same question, set only where the harness lets a skill set it; delegation by default with its cost reason, a third exception for content the main agent needs to continue the conversation, and a fork without asking when the agent cannot tell whether a task is too small. The report back's shape, a short report with longer material in a named file, is agreed for now and settled after the lean discussion.
- Decided (D144): skills name tiers and effort levels, never a model; each harness's reference file maps the tiers to its own names, with prices and price steps; the person's mapping overrides, and with none every agent runs on the session's model; model and effort chosen separately, effort by how much reasoning the step needs. Raised by the person 2026-10-17: the model names work only for Claude, and model and effort should not be one level.
- Decided (D146): the report back is rightsized for the main agent: the outcome naming the task, what needs a decision, the evidence by path, what was not found, what was left behind; longer material in a named file; a line of context when the brief asks for it; a changed or narrowed task said first. The brief carries it, since a fresh agent may never load rightsize.
- Decided (D147): the brief and the report it asks back move to coordinate's brief; delegate's step points to it.
- Agents debating in rounds, one arguing each side, for weigh's debate (D132): whether it helps is recalled from memory, not checked; to research before delegate takes it up. If it helps and brings rules of its own, it may become a debate part of weigh; until then a debate is weigh's, with argue and challenge, and no skill of its own.
- Decided (D149, D150): stakes read only when the tier's row is not plain, guardrails only for several agents or a long job; only the current harness's reference file read; prices and other harnesses in their own reference files; fanout's findings in files, its validator on what the answer rests on. Decisions others build on take the strong tier and high effort (D150).

## brief

- Decided (D147): its own skill beside delegate, holding the rules every reader who was not in the conversation needs, with the delegation brief's specifics and the report it asks back moved from delegate; carryover builds on it. Raised by the person 2026-10-17: the brief and the handoff are two halves of one job.
- Decided (D149): a fresh agent is told not to load the main skill, with any skill it needs named; a read-only agent reports "left behind: nothing".

## carryover

- Decided (D104) as handoff; renamed carryover and built on brief (D147), since "handoff" also reads as a brief. Where carryovers are kept for good waits for the project folder (D64).
- Decided (D147): a fresh session as a way to cut cost, raised in D142: one question at a phase's end when the session has been long and the next work fits in the carryover; not when the next work needs the conversation or the session is short, and at most once per phase.

## instruct

- Decided (D94). The skill-file ideas gathered here first (the description is the trigger, a thin `SKILL.md`, a gotchas section) are skillbook-design's, in this repository.

## setup

- Decided (D97): the machine and project flows, recommendations, running again, hooks only when needed.
- Decided (D204): four compaction hooks in Claude Code that print essentials' start files, offered by setup.
- Which other hooks would help, and whether Codex's hooks match Claude Code's: open until there is a real case.
- Decided (D149): no question about other agent programs, whose default stays none; the team's use of skillbook stated as a default with a correction invited, not asked.

## learn

- The six-way sort after a task: a skill change, an insight, a decision, a session record, a note, or nothing (workslate).
- Prune skills that are never used (workslate, rig).
- The retro with an unconditional yardstick (mattpocock, gstack).
