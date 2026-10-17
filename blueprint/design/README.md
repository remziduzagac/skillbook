# Design

How skillbook works, as decided. The initial design is open (D27): changes go straight into these files.

## Where to start

- [how-it-works.md](how-it-works.md): skillbook as a whole: its sets and groups, its kinds of skill, how skills are written, named and loaded.
- [skill-tree.md](skill-tree.md): the full tree of skills, by set, rendered from `tree/`.

## A folder per set

Each set has a folder holding its main skill's design and one design document per group or root, with a section per sub-skill answering the same questions: purpose, description, callers, flow, result, files, material, tests, open; a section's heading is the sub-skill's folder name (D80, D167).

- essentials:
  - [essentials/essentials.md](essentials/essentials.md): the main skill.
  - [essentials/conduct.md](essentials/conduct.md): how the agent behaves in every response.
  - [essentials/understand.md](essentials/understand.md): understanding before acting.
  - [essentials/organize.md](essentials/organize.md): arranging things with boundaries.
  - [essentials/coordinate.md](essentials/coordinate.md): working with agents not in this conversation.
  - [essentials/devise.md](essentials/devise.md): deciding what the work will be and its steps, routing to [essentials/design.md](essentials/design.md), how to design anything, and [essentials/plan.md](essentials/plan.md), planning multipart work and following the plan.
- blueprint:
  - [blueprint/blueprint.md](blueprint/blueprint.md): the spec-to-dev flow: its main skill, its recording steps and its document forms.
- softeng:
  - [softeng/design.md](softeng/design.md): softeng's own design and architecture.
  - [softeng/implement.md](softeng/implement.md), [softeng/test.md](softeng/test.md), [softeng/review.md](softeng/review.md), [softeng/ship.md](softeng/ship.md) and [softeng/maintain.md](softeng/maintain.md): its stages.
- authoring:
  - [authoring/authoring.md](authoring/authoring.md): writing work for people.

## Not here yet

The later sets, rigs, a knowledge base and routines, have no design yet; their skills wait as ideas in [../ideas/later.md](../ideas/later.md) (D64, D152, D167). The first design's part documents wait in [../notes/first-design/design/](../notes/first-design/design/README.md): the blueprint method, and greenrepo for maintain's repo skill.
