# Notes: skillbook's tree compared with mattpocock/skills

How Matt Pocock's skill set, read at commit `49dd158` with its router skill `ask-matt` ([../research/mattpocock-skills.md](../research/mattpocock-skills.md)), lines up with skillbook's tree ([skillbook-tree.md](../ideas/skill-tree.md)). 2026-10-10.

**How it is used (D30):** where one of his skills maps to one of ours, read his before writing ours and take what fits, with credit; where his maps to none of ours, discuss whether skillbook needs its own version. The same holds for every outside collection.

## The two shapes

| | mattpocock/skills | skillbook tree, draft 1 |
| --- | --- | --- |
| Registered | 27 shipped skills | 6 roots, 95 skills (a sample) |
| Listed every turn | 11, about 2,150 characters | 6 roots; the budget set aside for now |
| Hidden from the model | 16 workflows | 95 skills |
| Organised by | flows through time, and role | domain |
| Folders | buckets, for people browsing | the provisional roots |
| Routing | `ask-matt`, which only hints to the person | each root routes, and the agent follows |
| Planning | the issue tracker: spec, tickets, map | blueprint: files beside the code |
| Coverage | engineering, a little productivity | seven activities, six subjects |

## His map

As `ask-matt` draws it:

```text
main flow   grill-with-docs → (prototype, through handoff) → to-spec → to-tickets → implement or implement-spec,
            each driving tdd and closing with code-review and pr → retro
on-ramps    triage (incoming issues) · diagnosing-bugs (something broke) · wayfinder (a huge, foggy effort)
upkeep      improve-codebase-architecture
vocabulary  domain-modeling · codebase-design, beneath the others
standalone  grill-me · grilling · prototype · research · to-questionnaire · wizard · wait-what · teach · handoff
            writing-for-agents
setup       setup-matt-pocock-skills
```

## Where each of his skills sits in ours

- **think:** grilling, grill-me, grill-with-docs → think-clarify-deep (D45; the glossary goes to write-naming); to-questionnaire → questionnaire; wait-what → explain.
- **blueprint:** to-spec → blueprint-discuss (requirements and design); to-tickets → blueprint-plan (tasks with `blocked_by`); wayfinder → a blueprint workstream that settles decisions first. blueprint replaces his whole planning chain, and carries its own flow from idea to implementation and back (D29); see [Which of his skills map to blueprint](#which-of-his-skills-map-to-blueprint).
- **design, plan, implement, test, review, ship, maintain:** prototype → implement; to-tickets → plan (slices, sequence); implement and implement-spec → implement-plan (inline, subagents); tdd and diagnosing-bugs → test (tdd, debug); code-review and pr → review; codebase-design, improve-codebase-architecture and domain-modeling → blueprint (D32); setup-pre-commit → repo, under maintain; wizard → ship.
- **agents:** handoff, claude-handoff → handoff; retro → learn; writing-for-agents → agent-writing; chief-of-staff → delegate; git-guardrails-claude-code → guardrails.
- **researching, knowledge, writing, routines:** research → survey; teach → teach; writing-beats, -fragments, -shape → articles; triage → routines.
- **Not ours:** migrate-to-shoehorn and scaffold-exercises (his stack and courses); setup-matt-pocock-skills, whose job blueprint-setup and repo-setup do.

## What his set has that ours lacks

To discuss, one by one.

1. **Flows.** His skills are organised by how work moves: one main flow, three on-ramps. Ours places skills by domain; the calls between branches exist, but no route is named.
2. **wizard:** an interactive script, generated for the steps only a person can take (credentials, dashboards, cut-overs). Now placed in shipping.
3. **Phase boundaries:** when to continue, clear, hand off, use a subagent or compact.
4. **Triage:** raw issues turned into agent-ready briefs; repo's rules require triage but no skill does it. Now placed in routines.
5. **An upkeep survey:** improve-codebase-architecture looks for deepening opportunities when there is time; now the architecture lens of blueprint-review (D32).
6. **A map for people:** `ask-matt` exists because his workflows are hidden. Ours route through the roots, but the person still needs a map; this tree, as a docs page, could be it.

## What ours has that his lacks

blueprint and repo; forks, security, tools for agents; delegation, verification, guardrails, a council and skill-making; clarify, ideate and discuss beside grilling; knowledge, productivity, research beyond one skill, writing for people. With about twice his skills, ours lists fewer.

## What it suggests for the tree

His main flow's stages (understand, plan, build, check, learn) are the intents of cut C. Domains say where a skill lives; flows say how skills chain. The tree may want both: domain roots for placement, named flows for routing.

blueprint's flow (D29) is the main flow for project work: an idea is analysed through the code, research and discussion into a design, which triggers the implementation, and the implementation adjusts the design (D31). Its draft is in [skillbook-tree.md](../ideas/skill-tree.md).

## Which of his skills map to blueprint

blueprint's scope is designing, triggering implementation, and adjusting the design from what the implementation shows (D31). Read against that, seven of his skills map to it, five closely.

| His skill | Maps to | How close |
| --- | --- | --- |
| wayfinder | a workstream that settles its decisions before anything is built | close |
| to-spec | the workstream's requirements and design | close, in files instead of an issue |
| to-tickets | blueprint-plan: tasks with `blocked_by` and acceptance criteria | close |
| grill-with-docs | blueprint-discuss: decisions written down as they land | close |
| domain-modeling | blueprint's decisions and terms | close for decisions; the glossary half too |
| implement-spec | blueprint-work handing the next tasks to implementation | the hand-off only |
| setup-matt-pocock-skills | blueprint-setup | the setup pattern only |

What to learn from each when blueprint is improved (D30):

- **wayfinder:** name the destination first; the map is an index, not a store; "fog of war" for what is in scope but not yet sharp enough to be a question; the frontier of questions that can be decided now; question types (research, prototype, grilling, task) and who resolves them, the agent alone or with the person; one question per session; decisions, not deliverables.
- **to-spec:** once the discussion is done, synthesise without interviewing again; decide the testing seams in the design, as high as possible; user stories, exhaustive; no file paths, so the design stays true; out of scope said out loud.
- **to-tickets:** tracer-bullet slices through every layer, each fitting one context window; prefactoring first; expand and contract for a refactor too wide to slice; the person checks granularity and blocking edges before the tasks are written.
- **grill-with-docs:** the interview and the record run together, so nothing decided is lost between them.
- **domain-modeling:** offer a decision record only when the choice is hard to reverse, surprising without context, and the result of a real trade-off; challenge terms against the glossary and the code; create files only when there is something to write.
- **implement-spec:** the tasks as a graph with a frontier; one implementer per task in its own worktree, merged into an integration branch; one code review at the end; subagents briefed by pointers, not copies.
- **setup-matt-pocock-skills:** explore, recommend, confirm, then write; one question at a time; a short pointer block in `AGENTS.md`.

Not blueprint's, by D31:

- **Routines and other branches:** triage → routines; retro → agents (learn); handoff → agents.
- **Called by blueprint, living in other roots:** implement, tdd, code-review, pr, diagnosing-bugs, prototype (its result kept as a source the design points to), improve-codebase-architecture (its findings arrive as ideas).
- **Feeding blueprint from other branches:** research (its write-up stored in the research strand), to-questionnaire (its answers feed the discussion).

What blueprint has that his chain lacks is the way back. His spec is published once and his tickets close; nothing updates the spec from what the implementation found. blueprint keeps the design as the current truth, adjusts it from the implementation (work, sync) and consolidates each workstream into it, with every decision kept beside its reasons.

```text
his    grill-with-docs → (prototype) → to-spec → to-tickets → implement → retro
ours   frame → analyse → discuss and decide → design → plan → trigger the work → adjust the design → consolidate
```
