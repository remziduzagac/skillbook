# Contributing to skillbook

Thank you for wanting to help. skillbook has one maintainer and a deliberately small set of skills. Anyone can report a skill that misbehaved; pull requests are not accepted for now.

Everyone in skillbook's spaces follows the [code of conduct](CODE_OF_CONDUCT.md).

## Reporting a problem

Open an issue with the bug form: <https://github.com/remziduzagac/skillbook/issues/new/choose>. A useful report describes a skill that misbehaved in a real session; [SCOPE.md](SCOPE.md) gives the bar. The form asks for:

- the skill and file, and the skillbook version;
- the agent and its version, and the model;
- what happened, what you expected, and how to make it happen.

## Questions and ideas

Ask in an issue. [The documentation](https://remziduzagac.github.io/skillbook/docs/) may have the answer already. New skills are not accepted: a behaviour that can be composed from existing skills does not get a new one.

## A vulnerability

Report it privately, as the [security policy](SECURITY.md) says. Never put its details in a public issue or pull request.

## Pull requests

Pull requests are not accepted for now, since one maintainer cannot review outside changes to skills as well as they deserve. A fix described in an issue is welcome.

## AI use

Agents are welcome as tools. A report comes from a person who saw the problem happen and can answer questions about it; issues filed by autonomous agents are closed.

## Working on skillbook

- **Branches:** work comes together on `dev`, moves to `test`, where previews are published, and then to `main`, which is what is released; [MAINTAINING.md](MAINTAINING.md) says how.
- **Checks:** `just check` runs markdown lint, the link check, ShellCheck, shfmt, actionlint, zizmor and the skill-file check. `just test-install` runs the install tests, and `cd site && bun install && bun run build` builds the docs site. The [justfile](justfile) lists the tools.
- **Commits:** lowercase Conventional Commits, and never credit an AI tool: no Co-authored-by or "Generated with" line naming one. `just hooks` turns on a check that refuses such a message, and CI checks every commit too.
- **The design** lives in [blueprint/](blueprint/README.md); changes to it follow the rules in its README. [AGENTS.md](AGENTS.md) holds the rules for agents working here.

## Licence

skillbook is licensed under the [Apache License 2.0](LICENSE). A contribution is made under the same licence.
