# coordinate-setup-codex

Prepares supported Codex setup details and preserves project instructions.

## Instructions

1. **Inspect the actual Codex home and install scope.** Personal skills normally live in `~/.agents/skills`. Project skills normally live in `.agents/skills`. Confirm the active surface discovers them. Instructions use `AGENTS.md` in the Codex home, normally `~/.codex`, or the loaded project instruction file. Respect `CODEX_HOME` where set. A directory's existence alone does not prove loading.
2. **Warn before proposing an override file.** Codex uses at most one instruction file per directory, preferring `AGENTS.override.md` over `AGENTS.md`. It is not an additive local file. For local-only setup with no supported additive file, return that limitation and propose a user-approved alternative, such as a project-scoped pointer in personal instructions. Do not overwrite or hide shared instructions to satisfy a local default.
3. **Prepare the pointer through the parent and `coordinate-instruct`.** For a shared project pointer, follow the parent's conditions for a team install or the user's explicit request. Keep local personal material out of version control using the project's approved method. Propose no Claude read rule or compaction hook for Codex.
4. **Check a permitted fresh session using a request that needs a project file.** Check which instructions loaded and whether every baseline file was read whole. Finding the skill alone does not prove those reads happened. If no session control is exposed, ask the user to start the check. Keep it pending until the result arrives. Change no configuration merely to obtain a control.
5. **Return supported destinations, warnings and observed results to setup.** For an external harness the user names, propose one line in personal instructions: `Allowed delegation harnesses: <names>`. Write no allow-list entry when the default is none. Keep the work within the actual scope of approval. Report what is unknown about the account, the current Codex interface or how it loads skills.

Checked 2026-10-25: [instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [skill discovery](https://learn.chatgpt.com/docs/build-skills). No universal agent-callable fresh-session control is established here.

## The last instruction

Check that the chosen destination preserves current project instructions. Return the actual pointer and loading status, unsupported local-only behavior and its next owner. Do not claim a new session or successful setup from a displayed command.
