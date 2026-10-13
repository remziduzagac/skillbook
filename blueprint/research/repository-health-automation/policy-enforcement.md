# Continuous policy and settings enforcement for GitHub repositories

Research date: 2026-10-10. Repository status (latest release, last push, open issues, archived flag) was read with `gh api repos/<owner>/<repo>` and `gh api repos/<owner>/<repo>/releases` on 2026-10-10; READMEs, docs and code were read with `gh api .../contents` or `.../readme`. GitHub Docs claims cite the rendered page and, where the rendered page hides plan gating, the `github/docs` source file that holds the gating text. The local reference is `herdsman/MAINTAINING.md` (branch `dev`), section "Repository settings".

## OpenSSF Allstar: checks, reporting, personal-account support, maintenance

### Takeaway

Allstar is maintained (v4.6, 2026-08-31), but the OpenSSF-hosted app was retired in August 2026. Everyone now has to create their own GitHub App and run Allstar as a scheduled Action or as a daemon. It reports by opening one issue per policy and can auto-fix some policies. Its documentation and setup assume an organisation. Its branch-protection policy reads only classic branch protection, not rulesets, so it is a poor fit for a ruleset-based personal-account standard like greenrepo.

### Cited Findings

- Allstar is "a GitHub App that continuously monitors GitHub organizations or repositories for adherence to security best practices. If Allstar detects a security policy violation, it creates an issue to alert the repository or organization owner. For some security policies, Allstar can also automatically" fix the violation — [ossf/allstar README](https://github.com/ossf/allstar)
- Hosted app retired: "The OpenSSF-hosted Allstar GitHub App has been retired. Allstar, the OpenSSF Scorecard subproject, itself continues to be maintained — you must now run it yourself, either as a GitHub Action or as a service daemon." — [ossf/allstar README](https://github.com/ossf/allstar)
- Issue #881 (opened 2026-08-31): "With the release of Allstar v4.6, we are retiring the OpenSSF hosting of the GitHub App, due to funding constraints. Allstar ... will continue to be developed and maintained." — [ossf/allstar#881](https://github.com/ossf/allstar/issues/881)
- The v4.6 release notes say the hosted app ran on OpenSSF Scorecard's GCP infrastructure, which moved "because foundation GCP funding ended". "Allstar is now self-host only." Organisations "must now create their own GitHub App and run either the GitHub Action or the service daemon". v4.6 also fixes advisory GHSA-r4gf-cmfp-wq5c, where an action policy mixing deny with allow/require rules "may have been silently permitting what it was configured to deny" — [Allstar v4.6 release](https://github.com/ossf/allstar/releases/tag/v4.6)
- Status on 2026-10-10: not archived; releases v4.6 (2026-08-31), v4.5 (2025-10-01), v4.4 (2025-05-20); last push 2026-09-25; 72 open issues; about 1,459 stars — [ossf/allstar](https://github.com/ossf/allstar) (gh api, 2026-10-10)
- Run modes: "GitHub Action: Scheduled job in your `.allstar` repo; you provide nothing beyond GitHub; cadence is whatever you set the cron to; setup effort moderate". "Service daemon: persistent process you host; continuous, results in 5-10 minutes; setup effort high". "The Action is the lower-overhead of the two and is where most organizations should start" — [ossf/allstar README](https://github.com/ossf/allstar)
- Setup always needs your own GitHub App (App ID and private key) and a `.allstar` control repository. "Allstar reads its configuration from a repository named `.allstar` in your organization." The Action guide says to "set up a recurring Action in your `.allstar` repository". It uncomments a `schedule` with `cron: '0 0 * * *'` and stores the App ID in an environment "In your GitHub organization under Settings -> Environments" — [ossf/allstar README](https://github.com/ossf/allstar); [github-action-installation.md](https://github.com/ossf/allstar/blob/HEAD/github-action-installation.md)
- Actions: `log` (default, not visible), `issue`, `fix`. With `issue`: "Only one issue is created per policy ... If the issue is already open, it is pinged with a comment every 24 hours without updates (not currently user configurable) ... Once the violation is addressed, the issue will be automatically closed by Allstar within 5-10 minutes." `fix` "will make the changes to the GitHub settings to correct the policy violation. Not all policies will be able" to fix. `block` (a status check) and `email` are "Proposed, but not yet implemented". `issueRepo` can route all issues to one repository at organisation level — [ossf/allstar README](https://github.com/ossf/allstar)
- Policies:
  - Branch Protection (`fix` supported).
  - Binary Artifacts (Scorecard check).
  - CODEOWNERS (file presence).
  - Outside Collaborators (admin/push access by non-members).
  - SECURITY.md (present and not empty).
  - Dangerous Workflow (runs on all branches).
  - Generic Scorecard Check: any Scorecard check against a `threshold`, with optional SARIF upload to code scanning.
  - GitHub Actions: require/deny rules for workflows.
  - Repository Administrators (a user or group must be admin).
  - Listed only as "Future Policies": "Ensure dependabot is enabled", "Check that dependencies are pinned/frozen".
  - Source: [ossf/allstar README, Policies](https://github.com/ossf/allstar)
- The branch protection policy calls the classic `GetBranchProtection` API ([branch.go](https://github.com/ossf/allstar/blob/HEAD/pkg/policies/branch/branch.go)). The feature request "Check rulesets for branch protection rules" has been open since 2023-11-24 ([ossf/allstar#475](https://github.com/ossf/allstar/issues/475)). "Monitor/enable GitHub's secret detection feature" has been open since 2023-03-02 ([ossf/allstar#363](https://github.com/ossf/allstar/issues/363)).
- The Outside Collaborators policy is organisation-centred: "This policy requires users with this access to be members of the organisation" — [outside.go](https://github.com/ossf/allstar/blob/HEAD/pkg/policies/outside/outside.go)
- Scorecard's infrastructure notice (2026-08-30) says "Allstar users: the hosted GitHub App is being retired — switch to self-hosting." — [ossf/scorecard#5208](https://github.com/ossf/scorecard/issues/5208)

### Inferences

- For a personal account, Allstar would mean: create a personal GitHub App, create `<user>/.allstar`, and run a scheduled Action there. That is the same shape as greenrepo's current weekly workflow plus a pinned issue, with more setup and an App private key to guard.
- greenrepo enforces branch rules with rulesets (herdsman uses the "Long-lived branches" and "Release tags" rulesets, per MAINTAINING.md). Allstar's Branch Protection policy reads classic protection only, so it would likely report violations, or with `fix` add classic protection, on ruleset-protected repositories. This is inferred from the code path and the open #475, not tested.
- Allstar covers few of greenrepo's settings: no merge methods, no Dependabot or secret scanning, and no default workflow token permissions. Its useful parts (Dangerous Workflow, Binary Artifacts, SECURITY.md, Scorecard thresholds) are Scorecard checks that the Scorecard Action can run without an App.

### Gaps

- No document or issue says whether Allstar works when its App is installed on a personal (user) account. All docs say "organization". The `.allstar` lookup is by owner name, so it may work, but I found no confirmation and did not test it.
- I did not check whether the Generic Scorecard policy's Branch-Protection check reads rulesets. Scorecard itself does (see the Scorecard section).

## Settings as code: safe-settings, Probot settings app, Terraform, and 2025-2026 alternatives

### Takeaway

- safe-settings is active (3.0.0 on 2026-10-05) and is the only one that both reverts UI drift and re-syncs on a schedule. It is built for organisations and must be self-hosted.
- The Probot settings app (repository-settings/app) is active, has a free hosted app usable on personal repositories, and covers rulesets, merge methods and Dependabot alerts/fixes. It only applies settings when `.github/settings.yml` changes, so it does not detect or revert drift.
- Terraform's `integrations/github` provider covers the most settings per repository and works with a personal owner and token. It detects drift only when someone runs `plan`, and it needs state.
- A new Action, Vivswan/github-settings-as-code (2026), is the closest fit for a personal account: per-repository YAML, a fine-grained PAT, and a `check` mode that reports drift. It is very young, with a single maintainer.

### Cited Findings

safe-settings:

- The repository moved: `github/safe-settings` now resolves to `github-community-projects/safe-settings`. Releases are 3.0.0 (2026-10-05), 3.0.0-rc.1 (2026-10-01) and 2.1.21-rc.1 (2026-05-12). Last push 2026-10-05; 241 open issues; about 925 stars — [github-community-projects/safe-settings](https://github.com/github-community-projects/safe-settings) (gh api, 2026-10-10)
- It describes itself as "Policy-as-Code for GitHub Organizations". "All the settings are stored centrally in an `admin` repo within the organization. Unlike the GitHub Repository Settings App, the settings files cannot be in individual repositories." It has org-level, suborg-level and repo-level settings. Org-targeted settings: "Currently, only `rulesets` are supported" — [safe-settings README](https://github.com/github-community-projects/safe-settings)
- Drift handling:
  - It runs as a webhook service or a scheduled job, "It can also be triggered through GitHub Actions".
  - "If the `ruleset` settings are modified in the UI manually, `safe-settings` will `sync` the settings to prevent any unauthorized changes."
  - "The App can be configured to apply the settings on a schedule. This could be a way to address configuration drift since webhooks are not always guaranteed to be delivered" (`CRON` env var).
  - Pull requests to the admin repository get a `nop` dry-run with a PR comment.
  - Source: [safe-settings README](https://github.com/github-community-projects/safe-settings)
- Deployment: AWS Lambda template, Docker, Heroku/Glitch/Kubernetes — [safe-settings README](https://github.com/github-community-projects/safe-settings)
- Settings covered:
  - The README lists `milestones`, `branches`, `autolinks`, `validator`, `rulesets`, `environments`, `custom_properties`, `custom_repository_roles`, `variables` and `archive` ([safe-settings README](https://github.com/github-community-projects/safe-settings)).
  - The sample `settings.yml` includes `security: enableVulnerabilityAlerts / enableAutomatedSecurityFixes`, and `allow_squash_merge`, `allow_merge_commit`, `allow_rebase_merge` and `delete_branch_on_merge` ([sample settings](https://github.com/github-community-projects/safe-settings/tree/HEAD/docs/sample-settings)).

Probot settings app (repository-settings/app):

- "This GitHub App syncs repository settings defined in `.github/settings.yml` to GitHub, enabling Pull Requests for repository settings." "A hosted version is provided for use with GitHub.com. Install the app on your repositories or entire organization" (powered by Vercel); self-hosting is documented — [repository-settings/app README](https://github.com/repository-settings/app)
- Status: latest releases v5.0.14 (2026-08-29), v5.0.13 (2026-08-03), v5.0.12 (2026-06-30); commits through 2026-10-08; 88 open issues; about 1,059 stars — [repository-settings/app](https://github.com/repository-settings/app) (gh api, 2026-10-10)
- Plugins in `lib/plugins`: branches, collaborators, environments, labels, milestones, repository, rulesets, teams ([lib/plugins](https://github.com/repository-settings/app/tree/HEAD/lib/plugins)). The repository section covers `allow_squash_merge` and the other merge settings, `delete_branch_on_merge`, `enable_automated_security_fixes` and `enable_vulnerability_alerts` ([docs/plugins/repository.md](https://github.com/repository-settings/app/blob/HEAD/docs/plugins/repository.md)).
- Inheritance: settings can be inherited "from another repo, and only override what you want to change" (for example a `.github` repo) — [docs/configuration.md](https://github.com/repository-settings/app/blob/HEAD/docs/configuration.md)
- Triggers in `index.js`:
  - `push`, only when the default branch is pushed and `.github/settings.yml` was added or modified;
  - `repository.edited`, only when the default branch changed;
  - `repository.created`.
  - Source: [index.js](https://github.com/repository-settings/app/blob/HEAD/index.js)
- Caution: the app "inherently escalates anyone with `push` permissions to the admin role, since they can push config settings to the default branch". The README suggests CODEOWNERS plus required code-owner review — [repository-settings/app README](https://github.com/repository-settings/app)

Terraform `integrations/github` provider:

- Status: v6.13.0 (2026-07-08), v6.12.1 (2026-04-28); commits through 2026-10-07; 343 open issues. The v6.13.0 highlights include a "New GitHub API client" and "User" and "EnterpriseOwner" as valid ruleset bypass actor types — [v6.13.0 release](https://github.com/integrations/terraform-provider-github/releases/tag/v6.13.0)
- Owner selection: `organization`, `GITHUB_ORGANIZATION`, `GITHUB_OWNER`, or `owner`. Authentication can use a GitHub App, an OAuth token, or a PAT — [provider docs index](https://github.com/integrations/terraform-provider-github/blob/HEAD/docs/index.md)
- Repository-scoped resources:
  - `github_repository_ruleset`, `github_branch_protection`;
  - `github_repository_vulnerability_alerts`, `github_repository_dependabot_security_updates`;
  - `github_actions_repository_permissions`, `github_actions_repository_access_level`;
  - `github_workflow_repository_permissions`;
  - `github_repository_environment`, `github_repository_autolink_reference`, `github_repository_pages`.
  - Source: [docs/resources](https://github.com/integrations/terraform-provider-github/tree/HEAD/docs/resources)
- `github_workflow_repository_permissions` manages `default_workflow_permissions` ("read") and `can_approve_pull_request_reviews`. "You must have admin access to a repository to use this resource" — [workflow_repository_permissions.md](https://github.com/integrations/terraform-provider-github/blob/HEAD/docs/resources/workflow_repository_permissions.md)
- `github_repository` covers merge settings and a `security_and_analysis` block with `advanced_security`, `code_security`, `secret_scanning`, `secret_scanning_push_protection`, `secret_scanning_ai_detection` and `secret_scanning_non_provider_patterns`. "With GitHub App authentication, even GET requests must have the `contents:write` permission. Without it, the following arguments will be ignored": the merge settings — [repository.md](https://github.com/integrations/terraform-provider-github/blob/HEAD/docs/resources/repository.md)

Alternatives seen in 2025-2026:

- **Vivswan/github-settings-as-code.** A "GitHub Action applying declarative repository settings: rulesets, labels, branch protection, and more. A loud, stateless Probot Settings replacement."
  - It manages branch, tag and push rulesets.
  - "Every apply is a visible workflow run that fails with the API's error message."
  - It needs a fine-grained PAT stored as `ADMIN_TOKEN`; "the default `GITHUB_TOKEN` is not enough".
  - `mode: check` produces "the drift report [that] lists everything an apply would change or delete, and nothing is written".
  - v2 manages Actions keys such as `actions.fork_pr_contributor_approval` and `actions.oidc_customization_sub`.
  - Created 2026-07-20; v2.0.0 released 2026-08-11; 3 stars. "Only the latest release is supported."
  - Sources: [Vivswan/github-settings-as-code](https://github.com/Vivswan/github-settings-as-code) (README and gh api, 2026-10-10)
- **eclipse-csi/otterdog.** "A tool to manage GitHub organizations at scale using a configuration as code approach", used by the Eclipse Foundation; v1.6.1 (2026-09-24) — [eclipse-csi/otterdog](https://github.com/eclipse-csi/otterdog). Its open issues show plan-gating bugs: "Organization rulesets are rejected with a validation ERROR on 'team' plan orgs" ([#776](https://github.com/eclipse-csi/otterdog/issues/776)) and "Repo rulesets are never read for private repos unless the org is on an 'enterprise' plan" ([#729](https://github.com/eclipse-csi/otterdog/issues/729)).
- **mindersec/minder.** It "continuously enforce[s] best practice security configurations by setting granular policies to alert only or auto-remediate".
  - Custcodian runs "a free-to-use public instance ... free to use for public repositories; for private repositories, there may be an additional charge".
  - It can be self-hosted via Helm.
  - Latest release v0.3.2 (2026-09-15); pushed 2026-10-10.
  - Sources: [mindersec/minder README](https://github.com/mindersec/minder) (gh api, 2026-10-10)
  - Enrolment: "You can select your personal account, or a GitHub organization" — [enroll_provider.mdx](https://github.com/mindersec/minder/blob/HEAD/docs/docs/getting_started/enroll_provider.mdx)
  - It is listed as an OpenSSF project — [openssf.org/projects/minder](https://openssf.org/projects/minder/)
- **Legit-Labs/legitify.** It aims to "Detect and remediate misconfigurations and security risks across all your GitHub and GitLab assets". Last release v1.0.11 (2024-07-09); last push 2026-08-31 — [Legit-Labs/legitify](https://github.com/Legit-Labs/legitify) (gh api, 2026-10-10)

### Inferences

- None of the mature tools covers greenrepo's whole settings list in one place. Rulesets, merge methods and Dependabot toggles are widely covered. Default workflow token permissions and Actions policies are covered by Terraform and partly by github-settings-as-code; Probot settings does not cover them, judging by its plugin list.
- safe-settings is the strongest at preventing drift, but its organisation model (admin repo, suborgs, org-targeted rulesets) and self-hosted service are heavy for one person with a personal account.
- For the Probot settings app, the hosted app costs nothing to run and `_extends` lets one base repository hold shared defaults. It is "settings applied on change", not "settings kept": a UI change survives until the next edit of `settings.yml`. A weekly check is still needed to catch drift.
- Terraform drift detection needs a scheduled `terraform plan` (for example in Actions) with state stored somewhere durable. That is more machinery than greenrepo's weekly workflow, but it would give a precise diff.

### Gaps

- I could not confirm whether safe-settings works on a personal account. Its docs speak only of organisations, and an issue search for "personal" and "user account" found nothing relevant.
- I did not verify whether Probot settings' hosted app is still reliably operated (uptime, who pays for Vercel), only that the README offers it.
- I found no primary source on HCP Terraform's drift-detection ("health assessments") tier or price.
- I did not verify whether Legitify supports personal-account repositories.

## GitHub's own policy features, and which exist for a personal account

### Takeaway

A personal account gets repository-level rulesets (public repositories on Free; private repositories need Pro), ruleset history and JSON import/export, per-repository Actions settings including SHA pinning and default `GITHUB_TOKEN` permissions, and account-wide "enable all / enable by default for new repositories" toggles for Dependabot alerts. It does not get organisation rulesets, security configurations, or any account-level Actions policy. Nothing native stops the owner from changing a setting, and nothing reports when one changes.

### Cited Findings

- "Rulesets are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, and GitHub Enterprise Cloud." "Push rulesets are available for the GitHub Team plan in internal and private repositories" — [github/docs gated-features/repo-rules.md](https://github.com/github/docs/blob/HEAD/data/reusables/gated-features/repo-rules.md); rendered at [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- Plan for organisation rulesets: sources conflict.
  - The About rulesets source says "For organizations on the GitHub Enterprise plan, you can set up rulesets at the ... organization level" — [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).
  - The changelog of 2025-06-16 says organisation rulesets are "now available for GitHub Team plans" — [GitHub Changelog](https://github.blog/changelog/2025-06-16-organization-rulesets-now-available-for-github-team-plans/).
  - Either way they are organisation-only.
- Enforcement statuses are Active and Disabled. "Evaluate" (monitor in Rule Insights without enforcing) appears only under the `repo-rules-enterprise` version gate — [github/docs rulesets-about-enforcement-statuses.md](https://github.com/github/docs/blob/HEAD/data/reusables/repositories/rulesets-about-enforcement-statuses.md)
- Ruleset history and import/export:
  - "You can import an existing ruleset using a JSON file. This can be useful if you want to apply the same ruleset to multiple repositories or organizations."
  - "Ruleset history lists events triggered by changes that affect your rulesets within the last 180 days ... You can also download a JSON file containing the ruleset's configuration ... The bypass list of a ruleset is excluded from the exported JSON file."
  - Repository rulesets also have an Insights page.
  - Source: [Managing rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository)
- Security configurations are organisation-only: "Security configurations are collections of enablement settings for GitHub's security features that you can apply to any repository within an organization." Once applied, a repository "enters a managed relationship with that configuration", and enforcement can be enabled — [About enabling security features at scale](https://docs.github.com/en/code-security/securing-your-organization/introduction-to-securing-your-organization-at-scale/about-enabling-security-features-at-scale)
- Personal-account security toggles: Dependabot alerts can be enabled or disabled "for: Your personal account, Your repository, Your organization". "You can enable or disable Dependabot alerts for all repositories owned by your personal account" via **Enable all / Disable all**, and optionally "Enable by default for new repositories" — [Configuring Dependabot alerts](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-dependabot-alerts)
- "Push protection for users automatically protects you from accidentally committing secrets to public repositories, regardless of whether the repository itself has secret scanning enabled. Push protection for users is on by default" — [GitHub security features](https://docs.github.com/en/code-security/getting-started/github-security-features)
- Actions settings for a personal repository are per repository.
  - "By default, when you create a new repository in your personal account, `GITHUB_TOKEN` only has read access for the `contents` and `packages` scopes. If you create a new repository in an organization, the setting is inherited from what is configured in the organization settings."
  - The org policy note says that if an organisation selected a more restrictive default, the repository's permissive option is disabled.
  - Source: [Managing GitHub Actions settings for a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)
- The Actions policy settings shown on the repository page include "Require actions to be pinned to a full-length commit SHA ... Reusable workflows can still be referenced by tag" — [github/docs actions-use-policy-settings.md](https://github.com/github/docs/blob/HEAD/data/reusables/actions/actions-use-policy-settings.md) (included from the repository Actions settings page above)
- A web-search summary claimed rulesets "do NOT work on private personal repositories at all". This contradicts the docs gating text above (Pro covers private repositories). The underlying discussion is about a private repository in an organisation on the Free plan — [community discussion #184363](https://github.com/orgs/community/discussions/184363). Treat the summary as wrong.
- Local reference: herdsman records its settings as prose.
  - Rulesets "Long-lived branches" (no deletion or force push of `main`, `dev`, `test`) and "Release tags" (only admins create, move or delete `v*`).
  - Monthly grouped Dependabot updates.
  - Private vulnerability reporting.
  - Source: `herdsman/MAINTAINING.md`, section "Repository settings".

### Inferences

- For a personal account, GitHub's own features prevent some actions (rulesets block force pushes, tag moves and so on). They never stop the owner, who is the only admin, from editing or disabling a ruleset or toggling a security feature. They also send no notice when that happens. Detecting drift therefore stays greenrepo's job, or a third party's.
- Ruleset JSON export/import gives a native "rulesets as files" path. greenrepo can keep the exported JSON in the repository (bypass list excluded) and have the weekly workflow diff it against `GET /repos/{owner}/{repo}/rulesets`. This needs no new tool.
- Converting the personal account to an organisation (Free) would unlock security configurations and organisation policies. Organisation rulesets need at least Team per the changelog, and private-repository rulesets need a paid plan. That is a bigger change than greenrepo's scope.

### Gaps

- I did not find the current personal-account docs page listing every "enable all / default for new repositories" toggle (dependency graph, Dependabot security updates, secret scanning). Only Dependabot alerts is confirmed above.
- I did not confirm the date the repository-level SHA-pinning option became available; the docs source shows it behind the `actions-blocklist-sha-pinning` version flag.
- I did not test whether a fine-grained PAT or `GITHUB_TOKEN` can read every greenrepo setting. For example, the Scorecard docs say some classic branch-protection fields need an admin token.

## OpenSSF Scorecard Action as a continuous check, and Repolinter's archival

### Takeaway

The Scorecard Action (v2.4.4, 2026-07-23) is a maintained, scheduled check that reports to code scanning and an optional public badge or API. It is free for public repositories but needs GitHub Advanced Security for private ones, and it does not enforce anything. It reads rulesets with the default token. Its Token-Permissions check looks at workflow files, not the repository's default token setting. Repolinter was archived on 2026-02-06 with no official successor. Independent replacements are file-tree linters (alint, qualcomm/repo-policy-action, repolint). The OpenSSF's OSPS Baseline scanner (Privateer plugin) is the most relevant new API-based checker.

### Cited Findings

Scorecard Action:

- "The Scorecards GitHub Action is free for all public repositories. Private repositories are supported if they have GitHub Advanced Security. Private repositories without GitHub Advanced Security can run Scorecards from the command line" — [ossf/scorecard-action README](https://github.com/ossf/scorecard-action)
- "The following GitHub triggers are supported: `push`, `schedule` (default branch only)." Results appear "through the Scorecard Badge, Code Scanning Alerts or GitHub Workflow Runs". `publish_results: true` with `id-token: write` feeds the badge and the REST API at api.scorecard.dev — [ossf/scorecard-action README](https://github.com/ossf/scorecard-action)
- Rulesets: "GitHub's new Repository Rules are accessible to Scorecard Action with the workflow's default `GITHUB_TOKEN`. We recommend new repositories use Repository Rules so they can be read with the default GitHub token." Classic branch protection needs a fine-grained PAT — [ossf/scorecard-action README](https://github.com/ossf/scorecard-action)
- Status: v2.4.4 (2026-07-23), v2.4.3 (2025-09-30); 46 open issues. Scorecard itself: v5.5.0 (2026-04-23), commits through 2026-10-09 — [ossf/scorecard-action](https://github.com/ossf/scorecard-action); [ossf/scorecard](https://github.com/ossf/scorecard) (gh api, 2026-10-10)
- Infrastructure change (issue opened 2026-08-30):
  - "Scorecard's hosted services are moving from GCP to AWS by September 2nd."
  - The Scorecard Steering Committee is "partnering with AboutCode Foundation" to run the weekly scans and REST API.
  - "BigQuery public dataset will no longer be available."
  - "Scorecard Action users must upgrade to >= v2.4.4."
  - Source: [ossf/scorecard#5208](https://github.com/ossf/scorecard/issues/5208)
- Checks: Binary-Artifacts, Branch-Protection, CI-Tests, CII-Best-Practices, Code-Review, Contributors, Dangerous-Workflow, Dependency-Update-Tool, Fuzzing, License, Maintained, Packaging, Pinned-Dependencies, SAST, SBOM, Security-Policy, Signed-Releases, Token-Permissions, Vulnerabilities, Webhooks — [docs/checks.md](https://github.com/ossf/scorecard/blob/HEAD/docs/checks.md)
- Token-Permissions: "The highest score is awarded when the permissions definitions in each workflow's yaml file are set as read-only at the top level and the required write permissions are declared at the run-level" — [docs/checks.md](https://github.com/ossf/scorecard/blob/HEAD/docs/checks.md)
- Branch-Protection: some settings "require an admin token ... However, all of these settings are accessible via Repo Rules. `EnforceAdmins` ... is calculated as `false` if any Bypass Actors are defined on any rule". Scoring is tiered — [docs/checks.md](https://github.com/ossf/scorecard/blob/HEAD/docs/checks.md)

Repolinter and successors:

- Repolinter: "The Repolinter project has been archived. If you are a TodoGroup member and wish to see the repository unarchived, please bring this up within the TodoGroup." Archived flag true; last commit "Archiving Repolinter" 2026-02-06; last release v0.12.0 (2025-05-09) — [todogroup/repolinter](https://github.com/todogroup/repolinter) (README and gh api, 2026-10-10). The README names no successor.
- alint describes itself as "a linter for the shape of a repository. It checks which files exist, what they're named, what they contain, the values inside your config files and how files relate to one another."
  - It is not affiliated with the TODO Group: "Repolinter was the closest prior tool, and it was archived in February
    2026. alint covers much of the same ground."
  - v0.17.0 was released 2026-10-01; it is pre-1.0 ("the config format can still change between minor versions"), works on the working tree, and has a GitHub Action.
  - Source: [Introducing alint](https://alint.org/blog/introducing-alint/)
  - Migration coverage figures differ between the search snippet (42 default rules: 30 full, 8 partial, 4 none) and the fetched blog text (24 of 26 checks). Treat the exact numbers as unverified.
- qualcomm/repo-policy-action "replaces the archived `todogroup/repolinter-action` and its underlying `todogroup/repolinter` engine, both of which were officially archived by TODOGroup in February 2026".
  - It is Python, parses "a strict subset of the `repolint.json` schema", and is "deliberately scoped to structural repository policy".
  - It notes: "Scorecard only runs on a schedule and posts to the Security tab; it does not block merges."
  - v0.1.0 (2026-08-31); 0 stars.
  - Source: [qualcomm/repo-policy-action](https://github.com/qualcomm/repo-policy-action)
- Dvorinka/repolint: "Open-source repository linter — checks LICENSE, docs, CI, release automation, community files, and GitHub metadata. fix scaffolds the missing pieces." Created 2026-10-06; v0.1.0; 1 star — [Dvorinka/repolint](https://github.com/Dvorinka/repolint) (gh api, 2026-10-10)
- ossf/pvtr-github-repo-scanner "performs automated assessments against GitHub repositories using controls defined in the Open Source Project Security Baseline".
  - It bundles "osps-baseline — always the latest bundled catalog (currently 2026-08)".
  - Some steps "return a needs-review result pending manual verification". "Maturity-1 requirements are the most rigorously tested."
  - Results power LFX Insights' Security & Best Practices.
  - A GitHub Action ("OSPS Security Baseline Scanner") exists.
  - v0.32.0 (2026-10-09).
  - Source: [ossf/pvtr-github-repo-scanner](https://github.com/ossf/pvtr-github-repo-scanner) (README and gh api, 2026-10-10)

### Inferences

- The Scorecard Action can be greenrepo's continuous security check for public repositories. Its output lands in code scanning, not in an issue, and it does not check merge methods, the default workflow token setting, or whether Dependabot or secret scanning are switched on. Personal accounts cannot buy GitHub Advanced Security, so for private personal repositories the code-scanning output is unavailable. Running the Scorecard CLI with JSON output inside greenrepo's weekly workflow is the fallback (inference from the README's private-repository note).
- No Repolinter successor checks GitHub settings except repolint, which claims "GitHub metadata" and is days old. The file-tree linters (alint, repo-policy-action) overlap with what greenrepo can already check in the working tree.
- The OSPS Baseline scanner is the only maintained OpenSSF tool found that assesses repository settings against a published control catalogue. It is worth evaluating as a source of rule IDs and checks for greenrepo's settings rules.

### Gaps

- I did not read the OSPS Baseline scanner's step list, so I cannot say which greenrepo settings it checks (rulesets, merge methods, token permissions) or what token it needs for private repositories.
- I did not verify alint's or repolint's GitHub-metadata coverage beyond their own descriptions.

## Trade-off for a solo maintainer with many repositories

### Takeaway

No tool fits a personal account cleanly and also detects drift, covers greenrepo's settings, and needs no hosting. The cheapest strong option is to extend what greenrepo already has. Keep a settings file per repository (or a shared base) that matches GitHub's own JSON shapes, have the weekly workflow diff live settings against it with a fine-grained PAT and report into the health issue, and add the Scorecard Action for public repositories. Adopt Probot settings or github-settings-as-code only if greenrepo wants writes (apply), not just reports. Keep the periodic agent audit for judgement calls that no API diff can make.

### Cited Findings

- Detection or prevention by option, from the sections above:
  - safe-settings: reverts UI drift and syncs on a schedule, but it is organisation-only and self-hosted.
  - Probot settings: applies settings on file change only, has a hosted app, and works on personal repositories.
  - Terraform: diffs on `plan`, and needs state and a scheduler.
  - github-settings-as-code: Action-based with a PAT, and `mode: check` gives a drift report; very new.
  - Allstar: issues per policy, but org-oriented, no rulesets, and now self-host only.
  - Minder: alert or remediate; the hosted instance is free for public repositories and supports enrolling a personal account.
  - Sources: [safe-settings](https://github.com/github-community-projects/safe-settings); [repository-settings/app](https://github.com/repository-settings/app); [terraform-provider-github](https://github.com/integrations/terraform-provider-github); [github-settings-as-code](https://github.com/Vivswan/github-settings-as-code); [ossf/allstar](https://github.com/ossf/allstar); [mindersec/minder](https://github.com/mindersec/minder)
- Hosted services can vanish. The OpenSSF-hosted Allstar app was retired "due to funding constraints" ([ossf/allstar#881](https://github.com/ossf/allstar/issues/881)), and Scorecard's hosted services moved organisations ([ossf/scorecard#5208](https://github.com/ossf/scorecard/issues/5208)).
- An app that applies settings from a file escalates push access to admin ("escalates anyone with `push` permissions to the admin role") — [repository-settings/app README](https://github.com/repository-settings/app)
- Writing settings needs admin-level credentials. Terraform's workflow-permissions resource needs "admin access to a repository" ([workflow_repository_permissions.md](https://github.com/integrations/terraform-provider-github/blob/HEAD/docs/resources/workflow_repository_permissions.md)), and github-settings-as-code says the default `GITHUB_TOKEN` "is not enough" ([github-settings-as-code](https://github.com/Vivswan/github-settings-as-code)).
- GitHub's native features for personal accounts give per-repository rulesets with 180-day history and JSON export/import, but no organisation-wide policy or security configuration — see the GitHub section above.

### Inferences

Settings-as-code file per repository (Probot settings, github-settings-as-code, Terraform):

- Pros: the desired state is reviewable in the tree, which suits greenrepo's "rules live in the repo" approach and agents that edit files. It also gives apply.
- Cons: an admin-scoped secret (a PAT, or an App with admin) in every repository, or in one central repository, which is a supply-chain target. Drift is only caught if it runs on a schedule. Each tool's schema lags new GitHub settings (for example the SHA-pinning policy and new security toggles).
- Probot settings' `_extends` gives a cheap per-account base without one central admin repository.

Single account-level controller (safe-settings, Terraform workspace, a `.allstar`-style repo):

- One place to change many repositories, but it needs hosting or state.
- safe-settings and Allstar assume an organisation. For a personal account, Terraform with one workspace over all repositories, or a single scheduled workflow in a "control" repository with a fine-grained PAT, is the realistic version.

App (Probot hosted, Minder hosted):

- No infrastructure, but trust is given to a third-party service with admin access to every repository, plus dependence on someone else's funding (see the Allstar retirement).

Periodic agent audit:

- Catches judgement items (are the rules still right?) and new GitHub features that no schema knows about.
- It is too infrequent to catch drift (twice a year), so it should complement a weekly machine diff, not replace it.

Suggested split for greenrepo (inference):

1. A machine-readable expected-settings file in each repository, using GitHub API field names. Reuse the ruleset export JSON as-is.
2. The existing weekly workflow reads live settings with a fine-grained read-only PAT and diffs them. Mismatches go into the pinned "Repository health" issue. It reports and does not apply, so no admin secret sits in CI.
3. The Scorecard Action on public repositories for workflow-security signals.
4. The twice-yearly agent audit reviews the expected-settings file itself against new GitHub features.

If apply becomes wanted later, github-settings-as-code or Probot settings can consume a similar YAML. That is a later decision, not a prerequisite.

### Gaps

- I measured no real-world numbers on how often settings drift on solo-maintained repositories. The value of drift detection versus prevention is therefore judged qualitatively.
- I did not verify which minimal fine-grained PAT permissions are enough to read every greenrepo setting. This matters most for Actions permissions, workflow token defaults, `security_and_analysis` and private vulnerability reporting. It needs a hands-on check with `gh api`.
