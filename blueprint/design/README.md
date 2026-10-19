# Design

How skillbook works, as decided. The initial design is open (D27): changes go straight into these files.

## Where to start

- [how-it-works.md](how-it-works.md): skillbook as a whole: its sets and groups, its kinds of skill and how they are loaded; how a skill is placed, named, designed and reviewed is the project skill skillbook-tree's.
- [skill-tree.md](skill-tree.md): the full tree of skills, by set, rendered from `tree/`.
- [testing.md](testing.md): how skillbook is tested: static checks, install tests and AI tests, and what runs where.

## A folder per set

Each set has a folder holding its main skill's design and one design document per group or root, with a section per sub-skill answering the same questions: purpose, description, callers, flow, result, files, material, tests, open; a section's heading is the last word of the sub-skill's name, its path (D80, D167).

- [essentials/README.md](essentials/README.md): essentials, what any work needs, the set every other set builds on.
- [blueprint/README.md](blueprint/README.md): blueprint, the spec-to-dev flow and its records.
- [softeng/README.md](softeng/README.md): softeng, how good software is designed and made.
- [authoring/README.md](authoring/README.md): authoring, writing work for people.

## Not here yet

The later sets, rigs, a knowledge base and routines, have no design yet; their skills wait as ideas in [../ideas/later.md](../ideas/later.md) (D64, D152, D167). The first design's part documents wait in [../notes/first-design/design/](../notes/first-design/design/README.md): the blueprint method, and greenrepo for maintain's repo skill.
