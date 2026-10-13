# Agent planning and memory methods built on markdown

Scope: the BMAD Method, Agent OS (Builder Methods), Cline's Memory Bank, claude-task-master (Task Master AI) and Claude Code's own recommended practices, plus practitioner reports. All read as of 2026-10-07. Assessment is aimed at a solo developer with a plain-markdown "blueprint": a current-state `design/` tree of areas, PRDs as change proposals (`prd/NNNN-<slug>/README.md` with `tasks/T01-*.md`), numbered decisions, research and discussion notes and an agenda, YAML front matter, used by Claude Code through an `AGENTS.md` that points agents at it. Simplicity is the overriding constraint.

Version and activity figures marked "GitHub API" were read with `gh api` on 2026-10-07 from the repository and releases endpoints linked in each item.

## 1. BMAD Method: roles, documents, sharding, version and complexity

### Takeaway

BMAD is the heaviest of the five: a persona-and-workflow framework that began (v4, mid-2025) as an agile pipeline (analyst, PM, architect, PO, scrum master, dev, QA) producing a brief, PRD, architecture, sharded epics and stories. Through 2026 (v6.x) it has steadily cut itself down: personas merged, document sharding retired, generated project docs replaced by one block in `AGENTS.md`, and a "skip the PRD unless several people or epics must agree" rule. Its direction of travel is the strongest evidence for keeping a solo blueprint small.

### Cited Findings

#### Version and maturity

- Repository created 2025-04-13; about 53.9k stars; pushed 2026-10-07 (GitHub API) — [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD)
- v4.0.0 (June 20, 2025) "represented a complete architectural overhaul, transforming BMAD from a collection of prompts into a professional, distributable framework": npm install via `npx bmad-method install`, a hidden `.bmad-core` folder, YAML agent and team definitions; v4.31–v4.43 shipped August–September 2025 — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- v6 went through about 23 alphas and 8 betas; v6.0.0 ("V6 Stable Release! The End of Beta!") was published 2026-02-17 (GitHub API); latest is v6.12.1 (2026-10-04); the changelog's Unreleased section is "a first draft for v7" — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md); [releases](https://github.com/bmad-code-org/BMAD-METHOD/releases)
- Installation today is as skills: `npx skills add bmad-code-org/BMAD-METHOD`, or a Claude Code or Codex plugin; requires Node.js, npm, Git and `uv`; the ecosystem lists 6+ official modules (Method, Builder, Creative Intelligence Suite, Test Architect, Loop, Game Dev Studio) — [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD)
- v6.11.0 made `uv` with Python 3.11+ "a hard requirement for rendered skills" and moved config to layered TOML (`_bmad/config.toml` → `config.user.toml` → `custom/config.toml` → `custom/config.user.toml`) — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)

#### v4 roles, documents and workflow (the version most blog posts describe)

- Planning sequence: Analyst (optional brainstorming, market research, competitor analysis, then project brief) → PM creates the PRD from the brief → architecture → optional UX spec → PO runs a master checklist → "PO: Shard Documents"; standard paths `docs/prd.md` and `docs/architecture.md`, with sharded output under `docs/epics/` and `docs/stories/` — [v4 user guide (fork copy)](https://github.com/starktoony/BMAD-METHOD/blob/main/docs/user-guide.md)
- Development cycle: "SM: Reviews Previous Story Dev/QA Notes", "SM: Drafts Next Story from Sharded Epic + Architecture", then dev implements and QA reviews before the story is done; `devLoadAlwaysFiles` in `bmad-core/core-config.yaml` lists files the dev agent always loads — [v4 user guide (fork copy)](https://github.com/starktoony/BMAD-METHOD/blob/main/docs/user-guide.md)
- v4 recommended planning in a web UI for cost, then switching to the IDE, and told users to compact and "start a new conversation with the compacted conversation as the initial message. Do this often, preferably after each story is implemented." — [v4 user guide (fork copy)](https://github.com/starktoony/BMAD-METHOD/blob/main/docs/user-guide.md)

#### Document sharding: what it was for, and its retirement

- In v6.0.0, three workflows produced large documents (`create-prd`, `create-architecture`, `create-epics-and-stories`); an issue cites a real project with a "2000+ line architecture doc" and proposes suggesting `shard-doc` above roughly 500 lines. The consuming side had three loading strategies (FULL_LOAD, SELECTIVE_LOAD, INDEX_GUIDED) and "checks sharded folder FIRST, falls back to whole file". Issue opened 2026-02-12 — [issue #1641](https://github.com/bmad-code-org/BMAD-METHOD/issues/1641)
- v6.11.0 (2026-08-09): "`bmad-index-docs` and `bmad-shard-doc` ... Retired with no replacement ... The 'shard large documents' how-to is gone from all five locales." — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- Current docs set an input ceiling instead: "The practical ceiling is a few tens of thousands of tokens, roughly a 40-page document. Hand it a pile of raw documents several times that size and it silently loses the parts that mattered; condense them first." — [Choose a planning path](https://docs.bmad-method.org/plan/choose-a-planning-path/)

#### v6 simplification steps (chronological)

- v6.3.0 (2026-04-09): Barry (quick-flow solo dev), Quinn (QA) and Bob (Scrum Master) consolidated into the Developer agent (Amelia); the `spec-wip.md` singleton removed so quick-dev "writes directly to `spec-{slug}.md` with status field, enabling parallel sessions" — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- v6.8.0 (2026-05-25): new `bmad-spec` "distills any intent (brain dump, PRD, transcript, brief) into `SPEC.md` with a five-field kernel (Problem, Capabilities, Constraints, Non-goals, Success signal)", with an "Eight-rule Spec Law with lean-prose discipline"; catalogs, tables and diagrams go to named companion files; UX becomes `DESIGN.md` (visual) plus `EXPERIENCE.md` (behaviour) — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- v6.11.0 (2026-08-09): "The skill catalog gets a lot smaller. Core drops from fourteen skills to eight"; "Quick Dev becomes Build, the one official way BMad implements code"; `bmad-create-story`/`bmad-dev-story` deprecated; Phase 4 is `bmad-sprint-planning → bmad-build → bmad-code-review`; tech-writer persona retired; the release "deletes about 1,900 more lines than it adds" — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- v6.11.0: `bmad-project-context` replaces `bmad-document-project` and `bmad-generate-project-context`; "no generated overview, source-tree, or deep-dive pages and no `project-context.md`, just one verified block in `AGENTS.md`" — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- v6.11.0: sprint planning moved "epic parsing, status merging, and summary computation into a tested Python script"; a "Fix sprint status" action "rebuilds a broken or drifted file" — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- `stories.yaml` (planning-to-execution contract beside `SPEC.md`) is "an ordered sequence where list order is execution order, with `id`, `title`, `description`, `spec_checkpoint`, `done_checkpoint`, and `invoke_dev_with`, and deliberately no `status`"; story specs live under `{spec-folder}/stories/` — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- Unreleased (v7 draft): every document lands as `<type>-<slug>/<type>-<slug>.md`, inside `initiative-<slug>/` when an initiative is active; `planning_artifacts`/`implementation_artifacts` folders are no longer read; a ticket store is `tickets.toml` plus leaf files managed by `tickets.py`; web bundles removed — [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)

#### Current shape (docs site)

- 5 agents: Analyst (Mary), Product Manager (John), Architect (Winston), Developer (Amelia), UX Designer (Sally); 8 core skills and 15 workflow skills, 28 entries in all — [Skills and agents reference](https://docs.bmad-method.org/reference/skills-and-agents/)
- Planning paths: trivial work needs no BMad ("Change → Edit → Verify"); epic-sized work (roughly 2–20 sessions) goes Intent → Spec → Stories → Build per story → Integrate → Retrospective with `spec-<slug>.md` and `tickets.toml`; project-sized work (20+ sessions or multi-epic) adds a PRD, UX/architecture docs and one spec per epic — [Choose a planning path](https://docs.bmad-method.org/plan/choose-a-planning-path/)
- "You need a PRD when more than one person must agree on what the product is, or more than one epic must not diverge; otherwise skip it." Planning skills "are independent tools, not stages. Pick the ones the gap calls for, in any order." — [Choose a planning path](https://docs.bmad-method.org/plan/choose-a-planning-path/)
- The delivery loop is "Clarify, Plan, Build and verify, Learn and adjust"; "BMad adds a set of named commands, called skills, to AI coding tools." — [BMAD docs home](https://docs.bmad-method.org/)

### Inferences

- Sharding was a workaround for documents that grew too large (2000-line architecture docs). BMAD itself dropped the tooling and now condenses input instead. A blueprint that splits by area and by PRD from the start (one concern per file, "split when it grows") gets the benefit without a sharding step or index-guided loader.
- BMAD's own guidance ("skip the PRD unless more than one person or epic must agree") argues that a solo developer's PRD should be lightweight; the five-field `SPEC.md` kernel (Problem, Capabilities, Constraints, Non-goals, Success signal) is a good minimum for the PRD `README.md`, with the developer's "design delta" and links added on top.
- `stories.yaml` "deliberately no status" plus one status file maintained by a tested script matches the developer's rule that status lives in exactly one place, and that indexes are generated, not hand-edited. The existence of a "repair drifted sprint status" action shows that status files maintained by agents do drift.
- Replacing generated overview pages with "one verified block in `AGENTS.md`" suggests the design tree should not try to be a generated code map; it should hold intent and rationale that cannot be read off the code.
- Avoid: personas, multi-agent role hand-offs, web-UI planning bundles, TOML config layers and a Python runtime requirement. None of it serves one developer with one agent.

### Gaps

- The exact v4 sharding mechanics (for example splitting at level-2 headings into a folder with `index.md`) were not confirmed from a primary source; secondary write-ups describe sharding as splitting large PRDs into smaller pieces with an index, loaded as needed, but those pages were not opened.
- The original v4 user guide was read from a fork (`starktoony/BMAD-METHOD`), not the upstream v4 branch.
- No stated rationale was found for retiring `shard-doc` beyond its listing under "Removed" in v6.11.0.

## 2. Agent OS: layers, layout, commands and evolution

### Takeaway

Agent OS (Builder Methods) organises context in three layers: standards (how we code), product (mission, roadmap, tech stack) and specs (per-feature plans). It grew from v1 (July 2025) into a multi-agent spec/task/orchestration pipeline in v2 (October 2025), then in v3 (January 2026) cut back to standards discovery and injection, deferring spec writing and task breakdown to Claude Code's plan mode because "frontier models handle this well on their own now". It is the clearest case of a markdown method shrinking as the host agent improved.

### Cited Findings

#### What it is

- "a lightweight system for defining and managing your coding standards in AI-powered development"; layers are Standards, Product and Specs; v3 "discovers and documents those standards for you"; designed "primarily for Claude Code" but usable from any tool that reads markdown files — [Agent OS](https://buildermethods.com/agent-os)
- Repository created 2025-07-16; about 5.5k stars; latest release v3.0.0 (2026-01-20); last push 2026-08-29 (GitHub API) — [agent-os releases](https://github.com/buildermethods/agent-os/releases)

#### Evolution

- v1.0.0 (July 21, 2025): instruction files `plan-product.md`, `create-spec.md`, `execute-tasks.md`, `analyze-product.md`; standards tech-stack, code-style, best-practices; product docs mission, roadmap, decisions and tech-stack. v1.x added "lite" file versions for reduced AI context use and Claude Code subagents (test-runner, context-fetcher, git-workflow, file-creator) — [CHANGELOG](https://github.com/buildermethods/agent-os/blob/main/CHANGELOG.md)
- v2.0.0 (October 7, 2025): base install `~/.agent-os/` plus per-project `.agent-os/`; commands `plan-product`, `shape-spec`, `write-spec`, `create-tasks`, `implement-tasks`, `orchestrate-tasks`; a roles system (`implementers.yml`, `verifiers.yml`); three spec verification phases — [CHANGELOG](https://github.com/buildermethods/agent-os/blob/main/CHANGELOG.md)
- v2.1.0 (October 21, 2025), two weeks later: roles removed as "Too complex, and better handled with standard tooling", along with "verification documentation bloat", "documentation of every task implementation" and the specialised verifiers — [CHANGELOG](https://github.com/buildermethods/agent-os/blob/main/CHANGELOG.md)
- v3.0 (January 20, 2026) "Refocuses the framework on what it does best—establishing and injecting standards—while deferring to modern AI tools for the parts they now handle better", because "Claude Code's plan mode, extended thinking, and improved models now handle much of the scaffolding that earlier versions provided". Removed: the spec writing phase (deferred to plan mode), task breakdown orchestration, and implementation/orchestration phases ("frontier models handle this well on their own now"). Content formats kept: "Standards, specs, and product docs use the same format." — [CHANGELOG](https://github.com/buildermethods/agent-os/blob/main/CHANGELOG.md)

#### v3 layout and commands

- Five commands under `commands/agent-os/`: `discover-standards`, `index-standards`, `inject-standards`, `plan-product`, `shape-spec` — [commands folder](https://github.com/buildermethods/agent-os/tree/main/commands/agent-os)
- Standards: `agent-os/standards/<folder>/<standard>.md` plus `agent-os/standards/index.yml`; the index "enables `/inject-standards` to suggest relevant standards without reading all files. It maps each standard to a brief description"; keep descriptions to "one short sentence — they're for matching, not documentation" — [index-standards](https://github.com/buildermethods/agent-os/blob/main/commands/agent-os/index-standards.md)
- Injection adds `@agent-os/standards/...` references for the chosen standards, by folder, file or root — [inject-standards](https://github.com/buildermethods/agent-os/blob/main/commands/agent-os/inject-standards.md)
- Writing rules for standards: "Write concise standards — Use minimal words. Standards must be scannable by AI agents without bloating context windows"; "Every word costs tokens"; "One standard per concept"; "Bullet points over paragraphs"; process one standard at a time rather than batching questions — [discover-standards](https://github.com/buildermethods/agent-os/blob/main/commands/agent-os/discover-standards.md)
- Product: `/plan-product` writes `agent-os/product/mission.md`, `roadmap.md` and `tech-stack.md` through an interview — [plan-product](https://github.com/buildermethods/agent-os/blob/main/commands/agent-os/plan-product.md)
- Specs: `/shape-spec` "must be run in plan mode"; it reads product docs and `standards/index.yml`, then creates `agent-os/specs/YYYY-MM-DD-HHMM-{feature-slug}/` with `plan.md` (the full plan), `shape.md` (scope, decisions, context from the conversation), `standards.md` (which standards apply) and `references.md` (pointers to similar code), plus visuals if given — [shape-spec](https://github.com/buildermethods/agent-os/blob/main/commands/agent-os/shape-spec.md)

### Inferences

- The v2 → v2.1 → v3 arc is a direct lesson: role files, per-task implementation reports, verification documents and separate task-breakdown phases were added and then removed within months. A solo blueprint should not add those.
- What survived is useful and cheap: (a) short, single-concept standards; (b) a one-sentence-per-file index that lets the agent pick what to read without reading everything; (c) a per-change folder created in plan mode that records scope and decisions next to the plan. The developer's generated `README.md` indexes from front matter can play the role of `index.yml` if each document carries a one-line `summary` field.
- Agent OS has no current-state design layer: specs are dated, append-only folders, and "product" is only mission, roadmap and tech stack. The developer's `design/` tree (current state, updated when a PRD lands) goes beyond Agent OS, which is fine, but it is the part that will need the most discipline to keep current.

### Gaps

- The buildermethods.com page did not give the author or a full docs map; author attribution (commonly given as Brian Casel) was not verified in the sources read.
- No usage data or user reports on how well v3's plan-mode-based specs work were found.

## 3. Cline Memory Bank: core files, update rules, problem solved

### Takeaway

The Memory Bank is a custom-instruction convention, not a tool: six markdown files in `memory-bank/` that the agent must read in full at the start of every task, because "my memory resets completely between sessions". Its `activeContext.md` and `progress.md` are the parts that solve continuity; the always-read-everything rule is what costs tokens and relies on the agent's discipline.

### Cited Findings

- Six required files: `projectbrief.md` ("Foundation document with core requirements and goals"), `productContext.md` ("Why the project exists, problems it solves, UX goals"), `activeContext.md` ("Current focus, recent changes, next steps (updates most frequently)"), `systemPatterns.md` ("Architecture, design patterns, component relationships"), `techContext.md` ("Tech stack, setup, constraints, dependencies"), `progress.md` ("What works, what's left, known issues") — [Cline Memory Bank docs](https://docs.cline.bot/prompting/cline-memory-bank)
- Hierarchy: `projectbrief.md` feeds `productContext`, `systemPatterns` and `techContext`, which feed `activeContext` and `progress` — [Cline Memory Bank docs](https://docs.cline.bot/prompting/cline-memory-bank)
- Rules: Cline "MUST read ALL memory bank files at the start of EVERY task"; updates happen when discovering new patterns, after significant changes, on the user command "update memory bank" (which triggers "a full documentation review and update"), or when context needs clarifying; `activeContext.md` should be updated after each session — [Cline Memory Bank docs](https://docs.cline.bot/prompting/cline-memory-bank)
- Extra files are allowed in `memory-bank/` for "complex feature documentation, integration specifications, API documentation, testing strategies, deployment procedures" — [Cline Memory Bank docs](https://docs.cline.bot/prompting/cline-memory-bank)
- Practitioner (April 11, 2025): recording a removed UI column in the memory bank stopped the model from adding it back while fixing tests; "even cheaper AI models perform better" with it; but one model "skipped reading the memory bank" entirely, and success required "always reading from and always writing to your memory bank before and after each task" — [kangax: Memory bank and the many failures](https://kangax.substack.com/p/memory-bank-and-the-many-failures)
- Cline's own position on cost: "Memory Bank isn't about minimizing tokens -- it's about maximizing project efficiency. Yes, reading memory files costs tokens." — [Cline on X](https://x.com/cline/status/1900320075829436550)
- A user discussion on token consumption reports payloads of around 300,000 tokens after about five iterations even with Memory Bank (seen in a search snippet; the page was not opened) — [Cline discussion #2979](https://github.com/cline/cline/discussions/2979)

### Inferences

- The developer's agenda plays the role of `activeContext.md` + `progress.md`: one short "current focus, recent changes, next steps" file. That is the most valuable Memory Bank idea to borrow, and it should stay short enough to read at every session start.
- `projectbrief`/`productContext` map onto the idea document; `systemPatterns`/`techContext` map onto `design/`. These should not be read in full every session; the Claude Code docs and the ETH study (section 6) both argue for loading broad overviews only on demand.
- The "documented a removed feature so the agent would not reintroduce it" report is a concrete argument for the numbered decisions log: negative decisions ("we removed X because Y") are what agents cannot infer from code.
- Avoid: "read ALL files every task" and "update memory bank = full review". Both scale cost with doc size, and the update step depends on the agent remembering to do it.

### Gaps

- No measured comparison of Memory Bank against no Memory Bank was found; evidence is anecdotal.
- The current Cline docs page did not say whether Memory Bank is still the recommended approach versus newer Cline features (for example `.clinerules` or `/newtask`, which the page mentions only in passing).

## 4. claude-task-master: PRD parsing, task fields, complexity, tags, storage

### Takeaway

Task Master turns a PRD text file into one JSON task database (`.taskmaster/tasks/tasks.json`) with dependencies, statuses, subtasks and AI complexity scores, driven through a CLI or an MCP server. It moved away from per-task files (the `generate` command was deprecated in 0.34.0) and toward tagged lists inside the single JSON file. Its MCP tool set costs about 21k tokens by default, and its release activity stopped in spring 2026.

### Cited Findings

- Repository created 2025-03-04; about 28.2k stars; latest release `task-master-ai@0.43.1` on 2026-03-31; last push 2026-04-28 (GitHub API); licence "MIT License with Commons Clause" — [claude-task-master repo](https://github.com/eyaltoledano/claude-task-master); [releases](https://github.com/eyaltoledano/claude-task-master/releases)
- `parse-prd` reads `.taskmaster/docs/prd.txt` (or `scripts/prd.txt` in older projects) and writes `.taskmaster/tasks/tasks.json`; `.taskmaster/` also holds `config.json`, `reports/` and `templates/example_prd.txt` — [claude-task-master repo](https://github.com/eyaltoledano/claude-task-master)
- Task fields: `id`, `title`, `description`, `status`, `dependencies` ("IDs of tasks that must be completed before this task"), `priority`, `details` ("In-depth implementation instructions"), `testStrategy` ("Verification approach"), `subtasks`; subtasks carry `id` (unique within the parent), `title`, `description`, `status`, `dependencies`, `details` — [task structure doc](https://github.com/eyaltoledano/claude-task-master/blob/main/docs/task-structure.md)
- Status values: `pending`, `in-progress`, `done`, `review`, `deferred`, `cancelled` — [task structure doc](https://github.com/eyaltoledano/claude-task-master/blob/main/docs/task-structure.md)
- Complexity: `analyze-complexity` scores tasks 1–10 and gives a recommended number of subtasks and an AI-generated expansion prompt per task; `expand` decomposes tasks into subtasks — [task structure doc](https://github.com/eyaltoledano/claude-task-master/blob/main/docs/task-structure.md)
- Tagged lists arrived in 0.17.0 (2025-06-15): `{ "master": { "tasks": [...], "metadata": {...} }, "feature-xyz": {...} }`, "enabling parallel (agentic) development workflows", with automatic migration; later releases fixed "bulk update tag corruption in tagged task lists" — [CHANGELOG](https://github.com/eyaltoledano/claude-task-master/blob/main/CHANGELOG.md)
- Individual task files are "generated" from the JSON for reference; the `generate` command was "Deprecated" in 0.34.0 (2025-11-21); task files are excluded from git by default (`--no-git-tasks`) — [task structure doc](https://github.com/eyaltoledano/claude-task-master/blob/main/docs/task-structure.md); [CHANGELOG](https://github.com/eyaltoledano/claude-task-master/blob/main/CHANGELOG.md)
- MCP cost: 36 tools at about 21,000 tokens by default; `TASK_MASTER_TOOLS=core` loads 7 tools (about 5,000 tokens), `standard` 15 tools (about 10,000) — [claude-task-master repo](https://github.com/eyaltoledano/claude-task-master)

### Inferences

- Storage trade-off as these projects show it: JSON gives machine-checked fields (dependencies, status enum) and queries, and Anthropic found models less likely to rewrite JSON inappropriately (section 5); but it is unpleasant to read and review, needs a tool to edit safely, and a single shared file is a merge-conflict point across branches (Task Master answered with tags inside the same file, then had tag-corruption bugs). Markdown files with front matter are readable and diff well, but invite free-form edits.
- For one developer, the developer's design (task files with front matter, status in one place, generated `tasks/README.md`) already gets the useful part (a queryable status field) without JSON or a server. Task Master dropping per-task files suggests one file per task is not required either; a checklist table in the PRD that graduates to `tasks/` only when tasks need their own notes would be simpler still.
- Borrow: explicit `dependencies` and a verification field (`testStrategy`) per task; the developer's "done when" already covers the latter. Avoid: AI complexity scoring, automatic PRD-to-task parsing and an always-loaded MCP tool set, which costs context on every session.

### Gaps

- The changelog gives no rationale for deprecating `generate`.
- No primary source explains why releases stopped after March 2026 (project status unknown).
- No practitioner report directly compared tasks.json with per-task markdown files.

## 5. Claude Code's own recommended practices

### Takeaway

Anthropic's guidance is built around one constraint, "Claude's context window fills up fast, and performance degrades as it fills". It recommends a short, pruned `CLAUDE.md` (under 200 lines) holding only what Claude cannot infer; skills and path-scoped rules for knowledge needed sometimes; explore → plan → implement → commit with plan mode only when the diff is not one sentence; a self-contained spec written by interview and executed in a fresh session; and notes or progress files for long work. It warns against file-by-file codebase descriptions and frequently changing content in always-loaded files.

### Cited Findings

#### Context is the constraint

- "Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Context rot: "As the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases"; agents should keep "lightweight identifiers (file paths, stored queries, web links, etc.)" and load data just in time; Claude Code's hybrid: "CLAUDE.md files are naively dropped into context up front, while primitives like glob and grep allow it to navigate its environment and retrieve files just-in-time" — [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- Structured note-taking: "Like Claude Code creating a to-do list, or your custom agent maintaining a NOTES.md file"; sub-agents return a "condensed, distilled summary of its work (often 1,000-2,000 tokens)" — [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

#### CLAUDE.md scope, size and loading

- "keep it short and human-readable"; "For each line, ask: 'Would removing this cause Claude to make mistakes?' If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!" — [Best practices](https://code.claude.com/docs/en/best-practices)
- Include: commands Claude can't guess, non-default style rules, test instructions, repository etiquette, "Architectural decisions specific to your project", environment quirks, gotchas. Exclude: anything readable from code, standard conventions, "Detailed API documentation (link to docs instead)", "Information that changes frequently", "Long explanations or tutorials", "File-by-file descriptions of the codebase" — [Best practices](https://code.claude.com/docs/en/best-practices)
- "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence"; imports "help you organize a long file but don't reduce its context cost"; imports recurse up to "four hops"; multi-step procedures or knowledge for one part of the codebase belong in a skill or a path-scoped rule — [Memory docs](https://code.claude.com/docs/en/memory)
- Subdirectory `CLAUDE.md` files load on demand when Claude reads files there; `.claude/rules/*.md` with `paths:` front matter load only for matching files; block-level HTML comments in `CLAUDE.md` are stripped before injection — [Memory docs](https://code.claude.com/docs/en/memory)
- `AGENTS.md`: Claude Code (v2.1.277+) reads it when there is no `CLAUDE.md`/`CLAUDE.local.md` in the working directory or above; with a `CLAUDE.md`, use `@AGENTS.md`. "A `CLAUDE.md` that tells Claude in words to read `AGENTS.md`: Claude sees `AGENTS.md` only if it decides to open the file." — [Memory docs](https://code.claude.com/docs/en/memory)
- "CLAUDE.md content is delivered as a user message after the system prompt ... there's no guarantee of strict compliance"; anything that must always happen belongs in a hook; `/doctor prompt-audit` finds outdated or conflicting instructions and references to files that don't exist — [Memory docs](https://code.claude.com/docs/en/memory)
- Auto memory: the first 200 lines or 25KB of `MEMORY.md` load each session; topic files are read on demand — [Memory docs](https://code.claude.com/docs/en/memory)

#### Planning workflow and specs

- Four phases: Explore (plan mode) → Plan ("Create a plan"; `Ctrl+G` edits it) → Implement ("verifying against its plan") → Commit. "If you could describe the diff in one sentence, skip the plan." — [Best practices](https://code.claude.com/docs/en/best-practices)
- For larger features, have Claude interview you, "then write a complete spec to SPEC.md"; "Once the spec is complete, start a fresh session to execute it"; "The most useful specs are self-contained: they name the files and interfaces involved, state what is out of scope, and end with an end-to-end verification step that proves the feature works." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Adversarial review: "Use a subagent to review the rate limiter diff against PLAN.md. Check that every requirement is implemented, the listed edge cases have tests, and nothing outside the task's scope changed." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Skills: put "domain knowledge or workflows that are only relevant sometimes" in skills; "Claude loads them on demand without bloating every conversation"; `disable-model-invocation: true` for workflows to trigger manually — [Best practices](https://code.claude.com/docs/en/best-practices)
- Named failure patterns: the kitchen-sink session, correcting over and over, "The over-specified CLAUDE.md" ("Ruthlessly prune"), the trust-then-verify gap, "The infinite exploration" — [Best practices](https://code.claude.com/docs/en/best-practices)

#### Long-running work (engineering blog, November 26, 2025)

- Harness: an initializer agent writes a feature list (JSON, each item with a `passes` field), `claude-progress.txt` and `init.sh`; each later session reads the progress file and git log, then the feature list, then runs a basic end-to-end test before working on one feature — [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- "the model is less likely to inappropriately change or overwrite JSON files compared to Markdown files"; "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality"; observed failures: one-shotting, declaring victory early, leaving broken undocumented state — [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Inferences

- A sentence in `AGENTS.md` saying "read the blueprint" is advisory: Claude opens it only if it decides to. A small `@` import of one entry file (for example the blueprint's top `README.md` or agenda) makes it reliable, but imports cost context every session, so the imported file must stay tiny and link onward rather than inline content.
- The blueprint's design tree and PRDs fit the "just-in-time" model: the agent should get paths and one-line summaries up front and read the active PRD and touched design areas on demand. A PRD-workflow skill (create, update status, merge delta, regenerate indexes) keeps those procedures out of `AGENTS.md`.
- The developer's PRD is close to Anthropic's recommended `SPEC.md`: adding "files and interfaces involved", explicit "out of scope", and an end-to-end verification step would align it fully; the "fresh session per spec" advice matches "the PRD is the working reference".
- The agenda/progress note mirrors `claude-progress.txt`; git history is already a log, so the agenda need only carry current focus and next steps.

### Gaps

- The original April 2025 engineering post that named "explore, plan, code, commit" was not re-read; the current docs version (Explore, Plan, Implement, Commit) was used instead.
- No Anthropic guidance was found specifically on long-lived design documents (as opposed to CLAUDE.md, specs and progress notes), nor on whether an `@` import of a missing (git-ignored, absent) file fails silently.
- The publication date of the context-engineering post was not captured.

## 6. What practitioners report works or fails, and what to borrow or avoid

### Takeaway

The evidence converges: always-loaded context helps only when it is short and states non-obvious rules; repository overviews do not improve agent success and add cost; spec tools that emit many markdown files are tedious to review and over-process small changes; agents both ignore notes and drift status files; and every framework studied here has been removing structure through 2025–2026. For a solo blueprint: borrow a short agenda, a decisions log, per-change specs with verification, generated indexes and on-demand loading; avoid personas, mandatory read-everything rules, per-task report files, sharding tools and tool-heavy task servers.

### Cited Findings

#### Context size and overview documents

- ETH Zurich study (February 12, 2026): "providing context files does not generally improve task success rates, while increasing inference cost by over 20% on average", across LLMs, agents, and both LLM-generated and developer-committed files; "while instructions in the context files are well followed by coding agents, repository overviews, although popular and recommended by model providers, are not helpful"; context files "are useful for specifying non-standard coding practices" — [arXiv 2602.11988](https://arxiv.org/abs/2602.11988)
- Anthropic's exclusion list for `CLAUDE.md` matches this: no "File-by-file descriptions of the codebase", no "Information that changes frequently" — [Best practices](https://code.claude.com/docs/en/best-practices)

#### Doc sprawl and process weight

- Birgitta Böckeler (October 15, 2025) on Kiro, spec-kit and Tessl: three levels, "spec-first" (discarded after), "spec-anchored" (maintained alongside code) and "spec-as-source"; Kiro on a small bug was "Like using a sledgehammer to crack a nut", turning it into "4 user stories with a total of 16 acceptance criteria"; spec-kit creates "a LOT of markdown files" that are "very verbose and tedious to review": "I'd rather review code than all these markdown files" — [Böckeler, martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- Same article: each tool offers "one opinionated workflow", and "neither of them is suitable for the majority of real life coding problems"; she "frequently got confused when to stay on the functional level, and when it was time to add technical details" — [Böckeler, martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- Framework retreat, in their own words: Agent OS removed roles as "Too complex" and later spec writing and task orchestration because "frontier models handle this well on their own now" — [Agent OS CHANGELOG](https://github.com/buildermethods/agent-os/blob/main/CHANGELOG.md); BMAD cut core skills "from fourteen skills to eight", retired sharding, and replaced generated project docs with "one verified block in `AGENTS.md`" — [BMAD CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)

#### Keeping docs current, and agents updating docs

- Agents ignore notes: despite spec notes about existing classes, the agent "ignored the notes" and created duplicates — [Böckeler, martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html); a model "skipped reading the memory bank" — [kangax](https://kangax.substack.com/p/memory-bank-and-the-many-failures)
- Agents over-edit markdown: Anthropic chose JSON for the feature list because the model is "less likely to inappropriately change or overwrite JSON files compared to Markdown files" — [Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- Agent-maintained status drifts: BMAD added a repair path that "rebuilds a broken or drifted" sprint-status file and moved status computation into a tested script — [BMAD CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- Memory works when it records what code cannot show: a documented removal stopped an agent re-adding a UI column, but it needed "always reading from and always writing to your memory bank before and after each task" — [kangax](https://kangax.substack.com/p/memory-bank-and-the-many-failures)

#### One file per task versus one list

- Task Master: a single `tasks.json` with tags for parallel work; per-task files were generated views and their `generate` command was deprecated in 0.34.0 — [Task Master CHANGELOG](https://github.com/eyaltoledano/claude-task-master/blob/main/CHANGELOG.md)
- BMAD: an ordered `stories.yaml` list per spec (no status), one status file for the sprint, and a story spec file per story under the spec folder; it removed a `spec-wip.md` singleton in favour of `spec-{slug}.md` files to enable parallel sessions — [BMAD CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- Anthropic's harness: one feature list file with a `passes` flag per item, plus one progress file — [Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Inferences

Borrow, mapped to the developer's blueprint:

- **Agenda as the session entry point** (Memory Bank `activeContext`/`progress`, Anthropic's `claude-progress.txt`): one short file with current focus, open questions and next steps, the only blueprint file worth importing into every session, with everything else reached by link.
- **Decisions log, including negative decisions.** It is the content agents cannot infer and the ETH study says instructions about non-standard practice are what context files are good for.
- **PRD as a self-contained spec**: problem, capabilities, constraints, non-goals, success signal (BMAD kernel), plus files/interfaces, out of scope and an end-to-end verification step (Anthropic). Draft it in plan mode or by interview; implement in a fresh session; review the diff against it with a subagent.
- **Generated indexes from front matter**, never agent-written, with a one-sentence `summary` per document so an agent can choose what to open (Agent OS `index.yml`). Keep status in exactly one field (BMAD `stories.yaml` has "deliberately no status").
- **Procedures in a skill, not in `AGENTS.md`**: PRD create, status change, delta merge and index regeneration as an on-demand skill; `AGENTS.md` keeps only a pointer (preferably a tiny `@` import) and non-obvious rules.

Avoid or defer:

- Personas and role hand-offs (BMAD consolidated to five; Agent OS removed roles).
- "Read every memory file every task" and "update everything" commands (Memory Bank); load on demand instead.
- Repository-overview or file-by-file design pages, which the ETH study and Anthropic's docs both flag as unhelpful; the `design/` tree should record intent, contracts and rationale that the code does not show.
- Sharding and index-loading machinery; keep files small by construction (BMAD retired `shard-doc`).
- Per-task implementation reports and verification documents (removed in Agent OS v2.1).
- Always-on MCP task servers (Task Master default is about 21k tokens of tools).
- One task file per task by default. For one developer, a task table or checklist in the PRD `README.md`, split into `tasks/` only when a task needs its own notes or a tracker link, follows the developer's own "start as one file, become a folder when it grows" rule. This is an inference; no source measured the difference.

Keeping docs current:

- Treat the design-delta merge and agenda update as explicit steps in a PRD's "done when", performed by the agent but reviewed by the human in the same diff; do not rely on agents updating docs unprompted (kangax, Böckeler).
- Generate anything derivable (indexes, status tables) by script, so drift is mechanically repairable (BMAD).
- Periodically prune always-loaded files (Anthropic's `/doctor prompt-audit` finds references to missing files and contradictions).

### Gaps

- No controlled study was found comparing one-file-per-task against single task lists for agents; the evidence is design choices by tool authors.
- Secondary coverage of the ETH study reports developer-written files at about +4% and LLM-generated at about −3% success; those split figures were not verified against the paper body (the abstract says context files do "not generally improve" success).
- No practitioner report specifically evaluated a long-lived current-state design tree maintained alongside PRDs; Böckeler notes the "spec-anchored" level is rarely achieved by current tools, which is the level the blueprint aims for.
