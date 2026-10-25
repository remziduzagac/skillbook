# Requirements

skillbook holds the person's agent skills, so every project gets them without filling the agent's context.

## Goals

- One install gives a machine the skills for every project (D23).
- The context an agent always carries stays small: only main skills are listed, and their descriptions stay within budget (D21).
- Every skill follows one writing method (D22).
- skillbook meets greenrepo, and keeps its own design in a public blueprint (D25).

## Non-goals

- A general marketplace of other people's skills.
- New skills by contribution: a behaviour that can be composed from existing skills does not get a new one.
- Skills that belong to one project, such as herdsman's herdsman-maintain (D24).

## Skills

- **The first set:** agent-writing, markdown-style, blueprint and greenrepo (D20–D24).
- **Specified in:** [design/skillbook.md](design/skillbook.md) for the set as a whole, [design/blueprint.md](../../../docs/blueprint/idea.md) and [design/greenrepo.md](design/greenrepo.md) for the two main skills.

## Loading

- Main skills are registered; sub-skills are plain files read on demand, two levels deep by default (D21).
- Model-invoked descriptions stay under 300 characters each and under 1,500 together.

## Installing

- A plugin for everyday use, and a symlink script for machines where skills are edited, never both on one machine (D23).
- Claude Code and Codex; skill text stays harness-neutral so other agents work too (D22).

## Quality goals

1. **Small context load:** measured by the description budget above.
2. **Reliable loading:** a skill reads its sub-skills when the work needs them; checked by running the skill, since there is no automated evaluation.
3. **Consistency:** the repository's checks catch broken links, orphan sub-skills, frontmatter errors and manifest drift on every change.
4. **Harness neutrality:** no harness tool names except the generic "Skill tool".

## Constraints

- The Agent Skills specification: `name` at most 64 characters and matching its folder, `description` at most 1,024, `SKILL.md` under 500 lines.
- Codex drops symlinks inside plugins, and registers every nested `SKILL.md`; installers copy one skill folder at a time, so skill folders hold only real files and never link across folders.
- `plugin.json` lists its skills explicitly; its `version` is what tells installed users about a release.
- Public and MIT-licensed: nothing private enters the repository (D12).
