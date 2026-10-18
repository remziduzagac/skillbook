# Requirements

skillbook holds the person's agent skills as sets, each installed on its own, so every project, of any kind, gets what it needs without filling the agent's context.

## Goals

- **Install what is needed:** each set, essentials, blueprint, softeng and authoring, installs on its own, as a plugin from skillbook's marketplace, and works alone (D20, D152, D185).
- **Any kind of project:** essentials for any work: how the agent works (act), understands (understand, research included), arranges (organize), works with other agents (coordinate), designs and plans (devise), and responds (respond); sets for kinds of work: blueprint for a project's design record, softeng for software, authoring for writing; rigs, a knowledge base and routines later (D35, D36, D40, D64, D67, D76, D154).
- **Cheap to use:** only each installed set's main skill sits in the agent's context every turn; everything else loads when a flow reaches it (D38; [research/skill-loading.md](research/skill-loading.md)).
- **Easy to build and to grow:** every skill is a plain procedure over its sub-skills, and a new case becomes a new sub-skill rather than a longer file (D38).
- **Held to its own standards:** skillbook keeps its design in this public blueprint and meets its own repository standard (D25, D37).

## Non-goals

- A marketplace of other people's skills. Outside skills are learned from, and adopted with credit where they map to ours (D30).
- Skills that belong to one project, which stay in that project (D24).
- New skills by contribution: a behaviour that can be composed from existing skills does not get a new one.

## Constraints

- **The Agent Skills specification:** `name` at most 64 characters, lowercase; `description` at most 1,024 characters. In skillbook a main skill's name is its set's, and every other skill's name is its path below the main skill's `references/` joined by dashes; only a main skill is a skill in the specification's sense, the others being plain files, so the rule that `name` matches its folder concerns the main skill alone (D43, D71, D152, D188).
- **Claude Code and Codex,** as tested ([research/skill-loading.md](research/skill-loading.md)): a namespace has one level; a skill the person alone invokes is hidden from the model but can be loaded by its path; a `SKILL.md` nested in another skill's folder is registered only when `plugin.json` lists its folder, which skillbook avoids by keeping every other skill a plain file that the name rule reads whole (D188); plugins hold real files, not symlinks.
- **Public and MIT-licensed:** nothing private enters the repository (D12).

## Quality goals

1. **Small context load:** the descriptions of the installed sets' main skills are the only per-turn cost.
2. **Reliable loading:** a flow reaches the sub-skill it needs; checked by running the skills.
3. **Easy to follow:** every skill reads as clear steps in natural language (D38).
4. **Consistency:** the repository's checks catch broken links, orphan files, frontmatter errors and manifest drift.
5. **Harness neutrality:** skill text names no harness tool except the generic Skill tool.
