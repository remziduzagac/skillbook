# coordinate-setup-claude

Prepares supported Claude Code setup details without changing the parent's approval policy.

Needs: access to the approved instruction and settings paths. The optional baseline helper needs Python 3. If access, hooks or Python 3 are unavailable, keep that step pending. Install nothing to obtain the missing capability.

## Instructions

1. **Inspect the actual install and current instruction precedence.** Personal skills normally live under `~/.claude/skills`. Project skills normally live under `.claude/skills`. Respect a configured alternate directory. Put personal instructions in `~/.claude/CLAUDE.md`. Put local project instructions in `CLAUDE.local.md`. Use the project's loaded instruction file for shared instructions. Confirm what this surface reads. A local Claude file can suppress direct loading of `AGENTS.md` under current defaults. Propose a supported import or return the limitation rather than silently dropping project instructions.
2. **Prepare only the read permission actually needed.** For an install whose references prompt outside the project, propose a `Read` allow rule restricted to its actual folder. A copied project install may need none. Inspect links and restrictions. Keep existing permissions and managed limits. Personal settings normally live at `~/.claude/settings.json`; use the actual configuration root.
3. **Propose a short reload hook for supported `SessionStart` events matching `compact`.** Use the helper and procedure in [baseline delivery](claude/assets/baseline.md). It names the actual installed start files and requests whole reads instead of printing their contents. The hook's output stays small even when a start file is large. Keep the normal pointer. This is a request to reload, not proof that the reads happened.
4. **Merge approved settings without replacing unrelated entries.** Parse the existing JSON, preserve keys, permissions and hooks, compare intended entries to avoid duplicates, and recheck before writing. If the settings are malformed or have changed, return a proposal to repair them. On removal, identify only the approved skillbook entries. Do not replace another hook list or change managed policy.
5. **Check actual loading in a permitted fresh session and after compaction where requested.** Verify that the correct main skill and every start file were read whole. Otherwise ask the user to run the check and report it pending. A successful helper run proves only that it generated the reload request.
6. **Return the actual destinations and results to setup.** For an external harness the user names, propose one line in personal instructions: `Allowed delegation harnesses: <names>`. Write no allow-list entry when the default is none. Use the parent's proposed, approved, declined and pending states. Another provider's reference text is not a live Claude check.

Checked 2026-10-25: [memory](https://code.claude.com/docs/en/memory), [settings](https://code.claude.com/docs/en/settings) and [hooks](https://code.claude.com/docs/en/hooks). Inspect current controls before applying a proposal.

## The last instruction

Return the proposed or approved entries, actual install paths, preserved settings and observed loading evidence. Keep unsupported or unobserved controls pending with their next owner. Never claim a whole baseline reload from a hook message alone.
