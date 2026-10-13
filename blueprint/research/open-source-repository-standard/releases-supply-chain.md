# Releases, publishing and supply-chain security (as of October 2026)

Scope: versioning, changelogs, release automation, artifact signing and provenance, registry publishing, install channels, dependency updates and supply-chain security, and publishing docs with a release. Levels used in the inferences: **L1** every repository, **L2** public project, **L3** project with users. Tool versions and dates below were read from each project's GitHub releases API on 2026-10-10 unless another source is given.

## Versioning, Conventional Commits, changelogs and release automation

### Takeaway

SemVer (with an explicit 0.x policy) plus Conventional Commits is the default, and a "release PR" tool (release-please for most stacks, release-plz for Rust crates, changesets for JS monorepos) is the low-friction way to automate it; binary distribution is a separate job (dist/cargo-dist for Rust, GoReleaser for Go). Changelogs should stay human-curated (Keep a Changelog shape), with generated notes or git-cliff output as raw material.

### Cited Findings

#### Versioning schemes

- SemVer 2.0.0: "Major version zero (0.y.z) is for initial development. Anything MAY change at any time." Pre-releases are a hyphen suffix, build metadata a plus suffix. FAQ: start at 0.1.0 and bump minor per release; "If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0." An accidental breaking minor should be fixed by a new minor release that restores compatibility — [semver.org](https://semver.org/)
- Cargo treats 0.y.z differently from plain SemVer: "only changes in the left-most non-zero component are considered incompatible", so 0.1→0.2 is a major change and every 0.0.z release is a major change — [Cargo Book, SemVer compatibility](https://doc.rust-lang.org/cargo/reference/semver.html)
- Go: versions are `vX.Y.Z` tags and "identif[y] an immutable snapshot"; from v2 the module path needs a `/v2` suffix; v0 has no compatibility guarantee; bad versions are withdrawn with a `retract` directive and "should remain available ... on module proxies" — [Go Modules Reference](https://go.dev/ref/mod)
- CalVer suits large, time-driven projects (Ubuntu `YY.0M.MICRO`, pip `YY.MINOR.MICRO`, yt-dlp `YYYY.0M.0D`); it deliberately does not signal breaking changes, so it needs a deprecation policy and changelog instead — [calver.org](https://calver.org/)

#### Commit convention

- Conventional Commits 1.0.0: `fix` → PATCH, `feat` → MINOR, `BREAKING CHANGE` footer or `!` → MAJOR; other types (`build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`) are allowed. With squash merges "lead maintainers can clean up the commit messages as they're merged—adding no workload to casual committers" — [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)
- release-please "highly" recommends squash merges and offers a `BEGIN_COMMIT_OVERRIDE` block in the PR body to fix a merged message — [googleapis/release-please](https://github.com/googleapis/release-please)

#### Changelog formats

- Keep a Changelog 1.1.0: "Changelogs are for humans, not machines"; an entry per version, newest first, dated; groups Added / Changed / Deprecated / Removed / Fixed / Security; keep an `Unreleased` section at the top; "Don't let your friends dump git logs into changelogs"; yanked versions marked `[YANKED]` — [keepachangelog.com 1.1.0](https://keepachangelog.com/en/1.1.0/). The spec's newest tag is still v1.1.1 from 2023-03-06 — [olivierlacan/keep-a-changelog releases](https://github.com/olivierlacan/keep-a-changelog/releases)
- GitHub's generated release notes list merged PRs, contributors and a full-changelog link; `.github/release.yml` sets label-based categories and excludes labels or authors (for example bots). They are PR-based, not commit-based — [GitHub Docs](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes)
- git-cliff (v2.14.2, 2026-09-18) generates changelogs from git history with Conventional Commits or regex parsers and templates, can pull PR titles/authors from the forge, and recommends squash merges — [git-cliff docs](https://git-cliff.org/docs/)

#### Release automation tools

- **release-please** (v17.11.2, 2026-08-24; action v5.0.0, 2026-04-22, whose breaking change was the move to node24): keeps a Release PR updated from Conventional Commits; merging it updates the changelog, tags and creates the GitHub Release; manifest config handles monorepos; strategies for Rust, Python, Node, Java, Go, Ruby and others. It "does not handle publication to package managers or handle complex branch management" — [googleapis/release-please](https://github.com/googleapis/release-please); [release-please-action v5.0.0](https://github.com/googleapis/release-please-action/releases/tag/v5.0.0)
- **changesets** (@changesets/cli 3.0.3, 2026-09-14; changesets/action v2.1.2): contributors add intent files per change; 3.0 renamed `changeset tag` to `changeset git-tag`, made `changeset version` exit 1 when there is nothing to release, requires Node `^22.11 || ^24 || >=26`, dropped Yarn Classic, and no longer versions private packages by default — [changesets releases](https://github.com/changesets/changesets/releases). Biome releases with `changesets/action` and publishes to npm from a GitHub-hosted runner in an `npm-publish` environment — [biome release.yml](https://github.com/biomejs/biome/blob/main/.github/workflows/release.yml)
- **semantic-release** (v25.0.9, 2026-08-05): fully automated release on every qualifying push (no release PR); v25.0.0 (2025-10-15) moved npm publishing to npm v11 and dropped Node 20/21/23 — [semantic-release v25.0.0](https://github.com/semantic-release/semantic-release/releases/tag/v25.0.0)
- **release-plz** (release-plz-v0.3.170, 2026-10-07): Rust-specific release PR; versions from Conventional Commits, changelog via git-cliff in Keep a Changelog format, "API breaking changes detection with cargo-semver-checks", publishes to any cargo registry and creates tags and GitHub/GitLab releases — [release-plz docs](https://release-plz.dev/docs)
- **dist (formerly cargo-dist)** (v0.33.0, 2026-09-11, still active): builds and hosts binaries and generates its own CI, shell/PowerShell/Homebrew/npm/MSI installers, an updater, and GitHub attestations; a `plan` step can run on PRs — [dist book](https://axodotdev.github.io/cargo-dist/book/). uv's release workflow says it was "Originally generated by `cargo-dist`. This workflow is now maintained manually." — [uv release.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/release.yml)
- **GoReleaser** (v2.18.3, 2026-10-09): Go builds, archives, nfpm packages, Homebrew, Scoop, signing and SBOMs. Deprecations: `brews` (Homebrew formulas) soft-deprecated since v2.10 and pushed harder since v2.16 in favour of `homebrew_casks`; `archives.format` renamed `formats` (v2.6) — [GoReleaser deprecations](https://goreleaser.com/deprecations/). GitHub CLI (cli/cli) releases with `goreleaser/goreleaser-action` v7.2.3 — [cli/cli deployment.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/deployment.yml)
- knope (v0.23.0, 2026-05-24) is a smaller, language-agnostic changeset-style alternative — [knope releases](https://github.com/knope-dev/knope/releases)

### Inferences

- L1: pick SemVer (or CalVer for date-driven projects) and write the 0.x policy down; ecosystems differ (Cargo and npm caret ranges treat 0.y as major), so "0.x means anything may break" alone is not enough.
- L1: Conventional Commits with squash merges and a PR-title check is cheap and feeds every tool above.
- L2: keep a human-curated `CHANGELOG.md` in Keep a Changelog shape and extract each version's section as the GitHub Release notes; generated notes or git-cliff output are drafting aids, not the final text.
- L2/L3 tool choice: release-please (polyglot, release PR, publishing left to you); release-plz (Rust crates, adds semver checks); changesets (JS monorepos, contributor-authored intent); semantic-release (fully hands-off, less review — riskier for a solo maintainer working through agents); dist or GoReleaser for binaries. A release PR gives an AI-agent workflow a natural human approval point.
- Generated release workflows (dist) tend to be ejected and hand-maintained once a project grows (uv did).

### Gaps

- No primary source found comparing these tools head to head; the trade-offs above are inferred from each tool's own docs.
- Did not verify the semantic-release npm plugin's trusted-publishing support in detail.

## Signing and provenance

### Takeaway

For a small project on GitHub, the realistic baseline is SLSA Build L2: GitHub artifact attestations (`actions/attest`) over every release asset, published as an immutable release, with registry-native provenance (npm, PyPI, RubyGems) coming free with trusted publishing. Build L3 needs the build in a reusable workflow; separate cosign keys or GPG are only needed for channels that require them (apt/dnf/pacman repositories, containers outside GHCR).

### Cited Findings

#### GitHub artifact attestations

- Permissions `id-token: write`, `contents: read`, `attestations: write` (plus `packages: write` for images, `artifact-metadata: write` for the linked-artifacts page); current docs use `actions/attest@v4`, which also produces SBOM attestations through `sbom-path`; consumers verify with `gh attestation verify PATH -R ORG/REPO` — [GitHub Docs, using artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- From v4, `actions/attest-build-provenance` "is simply a wrapper on top of actions/attest", and new setups should use `actions/attest` (v4.2.2, 2026-08-04); `attest-sbom` was folded in as well — [attest-build-provenance releases](https://github.com/actions/attest-build-provenance/releases); [actions/attest releases](https://github.com/actions/attest/releases)
- "Artifact attestations by itself provides SLSA v1.0 Build Level 2"; reusable workflows can isolate the build to "meet SLSA v1.0 Build Level 3". Public repos sign through the Sigstore Public Good Instance with a transparency log; private repos use GitHub's own instance, which has no transparency log. Attestations "are not a guarantee that an artifact is secure" — [GitHub Docs, artifact attestations concept](https://docs.github.com/en/actions/concepts/security/artifact-attestations)
- Artifact attestations became generally available on 2024-06-25 — [GitHub Changelog](https://github.blog/changelog/2024-06-25-artifact-attestations-is-generally-available/)
- Mature repos: ripgrep attests with `actions/attest-build-provenance` v3.0.0 and also ships a `.sha256` per asset ([ripgrep release.yml](https://github.com/BurntSushi/ripgrep/blob/master/.github/workflows/release.yml)); Biome uses v4.2.2 ([biome release.yml](https://github.com/biomejs/biome/blob/main/.github/workflows/release.yml)); GitHub CLI uses `actions/attest` v4.2.2 on `dist/gh_*` ([cli/cli deployment.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/deployment.yml)); uv attests its release assets ([uv release.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/release.yml))

#### SLSA levels

- Build L1: provenance exists ("may be incomplete and/or unsigned"); L2: a hosted build platform generates and signs provenance, preventing tampering after the build; L3: hardened platform where signing secrets are not reachable from user-defined build steps, preventing tampering during the build. The v1.1 page is now marked retired: "Version 1.2 is the current version", which adds a Source track — [SLSA v1.1 levels](https://slsa.dev/spec/v1.1/levels)
- slsa-framework/slsa-github-generator's latest release is v2.1.0 from 2025-02-24 — [slsa-github-generator releases](https://github.com/slsa-framework/slsa-github-generator/releases)

#### Immutable releases and asset digests

- Immutable releases went GA on 2025-10-28: once published, assets cannot be added, modified or deleted, tags cannot be moved or deleted, and GitHub generates a release attestation (Sigstore bundle) — [GitHub Changelog GA](https://github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available/)
- "Existing releases remain mutable unless you republish them"; verification with `gh release verify <tag>` and `gh release verify-asset <tag> <asset>` — [GitHub Changelog preview, 2025-08-26](https://github.blog/changelog/2025-08-26-releases-now-support-immutability-in-public-preview/)
- Recommended flow: create the release as a draft, attach all assets, then publish; it also protects against "repository resurrection attacks" — [GitHub Docs, immutable releases](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases)
- Since 2025-06-03 GitHub computes a SHA-256 digest for every uploaded release asset and exposes it in the UI, REST/GraphQL APIs and `gh`; no backfill for older assets — [GitHub Changelog](https://github.blog/changelog/2025-06-03-releases-now-expose-digests-for-release-assets/)

#### Sigstore / cosign

- cosign v3.0.1 (2025-10-08) turned the standardized Sigstore bundle format on by default and made `--bundle` required; service URLs come from the TUF signing config by default. Latest is v3.1.3 (2026-08-06); cosign-installer v4.1.2 (2026-05-07) — [cosign v3.0.1](https://github.com/sigstore/cosign/releases/tag/v3.0.1)
- Practical effect reported in many downstream PRs: v3 `sign-blob` writes one `.sigstore.json` bundle and ignores `--output-signature`/`--output-certificate`; `--new-bundle-format=false` restores the old layout (secondary sources, e.g. [a2a-rs PR #230](https://github.com/a2aproject/a2a-rs/pull/230))

#### Registry provenance

- npm: with trusted publishing from GitHub Actions or GitLab, "npm automatically generates and publishes provenance attestations"; requires a public repo and public package — "Provenance generation is not supported for private repositories" — [npm Docs, trusted publishers](https://docs.npmjs.com/trusted-publishers)
- PyPI (PEP 740): `pypa/gh-action-pypi-publish` generates and uploads attestations "automatically by default"; manual attestations do not bypass the Trusted Publisher identity requirement; `twine upload --attestations` exists — [PyPI Docs, producing attestations](https://docs.pypi.org/attestations/producing-attestations/). Secondary sources say `uv publish` uploads existing attestations from 0.9.12, with `astral-sh/attest-action` to create them — [astral-sh/attest-action](https://github.com/astral-sh/attest-action); [pydevtools handbook](https://pydevtools.com/handbook/how-to/how-to-publish-python-packages-with-digital-attestations/)
- RubyGems: `rubygems/release-gem` has `attestations` (marked EXPERIMENTAL, default true) that work only via trusted publishing — [release-gem action.yml](https://github.com/rubygems/release-gem/blob/v1/action.yml)

#### SBOMs

- GitHub exports the dependency graph as SPDX from Insights → Dependency graph or the REST API; SBOM actions (Anchore, SPDX/SBOM dependency submission) produce workflow artifacts — [GitHub Docs, exporting an SBOM](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/exporting-a-software-bill-of-materials-for-your-repository)
- Spec versions: SPDX 3.0.1 (2024-12-17), 3.1-RC1 (2026-01-24) — [spdx-spec releases](https://github.com/spdx/spdx-spec/releases); CycloneDX 1.7.2 (2026-09-17) — [CycloneDX releases](https://github.com/CycloneDX/specification/releases)
- Tools: syft v1.54.1 and anchore/sbom-action v0.24.3 ([syft](https://github.com/anchore/syft/releases)); cargo-cyclonedx 0.5.9 ([cyclonedx-rust-cargo](https://github.com/CycloneDX/cyclonedx-rust-cargo/releases)); cargo-auditable v0.7.7, which embeds the dependency list in Rust binaries ([cargo-auditable](https://github.com/rust-secure-code/cargo-auditable/releases))
- EU Cyber Resilience Act: reporting obligations for manufacturers (actively exploited vulnerabilities, severe incidents; 24h/72h deadlines) started 2026-09-11; open-source-steward obligations follow from 2027-12-11 — [OpenSSF CRA guide, 2026-09-11](https://openssf.org/blog/2026/09/11/a-community-guide-to-the-eu-cra-september-11-deadline-for-manufacturers/); [EU CRA reporting](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting) (dates taken from search summaries of these pages)

#### Platform code signing

- uv signs and notarizes macOS binaries and signs Windows binaries through Azure Key Vault in a dedicated `release` environment — [uv sign-release-binaries.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/sign-release-binaries.yml); GitHub CLI codesigns and notarizes macOS archives with an Apple Developer ID — [cli/cli deployment.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/deployment.yml)

### Inferences

- L2: attest every release asset with `actions/attest` (not the wrapper) and document `gh attestation verify <file> -R owner/repo` in the install docs. It costs three permissions and one step.
- L2: enable immutable releases and restructure workflows to draft → upload all assets → publish; anything that attaches assets to a published release (packages built later, signatures) must move before the publish.
- L2: publish a `SHA256SUMS` (or per-asset `.sha256`) even with GitHub's digests; scripts and package managers can use it without the API.
- L3: aim for Build L3 only if cheap (build inside a reusable workflow); for a solo project L2 plus immutable releases covers the realistic threats (post-build tampering, tag moves, asset swaps).
- L3: an SBOM per release (SPDX or CycloneDX, attested with `sbom-path`) is good practice and helps users with CRA duties; for Rust binaries `cargo auditable` is a lighter option scanners can read. Not a requirement for a non-commercial project.
- Paid OS code signing (Apple Developer ID, Windows Authenticode) is a L3+ choice driven by channel requirements (Homebrew casks, winget AV scans), not by the standard.

### Gaps

- Could not confirm from GitHub docs whether a published immutable release can still be deleted, or how immutability interacts with pruning old pre-releases.
- Plan availability of attestations for private repos (believed to need GitHub Enterprise Cloud) was not stated on the pages fetched.
- Whether the CRA applies to a non-commercial solo maintainer was not researched beyond the dates.

## Trusted publishing per registry and the Go module proxy

### Takeaway

Every major registry now supports OIDC trusted publishing from GitHub Actions, and npm and crates.io let owners turn token publishing off; long-lived publish tokens should be treated as deprecated. Go has no registry: a pushed semver tag is the release, and the proxy and checksum database make it permanent.

### Cited Findings

#### npm

- Trusted publishing supports GitHub Actions (GitHub-hosted runners), GitLab.com shared runners and CircleCI cloud; self-hosted runners are not supported. Needs npm CLI ≥ 11.5.1 and Node ≥ 22.14.0 (dist-tag management needs 11.21.0+ or 12.2.0+). Configure per package (org/user, repo, workflow file, optional environment and allowed actions), up to 10 configs; a new config "must complete its first successful publish within 2 days" or is deleted. npm recommends "Require two-factor authentication and disallow tokens" afterwards — [npm Docs, trusted publishers](https://docs.npmjs.com/trusted-publishers)
- All classic tokens were permanently revoked on 2025-12-09, and `npm login` now gives two-hour session tokens — [GitHub Changelog 2025-12-09](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/); granular write tokens default to 7 days (90 max) and enforce 2FA by default — [GitHub Changelog 2025-11-05](https://github.blog/changelog/2025-11-05-npm-security-update-classic-token-creation-disabled-and-granular-token-changes/)
- npm v12 (announced 2026-07-08) stops running dependency lifecycle scripts, git dependencies and remote-URL dependencies unless allowed. 2FA-bypass granular tokens lose sensitive operations in early August 2026 and direct publishing around January 2027 (publish then only stages a release that needs human 2FA approval); npm points CI at trusted publishing or staged publishing — [GitHub Changelog 2026-07-08](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)

#### PyPI

- Trusted publishing exchanges the CI's OIDC token for a PyPI token valid for 15 minutes; configuration is the only manual step; new projects can be created through a pending publisher — [PyPI Docs](https://docs.pypi.org/trusted-publishers/)
- Attestation-capable trusted publishers: GitHub Actions, GitLab CI/CD, Google Cloud — [PyPI Docs, producing attestations](https://docs.pypi.org/attestations/producing-attestations/)
- uv publishes with `uv publish` under `id-token: write` in a `release` environment — [uv publish-pypi.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/publish-pypi.yml)

#### crates.io

- Trusted publishing launched in July 2025 for GitHub Actions — [crates.io update, 2025-07-11](https://blog.rust-lang.org/2025/07/11/crates-io-development-update-2025-07)
- January 2026: GitLab CI/CD support (GitLab.com only); "Crate owners can now enforce Trusted Publishing ... traditional API token-based publishing is disabled"; `pull_request_target` and `workflow_run` triggers are blocked from trusted publishing; a Security tab shows RustSec advisories; the index gained a `pubtime` field — [crates.io update, 2026-01-21](https://blog.rust-lang.org/2026/01/21/crates-io-development-update)
- `rust-lang/crates-io-auth-action` exchanges the OIDC token for a temporary token and revokes it when the job ends; configured with owner, repo, workflow file and environment — [crates-io-auth-action](https://github.com/rust-lang/crates-io-auth-action). uv uses it (v1.0.5) — [uv publish-crates.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/publish-crates.yml)

#### RubyGems

- `rubygems/release-gem` is the official action; RubyGems.org exchanges the GitHub OIDC token for a short-lived API key, so no secret is stored — [rubygems/release-gem](https://github.com/rubygems/release-gem)

#### Go

- Publishing is tagging `vX.Y.Z`; the `go` command fetches through proxy.golang.org and verifies against sum.golang.org; mistakes are retracted rather than deleted — [Go Modules Reference](https://go.dev/ref/mod)

### Inferences

- L2 (any project that publishes to a registry): trusted publishing only, from a dedicated publish job with `id-token: write` scoped to that job and a GitHub environment (`release`/`npm-publish`) with required reviewers, then disable token publishing where the registry allows (npm, crates.io).
- Never trigger publish workflows from `pull_request_target` or `workflow_run`; crates.io now enforces this, and it is a sound rule for every registry.
- Go projects: never move or delete a pushed tag (the proxy has cached it); use `retract`. Protect `v*` tags with a ruleset.
- First publish of a new crate probably still needs a token (trusted publishing is configured in an existing crate's settings); PyPI and npm handle new packages differently (pending publisher; npm's 2-day window).

### Gaps

- crates.io trusted publishing docs page renders client-side and could not be fetched; the first-publish rule is inferred, not confirmed.
- Did not check whether npm trusted publishing has added self-hosted runner support since the docs snapshot.
- PyPI's full provider list (ActiveState and others) was not on the fetched pages.

## Install channels

### Takeaway

Order of channels for a CLI: GitHub Releases with checksums and attestations (L2), an install script that verifies checksums (L2), a Homebrew tap (L3), then distro repositories, winget, Scoop and Nix as demand appears. Package-manager installs must update through the package manager; a self-updater should only touch installs it made itself.

### Cited Findings

#### Install scripts

- Risks of `curl | sh`: partial download executes truncated commands; servers can detect piping (User-Agent or timing via an early `sleep`) and serve a different payload; what you reviewed is not necessarily what runs. Mitigations: wrap the body in a function called on the last line, verify a checksum published independently, offer download-then-run — [SNAKE Security](https://snakesecurity.org/blog/pipepunisher-exploiting-shell-install-scripts/); [mironsoft](https://www.mironsoft.de/en/blog/bash-making-the-curl-bash-installer-pattern-safer); original server-side detection discussion [Hacker News](https://news.ycombinator.com/item?id=11532599) (secondary sources; no primary standard exists)

#### Homebrew

- Taps: name the repo `homebrew-<name>`; formulae in `Formula/`, casks in `Casks/`; `brew tap-new` scaffolds GitHub Actions that build bottles — [Homebrew Docs, taps](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap)
- homebrew-core formulae "must either build from source or install portable, platform-independent output"; binary-only software belongs in a cask; upstream must provide "an immutable tag or release"; other trade-offs "belong in a third-party tap" — [Homebrew Docs, acceptable formulae](https://docs.brew.sh/Acceptable-Formulae)
- Homebrew 5.0.0 (2025-11-12): "Casks without codesigning are deprecated. We will disable all Homebrew/homebrew-cask casks that fail Gatekeeper checks in September 2026"; `--no-quarantine` deprecated; Linux ARM64 promoted to Tier 1; no new macOS Intel bottles from September 2026 — [Homebrew 5.0.0](https://brew.sh/2025/11/12/homebrew-5.0.0/). The Gatekeeper rule applies to the official cask repo, not to third-party taps ([Homebrew discussion #6482](https://github.com/orgs/Homebrew/discussions/6482), search summary). Homebrew is now at 7.0.9 (2026-10-08) — [brew releases](https://github.com/Homebrew/brew/releases)
- GoReleaser now steers binary distribution to `homebrew_casks` instead of `brews` — [GoReleaser deprecations](https://goreleaser.com/deprecations/)

#### winget and Scoop

- winget: submit a manifest PR to microsoft/winget-pkgs (one package version per PR); automated validation scans the installer with several antivirus engines, requires HTTPS, rejects redirectors, and requires the InstallerUrl to come "directly from the ISV's release location"; installers must support non-interactive mode — [Microsoft Learn](https://learn.microsoft.com/en-us/windows/package-manager/package/repository). Helpers: wingetcreate v1.12.13.0, Komac v2.16.0, winget-releaser v2 (GitHub releases API)
- Scoop v0.6.0 was released 2026-09-30 — [Scoop releases](https://github.com/ScoopInstaller/Scoop/releases)

#### apt / dnf repositories

- Debian guidance for third-party repos: the key "MUST be downloaded over a secure mechanism like HTTPS to a location only writable by root", "MUST NOT be placed in /etc/apt/trusted.gpg.d or loaded by apt-key", and each entry "SHOULD have the signed-by option set" pointing at a file; deb822 `.sources` MAY be used — [Debian Wiki](https://wiki.debian.org/DebianRepository/UseThirdParty)

#### Self-updating binaries and channels

- dist's updater (axoupdater v0.10.2) is installed alongside shell/PowerShell-installed programs (`install-updater = true`) or used as a library; package-manager installs (Homebrew, npm) are left to those managers — [dist book, updater](https://axodotdev.github.io/cargo-dist/book/installers/updater.html)
- herdr (upstream) runs a stable and an opt-in preview channel: previews are GitHub pre-releases from `preview-*` tags; stable promotes a published preview and rebuilds it with a stable version; Homebrew and Nix stay stable-only; tags are admin-only and "Immutable releases protect published binaries" — local: `git show herdr-import:AGENTS.md`, section "Release Channels"

### Inferences

- L2: install script = POSIX `sh`, body in `main()` called last, HTTPS only, verifies SHA-256 against a value from the release (or GitHub's digest), installs to a user directory, never needs `sudo`; document a download-inspect-run alternative and `gh attestation verify`.
- L3: Homebrew tap with a formula (or cask) generated by the release workflow; a CLI with prebuilt binaries fits a tap; homebrew-core only accepts source builds and notability.
- L3: apt/dnf repositories are worth it only with a signing key kept offline and a scoped `signed-by` keyring.
- winget expects stable direct download URLs and passes AV scans; unsigned Windows binaries can fail them.
- Self-updaters: check a manifest over HTTPS, verify checksums, refuse to self-update when installed by a package manager, and offer channels (stable/preview) only when previews are real releases with their own versions (`X.Y.Z-preview.N`).

### Gaps

- No primary source found for Scoop bucket requirements or nixpkgs inclusion criteria.
- No authoritative source on whether curl-downloaded binaries trigger macOS Gatekeeper (believed not, since curl does not set the quarantine attribute).

## Dependency updates, advisories and licence compliance

### Takeaway

Dependabot is enough for a solo GitHub project when grouped, scheduled and limited (and it now waits 3 days by default); Renovate is the stronger tool when you need per-dependency rules, digest pinning, a dashboard or non-GitHub forges. Pin Actions by SHA, scan with osv-scanner or the ecosystem's tool, publish fixes through GitHub security advisories, and check licences with cargo-deny (Rust) or REUSE.

### Cited Findings

#### Dependabot

- Options: `cooldown` (`default-days`, `semver-major/minor/patch-days`, include/exclude), `groups` (patterns, `dependency-type`, `update-types`, `applies-to: version-updates|security-updates`, `group-by: dependency-name`), `multi-ecosystem-group`, `ignore` (name, versions, update-types; ignore wins over allow), schedules daily through yearly or cron, `target-branch`, `open-pull-requests-limit` (default 5; security updates exempt) — [GitHub Docs, Dependabot options](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference)
- Cooldown shipped 2025-07-01 — [GitHub Changelog](https://github.blog/changelog/2025-07-01-dependabot-supports-configuration-of-a-minimum-package-age/); since 2026-07-14 Dependabot waits 3 days by default before opening version-update PRs; "Security updates still open immediately"; configurable or opt-out via `cooldown` — [GitHub Changelog](https://github.blog/changelog/2026-07-14-dependabot-version-updates-introduce-default-package-cooldown/)

#### Renovate

- `config:recommended` includes the dependency dashboard, monorepo and recommended groups and replacements; `config:best-practices` adds `docker:pinDigests`, `helpers:pinGitHubActionDigests`, `:configMigration`, `:pinDevDependencies`, `abandonments:recommended`, `security:minimumReleaseAgeNpm`, `:maintainLockFilesWeekly` — [Renovate presets](https://docs.renovatebot.com/presets-config/)
- `minimumReleaseAge` delays updates; set `internalChecksFilter=strict` so no branch or PR exists before the age is met — [Renovate docs](https://docs.renovatebot.com/key-concepts/minimum-release-age/)
- Versus Dependabot: more forges, built-in dashboard, `group:monorepos`, per-dependency schedules, shareable presets; needs the Mend app or self-hosting (AGPL), while Dependabot is built in (MIT) — [Renovate bot comparison](https://docs.renovatebot.com/bot-comparison/). Renovate is at 44.149.0 (2026-10-09)

#### Actions supply chain

- Since 2025-08-15 the allowed-actions policy can block actions (`!` prefix) and enforce full-SHA pinning, failing workflows with unpinned actions — [GitHub Changelog](https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/)
- uv runs zizmor (workflow linter, v1.30.1) in CI and gates releases behind a `release-gate` environment that needs a second approver — [uv workflows](https://github.com/astral-sh/uv/tree/main/.github/workflows); [uv release.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/release.yml). GitHub CLI runs govulncheck and CodeQL workflows — [cli/cli workflows](https://github.com/cli/cli/tree/trunk/.github/workflows)

#### Vulnerability scanning and advisories

- OSV-Scanner v2 (v2.6.0, 2026-09-14) scans lockfiles, manifests, SBOMs and container images against OSV.dev, whose advisories come from sources such as RustSec; licence scanning and guided remediation are experimental; ships a GitHub Action — [OSV-Scanner](https://google.github.io/osv-scanner/)
- Repository security advisories: request a CVE from the draft advisory (before or after publishing); add a fixed version before publishing or Dependabot alerts users with no safe version; publishing deletes the temporary private fork — [GitHub Docs](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/publishing-a-repository-security-advisory)

#### Licence compliance

- cargo-deny (0.20.2, 2026-07-09) checks advisories, bans, licences and sources, with `cargo-deny-action` for CI — [cargo-deny](https://embarkstudios.github.io/cargo-deny/)
- REUSE 3.3 (2024-11-14): `LICENSES/` with full texts, `SPDX-FileCopyrightText` and `SPDX-License-Identifier` per file (comment headers recommended), `REUSE.toml` replaces the deprecated DEP5 file; `reuse lint` checks it; the tool (v6.2.0) lives on Codeberg — [REUSE spec 3.3](https://reuse.software/spec-3.3/)
- Other tools: licensee v10.1.0 (2026-08-07) detects a project's licence ([licensee](https://github.com/licensee/licensee)); scancode-toolkit v32.5.0 (2026-01-15) does deep file-level scanning ([scancode-toolkit](https://github.com/aboutcode-org/scancode-toolkit/releases))

### Inferences

- L1: Dependabot alerts and security updates on; Actions pinned by full SHA with a version comment; Dependabot (or Renovate) keeps the pins current.
- L2: version updates grouped per ecosystem, monthly for a solo maintainer, `open-pull-requests-limit` low, target the integration branch; keep the 3-day default cooldown or raise it to about 7 days; `ignore` (or leave out) dependencies an upstream controls and say why in a comment.
- L2: one vulnerability scanner in CI (osv-scanner, or `cargo deny check advisories` / govulncheck / `npm audit`), plus zizmor on workflows.
- L2: private vulnerability reporting on, `SECURITY.md`, fix in a temporary private fork, request a CVE, set the fixed version, then publish.
- L3: licence policy in CI (cargo-deny for Rust; REUSE for projects mixing licences or vendored code).
- Choose Renovate when: non-GitHub forge, many repos sharing presets, need per-dependency schedules or a dashboard.

### Gaps

- Did not verify Dependabot's `multi-ecosystem-group` GA date or the `exclude-paths` option details.
- No primary source on whether licensee is what GitHub uses for licence detection (widely stated, not verified here).

## Publishing documentation with a release

### Takeaway

Publish docs with GitHub Pages through the Actions source (`configure-pages`, `upload-pages-artifact`, `deploy-pages`) and redeploy as part of the release; versioned docs are an L3 concern and are best done as immutable per-release snapshots plus a "latest" alias.

### Cited Findings

- Custom Pages workflows use `actions/configure-pages` (v5), `actions/upload-pages-artifact` (v4, max 10 GB, no symlinks) and `actions/deploy-pages` (v4 in the docs; v5.0.1 released 2026-09-01), need `pages: write` and `id-token: write`, and deploy to the `github-pages` environment — [GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages); [deploy-pages releases](https://github.com/actions/deploy-pages/releases)
- mike (MkDocs) deploys each version into its own directory on `gh-pages` with aliases like `latest`, a version selector and `set-default`; "once you've generated your docs for a particular version, you should never need to touch that version again" — [jimporter/mike](https://github.com/jimporter/mike)
- Astro Starlight has no built-in versioning; the community `starlight-versions` plugin archives the current docs as a version — [Starlight Versions](https://starlight-versions.vercel.app/); a 2026 review calls it less mature, with some teams using branch-based versioning — [docsio review](https://docsio.co/blog/starlight-docs) (secondary)
- herdr (upstream) keeps `docs/next` (unreleased), `docs/preview` (CI-owned snapshot for the preview channel) and `docs/versions/<version>` seeded by release CI from the tag, with `docs/versions/manifest.json` choosing `/docs/` — local: `git show herdr-import:AGENTS.md`

### Inferences

- L2: docs build in CI on every PR (broken-link check) and deploy from the default branch or the release workflow.
- L3: once users run more than one version, snapshot docs per release (mike, Docusaurus versions, starlight-versions, or herdr's directory model) and keep unreleased docs out of the default view.

### Gaps

- Docusaurus versioning docs were not fetched.

## herdsman's release setup assessed against these findings

### Takeaway

herdsman already meets most L2/L3 practice (tag-driven releases from protected tags, curated changelog, SHA-pinned actions, checksum-verifying installer, signed apt/dnf/pacman repos, Homebrew tap, preview channel, channel smoke tests). The gaps are provenance and immutability: no attestations, immutable releases off, assets added after publishing, no SBOM, and no dependency or workflow scanning in CI.

### Cited Findings

- Release flow: pushing tag `vX.Y.Z` on `main` builds five binaries, creates the release with the version's `CHANGELOG.md` section as notes, commits `distribution/latest.json`, redeploys Pages and updates the Homebrew tap; a manual run rehearses into a private draft; `just release` refuses majors not one above herdr's — local: `herdsman/MAINTAINING.md`, `.github/workflows/release.yml`
- Hygiene already in place: top-level `permissions: contents: read`, `persist-credentials: false`, every action pinned by SHA with a version comment, version/CHANGELOG consistency check before building — local: `release.yml`
- The release is created non-draft (`gh release create ... --verify-tag`), then `linux-packages.yml` attaches `.deb`, `.rpm` and Arch packages to the published release — local: `release.yml`, `MAINTAINING.md`
- No `id-token`, `attestations`, cosign, SBOM or checksums file in `release.yml`; checksums live in `latest.json`, taken from GitHub's asset digests (`scripts/changelog.py` parses `sha256:` digests); `install.sh` verifies SHA-256 from that manifest and wraps its body in `main "$@"` — local files
- GitHub API, 2026-10-10: `immutable-releases` `{"enabled":false}`; latest release v1.1.0 `immutable: false`; assets carry `sha256:` digests; private vulnerability reporting enabled; rulesets "Long-lived branches" and "Release tags" active — `gh api repos/remziduzagac/herdsman/...`
- Preview workflow (push to `test`) publishes `preview-<build id>` pre-releases and deletes all but the newest ten with `gh release delete --cleanup-tag` — local: `.github/workflows/preview.yml`
- Dependabot: monthly grouped PRs for GitHub Actions and the docs-site npm packages into `dev`, limit 1; Rust left out on purpose because `Cargo.lock` follows herdr — local: `.github/dependabot.yml`, `MAINTAINING.md`
- No cargo-deny, cargo-audit, osv-scanner, zizmor, CodeQL or Scorecard in any workflow (grep of `.github/workflows`)
- Signed package repositories: RSA key, private half offline; apt instructions use `/etc/apt/keyrings` and `signed-by` — local: `MAINTAINING.md`, `.github/workflows/packages.yml`; matches [Debian guidance](https://wiki.debian.org/DebianRepository/UseThirdParty)
- Upstream herdr goes further: previews from admin-only tags, stable promotes a published preview, publish workflows re-check the actor's admin permission, immutable releases on, docs snapshotted per version — local: `git show herdr-import:AGENTS.md`

### Inferences

- Highest-value changes for herdsman, in order: (1) create the release as a draft, run `linux-packages` against the draft, attest all assets with `actions/attest@v4`, then publish; (2) enable immutable releases; (3) add a `SHA256SUMS` asset and mention `gh attestation verify` / `gh release verify-asset` in the install docs; (4) add `cargo deny check` (advisories, licences, sources) and zizmor to CI — a cargo-deny advisory check also covers the Rust dependencies Dependabot deliberately skips; (5) optionally an SBOM per release.
- Immutable releases conflict with pruning previews by deleting them and their tags; herdr keeps previews instead. Either retain previews or keep previews mutable some other way; verify behaviour before switching.
- herdsman's Dependabot setup is the "ignore what upstream controls" pattern done right; with the 3-day default cooldown it needs no change.
- macOS/Windows code signing is not needed for the current channels (curl installer, tap formula, apt/dnf/pacman) but would matter for a homebrew-core cask or winget.

### Gaps

- Did not run the workflows or test whether the Pages-hosted `latest.json` and installer share a single point of compromise (both come from the same Pages site; the checksum is not independently hosted).
