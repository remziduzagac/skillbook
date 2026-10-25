# coordinate-delegate-codex

Maps permitted Codex worker controls to the parent's delegation policy.

Needs: exposed permitted worker tools. If those tools are absent, return the limitation. Do not start another process to bypass a restriction.

## Instructions

1. **Inspect the live worker schema and active limits.** Respect restrictions on overriding the model or reasoning effort, on workers starting workers, and on user opt-in. Install or enable nothing.
2. **Use the dated role mapping only where permitted and available.** Checked 2026-10-25: light `gpt-6-luna`; standard and strong `gpt-6.1-sol`; strongest escalation `gpt-6-astra`. These are role assignments, not provider tier names. Keep the parent's strong-before-strongest condition even when standard and strong share a model. User mappings win. Use the session model when the mapping is missing. Report a limitation when the requested model is unavailable.
3. **Choose inheritance using the exposed schema.** If `spawn_agent` exposes `fork_turns`, `all` inherits history and `none` requests fresh context. Other schemas may differ. Do not invent that field when absent. Without a fork, give needed context to a fresh worker. Never call a history-sharing fork independent.
4. **Set model or reasoning effort only when that tool and the caller permit it.** Inspect supported values rather than translating names blindly. Map low, default and high effort to supported values under the parent's policy. A full-history fork may forbid overrides. Do not change configuration or the main session's effort to acquire them.
5. **Track identities and use exposed send, wait and result controls.** Do not repeatedly poll when a completion notice or wait is available. If a control is missing, return the current status and limitation. Apply the parent's scope, verification and cleanup rules.
6. **Keep documented possibilities separate from live evidence.** A model's API availability proves neither account access nor a worker tool's support. The documentation cited here does not establish that every fork saves cache costs or that spending is capped for each worker. Keep cost unknown where not shown.

[Official subagent guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents) and the [model catalog](https://developers.openai.com/api/docs/models) were checked on 2026-10-25. The current tool schema decides which controls exist.

## The last instruction

Return the worker capabilities actually available, the mapping used, which context was inherited and the worker's status. Explain what the evidence cannot show. Report which controls and costs could not be verified. Never infer an independent check from missing tool events.
