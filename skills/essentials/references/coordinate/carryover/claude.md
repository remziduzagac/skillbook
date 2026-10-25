# coordinate-carryover-claude

Gives the user Claude Code transition instructions after a carryover.

## Instructions

1. **Check the current Claude Code command surface.** Do not assume another version exposes the same controls.
2. **Give `/compact` with a focus naming the note when supported.** Ask the summary to retain recent user corrections and conversation after the note. The user types the command; do not execute it in a shell or claim it has run.
3. **Give `/clear` for a user-requested fresh session when supported.** Supply a separate startup line: read the named note, load current instructions and check its basis before continuing. A new session does not imply approval of stored actions.
4. **Use a plain continuation line when a control is unavailable.** Give the note path and the desired focus. Mark the missing control unknown. Install nothing and change no settings.
5. **Return to the parent for post-transition checks.** A shown command is not evidence of compaction, a new session or a successful resume.

[Official commands](https://code.claude.com/docs/en/commands) were checked on 2026-10-25. Verify supported arguments in the current surface.

## The last instruction

Return the command or fallback, note path, focus/startup line and actual transition status. The user performs the transition; the parent checks the resumed state.
