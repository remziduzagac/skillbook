# Changelog

All notable changes to skillbook, newest first. The format follows Keep a Changelog, and versions follow semantic versioning, as [MAINTAINING.md](MAINTAINING.md) says. Each entry names its set.

## [Unreleased]

## [0.3.0] - 2026-11-23

### Changed

- essentials: the main skill, which every request reads, is about a fifth shorter: about 28,800 characters instead of about 36,900, with every rule kept. Four points that the earlier cut had dropped are back: "the same step" means the same goal by the same means, for the rule to stop after about three failed attempts; the agent judges from what you have shown whether you know a word; it states your view at its strongest before it disagrees; and it reports a problem outside the task in one line, even a serious one.
- essentials: four guides are merged into their parents, so their names are gone: `understand-clarify-shallow` into `understand-clarify`, `understand-research-fact` into `understand-research`, and `act-rightsize-lean` and `act-rightsize-enrich` into `act-rightsize`. The research guide's five notes on kinds of sources are now one file. If your own instructions name one of the four guides, name its parent instead.
- essentials: the main skill and 31 of the 39 guides are worded firmer and plainer: most rules open with a short bold sentence that says what to do, then give the reason, with "always" and "never" where a rule has no exception. The other 8 guides keep their earlier wording, because the new wording did worse on tests.
- essentials: three guides are read more reliably. The plan guide is read before work with several parts, even when the work looks simple. The delegation guide is read when a part means reading more than about three files, one long file such as a long log, or long output. The frame guide is read when a request names no goal or nothing that would show a good result, such as making a club's meetings go better. In tests, each was read in runs where it had not been before.

### Fixed

- essentials: two guides pointed to the wrong step of the main skill: the explain guide's note on explaining a new topic, and the research source notes' rule on keeping code probes temporary. They now point to the steps that hold those rules.

### Known limits

- essentials: tested on small cases only, on Claude Code with Sonnet and Codex with GPT-6.1 Sol. Rewording whole guides in the firm style showed no overall gain, so a guide kept the new wording only where its answers held.
- essentials: after reading the delegation guide, agents still mostly do the work alone, and often give no reason, although the guide asks for one. On a single long file, Sonnet read the delegation guide in only 1 of 6 runs.

## [0.2.5] - 2026-11-17

### Security

- docs: the docs site is built with Astro 7.4.8, which closes two published Astro security advisories. The site was not exposed to either: it is static pages built from skillbook's own files.

## [0.2.4] - 2026-11-16

### Fixed

- essentials: in a long session, the agent again considers offering a note for the next session at a natural break, such as a finished phase. The lean main skill had dropped that route.
- essentials: for code with no matching skill in your agent's list, the agent follows your project's conventions, as before the lean main skill.
- essentials: when you ask which options exist and which to pick, the answer now ends on the recommendation, with the line on what was searched just before it. Before, it often ended on that line.

## [0.2.3] - 2026-11-11

### Fixed

- docs: the docs site's header shows skillbook's book logo beside the title, instead of the name alone.

## [0.2.2] - 2026-11-11

### Changed

- essentials: every request now reads one file of about 36,500 characters, instead of six files of about 70,000. The rules for understanding, deciding, acting and answering are in that file, and a guide is read only when an instruction in it calls for that guide. The guide map is gone, and there is no shortcut for short answers any more.
- essentials: the advice to hand work to other agents by default now lives in the `coordinate-delegate` guide, and the offer of a record when you stop lives in the `coordinate-carryover` guide. You can keep delegation as your own default in your instruction file. The guide no longer carries a price list: it takes prices from the provider's official pricing page and gives the date.

- essentials: an answer that changes nothing and makes no file, such as three questions about a lease, no longer starts a plan, however many points it covers.

### Known limits

- Tested on a few small cases only, on Claude Code with Sonnet and Codex with GPT-6.1 Sol. The answers matched the previous version's, with the same known failures: neither model hands a wide check to other agents. Sonnet's runs cost about 15 to 25% less.
- On a question that changes nothing, Codex with GPT-6.1 Sol may still read several guides it does not need, such as `coordinate-delegate`, so such answers can cost it more than before.

## [0.2.1] - 2026-11-10

### Changed

- install: the install ends with a line to paste into a new session of your agent, such as "Set up skillbook on this machine: essentials is installed in ~/.claude/skills for Claude Code and ~/.agents/skills for Codex." It names the folders the install filled, so the agent sets up the copy you have.
- docs: the README and the install page show how to install a set for one project with `--project`, next to the install lines. The install page says what changes with it: where the files go, later runs, setup, and a copy in your home beside the project's.

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
