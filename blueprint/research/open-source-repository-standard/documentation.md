# Documentation: how a healthy open-source repository documents itself (October 2026)

Research notes for greenrepo. Checked on 2026-10-10. Versions come from each project's latest GitHub release (read with `gh api repos/<repo>/releases/latest`) or npm on that date. "Local" sources are files in `herdsman`: branch `dev` (herdsman) and branch `herdr-import` (herdr's tree as imported). The levels used below are greenrepo's: **L1** every repository, **L2** public project, **L3** project with users.

## README practice: structure, first minute, badges, screenshots, install and quick start

### Takeaway

GitHub's own guidance sets five things a README must answer: what, why, how to start, where to get help, who maintains it. The best READMEs (ripgrep, uv) answer them in the first screen, then send readers to a docs site for everything else. Keep the badges few and functional (CI, released version, packaging), show one honest picture of the tool, and give copy-paste install lines plus one usage example.

### Cited Findings

- GitHub says a README "typically" covers: "What the project does", "Why the project is useful", "How users can get started with the project", "Where users can get help with your project", "Who maintains and contributes to the project" — [GitHub Docs: About READMEs][gh-readme]
- GitHub picks the README from `.github/`, then the repository root, then `docs/`; content beyond 500 KiB is truncated; GitHub renders an "auto-generated table of contents based on section headings"; relative links are rewritten per branch, so "relative links are easier for users who clone your repository" — [GitHub Docs: About READMEs][gh-readme]
- The standard-readme spec makes Title required and Badges optional ("Must not have its own title", newline delimited). Install and Usage are "Required by default", each with a code block; Usage needs a CLI example "if CLI compatible". It requires a Table of Contents except for READMEs "shorter than 100 lines" — [standard-readme spec][std-readme]
- ripgrep's README order: three badges (CI build status, crates.io version, Repology packaging status), a CHANGELOG link, "Documentation quick links", a screenshot of search results, quick examples comparing tools, "Why should I use ripgrep?", "Why shouldn't I use ripgrep?", benchmarks, feature comparison, playground, installation (long per-platform list), building, running tests, related tools, vulnerability reporting, translations — [ripgrep README][rg-readme] (headings read with `gh api`)
- uv's README order: badges (PyPI version, supported Python versions, Discord), a benchmark bar chart image with alt text, Highlights, Installation (one line per method: shell script, PowerShell, pip, pipx), Documentation, Features with short examples per area, Contributing, FAQ, Acknowledgements, License — [uv README][uv-readme]
- herdsman's README (61 lines): logo, one CI badge, a three-sentence pitch, a paragraph on its relation to herdr and non-affiliation, Status (with the preview channel), Install (three one-line commands, the rest delegated to the install guide), how it differs from upstream, Building, Documentation links (site, `herdsman --help`, `herdsman --skill`, MAINTAINING, CONTRIBUTING), Licence — [herdsman README][hm-readme]
- herdr's policy keeps a staged root README: "`docs/next/README.md` stages root README changes", and normal feature work "should not edit root `README.md`" — local: `git show herdr-import:AGENTS.md`, Docs section
- VHS (charmbracelet, v0.12.1, 2026-09-24), "Your CLI home video recorder", records terminal GIFs from a script, so a demo can be regenerated when the UI changes — [VHS repository][vhs]

### Inferences

- L1: a README that says what the repository is, its status, and how to build or use it. No badges needed.
- L2: add install and quick start as copy-paste code blocks near the top, a link to the licence, CONTRIBUTING and SECURITY, and one CI status badge. Use relative links for files inside the repository.
- L3: add a release/version badge and, for packaged tools, a packaging badge (Repology for CLIs). Add one screenshot or recorded demo with alt text, and keep the README as a front door that links to the docs site instead of duplicating it (herdsman delegates all but three install lines to the install guide).
- A manual table of contents is low value on GitHub because GitHub renders an outline; standard-readme's ToC rule predates that. Skip the ToC under ~100 lines either way.
- For terminal tools, a scripted recording (VHS tape) beats a hand-made GIF because it can be rebuilt in CI or on release; an audit can check that README images have alt text.
- A "why not use this" section (ripgrep) is a strong trust signal for tools with alternatives.

### Gaps

- No primary source quantifies which badges users actually value; the badge advice is inferred from what mature projects show.
- Did not verify current GitHub rendering of `<picture>` light/dark images in READMEs.

[gh-readme]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
[std-readme]: https://github.com/RichardLitt/standard-readme/blob/main/spec.md
[rg-readme]: https://github.com/BurntSushi/ripgrep/blob/master/README.md
[uv-readme]: https://github.com/astral-sh/uv/blob/main/README.md
[hm-readme]: https://github.com/remziduzagac/herdsman/blob/dev/README.md
[vhs]: https://github.com/charmbracelet/vhs

## User documentation structure: Diátaxis and how projects apply it

### Takeaway

Diátaxis sorts user docs by need into tutorials, how-to guides, reference and explanation. Its author warns against creating four empty sections: improve one page at a time and let the structure appear. Mature tool docs (uv, herdsman) follow it loosely with "getting started / guides / concepts / reference" sections.

### Cited Findings

- Definitions: "A tutorial is a lesson, that takes a student by the hand through a learning experience." "A how-to guide addresses a real-world goal or problem, by providing practical directions." "Reference guides contain the technical description - facts - that a user needs in order to do things correctly." "Explanatory guides provide context and background." — [Diátaxis: Start here][dx-start]
- The compass: action vs cognition crossed with acquisition (study) vs application (work): action+acquisition = tutorial, action+application = how-to, cognition+application = reference, cognition+acquisition = explanation — [Diátaxis: Start here][dx-start]
- "It certainly does not mean that you should create empty structures for tutorials/howto guides/reference/ explanation with nothing in them. Don't do that. It's horrible." The workflow is choose something, assess it, decide the single next improvement, do it; "Good structure develops from within"; "Documentation is also never finished" — [Diátaxis: How to use Diátaxis][dx-use]
- Named adopters include Vonage, Gatsby and Cloudflare, and the site says it has been "adopted successfully in hundreds of documentation projects" — [Diátaxis home][dx-home]
- uv's `docs/` folders: `getting-started`, `guides`, `concepts`, `reference`, plus `pip` (a compatibility area) — [uv docs tree][uv-docs]
- herdsman's 23 pages mix the types: `quick-start`, `install` (tutorial/how-to), `how-to-work`, `troubleshooting`, `connecting-machines` (how-to), `concepts`, `about` (explanation), `cli-reference`, `config-reference`, `socket-api`, `keyboard` (reference) — local: `docs/next/website/src/content/docs/`

### Inferences

- L1: no user docs beyond the README.
- L2: README quick start plus, when it outgrows the README, a reference page for the public surface (CLI, config, API).
- L3: a docs site whose sidebar groups pages by Diátaxis type (Start here / Guides / Concepts / Reference). The audit should check that each page has one type, not that all four sections exist. That follows the "no empty structures" rule.
- For a solo maintainer the highest-value page types are reference (can be generated, see below) and how-to guides for the top support questions; full tutorials are the most expensive to keep current.

### Gaps

- Did not find a published survey of how many open-source projects use Diátaxis; adoption evidence is the framework's own list.

[dx-start]: https://diataxis.fr/start-here/
[dx-use]: https://diataxis.fr/how-to-use-diataxis/
[dx-home]: https://diataxis.fr/
[uv-docs]: https://github.com/astral-sh/uv/tree/main/docs

## Documentation site generators in 2026: strengths and how to choose

### Takeaway

The field changed in the last year. Material for MkDocs is in maintenance mode, and its team now builds Zensical (still 0.0.x). MkDocs 1.x has had no release since August 2024. Starlight (Astro) and VitePress cover the JavaScript side, Docusaurus is the choice when you need built-in versioning and i18n, mdBook suits Rust projects, and Sphinx suits Python API docs. Pick by the stack contributors already run and by whether you need versioning.

### Cited Findings

- Latest releases on 2026-10-10: Starlight `@astrojs/starlight@0.42.6` (2026-10-08); Docusaurus v3.10.2 (2026-07-10); VitePress `latest` 1.6.4, `next` 2.0.0-alpha.20 (2026-09-04); mdBook v0.5.4 (2026-07-06); Sphinx v9.1.0 (2025-12-31); Zensical v0.0.69 (2026-10-08); Material for MkDocs 9.7.7 (2026-07-17); MkDocs 1.6.1 (2024-08-30); mike v2.2.0 (2026-04-14) — GitHub releases of [starlight][rel-starlight], [docusaurus][rel-docusaurus], [vitepress][rel-vitepress], [mdBook][rel-mdbook], [sphinx][rel-sphinx], [zensical][rel-zensical], [mkdocs-material][rel-material], [mkdocs][rel-mkdocs], [mike][rel-mike]; VitePress tags from `npm view vitepress`
- Material for MkDocs: on 2025-11-11 version 9.7.0 made all Insiders features free and the project entered maintenance mode; "no new features will be added". The team commits "to supporting Material for MkDocs for at least the next 12 months, fixing critical bugs and security vulnerabilities as needed", and recommends Zensical — [Material blog: Insiders now free][mat-insiders]; [Material blog index][mat-blog]
- Material's 2026-02-18 post on MkDocs 2.0 says "MkDocs 1.x is unmaintained, with issues and PRs piling up" and positions Zensical as compatible with MkDocs 1.x projects — [Material blog index][mat-blog]
- Zensical was announced 2025-11-05 by the Material for MkDocs team, MIT licensed, and reads `mkdocs.yml` — [Material blog index][mat-blog]; third-party migration issues cite a Material end-of-life of 2026-11-05 ([example issue][zen-eol-issue], secondary source)
- Zensical versioning is via a fork of mike: "This integration is transitional. We will maintain the fork until Zensical provides native versioning support", with no date given — [Zensical: mike][zen-mike]
- uv still builds its docs with MkDocs and `theme: name: material` as of 2026-10-10 — [uv mkdocs.yml][uv-mkdocs]
- Starlight features: built-in site navigation, search, i18n (17+ UI languages), SEO, code highlighting, dark mode, "Built-in frontmatter validation with TypeScript type-safety", Markdown, Markdoc and MDX, framework-agnostic components — [Starlight home][starlight]
- Starlight has no built-in versioning; the community plugin starlight-versions (0.10.1, 2026-08-26) archives the current docs as a version and describes itself as "an opinionated plugin that is still in early development" — [starlight-versions: getting started][sl-versions]; [release][rel-sl-versions]
- Docusaurus has built-in versioning (`docs/` is the current version, `versioned_docs/version-X/` holds frozen copies) — [Docusaurus: Versioning][docu-versioning]
- herdsman's site is Starlight 0.42.5 on Astro 7.3.5 with sharp, exact versions pinned in `package.json`, and a build script that runs `astro build`, a link rebase and a link check — local: `docs/next/website/package.json`

### Inferences

- Choosing by stack (L3, when a site is needed):
  - JavaScript/TypeScript or language-neutral CLI: Starlight (fast, i18n, MDX; versioning only via a young plugin) or VitePress (1.x stable, 2.0 in alpha).
  - Needs built-in multi-version docs or a large i18n effort: Docusaurus.
  - Python: Zensical for new projects if a 0.0.x tool is acceptable, otherwise Material for MkDocs with a migration plan (maintenance ends around November 2026); Sphinx when API docs come from docstrings.
  - Rust: mdBook for book-style guides (used across the Rust ecosystem), or Starlight when a richer site is wanted (herdsman's choice).
- Size: a README plus a few Markdown files in `docs/` rendered by GitHub is enough until there are roughly ten pages or a need for search; then a generator earns its build step. (Judgement, no source.)
- Whatever the generator, pin exact versions and build the site in CI on every pull request that touches docs.
- Starlight and Zensical are both pre-1.0; the greenrepo profile should record the version it was written against.

### Gaps

- Did not verify strengths of mdBook and Sphinx from their own docs this session; the stack mapping for them is general knowledge.
- Could not confirm the exact Material for MkDocs end-of-life date from a primary source; "at least 12 months" from 2025-11-11 is primary, 2026-11-05 is from third-party issues.
- MkDocs 2.0's status (pre-release only, per Material's February 2026 post) was not verified on the MkDocs repo.

[rel-starlight]: https://github.com/withastro/starlight/releases
[rel-docusaurus]: https://github.com/facebook/docusaurus/releases
[rel-vitepress]: https://github.com/vuejs/vitepress/releases
[rel-mdbook]: https://github.com/rust-lang/mdBook/releases
[rel-sphinx]: https://github.com/sphinx-doc/sphinx/releases
[rel-zensical]: https://github.com/zensical/zensical/releases
[rel-material]: https://github.com/squidfunk/mkdocs-material/releases
[rel-mkdocs]: https://github.com/mkdocs/mkdocs/releases
[rel-mike]: https://github.com/jimporter/mike/releases
[mat-insiders]: https://squidfunk.github.io/mkdocs-material/blog/2025/11/11/insiders-now-free-for-everyone/
[mat-blog]: https://squidfunk.github.io/mkdocs-material/blog/
[zen-eol-issue]: https://github.com/steilerDev/icloud-photos-sync/issues/1118
[zen-mike]: https://zensical.org/docs/compatibility/mkdocs/mike/
[uv-mkdocs]: https://github.com/astral-sh/uv/blob/main/mkdocs.yml
[starlight]: https://starlight.astro.build/
[sl-versions]: https://starlight-versions.vercel.app/getting-started/
[rel-sl-versions]: https://github.com/HiDeoo/starlight-versions/releases
[docu-versioning]: https://docusaurus.io/docs/versioning

## Versioned docs: per-version folders, mike, Docusaurus versioning, and when it is worth it

### Takeaway

Most projects should not version their docs. Docusaurus's own docs say versioning mostly adds build time and complexity. Version only when users run several releases at once, or when a preview channel ships behavior that stable users lack. herdr's three-tree model (`docs/next`, `docs/preview`, `docs/versions/<v>`) is the full form, with CI doing all the copying.

### Cited Findings

- "Most of the time, you don't need versioning as it will just increase your build time, and introduce complexity to your codebase." It is recommended for "high-traffic and rapid changes to documentation between versions"; keep fewer than 10 versions, since otherwise "you will very likely have obsolete versioned documentation that nobody reads anymore"; use `onlyIncludeVersions` to build only 2 or 3 versions in dev and previews; the current docs are served under `/docs/next/` — [Docusaurus: Versioning][docu-versioning2]
- mike deploys each MkDocs version as a built site to a Git branch (`gh-pages`), "built around the idea that once you've generated your docs for a particular version, you should never need to touch that version again", optimised for `<major>.<minor>` folders with aliases such as `latest` or `dev` — [mike README][mike]
- herdr's model: unreleased drafts in `docs/next/website/src/content/docs/` ("committed drafts but are never production website input"); the active preview snapshot in `docs/preview/website/`, owned by preview CI, "committed atomically with `distribution/preview.json`; never edit it manually", validated with `node scripts/docs/preview.mjs check`; published versions in `docs/versions/`, seeded by release CI "from the tagged `docs/next` tree", where maintainers may later correct a version "without another Herdsman release" but "never replace a published tree with the current draft"; `/docs/` serves the version selected in `docs/versions/manifest.json`; `just release-docs-check` runs in release review — local: `git show herdr-import:AGENTS.md`, Docs section (around lines 215-230)
- The `herdr-import` branch holds only `docs/next/` (`api/`, `website/`); the preview and versions trees are not in the imported tree, and herdr keeps its website in a separate private repository — local: `git show herdr-import:docs/`; [herdsman MAINTAINING.md][hm-maintaining] ("The documentation site")
- herdsman dropped the per-version trees: one Starlight site built from `docs/next/website` and published on every deploy, triggered by a push to `main` that changes `docs/next/` — [herdsman MAINTAINING.md][hm-maintaining]
- Starlight versioning needs the starlight-versions plugin, which is "still in early development" — [starlight-versions][sl-versions2]

### Inferences

- L1 and L2: no versioned docs. Document the current release; mark unreleased features with "since vX.Y" notes.
- L3: version docs only when (a) users stay on old majors for long periods, or (b) a preview or beta channel exists and the public docs would otherwise describe unreleased behavior. herdsman builds the site from `main`, which only receives releases, so the site always matches stable and needs no version folders.
- When versioning, copy the docs tree in CI at the release tag rather than by hand, and allow fixes to published versions; herdr's rules are a good template.
- Keep the version count small and fall back to "older versions: see the tag on GitHub" links, as Docusaurus suggests.

### Gaps

- herdr's `scripts/docs/preview.mjs` and the release CI that seeds `docs/versions/` are not in the imported tree, so their implementation could not be studied.

[docu-versioning2]: https://docusaurus.io/docs/versioning
[mike]: https://github.com/jimporter/mike
[hm-maintaining]: https://github.com/remziduzagac/herdsman/blob/dev/MAINTAINING.md
[sl-versions2]: https://starlight-versions.vercel.app/getting-started/

## Generated reference pages: CLI help, configuration schemas, API schemas

### Takeaway

Generate reference material from the code when you can, commit the output, and add a CI check that fails when the committed copy is stale and prints the command that regenerates it. uv, ruff, the GitHub CLI and herdsman all do this in some form. Where a page must stay hand-written, a check can still compare its keys against the code.

### Cited Findings

- uv's CI job "check-generated-files" runs `cargo dev generate-all --mode dry-run` and `cargo dev generate-json-schema --mode check`, plus other `--mode check` generators; contributors run `cargo dev generate-all` "to update any auto-generated documentation" — [uv workflow][uv-genfiles]; [uv CONTRIBUTING][uv-contrib]
- uv and ruff commit their configuration JSON Schemas at the repository root (`uv.schema.json`, `ruff.schema.json`, `ty.schema.json`) — root listings of [uv][uv-repo] and [ruff][ruff-repo]
- The GitHub CLI's `cmd/gen-docs` builds both man pages (`--man-page`) and website Markdown (`--website`) from the cobra command tree — [cli/cli gen-docs][gh-gendocs]
- herdsman's test `generated_protocol_schema_artifact_is_current` compares `docs/next/api/herdsman-api.schema.json` with the schema built from code. On mismatch it fails with "generated API schema artifact is stale; run `HERDSMAN_UPDATE_API_SCHEMA=1 just test-one generated_protocol_schema_artifact_is_current`" — local: `src/api/schema/tests.rs`
- herdsman's `scripts/config_reference_check.py` walks the serde structs in `src/config/*.rs` and checks `docs/next/website/src/data/config-reference.json` for "missing, stale, duplicated, or value-drifted entries", with open-ended subtrees listed explicitly as skipped — local: `scripts/config_reference_check.py`
- herdsman's `cli-reference.mdx` is hand-written; no generator references it. MAINTAINING lists it with `configuration.mdx` and `socket-api.mdx` as docs touched by herdsman's own features — local: `grep` over the repository; [herdsman MAINTAINING.md][hm-maintaining2]
- herdsman embeds its agent skill in the binary (`include_str!("../skills/herdsman/SKILL.md")`) and prints it with `--skill`, so the shipped skill always matches the binary — local: `src/main.rs`, `src/cli/spec.rs`

### Inferences

- L2: if the project publishes a config file format or API, commit a machine-readable schema generated from code and check it in CI (the "snapshot test with an update env var" pattern is cheap in any language).
- L3: generate the CLI reference from the argument parser (clap, cobra, argparse/click and similar all have Markdown or man generators), or at least test that every subcommand and flag in `--help` appears on the reference page. A hand-written CLI page (herdsman) is the most likely page to drift.
- The check should print the exact regeneration command, as herdsman's and uv's do; agents and contributors can then fix it without reading the test.
- Publish schemas at a stable URL and reference them from config files (`$schema`) so editors validate configs.

### Gaps

- Did not survey generators per stack (clap_mangen, clap-markdown, sphinx-argparse, typedoc); naming them is general knowledge, not checked this session.

[uv-genfiles]: https://github.com/astral-sh/uv/blob/main/.github/workflows/check-generated-files.yml
[uv-contrib]: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md
[uv-repo]: https://github.com/astral-sh/uv
[ruff-repo]: https://github.com/astral-sh/ruff
[gh-gendocs]: https://github.com/cli/cli/blob/trunk/cmd/gen-docs/main.go
[hm-maintaining2]: https://github.com/remziduzagac/herdsman/blob/dev/MAINTAINING.md

## Docs quality checks: link checking, markdownlint, prose linting, building docs in CI

### Takeaway

The cheap, high-value checks are: build the docs site in CI with internal links failing the build, lint Markdown with markdownlint-cli2, and check external links with lychee on a schedule (external links break without any change in the repository). Vale is worth it once there are several writers or a house style to enforce.

### Cited Findings

- lychee v0.24.2 (2026-05-01) checks Markdown and HTML, ships as "a single static binary", and offers JSON output for CI — [lychee site][lychee]; [lychee releases][rel-lychee]
- lychee options: `--offline` (local links only), `--include-fragments` (anchor and text fragments), `--cache` to `.lycheecache` with `--max-cache-age` and `--cache-exclude-status`, a `lychee.toml` config, a `.lycheeignore` file, and `--github-token` / `GITHUB_TOKEN` "to avoid rate limiting" on github.com links — [lychee README][lychee-readme]
- markdownlint-cli2 is at 0.23.3 (npm, modified 2026-09-20); biome and ruff commit markdownlint configs (`.markdownlint.json`, `.markdownlint.yaml`) — `npm view markdownlint-cli2`; root listings of [biome][biome-repo] and [ruff][ruff-repo2]
- Vale v3.24.0 (2026-10-01): "Vale is a command-line tool that brings code-like linting to prose"; it "focuses on the style of writing rather than its grammatical correctness" and "doesn't offer any of its own advice. Instead, it offers a framework for creating and enforcing custom rules" — [Vale docs][vale]; [Vale releases][rel-vale]
- uv formats docs with Prettier and spell-checks with `typos` (`_typos.toml` in uv and ruff) — [uv CONTRIBUTING][uv-contrib2]
- herdsman's docs build fails on broken internal links: `scripts/check-links.mjs` "fails the build on a missing page, heading or a path outside the site"; the Starlight build is `astro build && node scripts/rebase-links.mjs && node scripts/check-links.mjs` — [herdsman MAINTAINING.md][hm-maintaining3]; local: `docs/next/website/package.json`
- herdsman's `justfile` prints "docs reminder: if this changes user-facing behavior, update the docs in docs/next." — local: `justfile` line 65

### Inferences

- L1: markdownlint (or the stack's formatter) on Markdown files, run in pre-commit and CI.
- L2: lychee `--offline` (or the generator's own link check) on every pull request; full external lychee on a weekly schedule with cache and `GITHUB_TOKEN`, opening an issue instead of failing unrelated pull requests; a spell checker (`typos`) with a project word list.
- L3: build the docs site in CI on pull requests that touch docs, failing on broken internal links and anchors; Vale only with a small custom style (product names, banned words), not a full Google/Microsoft style, for a solo maintainer.
- Agents follow a lint config better than prose guidance; herdsman's `markdown-style` skill shows the pattern of teaching the enforced rules up front.

### Gaps

- Did not fetch Vale's package list (Google, Microsoft, write-good) or vale-action details; the docs page fetched covered concepts only.
- Did not check the lychee-action README for its recommended scheduling.

[lychee]: https://lychee.cli.rs/
[rel-lychee]: https://github.com/lycheeverse/lychee/releases
[lychee-readme]: https://github.com/lycheeverse/lychee/blob/master/README.md
[biome-repo]: https://github.com/biomejs/biome
[ruff-repo2]: https://github.com/astral-sh/ruff
[vale]: https://docs.vale.sh/
[rel-vale]: https://github.com/errata-ai/vale/releases
[uv-contrib2]: https://github.com/astral-sh/uv/blob/main/CONTRIBUTING.md
[hm-maintaining3]: https://github.com/remziduzagac/herdsman/blob/dev/MAINTAINING.md

## Changelogs, release notes, migration guides, deprecation notices, translations

### Takeaway

Write the changelog for users and by hand, grouped by type, with an entry for every version. Use commit lists and generated notes only as raw material. Announce deprecations in a minor release before removing anything, and put breaking changes with their migration steps somewhere easy to find. Translations are expensive for a solo maintainer; link community translations and mark them unofficial.

### Cited Findings

- Keep a Changelog 1.1.0: "Changelogs are _for humans_, not machines"; an entry for every version; group the same types of changes; linkable versions; latest first; release dates in ISO 8601; state whether the project follows SemVer. Types: Added, Changed, Deprecated, Removed, Fixed, Security. An `Unreleased` section at the top. Bad practice: commit log diffs ("document the noteworthy difference, often across multiple commits") and ignoring deprecations ("it should be painfully clear when something will break"). Mark pulled releases `[YANKED]` — [Keep a Changelog 1.1.0][kac]
- SemVer: projects "MUST declare a public API", in code or "strictly in documentation". On deprecation: "update your documentation to let users know about the change" and "issue a new minor release with the deprecation in place"; "there should be at least one minor release that contains the deprecation" before removal in a major — [Semantic Versioning 2.0.0][semver]
- GitHub generated release notes contain "a list of merged pull requests, a list of contributors to the release, and a link to a full changelog"; `.github/release.yml` groups pull requests by label into categories and excludes labels or authors — [GitHub Docs: Automatically generated release notes][gh-relnotes]
- herdr's policy: normal feature and fix work "must not edit `docs/next/CHANGELOG.md`" so long-lived branches do not conflict; subjects stay descriptive with `refs #<issue>` lines; at release, maintainers "human-write and curate the user-facing entries"; "generated commit lists are source material, not final release prose"; no entries for docs-only, CI, build or maintenance changes — local: `git show herdr-import:AGENTS.md`, Docs section
- uv keeps `CHANGELOG.md` for the current series and moves older series to `changelogs/0.1.x.md` … `changelogs/0.12.x.md`; ruff keeps a separate `BREAKING_CHANGES.md` listing each version's breaking changes with links to the settings involved — [uv changelogs][uv-changelogs]; [ruff BREAKING_CHANGES.md][ruff-breaking]
- biome uses changesets (`.changeset/`), keeps the v1 changelog in `CHANGELOG_v1.md`, and documents its release process in `RELEASES.md` — [biome repository][biome-repo2]
- Tooling versions on 2026-10-10: git-cliff v2.14.2 (2026-09-18), release-please v17.11.2 (2026-08-24), changesets `@changesets/cli@3.0.3` (2026-09-14) — [git-cliff][rel-cliff], [release-please][rel-rp], [changesets][rel-changesets]
- ripgrep lists translations of its docs as "unofficially maintained and may not be up to date" and links out to them — [ripgrep README][rg-readme2]
- Starlight has built-in i18n for site UI in many languages — [Starlight home][starlight2]

### Inferences

- L1: none needed, or a GitHub release per tag.
- L2: `CHANGELOG.md` in Keep a Changelog form with an `Unreleased` section; GitHub releases link to the matching section. Configure `.github/release.yml` so generated notes are at least grouped.
- L3: user-facing entries written by hand at release time (herdr's "curate at release" rule avoids merge conflicts for solo and multi-branch work); a "Breaking changes / Upgrading" section or file with migration steps; deprecations announced in the docs and changelog at least one minor release before removal; runtime deprecation warnings for removed config keys or flags.
- Translations: not a greenrepo requirement at any level; if offered, follow ripgrep and mark them unofficial.
- Split the changelog by series once it grows long (uv), so the main file stays readable.

### Gaps

- Did not fetch Common Changelog or Docusaurus i18n docs; no primary source compared hand-written and generated changelogs empirically.

[kac]: https://keepachangelog.com/en/1.1.0/
[semver]: https://semver.org/
[gh-relnotes]: https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes
[uv-changelogs]: https://github.com/astral-sh/uv/tree/main/changelogs
[ruff-breaking]: https://github.com/astral-sh/ruff/blob/main/BREAKING_CHANGES.md
[biome-repo2]: https://github.com/biomejs/biome
[rel-cliff]: https://github.com/orhun/git-cliff/releases
[rel-rp]: https://github.com/googleapis/release-please/releases
[rel-changesets]: https://github.com/changesets/changesets/releases
[rg-readme2]: https://github.com/BurntSushi/ripgrep/blob/master/README.md
[starlight2]: https://starlight.astro.build/

## Contributor and maintainer docs: CONTRIBUTING, DEVELOPMENT, ARCHITECTURE.md, MAINTAINING

### Takeaway

Split by reader. CONTRIBUTING tells outsiders how to take part and what will be accepted. A development guide (often inside CONTRIBUTING) covers build and test. ARCHITECTURE.md is a short, stable codemap. MAINTAINING (or RELEASES / a release checklist) holds the maintainer-only procedures. GitHub recognises CONTRIBUTING, SECURITY, SUPPORT and the other community health files in `.github/`, the root or `docs/`.

### Cited Findings

- GitHub community health files: `ACCESSIBILITY.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, discussion category forms, `FUNDING.yml`, issue and pull request templates with `config.yml`, `SECURITY.md`, `VULNERABILITY_REPORT.yml`, `SUPPORT.md`; precedence `.github/`, then root, then `docs/`; a public `.github` repository supplies defaults for every repository of the account that lacks its own — [GitHub Docs: default community health file][gh-health]
- matklad's ARCHITECTURE.md essay: aimed at projects of 10k-200k lines, because newcomers spend far longer finding *where* to change code than *how*; the core is a codemap ("a map of a country, not an atlas of maps of its states"); name important files, modules and types but do not link them (use symbol search); state invariants, especially ones expressed as absences; mark layer boundaries; add a cross-cutting concerns section; "only specify things that are unlikely to frequently change" and revisit "a couple of times a year"; "the shorter it is, the less likely it will be invalidated" — [matklad: ARCHITECTURE.md][matklad]
- herdsman's CONTRIBUTING: opens with "herdsman has a single maintainer, so this page is about making your effort count"; issues (what a bug report needs, security goes private), pull requests (target `dev`, small fixes directly, features need an issue first and "may be declined"), building and testing commands, commit style, "Agents working on the code read AGENTS.md", conduct — [herdsman CONTRIBUTING.md][hm-contrib]
- herdsman's MAINTAINING (435 lines): branches and folders, versions, licence, taking an upstream release (six steps), what the rename does, herdsman's edits to upstream files, releasing, Linux packages, Homebrew, previews, the documentation site, repository settings — [herdsman MAINTAINING.md][hm-maintaining4]
- Mature project layouts: the GitHub CLI keeps contributor and maintainer docs in `docs/` (`command-development.md`, `project-layout.md`, `testing.md`, `releasing.md`, `release-process-deep-dive.md`, `triage.md`, `working-with-us.md`) — [cli/cli docs][gh-docs]; ripgrep has `GUIDE.md`, `FAQ.md`, `RELEASE-CHECKLIST.md`, `AI_POLICY.md` — [ripgrep][rg-repo]; biome has `GOVERNANCE.md` and `RELEASES.md` — [biome][biome-repo3]; uv has `STYLE.md` and `BENCHMARKS.md` — [uv][uv-repo2]
- ripgrep's `AI_POLICY.md` (adapted from Astral's): AI tools welcome, but "AI should not be used to generate comments when communicating with maintainers", contributors must explain changes "in your own words", and "Autonomous agents are not allowed to be used for contributing to this project" — [ripgrep AI_POLICY.md][rg-ai]

### Inferences

- L1: `README` build/test lines are enough; private repos need no CONTRIBUTING.
- L2: `CONTRIBUTING.md` (how to report, what PRs are welcome, build/test, commit style), `SECURITY.md`, `CODE_OF_CONDUCT.md`, licence; for a solo maintainer, say so up front and require an issue before features, as herdsman does. Consider an `AI_POLICY.md` (or a CONTRIBUTING section) stating what AI-assisted contributions must meet.
- L3: `ARCHITECTURE.md` once the code passes roughly 10k lines (matklad's threshold); `MAINTAINING.md` or `RELEASING.md` for release, triage and repository-settings procedures, so they survive the maintainer's absence and agents can follow them; `SUPPORT.md` pointing users to discussions or issues.
- Placement: keep only README, LICENSE, CHANGELOG and the files GitHub surfaces at the root or in `.github/`; put long contributor guides in `docs/` (cli/cli) or keep them at the root (uv, ripgrep). Both work; pick one per repo.
- The private blueprint holds design rationale; ARCHITECTURE.md should hold only the stable map and invariants a contributor needs, not the design history.

### Gaps

- Found no primary standard for a `MAINTAINING.md` file; the content model is drawn from examples.
- Did not check whether GitHub surfaces `GOVERNANCE.md` in its community profile.

[gh-health]: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file
[matklad]: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
[hm-contrib]: https://github.com/remziduzagac/herdsman/blob/dev/CONTRIBUTING.md
[hm-maintaining4]: https://github.com/remziduzagac/herdsman/blob/dev/MAINTAINING.md
[gh-docs]: https://github.com/cli/cli/tree/trunk/docs
[rg-repo]: https://github.com/BurntSushi/ripgrep
[biome-repo3]: https://github.com/biomejs/biome
[uv-repo2]: https://github.com/astral-sh/uv
[rg-ai]: https://github.com/BurntSushi/ripgrep/blob/master/AI_POLICY.md

## Docs for agents: AGENTS.md, CLAUDE.md, llms.txt, shipped agent skills

### Takeaway

Agent docs now serve three readers. Contributors' agents read `AGENTS.md`, the shared standard (Claude Code reads it natively from v2.1.277 when no CLAUDE.md exists). Agents that use the product read a shipped skill (`SKILL.md`, Agent Skills format) or `llms.txt` on the docs site. Agents helping a human set up the tool read a hosted guide. Mature projects (uv, ruff, biome, cli/cli) keep AGENTS.md short and rule-shaped, push detail into skills, and cli/cli ships a skill for using `gh`.

### Cited Findings

- AGENTS.md is "a **README for agents**: a dedicated, predictable place to provide the context and instructions to help AI coding agents work on your project"; used by over 60,000 open-source projects; "now stewarded by the Agentic AI Foundation under the Linux Foundation"; read by Codex, Jules, Copilot, VS Code, Cursor, Zed, Gemini CLI, Junie, Devin/Windsurf, Aider and others; no required fields; in monorepos "the closest AGENTS.md to the edited file wins; explicit user chat prompts override everything"; keep READMEs "concise and focused on human contributors"; to migrate, rename and "create symbolic links for backward compatibility" — [agents.md][agentsmd]
- Claude Code: reads `AGENTS.md` directly from v2.1.277, by default only when there is no `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` in the working directory or above (so adding a personal `CLAUDE.local.md` silently stops AGENTS.md loading); setting values `claude-md-or-agents-md` (default), `claude-md-and-agents-md`, `claude-md`, `managed-only` — [Claude Code docs: memory][cc-memory]
- To share one file, Claude Code recommends a `CLAUDE.md` with an `@AGENTS.md` import (Claude-specific lines below it). A symlink also works, but Edit/Write "refuse to write through a symlink". On Windows a symlink "needs Administrator privileges or Developer Mode", and Git checks it out as a plain text file unless `core.symlinks` is on, "which leaves that clone with a one-line `CLAUDE.md`". "If you or anyone who clones the repository works on Windows, use the `@AGENTS.md` import instead" — [Claude Code docs: memory][cc-memory]
- Claude Code: "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence"; path-scoped rules in `.claude/rules/` load only for matching files — [Claude Code docs: memory][cc-memory]
- GitHub Copilot reads `.github/copilot-instructions.md`, path-specific `.github/instructions/*.instructions.md` with `applyTo`, and agent files `AGENTS.md`, `CLAUDE.md` or `GEMINI.md`; "the nearest `AGENTS.md` file in the directory tree will take precedence" — [GitHub Docs: repository custom instructions][gh-copilot]
- Practice in mature repos (2026-10-10): cli/cli's `CLAUDE.md` is the single line `@AGENTS.md`; its AGENTS.md opens with a contribution gate ("Do not prepare an unsolicited external upstream pull request"), a private security disclosure rule and invariants ("Preserve script-facing contracts") — [cli/cli AGENTS.md][gh-agents]; [cli/cli CLAUDE.md][gh-claude]
- uv's AGENTS.md is a flat list of ALWAYS/NEVER/PREFER/AVOID rules, starting "Read CONTRIBUTING.md for guidelines on how to run tools", and includes "DO NOT leak our conversation, prompt, or iteration history into code comments, pull request descriptions, or other maintainer-facing prose" — [uv AGENTS.md][uv-agents]
- biome's AGENTS.md "contains rules that apply to every automated contribution. Detailed workflows live in `.agents/skills/`", and requires evidence: "Do not claim a Biome function, module, behavior, or convention exists without an exact file and line, a source excerpt, or a reproducible command" — [biome AGENTS.md][biome-agents]
- ruff and biome commit `.agents/` and `.claude/` directories alongside AGENTS.md; ruff also has CLAUDE.md — root listings of [ruff][ruff-repo3] and [biome][biome-repo4]
- Shipped skills: cli/cli ships `skills/gh/SKILL.md` ("Patterns for invoking the GitHub CLI (gh) from agents") and `skills/gh-skill` — [cli/cli skills][gh-skills]. herdsman embeds `skills/herdsman/SKILL.md` in the binary and prints it with `herdsman --skill`; herdr's policy makes that file track the latest stable release, because `npx skills add remziduzagac/herdsman --skill herdsman -g` installs it from `master`, and updates it only in the release commit — local: `src/main.rs`; `git show herdr-import:AGENTS.md`, Docs section
- herdsman also hosts `agent-guide.md` at its site root for "an agent helping a human learn, set up, or troubleshoot", distinct from the skill ("The skill is for an agent operating Herdsman; the guide is for an agent teaching a human"); the docs home page offers a copy-paste prompt pointing an agent at it, and a CLI test checks the URL — local: `distribution/agent-guide.md`, `docs/next/website/src/content/docs/agent-skill.mdx`, `tests/cli/surface.rs`
- herdsman's `CLAUDE.md` is a symlink to `AGENTS.md` (176 lines) — local: `ls -la`
- Agent Skills format: a directory with `SKILL.md`; frontmatter `name` (max 64 chars, lowercase, hyphens, must match the directory) and `description` (max 1024 chars, "what the skill does and when to use it"); optional `license`, `compatibility`, `metadata`, `allowed-tools` (experimental); optional `scripts/`, `references/`, `assets/`; progressive disclosure (metadata ~100 tokens, body under 5000 tokens, "Keep your main `SKILL.md` under 500 lines"); validate with `skills-ref validate` — [Agent Skills specification][skills-spec]
- llms.txt: proposed by Jeremy Howard (dated 2024-09-03); "v2 of the proposal", modified 2026-08-10. A Markdown file at `/llms.txt` (or a subpath such as `/docs/llms.txt`) with a required H1, an optional blockquote summary, and H2 "file lists" of links. An "Optional" section holds secondary links. Pages should also be served as clean Markdown at `page.md` / `page.html.md` — [llms.txt v2 source][llmstxt-src]; [llmstxt.org][llmstxt]
- llms.txt integrations listed include Mintlify, GitBook, `vitepress-plugin-llms` and `docusaurus-plugin-llms`; for Starlight the community plugin `starlight-llms-txt` (0.12.0, 2026-09-15) generates `llms.txt`, `llms-full.txt` and `llms-small.txt` — [llms.txt v2 source][llmstxt-src]; [starlight-llms-txt][sl-llms]
- Observed on 2026-10-10 (HTTP check): `/llms.txt` served by docs.astral.sh/uv, vitepress.dev, zensical.org/docs and code.claude.com/docs; 404 at starlight.astro.build, biomejs.dev, docs.astro.build, docusaurus.io and cli.github.com — direct `curl` checks of those URLs

### Inferences

- L1: `AGENTS.md` with build, test and lint commands and the non-obvious rules; a `CLAUDE.md` containing `@AGENTS.md` (prefer the import over a symlink when anyone may clone on Windows; herdsman's symlink is a risk given its Windows support). Keep it under ~200 lines; move task workflows into project skills (`.agents/skills/`, as biome and herdsman do).
- L2: AGENTS.md states contribution and security gates for agents (cli/cli), and an AI policy covers human contributors' use of AI (ripgrep, uv).
- L3: for tools agents will drive, ship a skill in Agent Skills format with the product, versioned with releases (embedded in the binary or installable), and keep it in step with the CLI; publish `llms.txt` (and Markdown page copies) from the docs site via the generator's plugin; consider a hosted "agent guide" for agents helping humans set up the tool, as herdsman does.
- Audit rules: AGENTS.md exists and names commands that actually run; no CLAUDE.local.md committed; CLAUDE.md does not duplicate AGENTS.md; skills validate against the spec (`skills-ref validate`); the shipped skill's commands match `--help` (test it, as herdsman tests the guide URL).
- llms.txt is cheap and growing but not universal; even docs-tool projects (Starlight, Docusaurus) do not serve one on their own sites. Treat it as L3-optional.

### Gaps

- The agents.md adoption figure (60,000+) and steward claim come from the agents.md site itself; not independently verified.
- No primary data on whether agents actually fetch `llms.txt` in practice.
- Did not verify how Codex, Gemini CLI or Cursor handle a `CLAUDE.md` that only contains `@AGENTS.md`.

[agentsmd]: https://agents.md/
[cc-memory]: https://code.claude.com/docs/en/memory
[gh-copilot]: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
[gh-agents]: https://github.com/cli/cli/blob/trunk/AGENTS.md
[gh-claude]: https://github.com/cli/cli/blob/trunk/CLAUDE.md
[uv-agents]: https://github.com/astral-sh/uv/blob/main/AGENTS.md
[biome-agents]: https://github.com/biomejs/biome/blob/main/AGENTS.md
[ruff-repo3]: https://github.com/astral-sh/ruff
[biome-repo4]: https://github.com/biomejs/biome
[gh-skills]: https://github.com/cli/cli/tree/trunk/skills
[skills-spec]: https://agentskills.io/specification
[llmstxt-src]: https://github.com/AnswerDotAI/llms-txt/blob/main/nbs/index.qmd
[llmstxt]: https://llmstxt.org/
[sl-llms]: https://github.com/delucis/starlight-llms-txt
