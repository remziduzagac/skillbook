# Ideas: the skill tree's open questions

What is still open about the tree: the sample's history, its shape, the graph, the provisional roots and the brainstorm's questions. The tree itself, as decided, is in [../design/skill-tree.md](../design/skill-tree.md); what is decided about skillbook as a whole is in [../design/how-it-works.md](../design/how-it-works.md) and [../decisions.md](../decisions.md). Nothing here is decided unless it cites a decision.

Drafted from 2026-10-10 from [draft-ideas.md](../notes/draft-ideas.md), the research notes on loading and on other collections, and the first design. Draft 1 expanded every skill into its parts; draft 2 named the groups; draft 3 made the activities roots; draft 4 wrote design as a procedure over its sub-skills; draft 5 grouped the lifecycle under engineering, and knowledge and routines under productivity (D47, D48); draft 6 set knowledge and routines aside for later (D64); draft 7 lifted engineering's stages to the top (D76).

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

Daily routines stay outside it (D31); learning from a session lives in coordinate's learn.

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

- **coordinate-delegate** ← design-consolidate, design-parallel, design-review, implement-plan, understand-research (survey above all), test-experiment, coordinate-delegate-council.
- **respond-layout** ← respond, for every response, act, for every markdown file, coordinate-brief, and authoring-markdown, for structure (D158). **authoring-markdown** and each **implement-code** language skill ← act, before every file of their type is written (D67, D68); markdown also ← maintain-repo.
- **coordinate-instruct** ← coordinate-setup, when it writes into an instruction document (D94).
- **test-tdd** ← implement-plan, test-debug. **review-code** and **act-verify** ← implement-plan.
- **understand** (discuss, clarify deep, brainstorm, research) ← design; other roots reach understand's skills through the main skill (D51, D56).
- **understand-research** ← test-experiment; understand's frame, brainstorm, weigh, challenge, argue and naming, for a fact. **understand-research-analyze** ← test-debug, when the cause is not obvious, and ship, for an incident's cause.
- **design** ← coordinate-learn, to record decisions. **design-architecture** ← test-tdd, for the deep-module vocabulary.
- **understand-naming** ← design, for unclear terms. **act-verify** ← coordinate-delegate, for verifiers.
- **understand-argue** ← understand-weigh, for each option in a debate; understand-discuss; respond, for the person's view at its strongest; authoring, for a proposal's case. **understand-challenge** ← understand-argue, for its objections.
- **implement-git** ← maintain-repo.
- **maintain-repo's release rules** ← ship-release, ship-deploy, ship-rollback: the contract shipping works within.
- **ship-wizard** ← ship-infra, ship-release.
- **respond** and **act** ← the main skill, by its steps, once per conversation; respond again before each response is returned (D63, D81, D178).
- **authoring-blueprint** ← design's recording steps (discuss, research, decide, write, workstream, tasks), for each document's form (D69). **coordinate-delegate** ← authoring-edit, for passes run in parallel (D70).
- **organize** ← design (an idea document split into sub-documents), plan (dividing a plan's work; the former plan-breakdown is kept in [plan's ideas](plan.md), D151), authoring-docs, and skillbook-design for placing a skill (D61, D77).
- **act-rightsize-lean** ← coordinate-instruct's prune step on an existing document, skillbook-design's cost check, design-review's lean lens and authoring-edit, for removing whole parts; **authoring-reader** ← act-rightsize-enrich, for what the reader would still ask (D157).

## The roots, provisional

Draft descriptions. Since only each set's main skill is listed (D56, D152), these are read by the main skill's routing and by the person in the slash menu, not matched by the model every turn. The main skill's own, as tested (D57):

- **main skill:** *"Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, git commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills."*

- **authoring** (was author, D154, and before that write, D67): *"Writing work for people. Use when writing a blueprint document (an idea, a note, a decision, a design), documentation for users, a document for stakeholders (a status update, report, proposal or memo), or an article, or when editing a text."*
- **understand:** *"Understanding before acting, with the person and from sources: a topic discussed item by item, what the person means clarified, facts found out, options explored, a problem framed, a choice weighed, an idea challenged, a case made for a position, a name chosen. Use when a request is unclear, the person wants to discuss something or be questioned, options or a choice are wanted, an idea should be tested before it's relied on, a position should be argued at its strongest, a question needs facts from sources, or something needs a name."* (D131, D132)
- **research** (now under understand, D59): *"Finding out. Use when researching a question across sources, surveying tools or prior art, analysing causes, or writing up findings with their sources."*
- **conduct** (with what was agents, D67): *"How the agent acts. Use when setting up an agent's files, delegating to subagents, handing work to another agent, verifying work, or reviewing what a session taught."*

The parts keep their drafts, now read by the root that routes to them and by the person in the slash menu:

- **design:** *"Design: shaping what to make. Use when an idea needs a design, a project has a blueprint, or a design needs reviewing or updating from the code."*
- **plan:** *"Planning multipart work before acting, and following it step by step: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong. Use before any work with more than one step or part, or when given steps to follow."* (D155; the D151 draft gave way to it; the former description is kept in [plan's ideas](plan.md))
- **implement:** *"Implement: making it. Use when carrying out a plan or a task, prototyping to answer a question, working with git, building a web front end, or a tool agents drive."*
- **test:** *"Test: checking that it works. Use when writing tests, testing first, debugging a failure, or testing in a browser."*
- **review:** *"Review: judging a change before it lands. Use when reviewing code or a pull request, answering a review, or writing a pull request."*
- **ship:** *"Ship: getting it to people. Use when building, releasing or deploying, rolling back, setting up environments, or handling an incident."*
- **maintain:** *"Maintain: keeping it healthy. Use when creating, auditing or keeping a repository and its CI, or keeping a fork in step with upstream."*

## Compared with mattpocock/skills

In [mattpocock-comparison.md](../notes/mattpocock-comparison.md): where each of his skills sits in this tree, what his set has that ours lacks, and the other way round.

## Questions for the brainstorm

1. **understand, in detail:** each skill stripped of its old tools' conventions (D50); its root's flow is the discussion and design's discuss the record (D53).
2. **How each activity specialises** for kinds of work other than software (D35), and how a lifecycle activity meets authoring and understand ("review my essay"). Settled in part (D154): the lifecycle is no longer general, and each set holds its own stages.
3. **shipping's reach:** whether running what was shipped (monitor, incident) stays in ship or becomes its own part.
4. **Listed besides the roots,** settled: markdown-style became author-markdown, reached through act's rule for every file written; agent-writing became coordinate-instruct, with skillbook's own conventions in the project skill skillbook-design (D67). Was: markdown-style fires on every markdown edit; agent-writing is called from `AGENTS.md`.
5. **The thin branches:** ship's, authoring's and code's ideas: placeholders, or left out until needed.
6. **Moving in:** `delegation-routing`, which lives in the person's dotfiles today, into coordinate-delegate.
7. **Names under a group,** settled: there is no group layer left; names start at the stage (`design-start`, D76).
8. **Scope:** topics beyond keeping projects well widen skillbook's requirements and `SCOPE.md`.
9. **Flows:** the other routes (a bug, a source, a meeting, a question) drawn like design's; and Matt's gap still open, phase boundaries.
10. **Evaluation first:** how skills are tested before and after they are written (ideas.md).
