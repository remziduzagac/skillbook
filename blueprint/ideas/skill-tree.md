# Ideas: a sample skill tree

**A sample architecture, for discussion. Nothing in this file is decided unless it cites a decision:** not which skills exist, not where they sit, not their names. It is the picture we reason over to find the shape; what is decided about skillbook as a whole is in [../design/how-it-works.md](../design/how-it-works.md) and [../decisions.md](../decisions.md).

Drafted from 2026-10-10 from [draft-ideas.md](../notes/draft-ideas.md), the research notes on loading and on other collections, and the first design. Draft 1 expanded every skill into its parts; draft 2 named the groups; draft 3 made the activities roots; draft 4 wrote design as a procedure over its sub-skills; draft 5 grouped the lifecycle under engineering, and knowledge and routines under productivity (D47, D48); draft 6 set knowledge and routines aside for later (D64); draft 7 lifted engineering's stages to the top (D76).

## How to read it

- **Each skill is a short folder** inside its parent's; its name, shown before its description, is the folder path joined by dashes: `design/start/` is `design-start` (D43, D71). Inside, only `SKILL.md` sits at the top, with `references/`, `scripts/` and `assets/` beside the sub-skills, and in a hidden skill `agents/`, Codex's settings (D44, D79); the sample below shows it once.
- **Each set's main skill** is model-invoked, its description in the agent's context every turn (D56, D152). Every other skill, the roots included, is a **sub-skill**: invoked by the person only, costs nothing until used, and is loaded by its path from the skill that needs it, inside its set; the person can type it by the name its install route gives it.
- **essentials' main skill,** on the `skills/skillbook/` line, sits above the roots: its rules come first, among them following conduct's act and laying out every response by its rule on layout; its instructions say when to use each root; and every response is checked against respond before it is returned (D56, D63, D81, D112). Beside the roots, **conduct** holds how the agent behaves in every root.
- **(an idea)** marks a skill with no worked-out material anywhere yet; **→** marks a skill it calls.
- **The roots:** the stages, named by bare verbs (D35, D36, D76): design and plan are essentials', the rest softeng's, and the lifecycle is no longer general (D154); understand is a verb too, and conduct and authoring, groups, are nouns (D40, D67, D154). A knowledge base and routines are later sets (D64, D152).

## The tree

One skill folder, as a sample of the shape every folder in the tree has (D43, D44):

```text
design/                         its name: design
├── SKILL.md                    the rules, the advice, and when to use each sub-skill (D112)
├── references/                 what the skill reads, linked from SKILL.md
├── scripts/                    what it runs
├── assets/                     what it copies out, such as templates
├── agents/openai.yaml          Codex's setting that hides the skill, written from SKILL.md (D79)
└── start/                      a sub-skill, named design-start: the same shape again
    └── SKILL.md
```

The tree shows only the skill folders. Its folder paths are provisional until the layout is decided with the install routes; the `skills/skillbook/` line stands for essentials' main skill, and each root's set is marked in square brackets, as is each part whose set differs from its root's (D152, D154).

```text
skills/skillbook/                 essentials, essentials' main skill, listed to the model like every set's main skill
│                                 and the one loaded first for any work: its rules hold in every case (follow act's
│                                 rules, lay out every response and file by its rule on layout), so it reads act,
│                                 respond, rightsize and, once designed, essentials' output-format skill first; for now
│                                 it routes to understand and conduct, and to authoring's markdown through authoring's
│                                 main skill where that set is installed, several for one request where the work needs
│                                 them, and other work is done under act's rules until its root or set is designed;
│                                 strong advice: delegation by default, done directly only when too small, when it needs
│                                 the person's decisions as it goes, or when the content is needed for the conversation;
│                                 every response is checked against respond before it is returned (D56, D63, D71, D81,
│                                 D111, D112, D136, D138, D143, D149, D152, D153, D154)
├── conduct/                      conduct: [essentials] how the agent acts: how it behaves in every root, sets skillbook
│   │                             up, learns from sessions and works with other agents; its own SKILL.md holds the
│   │                             wrap-up offer and one routing line per sub-skill under six headings, and the main
│   │                             skill reads respond and act directly, first, once per conversation (D63, D67, D77,
│   │                             D106, D134)
│   ├── respond/                  conduct-respond: how every response is prepared before it is returned: necessary and
│   │                             sufficient, things named in words, top-down when explaining, plain words, outcomes as
│   │                             they happened, no guardrail broken; questions through ask; the main skill checks each
│   │                             response against it (D60, D81, D95, D107, D114, D115)
│   ├── act/                      conduct-act: how to act, read first: clarify before acting, through clarify; an
│   │                             opinion is not a task; a concern that would change the work asked and waited on, then
│   │                             exactly what was asked; evidence before any claim, through verify; guardrails before a
│   │                             risky action; the skill for a file's type; a skill by its route; stop when attempts
│   │                             keep failing; which instruction wins; running as a delegated agent (D58, D63, D72,
│   │                             D84, D107, D115, D116)
│   ├── ask/                      conduct-ask: how the agent asks the person anything: numbered questions under their
│   │                             own headings, each with a recommended answer; one round or one by one; go ahead,
│   │                             parked and assumed; proposals put the same way (D114)
│   ├── organize/                 conduct-organize: arranging things, written or still planned: rules (one dividing
│   │   │                         principle, each boundary in one sentence, meaning preserved, the person verifying plan
│   │   │                         and result, retiring, code through implement; the middle three only when something
│   │   │                         existing changes), the check of existing parts, then one routing line per operation;
│   │   │                         units of any kind, examples across writing, code and design (D61, D85, D86, D107,
│   │   │                         D141, D148)
│   │   ├── split/                conduct-organize-split: one item, written or still planned, into several parts that do
│   │   │                         not overlap and cover it; each part readable on its own and sized to how it is read;
│   │   │                         VaultOps' decompose (D85, D148)
│   │   ├── merge/                conduct-organize-merge: several redundant items fused into one survivor, links
│   │   │                         pointing at the others updated (D85)
│   │   ├── compose/              conduct-organize-compose: a new parent added above items that stay whole: their
│   │   │                         generalization (D85)
│   │   ├── normalize/            conduct-organize-normalize: the part several items share taken out into one place they
│   │   │                         all use (D85)
│   │   └── cluster/              conduct-organize-cluster: a view added for finding items, the items unchanged: an
│   │                             index, grouping for navigation; a map pays for items agents read often (D85, D148)
│   ├── explain/                  conduct-explain: something the agent itself said that did not land, explained
│   │                             top-down: where we are, the point, what it rests on in words, an example; stops once
│   │                             it is clear; explaining something new is understand's (D54, D63, D96, D107)
│   ├── verify/                   conduct-verify: evidence before claiming work is done, fixed, passing or meets its
│   │                             requirements: the check chosen, run fresh, and who checks; four further checks for a
│   │                             plan's task, a commit or a pull request (D89, D107)
│   ├── guardrails/               conduct-guardrails: risky actions in eight kinds (irreversible, wide, outward, outside
│   │                             the task, costly, others' text and code, weaker checks, secrets): proposed with their
│   │                             scope, approved, applied exactly, checked; which text is an instruction and which is
│   │                             data; trivial cost, the project's own commands, safe writes, the network, proportion,
│   │                             the never-rules (D91, D92, D107, D115)
│   ├── stakes/                   conduct-stakes: how much care something deserves, judged from facts: Undo, Reach,
│   │                             Catch and Cost, and one level, low, medium or high, the higher when unsure and never
│   │                             below a rule; it judges and the caller acts: guardrails, delegate, verify, weigh and
│   │                             understand map it (D121, D133)
│   ├── rightsize/                conduct-rightsize: nothing missing and nothing extra for the reader, parts
│   │                             comprehensive and exclusive, the point first, and the work rightsized; a five-question
│   │                             check that respond, authoring, organize, brief, carryover, instruct and act run (D145)
│   ├── cleanup/                  conduct-cleanup: what the agent itself created and no longer needs, removed by exact
│   │                             path or ID: its own without asking, the rest proposed; what is kept said with why; act
│   │                             names it before "done" (D126, D129)
│   ├── instruct/                 conduct-instruct: writing and updating instruction documents: AGENTS.md, CLAUDE.md,
│   │                             CLAUDE.local.md and the person's own; called by setup, or asked for at any time (D94)
│   ├── setup/                    conduct-setup: setting skillbook up on a machine (the install, the pointer in the
│   │                             person's own files) or in a project (its blueprint started, its instruction files
│   │                             checked, skills recommended); adds existing skills, makes none (D93, D97, D117)
│   ├── learn/                    conduct-learn: what a session taught, when asked: highlights collected, judged and,
│   │                             with approval, made into a rule, a decision or a note in the blueprint, or dropped;
│   │                             skill promotion and where highlights wait are future work (D66, D98, D107) → instruct,
│   │                             design
│   ├── delegate/                 conduct-delegate: work given to other agents, the default for any task that is not too
│   │   │                         small: the type first, after a cost check, then fork or fresh by what the task needs
│   │   │                         from the conversation and how long it is, then the tier, and the effort apart from it,
│   │   │                         tiers never named as models; the cost, a running list while the conversation goes on,
│   │   │                         the work checked; one routing line each for council, fanout and crew; within the
│   │   │                         harness's limits and its own means (D65, D99, D107, D115, D138, D139, D142, D143,
│   │   │                         D144, D147); what the agent is told is brief's
│   │   ├── council/              conduct-delegate-council: several agents, about three, answer the same question on the
│   │   │                         same material independently; a summary keeping disagreements; the person decides (D99,
│   │   │                         D101, D107, D115)
│   │   ├── fanout/               conduct-delegate-fanout: the work split into parts, each agent with a place or a
│   │   │                         sub-question the others do not have; findings with their sources consolidated by a
│   │   │                         script, which checks each quote, then validated and synthesized (D99, D107, D115)
│   │   └── crew/                 conduct-delegate-crew: several agents each change their own items of one job; a shared
│   │                             item has one owner, who applies the others' proposals; then one pass in sequence (D99,
│   │                             D107, D115)
│   ├── brief/                    conduct-brief: what an agent that was not in the conversation is told when it starts:
│   │                             what it needs to start without asking, decisions and constraints not in the files,
│   │                             what was ruled out, the first step and when it is done, references by path, no tool
│   │                             only the writer has; a line or two for a fork, findings for a fresh agent, and the
│   │                             report it asks back; carryover builds on it (D138, D146, D147)
│   └── carryover/                conduct-carryover: work carried over to a later session or agent, built on brief's
│                                 rules: a page of done, remaining, decisions, uncertain, references, the first next
│                                 step and what it was written against; offered at a phase's end when a long session's
│                                 next work fits in it; on resuming, checked against what changed before acting (D65,
│                                 D104, D107, D147)
│
├── understand/                   understand: [essentials] understanding before acting, with the person and from
│   │                             sources: its own skill holds the rules for the whole scope (keeps nothing, one result
│   │                             shape, guesses marked, facts first, who decides, nothing changed for good) and one
│   │                             routing line per sub-skill under five headings; other roots reach it through the main
│   │                             skill (D50, D56, D112, D130, D131)
│   ├── discuss/                  understand-discuss: a topic worked through with the person, item by item: the whole
│   │                             first, one item per turn, the agent proposing and the person deciding, every item
│   │                             closed, side topics placed (D130)
│   ├── clarify/                  understand-clarify: what the person means, before acting: shared rules (facts found
│   │   │                         first, only questions that change the work, each with a recommended answer, nothing
│   │   │                         acted on before the answers), then the part chosen: shallow first, deep where a part
│   │   │                         needs it, a questionnaire for someone else's questions (D45, D49, D109)
│   │   ├── shallow/              understand-clarify-shallow: the full picture of a level: one round of questions across
│   │   │                         all of it, each with a default, then "going with: …" (D45, D109)
│   │   ├── deep/                 understand-clarify-deep: a part or a whole plan questioned until nothing is left
│   │   │                         assumed: numbered rounds, each question with a recommended answer; one by one on
│   │   │                         request, without losing the round; a summary confirmed before acting (D58, D109)
│   │   └── questionnaire/        understand-clarify-questionnaire: questions only someone else can answer, written so
│   │                             they can be answered without the conversation; never sent by the agent; the answers
│   │                             are input the person decides on (D49, D50, D109)
│   ├── frame/                    understand-frame: a question or problem stated in a few sentences, with its goal, what
│   │                             is out of scope, its constraints and what a good answer looks like; guesses marked,
│   │                             unknowns handed to clarify; shown to the person before work builds on it; the lenses'
│   │                             one home (D118, D119)
│   ├── brainstorm/               understand-brainstorm: options for one open question: framed through frame, options
│   │                             listed before any is judged and differing in kind, the promising ones developed and
│   │                             challenged, weighed through weigh, then decided through conduct's ask or parked; keeps
│   │                             nothing, design's discuss step records it (D53, D118)
│   ├── weigh/                    understand-weigh: options compared on terms stated before any is scored, frame's "a
│   │                             good answer" where there is one: what each gives, costs, could get wrong and leaves
│   │                             unknown, a real downside each; a recommendation with its reasoning, or no clear winner
│   │                             and what would settle it (D118, D122)
│   ├── challenge/                understand-challenge: an idea, plan or decision attacked before it is relied on,
│   │                             measured against its frame: stated at its strongest, its assumptions named, each
│   │                             weakness with its seriousness and what would address it, then an honest verdict; it
│   │                             changes nothing itself (D118, D124)
│   ├── argue/                    understand-argue: the strongest honest case for a position, challenge's mirror: the
│   │                             position stated through frame, every reason with its evidence or marked as an
│   │                             assumption, the strongest objections found through challenge and met, weaknesses
│   │                             admitted, the case rated and labelled one-sided; it decides nothing (D132)
│   ├── naming/                   understand-naming: names people will read and rely on: chosen from brainstorm's
│   │                             candidates, weighed through weigh, recorded with the rejected words; and the
│   │                             vocabulary kept to one word per concept in the project's glossary, a term used two
│   │                             ways flagged (D67, D125)
│   └── research/                 understand-research: finding out from sources: the question stated, every finding with
│       │                         its source and strength, what was not found, matched to its version and date,
│       │                         disagreements shown; chooses the part; a reference file per kind of source (D59, D128)
│       ├── fact/                 understand-research-fact: one question answered, or one claim checked both ways, with
│       │                         a verdict weighed by the strength of the evidence (D128)
│       ├── survey/               understand-research-survey: what exists on a subject, found widely and compared on the
│       │                         same terms, the screened-out named, coverage and date stated; weigh chooses →
│       │                         conduct-delegate (D128)
│       └── analyze/              understand-research-analyze: why something happens: the symptom stated, one testable
│                                 cause at a time, the chain traced back to its trigger, the fix left to the caller;
│                                 test-debug asks for it when the cause is not obvious (D59, D128)
│
├── design/                       design: [essentials; its recording steps the blueprint set's, architecture softeng's]
│   │                             how to design anything: the design flow and its principles, and the sub-skills each
│   │                             step calls; with a blueprint, its steps record and track the design (D46, D47)
│   ├── architecture/             design-architecture: [softeng] software's design knowledge: deep modules, seams,
│   │                             contracts, hot paths
│   ├── review/                   design-review: [essentials; its architecture lens softeng's] a design reviewed through
│   │                             lenses: consistency, lean, model check, architecture; review points here (D39)
│   ├── start/                    design-start: [blueprint] a blueprint started, or an existing project described into
│   │                             one
│   ├── discuss/                  design-discuss: [blueprint] ideas and session notes recorded
│   ├── research/                 design-research: [blueprint] research notes recorded with their sources
│   ├── decide/                   design-decide: [blueprint] decisions recorded with their reasons, and notes under
│   │                             earlier ones
│   ├── evidence/                 design-evidence: [blueprint] an evidence entry recorded: the claim, what was run or
│   │                             seen, who verified it, what it supports (D90)
│   ├── write/                    design-write: [blueprint] requirements and design updated, in the root or a workstream
│   ├── workstream/               design-workstream: [blueprint] a workstream opened for a change, with its key and
│   │                             status
│   ├── tasks/                    design-tasks: [blueprint] roadmap steps and tasks written from the plan
│   ├── work/                     design-work: [blueprint] the design kept in step while a task is implemented
│   ├── sync/                     design-sync: [blueprint] the design brought up to date with code changed elsewhere
│   ├── consolidate/              design-consolidate: [blueprint] a finished workstream folded into its parent, then
│   │                             reviewed
│   ├── parallel/                 design-parallel: [blueprint] several agents at once: staged mode, pending files
│   ├── check/                    design-check: [blueprint] the folder's health; maintain points here (D39)
│   └── publish/                  design-publish: [blueprint] a private blueprint made public (D39)
│
├── plan/                         plan: [essentials; its software parts softeng's] planning any work before acting: a
│                                 plan when order matters, an approach must be chosen, stakes are medium or higher, or
│                                 the work is long or wide; one line or a full plan; approved when it holds the person's
│                                 choice; revised when a step fails (D151) (with a blueprint, the plan is written into
│                                 its roadmap and tasks)
│
├── implement/                    implement: [softeng] making it, by carrying out the design
│   ├── prototype/                implement-prototype: throwaway work that answers one design question → cited by design
│   ├── plan/                     implement-plan: a plan carried out task by task → test, review, conduct-verify,
│   │                             conduct-delegate
│   ├── git/                      implement-git: git work by the house rules; routes to its sub-skills
│   │   ├── worktree/             implement-git-worktree: a task in its own worktree
│   │   ├── commit/               implement-git-commit: a commit message proposed in the house style
│   │   └── finish/               implement-git-finish: merge, pull request or discard
│   ├── web/                      implement-web: frontend design and React practice (an idea)
│   ├── agent-tools/              implement-agent-tools: tools that agents drive: CLI contracts, MCP servers, packaging
│   └── code/                     implement-code: how to write code in each language well; act sends every file written
│       │                         to its language's skill; each shares one source with the repository profile for that
│       │                         language in maintain-repo (D67, D68)
│       ├── python/               implement-code-python: Python written to the house style; its checks come from the
│       │                         repository profile (an idea)
│       ├── typescript/           implement-code-typescript: TypeScript written to the house style; its checks come from
│       │                         the repository profile (an idea)
│       ├── bash/                 implement-code-bash: Bash written to the house style; its checks come from the
│       │                         repository profile (an idea)
│       ├── go/                   implement-code-go: Go written to the house style; its checks come from the repository
│       │                         profile (an idea)
│       └── rust/                 implement-code-rust: Rust written to the house style; its checks come from the
│                                 repository profile (an idea)
│
├── test/                         test: [softeng] checking that it works
│   ├── tdd/                      test-tdd: test first; characterisation tests before a risky refactor
│   ├── debug/                    test-debug: a loop that goes red, the root cause, one change at a time → test-tdd,
│   │                             understand-research-analyze
│   ├── browser/                  test-browser: a web app tested in a real browser (an idea)
│   └── experiment/               test-experiment: a product tested by fleets of agents, profiles, sweeps (D41)
│
├── review/                       review: [softeng] judging a change before it lands (design reviews: design-review,
│   │                             under design, because its findings become decisions (D39))
│   ├── code/                     review-code: review a change; receive a review
│   └── pr/                       review-pr: a pull request that shows the change and the evidence it works
│
├── ship/                         ship: [softeng] getting it to people, within maintain-repo's release rules
│   ├── build/                    ship-build: compiling and packaging what ships (an idea)
│   ├── release/                  ship-release: cut a release: notes, CI on the exact commit, rehearsal, promotion
│   ├── deploy/                   ship-deploy: through a protected environment; previews; a check after each deploy (an
│   │                             idea)
│   ├── rollback/                 ship-rollback: a written, tested way back, and running it (an idea)
│   ├── infra/                    ship-infra: environments, infrastructure as code, containers, secrets in place (an
│   │                             idea)
│   ├── wizard/                   ship-wizard: steps only a person can take, as an interactive script
│   ├── monitor/                  ship-monitor: watching what runs; alerts without fatigue (an idea)
│   └── incident/                 ship-incident: responding when it breaks, and the review after (an idea)
│
├── maintain/                     maintain: [softeng] keeping it healthy over time
│   ├── repo/                     maintain-repo: the repository standard: files, checks, CI, settings, upkeep (D37)
│   │   ├── setup/                maintain-repo-setup: a project's scope recorded: its conditions and profiles
│   │   ├── create/               maintain-repo-create: a new repository created to the standard
│   │   ├── audit/                maintain-repo-audit: a repository checked against every rule in its scope
│   │   ├── close-gaps/           maintain-repo-close-gaps: what the audit found, fixed or recorded as accepted
│   │   └── keep/                 maintain-repo-keep: upkeep: the health workflow, renewals, settings drift
│   └── fork/                     maintain-fork: a long-lived fork kept mergeable
│
├── authoring/                    authoring: [authoring] author renamed (D154): writing work for people, sorted by
│   │                             reader: the project's record, users, stakeholders, the public; editing; markdown, the
│   │                             format (D67, D69)
│   ├── blueprint/                authoring-blueprint: [blueprint] the form of each kind of blueprint document: idea,
│   │                             session note, research note, decision record, evidence entry, requirements, design
│   │                             document, roadmap and tasks, workstream; design's recording steps call it, and keep
│   │                             the filing and tracking themselves (D69)
│   ├── docs/                     authoring-docs: documentation for the people who use what was built: docs pages,
│   │                             guides, READMEs; co-writing a document with the person (D69) (an idea)
│   ├── business/                 authoring-business: documents for stakeholders: status update, report, proposal,
│   │                             one-pager, memo, email; a design rendered as one PRD-style document; office formats
│   │                             through Anthropic's document skills (D69) (an idea)
│   ├── articles/                 authoring-articles: articles built from fragments, beats and shape (an idea)
│   ├── edit/                     authoring-edit: a written text improved in passes, each asking one checkable question,
│   │                             structure before sentences before words; as many passes as the text needs; in one
│   │                             call, passes can run as parallel agents whose proposed changes are consolidated (D70)
│   │                             → conduct-delegate
│   ├── issue/                    authoring-issue: an issue written for whoever was not in the conversation: posting
│   │   │                         through guardrails, the project's templates winning, a security problem never public
│   │   │                         (D127)
│   │   ├── bug/                  authoring-issue-bug: what happened against what was expected, steps to reproduce,
│   │   │                         environment, evidence with secrets removed (D127) (an idea)
│   │   └── feature/              authoring-issue-feature: the problem first, the proposal, alternatives, what is out of
│   │                             scope (D127) (an idea)
│   ├── reader/                   authoring-reader: a document read as its intended reader would, with only the
│   │                             document, often by a fresh agent: can a builder build, an implementer start, an agent
│   │                             resume or act, a user follow; name to settle (D123)
│   └── markdown/                 authoring-markdown: how markdown is laid out: seven structure rules for every response
│                                 and document (headings for sections, tables only when they fit in 120 characters,
│                                 prose unwrapped, code fenced), and the file rules a linter checks, a project's own
│                                 configuration winning; the main skill reads it at the start (D68, D95, D110, D111)
│
└── rigs/                         rigs: [a later set] the programs agents drive: git and the GitHub CLI, other agent
                                  programs for delegation, herdr, nvim, containers; one home per program for delegate,
                                  council and setup; to design (D103) (an idea)
```

## design's flow

A draft of design's main skill (D38, D46, D47), `design`: how to design anything, step by step. Each step names the sub-skill it calls. Wherever a step produces something worth keeping, it calls one of design's recording sub-skills, which file the result in the project's `blueprint/` folder, which every project using skillbook has (D117). Since the sets, the recording steps are the blueprint set's (D154).

```text
frame → analyse → discuss and decide → write the design → review → plan → hand to implement
           ▲         │ needs evidence: research    │ open questions      │                  │
           │         └─────────────────────────────┘◄────────────────────┘                  │
           └──────────────────── the design adjusted from what the code shows ◄──────────────┘

with a blueprint, each step's result is recorded by one of design's sub-skills
```

```markdown
## Frame

Find out what is to be designed and why: the goal, the constraints, what is out of scope. When the request is
unclear, clarify it with understand. With a blueprint, record the idea (`design-discuss`). Then analyse.

## Analyse

Read what exists: the code, the documents, the current design. When a question needs sources, research it through
understand. With a blueprint, findings become research notes (`design-research`). Then discuss.

## Discuss and decide

Work through the open questions with the person, one at a time, through understand: a deep clarify for a whole plan, a
brainstorm when options are needed. understand hands back what was decided, what was parked and what comes next (D50,
D51, D53). Weigh each option against the principles below. When the person agrees, it is a decision; with a blueprint,
record it (`design-decide`). When every question is answered or parked, write the design.

## Write the design

Describe the design: its parts, what each does, how they connect; for software, `design-architecture`.
With a blueprint, write it into the requirements and design, in the root or in the change's workstream
(`design-write`, `design-workstream`). Then review it.

## Review

Check the design through the review lenses (`design-review`). Problems send it back to Discuss and
decide; a sound design goes to Plan.

## Plan

Hand the design to plan to be broken into steps; with a blueprint, the tasks are written into it
(`design-tasks`). Then hand the first task to implement.

## Adjust from the code

When the code and the design disagree, return to Discuss and decide: the code does not quietly win. With a
blueprint, keep it in step during a task (`design-work`), bring in changes made elsewhere
(`design-sync`), and fold a finished workstream into its parent (`design-consolidate`).

## Principles

To write when design is designed: top-down, goals before parts; a correction goes up to the level it belongs to;
every decision carries its reasons; the person agrees before anything is decided; the design is settled before it
is built, and follows the code back.
```

Daily routines stay outside it (D31); learning from a session lives in conduct.

## Counts

| Root | Skills | with material | ideas |
| --- | --- | --- | --- |
| conduct | 24 | 24 | 0 |
| understand | 15 | 15 | 0 |
| design | 16 | 16 | 0 |
| plan | 1 | 1 | 0 |
| implement | 14 | 8 | 6 |
| test | 4 | 3 | 1 |
| review | 2 | 2 | 0 |
| ship | 8 | 2 | 6 |
| maintain | 7 | 7 | 0 |
| authoring | 10 | 5 | 5 |
| rigs | 1 | 0 | 1 |

102 skills in conduct and the ten roots, and the main skill above; their reference files are not named yet. A part's row counts the part itself. Only each set's main skill costs context every turn (D56, D152).

## The shape

Since the sets (D152, D154), the roots are divided among essentials, blueprint, softeng and authoring, and the lifecycle is no longer general: design and plan are essentials', the stages after plan softeng's, and writing's own authoring's; what follows is the earlier shape, kept for its reasoning. Nine roots and the conduct group under the main skill (D56, D63, D64, D76). The seven stages are the lifecycle of a project (D35, D36); the main skill holds their order, and each stage says what comes next. Today every stage holds only its software specialisation; how each one serves other kinds of work is still to design.

```text
lifecycle      design → plan → implement → test → review → ship → maintain
conduct        respond · act · organize · explain · verify · guardrails · instruct · setup · learn ·
               delegate · handoff
activities     understand (clarify, brainstorm, naming, research) · authoring
```

A request takes two loads below the main skill at most for a stage's own skills: a failing test reaches `test-debug` through `test`.

Where an activity and a subject meet ("review my essay"), the rule is still open: the activity owns the process and the subject its conventions, or the subject owns the whole of its kind of work.

## Not placed

- **Skills that ship with their tools:** herdr and herdsman (agents in panes), slipbox (its notes CLI), the person's `nvim-remote`; skillbook leaves them to the person, who names one when wanted, since skills stay generic (D139).
- **Installed elsewhere:** Anthropic's document skills (pdf, docx, pptx, xlsx) are proprietary and already installed; their deep-research skill overlaps survey.
- **Parked:** Anthropic's `discernment-nudge` (check questions after an answer), the official `math-proof/solo` (long work with a notes file and safe resume), gstack's `office-hours`.

## The graph

Calls between skills, beyond each skill loading its own sub-skills.

- **conduct-delegate** ← design-consolidate, design-parallel, design-review, implement-plan, understand-research (survey above all), test-experiment, conduct-delegate-council.
- **authoring-markdown** ← conduct-respond, for every response (D95). **authoring-markdown** and each **implement-code** language skill ← conduct-act, before every file of their type is written (D67, D68); markdown also ← maintain-repo.
- **conduct-instruct** ← conduct-setup, when it writes into an instruction document (D94).
- **test-tdd** ← implement-plan, test-debug. **review-code** and **conduct-verify** ← implement-plan.
- **understand** (discuss, clarify deep, brainstorm, research) ← design; other roots reach understand's skills through the main skill (D51, D56).
- **understand-research** ← test-experiment; understand's frame, brainstorm, weigh, challenge, argue and naming, for a fact. **understand-research-analyze** ← test-debug, when the cause is not obvious, and ship, for an incident's cause.
- **design** ← conduct-learn, to record decisions. **design-architecture** ← test-tdd, for the deep-module vocabulary.
- **understand-naming** ← design, for unclear terms. **conduct-verify** ← conduct-delegate, for verifiers.
- **understand-argue** ← understand-weigh, for each option in a debate; understand-discuss; conduct-respond, for the person's view at its strongest; authoring, for a proposal's case. **understand-challenge** ← understand-argue, for its objections.
- **implement-git** ← maintain-repo.
- **maintain-repo's release rules** ← ship-release, ship-deploy, ship-rollback: the contract shipping works within.
- **ship-wizard** ← ship-infra, ship-release.
- **conduct-respond** and **conduct-act** ← the main skill, first, once per conversation; respond again before each response is returned (D63, D81).
- **authoring-blueprint** ← design's recording steps (discuss, research, decide, write, workstream, tasks), for each document's form (D69). **conduct-delegate** ← authoring-edit, for passes run in parallel (D70).
- **conduct-organize** ← design (an idea document split into sub-documents), plan (dividing a plan's work; the former plan-breakdown is kept in [plan's ideas](plan.md), D151), authoring-docs, and skillbook-tree for placing a skill (D61, D77).

## The roots, provisional

Draft descriptions. Since only each set's main skill is listed (D56, D152), these are read by the main skill's routing and by the person in the slash menu, not matched by the model every turn. The main skill's own, as tested (D57):

- **main skill:** *"Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, git commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills."*

- **authoring** (was author, D154, and before that write, D67): *"Writing work for people. Use when writing a blueprint document (an idea, a note, a decision, a design), documentation for users, a document for stakeholders (a status update, report, proposal or memo), or an article, or when editing a text."*
- **understand:** *"Understanding before acting, with the person and from sources: a topic discussed item by item, what the person means clarified, facts found out, options explored, a problem framed, a choice weighed, an idea challenged, a case made for a position, a name chosen. Use when a request is unclear, the person wants to discuss something or be questioned, options or a choice are wanted, an idea should be tested before it's relied on, a position should be argued at its strongest, a question needs facts from sources, or something needs a name."* (D131, D132)
- **research** (now under understand, D59): *"Finding out. Use when researching a question across sources, surveying tools or prior art, analysing causes, or writing up findings with their sources."*
- **conduct** (with what was agents, D67): *"How the agent acts. Use when setting up an agent's files, delegating to subagents, handing work to another agent, verifying work, or reviewing what a session taught."*

The parts keep their drafts, now read by the root that routes to them and by the person in the slash menu:

- **design:** *"Design: shaping what to make. Use when an idea needs a design, a project has a blueprint, or a design needs reviewing or updating from the code."*
- **plan:** *"Plan: deciding the steps of any piece of work before acting. Use when order matters, an approach must be chosen, stakes are medium or higher, or the work is long or wide."* (D151; the former description is kept in [plan's ideas](plan.md))
- **implement:** *"Implement: making it. Use when carrying out a plan or a task, prototyping to answer a question, working with git, building a web front end, or a tool agents drive."*
- **test:** *"Test: checking that it works. Use when writing tests, testing first, debugging a failure, or testing in a browser."*
- **review:** *"Review: judging a change before it lands. Use when reviewing code or a pull request, answering a review, or writing a pull request."*
- **ship:** *"Ship: getting it to people. Use when building, releasing or deploying, rolling back, setting up environments, or handling an incident."*
- **maintain:** *"Maintain: keeping it healthy. Use when creating, auditing or keeping a repository and its CI, or keeping a fork in step with upstream."*

## Where the material comes from

For each skill, the sources that already hold material for it: read them before writing it (D30). sk is skillbook's first design; mp mattpocock/skills, sp superpowers, an Anthropic's skills, cc Claude Code's official plugins, gs gstack, ar alirezarezvani/claude-skills, vc vercel's agent skills; own the person's current skills; and the person's projects: ws workslate and rig, vo VaultOps and the agent specs, oc OpenCode customisations, lc loomcraft and infoloom, sb slipbox, ts trailscout, hs herdsman, md meddah.

- **conduct:** conduct-respond (own, md, mp); conduct-act (own, vo, sp); conduct-ask (own, mp); conduct-organize (vo); conduct-organize-split (vo); conduct-organize-merge (vo); conduct-organize-compose (vo); conduct-organize-normalize (vo); conduct-organize-cluster (vo); conduct-explain (mp); conduct-verify (sp, md, ws); conduct-guardrails (vo, sb, lc, gs, ts); conduct-stakes (own); conduct-rightsize (own, mp); conduct-cleanup (own, sp, ar, an); conduct-instruct (mp, sp, ws, oc); conduct-setup (cc, lc); conduct-learn (ws, mp, gs, cc); conduct-delegate (own, ts, md, sp, vo); conduct-delegate-council (ws); conduct-delegate-fanout (own, ts); conduct-delegate-crew (md); conduct-brief (own, mp); conduct-carryover (ws, mp, oc, gs, ar).
- **understand:** understand-discuss (own, oc, sp); understand-clarify (oc, mp); understand-clarify-shallow (oc); understand-clarify-deep (mp); understand-clarify-questionnaire (mp); understand-frame (oc, vo); understand-brainstorm (oc, sp, vo); understand-weigh (oc, vo); understand-challenge (vo); understand-argue (gs, ar); understand-naming (md, mp); understand-research (mp, ar, own); understand-research-fact (ar, mp, gs); understand-research-survey (ts, an, own, ar); understand-research-analyze (ws, gs, sp, ar).
- **design:** design-architecture (mp, hs); design-review (ts, mp); design-start (sk); design-discuss (sk, mp); design-research (sk, ts); design-decide (sk, mp); design-evidence (sk); design-write (sk); design-workstream (sk); design-tasks (sk, mp); design-work (sk); design-sync (sk); design-consolidate (sk); design-parallel (sk); design-check (sk); design-publish (sk).
- **plan:** plan (none yet).
- **implement:** implement-prototype (mp); implement-plan (sp, mp); implement-git (ws, hs, sp, mp); implement-git-worktree (sp); implement-git-commit (ws, hs); implement-git-finish (sp); implement-web (an, vc); implement-agent-tools (sb, ws, ts, an); implement-code; implement-code-python (sk); implement-code-typescript (sk); implement-code-bash (sk); implement-code-go (sk); implement-code-rust (sk).
- **test:** test-tdd (mp, sp, hs); test-debug (mp, sp, hs, gs); test-browser (an); test-experiment (md, ts, own).
- **review:** review-code (mp, sp, ws); review-pr (mp).
- **ship:** ship-build (none yet); ship-release (hs, ws); ship-deploy (none yet); ship-rollback (none yet); ship-infra (none yet); ship-wizard (mp); ship-monitor (ws); ship-incident (none yet).
- **maintain:** maintain-repo (sk); maintain-repo-setup (sk); maintain-repo-create (sk); maintain-repo-audit (sk); maintain-repo-close-gaps (sk); maintain-repo-keep (sk); maintain-fork (hs).
- **authoring:** authoring-blueprint (sk, mp, ts); authoring-docs (an, hs, mp, md); authoring-business (ws, an); authoring-articles (mp); authoring-edit (md); authoring-issue (mp, sk); authoring-issue-bug (none yet); authoring-issue-feature (none yet); authoring-reader (sp); authoring-markdown (own).
- **rigs:** rigs (none yet).

## Compared with mattpocock/skills

In [mattpocock-comparison.md](../notes/mattpocock-comparison.md): where each of his skills sits in this tree, what his set has that ours lacks, and the other way round.

## Questions for the brainstorm

1. **understand, in detail:** each skill stripped of its old tools' conventions (D50); its root's flow is the discussion and design's discuss the record (D53).
2. **How each activity specialises** for kinds of work other than software (D35), and how a lifecycle activity meets authoring and understand ("review my essay"). Settled in part (D154): the lifecycle is no longer general, and each set holds its own stages.
3. **shipping's reach:** whether running what was shipped (monitor, incident) stays in ship or becomes its own part.
4. **Listed besides the roots,** settled: markdown-style became author-markdown, reached through act's rule for every file written; agent-writing became conduct-instruct, with skillbook's own conventions in the project skill skillbook-tree (D67). Was: markdown-style fires on every markdown edit; agent-writing is called from `AGENTS.md`.
5. **The thin branches:** ship's, authoring's and code's ideas: placeholders, or left out until needed.
6. **Moving in:** `delegation-routing`, which lives in the person's dotfiles today, into conduct-delegate.
7. **Names under a group,** settled: there is no group layer left; names start at the stage (`design-start`, D76).
8. **Scope:** topics beyond keeping projects well widen skillbook's requirements and `SCOPE.md`.
9. **Flows:** the other routes (a bug, a source, a meeting, a question) drawn like design's; and Matt's gap still open, phase boundaries.
10. **Evaluation first:** how skills are tested before and after they are written (ideas.md).
