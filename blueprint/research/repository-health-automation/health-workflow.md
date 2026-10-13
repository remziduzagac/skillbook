# Weekly repository health workflow: signals, permissions, tools, costs, hardening

Research date: 2026-10-10. Method: GitHub docs read from the `github/docs` source repository (same text as docs.github.com, fetched with read-only `gh api` because docs.github.com fetches timed out), the published REST OpenAPI description (`github/rest-api-description`, version 1.1.4), live GraphQL introspection, read-only `gh api` GET calls against `remziduzagac/herdsman` with the maintainer's OAuth token (scopes `gist`, `read:org`, `repo`), action READMEs and release metadata, plus a few web sources. Each docs-source link below points at the file that renders the cited docs.github.com page.

## 1. Which endpoint reads each signal, and can `GITHUB_TOKEN` read it?

### Takeaway

Since September 2026 `GITHUB_TOKEN` can read almost every wanted signal: Dependabot alerts (new `vulnerability-alerts: read`), code scanning alerts (`security-events: read`), workflow runs and workflow state (`actions: read`), issues, pull requests and rulesets. It still cannot read secret scanning alerts, deploy keys, Actions secrets metadata, branch protection or the `security_and_analysis` settings block. Those need a fine-grained PAT or a GitHub App. On personal-account private repositories, code scanning and secret scanning do not exist at all, so those signals are simply absent there.

### Cited Findings

**The `GITHUB_TOKEN` permission keys (current list).**

- The documented keys are `actions`, `artifact-metadata`, `attestations`, `checks`, `code-quality`, `contents`, `deployments`, `id-token` (write/none), `issues`, `discussions`, `packages`, `pages`, `pull-requests`, `security-events`, `statuses`, and `vulnerability-alerts` (read/none only). Specifying any key sets all unspecified keys to `none`. `permissions: {}` disables all of them — [github/docs reusable](https://github.com/github/docs/blob/main/data/reusables/actions/github-token-available-permissions.md), rendered at [Workflow syntax: permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions).
- The `models` key is no longer in the list. The last change to that reusable (2026-07-30) is titled "Retire GitHub Models documentation" — `gh api repos/github/docs/commits?path=...github-token-available-permissions.md` (observed 2026-10-10). Treat any `models:` key in templates as stale (inference from the docs change; I did not confirm runtime behaviour).
- `security-events` covers code scanning alerts only: "`security-events: read` permits an action to list the code scanning alerts". The docs add: "For Dependabot alerts, use the `vulnerability-alerts` permission. Secret scanning alerts cannot be read with this permission and require a GitHub App or a personal access token" — [github/docs scope descriptions](https://github.com/github/docs/blob/main/data/reusables/actions/github-token-scope-descriptions.md).
- `vulnerability-alerts`: "Read Dependabot alerts... Only `read` and `none` are supported; `write` is not valid. When `write-all` or `read-all` is used, `vulnerability-alerts` is automatically included as `read`" — [same file](https://github.com/github/docs/blob/main/data/reusables/actions/github-token-scope-descriptions.md).
- **Recent change.** GitHub announced it on 2026-09-03: "You can now grant workflows read-only access to Dependabot alerts with the new `vulnerability-alerts` permission for `GITHUB_TOKEN`" — [GitHub Changelog, Actions early September 2026](https://github.blog/changelog/2026-09-03-github-actions-early-september-2026-updates/). The docs feature flag (`fpt: '*'`, `ghec: '*'`, GHES "will be added") was first committed on 2026-04-23 — [feature flag file](https://github.com/github/docs/blob/main/data/features/vulnerability-alerts-permission.yml). Before this change, Dependabot alerts needed a PAT or an App (the docs' `{% else %}` branch still says so).
- The same changelog also added `job.workflow_ref`, `job.workflow_sha`, `job.workflow_repository` and `job.workflow_file_path` context properties for reusable workflows — [GitHub Changelog](https://github.blog/changelog/2026-09-03-github-actions-early-september-2026-updates/).

**Endpoint-to-permission map.** Taken from GitHub's machine-readable fine-grained permission map ([fine-grained-pat-permissions.json](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json), rendered at [Permissions required for fine-grained PATs](https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens)). `GITHUB_TOKEN` keys correspond to these permission names, and `metadata: read` is always granted.

- Dependabot alerts: `GET /repos/{owner}/{repo}/dependabot/alerts` needs `vulnerability_alerts: read`, so `GITHUB_TOKEN` works with `vulnerability-alerts: read`. Classic and OAuth tokens need `security_events`, or `public_repo` for public repositories only — [REST: Dependabot alerts](https://docs.github.com/en/rest/dependabot/alerts#list-dependabot-alerts-for-a-repository). Filters include state, severity, ecosystem, package, manifest, EPSS, `has`, assignee, scope (development or runtime), relationship and sort, with cursor pagination ([OpenAPI description](https://github.com/github/rest-api-description)).
- Code scanning alerts: `GET /repos/{owner}/{repo}/code-scanning/alerts` needs `security_events: read`, so `GITHUB_TOKEN` works with `security-events: read` — [REST: code scanning](https://docs.github.com/en/rest/code-scanning/code-scanning#list-code-scanning-alerts-for-a-repository). Observed: on herdsman it returns `404 {"message":"no analysis found"}` because no code scanning is configured (gh api, 2026-10-10). A health script must treat that 404 as "not configured", not as an error.
- Secret scanning alerts: `GET /repos/{owner}/{repo}/secret-scanning/alerts` needs `secret_scanning_alerts: read`. This permission has no `GITHUB_TOKEN` key. The endpoint also requires that "the authenticated user must be an administrator for the repository". Classic tokens need `repo` or `security_events` — [REST: secret scanning](https://docs.github.com/en/rest/secret-scanning/secret-scanning#list-secret-scanning-alerts-for-a-repository).
- The secret scanning alert object includes a `secret` field. The endpoint accepts `hide_secret` ("whether or not to hide literal secrets in the results") — [OpenAPI description](https://github.com/github/rest-api-description).
- Dependabot pull requests: `GET /repos/{owner}/{repo}/pulls` needs `pull_requests: read` ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)). Filter on author `dependabot[bot]`, for example `gh pr list --author app/dependabot` (gh CLI convention; not verified in GitHub docs).
- Issues without an end state: `GET /repos/{owner}/{repo}/issues` and `.../issues/{n}/comments` need `issues: read`. `GET /search/issues` accepts `advanced_search=true` and a new `search_type` of `semantic` or `hybrid`; semantic and hybrid searches are "rate limited to 10 requests per minute" — [OpenAPI description](https://github.com/github/rest-api-description), [REST: search issues](https://docs.github.com/en/rest/search/search#search-issues-and-pull-requests).
- Failed advisory scans and link checks: `GET /repos/{owner}/{repo}/actions/runs` and `.../actions/workflows/{workflow_id}/runs` need `actions: read` ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)).
- Workflow state: `GET /repos/{owner}/{repo}/actions/workflows` needs `actions: read`; see section 2.
- Rulesets: `GET /repos/{owner}/{repo}/rulesets` needs only `metadata: read`, so `GITHUB_TOKEN` can always read it. Classic branch protection, `GET .../branches/{branch}/protection`, needs `administration: read`, which `GITHUB_TOKEN` cannot have ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)).
- Repository security settings: the `security_and_analysis` block of `GET /repos/{owner}/{repo}` is visible only to repository admins. "To view merge-related settings, you must have the `contents:read` and `contents:write` permissions" — [REST: get a repository](https://docs.github.com/en/rest/repos/repos#get-a-repository). `GET .../vulnerability-alerts`, `.../automated-security-fixes`, `.../actions/permissions` and `.../code-scanning/default-setup` all need `administration: read`. `.../private-vulnerability-reporting` needs only `metadata: read` ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)).
- Community files: `GET /repos/{owner}/{repo}/community/profile` needs `contents: read` and returns `health_percentage` and file presence — [REST: community metrics](https://docs.github.com/en/rest/metrics/community#get-community-profile-metrics). Observed: herdsman returns `health_percentage: 100` with `issue_template: null` (gh api, 2026-10-10).
- Deploy keys: `GET /repos/{owner}/{repo}/keys` needs `administration: read`. Actions secrets: `GET .../actions/secrets` needs `secrets: read`. `GITHUB_TOKEN` has neither ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)).
- GraphQL equivalents exist: `Repository.vulnerabilityAlerts`, `Repository.hasVulnerabilityAlertsEnabled` and `Repository.pinnedIssues` (live introspection, `gh api graphql`, 2026-10-10).

**Feature availability on personal accounts.**

- Code scanning is available for "Public repositories on GitHub.com" and for organization-owned repositories with GitHub Code Security on Team or Enterprise — [gated-features/code-scanning](https://github.com/github/docs/blob/main/data/reusables/gated-features/code-scanning.md).
- Secret scanning: "Public repositories: runs automatically for free". Organization-owned private repositories need GitHub Secret Protection. User-owned repositories are covered only on Enterprise Cloud with Enterprise Managed Users, or on GHES — [gated-features/secret-scanning](https://github.com/github/docs/blob/main/data/reusables/gated-features/secret-scanning.md).
- Dependabot alerts "are available for organization-owned and user-owned repositories" — [gated-features/dependabot-alerts](https://github.com/github/docs/blob/main/data/reusables/gated-features/dependabot-alerts.md).

**Observed on herdsman (read-only, OAuth token with `repo` scope, 2026-10-10).**

- `dependabot/alerts` returned 200. `secret-scanning/alerts` returned 200. `keys` returned 200. `actions/secrets` returned 200 with names and `created_at`/`updated_at` only. `rulesets` returned 200.
- `security_and_analysis` shows secret scanning enabled, push protection enabled, and Dependabot security updates disabled.
- The `X-Accepted-OAuth-Scopes` response header names the classic scopes each endpoint accepts. For example, secret scanning accepts `public_repo, repo, security_events`.
- Rate-limit headers showed 5,000 requests per hour for this user token.

### Inferences

- Least-privilege split: one job with `GITHUB_TOKEN` and `actions: read`, `contents: read`, `issues: read`, `pull-requests: read`, `security-events: read`, `vulnerability-alerts: read` gathers nearly everything. A separate job with only `issues: write` publishes the issue.
- Only secret scanning alerts (public repositories only), deploy keys, Actions secrets metadata, classic branch protection and `security_and_analysis` need an extra credential. For a solo maintainer, the least-privilege option is a fine-grained PAT, or a GitHub App, scoped to the one repository with read-only "Secret scanning alerts", "Administration" and "Secrets". `Administration: read` is broad (it covers many settings endpoints), so make that credential optional and skip those signals when it is absent.
- Secret scanning alerts on a personal private repository cannot be read at all, because the feature does not exist there. The issue should show "not available" rather than "0 alerts".
- Always pass `hide_secret=true` when reading secret scanning alerts. Never copy alert payloads into the issue verbatim; on a public repository the issue is world-readable.

### Gaps

- I did not run a workflow, so I have not confirmed in practice that `vulnerability-alerts: read` works on personal-account repositories. The docs and changelog say it does. The six-month gap between the docs flag (April) and the changelog (September) suggests a staged rollout.
- I found no documentation on whether `GITHUB_TOKEN` honours the `security-events` scope for code scanning in private personal repositories. The point is moot, because code scanning is unavailable there.
- I did not confirm `gh pr list --author app/dependabot` in GitHub docs (gh CLI behaviour).

## 2. Detecting and re-enabling scheduled workflows that GitHub disabled

### Takeaway

`GET /repos/{owner}/{repo}/actions/workflows` reports `state: disabled_inactivity`, and `PUT .../actions/workflows/{id}/enable` re-enables it. Both work with `GITHUB_TOKEN` (`actions: read` and `actions: write`). The 60-day rule applies to public repositories. The health workflow itself is scheduled, so it can be disabled too, which is why it should also re-enable itself.

### Cited Findings

- "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days." Scheduled workflows run only on the default branch, can be delayed at high load ("including the start of every hour"), and queued jobs "may be dropped" — [events-that-trigger-workflows source](https://github.com/github/docs/blob/main/content/actions/reference/workflows-and-actions/events-that-trigger-workflows.md), rendered at [schedule event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
- "For a deactivated scheduled workflow, if a user with `write` permissions to the repository makes a commit that changes the `cron` schedule on the workflow, the workflow will be reactivated." Notifications go to "the user who last modified the cron syntax" — [same page](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
- **Recent change.** Schedules now accept an IANA `timezone`, with UTC as the default. The shortest interval is 5 minutes. Timezone support is on github.com and GHES 3.22 and later — [cron reusable](https://github.com/github/docs/blob/main/data/reusables/repositories/actions-scheduled-workflow-example.md), [feature flag](https://github.com/github/docs/blob/main/data/features/actions-schedule-timezone.yml).
- Workflow `state` enum: `active`, `deleted`, `disabled_fork`, `disabled_inactivity`, `disabled_manually` — [OpenAPI description](https://github.com/github/rest-api-description), [REST: workflows](https://docs.github.com/en/rest/actions/workflows).
- Enable: "Enables a workflow and sets the `state` of the workflow to `active`. You can replace `workflow_id` with the workflow file name". Classic tokens need `repo`. The endpoint is enabled for GitHub Apps — [REST: enable a workflow](https://docs.github.com/en/rest/actions/workflows#enable-a-workflow). It requires `actions: write`, and listing requires `actions: read` ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)). The CLI equivalent is `gh workflow enable` — [Disable and enable workflows](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows).
- liskin/gh-workflow-keepalive "uses GitHub API to preemptively re-enable the workflow, thus preventing it from being automatically disabled", with no dummy commits. It needs `permissions: actions: write`. It is a composite action; latest release v1.2.1 (2024-05-19), last push 2025-08-25 — [liskin/gh-workflow-keepalive](https://github.com/liskin/gh-workflow-keepalive).
- PhrozenByte/gh-workflow-immortality force-enables the workflows of all the user's repositories with a PAT (fine-grained recommended). Release v1 is from 2026-03-12 — [PhrozenByte/gh-workflow-immortality](https://github.com/PhrozenByte/gh-workflow-immortality).
- gautamkrishnar/keepalive-workflow, the best-known keepalive action, now returns `403 "Repository access blocked"` with `"reason":"tos"` and `created_at 2025-04-21` (gh api, 2026-10-10). Its v1 made dummy commits. GitHub gives no public explanation of the block — [gautamkrishnar/keepalive-workflow](https://github.com/gautamkrishnar/keepalive-workflow).
- What counts as "repository activity" is not defined in the docs. Community reports say tags do not count (title of [community discussion 57858](https://github.com/orgs/community/discussions/57858), not read in full). Secondary sources disagree on whether merges or releases count.

### Inferences

- Detection: once a week, list workflows and flag every `disabled_inactivity` and `disabled_manually` workflow that has an `on.schedule` trigger. Reading the YAML needs `contents: read`.
- Self-protection: the health workflow's last step can call `PUT .../workflows/<own file>/enable` (the liskin approach, `actions: write`). This keeps it alive on quiet public repositories without commits.
- Auto re-enabling other workflows is a judgement call. Reporting them and letting an agent propose re-enabling keeps `actions: write` limited to the self-keepalive step.
- Because a keepalive repository was blocked for ToS reasons, prefer API re-enabling of a workflow that does real work over commit-based keepalive. The block reason is not public, so this is an inference.

### Gaps

- No official definition of "repository activity". It is unknown whether the bot's own issue edits count. Assume they do not.
- The docs statement covers public repositories only. I found no official statement that private repositories are exempt; they are simply not mentioned.
- I did not verify whether GitHub emails the maintainer before disabling a workflow.

## 3. Can token and deploy-key expiry be read through the API?

### Takeaway

Mostly no. Deploy keys have no expiry field. A personal account has no API to list its own PATs. The only expiry the API reveals is that of the token making the request, through the `GitHub-Authentication-Token-Expiration` response header. Everything else must come from a maintained list in the repository, which can be enriched with API facts such as `last_used` and secret `updated_at`.

### Cited Findings

- The deploy key schema has `id`, `key`, `url`, `title`, `verified`, `created_at`, `read_only`, `added_by`, `last_used` and `enabled`. It has no expiry field — [OpenAPI description](https://github.com/github/rest-api-description), [REST: deploy keys](https://docs.github.com/en/rest/deploy-keys/deploy-keys). Listing needs `administration: read` ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)).
- Actions secrets list only `name`, `created_at` and `updated_at` (observed on herdsman: two secrets updated 2026-10-01). This needs `secrets: read` — [REST: Actions secrets](https://docs.github.com/en/rest/actions/secrets#list-repository-secrets).
- PAT listing endpoints exist only for organizations (`/orgs/{org}/personal-access-tokens`). There is no `/user/...` equivalent in the OpenAPI paths — [OpenAPI description](https://github.com/github/rest-api-description), [REST: org PATs](https://docs.github.com/en/rest/orgs/personal-access-tokens).
- "When using a personal access token with the GitHub API, you'll see a new response header, `GitHub-Authentication-Token-Expiration`, indicating the token's expiration date." Also, "GitHub will send you an email when it's time to renew a token that's about to expire" — [GitHub Changelog 2021-07-26](https://github.blog/changelog/2021-07-26-expiration-options-for-personal-access-tokens/).
- In September 2025 the header returned "1 minute from the time of the request" for fine-grained tokens on REST, while GraphQL was correct. The reporter said it "stopped happening ~Sep 12". GitHub staff gave no explanation — [community discussion 172213](https://github.com/orgs/community/discussions/172213).
- Fine-grained PAT expiry can be set to 1–366 days or `none`. "Infinite lifetimes are allowed but may be blocked by a maximum lifetime policy" set by an organization or enterprise — [Managing your PATs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
- GitHub "will automatically revoke an OAuth token or personal access token when the token hasn't been used in one year". GitHub App user tokens expire after eight hours by default — [Token expiration and revocation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation).

### Inferences

- If the workflow uses a fine-grained PAT for optional signals, it can report that PAT's own expiry by reading the response header (`gh api -i ... | grep -i github-authentication-token-expiration`). Cross-check with a GraphQL call, given the 2025 REST glitch.
- Deploy keys, SSH keys, other PATs, domain renewals and certificates belong in a repository list, for example `.github/renewals.yml` with `name`, `kind`, `expires`, `owner_action`. The workflow flags entries within N days. API facts can enrich it: deploy key `last_used`, and secret `updated_at` as a rotation-age proxy.
- GitHub's own renewal emails go to the account email and do not reach the issue. The list is the only way agents see upcoming renewals.

### Gaps

- I could not confirm from docs.github.com text, as opposed to the changelog, that the header is sent for classic PATs and GitHub App user tokens. Secondary sources say it is.
- I found no API for SSH signing or authentication key expiry; those keys have no expiry concept.

## 4. Creating or updating one issue idempotently, finding it again, and pinning it

### Takeaway

The cheapest and safest tool is the preinstalled `gh` CLI. Find the issue by a dedicated label, then `gh issue edit N --body-file report.md`, or `gh issue create` on the first run. The only third-party action that still fits is peter-evans/create-issue-from-file v6 (`issue-number` input, node24). JasonEtco/create-an-issue is stale (node20, last release 2024-02). Pinning is GraphQL `pinIssue` or `gh issue pin`. Pinning once by hand is enough, because the issue is edited in place, not recreated.

### Cited Findings

- peter-evans/create-issue-from-file v6.0.0 (2025-10-01, runs on `node24`). Inputs: `token`, `repository`, `issue-number` ("The issue number of an existing issue to update"), `title`, `content-filepath`, `labels`, `assignees`. Output: `issue-number`. "If the file does not exist the action exits silently" — [peter-evans/create-issue-from-file](https://github.com/peter-evans/create-issue-from-file).
- JasonEtco/create-an-issue v2.9.2 (2024-02-15) declares `using: node20`. `update_existing: true` updates "an open issue with the **exact same title**", and `search_existing` is open, closed or all. The body comes from a Nunjucks or front-matter template file — [JasonEtco/create-an-issue](https://github.com/JasonEtco/create-an-issue).
- Node 20 timeline: runners switched to Node 24 by default on 2026-06-16. "We upgrade the runner and remove Node20 on September 23rd, 2026". The opt-out `ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true` worked only until removal — [GitHub Changelog: Node 20 deprecation](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/).
- actions/github-script v9.0.0 (2026-04-09, `node24`) gives an authenticated Octokit for arbitrary REST and GraphQL calls — [actions/github-script](https://github.com/actions/github-script).
- zizmor's `superfluous-actions` audit (since v1.23.0) flags actions that duplicate preinstalled tools. It lists `peter-evans/create-or-update-comment` (use `gh issue comment`), `dacbd/create-issue-action` (`gh issue create`) and label actions (`gh issue edit --add-label`) — [zizmor audits](https://docs.zizmor.sh/audits/#superfluous-actions).
- The `ubuntu-slim` image ships GitHub CLI 2.102.0, jq 1.7, Node.js 24 and Python 3.12 (image 20261005) — [ubuntu-slim README](https://github.com/actions/runner-images/blob/main/images/ubuntu-slim/ubuntu-slim-Readme.md).
- Pinning: "You can pin up to three important issues". "People with write access to a repository can pin issue in the repository" — [Pinning an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/pinning-an-issue-to-your-repository). The REST API has no issue-pin endpoint. It does have the newer `PUT/DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/pin` for pinning comments ([OpenAPI description](https://github.com/github/rest-api-description)). GraphQL has `pinIssue`, `unpinIssue`, `pinIssueComment` and `Repository.pinnedIssues` (live introspection, 2026-10-10; [GraphQL mutations](https://docs.github.com/en/graphql/reference/mutations#pinissue)). `gh issue pin` exists ("Pin an issue to a repository"; local gh 2.46.0 help).
- Prior art for "one issue rewritten each run": Renovate's Dependency Dashboard. Renovate finds it with `platform.findIssue(config.dependencyDashboardTitle)` and updates it with `platform.ensureIssue(...)`, which is title-based — [renovate dependency-dashboard.ts](https://github.com/renovatebot/renovate/blob/main/lib/workers/repository/dependency-dashboard.ts), [Renovate docs](https://docs.renovatebot.com/key-concepts/dashboard/).
- Editing an issue needs `issues: write` (`PATCH /repos/{owner}/{repo}/issues/{issue_number}`) ([permission map](https://github.com/github/docs/blob/main/src/github-apps/data/fpt-2022-11-28/fine-grained-pat-permissions.json)).

### Inferences

Recommended lookup order:

1. Search open issues with the label `repository-health` (`gh issue list --label repository-health --state open --json number --limit 1`).
2. If none is found, fall back to the pinned issues (GraphQL `pinnedIssues`) and the exact title.
3. If still none, create the issue with the label. Labels are more robust than titles, which a human may edit.

Further points:

- Keep a hidden machine block in the body, for example `<!-- greenrepo-health v1 {"rules_failing":[...]} -->`. It stores the previous run's state, so "newly failing audit rules" can be computed by diffing against the last body. No artifact retention or cache is needed. Renovate likewise keeps state in its dashboard body; I did not verify how Renovate does that in detail.
- `gh issue edit` does not notify subscribers the way a new comment does. If agents should be woken, add a short comment only when the set of findings changes. The bot's comments count toward secondary content-creation limits.
- Pinning with `GITHUB_TOKEN` through `gh issue pin` would need `issues: write`. That is not confirmed, so pin once by hand or in the first run, then never touch it again. Only three pins per repository are allowed.

### Gaps

- Not confirmed: whether `GITHUB_TOKEN` with `issues: write` may call the `pinIssue` GraphQL mutation. I found no doc or reliable report either way.
- Not confirmed: how runners treat `node20`-declared actions after 2026-09-23, whether they are forced onto Node 24 or fail. Secondary sources say they run on Node 24; avoid JasonEtco/create-an-issue regardless.
- I did not verify the exact Renovate state-storage mechanism.

## 5. Running Scorecard, lychee and OSV-Scanner on a schedule and turning their output into issue lines

### Takeaway

All three run on a schedule. Scorecard must run in its own restricted job; it writes JSON or SARIF, and the public API serves results for public repositories that publish. lychee writes Markdown or JSON and exposes `exit_code`. OSV-Scanner's reusable workflow assumes SARIF upload to code scanning, which personal private repositories lack, so call the CLI or action with `upload-sarif: false` or `--format json`/`markdown` and summarise the output.

### Cited Findings

**OpenSSF Scorecard.**

- ossf/scorecard-action v2.4.4 (2026-07-23). Supported triggers are "`push`, `schedule` (default branch only)"; `pull_request` and `workflow_dispatch` are experimental. It is "free for all public repositories. Private repositories are supported if they have GitHub Advanced Security"; otherwise use the CLI — [ossf/scorecard-action](https://github.com/ossf/scorecard-action).
- Inputs are `results_file`, `results_format` (`json` or `sarif`), `repo_token` (PAT, optional), and `publish_results`. `publish_results: true` needs `id-token: write`, replaces the OpenSSF weekly scan with your own results, and enables the badge and the REST API at api.scorecard.dev — [scorecard-action README](https://github.com/ossf/scorecard-action).
- When publishing, the workflow may have no top-level env or defaults and no workflow-level write permissions. Only the Scorecard job may hold `id-token: write`. That job may have no env, containers or services, must run on Ubuntu hosted runners, and may only use `actions/checkout`, `actions/upload-artifact`, `github/codeql-action/upload-sarif`, `ossf/scorecard-action` and `step-security/harden-runner` — [scorecard-action README, Workflow Restrictions](https://github.com/ossf/scorecard-action).
- On private repositories with `GITHUB_TOKEN`, add job-level `contents: read`, `issues: read`, `pull-requests: read` and `checks: read` to avoid "Resource not accessible by integration". Use `security-events: write` and `id-token: write` when publishing — [scorecard-action README](https://github.com/ossf/scorecard-action).
- The Branch-Protection check needs a fine-grained PAT (`repo_token`) when classic branch protection is used — [scorecard-action README](https://github.com/ossf/scorecard-action).
- The public API works for published repositories: `https://api.scorecard.dev/projects/github.com/ossf/scorecard-action` returned `score 8.1` with per-check scores, dated 2026-07-23. `.../remziduzagac/herdsman` returned HTTP 404, meaning not in the dataset and not published (curl, 2026-10-10).

**lychee.**

- lycheeverse/lychee-action v2.9.0 (2026-07-09), composite; lychee v0.24.2. The README pairs it with `peter-evans/create-issue-from-file` and `if: steps.lychee.outputs.exit_code != 0`, with `fail: false`, `format` (`markdown` or `json`), `output` (default `lychee/results.md`), `jobSummary`, a `token` for GitHub links, and `--cache` with `actions/cache` to reduce rate limiting — [lycheeverse/lychee-action](https://github.com/lycheeverse/lychee-action).

**OSV-Scanner.**

- google/osv-scanner-action v2.6.0 (2026-09-14). Its two reusable workflows: the scheduled full scan reports "to the 'Code scanning' page" and needs `security-events: write`. The workflow also accepts `scan-args`, `upload-sarif` (default `true`) and `fail-on-vuln` (default `true`). The `--format` and `--output` flags are set by the reusable workflow — [OSV-Scanner GitHub Action docs](https://google.github.io/osv-scanner/github-action/), [google/osv-scanner-action](https://github.com/google/osv-scanner-action).
- CLI formats: `table`, `markdown`, `vertical`, `html`, `json`, `sarif` and others. For example, `osv-scanner scan --format markdown your/project/dir` — [OSV-Scanner output docs](https://google.github.io/osv-scanner/output/).

### Inferences

- Scorecard: on public repositories, the simplest path is to read `api.scorecard.dev` (no job at all) when the repository is in the dataset or publishes. Otherwise run a separate `scorecard` job with `results_format: json` and upload the JSON as an artifact. A later `report` job downloads it and renders checks with a score below 10 as issue lines. Keep that job free of other steps, so that `publish_results` stays possible.
- On personal private repositories, the Scorecard Action is officially unsupported without GHAS. Running the Scorecard CLI with a fine-grained PAT is the documented fallback; I did not test it.
- lychee: `fail: false`, `format: json`, then `jq` the failures into lines such as "`README.md`: 404 `https://...`". Keep `.lycheecache` to limit flakiness.
- OSV-Scanner: on personal private repositories, use `upload-sarif: false` (or the CLI) with `--format json` and emit one line per vulnerable package. On public repositories, Dependabot alerts already cover most of this, so OSV-Scanner is optional, or useful for ecosystems Dependabot does not cover.
- "Failed advisory scans and link checks" can also be read without re-running anything. Take the latest conclusion of each scan workflow from `GET .../actions/workflows/{file}/runs?per_page=1` (`actions: read`).

### Gaps

- I did not confirm OSV-Scanner exit codes (for example, which code means vulnerabilities found or no packages) in the fetched docs.
- I did not test Scorecard CLI behaviour on personal private repositories.

## 6. Costs (Actions minutes) and API rate limits

### Takeaway

On public repositories the workflow is free on standard GitHub-hosted runners. On private repositories it draws from 2,000 (Free) or 3,000 (Pro) included minutes per month. A weekly health run on `ubuntu-slim` costs a few minutes a month. API limits are far above the need: `GITHUB_TOKEN` gets 1,000 REST requests and 1,000 GraphQL points per hour per repository.

### Cited Findings

- "GitHub Actions usage is free for self-hosted runners and for public repositories that use standard GitHub-hosted runners". Private repositories get a quota by plan. "Minutes usage is charged to the repository owner" — [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
- Included quotas: Free has 2,000 minutes and 500 MB artifact storage; Pro has 3,000 minutes and 1 GB. Cache is 10 GB per repository. Minutes reset monthly — [included quotas reusable](https://github.com/github/docs/blob/main/data/reusables/billing/actions-included-quotas.md).
- Per-minute prices: Linux 1-core `actions_linux_slim` $0.002; Linux 2-core $0.006; Linux arm64 $0.005; Windows $0.010; macOS $0.062 — [runner prices reusable](https://github.com/github/docs/blob/main/data/reusables/billing/actions-standard-runner-prices.md).
- "If your account does not have a valid payment method on file, usage is blocked once you use up your quota" — [over-quota reusable](https://github.com/github/docs/blob/main/data/reusables/billing/default-over-quota-behavior.md).
- `ubuntu-slim` single-CPU runners are "available in both public and private repositories", are "optimized for automation tasks, issue operations and short-running jobs", and run in an unprivileged container. "The job timeout for single-CPU runners is 15 minutes" — [GitHub-hosted runners: single-CPU](https://docs.github.com/en/actions/reference/runners/github-hosted-runners#single-cpu-runners).
- `GITHUB_TOKEN`: "1,000 requests per hour per repository" (REST) — [REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api). GraphQL: "1,000 points per hour per repository" — [GraphQL rate limits](https://docs.github.com/en/graphql/overview/rate-limits-and-query-limits-for-the-graphql-api).
- PATs and user tokens get 5,000 requests per hour, shared across all of the user's tokens and apps. A GitHub App installation gets at least 5,000, scaling to at most 12,500 — [REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
- Secondary limits: 100 concurrent requests; 900 points per minute per REST endpoint (GET = 1, write = 5); "no more than 80 content-generating requests per minute and no more than 500 content-generating requests per hour" — [REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
- The search API has stricter limits. `gh api rate_limit` showed `search` at 30 per minute for the user token (2026-10-10). Semantic and hybrid issue search is limited to 10 per minute ([OpenAPI description](https://github.com/github/rest-api-description)).

### Inferences

- Rough budget on a private repository: three jobs (collect, scorecard, publish), each about 1–3 minutes, run about 4.3 times a month, gives about 13–40 minutes, or 1–2 % of the Free quota. On `ubuntu-slim` the overage price is $0.002/min. Running lychee over many external links or OSV-Scanner over large trees adds minutes; keep within the 15-minute slim timeout or use `ubuntu-latest` for that job.
- One run needs roughly 20–60 REST calls (paginated alerts, issues, PRs, workflows and runs), well under 1,000 per hour. Avoid the search API in loops (30 per minute); prefer the list endpoints with filters.
- The publish step makes one or two content-creating requests per run, far from the secondary limits.

### Gaps

- I did not confirm in the fetched billing text whether each job is rounded up to a whole minute; older docs said so. Treat per-job rounding as likely but unverified, which favours fewer jobs on private repositories.
- I did not confirm whether `ubuntu-slim` counts as a "standard" runner for the public-repository free tier. The docs describe it as available in public repositories, and the docs source has a single-CPU row reusable for the runner tables, but I did not see the rendered table or explicit free-tier wording.

## 7. Hardening: least-privilege permissions, pinned actions, untrusted input, and zizmor's view

### Takeaway

Use top-level `permissions: {}` and grant per job. Pin every action to a full commit SHA with a correct version comment. Never interpolate issue, PR or alert text into `run:`. Trigger only on `schedule` and `workflow_dispatch`. Persist no checkout credentials. zizmor (v1.30.1) audits all of these. The agent-specific risk is prompt injection: issue titles and alert text written by outsiders flow into an issue that agents read and act on.

### Cited Findings

- `excessive-permissions` (since v0.1.0) detects over-broad workflow- and job-level permissions, including workflows that set none and inherit broad defaults — [zizmor audits](https://docs.zizmor.sh/audits/#excessive-permissions).
- `unpinned-uses` flags uses not pinned to a SHA, because "GitHub does not have immutable branches or tags" — [zizmor](https://docs.zizmor.sh/audits/#unpinned-uses).
- `ref-version-mismatch` (since v1.14.0) flags hash pins whose version comment is wrong or missing; stale comments can make Dependabot "silently ignore" them — [zizmor](https://docs.zizmor.sh/audits/#ref-version-mismatch).
- `template-injection` flags `${{ }}` expansion of attacker-controllable contexts such as `github.event.issue.title` — [zizmor](https://docs.zizmor.sh/audits/#template-injection).
- `artipacked` flags persisted checkout credentials. Since checkout v6.0.0 the credential is stored under `$RUNNER_TEMP`; zizmor v1.17.0 and later lower the severity for v6 — [zizmor](https://docs.zizmor.sh/audits/#artipacked).
- `dangerous-triggers` flags `pull_request_target`, `workflow_run`, and also `issue_comment` "as of `v1.31.0`" (main-branch docs; the latest release is v1.30.1 of 2026-09-09) — [zizmor](https://docs.zizmor.sh/audits/#dangerous-triggers), [zizmor releases](https://github.com/zizmorcore/zizmor/releases).
- `secrets-outside-env` (since v1.23.0) flags secrets used in jobs without an environment. Since v1.24.0 it shows only in the "auditor" persona. `secrets.GITHUB_TOKEN` is exempt — [zizmor](https://docs.zizmor.sh/audits/#secrets-outside-env).
- `github-app` (since v1.25.0) flags misuse of App installation tokens, such as `skip-token-revoke: true` — [zizmor](https://docs.zizmor.sh/audits/#github-app).
- `concurrency-limits` and `undocumented-permissions` are pedantic-only. The second asks for a comment on each permission other than `contents: read` — [zizmor](https://docs.zizmor.sh/audits/#undocumented-permissions).
- `adhoc-packages` (since v1.26.0) flags `run:` steps that install packages outside a locked manifest. `unpinned-tools` (since v1.25.0) flags actions that fetch "latest" tools — [zizmor](https://docs.zizmor.sh/audits/#adhoc-packages).
- `self-repository` (since v1.30.0): "As of July 2026, GitHub supports a new 'self-repository' syntax (`uses: $/...`)" for in-repository actions and reusable workflows — [zizmor](https://docs.zizmor.sh/audits/#self-repository). This is a recent platform change.
- zizmor v1.30.1 was released 2026-09-09; zizmor-action v0.6.4 was released 2026-09-09 (gh api releases).
- `pull_request_target` grants the token read/write repository permission "even when it is triggered from a public fork" — [workflow syntax reusable](https://github.com/github/docs/blob/main/data/reusables/actions/jobs/section-assigning-permissions-to-jobs.md).
- Scorecard's publishing rules forbid workflow-level write permissions and allow `id-token: write` only in the Scorecard job — [scorecard-action](https://github.com/ossf/scorecard-action).

**Local reference: herdsman `.github/workflows/` on `dev`, read 2026-10-10.**

- Herdsman has 9 workflow files and no `schedule:` triggers; the API also lists "Dependabot Updates" as active.
- Most files set top-level `permissions: contents: read`, and every `uses:` is pinned to a full SHA with a version comment. `.github/dependabot.yml` updates github-actions and npm monthly, grouped, into `dev`.
- The same checkout SHA `3d3c42e5…` carries `# v7.0.1` in some files but `# v6` in `ci.yml`, `nix.yml`, `windows-arm64.yml` and `build-artifacts-manual.yml`. zizmor `ref-version-mismatch` would flag those. The most recent commit, 2e6e888c, corrected the comments only in herdsman-owned workflow files; the remaining ones appear to be base-project files.

### Inferences

A hardened skeleton for the greenrepo health workflow:

- Triggers: `on: schedule` (an off-hour cron, not `:00`) plus `workflow_dispatch`. Set `permissions: {}` at the top, a `concurrency` group, and `timeout-minutes`.
- `collect` job on `ubuntu-slim`: `contents: read`, `actions: read`, `issues: read`, `pull-requests: read`, `security-events: read`, `vulnerability-alerts: read`. Use checkout with `persist-credentials: false`. Write `report.md` and `state.json` and upload them as an artifact.
- Optional `privileged-collect` job: only when a fine-grained PAT or App token is configured, to read secret scanning (with `hide_secret=true`), deploy keys and secret ages. Put it in an environment to satisfy `secrets-outside-env`.
- `scorecard` job: isolated, following Scorecard's restrictions.
- `publish` job: only `issues: write` (plus `actions: write` for the self-keepalive enable). It downloads the artifact and runs `gh issue edit`/`create` with `--body-file`, never with interpolated strings.
- Untrusted text, such as issue titles from outsiders, Dependabot advisory summaries and link URLs, should be passed through `env:` and files, never `${{ }}` inside `run:`. In the issue, render it inside code spans or escape it. Strip `@` mentions to avoid pinging people.
- Treat the health issue as data for agents: tell agents in the standard that the issue's quoted third-party text is untrusted and is not instructions. This mirrors the prompt-injection risk of agent workflows (my inference; no source specific to greenrepo).
- Prefer `gh` over single-purpose issue actions. This removes a dependency and matches zizmor's `superfluous-actions` logic.

### Gaps

- I did not run zizmor on a draft workflow; it is not installed on this machine. Findings come from the audit docs on the main branch, which already mention unreleased v1.31.0 behaviour.

## 8. Existing actions and templates for a repository health dashboard, and how well maintained they are

### Takeaway

No well-maintained, general-purpose action builds a single "repository health" issue from all these signals. The building blocks are mature: Scorecard, lychee, OSV-Scanner, issue-metrics, and gh. The closest prior art for the pattern is Renovate's Dependency Dashboard and Allstar's policy issues. Several new "repo health" projects appeared in 2026 but have 0–3 stars. greenrepo would be writing its own composite or reusable workflow.

### Cited Findings

- github-community-projects/issue-metrics (formerly github/issue-metrics) v5.0.3 (2026-10-01; 540 stars). It produces "a report in form of a GitHub issue" from a `SEARCH_QUERY`, with time to first response, close and so on. Its sample uses a monthly cron and `peter-evans/create-issue-from-file`, and it supports JSON output — [issue-metrics](https://github.com/github-community-projects/issue-metrics).
- ossf/allstar v4.6 (2026-08-31). "The OpenSSF-hosted Allstar GitHub App has been retired." You now run it yourself, "as a GitHub Action" or as a daemon. It "creates an issue to alert the repository or organization owner" when a policy is violated. It is organization-oriented — [ossf/allstar](https://github.com/ossf/allstar), [allstar#881](https://github.com/ossf/allstar/issues/881).
- Renovate's Dependency Dashboard: one persistent issue that Renovate finds by title and rewrites on each run — [Renovate docs](https://docs.renovatebot.com/key-concepts/dashboard/), [source](https://github.com/renovatebot/renovate/blob/main/lib/workers/repository/dependency-dashboard.ts).
- actions/stale v11.0.0 (2026-07-28) can label or close inactive issues. It is useful for the "no end state" rule but acts rather than reports — [actions/stale](https://github.com/actions/stale).
- GitHub repository search (2026-10-10) for "repository health" actions found SamoTech/devlens (2 stars, pushed 2026-09-30; "scores repository health across 9 transparent dimensions"), fzr2024/maintainer-vitals (0 stars), DevPooks/repodoctor (0 stars), and lucabello/grimoire (4 stars, a self-hosted dashboard). None shows adoption or a maintenance track record (gh api search/repositories).
- Supporting actions and their maintenance as of 2026-10-10, from releases and last push via gh api:

  | Repository | Latest release | Last push |
  | --- | --- | --- |
  | ossf/scorecard-action | v2.4.4 (2026-07-23) | 2026-09-25 |
  | lycheeverse/lychee-action | v2.9.0 (2026-07-09) | 2026-07-09 |
  | google/osv-scanner-action | v2.6.0 (2026-09-14) | 2026-09-14 |
  | zizmorcore/zizmor | v1.30.1 (2026-09-09) | 2026-10-10 |
  | peter-evans/create-issue-from-file | v6.0.0 (2025-10-01) | 2026-10-01 |
  | JasonEtco/create-an-issue | v2.9.2 (2024-02-15), node20 | 2024-02-15 |
  | actions/github-script | v9.0.0 (2026-04-09) | 2026-04-09 |
  | actions/create-github-app-token | v3.2.0 (2026-05-12) | 2026-10-06 |
  | step-security/harden-runner | v2.22.1 (2026-10-08) | 2026-10-08 |
  | liskin/gh-workflow-keepalive | v1.2.1 (2024-05-19) | 2025-08-25 |

### Inferences

- greenrepo should ship its own small reusable workflow or script: `gh` + `jq` + optional lychee, OSV-Scanner and Scorecard jobs. It should not depend on a young third-party "health" action, both for supply-chain reasons and because none covers the signal list.
- Borrow the patterns: the Renovate-style single issue found by a stable key; issue-metrics-style Markdown generation; Allstar-style policy-as-config. That last pattern suits greenrepo's "audit rules that newly fail".

### Gaps

- I found no GitHub Marketplace listing data, such as install counts. The repository search was a GitHub API query, not a Marketplace search.
- I did not evaluate SamoTech/devlens in depth, beyond its description and activity.
