# devise-plan-codex

Maps Codex's available planning and plan-tracking controls to the parent's policy.

Needs: the session's permitted mode controls or plan tool. Missing controls use `devise-plan`'s text approval or plain-text checklist fallback.

## Instructions

1. **Inspect the current mode and exposed tools.** Plan mode and plan tracking are independent. Their availability is not established by the product name.
2. **Use a permitted mode control only when the harness exposes it.** The user UI command `/plan` enters Plan mode; it is not a shell command or a universal agent-callable control. Use the parent's final-text approval fallback when no such control is exposed.
3. **Recognise actual user approval, not a mode label.** Follow `respond-ask` for the answer. A plan-only request and a task status approve nothing. If still in a mode that prohibits edits, return that limit to the user or caller before any execution.
4. **Use `update_plan` when exposed.** Give the steps and their statuses using its current schema: pending, in_progress or completed. Keep at most one step in progress. Update the plan after a check; mark completed only when the parent's verification passes. This tool tracks work and does not change modes or grant approval.
5. **Use plain text when no plan tool is exposed.** Keep the parent's checklist and approval timing. With neither capability, both fallbacks apply. Install nothing and change no configuration to obtain tools.
6. **Report an unknown mode control as unknown.** A universal agent-callable entry/exit API is not established by the documented UI command. Use a currently exposed, permitted control or return the missing mode change to the user; never invent an exit command or bypass a restriction.
7. **Treat another harness's inspection as documentation only.** Explain the mapping without operating this session as Codex or claiming a live interaction from a simulation.

[Official developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) describe UI entry. The [official plan-tool guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide#update-plan) documents plan tracking. Tool availability and mode control still come from the current harness.

## The last instruction

Return the actual mode, tracking results, unknown controls and next required action. Apply the parent's approval and verification policy. Distinguish a documented mapping from a verified live interaction.
