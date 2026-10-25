# devise-plan-codex

Maps Codex's available planning and plan-tracking controls to the parent's policy.

Needs: the session's permitted mode controls or plan tool. Missing controls use `devise-plan`'s text approval or plain-text checklist fallback.

## Instructions

1. **Inspect the current mode and exposed tools.** Plan mode and plan tracking are independent. Their availability is not established by the product name.
2. **Use a permitted mode control only when the harness exposes it.** The user UI command `/plan` enters Plan mode; it is not a shell command or a universal agent-callable control. Use the parent's final-text approval fallback when no such control is exposed.
3. **Recognise actual user approval, not a mode label.** Follow `respond-ask` for the answer. A plan-only request and a task status approve nothing. If the mode still prohibits edits, tell the user or caller before executing any step.
4. **Use `update_plan` when exposed.** Give the steps and their statuses using its current schema: pending, in_progress or completed. Keep at most one step in progress. Update the plan after checking a step. Mark the step completed only when `devise-plan`'s verification passes. This tool tracks work and does not change modes or grant approval.
5. **Use plain text when no plan tool is exposed.** Keep the parent's checklist and approval timing. With neither capability, both fallbacks apply. Install nothing and change no configuration to obtain tools.
6. **Report an unknown mode control as unknown.** A universal agent-callable entry/exit API is not established by the documented UI command. Use a permitted mode control exposed in this session. If none is available, ask the user to change the mode. Never invent an exit command or bypass a restriction.
7. **Treat another harness's inspection as documentation only.** Explain how the Codex controls would work. Do not try to use those controls in another harness. Do not claim that a simulation tested real controls.

[Official developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) describe UI entry. The [official plan-tool guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide#update-plan) documents plan tracking. Tool availability and mode control still come from the current harness.

## The last instruction

Return the actual mode, tracking results, unknown controls and next required action. Apply the parent's approval and verification policy. Distinguish a documented mapping from a verified live interaction.
