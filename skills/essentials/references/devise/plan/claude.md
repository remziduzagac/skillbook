# devise-plan-claude

Maps Claude Code's available planning and task controls to the parent's policy.

Needs: the session's permitted mode and task controls. Missing controls use `devise-plan`'s text approval or plain-text checklist fallback.

## Instructions

1. **Inspect the tools actually exposed in this session.** Plan mode and task tracking are separate capabilities. Product names alone do not establish either.
2. **Use `EnterPlanMode` when it is available and `devise-plan` calls for that approval process.** A user can also select plan mode with `/plan`, `Shift+Tab`, or `--permission-mode plan`. These are user controls, not shell commands to run inside the session.
3. **Present the proposed plan through `ExitPlanMode` when it is available.** Take only the actual user answer or explicit approval result as approval. Cancellation, a mode transition or a task checkbox does not supply it. Follow `respond-ask` for unanswered questions.
4. **Check the mode after approval.** Do not request a second exit when it already exited. If the mode still prohibits edits, tell the user or caller that they need to change the mode. Never bypass permissions.
5. **Use exposed task tools for the checklist.** Create steps with `TaskCreate`. Read them with `TaskList` or `TaskGet`. Update them with `TaskUpdate` using the tool definition in this session. Use `TodoWrite` only when that older tool is exposed. Update completion only after the parent's check passes. A checked box is not evidence.
6. **Use the parent's fallback for each missing capability.** With no mode control, put the approval request in the final message and end the turn. With no task tools, use plain text. Install nothing and change no settings to expose tools.
7. **Treat another harness's inspection as documentation only.** Do not try to operate Claude Code controls in another harness. Do not claim that a hypothetical example tested real controls.

[Official mode guidance](https://code.claude.com/docs/en/permission-modes) and [tool reference](https://code.claude.com/docs/en/tools-reference) describe the controls. Check current definitions when a field is unknown. Do not infer live availability from the documentation.

## The last instruction

Report which controls were available and what they did. Name missing capabilities and who should act next. Apply the parent's approval and verification policy. Mark a live interaction unverified when only a documented or simulated workflow was checked.
