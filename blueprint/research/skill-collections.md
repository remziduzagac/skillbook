---
status: current
created: "2026-10-10"
---

# Research: other skill collections, for a skill tree

How other collections are structured and loaded, whether any of them builds a tree of skills, and which skills could feed skillbook's tree. Two research agents cloned and read the repositories; the key claims marked *read* were checked again in the clones. Content listed here is a candidate, not a choice.

## Summary

- **No collection builds a tree.** None of the eight read hides inner skills from the model; every skill's description is listed every turn, or an installer picks a subset. skillbook's tree has no precedent to copy.
- **The closest shape is an entry skill with a routing table.** hyperframes' entry skill calls itself the "Mandatory entry point: read this first" and routes each request to a small per-route file, which is what a topic root does in skillbook's tree.
- **Descriptions should hold triggers only.** superpowers found that a description summarising the workflow made the agent follow the summary and skip the skill.
- **A bootstrap hook is the other way to steer.** superpowers injects its 65-line "using-superpowers" skill at every session start, clear and compact, with forceful wording; it costs about 3,400 characters each time.
- **Content exists for engineering and meta skills, little for the rest.** superpowers is engineering only; the productivity, writing and research candidates come from Anthropic's skills, gstack and alirezarezvani/claude-skills.

## The collections

| Collection, commit | Skills | Hidden from the model | Licence |
| --- | --- | --- | --- |
| obra/superpowers, `bb92a77` | 15 | none | MIT |
| anthropics/skills, `dbd4588` | 19 | none | Apache-2.0 for most; four proprietary |
| anthropics/claude-plugins-official, `b8e53f1` | 27 in `plugins/` | a few (`math-proof`) | Apache-2.0 |
| heygen-com/hyperframes, `f2b81b2` | 21 | none | Apache-2.0 |
| garrytan/gstack, `91bbd9e` | 63 | none | MIT |
| alirezarezvani/claude-skills, `19392f7` | 846 `SKILL.md` files | none | MIT |
| vercel-labs/agent-skills, `063bee9` | 9 | none | not found at the root |

mattpocock/skills, researched in [mattpocock-skills.md](mattpocock-skills.md), is MIT, checked on GitHub on 2026-10-13. Counts and licences are *read* in the clones. Anthropic's four document skills (pdf, docx, pptx, xlsx) say "Proprietary"; `doc-coauthoring` has no licence file or field.

## superpowers

- **Layout:** 15 flat skills in `skills/<name>/`, all model-invoked; no commands or agents folders; one manifest folder per harness, about ten of them (*read*).
- **Listing cost:** the 15 descriptions total 3,131 characters, listed every turn (research agent's count).
- **Bootstrap:** a `SessionStart` hook with matcher `startup|clear|compact` injects `using-superpowers/SKILL.md` wrapped in `<EXTREMELY_IMPORTANT>` (`hooks/hooks.json`, `hooks/session-start`, *read*). Its rule: "If you think there is even a 1% chance a skill might apply ... you ABSOLUTELY MUST invoke the skill." A `<SUBAGENT-STOP>` block keeps subagents from running it.
- **Calls between skills:** by full name, `**REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development`, and `**REQUIRED BACKGROUND:** You MUST understand superpowers:test-driven-development` (*read*).
- **Descriptions:** "The description should ONLY describe triggering conditions", with the evidence of a review skill whose summarised description made the agent do one review instead of two (`skills/writing-skills/SKILL.md`, *read*).
- **Size:** `SKILL.md` median 205 lines, maximum 681, above the repository's own "<500 words" guideline (research agent's count).
- **Tests:** suites that check skills fire on explicit requests (`tests/explicit-skill-requests/`, research agent).

## Structural patterns

- **Entry skill, routing table, per-route files:** hyperframes' `skills/hyperframes/SKILL.md` maps requests to workflows in a priority-ordered table and keeps one small contract per route in `references/routes/` (*read*). The table must stay in step with the routes.
- **A router skill over listed siblings:** gstack's top `SKILL.md` is "Router for the gstack skill suite" (*read*), but its 63 skills are all listed, so the router saves no context.
- **Category folders with a generated index:** alirezarezvani/claude-skills groups skills into folders such as `engineering/` and `productivity/` and generates a flat index (`.codex/skills-index.json`) (research agent).
- **Grouping in the marketplace only:** `skills.sh.json` groupings and Anthropic's marketplace bundles organise what people browse, not what the model loads (research agent).
- **One skill, many rule files:** vercel's `react-best-practices` is a 149-line `SKILL.md` with 72 rule files (research agent).
- **Not found anywhere:** a router more than two levels deep, inner skills hidden from the model, or a measurement of the per-turn description cost.

## Content candidates

By the topic they could sit under. Rows marked † were judged from names and descriptions only; read them before adopting. Check each skill's licence before copying.

- **Engineering:** superpowers' `systematic-debugging`, `test-driven-development`, `verification-before-completion`, `receiving-code-review`, `writing-plans`, `brainstorming`, `using-git-worktrees`, `finishing-a-development-branch`; Anthropic's `webapp-testing`, `mcp-builder`, `frontend-design`; gstack's `investigate`† and `careful`†; vercel's `react-best-practices`.
- **Productivity:** gstack's `retro`† and `context-save`†; alirezarezvani's `weekly-review`†, `handoff`†, `deep-work`† and `capture`†.
- **Writing:** Anthropic's `doc-coauthoring` and `internal-comms`; vercel's `writing-guidelines`†.
- **Research:** Anthropic's `discernment-nudge`; the official marketplace's `math-proof/solo`, for its notes file and safe resume.
- **Meta, about skills and agents:** Anthropic's `skill-creator`; superpowers' `writing-skills`, with `persuasion-principles.md` and `testing-skills-with-subagents.md`; the official marketplace's `claude-md-improver`, `session-report` and `hook-development`; gstack's `skillify`†.

## Gaps

- Star and install counts were not checked except on skills.sh, whose leaderboard ranks single skills, not collections.
- The awesome lists (ComposioHQ, hesreallyhim, travisvn) were not cloned; they link to collections rather than hold them.
- Whether superpowers' Codex package delivers its bootstrap was not checked.

## Sources

The clones above, read on 2026-10-10, and [skills.sh](https://skills.sh).
