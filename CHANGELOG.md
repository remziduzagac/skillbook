# Changelog

All notable changes to skillbook, newest first. The format follows Keep a Changelog, and versions follow semantic versioning, as [MAINTAINING.md](MAINTAINING.md) says. Each entry names its set.

## [Unreleased]

### Added

- essentials: the first release of the base set. It guides how an agent does any piece of work: understand what you want, decide how to do it, act with care, check before claiming, and answer plainly. Five guides are read on every request, and a guide map leads to the other 51 when the work needs them.
- install: `install-essentials.sh` installs essentials for Claude Code and Codex with one line. It checks the download against its checksum, never overwrites a folder it did not install, stops before replacing files you changed, and shows the installed and latest versions with `--check`.
- repository: the design in `blueprint/`, the checks, the install tests and the AI test runner.

### Known limits

- Essentials reads five guides, about 28,000 characters, on every request, so each request uses more tokens than it would without it.
- In tests, Claude Code with Sonnet often skipped checking work made from sources, such as totals, against those sources. Codex with GPT-6.1 Sol checked them.
- In tests, Codex with GPT-6.1 Sol rarely named the choices it made on its own in work with several parts. Sonnet named them.
- Setup, asking your agent to set up skillbook, has not yet been tested in a live session.
- The install script runs on Linux and macOS; on Windows, use WSL.
