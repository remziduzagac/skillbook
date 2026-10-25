# coordinate-carryover-codex

Gives the user Codex transition instructions after a carryover.

## Instructions

1. **Check the current Codex surface and whether a task is active.** Commands differ across CLI, IDE and other surfaces.
2. **Give `/compact` where documented and available.** Name the note and requested recent context in a companion focus line. The documentation does not confirm a focus argument that works on every surface. Do not invent one. The user types the command.
3. **Give `/new` for a fresh CLI chat where available.** It starts a new chat in the current CLI session. Give a separate startup line to read the note, load current instructions and check its basis. Do not select or create a worktree unless asked.
4. **Return missing controls honestly.** Provide the note path and a plain continuation request when compaction or fresh-chat controls are absent. Never run UI commands through the shell or change settings to expose them.
5. **Leave transition and resume verification to their owners.** The user performs the transition. The parent rereads and checks the note afterward. Do not claim success from instructions alone.

[Official developer commands](https://learn.chatgpt.com/docs/developer-commands) were checked on 2026-10-25. A displayed command does not prove live availability or execution.

## The last instruction

Return supported commands or a plain-text fallback, the note path, the focus or request for starting the next session, and whether the transition actually happened. Mark the unconfirmed focus syntax and any missing capability.
