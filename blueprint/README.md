# skillbook blueprint

skillbook's own design, kept with its own blueprint method. skillbook is a public repository of the person's agent skills, used in every project and organised as sets of skills, each installed on its own. Status on 2026-10-11: the initial design is open (D27), and skillbook is being designed as a whole, from the top; no skill is built.

## Where to start

1. [roadmap.md](roadmap.md): where the design stands and what comes next.
2. [design/how-it-works.md](design/how-it-works.md): skillbook as a whole: its sets and roots, its kinds of skill, how skills are written, named and loaded.
3. [ideas/skill-tree.md](ideas/skill-tree.md): the tree of skills, still being shaped.

## The strands

- [roadmap.md](roadmap.md): the order of work.
- [ideas/](ideas/README.md): open questions and ideas not yet agreed, the tree among them.
- [notes/](notes/README.md): how the design was discussed, ideas gathered from earlier projects, and the first design, kept as material for the parts.
- `carryovers/`: where the work stands for the next session, one file per carryover named by the date and time it was written; resume from the newest.
- [research/](research/README.md): what was learned, and from where.
- [decisions.md](decisions.md): every decision with its reasons, D1 onward.
- [evidence.md](evidence.md): every claim that was checked, with its evidence, E1 onward.
- [requirements.md](requirements.md): what skillbook must do and be.
- [design/](design/README.md): how skillbook works.

## How things are recorded

- Requirements and design are the current truth; decisions say why. The initial design is open (D27): changes to requirements or design go straight into the root, without workstreams, until the person declares it settled.
- Building what the design describes changes neither, so it is planned as tasks.
- Decisions are append-only: a change is a new entry, and a note goes under each earlier entry it changes.
- Work goes top-down, from the goals to the tasks; corrections go back up to the level they belong to.
- Until the design skill is written, this blueprint follows the method in [notes/first-design/design/blueprint.md](notes/first-design/design/blueprint.md).

## Conventions

- **Provenance** of a claim in research: *read*, seen in a named source; *ran*, executed; *summary*, through a fetched page's summary; *memory*, unverified knowledge; *ours*, a value of our own with no source.
- **Markdown:** prose not wrapped; table rows, code lines and headings at most 120 characters; checked with markdownlint-cli2 and its table-width rule.
