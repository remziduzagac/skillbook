<p align="center"><img src="assets/logo.svg" alt="" width="96"></p>
<h1 align="center">skillbook</h1>
<p align="center"><a href="https://github.com/remziduzagac/skillbook/actions/workflows/ci.yml"><img src="https://github.com/remziduzagac/skillbook/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status"></a></p>

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

Coming with the first release: one install script, `install.sh`, copies the sets you choose into the skill folders of Claude Code and Codex; each set is installed on its own, and turned off by removing it.

## How it is organised

- [blueprint/](blueprint/README.md): skillbook's own design, decisions and research, kept with the blueprint method.
- `skills/<set>/`: one folder per set, once built.
- [docs/](docs/README.md): one page per skill, for people.
- [blueprint/design/how-it-works.md](blueprint/design/how-it-works.md): skillbook as a whole, as designed so far.

## Use at your own risk

skillbook's skills guide an AI agent that reads files, runs commands and changes things on your machine. The skills make the agent more careful, but they cannot guarantee what it does. So:

- review what the agent proposes and does before you accept it;
- keep backups, and keep your work under version control;
- use your agent's own permission settings.

skillbook is provided "as is", without warranty and without liability, as sections 7 and 8 of the [licence](LICENSE) say.

## Help and contributing

Report a skill that misbehaved in a real session as an issue; see [SCOPE.md](SCOPE.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Security problems go through [SECURITY.md](SECURITY.md).

skillbook is maintained by Remzi Duzagac and licensed under the [Apache License 2.0](LICENSE).
