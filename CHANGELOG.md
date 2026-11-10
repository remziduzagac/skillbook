# Changelog

All notable changes to skillbook, newest first. The format follows Keep a Changelog, and versions follow semantic versioning, as [MAINTAINING.md](MAINTAINING.md) says. Each entry names its set.

## [Unreleased]

## [0.2.0] - 2026-11-10

### Changed

- essentials: the guide map now tells the agent when to read three guides it often skipped on small jobs. It reads `act-verify` whenever its result is built from files or figures you gave it, such as a notice made from an hours table. It reads `act-rightsize-enrich` before changing anything when you ask it to fill in what is missing from something that already exists, such as a bare README. It reads `understand-research-survey` whenever you ask which options exist and how they compare, even when every option is in your own files.
- essentials: a survey now ends with a Coverage line. It says where the agent looked, at least one kind of source it did not search, and how old its sources are, so a short list does not read as everything that exists.
- essentials: after sorting or dividing things into parts, the answer says what belongs in each part, as a rule that would place a new item. Folder names you gave are no longer a reason to leave this out.

### Known limits

- In tests, Claude Code with Sonnet now says it checked work made from your files in about half of runs, up from almost none. Most of those checks are its own reading, not a recount.
- A survey with the guide read costs about 30% more. In tests Sonnet gave the date of the notes it compared in about a third of runs.
- In tests, Codex with GPT-6.1 Sol still listed each folder by its files after a sort, without saying what belongs in it.

## [0.1.1] - 2026-11-09

### Added

- repository: a weekly health check that keeps one issue on what needs attention, the expected settings and rulesets in `.github/upkeep/`, and a spelling check.

### Changed

- docs: the README, the docs home page, the essentials page and the install page show the preview's install line in full, beside the release's.
- docs: the README's links to the documentation now open its pages on the documentation website, not the Markdown files on GitHub.

## [0.1.0] - 2026-11-09

### Added

- essentials: the first release of the base set. It guides how an agent does any piece of work: understand what you want, decide how to do it, act with care, check before claiming, and answer plainly. Five guides are read on every request, and a guide map leads to the other 51 when the work needs them.
- install: one line installs essentials for Claude Code and Codex, from `https://remziduzagac.github.io/skillbook/install-essentials.sh`. It checks every download against its checksum, never overwrites a folder it did not install, stops before replacing files you changed, and shows the installed version, the latest release and the newest preview with `--check`. `--preview` installs the newest preview instead of the latest release.
- docs: the documentation website, <https://remziduzagac.github.io/skillbook/docs/>, with installing, versions and a page for each set, built from `docs/`.
- repository: the design in `blueprint/`, the checks, the install tests, the AI test runner, previews published from the `test` branch, and the contributing, conduct, security and maintaining files.

### Known limits

- Essentials reads five guides, about 28,000 characters, on every request, so each request uses more tokens than it would without it.
- In tests, Claude Code with Sonnet often skipped checking work made from sources, such as totals, against those sources. Codex with GPT-6.1 Sol checked them.
- In tests, Codex with GPT-6.1 Sol rarely named the choices it made on its own in work with several parts. Sonnet named them.
- Setup, asking your agent to set up skillbook, has not yet been tested in a live session.
- The install script runs on Linux and macOS; on Windows, use WSL.
