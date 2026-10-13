# Requirements

skillbook holds the person's agent skills as one tree, so every project, of any kind, gets them without filling the agent's context.

## Goals

- **One install** gives a machine every skill, as one plugin named `skillbook` (D20, D23).
- **Any kind of project:** the stages a project goes through (design, plan, implement, test, review, ship, maintain), with specialisations for each kind of work; beside it understand (research included) and author, and conduct, how the agent acts; knowledge and routines later (D35, D36, D40, D64, D67, D76).
- **Cheap to use:** only the main skill sits in the agent's context every turn; everything else loads when a flow reaches it (D38; [research/skill-loading.md](research/skill-loading.md)).
- **Easy to build and to grow:** every skill is a plain procedure over its sub-skills, and a new case becomes a new sub-skill rather than a longer file (D38).
- **Held to its own standards:** skillbook keeps its design in this public blueprint and meets its own repository standard (D25, D37).

## Non-goals

- A marketplace of other people's skills. Outside skills are learned from, and adopted with credit where they map to ours (D30).
- Skills that belong to one project, which stay in that project (D24).
- New skills by contribution: a behaviour that can be composed from existing skills does not get a new one.

## Constraints

- **The Agent Skills specification:** `name` at most 64 characters, lowercase; `description` at most 1,024 characters. In skillbook a skill's name is its folder path below the main skill's folder joined by dashes, so it matches its folder once installed flat, not inside the repository (D43, D71).
- **Claude Code and Codex,** as tested ([research/skill-loading.md](research/skill-loading.md)): a namespace has one level; a skill the person alone invokes is hidden from the model but can be loaded by its path; a `SKILL.md` nested in another skill's folder is registered only when `plugin.json` lists its folder; plugins hold real files, not symlinks.
- **Public and MIT-licensed:** nothing private enters the repository (D12).

## Quality goals

1. **Small context load:** the main skill's description is the only per-turn cost.
2. **Reliable loading:** a flow reaches the sub-skill it needs; checked by running the skills.
3. **Easy to follow:** every skill reads as clear steps in natural language (D38).
4. **Consistency:** the repository's checks catch broken links, orphan files, frontmatter errors and manifest drift.
5. **Harness neutrality:** skill text names no harness tool except the generic Skill tool.
