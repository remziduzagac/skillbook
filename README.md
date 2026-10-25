<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/skillbook-logo-light.svg">
    <img alt="skillbook" src="assets/skillbook-logo-dark.svg" width="200">
  </picture>
</p>
<p align="center">
  <img alt="An orange robot at a workbench reads a green skillbook, with diagrams, gears and screens around it"
    src="assets/skillbook-robot.webp" width="720">
</p>
<p align="center"><a href="https://github.com/remziduzagac/skillbook/actions/workflows/ci.yml"><img src="https://github.com/remziduzagac/skillbook/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status"></a></p>

Agent skills for any kind of project, organised as sets you install separately: essentials, for how any work is done, and sets for keeping a project's design record, engineering software and writing for people. Built for Claude Code and Codex, written so other agents that read skills work too.

**Status:** the design is under way; no skill is built yet. Nothing here is installable today.

## The plan

| Sets | What they cover |
| --- | --- |
| essentials | how the agent behaves, understands, arranges, coordinates, designs and plans, with care |
| blueprint | the spec-to-dev flow: a project's design record, decisions and tasks, kept in step ([idea][bp-idea]) |
| softeng | how good software is designed, built, tested, reviewed, shipped and maintained |
| authoring | writing for people: user docs, business documents, articles, issues; editing |

[bp-idea]: docs/blueprint/idea/blueprint.md

Only each set's main skill sits in an agent's context; every other skill loads when a flow reaches it, so a set can grow without filling the context. Each set works alone, and uses another when it is installed.

## Installing

Coming with the first release: one install script, `install.sh`, copies the sets you choose into the skill folders of Claude Code and Codex; each set is installed on its own, and turned off by removing it.

## How it is organised

- `skills/<set>/`: one folder per set, once built.
- [docs/](docs/README.md): one page per skill, for people.
- [docs/blueprint/idea/](docs/blueprint/idea/blueprint.md): the first idea of the blueprint method, with [a worked example](docs/blueprint/idea/blueprint-example.md).

## Use at your own risk

skillbook's skills guide an AI agent that reads files, runs commands and changes things on your machine. skillbook does not control what the agent does. You are responsible for everything the agent does with these skills, and for any result. So:

- review what the agent proposes and does before you accept it;
- keep backups, and keep your work under version control;
- use your agent's own permission settings.

skillbook is provided "as is", without warranty of any kind. Its authors and contributors are not liable for any damage or loss, as sections 7 and 8 of the [licence](LICENSE) say.

## Help and contributing

Report a skill that misbehaved in a real session as an issue; see [SCOPE.md](SCOPE.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Security problems go through [SECURITY.md](SECURITY.md).

skillbook is maintained by Remzi Duzagac and licensed under the [Apache License 2.0](LICENSE).
