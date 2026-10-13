---
status: current
created: "2026-10-10"
---

# mattpocock/skills: methodology analysis for skillbook

Source: `https://github.com/mattpocock/skills`, shallow clone of commit `49dd158` (2026-10-09), plugin version 1.3.1. Repo created 2026-02-03; about 283k stars and 24k forks at the time of reading. Every path below is relative to the repo root; `file:N` means line N of that file. Quotes are verbatim.

Each finding carries a **Scope** note: *general* (transfers to any skills repo) or *specific* (tied to this repo's situation: a large public audience, an issue-tracker-centred engineering flow, the author's site).

## 0. The repo at a glance

```text
skills/
  engineering/<skill>/SKILL.md (+ siblings, agents/openai.yaml)   20 skills, promoted
  productivity/<skill>/...                                         7 skills, promoted
  in-progress/<skill>/...                                          7 skills, beta, not shipped in the plugin
  misc/<skill>/...                                                 4 skills, frozen
  deprecated/README.md                                             empty bucket
docs/engineering/*.md, docs/productivity/*.md   one human-facing page per promoted skill (published elsewhere)
docs/agents/triage-labels.md                    the repo's own setup output (dogfooding)
.agents/                                        maintainer reference: adr/, invocation.md, install-block.md,
                                                writing-docs.md
.claude-plugin/plugin.json, marketplace.json    packaging
.changeset/                                     pending release notes, one file per change
.out-of-scope/                                  one file per rejected concept
CLAUDE.md (AGENTS.md is a symlink to it), README.md, SCOPE.md, GLOSSARY.md, CHANGELOG.md
scripts/link-skills.sh, list-skills.sh, sync-plugin-version.mjs
.github/workflows/release.yml, triage-label.yml, needs-info.yml; .github/ISSUE_TEMPLATE/
```

How the method evolved, from `CHANGELOG.md` (dates from the GitHub releases):

- **1.0.0 (2026-06-17)**: the taxonomy changed from "Commands / Skills" to **user-invoked / model-invoked**. Shared vocabulary that lived inside one skill (`improve-codebase-architecture/LANGUAGE.md`) was extracted into model-invoked reference skills (`codebase-design`, `domain-modeling`). `grilling` was exposed as a reusable model-invoked primitive. `write-a-skill` was replaced by `writing-great-skills`. The `ask-matt` router was added.
- **1.1.0 (2026-07-08)**: a rule was added to `CLAUDE.md` to re-check the router on every skill change. Overlapping planning skills were merged (`to-plan` plus `to-issues` became `to-tickets`). `tdd` was cut to reference-only because "the red → green → refactor loop is anchored by leading words the model already holds, so the step-by-step Workflow was largely restating the loop". Negation and Negative Space were added to the writing guide.
- **1.2.0 (2026-08-05)**: Codex metadata (`agents/openai.yaml`) for every skill and an `AGENTS.md` symlink. The Claude Code plugin shipped and was accepted into the official marketplace. `writing-great-skills` was renamed `writing-for-agents`, generalised to any agent-facing document, made model-invoked, and its skill-only mechanics were disclosed into `SKILL-MECHANICS.md`. Six skills and the `personal/` bucket were removed.
- **1.2.2 and 1.2.3**: fixes for Codex invocation, and Claude-Code-specific tool names were removed from subagent instructions "so the step is followable on Codex and other harnesses".
- **1.3.0 (2026-10-04)**: three skills graduated from `in-progress/`, one skill was removed (its docs page archived), `CONTEXT.md` was renamed to `GLOSSARY.md`, all em-dashes were removed, and cross-skill calls were standardised on "Call the Skill tool with ...", with a carve-out for user-invoked skills.
- **Pending**: 16 patch changesets, mostly bug fixes traced to issue numbers.

The direction across these releases is consistent: fewer and shorter skills, shared material moved into one place, harness-neutral text, and maintenance rules written down in `CLAUDE.md` as soon as drift was observed.

## 1. Writing skills

The writing method lives in `skills/productivity/writing-for-agents/SKILL.md` (81 lines) and its one sibling, `SKILL-MECHANICS.md` (22 lines). Its first claim is that skills are not special:

> "Reference for writing any document an agent consumes: a skill, an `AGENTS.md` / `CLAUDE.md`, a doc reached by a pointer. The packaging differs; the writing does not: the same levers make each one predictable, since the agent takes the same _process_ every run rather than producing the same output." (`SKILL.md:6`)

The skill-only part is reached through a conditional pointer at the top: "When the document you're writing is a skill, read `[SKILL-MECHANICS.md](SKILL-MECHANICS.md)` for frontmatter, invocation choice, and router skills." (`SKILL.md:8`). The skill uses its own disclosure rule on itself.

### 1.1 Context pointers

What: a **context pointer** is "a reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. A skill's description is one; a line in `AGENTS.md` naming a doc is the same object." (`SKILL.md:12`)

Why the wording matters more than the target:

> "The pointer's _wording_, not its target, decides when the agent reaches the material, and how reliably. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, and inline the material only if sharpening fails." (`SKILL.md:12`)

A pointer states what the material is and lists the **branches** that should trigger it. "Every word of an always-loaded pointer costs on every turn, so it earns even harder pruning than the body" (`SKILL.md:14`). Three rules follow (`SKILL.md:16-18`):

- "Front-load the leading word": the pointer is where it does its triggering work.
- "One trigger per branch." Synonyms that rename one branch are collapsed into one trigger.
- "Cut identity the body already carries."

Examples: the `wizard` description lists four trigger branches plus one explicit non-trigger ("Don't invoke this for steps the agent can perform itself"). `writing-for-agents` itself is 103 characters: "Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md."

Scope: general. For skillbook this is the central rule, because a sub-skill's only trigger is the line in its parent that points at it.

### 1.2 The two loads

What: every document spends one of two budgets (`SKILL.md:22-27`):

- **Context load**: "the cost of always-loaded material on the agent's window: an `AGENTS.md` line, a skill description, anything sitting in context every turn, spending tokens and attention whether or not it fires."
- **Cognitive load**: "the cost on the human: which documents exist and when to reach for each. The human is the index. Not a cost to minimise: it is the price of human agency; spend it where human judgement matters, remove it where it does not."

"Material reached only through a pointer escapes context load at the price of the pointer's own line; material with no pointer at all rides entirely on cognitive load." (`SKILL.md:27`) The docs page sums it up: "Once you think in these two loads, most authoring decisions (split or don't, inline or disclose, point or push) become the same trade made in different places." (`docs/productivity/writing-for-agents.md:22`)

Scope: general.

### 1.3 Information hierarchy, progressive disclosure, co-location, sprawl

What: a document holds **steps** (ordered actions) and **reference** (definitions, rules, facts consulted on demand). Each piece sits on a ladder ranked by how immediately the agent needs it (`SKILL.md:31-35`):

1. **In-file step**: the primary tier.
2. **In-file reference**: consulted on demand; "Often a legitimately flat peer-set (every rule of a review on one rung), which is a fine arrangement, not a smell."
3. **Disclosed reference**: "pushed out into a separate file, reached by a context pointer, loaded only when the pointer fires. Spans a sibling file in the same folder through fully external reference that lives anywhere and any document can point at."

"Push too little down and the top bloats; push too much and you hide material the agent actually needs. That tension is the whole decision." (`SKILL.md:37`)

**Progressive disclosure** is the move down the ladder:

> "Not primarily a token optimisation: it is how the hierarchy is protected. Branching is the cleanest disclosure test: inline what every branch needs, and push behind a pointer what only some branches reach. When a document has steps, in-file reference that should be disclosed buries them and turns attending to them into a coin-flip: a variance lever, not just a legibility one." (`SKILL.md:39`)

**Co-location** decides what sits beside a piece once its rung is chosen: "Keep a concept's definition, rules, and caveats under one heading rather than scattered ... The test: the document should read like documentation written for the agent." It is distinct from duplication: "that repeats one meaning in two places; scattering fragments one meaning across many." (`SKILL.md:41`)

**Sprawl** is the failure mode: "a document simply too long, even when every line is live and unique. Attention thins across the excess ... The cure is the ladder: disclose reference behind pointers, and split by branch or sequence so each path carries only what it needs." (`SKILL.md:43`)

Examples in the repo:

- `prototype/SKILL.md` (26 lines) holds only the branch decision and the rules shared by both branches. Each branch lives in its own file (`LOGIC.md`, `UI.md`).
- `codebase-design/SKILL.md` keeps the glossary and principles inline (every caller needs them) and discloses the two procedures only some callers need under "## Going deeper".
- `code-review/SKILL.md` keeps its 12-item smell baseline inline as flat reference, because every review applies every rule.

Scope: general. The branching test is the rule skillbook needs for deciding what becomes a sub-skill.

### 1.4 Steps and completion criteria

What: "Every step ends on a **completion criterion**, the condition that tells the agent the work is done." (`SKILL.md:47`). Two properties make it a lever:

- **Clarity**: a vague bound "invites **premature completion**: ending the step before it is genuinely done, attention slipping to _being done_. The visible steps still ahead (the **post-completion steps**) supply the pull; the criterion's clarity is the resistance." The defence order is "**sharpen the bound first** (local and cheap); only if it is irreducibly fuzzy _and_ you observe the rush, hide the later steps by splitting the sequence." And: "Hiding only works across a real context boundary (a hand-off or a subagent dispatch; an inline call leaves the later steps in context and clears nothing)." (`SKILL.md:49`)
- **Demand**: "'Every modified model accounted for' forces thorough work where 'produce a change list' does not." Demand drives **legwork** and "is not step-bound: 'every rule applied' binds a body of flat reference just as 'every step done' binds a sequence". (`SKILL.md:50`)

"The strongest criteria are both checkable and exhaustive." (`SKILL.md:52`)

Examples:

- `diagnosing-bugs/SKILL.md:57-66` has a "Completion criterion: a tight loop that goes red" with four checkbox conditions and a hard gate: "No red-capable command, no Phase 2."
- `wizard/SKILL.md:25,31` ends steps with "**Done when:** every stage traces to concrete instructions a stranger could follow."
- `grilling/SKILL.md:30`: "The session is done when the frontier is empty ... Do not act on it until the user confirms you have reached a shared understanding."
- `to-questionnaire/SKILL.md:12-16` ends each numbered step with a "Done when ..." sentence.

Scope: general.

### 1.5 When to split

"Splitting one document into two spends one of the two loads, so split only when the cut earns it" (`SKILL.md:56`):

- **By sequence**: "split a run of steps where the post-completion steps tempt the agent to rush the one in front of it ... Beware the reverse: merging sequences exposes each step's later steps to what follows, inviting premature completion."
- **By invocation** (skill-specific, `SKILL-MECHANICS.md:16-18`): "split off a model-invoked skill when you have a distinct leading word that should trigger it on its own (a trigger word you actually use in your prompts), or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it."

Scope: general. Note the consequence for skillbook in section 8: loading a sub-file inline is *not* a context boundary, so it does not help against premature completion.

### 1.6 Leading words and negation

A **leading word** is "a compact concept already living in the model's pretraining that the agent thinks with while running the document (_lesson_, _fog of war_, _tracer bullets_). Repeated as a token, never as a sentence, it accumulates a distributed definition and anchors a whole region of behaviour in the fewest tokens". (`SKILL.md:63`) A coined word works only if defined, and "a made-up word recruits no priors: you pay in definition tokens what a pretrained word gives free; reach for an existing word first."

It anchors twice: in the body (execution) and in the pointer (invocation): "when the same word lives in your prompts, your docs, and your codebase, the agent links that shared language to the material and reaches it more reliably." (`SKILL.md:65`) Worked examples: "fast, deterministic, low-overhead" → _tight_; "a loop you believe in" → _red_ (`SKILL.md:69-70`).

Leading words in the repo: _grill_/_relentless_ (grilling), _round_ (grilling), _frontier_ (grilling, implement-spec, wayfinder, to-tickets), _tracer bullet_ (to-tickets), _seam_ and _deep module_ (tdd, codebase-design), _fog of war_ and _destination_ (wayfinder), _red_ and _tight_ (diagnosing-bugs), _throwaway_ and _primary source_ (prototype). `wait-what` is the extreme case: the whole skill is one leading word. Its changelog entry explains: "Concision skills fail by growing ... Names that describe the _output_ (`/tldr`, `/no-fluff`) make the model clip words and lose you further; naming the _listener's_ state asks for both halves at once" (`CHANGELOG.md`, 1.2.0).

**Negation** is the failure mode next to this lever: "steering by prohibition drags the forbidden behaviour into context and makes it _more_ available, not less ... Prompt the **positive** ... A prohibition earns its place only as a hard guardrail you cannot phrase positively; even then, pair it with the positive target". (`SKILL.md:74`)

Scope: general. The repo does not apply this everywhere: older skills still say "Do NOT interview the user" (`to-spec/SKILL.md:7`), "Do NOT include specific file paths" (`to-spec/SKILL.md:55`) and "Do NOT close or modify any parent issue" (`to-tickets/SKILL.md:67`).

### 1.7 Pruning

Four rules (`SKILL.md:78-81`):

- **Single source of truth**: "one authoritative place, so changing the behaviour is a one-place edit. **Duplication** ... costs maintenance and tokens, and inflates a meaning's prominence on the ladder past its real rank."
- **Cache**: "The **environment** is a source of truth too (`package.json` scripts, config files, the directory layout, `--help` output), and a document that restates it is a **cache** ... Cache what the agent cannot find by looking: the unwritten convention, the reason behind a choice, the gotcha no config confesses."
- **Relevance**: a line loses relevance by never bearing on the task or by going stale. "Without a pruning discipline the default fate is **sediment**: stale layers that settle because adding feels safe and removing feels risky".
- **No-ops**: "an instruction the model already obeys by default pays load to say nothing. The test ... is model-relative, not reader-relative ... settle it by running the document, not by debate. When a sentence fails, delete the whole sentence rather than trim words from it." A word too weak to beat the default is also a no-op: "the fix is a stronger word (_relentless_), not a different technique."

The docs page adds: "Agents told to 'streamline' optimise for length, because length is the thing they can see. The no-op test checks behaviour, not style" and "There is no automated eval. You check by running the document by hand" (`docs/productivity/writing-for-agents.md:44,47`). Its "It's working if" list includes "The document gets shorter as it gets better" and "Nothing is stated twice, in any form. Duplication is the most reliable sign a document was never tested."

The author prunes his own guide: Negative Space, added in 1.1.0, no longer appears in the current `writing-for-agents/SKILL.md`. The 1.2.0 rename merged the skill's separate `GLOSSARY.md` into `SKILL.md` ("one authoritative treatment per term").

Scope: general.

### 1.8 Skill mechanics (`SKILL-MECHANICS.md`)

- **Model-invoked**: keeps a model-facing `description`, so the agent and other skills can reach it. "The description is the skill's top-level context pointer, forced to stay loaded at all times: permanent context load in exchange for discoverability. A model-invoked skill whose content is all reference is also one home for shared reference" (`SKILL-MECHANICS.md:9`).
- **User-invoked**: `disable-model-invocation: true`. "Zero context load, but it spends cognitive load: you are the index that must remember it exists." The description becomes "human-facing: a one-line summary, trigger lists stripped." (`SKILL-MECHANICS.md:10`)
- The rule: "Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and pay no context load." (`SKILL-MECHANICS.md:12`)
- "Shared reference that two user-invoked skills both need can live in neither: with no descriptions, neither can fire the other. Push it to a plain file outside the skill system: external reference any skill can point at." (`SKILL-MECHANICS.md:14`)
- **Router skills**: "When user-invoked skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill** ... It can only hint, never fire them" (`SKILL-MECHANICS.md:22`).

Scope: general, though the user-invoked side is tied to harness behaviour (Claude Code's `disable-model-invocation`, Codex's `allow_implicit_invocation`).

### 1.9 Other writing rules in the repo

- **No em-dashes** anywhere in prose: "Where a sentence reaches for one, rewrite it instead with a comma, colon, period, parentheses, or a conjunction, whichever the sentence actually wants; never do a blind character substitution." (`CLAUDE.md`, last paragraph). Today the only file with em-dashes is `CHANGELOG.md` (68 lines, all in historic entries). The sweep had a side effect: an unquoted colon-space left in six `description` values made the YAML invalid and `skills.sh` skipped those skills (`CHANGELOG.md` 1.3.0, #911). Scope: specific (house style), but the YAML lesson is general.
- **A glossary for the repo itself**: `GLOSSARY.md` defines _Issue tracker_, _Issue_, _Decision ticket_, _Triage role_ with `_Avoid_:` synonym lists and a "Flagged ambiguities" section. It uses the same format the `domain-modeling` skill writes into user repos (`domain-modeling/GLOSSARY-FORMAT.md`). Scope: general.
- **Harness-neutral text**: grilling asks questions as plain chat, not through a harness question tool, because "The skills are harness-neutral text. They run in Claude Code, Codex, Copilot, Cursor and anything else skills.sh installs into" (`.out-of-scope/native-question-tool.md`). Release 1.2.3 removed Claude Code tool and agent-type names from subagent steps. Scope: general for a cross-harness set.
- **Opinionated, no per-user config**: preferences go in the user's own `CLAUDE.md`. The documented opt-out for one-question-at-a-time grilling is a single line there (`docs/productivity/grilling.md`). Scope: general.
- **Templates fenced in XML-style tags**: `<spec-template>`, `<vertical-slice-rules>`, `<local-ticket-template>`, `<issue-template>`, `<questionnaire-template>`, `<page-template>`, `<canonical-block name="...">`. The three `in-progress/writing-*` skills split their body into `<what-to-do>` (steps) and `<supporting-info>` (reference), which matches the steps/reference split in section 1.3. Scope: general.
- **Paths that are stable over time**: specs and briefs avoid file paths and line numbers because "they go stale" (`to-spec/SKILL.md:55`, `triage/AGENT-BRIEF.md` "Durability over precision"). Scope: general.
- **Docs pages never name the author** and state claims plainly (`.agents/writing-docs.md`, Conventions). Scope: specific to a public set with a well-known author.

### 1.10 How consistently the rules are applied

The method is the target, not a description of every file:

- Negation survives in older skills (section 1.6).
- `teach/GLOSSARY-FORMAT.md` (35 lines) is an orphan: no file points at it. Disclosed reference without a pointer is invisible to the agent.
- Cross-skill call wording varies in quoting: `"tdd"` in `implement`, `` `tdd` `` in `implement-spec` and `retro`.
- The in-progress `loop-me` still says "Run a stateful `/grilling` session" instead of naming the Skill tool.
- ADR 0001 lists three hard-dependency skills; six skills now carry the hard pointer (section 2.8).

None of these is caught by tooling: the repo has no lint for SKILL.md content, links or frontmatter.

## 2. Introducing skills to agents cheaply

### 2.1 Model-invoked versus user-invoked

`.agents/invocation.md` defines the one axis that splits the set:

> "**User-invoked**: reachable **only by the human typing its name**. Set `disable-model-invocation: true` in the frontmatter (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex). The `description` is **human-facing** ... Strip trigger lists" (`.agents/invocation.md:5`)
>
> "**Model-invoked**: reachable by **model or user** ... The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_ (Reuse is the reason to extract a skill, not the test.)" (`.agents/invocation.md:6`)

The README puts the roles in one sentence: user-invoked skills' "job is to orchestrate"; model-invoked skills "hold the reusable discipline. A user-invoked skill may invoke model-invoked skills, but never another user-invoked one." (`README.md`, Reference)

| Bucket | Model-invoked | User-invoked |
| --- | --- | --- |
| engineering (promoted) | 9 | 11 |
| productivity (promoted) | 2 | 5 |
| in-progress | 0 | 7 |
| misc | 4 | 0 |
| **all 38** | **15** | **23** |

In the promoted set, 16 of 27 skills are user-invoked. The flows (`grill-with-docs`, `to-spec`, `to-tickets`, `implement`, `wayfinder`, `triage`, `retro`) are user-invoked orchestrators. The disciplines they call (`grilling`, `domain-modeling`, `codebase-design`, `tdd`, `code-review`, `research`, `prototype`) are model-invoked.

Known costs of the user-invoked choice, documented by the repo itself:

- Harnesses drop user-invoked skills from the skill list they inject. The agent "reads that list as exhaustive and reports them missing. In one reported session, it declared the whole spec-and-tickets flow absent" (`docs/engineering/ask-matt.md`, Common questions).
- Issue #693 "drops user-invoked skills from the listing on Claude's desktop and web surfaces". That was one stated reason for making `wizard` model-invoked (`CHANGELOG.md` 1.2.0).
- Codex's `allow_implicit_invocation: false` removed `writing-for-agents` from the model-visible list, so "its description could not trigger it" until the policy was dropped (`CHANGELOG.md` 1.2.2).

Scope: general principle; the harness behaviours are facts about Claude Code and Codex as of 2026.

### 2.2 Description style and length

Two styles, applied without exception:

- **Model-invoked** (15 of 15 contain "Use when"): `<what it is>. Use when <branch triggers>.` Examples: `tdd`: "Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions \"red-green-refactor\", or wants integration tests." `diagnosing-bugs` quotes trigger phrases: "Use when the user says \"diagnose\"/\"debug this\", or reports something broken/throwing/failing/slow."
- **User-invoked** (0 of 23 contain "Use when"): a one-line human summary. Examples: `retro` "Conduct a retrospective on a coding session." (44 chars), `wait-what` "Stop. That last message did not land: re-pitch it." (50 chars).

Two descriptions carry a trigger aimed at other skills: `codebase-design` ends "or when another skill needs the deep-module vocabulary". The opposite decision was made for `domain-modeling`, whose description dropped "another skill needs to maintain the domain model" because "that's the invoking skill's job to state explicitly, not this description's" (`CHANGELOG.md` 1.3.0).

Measured lengths (characters of the `description` value; `M` = model-invoked, `U` = user-invoked):

| Skill | Bucket | Inv | Desc chars | Desc words | SKILL.md lines |
| --- | --- | --- | --- | --- | --- |
| `code-review` | eng | M | 417 | 68 | 89 |
| `codebase-design` | eng | M | 265 | 40 | 114 |
| `diagnosing-bugs` | eng | M | 156 | 19 | 138 |
| `domain-modeling` | eng | M | 151 | 23 | 74 |
| `pr` | eng | M | 27 | 6 | 170 |
| `prototype` | eng | M | 179 | 32 | 26 |
| `research` | eng | M | 238 | 39 | 12 |
| `tdd` | eng | M | 149 | 20 | 38 |
| `wizard` | eng | M | 313 | 47 | 44 |
| `ask-matt` | eng | U | 83 | 16 | 97 |
| `grill-with-docs` | eng | U | 106 | 19 | 7 |
| `implement` | eng | U | 60 | 13 | 17 |
| `implement-spec` | eng | U | 57 | 9 | 40 |
| `improve-codebase-architecture` | eng | U | 125 | 20 | 71 |
| `retro` | eng | U | 44 | 7 | 44 |
| `setup-matt-pocock-skills` | eng | U | 180 | 29 | 118 |
| `to-spec` | eng | U | 149 | 24 | 75 |
| `to-tickets` | eng | U | 247 | 41 | 105 |
| `triage` | eng | U | 136 | 21 | 112 |
| `wayfinder` | eng | U | 197 | 39 | 128 |
| `grilling` | prod | M | 152 | 25 | 30 |
| `writing-for-agents` | prod | M | 103 | 15 | 81 |
| `grill-me` | prod | U | 51 | 9 | 7 |
| `handoff` | prod | U | 86 | 14 | 16 |
| `teach` | prod | U | 61 | 11 | 140 |
| `to-questionnaire` | prod | U | 88 | 16 | 54 |
| `wait-what` | prod | U | 50 | 9 | 7 |
| `chief-of-staff` | beta | U | 74 | 11 | 45 |
| `claude-handoff` | beta | U | 97 | 16 | 18 |
| `loop-me` | beta | U | 78 | 14 | 32 |
| `setup-ts-deep-modules` | beta | U | 185 | 26 | 102 |
| `writing-beats` | beta | U | 111 | 19 | 67 |
| `writing-fragments` | beta | U | 55 | 8 | 79 |
| `writing-shape` | beta | U | 77 | 11 | 79 |
| `git-guardrails-claude-code` | misc | M | 243 | 40 | 95 |
| `migrate-to-shoehorn` | misc | M | 168 | 25 | 118 |
| `scaffold-exercises` | misc | M | 204 | 30 | 106 |
| `setup-pre-commit` | misc | M | 238 | 33 | 91 |

Summary statistics:

| Group | Count | Min | Median | Max | Sum |
| --- | --- | --- | --- | --- | --- |
| promoted, model-invoked | 11 | 27 | 156 | 417 | 2150 |
| promoted, user-invoked | 16 | 44 | 87 | 247 | 1720 |
| misc, model-invoked | 4 | 168 | 221 | 243 | 853 |
| in-progress, user-invoked | 7 | 55 | 78 | 185 | 682 |

The always-loaded cost of the shipped set is therefore the 11 model-invoked descriptions: 2150 characters, roughly 500 to 550 tokens at about 4 characters per token (my estimate). The 16 user-invoked descriptions do not reach the model's context under Claude Code; they only appear in the slash-command menu.

The descriptions are not uniformly short. `code-review` (417 chars) restates its body's two axes in the description, which the "cut identity the body already carries" rule argues against. The four `misc` skills (older, frozen) use the older "Use when user wants ..." style with long synonym lists.

Scope: the two styles are general; the specific numbers are a useful calibration for skillbook.

### 2.3 Frontmatter fields actually used

| Field | Skills using it | Notes |
| --- | --- | --- |
| `name` | 38 | equals the folder name |
| `description` | 38 | quoted when it holds a colon-space |
| `disable-model-invocation` | 23 | always `true` when present |
| `argument-hint` | 4 | `handoff`, `teach`, `claude-handoff`, `loop-me` |
| `metadata` | 1 | `pr`: `metadata.credits` (skill, author, organisation, url) |

No other field appears anywhere: no `allowed-tools`, `model`, `license`, `version` or similar. The frontmatter is kept to what drives invocation. Attribution for copied text lives in `pr/CREDITS.md`, which explains: "`pr` does not depend on `show-me` as a skill (it isn't part of this repo, and a hard dependency would break standalone installs), so the content is copied in rather than pointed at; this file is the attribution a dependency would otherwise have carried."

Scope: general.

### 2.4 `agents/openai.yaml`

Every one of the 38 skills has `agents/openai.yaml` beside its `SKILL.md`. Fields seen:

```yaml
interface:
  display_name: "Ask Matt"
  short_description: "Find the right skill or workflow"
policy:
  allow_implicit_invocation: false   # present only on user-invoked skills
```

`interface.short_description` runs 26 to 73 characters (most 30 to 40). The `policy` block is on all 23 user-invoked skills and on none of the model-invoked ones; I checked all 38 against their frontmatter and they are consistent. Rule: "Keep the two in sync: a skill is user-invoked in both harnesses or neither." (`.agents/invocation.md:10`). Added in 1.2.0 "so the set works in both harnesses without generated copies".

Scope: general for a set that targets Codex.

### 2.5 The router skill `ask-matt`

`ask-matt/SKILL.md` (97 lines, user-invoked) maps the set as **flows** rather than a list: "A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath." (`SKILL.md:13`). Sections: the main flow (idea to ship, with branches), context hygiene, on-ramps, codebase health, vocabulary underneath, phase boundaries, standalone, precondition.

It has one sibling, `PHASE-BOUNDARIES.md` (55 lines): an ordered five-question tree (continue, `/clear`, `/handoff`, subagent, `/compact`) plus the reasoning. The SKILL.md keeps a five-bullet summary and points: "Read `[PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md)` for the ordered tree: the five questions, the reasoning behind each branch, and why the primary-source cost makes **Continue** the one to rule out first." (`SKILL.md:79`)

Two failures shaped it:

- The router answered from its own summaries. A pending changeset adds the line "Before stating what a skill does or recommending a step be skipped, read that skill's SKILL.md: the summaries here are for orientation only." (`SKILL.md:11`, changeset `ask-matt-read-skill-first.md`, #614). The docs page: "Where the router and a `SKILL.md` disagree, the `SKILL.md` is right."
- It drifts. `CLAUDE.md` therefore requires: "whenever you add, rename, remove, or change how a user-reachable skill fits the flows, re-read `ask-matt`'s `SKILL.md` and update it so the map stays accurate: a new skill it never mentions, or a stale one it still routes to, is a router that lies." Release 1.3.1 was such a fix.

Router prose keeps `/skill` names as labels; it never invokes anything (`.agents/invocation.md:18`).

Scope: general pattern; the content is specific.

### 2.6 How skills call other skills

The rule (`.agents/invocation.md:16`):

> "Dependencies are expressed as an explicit instruction to **call the Skill tool** with the named skill (`Call the Skill tool with "grilling"`), not deep `../other-skill/FILE.md` cross-references, and not a bare `/skill`-style mention left for the model to interpret. Naming the tool is what gets it fired ... Dropping the leading `/` also keeps this harness-neutral ... Shared reference docs live inside the skill that owns them; other skills reach that material by calling the Skill tool with it, not by linking across folders."

Refinements:

- One skill per call: "say so (`Call the Skill tool twice, for "grilling" and "domain-modeling"`), not 'call it with X and Y,' which reads as a single call taking both." (`.agents/invocation.md:20`)
- Only model-invoked targets: "When a step's precondition is a user-invoked skill (e.g. `setup-matt-pocock-skills`), phrase it as an instruction for the human to act on: 'tell the user to run `/setup-matt-pocock-skills`', never as a Skill tool call." (`.agents/invocation.md:22`). This carve-out came after the convention was first applied to six user-invoked targets (`CHANGELOG.md` 1.3.0, #880).
- Passive reading is not a skill call: "Merely _reading_ `GLOSSARY.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill." (`.agents/invocation.md:26`)

Call sites in the shipped set (all target model-invoked skills):

| Caller | Calls |
| --- | --- |
| `grill-me` | `grilling` (the whole body is that one line) |
| `grill-with-docs` | `grilling`, `domain-modeling` (two calls; whole body) |
| `implement` | `tdd`, `code-review` |
| `implement-spec` | `tdd` (inside each implementer subagent), `code-review` |
| `improve-codebase-architecture` | `codebase-design`, `grilling`, `domain-modeling` |
| `triage` | `grilling`, `domain-modeling` |
| `wayfinder` | `grilling`, `domain-modeling`, `research`, `prototype` |
| `tdd` | `codebase-design` (conditional) |
| `retro` | `writing-for-agents` (step 1, every run) |

Conditional wording is common: `tdd/SKILL.md:26`: "When the shape of that interface is itself in question ..., call the Skill tool with \"codebase-design\" for the vocabulary ... it is a reference to consult, not a session to run."

The approach has a documented reliability problem: "A skill that names another skill does not reliably cause that skill to load, and `grill-with-docs` names two. The sign is a session that asks everything at once with no recommendations." (`docs/productivity/grilling.md`). The explicit tool wording was the fix "intended to raise the hit rate" (`CHANGELOG.md` 1.3.0, #878). Related: `handoff` asks for a "suggested skills" section "naming which skills the next agent should call the Skill tool for".

Scope: general.

### 2.7 Where shared reference lives

Three placements are used:

1. **Inside a model-invoked skill**, reached with the Skill tool: `codebase-design` (deep-module vocabulary for `tdd`, `improve-codebase-architecture`, `setup-ts-deep-modules`), `domain-modeling`, `grilling`, `writing-for-agents`. The `ask-matt` section "Vocabulary underneath" calls `domain-modeling` and `codebase-design` "each the single source of truth for its vocabulary".
2. **A sibling file inside the one skill that owns it** (section 3).
3. **In the user's repo**, written by setup: `docs/agents/*.md`, `GLOSSARY.md`, `docs/adr/`, `CODING_STANDARDS.md` (section 4). For maintainer-only material, `.agents/` in this repo is the "plain file outside the skill system" from `SKILL-MECHANICS.md:14`.

Never used: a relative link from one skill folder into another. The packaging reinforces this: each skill directory is installed on its own (the plugin lists directories; skills.sh installs single skills; Codex copies the tree and "drops symlinks", ADR 0002).

Scope: general.

### 2.8 Hard versus soft dependency on setup configuration

`.agents/adr/0001-explicit-setup-pointer-only-for-hard-dependencies.md`:

> "**Hard dependency** (`to-tickets`, `to-spec`, `triage`): include an explicit one-liner: _'... should have been provided to you; run `/setup-matt-pocock-skills` if not.'_ Without the mapping, output is wrong, not just fuzzy."
>
> "**Soft dependency** (`diagnose`, `tdd`, `improve-codebase-architecture`): reference 'the project's domain glossary' and 'ADRs in the area you're touching' in vague prose only. If the docs aren't there, the skill still works; output is just less sharp."
>
> "The split keeps soft-dependency skills token-light and avoids cargo-culting the setup pointer into places where it isn't load-bearing."

Current wording of the hard pointer, in six skills (`to-spec`, `to-tickets`, `triage`, `wayfinder`, `implement-spec`, `code-review`): "The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`." (`triage` says the same of its label mapping.) Soft wording examples: "Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching" (`to-spec/SKILL.md:13`); "read `GLOSSARY.md` (if it exists)" (`tdd/SKILL.md:10`). The seeded `domain.md` makes absence silent: "If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront."

Scope: general.

## 3. Sub-files and nesting

### 3.1 Naming conventions

| Kind | Convention | Examples |
| --- | --- | --- |
| Disclosed reference or procedure | `UPPERCASE.md`, a noun | `DEEPENING.md`, `AGENT-BRIEF.md`, `HTML-REPORT.md` |
| Branch alternatives | `UPPERCASE.md`, one per branch | `prototype/LOGIC.md`, `prototype/UI.md` |
| Output format a skill writes | `<ARTIFACT>-FORMAT.md` | `ADR-FORMAT.md`, `GLOSSARY-FORMAT.md`, `MISSION-FORMAT.md` |
| Seed templates copied into a repo | `lowercase.md`, named as the target | `issue-tracker-github.md`, `domain.md` |
| Example and rule collections | `lowercase.md` (older) | `tdd/tests.md`, `tdd/mocking.md` |
| Executable templates | `*.template.sh`, `template.sh` | `diagnosing-bugs/scripts/hitl-loop.template.sh` |
| Bundled scripts | `scripts/<name>.sh` | `git-guardrails-claude-code/scripts/block-dangerous-git.sh` |
| Config to copy | real file name | `setup-ts-deep-modules/dependency-cruiser.config.cjs` |
| Attribution (not for the agent) | `CREDITS.md` | `pr/CREDITS.md` |
| Codex metadata | `agents/openai.yaml` | every skill |

The pattern behind it: UPPERCASE for material the agent reads as instructions, lowercase for material that is copied out as-is. The seed templates are lowercase because they become `docs/agents/<same name>.md` in the user's repo. `tdd`'s lowercase files are older and do not fit cleanly.

Scope: general.

### 3.2 How a SKILL.md points at its sub-files

Every sub-file pointer is a Markdown link with a relative path, almost always paired with a summary of what is in the file or a condition for reading it. The wordings in use:

| Pattern | Example |
| --- | --- |
| Conditional read | "When the document you're writing is a skill, read [SKILL-MECHANICS.md] for ..." |
| Read for a purpose | "Read [PHASE-BOUNDARIES.md] for the ordered tree: the five questions, ..." |
| See X for Y | "See [HTML-REPORT.md] for the full HTML scaffold, diagram patterns, and styling guidance." |
| Use the format in | "Use the format in `[ADR-FORMAT.md](./ADR-FORMAT.md)`." (at the step that writes the file) |
| Branch arrow | "**\"What should this look like?\"** → `[UI.md](UI.md)`. Generate several ..." |
| Reference list | "## Reference docs" with "- [AGENT-BRIEF.md]: how to write durable agent briefs" |
| Going deeper | "**Exploring alternative interfaces**, see [DESIGN-IT-TWICE.md]: spin up parallel ..." |
| Inline at the step | "post an agent brief comment (`[AGENT-BRIEF.md](AGENT-BRIEF.md)`)" |
| Copy instruction | "Copy `template.sh` to the target path." |

Observations:

- Pointers sit at the step where the file is needed, and important ones appear twice: once in a reference list and once inline at the step (`triage/SKILL.md:21-22` and `:79,85`).
- The summary after the colon makes each pointer a small context pointer in its own right: the agent can judge from it whether the branch applies without opening the file.
- Sub-files restate what they assume and link back: "Assumes the vocabulary in `[SKILL.md](SKILL.md)`" (`DEEPENING.md:3`), "Uses the vocabulary in `[SKILL.md](SKILL.md)`" (`DESIGN-IT-TWICE.md:5`), "The skill-specific branch of `[writing-for-agents](SKILL.md)`" (`SKILL-MECHANICS.md:3`).
- Branch files guard against the wrong branch: "If the question is about logic/state rather than what something looks like, this is the wrong branch. Use `[LOGIC.md](LOGIC.md)`." (`UI.md:5`)
- Path resolution is stated where it is ambiguous. `teach` had written its workspace into the skill folder (#377); it now says: "Workspace paths (`./lessons/` and the rest) resolve from the directory `/teach` was run in; only the `*-FORMAT.md` links resolve from this skill's folder." (`teach/SKILL.md:12`)

Scope: general.

### 3.3 Branching into alternative files

Two forms:

- **The agent picks one branch at run time**: `prototype/SKILL.md` "## Pick a branch" names the question each file answers, gives a default when the choice is ambiguous ("default to whichever branch better matches the surrounding code ... and state the assumption"), and explains the cost of picking wrong ("The two branches produce very different artifacts, so getting this wrong wastes the whole prototype").
- **The setup skill picks one seed template, then copies it into the repo**: the user picks GitHub, GitLab, local markdown or Other in "Section A". `SKILL.md:106-114` lists the five seed files with one-line labels and adds "For 'other' issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description." The three tracker templates share one section skeleton (Conventions, PRs/MRs as a triage surface, "When a skill says 'publish to the issue tracker'", "When a skill says 'fetch the relevant ticket'", Wayfinding operations). Downstream skills speak in those neutral verbs and never name `gh` or `glab`. That shared interface is what makes the branches interchangeable.

Scope: general. The second form is the cleanest model for a skillbook sub-skill that has variants.

### 3.4 Depth

All sub-files sit flat in the skill folder; the only subfolders are `scripts/` and `agents/`. Reference depth is at most two hops inside one skill:

- `SKILL.md` → `DESIGN-IT-TWICE.md` → `DEEPENING.md` (`codebase-design`)
- `SKILL.md` → `LOGIC.md` ↔ `UI.md` (`prototype`, mutual "wrong branch" links)
- `SKILL.md` → `issue-tracker-local.md` → `triage-labels.md` (setup)

Across skills, depth comes from Skill tool calls instead: `wayfinder` → `grilling` + `domain-modeling` → (in `domain-modeling`) `GLOSSARY-FORMAT.md`. There is no example of a sub-file that itself branches into further sub-files in a nested folder, and no evidence in the repo about how well deeper chains load.

Scope: the flatness is a choice, not a constraint of the method.

### 3.5 Line counts of sibling files

SKILL.md line counts are in the table in section 2.2. Promoted SKILL.md files: 27 files, 1854 lines, median 71, range 7 to 170; 12 are 50 lines or fewer and 8 are over 100. The three thinnest (`grill-me`, `grill-with-docs`, `wait-what`, 7 lines each) are a frontmatter block plus one sentence.

| Skill | Sibling file | Lines | Pointed at from |
| --- | --- | --- | --- |
| `ask-matt` | `PHASE-BOUNDARIES.md` | 55 | SKILL.md |
| `codebase-design` | `DEEPENING.md` | 37 | SKILL.md, DESIGN-IT-TWICE.md |
| `codebase-design` | `DESIGN-IT-TWICE.md` | 44 | SKILL.md |
| `diagnosing-bugs` | `scripts/hitl-loop.template.sh` | 44 | SKILL.md |
| `domain-modeling` | `ADR-FORMAT.md` | 47 | SKILL.md |
| `domain-modeling` | `GLOSSARY-FORMAT.md` | 60 | SKILL.md |
| `improve-codebase-architecture` | `HTML-REPORT.md` | 123 | SKILL.md |
| `pr` | `CREDITS.md` | 3 | (nothing; human attribution) |
| `prototype` | `LOGIC.md` | 67 | SKILL.md, UI.md |
| `prototype` | `UI.md` | 112 | SKILL.md, LOGIC.md |
| `setup-matt-pocock-skills` | `domain.md` | 51 | SKILL.md |
| `setup-matt-pocock-skills` | `issue-tracker-github.md` | 46 | SKILL.md |
| `setup-matt-pocock-skills` | `issue-tracker-gitlab.md` | 46 | SKILL.md |
| `setup-matt-pocock-skills` | `issue-tracker-local.md` | 30 | SKILL.md |
| `setup-matt-pocock-skills` | `triage-labels.md` | 15 | SKILL.md, issue-tracker-local.md |
| `tdd` | `mocking.md` | 59 | SKILL.md |
| `tdd` | `tests.md` | 77 | SKILL.md |
| `triage` | `AGENT-BRIEF.md` | 207 | SKILL.md |
| `triage` | `OUT-OF-SCOPE.md` | 105 | SKILL.md |
| `wizard` | `template.sh` | 223 | SKILL.md |
| `teach` | `GLOSSARY-FORMAT.md` | 35 | (nothing; orphan) |
| `teach` | `LEARNING-RECORD-FORMAT.md` | 46 | SKILL.md |
| `teach` | `MISSION-FORMAT.md` | 31 | SKILL.md |
| `teach` | `RESOURCES-FORMAT.md` | 32 | SKILL.md |
| `writing-for-agents` | `SKILL-MECHANICS.md` | 22 | SKILL.md |
| `setup-ts-deep-modules` | `dependency-cruiser.config.cjs` | 95 | SKILL.md (beta) |
| `git-guardrails-claude-code` | `scripts/block-dangerous-git.sh` | 25 | SKILL.md (misc) |

The 22 promoted Markdown siblings total 1347 lines, median 46.5, maximum 207 (`AGENT-BRIEF.md`, which is mostly four worked examples). Only 11 of the 27 promoted skills have any sibling file; 16 are a single `SKILL.md`.

## 4. Per-repository configuration

`setup-matt-pocock-skills` (user-invoked, 118 lines) is "a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write." (`SKILL.md:15`). Its steps: explore (`git remote`, `CLAUDE.md`/`AGENTS.md`, `GLOSSARY.md`, `docs/adr/`, `docs/agents/`, `.scratch/`, whether `triage` is installed, monorepo signals), then sections A to C, "One section, one answer, then the next", each led by the recommended answer, and sections skipped when exploration settled them. Then confirm a draft, write, and report.

What it writes into the user's repo:

| It writes | Where | When |
| --- | --- | --- |
| `issue-tracker.md` | `docs/agents/` | always (seed template or user's prose) |
| `domain.md` | `docs/agents/` | always (consumer rules plus layout) |
| `triage-labels.md` | `docs/agents/` | only if `triage` is installed |
| `## Agent skills` block | existing `CLAUDE.md`, else `AGENTS.md` | always; updated in place if present |
| missing labels | GitHub or GitLab | when section B ran (new; docs page is stale) |

The block it adds is a set of one-line context pointers (`SKILL.md:86-100`):

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout: "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

How other skills find it: the block is in the always-loaded steering file, so the pointer to the tracker doc is already in context when a skill runs. Skills therefore say "The issue tracker should have been provided to you" and never name the path. Release 1.1.0 fixed `wayfinder` for hard-coding `docs/agents/issue-tracker.md`, which "broke the indirection the rest of the suite relies on": skills "resolve the tracker through the `### Issue tracker` block that `setup-matt-pocock-skills` writes into `CLAUDE.md` / `AGENTS.md`, which points at the tracker doc wherever it lives." Inside the tracker doc, skills look up sections by name ("Wayfinding operations").

Other per-repo state the skills create lazily (only when there is something to write): `GLOSSARY.md` or `GLOSSARY-MAP.md` plus per-context glossaries, `docs/adr/NNNN-slug.md`, `.scratch/<feature>/spec.md` and `issues/NN-slug.md` for the local tracker, `.out-of-scope/<concept>.md` (triage), and `CODING_STANDARDS.md` (proposed by `retro`, read by `code-review`).

Rules and limits:

- "Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa); always edit the one that's already there." If neither exists, ask. The docs page records the open gap: a Codex user with a leftover `CLAUDE.md` gets the block in a file Codex never reads.
- No user-level or global mode: "The config lives in the repo, so every repo gets its own copy."
- Updating: seed templates change between versions, so changesets tell users when to re-run setup ("Re-run `/setup-matt-pocock-skills` to refresh `docs/agents/`").
- Verification is done by asking the same skill, not with a flag: "run `/setup-matt-pocock-skills` and tell it to verify your current setup" (`.out-of-scope/setup-skill-verify-mode.md`).
- "Other" trackers are recorded as prose in `docs/agents/issue-tracker.md`; Jira, Linear and others are out of scope as first-class templates because "Every issue-tracker backend hard-codes a CLI shape into the skills" (`.out-of-scope/mainstream-issue-trackers-only.md`).

The repo dogfoods part of this: its own `CLAUDE.md` ends with `## Agent skills` / `### Triage labels` pointing at `docs/agents/triage-labels.md`, which adds "Judge every issue against [`SCOPE.md`](../../SCOPE.md)".

Scope: the mechanism (setup writes plain docs plus a pointer block, skills read through the pointer) is general. The three questions are specific to an issue-tracker-centred flow.

## 5. Developing and maintaining the set

### 5.1 Buckets and promotion

| Bucket | Meaning | Plugin | README | Docs page | Linked locally |
| --- | --- | --- | --- | --- | --- |
| `engineering/` | daily code work | yes | yes | yes | yes |
| `productivity/` | daily non-code work | yes | yes | yes | yes |
| `in-progress/` | beta, public on purpose | no | bucket only | no | yes |
| `misc/` | kept, rarely used, frozen | no | bucket only | no | no |
| `deprecated/` | retired (now empty) | no | no | no | no |

`CLAUDE.md`: "Every skill in `engineering/` or `productivity/` (the **promoted** buckets) must have a reference in the top-level `README.md` and an entry in `.claude-plugin/plugin.json`'s `skills` array (the Claude Code plugin ships exactly the promoted set). Skills in `misc/`, `in-progress/`, and `deprecated/` must not appear in either."

Promotion ("graduate") is a changeset of its own, listing everything that moves with it: "Now wired as a promoted skill: plugin entry, top-level + Engineering READMEs under **Model-invoked**, a docs page ..., and a Standalone route in `ask-matt`" (`CHANGELOG.md` 1.2.0, `wizard`). Graduation is also when a skill is reshaped and its invocation decided (wizard became model-invoked on graduation).

Scope: general.

### 5.2 In-progress skills

`skills/in-progress/README.md`: "Beta. These skills are public on purpose: try them and tell me what breaks. They're excluded from the plugin and the top-level README until they graduate to a stable bucket, they get no docs pages, and they can change or disappear without warning." Users install one with `npx skills@latest add mattpocock/skills --skill=<name>`. The maintainer runs them daily: `scripts/link-skills.sh` links `in-progress/` because "this local install is exactly where that feedback loop runs". All seven are user-invoked, so beta skills cost no context load.

Scope: general.

### 5.3 Deprecation and removal

`skills/deprecated/README.md`: "a retired skill is deleted, and the changeset that removes it names whatever replaced it." Examples: 1.2.0 removed four skills, each "already absorbed by a skill that does the job better" (`ubiquitous-language` → `domain-modeling`, `design-an-interface` → `codebase-design` with its technique kept as `DESIGN-IT-TWICE.md`), plus two personal skills and the `personal/` bucket. 1.3.0 removed `resolving-merge-conflicts`: "Its docs page ... stays up, marked archived." Renames get no alias ("There is no alias. Reinstall under the new name.") and are marked **Breaking** in the changeset. `misc/` is the soft form of deprecation: frozen, still installable, every issue closed.

Scope: general.

### 5.4 Docs pages

`.agents/writing-docs.md` (96 lines) defines one human-facing page per promoted skill at `docs/<bucket>/<skill>.md`, published at `https://aihero.dev/skills-<name>`. The page is "not the skill and not a copy of `SKILL.md`"; its job is to relieve cognitive load: "The pages are collectively a distributed router; each is a node."

Template order: What it does (must state the **defining constraint**), When to reach for it (invocation mode and trigger boundary), Prerequisites (optional), one to three free-form sections that "surface the skill's leading word", Common questions, It's working if, Where it fits (role, neighbours, link to `ask-matt`). Rules: no H1, absolute links only, no install commands (the site renders them), never name the author, link the first use of each AI Coding Dictionary term, "Branches go in a table or a list, never in a paragraph", and a "Done when" checklist of 13 items.

Common questions must come from evidence: a personal wiki, `gh issue list --search "<skill-name>"`, and the changelog. "An observed question always beats an invented one ... the count stays honest to the evidence." "It's working if" bullets must be checkable "without opening `SKILL.md`".

The pages carry real operational knowledge the skills leave out: known bugs, harness gaps, workarounds (`docs/productivity/grilling.md` on `grill-with-docs` not loading `grilling`; `docs/engineering/ask-matt.md` on user-invoked skills reported as missing).

Scope: the template is general and cheap; publishing to a website is specific.

### 5.5 Changesets, changelog and versioning

- Tooling: `@changesets/cli` with `@changesets/changelog-github` (`.changeset/config.json`), a private single-package repo (`"privatePackages": { "version": true, "tag": true }`).
- One changeset file per change, named for it (`grilling-yes-accepts-recommendation.md`), frontmatter `"mattpocock-skills": patch|minor|major`. The body starts with the skill name in backticks, says what changed and why, cites issues (`#706`), thanks contributors, and tells users any action they must take ("Re-run `/setup-matt-pocock-skills` to refresh `docs/agents/`").
- Semver in practice: major only at 1.0.0 (removals and renames). Later breaking renames ship as minor with a "**Breaking:**" label (the `writing-for-agents` rename in 1.2.0). New and graduated skills are minor; fixes are patch.
- The changelog entries are long and explanatory: they double as design notes (the 1.1.0 `wayfinder` entry records ten design decisions).

Scope: general.

### 5.6 Release workflow

`.github/workflows/release.yml` runs `changesets/action@v1` on every push to `main`. It keeps a "chore: version skills" PR open; merging it runs `npm run version`, which is `changeset version && node scripts/sync-plugin-version.mjs`, then publishes with `npx changeset tag` (tags and GitHub releases). The sync script copies `package.json`'s version into `.claude-plugin/plugin.json`, rewriting only the version line "to keep the key order and the formatting"; with `--check` it exits 1 on a mismatch.

Why the plugin version matters: "Claude uses the plugin `version` to decide when installed users see an update" (ADR 0002), and managed routes "reinstall only when the `version` in `plugin.json` changes ... users get a release when the 'chore: version skills' PR merges" (`.agents/install-block.md:9`). `marketplace.json` has no `version` field "so it can't drift".

Scope: general.

### 5.7 Validation

- `claude plugin validate . --strict` "after touching either manifest" (`CLAUDE.md`). Manual; no workflow runs it.
- `npm run check-plugin-version` exists; no workflow runs it either.
- No CI check for SKILL.md frontmatter, links, em-dashes, README/plugin/docs consistency, or `openai.yaml` consistency. The YAML breakage in #911 was found by users of skills.sh, not by CI.
- Verification of install routes is manual and dated in the ADR and install block ("Verified 2026-08-05, on Claude Code 2.1.222"; "Each agent in the comment was run on 2026-10-07").
- Skill behaviour is checked by running the skill: "There is no automated eval" (`docs/productivity/writing-for-agents.md:47`). Bug reports must give harness, version, model, effort and how full the context was (`.github/ISSUE_TEMPLATE/bug.yml`).

Scope: general lesson: most of the rules in `CLAUDE.md` are mechanical and could be checks.

### 5.8 SCOPE and the out-of-scope process

`SCOPE.md` sets a two-part bar: "1. **Observed failure.** It describes something that went wrong in a real session ... A hypothetical improvement ('it would be better if...') does not clear this part. 2. **Fits the philosophy.** It does not match anything in `.out-of-scope/` or a past rejection, and it is not a config option, a harness-specific branch, or a tweak to suit one person's workflow." "Size is irrelevant ... Reactions and +1 comments do not count towards it."

`.out-of-scope/` holds one file per rejected **concept** (not per issue), each with "## Why this is out of scope" and "## Prior requests" (issue numbers and titles). The format comes from `triage/OUT-OF-SCOPE.md`, which the repo applies to itself. The nine current files record reusable design positions:

| File | Position it records |
| --- | --- |
| `frozen-misc-skills.md` | unmaintained skills are frozen, not half-maintained |
| `harness-name-collisions.md` | no renames to dodge built-ins; use namespaced `/plugin:skill` |
| `lazy-load-writing-for-agents.md` | `retro` loads the yardstick every run; no lazy load |
| `mainstream-issue-trackers-only.md` | three templates; everything else via prose |
| `native-question-tool.md` | grilling stays harness-neutral chat |
| `new-skills.md` | no new-skill contributions; compose existing skills |
| `question-limits.md` | no numeric caps; steer in natural language |
| `setup-skill-verify-mode.md` | no `--verify` flag; ask the skill in prose |
| `subagent-recursion.md` | recursion limits are the harness's job, not skill prose |

The last one argues: "A guard written into one skill's prose covers only that skill, costs tokens on every run, and still depends on the model choosing to obey it."

GitHub support: issue forms (blank issues disabled; questions go to Discussions; the idea form requires a checkbox confirming `SCOPE.md` and `.out-of-scope/` were read), `triage-label.yml` adds `needs-triage` to every new issue, `needs-info.yml` closes `needs-info` issues after 14 days of silence. The close message links a `CONTRIBUTING.md` that does not exist in the repo.

Scope: the out-of-scope record is general and valuable even for a solo repo; the issue machinery is specific to a large public audience.

### 5.9 New-skill requests

Closed outright: "The catalog is the set of skills I use myself every day, and it's deliberately small. Every skill is permanent maintenance surface: it has to stay in step with the others, with the docs pages, with `ask-matt`'s routing map, and with the plugin manifest ... if you can compose the behaviour from existing skills, it doesn't get a new skill." (`.out-of-scope/new-skills.md`). The same rule binds the author's own ideas.

Scope: the composition rule is general; refusing contributions is specific.

### 5.10 What `CLAUDE.md` (= `AGENTS.md`) requires on every change

`AGENTS.md` is a symlink to `CLAUDE.md` (3957 bytes), "so Codex reads the same repo instructions" (`CHANGELOG.md` 1.2.0). As a checklist:

1. Put the skill in the right bucket.
2. Promoted skill: add it to `README.md` (name linked to its `SKILL.md`, grouped under User-invoked or Model-invoked) and to `plugin.json`'s `skills` array. Non-promoted: in neither.
3. List it in its bucket's `README.md` with a one-line description (grouped in promoted buckets, flat elsewhere).
4. Use the install commands from `.agents/install-block.md` verbatim; run `claude plugin validate . --strict` after touching a manifest.
5. Promoted skill added, renamed or changed in behaviour: create or re-sync `docs/<bucket>/<name>.md` per `.agents/writing-docs.md`; keep removed skills' pages as archived.
6. Make every skill user-invoked or model-invoked in both harnesses (frontmatter plus `agents/openai.yaml`).
7. Re-read and update `ask-matt` whenever a user-reachable skill is added, renamed, removed or changes place in the flows.
8. Re-run `scripts/link-skills.sh` after adding, removing or renaming a skill.
9. No em-dashes in any prose.
10. Judge issues against `SCOPE.md` and use the triage labels in `docs/agents/triage-labels.md`.

`CLAUDE.md` contains almost no writing advice. That lives in the `writing-for-agents` skill, which is model-invoked on "creating or editing skills, or modifying AGENTS.md or CLAUDE.md". `CLAUDE.md` holds only the repo's invariants and pointers to `.agents/`.

Scope: general shape; item list partly specific.

## 6. Packaging and installing

- **`.claude-plugin/plugin.json`**: `name` (`mattpocock-skills`), `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`, and `skills`: an explicit array of 27 directory paths (the promoted set). The explicit array is how a bucketed repo ships a curated subset (ADR 0002).
- **`.claude-plugin/marketplace.json`**: marketplace `mattpocock`, one plugin with `"source": "./"`, no version.
- **Official marketplace**: accepted into `claude-plugins-official` (2026-08-05). The listing "points at this repo's git URL and reads `.claude-plugin/plugin.json` directly", with a **pinned sha**: "a release reaches installed users when that pin moves, not the moment we tag" (ADR 0002). Install: `claude plugin install mattpocock-skills@claude-plugins-official`. Skills are namespaced as `/mattpocock-skills:<name>`.
- **Codex**: no `.codex-plugin/`. Codex `main` "accepts a `skills` string array and falls back to `.claude-plugin/` when there is no `.codex-plugin/`", but "Codex still drops symlinks" (ADR 0002, update 2026-10-07). Install from the repo's own marketplace: `codex plugin marketplace add mattpocock/skills` then `codex plugin add mattpocock-skills@mattpocock`. Updates at startup.
- **Copilot CLI and VS Code**: read the same manifests; Copilot needs a one-time `extraKnownMarketplaces` entry with `"autoUpdate": true`; VS Code "Chat: Install Plugin From Source" updates daily.
- **Gemini CLI**: does not read `.claude-plugin`; one `gemini skills install ... --path skills/<bucket>` per promoted bucket; manual updates.
- **skills.sh** (`npx skills@latest add mattpocock/skills`): copies editable files into the user's project, serves every skill in the repo (including `in-progress/` and `misc/`), manual updates, and "`npx skills update` skips skills added upstream since `add`".
- **"Pick one"**: "The plugin is a managed, read-only bundle you subscribe to. skills.sh writes files you own and edit. Installing both leaves the user with every skill twice" (`.agents/install-block.md:121`).
- **`scripts/link-skills.sh`** (maintainer only): symlinks every skill outside `deprecated/` and `misc/` into `~/.claude/skills` and `~/.agents/skills`, "so a `git pull` is all that's needed to keep installed skills up to date". It refuses to run when a destination is itself a symlink into the repo.
- **Update model**: managed routes update when `plugin.json`'s `version` changes (Claude Code additionally waits for the official listing's sha to move); file-copy routes update only on request. The canonical install wording lives once in `.agents/install-block.md` inside `<canonical-block name="...">` tags; "Change it here first, then propagate."

Scope: the mechanics are facts about 2026 harnesses. The general lessons are curating by explicit list, real files instead of symlinks, a version field that drives updates, and one canonical install text.

## 7. Other distinctive elements

- **`retro` improves the environment, not the code** (user-invoked, 44 lines). Step 1 loads `writing-for-agents` "for the writing style guide"; it then reads the session's primary sources and proposes changes in seven categories (navigation, automated checks, coding standards, global AGENTS.md, tool economy, no-ops, information access), most severe first. Its reference section: `CLAUDE.md`/`AGENTS.md` "should be used incredibly sparingly, usually only for **navigation pointers** to other files"; `CODING_STANDARDS.md` "is read during review, not implementation", because "the review agent should be responsible for imposing coding standards, not the implementation agent". A mechanical violation "gets a deterministic check, full stop". General.
- **Grilling as a primitive** (`grilling`, 30 lines, model-invoked): a **design tree** worked in **rounds**; each round asks the whole **frontier** (decisions whose prerequisites are settled), numbered, each with a recommended answer, "Word each question so 'yes' accepts your recommended answer"; facts are looked up by sub-agents without blocking the round, decisions wait for the user; done when the frontier is empty and the user confirms. Five skills reuse it instead of writing their own interview. General.
- **Handoff** (16 lines): writes to the OS temp dir, not the workspace; includes a "suggested skills" section; "Do not duplicate content already captured in other artifacts ... Reference them by path or URL instead"; redacts secrets. The `ask-matt` phase-boundary tree narrows it to four cases where something must travel (new harness, new directory, colleague, side task). General.
- **Primary versus secondary sources and the smart zone**: every move except continuing "turns a **primary source** into a **secondary source**" (`PHASE-BOUNDARIES.md`); keep grilling, spec and tickets in "one unbroken context window" while inside the ~150k-token smart zone. Prototypes and research are kept as primary sources on throwaway `prototype/<name>` and `research/<name>` branches with a pointer from the issue. General.
- **Subagents talk through pointers**: `implement-spec` says "Communication to and from subagents should be sparse. Communicate primarily through **context pointers** ... Don't duplicate information already available via pointers." `code-review` runs two parallel sub-agents (Standards, Spec) and pastes the smell baseline into the Standards prompt "(the sub-agent has no other access to it)", then reports both axes without reranking. General.
- **Fixed library plus authored part**: `wizard/template.sh` (223 lines) holds a library "identical in every wizard ... never hand-edit it"; the skill's job "is only to scope the procedure and author its stages". The skill stays short (44 lines) because the bundled file carries the mechanics. General.
- **Thin wrappers**: `grill-me` and `grill-with-docs` are one line each, existing only to give a user-invoked name to a model-invoked primitive (with an extra discipline for the second). General.
- **Wayfinder** for work too big for one session: a map issue that is "an **index**, not a store", decision tickets, fog of war, HITL/AFK ticket types, one ticket per session. Specific in content, general in shape.
- **The README sells problems, not skills**: "Why These Skills Exist" is organised by failure mode (#1 the agent didn't do what I want, #2 too verbose, #3 the code doesn't work, #4 ball of mud), each with a quote and the skills that fix it. Specific to a public audience.

## 8. Lessons for skillbook

Each item says whether to **adopt**, **adapt** or **avoid**, cites the evidence above, and adds a note on the hierarchical design (main skills with registered descriptions, loading plain-markdown sub-skills on demand). Notes marked "inference" are my reasoning, not something the repo demonstrates.

1. **Adopt: write every always-loaded line as a context pointer** (section 1.1). Front-load the leading word, one trigger per branch, no identity the body carries. *Hierarchy*: in skillbook the main skill's description is the only registered pointer for its whole subtree, so it must name every branch any sub-skill serves. Budget it against Matt's numbers: model-invoked median 156 characters, maximum 417; the 11 shipped descriptions cost about 2150 characters together.

2. **Adopt: the branching test as the rule for creating a sub-skill** (section 1.3). "Inline what every branch needs, and push behind a pointer what only some branches reach." *Hierarchy*: apply it at every level. If every run of a main skill needs a file, it belongs in that `SKILL.md`; a sub-skill exists only because some runs skip it.

3. **Adopt: treat the in-file pointer to a sub-skill as that sub-skill's description** (sections 1.1, 3.2). Use the observed pattern: condition first, link, then a colon and a summary of contents ("When the change touches X, read `[X.md](X.md)`: A, B and C"). *Hierarchy*: unregistered sub-skills have no other trigger, so "sharpen the wording first, and inline the material only if sharpening fails" is the main reliability lever. Place the pointer at the step that needs it, and repeat important ones in a short reference list, as `triage` does.

4. **Adapt: name the action explicitly** (section 2.6). Matt's evidence (#878) is that naming the tool ("Call the Skill tool with ...") loads skills more reliably than a bare mention. *Hierarchy*: for sub-files, the equivalent is an explicit read instruction ("Read `X.md` before step 3") rather than "see X". For calls between main skills, use the Skill tool wording verbatim, one call per skill (inference: the same reasoning carries over to the Read tool, but the repo has no data on it).

5. **Adopt: completion criteria on every step, checkable and exhaustive** (section 1.4). Use "Done when:" lines. *Hierarchy*: a sub-skill file loaded mid-run should end on a criterion that says where control returns ("then continue at step 4 of the parent"), so the agent does not treat the end of the sub-file as the end of the task (inference).

6. **Adopt, with care: a sub-skill does not create a context boundary** (sections 1.4, 1.5). "Hiding only works across a real context boundary ... an inline call leaves the later steps in context and clears nothing." *Hierarchy*: loading a sub-file inline saves tokens and keeps the main file legible, but it does not stop premature completion. When a phase needs a fresh context, dispatch it to a subagent that reads the sub-file.

7. **Adapt: keep nesting shallow in practice** (section 3.4). Matt never goes beyond two hops inside a skill and keeps sub-files flat in one folder, with sibling-to-sibling links. *Hierarchy*: "several levels deep" is possible, but each level is one more pointer that must fire, and the repo documents that even skill-to-skill loading fails in practice (section 2.6). Recommendation (inference): allow depth 2 by default, allow depth 3 only for rarely taken branches, keep files flat, and give each sub-file a one-line header saying what it assumes and linking back to its parent.

8. **Adopt: state path resolution in each skill that writes files** (section 3.2, `teach` #377). Say which paths resolve from the skill folder and which from the working directory. *Hierarchy*: deeper trees make this ambiguity worse; use paths relative to the skill folder for sub-skills and say so once in each main `SKILL.md`.

9. **Adopt: the naming convention for sub-files** (section 3.1). UPPERCASE nouns for instructions the agent reads, `*-FORMAT.md` for output formats, lowercase for templates copied out verbatim, `scripts/` for executables. *Hierarchy*: names become the vocabulary of the tree; make each one a leading word that also appears in the parent's pointer.

10. **Adopt: branch files that share one interface** (section 3.3). Seed templates with identical section skeletons, a default when the branch is unclear, a "wrong branch, use X" guard at the top of each. *Hierarchy*: this is the natural shape for a sub-skill with variants (per-language, per-harness, per-tracker).

11. **Adopt: one home for shared reference, never a `../other-skill/` link** (sections 2.7, 6). *Hierarchy*: a sub-file used by two main skills either moves into a main skill of its own (and pays its description cost) or stays private to one main skill that the other calls with the Skill tool. Keep every sub-file a real file: Codex drops symlinks, and installers copy one skill directory at a time.

12. **Adopt: the model-invoked test** (sections 1.8, 2.1): "could the model usefully reach for this autonomously?" *Hierarchy*: skillbook's main skills are model-invoked by design. Orchestration commands that only the user starts can be user-invoked skills at zero context load, but expect the documented costs: agents report them missing, some surfaces hide them, and no skill can call them.

13. **Adopt: the hard versus soft dependency rule for configuration** (section 2.8). One explicit "should have been provided; tell the user to run setup if not" line only where output would be wrong without config; vague prose elsewhere; absence handled silently. *Hierarchy*: put the hard pointer in the sub-file whose branch needs the config, not in the main skill, so other branches pay nothing.

14. **Adopt: per-repo configuration as plain docs plus a pointer block** (section 4). A setup skill that explores, recommends, confirms, then writes `docs/agents/*.md` and a short `## Agent skills` block; skills read through the pointer, never a hard-coded path. *Hierarchy*: the setup skill's branches (one per tracker, stack or harness) are exactly sub-skill files. Because skillbook targets Claude Code and Codex, write the block to `AGENTS.md` and make `CLAUDE.md` point at it or symlink it, avoiding Matt's open Codex gap.

15. **Adopt: `agents/openai.yaml` beside every registered skill** (section 2.4), with `display_name`, `short_description` and, for user-invoked skills, `policy.allow_implicit_invocation: false`. *Hierarchy*: only main skills need it; sub-files are not skills.

16. **Adapt: a router only when user-invoked commands pile up** (section 2.5). With a few model-invoked main skills, the descriptions are the router. *Hierarchy*: every main skill is a small router over its sub-skills, so take the `ask-matt` fix with it: a parent's one-line summary of a sub-skill is for orientation only; read the sub-file before acting on it or telling the user what it does.

17. **Adopt: leading words and a repo `GLOSSARY.md`** (sections 1.6, 1.9). Prefer pretrained words over coined ones; record the chosen terms with `_Avoid_:` lists. *Hierarchy*: use the same word in the main description, the pointer line and the sub-file title, so the trigger and the content share one token.

18. **Adopt: positive phrasing, and prune by running** (sections 1.6, 1.7). No-op test per sentence, single source of truth, cache only what the environment cannot tell. Avoid copying Matt's leftover "Do NOT" lines. *Hierarchy*: a sub-skill must not restate its parent; duplication across levels raises the duplicated rule's prominence and drifts.

19. **Adopt: buckets with an explicit promoted list** (sections 5.1 to 5.3). A beta area that the maintainer runs daily but the plugin does not ship; frozen and deleted states; a changeset naming the replacement on removal. *Hierarchy*: the plugin manifest selects whole skill directories, so a beta sub-skill cannot be excluded by the manifest. Gate beta sub-skills another way, for example by leaving them unlinked from the parent until promoted, or by placing them under a beta main skill (inference).

20. **Adopt: changesets, the version-sync script and the release PR** (sections 5.5, 5.6). The `plugin.json` version is what triggers updates on managed installs. *Hierarchy*: a change to a sub-skill is a change to its main skill; name the main skill and the sub-file in the changeset.

21. **Adapt: turn the maintenance checklist into checks** (sections 5.7, 5.10). Matt's `CLAUDE.md` rules are mostly mechanical, yet only manual: `claude plugin validate` and the version check run in no workflow, and a YAML error and an orphan sub-file shipped. Following his own `retro` rule ("a mechanical violation gets a deterministic check"), add a CI script that validates frontmatter YAML, plugin and README consistency, `openai.yaml` and frontmatter agreement, and that every sub-file is linked from its parent. *Hierarchy*: a link checker is essential in a tree, because an unlinked sub-skill is invisible to the agent.

22. **Adapt: `SCOPE.md` and `.out-of-scope/`** (section 5.8). For a solo maintainer the issue forms and stale-bot are optional, but recording rejected concepts with their reason keeps a public repo's design positions stable and answers repeat requests with a link. Reuse Matt's nine positions as a starting list where they fit (harness-neutral text, no numeric caps, recursion limits belong to the harness).

23. **Adapt: one docs page per main skill** (section 5.4) with the sections What it does, When to reach for it, Common questions, It's working if, Where it fits. It is where known bugs and workarounds live without costing the agent context. *Hierarchy*: sub-skills need no page; the main skill's page can carry a table of its branches.

24. **Avoid: the same description in five places** (sections 2.2, 2.4, 5.4). Frontmatter, `short_description`, top-level README, bucket README and router summary all describe each skill; the changelog records drift in display names (1.2.2) and router routes (1.3.1). Generate the README lists from frontmatter, or keep fewer copies.

25. **Avoid: unquoted descriptions and blind character sweeps** (section 1.9). Quote any `description` that contains a colon-space, and lint frontmatter in CI; Matt's em-dash sweep made six skills invisible to skills.sh.

26. **Adopt: harness-neutral skill text** (section 1.9). No harness tool names other than the generic "Skill tool", and personal preferences in the user's own steering file. *Hierarchy*: if skillbook needs harness-specific steps, isolate them in branch sub-files rather than inline conditionals (inference; Matt rules harness branches out of scope for his public set).

27. **Adopt: the retro pattern with an unconditional yardstick** (sections 7, 5.8). A maintenance skill that reviews a session and proposes changes to steering files and skills, loading the writing guide on every run. *Hierarchy*: this is a deliberate counter-example to lazy loading: when a parent's judgement depends on a file's definitions, load it every run (`.out-of-scope/lazy-load-writing-for-agents.md`). Mark such sub-files as always-read in the parent's first step.

28. **Adopt: grilling, handoff and thin wrappers as primitives** (section 7). One interview primitive reused by every flow; handoff that references artifacts by path; one-line user-invoked wrappers that give a command name to a model-invoked discipline. *Hierarchy*: in skillbook a primitive used by several main skills should be a main skill (registered, callable), not a sub-file copied into each.

29. **Adapt: the symlink dev install** (section 6). `link-skills.sh` keeps the maintainer's harness directories pointing at the working tree, including beta skills, so daily use is the test. *Hierarchy*: sub-files ride along with their directory symlink, so no extra work, but distribution must still ship real files.

30. **Adopt: size targets from the evidence** (sections 2.2, 3.5). Promoted `SKILL.md` median 71 lines (7 to 170); Markdown sub-files median about 46 lines (15 to 207); 16 of 27 skills have no sub-file at all. *Hierarchy*: a main skill in skillbook will be a router plus shared rules, so aim near the median, and split a sub-file again only when the branching test (lesson 2) holds inside it.
