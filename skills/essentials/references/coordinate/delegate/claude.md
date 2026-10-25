# coordinate-delegate-claude

Maps permitted Claude Code worker controls to the parent's delegation policy.

Needs: exposed Claude Code agent tools. If absent, return the limitation to the caller; independence remains pending.

## Instructions

1. **Inspect the exposed Agent tool, permitted kinds and concurrency limits.** Documentation does not prove this session exposes them. Respect opt-in; change no settings.
2. **Select a dated model mapping only within the live schema.** Defaults checked 2026-10-25: light `haiku`, standard `sonnet`, strong `opus`, strongest escalation `fable`. User mappings win. Account/provider restrictions can change availability. A missing mapping uses the parent's session-model fallback; an unavailable mapped model is reported, not silently replaced.
3. **Use a fork only when its control is permitted and exposed.** A fork inherits the conversation, model and effort. For fresh context use an available non-fork worker with the full brief. No fork support means fresh context plus needed context, not claimed inheritance. A fresh worker serves independence.
4. **Set fresh-worker effort only through an exposed permitted parameter.** Map low/default/high to supported levels; default means the harness default. A forced environment or managed override may win. Report the actual value if known and unknown otherwise. Do not change main-session effort or configuration.
5. **Start, track and await the worker through live controls.** Keep its identity and actual result. Respect available completion notifications or waits; do not invent a wait API. Return approval prompts to the caller. Apply the parent's verification and cleanup rules.
6. **Report capability and billing limits honestly.** Cache sharing is documented for forks, not guaranteed savings on this run. Plan usage is not a zero API bill. Read the parent's cost data only when needed. Another harness's reference reasoning is not a live Claude interaction.

[Official subagent controls](https://code.claude.com/docs/en/sub-agents) and [model aliases](https://code.claude.com/docs/en/model-config) were checked on 2026-10-25. Inspect the live definitions before use.

## The last instruction

Return available controls, selected/actual model and effort, worker identity/status, missing capabilities and next owner. Claim no startup, independence, cache hit or cost cap without evidence.
