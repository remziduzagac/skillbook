# Spec-driven development toolkits (Spec Kit, Kiro, OpenSpec, Tessl)

Research date: 2026-10-07. Version numbers, dates and star counts for Spec Kit and OpenSpec were read from the GitHub API on that date. Links sit at the end of each bullet, on their own line where the URL is long.

Reader context: a solo developer whose "blueprint" has a current-state `design/` tree of areas, PRDs as change proposals (`prd/NNNN-<slug>/README.md`, `tasks/T01-*.md`, a design delta merged into `design/` when implemented), numbered decisions, research and discussion notes, all plain markdown with YAML front matter, driven by Claude Code. The overriding constraint is simplicity.

## GitHub Spec Kit: files, layout, commands, lifecycle, maturity

### Takeaway

Spec Kit is a heavy, per-feature, flow-forward toolkit: each feature gets `specs/NNN-<name>/` with spec, plan, tasks and up to four more design files. It has no system-wide current-state spec. Since August 2026 it is at v1.x and has grown a preset, extension and workflow system. Keeping specs current over time is left to a team convention (flow-back, flow-forward or living spec); the tool does not merge features into a whole.

### Cited Findings

Maturity and scale:

- Repo created 2025-08-21; first release v0.0.1 on 2025-08-22; v1.0.0 on 2026-08-21; latest v1.1.1 on 2026-10-06; about 140,400 stars; MIT licence. Releases are frequent, several a week — [releases](https://github.com/github/spec-kit/releases)
- A secondary field study cites Spec Kit at about 118,000 stars and v0.12.4 in July 2026, with 30+ agent integrations. That agrees with the jump to 1.0 in August 2026 — [ianhxu-field-study](https://github.com/ianhxu/agentic-engineering-field-study/blob/main/04-spec-driven-development.md)
- Requires Python 3.11+ and `uv`. The README now presents three "processes": SDD, bug fixing (`/speckit-bug-assess`, `-fix`, `-test`, as an extension) and idea assessment (five `/speckit-assess-*` stages). The primary integration is GitHub Copilot in skills mode, with other agents via integration keys — [spec-kit README](https://github.com/github/spec-kit)
- Recent releases add an experimental MCP stdio server, expression filters, installable custom step types, pinned catalog releases for extensions, workflows and presets, and community extensions (one is named "openspec"). v1.1.0 deprecates the core `/speckit.taskstoissues` in favour of a bundled `github` extension — [releases](https://github.com/github/spec-kit/releases)
- The tool has a full artifact-composition system. Commands, templates, scripts and hooks resolve through layers (built-in, preset, extension, project override) with `replace`, `wrap`, `prepend`, `append` and `additive` strategies, inspected with `specify artifact list --json` — [artifacts.md](https://github.com/github/spec-kit/blob/main/docs/reference/artifacts.md)

Commands (templates in `templates/commands/`):

- The core commands are `analyze`, `checklist`, `clarify`, `constitution`, `converge`, `implement`, `plan`, `specify`, `tasks` and `taskstoissues`. They are namespaced `speckit.<stem>`, so `/speckit.specify`, or `/speckit-specify` in skills mode — [commands dir](https://github.com/github/spec-kit/tree/main/templates/commands); [artifacts.md](https://github.com/github/spec-kit/blob/main/docs/reference/artifacts.md)
- `/speckit.converge` (new in the 1.x line) assesses the codebase against spec, plan and tasks, then appends any unbuilt work as new tasks to `tasks.md`. You repeat implement → converge until it is done — [converge.md](https://github.com/github/spec-kit/blob/main/templates/commands/converge.md); [evolving-specs.md](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md)
- `/speckit.analyze` checks the spec, plan and tasks against each other for gaps. `/speckit.clarify` updates `spec.md` — [evolving-specs.md](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md)

Files and layout:

- The constitution lives at `.specify/memory/constitution.md`. Templates and scripts sit under `.specify/templates/` and `.specify/scripts/`. A forced refresh (`specify init --here --force`) can overwrite a customised constitution and templates — [evolving-specs.md](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md)
- Per-feature layout: `specs/[###-feature]/` holds `plan.md`, `research.md` (Phase 0), `data-model.md`, `quickstart.md` and `contracts/` (Phase 1, all from `/plan`), plus `tasks.md` (from `/tasks`). `plan.md` has a "Constitution Check" marked "GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.", and a "Complexity Tracking" section filled only to justify constitution violations — [plan-template.md](https://github.com/github/spec-kit/blob/main/templates/plan-template.md)
- Feature numbering: with `"sequential"` (the default), the directory is `NNN-<short-name>`, the next free 3-digit number in `specs/`, for example `003-user-auth`. A timestamp variant is `20260319-143022-user-auth`. Branch creation is now an optional `before_specify` hook from a git extension, and "the spec directory name and the git branch name are independent". `specify` caps `[NEEDS CLARIFICATION]` markers at 3 — [specify.md](https://github.com/github/spec-kit/blob/main/templates/commands/specify.md)
- `spec.md` template sections:
  - User Scenarios & Testing (mandatory): user stories with priorities P1, P2, P3, plus edge cases.
  - Requirements (mandatory): functional requirements `FR-001: System MUST …`, with inline `[NEEDS CLARIFICATION: …]` markers.
  - Key Entities (if data is involved).
  - Success Criteria (mandatory): `SC-001` measurable outcomes.
  - Assumptions.

  [spec-template.md](https://github.com/github/spec-kit/blob/main/templates/spec-template.md)
- The `tasks.md` template (252 lines) uses the format `[ID] [P?] [Story] Description`, for example `T012 [P] [US1] Create Entity1 model in src/models/…`. `[P]` marks tasks that can run in parallel. Phases are Setup, Foundational, one phase per user story (P1 marked MVP), then polish. Test tasks are "OPTIONAL — only if tests requested" — [tasks-template.md](https://github.com/github/spec-kit/blob/main/templates/tasks-template.md)

Lifecycle and living specs:

- Spec Kit "intentionally leaves teams in control of what happens to `spec.md`, `plan.md`, and `tasks.md` after requirements change". It names three models, of which "None is the default, and none is required":
  - **Flow-back**: edit any artifact, then reconcile by hand. Risk: silent drift.
  - **Flow-forward**: completed feature directories are immutable history; new requirements get a new directory. Cost: duplicated, fragmented context.
  - **Living spec**: `spec.md` is the contract, and `plan.md` and `tasks.md` are regenerated from it. Risk: lost rationale.

  The guide says to record the choice in the constitution. It cites Böckeler's spec-first, spec-anchored and spec-as-source ladder — [spec-persistence.md](https://github.com/github/spec-kit/blob/main/docs/concepts/spec-persistence.md)
- For existing projects, flow-forward means a new `/speckit.specify` directory for each follow-up change. The old directory "remains intact for audit", and the guide advises "clear feature names or cross-links when a new directory supersedes or extends earlier work" — [evolving-specs.md](https://github.com/github/spec-kit/blob/main/docs/guides/evolving-specs.md)
- Böckeler (Oct 2025) judged Spec Kit spec-first in practice. Its branch-per-spec model suggests specs are per-change, despite aspirational talk of "living, executable artifacts" — [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

### Inferences

- Spec Kit's `specs/NNN-feature/` is roughly the developer's `prd/NNNN-<slug>/`. Spec Kit has no equivalent of the `design/` current-state tree, so system-level truth is scattered across feature directories (the flow-forward cost Spec Kit itself names). The blueprint's design tree plus merged deltas is strictly more coherent here.
- Worth borrowing:
  - The cheap `[NEEDS CLARIFICATION: …]` marker convention with a hard cap.
  - Requirement and success-criterion IDs (`FR-001`, `SC-001`) when a PRD is big enough to need them.
  - Writing down an explicit persistence model: PRDs flow-forward and immutable once done, `design/` living.
- Worth avoiding:
  - The fan-out of per-feature files (research, data-model, quickstart, contracts, checklists).
  - Constitution gates.
  - The 1.x preset and extension layering.

  Each adds review surface and drift points without helping a solo developer whose CLAUDE.md already serves as the constitution.
- `/speckit.converge` (re-check code against the plan, append missing tasks) is a useful prompt pattern to copy as a plain instruction ("compare the PRD and its tasks to the code; list gaps as new tasks"). It needs no tool.

### Gaps

- I did not verify when the original short command names (`/specify`, `/plan`, `/tasks`) became the `speckit.*` namespace. The 2025 articles use the short names; the current templates use `speckit.<stem>`.
- I did not fetch the 1.0.0 release notes, so what "1.0" committed to (stability guarantees) is unconfirmed.

## AWS Kiro: specs, EARS, steering, hooks

### Takeaway

Kiro, a commercial IDE, CLI and web agent from AWS, gives each spec three files in `.kiro/specs/<name>/`: `requirements.md` (EARS acceptance criteria) or `bugfix.md`, then `design.md` and `tasks.md`. Tasks cite requirement numbers. "Steering" files are always-on or conditionally loaded context. Hooks automate actions on events. Specs are still essentially per-feature and spec-first. Kiro's distinctive extra is property-based testing derived from EARS requirements, which only pays off with Kiro's tooling.

### Cited Findings

Maturity:

- Preview in July 2025 ("more than 100,000 developers" within 5 days). GA in November 2025. A one-year post on 2026-07-14 lists a CLI, checkpointing, property-based testing, global steering, parallel agents, web and mobile clients, and Pro+ and Pro Max tiers — [kiro one-year](https://kiro.dev/blog/one-year/)
- At GA (Nov 17, 2025, per secondary reporting of the GA post) Kiro added "property-based testing for spec correctness", checkpoints, the Kiro CLI and team plans — [kiro GA](https://kiro.dev/blog/general-availability/); [ciol summary](https://www.ciol.com/generative-ai/kiro-reaches-ga-with-property-based-tests-cli-and-team-controls-10799180)

Specs:

- Every spec runs Requirements (or Bug Analysis) → Design → Tasks. The files are `requirements.md` or `bugfix.md`, `design.md` ("technical architecture, sequence diagrams, and implementation considerations") and `tasks.md`, which tracks status in real time. They are stored in `.kiro/specs/` — [kiro specs](https://kiro.dev/docs/specs/)
- Feature-spec variants:
  - Requirements-First: behaviour → design → tasks.
  - Design-First: architecture → derive requirements → tasks.
  - Quick Spec: generates all artifacts "without approval gates" for well-understood features.

  There is also an "Analyze Requirements" step that flags inconsistencies and gaps before design — [kiro specs](https://kiro.dev/docs/specs/); [feature specs](https://kiro.dev/docs/specs/feature-specs/)
- Tasks reference the requirements they come from ("e.g., *Requirements: 1.1, 2.3*"), which is Kiro's traceability mechanism — [feature specs](https://kiro.dev/docs/specs/feature-specs/)
- Kiro groups dependent tasks into "waves". Tasks with no unmet dependencies run concurrently; the waves run in sequence — [kiro specs](https://kiro.dev/docs/specs/)
- Böckeler's Oct 2025 review of Kiro:
  - Requirements were "As a…" user stories with GIVEN/WHEN/THEN acceptance criteria.
  - Design sections covered architecture, data flow, data models, error handling, testing strategy, implementation approach and migration strategy.
  - She classed it spec-first only: "no spec-anchoring strategy".
  - A small bug fix produced "four user stories with sixteen acceptance criteria".

  [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)

EARS:

- EARS was developed by Alistair Mavin and colleagues at Rolls-Royce for jet-engine control airworthiness requirements, and published at IEEE RE'09. The general template is "WHILE <precondition(s)>, WHEN
  <trigger>, the <system> SHALL <response>". It has six patterns: ubiquitous, state-driven (WHILE),
  event-driven (WHEN), optional feature (WHERE), unwanted behaviour (IF … THEN) and complex (combinations). It aims to cut ambiguity, vagueness and incompleteness by fixing clause order and a small keyword set — [wikipedia EARS](https://en.wikipedia.org/wiki/Easy_Approach_to_Requirements_Syntax)
- Kiro's documented form is "WHEN [condition/event] THE SYSTEM SHALL [expected behavior]". The docs' claimed benefits are clarity, testability, traceability and "comprehensive thinking about conditions" — [feature specs](https://kiro.dev/docs/specs/feature-specs/)
- Kiro derives properties from EARS requirements and fuzz-tests them with shrinking. This is the payoff of the rigid syntax: requirements become machine-checkable properties — [helpercode 2026-07](https://helpercode.com/2026/07/14/two-old-ideas-one-predictable-future-why-kiros-spec-driven-with-property-based-flow-is-my-favorite-feature/); [kiro GA](https://kiro.dev/blog/general-availability/)
- A feature request to add EARS to Spec Kit exists (issue #1356). I did not read its status — [spec-kit #1356](https://github.com/github/spec-kit/issues/1356)

Steering and hooks:

- The default steering files are `product.md` (purpose, users, goals), `tech.md` (frameworks, constraints) and `structure.md` (file layout, naming, architecture). They live in `.kiro/steering/` (workspace) or `~/.kiro/steering/` (global); workspace wins on conflict. Front matter `inclusion:` takes `always` (the default), `fileMatch`, `manual` (via `#steering-name`) or `auto` (matched on description). Files can embed live files with `#[[file:path]]`, line ranges or `#[[folder:…]]`. `AGENTS.md` is honoured automatically. Best practice is "single domain" per file, maintained like code — [kiro steering](https://kiro.dev/docs/steering/)
- Hooks are JSON files in `.kiro/hooks/`. Triggers include PostFileSave, PostFileCreate, PostFileDelete, PostPromptSubmit, Stop, PreToolUse, PostToolUse and PostSpecTaskComplete. Actions are shell commands (session context on STDIN) or injected agent prompts. Uses include linting after edits, generating companion tests or docs, and blocking dangerous operations — [kiro hooks](https://kiro.dev/docs/hooks/)
- Vendor comparison pages say Kiro specs "are static and do not update as implementation evolves" and that the dedicated IDE brings lock-in. These are secondary and vendor-authored — [augmentcode](https://www.augmentcode.com/tools/best-spec-driven-development-tools); [levelop](https://levelop.dev/blog/spec-driven-development-tools-compared)

### Inferences

- Kiro steering maps one-to-one onto what Claude Code already has:
  - `CLAUDE.md` = `always`.
  - Nested per-directory `CLAUDE.md` or path-scoped rules = `fileMatch`.
  - `@file` imports = `#[[file:]]`.
  - Skills = `auto`/`manual`.

  The developer needs no new mechanism. The three-file split (product, tech, structure) is a reasonable checklist for what the top of `design/` or CLAUDE.md should cover.
- Kiro hooks correspond to Claude Code hooks. A Stop or PostToolUse hook could remind the agent to update the PRD's task checkboxes or the design delta, but that adds machinery; a line in CLAUDE.md is the simpler first step.
- EARS is worth using as an optional sentence template for acceptance criteria in event- and state-heavy areas (for herdsman: agent state detection, pane lifecycle). "WHEN … WHILE … the system SHALL …" forces the trigger and the precondition to be named. Mandating EARS everywhere adds ceremony without Kiro's property-based tests to consume it.
- Kiro's "_Requirements: 1.1, 2.3_" tag on tasks is the cheapest traceability there is. A task file can name the PRD requirement or design heading it serves, with no tooling.

### Gaps

- I did not open Kiro's GA blog post itself; the GA date and features come from Kiro's one-year post plus secondary coverage.
- I found no Kiro feature that merges completed specs into a system-level current-state document. Böckeler and vendor comparisons say there is none, but I did not find an official Kiro statement either way.
- Kiro's exact `requirements.md` numbering scheme (Requirement N with acceptance criteria N.M) is implied by the "1.1, 2.3" references but was not shown verbatim on the pages fetched.

## OpenSpec: current specs vs change proposals, delta format, archive merge, validation

### Takeaway

OpenSpec is the closest match to the developer's blueprint, and the lightest of the three. `openspec/specs/` holds the current truth by capability. `openspec/changes/<name>/` holds proposals: `proposal.md`, delta specs using `## ADDED|MODIFIED|REMOVED Requirements`, `design.md` and `tasks.md`. `openspec archive` validates the change, merges the deltas into the main specs (ADDED appends, MODIFIED replaces the whole requirement by header, REMOVED deletes), then moves the folder to `changes/archive/YYYY-MM-DD-<name>/`. The merge works because the specs have a rigid shape: `### Requirement: <Name>` blocks with `#### Scenario:` children.

### Cited Findings

Maturity:

- Repo created 2025-08-05; v0.1.0 on 2025-09-06; v1.0.0 on 2026-01-26; latest v1.14.1 on 2026-10-06; about 71,200 stars. It installs with `npm install -g @fission-ai/openspec`, supports 30+ assistants including Claude Code, and collects opt-out anonymous telemetry — [releases](https://github.com/Fission-AI/OpenSpec/releases); [faq.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/faq.md)
- It positions itself as "fluid not rigid, iterative not waterfall, easy not complex, built for brownfield not just greenfield". It calls itself "lighter" than Spec Kit's "rigid phase gates" and tool-independent unlike Kiro — [OpenSpec README](https://github.com/Fission-AI/OpenSpec)

Structure:

- "Specs are the source of truth — they describe how your system currently behaves. Changes are proposed modifications — they live in separate folders until you're ready to merge them."
- Layout:
  - `openspec/specs/<capability>/spec.md`, for example `auth/`, `payments/`, `ui/`. Capabilities can nest by domain, such as `identity/user-auth`.
  - `openspec/changes/<change-name>/` containing `proposal.md`, `design.md`, `tasks.md`, an optional `.openspec.yaml`, and `specs/<capability>/spec.md` (the deltas).
  - `openspec/changes/archive/YYYY-MM-DD-<name>/`.

  [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md); [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- Note: a summary of the README put the archive at `openspec/archive/`. The concepts and CLI docs consistently say `openspec/changes/archive/`; treat the docs as authoritative — [cli.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md)
- Main spec format: `# <Name> Specification`, `## Purpose`, `## Requirements`, then for each requirement `### Requirement: <Name>`, a SHALL/MUST sentence, and one or more `#### Scenario: <case>` blocks with `- GIVEN / - WHEN / - THEN / - AND` bullets. RFC 2119 keywords set strength: MUST/SHALL absolute, SHOULD recommended, MAY optional — [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)
- Artifacts:
  - `proposal.md`: intent, scope (in and out) and approach.
  - Delta specs: what changes.
  - `design.md`: technical approach and architecture decisions.
  - `tasks.md`: a checklist numbered 1.1, 1.2 under headings, each task small enough for one session and stating how it is verified.

  The default schema is a dependency graph: proposal → (specs ∥ design) → tasks. "Dependencies are enablers, not gates." Custom schemas live in `openspec/schemas/<name>/schema.yaml` — [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)
- Spec content rule: "A spec is behavior, not code." Keep the queue, library and table schema in `design.md` or the code, because "when behavior and implementation get mixed into one requirement, the requirement stops being testable and starts going stale the moment the code changes." The quick test: "If implementation can change without changing externally visible behavior, it likely does not belong in the spec" — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md); [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)
- "Progressive rigor": a lite spec by default (short behaviour-first requirements, scope and non-goals, a few acceptance checks). A full spec is for cross-team, API or contract, migration, security, or high-ambiguity changes. "Most changes should stay in Lite mode." — [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)

Delta format (verbatim shape):

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

Source: [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)

Archive semantics:

- "ADDED gets appended to the main spec, MODIFIED replaces the old version, and REMOVED is dropped from it." MODIFIED must "include the full new version", ideally with a note on what changed. REMOVED comes "with a line on why". Common mistakes: marking a real change as ADDED gives "two competing requirements"; describing new behaviour as MODIFIED leaves "nothing to replace" — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- A delta that creates a new capability may open with `## Purpose`, which seeds the new main spec's Purpose. Without it the Purpose becomes `TBD`. For an existing spec, a delta's Purpose is ignored; edit the main spec directly — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- Removing a capability's last requirement retires it and deletes its `spec.md`, but only if the change's `.openspec.yaml` declares `retire_capabilities: true`. Retirement is refused while the spec holds content outside its title, `## Purpose` and requirement blocks, such as a `## Notes` section or a comment under a requirement — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- Renames are supported: `/opsx:sync` "applies the whole delta: a requirement under `## REMOVED` is deleted from the main spec and a renamed one is retitled in place, while content the delta doesn't mention is left untouched." The README summary lists a `RENAMED Requirements` section — [opsx.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/opsx.md); [OpenSpec README](https://github.com/Fission-AI/OpenSpec)
- `openspec archive [change] [--yes] [--skip-specs] [--no-validate]`. Steps:
  1. Validate.
  2. Confirm (agents and CI must pass `--yes`).
  3. Claim the archive destination.
  4. Validate and merge the deltas into `openspec/specs/`.
  5. Move the change to `changes/archive/YYYY-MM-DD-<name>/`.
  6. On failure, restore the specs and leave the change active.

  Change names are lowercase kebab-case, and a numeric prefix is allowed for ordering (`100-add-feature`) — [cli.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md)
- `/opsx:sync` merges deltas without archiving, so a long-running change or a parallel change can build on them. Deltas let "two changes … touch the same spec file without conflicting, as long as they modify different requirements" — [opsx.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/opsx.md); [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md)

Validation:

- `openspec validate [item] [--all|--changes|--specs|--archived] [--strict] [--json]` checks structure and checks "a change's MODIFIED requirements against the main specs they would replace". It warns on missing design sections (example: `design.md: missing "Technical Approach" section`).
- A change with zero spec deltas fails unless `.openspec.yaml` has `skip_specs: true` (refactors, tooling, docs).
- `--archived` only checks that every archived change has all `tasks.md` boxes ticked, which suits a pre-commit hook.

  [cli.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md)

Workflow ("actions, not phases"):

- The default "core" profile is `/opsx:explore`, `propose`, `apply`, `update`, `sync`, `archive`. The expanded profile adds `new`, `continue`, `ff`, `verify`, `bulk-archive` and `onboard`. "Every artifact … is just a Markdown file you can edit at any time … no locked planning phase, no approval gate." `tasks.md` is "a living checklist", and `/opsx:apply` resumes from the first unchecked task after a context reset — [faq.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/faq.md); [editing-changes.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/editing-changes.md)
- On drift: "at archive time, your specs become the truth of record. So before you archive, make the specs honest about what the code does." If the code is right, update the delta; if the spec is right, fix the code. `/opsx:verify` reports mismatches without blocking — [editing-changes.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/editing-changes.md)
- Brownfield: "You do not document your whole codebase to start. You write specs only for what you're about to change." `specs/` "starts nearly empty and accumulates" as changes archive — [existing-projects.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/existing-projects.md)
- Right-sizing: "A good change has one intent you can say in a sentence." Signs it is too big include "Reviewing it would take an afternoon, so nobody will" and "Half the tasks could ship on their own". Also, "a one-line typo fix doesn't need three requirements and a design doc" — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- Project context goes in `openspec/config.yaml` under `context:` and is injected into every planning request — [faq.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/faq.md)
- Practitioner and vendor comparisons rate OpenSpec the lowest-friction of the three. They report its proposals don't update themselves during implementation, and it has no multi-agent orchestration. One vendor benchmark (not independently verified) claims 42/50 merged tickets with OpenSpec against 36/50 for a no-spec control — [ianhxu-field-study](https://github.com/ianhxu/agentic-engineering-field-study/blob/main/04-spec-driven-development.md); [uvik benchmark](https://uvik.net/spec-driven-development-benchmark/)

### Inferences

- The blueprint's `design/` ≈ `openspec/specs/`, `prd/NNNN-<slug>/README.md` ≈ `proposal.md`, the PRD's design delta ≈ `changes/<name>/specs/`, `tasks/` ≈ `tasks.md`, and numbered decisions ≈ the decisions part of `design.md`. OpenSpec shows the model works without a database or index: plain folders plus a merge step.
- What makes OpenSpec's merge mechanical is not the CLI but the addressable unit. Each requirement is a heading with a stable name, and a delta targets headings. To let Claude apply design deltas reliably by hand, the developer only needs:
  1. Stable, unique headings in `design/` files.
  2. Delta sections named `ADDED`, `MODIFIED` and `REMOVED` that give the target file and heading.
  3. Full replacement text for MODIFIED, never a patch description.
  4. A one-line reason for REMOVED.

  Without stable headings, "merge the delta" becomes free-form rewriting and drifts.
- Deliberately skip:
  - The SHALL/Scenario rigidity in design docs, unless the area is behaviour-contract-like.
  - The schema graph, the `.openspec.yaml` flags, multi-store support and the telemetry-bearing CLI.

  A `skip_specs`-style front-matter flag (for example `design_delta: none`) is the only flag worth copying, so refactor PRDs don't look incomplete.
- OpenSpec separates spec (observable behaviour) from design (how). The developer's `design/` is described as a "current-state design", so it likely mixes both. OpenSpec's warning applies: implementation-level detail in the current-state tree goes stale fastest. Keep `design/` at the level of contracts, invariants and structure, and leave code-level detail to the code.
- The single most transferable rule is the archive-time invariant: before merging a delta into `design/`, reconcile it with what actually shipped. A "verify then merge" checklist item in the PRD template (or one sentence in CLAUDE.md) captures it with no tooling. `validate --archived` (every task box ticked before archive) can be a short grep in a pre-commit hook if wanted.
- Brownfield-first means not backfilling `design/` for the whole system. Let areas fill in as PRDs touch them.

### Gaps

- I did not read the exact RENAMED syntax (I believe it is `FROM:`/`TO:` header lines, but did not verify this in the current docs), nor the precise header-matching rules (case and whitespace normalisation) the validator uses.
- I did not read what `--strict` adds beyond the default validation.

## Tessl and other spec-as-source tools

### Takeaway

Tessl is the main "spec-as-source" bet: specs annotated with `@generate`, `@test` and similar, code stamped `// GENERATED FROM SPEC - DO NOT EDIT`, one spec per code file. Its framework entered closed beta in September 2025, and by mid-2026 commentators still call spec-as-source "mostly a thesis". The commercially live part is the Spec Registry, 10,000+ library usage specs for agents. Nothing here fits a solo markdown blueprint.

### Cited Findings

- Announced 2025-09-23. The Spec Registry (open beta) holds "over 10,000 pre-built specifications for open-source libraries" to curb API hallucination. The Tessl Framework (closed beta) has specs with a component description, capabilities with linked tests, and API definitions. Annotations are `@generate` (generate code), `@describe` (document existing code), `@test` (link tests) and `@use` (import other specs) — [tessl blog](https://tessl.io/blog/tessl-launches-spec-driven-framework-and-registry)
- Böckeler found the tool can reverse-engineer specs from code, and `tessl build` generates code. A spec typically maps to one code file. It has a `.tessl/framework` memory bank plus `KNOWLEDGE.md` and `AGENTS.md`. Tessl "explicitly aspires to spec-anchored and spec-as-source". She draws an uncomfortable parallel with model-driven development (MDD), which failed for business apps: spec-as-source risks combining "MDD's inflexibility with LLMs' non-determinism" — [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- A 2026 review says Tessl raised about $125M and that spec-as-source is "still mostly a thesis" as of mid-2026. This is a secondary source that sells a competing product — [codemyspec Tessl review](https://codemyspec.com/blog/tessl-review)
- Thoughtworks Radar placed "Spec-driven development" in **Assess**, naming Kiro, spec-kit and Tessl. It warns that "the workflows remain elaborate and opinionated", that tools generate "lengthy spec files that are hard to review", and that practitioners "may be relearning a bitter lesson—that handcrafting detailed rules for AI ultimately doesn't scale". The page reports Vol. 34, Nov 2025; a secondary study cites Vol. 33. The volume number is unconfirmed — [thoughtworks radar](https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development)
- Other names in the 2026 landscape include BMAD, GSD ("Get Shit Done", about 59,600 stars in five months per one study) and cc-sdd. Built-in plan modes in Claude Code, Cursor and Codex are described as the strongest adoption signal for lightweight spec-first work — [ianhxu-field-study](https://github.com/ianhxu/agentic-engineering-field-study/blob/main/04-spec-driven-development.md)

### Inferences

- Spec-as-source requires a generator and a spec-to-file mapping, and gives up hand-editing code. That runs against a hand-written Rust codebase with a pure-render architecture like herdsman's. Ignore it, except for the idea of a registry of library usage notes, which Claude Code skills and docs already cover.

### Gaps

- I did not verify Tessl's current product status (GA or still beta, pricing) on tessl.io itself. Registry search snippets mention third-party "spec-as-source" tiles with versions archived in 2026, but those appear to be community-published packages, not Tessl's own framework.

## Evidence from practitioners: what works and what fails

### Takeaway

Independent reports converge. Writing intent down before coding helps. But the tool-generated specs are too verbose, double the review burden (markdown and then code), are oversized for small changes, drift from the code, and do not stop agents ignoring instructions. The common advice is to match ceremony to problem size, keep the spec to one screen, and let tests, not prose, enforce the contract.

### Cited Findings

- Böckeler (martinfowler.com, 2025-10-15) defined three levels:
  - Spec-first: written before the task, then discarded.
  - Spec-anchored: kept after the task and evolved.
  - Spec-as-source: humans edit only specs.

  Her findings:
  - Spec Kit created "excessive markdown" that was tedious to review and often redundant with the code. She preferred reviewing code.
  - Kiro and Spec Kit were both oversized for small bugs and 3–5-point features, with no flexible sizing.
  - Agents ignored instructions anyway, for example generating duplicate classes despite research notes flagging the existing ones, while being "over-eager" elsewhere.
  - The split between functional and technical content is taught inconsistently.
  - SDD as a term suffers "semantic diffusion".

  [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- Colin Eberhardt (Scott Logic CTO, 2025-11-26) built a KartLog feature with Spec Kit:
  - Increment 1: 33m30 of agent time, 689 lines of code, 2,577 lines of markdown, 3.5 h of review.
  - Increment 2: 23m30, ~300 lines of code, 2,262 lines of markdown, ~2 h of review.
  - The same work done iteratively without Spec Kit: 8 min of agent time, ~1,000 lines of code, 24 min of review and testing.
  - An obvious bug (`circuitsData` not populated) still got through, and it was unclear whether the spec or the code was at fault.

  He concluded: "I'm not sure it is a practical approach … code is now cheap" — [scott logic](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html)
- François Zaninotto (Marmelab, 2025-11-12), "The Waterfall Strikes Back":
  - Developers "spend most of their time reading long Markdown files, hunting for basic mistakes hidden in overly verbose, expert-sounding prose".
  - A simple date-display feature produced "8 files and 1,300 lines of text".
  - An agent marked "verify implementation" done without writing the unit tests.
  - Agents "often miss existing functions that need updates".
  - Review happens twice, once for the spec and once for the code.

  He recommends lean, iterative "natural language development" — [marmelab](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)
- A 2026 field-study compilation (secondary, aggregating sources):
  - Failure modes: spec drift, verbosity, agent non-compliance, problem-size mismatch (one developer reported specs taking 50% of project time) and double review.
  - "The universal failure mode in negative reports is applying full SDD to work that needed a paragraph and a test."
  - Positive data: about 50% fewer generation errors with human-refined specs (Piskala, arXiv Feb 2026), and a Mercari internal claim of 150% speed over baseline (Dec 2025). I did not verify either at its primary source.
  - Emerging synthesis: "spec-defines-contract + tests-enforce-contract".

  [ianhxu-field-study](https://github.com/ianhxu/agentic-engineering-field-study/blob/main/04-spec-driven-development.md); [piskala arXiv](https://arxiv.org/html/2602.00180v1)
- Middle-ground advice in 2026 blogs: requirements for a single feature should "fit on one screen". A ten-page spec is either platform design or should be split — [utsabpant](https://utsabpant.com/blog/spec-driven-development-without-the-hype) (seen via search summary, not fetched)
- The tools now concede the point in their own docs. OpenSpec: "Match the ceremony to the stakes", "Most changes should stay in Lite mode". Kiro: Quick Spec with no approval gates. Spec Kit: bug-fix and assessment flows split from full SDD, plus `converge` to close gaps after implementation — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md); [kiro specs](https://kiro.dev/docs/specs/); [spec-kit README](https://github.com/github/spec-kit)

### Inferences

- The failures cluster in generated volume (the agent writes thousands of lines a human must review) and in duplication (spec restates code). A hand-curated blueprint with short PRDs avoids the first by construction. It avoids the second only if `design/` stays above code level.
- Agent non-compliance means the blueprint should not count on Claude reading and obeying every design file. Put the few load-bearing constraints in CLAUDE.md and the tests, and use design docs for orientation and review.
- The drift evidence argues for a single moment of reconciliation (merge-on-done) rather than continuous syncing, which is what OpenSpec does and what the blueprint already proposes.

### Gaps

- I found no controlled, independent study comparing these tools for solo developers. The quantitative evidence is single-developer anecdotes (Scott Logic, Marmelab) or vendor benchmarks.
- I did not fetch the ranthebuilder hands-on comparison or the Piskala paper directly.

## Ideas light enough to adopt without the tools, and what to avoid

### Takeaway

The blueprint already has OpenSpec's core architecture (current-truth tree plus change folders with deltas merged on completion). The best moves are to borrow OpenSpec's addressable-delta conventions and archive-time reconciliation, Kiro's requirement-tagged tasks and optional EARS phrasing, and Spec Kit's clarification markers and explicit persistence model. Skip the CLIs, gates, multi-file plans, generated volume and spec-as-source.

### Cited Findings

Lightweight practices the sources describe, each usable as plain markdown:

- Current truth separate from proposals; specs grow incrementally around changes instead of being backfilled — [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md); [existing-projects.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/existing-projects.md)
- Deltas as `ADDED`/`MODIFIED`/`REMOVED` sections. MODIFIED carries the full replacement text plus a "(Previously: …)" note; REMOVED carries a reason — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- Before archiving, reconcile the spec and the code; archived specs become the truth of record — [editing-changes.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/editing-changes.md)
- One intent per change; lite by default; a typo fix needs no spec — [writing-specs.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/writing-specs.md)
- Tasks are small, each states how it is verified, they are checked off as done, and the agent resumes from the first unchecked task — [concepts.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md); [faq.md](https://github.com/Fission-AI/OpenSpec/blob/main/docs/faq.md)
- Tasks cite the requirements they implement ("Requirements: 1.1, 2.3") — [feature specs](https://kiro.dev/docs/specs/feature-specs/)
- EARS sentence form "WHEN <trigger> [WHILE <state>] the system SHALL <response>" — [wikipedia EARS](https://en.wikipedia.org/wiki/Easy_Approach_to_Requirements_Syntax)
- Inline `[NEEDS CLARIFICATION: …]` markers, at most 3 — [specify.md](https://github.com/github/spec-kit/blob/main/templates/commands/specify.md)
- An explicitly chosen persistence model (flow-forward history vs living contract), written down — [spec-persistence.md](https://github.com/github/spec-kit/blob/main/docs/concepts/spec-persistence.md)
- Context files scoped by front-matter inclusion rules (always, file match, manual) — [kiro steering](https://kiro.dev/docs/steering/)

### Inferences

These are recommendations for the developer's blueprint, derived from the findings above.

Borrow:

1. **Addressable design docs.** Give each `design/<area>.md` stable `##`/`###` headings, one concept per heading, so a PRD delta can say "MODIFIED `design/terminal.md` § Resize policy" and include the full new section. This is the hand-run equivalent of OpenSpec's requirement-header matching, and it is what makes "merge the delta" a mechanical Claude task instead of a rewrite.
2. **Three delta verbs, nothing else.** Use `ADDED`, `MODIFIED` (full text plus "Previously: …") and `REMOVED` (plus a reason). RENAMED is optional; a REMOVED and ADDED pair works.
3. **Merge-on-done with reconciliation.** The PRD's last task is "reconcile the delta with what shipped, then merge into `design/`". After the merge, the PRD is history (flow-forward) and `design/` is the living truth. State this model once in the blueprint README, as Spec Kit recommends.
4. **Behaviour and contracts in `design/`, mechanics in code.** Apply OpenSpec's test: if it can change without changing externally visible behaviour or an invariant, it does not belong in `design/`.
5. **Progressive rigor.** A front-matter flag such as `design_delta: none` lets refactor or tooling PRDs skip the delta legitimately. Tiny fixes need no PRD. OpenSpec, Kiro's Quick Spec and every critic agree.
6. **Requirement tags on tasks.** Each `T01-*.md` names the PRD requirement or design heading it serves. This is Kiro-style traceability at zero cost.
7. **Optional EARS phrasing** for acceptance criteria in event-driven or stateful areas. Do not mandate it globally.
8. **`[NEEDS CLARIFICATION]` markers** in draft PRDs, capped, as a grep-able "not ready to implement" signal.
9. **Brownfield growth.** Create `design/` areas only when a PRD touches them.

Avoid:

1. Spec Kit's per-feature fan-out (`plan`, `research`, `data-model`, `quickstart`, `contracts`, checklists). It is the source of the 1,300–2,600-line markdown counts and multi-hour reviews.
2. Approval gates, constitution checks and mandatory phase sequences. They suit teams, not a solo developer iterating with Claude.
3. Agent-generated long specs that the developer must then review. Keep PRDs human-sized, about one screen for the requirements part.
4. Duplicating code-level detail in `design/`, which is the biggest drift source.
5. Tool lock-in and machinery: CLIs, schema graphs, preset layers, IDE-bound steering. Claude Code's CLAUDE.md, nested CLAUDE.md files, skills and hooks already cover Kiro's steering and hooks.
6. Spec-as-source and code generation.
7. One file per task. All three tools use a single `tasks.md` checklist. Separate `tasks/T01-*.md` files are worth it only when tasks carry substantial context; otherwise a checklist in the PRD README is simpler and matches the "resume from first unchecked task" pattern.
8. Trusting the spec as enforcement. Agents skip spec-mandated steps (Marmelab's unwritten unit tests), so load-bearing rules belong in tests and CLAUDE.md.

### Gaps

- No source evaluates per-task files against a single checklist. Recommendation 7 under Avoid is an inference from all three tools converging on one `tasks.md`.
- No source measures whether hand-run delta merges (without OpenSpec's CLI) stay reliable over many changes. The risk that Claude mis-merges a free-form delta is plausible but untested.
