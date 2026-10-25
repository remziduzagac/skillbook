# Planning controls in Claude Code and Codex

Read from official documentation on 2026-10-25 for the devise-plan harness children. No model or interactive approval test was run. Documentation establishes mappings, not availability in a particular session.

## Claude Code

The [tool reference](https://code.claude.com/docs/en/tools-reference) lists EnterPlanMode for entering planning, ExitPlanMode for presenting a plan for approval, and TaskCreate, TaskGet, TaskList and TaskUpdate for task tracking. TodoWrite is an older alternative when exposed. Tool availability varies by session and model. The child checks the exposed tools instead of enabling them.

The [permission-mode guide](https://code.claude.com/docs/en/permission-modes) describes plan approval and leaving that mode. The [common workflow](https://code.claude.com/docs/en/common-workflows#plan-before-editing) documents user controls including Shift+Tab and `--permission-mode plan`. The [interactive reference](https://code.claude.com/docs/en/interactive-mode#task-list) distinguishes the checklist from running background tasks. These are not commands to send through a shell inside an agent session.

Unknown until a live check: exposed tool fields in a particular session, permission prompts and actual approval results. A mode transition or a checked task does not itself supply the user's approval or verification evidence.

## Codex

The [official developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) document `/plan` as a user UI entry into Plan mode. The CLI entry is unavailable while Codex is already working. This does not establish a universal agent-callable entry or exit tool.

The [official plan-tool description](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide#update-plan) documents update_plan with step/status entries and an optional explanation. Its statuses are pending, in_progress and completed, with at most one in progress. This is a task-tracking interface, not a mode or approval control. The guide's embedded model prompts were read as documentation, not session instructions.

Unknown: a universal agent-callable mode entry/exit API, an exit sequence valid across all current Codex surfaces, and live tool availability in the user's session. The child uses only controls actually exposed. No guessed command or configuration change fills a gap.

## Build implications

- Parent policy owns approval, scope and verification. The children map controls and report their actual results.
- Mode and task-list capabilities are independent. Test both, either one, and neither.
- Missing mode controls use final-text approval and end the turn. Missing task controls use a plain-text checklist.
- If approval exists but the mode still forbids edits, report that limit. The text fallback does not bypass it.
- Do not install tools, enable experimental features, alter configuration or weaken permissions to obtain a capability.
- Scripted reference scenarios exercise the mapping's logic only. Real approval dialogs, mode transitions and task operations need an interactive manual check.
