# Stack profiles for greenrepo: Rust, Go, Bash and markdown-only repositories (as of 2026-10-10)

Scope: for each stack, the recommended default setup for a solo maintainer who works with AI coding agents, the reasonable alternatives, and why. The common rules are pinned toolchain, formatting, linting, type checking, tests, coverage, dependency and licence audit, build, publishing, and a CI job. Versions were read from GitHub releases with `gh` and from the Go module proxy on 2026-10-10. Mature-repository setups were read from their default branches on the same day.

## Rust profile

### Takeaway

Recommended default:

- Pin an exact stable release in `rust-toolchain.toml`, with `clippy` and `rustfmt` listed as components.
- Declare `rust-version` and check it with `cargo hack --rust-version`.
- Put lint levels in `[lints]` or `[workspace.lints]`.
- In CI, deny warnings with `CARGO_BUILD_WARNINGS=deny`. It needs Rust 1.97 or newer, and it leaves the build cache valid, which `RUSTFLAGS` does not.
- Run tests with `cargo-nextest`, and run `cargo test --doc` separately.
- Gate licences, sources, bans and advisories with `cargo-deny`.
- Measure coverage with `cargo-llvm-cov`.
- For libraries, check semver with `cargo-semver-checks` and release with `release-plz`.
- For binaries, release with `dist`.
- Cache with `Swatinem/rust-cache`.

Changes from 2025 to 2026 that the profile has to reflect:

- Edition 2024 and resolver v3, which is MSRV-aware (Rust 1.85).
- rustup 1.28 changed auto-install behaviour.
- crates.io trusted publishing launched in July 2025.
- `build.warnings` arrived in Rust 1.97 (July 2026).
- cargo-deny 0.19 and 0.20 changed its configuration.
- `cross` has had no release since 2023.

### Cited Findings

#### Current versions (checked 2026-10-10)

- Rust 1.99.0 was released 2026-10-01 — [rust-lang/rust releases](https://github.com/rust-lang/rust/releases/tag/1.99.0)
- The GitHub `ubuntu-24.04` runner image (version 20261004) ships Rust 1.99.0, Cargo 1.99.0 and rustup 1.29.1 — [Ubuntu2404-Readme](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md)
- Tool versions on 2026-10-10, from the GitHub releases of each repository:
  - cargo-deny 0.20.2 (2026-07-09); cargo-deny-action v2.1.1 (2026-07-13) — [cargo-deny](https://github.com/EmbarkStudios/cargo-deny/releases)
  - cargo-audit 0.22.2 (2026-06-05); `rustsec/audit-check` v2.0.0 (2024-09-23) — [rustsec releases](https://github.com/rustsec/rustsec/releases)
  - cargo-nextest 0.9.148 (2026-10-08) — [nextest releases](https://github.com/nextest-rs/nextest/releases)
  - cargo-llvm-cov 0.9.1 (2026-09-06) — [cargo-llvm-cov](https://github.com/taiki-e/cargo-llvm-cov/releases)
  - cargo-semver-checks 0.51.0 (2026-10-03); its action v2.9 (2026-06-29) — [cargo-semver-checks](https://github.com/obi1kenobi/cargo-semver-checks/releases)
  - release-plz 0.3.170 (2026-10-07); `release-plz/action` v0.5.140 — [release-plz](https://github.com/release-plz/release-plz/releases)
  - dist (formerly cargo-dist) 0.33.0 (2026-09-11) — [dist](https://github.com/axodotdev/cargo-dist/releases)
  - cross v0.2.5 (2023-02-04) is still the latest release, though the repository had commits as recently as 2026-09-24 — [cross releases](https://github.com/cross-rs/cross/releases)
  - cargo-zigbuild 0.23.4 (2026-09-02); cargo-xwin 0.23.1 (2026-08-13) — [cargo-zigbuild](https://github.com/rust-cross/cargo-zigbuild), [cargo-xwin](https://github.com/rust-cross/cargo-xwin)
  - Swatinem/rust-cache v2.9.2 (2026-08-06) — [rust-cache](https://github.com/Swatinem/rust-cache/releases)
  - taiki-e/install-action v2.87.26 (2026-10-06); cargo-hack 0.6.45 (2026-05-30) — [install-action](https://github.com/taiki-e/install-action/releases)
  - actions-rust-lang/setup-rust-toolchain v2.0.0 (2026-09-07); rust-lang/crates-io-auth-action v1.0.5 (2026-06-16) — [setup-rust-toolchain](https://github.com/actions-rust-lang/setup-rust-toolchain/releases)

#### Pinned toolchain (`rust-toolchain.toml`)

- rustup picks a toolchain in this order:
  1. the `cargo +toolchain` shorthand
  2. the `RUSTUP_TOOLCHAIN` environment variable
  3. a directory override
  4. `rust-toolchain.toml`
  5. the default toolchain

  The toolchain file supports `channel` (`stable`, `beta`, `nightly`, or an exact version such as `1.85.0`), `components`, `targets`, `profile` (`minimal`, `default` or `complete`) and `path`. `channel` and `path` are mutually exclusive. A legacy extension-less `rust-toolchain` file is still read, and "if both files are present in a directory, the latter is used for backwards compatibility" — [rustup overrides](https://rust-lang.github.io/rustup/overrides.html)
- rustup 1.28.0 (2025-03-04) stopped auto-installing the active toolchain. Its release notes give `rustup show active-toolchain || rustup toolchain install` as the command that works before and after the change. rustup 1.28.1 (2025-03-05) restored "automatic install … by default", with opt-out through `RUSTUP_AUTO_INSTALL=0`. rustup 1.28.2 (2025-05-05) added `rustup set auto-install disable` — [rustup CHANGELOG](https://github.com/rust-lang/rustup/blob/main/CHANGELOG.md)
- `dtolnay/rust-toolchain` installs its `toolchain` input and runs `rustup default`. It also sets `CARGO_INCREMENTAL=0` and `CARGO_TERM_COLOR=always` when they are unset — [dtolnay action.yml](https://github.com/dtolnay/rust-toolchain/blob/master/action.yml)
- `actions-rust-lang/setup-rust-toolchain` handles the toolchain file itself: "If a toolchain file (i.e., `rust-toolchain` or `rust-toolchain.toml`) is found in the root of the repository and no `toolchain` value is provided, all items specified in the toolchain file will be installed". It enables `Swatinem/rust-cache` and problem matchers by default — [setup-rust-toolchain](https://github.com/actions-rust-lang/setup-rust-toolchain)
- In setup-rust-toolchain v2.0.0 (2026-09-07), `CARGO_BUILD_WARNINGS` replaced the earlier default of `RUSTFLAGS="-D warnings"`, "which will improve compatibility with `target.*.rustflags` and `.cargo/config.toml` files". The release adds a `build-warnings` input — [setup-rust-toolchain v2.0.0](https://github.com/actions-rust-lang/setup-rust-toolchain/releases/tag/v2.0.0)
- How mature projects pin:
  - uv pins `channel = "1.99.0"` in `rust-toolchain.toml` and declares `rust-version = "1.97.0"`, so the pinned toolchain sits two releases above the MSRV — [uv rust-toolchain.toml](https://github.com/astral-sh/uv/blob/main/rust-toolchain.toml), [uv Cargo.toml](https://github.com/astral-sh/uv/blob/main/Cargo.toml)
  - ripgrep has no toolchain file. It declares `edition = "2024"` and `rust-version = "1.96"`, and its CI matrix tests 1.96.0, stable, beta and nightly — [ripgrep Cargo.toml](https://github.com/BurntSushi/ripgrep/blob/master/Cargo.toml), [ripgrep ci.yml](https://github.com/BurntSushi/ripgrep/blob/master/.github/workflows/ci.yml)
  - tokio tracks `stable` in CI. It pins only special toolchains: a clippy version (`rust_clippy: '1.88'`), a dated nightly for miri, and `rust_min: '1.85'` — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)

#### MSRV policy and how to check it

- `rust-version` is "a bare version number". Cargo reports an error when the package is built with an older toolchain, and `--ignore-rust-version` overrides that. `cargo add` picks the newest dependency version compatible with the declared `rust-version` — [Cargo: rust-version](https://doc.rust-lang.org/cargo/reference/rust-version.html)
- Cargo's policy guidance lists example policies: "N-2", "every even release" and "every version from this calendar year". It notes that "The simplest policy to support is to always use the latest Rust version", and that changing `rust-version` "is assumed to be a minor incompatibility". Its listed expectations are complete, verified, patchable, and dependency support — [Cargo: rust-version](https://doc.rust-lang.org/cargo/reference/rust-version.html)
- Resolver `"3"` is "the default for `edition = "2024"`" and requires Rust 1.84 or newer. It changes the default of `resolver.incompatible-rust-versions` from `allow` to `fallback`, so the resolver prefers dependency versions whose `rust-version` fits your own — [Cargo resolver](https://doc.rust-lang.org/cargo/reference/resolver.html)
- Rust 1.85.0 (2025-02-20) stabilised the 2024 edition. Its tooling changes are the MSRV-aware resolver default, rustfmt style editions, and doctests merged into a single executable — [Rust 1.85.0 announcement](https://blog.rust-lang.org/2025/02/20/Rust-1.85.0/)
- The Cargo book's official MSRV CI job is `cargo hack check --rust-version --workspace --all-targets --ignore-private`, installed with `taiki-e/install-action@cargo-hack`. Its rationale: "A single platform is used as most projects are platform-agnostic" and "`cargo check` is used as most issues contributors will run into are API availability and not behavior" — [Cargo CI guide](https://doc.rust-lang.org/cargo/guide/continuous-integration.html)
- The same guide recommends a separate "latest dependencies" job:
  - it sets `CARGO_RESOLVER_INCOMPATIBLE_RUST_VERSIONS: allow`
  - it runs `cargo update`, build and test
  - it is marked `continue-on-error: true`

  — [Cargo CI guide](https://doc.rust-lang.org/cargo/guide/continuous-integration.html)
- Other MSRV tools: `cargo-msrv` finds the minimum version, and clippy's `incompatible_msrv` lint reads `rust-version` — [Cargo: rust-version](https://doc.rust-lang.org/cargo/reference/rust-version.html)
- tokio's `minrust` job installs `rust_min`, then runs `cargo check` (through cargo-hack) on the workspace. A separate `minimal-versions` job uses nightly to run `cargo hack --remove-dev-deps`, `cargo update -Z minimal-versions` and `cargo hack check` — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)

#### Formatting (rustfmt)

- `style_edition` defaults to the crate's Rust edition. It can be set in `rustfmt.toml` or `.rustfmt.toml`, or with `--style-edition`. Style editions came in with the 2024 edition (RFC 3338) — [Edition guide: rustfmt style edition](https://doc.rust-lang.org/edition-guide/rust-2024/rustfmt-style-edition.html)
- ripgrep's whole `rustfmt.toml` is two lines: `max_width = 79` and `use_small_heuristics = "max"`. uv runs `cargo fmt --all --check` in CI — [ripgrep rustfmt.toml](https://github.com/BurntSushi/ripgrep/blob/master/rustfmt.toml), [uv check-fmt.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/check-fmt.yml)

#### Linting (clippy, `[lints]`, `build.warnings`)

- `[lints.rust]` and `[lints.clippy]` set lint levels (`forbid`, `deny`, `warn` or `allow`). Each entry can take a signed `priority`, and lower numbers are overridden by higher ones. "Cargo only applies these to the current package and not to dependencies." The table has been respected since Rust 1.74 — [Cargo manifest: lints](https://doc.rust-lang.org/cargo/reference/manifest.html#the-lints-section)
- Workspace pattern, as uv uses it:
  - The root `[workspace.lints.clippy]` sets `pedantic = { level = "warn", priority = -2 }`, followed by allow-list entries such as `missing_errors_doc = "allow"`.
  - It sets restriction lints to warn: `print_stdout`, `print_stderr`, `dbg_macro`, `exit`, `get_unwrap`, `use_self`.
  - `[workspace.lints.rust]` sets `unsafe_code = "warn"` and `unreachable_pub = "warn"`.
  - Each member crate opts in with `[lints] workspace = true`.

  — [uv Cargo.toml](https://github.com/astral-sh/uv/blob/main/Cargo.toml), [uv crates/uv/Cargo.toml](https://github.com/astral-sh/uv/blob/main/crates/uv/Cargo.toml)
- tokio uses `[workspace.lints.rust] unexpected_cfgs = { level = "warn", check-cfg = [...] }` to declare custom cfgs such as `tokio_unstable` — [tokio Cargo.toml](https://github.com/tokio-rs/tokio/blob/master/Cargo.toml)
- `build.warnings` (environment variable `CARGO_BUILD_WARNINGS`) takes `warn` (the default), `allow` or `deny`. It affects only lint warnings of local packages. It has been respected since Rust 1.97 — [Cargo config](https://doc.rust-lang.org/cargo/reference/config.html)
- The Rust 1.97.0 announcement (2026-07-09) recommends `CARGO_BUILD_WARNINGS=deny` for CI because "using this feature doesn't invalidate the underlying build cache", unlike `RUSTFLAGS=-Dwarnings` — [Rust 1.97.0 announcement](https://blog.rust-lang.org/2026/07/09/Rust-1.97.0/)
- uv's clippy job sets `CARGO_BUILD_WARNINGS: deny` and runs `cargo clippy --workspace --all-targets --all-features --locked` on Linux and Windows. It also keeps `clippy.toml` for values such as `doc-valid-idents` — [uv check-lint.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/check-lint.yml), [uv clippy.toml](https://github.com/astral-sh/uv/blob/main/clippy.toml)
- tokio pins clippy to its own toolchain and runs `cargo clippy --workspace --tests --no-deps` — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)

#### Dependency and licence audit (cargo-deny, cargo-audit)

- cargo-deny runs four checks: licenses, bans ("specific crates in your graph, as well as duplicates"), advisories (vulnerabilities, unmaintained crates and yanked versions) and sources. `cargo deny check` runs all of them — [cargo-deny checks](https://embarkstudios.github.io/cargo-deny/checks/index.html)
- Current `[advisories]` semantics:
  - `unmaintained` defaults to `all`; the other values are `workspace`, `transitive` and `none`.
  - `unsound` defaults to `workspace`.
  - `yanked` defaults to `warn`.
  - "The version field is … no longer used."
  - `vulnerability`, `notice` and `severity-threshold` were removed. All advisories now emit errors, and you exempt with `ignore` entries that carry a `reason`.

  — [cargo-deny advisories config](https://embarkstudios.github.io/cargo-deny/checks/advisories/cfg.html)
- cargo-deny changes in 2026:
  - 0.19.0 to 0.19.8 (2026-01-08 to 2026-05-28): replaced `gix` with the `git` CLI, replaced the `rustsec` crate with its own advisory parsing, and added SARIF output (`--format sarif`), `advisories.unsound` and `[bans.allow-workspace]`.
  - 0.20.0 (2026-07-09) is a breaking CLI refactor that "remov[es] deprecated options". It adds the `bans.std-replacements` lint.
  - Unreleased: `advisories.ignore-expiry`.

  — [cargo-deny CHANGELOG](https://github.com/EmbarkStudios/cargo-deny/blob/main/CHANGELOG.md)
- tokio's `deny.toml` is a minimal real-world example:
  - `[graph] all-features = true`
  - licences allow `MIT` and `Apache-2.0`, with a `Unicode-3.0` exception for `unicode-ident`
  - `bans.multiple-versions = "allow"` and `wildcards = "deny"`
  - `sources.unknown-registry` and `unknown-git` set to `"deny"`

  — [tokio deny.toml](https://github.com/tokio-rs/tokio/blob/master/deny.toml)
- uv runs `cargo deny --all-features check licenses`, then `check sources`, then `check bans`. It also runs `cargo shear --deny-warnings` for unused dependencies and `typos` for spelling — [uv check-lint.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/check-lint.yml)
- cargo-audit checks `Cargo.lock` against the RustSec Advisory Database. `cargo audit bin` audits binaries, and works best with ones built by `cargo auditable`. `cargo audit fix` is experimental. Ignores live in `audit.toml`. The README recommends the `audit-check` action, whose latest release (v2.0.0) dates from 2024-09 — [cargo-audit](https://github.com/rustsec/rustsec/tree/main/cargo-audit), [audit-check](https://github.com/rustsec/audit-check/releases)

#### Tests (cargo-nextest)

- Nextest is configured in `.config/nextest.toml`. It has named profiles (select one with `-P` or `--profile`), inheritance (`inherits = "ci"`), `retries`, `slow-timeout`, `fail-fast` and `test-groups`. Its documentation suggests a `[profile.ci]` with `fail-fast = false` — [nextest configuration](https://nexte.st/docs/configuration/)
- Nextest does not run doctests. tokio's comment reads "Cargo nextest does not support doctest, so we run them separately (see nextest-rs/nextest#16)" — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)
- uv's nextest configuration:
  - `slow-timeout = { period = "10s", terminate-after = 12 }`, which stops a deadlocked test after 120 s
  - a `[profile.ci]` with `fail-fast = false`, `failure-output = "immediate-final"` and a JUnit path
  - per-OS profiles that inherit from `ci`
  - `test-groups` to serialise tests that are sensitive to I/O

  — [uv .config/nextest.toml](https://github.com/astral-sh/uv/blob/main/.config/nextest.toml)
- tokio installs nextest in every test job with `taiki-e/install-action@v2` (`tool: cargo-nextest`) and caches with `Swatinem/rust-cache@v2` — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)

#### Coverage (cargo-llvm-cov)

- cargo-llvm-cov can be installed with `taiki-e/install-action@cargo-llvm-cov`. It integrates with nextest through `cargo llvm-cov nextest`.
  - Output formats: `--lcov`, `--codecov`, `--cobertura`, `--json`, `--html` and `--text`.
  - `--fail-under-lines` enforces a threshold.
  - Doctests are off by default because they need nightly. Branch coverage needs nightly too.
  - It needs the `llvm-tools-preview` component.

  — [cargo-llvm-cov](https://github.com/taiki-e/cargo-llvm-cov)
- The README's CI example runs `cargo llvm-cov --all-features --workspace --codecov --output-path codecov.json`, then uploads with `codecov/codecov-action` (v7.1.1 is current, released 2026-09-17) — [cargo-llvm-cov](https://github.com/taiki-e/cargo-llvm-cov), [codecov-action](https://github.com/codecov/codecov-action/releases)

#### Semver checks and publishing

- cargo-semver-checks lints library API changes through rustdoc JSON. By default it uses the crates.io release as the baseline, and you can pick another with `--baseline-rev` or `--baseline-version`. It checks only the public API of libraries, not binaries.
  - It can miss breaking changes, including some "type changes", "changes in generics or lifetimes", and breaks that appear only under a subset of features.
  - It depends on unstable rustdoc JSON, so it supports stable and beta, and nightly only on a best-effort basis.

  — [cargo-semver-checks](https://github.com/obi1kenobi/cargo-semver-checks)
- tokio's `semver` job uses `obi1kenobi/cargo-semver-checks-action@v2` with `release-type: minor` and `feature-group: only-explicit-features`. It limits the check to the stable features — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)
- release-plz opens a release PR, writes the changelog with git-cliff, runs cargo-semver-checks, publishes to crates.io, and creates GitHub or GitLab releases — [release-plz docs](https://release-plz.dev/docs)
- release-plz's quickstart workflow has two jobs. `release-plz release` needs `contents: write` and `pull-requests: read`. `release-plz release-pr` needs `contents: write` and `pull-requests: write`, plus a concurrency group. Both check out with `fetch-depth: 0` and `persist-credentials: false`.
  - With trusted publishing you skip the `CARGO_REGISTRY_TOKEN` secret and grant `id-token: write` instead.
  - "New crates can't be published with trusted publishing", so the first release is manual.

  — [release-plz GitHub quickstart](https://release-plz.dev/docs/github/quickstart)
- crates.io trusted publishing went live in July 2025, implementing RFC 3691. It uses OIDC through `rust-lang/crates-io-auth-action`, needs `permissions: id-token: write`, works only with GitHub Actions, and the first release must be published manually — [crates.io development update, 2025-07](https://blog.rust-lang.org/2025/07/11/crates-io-development-update-2025-07/)
- dist (renamed from cargo-dist) generates its own `release.yml` with plan, build, host, publish and announce stages. It can produce shell, PowerShell, Homebrew, MSI and npm installers. You set it up with `dist init`, which writes `dist-workspace.toml`. Releases continue: v0.33.0 shipped 2026-09-11 — [dist repository](https://github.com/axodotdev/cargo-dist)

#### Cross-compilation

- ripgrep downloads the `cross` v0.2.5 binary in CI and sets `CARGO=cross` for Linux targets: musl, i686, aarch64, armv7, powerpc64, s390x and riscv64. It uses native runners for macOS, Windows and `windows-11-arm` — [ripgrep ci.yml](https://github.com/BurntSushi/ripgrep/blob/master/.github/workflows/ci.yml)
- cargo-zigbuild uses Zig as the linker. It supports glibc-versioned targets (for example `aarch64-unknown-linux-gnu.2.17`), musl, `universal2-apple-darwin` and windows-gnu. "windows-msvc" is not supported (use cargo-xwin for that). With Zig 0.15 or newer, crates that use bindgen may need clang 18 or newer — [cargo-zigbuild](https://github.com/rust-cross/cargo-zigbuild)
- cargo-xwin cross-compiles to the Windows MSVC target from non-Windows hosts (v0.23.1, 2026-08-13) — [cargo-xwin](https://github.com/rust-cross/cargo-xwin)

#### Caching

- Swatinem/rust-cache caches `~/.cargo` (the registry, git checkouts and binaries) and the dependency artefacts in `./target`, not the workspace crates.
  - The cache key includes the rustc version and hash, hashes of every `Cargo.lock` and `Cargo.toml`, the rust-toolchain files, `.cargo/config.toml`, and environment variables with the prefixes `CARGO CC CFLAGS CXX CMAKE RUST`.
  - It sets `CARGO_INCREMENTAL=0`.
  - Inputs include `save-if`, `shared-key`, `key`, `prefix-key`, `cache-on-failure`, `cache-bin`, `cache-targets`, `cache-all-crates`, `workspaces` and `cache-provider`.

  — [rust-cache](https://github.com/Swatinem/rust-cache)
- Cargo defaults to `CARGO_BUILD_INCREMENTAL=false` when the `CI` environment variable is set — [Cargo config](https://doc.rust-lang.org/cargo/reference/config.html)
- uv passes `save-if` from a workflow input so that only some runs write the cache — [uv test.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/test.yml)

#### Feature-combination testing

- cargo-hack offers:
  - `--each-feature`
  - `--feature-powerset`, which drops equivalent combinations; with `--depth 1` it equals `--each-feature`
  - `--group-features` and `--exclude-features`
  - `--rust-version` and `--version-range`
  - `--no-dev-deps` and `--ignore-private`

  Its recommended CI form is `cargo hack check --feature-powerset --no-dev-deps` — [cargo-hack](https://github.com/taiki-e/cargo-hack)
- tokio runs `cargo hack test --each-feature` — [tokio ci.yml](https://github.com/tokio-rs/tokio/blob/master/.github/workflows/ci.yml)
- `taiki-e/install-action` provides prebuilt binaries for cargo-deny, cargo-llvm-cov, cargo-semver-checks, typos, zizmor, shellcheck and shfmt — [install-action TOOLS.md](https://github.com/taiki-e/install-action/blob/main/TOOLS.md)

#### Herdsman as observed (local, read-only, branch `dev`)

- Toolchain: `rust-toolchain.toml` pins `channel = "1.96.1"` with `components = ["clippy", "rustfmt"]`. CI repeats the version in `env.RUST_TOOLCHAIN_VERSION: 1.96.1` and installs it with `dtolnay/rust-toolchain`. A gitignored `mise.local.toml` pins Zig 0.16.0 — herdsman's `rust-toolchain.toml`, herdsman's `.github/workflows/ci.yml`
- Manifest: `edition = "2021"`, with no `rust-version`, no `[lints]` table and no `rustfmt.toml`. `clippy.toml` sets only `too-many-arguments-threshold = 11` — herdsman's `Cargo.toml`, herdsman's `clippy.toml`
- Lint and tests:
  - `just lint` runs `cargo fmt --check` and `cargo clippy --all-targets --locked -- -D warnings`.
  - Tests run with `cargo nextest run --locked`, followed by Python maintenance tests and Bun tests.
  - `just windows-lint` runs clippy for `x86_64-pc-windows-msvc` from Unix, using an SDK fetched with `xwin` (`scripts/windows_cross.py`).

  — herdsman's `justfile`
- `.config/nextest.toml` has a single override: `filter = "kind(test)"` with `retries = 1`, for timing-sensitive integration tests. There is no `ci` profile and no JUnit output — herdsman's `.config/nextest.toml`
- CI hygiene:
  - Actions are pinned to commit SHAs with version comments.
  - `permissions: contents: read`, `persist-credentials: false`, and a concurrency group with cancel-in-progress.
  - A three-OS matrix: ubuntu, macos and windows.
  - Caches are saved only on push (`SAVE_CACHES`), and a separate cache keeps incremental compiler state.

  — herdsman's `.github/workflows/ci.yml`
- Not present:
  - no `deny.toml`, cargo-deny or cargo-audit
  - no coverage, no MSRV job, no semver checks
  - no ShellCheck or shfmt, although there are about 20 `*.sh` files, including the `#!/bin/sh` installer `distribution/install.sh`
  - no markdown linting or link checking, across 26 `.md` files plus the docs site

  `dependabot.yml` covers only `github-actions` and the docs-site `npm` packages, and says "Rust dependencies are left out on purpose" because they arrive with upstream merges. "Security alerts are on in the repository settings" — herdsman's `.github/dependabot.yml`
- Release builds use native runners: musl targets on ubuntu with `musl-tools` and `gcc-aarch64-linux-gnu`, darwin on macOS, and MSVC on Windows. The workflow is hand-written, not generated by dist, and does not use cross or zigbuild — herdsman's `.github/workflows/release.yml`
- The Unix installer is tested by `scripts/test_unix_installer.py`. The test builds a temporary `PATH` that holds only symlinks to the required commands, plus stubs for commands such as `uname` — herdsman's `scripts/test_unix_installer.py`

### Inferences

- Recommended Rust default for greenrepo (inferred from the sources above):
  - `rust-toolchain.toml` with an exact `channel` (no `stable`) and `components = ["clippy", "rustfmt"]`.
  - `rust-version` declared. Libraries test it with `cargo hack check --rust-version`. Binary-only crates may let the pinned toolchain stand as the policy.
  - Edition 2024, which brings resolver 3, so MSRV-aware resolution is automatic.
  - `[workspace.lints]` or `[lints]` in the manifest instead of CLI `-D` flags, so editors, agents and CI share one source of truth.
  - In CI, `CARGO_BUILD_WARNINGS=deny` (Rust 1.97 or newer); otherwise `cargo clippy ... -- -D warnings`.
  - `cargo fmt --all --check`.
  - `cargo nextest run --locked --profile ci`, plus `cargo test --doc` for libraries.
  - `cargo deny check` with a committed `deny.toml`, plus a scheduled run so new advisories surface without a code change.
  - `cargo llvm-cov nextest` as an optional, non-gating coverage job.
  - Libraries: `cargo-semver-checks` (or release-plz, which runs it) and crates.io trusted publishing.
  - Binaries: dist, or a hand-written release matrix on native runners.
- cargo-deny covers what cargo-audit does for `Cargo.lock` and adds licence, ban and source policy, so it is the stronger single default. cargo-audit remains useful mainly for `cargo audit bin` on shipped binaries. Its `audit-check` action has had no release since 2024-09, a weak maintenance signal.
- Avoid having two sources of truth for the toolchain, as herdsman does with `rust-toolchain.toml` plus a CI env var. rustup gives `rust-toolchain.toml` priority over the default that `dtolnay/rust-toolchain` sets, so if the two drift apart, rustup auto-installs the file's version, wasting time or silently testing a different compiler. Either let `actions-rust-lang/setup-rust-toolchain` read the file, or run `rustup show active-toolchain || rustup toolchain install`.
- Prefer `cross` only for exotic Linux targets (s390x, powerpc64 and the like), as ripgrep does, and pin the binary, since there has been no release since 2023. For a solo maintainer shipping common targets, native runners (`ubuntu-24.04-arm`, macOS, Windows) or cargo-zigbuild for glibc floors are simpler. Use cargo-xwin or xwin only for MSVC builds or lints from Linux.
- Herdsman against this profile:
  - Strong already: CI hygiene (SHA pins, read-only permissions, `persist-credentials: false`, caching saved only on push), the exact toolchain pin, `--locked` everywhere, nextest, and the cross-OS matrix.
  - Gaps: no licence, advisory or source policy (cargo-deny); lints held in the justfile rather than the manifest; edition 2021; no ShellCheck on the shipped `/bin/sh` installer and hook scripts; no markdown or link checks.
  - Not applicable: the MSRV job and semver checks, because herdsman is a binary distributed through GitHub releases rather than crates.io.
  - Timing: `CARGO_BUILD_WARNINGS` needs Rust 1.97, and herdsman pins 1.96.1.

### Gaps

- I did not fetch the nextest CI page (`nexte.st/docs/ci-features/` returned 404), so the `[profile.ci]` JUnit and partitioning guidance comes from uv's real configuration, not nextest's own docs.
- I did not verify whether `cargo-semver-checks` is being merged into Cargo itself. The README mentions only "documented interest".
- dist's maintenance health beyond the release cadence (v0.33.0 in September 2026, commits on 2026-10-09) was not investigated, and I found no primary statement about its funding or staffing.
- I did not find official guidance on whether binary-only crates should declare `rust-version`. The Cargo docs frame MSRV for packages generally.

## Go profile

### Takeaway

Recommended default:

- Let `go.mod` carry the pin. The `go` line sets the minimum version and is a strict requirement since Go 1.21, and an optional `toolchain` line names the exact toolchain. `actions/setup-go` reads both.
- Format and lint with golangci-lint v2, pinned, using a `formatters:` section for gofmt or gofumpt and goimports. `go vet` runs through golangci-lint's `govet` and through `go test`'s vet subset.
- In CI, run `go mod tidy -diff`, `govulncheck ./...` (module v1.8.0) and `go test -race -coverprofile`.
- Release with GoReleaser v2.

Changes from 2025 to 2026:

- golangci-lint v2, released 2025-03-24, with a new configuration format.
- `tool` directives (Go 1.24).
- Go 1.25 no longer adds a `toolchain` line when it updates the `go` line.
- The `go fix` modernizers (Go 1.26).
- `go mod init` now defaults to `go 1.(N-1).0` (Go 1.26).
- Go 1.27 changed gofmt alignment and enables the `stdversion` vet check in `go test`.

### Cited Findings

#### Current versions (checked 2026-10-10)

- The supported releases are Go 1.27.2 and 1.26.9, both released 2026-10-08. Go 1.27 came out 2026-08-19 and Go 1.26 on 2026-02-10. "Each major Go release is supported until there are two newer major releases." — [Go release history](https://go.dev/doc/devel/release), [go.dev/dl JSON](https://go.dev/dl/?mode=json)
- golangci-lint v2.14.0 was released 2026-09-24, and v2.0.0 on 2025-03-24. `golangci-lint-action` is at v9.3.0 (2026-06-29) — [golangci-lint releases](https://github.com/golangci/golangci-lint/releases), [golangci-lint-action](https://github.com/golangci/golangci-lint-action/releases)
- govulncheck, published in module `golang.org/x/vuln`, is at v1.8.0 (2026-09-08) according to the Go module proxy. The GitHub "latest release" page for golang/vuln still shows v1.1.4 (2025-01-13), so the GitHub releases page is stale for this module. `golang/govulncheck-action` is at v1.1.0 (2026-07-10) — [proxy.golang.org @latest](https://proxy.golang.org/golang.org/x/vuln/@latest), [govulncheck-action](https://github.com/golang/govulncheck-action/releases)
- GoReleaser v2.18.3 was released 2026-10-09; `goreleaser-action` is at v7.2.3. `actions/setup-go` is at v7.0.0 (2026-07-16) — [goreleaser releases](https://github.com/goreleaser/goreleaser/releases), [setup-go](https://github.com/actions/setup-go/releases)

#### Pinned toolchain (`go` and `toolchain` directives)

- "The `go` line declares the minimum required Go version for using the module or workspace". Since Go 1.21 it is "a mandatory requirement": older toolchains refuse to load the module. The line also sets the language version — [Go toolchains](https://go.dev/doc/toolchain)
- The `toolchain` line "declares a suggested toolchain". `GOTOOLCHAIN` can be `local`, a specific name, or `auto`/`<name>+auto`. The default, set in `$GOROOT/go.env`, is `GOTOOLCHAIN=auto`, which downloads newer toolchains as modules (`golang.org/toolchain`). Both lines are managed with `go get go@1.N.P toolchain@goX` and `go get toolchain@none` — [Go toolchains](https://go.dev/doc/toolchain)
- Go 1.25 (2025-08): "When the go command updates the `go` line in a `go.mod` or `go.work` file, it no longer adds a toolchain line specifying the command's current version" — [Go 1.25 release notes](https://go.dev/doc/go1.25)
- Go 1.26 (2026-02): `go mod init` with toolchain 1.N.X now writes `go 1.(N-1).0`, to encourage "modules that are compatible with currently supported versions of Go" — [Go 1.26 release notes](https://go.dev/doc/go1.26)
- Go 1.24 (2025-02) added `tool` directives (`go get -tool`, `go tool`), which replace the `tools.go` blank-import pattern. It also added `GOAUTH`, VCS-derived main-module versions in binaries, and `GODEBUG=toolchaintrace=1` — [Go 1.24 release notes](https://go.dev/doc/go1.24)
- `actions/setup-go` v7 reads `go-version-file`, and "If the `toolchain` directive is present, its version is used; otherwise, the action falls back to the `go` directive". Caching is on by default and keyed by `go.mod`, or by `cache-dependency-path` such as `go.sum`. v6 moved the action to node24 — [setup-go](https://github.com/actions/setup-go)
- How mature projects pin:
  - cli/cli declares `go 1.27.0` with `toolchain go1.27.2` and uses `go-version-file: 'go.mod'` — [cli/cli go.mod](https://github.com/cli/cli/blob/trunk/go.mod)
  - charmbracelet/gum declares `go 1.26.7` with no toolchain line — [gum go.mod](https://github.com/charmbracelet/gum/blob/main/go.mod)

#### Formatting, vet and linting (gofmt, goimports, golangci-lint v2, go vet)

- golangci-lint v2 configuration:
  - It requires `version: "2"`.
  - `linters.default` replaces `enable-all` and `disable-all`, and takes `standard`, `all`, `none` or `fast`.
  - Formatters live in their own `formatters` section.
  - `staticcheck` absorbed `gosimple` and `stylecheck`.
  - Exclusions use `presets` (`comments`, `common-false-positives`, `legacy` and `std-error-handling`).
  - `golangci-lint migrate` converts v1 configs, but does not carry comments over.

  — [golangci-lint migration guide](https://golangci-lint.run/docs/product/migration-guide/)
- The available formatters are gci, gofmt, gofumpt, goimports, golines and swaggo. `exclusions.generated` takes `strict`, `lax` or `disable`. `run.timeout` and `run.go` still exist — [golangci-lint config file](https://golangci-lint.run/docs/configuration/file/)
- The `standard` (default) linter set is errcheck, govet, ineffassign, staticcheck and unused. This was confirmed from the `WithGroups(config.GroupStandard)` calls in source — [builder_linter.go](https://github.com/golangci/golangci-lint/blob/main/pkg/lint/lintersdb/builder_linter.go)
- Installation:
  - The docs say "It's highly recommended installing a specific version", so that CI does not "start to fail all builds at the same time". In CI they recommend the official action.
  - They warn against `go install`, `go get` and `go tool`: the binary depends on your local Go version, "the resulting binary was not tested", tool dependencies can interfere with each other, the build can come from an unstable main branch, and it is slower.

  — [golangci-lint CI install](https://golangci-lint.run/docs/welcome/install/ci/), [golangci-lint local install](https://golangci-lint.run/docs/welcome/install/local/)
- `go test` runs "a high-confidence subset" of vet: atomic, bools, buildtag, directive, errorsas, ifaceassert, nilfunc, printf, stdversion, stringintconv and tests — [cmd/go](https://pkg.go.dev/cmd/go)
- Recent vet and gofmt changes:
  - Go 1.24 added the `tests` analyzer and reports non-constant format strings to printf.
  - Go 1.25 added `waitgroup` and `hostport`.
  - Go 1.27 enables `stdversion` by default in `go test`, and its printf check now reports `%w` applied to a pointer to an error type.
  - Go 1.27's gofmt fixes column alignment that "previously varied across CPU architectures", so "running Go 1.27 gofmt on previously formatted code may show small whitespace differences".

  — [Go 1.24](https://go.dev/doc/go1.24), [Go 1.25](https://go.dev/doc/go1.25), [Go 1.27](https://go.dev/doc/go1.27)
- Go 1.26 rewrote `go fix` as "the home of Go's modernizers", including `//go:fix inline`. Go 1.27 adds modernizers (`atomictypes`, `embedlit`, `slicesbackward`, `unsafefuncs`) and makes `go mod tidy` merge duplicate require blocks — [Go 1.26](https://go.dev/doc/go1.26), [Go 1.27](https://go.dev/doc/go1.27)
- cli/cli's lint job runs `go mod tidy -diff` and `go fix -diff ./...`, then `golangci-lint-action` with `version-file: .github/golangci-lint-version`. Its `.golangci.yml` uses `linters.default: none` with about 20 explicit linters (govet, gocritic, nolintlint, unused, bodyclose, and so on) and `formatters.enable: [gofmt]` — [cli/cli lint.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/lint.yml), [cli/cli .golangci.yml](https://github.com/cli/cli/blob/trunk/.golangci.yml)
- charmbracelet/gum keeps the `standard` default, adds linters (gosec, revive, misspell, wrapcheck, nolintlint and others), and enables the `gofumpt` and `goimports` formatters. Its `exclusions.presets` include `common-false-positives` — [gum .golangci.yml](https://github.com/charmbracelet/gum/blob/main/.golangci.yml)

#### Vulnerability, dependency and licence audit

- govulncheck "only surfaces vulnerabilities that actually affect you, based on which functions in your code are transitively calling vulnerable functions". It reads the reviewed Go vulnerability database in OSV format. Usage: `go install golang.org/x/vuln/cmd/govulncheck@latest` followed by `govulncheck ./...` — [Go vulnerability management](https://go.dev/doc/security/vuln/)
- cli/cli runs govulncheck through `go run golang.org/x/vuln/cmd/govulncheck@$version ./...`, with the version pinned in `.github/govulncheck-version`. It uses source mode because "On go1.25+, to make `-mode binary` work we need to make sure the binary is built with `go build -buildvcs=false`". It also runs `make licenses-check` (go-licenses) for every release platform — [cli/cli lint.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/lint.yml)
- charmbracelet's shared workflow runs `govulncheck@latest` and `go mod tidy` followed by `git diff --exit-code`, then `go build ./...` and `go test ./...` on ubuntu, macos and windows — [charmbracelet/meta build.yml](https://github.com/charmbracelet/meta/blob/main/.github/workflows/build.yml)

#### Tests, race detector and coverage

- `go test -race` "requires cgo to be enabled", and a C compiler on non-Darwin systems. It is supported on Linux (amd64, ppc64le, arm64, s390x, loong64), FreeBSD and NetBSD amd64, darwin (amd64, arm64) and windows/amd64. Memory use can grow 5 to 10 times and execution time 2 to 20 times — [Go race detector](https://go.dev/doc/articles/race_detector)
- `-covermode`: "The default is 'set' unless -race is enabled, in which case it is 'atomic'." `-coverpkg` applies coverage across matching packages — [cmd/go](https://pkg.go.dev/cmd/go)
- Since Go 1.20, `go build -cover` combined with `GOCOVERDIR` and `go tool covdata` (`percent`, `textfmt`, `merge`) gives integration-test coverage of binaries. Profiles are lost if the program panics — [Go integration coverage](https://go.dev/doc/build-cover)
- cli/cli runs `go test -race -tags=integration ./...` on ubuntu, windows and macos — [cli/cli go.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/go.yml)

#### Module major versions

- Version 2 and later need a `/vN` module path suffix, and "a new major version is a new module". Every import path must change. The guide recommends branching (for example a `v2` branch) and releasing a major version "only when it's absolutely necessary" — [Go module major versions](https://go.dev/doc/modules/major-version)

#### Build and publishing (GoReleaser)

- The GoReleaser workflow uses `goreleaser/goreleaser-action@v7` with `version: "~> v2"` and `args: release --clean`. It requires `fetch-depth: 0` and `permissions: contents: write`; `id-token: write` is needed for cosign keyless signing. "GoReleaser Action will not install nor setup any other software needed to release" — [GoReleaser GitHub Actions](https://goreleaser.com/ci/actions/)
- gum's `.goreleaser.yml` is `version: 2` and pulls shared configuration through `includes: from_url` — [gum .goreleaser.yml](https://github.com/charmbracelet/gum/blob/main/.goreleaser.yml)

### Inferences

- Recommended Go default for greenrepo:
  - `go.mod` with `go 1.(latest-1).0` for libraries, the floor that `go mod init` now writes, or the current release for applications.
  - Add `toolchain go1.X.Y` when you want exact reproducibility; setup-go honours it.
  - `.golangci.yml` with `version: "2"`, `linters.default: standard` plus a short, curated list (for example gocritic, nolintlint, misspell, bodyclose), and `formatters.enable: [gofumpt, goimports]` or plain `gofmt`.
  - golangci-lint pinned through the action's `version:` input.
  - `go mod tidy -diff`, `go test -race -coverprofile=coverage.out ./...`, and `govulncheck ./...` pinned to a version.
  - GoReleaser v2 for binaries.
- Use a pinned golangci-lint and a pinned Go toolchain together. Go 1.27's gofmt alignment change shows that mixed formatter versions between an agent's local environment and CI produce spurious diffs.
- A `tool` directive is the idiomatic way to pin small helper tools (govulncheck, stringer) in `go.mod`. golangci-lint explicitly discourages this for itself because of dependency interference, so pin it in CI and run it from a binary locally.
- `go vet` needs no separate step when golangci-lint's `govet` is enabled, which it is in `standard`. `go test` also runs the high-confidence vet subset.
- Licence audit has no first-party Go tool. cli/cli's go-licenses check is the mature-repository example, and the dependency review action is an option for supply-chain policy (other researchers cover GitHub-native features).

### Gaps

- I did not fetch the golangci-lint-action v9 README, so its input names (`version`, `version-file`, `only-new-issues`) and caching specifics come from cli/cli's usage, not the action's own docs.
- I did not fetch govulncheck's exit-code, SARIF/OpenVEX and binary-mode details from `pkg.go.dev`. The overview page did not cover them.
- I did not find authoritative guidance on choosing between gofumpt and gofmt. It is a matter of preference: cli/cli uses gofmt and gum uses gofumpt.

## Bash profile

### Takeaway

Recommended default:

- ShellCheck 0.11.0, pinned. Install it yourself, because the `ubuntu-24.04` runner's apt package is 0.9.0.
- `shfmt -d` (v3.14.1), configured through `.editorconfig`.
- bats-core 1.14 with bats-support and bats-assert for tests.
- Choose `#!/bin/sh` (POSIX) for install scripts that must run anywhere, and bash for everything else.
- Use strict mode deliberately, not as a talisman: `set -e` has well-documented holes, and `set -u` breaks empty arrays before bash 4.4, which includes macOS's bash 3.2.
- Test installers across shells and OSes: dash, bash, busybox ash, zsh, and macOS.

### Cited Findings

#### Current versions and runner facts (checked 2026-10-10)

- ShellCheck v0.11.0 was released 2025-08-03 and is the latest release — [ShellCheck v0.11.0](https://github.com/koalaman/shellcheck/releases/tag/v0.11.0)
- The GitHub `ubuntu-24.04` image (20261004) lists shellcheck `0.9.0-1` among its apt packages — [Ubuntu2404-Readme](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md)
- The macOS 15 arm64 runner image ships `Bash 3.2.57(1)-release` — [macos-15-arm64-Readme](https://github.com/actions/runner-images/blob/main/images/macos/macos-15-arm64-Readme.md)
- shfmt (mvdan/sh) v3.14.1 was released 2026-09-06; bats-core v1.14.0 on 2026-07-21; `bats-core/bats-action` 4.0.0 on 2026-02-08 — [mvdan/sh releases](https://github.com/mvdan/sh/releases), [bats-core releases](https://github.com/bats-core/bats-core/releases), [bats-action](https://github.com/bats-core/bats-action/releases)

#### ShellCheck

- Changes in 0.11.0:
  - New checks: SC2327 and SC2328 (capturing output of redirected commands), SC2329 (functions that are never invoked), SC2330 to SC2332, and SC3062.
  - SC2002 (useless use of cat) is now disabled by default.
  - The optional `avoid-negated-conditions` check was added.
  - POSIX.1-2024 updates: SC3012 is relaxed and SC3013 removed.
  - Bash 5.3 syntax support.

  — [ShellCheck v0.11.0](https://github.com/koalaman/shellcheck/releases/tag/v0.11.0)
- Directives:
  - Forms are `# shellcheck disable=`, `enable=`, `source=`, `source-path=`, `shell=` and `external-sources=`.
  - A directive placed right after the shebang applies to the whole file; otherwise it applies to the next command.
  - `.shellcheckrc` is looked up in the script's directory and its parents, then in `~/.shellcheckrc` and `~/.config/shellcheckrc`. "Only the first-found file will be used."
  - Example: `source-path=SCRIPTDIR`, `external-sources=true`, `enable=quote-safe-variables`.
  - Optional checks are listed by `shellcheck --list-optional`.

  — [ShellCheck Directive wiki](https://github.com/koalaman/shellcheck/wiki/Directive)
- Installation and integration options: prebuilt binaries, distribution packages, and the pre-commit hook in `koalaman/shellcheck-precommit` — [ShellCheck README](https://github.com/koalaman/shellcheck)
- uv downloads a pinned ShellCheck release, marked with a `# renovate: datasource=github-releases` comment, and runs `find . -name '*.sh' -type f | xargs shellcheck --shell bash --severity style` — [uv check-lint.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/check-lint.yml)
- `taiki-e/install-action` can install `shellcheck` and `shfmt` from their GitHub releases — [install-action TOOLS.md](https://github.com/taiki-e/install-action/blob/main/TOOLS.md)

#### shfmt

- Flags: `-d` ("Error with a diff when the formatting differs"), `-l`, `-w`, `-i` (0 means tabs, the default), `-ci`, `-bn`, `-sr`, `-s` (simplify), `-ln` (`bash`, `posix`, `mksh`, `bats`, `zsh` or `auto`) and `-f` (find shell files). `-kp` and `-fn` are deprecated — [shfmt man page](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd)
- EditorConfig:
  - shfmt reads `indent_style`, `indent_size`, `language_dialect` (formerly `shell_variant`), `simplify`, `binary_next_line`, `case_indent` (formerly `switch_case_indent`), `space_redirects`, `function_next_line`, `block_next_line`, `minify` and `ignore`.
  - "If any parser or printer flags are given to the tool, no EditorConfig formatting options will be used."
  - The man page suggests `shfmt -d .` for CI, and `shfmt -i 2 -ci -bn` to approximate the Google style.

  — [shfmt man page](https://github.com/mvdan/sh/blob/master/cmd/shfmt/shfmt.1.scd)

#### bats-core

- The tutorial's layout puts `test/bats` (bats-core), `test/test_helper/bats-support` and `test/test_helper/bats-assert` in as git submodules. It provides `setup`, `teardown`, `setup_file` and `teardown_file`. `run` captures `$output` and `$status`, and "run never fails the test" — [bats tutorial](https://bats-core.readthedocs.io/en/stable/tutorial.html)
- Installation options: distribution packages, Homebrew, `npm install -g bats`, a source `install.sh`, and the Docker image `bats/bats` — [bats installation](https://bats-core.readthedocs.io/en/stable/installation.html)

#### Strict mode and its caveats

- On `set -e`:
  - Commands in `if` tests and in `&&`/`||` lists are immune.
  - Functions called in a conditional context lose errexit inside them.
  - Command substitutions do not inherit errexit unless `inherit_errexit` is set (bash 4.4).
  - Without `pipefail`, only the rightmost command of a pipeline counts.
  - `local var=$(cmd)` masks failures.
  - The page's advice is "don't use set -e. Add your own error checking instead."

  — [BashFAQ/105](https://mywiki.wooledge.org/BashFAQ/105)
- On `set -u`: "Turning this feature on **breaks** many scripts that do not even contain errors". "An empty array becomes an error (in bash 4.3, but not in bash 4.4…)". The workaround is expansions such as `"${1-}"` — [BashFAQ/112](https://mywiki.wooledge.org/BashFAQ/112)
- Google's shell style guide:
  - Bash is "the only shell scripting language allowed for executables".
  - Rewrite scripts longer than 100 lines in a structured language.
  - 2-space indentation and an 80-column limit.
  - Use `[[ … ]]` and `"${var}"`.
  - Declare and assign separately when the value comes from command substitution, "as the `local` builtin does not propagate the exit code".
  - Use a `main "$@"` function.
  - ShellCheck "is recommended for all scripts, large or small".

  — [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)

#### POSIX sh versus bash portability

- "POSIX.1-2024 introduced `pipefail`", and "`dash` version 5.13 included `pipefail` along with other POSIX.1-2024 features". ShellCheck still flags it with SC3040 in `sh` scripts, because older shells reject it — [ShellCheck SC3040](https://www.shellcheck.net/wiki/SC3040)
- nvm's fast test workflow runs its suite under `sh`, `bash`, `dash` and `zsh` (ksh is commented out) through a `script -q -e -c "<shell> {0}"` custom shell. It varies the awk implementation, and has separate macOS, Alpine and Xenial workflows — [nvm tests-fast.yml](https://github.com/nvm-sh/nvm/blob/master/.github/workflows/tests-fast.yml), [nvm workflows](https://github.com/nvm-sh/nvm/tree/master/.github/workflows)
- herdsman's `distribution/install.sh` starts with `#!/bin/sh`. Its tests run the script with a hermetic `PATH` holding only the required POSIX utilities, with stubs for `uname` and the download step — herdsman's `distribution/install.sh`, herdsman's `scripts/test_unix_installer.py`

### Inferences

- Recommended Bash default for greenrepo:
  - `.shellcheckrc` with `external-sources=true` and `source-path=SCRIPTDIR`.
  - ShellCheck 0.11.0 pinned and installed by `taiki-e/install-action` or a release download, not the runner's apt 0.9.0.
  - `.editorconfig` carrying the shfmt settings (for example `[*.sh] indent_style = space`, `indent_size = 2`, `binary_next_line = true`, `switch_case_indent = true`), so that a bare `shfmt -d .` in CI and editor format-on-save agree.
  - bats-core with the support and assert helpers.
  - For bash scripts, `set -euo pipefail` plus explicit checks is a reasonable default, if the profile documents the BashFAQ/105 exceptions and bans `local x=$(cmd)` (also SC2155).
  - For `#!/bin/sh` scripts, use `set -eu` only. `pipefail` is not portable to dash before 0.5.13 or to older busybox.
- macOS runners ship bash 3.2, so any bash script meant for macOS users must avoid bash 4+ features: associative arrays, `mapfile`, `${var,,}`, and empty arrays under `set -u`. A `macos-latest` CI leg is the cheapest test of that.
- The cheapest credible matrix for install scripts: run `sh`, `dash`, `bash` and `zsh` on ubuntu; `alpine` in a container (busybox ash); and macOS. Stub network and OS detection with a hermetic `PATH`, as herdsman does, so the tests stay deterministic.
- Bash has no type checker. ShellCheck stands in for both "linting" and "type checking" in the common rules. Dependency and licence audit usually does not apply, apart from pinning vendored helpers such as bats submodules.

### Gaps

- I did not verify which dash version current Ubuntu LTS images ship. A search snippet claimed that Ubuntu 26.04 still ships dash 0.5.12, but I could not confirm that from a primary source, so I omitted it.
- I did not read the `bats-core/bats-action` 4.0.0 README for its inputs (for example `support-version` and `assert-version`).
- I found no standard tool or official guidance for testing install scripts across platforms. The nvm and herdsman patterns are practice examples, not standards.

## Markdown-only repository profile

### Takeaway

Recommended default:

- `.editorconfig` (spec 0.17.2) for whitespace and newlines.
- markdownlint-cli2 v0.23.3 with a `.markdownlint-cli2.jsonc`, run in CI through `markdownlint-cli2-action`.
- lychee (v0.24.2) through `lychee-action` v2.9.0, with a `.lycheecache` cache and `GITHUB_TOKEN`, run on PRs and on a schedule.
- Optional: Vale v3.24 for prose, now in the `vale-cli` organisation with `vale-action` v3; Prettier 3.9 with `proseWrap` for formatting, paired with markdownlint's `prettier` style to avoid rule conflicts; and `typos` for spelling.

Changes in 2026:

- errata-ai renamed itself vale-cli, and vale-action v3 brought behaviour changes.
- markdownlint-cli2 0.23.x.

### Cited Findings

#### Current versions (checked 2026-10-10)

- markdownlint-cli2 v0.23.3 was released 2026-09-20; `markdownlint-cli2-action` is at v24.2.0 (2026-08-02) — [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2), [markdownlint-cli2-action](https://github.com/DavidAnson/markdownlint-cli2-action/releases)
- lychee v0.24.2 was released 2026-05-01; `lychee-action` is at v2.9.0 (2026-07-09) — [lychee releases](https://github.com/lycheeverse/lychee/releases), [lychee-action](https://github.com/lycheeverse/lychee-action/releases)
- Vale v3.24.0 was released 2026-10-01. The GitHub organisation `errata-ai` was renamed `vale-cli`, and the action README says "You must update your workflows" from `errata-ai/vale-action@v2` to `vale-cli/vale-action@v3` (v3.0.0 shipped 2026-08-03) — [vale releases](https://github.com/vale-cli/vale/releases), [vale-action](https://github.com/vale-cli/vale-action)
- Prettier 3.9.9 was released 2026-09-23; `crate-ci/typos` is at v1.51.1 (2026-10-06) — [prettier releases](https://github.com/prettier/prettier/releases), [typos releases](https://github.com/crate-ci/typos/releases)

#### markdownlint-cli2

- Configuration files, in precedence order: `.markdownlint-cli2.jsonc`, then `.yaml`, then `.cjs`/`.mjs`, then the `.markdownlint.*` files. Key options are `config`, `globs`, `ignores`, `gitignore`, `fix`, `customRules`, `frontMatter`, `outputFormatters` (JSON, JUnit and SARIF) and `overrides`.
  - The CLI takes `--fix`, `--config`, `--configPointer` and `--format`.
  - Exit codes: 0 means clean, 1 means lint errors, 2 means a tool failure.
  - Differences from markdownlint-cli: configuration is allowed in every directory, and `.markdownlintrc` and `.markdownlintignore` are not supported.

  — [markdownlint-cli2 README](https://github.com/DavidAnson/markdownlint-cli2)
- markdownlint ships `style/prettier.json`, which "Disables rules that may conflict with Prettier". It turns off `line-length`, `ul-indent`, `list-marker-space`, `no-multiple-blanks`, `heading-style`, `emphasis-style` and others — [markdownlint style/prettier.json](https://github.com/DavidAnson/markdownlint/blob/main/style/prettier.json)

#### lychee (link checking)

- lychee checks links in Markdown, HTML, reStructuredText and websites.
  - `--offline` checks only local files.
  - `--include-fragments` checks anchors.
  - `--cache` and `--max-cache-age` keep a request cache in `.lycheecache`.
  - Other flags: `--exclude` (regex), `--accept` (status codes), `--root-dir` and `--base-url`, and `--github-token` to avoid GitHub rate limits.
  - Configuration lives in `lychee.toml` and `.lycheeignore`.

  — [lychee README](https://github.com/lycheeverse/lychee)
- The official CI recipe uses `lycheeverse/lychee-action@v2` with `--cache --max-cache-age 1d`, restore and save steps for `.lycheecache` (saving with `if: always()`), and `GITHUB_TOKEN` in the environment. Optional pieces are `fail: false`, JUnit output and `mikepenz/action-junit-report`. The recipe still shows `actions/cache@v4`, while the current release is v6.1.0 — [lychee GitHub CI docs](https://lychee.cli.rs/continuous-integration/github/), [actions/cache releases](https://github.com/actions/cache/releases)

#### Vale (prose linting)

- `.vale.ini` keys:
  - `StylesPath`, which "has to exist".
  - `MinAlertLevel` (`suggestion`, `warning` or `error`).
  - `Packages` (Microsoft, Google, write-good, proselint, alex), installed by `vale sync`.
  - `Vocab`, whose files are `config/vocabularies/<Name>/accept.txt` and `reject.txt`.
  - `[*.md] BasedOnStyles`.
  - From v3.22, `[formats]` can map extension-less names (for example `COMMIT_EDITMSG = md`). From v3.24, sections can be conditional: `[*.md if .Meta.published == false]`.

  — [Vale .vale.ini docs](https://docs.vale.sh/topics/.vale.ini)
- vale-action v3.0.0 behaviour changes:
  - reviewdog moves from 0.17.0 to 0.21.0, so push-triggered runs with `github-pr-*` reporters now lint and can fail.
  - The `level` input is now honoured.
  - `fail_on_error: true` fails on errors only (`fail_level: any` restores the old behaviour).
  - New: suggested fixes through `reporter: github-pr-review`, macOS, Windows and ARM runners, caching (`sync: false`), and checksum verification.
  - Pull requests from forks get a read-only token, so they cannot receive suggestions.

  — [vale-action v3.0.0](https://github.com/vale-cli/vale-action/releases/tag/v3.0.0), [vale-action README](https://github.com/vale-cli/vale-action)

#### Prettier, EditorConfig and docs-as-code

- Prettier's `proseWrap` takes `always`, `never` or `preserve`; the default, `preserve`, has applied since 1.9.0. `printWidth` defaults to 80 and "is not the hard upper allowed line length limit". `endOfLine` has defaulted to `lf` since 2.0. `embeddedLanguageFormatting: "auto"` formats code blocks. Prettier reads `.editorconfig` for `indent_style`, `indent_size`/`tab_width` and `end_of_line` — [Prettier options](https://prettier.io/docs/options)
- EditorConfig spec version 0.17.2:
  - Properties: `indent_style`, `indent_size`, `tab_width`, `end_of_line`, `charset`, `spelling_language`, `trim_trailing_whitespace`, `insert_final_newline` and `root`.
  - The search walks up parent directories until it finds `root = true`.
  - `max_line_length` is not a spec property.

  — [EditorConfig spec](https://spec.editorconfig.org/)
- Docs-as-code means "writing documentation with the same tools as code": issue trackers, version control, plain-text markup, code reviews and automated tests. It lets teams "block merging of new features if they don't include documentation" — [Write the Docs: Docs as Code](https://www.writethedocs.org/guide/docs-as-code/)

### Inferences

- Recommended markdown-only default for greenrepo:
  - `.editorconfig` with `root = true`, `[*] end_of_line = lf`, `insert_final_newline = true`, `trim_trailing_whitespace = true`, `charset = utf-8`, and `[*.md] trim_trailing_whitespace = false` if two-space hard breaks are allowed.
  - `.markdownlint-cli2.jsonc` setting MD013 to a chosen width, and `"gitignore": true`.
  - In CI, markdownlint-cli2 on PRs, plus lychee with `--cache --include-fragments` on PRs and a weekly schedule. The schedule catches link rot that arrives without any commit.
- Run lychee offline (`--offline`) as a required PR gate, which is deterministic, and run full network checks on a schedule that opens an issue. External links fail intermittently, so making them a hard PR gate frustrates a solo maintainer and their agents.
- Prettier and markdownlint overlap. Pick one formatter of record: either markdownlint `--fix`, or Prettier with markdownlint extending `markdownlint/style/prettier`. Running both without that style produces conflicting fixes.
- Vale is worth adding only with a small curated vocabulary. Without one, its spelling and terminology rules generate noise on technical names. `typos` is a lower-noise spelling check that uv also runs in CI.
- For markdown-only repositories, "type checking", coverage and dependency audit do not apply. "Build" is the static site build, if any; Starlight's `npm run build` fails on broken internal links, per herdsman's AGENTS.md. "Publish" is a GitHub Pages deploy.

### Gaps

- I did not read the `markdownlint-cli2-action` v24 README for its current inputs (`globs`, `config`, `fix`), or for whether it pins Node 24.
- I did not confirm whether Prettier maps EditorConfig's `max_line_length` to `printWidth`. The options page excerpt did not mention it, so I left it out.
- I found no primary source comparing Vale with alternatives such as textlint, alex or proselint as standalone tools, for 2026.

## Example GitHub Actions jobs (with caching)

### Takeaway

Each example follows the conventions the mature repositories share:

- `permissions: contents: read`, `persist-credentials: false` and a concurrency group.
- Pinned tool versions, and caches saved only from the default branch.

In a real greenrepo template, pin every `uses:` to a full commit SHA with a version comment, as herdsman, uv and cli/cli do. Tags are shown below for readability.

### Cited Findings

- SHA pinning with a version comment (`actions/checkout@3d3c42e… # v7.0.1`) is the practice in uv, cli/cli and herdsman. All three also set `persist-credentials: false` and read-only permissions — [uv check-lint.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/check-lint.yml), [cli/cli lint.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/lint.yml), herdsman's `.github/workflows/ci.yml`
- Current action majors: `actions/checkout` v7.0.1 (2026-07-20), `actions/cache` v6.1.0 (2026-06-26), `actions/setup-go` v7.0.0, `golangci-lint-action` v9.3.0, `Swatinem/rust-cache` v2.9.2, `lychee-action` v2.9.0, `markdownlint-cli2-action` v24.2.0 and `vale-action` v3.0.0 — [checkout](https://github.com/actions/checkout/releases), [cache](https://github.com/actions/cache/releases)
- The Rust job's toolchain step uses the command from the rustup 1.28.0 release notes — [rustup CHANGELOG](https://github.com/rust-lang/rustup/blob/main/CHANGELOG.md)
- The Rust job's warnings setting follows the Rust 1.97 announcement — [Rust 1.97.0](https://blog.rust-lang.org/2026/07/09/Rust-1.97.0/)
- The MSRV job comes from the Cargo CI guide — [Cargo CI guide](https://doc.rust-lang.org/cargo/guide/continuous-integration.html)
- The coverage job comes from the cargo-llvm-cov README — [cargo-llvm-cov](https://github.com/taiki-e/cargo-llvm-cov)
- The Go job follows cli/cli's lint workflow and the setup-go docs — [cli/cli lint.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/lint.yml), [setup-go](https://github.com/actions/setup-go)
- The lychee caching pattern comes from lychee's CI recipe — [lychee GitHub CI docs](https://lychee.cli.rs/continuous-integration/github/)
- How `taiki-e/install-action` handles versions and integrity:
  - It accepts `tool: <tool_name>@<version>`.
  - When the version is omitted, the installed tool version "is associated with the install-action version", so pinning the action by tag or SHA also pins the tools.
  - Unpinned tools follow upstream releases "with a delay of one to a few days", a deliberate "dependency cooldown" against supply-chain attacks. An explicit version bypasses it.
  - For tools installed from GitHub Releases, it verifies SHA256 checksums, and artifact attestations or signatures where the tool publishes them.

  — [install-action README](https://github.com/taiki-e/install-action/blob/main/README.md)

#### Rust example

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1" # weekly: new RustSec advisories without code changes
permissions:
  contents: read
concurrency:
  group: ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
env:
  CARGO_TERM_COLOR: always
  CARGO_BUILD_WARNINGS: deny # Rust 1.97+; does not invalidate the build cache like RUSTFLAGS
jobs:
  check:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - name: Install the toolchain from rust-toolchain.toml
        shell: bash
        run: rustup show active-toolchain || rustup toolchain install
      - uses: Swatinem/rust-cache@v2
        with:
          save-if: ${{ github.ref == 'refs/heads/main' }}
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-nextest
      - run: cargo fmt --all --check
      - run: cargo clippy --workspace --all-targets --all-features --locked
      - run: cargo nextest run --workspace --all-features --locked --profile ci
      - run: cargo test --doc --workspace --all-features --locked # nextest skips doctests
  deny:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: EmbarkStudios/cargo-deny-action@v2 # licences, bans, sources, advisories
  msrv: # libraries only
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: taiki-e/install-action@cargo-hack
      - run: cargo hack check --rust-version --workspace --all-targets --ignore-private
  coverage: # informational, not a merge gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - run: rustup component add llvm-tools-preview
      - uses: Swatinem/rust-cache@v2
        with:
          save-if: ${{ github.ref == 'refs/heads/main' }}
      - uses: taiki-e/install-action@v2
        with:
          tool: cargo-llvm-cov,cargo-nextest
      - run: cargo llvm-cov nextest --workspace --all-features --lcov --output-path lcov.info
```

#### Go example

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
concurrency:
  group: ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: actions/setup-go@v7 # caches modules and build cache by default
        with:
          go-version-file: go.mod # honours the toolchain directive when present
      - run: go mod tidy -diff
      - uses: golangci/golangci-lint-action@v9
        with:
          version: v2.14.0 # pin; config in .golangci.yml (version: "2")
      - run: go run golang.org/x/vuln/cmd/govulncheck@v1.8.0 ./...
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: actions/setup-go@v7
        with:
          go-version-file: go.mod
      - run: go test -race -coverprofile=coverage.out ./... # -race implies covermode=atomic
      - run: go build ./...
```

#### Bash example

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: taiki-e/install-action@v2 # runner apt shellcheck is 0.9.0; pin current releases
        with:
          tool: shellcheck@0.11.0,shfmt@3.14.1
      - run: shfmt -f . | xargs shellcheck # .shellcheckrc carries shell/source settings
      - run: shfmt -d . # style comes from .editorconfig
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest] # macOS covers bash 3.2
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
          submodules: true # test/bats, bats-support, bats-assert
      - run: test/bats/bin/bats test/
  installer:
    strategy:
      fail-fast: false
      matrix:
        shell: [sh, dash, bash, zsh]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - run: sudo apt-get install -y zsh
      - run: ${{ matrix.shell }} ./install.sh --dry-run
  installer-alpine: # busybox ash
    runs-on: ubuntu-latest
    container: alpine:3
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - run: sh ./install.sh --dry-run
```

#### Markdown-only example

```yaml
name: docs
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1" # weekly external link check catches link rot
permissions:
  contents: read
jobs:
  markdownlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: DavidAnson/markdownlint-cli2-action@v24 # reads .markdownlint-cli2.jsonc
        with:
          globs: "**/*.md"
  links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: actions/cache/restore@v6
        with:
          path: .lycheecache
          key: lychee-${{ github.sha }}
          restore-keys: lychee-
      - uses: lycheeverse/lychee-action@v2
        with:
          args: >-
            --cache --max-cache-age 1d --include-fragments --no-progress
            ${{ github.event_name == 'pull_request' && '--offline' || '' }}
            './**/*.md'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - uses: actions/cache/save@v6
        if: always()
        with:
          path: .lycheecache
          key: lychee-${{ github.sha }}
  prose: # optional
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: vale-cli/vale-action@v3 # renamed from errata-ai/vale-action
```

### Inferences

- The Rust `coverage` job is informational. Coverage thresholds (`--fail-under-lines`) frustrate solo maintainers more than they protect them, so greenrepo could make "coverage reported" the rule and leave "coverage gated" optional.
- The `schedule` triggers in the Rust and markdown examples matter for a solo maintainer. Advisories and link rot arrive without commits, and a quiet repository otherwise never re-runs its checks.
- Swatinem/rust-cache's `save-if` and herdsman's push-only `SAVE_CACHES` both address GitHub's per-repository cache limit. PR runs restore but do not save.

### Gaps

- I wrote the example jobs from the cited documentation and repositories. They have not been run, so test them before greenrepo publishes them as templates.
- I did not test the Bash job's `shfmt -f . | xargs shellcheck` against file names that contain spaces. Use `-print0`-style handling if the repository has such files.
