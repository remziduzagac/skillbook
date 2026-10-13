# Lightweight tooling for a consistent markdown documentation repository

Scope: front matter validation, link and anchor checking, generated indexes with a check mode, ID cross-references, "last updated" from git, hook runners, and example validators. Maintenance data (latest release, last push) was pulled on 2026-10-07 from the npm registry, PyPI, crates.io and the GitHub API; those numbers are cited to the registry or repo URL they came from. The recommended minimal set is in the Inferences of the last question.

## Front matter validation: remark-lint, JSON Schema, markdownlint custom rules, Vale, one-file scripts

### Takeaway

No maintained, popular single-purpose tool validates Markdown front matter against a schema from the command line; the off-the-shelf options are a stale remark plugin, a CI-only GitHub Action, or general JSON Schema validators that need the front matter extracted first. Vale lints front matter prose, not structure. Large projects (MDN, PEPs, KEPs, GitHub Docs) all use their own script, and for a handful of required keys plus a status enum a plain dictionary check in one script is simpler than a schema language.

### Cited Findings

- remark-lint-frontmatter-schema validates front matter against JSON Schema as a remark-lint rule; a file is tied to a schema by a `$schema` key in its front matter or by globs in `.remarkrc.mjs` (local `$schema` wins). It needs `remark`, `remark-cli`, `remark-frontmatter` and the plugin — [GitHub](https://github.com/JulianCataldo/remark-lint-frontmatter-schema)
- Maintenance: latest npm release 3.15.4 published 2023-10-15; repo last pushed 2024-09-21; 81 stars — [npm registry](https://registry.npmjs.org/remark-lint-frontmatter-schema), [GitHub API](https://api.github.com/repos/JulianCataldo/remark-lint-frontmatter-schema)
- remark-frontmatter (the parser plugin it depends on) is at 5.0.0, published 2023-09-18 — [npm registry](https://registry.npmjs.org/remark-frontmatter)
- markdownlint custom rules are JS modules exporting `names`, `description`, `tags`, `parser` (`micromark`, `markdown-it` or `none`) and `function(params, onError)`; `params.frontMatterLines` holds the raw front matter lines (not parsed YAML); rules load via the `customRules` option — [markdownlint CustomRules.md](https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md)
- markdownlint-cli2 latest is 0.23.3 (2026-09-20) — [npm registry](https://registry.npmjs.org/markdownlint-cli2)
- Vale v3.11.0 (released 2026-04-02) added linting of front matter fields in Markdown, AsciiDoc, reST, MDX and Org; each field gets a scope such as `text.frontmatter.title` — [Vale release v3.11.0](https://github.com/errata-ai/vale/releases/tag/v3.11.0)
- Vale lints only string-valued front matter fields; lists and nested maps are left alone, and `~text.frontmatter` excludes front matter from a rule — [Vale docs: Front Matter](https://vale.sh/docs/formats/front-matter)
- Vale is actively maintained (repo now `vale-cli/vale`, v3.24.0 on 2026-10-01) — [GitHub API](https://api.github.com/repos/vale-cli/vale)
- hashicorp/front-matter-schema is a GitHub Action: the schema is raw JSON passed in the workflow's `schema` input, files are selected by `files`/`directories` globs — [GitHub](https://github.com/hashicorp/front-matter-schema)
- It has 0 stars and no releases (last push 2026-05-11), so it is effectively an internal HashiCorp action — [GitHub API](https://api.github.com/repos/hashicorp/front-matter-schema)
- check-jsonschema (0.38.2, 2026-09-23) is a maintained CLI and pre-commit hook for validating JSON/YAML/TOML files against JSON Schema; its README does not mention Markdown or front matter (checked by grep), so front matter would need extracting first — [GitHub](https://github.com/python-jsonschema/check-jsonschema)
- MDN's `scripts/front-matter_linter.js` uses AJV + ajv-formats + `@apideck/better-ajv-errors`; the schema lives in `front-matter-config.json` (`required: [title, slug, page-type]`, `additionalProperties: false`), it also enforces an `attribute-order`, and `--fix` rewrites the order; wired as npm scripts `lint:fm` / `fix:fm` — [mdn/content scripts](https://github.com/mdn/content/tree/main/scripts), [front-matter-config.json](https://github.com/mdn/content/blob/main/front-matter-config.json)
- GitHub Docs defines its front matter schema in `src/frame/lib/frontmatter.ts` and validates every page in its test suite — [github/docs frontmatter.ts](https://github.com/github/docs/blob/main/src/frame/lib/frontmatter.ts)
- uv runs single-file Python scripts with PEP 723 inline dependencies (`# /// script` block) and supports the shebang `#!/usr/bin/env -S uv run --script`, so a one-file validator can declare `pyyaml` without a project or venv — [uv: Running scripts](https://docs.astral.sh/uv/guides/scripts/)
- python-frontmatter is maintained (1.3.0, 2026-05-20) — [PyPI](https://pypi.org/pypi/python-frontmatter/json)
- PyYAML gotcha, verified locally (PyYAML 6.0.2, Python 3.13.7): `yaml.safe_load("created: 2026-10-07")` yields a `datetime.date`, not a string, so a JSON Schema `format: date` string check fails unless dates are quoted or converted — local test; behaviour is YAML 1.1 timestamp resolution, see [PyYAML docs](https://pyyaml.org/wiki/PyYAMLDocumentation)

### Inferences

- For the described blueprint (title, status, created + a few type-specific keys), a Python dict like `REQUIRED = {"decision": {"title", "status", "created"}, ...}` plus `STATUSES = {...}` is ~30 lines and needs no schema language; PEPs' `check-peps.py` takes exactly this approach (see last question).
- JSON Schema earns its place only if the schema gets nested or is shared with an editor (VS Code YAML schema association) — otherwise it adds a dependency and a second language for no gain.
- remark-lint-frontmatter-schema brings a Node toolchain plus a plugin with no release since 2023; not a good base for a new solo setup.
- markdownlint custom rules see one file at a time and receive unparsed front matter lines; they fit per-file checks (required keys) but not cross-file ID resolution, so they would split the validator in two.
- Vale is the right tool only if prose style rules are wanted; it cannot check required keys or enums on non-string fields.
- Node has no YAML parser in its standard library either, so "one file" in Node also means a dependency (`yaml` or `js-yaml`); Python + uv inline metadata is the lowest-friction single-file option.

### Gaps

- No maintained, widely used standalone CLI for "Markdown front matter vs JSON Schema" was found; smaller npm packages in this space were not evaluated individually.
- Did not verify whether python-frontmatter avoids the PyYAML date conversion (it uses PyYAML by default, so likely not).

## Link checking: lychee, markdown-link-check, remark-validate-links, site-builder checks, intra-repo anchors

### Takeaway

lychee is the maintained default: one Rust binary, `--offline` restricts it to local files and `--include-fragments` checks `#anchors` against GitHub-style heading slugs. remark-validate-links is the most precise intra-repo checker (files plus cross-file heading anchors) but pulls in the remark stack. markdownlint MD051 checks same-file anchors only. A custom script can do intra-repo link and anchor checks in a few dozen lines using the GitHub slug algorithm.

### Cited Findings

- lychee: "fast, async, stream-based link checker written in Rust" for Markdown, HTML, reST and more; `--offline` "Only check local files and block network requests"; `--include-fragments` checks anchors; ships as a static binary, a pre-commit hook and `lycheeverse/lychee-action` — [lychee README](https://github.com/lycheeverse/lychee)
- lychee builds fragments for Markdown headings from explicit `{#custom-id}` or auto-generated "unique kebab case" similar to GitHub; JS-generated anchors cannot be checked — [lychee: anchors recipe](https://lychee.cli.rs/recipes/anchors/)
- lychee v0.24.0 added text-fragment checking; latest v0.24.2 on 2026-05-01; repo pushed 2026-10-05; ~4.0k stars — [lychee releases](https://github.com/lycheeverse/lychee/releases)
- remark-validate-links checks that linked local files exist in the git repo, that headings in the same document exist, and that cross-file heading anchors (`readme.md#section`) exist; it does not check external URLs. Run with `remark --use remark-validate-links .`; output like `Link to unknown heading in readme.md: foo` — [remark-validate-links](https://github.com/remarkjs/remark-validate-links)
- remark-validate-links latest 13.1.0 (2025-02-21) — [npm registry](https://registry.npmjs.org/remark-validate-links)
- markdownlint MD051 (link-fragments) checks only same-document fragments, using GitHub's algorithm: lowercase, remove punctuation, spaces to dashes, append an incrementing integer for uniqueness, URI-encode; it also accepts `{#custom-name}` and HTML `id`/`name` — [markdownlint MD051](https://github.com/DavidAnson/markdownlint/blob/main/doc/md051.md)
- markdown-link-check checks that links are alive (external, relative, `mailto:`), configured via `config.json` (`ignorePatterns`, `replacementPatterns`, `httpHeaders`, retries) — [GitHub](https://github.com/tcort/markdown-link-check)
- markdown-link-check is maintained: 3.15.0 published 2026-07-28 — [npm registry](https://registry.npmjs.org/markdown-link-check)
- starlight-links-validator validates internal links in Starlight Markdown/MDX at build time; 0.26.0 published 2026-09-02 — [GitHub](https://github.com/HiDeoo/starlight-links-validator), [npm registry](https://registry.npmjs.org/starlight-links-validator)
- herdsman's own docs site already fails `npm run build` on broken internal links (project CLAUDE.md, `herdsman/CLAUDE.md`, "Docs" section) — local source.
- mdbook-linkcheck's last release is v0.7.7 (2022-10-03), last push 2024-08-15 — [GitHub API](https://api.github.com/repos/Michael-F-Bryan/mdbook-linkcheck); the fork mdbook-linkcheck2 is active (0.13.0, 2026-08-16) — [crates.io](https://crates.io/crates/mdbook-linkcheck2)
- GitLab's `docs-lint links` job checks regular and anchor links and skips "any link that requires a network connection" — [GitLab documentation testing](https://docs.gitlab.com/development/documentation/testing/)

### Inferences

- Split link checking in two: (1) intra-repo files and anchors, deterministic and offline, in the pre-commit/CI validator; (2) external URLs, network-dependent and flaky, run on a schedule or manually with lychee. GitLab draws the same line.
- Under GitHub's slug algorithm, `## D201: Title (2026-10-07)` becomes `#d201-title-2026-10-07`; any rename of the title or date breaks every anchor link. That is an argument for referencing decisions by ID (`(D201)`) and letting the validator resolve IDs, rather than linking to heading anchors.
- If the custom script already walks all files, adding relative-link and anchor checks is ~30 lines: resolve the path relative to the linking file, then compare the fragment with the slugs of the target's headings. lychee `--offline --include-fragments` is the zero-code alternative if a binary dependency is acceptable.
- markdownlint MD051 is already free for users of markdownlint-cli2 (this developer's environment uses it), but covers same-file anchors only.

### Gaps

- A search-result summary claimed mdbook-linkcheck2 checks that targets exist but not their `#fragments`; not verified against its docs.
- lychee's exact slug algorithm was not compared character-by-character with GitHub's (e.g. for punctuation such as `:` and parentheses in decision headings); worth a quick test before relying on it.

## Index/TOC generation into marked regions, and check mode

### Takeaway

Several tools regenerate content between comment markers and have a CI check mode: cog (`--check`, Python code in the markers), mdsh (`--frozen`, shell commands in the markers), doctoc (`--dryrun` exits 1, but only builds a TOC of one file), embedme (`--verify`, stale since 2022). markdown-magic has transforms but no documented fail-on-stale mode. For an index built from front matter the validator already parses, generating inside the same script is simpler.

### Cited Findings

- cog flags: `--check` "Check that the files would not change if run again"; `--diff` "With --check, show a diff of what failed the check"; `-r` "Replace the input file with the output"; `--markers` sets the start, end and end-output markers; `-c` checksums output against accidental change — [cog docs: running](https://cog.readthedocs.io/en/latest/running.html)
- cog history: `--markers` in 2.4 (2015-01-11), `--check` in 3.3.0 (2021-11-19, "for use in continuous integration scenarios"), `--diff` in 3.5.0 (2025-06-05); latest 3.6.0 (2025-09-21) added `--check-fail-msg` — [cog changelog](https://cog.readthedocs.io/en/latest/changes.html), [PyPI](https://pypi.org/pypi/cogapp/json)
- Cog markers can sit inside HTML comments so the generator is invisible when rendered (`<!-- [[[cog ... ]]] -->` ... `<!-- [[[end]]] -->`); update with `cog -r README.md`, check with `cog --check README.md` — [Simon Willison TIL](https://til.simonwillison.net/python/cog-to-update-help-in-readme)
- Simon Willison first enforced freshness with `cog --check *.md` in the test suite, then moved to a GitHub Actions workflow that runs cog on PRs and commits the result back — [Simon Willison TIL](https://til.simonwillison.net/github-actions/cog)
- doctoc uses `<!-- START doctoc -->` / `<!-- END doctoc -->`; `--dryrun` makes no changes and exits 1 if files need updating; `--update-only` touches only files that already have a TOC; pre-commit hook available — [doctoc](https://github.com/thlorenz/doctoc)
- doctoc 2.5.0 published 2026-06-12 — [npm registry](https://registry.npmjs.org/doctoc)
- markdown-magic uses `<!-- docs transformName options -->` ... `<!-- /docs -->`, built-in TOC, CODE, FILE, REMOTE, fileTree transforms and custom transforms; `dryRun` only shows planned changes; its README's CI example regenerates and commits rather than failing — [markdown-magic](https://github.com/DavidWells/markdown-magic)
- markdown-magic 4.11.0 published 2026-06-29; 870 stars — [npm registry](https://registry.npmjs.org/markdown-magic)
- mdsh (Rust) runs commands embedded in Markdown, including HTML-comment forms (`<!-- $ cmd -->`, `<!-- END mdsh -->`); `--frozen`: "Fail if the output is different from the input. Useful for CI."; ships a pre-commit hook — [mdsh](https://github.com/zimbatm/mdsh)
- mdsh's last crates.io release is 0.7.0 (2022-11-03), though the repo was pushed 2026-07-23 — [crates.io](https://crates.io/crates/mdsh)
- embedme `--verify` checks that running embedme would change nothing; last release 1.22.1 (2022-09-07) — [embedme](https://github.com/zakhenry/embedme), [npm registry](https://registry.npmjs.org/embedme)

### Inferences

- Every check mode works the same way: regenerate in memory, compare with the file, exit non-zero on difference (cog `--check`, doctoc `--dryrun`, mdsh `--frozen`, embedme `--verify`). Any generator without one can be wrapped as "run it, then `git diff --exit-code`", at the cost of modifying the working tree.
- The developer's own markers (`<!-- generated:index -->` ... `<!-- /generated -->`) need one regex (`(?s)(<!-- generated:index -->\n).*?(<!-- /generated -->)`) and a render function; `index --check` is a string comparison. Since the index rows come from front matter the validator already parses, a separate tool would parse the same files twice.
- cog is the strongest off-the-shelf choice if generation logic should live next to the output (Python inside the README comment), but that scatters code into documents; mdsh can call the validator script from a marker (`<!-- $ ./blueprint index decisions -->`) but its release cadence is stale.
- doctoc only produces a per-file heading TOC, which does not cover a cross-file document index.

### Gaps

- Did not confirm whether markdown-magic's CLI exits non-zero in `dryRun` when content would change; its README documents no such behaviour.

## ID-based cross-references: wikilinks, Dendron, Foam, MyST, mkdocs-autorefs vs a regex validator

### Takeaway

All ID/cross-reference systems found depend on a renderer or editor extension to resolve links; on plain GitHub or in a terminal the source stays unresolved syntax. For IDs written as plain text (`(D201)`, `(P3/T2)`), a regex validator that collects definitions and references across files is simpler and renderer-independent.

### Cited Findings

- Foam uses `[[wikilinks]]` resolved by its VS Code extension; Foam is active (vscode@0.46.0, 2026-09-30, ~17.4k stars) — [Foam wikilinks](https://docs.foamnotes.com/features/wikilinks/), [GitHub API](https://api.github.com/repos/foambubble/foam)
- Dendron has been officially in maintenance mode since February 2023 (no product-market fit; bug fixes and PR review only; relicensed Apache 2.0) — [Random Geekery](https://randomgeekery.org/post/2023/02/dendron-is-officially-in-maintenance-mode/)
- Foam and Dendron parse notes and attach metadata differently, causing incompatibilities — [Dendron wiki](https://wiki.dendron.so/notes/9Id5LUZFfM1m9djl6KgpP/)
- mkdocs-autorefs: `[text][identifier]` links to any heading across the site without knowing its page; identifiers come from slugified headings, `[](){ #custom-id }` anchors or `## Heading { #id }` (both need `attr_list`); duplicate titles log a warning and resolve to the first match (`resolve_closest` option) — [mkdocs-autorefs](https://mkdocstrings.github.io/autorefs/)
- mkdocs-autorefs latest 1.4.4 (2026-02-10) — [GitHub API](https://api.github.com/repos/mkdocstrings/autorefs)
- MyST: targets `(my-label)=` before a block, references `[](#my-label)`, `` {ref}`my-label` ``, `@target` shorthand; unresolved references render as `??` and raise a warning — [MyST cross-references](https://mystmd.org/guide/cross-references)
- PEPs' checker validates numeric PEP references (0-9999, no leading zeros) and flags hardcoded PEP/RFC URLs in favour of role syntax — [python/peps check-peps.py](https://github.com/python/peps/blob/main/check-peps.py)

### Inferences

- The blueprint's IDs are already plain text, so a validator needs: definitions from decision headings (`^## (D\d+): (.+) \((\d{4}-\d{2}-\d{2})\)$`) and wherever P/T IDs are declared (front matter or task headings); references via something like `\((D\d+|P\d+(?:/T\d+)?)\)`; then report duplicate definitions and unknown references. That is roughly 20-30 lines.
- The scanner should skip fenced code blocks and inline code, or examples of the ID syntax will be flagged.
- mkdocs-autorefs and MyST would make IDs clickable on a built site, but they add a site generator and non-standard syntax for a payoff that only appears in the rendered site. Wikilinks (Foam) bind the repo to one editor extension.
- If clickable IDs on GitHub are wanted later, the generated index can carry the links (ID → file#slug) so prose keeps the stable plain `(D201)` form.

### Gaps

- Did not test how GitHub renders an explicit HTML anchor (`<a id="d201"></a>`) placed in a heading, which would give title-independent anchors.

## "Last updated" from git in static sites and scripts

### Takeaway

Every static site generator that shows "last updated" runs `git log` per file at build time and documents the same pitfall: CI shallow clones give wrong dates unless full history is fetched. For a script, `git log -1 --format=%cs -- <file>` is the whole technique; one `git log --name-only` pass scales better for many files.

### Cited Findings

- Git placeholders: `%cs` committer date, short format (`YYYY-MM-DD`); `%cI` committer date, strict ISO 8601; `%as` author date, short format; `%aI` author date, strict ISO 8601 — [git pretty formats](https://git-scm.com/docs/pretty-formats)
- Starlight's `lastUpdated` option uses the Git commit timestamp (search snippet: retrieved with `git log --follow --format=%ai`), may be wrong on platforms that shallow-clone, and can be overridden per page by a `lastUpdated` front matter date — [Starlight configuration](https://starlight.astro.build/reference/configuration/), [Starlight frontmatter](https://starlight.astro.build/reference/frontmatter/)
- `@valtown/add-last-updated` writes `lastUpdated` into Starlight front matter from git to work around shallow clones — [tmcw/add-last-updated](https://github.com/tmcw/add-last-updated)
- mkdocs-git-revision-date-localized "needs access to the last commit that touched a specific file"; fix shallow CI clones with `fetch-depth: 0` (GitHub Actions) or `GIT_DEPTH: 0` (GitLab) — [mkdocs-git-revision-date-localized-plugin](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin)
- Hugo `enableGitInfo`: `.Lastmod` defaults to the Git AuthorDate of the last commit touching the file; shallow clones "might incorrectly reflect the most recent repository commit"; Git integration "may increase build times for large projects" — [Hugo GitInfo](https://gohugo.io/methods/page/gitinfo/)

### Inferences

- Prefer the author date (`%as`) over the committer date: rebases and amends rewrite the committer date but keep the author date, so a generated value is less likely to churn.
- Chicken-and-egg problem: if a committed generated index (README) contains last-updated dates, every commit that edits a document makes the index stale for that document, because the new commit's date is not known until after the commit. Options: (a) keep git-derived dates out of committed generated regions and show them only at view time (site build or a `blueprint status` command); (b) in the generator, treat staged or modified files as "today"; this breaks on commits made near midnight, amends, and timezone differences. Option (a) is the simple one.
- For many files, one `git log --format=%as --name-only` pass, keeping the first date seen per path, avoids one subprocess per file. Note that `--follow` works only for a single path.
- In CI, any date-dependent check needs `fetch-depth: 0` (the same fix every SSG documents).

### Gaps

- The exact `git log` command Starlight uses comes from a search snippet, not from its source code.

## Running the checks: pre-commit framework vs plain git hooks vs just recipes

### Takeaway

When the validator must see the whole repository (cross-file IDs, generated indexes), the pre-commit framework's main benefits (per-file filtering, managed tool environments) do not apply. A `just` recipe called from a committed `.githooks/pre-commit` (enabled with `core.hooksPath`) and from CI is the smallest setup. prek is the lighter option if the pre-commit config format is wanted anyway.

### Cited Findings

- pre-commit supports `repo: local` hooks for scripts "tightly coupled to the repository"; `pass_filenames: false` passes no filenames; `always_run: true` runs the hook even with no matching files; CI runs `pre-commit run --all-files` — [pre-commit.com](https://pre-commit.com/)
- pre-commit 4.4.0 (2025-11-08) added `language: unsupported` / `unsupported_script` as aliases for `language: system` / `script`, "which will eventually be deprecated" — [pre-commit CHANGELOG](https://github.com/pre-commit/pre-commit/blob/main/CHANGELOG.md)
- pre-commit latest v4.6.2 (2026-08-10) — [GitHub API](https://api.github.com/repos/pre-commit/pre-commit)
- prek is a Rust reimplementation of pre-commit: single binary with no Python runtime, reads the same `.pre-commit-config.yaml`, uses uv for Python hook environments; adopters listed include CPython, FastAPI, Godot, Home Assistant and Ruff — [prek](https://prek.j178.dev/)
- prek latest v0.5.5 (2026-10-05), ~8.6k stars — [GitHub API](https://api.github.com/repos/j178/prek)
- lefthook is active (v2.1.17, 2026-10-05) — [GitHub API](https://api.github.com/repos/evilmartians/lefthook); GitLab runs its docs lint locally through lefthook pre-push hooks — [GitLab docs testing](https://docs.gitlab.com/development/documentation/testing/)
- Git can take hooks from a committed directory via the `core.hooksPath` setting — [githooks](https://git-scm.com/docs/githooks)
- The herdsman project already standardises on `just` recipes (`just check`) for validation — local source, `herdsman/CLAUDE.md` "Testing" section.

### Inferences

- Minimal wiring: `just docs-check` → `./tools/blueprint check && ./tools/blueprint index --check`; `.githooks/pre-commit` containing `exec just docs-check`; one-time `git config core.hooksPath .githooks`; CI runs `just docs-check`. Three small files, no hook framework.
- Caveat: a plain hook checks the working tree, not the staged snapshot, so unstaged edits can make a commit pass or fail incorrectly; the pre-commit framework stashes unstaged changes to avoid this. For a solo developer this is usually acceptable; CI on the pushed commit is the backstop.
- If other tools (markdownlint-cli2, lychee) join later, a single `repo: local` hook with `pass_filenames: false` in pre-commit or prek is the upgrade path; prek avoids requiring Python just for the hook runner.

### Gaps

- The pre-commit unstaged-stash behaviour is stated from general knowledge of the tool; it was not re-verified on pre-commit.com in this session.

## Example repositories with a small custom docs validator

### Takeaway

Projects with structured design documents (PEPs, KEPs) and large doc sites (MDN, GitLab, GitHub Docs) all keep a bespoke validator for metadata, even when they also use generic linters. They check the same things this blueprint needs: required fields, allowed statuses, date formats, reference syntax, ordering, file naming. A single script is the established pattern.

### Cited Findings

- python/peps `check-peps.py`: stdlib-only Python (~700 lines); `REQUIRED_HEADERS = {"PEP", "Title", "Author", "Status", "Type", "Created"}`; `ALL_STATUSES` includes Accepted, Active, Deferred, Draft, Final, Provisional, Rejected, Superseded, Withdrawn; checks header order, `DD-mmm-YYYY` dates (not in the future), emails, PEP reference format, discussion-thread URLs; prints `filename:line: message` and exits 1 on errors — [check-peps.py](https://github.com/python/peps/blob/main/check-peps.py)
- kubernetes/enhancements `kepval` checks each KEP's YAML metadata (title, status from provisional / implementable / implemented / deferred / rejected / withdrawn / replaced, authors, owning-sig, creation-date) and runs in CI to block invalid KEPs — [kepval.md](https://github.com/kubernetes/enhancements/blob/master/docs/kepval.md); a later PR added a PRR check for implemented KEPs — [PR #3007](https://github.com/kubernetes/enhancements/pull/3007)
- MDN `front-matter_linter.js`: AJV schema validation plus attribute-order check, with `--fix` — [mdn/content scripts](https://github.com/mdn/content/tree/main/scripts)
- GitLab `lint-doc.sh`: pages must have ownership front matter; `_index.md` instead of `README.md`; lowercase filenames; image filenames carry a version; Mermaid charts must render; plus markdownlint-cli2, Vale and an offline links/anchors job — [GitLab docs testing](https://docs.gitlab.com/development/documentation/testing/)
- GitHub Docs validates every page's front matter against `src/frame/lib/frontmatter.ts` in tests — [github/docs](https://github.com/github/docs/blob/main/src/frame/lib/frontmatter.ts)
- ADR tooling with index generation is quiet: adr-tools last pushed 2024-04-25, log4brains 2024-12-17 — [GitHub API adr-tools](https://api.github.com/repos/npryce/adr-tools), [GitHub API log4brains](https://api.github.com/repos/thomvaill/log4brains)

### Inferences

#### Recommended minimal set for a solo developer

1. One script, `tools/blueprint` (Python; PEP 723 header declaring `pyyaml`, run via `uv run --script`), with two commands. `check`: front matter present and parseable; required keys per document type; status in the allowed set; ISO dates; decision IDs unique and numbered; every `(Dnnn)` / `(Pn)` / `(Pn/Tn)` resolves; relative links resolve to files; `#fragments` resolve via the GitHub slug algorithm. `index [--check]`: rewrite or compare the `<!-- generated:index -->` regions. Output `path:line: message`, exit 1 on any error (the check-peps contract). Estimated 150-250 lines, scaled from check-peps covering more ground in ~700.
2. `just docs-check` as the single entry point, called by `.githooks/pre-commit` (via `core.hooksPath`) and by CI.
3. Keep git-derived "last updated" out of committed generated regions; compute it at view time with `git log -1 --format=%as -- <file>`.
4. Optional, not in the pre-commit path: markdownlint-cli2 for Markdown style (already in this environment), and lychee for external links run manually or on a schedule.
5. Skip: the remark stack (Node toolchain, stale front matter plugin), Vale (prose style only), JSON Schema (until the schema becomes nested), and MyST/mkdocs-autorefs/wikilinks (they need a renderer).

Core helpers, as a sketch (approximate GitHub slug; not exhaustive):

```python
FM = re.compile(r"\A---\n(.*?)\n---\n", re.S)
DECISION = re.compile(r"^## (D\d+): (.+) \((\d{4}-\d{2}-\d{2})\)$", re.M)
REF = re.compile(r"\((D\d+|P\d+(?:/T\d+)?)\)")
LINK = re.compile(r"\[[^\]]*\]\((?!https?:|mailto:)([^)\s#]*)(?:#([^)\s]+))?\)")
REGION = re.compile(r"(<!-- generated:index -->\n).*?(<!-- /generated -->)", re.S)

def slug(heading: str) -> str:  # GitHub-style: lowercase, drop punctuation, spaces -> dashes
    return re.sub(r"[^\w\- ]", "", heading.strip().lower()).replace(" ", "-")
```

### Gaps

- No small public repository was found whose validator matches this exact combination (front matter + numbered decision IDs + generated README indexes); the examples above each cover a subset.
- The 150-250 line estimate is an inference, not a measured implementation.
