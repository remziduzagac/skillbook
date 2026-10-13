# skillbook

Draft 1, 2026-10-10; its decisions agreed the same day. The design of skillbook, a public repository of the person's agent skills, used in every project. It combines the approach agreed in the design discussion (main skills that load their sub-skills only when needed; see [../notes/initial-design.md](../../initial-design.md)) with the method of mattpocock/skills, analysed in [../research/mattpocock-skills.md](../../../research/mattpocock-skills.md) (cited below as "the analysis", by section).

## What this is

skillbook (`remziduzagac/skillbook`, public, MIT) holds the skills the person uses across projects: blueprint and greenrepo first, then others such as markdown-style. Every project gets them without filling the agent's context.

- **For Claude Code and Codex.** Both read the same skill format and the same plugin manifest. The text stays harness-neutral, so other agents that read skills work too.
- **Few main skills, many sub-skills.** Each main skill is one registered skill; its procedures, references and templates are plain files inside its folder, read only when the work needs them.
- **Built by the method that writes good skills.** Matt Pocock's method (the analysis, section 1) is adopted where it is general, adapted where our design differs, and noted where it is specific to his situation.
- **Held to its own standards.** skillbook meets greenrepo for its scope and keeps its design in a public blueprint.

## How skills reach an agent

An agent never loads the whole set. It loads in three steps:

| Step | What is loaded | When | Cost |
| --- | --- | --- | --- |
| 1 | each main skill's name and description | always, every turn | context, permanently |
| 2 | the main skill's `SKILL.md` | when the skill is used | context, from then on |
| 3 | a sub-skill file, then possibly a deeper one | when the work reaches that branch | context, from then on |

Two budgets decide every choice below (the analysis, 1.2):

- **Context load:** what sits in the agent's window every turn. Only step 1 is permanent, so a description earns harder pruning than anything else.
- **Cognitive load:** what the person must remember: which skills exist and when to use each. Skills the person invokes by hand cost no context but cost memory.

Material behind a pointer escapes context load at the price of the pointer's own line. So the whole design is about writing pointers that fire reliably.

## Main skills and sub-skills

### A main skill

A main skill is a registered skill: a folder with `SKILL.md` and `agents/openai.yaml`.

- **Its description is the only always-loaded pointer for its whole subtree,** so it names every branch any of its sub-skills serves (the analysis, lesson 1).
- **Its `SKILL.md` is a router plus what every run needs:** what the skill is, the modes and where each leads, the rules every branch shares, and the steps every run takes. Everything only some runs need is a sub-skill.
- **Its modes are arguments.** `/blueprint consolidate` or `/greenrepo audit` goes straight to that sub-skill; without an argument, the skill picks the mode from the request, and asks when it is unclear.
- **Size:** about 50 to 120 lines. Matt's shipped `SKILL.md` files have a median of 71 (the analysis, 3.5).

### A sub-skill

A sub-skill is a plain markdown file in the main skill's folder. It is not registered and has no description: the pointer line in its parent is its only trigger.

- **The branching test decides what becomes one:** inline what every branch needs; move to a sub-skill what only some branches reach (the analysis, 1.3). Apply it again inside a sub-skill before splitting it further.
- **Its first line says what it is part of and what it assumes,** linking back: "Part of `[blueprint](SKILL.md)`; assumes the strands and rules defined there."
- **It ends on a completion criterion that says where control returns:** "Done when every change is applied; continue with step 5 of `[SKILL.md](SKILL.md)`." Without it, an agent may treat the end of the file as the end of the task.
- **Size:** about 30 to 120 lines. Matt's sub-files have a median of 46 (the analysis, 3.5).

### Pointers

The wording of a pointer decides whether the file is read (the analysis, 1.1). Every pointer to a sub-skill:

- **sits at the step that needs it,** and the important ones are repeated in a short "Sub-skills" list at the end of `SKILL.md`;
- **reads as an instruction:** a condition, then "read", then the link, then a colon and what is inside. "When the workstream is complete, read `[CONSOLIDATE.md](CONSOLIDATE.md)` and follow it: reconcile, apply, archive, review." The summary lets the agent judge whether the branch applies without opening the file;
- **uses the same leading word** as the file's name and title, so the trigger and the content share one term.

Sharpen a weak pointer before inlining its target; inline only if sharpening fails.

### Depth

- **Two levels by default:** `SKILL.md` points to a sub-skill, which may point to one more (a profile, a format). A third level only for rarely taken branches. Each level is one more pointer that must fire.
- **Files stay flat** in the skill folder. The only subfolders are `templates/`, `scripts/` and `agents/`.
- **Sub-skills link to siblings, never across skill folders.** Installers copy one skill folder at a time, and Codex drops symlinks, so a `../other-skill/` link breaks. Every file in a skill folder is a real file.

### Names

| Kind | Name | Example |
| --- | --- | --- |
| Procedure or reference the agent reads | `UPPERCASE.md`, a noun or verb | `CONSOLIDATE.md`, `RULES.md` |
| One of several alternative branches | `UPPERCASE.md` with a shared prefix | `PROFILE-RUST.md`, `PROFILE-GO.md` |
| A format the skill writes | `<ARTIFACT>-FORMAT.md` | `DECISION-FORMAT.md` |
| A template copied out as it is | lowercase, in `templates/`, named as its target | `templates/roadmap.md` |
| An executable | `scripts/<name>.sh` | `scripts/check-links.sh` |

Never name a file in a skill folder `SKILL.md`, `README.md`, `AGENTS.md` or `CLAUDE.md`. Codex registers every nested `SKILL.md` as a skill, and agents treat the nearest `AGENTS.md` or `CLAUDE.md` as instructions for files around it.

### Alternative branches

When a sub-skill has variants (one per stack, tracker or harness), each variant is its own file with the same section skeleton, so the parent can treat them alike (the analysis, 3.3). The parent names a default for an unclear case, and each variant opens with a guard: "If the project is not Rust, this is the wrong profile; go back to `[AUDIT.md](AUDIT.md)`."

### Paths

Each `SKILL.md` says once how paths resolve: links to sub-skills and templates resolve from the skill's folder; paths in the project resolve from the working directory. Matt added this after a skill wrote its files into its own folder (the analysis, 3.2).

### When a fresh context is needed

Reading a sub-skill inline keeps the main file short, but it is not a context boundary: everything read stays in the conversation (the analysis, 1.4). When a phase needs fresh eyes (a consolidation review, a code review), the main skill dispatches a subagent and gives it the sub-skill's path to read. blueprint's "a fresh agent reviews the consolidation" is exactly this.

## Who can invoke a skill

Each main skill is either model-invoked or user-invoked (the analysis, 2.1).

- **Model-invoked:** the agent can start it on its own, and other skills can call it. Its description is model-facing and always loaded. The test: could the agent usefully reach for it without being asked?
- **User-invoked:** `disable-model-invocation: true`, plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. Only the person can start it, by typing its name. It costs no context, but no other skill can call it, and the person must remember it exists.

**Descriptions** of model-invoked skills follow one shape: "What it is. Use when ..." with one trigger per branch, the leading word first, and nothing the body already says. Matt's range is 27 to 417 characters, median 156 (the analysis, 2.2). skillbook's budget: under 300 characters each, and the whole set under 1,500. Descriptions are quoted in YAML: Matt's unquoted colons once hid six skills from an installer.

**A router skill** (one user-invoked skill that names the others) is added only if user-invoked skills grow past what the person can remember. With a few model-invoked main skills, the descriptions are the router.

**A thin wrapper** gives a command name to a model-invoked skill: a user-invoked skill whose whole body is one call. It costs no context, so it is how a frequently typed mode can get its own short command if wanted.

## Skills calling skills

- **Between main skills, the call is explicit:** `Call the Skill tool with "markdown-style".` One call per skill, and only to model-invoked skills; for a user-invoked one, "tell the person to run `/name`" (the analysis, 2.6). Naming the tool is what makes the call happen; a passing mention of another skill often loads nothing.
- **Shared reference has one home.** When two main skills need the same material, it lives in one model-invoked main skill that the others call, never copied into both and never linked across folders (the analysis, 2.7). markdown-style is the first example: blueprint and greenrepo both write markdown.
- **Reading a file is not a skill call.** A one-line pointer to read a project file (a glossary, the blueprint's README) stays a plain pointer.

## Per-project configuration

Some skills need facts about the project they run in: where its blueprint is, and its greenrepo scope. Matt's pattern (the analysis, section 4), adapted:

- **Each main skill has a `SETUP.md` sub-skill** (`/blueprint setup`, `/greenrepo setup`) that explores the project, recommends answers, confirms them with the person, then writes.
- **Facts go into a short block in the project's steering file,** one line each with a pointer:

  ```markdown
  ## Skills

  - greenrepo: Shared, Users, Artifacts; Rust, Markdown.
  ```

  Skills read the block, which is always loaded, rather than guessing paths. The block is written to `AGENTS.md`; `CLAUDE.md` imports it with `@AGENTS.md`, so Claude Code and Codex read the same text.
- **Private facts never go into a public repository.** Where a private blueprint lives is recorded in the person's user-level instructions (dotfiles), as blueprint's "How agents find it" already says.
- **Hard and soft dependencies:** only a branch whose output would be wrong without a fact carries the line "This should have been provided; if not, tell the person to run `/<skill> setup`." That line sits in the sub-skill of that branch, not in `SKILL.md`, so other branches pay nothing. Everywhere else, missing facts are handled silently.

## Writing rules

The rules every skill file follows, from Matt's `writing-for-agents` (the analysis, section 1). They become a skillbook main skill of their own, `agent-writing`, model-invoked when skills, steering files or documents agents read are created or edited. It is the yardstick for every change to skillbook.

- **Steps and reference.** A file holds steps (what to do, in order) and reference (consulted on demand). Steps come first; reference that only some runs need moves to a sub-skill.
- **Co-location.** A concept's definition, rules and caveats sit under one heading, not scattered.
- **Every step ends on a completion criterion,** checkable and exhaustive: "Done when every rule in the scope has a result."
- **Leading words.** A short pretrained word that carries a whole behaviour (*grill*, *tracer bullet*), used the same way in the description, the pointer and the body. A repository glossary records them, with the synonyms to avoid.
- **Positive phrasing.** Say what to do; a prohibition makes the forbidden behaviour more present. A "never" stays only as a hard guardrail, paired with what to do instead.
- **Pruning.** One home for each fact. Do not restate what the environment shows (config files, `--help`); write down only what the agent cannot find by looking. An instruction the model follows anyway is a no-op: test it by running the skill, and delete the whole sentence that fails.
- **Harness-neutral text.** No harness tool names except the generic "Skill tool"; personal preferences go into the person's own steering files, not into skills.
- **Templates fenced in tags:** `<task-template>` ... `</task-template>`, so the agent knows where a template starts and ends.
- **Stable references.** No line numbers or file paths that go stale in documents meant to last.

This also answers part of blueprint's open question about writing guidelines: blueprint's per-document guidelines will follow these rules.

## Repository layout

```text
skillbook/
  README.md                     what it is, how to install, the skills by kind
  AGENTS.md                     the rules for changing skillbook
  CLAUDE.md                     one line: @AGENTS.md
  CHANGELOG.md
  LICENSE                       MIT
  CONTRIBUTING.md               includes the AI-contribution section
  SECURITY.md
  SCOPE.md                      what belongs in skillbook, and the bar for changes
  GLOSSARY.md                   the leading words, with synonyms to avoid
  .out-of-scope/                one file per rejected idea, with its reason
  blueprint/                    skillbook's own design, kept with its own blueprint skill
  docs/                         one page per main skill, for people
  .claude-plugin/
    plugin.json                 the shipped skills, listed explicitly
    marketplace.json            the repository as its own marketplace
  .github/
    ISSUE_TEMPLATE/
    workflows/                  ci.yml, release.yml
  scripts/
    link-skills.sh              symlink install for machines where skills are edited
  skills/                       shipped main skills
    blueprint/
    greenrepo/
    markdown-style/
    agent-writing/
  beta/                         skills being tried; never in the plugin
```

Why it differs from Matt's: he sorts many skills into category folders (`engineering/`, `productivity/`, and unshipped `misc/`, `in-progress/`). skillbook has a handful, so one shipped folder and one beta folder are enough. Keeping beta skills outside `skills/` also means pointing an installer at `skills/` can never ship them. His `.agents/` decision records live in skillbook's `blueprint/` instead.

### A main skill's folder, sketched

```text
skills/blueprint/
  SKILL.md                    what a blueprint is, finding it, the modes, shared rules, the never-do list
  agents/openai.yaml
  SETUP.md                    start a blueprint, or adopt an existing project
  DISCUSS.md                  record ideas, notes, research and decisions
  PLAN.md                     start workstreams, write tasks
  WORK.md                     pick up a task, keep code and blueprint in step
  CONSOLIDATE.md              complete and consolidate a workstream
  PARALLEL.md                 staged mode and pending files
  SYNC.md                     the sync pass
  HEALTH-CHECK.md
  PUBLISH.md
  STRANDS.md                  reference: what goes in each strand
  DECISION-FORMAT.md          and one format file per document kind
  templates/                  readme.md, roadmap.md, task.md, workstream-readme.md, ...

skills/greenrepo/
  SKILL.md                    the scope, the modes (setup, create, audit, close gaps, keep), how rules are read
  agents/openai.yaml
  SETUP.md
  CREATE.md
  AUDIT.md
  RULES.md                    the rule matrix
  COMMUNITY.md, DOCS.md, AGENT-FILES.md, QUALITY.md, CI.md, RELEASES.md, DEPENDENCIES.md, SETTINGS.md, UPKEEP.md
  PROFILE-TS.md, PROFILE-PYTHON.md, PROFILE-RUST.md, PROFILE-GO.md, PROFILE-BASH.md, PROFILE-MARKDOWN.md
  templates/                  workflows, SECURITY.md, issue forms, ...
```

An audit of a Rust repository reads `SKILL.md`, `AUDIT.md`, `RULES.md`, the parts it checks and `PROFILE-RUST.md`; the other five profiles are never loaded. The sub-file names above are a first sketch; the skills' contents are designed separately.

### Draft descriptions

```yaml
name: blueprint
description: "Blueprint, a project's design folder: ideas, decisions, requirements, design, workstreams, tasks.
  Use when a project has a blueprint, or to start one, record a discussion or decision, plan or consolidate a
  workstream, or sync the design with the code."
```

```yaml
name: greenrepo
description: "Greenrepo, the standard for a healthy repository. Use when creating a repository, auditing one, or
  setting up its CI, releases, security settings, community files or docs."
```

## Installing and updating

Two routes; each machine uses one, never both, or every skill appears twice.

- **The plugin, for use.** The repository is its own marketplace. Claude Code: `/plugin marketplace add remziduzagac/skillbook`, then install `skillbook`. Codex reads the same `.claude-plugin/` manifests (`codex plugin marketplace add remziduzagac/skillbook`). Installed users get a release when the `version` in `plugin.json` changes. Skills are namespaced, so on a name clash they are reached as `/skillbook:blueprint`.
- **Symlinks, for editing.** `scripts/link-skills.sh` links each skill folder, beta ones included, into `~/.claude/skills/` and `~/.agents/skills/`, so a change in the working copy takes effect at once; daily use is the test. The dotfiles run it on the machines where skills are edited.
- **Not now:** a listing in Claude Code's official marketplace, and skills.sh. Both can come once the set is stable.

## Maintaining skillbook

### Life of a skill

- **Beta:** a new skill starts in `beta/`, linked on the person's machines but not shipped.
- **Shipped:** moved to `skills/`, listed in `plugin.json` and the README, with a docs page.
- **Removed:** deleted; the changelog names its replacement; its docs page stays, marked archived.

Every new skill is permanent upkeep, so the bar is Matt's: a behaviour that can be composed from existing skills does not get a new one (the analysis, 5.9).

### On every change

`AGENTS.md` holds the checklist, kept short; writing advice lives in `agent-writing`, not in `AGENTS.md`:

1. Run `agent-writing` against the change.
2. Shipped skill added, renamed or removed: `plugin.json`, README and docs page follow.
3. Invocation changed: frontmatter and `agents/openai.yaml` change together.
4. Behaviour changed: the docs page is re-synced, and the commit message says what users notice.
5. `just check` passes.

### Releases

Commits follow Conventional Commits, which skillbook's other repositories already use. release-please keeps a release pull request open, bumps the version in `plugin.json` along with the changelog, and the person curates the changelog text in that pull request before merging. Merging tags the release, and the new `plugin.json` version reaches installed users.

Matt uses changesets with a script that copies the version into `plugin.json` (the analysis, 5.5). skillbook has no npm package and already writes Conventional Commits, so release-please does the same job with fewer parts.

### Checks

Matt's maintenance rules are mostly mechanical yet checked by hand, and an orphan sub-file and a YAML error both shipped (the analysis, 5.7). skillbook makes them checks, run by `just check` and in CI:

- markdownlint-cli2 on every markdown file;
- lychee `--offline` on every link, sub-skill links included;
- `claude plugin validate . --strict` on the manifests;
- zizmor and actionlint on the workflows;
- a short script for the rest:
  - every folder in `skills/` and `beta/` has a `SKILL.md` whose `name` matches the folder, with a quoted description within its budget;
  - frontmatter and `agents/openai.yaml` agree on invocation;
  - `plugin.json` lists exactly the folders in `skills/`;
  - apart from the top-level `SKILL.md`, no file in a skill folder is named `SKILL.md`, `README.md`, `AGENTS.md` or `CLAUDE.md`;
  - no symlinks inside skill folders;
  - every sub-skill file is linked from a file in its own skill, so none is invisible.

Skill behaviour itself is tested the only way it can be: by running the skill. Each docs page ends with "It's working if", the signs that the skill behaves as intended.

### Learning from other collections

When a skillbook skill maps to one in another collection, that skill is read before ours is written, and what fits is adopted with credit after a licence check; an outside skill that maps to none of ours is discussed with the person first (D30). The mappings live in the notes: [../notes/mattpocock-comparison.md](../../mattpocock-comparison.md) and the sources in [../notes/skillbook-tree.md](../../../ideas/skill-tree.md).

### Scope and rejected ideas

`SCOPE.md` states what belongs in skillbook and the bar for a change: an observed failure in a real session, not a hypothetical improvement. `.out-of-scope/` records each rejected idea once, with its reason, so a repeated request is answered with a link (the analysis, 5.8).

### Improving the skills from use

A later main skill, after Matt's `retro`: at the end of a session it reviews what went wrong and proposes changes to skills and steering files, always loading `agent-writing` as its yardstick.

## skillbook against greenrepo and blueprint

- **greenrepo, `Shared; Markdown, Bash`:** the core (README, licence, check command, hardened CI with one required aggregator check, releases with a changelog) and Shared's rules (SECURITY.md, private vulnerability reporting, issue forms, triage). Users is added at the first release; Contrib, with its code of conduct and AI policy, only if skillbook opens to contributions. Its profiles are Markdown and Bash, plus the check script.
- **blueprint, public:** skillbook's design lives in `blueprint/` in the repository: its requirements, the decisions behind this layout, and workstreams for new skills. It dogfoods both skills from the first commit.

## Decisions

Agreed on 2026-10-10:

1. **greenrepo is model-invoked,** so an agent can reach for it when setting up CI or a new repository.
2. **release-please,** not changesets.
3. **Two folders, `skills/` and `beta/`,** not category buckets.
4. **markdown-style moves in;** fork-code stays in herdsman; the synced Anthropic skills stay where they are.
5. **agent-writing is our own skill,** adapted from Matt's `writing-for-agents` with credit.
6. **skillbook's own blueprint is public,** in the repository.

## Open questions

- **Partial installation:** installing only some skills on a machine or for a project, for example blueprint without greenrepo. The plugin installs the whole set today. Options to weigh: several plugins in one marketplace (one per skill, or per group), a per-skill install through skills.sh, or a selection in the link script. Each must also handle a skill that calls another (markdown-style, agent-writing) when that one is not installed.
