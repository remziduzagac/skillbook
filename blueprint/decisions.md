# Decisions

Every decision of skillbook's initial design, in order. All were agreed by the person in the design discussion recorded in [notes/initial-design.md](notes/initial-design.md); the design documents in [design/](notes/first-design/design/README.md) carry the detail.

## D1: A blueprint keeps a project's thinking beside its code (2026-10-07)

**Decision:** A blueprint is a folder of plain markdown that holds a project's ideas, discussions, research, decisions, requirements, design and planned work. Requirements and design are the current truth; everything else is history, kept so the reasons behind the truth are never lost.

**Why:** That thinking otherwise lives in chat histories and one person's head, every agent session starts without it, and design and code drift apart unnoticed. Separating current truth from proposals follows PEPs, RFCs and OpenSpec (research/design-documentation-approaches).

## D2: Strands, files first, READMEs as maps, no numbers in file names (2026-10-08)

**Decision:** The strands are ideas, notes, research, decisions, requirements, design, roadmap, tasks and workstreams. Each starts as a file and becomes a folder of the same kind when it grows; a README describes its folder; IDs live in headings, names in file names, order in READMEs.

**Why:** A small project stays small; inserting or reordering never renames a file; IDs survive moves.

## D3: Work goes top-down, corrections go back up (2026-10-08)

**Decision:** The problem, the goals, the design as a whole, its parts, then workstreams and tasks. A problem found lower down goes up to the level it belongs to, is decided there, and flows down again.

**Why:** Decisions at the top constrain everything below them; it is how the person works.

## D4: The blueprint and the code are synced both ways (2026-10-08)

**Decision:** Planned work flows from the blueprint into the code; whatever the code changes that the blueprint describes is written back in the same piece of work. `synced_with` records the branch and last commit reconciled, and a sync pass catches changes made elsewhere.

**Why:** A blueprint that only flows down goes stale; one that only follows the code has no reasons and no plan.

## D5: Workstreams are contained parts of the work, consolidated into their parent (2026-10-09)

**Decision:** Once the initial design is settled, every change to requirements or design goes through a workstream, which has the same strands as the blueprint, its own included. Each has a short key that prefixes its IDs (WG-D1, WG-T1). Statuses: draft, active, complete, consolidated, dropped, superseded. Finished ones move to `archive/`.

**Why:** The parent stays the truth while work is in progress; keys make IDs collision-free across parallel work and branches.

## D6: Consolidation is the blueprint's own merge (2026-10-09)

**Decision:** A complete workstream is consolidated into its parent: its "Previously:" lines detect conflicts, "Builds on" and "Parent changed" notes keep it aware of its parent, the person can force completion, attachments are decided by the person, a fresh agent reviews the result, and it all lands in one commit. `complete` is the signal an agent looks for at the start of each session.

**Why:** Conflicts are found as they happen, not at the end; nothing is forgotten without git hooks.

## D7: Parallel work splits into workstreams, with three modes (2026-10-09)

**Decision:** One agent per workstream. Agents write directly by default; several agents on the same data write to their own `pending/` files for the main agent to apply; a git branch is optional.

**Why:** Treat the blueprint like code: one agent per file at a time.

## D8: One file per task, with the fields an agent needs (2026-10-08)

**Decision:** A task is one file with front matter (status, assignee, priority, blocked_by, related, tracker, created) and sections (description, acceptance criteria, out of scope, approach, risks, references, log). "Blocks" is never written; it is derived.

**Why:** A task must be complete enough for an agent to pick up and finish without asking.

## D9: Attachments live per level, out of git, with a committed index (2026-10-09)

**Decision:** Files that are not markdown go in an `attachments/` folder per level; only its index is committed; at consolidation the person decides what moves where. How the files are stored beyond that is left open.

**Why:** Attachments are often large, binary or private.

## D10: No script, nothing generated (2026-10-09)

**Decision:** The blueprint needs no tooling: agents use file search and git, and run a health check on request.

**Why:** A script is one more thing to install and keep in step; the structure (IDs that say where things live, folders that say what is finished) makes it unnecessary.

## D11: Describing an existing project goes straight into the root (2026-10-09)

**Decision:** An existing project's code and documents are used and converted; writing down what exists is not a change and needs no workstream.

**Why:** The root is the base of truth; only planned changes need a workstream.

## D12: Publishing is a one-time switch (2026-10-09)

**Decision:** There is only ever one blueprint. What is private is the person's call; on their instruction the agent removes it from the documents and, when the history is published, from the history.

**Why:** Two versions would drift; the person knows what is private.

## D13: Agents find a blueprint through a pointer (2026-10-09)

**Decision:** Default places: `.local/blueprint/` when private, `blueprint/` when public. A private blueprint's pointer lives in the person's user-level instructions; a public one's in the project's `AGENTS.md`.

**Why:** A public repository never mentions a private blueprint.

## D14: User documentation stays outside the blueprint (2026-10-09)

**Decision:** User docs live in the project, written for users; a change users see gets a docs task. Documentation never relies on the blueprint; it may link to a public one.

**Why:** The blueprint is for development, and may be private.

## D15: A core plus conditions, no levels, no visibility rules (2026-10-10)

**Decision:** Every repository meant to last meets the core; conditions (Shared, Contrib, Users, Artifacts, Registry, Deployed, Store, UI, Fork, Large) switch further rules on. Private and public repositories follow the same rules; only the platform's means differ.

**Why:** Each attempt at levels found the rules apply to every serious repository; what differs is facts about it.

## D16: Profiles keep greenrepo generic (2026-10-10)

**Decision:** What is specific to a language, tool, framework or platform lives in a profile, with one skeleton, applied only to repositories that use it and only when it adds something valuable.

**Why:** The standard stays readable and stable while tools change.

## D17: Outside standards are reported, not the structure (2026-10-10)

**Decision:** An audit reports where a repository stands against the OSPS Baseline, Scorecard and the Best Practices badge; criteria a solo project cannot meet are not applicable, and machine gates replace a second person.

**Why:** Chasing a score a solo maintainer cannot reach would hide the checks that matter.

## D18: Bots detect, agents propose, the person decides (2026-10-10)

**Decision:** A weekly health workflow keeps one labelled health issue current; expected settings, renewals and accepted deviations are committed files; settings drift is reported, never applied; admin-only checks run monthly in the person's own session.

**Why:** What the workflow's token can read is what may appear on a public page; no admin secret is stored anywhere (research/repository-health-automation).

## D19: Agents run by hand first (2026-10-10)

**Decision:** Upkeep agents run in a session the person starts; a scheduled local run is read-only; an agent in CI is optional, behind a gate, with a read-only agent job and one narrow write job. Third-party text is always data.

**Why:** Prompt injection through issue and comment text has leaked secrets from agents in CI.

## D20: The repository is skillbook, public, MIT (2026-10-10)

**Decision:** The person's skills live in `skillbook`, a public repository under the MIT licence.

**Why:** "skillbook" says exactly what is inside and matches the person's naming; public like mattpocock/skills.

## D21: Main skills load their sub-skills on demand (2026-10-10)

> **Amended by D38 (2026-10-11):** a main skill holds its rules and one full flow over sub-skills, which may be skills of their own and call others; complexity moves into a sub-skill.

**Decision:** A few main skills are registered; their procedures, references and templates are plain files in the skill's folder, read only when the work needs them, two levels deep by default. No file in a skill folder is named `SKILL.md` (apart from the main one), `README.md`, `AGENTS.md` or `CLAUDE.md`.

**Why:** Only names and descriptions cost context every turn; Codex registers every nested `SKILL.md`.

## D22: Matt Pocock's method, adopted and adapted (2026-10-10)

**Decision:** Pointers written as instructions, the branching test for sub-skills, completion criteria on every step, positive phrasing, harness-neutral text, explicit skill calls. The writing rules become skillbook's own `agent-writing` skill, adapted from `writing-for-agents` with credit.

**Why:** The method is general and tested in a widely used skill set (research/mattpocock-skills.md).

## D23: Two install routes, release-please, two folders (2026-10-10)

> **Amended by D74 (2026-10-11):** the symlink script gives way to installing the working copy as a local plugin.
>
> **Amended by D152 (2026-10-17):** skillbook becomes separately installable sets; how each is installed, and the folder layout, are decided later.

**Decision:** A plugin for everyday use and a symlink script for editing, never both on one machine; release-please for releases; shipped skills in `skills/`, skills being tried in `beta/`.

**Why:** No npm package and Conventional Commits already in use; a handful of skills needs no category folders.

## D24: greenrepo is model-invoked; markdown-style moves in (2026-10-10)

> **Amended by D67 (2026-10-11):** markdown-style becomes engineering's markdown language skill, reached through act.

**Decision:** greenrepo can be started by an agent when it sets up CI or a repository. The person's markdown-style skill moves into skillbook; fork-code stays in herdsman, where it belongs.

**Why:** Setting up repositories is work an agent reaches for on its own; project-specific skills stay in their project.

## D25: skillbook's own blueprint is public (2026-10-10)

**Decision:** skillbook's design lives in this `blueprint/` folder, and skillbook meets greenrepo.

**Why:** It dogfoods both skills from the first commit.

## D26: The initial design is settled (2026-10-10)

> **Superseded by D27 (2026-10-10):** the initial design is open again; changes go straight into the root.

**Decision:** The design in [design/](notes/first-design/design/README.md) is skillbook's initial design. From now on, changes to its requirements or design go through workstreams; building what it describes is planned as tasks.

**Why:** The design was reviewed part by part and agreed; the build is handed to a new agent session ([../HANDOVER.md](notes/first-design/HANDOVER.md)).

## D27: The initial design is open again (2026-10-10)

> **Amended by D108 (2026-10-12):** the baseline is built and tested before the rest of the design is settled.

**Decision:** skillbook is back in its initial design. Requirements and design change directly in the root, and no workstream is created, until the person declares the design settled again. The build waits for the skill structure to be redesigned.

**Why:** Tests of how Claude Code and Codex load skills ([research/skill-loading.md](research/skill-loading.md)) showed that skills can form a tree under one namespace, which reopens how skills are built, loaded and installed (D21, D23). Nothing has been built on the design yet, so workstreams would add ceremony without protecting anything.

## D28: Agents check the design phase before proposing a workstream (2026-10-10)

**Decision:** The roadmap's status line says whether the initial design is open or settled. An agent reads it before planning: while the initial design is open, changes go straight into the root and no workstream is proposed. The person may reopen a settled initial design, recorded as a decision, while nothing depends on it yet.

**Why:** An agent that took D26 at its word would have pushed the redesign of D27 through a workstream. Making the phase explicit, and reopening possible, keeps agents from adding workstreams the person does not want. Applied to the method in [design/blueprint.md](notes/first-design/design/blueprint.md).

## D29: blueprint carries the design flow, from idea to implementation and back (2026-10-10)

> **Clarified by D31 (2026-10-10):** the result is design, not a PRD.

**Decision:** blueprint holds the flow of design work, not only its strands. A big task arrives as an idea; it is analysed through the code, research and discussion into a PRD (a workstream, or the root during the initial design); it is planned as tasks and implemented; and the implementation updates the blueprint. This replaces mattpocock/skills' chain of spec, tickets and map.

**Why:** It is how the person develops today. A structure without its flow leaves the agent to invent the order of the work. The flow is drafted in [notes/skillbook-tree.md](ideas/skill-tree.md) and goes into [design/blueprint.md](notes/first-design/design/blueprint.md) when blueprint is improved.

## D30: Outside skills are learned from where they map, discussed where they do not (2026-10-10)

> **Amended by D120 (2026-10-13):** what fits is adapted, never copied: no outside file is used as it is.

**Decision:** When one of skillbook's skills maps to a skill in another collection, that skill is read before ours is written, and what fits is adopted, with credit and after a licence check. An outside skill that maps to none of ours is discussed with the person before skillbook gets its own version.

**Why:** Skills proven in use shorten the work and carry their lessons; adding skills only by discussion keeps the tree from growing by imitation. The mappings are in [notes/mattpocock-comparison.md](notes/mattpocock-comparison.md) and in the sources of [notes/skillbook-tree.md](ideas/skill-tree.md).

## D31: blueprint is engineering's design skill, and its result is design (2026-10-10)

> **Amended by D35 (2026-10-11):** blueprint sits under the design root; its scope and result are unchanged.

**Decision:** blueprint sits under engineering in skillbook's tree. Its scope is designing, triggering implementation, and adjusting the design from what the implementation shows. What work calls a PRD is the whole process a workstream runs; its result in the blueprint is design, at every level, never a PRD document. A mode that renders a workstream as one document may come later. Daily routines, such as triage and meetings, belong to other skill sets, not to blueprint.

**Why:** It keeps blueprint about one thing, the design and its two-way link to the code, and keeps the routines that surround the work from growing into it.

## D32: blueprint is design, split into sub-skills (2026-10-10)

> **Amended by D46 (2026-10-11):** design's main skill is the design flow; blueprint becomes its sub-skill for recording and tracking.

**Decision:** blueprint holds all of a project's design work: keeping the design (its modes), designing well (the deep-module vocabulary, contracts, terms, when a decision deserves a record) and reviewing the design (a review skill with consistency, lean, model-check, applied-change and architecture lenses). The planned software-design, domain-model and design-review skills fold into it. Throwaway prototypes and visual design stay outside it. Because it is large, it is split into sub-skills under a short router.

**Why:** One home for design keeps decisions and terms from living twice and drifting, and gives engineering one way into design work. Its knowledge files stay usable in a repository without a blueprint, read by path from skills such as tdd.

## D33: Groups take plain names (2026-10-10)

> **Amended by D35 (2026-10-11):** the six activity roots take bare verbs: design, implement, test, review, ship, maintain.
>
> **Amended by D37 (2026-10-11):** greenrepo is renamed repo.
>
> **Amended by D40 (2026-10-11):** roots you do take bare verbs, roots about something take nouns.

**Decision:** A group in the tree is named by the plain word for what it holds: the activity's "-ing" form (designing, building, shipping, thinking, researching, writing), or a noun where it holds a subject (agents, knowledge, routines). No name is coined for its own sake; a name that already exists and says what it is stays, such as greenrepo, and blueprint stays the name of the folder a design lives in. Leaf skills take short verbs or nouns (debug, capture, handoff). productivity is renamed routines, and research researching. Adjustable as the tree settles.

**Why:** Plain words are ones the model already holds, so they trigger with shorter descriptions, and anyone can tell what a group holds without a glossary. The "-ing" form keeps "building" apart from "the build" that CI runs, and tells a group from a leaf at a glance.

## D34: engineering holds four sets: designing, building, greenrepo, shipping (2026-10-10)

> **Superseded by D35 (2026-10-11):** the sets became six roots of their own, and engineering dissolved into them.

**Decision:** For now, engineering is one root holding four sets. designing holds blueprint and prototypes; building holds writing the code (implement, tdd, debug, code review, git, web, tools for agents); greenrepo holds the repository (its files, checks, CI, settings, forks, upkeep, and the rules a release must follow); shipping holds what happens after the code leaves the repository (releases, deploys, environments, rollback, monitoring, incidents), within greenrepo's release rules. Repository secrets go to greenrepo; untrusted input and never running a repository's code by default go to agents' guardrails.

**Why:** Many repositories never deploy, so greenrepo stays useful without carrying operations, and shipping can grow toward full operations on its own. The sets may later become roots beside writing (ideas.md, "option 2").

## D35: Six activity roots: design, implement, test, review, ship, maintain (2026-10-11)

> **Amended by D36 (2026-10-11):** plan is a seventh activity root; prototype sits under implement.
>
> **Amended by D37 (2026-10-11):** greenrepo, under maintain, is renamed repo.
>
> **Amended by D48 (2026-10-11):** the seven activities sit under an engineering root; the lifecycle view stands.
>
> **Amended by D154 (2026-10-17):** the lifecycle is no longer general: essentials holds design and plan; implement, test, review, ship and maintain are softeng's, and writing's own are authoring's.

**Decision:** The top of the tree holds six activities that any project goes through: design, implement, test, review, ship and maintain. engineering is no longer a root; software becomes one specialisation inside each activity, beside those for other kinds of work, to be designed later. blueprint sits under design, greenrepo under maintain. The subject roots stay beside the activities; writing keeps a place of its own. The description budget is set aside until the roots settle.

**Why:** The same lifecycle runs through a program, a book or a research project, with sub-skills tailored to each. Testing and reviewing are their own iterative steps beside making, so each needs its own triggers and its own callers.

## D36: plan is an activity root; prototype sits under implement (2026-10-11)

> **Amended by D154 (2026-10-17):** plan stays general, in essentials; its software parts, breakdown, slices and sequence, are softeng's.

**Decision:** plan becomes a root between design and implement: breaking work into deliverables, slices and an order of work, for any kind of project. plan owns how to plan; in a project with a blueprint, the plan is written into its roadmap and tasks. prototype moves from design to implement: it makes something, throwaway, to answer a design question, and design cites its result. Root count is not a constraint; roots may be grouped later.

**Why:** Planning is generic and a step of its own in every flow, blueprint's and mattpocock/skills' alike. Skills are placed by what they do; prototyping is making.

## D37: greenrepo becomes repo, under maintain (2026-10-11)

**Decision:** The repository standard is named repo and sits under maintain. Its design document and the glossary keep the name greenrepo until the skill is written; earlier decisions keep it as history.

**Why:** Under maintain, "repo" says exactly what is kept healthy; the coined name added nothing a plain word does not carry.

## D38: Main skills are natural-language procedures over their sub-skills (2026-10-11)

> **Amended by D112 (2026-10-13):** the shape changes: rules at the top, advice, then instructions on when to use each skill in the order the work happens, and a last instruction; if-then-else only where an order must be imposed, never one full flow in every main skill.

**Decision:** A main skill holds its rules and one full flow over its sub-skills, written as clear procedures in natural language: named steps, plain conditions that point to a named step, and each step ending on what comes next or on "Done when". A request enters at the step it fits and continues from there. A simple diagram may show a loop or a decision that is easy to miss, and a long flow may offer a checklist the agent copies and ticks off. When a step grows complicated, its logic moves into a sub-skill rather than into the main skill; a sub-skill may call other sub-skills. Reference files are linked directly from the skill that uses them, depth comes from sub-skills with their own `SKILL.md`, and a file over 100 lines opens with a table of contents.

**Why:** It keeps every file easy to follow as the tree grows. mattpocock/skills, superpowers and Anthropic's guidance agree on plain steps, named branches, explaining why rather than shouting, and references kept one level from their skill ([research/skill-writing-guides.md](research/skill-writing-guides.md)).

## D39: A skill lives with the knowledge it needs (2026-10-11)

**Decision:** A skill sits where the knowledge it needs lives and where the flow that calls it most runs; other roots point to it. design keeps design-review, design-check and design-publish, which all need the design's whole context; prototype stays under implement, which holds the knowledge of making things.

**Why:** Placing skills only by what they do pulls some away from the knowledge they need; reviewing a whole design is part of the design flow, not judging a change about to land.

## D40: Roots you do are verbs; roots about something are nouns (2026-10-11)

> **Amended by D48 (2026-10-11):** the groups engineering and productivity take nouns.
>
> **Amended by D52 (2026-10-11):** think is renamed understand.
>
> **Amended by D67 (2026-10-11):** write is renamed author; agents merges into conduct.

**Decision:** A root named for an activity takes a bare verb: design, plan, implement, test, review, ship, maintain, write, think, research. A root about a subject takes a noun: knowledge, routines, agents. writing, thinking and researching are renamed write, think and research.

**Why:** Bare verbs are what the person types every day, and Anthropic's guidance accepts action-oriented names; its warning is against mixing patterns, and two forms with one rule avoid that.

## D41: The subject roots, first cut (2026-10-11)

> **Amended by D48 (2026-10-11):** knowledge and routines sit under a productivity root; agents stays a root.
>
> **Amended by D63 (2026-10-11):** verify and guardrails move from agents to conduct.
>
> **Amended by D64 (2026-10-11):** knowledge, and its vault skill, are set aside for later.
>
> **Amended by D67 (2026-10-11):** writing for agents becomes conduct's instruct; skill-making moves to conduct.
>
> **Amended by D78 (2026-10-11):** the guardrail principles live in conduct alone; `AGENTS.md` does not repeat them.

**Decision:** write holds writing for any reader, so agent-writing moves there from agents; skill-making stays in agents and calls it. experiment moves from research to test. The vault skill lives in knowledge, and maintain points to it. Status updates move from routines to write. agents' guardrails become always-on `AGENTS.md` principles, with a skill kept only for their details.

**Why:** Writing for agents is the same craft for another reader. Fleets and playtests test a product. Rules that must hold in every session belong in the steering file, not in a skill that loads only sometimes.

## D42: The design restarts from the whole; the first design becomes material (2026-10-11)

**Decision:** skillbook is designed top-down from here: requirements, then the design as a whole, then each root as a part. The first design's documents (its design files, ideas, requirements, roadmap and handover) move to [notes/first-design/](notes/first-design/README.md) as material for designing the parts again. New current truth is written in [requirements.md](requirements.md) and [design/how-it-works.md](design/how-it-works.md), with decisions D27 onward applied to it; the tree draft moves to [ideas/](ideas/README.md). Until the design skill is written, this blueprint follows the method in the first design's `blueprint.md`.

**Why:** The first design detailed parts, blueprint and greenrepo, before the whole existed; the whole is now taking shape, and the method asks for the top to be settled before the parts. Decisions were recorded but applied only to notes; the new documents apply them where the method says.

## D43: Short folders; a skill's name is its folder path joined by dashes (2026-10-11)

> **Amended by D71 (2026-10-11):** names count from below the main skill's folder, `skills/skillbook/`.
>
> **Amended by D74 (2026-10-11):** no link script; every machine installs the plugin.
>
> **Amended by D79 (2026-10-11):** the check script also verifies each skill's Codex settings.
>
> **Amended by D152 (2026-10-17):** names count within each set, the same name may appear in two sets, and the folder layout and the names on a route without a namespace wait for the install routes.

**Decision:** In the repository, a skill's folder has a short name inside its parent's folder (`skills/design/start/`), and its `name` is the folder path below `skills/` with the slashes turned into dashes (`design-start`; `skills/implement/git/worktree/` is `implement-git-worktree`). `plugin.json` lists every skill folder. The check script verifies that each name equals its path joined by dashes and that `plugin.json` lists exactly the folders that hold a `SKILL.md`. The link script installs each skill flat under its name (`~/.claude/skills/design-start`).

**Why:** The repository stays tidy and shows the tree, while names stay unique in the one-level namespace. Claude Code and Codex register a skill by its frontmatter name, so the plugin needs no renaming ([research/skill-loading.md](research/skill-loading.md), deep trees). Inside the repository a name no longer matches its folder, which a strict Agent Skills validator flags; installed flat, it matches again.

## D44: Only SKILL.md at the top of a skill's folder (2026-10-11)

> **Amended by D79 (2026-10-11):** a hidden skill's folder also holds `agents/openai.yaml`, Codex's settings.

**Decision:** A skill's folder holds `SKILL.md` and nothing else at its top. Files the skill reads go in `references/`, files it runs in `scripts/`, and files it copies out, such as templates, in `assets/`, the three folders the Agent Skills specification names. Sub-skill folders sit beside them, and no sub-skill may take one of those three names. Which files each skill needs is worked out when the skill is written, not in the tree.

**Why:** A skill's folder then reads at a glance: its procedure, its sub-skills, and three known places for everything else. Using the specification's folder names keeps skillbook readable by other tools that follow it.

## D45: think's clarify has two depths, shallow and deep (2026-10-11)

> **Amended by D49 (2026-10-11):** questionnaire is clarify's third sub-skill.
>
> **Amended by D52 (2026-10-11):** think is renamed understand.
>
> **Amended by D58 (2026-10-11):** how deep asks: numbered rounds, one by one on request.
>
> **Amended by D109 (2026-10-12):** shallow is the full picture of a level and comes first; deep goes down where a part needs it; clarify chooses, and holds the rules both share.

**Decision:** Under think, clarify is a parent with two sub-skills: shallow, a few questions about a request, each with a default, before starting; and deep, rounds of questions with recommended answers until every decision in a plan is made. clarify holds what both share and picks the depth from the request. mattpocock/skills' grilling becomes clarify's deep; the name grill is not used.

**Why:** Both depths do one job, finding out what is meant before acting, so they share one parent and its rules; the plain names say what each does, where "grill" said only how hard it asks.

## D46: design is the flow; blueprint records and tracks (2026-10-11)

> **Amended by D47 (2026-10-11):** there is no blueprint sub-skill; its steps are design's own sub-skills.
>
> **Amended by D112 (2026-10-13):** design's own skill takes the shape every main skill takes: design's rules, its advice, and when to use each sub-skill, with a flow only where an order must be imposed.
>
> **Amended by D117 (2026-10-13):** every project using skillbook has a blueprint; the flow runs without one only for work outside any project.
>
> **Amended by D154 (2026-10-17):** the recording steps belong to the blueprint set, the spec-to-dev flow, its own thing rather than a part of design; essentials' design is how to design anything, and softeng has its own.

**Decision:** design's main skill shows how to design anything: its flow from an idea to a written design, the hand-over to implementation and the adjustments that come back, the principles that hold throughout, and which sub-skill each step needs. Where a project keeps a blueprint, a step that produces something worth keeping calls design's blueprint sub-skill, which records and tracks it in the `blueprint/` folder; without a blueprint, the flow runs the same and nothing is filed. design's other sub-skills are general methods (architecture for software, review lenses). The same split, general work at a root and a specific system beneath it, is to be weighed for the other roots as they are discussed.

**Why:** As one skill, design forced the blueprint's folder and flow on every design. Separating how to design from how a design is kept lets any work use the method, and a project with a blueprint keep its record as well.

## D47: design's steps are its own sub-skills; no blueprint sub-skill (2026-10-11)

> **Amended by D117 (2026-10-13):** the recording steps are never skipped in a project, since every project using skillbook has a blueprint.
>
> **Amended by D154 (2026-10-17):** the recording steps are the blueprint set's, with the form of each document.

**Decision:** blueprint is no longer a sub-skill. Its steps (start, discuss, research, decide, write, workstream, tasks, work, sync, consolidate, parallel, check, publish) become design's own sub-skills, beside architecture and review. design's main skill stays the flow and its principles (D46) and names the sub-skill each step calls; the steps that record file their result in a project's `blueprint/` folder, whose name stays (D33), and are skipped where a project has none.

**Why:** design's flow already names the step each of these serves, so a blueprint skill between them would only route; without it, the flow calls each step directly and one level fewer is loaded.

## D48: engineering and productivity group the roots (2026-10-11)

> **Amended by D56 (2026-10-11):** the six roots sit under the main skill, which alone is listed to the model.
>
> **Amended by D59 (2026-10-11):** research moves under understand, leaving five roots.
>
> **Amended by D64 (2026-10-11):** productivity, with knowledge and routines, is set aside for later.
>
> **Amended by D76 (2026-10-11):** engineering is dissolved; its seven stages are roots under the main skill.

**Decision:** The tree has six roots. engineering holds the seven lifecycle activities: design, plan, implement, test, review, ship and maintain; its main skill is that lifecycle as one flow, routing a request to the stage it fits. productivity holds knowledge and routines. write, think, research and agents stay roots. The activities and the two subjects become sub-skills, and by D43 their names begin with their group (`engineering-design-start`, `productivity-knowledge-capture`).

**Why:** The roots were made with grouping left for later. The lifecycle (D35) reads as one flow under one root, and fewer descriptions sit in the agent's context every turn; a request under a group takes one more load to reach its skill.

## D49: questionnaire sits under clarify (2026-10-11)

> **Amended by D52 (2026-10-11):** think is renamed understand.
>
> **Amended by D109 (2026-10-12):** the person answers their own questions first; the document can be answered without the conversation, and the agent never sends it.

**Decision:** questionnaire becomes clarify's third sub-skill, `think-clarify-questionnaire`, beside shallow and deep. clarify asks the person; when the person cannot answer and someone else holds the answer, clarify turns to questionnaire, which asks the person only who it goes to and what they need back, then writes the questions into a document for that other person.

**Why:** Both find out what is meant before acting; they differ only in who answers. Under clarify, the move from "I don't know" to asking the one who knows is one step in the same flow.

## D50: think's skills are methods; the caller keeps their results (2026-10-11)

> **Amended by D52 (2026-10-11):** think is renamed understand.
>
> **Amended by D53 (2026-10-11):** discuss is understand's main flow, not a sub-skill.
>
> **Amended by D109 (2026-10-12):** clarify's result also says what was assumed.
>
> **Amended by D130 (2026-10-14):** discuss is understand's sub-skill again, the method of a discussion over several items; design's discuss step stays for now.
>
> **Amended by D131 (2026-10-14):** keeping nothing and the one result shape are understand's own rules, their one home.
>
> **Amended by D149 (2026-10-17):** the shape says where to find a part and is not a form to fill: an empty field is left out, except Not found, and a field the reader already has is not shown to the person.

**Decision:** think holds thinking methods that design, knowledge and any other skill can use. Its skills have no tools, folders or files of their own: the conventions they carried from earlier tools (discuss's anchor, scribble and final notes, ideation's thread map, a vault's layout) are dropped. Each think skill ends on a short result in one shape: what was decided and why, what was parked and why, and what comes next. Used alone, the result stays in the conversation; called from another skill, it goes back to that skill, which keeps it where it belongs, such as design in the blueprint. think's discuss is the method of a discussion over several threads; design's discuss records one. questionnaire still writes a document, because the document is what is handed over, but where it goes is the caller's or the person's choice.

**Why:** Methods tied to one tool's folders cannot serve design, knowledge and later skills alike. With one shape for every result, a caller can keep a think result without knowing which think skill made it.

## D51: Other roots reach think's skills through think (2026-10-11)

> **Amended by D52 (2026-10-11):** think is renamed understand.
>
> **Amended by D56 (2026-10-11):** understand is hidden too; other roots reach it through the main skill.

**Decision:** A skill in another root that needs a think method calls the think root by name, saying what it needs ("think: clarify deeply"), and think routes to its sub-skill. It does not read think's sub-skills by a path into think's folder.

**Why:** think's sub-skills are user-invoked, so the Skill tool refuses them, and a path into another root's folder breaks where skills are installed one at a time. A model-invoked root loads reliably by name ([research/skill-loading.md](research/skill-loading.md)); the price is one more load per call.

## D52: think is renamed understand (2026-10-11)

> **Amended by D59 (2026-10-11):** research's shape under understand is settled.

**Decision:** The root think is renamed understand, and its skills' names follow (`understand-clarify`, `understand-ideate`, ...). research is to move under it; its shape there is still to discuss.

**Why:** Clarifying, discussing, explaining and finding out from sources share one goal, understanding before acting, and a bare verb that names the goal covers research as well as thinking with the person.

## D53: understand's main skill is the discussion; ideate is renamed brainstorm (2026-10-11)

> **Amended by D112 (2026-10-13):** understand's own skill takes the shape every main skill takes; the discussion as its flow is weighed when it is designed, after its sub-skills (D109).
>
> **Amended by D116 (2026-10-13):** brainstorm's three to seven options are advice.
>
> **Amended by D118 (2026-10-13):** brainstorm is designed; its framing and weighing are understand's frame and weigh, and its developing uses challenge.
>
> **Amended by D130 (2026-10-14):** discuss is understand's sub-skill again; understand's own skill holds the shared rules and which part to choose.

**Decision:** discuss is no longer a sub-skill: its method becomes understand's main flow. Frame what is to be understood; restate it so the person can correct it, clarifying when the meaning is unclear; list the open questions and take one at a time, researching when a question needs facts and brainstorming when it needs options, otherwise giving a view with reasons; close each question with the person's decision or a park; hand back the result (D50). ideate stays a sub-skill, renamed brainstorm: options for one question, framed, three to seven distinct, the promising ones intensified, weighed, then decided or parked.

**Why:** Once discuss lost its notes (D50), it was the shape every request to understand already takes, which D38 puts in the main skill. brainstorm has a method of its own and is called directly ("options for the name"), and it is the plain word for it. superpowers' skill named brainstorming is a design dialogue, so it maps to design, not here.

## D54: explain clears up what did not land, top-down (2026-10-11)

> **Amended by D63 (2026-10-11):** explain moves from understand to conduct.
>
> **Amended by D107 (2026-10-12):** explain is only for what the agent itself said; explaining something new is understand's.

**Decision:** understand's explain is for the moment the person has lost track of what the agent said, usually because it leaned on something they do not have in mind: a decision number, a file, a short code, a name coined earlier, a step they did not see. It explains top-down: where the conversation is and why the topic came up; the point, in one plain sentence; each piece the point rests on, in words, with every reference the person cannot resolve replaced by what it means (a number may stay in brackets, for looking it up); an example when the point is abstract. It stops once the ambiguity is cleared and offers to go deeper rather than adding more. Done when every term and reference in it is one the person knows or one it explains, and nothing is there that the point does not need. It repairs what the agent said; it does not teach a topic or write documents. The person types it, or says in words that they did not follow, and understand routes there.

**Why:** What the person needs when they ask for an explanation is the missing context, in order, without being overwhelmed. mattpocock's `wait-what` aims at a shorter re-pitch; here the answer may be longer, but every part of it can be followed.

## D55: skillbook has a main skill above the roots (2026-10-11)

> **Amended by D56 (2026-10-11):** the main skill is the only skill listed to the model.
>
> **Amended by D58 (2026-10-11):** a second rule: ask before acting on what is not understood.
>
> **Amended by D60 (2026-10-11):** the rule on naming things in words moves to the answer skill.
>
> **Amended by D146 (2026-10-17):** naming things in words gains its test: a reference stays as it is when its reader can tell what it is from the reference itself, on the spot; otherwise a few words first, the number in brackets after.

**Decision:** One main skill sits above the six roots and holds the rules every skill follows. The first rule: name things in words; never use a reference the person cannot resolve on the spot, such as a bare decision number, a source code or a name from earlier in a long session, and when a number helps for looking something up, put it in brackets after the words. Its name, its folder, whether it is listed every turn or read by each root first, and how it relates to the always-on principles in `AGENTS.md` (D41) are still open.

**Why:** Some rules hold for every skill, not one root; written once at the top, no root repeats them, and explain (D54) then only repairs what still slips through.

## D56: The main skill is the only skill listed to the model (2026-10-11)

> **Amended by D57 (2026-10-11):** how the main skill is made to load: its description, and a pointer.
>
> **Amended by D63 (2026-10-11):** the main skill only routes; its rules live in conduct, loaded first.
>
> **Evidence:** [E1](evidence.md).
>
> **Amended by D152 (2026-10-17):** each set's main skill is listed to the model; a skill reaches another set's skill through that set's main skill, by name.

**Decision:** The main skill is the one model-invoked skill in skillbook. The six roots and everything below them are sub-skills the person can type but the model does not see; a request reaches any of them through the main skill, which routes, and a skill that needs another root's skill asks the main skill for it. The main skill's rules apply whenever it loads. Whether the group layers (engineering, productivity) stay is the person's decision, to be made later; the main skill's name and folder are still open.

**Why:** In a test over the sample tree, one visible main skill reached the right skill at least as often as six or thirteen visible roots, in Claude Code and in Codex, and applied its rule every time it loaded; the group layers made no measurable difference ([research/skill-loading.md](research/skill-loading.md), "Top-level shapes"). One entry point keeps the rules in force and gives every call between roots the same route.

## D57: The main skill loads through its description and a pointer (2026-10-11)

> **Amended by D78 (2026-10-11):** the pointer excepts a one-line answer that needs no tool and no file.
>
> **Evidence:** [E2](evidence.md).
>
> **Amended by D93 (2026-10-12):** the pointer goes into the person's own instruction files by default.
>
> **Amended by D152 (2026-10-17):** the description and the pointer are essentials' main skill's, the one loaded first for any work.

**Decision:** The main skill's description opens by telling the agent to load it first for any piece of work, before answering, then names the kinds of work it covers; each routing line names the work it routes, git commits and pull requests under engineering included. Setting skillbook up adds a pointer, one sentence in the instruction file the agent reads at the start of every session: "Before answering any request in this project, load skillbook's main skill and follow it." agents' setup skill writes it into a project's `AGENTS.md`, which `CLAUDE.md` includes, and the person's own instruction files for every project (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`) carry it too.

**Why:** Without either, Claude Code answered a third of the test requests without any skill. The description ended that and kept trivial requests light; the pointer makes the main skill load for every request, so its rules hold in every answer ([research/skill-loading.md](research/skill-loading.md), "Making the main skill load"). The personal instruction files are not tested yet.

## D58: Asking until nothing is left assumed (2026-10-11)

> **Amended by D63 (2026-10-11):** the principle moves from the main skill to conduct's act.
>
> **Amended by D109 (2026-10-12):** deep no longer maps a tree of decisions: each round asks what can be answered now. It ends with a summary of decided, parked and assumed that the person confirms, and offers to record decisions in long sessions.
>
> **Amended by D114 (2026-10-13):** how questions are put, laid out and answered moves to conduct's ask; deep keeps finding them.
>
> **Amended by D150 (2026-10-17):** a recommended answer is challenged first, through understand's challenge, at a depth set by stakes.

**Decision:** The behaviour first known as grilling lives in three places, each holding one part:

- **The method, once, in clarify's deep sub-skill.** It maps the topic as a tree of decisions, each opening the ones that depend on it, and asks in rounds: every question that can be answered now, numbered, each with its recommended answer and worded so that "yes" accepts it. A question that depends on one still open waits for a later round. Facts the agent finds itself; decisions are the person's. After each round the answers reshape the tree and the next round follows. It is done when no question is left open or unparked, and nothing is acted on until the person confirms they share the understanding.
- **One by one, on request, without losing the round.** When the person asks to go through the questions one at a time, the round's numbers stay fixed and nothing is dropped. Each step names the question by its number, gives what it needs and its recommended answer, and says which questions remain; answers are kept and applied, a question an answer changes is said so, and a parked one stays listed as parked. After the last, the next round follows as usual.
- **When to use it, in the flows:** clarify picks the depth (a few questions, deep, or a questionnaire); understand's main flow goes deep for a plan or a decision with several open parts; design's flow already does.
- **The principle, in the main skill's rules:** do not act on what is not understood; ask, and for a plan or a design keep asking until nothing is left assumed.

**Why:** The person wants this behaviour wherever work starts from something unclear. Written once, the method cannot drift between copies, and the rule in the main skill makes it the default in every answer. Rounds of numbered questions move faster than one question per message; going one by one must not cost the questions not yet reached.

## D59: research is one sub-skill of understand (2026-10-11)

> **Amended by D118 (2026-10-13):** understand also holds frame, weigh and challenge.
>
> **Amended by D128 (2026-10-14):** research gains a third part, fact, for one question or one claim, and answers nothing itself; analyze traces a chain from the symptom back to its trigger rather than a tree of root causes; the kinds of source are reference files.

**Decision:** research moves under understand as one sub-skill, with survey (what exists on a subject, compared) and analyze (symptoms broken down into a tree of root causes) beneath it. analyze is the general method for any problem; engineering's debug asks for it when the cause is not obvious. write-up is no longer a sub-skill: research ends by handing back its findings in understand's common shape (what was decided, what was parked, what comes next), extended with where each finding came from, whether it was read or inferred, and what was looked for but not found. Keeping the result is the caller's: design files it as a research note in the blueprint, write turns it into a document. The tree has five roots: engineering, write, understand, productivity, agents.

**Why:** research has a flow of its own, from the question to the sources to the findings, with shared rules on sources and provenance; as one sub-skill it is the one place understand's flow sends a question that needs facts. Root-cause analysis finds out from evidence, which is not only code. Since understand's skills keep nothing (D50), a separate write-up would only repeat research's last step.

## D60: Every rule about how answers are written lives in one skill, answer (2026-10-11)

> **Amended by D63 (2026-10-11):** answer sits in conduct, not directly under the main skill.
>
> **Amended by D81 (2026-10-11):** answer is renamed respond, with more rules, and checked before every response.
>
> **Amended by D83 (2026-10-11):** for responses the rule is named "necessary and sufficient".
>
> **Amended by D145 (2026-10-17):** the rules that every output shares, nothing missing, nothing extra and top-down, live in conduct's rightsize; respond keeps their uses for a response.
>
> **Amended by D146 (2026-10-17):** respond's rule on things named in words gains its test and its examples; a delegated agent's report to the main agent may use numbers, turned into words for the person.

**Decision:** A skill named answer, directly under the main skill, holds every rule about how the agent's answers are written; the main skill loads it first on every request, and once loaded it stays in the conversation for the answers that follow. Its first rules: an answer covers everything the question needs and nothing it does not, with no missing part, no padding and no side topic the person did not ask for (comprehensive and exclusive, the "efradını câmi, ağyarını mâni" of a good definition); things are named in words, never by a reference the person cannot resolve (moved from the main skill, D55); an explanation goes top-down (D54); plain words. The main skill keeps the rules of behaviour, such as asking before acting on what is not understood (D58), and the routing. write's skills point to answer for the plain-writing rules they share.

**Why:** Rules for answers keep growing, and one place keeps them consistent and out of the routing. Directly under the main skill, it costs one small read per request.

## D61: organize splits anything into parts that do not overlap and cover the whole (2026-10-11)

> **Amended by D63 (2026-10-11):** organize sits in conduct, not under understand.
>
> **Amended by D85 (2026-10-11):** organize holds five operations as sub-skills: split, merge, compose, normalize, cluster.

**Decision:** understand gains a sub-skill, organize, holding the method for dividing anything into parts that are mutually exclusive and collectively exhaustive (MECE): every item has exactly one home, and anything without one is named. Its callers include design splitting an idea document into sub-documents in an idea folder, plan breaking work into deliverables, knowledge arranging folders and notes, write structuring a long document, and agents placing a skill in the tree.

**Why:** It is a thinking method used across roots, and understand holds those and keeps nothing itself (D50). If every part's boundary is comprehensive and exclusive, the parts cannot overlap; what remains to check is that nothing is left without a home.

## D62: Every skill's description is comprehensive and exclusive (2026-10-11)

**Decision:** agents' skill-making skill requires each skill's description to take in every request that belongs to the skill and keep out every request that belongs to a sibling, and checks the siblings' descriptions together with organize.

**Why:** The routing tests found three places where two descriptions overlapped and neither kept the other's requests out: "note this down for later" between knowledge's capture and routines' tasks, naming options between write's naming and understand's brainstorm, and a commit message between write and engineering ([research/skill-loading.md](research/skill-loading.md), "Top-level shapes").

## D63: conduct holds how the agent behaves in every root (2026-10-11)

> **Amended by D67 (2026-10-11):** conduct also takes agents' skills and instruct.
>
> **Amended by D81 (2026-10-11):** answer is renamed respond.
>
> **Amended by D112 (2026-10-13):** the main skill holds rules and advice of its own again; act and respond stay skills, and its rules tell the agent to follow them.

**Decision:** A group named conduct sits under the main skill beside the five roots and holds the behaviours that hold in every root: answer (how answers are written) and act (how the agent acts: ask before acting on what is not understood, evidence before saying done, propose before anything that cannot be undone and wait for approval), both loaded on every request; and organize, explain, verify and guardrails, called when needed. explain and organize move from understand, verify and guardrails from agents. The main skill keeps only the routing: it loads conduct's answer and act first, reading them by path so the group adds no load, then routes to a root. understand keeps clarify, brainstorm and research; agents keeps making skills, setup, learning from sessions, delegating, handoff and council.

**Why:** These behaviours belong to no one kind of work; in one group, every rule has one home and the main skill is only the map. The name says how the agent conducts itself and its work; operate was set aside because in software it means running systems in production, which is ship's.

## D64: knowledge and routines are future work (2026-10-11)

**Decision:** knowledge and routines, and the productivity group that held them, leave the tree for now and are designed later. What was known about them when they were set aside, decided and not, is kept in [notes/knowledge-and-routines.md](notes/knowledge-and-routines.md), and the roadmap lists them as future work. The tree keeps the conduct group and four roots: engineering, write, understand, agents.

**Why:** Their design raised the shape of the project folder, the knowledge folder's name and how ongoing work is held, which is a long discussion of its own; settling the rest of the tree first gives it firmer ground.

## D65: agents, first cut; its skills become tool-free (2026-10-11)

> **Amended by D67 (2026-10-11):** agents merges into conduct; for-agents becomes instruct, for lasting instructions only.
>
> **Amended by D94 and D97 (2026-10-12):** instruct writes and updates instruction documents; setup sets skillbook up on a machine and in a project, with the pointer in the person's own instruction files.
>
> **Amended by D147 (2026-10-17):** handoff is renamed carryover and builds on brief, a new skill beside delegate for what an agent starting now is told.

**Decision:** Within agents: council becomes a sub-skill of delegate. delegate covers work given to other agents now (one question, many in parallel, several on the same question), and handoff covers work passed to an agent later (the state written down, and resuming from it); together they hold the cooperation patterns of the person's earlier project workslate (handoff, inquiry, fan-out, multi-inquiry, discussion). learn decides where a session's lesson goes (a skill, a rule in `AGENTS.md`, a decision, a note, or nothing) and calls skills when the lesson is a skill; skills drops its "from a session" mode. setup owns the agent files of a project and of the person: `AGENTS.md` kept short and pointing to skills, the sentence pointing to the main skill (D57), hooks, skills to add. write's sub-skill for writing for agents moves from `write/agents/` to `write/for-agents/`, since Codex keeps a skill's settings in an `agents/` folder inside it. Like understand's (D50), agents' skills drop the folders, formats and tools of the earlier projects they came from; where each keeps what it produces is designed skill by skill.

**Why:** Each cooperation pattern and each step from a lesson to its home then has exactly one skill. The skills came from tools with their own layouts, which other projects and harnesses do not have.

## D66: learn's flow (2026-10-11)

> **Amended by D77 (2026-10-11):** promoting a lesson into a skill is future work.
>
> **Amended by D98 (2026-10-12):** insights go into the blueprint's notes until the knowledge folder exists.
>
> **Amended by D107 (2026-10-12):** a rule goes into an instruction document through instruct, not setup; learn runs only when asked, and at a wrap-up with unfinished work it is offered with handoff in one question, learn first.

**Decision:** learn collects highlights during or after a session; judges each one, whether it is reusable and where it belongs; promotes it with the person's approval, as a skill (through skills), a rule in `AGENTS.md` (through setup), a decision (in the blueprint) or an insight (in knowledge, once it exists), or drops it; and records what went where. Where highlights wait to be judged, per project and for the person, is future work, designed with the project folder ([notes/knowledge-and-routines.md](notes/knowledge-and-routines.md)).

**Why:** The steps and their destinations are tool-free (D65); the waiting place depends on the project folder, which is not designed yet.

## D67: conduct takes agents; author, languages and project skills (2026-10-11)

> **Amended by D68 (2026-10-11):** languages becomes code, under implement; markdown moves to author.
>
> **Amended by D77 (2026-10-11):** the generic skill-maker leaves the plugin; skillbook-tree holds skill-making.
>
> **Amended by D94 (2026-10-12):** instruct writes and updates instruction documents only, not skill files.
>
> **Amended by D125 (2026-10-13):** naming is designed.
>
> **Amended by D147 (2026-10-17):** handoff is renamed carryover; its rules stay its own, not instruct's.
>
> **Amended by D154 (2026-10-17):** author is renamed authoring, a set of its own; author's blueprint skill goes to the blueprint set.

**Decision:**

- **conduct takes what was agents.** skills, setup, learn, delegate (with council) and handoff join conduct, which now holds how the agent acts: how it behaves in every root, how it makes skills and sets up agent files, how it learns from sessions and how it works with other agents. The agents root goes away, and with it the folder named `agents/` that Codex would read as a skill's settings.
- **instruct** replaces for-agents: the craft of lasting instructions an agent follows, skill files and `AGENTS.md`, called by skills and setup. delegate and handoff keep their own rules for briefs and handoffs, which are short-lived.
- **write is renamed author:** writing work for people, documents, guides, status updates and articles, and editing them in passes. naming moves to understand, beside brainstorm, which supplies the options.
- **languages, under engineering,** holds how to write each language well: markdown (once markdown-style), Python, TypeScript, Bash, Go, Rust. act gains a rule: before writing a file, follow the language skill for its type. Each language skill shares one source with that language's repository profile in maintain's repo skill.
- **Project skills.** Skills only skillbook needs live in this repository's project skill folders, one copy in `.agents/skills/` with `.claude/skills/` linked to it, and are never shipped in the plugin. The first is skillbook-tree: writing, naming, placing and checking a skill in this tree. The plugin keeps a generic skill-maker in conduct, for skills in any project, which skillbook-tree builds on. `AGENTS.md` points to skillbook-tree once it exists.

**Why:** Working with other agents and improving itself are part of how the agent acts, not a kind of work. With the rules for agent-facing text in conduct, "write" was ambiguous; author names writing for people. A language is written the same way at every stage, so its rules sit beside the stages, reached by one rule rather than by topic. Rules only this repository needs would cost every other user. Whether Claude Code follows the link from `.claude/skills/` for a project skill is not tested yet.

## D68: code sits under implement; markdown under author (2026-10-11)

> **Amended by D111 (2026-10-12):** markdown-style becomes author's markdown skill with the person's own tooling left out: the editor setup, the home-folder configuration and its disabled rules.

**Decision:** The languages group becomes code, a sub-skill of implement holding the programming languages (Python, TypeScript, Bash, Go, Rust). markdown moves to author. act's rule now reads: before writing a file, follow the skill for its type, code or markdown.

**Why:** Most code is written while implementing, and "code" is the plainer word. Markdown is not code: it is the format of documents, design records and skill files, written mostly while designing and authoring, so under code it would break the rule that a skill's place takes in what it covers and keeps out what it does not (D62). act's rule reaches both wherever they sit.

## D69: author sorts writing by reader (2026-10-11)

> **Amended by D123 (2026-10-13):** author gains a reader test, a document read as its reader would; name to settle.
>
> **Amended by D127 (2026-10-13):** author gains issue, with bug and feature as parts.

**Decision:** author holds six skills:

- **blueprint:** the form of each kind of blueprint document (idea, session note, research note, decision record, requirements, design document, roadmap and tasks, workstream). design's recording steps call it for the form and keep the filing and tracking themselves: numbering, append-only, notes under earlier entries, which folder.
- **docs:** documentation for the people who use what was built (docs pages, guides, READMEs), with co-writing a document with the person.
- **business:** documents for stakeholders (status update, report, proposal, one-pager, memo, email), including a design rendered as one PRD-style document; office formats come from Anthropic's document skills. updates folds into it.
- **articles:** an article built from fragments, beats and shape.
- **edit** (D70) and **markdown** (D68), serving the others.

blueprint, docs and business each hold one shared flow (reader and purpose, structure, draft, an editing pass) and one form per kind of document, as a reference file; articles has a flow of its own.

**Why:** The reader decides the form: the project's own record, the users of what was built, the stakeholders it is reported or proposed to, the public. Writing a blueprint document well is author's craft; where it is filed and how it is tracked is the blueprint's, so the two stay apart, as design's flow and its record did (D46).

## D70: edit works in single-question passes, scaled and consolidated (2026-10-11)

**Decision:** edit improves a written text in passes, each asking one checkable question (is the main point at the start, is every term and reference explained, can anything be cut, does each sentence say one thing), structure before sentences before words. The number of passes scales with the text: one pass with a short checklist for a short message, the full set for a long document. edit runs in one call: its passes can run as parallel agents through conduct's delegate, each returning proposed changes rather than a rewritten text, which are consolidated in order (structure first, changes to removed parts dropped, conflicts resolved) and shown to the person as one set.

**Why:** One question per pass catches more and keeps each change small enough to review; agents asked to "improve" a text tend to rewrite all of it. Parallel passes keep the separation without making the person wait for one pass after another.

## D71: The main skill is skillbook, in skills/skillbook/ (2026-10-11)

> **Amended by D76 (2026-10-11):** with no engineering layer, the example is now `design-start`.
>
> **Amended by D153 (2026-10-17):** the main skill is essentials' main skill, named `essentials`; where its folder sits waits for the layout (D152).

**Decision:** The main skill lives in `skills/skillbook/SKILL.md` and is named `skillbook`; every other skill is nested inside its folder, and a skill's name is its folder path below `skills/skillbook/` joined by dashes (`skills/skillbook/engineering/design/start/` is `engineering-design-start`).

**Why:** One main skill with everything under it was decided (D56); this is its concrete shape. A top skill in its own folder with nested levels is the shape the deep-tree test ran in both agents ([research/skill-loading.md](research/skill-loading.md), "Deep trees"); a `SKILL.md` directly in `skills/` is untested. Counting names from below the main skill's folder keeps a `skillbook-` prefix off every name, and the product keeps one name for the plugin, the main skill and the project folder.

## D72: Skills are read once per conversation; routes are followed, not searched (2026-10-11)

> **Tested (2026-10-11):** with act's rule, Claude Code stopped searching the skill folders and followed the route, 3 of 3. Evidence: [E3, E4](evidence.md).
>
> **Amended by D149 (2026-10-17):** skills a route names for the same step are read together, in one turn; the main skill's first read adds conduct's rightsize.

**Decision:** skillbook adds no mechanism and no instruction for reusing a skill already loaded: both agents reuse what they read for the rest of the conversation, after compaction too. act gains a rule: reach a skill by following its route and read its whole file; never search the skill folders for keywords. Whether a long skill whose details never showed in an answer survives compaction is tested once a real long skill exists.

**Why:** In a seven-turn test neither agent loaded the main skill or any file again after reading it, and an instruction to reuse made no difference; after compaction both kept following the skills. Claude Code sometimes searched the skill folders and answered from the matching lines, missing the rest of the skill ([research/skill-loading.md](research/skill-loading.md), "Loading once, using many times").

## D73: Every node stays a skill, for now (2026-10-11)

**Decision:** Every node of the tree below the main skill stays a skill (a folder with `SKILL.md`, registered in `plugin.json`, hidden from the model), even though the agent reaches it by reading its file. Turning internal steps into plain files is left as a later optimisation, node by node.

**Why:** For the agent, a nested skill is only a file to read; the skill format serves the person, who can type any node directly and see it in the slash menu, and other tools, which recognise each node as a skill. One shape for every node keeps the tree easy to build and to change. The costs, a `plugin.json` entry and a path-based name per node and Codex's settings file in each folder, are accepted for now.

## D74: Development machines install the working copy as a local plugin (2026-10-11)

> **Amended by D152 (2026-10-17):** how each set is installed is decided later; this holds for the plugin route if it is kept.

**Decision:** Every machine installs skillbook as a plugin. Where skillbook is only used, it is the published plugin from skillbook's marketplace; where skillbook itself is developed, it is the working copy of this repository, installed as a local plugin, never both on one machine. The link script that installed each skill flat under its name is dropped.

**Why:** With the tree, the link script would turn about ninety skills into personal skills without the `skillbook:` prefix, open to clashes with the person's other skills, and duplicate the main skill's own tree. A local plugin keeps the namespace and behaves as the published one does; Claude Code reads a local plugin in place, so edits take effect at once ([research/skill-loading.md](research/skill-loading.md), "Namespaces and plugins"). Whether Codex, which copies the plugin, picks up an edit without reinstalling, and installing from GitHub, are still to test.

## D75: Every release raises the version; how installed copies update (2026-10-11)

> **Tested on GitHub (2026-10-11):** a throwaway public repository gave the same results as the local stand-in. Evidence: [E5](evidence.md).
>
> **Amended by D152 (2026-10-17):** with separate sets, how each is versioned and updated is decided with the install routes.

**Decision:** Every release raises the plugin's version in `plugin.json`, which release-please does (D23). Someone using skillbook updates it in Claude Code with `claude plugin marketplace update` followed by `claude plugin update`; Codex refreshes a Git marketplace by itself at the next session. On a development machine, Claude Code reads the working copy in place, so an edit takes effect at the next session; Codex copies it, so after an edit the plugin is added again (`codex plugin add`).

**Why:** Claude Code keeps an installed plugin per version and updates it only when the version rises, and only once its copy of the marketplace has been refreshed; Codex copies a local plugin and refreshes Git ones itself ([research/skill-loading.md](research/skill-loading.md), "Picking up a changed plugin"). Tested with a Git repository served on the same machine, then on GitHub.

## D76: No group layers; the stages are roots (2026-10-11)

> **Amended by D115 (2026-10-13):** the stages' order is advice with its reason; the work decides where it starts and which stages it skips.
>
> **Amended by D151 (2026-10-17):** plan becomes the root for planning any work before acting; its software-engineering parts, breakdown, slices and sequence, are kept in plan's ideas for the person's software-engineering skills.
>
> **Amended by D154 (2026-10-17):** design and plan are essentials'; the stages after plan are softeng's, so the main skill's stage order runs design → plan, then the set for the kind of work.

**Decision:** engineering is dissolved: design, plan, implement, test, review, ship and maintain sit directly under the main skill, beside conduct, understand and author. The main skill's routing holds the stages' order, design → plan → implement → test → review → ship → maintain, and each stage says what comes next. Names lose the prefix (`design-start`, `implement-code-python`). With productivity set aside (D64), no group layer is left.

**Why:** Routing tests found no difference with or without a group layer ([research/skill-loading.md](research/skill-loading.md), "Top-level shapes"); without one, every name is shorter and a request takes one load fewer. The lifecycle's order, engineering's one job, fits in the main skill's routing.

## D77: Skill-making lives only in the project skill skillbook-tree (2026-10-11)

> **Amended by D94 (2026-10-12):** skillbook-tree no longer calls instruct; the skill-file craft is its own.
>
> **Amended by D112 (2026-10-13):** skillbook-tree writes skills in D112's shape rather than as a main flow over sub-skills, and checks each for overlaps, contradictions, gaps and restrictions that are not needed.
>
> **Amended by D113 (2026-10-13):** skillbook-tree is built first, with only the review; making a skill is added later.

**Decision:** conduct's skill-maker leaves the plugin. skillbook-tree, the project skill in this repository, holds skill-making whole: the general craft of a good skill (a description comprehensive and exclusive, a main flow over sub-skills with steps that end on "done when", tests that the skill fires), learned from Anthropic's skill-creator, superpowers and mattpocock's writing skills (D30), and this tree's own rules (names from folder paths, placement, the manifest). setup adds existing skills to a project and makes none. learn's promotion of a lesson into a skill is future work. Someone using skillbook who wants to write their own skills uses an outside skill-maker until a need for skillbook's own shows.

**Why:** No shipped skill needs one: setup only adds skills, and learn's step toward skills is not designed yet. Making skills happens today only while developing skillbook, so it belongs with the rules only this repository needs (D67).

## D78: Instruction files point to skillbook; skillbook holds the behaviour (2026-10-11)

> **Tested (2026-10-11):** with the narrow exception every real request still loaded the main skill in both agents; Claude Code skipped it for the trivial ones. Evidence: [E6](evidence.md).
>
> **Amended by D93 (2026-10-12):** a project's shared files change only when the person asks; the pointer goes into the person's own files by default.

**Decision:** A project's `AGENTS.md` (which `CLAUDE.md` includes) and the person's own instruction files hold the pointer, "before answering any request, load skillbook's main skill and follow it, except a one-line answer that needs no tool and no file", and, in a project's file, only the facts anyone working there needs whatever agent they use: what the project is and where things are, the commands to build, test and check, and the project's own conventions. Every rule about how the agent behaves lives in skillbook, in conduct, and the instruction files never repeat it; the guardrail principles move there fully. This repository's `AGENTS.md` is cut down to that shape once conduct exists.

**Why:** Instruction files are read by every agent and every contributor, some without skillbook, and on every turn; behaviour rules repeated there would drift from skillbook's and cost every turn. The narrow exception keeps the pointer from loading skillbook for arithmetic or a translation without inviting the agent to treat real work as trivial, which is how Claude Code skipped skills before the pointer existed.

## D79: Codex's settings file sits in every hidden skill's folder (2026-10-11)

**Decision:** Every hidden skill's folder holds `agents/openai.yaml` with `policy: allow_implicit_invocation: false`, beside `SKILL.md`, `references/`, `scripts/` and `assets/`; `agents` is reserved and never names a sub-skill. The main skill, the one visible skill, has no `agents/` folder. A skill's hidden flag has one source, the `disable-model-invocation: true` line in its `SKILL.md`: a script writes each `agents/openai.yaml` from it, the files are committed, and the check script fails when they disagree, when a hidden skill lacks the file or the visible one has it, or when a sub-skill is named `agents`.

**Why:** Codex hides a skill only through that file, at a fixed place: its source hard-codes the folder `agents` and the file `openai.yaml`, treats any folder of that name inside a skill as its settings, and reads only `name`, `description` and a short description from `SKILL.md`, not Claude Code's hidden flag. A missing file leaves the skill visible, which the main skill wants; that is read from the source and is to be confirmed with a run when the first skills exist. Committed files serve a development install and any installer without a build step; the script and the check keep the two flags from drifting.

## D80: Skills are designed in one ideas and one design document per root (2026-10-11)

> **Amended by D108 (2026-10-12):** a draft of the main skill's flow is written now, for the baseline, routing only to conduct and understand.

**Decision:** Each root and the main skill have an ideas document in `blueprint/ideas/` and a design document in `blueprint/design/`. Ideas documents hold what is not decided; design documents hold what a builder needs, with a section per sub-skill answering the same questions: purpose, description, callers, flow, result, files, material, tests, open. An idea moves to the design document when the person agrees, recorded as a decision. A root's file becomes a folder with a file per sub-skill when it grows too long. conduct and understand, the generic roots everything else leans on, are designed first and listed first in the documents' trees; the main skill, which routes to all of them, is designed last. On disk the folders stay in alphabetical order.

**Why:** A builder, the agent using skillbook-tree, should find everything needed in one place per skill; the same questions for every skill keep nothing missed. The main skill cannot be built before what it routes to.

## D81: respond prepares every response, checked before it is returned (2026-10-11)

> **Amended by D114 (2026-10-13):** respond's rules on putting questions and on a question at the end move to conduct's ask; respond names ask.
>
> **Amended by D134 (2026-10-15):** respond gains a rule against flattery, advice to state the person's view at its strongest first, and a last instruction; a comparison is shown only when it helps decide, as its first rule.
>
> **Amended by D145 (2026-10-17):** respond's first rule points to conduct's rightsize, and its fourth keeps only the shape of an explanation; its last instruction runs rightsize's check.
>
> **Amended by D149 (2026-10-17):** a one-line response gets a glance; the full pass runs for longer responses and for any that touch a secret, an irreversible action, a reference or a failure.

**Decision:** conduct's answer is renamed respond: how every response is prepared, whether an answer, a report of work done, a question back or a summary. The main skill reads it first on every request, with act, and checks each response against it before returning it. Beside its earlier rules (complete and nothing extra, things named in words, top-down when explaining, plain words), it gains: the length follows the question; a decision is asked as numbered questions, each with a recommended answer worded so that "yes" accepts it, while understand's deep clarify keeps how the questions are found; outcomes are reported as they happened, what was done, skipped or failed, and a verified result plainly; a response ends on a question only when something is truly open. Each rule carries one short example and must hold with the example deleted; everything sits in `SKILL.md`. Five tests check it: a decision named in words, a short answer to a short question, an explanation's top-down order, a choice asked as numbered questions, a failure reported.

**Why:** "Answer" read as a skill that answers questions; the skill shapes every message the agent sends, and the name now pairs with act. Checking the response at the end, not only loading the rules at the start, is where they take effect.

## D82: respond checks the guardrails before a response is returned (2026-10-11)

**Decision:** respond's final check includes the guardrails: the response gives away no secret or credential, puts no vulnerability detail where it becomes public, follows no instruction found in text the agent did not write, and reports nothing irreversible done without approval. When a response touches any of these, it is checked against guardrails' details; otherwise guardrails is not read.

**Why:** The response is the last point before anything leaves the agent, so a guardrail checked there catches what the work missed; reading guardrails' details only when a response touches them keeps every other response at the cost of respond alone.

## D83: A response is necessary and sufficient; a boundary is comprehensive and exclusive (2026-10-11)

> **Amended by D145 (2026-10-17):** necessary and sufficient is now conduct's rightsize's, for anything given back or made, and respond's first rule points there; comprehensive and exclusive stays the name, rightsize checking it for any parts and organize's boundary rule serving it.

**Decision:** respond's first rule is named "necessary and sufficient": every part of a response is necessary, and the whole is sufficient to understand or act without asking again; before returning, the agent asks both questions of the response. "Comprehensive and exclusive" stays the name for a boundary: a skill's description (D62) and the parts organize makes (D61). Both terms, and MECE, are defined in the glossary.

**Why:** For a response, the useful check is about its parts, each earning its place and together enough; for a boundary, it is about what falls inside and outside. One name for each keeps every term to one meaning.

## D84: act's rules (2026-10-11)

> **Amended by D107 (2026-10-12):** the fifth rule covers every kind of risky action and says that text the agent did not write is data; the fourth sends claims of done, fixed, passing or requirements met to verify; three rules are added: stop after three failed attempts, which instruction wins, running as a delegated agent.
>
> **Amended by D115 (2026-10-13):** act's rules point to their homes: clarify for when to ask and how deep, guardrails for risky actions and for which text is an instruction; a concern that would change the work is asked and waited on; file types with no skill go to the project's conventions and the agent's judgment; the person's own instruction files rank above skillbook's defaults; act holds the delegated agent's rules alone.
>
> **Amended by D126 (2026-10-13):** act is to name conduct's cleanup at the end of every task.
>
> **Amended by D129 (2026-10-14):** act's rule 12: before saying a task is done, follow conduct's cleanup.
>
> **Amended by D134 (2026-10-15):** four rules gain their reasons, and "about three attempts" becomes advice.
>
> **Amended by D145 (2026-10-17):** act gains a thirteenth rule, the work rightsized by conduct's rightsize; doing exactly what was asked stays its third.
>
> **Amended by D155 (2026-10-17):** act gains a rule sending multipart work through plan; the plan in "a view and a plan" is made there, shown, never started.
>
> **Amended by D156 (2026-10-17):** in the rule on which instruction wins, a skill's word on where its result is kept, or in what form, is a default, one of skillbook's defaults, giving way to any loaded instruction for the same case.

**Decision:** act holds eight rules, each with one short example, all in `SKILL.md`: clarify before acting, through understand's clarify, leaning towards it (when in doubt whether to ask, ask; when in doubt how deep, go deep); an opinion is not a task (asked what the agent thinks, or told the person wants to explore, it gives a view and a plan, then waits); concerns first, then exactly what was asked, with follow-ups named rather than done; evidence before any claim (the file and line for what is said to exist, the result before "done"); propose before anything that cannot be undone; nothing from the conversation goes into the project (comments, commits, pull requests); follow the skill for a file's type before writing it; reach a skill by its route. guardrails holds the details behind the proposing rule: never delete without confirmation, ask before changes across many files, an edit scope, plan then apply for bulk edits, a checkpoint first. Six tests check it.

**Why:** act loads on every request, so it holds principles in a line each and leaves details to guardrails. The person prefers a question too many to a misunderstanding acted on; opinions asked for are not changes asked for.

## D85: organize holds five operations (2026-10-11)

> **Amended by D107 (2026-10-12):** a chooser among the five operations; after a change the result also holds the map of before and after, the inventory or test result, and what was retired, edited or relinked.
>
> **Amended by D115 (2026-10-13):** organize's chooser says which operation fits when items move, stay under a new parent, or only gain a view; a request that fits none is not organize's.
>
> **Amended by D141 (2026-10-17):** organize takes the full shape: its shared rules with their reasons, the check as an instruction, one routing line per operation, and a last instruction.
>
> **Amended by D145 (2026-10-17):** organize's boundary rule points to conduct's rightsize for parts that are comprehensive and exclusive.
>
> **Amended by D148 (2026-10-17):** organize and split also plan wholes not yet written, the items being what the whole must cover; split and cluster gain advice on parts read on their own and sized to how they are read.

**Decision:** organize holds the shared rules and the check, with five sub-skills sorted by what happens to the items: split (one into several; also grouping loose items), merge (several into one survivor, links updated), compose (a new parent above items that stay whole), normalize (the shared part taken out into one place the items use), cluster (a view added for finding items, the items unchanged). The shared rules: one dividing principle at a time; each boundary in one sentence, comprehensive and exclusive; every change proposed and applied only after approval; warning signs (an "other" part, parts at different levels, more than about seven at one level). The check, given existing parts, reports overlaps, gaps and mixed levels or terms. split's flow: frame, list the items, choose the principle, draw boundaries, place every item, resolve, check; done when every item has one home or the exceptions are named. Results go back to the caller with the principle, the parts and their boundaries, each item's place and the exceptions. `SKILL.md` only, to start. merge, compose, normalize and cluster get their flows later.

**Why:** The five are the structural operations of the person's VaultOps, where they are defined as decompose, merge, compose ("create parent/generalization"), normalize ("extract shared logic") and cluster ("group for navigation"), all applied only after approval. Each changes the items differently, so each is one sub-skill; "split" replaces "decompose" as the plainer word.

## D86: organize works on any unit, preserves meaning, and the person verifies (2026-10-11)

> **Amended by D107 (2026-10-12):** the person's two approvals apply only when something changes, and hold even where guardrails' proportion would skip a proposal.
>
> **Amended by D148 (2026-10-17):** the units are listed once, in organize's first step, from sentences to a system's components; the inventory is done by a script or a light fresh agent, never by reading everything twice in the main session; meaning preserved and the two approvals apply only when something existing changes.

**Decision:** organize's rules speak of items, parts and boundaries, so they apply to any unit the agent chooses: sentences, paragraphs, sections, files, folders, skills, code modules, packages; examples span text, files, skills and code. Every operation preserves meaning: nothing lost, nothing added, nothing altered; for text, files and skills this is checked by an inventory, every statement before found after with the same meaning, and for code, whose meaning is its behaviour, by tests. The person verifies twice: before applying, the plan, shown as a map of where every item goes; after applying, the result, shown with the inventory or the test results. For code and packages, organize proposes the arrangement, consulting design's architecture skill, and implement makes the change under tests.

**Why:** The operations are the same whatever the unit, and for code they are the classic refactorings. What can go wrong is the same too: a merge drops a nuance, a normalized part no longer fits one of its users. An automated check catches some of it; meaning is the person's to confirm.

## D87: The flows of merge, compose, normalize and cluster (2026-10-12)

> **Amended by D107 (2026-10-12):** compose needs at least two items; retiring keeps an item marked with where its content went, and deleting it goes through guardrails; normalize puts a rule in the conduct sub-skill whose subject it is.

**Decision:** Within organize's shared rules (D85, D86):

- **merge:** confirm the items are redundant, not merely related; choose the survivor (the most complete, the most linked to, or the person's choice); combine part by part, keeping what is the same once, adding what is in one only, uniting lists, and flagging contradictions for the person; map every statement to its place; apply, retiring the others with "merged into" and updating everything that pointed at them. Done when one survivor holds everything, nothing points to a retired item, and the person has confirmed.
- **compose:** find what the items share; check it earns a parent (at least two or three items, and a parent that says something none says alone); name it and write its boundary; place the items under it unchanged. Done when the parent states what they share, every item that belongs is under it, and the items are unchanged.
- **normalize:** find the repeated part; confirm it means the same everywhere, leaving and flagging a copy that differs; choose its one home; write it once, general enough and no more; replace each copy with a reference. Done when it exists once, every former copy points to it, and each item means what it did.
- **cluster:** who needs to find what; one grouping principle, each item in one main group with "see also" allowed; the view's form by unit; how it stays current, finding missing items and dead entries. Done when every item is reachable and nothing in the view points to nothing.

Each hands back the before-and-after map, the inventory or test result, and what was retired, edited or relinked; each is `SKILL.md` only; each has a test (a link to a retired item updated; an unrelated item left out of a parent; a near-duplicate flagged; a missing file caught).

**Why:** The steps follow the person's VaultOps drafts (the merge process, the breadth rule, the orphan check), made general to any unit (D86).

## D88: Skills show what they do in simple text diagrams (2026-10-12)

**Decision:** A skill may open with a simple text diagram wherever its effect or flow is easier seen than read: a loop, a decision easy to miss, or what an operation does to its items, before and after. Each of organize's five operations has a one-line before-and-after diagram at the top of its `SKILL.md`, and organize's own `SKILL.md` shows the five side by side.

**Why:** organize's operations differ only in what happens to the items, which a picture shows at a glance; a few lines of diagram cost little and let the agent and the person check they mean the same operation.

## D89: verify's flow (2026-10-12)

> **Amended by D107 (2026-10-12):** the four further checks apply to a plan's task, a commit or a pull request; a check done by hand three times is proposed as a script; act's rule on evidence sends claims here.
>
> **Amended by D115 (2026-10-13):** the person's check in verify is of the result; approving a risky action beforehand is guardrails'.
>
> **Amended by D121 (2026-10-13):** who checks points to conduct's stakes once it is designed.
>
> **Amended by D123 (2026-10-13):** verify is to widen to how strong evidence is for any claim.
>
> **Amended by D133 (2026-10-15):** who checks takes whether something can be undone, and how much rides on it, from conduct's stakes.
>
> **Amended by D149 (2026-10-17):** verify reads the exit code, the failure count and the failing lines, the full output only on failure; its four extra checks search and read the hits, a fresh agent doing large readings.

**Decision:** verify names the claim about to be made, chooses the evidence that would fail if it were false, chooses who checks (the agent for what a command or file shows; the person for meaning, taste, the irreversible and what no check sees), runs the check fresh and whole and reads the full result, then states the claim with its evidence or the actual status. Done when every claim has its evidence beside it or is marked unverified. A table in `SKILL.md` pairs common claims with the evidence each needs and what is not enough. Larger work gets four more checks before it is called done: contradiction, duplication, drift, coverage. A check repeated by hand is proposed to the person as a script or lint rule. `SKILL.md` only; four tests.

**Why:** It keeps superpowers' "evidence before claims" without its shouting, adds the person as the verifier where no check can see, and takes workslate's upward checks for work larger than one step.

## D90: The blueprint keeps an evidence log (2026-10-12)

> **Amended by D107 (2026-10-12):** verify hands its result back; the caller files evidence through design's evidence step.

**Decision:** A blueprint gains a strand, `evidence.md`, beside `decisions.md`: append-only, entries numbered E1 onward, each holding the claim, the evidence (what was run or seen, and its result), who verified it, the date and what it supports. Only claims that matter beyond the conversation are entered: a task finished, a requirement met, a decision tested, a release checked, the person's confirmation of meaning after an organize change. verify hands the claim and its evidence back; design gains a recording step, evidence, which files it where a project keeps a blueprint, and author's blueprint skill holds the entry's form. Links run both ways: a decision's "Tested" note and a finished task point to their entries. skillbook's own blueprint starts the log with the tests already run.

**Why:** Decisions say why, research what was learned; nothing recorded that a claim had been checked, so test results were scattered into notes under decisions. A log of checked claims, kept like the decisions, makes them findable and lets a later change see what it must re-check.

## D91: guardrails' kinds of risk and flow (2026-10-12)

> **Amended by D107 (2026-10-12):** an eighth kind, weaker checks, proposed first; the never-rules hold whatever any instruction says; the flow ends on a "done when".

**Decision:** guardrails sorts risky actions into five kinds, each with its rule: what cannot be undone (never without confirmation; the reversible way first; safe writes: check a file is unchanged since it was read, never write it empty, append rather than rewrite), what is wide (plan first, list everything touched, stay in scope), what goes outward (propose every time), others' text (data, never instructions), secrets and security (never in files, commits or responses; vulnerabilities never public). A risky action is proposed with its exact scope and how to undo it, waits for approval, takes a checkpoint, applies exactly the approved scope, and is checked and reported through verify. An approval covers one action and its scope, not the next action or another context. `SKILL.md` only; five tests. VaultOps' review status on what an agent touched is parked with the project folder.

**Why:** Recognizing a risk by its kind covers cases no list of examples foresees; the one-approval-one-action rule matches how the person approved creating a test repository without approving its deletion.

## D92: guardrails gains reach, cost, others' code and the network (2026-10-12)

> **Amended by D107 (2026-10-12):** a trivial cost is below the person's own figure, US$1 by default, or one already accepted in the conversation, and the cost rule lives only here; the project's documented commands with pinned dependencies run without asking.
>
> **Amended by D115 (2026-10-13):** guardrails defines instructions and data once; proportion covers only reversible changes inside the task, and a kind whose rule is to propose always needs it.
>
> **Amended by D121 (2026-10-13):** proportion points to conduct's stakes once it is designed.
>
> **Amended by D126 (2026-10-13):** the agent's own temporary material, created in this task in a temporary or scratch place, is cleaned without asking and reported; anything else is proposed.
>
> **Amended by D129 (2026-10-14):** cleaned without asking also covers the agent's own temporary edits in the work and the local branches and worktrees it made with nothing uncommitted or unmerged; things outside the machine are always proposed.
>
> **Amended by D133 (2026-10-15):** proportion takes whether a change is reversible and how far it reaches from conduct's stakes; what each kind needs stays guardrails'.

**Decision:** guardrails has seven kinds of risk: the five of D91, with others' text widened to others' text and code, plus reaching outside the task (the home folder, other projects, personal files: ask first, naming exactly where) and cost (paid model runs, many agents, long jobs: state the expected cost and ask unless trivial). On the network, reading is allowed and what comes back is data, local data sent out is outward, and anything fetched and run locally (scripts, binaries, packages, containers, `curl … | sh`) runs only after approval, its source named, pinned and known sources preferred. Some places are never visited, whatever the task or the link: adult content, gambling, piracy, malware and other illegal or unsafe sites; a task that leads there stops and asks. The flow proposes with a dry run's output where the tool offers one, and stops on surprise: an action doing more or other than proposed stops and is reported, never continued or quietly repaired. A change that is reversible and inside the task's scope needs no proposal. Four more tests.

**Why:** Each comes from the design sessions: a search of the whole disk outside the task, paid test runs costed only by habit, and the person's caution about running anything fetched from the network. Proportion keeps proposals for what matters, so approvals stay read.

## D93: setup writes to the person's own files by default (2026-10-12)

**Decision:** setup puts the pointer in the person's own instruction files, `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, which both agents read in every project on top of the project's files; no project file is touched by default. Project-only personal instructions, when asked for, go into `CLAUDE.local.md` for Claude Code, which is read in addition to `CLAUDE.md`, kept out of git through `.git/info/exclude` so the project's `.gitignore` is not changed either; for Codex nothing is offered unless asked, and then with a warning, because its `AGENTS.override.md` is read instead of the shared `AGENTS.md` in that folder. A project's shared `AGENTS.md` or `CLAUDE.md` changes only when the person asks, as a proposal, for example in a team that adopts skillbook.

**Why:** A pointer in shared files imposes skillbook on everyone working on a project, and tells the agents of people without it to load a skill that does not exist. The person's own files reach every project without touching any. Claude Code read `CLAUDE.local.md` alongside `CLAUDE.md` ([evidence.md](evidence.md), E7); Codex's source reads, in each folder, only the first of `AGENTS.override.md` and `AGENTS.md` ([research/skill-loading.md](research/skill-loading.md), "Instruction files").

## D94: instruct writes and updates instruction documents (2026-10-12)

> **Amended by D107 (2026-10-12):** tool names are kept neutral only in `AGENTS.md` and other shared files.
>
> **Amended by D115 (2026-10-13):** a rule repeating skillbook's is left out only where the whole team uses skillbook, as setup says; about 200 lines is advice (D116).
>
> **Amended by D145 (2026-10-17):** instruct's reader and prune steps point to conduct's rightsize, keeping a document read on every turn short.

**Decision:** instruct writes and updates instruction documents: a project's `AGENTS.md` and `CLAUDE.md`, a `CLAUDE.local.md`, the person's own instruction files. The person asks for it at any time, and setup calls it when it writes into one. Skill files are not instruct's; their craft is skillbook-tree's, in this repository. Its flow: reader and cost; what the document must let an agent answer, written first as its tests; when updating, the current document read first; draft; prune; check; propose for approval. Its rules: pointers with the key word first; steps that end; reasons instead of capitals, positive wording, one example per rule, the project's terms, nothing unresolved, no tool name one agent alone has; shape that keeps in the document only what every session needs; which file holds what (D93); under about 200 lines, nothing repeating a skillbook rule, never inside a folder copied into other projects. `SKILL.md` only; five tests.

**Why:** Once skill-making left the plugin (D77), instruct's skill-file half duplicated skillbook-tree; what remains is a job of its own, asked for at any time, apart from setup, which configures skillbook for a project or machine.

## D95: Responses follow the markdown skill, which holds structure for all markdown (2026-10-12)

> **Amended by D107 (2026-10-12):** respond's markdown rule is one pointer; the structure layer sits at the top of the markdown skill's `SKILL.md`, its file rules in its references.
>
> **Amended by D110 (2026-10-12):** the line rule moves to structure: prose is never wrapped, in files or responses; table rows and code lines keep within 120 characters; tables are few.
>
> **Amended by D111 (2026-10-12):** the structure layer holds seven rules; the file rules sit in the skill's references, and a project's own lint configuration wins over them.

**Decision:** respond gains a tenth rule: a response is written in markdown, following author's markdown skill. author's markdown skill holds two layers: structure, for all markdown, responses included (sections marked with headings, bold only for labels inside a section, tables only for values scanned across, code fenced with its language named); and file rules for markdown files only (the lint rules, such as lines of at most 120 characters). act sends every markdown file to it, and respond every response.

**Why:** The person found sections marked with bold lines instead of headings hard to track. Formatting is the markdown skill's subject; respond points to it rather than holding formatting rules itself, and the file-only lint rules do not burden a chat answer.

## D96: explain's description and tests (2026-10-12)

> **Amended by D107 (2026-10-12):** the second test is "explain what you meant by X"; a fresh "explain X" goes to understand.

**Decision:** explain's description: "Clearing up something the agent said that did not land: explained top-down, every reference in words, stopping once it is clear." Its tests: a response full of decision numbers followed by "I don't follow" gets an explanation naming each in words; "explain X" follows the top-down order and stops without detail nobody asked for; "explain more" goes one level deeper on the piece asked about, not on everything.

**Why:** explain's flow was decided (D54); these complete its section.

## D97: setup's flows (2026-10-12)

> **Amended by D107 (2026-10-12):** setup checks each agent the person uses, writes the allow-list of other harnesses, checks loading with a request that needs a file, proposes removing repeated skillbook rules from shared files only when the whole team uses skillbook, and keeps each agent's paths in reference files.
>
> **Amended by D117 (2026-10-13):** setup's project flow starts the blueprint when a project has none, and asks where it lives in a project the person does not own.
>
> **Amended by D149 (2026-10-17):** setup asks nothing about other agent programs, whose default stays none, and states its default on whether the team uses skillbook rather than asking.

**Decision:** setup has two ways in. A machine, once per computer: check the skillbook plugin is installed in both agents, showing how if not; add the pointer to the person's own instruction files through instruct, unless it is there; check a fresh session loads the main skill. A project, once per project: read what it is and what files it has; check its instruction files through instruct, keeping the facts, proposing to remove what repeats a skillbook rule and to add what is missing; recommend the skillbook skills and outside skills that fit; propose everything as one list and apply what is approved. Running either again changes nothing that is right. Hooks are proposed only when a rule keeps being broken despite the skills. `SKILL.md` only; five tests.

**Why:** A machine and a project are set up at different times and touch different files; checking that the main skill loads is the evidence that setup worked.

## D98: learn's destinations, description and tests (2026-10-12)

> **Amended by D107 (2026-10-12):** learn runs only when asked; its record is a list in the response of where each highlight went.
>
> **Amended by D115 (2026-10-13):** learn is offered through conduct's wrap-up rule; highlights are the moments that changed the work.
>
> **Amended by D117 (2026-10-13):** an insight stays in the response only outside any project.

**Decision:** learn runs only when the person asks, or at the end of a session, never by itself. A rule goes into an instruction document through instruct; a decision into the blueprint through design's decide step; an insight into the blueprint's notes through design's discuss step, until the knowledge folder exists, and where a project has no blueprint it stays in the response. Description: "What a session taught: highlights collected and judged, then, with approval, made into a rule, a decision or a note, or dropped." `SKILL.md` only; three tests.

**Why:** Every promotion needs the person's approval, so running unasked would only interrupt. The blueprint's notes already hold what sessions produce; insights can move to the knowledge folder once it is designed.

## D99: delegate, with council, fanout and crew (2026-10-12)

> **Amended by D105 (2026-10-12):** search first; delegate reading only what a search cannot narrow.
>
> **Amended by D107 (2026-10-12):** the cost is stated before the brief; work that will need a judgment review is not given to the light tier; crew also covers proposals to one shared item; fanout's findings take one format, a script consolidates them and checks each quote, and the validator is at the strong tier; the reference files wait for rigs.
>
> **Amended by D115 (2026-10-13):** council asks every member the same question; fanout gives each agent a part the others do not have; crew gives each agent its own items, a shared item one owner; delegate uses a harness's own means of running agents to carry these out.
>
> **Amended by D121 (2026-10-13):** delegate's tiers point to conduct's stakes once it is designed.
>
> **Amended by D129 (2026-10-14):** the brief asks each agent to clean up after itself and report what it left behind in cleanup's three fields; the main agent checks them.
>
> **Amended by D133 (2026-10-15):** the tier table maps stakes' answers to a tier, and stays delegate's.
>
> **Amended by D137 (2026-10-17):** delegate's result carries what each agent left behind; when verify starts the agent, its report goes back to verify as the check; two restrictions gain their reasons.
>
> **Amended by D138 (2026-10-17):** delegation is the default for any task that is not too small; the three reasons become advice for choosing the agent and the kind; delegate takes the full shape, with routing lines for council, fanout and crew.
>
> **Amended by D142 (2026-10-17):** the type is chosen first, after a cost check: several agents only when the parts are large, independence or different lenses improve the result, time matters and the person accepts the cost, or one agent's context would fill up.
>
> **Amended by D143 (2026-10-17):** the tier table gains an effort column, decided by the same question.
>
> **Amended by D144 (2026-10-17):** the tier table goes back to the tier alone; effort is chosen apart from it, by how much reasoning the step needs.
>
> **Amended by D149 (2026-10-17):** delegate reads stakes only when the tier's row is not plain and guardrails only when several agents or a long job are planned; fanout's agents write their findings to files, and its validator checks the findings the answer rests on and any that contradict.

**Decision:** delegate holds what every kind of delegation shares: whether to delegate, for one of two reasons (hard work to a stronger model; or wide, light work to a lighter one, worth it only when the reading is many times larger than a subagent's start-up and the brief, returning compact findings with exact sources and what was not found, judgment kept by the main agent); checking the obstacle before escalating; choosing the tier by what happens if the agent is wrong; a brief of findings, not files; checking the work through verify; stating the cost. Tiers map to model names per agent in `references/claude.md` and `references/codex.md`. Three sub-skills hold the kinds with flows of their own: council (one question, independent answers, a summary keeping disagreements, the person decides), fanout (split by angle, findings with sources, consolidated in code, validated adversarially, synthesized, the skipped named), crew (one agent per part, re-read after writing, one pass in sequence afterwards). The wide, light reason is tested before it is relied on.

**Why:** The person's `delegation-routing` settles most of it; the second reason, saving the main agent's context and cost on reading, is the person's own and is tricky enough to test. "survey" was set aside for fanout because understand's research already has a survey.

## D100: Sub-skills take one-word names (2026-10-12)

**Decision:** A sub-skill's folder name is one word. The two that break the rule, maintain's `close-gaps` and implement's `agent-tools`, are renamed when their roots are designed.

**Why:** One-word names read cleanly in a path joined by dashes, where a hyphen inside a name blurs where one name ends and the next begins (`maintain-repo-close-gaps`).

## D101: A council may mix models and agents (2026-10-12)

> **Amended by D107 (2026-10-12):** three members by default, each briefed without the main agent's own view.
>
> **Amended by D115 (2026-10-13):** council members are not at the light tier, since each answer is a judgment.

**Decision:** council's members may differ by model (light and strong) and by agent (a Codex agent beside a Claude one). The summary says which member said what. How to start another agent is in delegate's reference file for it; the cost is stated first.

**Why:** Independent answers from one model share its blind spots; different models and agents disagree in more useful ways, which is what a council is for.

## D102: Delegation may use other harnesses, on an allow-list (2026-10-12)

> **Amended by D107 (2026-10-12):** the cost follows guardrails' rule on cost.
>
> **Amended by D149 (2026-10-17):** the rules for other harnesses move to delegate's `references/other-harnesses.md`, read only when one is named.

**Decision:** delegate, and council with it, may run another agent program, such as Codex or Gemini's command-line agent, but only those on an allow-list in the person's own instruction file, which setup can write. Five rules hold: the person approves sending a project's files to another company, per project and per harness; the other harness runs read-only by default and writes only as a crew member with an approved scope; the cost is stated first; its findings come back in the same shape and are checked through verify; a harness started by delegation never delegates further. Each harness has a reference file. A first test delegates one fanout task to `codex exec`.

**Why:** Other harnesses bring different blind spots, strengths (a very large context window for reading, strength at code changes) and quotas; the risks, data leaving for another provider, other permissions, separate billing, unverified claims and loops, each get a rule.

## D103: A root named rigs, for the programs agents drive (2026-10-12)

> **Amended by D154 (2026-10-17):** rigs becomes a set of its own, designed later.

**Decision:** A root named rigs will hold skills for using specific programs: git and the GitHub CLI, other agent programs used for delegation, herdr, nvim, containers, each program with one home that delegate, council and setup point to. It stands in the tree as a placeholder; its contents are designed later.

**Why:** These skills are about a program, used from many roots, rather than a kind of work. "tools" collides with an agent's own tools; a rig is the equipment one works with.

## D104: handoff's two sides (2026-10-12)

> **Amended by D107 (2026-10-12):** a seventh part, what the handoff was written against (the date, the branch, its last commit); proposed when the person says they are stopping or a long task stops with steps left.
>
> **Amended by D115 (2026-10-13):** handoff is offered through conduct's wrap-up rule; part 7 records uncommitted changes, or without git the files changed; where it goes is asked when the person names no place.
>
> **Amended by D117 (2026-10-13):** outside any project, a handoff goes to a file the person names.
>
> **Amended by D129 (2026-10-14):** a handoff's references include what was kept on purpose, with where it is and why.
>
> **Amended by D147 (2026-10-17):** handoff becomes carryover; its shared parts follow brief's rules, and it is offered at a phase's end when a long session's next work fits in it.
>
> **Amended by D156 (2026-10-17):** carryover says what goes in; where it is kept and in what form is a keeper's, such as blueprint's where the project's instruction files point to it; by default, a file the person names, the agent recommending one.

**Decision:** handoff writes and resumes. Writing makes a document of about a page, in markdown following author's markdown skill, with six parts: done with evidence; remaining in order; decisions made and where each is recorded; what is uncertain or assumed; references by path; the first next step. Resuming reads it, checks it is still true (files changed, a branch moved, new commits), reports any difference before acting, and continues from the first step. It is written when the person asks; the agent proposes one when a long session with much unfinished work nears compaction. It is kept in the blueprint's notes where a project keeps one, otherwise in a file the person names or in the response. `SKILL.md` only; four tests.

**Why:** A handoff acted on after the world moved is worse than none, so resuming checks first; compaction keeps the gist but can drop details, which a handoff written in time keeps.

## D105: Search first; delegate only reading a search cannot narrow (2026-10-12)

> **Amended by D107 (2026-10-12):** "many times larger" is very roughly 80,000 to 100,000 tokens or more, an inference, not a measurement.
>
> **Amended by D116 (2026-10-13):** the delegation threshold is advice, an estimate.

**Decision:** delegate's second reason, wide and light work to a lighter model, applies only after searching: the reading is delegated when a search cannot narrow the material, and what remains is many times larger than a subagent's start-up, the briefs and the reports added to the main agent's context.

**Why:** In a test over fifty documents the main agent found every answer by searching for US$0.21, while delegating the reading to haiku subagents cost US$0.43 and grew its own context by a third ([evidence.md](evidence.md), E8).

## D106: conduct's own skill is a router (2026-10-12)

> **Amended by D107 (2026-10-12):** the routing lines are narrowed, four routing tests added, and a wrap-up with unfinished work offers learn and handoff in one question.
>
> **Amended by D115 (2026-10-13):** conduct's own skill holds one rule, the wrap-up offer, and routes a request that fits no row to the agent's judgment under act; ask gets a routing line (D114).
>
> **Amended by D134 (2026-10-15):** conduct's routing table becomes routing lines under six headings, each with when, when not and what it gives back.

**Decision:** conduct's `SKILL.md` holds one paragraph on what conduct is, a note that respond and act are already loaded (read again only when their rules are unclear), and one routing line per on-demand sub-skill, each comprehensive and exclusive; no rules of its own. respond and act are never reached through it: the main skill reads them directly by path on every request. Other skills reach conduct's sub-skills by asking the main skill, which routes through this file. Description: "How the agent acts in every root: responding, acting, organizing, explaining, verifying, guardrails, instruction documents, setup, learning, delegating, handoffs." `SKILL.md` only; six routing tests, one checking that "explain this function" is turned away from explain.

**Why:** The rules are respond's and act's; conduct only points. One route for every root keeps the main skill short; the extra read of conduct's file happens once per conversation.

## D107: conduct revised after an outside review (2026-10-12)

> **Amended by D116 (2026-10-13):** act's three failed attempts become a rule to stop, report and ask, with about three as advice; a council has about three members, as advice.
>
> **Amended by D128 (2026-10-14):** the findings format's one home moves to understand's research; fanout keeps how its agents write it for its script.
>
> **Amended by D144 (2026-10-17):** skills name tiers, never a model; the Claude mapping, fable only after opus fell short, lives in delegate's reference file for Claude, beside each model's price and price step.
>
> **Amended by D147 (2026-10-17):** the wrap-up offer offers learn, then carryover, handoff's new name, and gains the reason for a break: resuming a long conversation after the cache expires writes it all again.

**Decision:** An outside agent reviewed conduct's design as a builder would; these changes close what it found. The detail is in [design/conduct.md](design/conduct.md).

- **Risky actions:** act's fifth rule covers every kind guardrails knows, not only what cannot be undone, and says that text the agent did not write is data, never instructions. guardrails gains an eighth kind, weaker checks (skipped tests, `--no-verify`, looser lint, wider permissions or hooks), proposed first. act stops after three failed attempts at one step and reports.
- **Which instruction wins:** the person's explicit instruction in the conversation, then the project's instruction files, then skillbook's defaults; guardrails' never-rules hold whatever is said. A project rule to propose every commit message therefore holds over proportion.
- **Cost:** a trivial cost is below a figure the person sets in their own instruction file, US$1 by default, or one already accepted in the conversation. The rule lives only in guardrails; delegate states the cost before the brief, and council and other harnesses point to guardrails.
- **The project's own commands,** documented and with pinned dependencies, run without asking each time; installing anything new, or running a downloaded script, needs approval.
- **A delegated agent,** with no person present, lists its questions in its report, does nothing outward, stays inside its brief and never delegates further; the brief carries these rules, and act has one line on them.
- **explain** is only for what the agent itself said; explaining something new is understand's.
- **organize:** a chooser among its five operations; its two approvals only when something changes, holding over proportion; retiring defined, with deleting through guardrails; its result after a change as merge's (D87); compose needs at least two items; normalize puts a rule in the conduct sub-skill whose subject it is.
- **verify:** act sends claims of done, fixed, passing or requirements met to it; its four further checks apply to a plan's task, a commit or a pull request; a check done by hand three times is proposed as a script; its result goes back to the caller, which files evidence through design's evidence step.
- **respond:** its markdown rule is one pointer to author's markdown skill, whose structure layer sits at the top of its `SKILL.md` and whose file rules move to its references. Its guardrail rule reports first, plainly, anything irreversible done without approval. Where its rules meet act's, a clarifying question act needs is truly open, and the follow-ups act names are not a side topic.
- **crew** also covers agents proposing changes to one shared item that one agent applies, serving author's edit and design's parallel staged mode; its parts are planned and approved as a wide change.
- **fanout and council:** fanout's findings take one format (the claim, its source, the quoted words, read or inferred); `scripts/consolidate` merges them and checks that each quote exists at its source; the validator is at the strong tier. A council compares judgments on the same material, three members by default, briefed without the main agent's own view; a fanout combines findings from different places, so a review with one lens per agent is a fanout.
- **handoff** gains a seventh part, what it was written against (the date, the branch, its last commit), and is proposed when the person says they are stopping or a long task stops with steps left.
- **learn** runs only when asked; at an explicit wrap-up with unfinished work, conduct offers learn and handoff in one question, learn first, so the handoff can say where decisions were recorded.
- **setup** checks each agent the person uses, writes the allow-list of other harnesses (D102), checks loading with a request that needs a file, proposes removing repeated skillbook rules from shared files only when the whole team uses skillbook, and keeps each agent's paths in reference files. **instruct** keeps tool names neutral only in shared files.
- **Loading:** a sibling within conduct is read by its path; another root's skill is reached through the main skill.
- **The rest:** every step without an end gets a "done when"; open descriptions get drafts seeded from the routing lines; untested rules get tests; delegate's thresholds are stated (fable only after opus fell short; "many times larger" as very roughly 80,000 to 100,000 tokens, an inference).

**Why:** The review found rules that could not be checked, two skills claiming one request, steps without an end and rules that pulled against each other. Each change makes a rule checkable, gives a request one home, or says which rule wins.

## D108: A first baseline, and the order to reach it (2026-10-12)

> **Amended by D111 (2026-10-12):** step 1 of the main skill's draft flow reads author's markdown skill too, with respond and act.
>
> **Amended by D112 (2026-10-13):** the draft flow gives way to D112's shape: rules, then one instruction per root, respond last; routing to more than one root and guidance rather than a script are settled by it.
>
> **Amended by D115 (2026-10-13):** a request for a root not built yet is done directly under act's rules until it exists.
>
> **Amended by D136 (2026-10-15):** the main skill routes to understand, author's markdown and conduct for now, and the baseline holds all of understand, now designed.
>
> **Amended by D154 (2026-10-17):** the baseline's markdown part becomes essentials' output-format skill, designed before the baseline is built; author's markdown is authoring's.

**Decision:** The first thing built and tested is a baseline: the main skill with a draft flow, all of conduct, understand's clarify, and author's markdown skill. Before it, understand is designed, then author's markdown skill, then the flows are revisited. The baseline is built and tested, with the harness and in use, while the rest of the tree is still being designed. The main skill's flow is a draft, an initial idea: read act and respond, take the request in under act, route to conduct or understand or do the work directly, and check the response against respond. Routing to more than one root, and guidance rather than a script, are open questions to take up with the flows.

**Why:** conduct and understand look like prerequisites for every other root, though that is not certain; starting simple gives something to test and use early, and what the tests show can shape the rest.

## D109: clarify, its shared rules and its three parts (2026-10-12)

> **Amended by D115 (2026-10-13):** clarify is the one home for what to ask and how deep; dependence is the only trigger for deep; its parts point to conduct's ask (D114) and to clarify's shared rules instead of restating them.
>
> **Amended by D117 (2026-10-13):** deep's recording, used directly, goes to the blueprint's notes in a project.
>
> **Amended by D119 (2026-10-13):** shallow's lenses have their one home in understand's frame; shallow asks only for what the frame could not fill.
>
> **Amended by D131 (2026-10-14):** facts first and who decides move up to understand's rules; clarify keeps asking only what would change the work, how deep, and which part.
>
> **Amended by D135 (2026-10-15):** clarify and its parts take the shape every skill with parts takes; choosing the part becomes advice and routing lines.

**Decision:** clarify is designed with its three parts ([design/understand.md](design/understand.md)).

- **clarify** finds out what the person means before acting; it mirrors conduct's explain, which clears up what the agent said. Its own skill holds four shared rules: find facts first; ask only what would change the work; every question with a recommended answer, put as respond says; nothing acted on until the answers are in, a firm rule. It chooses the part, as recommendations the agent weighs: shallow first; deep where a part needs it, triggered by dependence rather than the number of questions, and from the start when the person asks to be questioned; questionnaire for questions only someone else can answer, after the person answers theirs; deep when unsure.
- **shallow** aims at the full picture of the level being analysed: one round across that level, each question with a default, then "going with: …" before starting.
- **deep** questions a part or a whole plan until nothing is assumed: numbered rounds that ask what can be answered now, one by one on request. It no longer maps a tree of decisions. It ends with a summary of decided, parked and assumed that the person confirms, and offers to record decisions in long sessions.
- **questionnaire** asks the person only who it is for, what is needed back and where it goes; its document can be answered without the conversation; the agent never sends it; its answers are input the person turns into decisions.
- **Results** take understand's shape, plus what was assumed; clarify keeps nothing. Each skill has a draft description and tests. understand's own skill is designed after its sub-skills.

**Why:** shallow and deep stay two skills, with clarify choosing, because seeing all of a level first shows where depth is needed: breadth, then depth. The tree of decisions came from an outside method and adds nothing an order of asking does not already give. Assumptions are named so that nothing unconfirmed passes for a decision.

## D110: Prose is not wrapped; tables are few and fit in 120 characters (2026-10-12)

> **Amended by D111 (2026-10-12):** tables are fine when their rows fit in 120 characters with short cells; only content that would make a wider table becomes a list with sub-items.
>
> **Amended by D115 (2026-10-13):** prose in responses is never wrapped, since the harness wraps it and unwrapped text copies cleanly; in files, the project's own rules win. The 120-character limit is strong advice in skillbook's skill (D116), and this repository's linter makes it a rule here.

**Decision:** Prose, paragraphs and list items, is never wrapped by hand to fit a line length, in markdown files and in the agent's responses alike: the screen or editor reflows it. What cannot reflow keeps within 120 characters: table rows and code lines; headings stay short. Tables are not the default: a list with sub-items is, and a table holds only a few short values compared across the same attributes. The rule belongs to author's markdown skill's structure layer, which applies to every response. This repository follows it: its wrapped prose was joined, with every file's rendering checked unchanged; `AGENTS.md` says so; the lint configuration no longer limits prose, keeps MD013 for code blocks and headings, and adds a rule, `scripts/table-width.cjs`, for table rows, since MD013 checks tables at the prose length.

**Why:** Hand-wrapped prose breaks again on any screen of another width and makes edits ripple through a paragraph; a table row or a code line cannot be reflowed, so the screen breaks it, and big tables are hard to read where nested lists are not.

## D111: author's markdown skill: seven structure rules and the file rules (2026-10-12)

> **Amended by D115 (2026-10-13):** the precedence of a project's rules sits at the top and covers every rule for files; the question line moves to conduct's ask (D114); the skill's scope, the linter's cases and the tests are filled in; 120 characters is strong advice and nesting advice (D116).
>
> **Amended by D135 (2026-10-15):** markdown gains reasons, instructions in order, a last instruction and a routing line with when not.
>
> **Amended by D137 (2026-10-17):** rule 2 no longer repeats rule 1, and rule 3 leaves the width to the strong advice.
>
> **Amended by D149 (2026-10-17):** with no linter, a search for the mechanical rules replaces reading a file back; with one, it runs once after the last file.
>
> **Amended by D154 (2026-10-17):** markdown is authoring's; the main skill's first read takes essentials' output-format skill in its place, once designed.

**Decision:** author's markdown skill is designed ([design/author.md](design/authoring.md)).

- **Two layers, split by what a renderer reflows:** structure, for all markdown, responses included, at the top of `SKILL.md`; file rules, for markdown files only, in `references/files.md`. Wording, order and length stay respond's.
- **The structure layer, one line per rule:** headings for sections, never bold lines, and each question of a round under its own heading; bold only for a label or key phrase; tables when their rows fit in 120 characters with short cells, a list with sub-items for content that would not; prose never wrapped; numbers for what is referred to by number; nesting at most two levels of sub-items; code, commands and text diagrams fenced with the language named and their lines within 120. Only the table rule carries an example.
- **The file rules** carry over the person's markdown-style without the person's tooling: headings, lists, code, tables, links, emphasis and file hygiene, a note on fitting a table, and a final check with the project's linter. The project's own lint configuration wins; these are defaults.
- **Callers:** the main skill reads it at the start, with respond and act, since respond needs the structure layer on every response; act, before writing any markdown file; the person. Draft description and eleven tests.

**Why:** The layout of every response matters as much as a file's, and no linter checks headings against bold lines, so the structure layer stands on its own and stays short enough to read every time. A project's linter, where there is one, is the authority on its files.

## D112: A main skill holds rules, advice and when to use each skill (2026-10-13)

> **Amended by D116 (2026-10-13):** the advice section may hold strong advice, followed unless the case gives a reason not to; numbers are advice unless a rule cannot apply without them.
>
> **Amended by D131 (2026-10-14):** understand's own skill is designed in this shape, its instructions under five headings.
>
> **Amended by D136 (2026-10-15):** the flows are revisited: conduct's own skill, act, respond, ask, clarify, author's markdown and the main skill take the shape (D134, D135).

**Decision:** How a main skill is written: the main skill, each root's own skill, and any skill with sub-skills of its own, such as clarify. Its sections, in this order:

1. **Rules, at the top:** the musts and must-nots that apply to its whole scope. Each rule has one home: here, or a skill of its own when there are enough rules to make one, which this section tells the agent to follow ("follow act's rules in every case"). A rule is stated in a second place only for a clear variation, which names the rule it changes. A restriction is set only where something real is at risk, and says why.
2. **Advice:** the shoulds, kept apart from the musts, so the agent sees what is left to its judgment.
3. **Instructions, in the order the work happens:** for each sub-skill, or other skill it uses, when to use it, when not, and what it gives back; this is the main guidance. If-then-else imposes an order only where one is needed, mostly in some sub-skills, not everywhere. A gap is stated where it falls, with where to go: another skill, or the agent's own judgment. Several skills may serve one request, and nothing limits that unless it must; the main skill says so, as a rule or an advice. A main skill stays at its level and never says how a sub-skill works inside.
4. **The last instruction:** what is done before anything is returned; for the main skill, every response checked against respond before the person sees it.

Every skill, leaf skills too: each instruction names the skill it needs; nothing ambiguous or contradictory, and no gap left unstated; comprehensive and exclusive, every case covered or named as a gap, and each rule and each concern with one home. The project skill skillbook-tree checks a skill against all of this: overlaps, contradictions, gaps and restrictions that are not needed.

For the main skill: it holds rules and advice of its own again, among them following act's rules and laying out every response with author's markdown; act and respond stay skills. Its draft flow becomes one instruction per root, with respond last, and it uses every root a request needs. This settles routing to more than one root and guidance rather than a script. The main skills are reshaped as each is reached; conduct's own skill and clarify, designed already, and understand's root proposals are checked against this shape then.

**Why:** A full flow in every main skill hands the agent a script; skillbook guides, and the agent reasons. What an agent needs from a skill above others is what must hold and when to use each skill below it; a flow that describes its sub-skills' insides goes stale when they change. Order matters because the agent meets the instructions in the order the work does, so respond comes last. One home per rule keeps skills from contradicting each other; a stated gap tells the agent where its own judgment is expected; and a request often needs several skills, which a skill should not forbid without a reason.

## D113: skillbook-tree is built first, with the review (2026-10-13)

> **Amended by D116 (2026-10-13):** check 5 says numbers are advice unless a rule needs them, and strong advice is marked.

**Decision:** The project skill skillbook-tree is built now, in `.agents/skills/skillbook-tree/`, with `.claude/skills/` a link to `.agents/skills/`; it is never shipped in the plugin. It holds the review first: ten checks drawn from how skills are written (D112). For every skill: each instruction names the skill it needs; nothing ambiguous or contradictory, no gap left unstated; comprehensive and exclusive; no restriction without a reason; musts apart from advice; a description that does not overlap a sibling's; a test for each when and when not. For a skill with sub-skills, also: the sections in order, each sub-skill's when, when not and result, and staying at its own level. A review reads the whole skill with the decisions it cites, reports each finding with its file and line, and changes nothing. Making a skill and placing it in the tree are named in it as gaps that point to how-it-works until they are added. `AGENTS.md` sends any skill's design, writing or review to it. The skills designed so far are reviewed with it, one reviewer per root, and the findings checked before they reach the person; brainstorm continues after.

**Why:** A fixed checklist makes every review check the same things, now and for every skill designed later, and a skill a fresh agent can load runs it the same way each time.

## D114: conduct's ask: how the agent asks the person anything (2026-10-13)

> **Amended by D134 (2026-10-15):** the first rule gains its reason, and a last instruction checks each round.
>
> **Amended by D137 (2026-10-17):** a proposal to approve is never assumed when the person stops; it stays parked, and nothing it covers is applied.
>
> **Amended by D150 (2026-10-17):** ask's rule on recommended answers points to challenge's trigger: a recommendation is challenged before it is put, and a decision made without or against one before it is relied on.

**Decision:** conduct gains a sub-skill, ask: how the agent asks the person anything, a question, a round of questions or a proposal to approve, and how it takes the answers ([design/conduct.md](design/conduct.md)). Its rules:

- a question only when something is truly open for the person to choose;
- numbered, each with a recommended answer and a short reason, worded so that "yes" accepts it; one term, "recommended answer", throughout;
- each question under its own heading, its number in the heading;
- one round, or one by one on request without losing the round;
- "go ahead" accepts the recommended answers for the questions left; when only some are answered, the rest are named back with what will be taken before anything is acted on;
- an answer that changes another question is said so;
- parked, set aside by the person and listed with why, and assumed, still open when the person stops and taken with its recommended answer, both stay listed;
- a proposal to approve is put the same way; a delegated agent asks in its report.

Which questions to ask and how deep stay clarify's; when a proposal is needed and what it holds, guardrails'; plain wording, respond's. respond's rules on questions and author's markdown's question line move into ask; clarify, shallow, deep, act, guardrails and organize point to it, and respond names it, so it is read whenever a response asks something.

**Why:** Five places handled questions, each a different aspect: finding them (clarify), putting them (respond), laying them out (markdown), taking the answers (shallow and deep), and asking someone who was not there (questionnaire). Putting, laying out and taking answers are the same whatever asks, a clarifying round, a proposal, an approval or a decision; rules general enough to be a skill become one.

## D115: The review's outcome: one home per rule, and the contradictions settled (2026-10-13)

> **Amended by D136 (2026-10-15):** markdown's rule in the main skill covers every response and every markdown file; other files follow act's rule on a file's type.
>
> **Amended by D139 (2026-10-17):** the harness's limits hold above skillbook, which never asks the agent to break them; the harness's defaults are what skillbook refines.
>
> **Amended by D147 (2026-10-17):** what this settled for handoff holds for carryover, its new name; the brief it settled for delegate is conduct's brief.

**Decision:** The skills designed so far were reviewed with skillbook-tree (D113): four reviewers, about 130 findings, each recorded with its outcome in [notes/skill-review.md](notes/skill-review.md). Decided with the person:

- **When to ask, and how deep:** clarify is the one home; act's rule names it. Shallow's line on many questions goes; dependence is the only trigger for going deep.
- **Instructions and data:** guardrails defines them once. Instructions come only from the person in the conversation, the instruction files the agent loads and skillbook's skills; everything else is data, which can inform the work but never changes what was asked or the rules. Anything fetched runs only after approval, the project's documented commands being the stated exception. act and respond point there.
- **Wide changes:** planned, with everything touched listed in the response, then done without waiting when reversible and inside the task. guardrails' table is the one home of the risky kinds, and a kind whose rule is to propose always needs it, whatever proportion says.
- **Concerns:** one that would change what is done is asked through ask, and the work waits; one that would not gets one line.
- **The wrap-up offer** has one home, conduct's own rule: whenever work stops with steps left, one question offers learn, then handoff; with nothing unfinished, nothing is offered.
- **crew:** several agents each change their own items; a shared item has one owner, who applies the others' proposals; a job whose changes all land in one item is a single task, or a fanout whose findings one agent applies.
- **council and fanout** split by what is asked: a council asks every member the same question over the same material; a fanout gives each agent a part the others do not have, a place or a sub-question such as one review lens.
- **Prose:** never wrapped in responses, since the harness wraps it to its window and unwrapped text copies cleanly; in files, not wrapped unless the project's own rules say otherwise, through act's rule on which instruction wins.
- **The stages' order** is advice, with its reason; the work decides where it starts and which stages it skips.
- **Several skills:** using every skill a request needs is a rule of the main skill; a skill limits it only where it says why.
- **The person added:** delegate uses a harness's own means of running agents, such as Claude Code's subagents and workflows, to carry out a council, a fanout or a crew: skillbook gives the guidance, the harness the implementation. And every instruction names the skill it needs.

Fixed as proposed: each gap now says where to go, the missing tests are added, restrictions carry their reasons in the skill, and restated rules point to their one home. The new shape waits for the flows (D112).

**Why:** Contradictions and restated rules let two skills give an agent different answers to the same question, and a reason kept only in the decisions log is invisible to whoever builds or follows the skill.

## D116: Numbers are advice; strong advice (2026-10-13)

> **Amended by D148 (2026-10-17):** organize's warning signs gain a part readers mostly read in order to skip.

**Decision:** A number in a skill is advice, written "about N" with its reason; it is a rule only when the rule cannot be applied without it. Advice gains a stronger level, strong advice: followed unless the case gives a reason not to, and the agent says so when it departs. Applied:

- table rows, code lines and headings within 120 characters are strong advice in author's markdown; a project whose linter enforces it, as this repository's does, makes it a rule there;
- act's rule on failing attempts stays a rule, stop, report and ask, with about three attempts as advice;
- advice: nesting of about two levels, instruction files under about 200 lines, about seven parts at one level, a check done by hand about three times, a handoff of about a page, a council of about three, brainstorm's three to seven options, and the delegation threshold;
- guardrails' trivial cost, US$1 by default and set by the person, stays a rule: it is the line past which spending the person's money needs their approval.

skillbook-tree's check 5 says so.

**Why:** A fixed number stated as a rule turns guidance into a script, and most numbers are rules of thumb that a case can rightly break. A firm line stays where the rule needs it to be checkable and a soft one could cost the person, as with money.

## D117: Every project using skillbook has a blueprint (2026-10-13)

> **Amended by D152 (2026-10-17):** blueprint is a set of its own, so a project has a blueprint where that set is installed; what the other sets do with their results without it is open, to settle with blueprint's design.
>
> **Amended by D156 (2026-10-17):** a project uses blueprint when its instruction files point to blueprint's main skill, a pointer blueprint's start step adds; where none does, each skill's result goes where its own default says, each settled with its skill.

**Decision:** A project that uses skillbook has a blueprint; "only where a project keeps one" ends. setup's project flow starts it, through design's start step, when the project has none. For a project the person does not own, where a `blueprint/` folder cannot be committed, setup asks where it lives: in the person's own folder for that project, outside the repository, or in the checkout, kept out of git through `.git/info/exclude`. What was written for a project without a blueprint now covers work outside any project, such as a question asked from the home folder: learn's destinations, handoff's place, deep clarify's recording, brainstorm's result, and design's recording steps, which are never skipped in a project.

**Why:** skillbook's skills keep their results in the blueprint: decisions, notes, ideas, evidence, handoffs. With it optional, every recording step needed a second path, and what was worked out was lost where it was missing; one place in every project keeps the work resumable.

## D118: brainstorm, and frame, weigh and challenge in understand (2026-10-13)

> **Amended by D119 (2026-10-13):** frame is designed.
>
> **Amended by D121 (2026-10-13):** the moves found in weigh's material have homes: developing in brainstorm, recording a decision in design's decide step and author's blueprint skill, showing a comparison in respond or ask, to settle; reversibility goes to conduct's stakes.
>
> **Amended by D122 (2026-10-13):** weigh is designed.
>
> **Amended by D123 (2026-10-13):** challenge's material holds three more concerns: a reader test (author), consistency checks (to settle with design's review), and the strength of evidence (verify).
>
> **Amended by D124 (2026-10-13):** challenge is designed.
>
> **Amended by D130 (2026-10-14):** a topic with several open questions goes to discuss, which uses brainstorm for the items that need options; the number of open questions decides, not the word used.

**Decision:** brainstorm is designed ([design/understand.md](design/understand.md)): options for one open question, narrowed to one or parked. Its rules: one question, framed before any option; options listed before any is judged; options that differ in kind; every option weighed on the same terms; who decides follows clarify's rule, the person's choices put through conduct's ask. Its advice covers the order, earlier proposals listed first, about three to seven options, asking the person to describe their own picture first, developing the promising ones, weighing quietly for the agent's own choices, and parking a new topic. It keeps nothing: in a project, design's discuss step records the brainstorm in the session notes, the open options in the topic's ideas file and the decision in the decisions log, so no brainstorm file or folder is needed.

Three thinking moves it shares with other work become sub-skills of understand, designed next: **frame**, the question or problem stated with its goal, scope, constraints and what a good answer looks like; **weigh**, options compared on the same terms with a recommendation; **challenge**, an idea, plan or decision attacked through its assumptions, failure modes, scenarios and gaps (VaultOps' critique, simulate and gap detection). brainstorm names them; the other moves already have homes: deciding or parking in conduct's ask, the thread check in ask's parked or organize's split, checking evidence in verify, marking guesses in clarify's "assumed". understand's design goes on with frame, weigh and challenge, then naming and research, then its own skill, whose discussion becomes its instructions in order: frame, clarify, research or brainstorm, weigh, challenge, ask.

**Why:** Framing, weighing and challenging are needed by design, plan, research and a council's summary as much as by brainstorm, so each gets one home. A brainstorm happens inside a discussion, and the blueprint already splits a discussion into notes, ideas and decisions.

## D119: frame states a question or problem before work on it (2026-10-13)

**Decision:** understand's frame is designed ([design/understand.md](design/understand.md)): a question or problem stated in about one to three sentences, with its goal, what is out of scope, its constraints and what a good answer looks like, in one short form; what cannot be stated from what is known is marked unknown and handed to clarify. Its rules: stated from what is known first; every part filled or marked unknown; a guess marked as a guess; unknowns to clarify; one problem per frame; the person's question shown framed before work builds on it, the agent's own choice framed quietly. It is the one home of the lenses clarify's shallow used to list, and weigh takes its "a good answer" as the terms it weighs on. It keeps nothing: in a project, design's discuss step records it with the discussion it opens; when it changes, the new frame replaces the old where it is kept.

**Why:** Work aimed at a problem nobody stated goes wherever the first idea points; a frame stated from what is known, with its gaps marked, asks the person only what is missing and gives every later step, options, weighing, research, one target.

## D120: Outside material is adapted, never copied (2026-10-13)

> **Amended by D125 (2026-10-13):** mattpocock's skills are MIT, checked on GitHub.

**Decision:** No file from an outside collection or from the person's earlier projects, such as superpowers, mattpocock's skills or VaultOps, is used as it is. What a skill takes from them is rewritten for skillbook's case: mostly inside the skill's own `SKILL.md`; in a reference file of the skill's own only where the skill needs one; or as a new skill, where what is taken is a concern of its own that other skills need too, as frame, weigh and challenge came from brainstorm's material (D118). D30's licence check still holds: superpowers, gstack and alirezarezvani's collection are MIT, Anthropic's skills Apache-2.0 apart from four proprietary document skills, which are only read ([research/skill-collections.md](research/skill-collections.md)); mattpocock's licence is checked before anything is adopted from it. Each skill's design names its sources under Material; how the built plugin credits them is decided with the first skills built.

**Why:** An outside file carries its author's assumptions, wording and structure. Adapting keeps every skill in one shape and voice (D112), lets it name skillbook's own skills where it needs them, and leaves nothing whose licence or upkeep depends on another project.

## D121: stakes joins conduct (2026-10-13)

> **Amended by D133 (2026-10-15):** stakes is designed: four answers and one level, low, medium or high; act does not name it; the callers point to it.
>
> **Amended by D134 (2026-10-15):** respond holds "show the comparison only when it helps decide", as its first rule applied.

**Decision:** conduct gains a sub-skill, stakes: how much care something deserves, judged once for every skill that needs it, by whether it can be undone, how far it reaches, whether anything would catch a mistake, and what a mistake would cost. Each caller maps the judgment to its own response: guardrails, whether to ask for approval; delegate, which tier; verify, who checks; understand's weigh, how much weighing; later review and ship. It is designed after weigh and challenge; guardrails' proportion, delegate's tiers, verify's who checks and weigh's reversibility advice then point to it. The other moves found in weigh's material have homes, recorded as open questions where they belong: developing the promising options is brainstorm's; recording a decision with its reasons is design's decide step, its format author's blueprint skill's; whether respond or ask holds "show the comparison only when it helps decide" is to settle.

**Why:** "What happens if it is wrong" and "can it be undone" were already judged in four skills, in four wordings, and review and ship will judge them too; one home keeps the judgment the same wherever care is decided.

## D122: weigh compares options on terms set first, and recommends (2026-10-13)

> **Amended by D132 (2026-10-14):** a debate is weigh's: when the stakes are high or the person asks for a debate, each option is put through argue and challenge, to the same depth, before the comparison.
>
> **Amended by D133 (2026-10-15):** whether a choice is easy to undo is judged by conduct's stakes.

**Decision:** understand's weigh is designed ([design/understand.md](design/understand.md)): options compared side by side on terms stated before any is scored, frame's "a good answer" where there is one; each option by what it gives, costs, could get wrong and leaves unknown, with a real downside each; an unknown that would change the outcome named with what would settle it; ending in a recommendation with why it beats the next best, or "no clear winner" with what would settle it. The person's choice goes through conduct's ask; the agent's own choice is said in one line with its reasoning, never the choice alone. Its result has one short shape, kept by the caller: in a project, design's decide step records the decision's reasons, the comparison goes in the session notes, and an option set aside goes to the ideas file. A council's summary does not use it; the main agent weighs the members' answers only when the person asks.

**Why:** Options judged on terms chosen afterwards, or on different terms each, end with the favourite winning; terms set first, a downside for every option and a stated call make the choice one the person can check and the record one a later reader can follow.

## D123: Three concerns from challenge's material (2026-10-13)

> **Amended by D128 (2026-10-14):** research ranks what the agent recalls, "from memory", as only said until checked at a source; verify's ranking takes it when widened.
>
> **Amended by D132 (2026-10-14):** stating the person's view at its strongest, still respond's to settle, uses understand's argue for the case.
>
> **Amended by D134 (2026-10-15):** respond's two concerns are settled: no flattery is a rule; the person's view at its strongest first is advice.
>
> **Amended by D140 (2026-10-17):** verify is not widened; the ranking of evidence lives in understand's research, beside the findings format.

**Decision:** Looking at challenge's material, three concerns used well beyond challenge were placed. A reader test, superpowers' builder check generalised, a document read as its intended reader would with only the document, often by a fresh agent, becomes a skill in author, which is organised by reader; its name is to settle. Consistency checks, contradictions, duplication, gaps and drift, now held by verify, organize's check, design's review, skillbook-tree and challenge, are recorded as an open question in each, to be given one home when design's review is designed. verify is to widen from evidence before saying done to how strong evidence is for any claim, ranked roughly: seen or measured, read at its source, inferred, only said; research, fanout and challenge point to it. Two items for respond are recorded as open: no flattery, and stating the person's view at its strongest before disagreeing. Simulation, the pre-mortem and gap detection stay challenge's; attacking to refute with distinct lenses stays delegate's fanout's.

**Why:** Each was already needed, or written, in several skills in their own words; placed now, with open questions where they land, none is forgotten and each ends with one home.

## D124: challenge attacks an idea before it is relied on (2026-10-13)

> **Amended by D132 (2026-10-14):** argue is challenge's mirror, the case for a position; the case against stays challenge's, and argue uses challenge for its objections, taking only the weaknesses.
>
> **Amended by D150 (2026-10-17):** challenge gains a trigger in conduct's ask, before a recommendation is put and after a decision made without or against one, its depth following stakes; nothing is challenged twice.

**Decision:** understand's challenge is designed ([design/understand.md](design/understand.md)): an idea, a plan or a decision attacked before it is relied on, measured against its frame. Its rules: the idea stated at its strongest first; the assumptions it rests on named, checked or unchecked; each weakness with how serious it is, what shows it and what would address it; an honest verdict, holds, holds with changes, or does not hold, with "nothing found" said plainly; and it changes nothing itself. Its advice covers failure in advance, scenarios, gaps, claims pushed to evidence, fresh eyes through conduct's delegate when the stakes are high, and few strong weaknesses over many weak ones. Its result has one short shape, kept by the caller: in a project, the session notes, a decision's "why", and a weakness left open as an open question. The review root judges finished work; design's review uses challenge for its adversarial part; verify and fanout's validator check claims against evidence.

**Why:** An idea attacked in a weak version, or against no goal, yields either flattery or an endless list of flaws; measured against its frame and stated at its strongest, a challenge finds the weaknesses that matter and says what would fix them, while the caller keeps the decision.

## D125: naming chooses names and keeps the vocabulary (2026-10-13)

**Decision:** understand's naming is designed ([design/understand.md](design/understand.md)), in two halves: choosing a name people will read and rely on, from brainstorm's candidates weighed through weigh, the person's choice put through conduct's ask, and the decision recorded with the rejected words and why; and keeping a project's vocabulary to one word per concept, each term defined once in its glossary with the words to avoid, a term used two ways flagged until resolved. Its rules: read the glossary and how the word is used first; no synonym and no word with a nearby meaning; no part named after its whole; a plain word wherever one will do; naming proposes and does not rename, the rename done by whoever owns the files as guardrails says. A local name in code stays the code skill's. The glossary lives where the project keeps one, otherwise `GLOSSARY.md` at the root, or in the blueprint for a project the person does not own. mattpocock's skills, its material, are MIT, checked on GitHub.

**Why:** A name is read far more often than it is chosen, and a word with two meanings, or two words for one thing, costs every reader; reading the vocabulary first and recording what was rejected keep a project's words stable.

## D126: cleanup joins conduct (2026-10-13)

> **Amended by D129 (2026-10-14):** cleanup is designed.

**Decision:** conduct gains a sub-skill, cleanup: the agent removes what it created and no longer needs, so nothing unused keeps holding disk, memory or CPU: temporary files and folders, copies and clones, background processes, servers and watchers, containers, worktrees and branches it made, agents and panes it started. Its starting point: track what it creates; clean when it is no longer needed and at the latest before saying the task is done; its own temporary material, created in this task in a temporary or scratch place, is cleaned without asking and reported, and anything else is proposed through guardrails; exact paths only; what is kept on purpose is said with where and why; delegated agents clean their own. act is to name it at the end of every task. It is designed right after understand's research. This session's own case was cleaned: 1.1 GB of finished test runs in a memory-held `/tmp`.

**Why:** An agent leaves temporary copies, run folders and background processes behind unless something tells it to clean them, and where `/tmp` is held in memory they slow the whole machine; the person had to tell an agent so in their own words.

## D127: issue joins author, with bug and feature (2026-10-13)

**Decision:** author gains a sub-skill, issue: an issue written for a maintainer or a teammate who was not in the conversation, with two parts, bug (what happened against what was expected, steps to reproduce, environment, evidence with secrets removed) and feature (the problem first, the proposal, alternatives, what is out of scope). Posting goes through guardrails, the mechanics to rigs, the project's own templates and contribution rules win, triage stays maintain's, and tracker sync stays design's. A security problem is never a public issue: it goes through the project's private channel. Its callers are test, review, ship, maintain, plan and the person; it uses the reader test. It is named issue rather than report, which skillbook already uses for the agent's report of work done and a delegated agent's report back. It is designed with author.

**Why:** An issue is writing for a reader who was not there, as author's skills are, and several roots need one; with posting, mechanics, templates and triage each in its own home, issue holds only what makes an issue good.

## D128: research designed, with fact, survey and analyze (2026-10-14)

> **Amended by D140 (2026-10-17):** research's instructions are the question, one routing line per part and the last instruction; sources and fanning out are its advice and ranking its rule 3, which the parts point to.
>
> **Amended by D149 (2026-10-17):** a kind of source's reference file is read when that kind is first searched; with many findings, those the answer rests on are given and the full list goes to a named file; survey fans out only when delegate's test for splitting holds.

**Decision:** research's own skill holds what its three parts share and chooses among them; it answers nothing itself. Its shared rules: the question stated first, through frame; every finding with its source, exact enough to check; every finding with its strength in verify's ranking, what the agent recalls marked "from memory" and ranked as only said until checked at a source; what was looked for and not found reported; a finding matched to the version, platform and date it applies to; findings that disagree shown side by side, with which is stronger and why. The part is chosen by what the answer looks like. fact answers one question or checks one claim: the claim searched both ways, the verdict (supported, mixed, unsupported or unknown) following the strength of the evidence, not the count. survey finds what exists on a subject and compares it on the same terms: scope and terms set first, wide before deep, every cell with its evidence or "not found", the screened-out named, the person's own option treated like the rest, the coverage and date stated, the choice left to weigh, and, as strong advice, a wide survey's plan shown first. analyze finds why something happens: the symptom stated exactly, one testable cause at a time, a cause confirmed by evidence rather than fit, traced back to its trigger as a chain, one per contributing cause, the fix left to the caller, and a stop when hypotheses keep failing. The kinds of source (code, documentation, the web, papers, products) are reference files in research, not parts; a full literature review becomes a part only if tests show the papers file is not enough. research holds the findings format (the claim, its source, the quoted words, its strength, what it applies to), moved from fanout, which keeps how its agents write it for its script. The result is understand's shape extended with the question, the answer or verdict, the findings, what was not found and what was not covered. In a project, design's research step only files it, in the research strand, which holds what was learned from sources; the evidence log keeps the project's own claims checked by verify. The harness's search tools do the searching. test's debug keeps what is specific to code, the method of finding a cause being analyze's.

**Why:** A part exists only where the steps differ: a sub-skill per kind of search would repeat one flow, while how a kind of source is read and trusted is the same whatever the question. Giving the single question its own part leaves research's rules truly shared, as clarify's are. analyze's material traces a chain from symptom to trigger, and a required tree pushes agents to invent branches, as deep clarify's tree did.

## D129: cleanup designed (2026-10-14)

> **Amended by D147 (2026-10-17):** the leftovers a handoff named are named in a carryover, its new name; delegate's brief, which asks for cleanup's three fields, is now conduct's brief.
>
> **Amended by D149 (2026-10-17):** cleanup is read at a task's end only when the task created or started something; a read-only agent reports "left behind: nothing".

**Decision:** cleanup removes only the agent's own leftovers, never tidying the person's work. In scope is whatever the agent created or started in the task: temporary files, copies, processes, containers, worktrees, branches and stashes, agents and panes, scheduled work, temporary edits in the work, and things outside the machine, whose removal is always proposed. Its rules: only its own is cleaned without asking, meaning what sits in a temporary or scratch place, its own temporary edits, and the local branches and worktrees it made with nothing uncommitted or unmerged, and everything else is proposed through guardrails; what it makes is tracked as it goes; removal is by exact path or ID, never a pattern; a thing is cleaned once no longer needed, at the latest before the task is said to be done; what is kept on purpose is said with where and why; "cleaned" is checked through verify. Strong advice keeps all temporary material in one place; the harness's own means are preferred, and a server's life is tied to the command that needs it. The report has three fields, cleaned, kept and proposed, said not at all, in one line or in full depending on what happened, and delegated agents report the same fields. act gains rule 12, naming cleanup before a task is said to be done; delegate's brief asks each agent to clean up after itself; a handoff names what is kept; the wrap-up offer runs it before work stops; the skills that make temporary things name it where those things end. It keeps the name cleanup, its routing line separating it from tidying the person's work.

**Why:** The agent alone knows what it made, so it alone can remove it safely, by exact path or ID; act's rule catches what the steps miss, and a report that says what is kept keeps a deliberate leftover from looking forgotten.

## D130: discuss is understand's sub-skill again (2026-10-14)

**Decision:** understand gains a sub-skill, discuss: a topic worked through with the person, item by item, each item decided, parked or handed on. understand's own skill holds only the shared rules and which part to choose, as clarify's and research's do; the discussion is no longer its own flow. Its rules: the whole first, framed and split into items; one item per turn, with "Remaining"; the agent proposes and the person decides, through ask; every item closed; side topics taken now or recorded where they belong; a decision that changes an earlier one names it. Each item uses what it needs, clarify, research, brainstorm, weigh, challenge, naming or any other skill, and nothing in discuss limits which; work that does not need the person goes to delegate. Its result is understand's shape with the items handed on and the side topics; in a project, what is agreed goes to design as a whole, recorded when the person says so and offered when a topic is complete or the discussion runs long. It is set apart from clarify, which draws out what the person already means, and from brainstorm by the number of open questions rather than the word used. design's discuss step keeps its name for now: whether design's steps that use another skill stay sub-skills, and the name such a step needs if it does, is settled when design is designed.

**Why:** Discussing is the same work whatever the topic, as this session's own way of working shows, and nothing in it is specific to design; a parent that handles one case itself mixes its shared rules with that case, as research's did before fact.

## D131: understand's own skill designed (2026-10-14)

> **Amended by D132 (2026-10-14):** argue joins the "thinking it through" heading.
>
> **Amended by D135 (2026-10-15):** the sub-skills now point to understand's rules.

**Decision:** understand's own skill holds the rules for its whole scope, advice, one instruction per sub-skill and the last instruction; it understands nothing itself and never does the work. Its rules: understanding keeps nothing, every result handed back, kept by design in a project; one result shape, what was decided, what was parked and what comes next, each sub-skill adding its own part; guesses and assumptions marked, and an unknown that would change the result named with what would settle it; facts first; who decides, the person's choices through ask and the agent's own made quietly with the reason said; nothing in the work changed for good while understanding. Facts first and who decides move up from clarify, and the sub-skills' own statements of the other rules become pointers at the reshape. Its instructions are the sub-skills' agreed routing lines, shortened, under five headings: with the person (discuss, clarify), from sources (research), exploring options (brainstorm), thinking it through (frame, weigh, challenge), names (naming); the order in which an item uses them lives in discuss and brainstorm. "Explain how this module works" goes to research's fact. frame, weigh and challenge stay as they are, with no group skill, which would hold no rule of its own. When several sub-skills serve one request, their results are combined into one shape. The main skill's line for understand is written into the main skill when the flows are revisited.

**Why:** Rules that held across all of understand were stated in three or four sub-skills in their own words, or lived in clarify while others pointed to it; at understand's level each has one home. A grouping that helps the reader costs nothing as headings, while a group skill would add a level to every call without a rule of its own.

## D132: argue makes the strongest honest case for a position (2026-10-14)

**Decision:** understand gains argue, designed ([design/understand.md](design/understand.md)), under its "thinking it through" heading as challenge's mirror: the strongest honest case for a position. Its rules: the position stated precisely first, through frame; every reason resting on evidence, through research, or marked as an assumption; the strongest objections, found through challenge, met by answering, conceding or narrowing the position, saying why; the weaknesses admitted; the result labelled one-sided. Its result adds the case to understand's shape, with a strength, strong, moderate or weak, that rates the case and not the choice, and the evidence that would change it; when no honest case exists, it says so and invents nothing. It decides nothing: whether a claim is true stays research's fact, the case against challenge's, and a choice weigh's. A debate is not a skill: "debate X versus Y" goes to weigh, which, when the stakes are high or the person asks for a debate, puts each option through argue and challenge to the same depth before comparing. respond uses argue for the person's view at its strongest, author for a proposal's case, and discuss for an item that asks for one. Agents debating in rounds is an open question in delegate.

**Why:** challenge attacked ideas and nothing made the case for one, though respond, weigh and author each needed it. A case made one-sided on purpose helps only when it is honest and says so; otherwise it reads as a verdict. A debate combines three skills that already exist, so a skill of its own would hold no rule of its own.

## D133: stakes judges how much care something deserves (2026-10-15)

**Decision:** conduct's stakes is designed ([design/conduct.md](design/conduct.md)). It answers four questions from facts, Undo, Reach, Catch and Cost, and gives one level: low, when a mistake would be caught or cheaply undone and stays inside the task; high, when nothing would catch a mistake in time and any one of: it is hard to undo; it reaches beyond the task, to shared contracts, production, other people or the public; it would cost data, money or security; medium between. Its rules: judged from facts, on what is actually done; the higher level when unsure; never below a rule, guardrails' never-rules, its kinds that must always be proposed and any instruction to be more careful holding whatever stakes says; stakes judges and the caller acts, each caller keeping its own mapping, such as delegate's tier table; judged again when what it rests on changes. What is plainly low takes a glance. Ways to lower the stakes, such as a backup or a dry run, are offered to the caller. The person hears the level only when it changes what happens, in one line with the reason, or in full when they ask. act does not name stakes; guardrails' proportion, delegate's tiers, verify's who checks, weigh's reversibility advice, challenge and understand's proportion now point to it.

**Why:** Four skills judged the same thing in four wordings, and others said "when the stakes are high" with nothing behind it. One judgment, made from facts and never lowering a rule, gives every caller the same answer, while each keeps what that answer means for its own work.

## D134: conduct's own skill, its routing lines, and act, respond and ask in the shape (2026-10-15)

> **Amended by D145 (2026-10-17):** conduct gains rightsize, its routing line under "Before saying done", beside verify.
>
> **Amended by D147 (2026-10-17):** conduct's routing lines gain brief under "While working", and handoff's line becomes carryover's under "When stopping".

**Decision:** conduct's own skill takes the shape every main skill takes: its one rule, the wrap-up offer; no advice of its own, since that several sub-skills can serve one request is the main skill's rule; one routing line per sub-skill read on demand, saying when to use it, when not and what it gives back, under six headings in the order the work happens (with the person: ask, explain; before acting: stakes, guardrails; while working: organize, delegate, cleanup; before saying done: verify; setting up: setup, instruct; when stopping: learn, handoff); and the last instruction. The lines replace its table, since they do not fit a 120-character row, and each sub-skill's Callers field carries its line. Its description names stakes and cleanup and says when to use it. act, respond and ask, which route to nothing, hold rules each with its reason, advice apart, and a last instruction where something is checked before returning. act's rules on clarifying, evidence, a file's type and which instruction wins gain their reasons, and "about three attempts" becomes advice. respond gains a rule against flattery, agreement and praise only when earned and disagreement said plainly, and advice to state the person's view at its strongest first, through understand's argue, when disagreeing on something that matters; showing a comparison only when it helps decide is its first rule applied. ask's first rule gains its reason, and a last instruction checks each round. delegate's line is updated after the delegate discussion.

**Why:** A table row could say when to read a sub-skill but not when not, or what comes back, so neighbouring rows overlapped unseen; lines in the order the work happens let the agent find the right one. The three skills read on every request were already rules; giving each its reason and keeping advice apart lets the agent apply them with judgment, and respond's open questions each fit a rule or advice it already had.

## D135: clarify, understand's pointers and author's markdown in the shape (2026-10-15)

**Decision:** clarify takes the shape every skill with parts takes: two rules of its own, asking only what would change the work, and nothing acted on until the answers are in, a stricter variation of understand's rule; pointers to understand's rules and conduct's ask for the rest; advice on choosing the part, shallow first, depth triggered by dependence and, when unsure, deep; one routing line per part with when, when not and what it gives back; and the last instruction. Its description says when to use it. shallow, deep and questionnaire split their musts from their advice, each with a last instruction, and their routing lines become their when-not lines. understand's sub-skills point to understand's rules instead of restating them: each "keeps nothing" passage keeps only where its own result goes; frame's guesses keep only their "(guess)" mark; weigh's unknowns only what settles each kind; challenge's "changes nothing" only who acts on its verdict. author's markdown follows act's rule on which instruction wins, with its own variation for lint configuration and responses; three of its rules gain reasons; its work is set in order as instructions, ending with checking a file; it gains a last instruction and a routing line with when not.

**Why:** Each of these mixed rules, advice and routing, or stated understand's shared rules again in its own words; in the shape, each rule has one home and each part says when not to use it.

## D136: The main skill routes to three roots for now (2026-10-15)

> **Amended by D137 (2026-10-17):** the author line says what it adds, the file rules and the linter check, with markdown's own when-not; act's rule on a file's type points to the main skill's markdown rule.
>
> **Amended by D138 (2026-10-17):** the main skill's first advice is delegation by default, as strong advice.
>
> **Amended by D145 (2026-10-17):** the main skill gains a rule that everything given back, made or done is rightsized for its reader, by conduct's rightsize.
>
> **Amended by D154 (2026-10-17):** markdown is authoring's, reached through authoring's main skill when that set is installed; essentials' output-format skill, once designed, holds the layout rule's generic part.

**Decision:** The main skill is designed ([design/skillbook.md](design/essentials.md)). For now it routes only to what is designed: understand, author with its markdown skill, and conduct. Each other root, and the stage-order advice, is added when that root is designed; until then the work they will cover is done directly under act's rules. Its rules are the four decided, with markdown's rule now for every response and every markdown file, since other files follow the project's conventions by act's rule. Its description stays the broad one tested, since it decides whether the main skill loads and so whether act's and respond's rules hold for any work; a change is re-run through the test harness. The baseline therefore holds the main skill, all of conduct, all of understand and author's markdown.

**Why:** The person asked that the main skill name only what is complete, so the agent is never routed to a skill that does not exist yet; keeping the description broad still brings every piece of work under act's and respond's rules.

## D137: The baseline review's fixes (2026-10-17)

> **Amended by D147 (2026-10-17):** handoff's rule against naming a tool only one agent has becomes brief's rule, which carryover follows.

**Decision:** The baseline, the main skill, conduct, understand and author's markdown, was reviewed with skillbook-tree by three fresh agents, one per root, and every finding was checked against its lines. Seventeen small fixes are applied. A proposal to approve is never assumed when the person stops. understand's callers no longer say delegate uses weigh for a council's summary, or that the review root uses challenge; design and plan use challenge. understand's routing line for weigh no longer says how weigh works inside. verify's routing line no longer promises ranking evidence before verify is widened. stakes' high reads "nothing would catch it in time, and any one of". The wrap-up offer has one trigger. delegate's and setup's results match their routing lines; setup's reference files hold the allow-list form. crew lists its plan first and waits only where guardrails' other kinds apply, and its re-read after writing is its own rule. handoff names no tool only one agent has, as its own rule. When verify starts an agent, the report comes back to verify. guardrails' never-rules, two of delegate's restrictions and the numbers in fact and analyze gain their reasons. act's rule on a file's type points to the main skill's markdown rule; the main skill's author line says what it adds; markdown's rules 2 and 3 no longer repeat rule 1 or the strong advice; tests are added for the uncovered when-nots. brainstorm's and survey's descriptions, and split's, no longer overlap. Explaining how project code works goes to research's fact when it needs reading across files. Three larger reshapes, research's parts, organize and delegate, and step-by-step flows that do not say why, are left to the person.

**Why:** The reviewers could not see the conversation that made the design, so they read it as a builder would; each fix removes a place where a builder would have to guess, or where two skills said different things.

## D138: Delegation by default, and delegate in the shape (2026-10-17)

> **Amended by D142 (2026-10-17):** too small means short, the change or answer already known, and leaving little behind; delegate chooses the type, then fork or fresh, then the model; fork or fresh is judged from the list of what the agent needs from the conversation and how long the task is, so a long conversation favours a fresh agent for a long task, not a small one.
>
> **Amended by D143 (2026-10-17):** delegation by default carries its cost reason; a third exception, content the main agent needs to continue the conversation; when the agent cannot tell whether a task is too small, it forks without asking, which replaces the question to the person.
>
> **Amended by D146 (2026-10-17):** delegate's brief asks for the report back rightsized for the main agent, its parts named, longer material in a named file.
>
> **Amended by D147 (2026-10-17):** delegate's advice on the brief moves to conduct's brief, and delegate's step points to it.

**Decision:** Delegation is the default: every task goes to an agent, a fork or a fresh one, so the main session keeps the conversation, the tracking and the person's decisions; the main agent does a task itself only when it is too small, costing less than an agent's start-up and report, or when it needs the person's decisions as it goes, and when it cannot tell whether a task is too small it asks the person. This is strong advice in the main skill, the one place read every conversation; delegate holds how. No other approval is asked for delegating; guardrails' cost rule still applies to large delegations, with usage limits counting as cost, and delegation never widens what is allowed. A fork serves work the conversation has decided; a fresh agent serves independence, which a review, fresh eyes, verify's second agent and a council's members need, or another tier, or a small task in a long conversation; the rule against delegating once the files are read holds only for fresh agents. The main session keeps a running list, says one line when a task starts and when it comes back, waits for the harness's notice, checks each result through verify and reports it in a few lines. delegate takes the full shape: rules, advice, one routing line each for council, fanout and crew, so that a review with one lens per agent is a fanout, and a last instruction; the three earlier reasons become advice for choosing the agent and the kind.

**Why:** The person works this way: tasks go to agents and the main chat is kept for tracking and other work. A main session that does every task fills with tool output and loses the person's thread; asking before each delegation would make the person approve a stream of small yeses, so only the uncertain case of size goes to them.

## D139: Skills stay generic, and the harness's limits hold (2026-10-17)

**Decision:** skillbook's skills impose no outside tool where they can avoid it: no terminal multiplexer or similar tool is named in a skill's rules, advice or reference files; a tool the person names is used through that tool's own skill or documentation, the skill's own rules still holding. Tools a skill truly needs, such as git, are a separate subject, to be discussed. The harness's limits, what it permits, what needs the person's opt-in and how its tools must be used, hold above skillbook, which never asks the agent to break them; its defaults, such as style and working habits, are what skillbook's skills refine. act's rule on which instruction wins holds this, and delegate's rule on the harness's limits on delegating is a variation of it.

**Why:** skillbook runs in many harnesses and on many machines; a skill that required one person's tool, or overrode a harness's limits, would break where that tool is missing or where the harness's safety and billing depend on them. Limited to limits, the harness's word does not quietly override what the skills are for.

## D140: research in the shape, and the ranking of evidence in research (2026-10-17)

**Decision:** research's own skill takes the full shape: its instructions are stating the question, routing to the part, and the last instruction, with one routing line each for fact, survey and analyze, saying when to use it, when not and what it gives back. Choosing sources, each kind through its reference file, and fanning out through delegate when there is a lot to read become research's advice; ranking how strong each finding is stays its rule 3; fact, survey and analyze point to these instead of repeating them, and each part's Callers field carries its line. The ranking of evidence, seen or measured, read at its source, inferred, only said, has its one home in research, beside the findings format; verify is not widened, and fanout and challenge point to research.

**Why:** The baseline review found that research said only when to use each part, and that sources, fanning out and ranking were each stated twice. The ranking had waited on verify's widening while research already held it, so one home closes four open notes.

## D141: organize in the shape (2026-10-17)

> **Amended by D148 (2026-10-17):** the note on how organize is written becomes: each rule generic and clear without its example, its examples spanning writing, code and design, a kind named in a rule only where the rule differs for it.

**Decision:** organize's own skill takes the full shape. Its rules, each with its reason: one dividing principle at a time; each part's boundary in one sentence; meaning preserved, checked by an inventory or by tests; the person verifies the plan and the result whenever something changes; retired items marked and kept; for code, organize proposes and implement makes the change. The warning signs are its advice. Its instructions, in order: find the dividing principle and the unit; check existing parts without asking for approval, since nothing changes; choose the operation by one routing line each for split, merge, compose, normalize and cluster, saying when to use it, when not and what it gives back, which replaces the table, with renaming, reordering, deleting or moving one item named as not organize's; plan; apply; check meaning; and the last instruction. That its rules speak of items rather than one kind of unit becomes a note on how its `SKILL.md` is written. Its description says when to use it, and each operation's Callers field carries its line.

**Why:** The baseline review found organize's rules, advice and routing mixed in one list, and its table naming each operation but not when not to use it or what it gives back; in the shape, a builder can write it from the design alone.

## D142: What delegating costs, and how delegate chooses (2026-10-17)

> **Amended by D147 (2026-10-17):** the offer at a phase's end when the window is over about half full is designed in carryover, with signs for harnesses that do not show the window.

**Decision:** What an agent's work costs rests on four facts, explained in a research note ([research/token-cost.md](research/token-cost.md)): every turn pays for the whole context again; the cache makes that cheaper, not free; output costs several times input; the model sets the price of every token. Each skill carries only a short reason drawn from it; a harness's specifics, whether it can fork, how its fork uses the cache and what context use it shows the agent, go in delegate's reference file for that harness; no new skill is made before the lean discussion. delegate chooses in this order: the type, used as named when the caller names one, otherwise after a cost check, several agents only when the parts are large, independence or different lenses improve the result, time matters and the person accepts the cost, or one agent's context would fill up, with a search before any reading fanout; then fork or fresh for each agent; then the model for each fresh agent. Fork or fresh is judged from signs, never counted tokens: the list of what the agent needs from the conversation, short or long; whether the task's answer is already known or has to be found; whether it reads or produces a lot; whether a lighter model fits. Independence still needs a fresh agent. delegate's advice holds this as a sample of how its `SKILL.md` puts it, each line with an example. The window's fullness is used only where the harness shows it to the agent without extra work, and only to give a fresh agent the list in a file instead of a fork when the window is nearly full, and to offer a handoff at the end of a phase when it is over about half full; a session's transcript is read for measuring, never for routine choices. The main skill's too-small test becomes: short, and it leaves little behind. The two assumptions behind the worked figures were measured by running Claude Code with the lightest model: a fork's first call read the parent's whole conversation from cache while it was warm (E10), and a fresh agent's start-up is about 14,700 tokens for the general-purpose agent and 12,600 for Explore (E11). The order of the work that follows: delegate, handoff, organize, a sweep of the other skills and skillbook's own files, then the lean skill.

**Why:** The person wants skillbook to cost fewer tokens. The earlier fork-or-fresh advice had it backwards: a long conversation is cheap to carry for a few turns and costly for many. Most harnesses do not show an agent its context size, and the crossover depends on the task's length, the start-up and the models' prices, so thresholds in tokens would go unused or force guesses; the list is something the agent writes for a brief anyway.

## D143: Effort beside the model, and delegation by default with its cost (2026-10-17)

> **Amended by D144 (2026-10-17):** model and effort are chosen separately: the tier table loses its effort column, and effort follows how much reasoning the step needs; the rest of D143's lines on effort hold.
>
> **Amended by D146 (2026-10-17):** the report back, left provisional, is settled.

**Decision:** delegate's tier table gains an effort column, decided by the same question, what happens if the agent is wrong: low where a later step catches it or the work is mechanical; the harness's default where nothing catches it but one commit undoes it; high in both rows where nothing catches it and shared contracts, production, data, schemas, public interfaces, auth or security are touched. A wide fanout never inherits the main session's effort, since its cost multiplies by its agents; a fork keeps the main session's effort and model; the main session's own effort is the person's choice and is never changed. Effort is set only where the harness lets a skill set it: in Claude Code a fresh agent's effort may be set when the person, their instruction file or a skill asks, and delegate's table is that ask; the reference files map the levels to each harness's names. Delegation by default stays the main skill's strong advice, now with its cost reason: a fork costs about what doing the task in the main session would and then saves on every later call, since what it reads stays out of the main context, and a fresh agent is cheaper still for long or light work. It gains a third exception: the main agent does work itself when it needs the content to continue the conversation, such as reading what is being discussed. When the agent cannot tell whether a task is too small, it forks without asking, which replaces the question to the person; the one-line start notice still lets the person stop it. The research note gains this session's own costs as a finding, what effort costs, and the inference that a fork always starts with the cache warm. The shape of a delegated agent's report back was agreed provisionally and is settled after the lean discussion, which moves up to come next.

**Why:** Thinking is paid at output price, so how hard an agent thinks costs as much as how much it writes, and effort answers the same question as the model. This session's own figures show that long sessions dominate the cost: carrying the context and writing it to cache were about four-fifths of it. Where the too-small call is hard, doing the task and forking cost about the same, so a question costs the person a turn and settles little. Delegating content the main agent needs for the conversation means reading the report and then the content anyway.

## D144: Models named only per harness, and effort chosen apart from the model (2026-10-17)

> **Amended by D149 (2026-10-17):** prices and price steps move out of each harness's mapping file into one `references/prices.md`, read only when a cost is stated.
>
> **Amended by D150 (2026-10-17):** decisions that other work builds on take the strong tier and high effort, judged by what is built on them; the strongest model only after the strong tier falls short.

**Decision:** Skills name tiers and effort levels only, never a model. Each harness's reference file in delegate maps the tiers to the names that harness takes, with each model's price, any price step and the date read, and, where the person picks models from several providers, says how to find the ones available; Claude's and Codex's come first, others when needed. The person's own instruction file can set or override the mapping; with no mapping, neither a reference file nor the person's, every agent runs on the session's model. fanout's advice sizes a light agent's part so its context stays under its model's price step, and the step itself is in the reference file: for Claude, Haiku 5.5's price rises five times once a prompt passes 100,000 tokens. The main skill's page for people will say, without naming models, that a session of mostly mechanical work can run on a lighter model, since the main session's model is the person's. Model and effort are chosen separately, which amends D143: the model by the tier table, what happens if the agent is wrong, light only if mechanical, whose effort column is removed; the effort by how much reasoning the step needs: low when the step only carries something out, such as known edits, searching, reading for a fact or a sweep; the harness's default for ordinary work; high for judgment that nothing after it checks, such as validating, an unclear failure, a design choice or a final synthesis. A step a later one checks can think less. Kept from D143: a wide fanout never inherits the main session's effort, a fork keeps both the main agent's model and effort, the main session's own effort is the person's, and effort is set only where the harness lets a skill set it.

**Why:** Model names belong to each harness, and skills stay generic (D139); guessing another provider's names could start an agent that does not exist, or one that costs more than meant. The light tier holds most of the saving: on today's prices Haiku 5.5 costs a twentieth of Sonnet 5.5, which costs half of Opus 5.5. Capability and deliberation are different dials, as the person's own delegation-routing material treats them: a sweep with a validator behind it needs neither a strong model nor deep thought, while a tricky function that tests will check needs thought but not the strongest model; one row for both forced them to move together.

## D145: rightsize, nothing missing and nothing extra for the reader (2026-10-17)

> **Amended by D149 (2026-10-17):** rightsize is read with act, respond and author's markdown in the main skill's first read, not reached later through respond.

**Decision:** What the person asked of everything an agent gives back, makes or does, comprehensive enough to cover what is necessary and sufficient to give back or do only what is needed, top-down, becomes conduct's rightsize, a skill beside stakes. Its rules, each with its reason: the reader first, who reads it and what for; nothing missing, the reader can understand or act without asking again; nothing extra, a part whose removal loses nothing goes; parts that cover everything with no two overlapping, one home for each thing, how to divide being organize's; top-down, the point first, then what it rests on, then the detail; never below a rule, nothing a rule requires cut; and the work rightsized, only what the task needs read, independent calls sent together, stopping once the result is enough, while doing exactly what was asked stays act's. Its advice lists what is usually extra and what is usually missing, and length follows the reader and the question, never a word count. Its last instruction is a five-question check, run before anything is returned or written: who reads it and what for; what could go without loss; what the reader would still have to ask; whether it is top-down with its parts comprehensive and exclusive; whether anything a rule requires was cut. It is triggered by the main skill's one-line rule, respond's last instruction before every response, author's markdown before a file is returned, organize, delegate's brief for the report back, handoff's write, instruct and act, and later by implement and design; its routing line in conduct sits under "Before saying done", beside verify. Each skill that makes something keeps only what is specific to its output: respond keeps the length of a response and the shape of an explanation, its first rule pointing to rightsize; organize keeps the one-sentence boundary; instruct keeps a document read on every turn short. The optimize idea merges into it as its work half. It is named rightsize, not lean.

**Why:** The person's principle holds for responses, files, code, systems and the work itself. A rule that lives only in the main skill is read once and fades as a session grows, and cannot be triggered, while a skill can be named at the moment it is needed; the main skill is carried on every turn, so it stays short. stakes is the precedent: one judgment many skills need, called rather than restated. "Lean" reads as "less", the nothing-extra half only, and a one-sided name could lead agents to cut what is needed.

## D146: The report back rightsized for the main agent, and references named in words (2026-10-17)

> **Amended by D147 (2026-10-17):** the report's parts move with the brief advice to conduct's brief.

**Decision:** A delegated agent's report is rightsized for its reader, the main agent, by conduct's rightsize, and delegate's brief sets its parts: the outcome, worded to name the task, such as "the effort decision recorded: …" rather than "Done: …"; what needs the person's decision, with any proposal; where the evidence is, by path, never pasted; what was not found or not done; what was left behind, in cleanup's three fields. Anything longer goes to a named file in the scratch place, and the main agent reads only the part it needs. A line or two of context, what was asked and why, is included when the brief asks for it, which it does when several delegated tasks run at once, when the job is long and the conversation may move on or be compacted, or when the report is kept for a later reader, a file, a handoff or the person. A task that was changed or narrowed is said first, always. The brief carries all of this, since a fresh agent may never load rightsize. respond's paragraph on delegated agents says only that the reader is the main agent and the parts are delegate's brief's; the report to the person is unchanged. respond's rule on things named in words gains its test: a reference stays as it is when this reader can tell what it is from the reference itself, right now, without looking it up, such as a file name or path, a link, a command, a function name, a name the reader knows or a number from the current round; otherwise a few words say what it is, with the number in brackets after, as for decision, evidence, test and note numbers, question numbers from an earlier round, commit hashes, IDs and abbreviations the reader has not used. A delegated agent's report to the main agent may use numbers, and the main agent turns them into words when it tells the person.

**Why:** Every line of a report stays in the main context for the rest of the session, and a report kept or read later needs to say what it answers. The rule on references said what to avoid but not how to tell a reference that needs words from one that does not; whether this reader can tell what it is on the spot settles both, and keeps paths and links as they are, since words around them would only add.

## D147: brief and carryover, the two halves of writing for a reader who was not there (2026-10-17)

> **Amended by D149 (2026-10-17):** a fresh agent's brief tells it not to load the main skill and names any skill it needs.

**Decision:** Writing for a reader who was not in the conversation has two halves, each a skill in conduct. brief, beside delegate, is for an agent starting now. Its rules, each with its reason: the reader can start without asking; decisions and constraints that are not in the files are stated; what was ruled out or already tried is said; the first step is given, with how the reader knows it is done; references are by path, never pasted; no tool only the writer has is named. Its advice holds what a delegation needs: a line or two for a fork, findings rather than files for a fresh agent, and what to ask back, the report's parts set in D146, the three cases for a line of context and a changed task said first, with act's rule on delegated agents carried. Its last instruction checks that the reader could start without asking, nothing is pasted, the report is asked for and rightsize's check passes. delegate's advice on the brief and the report back moves to brief, and delegate's step becomes "Brief, by conduct's brief". carryover, renamed from handoff, is for a later session or agent and builds on brief: brief's rules hold for its shared parts, decisions with where they are recorded, references by path and the first next step; it keeps what is done with its evidence, what remains in order, what is uncertain, what it was written against, where it is kept and the resume steps. It is offered with one question, through ask, at a phase's end, such as a batch committed, an item recorded or a topic finished, when the session has been long, many turns and files read or the harness showing the window over about half full, and the next work needs only what fits in the carryover; not when the next work needs the conversation or the session is short, and at most once per phase. conduct's wrap-up offer gains the reason for a break, that resuming a long conversation after the cache expires writes it all again, and points to carryover; conduct's routing lines put brief under "While working" and carryover under "When stopping".

**Why:** Both write for a reader who was not in the conversation, one now and one later, so most of what makes either good is shared. Delegation is frequent and a carryover rare, so they are separate skills, and building carryover on brief keeps one home for each rule without a parent level. "Handoff" reads as a brief too, since handing work to an agent now is also a handoff; "resume" reads as a CV; "checkpoint" is taken by guardrails and by Claude Code's own feature; carryover means into a later period. Long sessions dominate the cost, and a carryover at a boundary beats the harness's compaction, which comes late, costs a call over the whole context and decides for itself what to keep.

## D148: organize while creating, and parts sized to how they are read (2026-10-17)

**Decision:** organize covers wholes not yet written as well as written ones: for a planned whole, the items are what it must cover, such as a planned report's topics, a planned program's responsibilities or a planned system's requirements. Its routing line and split's say so, split's with examples across kinds: a long document into sections, a report not yet written into the topics it must cover, a large module into smaller ones, a folder of mixed files into groups, a planned system into components. author, implement, design and instruct call organize when they plan parts. Rules 3 to 5, meaning preserved, the two approvals and retiring, do not apply when nothing existing changes, since they are worded for when something changes; the creating skill's approvals apply instead. split gains advice, while creating and when rearranging: each part readable on its own, saying what it is and needing no sibling; a part's size following how it is read, short when read whole or on every turn, with headings or a map when searched. organize's warning signs gain a part readers mostly read in order to skip. cluster gains advice: for items agents read often, a map pays, since readers open only the part they need. The inventory behind meaning preserved is done by a script where one can do it and through delegate by a light fresh agent where judgment is needed, never by reading everything twice in the main session. Code is unchanged; the 11,000-line file waits for implement. organize is worded generically: each rule clear without its example, its examples spanning writing, code and design, a kind named in a rule only where the rule differs for it; the unit step lists the range once: sentences, paragraphs, sections, topics; files, folders; skills; functions, modules, packages; a system's components.

**Why:** Most parts are made, not rearranged: a document, a program or a system is divided as it is planned, and the same principle, boundaries and warning signs hold, while nothing exists yet whose meaning could be lost. What a reader opens costs attention and, for an agent, tokens on every later turn, so a part's size follows how it is read. Examples drawn from one kind make a rule look as if it held only for that kind.

## D149: the cost sweep's fixes (2026-10-17)

> **Amended by D154 (2026-10-17):** the first read becomes act, respond, rightsize and essentials' output-format skill once designed.

**Decision:** A fresh agent reviewed the baseline designs against seven cost checks, and the person accepted its fixes with the main agent's changes. Skills a route names for the same step are read together, in one turn, by act's rule on routes, and the main skill's first read becomes act, respond, author's markdown and rightsize together. A fresh agent's brief tells it not to load the main skill and names any skill it needs. cleanup is read at a task's end only when something was created or started, and a read-only agent reports "left behind: nothing". delegate reads stakes only when it is not plain which row of the tier table applies, and guardrails for the cost only when several agents or a long job are planned; it reads only the current harness's reference file; prices and price steps move to one prices file read only when a cost is stated, which amends D144; the rules for other harnesses move to their own reference file; the reason for delegating stays in the skill as one line, since the blueprint does not ship. research reads a kind of source's reference file when that kind is first searched. fanout's agents write their findings to files and report the path and count, and its validator checks the findings the answer rests on and any that contradict each other, the rest marked "not validated". verify reads the exit code, the failure count and the failing lines, the full output only on failure, and its four extra checks search and read the hits, a fresh agent at the standard tier doing large readings. understand's result shape is not a form to fill. organize's map is shown in full when it fits on a screen and otherwise written to a named file. Three restatements in files carried every session become pointers: the main skill's cost reasoning, delegate's too-small line and act's work rule. A one-line response gets a glance rather than the full check, except where it touches a secret, an irreversible action, a reference or a failure. Markdown with no linter is checked by a search rather than a read-back. setup does not ask which other agent programs may run, and states its default on the team rather than asking; carryover keeps asking where it goes outside a project. survey fans out only when delegate's test for splitting holds. skillbook-tree's checklist gains check 11, cost, from the seven questions, and the baseline's start-up is measured once it is built and kept small by a figure set then, as advice.

**Why:** Every turn carries the whole context again, so reads, turns, outputs and loaded skills that buy no quality cost on every later turn; the sweep found where the baseline paid for them. Where a fix would trade quality for cost, the person decided: the validator's narrower scope was accepted with the rest marked, and writing a carryover to an unchosen place outside a project was rejected, since where it goes matters to the person. A check in skillbook-tree carries the same review to every skill designed later.

## D150: decisions others build on, and challenge before suggesting (2026-10-17)

**Decision:** Decisions that other work builds on, such as a design, an architecture, a plan or an interface, are judged in delegate's tier rule by what would be built on them, not by how easily their file is reverted: the strong tier and high effort, since a wrong decision costs more than the model; the strongest model, which each reference file names, only after the strong tier has tried and fallen short. The note for the main skill's docs page adds that design and planning sessions deserve a capable model at higher effort. understand's challenge gains a trigger: before a recommendation is put to the person, at a depth that follows stakes: low, none; medium, the strongest one or two objections thought through, shown only if one holds, changing the recommendation or adding a caveat; high, or any design or plan decision, a full challenge, its verdict in one line beside the recommendation. A decision the person makes without a recommendation, or against one, is challenged the same way before it is relied on. Nothing is challenged twice. The trigger lives in challenge's callers, and ask's rule on recommended answers points to it.

**Why:** The person asked that work needing reasoning, such as design and planning, use capable models and higher effort, since accuracy there matters more than cost; the tier table, written for changes to code, read a design's easily reverted file as the cheap row while everything later is built on its decisions. The person also asked for a critique after deciding or before suggesting; challenge already attacks an idea before it is relied on, but nothing made the agent challenge its own recommendation. This session's corrections show the cost: effort and model tied into one row, model names only Claude has, "lean" naming one half, and "resume" reading as a CV, the first and the last of which a challenge would likely have caught.

## D151: plan, planning any work before acting (2026-10-17)

> **Amended by D154 (2026-10-17):** plan is essentials'; its software parts are softeng's.
>
> **Amended by D155 (2026-10-17):** the four signs give way to one indicator, multipart work, and a full plan when stakes are high or the work is long or wide; the person's choice moves from depth to approval; given steps are followed and enhanced where they are not obvious, by the obvious test; the main skill routes to plan.

**Decision:** plan becomes the root for planning any work before acting, whether writing, research, design or code. A plan is needed when any of these holds: order matters, there is a real choice of approach, stakes are medium or higher, or the work is long or wide; not when the work is short and its answer known, when the person gave the steps, or for a question or an exploration; when unsure, a one-line plan is stated and the work starts. It is one line, or a full plan: the goal and how it is known to be done, the steps in order with their checks, what is out of scope, the risks and what catches each, what goes to agents. It waits for approval when it holds the person's choice, stakes are high or the person asked; otherwise it is shown in a line and the work starts. The harness's plan mode is used where it exists and approval is needed, no skill naming it; a plan is revised, and approved again where it needed approval, when a step fails or a fact it rests on changes; a full plan is challenged before it is shown (D150). Its software-engineering parts, breakdown, slices and sequence, are kept, not dropped: their descriptions, word for word, their material and their caller are moved to plan's ideas under a heading saying they are kept for the person's software-engineering skills, where they will be used, and the tree, its graph, its sources and plan's design point there. The main skill routes to plan once its full design is done, which explains further when a plan is needed and how deep it goes, as the person asked.

**Why:** Most harnesses have a plan mode, but nothing said when to plan; the pieces were scattered across act, guardrails, crew and organize. A plan costs a turn or two, while going the wrong way costs the rework, and a plan gives each part a boundary for delegating and carrying over. The person has their own idea for software-engineering skills, so planning a program's work waits for it, and its parts are kept for it.

## D152: skillbook as separately installable sets (2026-10-17)

> **Amended by D156 (2026-10-17):** the short fallback becomes the caller's one-line fallback where a doer's set is missing, beside the doer's one-line default where a keeper's is; each part of a piece of work has one owner; a project uses blueprint when its instruction files point to it.

**Decision:** skillbook becomes a collection of sets in one repository, each installed on its own: essentials, blueprint, softeng and authoring; later rigs, a knowledge base (once vaultops) and routines. Each set works alone. Each has its own main skill, listed to the model and named after the set; its other skills stay hidden. A skill that needs another set's skill goes through that set's main skill, by name, and the agent tells whether the set is installed from its skill list; when it is not, a short fallback or hint written where it is used, a rule or two that matter for that case naming the skill it stands in for, keeps the set whole: a variation, not a second home. A hidden skill of another set is never read by its path. No set depends on another, so none declares a dependency. essentials' main skill is the one loaded first for any work and holds the rules every response follows. The same skill name may appear in two sets, told apart by their set. How each set is installed, a plugin from a marketplace, `npx skills add` through skills.sh, or both, the folder layout, and a naming rule for a route without a namespace, such as names prefixed with their set, are decided later.

**Why:** People install only what they need: someone with their own engineering skills can use blueprint alone. Splitting saves no tokens, since a hidden skill costs nothing until it is used; its gains are choice and clear boundaries, and each set's main skill adds one description to the listing, where six or thirteen listed roots routed as well as one. A dependency on essentials was considered and dropped, since a short fallback keeps each set whole without it. The tests fix the mechanism: a namespace has one level, the plugin's name; only a listed skill can be called by name from another package; a hidden skill is read by its path only inside its own package; Codex ignores a plugin's dependencies ([research/skill-loading.md](research/skill-loading.md)).

## D153: The core set is named essentials (2026-10-17)

**Decision:** The set any work needs, holding conduct, understand, design and plan, is named essentials, and its main skill `essentials`. The set's description where it is offered for install carries what it does, such as "skillbook essentials: the working habits that make your agent careful, efficient and organized"; the main skill's own description keeps telling the agent to load it first for any work.

**Why:** The name says install this first, and the description says why. Rejected: tame, which treats agents as wild animals, the person's own concern; habits, recommended, which the person set aside for essentials; manners, politeness more than efficiency or organization; groundwork, the base but not behaviour; conduct, already a root inside the set, so a part and its whole would share a name; core, which says nothing to someone installing it and is already greenrepo's word; baseline, already the word for the first build, and it reads as the minimum; discipline, as strict as tame; playbook, Ansible's central term and command, security automation tools' workflows and incident response's procedures, and a second "book" beside skillbook; standards and practice, already maintain's repository standard and engineering practice; handbook, two books beside skillbook; coach and mentor, which name a person; mindset, a buzzword and vague.

## D154: What each set holds (2026-10-17)

**Decision:**

- **essentials:** the main skill, conduct, understand, design and plan. Its design is how to design anything: its flow, its principles and design review's general lenses. Its plan is planning any work before acting. A small output-format skill with generic layout rules for its outputs is designed later, before the baseline is built; respond already prepares every response, so whether it sits in respond or beside it is decided then.
- **blueprint:** the spec-to-dev flow and its records, keeping its files, folders and procedures intact and running: start, discuss, research, decide, evidence, write, workstream, tasks, work, sync, consolidate, parallel, check and publish, and the form of each document, once author's blueprint skill. It requires no design or engineering skill and uses whatever the person has; where its topics touch others, such as splitting design files, which touches organize and modularity, it gives a hint pointing to the skill that holds the topic.
- **softeng:** its own design, how good software is designed, with architecture and design review's architecture lens; plan's software parts, breakdown, slices and sequence, kept in [ideas/plan.md](ideas/plan.md); implement, test, review, ship and maintain.
- **authoring:** author renamed: docs, business, articles, edit, issue, reader and markdown, which stays here.
- **rigs:** a set of its own, designed later.

The lifecycle is no longer general: essentials holds design and plan, which any work needs; doing, checking and delivering are each set's, softeng's for software and authoring's for writing; with no such set installed, the work is done under act's rules. essentials and softeng both have a skill named design, since no other word fits: shape is the shape every skill takes, model an AI model, draft a written draft, and devise and conceive are vaguer and close to brainstorm and plan. The baseline's markdown part becomes essentials' output-format skill.

**Why:** blueprint is a flow anyone's engineering skills can use, so it holds no opinion on how to design. softeng explains how good software is designed, so it holds its own design rather than a share of a split one. General implement, test, review, ship and maintain would be thin, since act, verify and understand's challenge already hold their general parts. markdown is authoring's, and essentials needs only generic rules for its own outputs.

## D155: plan's full design (2026-10-17)

**Decision:** plan takes its full design. Planning has two halves, making a plan and following one, and three checks in order. First, is the work multipart, needing more than one step or part as the agent sees it, whatever the wording? Single-step work needs no plan: the person's choice in it goes to conduct's ask, the agent's is simply made, a single risky action is a proposal under guardrails, an answer to a question is single-step, and a view asked for gets act's "a view and a plan", the plan made in plan, shown and never started. Second, are the steps already given, by the person, a skill's ordered instructions, blueprint's tasks, an approved plan carried over or a checklist the project keeps? They are followed, the given items being the top of the plan: missing items are added and marked, by organize's gap check; items that are not obvious are expanded and obvious ones left; the person's items keep their place and wording, reordering or dropping one is asked first, and a failed step in the person's own steps sends the revision back to them. Third, one line or a full plan: a full plan when stakes are high or the work is long or wide, more than about five steps, more than one sitting, or parts that could go to different agents; otherwise one line, holding the approach where a choice was made, the steps in order and the check. A step is obvious when the agent could do it now, knows how it will be checked, and has no choice left that would change the result and nothing to find out first; what failed says what to do: parts not yet known, organize's split; an unclear goal or done, understand's clarify; an open choice, made and stated when it is the agent's, asked through ask when it is the person's, a choice being the person's when the options give them different results they would care about, such as scope, cost, how it looks or a public interface; something to find out, a quick look or understand's research. Each new step is tested again until every step passes, and the same test sets how deep any plan goes. A full plan holds the goal and how it is known to be done, the steps in order each with its check, what is out of scope, the risks and what catches each, and what goes to agents, a section with nothing to say left out; it is divided through organize, split for the parts, merge, compose and normalize where they fit, the order of the steps staying plan's own and organize's two approvals not applying, and challenged before it is shown. Following applies at about three steps or more, whoever wrote them: a checklist, the harness's task list where it has one, done in order, each step checked by verify before the next; a given step that looks wrong is raised before going on, and a failed step stops the list and goes to re-planning. A plan, of either depth, waits for the person when stakes are high, they asked for a plan, or it holds a question for them; otherwise it is shown and the work starts; when it waits, the harness's plan mode is used where there is one. It is kept in the response when it fits on a screen and in a file when longer, a keeper saying which file (D156). plan has no parts; its description, callers, result, files, material and tests are in its design, and the main skill routes to it.

**Why:** The person found the four signs and the two depths thin, and asked how the agent decides. Being multipart is the real indicator: order and the choice of approach become what the plan states, and the choices and risks of single-step work already have homes. People usually name the main items and leave the rest to the agent, so given steps need enhancing as well as following, and one test, whether a step is obvious, decides both what to expand and how deep a plan goes. The person's choice moved from depth to approval, since it is asked while the plan is enhanced.

## D156: Sets complement each other (2026-10-17)

**Decision:** A project that adopts blueprint gets a pointer in its instruction files, such as `AGENTS.md`, to load blueprint's main skill; blueprint's start step adds it, through instruct, with the person's approval. That pointer is what "the project uses blueprint" means, so essentials checks nothing and never names blueprint for this. Each part of a piece of work has one owner: the caller says when it happens and what for; the doer says how it is done and what goes in; the keeper says where the result lives and in what form. Parts are designed not to contradict, each skill saying only its own part, such as plan saying a long plan is kept in a file and blueprint saying which file; it works both ways, blueprint calling essentials' clarify or plan, and essentials' plan and carryover kept by blueprint. Where a doer's set is missing, the caller's fallback holds; where a keeper's is, the doer's default; each is written down, one line holding the rule that matters most there, never left to the agent's own sense: blueprint's "clarify the idea first, through essentials' clarify if it is loaded; otherwise ask only what would change the work, one question at a time, each with a recommended answer", plan's "the response, or a file when it is longer", carryover's "a file the person names, the agent recommending one". For a rare real conflict, a skill's word on where or in what form is written as a default, counts among skillbook's defaults in act's rule on which instruction wins, and gives way to any loaded instruction for the same case; conflicts between instructions that are not defaults follow act's order. The same contract holds for every pair of sets, such as essentials' design and softeng's, and essentials' output-format skill and authoring's markdown. Two skills in context complementing each other is untested.

**Why:** The person's approach. A rule in act naming blueprint was proposed and dropped, since the pointer already says whether a project uses blueprint, and essentials then names no other set for this. Parts that each say only their own do not contradict, so the rule for defaults is only a safety net. Behaviour left to the agent's own sense varies by model and session and cannot be tested.
