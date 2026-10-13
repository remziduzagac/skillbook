# greenrepo profiles

Draft 1, 2026-10-10, companion to [greenrepo.md](greenrepo.md). greenrepo's rules are generic; a profile holds what is specific to one language, tool, framework or platform, and applies only to repositories that use it. Defaults are as of 2026-10 and are reviewed twice a year, in April and October; each names alternatives, because several tools are young or before 1.0.

## How profiles work

- **A repository lists every profile it uses** in its scope line, and each applies to its own part of the tree: herdsman's is `Rust, Bash, Markdown, TypeScript (docs site)`. The one check command runs them all.
- **A profile exists only when it adds something valuable** that the generic rules cannot say. New ones are added when a repository needs them, not in advance.
- **Every profile uses the same skeleton**, so an audit walks each one the same way. A row that does not apply says "n/a" rather than disappearing.
- **Examples live in the skill.** This document names choices; the greenrepo skill's profile files carry the ready-to-copy CI jobs, check recipes and config files.

| Row | Generic rule it meets |
| --- | --- |
| Toolchain | QA-01, a pinned toolchain |
| Dependencies | QA-02, a committed lockfile; DEP-05, admitting dependencies |
| Format and lint | QA-03 |
| Types | QA-08 |
| Tests | QA-07 |
| Coverage | QA-11 |
| Scanning and licences | DEP-04, DEP-08 |
| Build | REL-03, and CI-16 for native builds |
| Publish and deliver | REL-04 to REL-11 |
| Versioning | REL-01, where the ecosystem reads versions its own way |
| Docs site | DOC-06 |
| Hooks | QA-10 |
| Specific | what only this profile has |

## TypeScript and JavaScript

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | Node 24 or 26 LTS in `.node-version` or `devEngines.runtime`; consumers `engines.node >=22.12` |
| Dependencies | pnpm via `packageManager`, lockfile committed; keep `minimumReleaseAge` and `allowBuilds` (npm) |
| Format and lint | Biome 2.x with `biome ci` (ESLint 10 flat config, typescript-eslint, Prettier or Oxfmt; Oxlint) |
| Types | `tsc --noEmit` on TypeScript 7; TypeScript 6 where typescript-eslint or a framework checker needs it |
| Tests | Vitest 5 (`node:test` for tiny packages; Jest 30 for old suites) |
| Coverage | `@vitest/coverage-v8` |
| Scanning and licences | `pnpm audit --prod` on a schedule, or OSV-Scanner; `dependency-review-action` licence gate |
| Build | ESM-only `exports` with `types`; `tsc` or tsdown; publint and attw before release |
| Publish and deliver | npm trusted publishing from a protected environment, then disallow tokens |
| Versioning | npm treats the first non-zero component of a 0.x version as major |
| Docs site | Starlight or VitePress; Docusaurus when built-in versioning or translation is needed |
| Hooks | simple-git-hooks or lefthook with lint-staged |
| Specific | changesets for monorepos |

Notes:

- Node 20 is end of life. Corepack is no longer shipped from Node 25, and Volta is unmaintained; mise replaces it.
- TypeScript 7 (the Go port) has no programmatic API until 7.1, so tools built on that API still need TypeScript 6.
- ESLint 10 removed the old `.eslintrc` format.
- ESM-only packages are practical now that `require(esm)` works on Node 20.19, 22.12 and later.
- Admitting dependencies: pnpm 11 refuses packages younger than a day and runs install scripts only for allowed packages; npm 12 stops dependency install scripts by default.
- npm revoked all classic tokens on 2025-12-09; trusted publishing needs npm 11.5.1 and Node 22.14 or later. Publish jobs set `package-manager-cache: false`, so the privileged job restores no cache.

## Python

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | `.python-version` (3.14 or 3.15); `requires-python = ">=3.11"`; uv installs interpreters |
| Dependencies | uv with `uv.lock` committed, dev tools in `[dependency-groups]`, CI `UV_LOCKED=1` (Poetry, PDM) |
| Format and lint | Ruff format and check, version pinned; each Ruff bump in its own commit |
| Types | pyright, basedpyright or mypy 2.x, strict; ty only as an optional fast check |
| Tests | pytest 9 with `[tool.pytest]` and `filterwarnings = ["error"]` |
| Coverage | coverage.py with branch coverage |
| Scanning and licences | pip-audit or OSV-Scanner on `uv.lock` (`uv audit` once stable); pip-licenses or the gate |
| Build | `uv_build` for pure Python, hatchling with build hooks, maturin for Rust extensions; PEP 639 licences |
| Publish and deliver | PyPI trusted publishing: `pypa/gh-action-pypi-publish` (attests itself) or `uv publish` |
| Versioning | n/a beyond the policy; versions follow PEP 440 |
| Docs site | Sphinx for API docs; MkDocs only for existing sites |
| Hooks | prek or pre-commit, with local hooks that call `uv run` |
| Specific | a version matrix, 3.11 to 3.15, through setup-uv (tox with tox-uv, or nox, locally) |

Notes:

- Python 3.10 is end of life.
- Ruff's minor releases change its default rules, which is why it is pinned and bumped alone.
- ty is still beta. `uv audit` is a preview with a known bug that can report nothing, so pip-audit or OSV-Scanner is the gate for now.
- Material for MkDocs is in maintenance mode and its successor, Zensical, is still 0.0.x, so new sites start elsewhere.
- Astral, which makes uv, Ruff and ty, is joining OpenAI: a governance fact to keep in view, although the tools stay permissively licensed.

## Rust

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | `rust-toolchain.toml` with an exact channel plus clippy and rustfmt; CI reads it, no second pin |
| Dependencies | `Cargo.lock` committed; `--locked` in CI |
| Format and lint | rustfmt; clippy with `[workspace.lints]`; CI `CARGO_BUILD_WARNINGS=deny` on Rust 1.97 or later |
| Types | n/a: the compiler |
| Tests | cargo-nextest with a `ci` profile, plus `cargo test --doc`, which nextest skips |
| Coverage | `cargo llvm-cov nextest`, informational |
| Scanning and licences | cargo-deny (advisories, licences, bans, sources) on pull requests and weekly |
| Build | dist, or a hand-written matrix on native runners; cargo-zigbuild for glibc floors |
| Publish and deliver | crates.io trusted publishing after the first release; `cargo auditable` as a lighter SBOM |
| Versioning | Cargo treats the first non-zero component of 0.x as major; cargo-semver-checks through release-plz |
| Docs site | mdBook for guides |
| Hooks | a plain `.githooks/` folder calling the task runner |
| Specific | Edition 2024 (resolver 3); `rust-version`; libraries check MSRV with `cargo hack check --rust-version` |

Notes:

- `CARGO_BUILD_WARNINGS=deny` does not invalidate the build cache the way `RUSTFLAGS=-Dwarnings` does.
- Lint levels in the manifest are shared by editors, agents and CI.
- A CI toolchain that differs from `rust-toolchain.toml` silently triggers a second install.
- cargo-deny covers what cargo-audit does, plus licences, bans and sources.
- `cross` has had no release since 2023, so native runners are the default.
- A crate's first crates.io release still needs a token.
- Rust libraries follow the ecosystem's `MIT OR Apache-2.0` licensing.
- Swatinem/rust-cache, saving only on default-branch pushes.

## Go

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | `go.mod` `go` line, plus `toolchain` for exact builds; setup-go with `go-version-file: go.mod` |
| Dependencies | `go.sum` committed; `go mod tidy -diff` in CI |
| Format and lint | golangci-lint v2 pinned, `version: "2"`, the `standard` set plus a curated few; gofmt or gofumpt |
| Types | n/a: the compiler; `go vet` through golangci-lint |
| Tests | `go test -race ./...` on the operating systems it runs on |
| Coverage | `-coverprofile=coverage.out` |
| Scanning and licences | govulncheck pinned (take the version from the module proxy); go-licenses |
| Build | GoReleaser v2 |
| Publish and deliver | tags are releases, served by the module proxy; GoReleaser `homebrew_casks` for binaries |
| Versioning | a `/v2` module path from version 2; bad versions withdrawn with `retract`, tags never deleted |
| Docs site | pkg.go.dev for the API; the generic site for guides |
| Hooks | a plain `.githooks/` folder calling the task runner |
| Specific | `tool` directives in `go.mod` for helper tools, except golangci-lint, which runs as a pinned binary |

Notes:

- Install golangci-lint as a pinned binary, not with `go install`.
- Go 1.27's gofmt changed alignment, the clearest case for pinning formatter and toolchain together.
- govulncheck reports only vulnerabilities the code actually calls.
- The race detector needs cgo and slows tests considerably.

## Bash

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | ShellCheck and shfmt pinned; the shells the scripts target |
| Dependencies | n/a |
| Format and lint | ShellCheck 0.11.0, `source-path=SCRIPTDIR`; `shfmt -d .` (3.14), set in `.editorconfig` |
| Types | n/a |
| Tests | bats-core 1.14 with bats-support and bats-assert |
| Coverage | n/a |
| Scanning and licences | n/a |
| Build | n/a |
| Publish and deliver | through the project's own release |
| Versioning | n/a |
| Docs site | n/a |
| Hooks | ShellCheck and shfmt |
| Specific | `#!/bin/sh` and `set -eu` for installers; bash with `set -euo pipefail` elsewhere, knowing its holes |

Notes:

- The Ubuntu runner's ShellCheck package is two releases behind, so CI installs the pinned release.
- shfmt ignores `.editorconfig` when given formatting flags, so CI runs it bare.
- `set -e` ignores failures in conditions, `&&` lists and `local x=$(cmd)`; `set -u` breaks empty arrays before bash 4.4, which macOS runners still ship.
- Installers are tested under sh, dash, bash and zsh on Linux, busybox ash on Alpine, and macOS's bash 3.2.
- Past about 100 lines, a script is rewritten in a structured language.

## Markdown

Applies to every repository with markdown files, which is nearly every repository.

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | the tools below, pinned |
| Dependencies | n/a |
| Format and lint | markdownlint-cli2 with `.markdownlint-cli2.jsonc`; `--fix`, or Prettier with its `prettier` style |
| Types | n/a |
| Tests | links: lychee `--offline` on every change; the full check weekly, with cache and `GITHUB_TOKEN` |
| Coverage | n/a |
| Scanning and licences | n/a |
| Build | a static site build that fails on broken links, when there is a site |
| Publish and deliver | GitHub Pages through Actions |
| Versioning | n/a |
| Docs site | the generator of the repository's main profile, or a markdown-native one |
| Hooks | markdownlint |
| Specific | `typos` with a project word list; Vale only with a small vocabulary of the project's own |

Notes:

- Line length lives in the markdownlint config, since EditorConfig has no such property.
- markdownlint `--fix` and Prettier are never both run bare: Prettier only with markdownlint's `prettier` style.
- Vale's action moved to `vale-cli/vale-action@v3`.

## Command-line distribution

Applies to repositories whose Artifacts include a command-line tool that users install.

| Row | Default (alternatives) |
| --- | --- |
| Toolchain | n/a |
| Dependencies | n/a |
| Format and lint | the install script under the Bash profile |
| Types | n/a |
| Tests | the install script tested on every supported platform; each channel re-installed after a release |
| Coverage | n/a |
| Scanning and licences | n/a |
| Build | n/a |
| Publish and deliver | a release with checksums and attestations; then an install script, a Homebrew tap, more |
| Versioning | n/a |
| Docs site | the install page lists every channel |
| Hooks | n/a |
| Specific | a self-updater (dist's updater, for example) updates only installs it made itself |

Notes:

- Channels follow demand: release assets first, then an install script, then a Homebrew tap, then distribution repositories, winget, Scoop or Nix.
- homebrew-core accepts only formulae built from source, so prebuilt binaries go to a tap; Homebrew 5's codesigning requirement applies to the official cask repository, not to taps.
- A Debian or RPM repository is signed, and its users add the key with a `signed-by` keyring rather than `apt-key`.
- winget requires direct download URLs from the publisher's release location and scans installers.

## Planned profiles

Added when a repository needs them, after a short research round each:

- **Containers:** a Dockerfile linter (hadolint), base images by digest, an image scan, the image build and push with attestations.
- **Mobile:** Swift, Kotlin, and Dart with Flutter, with their store delivery.
- **Deploy targets:** static hosting, server-based web services and APIs, serverless.
- **Frameworks and tools,** where they add something valuable beyond their language's profile.
