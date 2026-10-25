# coordinate-delegate-claude

Maps permitted Claude Code worker controls to the parent's delegation policy.

Needs: exposed Claude Code agent tools. If those tools are absent, return the limitation to the caller. The independent check remains pending.

## Instructions

1. **Inspect the exposed Agent tool, permitted kinds and concurrency limits.** Documentation does not prove this session exposes them. Respect any required user opt-in. Change no settings.
2. **Select a dated model mapping only within the live schema.** Defaults checked 2026-10-25: light `haiku`, standard `sonnet`, strong `opus`, strongest escalation `fable`. User mappings win. Restrictions set by the account or provider can change which models are available. If a mapping is missing, follow the parent's fallback of using the session model. Report an unavailable mapped model rather than silently replacing it.
3. **Use a fork only when its control is permitted and exposed.** A fork inherits the conversation, model and effort. For fresh context use an available non-fork worker with the full brief. No fork support means fresh context plus needed context, not claimed inheritance. A fresh worker serves independence.
4. **Set fresh-worker effort only through an exposed permitted parameter.** Map low, default and high effort to levels the harness supports. Default means the harness default. A forced environment or managed override may win. Report the actual value if known and unknown otherwise. Do not change main-session effort or configuration.
5. **Start, track and await the worker through live controls.** Keep its identity and actual result. Use available completion notifications or ways to wait. Do not invent an API for waiting. Return approval prompts to the caller. Apply the parent's verification and cleanup rules.
6. **Report which worker capabilities are available and what is known about billing limits.** Cache sharing is documented for forks, not guaranteed savings on this run. Plan usage is not a zero API bill. Read the parent's cost data only when needed. Another harness's reference reasoning is not a live Claude interaction.

[Official subagent controls](https://code.claude.com/docs/en/sub-agents) and [model aliases](https://code.claude.com/docs/en/model-config) were checked on 2026-10-25. Inspect the live definitions before use.

## The last instruction

Return the available controls, the model and effort selected, and the model and effort actually used where known. Give the worker's identity and status, missing capabilities and who acts next. Claim no startup, independence, cache hit or cost cap without evidence.
