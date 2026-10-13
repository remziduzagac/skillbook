---
status: current
created: "2026-10-11"
---

# Research: three guides to writing skills, compared

How mattpocock/skills (`writing-for-agents`), obra/superpowers (`writing-skills`) and Anthropic (the "Skill authoring best practices" page and the `skill-creator` skill) say a skill should be written, read side by side for skillbook's convention for main skills (D38) and for the agent-writing skill.

## Summary

- **All three want plain, followable steps.** Matt: documents that "read like documentation written for the agent"; superpowers: "Linear instructions → Numbered lists"; Anthropic: "Break complex operations into clear, sequential steps".
- **Branches are plain conditions pointing to a named place.** Anthropic's conditional workflow: "**Creating new content?** → Follow "Creation workflow" below". superpowers forbids "labels without semantic meaning (step1, helper2)".
- **Explain why; save capitals for real guardrails.** Matt prefers positive phrasing over prohibitions; skill-creator calls ALWAYS and NEVER in capitals "a yellow flag". superpowers is the exception, with forceful wording in its bootstrap.
- **References stay one level from the skill that uses them.** Anthropic: "Keep references one level deep from SKILL.md", because nested references may be read only partly; skill-creator: near 500 lines, "add an additional layer of hierarchy along with clear pointers". Depth comes from more skills, not chains of files.
- **Long flows get a checklist the agent copies,** and quality-critical steps a feedback loop (validate, fix, repeat) (Anthropic).
- **Diagrams only where a step is easy to get wrong:** non-obvious decisions, loops where the agent might stop early, A-versus-B choices (superpowers).
- **Evaluation comes first** (Anthropic): three evaluations before writing, a baseline without the skill, tests on several models, one Claude writing while a fresh one tests. This contradicts Matt's "There is no automated eval".

## Side by side

| Topic | mattpocock | superpowers | Anthropic |
| --- | --- | --- | --- |
| Steps | "Done when" on every step | numbered lists | numbered steps; copyable checklist |
| Branches | conditional pointers | flowchart if non-obvious | bold question → named workflow |
| Descriptions | what it is; "Use when" | triggers only, no workflow | third person; what and when |
| Names | leading words | not covered | "-ing" preferred; consistent |
| Emphasis | positive; few prohibitions | forceful in its bootstrap | explain why; capitals a yellow flag |
| Depth | two hops in practice | supporting files per skill | one level from `SKILL.md` |
| Size | median 71 lines | median 205 lines | `SKILL.md` under 500 lines |
| Evaluation | by running the skill | tests that skills fire | evaluations first, A and B |

## Sources

- mattpocock/skills at `49dd158`: `skills/productivity/writing-for-agents/SKILL.md`, `SKILL-MECHANICS.md`, and [mattpocock-skills.md](mattpocock-skills.md) (*read*).
- obra/superpowers at `bb92a77`: `skills/writing-skills/SKILL.md`, "Flowchart Usage" and the description rule (*read*).
- Anthropic: [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (*summary*, 2026-10-11), and `skills/skill-creator/SKILL.md` in anthropics/skills at `dbd4588` (*read*).
