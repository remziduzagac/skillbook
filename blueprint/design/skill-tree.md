# Design: the skill tree

The tree of skills, by set, as decided; a skill marked (an idea) is placed but not designed (D152, D154, D167). It is rendered from [tree/tree.json](tree/tree.json) by [tree/render.py](tree/render.py): edit the JSON, render, and paste the outputs here, as the script's header says. What is still open about the tree is in [../ideas/skill-tree.md](../ideas/skill-tree.md), and the later sets' skills in [../ideas/later.md](../ideas/later.md).

## How to read it

- **Each skill has a short name in its parent's path;** its name, shown before its description, is that path joined by dashes: `devise/design/` is `devise-design` (D43, D71). A set's main skill is a folder with a `SKILL.md`, and every other skill is a plain file under its `references/`, at the path its name gives: `devise-design` is `references/devise/design.md`, its own scripts and templates in `scripts/` and `assets/` inside the folder `references/devise/design/` (D44, D188); the sample below shows it once.
- **Each set's main skill** is model-invoked, its description in the agent's context every turn (D56, D152). Every other skill, the roots included, is a **sub-skill**: a plain file that costs nothing until read, read as the file its name gives, by its set's name rule, when a skill names it; the person does not type it, but asks for it in words, such as "use devise-design" (D188).
- **essentials' main skill,** on the `essentials/` line, sits above the roots: its rules and advice come first; its instructions say when to use each root, in the order the work happens; and every response is checked against respond before it is returned (D56, D63, D81, D112, D178). Beside the roots, **act** holds how the agent works and **respond** everything said to the person, in every root (D179).
- **(an idea)** marks a skill with no worked-out material anywhere yet; **→** marks a skill it calls.
- **The roots:** the stages, named by bare verbs (D35, D36, D76): softeng's are implement, test, review, ship and maintain, with its own design and plan; essentials' design and plan sit under devise, not at the top (D154, D164); understand is a verb too, and act, respond, coordinate, organize and authoring, groups, are nouns or set names (D40, D67, D154). A knowledge base and routines are later sets (D64, D152), their skills ideas in [../ideas/later.md](../ideas/later.md) (D167).

## The tree

A main skill and two levels below it, as a sample of the shape every set has (D43, D44, D188):

```text
essentials/                              the main skill's folder, the only skill the harness lists
├── SKILL.md                             the rules, the advice, and when to use each group (D112)
└── references/                          the other skills, each a plain file at the path its name gives
    ├── devise.md                        devise, a group
    └── devise/                          the folder of the same name, for devise's children
        ├── design.md                    devise-design
        └── design/                      the folder of the same name, for design's own files
            ├── scripts/                 what design runs
            └── assets/                  what it copies out, such as templates
```

The tree shows each skill by its path. Its paths are provisional until the layout is decided with the install routes; the tree is one block per set, each starting with a line for the set's main skill, and a part whose set differs from its root's stands in its own set's block, design's recording steps in blueprint's, design's architecture in softeng's (D152, D154).

```text
essentials/                       essentials, essentials' main skill, listed to the model like every set's main skill
│                                 and the one loaded first for any work: four rules for every request (every skill a
│                                 request needs is used, delegation by default, the wrap-up offer, the name rule), then
│                                 seven steps, each loading its group when its step comes: understand the request, act's
│                                 rules throughout, devise, organize and coordinate when needed, do it through another
│                                 set's main skill or directly, respond always; of the other sets, authoring's markdown
│                                 for now (D56, D152, D153, D171, D177, D178, D179)
│
├── understand/                   understand: understanding before acting, with the person and from sources: its own
│   │                             skill holds the rules for the whole scope (keeps nothing, one result shape, guesses
│   │                             marked, facts first, who decides, nothing changed for good) and one routing line per
│   │                             sub-skill under five headings; other roots reach it through the main skill (D50, D56,
│   │                             D112, D130, D131)
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
│   │                             challenged, weighed through weigh, then decided through respond's ask or parked; keeps
│   │                             nothing, a keeper records it (D53, D118, D163)
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
│       │                         coordinate-delegate (D128)
│       └── analyze/              understand-research-analyze: why something happens: the symptom stated, one testable
│                                 cause at a time, the chain traced back to its trigger, the fix left to the caller;
│                                 test-debug asks for it when the cause is not obvious (D59, D128)
│
├── act/                          act: how the agent works, its rules holding for all the work and its tools loaded when
│   │                             a step needs them: clarify before acting, through clarify; an opinion is not a task; a
│   │                             concern that would change the work asked and waited on, then exactly what was asked;
│   │                             evidence before any claim, through verify; guardrails before a risky action; the skill
│   │                             for a file's type; a skill by its route; stop when attempts keep failing; which
│   │                             instruction wins; running as a delegated agent (D58, D63, D72, D84, D107, D115, D116,
│   │                             D177, D179)
│   ├── stakes/                   act-stakes: how much care something deserves, judged from facts: Undo, Reach, Catch
│   │                             and Cost, and one level, low, medium or high, the higher when unsure and never below a
│   │                             rule; it judges and the caller acts: guardrails, delegate, verify, weigh and
│   │                             understand map it (D121, D133)
│   ├── guardrails/               act-guardrails: risky actions in eight kinds (irreversible, wide, outward, outside the
│   │                             task, costly, others' text and code, weaker checks, secrets): proposed with their
│   │                             scope, approved, applied exactly, checked; which text is an instruction and which is
│   │                             data; trivial cost, the project's own commands, safe writes, the network, proportion,
│   │                             the never-rules (D91, D92, D107, D115)
│   ├── cleanup/                  act-cleanup: what the agent itself created and no longer needs, removed by exact path
│   │                             or ID: its own without asking, the rest proposed; what is kept said with why; act
│   │                             names it before "done" (D126, D129)
│   ├── verify/                   act-verify: evidence before claiming work is done, fixed, passing or meets its
│   │                             requirements: the check chosen, run fresh, and who checks; four further checks for a
│   │                             plan's task, a commit or a pull request (D89, D107)
│   └── rightsize/                act-rightsize: nothing missing and nothing extra for the reader, parts comprehensive
│       │                         and exclusive, the point first, and the work rightsized; a five-question check that
│       │                         respond, authoring, organize, brief, carryover, instruct and act run; its two parts
│       │                         rework what already exists (D145, D157)
│       ├── lean/                 act-rightsize-lean: something that exists, its extra parts removed: each part judged
│       │                         by what it does for its reader, what does nothing cut, pasted content turned into
│       │                         pointers, repeats through organize's merge, nothing a rule requires lost; the list
│       │                         approved where others' work changes; code under tests (D157)
│       └── enrich/               act-rightsize-enrich: something that exists, its missing parts added: what its reader
│                                 would still ask, answered from the project, the person or research, each addition
│                                 sourced and checked, never invented, what cannot be found marked as a gap (D157)
│
├── organize/                     organize: arranging things, written or still planned: rules (one dividing principle,
│   │                             each boundary in one sentence, meaning preserved, the person verifying plan and
│   │                             result, retiring, code through implement; the middle three only when something
│   │                             existing changes), the check of existing parts, then one routing line per operation;
│   │                             units of any kind, examples across writing, code and design (D61, D85, D86, D107,
│   │                             D141, D148, D164)
│   ├── split/                    organize-split: one item, written or still planned, into several parts that do not
│   │                             overlap and cover it; each part readable on its own and sized to how it is read;
│   │                             VaultOps' decompose (D85, D148)
│   ├── merge/                    organize-merge: several redundant items fused into one survivor, links pointing at the
│   │                             others updated (D85)
│   ├── compose/                  organize-compose: a new parent over the items that share something, stating what they
│   │                             share; the items moved under it where needed, their content unchanged (D85, D87, D174)
│   ├── normalize/                organize-normalize: the part several items share taken out into one place they all use
│   │                             (D85)
│   └── cluster/                  organize-cluster: a view added for finding items, the items unchanged: an index,
│                                 grouping for navigation; a map pays for items agents read often (D85, D148)
│
├── coordinate/                   coordinate: working with agents not in this conversation, now, later and in every
│   │                             session: work given to other agents and what they are told, work carried over to a
│   │                             later session, the instruction documents every session reads, skillbook set up, and
│   │                             what a session taught; its own file holds one routing line per sub-skill (D164)
│   ├── delegate/                 coordinate-delegate: work given to other agents, the default for any task that is not
│   │   │                         too small: the type first, after a cost check, then fork or fresh by what the task
│   │   │                         needs from the conversation and how long it is, then the tier, and the effort apart
│   │   │                         from it, tiers never named as models; the cost, a running list while the conversation
│   │   │                         goes on, the work checked; one routing line each for council, fanout and crew; within
│   │   │                         the harness's limits and its own means (D65, D99, D107, D115, D138, D139, D142, D143,
│   │   │                         D144, D147); what the agent is told is brief's
│   │   ├── council/              coordinate-delegate-council: several agents, about three, answer the same question on
│   │   │                         the same material independently; a summary keeping disagreements; the person decides
│   │   │                         (D99, D101, D107, D115)
│   │   ├── fanout/               coordinate-delegate-fanout: the work split into parts, each agent with a place or a
│   │   │                         sub-question the others do not have; findings with their sources consolidated by a
│   │   │                         script, which checks each quote, then validated and synthesized (D99, D107, D115)
│   │   └── crew/                 coordinate-delegate-crew: several agents each change their own items of one job; a
│   │                             shared item has one owner, who applies the others' proposals; then one pass in
│   │                             sequence (D99, D107, D115)
│   ├── brief/                    coordinate-brief: what an agent that was not in the conversation is told when it
│   │                             starts: what it needs to start without asking, decisions and constraints not in the
│   │                             files, what was ruled out, the first step and when it is done, references by path, no
│   │                             tool only the writer has; a line or two for a fork, findings for a fresh agent, and
│   │                             the report it asks back; carryover builds on it (D138, D146, D147)
│   ├── carryover/                coordinate-carryover: work carried over to a later session or agent, built on brief's
│   │                             rules: ten parts, top-down, from the goal and where it stands to the first next step
│   │                             and what it was written against, standing alone, as long as its reader needs, a fresh
│   │                             agent's cold read before it is shown; offered at a task's, milestone's or phase's end
│   │                             in a long session, before compaction or a fresh session; one file each, named by date
│   │                             and time, the newest resumed (D65, D104, D147, D160, D161, D162, D169)
│   ├── instruct/                 coordinate-instruct: writing and updating instruction documents: AGENTS.md, CLAUDE.md,
│   │                             CLAUDE.local.md and the person's own; called by setup, or asked for at any time (D94)
│   ├── setup/                    coordinate-setup: setting skillbook up, on request: the pointer where the skills are
│   │                             installed, a project's local file by default, its shared file when the team commits
│   │                             the skills, or moved between them; in a project, its blueprint started where that set
│   │                             is installed, its instruction files checked, skills recommended; adds existing skills,
│   │                             makes none (D93, D97, D117, D163, D165)
│   └── learn/                    coordinate-learn: what a session taught, when asked: highlights collected, judged and,
│                                 with approval, made into a rule through instruct, or a decision or an insight for the
│                                 keeper, or dropped; skill promotion and where highlights wait are future work (D66,
│                                 D98, D107, D163) → instruct
│
├── respond/                      respond: everything said to the person, the last step of every request: how every
│   │                             response is prepared before it is returned: necessary and sufficient, things named in
│   │                             words, top-down when explaining, plain words, outcomes as they happened, no guardrail
│   │                             broken; questions through ask; the main skill checks each response against it (D60,
│   │                             D81, D95, D107, D114, D115, D179)
│   ├── layout/                   respond-layout: how anything written in markdown is laid out: six structure rules
│   │                             (headings for sections, bold only for labels, tables only for short values, prose
│   │                             unwrapped, numbers where things are referred to by number, code fenced), lists over
│   │                             tables as strong advice; loaded by respond for every response; authoring's markdown
│   │                             adds the file rules (D111, D158)
│   ├── ask/                      respond-ask: how the agent asks the person anything: numbered questions under their
│   │                             own headings, each with a recommended answer; one round or one by one; go ahead,
│   │                             parked and assumed; proposals put the same way; the harness's question tool for a few
│   │                             closed choices (D114, D159)
│   └── explain/                  respond-explain: something the agent itself said that did not land, explained
│                                 top-down: where we are, the point, what it rests on in words, an example; stops once
│                                 it is clear; explaining something new is understand's (D54, D63, D96, D107)
│
└── devise/                       devise: deciding what the work will be and its steps: design, how to design anything,
    │                             and plan, planning multipart work and following it; its own file routes to each (D164)
    ├── design/                   devise-design: how to design anything: what something will be, decided before it is
    │   │                         made; three checks (settled, given, short or full); frame, analyse, divide through
    │   │                         organize, discuss and decide through understand, write, review, approve, then plan,
    │   │                         the design changed first when building shows it wrong; a full design's eight parts;
    │   │                         kept in the response or a file, a keeper saying where (D46, D47, D163, D168)
    │   └── review/               devise-design-review: a design checked before approval through six lenses: consistency
    │                             and a builder walk-through, its own; coverage and overlap (organize's check),
    │                             challenge, lean, and architecture where softeng is installed; findings ranked with
    │                             fixes, the reviewer only proposing, a fresh agent reviewing a full design (D39, D154,
    │                             D168)
    └── plan/                     devise-plan: planning multipart work before acting, and following it step by step:
                                  none for single-step work; given steps followed and enhanced where not obvious, by the
                                  obvious test; one line, or a full plan, divided through organize and challenged, when
                                  stakes are high or the work is long or wide; approval when stakes are high, asked for,
                                  or a question is in it; revised when a step fails (D151, D155) (kept in the response
                                  or a file; a keeper the project points to, such as blueprint, says which file (D156))

blueprint/                        blueprint, the blueprint set's main skill: a project's spec-to-dev flow and its
│                                 records, from the idea to the hand-over to code, its files and folders, the procedures
│                                 that keep them intact, and the form of each document (D46, D47, D154)
│
├── start/                        design-start: a blueprint started, or an existing project described into one
├── discuss/                      design-discuss: ideas and session notes recorded
├── research/                     design-research: research notes recorded with their sources
├── decide/                       design-decide: decisions recorded with their reasons, and notes under earlier ones
├── evidence/                     design-evidence: an evidence entry recorded: the claim, what was run or seen, who
│                                 verified it, what it supports (D90)
├── write/                        design-write: requirements and design updated, in the root or a workstream
├── workstream/                   design-workstream: a workstream opened for a change, with its key and status
├── tasks/                        design-tasks: roadmap steps and tasks written from the plan
├── work/                         design-work: the design kept in step while a task is implemented
├── sync/                         design-sync: the design brought up to date with code changed elsewhere
├── consolidate/                  design-consolidate: a finished workstream folded into its parent, then reviewed
├── parallel/                     design-parallel: several agents at once: staged mode, pending files
├── check/                        design-check: the folder's health; maintain points here (D39)
├── publish/                      design-publish: a private blueprint made public (D39)
└── forms/                        authoring-blueprint: the form of each kind of blueprint document: idea, session note,
                                  research note, decision record, evidence entry, requirements, design document, roadmap
                                  and tasks, workstream; design's recording steps call it, and keep the filing and
                                  tracking themselves (D69) (name provisional)

softeng/                          softeng, the softeng set's main skill: how good software is designed and made: its own
│                                 design, architecture among it, planning's software parts, implement, test, review,
│                                 ship and maintain (D36, D67, D68, D154)
│
├── design/                       how good software is designed (D154)
│   └── architecture/             design-architecture: software's design knowledge: deep modules, seams, contracts, hot
│                                 paths
│
├── plan/                         plan's software parts: breakdown, slices and sequence, kept in ideas/plan.md, for the
│                                 person's own software-engineering skills (D151, D154)
│
├── implement/                    implement: making it, by carrying out the design
│   ├── prototype/                implement-prototype: throwaway work that answers one design question → cited by design
│   ├── plan/                     implement-plan: a plan carried out task by task → test, review, act-verify,
│   │                             coordinate-delegate
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
├── test/                         test: checking that it works
│   ├── tdd/                      test-tdd: test first; characterisation tests before a risky refactor
│   ├── debug/                    test-debug: a loop that goes red, the root cause, one change at a time → test-tdd,
│   │                             understand-research-analyze
│   ├── browser/                  test-browser: a web app tested in a real browser (an idea)
│   └── experiment/               test-experiment: a product tested by fleets of agents, profiles, sweeps (D41)
│
├── review/                       review: judging a change before it lands (design reviews: design-review, under design,
│   │                             because its findings become decisions (D39))
│   ├── code/                     review-code: review a change; receive a review
│   └── pr/                       review-pr: a pull request that shows the change and the evidence it works
│
├── ship/                         ship: getting it to people, within maintain-repo's release rules
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
└── maintain/                     maintain: keeping it healthy over time
    ├── repo/                     maintain-repo: the repository standard: files, checks, CI, settings, upkeep (D37)
    │   ├── setup/                maintain-repo-setup: a project's scope recorded: its conditions and profiles
    │   ├── create/               maintain-repo-create: a new repository created to the standard
    │   ├── audit/                maintain-repo-audit: a repository checked against every rule in its scope
    │   ├── close-gaps/           maintain-repo-close-gaps: what the audit found, fixed or recorded as accepted
    │   └── keep/                 maintain-repo-keep: upkeep: the health workflow, renewals, settings drift
    └── fork/                     maintain-fork: a long-lived fork kept mergeable

authoring/                        authoring: author renamed (D154): writing work for people, sorted by reader: the
│                                 project's record, users, stakeholders, the public; editing; markdown, the format (D67,
│                                 D69)
│
├── docs/                         authoring-docs: documentation for the people who use what was built: docs pages,
│                                 guides, READMEs; co-writing a document with the person (D69) (an idea)
├── business/                     authoring-business: documents for stakeholders: status update, report, proposal,
│                                 one-pager, memo, email; a design rendered as one PRD-style document; office formats
│                                 through Anthropic's document skills (D69) (an idea)
├── articles/                     authoring-articles: articles built from fragments, beats and shape (an idea)
├── edit/                         authoring-edit: a written text improved in passes, each asking one checkable question,
│                                 structure before sentences before words; as many passes as the text needs; in one
│                                 call, passes can run as parallel agents whose proposed changes are consolidated (D70)
│                                 → coordinate-delegate
│
├── issue/                        authoring-issue: an issue written for whoever was not in the conversation: posting
│   │                             through guardrails, the project's templates winning, a security problem never public
│   │                             (D127)
│   ├── bug/                      authoring-issue-bug: what happened against what was expected, steps to reproduce,
│   │                             environment, evidence with secrets removed (D127) (an idea)
│   └── feature/                  authoring-issue-feature: the problem first, the proposal, alternatives, what is out of
│                                 scope (D127) (an idea)
│
├── reader/                       authoring-reader: a document read as its intended reader would, with only the
│                                 document, often by a fresh agent: can a builder build, an implementer start, an agent
│                                 resume or act, a user follow; name to settle (D123)
└── markdown/                     authoring-markdown: the file rules a linter checks in markdown files, a project's own
                                  configuration winning, and the linter run; structure comes from essentials' layout,
                                  with a one-line fallback where essentials is not installed (D68, D95, D110, D111,
                                  D158)

├── rigs/                         rigs: the programs agents drive: git and the GitHub CLI, other agent programs for
│                                 delegation, herdr, nvim, containers; one home per program for delegate, council and
│                                 setup; to design (D103) (an idea)
├── (no folder)                   a knowledge base, once vaultops; its skills as ideas in ideas/later.md (D152, D167)
└── (no folder)                   routines; its skills as ideas in ideas/later.md (D152, D167)
```

## Counts

| Set / root | Skills | with material | ideas |
| --- | --- | --- | --- |
| essentials / understand | 15 | 15 | 0 |
| essentials / act | 7 | 7 | 0 |
| essentials / organize | 5 | 5 | 0 |
| essentials / coordinate | 9 | 9 | 0 |
| essentials / respond | 3 | 3 | 0 |
| essentials / devise | 3 | 3 | 0 |
| blueprint / steps and forms | 15 | 15 | 0 |
| softeng / design | 1 | 1 | 0 |
| softeng / plan | 1 | 0 | 1 |
| softeng / implement | 14 | 8 | 6 |
| softeng / test | 4 | 3 | 1 |
| softeng / review | 2 | 2 | 0 |
| softeng / ship | 8 | 2 | 6 |
| softeng / maintain | 7 | 7 | 0 |
| authoring / authoring | 9 | 4 | 5 |
| later / rigs | 1 | 0 | 1 |

104 skills under essentials' groups and the other sets' roots, design and plan counted in each set that has a part of them, and the main skills above; their reference files are not named yet. A part's row counts the part itself. Only each set's main skill costs context every turn (D56, D152).

## Where the material comes from

For each skill, the sources that already hold material for it: read them before writing it (D30). sk is skillbook's first design; mp mattpocock/skills, sp superpowers, an Anthropic's skills, cc Claude Code's official plugins, gs gstack, ar alirezarezvani/claude-skills, vc vercel's agent skills; own the person's current skills; and the person's projects: ws workslate and rig, vo VaultOps and the agent specs, oc OpenCode customisations, lc loomcraft and infoloom, sb slipbox, ts trailscout, hs herdsman, md meddah.

- **understand:** understand-discuss (own, oc, sp); understand-clarify (oc, mp); understand-clarify-shallow (oc); understand-clarify-deep (mp); understand-clarify-questionnaire (mp); understand-frame (oc, vo); understand-brainstorm (oc, sp, vo); understand-weigh (oc, vo); understand-challenge (vo); understand-argue (gs, ar); understand-naming (md, mp); understand-research (mp, ar, own); understand-research-fact (ar, mp, gs); understand-research-survey (ts, an, own, ar); understand-research-analyze (ws, gs, sp, ar).
- **act:** act-stakes (own); act-guardrails (vo, sb, lc, gs, ts); act-cleanup (own, sp, ar, an); act-verify (sp, md, ws); act-rightsize (own, mp); act-rightsize-lean (own, mp); act-rightsize-enrich (own).
- **organize:** organize-split (vo); organize-merge (vo); organize-compose (vo); organize-normalize (vo); organize-cluster (vo).
- **coordinate:** coordinate-delegate (own, ts, md, sp, vo); coordinate-delegate-council (ws); coordinate-delegate-fanout (own, ts); coordinate-delegate-crew (md); coordinate-brief (own, mp); coordinate-carryover (ws, mp, oc, gs, ar); coordinate-instruct (mp, sp, ws, oc); coordinate-setup (cc, lc); coordinate-learn (ws, mp, gs, cc).
- **respond:** respond-layout (own); respond-ask (own, mp); respond-explain (mp).
- **devise:** devise-design; devise-design-review (ts, mp); devise-plan (none yet).
- **steps and forms:** design-start (sk); design-discuss (sk, mp); design-research (sk, ts); design-decide (sk, mp); design-evidence (sk); design-write (sk); design-workstream (sk); design-tasks (sk, mp); design-work (sk); design-sync (sk); design-consolidate (sk); design-parallel (sk); design-check (sk); design-publish (sk); authoring-blueprint (sk, mp, ts).
- **softeng-design:** design-architecture (mp, hs).
- **softeng-plan:** softeng-plan (none yet).
- **implement:** implement-prototype (mp); implement-plan (sp, mp); implement-git (ws, hs, sp, mp); implement-git-worktree (sp); implement-git-commit (ws, hs); implement-git-finish (sp); implement-web (an, vc); implement-agent-tools (sb, ws, ts, an); implement-code; implement-code-python (sk); implement-code-typescript (sk); implement-code-bash (sk); implement-code-go (sk); implement-code-rust (sk).
- **test:** test-tdd (mp, sp, hs); test-debug (mp, sp, hs, gs); test-browser (an); test-experiment (md, ts, own).
- **review:** review-code (mp, sp, ws); review-pr (mp).
- **ship:** ship-build (none yet); ship-release (hs, ws); ship-deploy (none yet); ship-rollback (none yet); ship-infra (none yet); ship-wizard (mp); ship-monitor (ws); ship-incident (none yet).
- **maintain:** maintain-repo (sk); maintain-repo-setup (sk); maintain-repo-create (sk); maintain-repo-audit (sk); maintain-repo-close-gaps (sk); maintain-repo-keep (sk); maintain-fork (hs).
- **authoring:** authoring-docs (an, hs, mp, md); authoring-business (ws, an); authoring-articles (mp); authoring-edit (md); authoring-issue (mp, sk); authoring-issue-bug (none yet); authoring-issue-feature (none yet); authoring-reader (sp); authoring-markdown (own).
- **rigs:** rigs (none yet).
