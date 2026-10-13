# Standards for healthy repositories and community health files

Research date: 2026-10-10. Levels used in the inferences below are greenrepo's: **L1** every repository, **L2** public project, **L3** project with users. Sources are primary unless noted.

## GitHub's community profile and health files: which count, where they live, account defaults

### Takeaway

GitHub recognises nine kinds of community health file (ACCESSIBILITY, CODE_OF_CONDUCT, CONTRIBUTING, FUNDING.yml, SECURITY, SUPPORT, VULNERABILITY_REPORT.yml, discussion category forms, issue/PR templates with config.yml); LICENSE, README, CITATION.cff and GOVERNANCE are not inheritable health files. A public `<account>/.github` repository supplies defaults for every repository of the account that lacks its own file, but a repository's own `.github/ISSUE_TEMPLATE` replaces the whole default template folder, and defaults never appear in clones or downloads.

### Cited Findings

- Supported default health files (current docs): ACCESSIBILITY.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, discussion category forms, FUNDING.yml, issue and pull request templates plus `config.yml`, SECURITY.md, VULNERABILITY_REPORT.yml / .yaml, SUPPORT.md. — [docs.github.com: creating a default community health file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- Locations: discussion category forms in `.github/DISCUSSION_TEMPLATE`; issue templates and their config in `.github/ISSUE_TEMPLATE`; FUNDING.yml and VULNERABILITY_REPORT.yml only in `.github/`; every other file in the root, `.github/` or `docs/`. Precedence when several exist: `.github/` first, then root, then `docs/`; the same order is used inside the account's `.github` repository. — [docs.github.com](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- Account defaults: the `.github` repository must be public (internal for Enterprise Managed User orgs); defaults apply to every repository of the account "regardless of the destination repository's visibility" that has no file of that type. "If a repository defines valid issue templates or issue template configuration in its own `.github/ISSUE_TEMPLATE` folder, none of the contents of the default `.github/ISSUE_TEMPLATE` folder will be used." — [docs.github.com](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- Limits of defaults: "You cannot create a default license file"; license files must be per repository so they ship with clones, packages and downloads. Defaults "won't appear in the file browser or Git history of the individual repositories, and are not included in their clones, packages, or downloads." If an inherited issue template sets a label, that label must exist in the `.github` repository and in every repository that uses the template. A managed user cannot host personal defaults because their personal `.github` repository can only be private. — [docs.github.com](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- New since 2025 (flag as recent): ACCESSIBILITY.md is a health file behind the `accessibility-pages` feature; when present GitHub shows an **Accessibility** tab and links it from the About section; lookup order `.github`, root, `docs`; it can be inherited from the org `.github` repository; Community Standards offers a template under "Additional community file". Suggested content: accessibility priorities, supported environments, known barriers, contributor expectations, reporting process, ownership, maintenance. — [docs.github.com: accessibility page](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-an-accessibility-page-to-your-repository)
- New (flag as recent): `VULNERABILITY_REPORT.yml` customises the private vulnerability report form, using issue-form YAML (checkboxes, dropdown, input, markdown, textarea, `required`, `min_length`); a repository's form beats the account default; an invalid form silently falls back to the default form (summary, details, proof of concept, impact). A separate setting can require reporters to assign a CWE. — [docs.github.com: configure PVR for a repository](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository)
- Community profile checklist: checks for README, CODE_OF_CONDUCT, LICENSE, CONTRIBUTING and similar "in a supported location"; public repositories only. The REST community profile reports `code_of_conduct`, `contributing`, `issue_template`, `pull_request_template`, `license`, `readme`, plus `description`, `documentation`, `health_percentage` and `content_reports_enabled`. — [docs.github.com: community profiles](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories); [api.github.com example (herdr)](https://api.github.com/repos/herdrdev/herdr/community/profile)
- For the checklist to tick issue templates, they must be in `.github/ISSUE_TEMPLATE` with valid `name:` and `about:` (markdown) or `name:` and `description:` (issue forms). Issue templates must be on the default branch; PR templates may live in root, `docs/` or `.github/`, must also be on the default branch, and may be `.md` or `.txt`. — [docs.github.com: about templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- SUPPORT.md lives in root, `docs/` or `.github/`; GitHub links it in the "Helpful resources" sidebar when someone opens an issue; GitHub's tip is to link it from the README as well. — [docs.github.com: support resources](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-support-resources-to-your-project)
- CITATION.cff goes in the repository root; GitHub renders a citation prompt in APA and BibTeX; the documented example uses `cff-version: 1.2.0`. It is not in the list of inheritable health files. — [docs.github.com: CITATION files](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files)
- GOVERNANCE.md and MAINTAINERS.md are not GitHub health files (absent from the supported list), but CNCF requires both for its projects and OSPS Baseline level 2 requires a member list and roles (see the foundations section). — [docs.github.com](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file); [cncf/project-template](https://github.com/cncf/project-template)

### Inferences

- A solo maintainer with many repositories should put CODE_OF_CONDUCT, SECURITY, SUPPORT, CONTRIBUTING (generic), FUNDING.yml and VULNERABILITY_REPORT.yml in a public `<account>/.github` repository (L1 cheap win), and override per repository only where content differs. Issue templates are all-or-nothing per repository, so a repository that needs one custom form must copy every template it still wants.
- Because defaults are not in clones, packages or Scorecard's file scan of the repository, anything a downstream tool checks by file (LICENSE always; SECURITY.md for Scorecard, which scans the repository's own root, `.github/` and `docs/`) should be committed per repository for L2+. This is an inference: the Scorecard doc names the directories it searches but does not say whether it follows account defaults.
- ACCESSIBILITY.md is overkill for most CLI or library repositories at L1/L2; it earns its place for projects with a UI (a TUI counts) at L3.
- CITATION.cff is relevant only for research or academic software; GOVERNANCE.md is overkill for a solo project below L3 unless it states the "benevolent dictator" model in a few lines.

### Gaps

- I found no official statement on whether issue types, labels or `projects:` set by inherited issue forms behave differently from repository-local forms beyond the label-existence rule.
- The community profile REST field `issue_template` was `null` for herdsman even though valid issue forms are on its default branch (see the local assessment); I found no doc explaining whether the API detects YAML issue forms.

## What good CONTRIBUTING, SECURITY, SUPPORT and code-of-conduct content looks like

### Takeaway

Good files are short and operational: CONTRIBUTING says what contributions are wanted, the path (issue first or PR directly), how to build and test, and the commit/licence rules; SECURITY says supported versions, a private channel (GitHub private vulnerability reporting is the default answer), an acknowledgement time and a disclosure timeline; SUPPORT says where questions go. Contributor Covenant 3.0 (28 July 2025) is current, CC BY-SA 4.0, and replaces 2.1's enforcement ladder with restorative "Addressing and Repairing Harm".

### Cited Findings

#### CONTRIBUTING

- opensource.guide: CONTRIBUTING should cover how to file a bug report, suggest a feature, set up the environment and run tests, the types of contributions wanted, the roadmap or vision, and how to contact the maintainers; "In the earliest stages of your project, your CONTRIBUTING file can be simple", growing with FAQ answers. — [opensource.guide: starting a project](https://opensource.guide/starting-a-project/)
- opensource.guide (maintainers): "Writing things down is one of the most important things you can do as a maintainer"; document scope, response-time expectations, time commitment and accepted contribution types; close out-of-scope contributions kindly and point to the written rules; require tests and CI; automate with bots. — [opensource.guide: best practices](https://opensource.guide/best-practices/)
- OpenSSF Best Practices passing: `contribution` MUST (with a URL), `contribution_requirements` SHOULD at passing and MUST at silver (coding standards, acceptable contributions). — [criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/criteria.yml)
- OSPS Baseline L1 `OSPS-GV-03.01`: documentation MUST explain the contribution process "or clearly state that public contributions are not accepted"; L2 `OSPS-GV-03.02`: a guide with requirements for acceptable contributions; L2 `OSPS-LE-01.01`: contributors MUST assert they are legally authorised on every commit (DCO-style). — [baseline_criteria.yml (from OSPS Baseline 2026-08-28)](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/baseline_criteria.yml)
- Real example of a closed-contribution policy (herdr, 43k stars): unsolicited implementation PRs are closed automatically unless the author is a maintainer or listed in `.github/APPROVED_CONTRIBUTORS`; bugs go to a strict form, everything else to Discussions; a section "Instructions for coding agents" tells agents to verify the authenticated account and refuse PRs and speculative issues. — [herdr CONTRIBUTING.md](https://github.com/herdrdev/herdr/blob/master/CONTRIBUTING.md)

#### SECURITY and private vulnerability reporting

- GitHub's SECURITY.md setup asks for "supported versions of your project and how to report a vulnerability"; the file may be in root, `docs/` or `.github/`; GitHub points to electron's SECURITY.md as an example. — [docs.github.com: add security policy](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/add-security-policy); [docs.github.com: default health files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- Private vulnerability reporting (PVR): owners/admins of public repositories enable it under Settings → Code security → Advanced Security; orgs can enable it via a custom security configuration. Email notification only reaches people watching the repository with All Activity or Custom → Security alerts and with email enabled for Watching. — [docs.github.com: configure PVR](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configure-for-a-repository)
- Scorecard's Security-Policy scoring rewards: a valid email or http(s) reporting link (6/10), free text beyond links (3/10), and at least two hits of `vuln`, `disclos` or numbers conveying times such as "30 days" or "90 days" (1/10). — [Scorecard checks.md](https://github.com/ossf/scorecard/blob/main/docs/checks.md)
- OpenSSF CVD template: report with description, steps, affected versions and mitigations; "Our vulnerability management team will respond within 3 working days"; "This project follows a 90 day disclosure timeline". — [ossf/oss-vulnerability-guide template](https://github.com/ossf/oss-vulnerability-guide/blob/main/templates/security_policies/github_security_policy.md)
- OpenSSF maintainer guide: link SECURITY.md from the README because the Security tab "isn't obvious to everyone"; acknowledge receipt "within 1-2 days"; embargo norms: distros list under 7 days (max 14), CERT/CC 45 days, Google 90 days, and 90 days is "the longest embargo period entertained by various groups as a default"; embargo lists are "probably not necessary" without a significant vendor ecosystem. — [ossf/oss-vulnerability-guide maintainer-guide.md](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md)
- CNCF SECURITY.md template: "Do not open a public GitHub issue"; PVR link and/or email; report contents (description, steps, affected versions, impact); acknowledge in N business days (example 3) and give a fix timeline in N (example 10); a supported-versions table; disclosure steps (fix, CVE if appropriate, release, advisory). — [cncf/project-template SECURITY.md](https://github.com/cncf/project-template/blob/main/SECURITY.md)
- Best Practices passing: `vulnerability_report_process` MUST, `vulnerability_report_private` MUST (N/A allowed), `vulnerability_report_response` MUST with initial response ≤ 14 days, `vulnerabilities_fixed_60_days` MUST; silver adds `vulnerability_report_credit` and a documented `vulnerability_response_process`. — [bestpractices.dev passing](https://www.bestpractices.dev/en/criteria/0); [bestpractices.dev silver](https://www.bestpractices.dev/en/criteria/1)
- OSPS Baseline: L1 `OSPS-VM-02.01` security contacts; L2 `OSPS-VM-01.01` CVD policy "with a clear timeframe for response", `OSPS-VM-03.01` private reporting, `OSPS-VM-04.01` publish data about discovered vulnerabilities; L3 `OSPS-DO-04.01` scope and duration of support and `OSPS-DO-05.01` end-of-support statement. — [baseline_criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/baseline_criteria.yml)

#### SUPPORT

- GitHub: SUPPORT.md "lets people know about ways to get help"; shown when opening an issue; link it from the README. — [docs.github.com: support resources](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-support-resources-to-your-project)
- opensource.guide's README questions include "Where can I get more help, if I need it?". — [opensource.guide: starting a project](https://opensource.guide/starting-a-project/)
- Issue-template `contact_links` in `config.yml` redirect people to external support sites from the template chooser. — [docs.github.com: configuring templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)

#### Code of conduct

- Contributor Covenant 3.0 was released 28 July 2025: "clearer, less US-centric language", more adaptable to online and offline communities, enforcement section "reimagined as 'Addressing and Repairing Harm'", and a step-by-step builder for reporting and enforcement procedures. — [ethicalsource.dev announcement](https://ethicalsource.dev/blog/contributor-covenant-3/)
- 3.0 structure: Our Pledge; Encouraged Behaviors; Restricted Behaviors; Other Restrictions; Reporting an Issue; Addressing and Repairing Harm; Scope; Attribution. Adopters fill in the reporting means ("[NOTE: describe your means of reporting here.]") and may adapt the remedies. Ladder: Warning → Temporarily Limited Activities → Temporary Suspension → Permanent Ban, each with repair steps. Licence CC BY-SA 4.0. Attribution: "adapted from the Contributor Covenant, version 3.0, permanently available at `https://www.contributor-covenant.org/version/3/0/`". — [contributor-covenant.org 3.0](https://www.contributor-covenant.org/version/3/0/code_of_conduct/)
- 3.0 uses "Community Moderators" instead of "Project Maintainers" (secondary summary in search results; consistent with the restorative framing above). Adoption examples: Django adopted 3.0 in April 2026; Mastodon proposed it. — [djangoproject.com](https://www.djangoproject.com/weblog/2026/apr/15/contributor-covenant-adoption/); [mastodon discussion #36324](https://github.com/mastodon/mastodon/discussions/36324)
- The EthicalSource GitHub repository's latest tagged release is still 2.1 (2021-08-04), so 3.0 is published on the website rather than as a GitHub release. — [EthicalSource/contributor_covenant releases](https://github.com/EthicalSource/contributor_covenant/releases)
- Alternative used by foundations: CNCF projects use the CNCF Code of Conduct (required file in the CNCF template). — [cncf/project-template](https://github.com/cncf/project-template)
- Best Practices: a code of conduct is MUST at silver (`code_of_conduct`), not required at passing. — [criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/criteria.yml)

### Inferences

- L1: CONTRIBUTING may be three lines ("issues welcome, PRs by arrangement, run X"), or a statement that contributions are not accepted; both satisfy OSPS-GV-03.01. L2 adds build/test commands and acceptance rules. An agent-facing section (as herdr does) is worth adopting where agent-made PRs are a burden.
- L1/L2 SECURITY.md template: supported versions (often "latest release only"), PVR link (`/security/advisories/new`) and "never a public issue", what to include, an acknowledgement time written as a number of days (e.g. "within 7 days", which also earns Scorecard's timing point), a disclosure window (90 days max), credit policy, scope. Enable PVR as part of creating every public repository.
- For a solo maintainer, ≤14 days acknowledgement (Best Practices passing) is the realistic ceiling to promise; 3 working days (OpenSSF template) or 1–2 days (OpenSSF guide) is aspirational.
- SUPPORT.md is overkill when `config.yml` contact links and a README "Getting help" line exist; add it at L3 or when Discussions/Q&A exist.
- New repositories should adopt Contributor Covenant 3.0 with the reporting placeholder filled in; existing 2.1 files are acceptable but dated. A code of conduct is cheap at L2 and expected at L3.

### Gaps

- I did not verify which Contributor Covenant version GitHub's "Add code of conduct" chooser currently inserts.
- Alternatives such as the Rust, Python (PSF) and Django codes were not fetched; only CNCF's use is sourced here.
- The quoted "Community Moderators" wording came via a search-result summary, not a direct read of the 3.0 text.

## OpenSSF Scorecard: every check, how it passes, and which matter for a small project

### Takeaway

Scorecard (latest v5.5.0, 2026-04-23; scorecard-action v2.4.4, 2026-07-23) has 20 checks. Cheap wins for a small project are Security-Policy, License, Dependency-Update-Tool, Token-Permissions, Pinned-Dependencies, Dangerous-Workflow, Binary-Artifacts, CI-Tests and SAST (CodeQL); Code-Review, Contributors, Branch-Protection tiers above 1, CII-Best-Practices, Fuzzing and Packaging are structurally hard or poorly detected for a solo maintainer.

### Cited Findings

- Versions: scorecard v5.5.0 published 2026-04-23; scorecard-action v2.4.4 published 2026-07-23. — [ossf/scorecard releases](https://github.com/ossf/scorecard/releases); [ossf/scorecard-action releases](https://github.com/ossf/scorecard-action/releases)
- The 20 checks with risk and pass criteria, all from checks.md: — [Scorecard checks.md](https://github.com/ossf/scorecard/blob/main/docs/checks.md)
  - **Binary-Artifacts** (High): no generated executables (e.g. `.class`, `.pyc`) in the repository.
  - **Branch-Protection** (High): tiered; a tier must be complete before the next counts, with partial credit inside the current tier. T1 3/10 prevent force push and deletion; T2 6/10 ≥1 approving reviewer, PRs required, up-to-date branch, approval of most recent push; T3 8/10 ≥1 required status check; T4 9/10 ≥2 reviewers and code-owner review; T5 10/10 dismiss stale reviews and include administrators. Repository rulesets count; any bypass actor makes `EnforceAdmins` false.
  - **CI-Tests** (Low): CI (e.g. GitHub Actions) ran on recent (~30) commits/PRs.
  - **CII-Best-Practices** (Low): passing badge 5, silver 7, gold 10, in progress 2.
  - **Code-Review** (High): recent ~30 changes approved, or merger differs from committer; one unreviewed human change −7, several another −3, unreviewed bot changes −3; bot and AI reviews do not count. The doc itself says requiring review "is infeasible for some projects, such as those with only one active participant".
  - **Contributors** (Low): ≥3 organisations (from the GitHub profile Company field) among recent contributors.
  - **Dangerous-Workflow** (Critical): no untrusted checkout under `pull_request_target`/`workflow_run`, no script injection from untrusted context such as `github.event.issue.title`.
  - **Dependency-Update-Tool** (High): Dependabot or Renovate configured (presence only).
  - **Fuzzing** (Medium): OSS-Fuzz, ClusterFuzzLite, or native fuzz functions detected only for Go, plus some property-testing libraries for Haskell, JS/TS (fast-check), Erlang and C#/F#. Rust `cargo fuzz` is not listed.
  - **License** (Low): licence file found 6, at top level +3, recognised FSF/OSI licence +1; `LICENSES/` counts.
  - **Maintained** (High): ≥1 commit per week over 90 days for full score; archived lowest; repositories under 90 days old cannot pass.
  - **Packaging** (Medium): detects GitHub packaging workflows and language publish actions only.
  - **Pinned-Dependencies** (Medium): actions pinned to full commit SHA, container images by digest, lock files, in Dockerfiles, shell scripts and workflows.
  - **SAST** (Medium): CodeQL or SonarCloud seen on recent merged PRs, or `github/codeql-action` in a workflow.
  - **SBOM** (Medium): SBOM in source or pipeline 5, published as a release artifact +5.
  - **Security-Policy** (Medium): SECURITY.md in root, `.github/` or `docs/`; scoring as in the previous section.
  - **Signed-Releases** (High): last 5 releases carry `*.minisig`, `*.asc`, `*.sig`, `*.sign`, `*.sigstore`, `*.sigstore.json` (8/10) or SLSA provenance `*.intoto.jsonl` (10/10); signatures are not verified.
  - **Token-Permissions** (High): top-level workflow `permissions` read-only with writes declared per job.
  - **Vulnerabilities** (High): no open OSV-known vulnerabilities; ignore with justification via `osv-scanner.toml`.
  - **Webhooks** (Critical): every webhook has a secret.

### Inferences

- L1 (any repository with workflows): Token-Permissions, Pinned-Dependencies (SHA-pinned actions plus Dependabot to bump them), Dangerous-Workflow, Binary-Artifacts, Dependency-Update-Tool. These are config-only and cost nothing.
- L2 (public): add SECURITY.md (Security-Policy 10/10 is easy), top-level LICENSE, CI-Tests, a ruleset that blocks force push and deletion on the default branch (Branch-Protection tier 1 = 3/10), CodeQL if the language is supported, OSV/Vulnerabilities kept at zero.
- L3 (users, binaries): Signed-Releases (GitHub artifact attestations or Sigstore bundles), SBOM as release asset, optionally running the Scorecard action to publish a badge.
- Matter little or are unreachable solo: Code-Review (needs a second human), Contributors (needs three companies), Branch-Protection tiers 2+ (a required reviewer blocks a solo maintainer, and tier 3 points need tier 2 complete), Maintained for slow-moving stable tools, Fuzzing for Rust unless using OSS-Fuzz/ClusterFuzzLite, Packaging when publishing outside GitHub-detected actions, CII-Best-Practices (only 5/10 for passing).
- greenrepo should treat the Scorecard total as advisory and pick checks individually, as Scorecard itself notes that low Fuzzing, SAST and Packaging scores can be detection failures.

### Gaps

- I did not verify the current weighting of risk levels in the aggregate score.
- I did not verify whether CodeQL's Rust support is generally available as of October 2026, which decides whether SAST is a cheap win for Rust repositories.

## OpenSSF Best Practices badge and the OSPS Baseline: criteria that matter for a small project

### Takeaway

The badge has three "metal" levels (passing 67 criteria, silver 55, gold 23 in the current criteria file), and bestpractices.dev now also carries the OpenSSF OSPS Baseline (current version 2026-08-28) as baseline-1/2/3 levels. Passing and baseline-1 are reachable by a solo maintainer; silver is reachable with effort (governance, roadmap, access continuity, assurance case); gold requires two-person review, bus factor ≥2 and unassociated contributors, so it is out of reach for a solo project. OSPS Baseline's three levels map closely onto greenrepo's three levels.

### Cited Findings

- Passing (level 0) MUST criteria include: `description_good`, `interact`, `contribution`, `floss_license`, `license_location`, `documentation_basics`, `documentation_interface`, `sites_https`, `discussion` (searchable, URL-addressable), `maintained`, `repo_public`, `repo_track`, `repo_interim`, `version_unique`, `release_notes`, `release_notes_vulns`, `report_process`, `report_responses` (acknowledge a majority of reports from the last 2–12 months), `report_archive`, `vulnerability_report_process`, `vulnerability_report_private`, `vulnerability_report_response` (≤14 days), `build`, `test` (FLOSS automated suite), `test_policy`, `tests_are_added`, `warnings`, `warnings_fixed`, `know_secure_design`, `know_common_errors`, the `crypto_*` set (N/A when no crypto), `delivery_mitm`, `delivery_unsigned`, `vulnerabilities_fixed_60_days`, `no_leaked_credentials`, `static_analysis`, `static_analysis_fixed`, `dynamic_analysis_fixed`. My count from criteria.yml: 43 MUST among 67 criteria. SHOULD at passing: `version_semver`, `version_tags`, `report_tracker`, `test_continuous_integration`, `english`, `floss_license_osi`, `contribution_requirements`. — [bestpractices.dev passing](https://www.bestpractices.dev/en/criteria/0); [criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/criteria.yml)
- Silver MUST highlights: `contribution_requirements`, `governance`, `code_of_conduct`, `roles_responsibilities`, `access_continuity` (project continues within a week if any one person is unavailable), `documentation_roadmap` (at least the next year), `documentation_architecture`, `documentation_security`, `documentation_quick_start`, `coding_standards(_enforced)`, `build_repeatable`, `installation_common`, `maintenance_or_update`, `external_dependencies`, `dependency_monitoring`, `automated_integration_testing`, `regression_tests_added50`, `test_statement_coverage80`, `test_policy_mandated`, `signed_releases`, `input_validation`, `assurance_case`, `vulnerability_report_credit`, `vulnerability_response_process`. Silver SHOULD: `dco`, `bus_factor` (≥2), `hardening`, `version_tags_signed` (SUGGESTED). Many silver MUSTs allow N/A with justification. — [bestpractices.dev silver](https://www.bestpractices.dev/en/criteria/1); [criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/criteria.yml)
- Gold MUST: `bus_factor`, `contributors_unassociated`, `copyright_per_file`, `license_per_file`, `repo_distributed`, `small_tasks`, `require_2FA`, `code_review_standards`, `two_person_review`, `build_reproducible`, `test_invocation`, `test_continuous_integration`, `test_statement_coverage90`, `test_branch_coverage80`, `hardened_site`, `security_review`, and others. — [criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/criteria.yml)
- OSPS Baseline: "a set of security controls that projects should meet", MUST-only, by maturity level; versions 2025-02-25, 2025-10-10, 2026-02-19 and current 2026-08-28. — [baseline.openssf.org](https://baseline.openssf.org/)
- The badge project imports Baseline as `baseline-1` (24 controls), `baseline-2` (19), `baseline-3` (21) from the 2026-08-28 version (extracted 2026-09-02), with maps between baseline and metal criteria. — [baseline_criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/baseline_criteria.yml)
- Baseline level 1 controls: MFA for sensitive repository actions (AC-01.01); least-privilege collaborator defaults (AC-02.01); block direct commits to the primary branch (AC-03.01) and its deletion (AC-03.02); sanitise untrusted CI metadata (BR-01.01) and keep privileged credentials away from untrusted code (BR-01.03); HTTPS for project and distribution channels (BR-03.01/.02); no secrets in VCS (BR-07.01); user guides and a defect-reporting guide once released (DO-01.01, DO-02.01); public discussion mechanism (GV-02.01); contribution process or a "no contributions" statement (GV-03.01); OSI/FSF licence for source and released assets in LICENSE, COPYING or `LICENSES/` (LE-02, LE-03); public repository with full history (QA-01); dependency list (QA-02.01); list of codebases for multi-repo projects (QA-04.01); no generated executables or unreviewable binaries (QA-05); security contacts (VM-02.01). — [baseline_criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/baseline_criteria.yml)
- Baseline level 2 adds: least-privilege default CI token (AC-04.01); unique release versions (BR-02.01) with a changelog of functional and security changes (BR-04.01); standard dependency tooling (BR-05.01); signed releases or a signed hash manifest (BR-06.01); dependency-management and build docs (DO-06.01, DO-07.01); member list with sensitive access and roles (GV-01.01/.02); contributor requirements (GV-03.02); per-commit legal assertion such as DCO (LE-01.01); status checks pass or are bypassed manually (QA-03.01); a test suite in CI before acceptance (QA-06.01); design docs, external interfaces and a security assessment once released (SA-01, SA-02, SA-03.01); a CVD policy with response timeframe, private reporting, and published vulnerability data (VM-01, VM-03, VM-04.01). — [baseline_criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/baseline_criteria.yml)
- Baseline level 3 adds: per-job minimum CI permissions; release asset identification; secrets policy; verification instructions for integrity and signer identity; support scope/duration and end-of-support statements; collaborator review before escalated access; SBOM with compiled releases; documented test policy; at least one non-author human approval for primary-branch commits (QA-07.01); threat model; VEX; SCA and SAST policies enforced in CI. — [baseline_criteria.yml](https://github.com/coreinfrastructure/best-practices-badge/blob/main/criteria/baseline_criteria.yml)

### Inferences

- greenrepo can cite OSPS Baseline levels as its external anchor: L1 ≈ baseline-1 minus release items, L2 ≈ baseline-1 complete plus selected baseline-2 items, L3 ≈ baseline-2. Baseline-3's non-author review (QA-07.01) is unattainable solo and should be marked "not applicable to single-maintainer projects".
- The badge's passing level is worth applying for at L3 (it is a form plus links); silver's `access_continuity` forces a solo maintainer to document a backup person or recovery path for keys and repository admin, which is valuable even without the badge.
- Small-project relevance ranking: vulnerability response ≤14 days, release notes, unique versions, test policy, CI, warnings/linters, static analysis, no leaked credentials, HTTPS delivery. Low relevance: crypto criteria (N/A for most tools), gold's per-file copyright/licence headers (REUSE), coverage thresholds.

### Gaps

- I did not read each criterion's N/A rules in full; check `na_allowed` in criteria.yml before declaring N/A.
- I did not find a published crosswalk table from Scorecard checks to Baseline controls, though the badge repository ships `security_insights_map.yml` and metal↔baseline maps that may serve.

## Other published guidance: opensource.guide, licences, REUSE/SPDX, TODO Group, CHAOSS, foundation templates

### Takeaway

opensource.guide gives the minimal set (licence, README, CONTRIBUTING, code of conduct) and the maintainer habits; choosealicense.com frames the licence choice; REUSE 3.3 (2024-11-14) defines per-file SPDX headers, `LICENSES/` and `REUSE.toml`; the TODO Group's Repolinter was archived in February 2026; CHAOSS offers responsiveness metrics; CNCF's project template is the best ready-made set of governance and maintainer files, and Rust's API guidelines set the licence convention for crates.

### Cited Findings

- opensource.guide launch set: licence ("You must include a license when you launch an open source project"), README answering "What does this project do? Why is this project useful? How do I get started? Where can I get more help", CONTRIBUTING, and a code of conduct; write in a welcoming tone for non-native English readers. — [opensource.guide: starting a project](https://opensource.guide/starting-a-project/)
- opensource.guide for maintainers: a VISION or scope document, ROADMAP where applicable, issue/PR templates, "good first issue" labels, required tests and CI, bots such as Dependabot; pausing or handing off is legitimate; it cites a maintainer budgeting "2-5 hours per week". — [opensource.guide: best practices](https://opensource.guide/best-practices/)
- choosealicense.com: MIT is "short and to the point"; GPLv3 restricts "distributing closed source versions"; prefer "the license preferred by the community you're contributing to"; without a licence "Businesses and savvy developers won't touch a project". — [choosealicense.com](https://choosealicense.com/)
- Rust convention (C-PERMISSIVE): `license = "MIT OR Apache-2.0"`, files `LICENSE-APACHE` and `LICENSE-MIT` in the root, README text "Licensed under either of Apache License, Version 2.0 or MIT license at your option" plus a clause that contributions are "dual licensed as above, without any additional terms or conditions"; advises against Apache-only because "Apache-only software cannot be used in some situations where most of the Rust runtime stack can". — [Rust API guidelines: necessities](https://rust-lang.github.io/api-guidelines/necessities.html)
- REUSE specification 3.3, dated 2024-11-14 (earlier 3.2, 3.0): every covered file needs licensing information; licence texts in `LICENSES/<SPDX-ID>.txt`; no unused licence files; `LicenseRef-` for non-SPDX licences; comment headers are RECOMMENDED; `REUSE.toml` or DEP5 for bulk annotation, mutually exclusive, DEP5 deprecated; root `LICENSE`/`COPYING` files are allowed and ignored by the tool; the tool now lives on Codeberg. — [reuse.software spec 3.3](https://reuse.software/spec-3.3/); [reuse.software specifications](https://reuse.software/specifications/)
- REUSE tool latest on PyPI: 6.2.0 (2025-10-27). — [pypi.org: reuse](https://pypi.org/project/reuse/)
- TODO Group's Repolinter ("The Open Source Repository Linter", checks for LICENSE, README and similar) was archived on 2026-02-06; final version 0.12.0. Search-result summary; the repository page states it is archived. — [todogroup/repolinter](https://github.com/todogroup/repolinter)
- CHAOSS Responsiveness practitioner guide: Time to First Response, Time to Close, Change Request Closure Ratio; compare against a benchmark "reasonable for your community, for example, two business days"; start with trends. — [chaoss.community: responsiveness](https://www.chaoss.community/practitioner-guide-responsiveness/)
- CNCF project template (last commit 2026-08-11): required LICENSE, README, CONTRIBUTING, CODE_OF_CONDUCT (CNCF), MAINTAINERS.md (with affiliations), GOVERNANCE.md (choose maintainer-council, elections or subprojects variant), SECURITY.md; recommended ADOPTERS, CONTRIBUTOR_LADDER, RELEASES, REVIEWING, DESIGN-PROPOSALS, CODEOWNERS ("should match GOVERNANCE.md"), issue templates and a PR template; TODOs live in HTML comments. — [cncf/project-template](https://github.com/cncf/project-template)
- CNCF MAINTAINERS.md template: table of name, GitHub ID and organisation; emeritus section with an inactivity threshold; sandbox needs 3 maintainers from 2+ organisations. — [cncf/project-template MAINTAINERS.md](https://github.com/cncf/project-template/blob/main/MAINTAINERS.md)
- CNCF maintainer-governance template sections: Values, Maintainers, Becoming a Maintainer, Meetings, CNCF Resources, Code of Conduct enforcement, Security Response Team, Voting, Modifications. — [cncf/project-template GOVERNANCE-maintainer.md](https://github.com/cncf/project-template/blob/main/GOVERNANCE-maintainer.md)
- pyOpenSci lists README, code of conduct, licence, CONTRIBUTING, development guide and changelog as the Python package repository files, noting they serve as "a measure of package community health on many online platforms". — [pyOpenSci package guide](https://www.pyopensci.org/python-package-guide/documentation/repository-files/intro.html)

### Inferences

- REUSE compliance is overkill at L1/L2 for a single-licence project; a root LICENSE with SPDX id in the package manifest suffices. It becomes relevant for mixed-licence or vendored code (herdsman's NOTICE plus vendored MIT code is the kind of case where `REUSE.toml` would make provenance machine-checkable) and for Best Practices gold.
- With Repolinter archived, there is no maintained TODO Group repository linter; greenrepo's audit skill fills that gap. This is an opportunity, not a sourced claim about alternatives.
- Small-project adaptation of CNCF: a MAINTAINERS file of one line and a GOVERNANCE paragraph ("single maintainer decides; how that changes") satisfies OSPS GV-01 and Best Practices silver `governance`/`roles_responsibilities` without the CNCF ceremony; ADOPTERS, CONTRIBUTOR_LADDER, elections and REVIEWING are overkill below L3.
- Rust profile: dual MIT/Apache-2.0 is the ecosystem default for libraries; Apache-2.0-only is defensible for applications, as herdsman inherited from herdr.
- CHAOSS's two-business-day benchmark is a community health target, not a requirement; for a solo maintainer greenrepo should state an explicit response expectation instead.

### Gaps

- Apache Software Foundation and Python Software Foundation governance templates for small projects were not researched; I found no ASF or PSF template aimed at small non-foundation projects.
- The TODO Group's other guides (OSPO guides) and CHAOSS's viability/bus-factor metrics were not fetched in detail.
- choosealicense.com's page summary did not cover file placement or copyright-line advice.

## Issues versus Discussions, issue forms versus markdown templates, and labels

### Takeaway

The strongest current pattern for a busy small project is herdr's: `blank_issues_enabled: false`, a single required bug form, and `contact_links` sending features, ideas and questions to Discussions, which have their own category forms. Issue forms are still officially "public preview" but are the de facto standard; markdown templates remain for PR templates (forms are not supported for PRs). Issue types are organisation-only, so personal-account repositories rely on labels.

### Cited Findings

- GitHub positions Discussions for announcements, planning with community input, Q&A with marked answers, and polls; open-ended issues can be converted into discussions. — [docs.github.com: about discussions](https://docs.github.com/en/discussions/collaborating-with-your-community-using-discussions/about-discussions)
- Issue forms: YAML in `.github/ISSUE_TEMPLATE/*.yml`, field types markdown, input, textarea, dropdown, checkboxes and upload, with required validations; "Issue forms are currently in public preview and subject to change"; "Issue forms are not supported for pull requests". Top-level keys: `name`, `description`, `title`, `labels`, `type`, `assignees`, `projects`. `config.yml` supports `blank_issues_enabled` (users with write access bypass it) and `contact_links`. Templates sort alphanumerically, YAML before markdown; use numeric prefixes to order. — [docs.github.com: configuring templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository); [github/docs syntax-for-issue-forms source](https://github.com/github/docs/blob/main/content/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms.md)
- Forms vs templates: markdown templates "provide guidance … while allowing contributors to specify the content"; forms ensure "specific, structured information"; form input is converted to a markdown issue body. — [docs.github.com: about templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- Issue types: organisation-level, defaults task, bug and feature, up to 25 per organisation; GA in April 2025; REST support March 2025; `gh` CLI can set and filter types since June 2026; issue fields (structured metadata) GA 2026-07-02. — [docs.github.com: issue types](https://docs.github.com/en/issues/tracking-your-work-with-issues/configuring-issues/managing-issue-types-in-an-organization); [changelog 2025-04-09](https://github.blog/changelog/2025-04-09-evolving-github-issues-and-projects/); [changelog 2026-06-10](https://github.blog/changelog/2026-06-10-manage-sub-issues-types-and-dependencies-from-github-cli/); [changelog 2026-07-02](https://github.blog/changelog/2026-07-02-issue-fields-are-now-generally-available/)
- GitHub default labels (now ten): `accessibility` (new), `bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`; `good first issue` populates the repository's `/contribute` page; organisations can customise defaults. — [docs.github.com: managing labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- herdr's policy in practice: `config.yml` disables blank issues and links "Feature requests and ideas" and "Questions and contribution proposals" to Discussions; the bug form opens with policy text, two required confirmation checkboxes ("I reproduced this bug…"), required current/expected/reproduction/impact/environment fields, an 8,000 character auto-close rule and explicit rules for AI agents. — [herdr config.yml](https://github.com/herdrdev/herdr/blob/master/.github/ISSUE_TEMPLATE/config.yml); [herdr bug.yml](https://github.com/herdrdev/herdr/blob/master/.github/ISSUE_TEMPLATE/bug.yml)
- herdr Discussions: categories Announcements, General, Ideas, Q&A (answerable), Show and tell; category forms `ideas.yml` (idea/problem, requested change, why) and `q-a.yml`. — [herdr DISCUSSION_TEMPLATE](https://github.com/herdrdev/herdr/tree/master/.github/DISCUSSION_TEMPLATE)
- herdr labels (about 50) mix triage state (`needs-repro`, `data-needed`, `waiting-answer`, `needs-decision`, `pending-release`, `preview-released`), priority (`p0`–`p2`), platform (`windows`, `macos`, `linux`), area (`rendering`, `ui`, `api`, `sessions`, `agent-detection`…), and bot/review markers (`ai-slop`, `ai-review`, `coderabbit-review`, `auto-fix`). — [herdr labels](https://github.com/herdrdev/herdr/labels)

### Inferences

- L1: keep GitHub's default labels; disable blank issues only once templates exist.
- L2: one bug form (required: what happens, what should, steps, version/environment) plus `config.yml` contact links to docs and to the PVR form; a feature form only if Discussions are off.
- L3 with real traffic: adopt herdr's split (issues = reproduced bugs and maintainer work items; Discussions = ideas, questions, proposals) with discussion category forms; add a small label scheme: type (bug/enhancement), state (`needs-repro`, `waiting-answer`), priority (`p0`–`p2`) and platform. Area labels only when the backlog needs filtering. herdr's 50 labels are overkill for a solo project.
- Because issue types need an organisation, a personal-account standard should not depend on `type:` in forms; the form's `labels:` key is the portable mechanism.
- Agent-era addition worth standardising: a short "AI agents must…" block in the bug form and CONTRIBUTING, as herdr does, since agents read these files.

### Gaps

- I did not confirm whether Announcements/General/Ideas/Q&A/Show and tell is exactly GitHub's default category set for new Discussions, or herdr's own choice.
- No primary GitHub guidance was found that recommends "issues for bugs only"; that is a project policy pattern.

## Local reference: herdsman and herdr community files assessed

### Takeaway

herdsman (dev and main) already meets GitHub's community profile at 100% and most L2 items: README, Apache-2.0 LICENSE with NOTICE, CONTRIBUTING, Contributor Covenant 2.1, SECURITY.md with PVR enabled, issue forms with contact links, PR template, CODEOWNERS, grouped monthly Dependabot, SHA-pinned actions and top-level workflow permissions. The `herdr-import` branch holds only LICENSE, AGENTS.md and CLAUDE.md among community files because herdsman's rename step strips herdr's project files; upstream herdr itself scores 50% (no CoC, no SECURITY.md, no PR template) yet has PVR on and a strong issue/Discussions intake policy.

### Cited Findings

- herdsman `dev` community files: `README.md`, `LICENSE` (Apache-2.0), `NOTICE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1, reporting via the PVR form or an @-mention), `SECURITY.md`, `CHANGELOG.md`, `MAINTAINING.md`, `AGENTS.md`, `CLAUDE.md`; `.github/`: `CODEOWNERS` (`* @remziduzagac`), `ISSUE_TEMPLATE/bug.yml`, `feature.yml`, `config.yml` (blank issues off; links to docs and the PVR form), `pull_request_template.md`, `dependabot.yml` (github-actions and npm monthly, grouped, Rust left to upstream merges), nine workflows. — local: `git ls-tree -r dev` in herdsman
- herdsman SECURITY.md: supported versions (latest release and preview), PVR link, what to include, acknowledgement "within seven days", advisory credit, explicit scope. — local: `git show dev:SECURITY.md`
- herdsman live settings: community profile health 100% (`issue_template` reported `null` despite forms on the default branch `main`); PVR enabled; secret scanning and push protection enabled; Dependabot security updates disabled; Discussions disabled; active rulesets "Long-lived branches" and "Release tags"; labels are GitHub's defaults plus Dependabot's `dependencies`, `github_actions`, `rust`. — [api.github.com community profile](https://api.github.com/repos/remziduzagac/herdsman/community/profile); [github.com/remziduzagac/herdsman](https://github.com/remziduzagac/herdsman)
- herdsman workflows: every workflow has a top-level `permissions:` block and every external `uses:` is pinned to a 40-character SHA (the only unpinned entry is the local reusable workflow `./.github/workflows/linux-packages.yml`); no CodeQL or Scorecard workflow; no `pull_request_target`. — local: `git show dev:.github/workflows/*.yml`
- herdr-import community files: `LICENSE`, `AGENTS.md`, `CLAUDE.md`, and `.github/workflows` only; herdsman's NOTICE says the rename "removes herdr's own project files, such as its README, contribution policy, logo and release history". — local: `git ls-tree -r herdr-import`; `git show dev:NOTICE`
- Upstream herdr (herdrdev/herdr): root `README.md`, `README.zh-CN.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`, `SPONSORS.md`, `AGENTS.md`, `CLAUDE.md`; `.github/` `APPROVED_CONTRIBUTORS`, `MAINTAINERS` (three GitHub users), `DISCUSSION_TEMPLATE/`, `ISSUE_TEMPLATE/` (bug, translation, config), `dependabot.yml` (cargo with a pinned-out ratatui and github-actions, monthly, minor/patch groups), workflows including `pr-gate.yml` on `pull_request_target` that closes PRs from unlisted authors. Community profile 50%: no code of conduct, issue template or PR template detected; no SECURITY.md (404) but PVR enabled; Discussions on; 43,104 stars and 323 open issues. — [github.com/herdrdev/herdr](https://github.com/herdrdev/herdr); [api.github.com community profile](https://api.github.com/repos/herdrdev/herdr/community/profile)

### Inferences

- herdsman gaps against the standards above: Contributor Covenant 2.1 rather than 3.0; acknowledgement written as "seven days" (Scorecard's timing hit wants digits, so "7 days" is safer); no disclosure window stated; no SUPPORT.md (adequately covered by contact links while Discussions are off); no MAINTAINERS/GOVERNANCE line or access- continuity note (OSPS GV-01, Best Practices silver); Dependabot security updates off; no CodeQL; no release signatures/provenance or SBOM detected in `release.yml` (signed apt/dnf/pacman repositories exist, per SECURITY.md).
- Routing conduct reports through the security advisory form, as herdsman's code of conduct does, works for a solo maintainer with no public email but mixes two channels; a contact email or a dedicated form is cleaner at L3.
- herdr shows that strong intake policy and community-profile completeness are independent: it would fail Scorecard Security-Policy (no SECURITY.md) despite having PVR on, and its `pull_request_target` gate is exactly the trigger Scorecard's Dangerous-Workflow inspects; it passes only if no untrusted code is checked out (not verified beyond the first 40 lines, which use `actions/github-script` without a checkout).
- Both projects are good greenrepo fixtures: herdsman for L2 completeness, herdr for L3 intake policy.

### Gaps

- I did not audit herdsman's release pipeline for GitHub artifact attestations under another name, nor run Scorecard against either repository.
- I did not read herdr's `pr-gate.yml` in full or its `translation.yml` form.
