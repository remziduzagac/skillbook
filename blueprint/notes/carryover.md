# Carryover

Where the design work stands, for the next session to pick up without asking. Written 2026-10-17 at the end of the cost batch, updated the same day after the sets item, after plan's full design and after lean and enrich. Check it against "Written against" before acting on it.

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
- **The sets, D152–D154,** committed as `3dcb46b` ("docs(blueprint): split skillbook into sets installed separately"):
  - skillbook becomes sets installed on their own, each working alone, with its own main skill named after it; a reference to another set goes through that set's main skill, with a short fallback where it is not installed (D152);
  - the core set is named essentials, with the rejected names and why (D153);
  - what each set holds: essentials (main skill, conduct, understand, design, plan, an output-format skill to design), blueprint (the spec-to-dev flow and its records), softeng (its own design, plan's software parts, implement, test, review, ship, maintain), authoring (author renamed; markdown stays here); rigs a later set; the lifecycle no longer general (D154);
  - the main skill's design and ideas files renamed `essentials.md`, author's renamed `authoring.md`; each root's design file names its set; the tree marks each root's set.
- **plan and the sets' contract, D155–D156,** committed as `adea789` ("docs(blueprint): design plan in full and how sets complement each other"):
  - plan's full design: making a plan and following one; three checks, whether the work is multipart, whether the steps are given, one line or a full plan; the obvious test for what to expand and how deep to go; following as a checklist at about three steps; approval when stakes are high, asked for, or a question is in it; kept in the response or a file; no parts; the main skill routes to it (D155; [../design/plan.md](../design/plan.md));
  - sets complement each other: a project's pointer loads blueprint; each part of a piece of work has one owner, the caller, the doer and the keeper, each saying only its own part; a caller's one-line fallback and a doer's one-line default, written down; a default gives way to a loaded instruction for the same case, only as a safety net (D156).
- **lean and enrich, D157,** recorded but not yet committed: rightsize's two sub-skills for what already exists, lean removing what is extra and enrich adding what is missing, each with its steps; used on request or proposed when noticed; one approval of the list of changes where the person's or others' work changes; code proposed and changed under tests; instruct's prune step and skillbook-tree's cost check call lean; "lean" off the glossary's avoid list (D157; [../design/conduct.md](../design/conduct.md)).

## Remaining, in order

1. **essentials' output-format skill,** before the baseline is built: generic layout rules, in respond or beside it, and how it divides the work with authoring's markdown, by the contract between sets (D154, D156; [../ideas/open.md](../ideas/open.md)).
2. **Then the open topics** in [../ideas/open.md](../ideas/open.md):
   - the person's software-engineering skills, where breakdown, slices and sequence are kept ([../ideas/plan.md](../ideas/plan.md));
   - engineering practice, now rightsize applied to code, for implement;
   - which tools a skill may require, such as git;
   - analysing aigorahub/elves, with its licence checked first;
   - each skill's default where no keeper is loaded: learn's destinations, clarify's recording, brainstorm's result; how it works is settled (D156);
   - later: the install routes and the folder layout, with a test that skills.sh copies nested folders whole, and the naming rule where there is no namespace.
3. **Building and testing the baseline,** per the roadmap: essentials' main skill, conduct, understand and the output-format skill, with the start-up measured.

## Decisions made

D142–D157, each in [../decisions.md](../decisions.md), with amended-by notes under the earlier decisions they change. Notes 79–94 in [initial-design.md](initial-design.md) tell how each was reached.

## Uncertain

- The worked fork-or-fresh figures assume 20,000 tokens read again and a 1,500-token brief. Only the start-up and the fork's cache read were measured.
- Whether a fresh agent loads skills from their descriptions inside a subagent is untested. D149 has the brief tell it not to load the main skill either way.
- Codex's reference file is unwritten: its models, effort levels, forks and limits are still unknown.
- Calling another set's main skill and then its hidden skill was tested only in halves: a listed skill called by name across packages, and a hidden skill read by its path inside its own.
- Two skills in context complementing each other, a doer in one set and a keeper in another, each saying only its own part, is untested (D156).

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

Read the entry on essentials' output-format skill in [../ideas/open.md](../ideas/open.md), respond in [../design/conduct.md](../design/conduct.md) and authoring's markdown in [../design/authoring.md](../design/authoring.md). Then put the output-format skill to the person as one item: what generic layout rules it holds, whether it sits in respond or beside it, and how it divides the work with authoring's markdown by the contract between sets (caller, doer, keeper). Ask with recommended answers.

## Written against

- **Date:** 2026-10-17.
- **Branch:** `main`, after `adea789`.
- **Uncommitted:** lean and enrich, D157, and this update, across the blueprint, the glossary and the project skill skillbook-tree.
