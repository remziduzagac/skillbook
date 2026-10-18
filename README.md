# skillbook

Agent skills for any kind of project, organised as sets you install separately: essentials, for how any work is done, and sets for keeping a project's design record, engineering software and writing for people. Built for Claude Code and Codex, written so other agents that read skills work too.

**Status:** the design is under way; no skill is built yet. Nothing here is installable today.

## The plan

| Sets | What they cover |
| --- | --- |
| essentials | how the agent behaves, understands, arranges, coordinates, designs and plans, with care |
| blueprint | the spec-to-dev flow: a project's design record, decisions and tasks, kept in step |
| softeng | how good software is designed, built, tested, reviewed, shipped and maintained |
| authoring | writing for people: user docs, business documents, articles, issues; editing |

Only each set's main skill sits in an agent's context; every other skill loads when a flow reaches it, so a set can grow without filling the context. Each set works alone, and uses another when it is installed.

## Installing

Coming with the first release: each set is its own plugin in skillbook's marketplace, installed on its own, for Claude Code and Codex, and turned off through the harness's own plugin switch.

## How it is organised

- [blueprint/](blueprint/README.md): skillbook's own design, decisions and research, kept with the blueprint method.
- `skills/`: the shipped skills, once built; `beta/`: skills being tried.
- [docs/](docs/README.md): one page per skill, for people.
- [blueprint/design/how-it-works.md](blueprint/design/how-it-works.md): skillbook as a whole, as designed so far.

## Help and contributing

Report a skill that misbehaved in a real session as an issue; see [SCOPE.md](SCOPE.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Security problems go through [SECURITY.md](SECURITY.md).

skillbook is maintained by Remzi Duzagac and licensed under the [MIT licence](LICENSE).
