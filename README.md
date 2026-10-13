# skillbook

Agent skills for any kind of project, organised as one tree: the stages a project goes through, from design to maintenance, beside writing, thinking, research and the work around them. Built for Claude Code and Codex, written so other agents that read skills work too.

**Status:** the design is under way; no skill is built yet. Nothing here is installable today.

## The plan

| Roots | What they cover |
| --- | --- |
| conduct | how the agent acts and responds: organizing, verifying, setting up agent files, delegating |
| understand | understanding before acting: clarifying, brainstorming, naming, research |
| design, plan, implement, test, review, ship, maintain | the stages any project goes through |
| author | writing for people: blueprint documents, user docs, business documents, articles; editing |

Only one main skill sits in an agent's context; every other skill loads when a flow reaches it, so the tree can grow without filling the context.

## Installing

Coming with the first release: a plugin for Claude Code and Codex. Machines where skillbook itself is developed install the working copy of this repository as a local plugin.

## How it is organised

- [blueprint/](blueprint/README.md): skillbook's own design, decisions and research, kept with the blueprint method.
- `skills/`: the shipped skills, once built; `beta/`: skills being tried.
- [docs/](docs/README.md): one page per skill, for people.
- [blueprint/design/how-it-works.md](blueprint/design/how-it-works.md): skillbook as a whole, as designed so far.

## Help and contributing

Report a skill that misbehaved in a real session as an issue; see [SCOPE.md](SCOPE.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Security problems go through [SECURITY.md](SECURITY.md).

skillbook is maintained by Remzi Duzagac and licensed under the [MIT licence](LICENSE).
