# Carryover

Where the design work stands, for the next session to pick up without asking. Written 2026-10-17 at the end of the cost batch. Check it against "Written against" before acting on it.

## Done

- **The cost batch, D142–D151,** committed as `6e671c1` ("docs(blueprint): design the skills for lower token cost"):
  - the cost model, with the measured fork and start-up costs and this session's own figures ([../research/token-cost.md](../research/token-cost.md); [../evidence.md](../evidence.md), E10 and E11);
  - how delegate chooses: the type, then fork or fresh, then the model, then the effort, the last two chosen apart (D142–D144);
  - rightsize, a conduct skill for nothing missing and nothing extra for the reader (D145);
  - the report back, and references named in words (D146);
  - brief and carryover, with carryover replacing handoff (D147);
  - organizing while creating, with parts sized to how they're read (D148);
  - the cost sweep's fixes, plus a cost check in skillbook-tree (D149);
  - decisions others build on taking the strong tier and high effort, and challenge before suggesting (D150);
  - plan as the root for planning any work (D151).
- **Evidence:** markdownlint and the link checker passed on all files before the commit.

## Remaining, in order

1. **plan's full design** ([../design/plan.md](../design/plan.md)): its shape, whether it has parts, its tests. The person asked that **when a plan is needed** and **how deep it goes** be explained further than D151 does. They accepted D151's direction but found those two parts thin.
2. **lean and enrich,** rightsize's two parts, designed together with plan. The direction is agreed in [../ideas/open.md](../ideas/open.md), in the entry under "A lean skill". Once lean names this part, it comes off the glossary's avoid list.
3. **Then the open topics** in [../ideas/open.md](../ideas/open.md):
   - the person's software-engineering skills, where breakdown, slices and sequence are kept ([../ideas/plan.md](../ideas/plan.md));
   - engineering practice, now rightsize applied to code, for implement;
   - which tools a skill may require, such as git;
   - analysing aigorahub/elves, with its licence checked first.
4. **Building and testing the baseline,** per the roadmap: the main skill, conduct, understand and author's markdown, with the start-up measured.

## Decisions made

D142–D151, each in [../decisions.md](../decisions.md), with amended-by notes under the earlier decisions they change. Notes 79–88 in [initial-design.md](initial-design.md) tell how each was reached.

## Uncertain

- The worked fork-or-fresh figures assume 20,000 tokens read again and a 1,500-token brief. Only the start-up and the fork's cache read were measured.
- Whether a fresh agent loads skills from their descriptions inside a subagent is untested. D149 has the brief tell it not to load the main skill either way.
- Codex's reference file is unwritten: its models, effort levels, forks and limits are still unknown.

## How the person works

These aren't in the files, except as noted:

- **One item at a time, explained top-down,** with numbered questions under headings, each with a recommended answer. "ok" accepts them. Every turn ends with "Remaining: …".
- **No bare decision numbers or codes to the person:** words first, the number in brackets.
- **Prose is never wrapped.**
- **Lists over wide tables.**
- **Recording goes to a fork** after the person accepts an item: the design section, the decision with its notes, ideas, the tree (edit [../ideas/tree/tree.json](../ideas/tree/tree.json), render with `python3 blueprint/ideas/tree/render.py <out-dir>`, and paste the outputs into [../ideas/skill-tree.md](../ideas/skill-tree.md), as the script's header says), the roadmap and the session notes, then lint. The main agent checks the fork's work before reporting.
- **Commits come in batches,** with the message agreed first: lowercase Conventional Commits, no AI attribution (AGENTS.md).
- **Several of these are also in the agent's memory folder:** headings, lists over tables, prose not wrapped, commits in batches, skills stay generic.

## First next step

Read [../design/plan.md](../design/plan.md) and D151. Then put plan's full design to the person as one item: the signs for when a plan is needed, each explained with examples across writing, research, design and code; what each depth holds, with an example of each; and whether plan has parts. Ask with recommended answers.

## Written against

- **Date:** 2026-10-17.
- **Branch:** `main`, after `6e671c1`, in the commit that adds this note.
- **Uncommitted:** nothing. This note, its line in the notes README and the tree's data and renderer are in the commit after `6e671c1`.
