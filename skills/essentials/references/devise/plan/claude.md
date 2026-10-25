# devise-plan-claude

Maps Claude Code's available planning and task controls to the parent's policy.

Needs: the session's permitted mode and task controls. Missing controls use `devise-plan`'s text approval or plain-text checklist fallback.

## Instructions

1. **Inspect the tools actually exposed in this session.** Plan mode and task tracking are separate capabilities. Product names alone do not establish either.
2. **Use `EnterPlanMode` when available and parent policy needs its approval path.** A user can also select plan mode with `/plan`, `Shift+Tab`, or `--permission-mode plan`. These are user controls, not shell commands to run inside the session.
3. **Present the proposed plan through `ExitPlanMode` when it is available.** Take only the actual user answer or explicit approval result as approval. Cancellation, a mode transition or a task checkbox does not supply it. Follow `respond-ask` for unanswered questions.
4. **Check the mode after approval.** Do not request a second exit when it already exited. If edits remain prohibited, report that limit and return the needed mode change to the user or caller. Never bypass permissions.
5. **Use exposed task tools for the checklist.** Create steps with `TaskCreate`; inspect with `TaskList` or `TaskGet`; update with `TaskUpdate` using the live schema. Use `TodoWrite` only when that older tool is exposed. Update completion only after the parent's check passes. A checked box is not evidence.
6. **Use the parent's fallback for each missing capability.** With no mode control, put the approval request in the final message and end the turn. With no task tools, use plain text. Install nothing and change no settings to expose tools.
7. **Treat another harness's inspection as documentation only.** Do not operate this mapping's controls there or claim a real interaction from a hypothetical example.

[Official mode guidance](https://code.claude.com/docs/en/permission-modes) and [tool reference](https://code.claude.com/docs/en/tools-reference) describe the controls. Check current definitions when a field is unknown. Do not infer live availability from the documentation.

## The last instruction

Return actual controls and results, missing capabilities and the next owner. Apply the parent's approval and verification policy. Mark a live interaction unverified when only a documented or simulated workflow was checked.
