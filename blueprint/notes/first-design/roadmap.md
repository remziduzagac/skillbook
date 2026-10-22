# Roadmap

Status: **Design**, the initial design is open again (D27): changes go straight into the root, without workstreams. Now: the skill tree, drafted in [notes/skillbook-tree.md](../../ideas/skill-tree.md) for brainstorming.

## Design: in progress

- [x] **Blueprint:** the method for keeping a project's thinking (D1–D14). 2026-10-07 to 2026-10-09.
- [x] **greenrepo:** the standard for healthy repositories, and its profiles (D15–D19). 2026-10-09 to 2026-10-10.
- [x] **skillbook:** how the skills are organised, loaded, installed and maintained (D20–D25). 2026-10-10.
- [ ] **The skill structure, again:** skills as a tree of flat skills under the `skillbook` namespace; what is listed, how skills call each other, how they install and are checked ([research/skill-loading.md](../../research/skill-loading.md)).
- [ ] **design/skillbook.md rewritten** from D27–D38 once the tree settles: roots, sub-skills, naming, the procedure convention.

## Build: next

Starts once the person declares the initial design settled again.

- [ ] **The repository's checks:** the check script and CI that skillbook's design specifies, release-please, and the rest of greenrepo's core for a markdown-and-Bash repository.
- [ ] **agent-writing:** the writing rules every skill follows, adapted from mattpocock/skills' `writing-for-agents` (D22). First, because every other skill is written against it.
- [ ] **markdown-style:** moved in from the person's existing skill (D24).
- [ ] **blueprint:** the main skill and its sub-skills, from [design/blueprint.md](../../../docs/blueprint/idea/blueprint.md).
- [ ] **greenrepo:** the main skill, its sub-skills, profile files with examples, and templates for the health workflow and the three upkeep files, from [design/greenrepo.md](design/greenrepo.md).
- [ ] **A first manual run of the health workflow on herdsman,** which answers greenrepo's open platform questions.
- [ ] **The first release:** manifests listing the shipped skills, docs pages, install instructions.

## Later

Agreed, but not scheduled.

- [ ] **More greenrepo profiles:** containers, mobile, deploy targets, frameworks, each after a short research round.
- [ ] **A retro skill** that reviews a session and proposes changes to skills and steering files (design/skillbook.md).
- [ ] **Wider install routes:** Claude Code's official marketplace and skills.sh, once the set is stable.
