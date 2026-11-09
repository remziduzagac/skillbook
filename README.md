<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/skillbook-logo-light.svg">
    <img alt="skillbook" src="assets/skillbook-logo-dark.svg" width="200">
  </picture>
</p>
<p align="center"><a href="https://github.com/remziduzagac/skillbook/actions/workflows/ci.yml"><img src="https://github.com/remziduzagac/skillbook/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI status"></a></p>

skillbook is a book of skills for AI agents such as Claude Code and Codex: instructions an agent loads to understand what you want, do the work with care and tell you plainly what it did. The skills come in sets you install separately: essentials, for how any work is done, and sets for keeping a project's design record, engineering software, writing for people, keeping the rhythm of your working days and keeping what you learn. Other agents that read skills can use them too.

<p align="center">
  <img alt="An orange robot at a workbench reads a black skillbook, with diagrams, gears and screens around it"
    src="assets/skillbook-robot.webp" width="600">
</p>

**Status:** essentials is released, at an early 0.x version, for use and feedback; the other sets are still being designed.

## The plan

| Sets | What they cover |
| --- | --- |
| [essentials][es-docs] | how the agent behaves, understands, arranges, coordinates, designs and plans, with care |
| [blueprint][bp-idea] | the spec-to-dev flow: a project's design record, decisions and tasks, kept in step |
| [softeng][se-idea] | how good software is designed, built, tested, reviewed, shipped and maintained |
| [authoring][au-idea] | writing for people: user docs, business documents, articles, issues; editing |
| [cadence][ca-idea] | the rhythm of your working days: meetings, tasks, reviews and wrapping up work |
| [compendium][co-idea] | what you learn: capturing notes and sources, distilling them, and finding them again |

[es-docs]: docs/essentials/README.md
[bp-idea]: docs/blueprint/idea.md
[se-idea]: docs/softeng/idea.md
[au-idea]: docs/authoring/idea.md
[ca-idea]: docs/cadence/idea.md
[co-idea]: docs/compendium/idea.md

Each set is installed as one skill in the agent’s skill list. Its files under `references/` are guides. Essentials reads five guides on every request, reads its other main guides when their stage has work, and uses a guide map to choose any further guides the work needs. Its guides shape how the agent works; other available skills and tools do the work itself. Essentials works on its own and names no other set.

## Installing

Each set installs on its own, with one line, on Linux and macOS; on Windows, use WSL. For essentials:

```sh
curl -fsSL https://github.com/remziduzagac/skillbook/releases/latest/download/install-essentials.sh | sh
```

The script copies the set into `~/.claude/skills/essentials` for Claude Code, when `~/.claude` exists, and into `~/.agents/skills/essentials` for Codex, when `~/.codex` exists. It needs no root, checks the download against its checksum, and never overwrites a folder it did not install. Options go after `sh -s --`, such as `sh -s -- --agents codex`, or `sh -s -- --project` to install into the current project instead of your home.

Then ask your agent to **set up skillbook**. With your approval, it adds the line that tells the agent to load essentials before any work, and what your agent needs to read the installed files. In Claude Code, that is the rule `Read(~/.claude/skills/**)` in `permissions.allow` of `~/.claude/settings.json`; without it, Claude Code asks before it reads each guide. You can add it yourself instead.

To read the script before you run it:

```sh
curl -fsSLO https://github.com/remziduzagac/skillbook/releases/latest/download/install-essentials.sh
less install-essentials.sh
sh install-essentials.sh
```

Each release carries a `SHA256SUMS` file, and its files are attested, so you can check them with `gh attestation verify install-essentials.sh --repo remziduzagac/skillbook`.

### Updating

Run the same line again: it installs the latest release. If you changed a guide by hand, it lists the changed files and stops; add `--force` to replace them. Start new agent sessions afterwards, since an open session keeps the text it has already read.

- **Your version and the latest:** add `--check`, as in `curl -fsSL …/install-essentials.sh | sh -s -- --check`. It changes nothing.
- **New releases:** watch the repository's releases on GitHub (Watch, then Custom, then Releases), or follow the [releases feed](https://github.com/remziduzagac/skillbook/releases.atom). The [changelog](CHANGELOG.md) says what changed.
- **A given version:** use its own address instead of `latest`, such as `releases/download/v0.1.0/install-essentials.sh`.

### Removing

Run the line with `sh -s -- --uninstall`. It removes only what it installed, and stops before removing files you changed unless you add `--force`. The pointer and settings that setup added stay; ask your agent to remove them.

## How it is organised

- `skills/<set>/`: one folder per set, once built.
- [docs/](docs/README.md): one page per skill, for people.
- [docs/essentials/](docs/essentials/README.md): what essentials is for, how it works, and a line on each of its guides.
- [docs/blueprint/idea.md](docs/blueprint/idea.md): the first idea of the blueprint method, with [a worked example](docs/blueprint/idea.md#a-worked-example-worktree-groups).
- `docs/<set>/idea.md`: the first idea of each other set, such as [softeng](docs/softeng/idea.md).

## Use at your own risk

skillbook's skills guide an AI agent that reads files, runs commands and changes things on your machine. skillbook does not control what the agent does. You are responsible for everything the agent does with these skills, and for any result. So:

- review what the agent proposes and does before you accept it;
- keep backups, and keep your work under version control;
- use your agent's own permission settings.

skillbook is provided "as is", without warranty of any kind. Its authors and contributors are not liable for any damage or loss, as sections 7 and 8 of the [licence](LICENSE) say.

## Help and contributing

Report a skill that misbehaved in a real session as an issue; see [SCOPE.md](SCOPE.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Security problems go through [SECURITY.md](SECURITY.md).

skillbook is maintained by Remzi Duzagac and licensed under the [Apache License 2.0](LICENSE).
