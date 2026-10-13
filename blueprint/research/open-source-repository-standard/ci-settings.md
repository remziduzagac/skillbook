# CI workflows, workflow security, local/CI parity and repository settings

Research date: 2026-10-10. Primary sources are GitHub Docs, the GitHub Changelog, the zizmor and actionlint docs, OpenSSF material and the workflow files of astral-sh/uv, biomejs/biome, cli/cli and BurntSushi/ripgrep, read with `gh`. The local reference is herdsman (branch `dev`) and the herdr tree it imports (branch `herdr-import`, upstream `herdrdev/herdr`). Local claims cite file paths. Live-settings claims cite the REST endpoint read with `gh api` on 2026-10-10. zizmor 1.30.1 and actionlint 1.7.12 were run read-only against herdsman's `.github/workflows/`.

## 1. GitHub Actions hardening

### Takeaway

Treat every workflow as privileged code. Use an empty or read-only top-level `permissions` with grants per job, actions pinned to full commit SHAs with accurate version comments, updates by Dependabot or Renovate after a cooldown, no `${{ }}` holding untrusted input inside `run:`, `persist-credentials: false`, secrets scoped to environments, OIDC or trusted publishing instead of long-lived tokens, and zizmor plus actionlint in CI. 2026 changed much of this:

- `pull_request_target` is blocked by default on public repositories from 2026-11-02.
- `actions/checkout` v7 refuses fork code under `pull_request_target` and `workflow_run`.
- The `$/` self-repository syntax arrived.
- GitHub's own workflow lockfile is in public preview.
- An allowed-actions policy can now require SHA pinning.

### Cited Findings

#### Token permissions

- GitHub's hardening guide: "set the default permission for the `GITHUB_TOKEN` to read access only for repository contents. The permissions can then be increased, as required, for individual jobs." — [GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- `permissions: {}` disables every permission. When any permission is specified, "all of those that are not specified are set to `none`." — [GitHub Docs: Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- zizmor's `excessive-permissions` audit recommends `permissions: {}` at the workflow level, with specific grants only on the jobs that need them. Its `undocumented-permissions` audit (v1.13.0) asks for a comment explaining each grant. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- biome's zizmor workflow shows the pattern: top-level `permissions: {}`, then job-level `security-events: write`, `contents: read` and `actions: read`, each with a comment saying why. — [biomejs/biome actions_linter.yml](https://github.com/biomejs/biome/blob/main/.github/workflows/actions_linter.yml)
- ripgrep's workflow explains that an explicit `permissions` block is "needed to drop write-all permissions that are granted on `schedule` event", and grants only `contents: read`. — [BurntSushi/ripgrep ci.yml](https://github.com/BurntSushi/ripgrep/blob/master/.github/workflows/ci.yml)
- OpenSSF lists "Default Workflow Token Permission Should Be Read Only" and "Workflows Should Not Be Allowed To Approve Pull Requests" among its source-control platform practices (published 2023-08-29). — [OpenSSF SCM best practices](https://best.openssf.org/SCM-BestPractices/)
- OpenSSF Scorecard's Token-Permissions check (high risk) lowers the score when top-level permissions are not read-only or not declared. — [OpenSSF Scorecard checks](https://github.com/ossf/scorecard/blob/main/docs/checks.md)
- New in September 2026: a `vulnerability-alerts` permission (`read` or `none`) gives workflows read access to Dependabot alerts without broader scopes. — [GitHub Changelog 2026-09-03](https://github.blog/changelog/2026-09-03-github-actions-early-september-2026-updates/)

#### Pinning and updating actions

- "Pinning an action to a full-length commit SHA is currently the only way to use an action as an immutable release." Users should check that the SHA comes from the action's own repository, not a fork. — [GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- Since 2025-08-15 the allowed-actions policy can require SHA pinning at the enterprise, organization and repository levels. "Any workflow that attempts to use an action that isn't pinned will fail." A `!` prefix blocks a specific action or version. — [GitHub Changelog 2025-08-15](https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/)
- GitHub's native lockfile is in public preview. The roadmap item "Locked Dependencies for GitHub Actions Workflows [Public Preview]" was opened 2026-06-12 and is labelled for the Free, Team and Enterprise plans. — [github/roadmap#1253](https://github.com/github/roadmap/issues/1253)
- The lockfile lives at `.github/workflows/actions.lock`, uses schema v0.0.3, and its format "may change before a `v1.0.0` release". — [github/actions-lockfile](https://github.com/github/actions-lockfile)
- `gh extension install github/gh-actions-lock` and then `gh actions-lock` pin every resolvable action and write the lockfile. `--relock` re-resolves refs that moved legitimately. It is a "Technical Preview": v0.1.6 was released 2026-07-28. — [github/gh-actions-lock README](https://github.com/github/gh-actions-lock)
- The roadmap of 2026-03-26 had promised a `dependencies:` section inside the workflow, written by `gh actions pin`. The preview that shipped uses a separate lockfile, so the design changed between announcement and preview. — [GitHub blog: 2026 Actions security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/)
- Self-repository syntax (2026-07-30) works as follows. A `uses:` value starting with `$/` resolves to the workflow's own repository "at the exact commit that is running, with no checkout required". It works wherever `./` works and needs runner 2.336.0 or newer. — [GitHub Changelog 2026-07-30](https://github.blog/changelog/2026-07-30-reference-same-repository-actions-with-self-repository-syntax/)
- zizmor 1.30.0 added the `self-repository` audit. The `$/` form "cannot load an action that was cloned at runtime in a previous step", and it counts as pinned under a "fully pinned" policy. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Linter conflict: actionlint 1.7.12 (2026-03-30, still the latest release) does not parse `$/`. The issue asking for support was opened 2026-07-30 and is still open. — [rhysd/actionlint#711](https://github.com/rhysd/actionlint/issues/711)
- uv already calls its own reusable workflows with `uses: $/.github/workflows/plan.yml`. — [astral-sh/uv ci.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/ci.yml)
- zizmor's `ref-version-mismatch` audit (v1.14.0) flags version comments that do not match the pinned commit. Update tools may "silently ignore it instead of refreshing it". `impostor-commit` flags SHAs that exist only in the fork network, and `stale-action-refs` flags SHAs that no tag points to. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Dependabot cooldown history:
  - Configurable since 2025-07-01. — [GitHub Changelog 2025-07-01](https://github.blog/changelog/2025-07-01-dependabot-supports-configuration-of-a-minimum-package-age/)
  - Since 2026-07-14 Dependabot waits three days by default before a version-update PR, in all ecosystems; "Security updates still open immediately". — [GitHub Changelog 2026-07-14](https://github.blog/changelog/2026-07-14-dependabot-version-updates-introduce-default-package-cooldown/)
  - zizmor's `dependabot-cooldown` audit recommends at least seven days. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Mature repositories differ:
  - uv, biome and cli/cli pin every action to a SHA with a version comment; all three pin `actions/checkout` to `3d3c42e… # v7.0.1`. — [cli/cli lint.yml](https://github.com/cli/cli/blob/trunk/.github/workflows/lint.yml)
  - ripgrep uses `actions/checkout@v4` and `dtolnay/rust-toolchain@master`. — [BurntSushi/ripgrep ci.yml](https://github.com/BurntSushi/ripgrep/blob/master/.github/workflows/ci.yml)
- Immutable action releases are on the roadmap with no published date. — [GitHub blog: 2026 Actions security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/)
- The Node 20 runtime is gone:
  - Node 24 became the runner default on 2026-06-16.
  - Node 20 was removed on 2026-09-23.
  - `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` was the early opt-in. — [GitHub Changelog: Node 20 deprecation](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/)

#### Dangerous triggers and script injection

- Since 2025-12-08, `pull_request_target` always takes the workflow file and the checkout ref from the default branch, not from the PR's base branch. — [GitHub Changelog 2025-11-07](https://github.blog/changelog/2025-11-07-actions-pull_request_target-and-environment-branch-protections-changes/)
- `actions/checkout` v7 became generally available on 2026-06-18. By default it refuses to fetch fork PR code in `pull_request_target` and `workflow_run` workflows. The refusal was backported to the supported majors on 2026-07-20. Floating major tags pick it up; workflows pinned to SHAs or patch versions must be upgraded by hand. The opt-out input is `allow-unsafe-pr-checkout`. — [GitHub Changelog 2026-06-18](https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout/)
- Workflow execution protections reached general availability on 2026-09-17. They are actor and event allowlists in Actions policies, with an evaluate mode. GitHub adds a default rule that disables `pull_request_target` on public repositories with no event policy. Enforcement starts 2026-11-02, and the rule does not apply to private or internal repositories. To keep the trigger, allow it in an Actions event policy, optionally for specific workflow files only. — [GitHub Changelog 2026-09-17](https://github.blog/changelog/2026-09-17-workflow-execution-protections-in-github-actions-generally-available/)
- `workflow_run` can "access secrets and write tokens, even if the previous workflow was not". For fork PRs, `GITHUB_TOKEN` is read-only and no other secrets are passed. First-time contributors may need approval before their workflows run. — [GitHub Docs: Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- zizmor's `dangerous-triggers` audit covers `pull_request_target`, `workflow_run` and `issue_comment`. It warns that not running PR code still leaves "argument injection, environment injection, or local file inclusion" vectors. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Against script injection, GitHub prefers actions over inline scripts, and otherwise passing untrusted input through intermediate environment variables. — [GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- zizmor's `template-injection` fix is to move the expansion into `env:` and reference `${VAR}` (bash) or `${env:VAR}` (PowerShell). — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Since 2026-06-11, PRs created by `github-actions[bot]` can run workflows only after approval by a user with write access. Previously they ran no workflows at all. — [GitHub Changelog 2026-06-11](https://github.blog/changelog/2026-06-11-bot-created-pull-requests-can-run-workflows-if-approved/)
- Since 2026-07-28, GitHub automatically holds workflow runs on public repositories that it identifies as potentially malicious, such as workflows pushed with stolen credentials. A write collaborator must approve them "through an authenticated web session". — [GitHub Changelog 2026-07-28](https://github.blog/changelog/2026-07-28-github-actions-holds-potentially-malicious-workflows-for-approval/)

#### Credentials, secrets, OIDC and environments

- zizmor's `artipacked` audit: `actions/checkout` persists Git credentials. Versions before v6.0.0 store them in `.git/config`; v6.0.0 and later store them in `$RUNNER_TEMP`. Use `persist-credentials: false` unless later steps need Git auth. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- GitHub's secrets rules:
  - "Never use structured data as a secret".
  - Mask sensitive values that are not secrets with `::add-mask::`.
  - Rotate secrets periodically.
  - Use OIDC to cloud providers instead of long-lived credentials.
  - Use CODEOWNERS to require review of changes under `.github/workflows`.
  - "Self-hosted runners should almost never be used for public repositories". — [GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- zizmor `secrets-inherit` (v1.1.0) replaces `secrets: inherit` with explicit forwarding. `secrets-outside-env` (v1.23.0) flags secrets used outside environments. `use-trusted-publishing` recommends OIDC publishing over static registry tokens. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Secrets items on the 2026 roadmap:
  - Scoped secrets bound to repositories, branches, environments or workflow identities.
  - Secret inheritance in reusable workflows bound to trusted workflows.
  - Secret management removed from the repository write role.
  - Previews were targeted at 3-6 months after 2026-03-26. — [GitHub blog: 2026 Actions security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/)
- Environments:
  - Up to six required reviewers, of whom one approval suffices, with an optional "prevent self-review".
  - A wait timer of up to 43,200 minutes.
  - Deployment branch and tag patterns.
  - Environment secrets stay unavailable until a reviewer approves.
  - Required reviewers, wait timers and custom rules are available on public repositories on Free, Pro and Team. — [GitHub Docs: Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- Repository custom property claims in Actions OIDC tokens became generally available in April 2026. — [GitHub Changelog 2026-04-02](https://github.blog/changelog/2026-04-02-github-actions-early-april-2026-updates/)
- Trusted publishing:
  - npm trusted publishing (OIDC) became generally available on 2025-07-31. — [GitHub Changelog 2025-07-31](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/)
  - crates.io has supported it since 2025-07-16 (secondary source). — [Socket: crates.io trusted publishing](https://socket.dev/blog/crates-launches-trusted-publishing)

#### Linters and monitoring

- zizmor:
  - Version 1.30.1 was released 2026-09-09. — [zizmor releases](https://github.com/zizmorcore/zizmor/releases)
  - The audits include `template-injection`, `dangerous-triggers`, `cache-poisoning`, `excessive-permissions`, `unpinned-uses`, `unpinned-images`, `impostor-commit`, `known-vulnerable-actions`, `superfluous-actions`, `adhoc-packages` and `concurrency-limits`. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Running zizmor in CI:
  - uv runs it through `zizmorcore/zizmor-action` in a reusable workflow with `security-events: write`. — [astral-sh/uv check-zizmor.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/check-zizmor.yml)
  - biome passes `min-severity: high` and `min-confidence: high`. — [biomejs/biome actions_linter.yml](https://github.com/biomejs/biome/blob/main/.github/workflows/actions_linter.yml)
- actionlint checks:
  - Workflow syntax, plus strict type checks of expressions, contexts and matrices.
  - `needs:` graphs and cron, glob and runner-label syntax.
  - Action inputs and permissions.
  - Hard-coded credentials and constant `if:` conditions.
  - Script injection from untrusted inputs.
  - It runs shellcheck and pyflakes on `run:` scripts. — [actionlint checks](https://github.com/rhysd/actionlint/blob/main/docs/checks.md)
- OpenSSF names three scanners for these settings. Scorecard flags Dangerous-Workflow (critical), Token-Permissions and Pinned-Dependencies. Legitify detects all the SCM policies. Allstar scans organization settings. — [OpenSSF SCM best practices](https://best.openssf.org/SCM-BestPractices/)
- StepSecurity Harden-Runner:
  - It audits or blocks runner egress.
  - All its features are free for public repositories under the Community tier.
  - Block mode extends to macOS and Windows hosted runners from v2.20.0. — [StepSecurity blog](https://www.stepsecurity.io/blog/harden-runner-block-mode-now-available-for-macos-and-windows-github-hosted-runners)
- GitHub's own egress firewall for hosted runners was targeted at a public preview 6-9 months after 2026-03-26. — [GitHub blog: 2026 Actions security roadmap](https://github.blog/news-insights/product-news/whats-coming-to-our-github-actions-2026-security-roadmap/)

#### Local reference: herdsman and herdr against the above

- Every herdsman workflow declares a top-level `permissions: contents: read`, never `{}`. Write grants sit only on release jobs. `build-artifacts-manual.yml` grants `actions: write` at workflow level, which zizmor rates High. — herdsman's `.github/workflows/build-artifacts-manual.yml`
- Every action is SHA-pinned with a comment, and `persist-credentials: false` is used everywhere except two release-job checkouts. The `manifest` job pushes, and the Homebrew tap checkout uses `ssh-key`. — herdsman's `.github/workflows/release.yml`
- `zizmor --persona=regular` on 2026-10-10 reported 132 findings, 87 suppressed; 45 were shown (0 informational, 3 low, 28 medium, 14 high). The main findings:
  - 27 `ref-version-mismatch`. `ci.yml`, `nix.yml` and `windows-arm64.yml` label checkout `3d3c42e…` as `# v6`, while `release.yml` labels the same SHA `# v7.0.1`, which is the tag that points to it.
  - 8 `impostor-commit` on `dtolnay/rust-toolchain@29eef336…` (detailed in the next bullet).
  - 3 `unpinned-images` for `debian:stable`, `ubuntu:latest`, `fedora:latest` and `archlinux:latest` in `packages.yml`.
  - `dangerous-triggers` on `packages.yml` (`workflow_run`).
  - `cache-poisoning`: `Swatinem/rust-cache` runs in the release build.
  - `secrets-inherit` on the `linux-packages` call, and `self-repository`. — herdsman's `.github/workflows/ci.yml`
- The rust-toolchain pin breaks in three ways:
  - `29eef336…` is a "toolchain: stable" commit from 2026-03-27.
  - GitHub's compare API reports it as diverged from `master` (ahead 1, behind 16).
  - The `stable` branch now points to `686976e…` and tag `v1` to `e2a55d2…`, so the `# v1` comment is wrong and the commit is reachable from no ref. The same pin comes from herdr's `ci.yml`. — [dtolnay/rust-toolchain compare](https://api.github.com/repos/dtolnay/rust-toolchain/compare/master...29eef336d9b2848a0b548edc03f92a220660cdb8)
- actionlint 1.7.12 exited 0 with no findings on herdsman's workflows (local run 2026-10-10). — herdsman's `.github/workflows/ci.yml`
- `ci.yml` handles injection correctly in one place and leaves a small gap in another:
  - It passes the PR title through `env: PR_TITLE`.
  - It interpolates `${{ github.event.before }}..${{ github.event.after }}` into `run:` directly. These are SHAs, so the risk is low, but the pattern is inconsistent. — herdsman's `.github/workflows/ci.yml`
- Secret scoping:
  - `HOMEBREW_TAP_DEPLOY_KEY` and `PACKAGES_SIGNING_KEY` are repository secrets, not environment secrets.
  - The only environment is `github-pages`, with a `main` branch policy and no environment secrets.
  - `PACKAGES_SIGNING_KEY` is read by `pages.yml`, which runs on every push to `main` touching `distribution/` or the docs, and by `linux-packages.yml`. — [GitHub API: herdsman environments](https://api.github.com/repos/remziduzagac/herdsman/environments)
- Repository Actions settings:
  - `default_workflow_permissions: read`.
  - `can_approve_pull_request_reviews: false`.
  - `allowed_actions: all`.
  - `sha_pinning_required: false`.
  - Fork PR approval policy `first_time_contributors`. — [GitHub API: herdsman actions permissions](https://api.github.com/repos/remziduzagac/herdsman/actions/permissions)
- `release.yml`, `preview.yml` and `build-artifacts-manual.yml` still set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`. It has been redundant since Node 24 became the default on 2026-06-16. — herdsman's `.github/workflows/preview.yml`
- Upstream herdr's `pr-gate.yml` runs on `pull_request_target`. It does no checkout and uses `actions/github-script` with a personal access token secret. As an organization's public repository, it falls under the 2026-11-02 default block unless herdrdev adds an Actions event policy. — [herdrdev/herdr pr-gate.yml](https://github.com/herdrdev/herdr/blob/master/.github/workflows/pr-gate.yml)

### Inferences

- Every repository: top-level `permissions: {}`, with grants per job and a comment per grant. `contents: read` passes Scorecard but `{}` is stricter and is what zizmor's own docs recommend. Also require `persist-credentials: false`, `timeout-minutes`, and env-var passing for any `${{ }}` that reaches `run:`.
- Every repository: SHA pins with exact-version comments (`# v7.0.1`, not `# v6`), Dependabot or Renovate for `github-actions` with a cooldown of at least 7 days, and zizmor plus actionlint in CI and in the local check.
- Public project: turn on the "require SHA pinning" Actions policy so pins are enforced, not just conventional. It costs nothing once all pins exist.
- Track the native lockfile and the `$/` syntax but do not require them yet: one is a technical preview with an unstable format, and actionlint cannot parse the other. A standard should name them as "adopt when actionlint supports `$/` and the lockfile reaches 1.0".
- Avoid `pull_request_target`, `workflow_run` and `issue_comment` by default. After 2026-11-02, public repositories need an explicit Actions event policy to use `pull_request_target`, and an audit skill should check for that.
- Project with users: put signing keys, deploy keys and registry credentials in a `release` environment restricted to `v*` tags. Add a required reviewer if another trusted person exists. A solo maintainer still gets tag-scoped secrets from a branch or tag policy, even without a reviewer. Publish to registries through trusted publishing.
- Do not pin SHAs of actions whose branches are rebuilt, like `dtolnay/rust-toolchain`'s toolchain branches. The commit drops off every ref, Dependabot cannot track it, and zizmor reports it as an impostor commit. Pin a release tag's SHA, or install the toolchain with `rustup` from `rust-toolchain.toml`; zizmor's `superfluous-actions` audit names `dtolnay/rust-toolchain` as replaceable by `rustup`.
- Release workflows should not restore caches (zizmor `cache-poisoning`). Build releases from a clean state.

### Gaps

- No primary GitHub Changelog entry was found announcing the lockfile's public preview date. The roadmap issue was opened 2026-06-12 and labelled "Public Preview", but the date the preview went live is unconfirmed.
- The bot-PR changelog implies, but does not state, that a GitHub App token avoids the approval step for automation-created PRs.
- Whether the 2026-11-02 `pull_request_target` default applies equally to personal-account repositories was not stated. The changelog says "public repositories" without qualification.

## 2. CI structure

### Takeaway

Run one CI workflow on `pull_request` and on pushes to protected branches, plus `merge_group` if a merge queue is used. Order its jobs so that a fast format and lint job comes first, a test matrix across operating systems follows with `fail-fast: false`, and every job has a timeout. Cancel superseded runs for PRs only. Save caches only from trusted branch pushes. Make one always-running aggregator job the single required check. Path filters belong inside the workflow, never on a required workflow's trigger.

### Cited Findings

#### Required checks and the path-filter pitfall

- When a workflow is skipped by path filtering, branch filtering or commit message, "Associated checks stay in a 'Pending' state and block merging." GitHub advises: "Avoid requiring workflows that can be skipped." A job skipped by an `if:` condition instead "reports 'Success'". If a check and a commit status share a name, both must pass. — [GitHub Docs: Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- uv's pattern:
  - A `plan` reusable workflow computes outputs from the changed files (`test-code`, `run-checks`, `save-rust-cache`, and others). Jobs are gated with `if:` on those outputs.
  - A final `required-checks-passed` job runs `if: always()`, reads `toJSON(needs)`, and fails if any needed job ended other than `success` or `skipped`. — [astral-sh/uv ci.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/ci.yml)
- Required status checks are either strict (the branch must be up to date with its base, the default) or loose. After checks pass, commits "must either be pushed to another branch and then merged or pushed directly to the protected branch". — [GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- Upstream herdr's `master-pr` ruleset:
  - It requires `check (macos-latest)` and `check (ubuntu-latest)` from integration 15368, which is GitHub Actions.
  - The checks are strict.
  - It requires one approval and allows only squash merges.
  - Its Windows matrix leg is not required. — [GitHub API: herdr rulesets](https://api.github.com/repos/herdrdev/herdr/rulesets)

#### Merge queue

- Workflows that provide required checks "must use the `merge_group` event", or "the merge will fail as the required status check will not be reported". — [GitHub Docs: Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- Merge queue settings:
  - Merge method.
  - Build concurrency of 1-100.
  - Minimum and maximum group size, with a wait time.
  - Status check timeout.
  - "Only merge non-failing PRs". — [GitHub Docs: Managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- Merge queues "are available in any public repository owned by an organization, or in private repositories owned by organizations using GitHub Enterprise Cloud", so repositories under personal accounts cannot use them. — [GitHub Docs: Merging with a merge queue](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request-with-a-merge-queue)
- biome triggers its Rust PR workflow on `merge_group` as well as `pull_request`. It combines that with a `paths:` filter on `pull_request`. — [biomejs/biome pull_request.yml](https://github.com/biomejs/biome/blob/main/.github/workflows/pull_request.yml)

#### Concurrency

- At most one run per group is in progress and one is pending. `cancel-in-progress` can be conditional, for example `${{ !contains(github.ref, 'release/') }}`. For mixed events, use `${{ github.head_ref || github.run_id }}`. New: `queue: max` allows up to 100 pending runs in FIFO order, but it cannot be combined with `cancel-in-progress: true`. — [GitHub Docs: Control workflow concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
- uv groups by `github.event.pull_request.number || github.sha`, so each push to `main` gets its own group and earlier runs are not cancelled. — [astral-sh/uv ci.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/ci.yml)
- zizmor added a `concurrency-limits` audit in v1.16.0. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)

#### Caching

- Cache access is scoped:
  - A run can restore caches from its current branch, its PR's base branch and the default branch, "but not child or sibling branches".
  - PR caches are scoped to the merge ref.
  - Only `push`, `workflow_dispatch`, `repository_dispatch`, `delete`, `registry_package`, `page_build` and `schedule` can write the default branch's scope.
- Cache limits:
  - The default limit is 10 GB per repository. Administrators can raise it at a cost: 50 GB is about $2.80 a month if fully used.
  - Entries not accessed for 7 days are evicted.
  - "Anyone who can open a pull request against your repository can read the contents of caches." — [GitHub Docs: Dependency caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
- Cache poisoning reaches high-privilege release workflows through caches written in low-privilege contexts. The fix is no cache in release workflows. — [zizmor: Audit rules](https://docs.zizmor.sh/audits/)
- Caching per ecosystem in the references:
  - Rust: `Swatinem/rust-cache` with `save-if`, plus caching of the Zig compiler and incremental state. — herdsman's `.github/workflows/ci.yml`
  - Node: `actions/setup-node` with `cache: npm` and `cache-dependency-path` pointing at the lockfile. — herdsman's `.github/workflows/pages.yml`
  - Python with uv: `UV_LOCKED: 1` workflow-wide, so CI fails on a stale lock. — [astral-sh/uv ci.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/ci.yml)

#### Matrices, ordering, timeouts, reuse and schedules

- A job's timeout defaults to 360 minutes, which the docs page mentions only in passing. — [GitHub Docs: Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- ripgrep's single `ci.yml` covers a wide matrix: many Linux targets through `cross`, plus `macos-latest`, `windows-latest` and `windows-11-arm`. It also runs nightly on `cron: '00 01 * * *'`. — [BurntSushi/ripgrep ci.yml](https://github.com/BurntSushi/ripgrep/blob/master/.github/workflows/ci.yml)
- Reusable workflows compared with composite actions:
  - A reusable workflow holds whole jobs, is called at the job level, can choose its own runner, can use secrets, logs each step, and nests up to ten levels deep.
  - A composite action is a single step that cannot use secrets and logs as one step. It is the only kind that can be published to the Marketplace. — [GitHub Docs: Reusing workflow configurations](https://docs.github.com/en/actions/concepts/workflows-and-actions/reusing-workflow-configurations)
- In September 2026 reusable workflows gained `job.workflow_ref`, `job.workflow_sha`, `job.workflow_repository` and `job.workflow_file_path`, so they can identify their own source. — [GitHub Changelog 2026-09-03](https://github.blog/changelog/2026-09-03-github-actions-early-september-2026-updates/)
- Scheduled workflows:
  - They run on the latest commit of the default branch.
  - They can be delayed under high load.
  - "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days."
  - The minimum interval is 5 minutes. — [GitHub Docs: Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- Pushes made with `GITHUB_TOKEN` do not start further workflow runs, except through `workflow_dispatch` and `repository_dispatch`. herdsman works around this by having `release.yml` dispatch `pages.yml` and `packages.yml` explicitly, and comments: "Runs this workflow starts with its own token start no workflow_run chain". — herdsman's `.github/workflows/release.yml`

#### Flaky tests

- nextest options for flaky tests:
  - It retries with `--retries N`, `NEXTEST_RETRIES` or `retries = { backoff = "exponential", count = 3, … }`.
  - Retries can be overridden per test with a filter (`[[profile.default.overrides]] filter = 'test(...)'`).
  - It marks tests that pass on retry as flaky, and `flaky-result = "fail"` turns that into a failure.
  - JUnit output carries `<flakyFailure>` elements. — [nextest: Retries and flaky tests](https://nexte.st/docs/features/retries/)
- herdsman retries only integration tests (`filter = "kind(test)"`, `retries = 1`), never unit tests, and nextest reports passes on retry as FLAKY. — herdsman's `MAINTAINING.md`

#### Local reference: herdsman CI structure

- `ci.yml` runs on `pull_request` and on pushes to `main`, `dev` and `windows`:
  - Concurrency is grouped by PR number or ref, with `cancel-in-progress: true`.
  - The check matrix runs on ubuntu, macos and windows with `fail-fast: false`, with job timeouts of 5-25 minutes.
  - Caches are saved only when `github.event_name == 'push'`, with a comment explaining that PR caches would evict the default branch's caches. — herdsman's `.github/workflows/ci.yml`
- A bug inherited from upstream: the `conventional-commits` job has `if: github.event_name != 'push' || github.ref_name == 'master'`. herdr's default branch is `master`, but herdsman pushes to `main` and `dev`, so commit-subject validation never runs on push in herdsman. Only PR titles are checked. — herdsman's `.github/workflows/ci.yml`
- `nix.yml` and `windows-arm64.yml` use workflow-level `paths:` filters. They are harmless only because herdsman requires no status checks at all. — [GitHub API: herdsman rulesets](https://api.github.com/repos/remziduzagac/herdsman/rulesets)
- Release-side jobs have no `timeout-minutes`, and the release builds restore `Swatinem/rust-cache`. `packages.yml` reinstalls the release through every channel on clean machines once Pages is deployed, and `release.yml` uses `concurrency` with `cancel-in-progress: false`. — herdsman's `.github/workflows/packages.yml`

### Inferences

- Every repository: one `ci.yml` triggered by `pull_request` and by `push` to the protected branches. Put a cheap format and lint job first or run it in parallel, and set `timeout-minutes` on every job. Add a final aggregator job (`if: always()`, evaluating `needs`) and make it the only required check. That makes renames of matrix legs and path-based skipping safe, because only one stable check name is required.
- Do change detection with a plan job or `if:` conditions inside the always-triggered workflow, never with workflow-level `paths:` on anything required. Workflow-level `paths:` stays fine for optional workflows.
- Concurrency: cancel superseded runs on PRs only, for example with `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`, or with a SHA-keyed group on pushes. Otherwise rapid pushes to `main`/`dev` leave commits that never finished CI. Use `cancel-in-progress: false` for release and deploy groups.
- Caching: restore everywhere, save only on pushes to the default or long-lived branches, never restore in release jobs, and put the toolchain version and lockfile hash into keys.
- Merge queue: adopt only for organization-owned repositories with real merge contention. For a solo maintainer it adds nothing, and personal-account repositories cannot use it. Still, list `merge_group` among the aggregator workflow's triggers wherever a queue might be used.
- Project with users: a nightly or weekly `schedule` run against the latest toolchain or dependencies catches breakage early. Note the 60-day auto-disable in quiet public repositories, which an audit skill should detect.
- Flaky tests: allow retries only for a named, narrow class of tests such as integration tests, keep retried passes visible (nextest FLAKY), and use `flaky-result = "fail"` locally or in a scheduled job to drive fixes. Quarantine a test by moving it out of the required set with an issue link, not by deleting the assertion.
- Fork leftovers: when a repository inherits workflows from another project, grep for the upstream's branch names in `if:`, `branches:` and concurrency keys. herdsman's `master` condition is exactly this kind of silent skip.

### Gaps

- The default of `strategy.fail-fast` (true, according to long-standing docs) and the 256-jobs-per-matrix limit were not re-verified this session. The fetched workflow-syntax page did not return those sentences.
- No GitHub-native flaky-test quarantine feature was found. Quarantine remains a tool-level (nextest, pytest plugins) or process-level practice.
- Per-ecosystem caching was not surveyed beyond Rust, npm and uv: Go, Java and .NET `setup-*` built-in caching were not fetched.

## 3. Branch models and repository settings

### Takeaway

Trunk-based development with short-lived branches, GitHub flow, fits most projects. A `main` branch plus a development branch fits projects that batch releases or publish a preview channel. Release branches fit only when several versions are supported. Configure protection with rulesets, not classic branch protection, for branches and for release tags. A solo maintainer should require status checks and block force-pushes and deletions, and should not require approvals, because they cannot approve their own PRs. Pick one or two merge methods, delete merged branches automatically, and enable immutable releases once the release flow uploads every asset before publishing.

### Cited Findings

#### Branch models

- Trunk-based development means developers "resist any pressure to create other long-lived development branches". Short-lived feature branches are for "code-review and build checking (CI), but not artifact creation or publication". A release branch is cut just in time, or a team releases from trunk and fixes forward. — [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)
- git-flow's author added a note on 2020-03-05: "If your team is doing continuous delivery of software, I would suggest to adopt a much simpler workflow (like GitHub flow)". git-flow fits software "that is explicitly versioned" or when supporting "multiple versions of your software in the wild". — [nvie: A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- herdsman's model has four kinds of branch:
  - `dev` integrates work.
  - `test` is fast-forwarded from `dev`, and each push publishes a preview build.
  - `main` is fast-forwarded from `test` and holds released state; it is the default branch, so visitors see the release.
  - Feature and merge branches come off `dev` and are deleted once merged. — herdsman's `MAINTAINING.md`
- Upstream herdr uses `master` only, with linear history and squash-only PR merges. — [GitHub API: herdr rulesets](https://api.github.com/repos/herdrdev/herdr/rulesets)

#### Rulesets compared with branch protection

- "Multiple rulesets can apply to the same branch at the same time, while only one branch protection rule applies". The most restrictive combination wins. "Anyone with read access to a repository can view its active rulesets", and enforcement can be toggled without deleting the ruleset. — [GitHub Docs: About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- Available rules:
  - Restrict creations, updates and deletions; deletion is restricted by default.
  - Block force pushes, by default.
  - Require linear history, signed commits, deployments to succeed, a pull request, status checks, code scanning results, or code quality results.
  - Restrict merge methods.
  - Pull request rules apply to branches only; the others apply to branches and tags. — [GitHub Docs: Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- Pull request rule options:
  - A number of required approvals.
  - Dismissing stale approvals on new commits or a changed merge base.
  - Code-owner approval.
  - Approval by someone other than the last pusher.
  - Conversation resolution.
  - Allowed merge methods.
  - Newer previews: an extra approval for unattributed PRs opened by Copilot (on by default, no effect at zero required approvals) and resolved-secret-scanning or code-coverage gates. — [GitHub Docs: Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- Signed commits:
  - Rulesets verify only new commits.
  - "Unsigned commits on pull request branches can block squash merges even if GitHub signs the final commit."
  - Vigilant mode allows "Partially verified" commits. — [GitHub Docs: Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- Rulesets work on a personal-account public repository on the Free plan. herdsman has two active rulesets:
  - "Long-lived branches" applies deletion and non-fast-forward rules to `main`, `dev` and `test`, with no bypass.
  - "Release tags" restricts creation, update and deletion on `refs/tags/v*`, with the Repository admin role (`actor_id` 5) bypassing "always". — [GitHub API: herdsman rulesets](https://api.github.com/repos/remziduzagac/herdsman/rulesets)
- Upstream herdr, an organization repository, has three rulesets:
  - `master`: deletion, non-fast-forward and linear history.
  - `master-pr`: a PR with one approval, squash only, `dismiss_stale_reviews_on_push`, and strict required checks.
  - `release-tags`: deletion, non-fast-forward, creation and update restricted on all tags (`~ALL`). — [GitHub API: herdr rulesets](https://api.github.com/repos/herdrdev/herdr/rulesets)

#### Solo-maintainer reviews, OpenSSF expectations

- Scorecard's Code-Review and Branch-Protection checks are high risk, and the docs concede that review is "infeasible for some projects, such as those with only one active participant". Bot reviews do not count. — [OpenSSF Scorecard checks](https://github.com/ossf/scorecard/blob/main/docs/checks.md)
- OpenSSF's platform practices are written for organizations. For the default branch they ask for review, two reviewers, code-owner review, signed commits, linear history, up-to-date branches, all checks passing, resolved conversations, re-approval after new changes, no force pushes and deletion protection. They also ask for fewer than three admins. — [OpenSSF SCM best practices](https://best.openssf.org/SCM-BestPractices/)

#### Merge, release and security settings

- herdsman's live settings:
  - All three merge methods are allowed.
  - `delete_branch_on_merge: false`.
  - `allow_auto_merge: false`.
  - `allow_update_branch: false`.
  - The squash title is `COMMIT_OR_PR_TITLE`.
  - Wiki and discussions are off. — [GitHub API: herdsman repository](https://api.github.com/repos/remziduzagac/herdsman)
- herdsman's security settings:
  - Secret scanning and push protection are on.
  - Dependabot security updates are off.
  - Private vulnerability reporting is on.
  - Dependabot alerts are on (`vulnerability-alerts` returns 204).
  - Code scanning default setup is `not-configured`. Eligible languages include `actions` and `rust`, so CodeQL can analyse the workflows themselves. — [GitHub API: herdsman code scanning setup](https://api.github.com/repos/remziduzagac/herdsman/code-scanning/default-setup)
- Immutable releases became generally available on 2025-10-28. Once a release is published, its assets cannot be added, modified or deleted, its tag is protected, and it gets signed attestations. The setting is per repository or per organization and applies only to new releases. — [GitHub Changelog 2025-10-28](https://github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available/)
- herdsman's immutable-releases setting is `{"enabled":false}`. — [GitHub API: herdsman immutable releases](https://api.github.com/repos/remziduzagac/herdsman/immutable-releases)
- `linux-packages.yml` attaches the `.deb`, `.rpm` and Arch packages after the release is published, with `gh release upload … --clobber`. — herdsman's `.github/workflows/linux-packages.yml`
- herdsman's CODEOWNERS is `* @remziduzagac`. GitHub recommends CODEOWNERS for `.github/workflows`, which matters only when code-owner review is required. — [GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- herdsman's Dependabot configuration is monthly, grouped, limited to one open PR, and targets `dev`, for `github-actions` and the docs site's npm packages. Rust is left out on purpose because Rust dependencies arrive with upstream merges. No `cooldown` is set, so the 3-day default applies. — herdsman's `.github/dependabot.yml`

### Inferences

- Branch model choice for a standard:
  - Every repository: default to trunk with short-lived branches.
  - Project with users and a preview channel: allow a `dev` (and `test`) branch only when it is fast-forwarded and each long-lived branch has a written purpose.
  - Multiple supported versions: release branches. herdsman's fast-forward chain is compatible with required status checks, because checks attach to the SHA tested on `dev`.
- Every repository: one branch ruleset on the default branch and long-lived branches. It blocks deletion and force-pushes, and requires the aggregator status check. Set "require a pull request" with zero approvals only when the maintainer works through PRs, which is recommended when agents write code. Use rulesets rather than classic protection: they layer, can be inspected by anyone with read access, and also cover tags.
- Public project: a tag ruleset on `v*` restricting creation, update and deletion to admins, so that only the maintainer can start a release. herdsman and herdr already do this.
- Project with users: enable immutable releases, but first change any flow that uploads assets after publishing. Create a draft, upload everything including packages, then publish. herdsman's `linux-packages.yml` would break under immutability as written.
- Approvals for a solo maintainer: requiring one approval blocks the maintainer's own PRs unless the maintainer bypasses. Prefer zero approvals plus required checks plus CODEOWNERS on `.github/` for when collaborators appear, and accept the Scorecard Code-Review penalty as a known trade-off.
- Merge settings for a standard:
  - Allow squash (PR title as subject) and optionally merge commits for upstream-style merges.
  - Disable rebase-merge unless linear history is required.
  - Turn on "automatically delete head branches" and "always suggest updating PR branches".
  - Allow auto-merge only once required checks exist, because auto-merge with no required checks merges at once.
- Signed commits: worth requiring only when every committer, agents included, can sign. SSH signing makes this practical. Otherwise the rule blocks squash merges of unsigned PR commits, as the docs warn.
- Security toggles every public repository should have: secret scanning with push protection, Dependabot alerts, private vulnerability reporting, and CodeQL default setup including the `actions` language.

### Gaps

- The bypass modes "always" and "for pull requests only" were not confirmed in a primary doc this session. The herdsman API only showed `bypass_mode: always`.
- About rulesets' plan-availability sentence came back as "Team and Enterprise" in the fetched summary. It is contradicted by herdsman's working rulesets on a personal Free public repository, so the summary was probably truncated; re-check before quoting.
- The auto-merge behaviour without required checks is inferred and was not sourced in this session.

## 4. Local and CI parity

### Takeaway

Define every check once in a task runner (just, make, mise tasks or npm scripts). CI calls the same recipes, and one local command (`just check`) runs everything CI runs. Pin toolchains in committed files so local and CI agree. Hook frameworks run a fast subset at commit time and are a convenience, not the gate: CI is the gate. In 2026 prek is the strongest drop-in for pre-commit configurations; lefthook is the Go alternative that runs hooks in parallel.

### Cited Findings

- herdsman's runner layout:
  - `just check` depends on `ci` and `windows-lint`.
  - `ci` runs `lint` (`cargo fmt --check`, `cargo clippy … -D warnings`) and then `ci-tests` (nextest plus Python maintenance tests, an architecture test and bun integration-asset tests).
  - Windows variants run through a PowerShell script. — herdsman's `justfile`
- CI calls the same recipes: `just lint` and `just ci-tests` on Linux, `just ci` on macOS, `just check` on Windows. — herdsman's `.github/workflows/ci.yml`
- herdsman's toolchain pins:
  - `rust-toolchain.toml` pins `1.96.1` with clippy and rustfmt, the same as CI's `RUST_TOOLCHAIN_VERSION`.
  - Zig 0.16.0 and Bun 1.3.14 are pinned only in workflow YAML.
  - Local Zig comes from a git-excluded `mise.local.toml`. — herdsman's `rust-toolchain.toml`
- herdsman's hooks:
  - `.githooks/pre-commit` runs `just lint` plus a guard that `skills/herdsman/SKILL.md` changes only in release commits.
  - `.githooks/commit-msg` runs the same `scripts/conventional_commits.py` that CI uses.
  - Hooks are opt-in through `just install-hooks`, which sets `core.hooksPath`. — herdsman's `.githooks/pre-commit`
- herdsman's instructions say to run `just check` before committing and not to bypass failing checks. — herdsman's `CLAUDE.md`
- prek is a Rust reimplementation of pre-commit:
  - It has "full compatibility with pre-commit configurations and hooks" and ships as a single binary needing "no Python or any other runtime".
  - It is multiple times faster, shares toolchains across hooks, and has a workspace mode for monorepos.
  - It reads a native `prek.toml` as well as pre-commit's YAML.
  - Adopters include CPython, FastAPI, Apache Airflow and Godot. — [prek documentation](https://prek.j178.dev/)
- Hook tool versions and languages as of October 2026:
  - prek 0.5.5 (2026-10-05). — [prek releases](https://github.com/j178/prek/releases)
  - lefthook v2.2.1 (2026-10-08), written in Go, "Fast and powerful Git hooks manager for any type of projects". — [evilmartians/lefthook](https://github.com/evilmartians/lefthook)
  - pre-commit is written in Python and has the largest hook ecosystem, at about 15.6k stars against about 8.9k for lefthook and 8.6k for prek on 2026-10-10. — [pre-commit/pre-commit](https://github.com/pre-commit/pre-commit)
- Task runner versions: just 1.58.0 (2026-08-03) and mise v2026.10.6 (2026-10-09). — [casey/just releases](https://github.com/casey/just/releases); [jdx/mise releases](https://github.com/jdx/mise/releases)

### Inferences

- Every repository: a single documented command (`just check`, `make check`, `mise run check` or `npm run check`) that runs formatting, lint, tests and repository contract tests. CI jobs invoke that runner's recipes rather than duplicating commands in YAML, so local-only failures and CI-only failures stay rare. An agent skill can audit this by checking that each `run:` in CI calls a recipe.
- Every repository: pin the toolchain in a committed file the local tools read, such as `rust-toolchain.toml`, `.python-version`, the `packageManager` field, `.tool-versions` or `mise.toml`, and have CI read the same file rather than repeating versions. herdsman matches for Rust but repeats Zig and Bun in YAML.
- Hooks: install by one documented command, keep them under a few seconds (format and lint only), and keep the commit-message check shared with CI. Choose prek when pre-commit-style shared hooks are wanted. Choose plain `.githooks/` plus `core.hooksPath` when the hooks only call the task runner, which needs no extra tool.
- CI must also check what hooks check (commit subjects, formatting), because hooks are optional and can be skipped with `--no-verify`. herdsman's CI misses push-time subject checks because of the `master` condition.
- For agent-heavy work, the one-command check is what the agent runs before proposing a commit. Put it in `CLAUDE.md` or `AGENTS.md`, as herdsman does.

### Gaps

- I found no neutral, primary benchmark comparing prek, lefthook and pre-commit. Speed claims come from the projects themselves or from comparison blogs.
- mise tasks and Makefile conventions were not researched in depth. Only the release versions were checked.

## 5. Self-hosted and GitHub-hosted runners, platforms and costs

### Takeaway

Public repositories get the standard GitHub-hosted runners free and unlimited, including Linux ARM64, Windows ARM64 and Apple-silicon macOS. Self-hosted runners should almost never serve public repositories. A public project therefore has no cost reason to skip a Linux, macOS and Windows matrix, or ARM legs. Cost matters only for private repositories and larger runners.

### Cited Findings

- "Use of the standard GitHub-hosted runners is free and unlimited on public repositories." Standard labels:
  - Linux x64, 4 CPU, 16 GB RAM: `ubuntu-latest` (Ubuntu 24.04), `ubuntu-24.04`, `ubuntu-22.04` and `ubuntu-26.04`.
  - Linux arm64, 4 CPU: `ubuntu-24.04-arm`, `ubuntu-22.04-arm` and `ubuntu-26.04-arm`.
  - `ubuntu-slim`: 1 CPU, 5 GB RAM.
  - Windows: `windows-latest` (Windows 2025), `windows-2022`, and arm64 `windows-11-arm`.
  - macOS arm64, 3 M1 CPUs, 7 GB RAM: `macos-latest` (macOS 26), `macos-15` and `macos-26`.
  - macOS Intel: `macos-15-intel` and `macos-26-intel`. — [GitHub Docs: GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
- Recent runner changes:
  - Ubuntu 26 became generally available on 2026-09-17.
  - The macOS 14 image was retired on 2026-10-01.
  - Node 20 was removed from runners on 2026-09-23. — [GitHub Changelog 2026-04-02 (related updates list)](https://github.blog/changelog/2026-04-02-github-actions-early-april-2026-updates/)
- Pricing for private usage:
  - On 2026-01-01 hosted-runner prices fell "by up to 39%". The new meter prices include a $0.002-per-minute platform charge.
  - A matching $0.002-per-minute charge for self-hosted runners was announced for 2026-03-01. It was postponed on 2025-12-15: "We're postponing the announced billing change for self-hosted GitHub Actions".
  - "Standard GitHub-hosted or self-hosted runner usage on public repositories will remain free". — [GitHub: 2026 pricing changes for Actions](https://github.com/resources/insights/2026-pricing-changes-for-github-actions)
- Per-minute rates from 2026-01-01 (secondary source): Linux 2-core $0.006, Windows $0.010, macOS $0.062. — [cicdcalculator.com](https://cicdcalculator.com/github-actions-pricing-changes-2026)
- GitHub on self-hosted runners for public repositories: "any user can open pull requests against the repository and compromise the environment." — [GitHub Docs: Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- OpenSSF lists "Runner Group Should Be Limited to Private Repositories". — [OpenSSF SCM best practices](https://best.openssf.org/SCM-BestPractices/)
- uv's choice of runners:
  - It runs heavy jobs on third-party runners (`depot-ubuntu-24.04-16`) and custom-labelled larger GitHub runners.
  - On forks, through `github.repository_owner == 'astral-sh' && … || 'ubuntu-latest'`, it falls back to standard labels, and to `ubuntu-slim` for the aggregator job. — [astral-sh/uv ci.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/ci.yml)
- herdsman's runners:
  - `ubuntu-latest`, `macos-latest` and `windows-latest` for checks.
  - `windows-2022` for the ConPTY package job.
  - `windows-11-arm` for the ARM installer test.
  - Releases cross-compile `aarch64` Linux on x64 Ubuntu and both macOS targets on `macos-latest`. — herdsman's `.github/workflows/release.yml`

### Inferences

- Public project: use standard hosted runners only. Test on Linux, macOS and Windows whenever users run there, and add native ARM legs (`ubuntu-24.04-arm`, `windows-11-arm`) when shipping ARM binaries, because they cost nothing. Use `ubuntu-slim` for trivial jobs such as aggregators and label checks.
- Prefer pinned image labels (`ubuntu-24.04`, `macos-15`) for release builds, where reproducibility matters, and `-latest` for tests. `-latest` moves: `macos-latest` is now macOS 26, and `windows-latest` is Windows 2025.
- Private repositories, or the "every repository" level in general: keep matrices lean on macOS, where 2-core minutes cost about ten times the Linux price. Self-hosted runners avoid that cost but only suit private repositories.
- Self-hosted runners on public repositories should be listed as an anti-pattern for a standard. zizmor's `self-hosted-runner` audit can flag them.

### Gaps

- Per-minute rates came from a secondary calculator site. GitHub's page states the 39% reduction and the platform charge but returned no per-SKU table in the fetch.
- Runner minute and concurrency limits for free public usage (concurrent jobs per account) were not fetched.
