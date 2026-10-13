# Contributing

skillbook has one maintainer and a deliberately small set of skills.

- **Report problems as issues.** A useful report describes a skill that misbehaved in a real session; see [SCOPE.md](SCOPE.md) for the bar. The bug form asks for the skill, the agent and its version, the model, and what happened.
- **Pull requests are not accepted for now.** A fix described in an issue is welcome.
- **New skills are not accepted.** A behaviour that can be composed from existing skills does not get a new one.

## AI use

Agents are welcome as tools. A report comes from a person who saw the problem happen and can answer questions about it; issues filed by autonomous agents are closed.

## Working on skillbook

- `just check` runs every check: markdown lint, link check, ShellCheck, shfmt, actionlint and zizmor. The [justfile](justfile) lists the tools.
- Commits follow lowercase Conventional Commits.
- The design lives in [blueprint/](blueprint/README.md); changes to it follow the rules in its README.
