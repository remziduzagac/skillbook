# Blueprint example: worktree groups

A worked example for [blueprint.md](blueprint.md): one feature followed through every part of a blueprint, from the idea to its consolidation. It shows what the documents look like with real content, and how they hand work to each other.

The feature is real: herdsman's worktree groups, shipped on 2026-10-06. The research, the decisions and the shipped behaviour are taken from that work. The blueprint did not exist then, so the timeline is written as if it had, and two parts are illustrative: the sibling workstream RS and the staged review.

## The setting

- **herdsman** has a private blueprint in its own repository, cloned once at `.local/blueprint/` in the main checkout and linked into each worktree. It is not branched.
- **The initial design is settled** (D38). The root holds `requirements.md`, `design/sidebar.md`, `design/api.md` and the rest. The fork-code rule is an older root decision, recorded later as D12.
- **`synced_with: dev@2e6e888c`** in the root README.
- **Another workstream is active:** RS, row spacing (illustrative), which also changes `design/sidebar.md`.

## 1. The idea

The person wants their own worktrees kept apart from code-review worktrees within one repository. The agent records it, with the options raised in the same conversation.

`.local/blueprint/ideas.md`:

```markdown
## Sidebar

- Group a repository's worktrees under named headers that collapse; no folders, only groups. (2026-10-05)
- Rule-based groups, from name patterns in the config, as herdr discussion 4491 proposes. (2026-10-05)
- Groups headed by any workspace, as herdr discussion 4727 proposes. (2026-10-05)
```

## 2. A draft workstream

The idea needs research, decisions, requirement and design changes, and several tasks, and the initial design is settled, so it becomes a workstream. The agent proposes it, the person agrees, and the agent creates it with the key WG, as a `draft`. The discussion and research continue inside it.

`.local/blueprint/workstreams/worktree-groups/README.md`:

```markdown
---
status: draft
created: "2026-10-05"
---

# WG: Worktree groups

Named groups for a repository's linked worktrees: each group nests under its repository in the sidebar, with a
header that collapses.

- [notes.md](notes.md): how it was discussed.
- [research.md](research.md): what herdr and its users already asked for.
- [decisions.md](decisions.md): what was decided, and why.
```

## 3. Research

The person asks whether herdr already has requests for this. The agent searches herdr's issues and discussions.

`workstreams/worktree-groups/research.md`:

```markdown
---
status: current
created: "2026-10-05"
---

# Research: grouping in herdr

Whether herdr or its users already asked for grouping worktrees, and what herdr plans. Sources read on GitHub
on 2026-10-05.

## Summary

- **No open issue asks for it:** herdr takes feature requests as discussions and keeps issues for bugs (*read*).
- **Demand is real, but nothing is scheduled:** several discussions ask for grouping, and none has a reply from
  herdr's maintainers (*read*).
- **The popular requests are broader** than worktree groups: folders and hierarchies of workspaces (*read*).

## Requests

- **4491, rule-based workspace groups** (1 vote): the same need, solved with name rules in the config.
- **1953, user-created folders** (12 votes): folders assigned by right-click, collapsible; built in two forks.
- **1620, hierarchical space groups** (34 votes): parent and child trees, for agent supervisors.
- **4727, groups headed by any workspace.**
- **Issue 2229:** workspace numbers follow creation order while the sidebar shows grouped order.

## Gaps

- No word from herdr's maintainers on any of these.

## Sources

- github.com/herdrdev/herdr, discussions 4491, 1953, 1620, 4727; issue 2229 (2026-10-05).
```

## 4. Discussion and decisions

The agent takes the questions one at a time and records the session as it goes.

`workstreams/worktree-groups/notes.md`:

```markdown
# Notes: worktree groups

## Scope (2026-10-05)

- **Questions:** 1 how much change; 2 which kind of grouping; 3 how to keep merge conflicts with herdr low;
  4 how groups reach clients.
- 1, how much change: about 1,400 lines, mostly in new files; the person asked for the research first.
- **Research:** herdr's requests, in research.md.
- 2, which kind: manual named groups, for worktrees only, over rule-based and workspace-headed groups (WG-D1).
- 3, merge conflicts: logic in herdsman's own files, hooks in herdr's, per the fork-code rule (D12); groups
  saved beside the session, not in it (WG-D2).
- 4, reaching clients: a workspace token and a new method, since snapshot fields are frozen (WG-D3).
- **Open:** none. Next: requirements and design changes.
```

`workstreams/worktree-groups/decisions.md`:

```markdown
# Decisions: worktree groups

## WG-D1: Manual named groups, for worktrees only (2026-10-05)

**Decision:** A repository's linked worktrees can be put into named groups by hand, from a worktree's
right-click menu or the CLI. Groups apply only to linked worktrees, nest under their repository, and collapse
from their header.

**Why:** The need is keeping the person's own worktrees apart from review worktrees within one repository.
herdr has nothing scheduled, and its broader requests may arrive later (research.md); a small, contained
feature is cheap to retire then.

**Cost:** A second grouping mechanism to retire if herdr ships folders.

**Not chosen:** rule-based groups, because worktree names do not always follow a pattern; groups headed by any
workspace, because that changes herdr's tree for every workspace (ideas.md § Sidebar).

## WG-D2: Groups are kept by checkout path, beside the session (2026-10-05)

**Decision:** Groups are saved in `worktree-groups.json` beside the session file, keyed by the worktree's
checkout path, so a worktree keeps its group when its workspace closes and opens again.

**Why:** herdr's session format stays untouched (D12), and a checkout path outlives a workspace.

**Not chosen:** a field on herdr's workspace record, because it would change herdr's session format.

## WG-D3: Groups reach clients as a workspace token and a new method (2026-10-05)

**Decision:** A group's members carry its name as the `worktree_group` workspace token. A new advertised
method, `workspace.set_worktree_group`, puts a worktree into a group or takes it out. No snapshot field changes.

**Why:** The client snapshot is also part of a frozen binary codec, so it cannot gain fields; tokens and new
methods keep older clients working.

**Verify:** the frozen endpoint fixtures still pass, and an older client attached to a newer server loads the
snapshot.
```

The root's ideas get their outcomes:

```markdown
- Group a repository's worktrees under named headers that collapse; no folders, only groups. (2026-10-05)
  Taken up in (WG).
- Rule-based groups, from name patterns in the config, as herdr discussion 4491 proposes. (2026-10-05)
  Not chosen (WG-D1).
- Groups headed by any workspace, as herdr discussion 4727 proposes. (2026-10-05) Not chosen (WG-D1).
```

## 5. Requirements and design changes

With the decisions made, the agent writes what changes in the root's requirements and design, as changes held in the workstream. The root's files stay as they are.

`workstreams/worktree-groups/requirements.md`:

```markdown
# Requirements

## Goals

- A repository's linked worktrees can be sorted into named groups, each under a header that collapses (WG-D1).
- A worktree keeps its group across closing and reopening its workspace (WG-D2).

## Non-goals

- Grouping workspaces that are not linked worktrees.
- Folders or hierarchies of workspaces.

## Builds on

- requirements.md § Endpoint compatibility
- design/sidebar.md § Agent state

## Acceptance criteria

- Grouping from the right-click menu and from `herdsman workspace group` gives the same result.
- A collapsed group still shows its focused worktree, and its header shows the group's most urgent agent state.
- The frozen endpoint fixtures pass unchanged.

## Changes

### ADDED requirements.md § Worktree groups

A repository's linked worktrees can be put into named groups, from a worktree's right-click menu or the CLI.
Each group nests under its repository with a header that collapses; a worktree keeps its group when its
workspace closes and opens again (WG-D1, WG-D2).
```

`workstreams/worktree-groups/design.md`:

```markdown
# Design changes

## MODIFIED design/sidebar.md § Repository tree

A repository's row holds its linked worktrees. Named groups come first, each under a header row with its
worktrees nested below; ungrouped worktrees come last. Clicking a header collapses or expands the group
(WG-D1). Groups are kept by checkout path in `worktree-groups.json`, beside the session (WG-D2).

Previously: A repository's row holds its linked worktrees, in the order they were opened.

## ADDED design/api.md § Worktree groups

`workspace.set_worktree_group` puts a linked worktree's workspace into a named group, or takes it out when the
name is empty. Members report the name as the `worktree_group` token (WG-D3). The logic lives in herdsman's
`worktree_groups` modules, reached from herdr's files through hooks marked `// fork: worktree groups` (D12).
```

The person accepts the workstream. The agent sets `status: active`, records `branch: worktree-groups` (a worktree at `~/Projects/worktrees/herdsman/worktree-groups`), and adds the step to the root's roadmap:

```markdown
- [ ] **[Worktree groups](workstreams/worktree-groups/README.md)** (WG): named, collapsible groups of a
  repository's worktrees.
```

## 6. Tasks

Only now is the work split into tasks:

```text
workstreams/worktree-groups/tasks/
  README.md                   open tasks are the files here; finished ones are in archive/
  store-groups.md             WG-T1: keep groups by checkout path
  api-and-cli.md              WG-T2: the method and `herdsman workspace group`
  sidebar-headers.md          WG-T3: draw headers, collapse on click
  context-menu.md             WG-T4: "Worktree group..." on a worktree's row
  user-docs.md                WG-T5: the docs site and the agent skill
```

`tasks/sidebar-headers.md`, as the agent picks it up:

```markdown
---
status: doing
assignee: claude
blocked_by: [WG-T1]
created: "2026-10-05"
---

# WG-T3: Draw group headers

Show each named group under its repository, with a header that collapses on a click.

## Description

In the sidebar's repository tree, draw a header row for each named group, its worktrees nested below, groups
first and ungrouped worktrees last. A click on the header collapses or expands the group.

## Acceptance criteria

- Groups appear in the order above, and a click toggles a group.
- Tests in herdsman's own test file cover ordering and collapsing.

## Out of scope

- Renaming a group in one step; the right-click menu (WG-T4).

## Approach

- A new `sidebar/worktree_groups.rs`, reached from herdr's `sidebar.rs` by one hook (D12).

## References

- Delivers: design/sidebar.md § Repository tree.
- Rests on: (WG-D1), (WG-D2).

## Log
```

## 7. Doing the work

While coding WG-T3, a question comes up that the design does not answer: what does a collapsed group show when one of its worktrees is focused? The agent stops and asks. The person decides, and the agent records it:

```markdown
## WG-D4: A collapsed group still shows its focused worktree (2026-10-06)

**Decision:** A collapsed group still shows the worktree that has focus, and its header shows the group's most
urgent agent state.

**Why:** Collapsing must never hide where the person is working, or an agent that needs attention.
```

It updates the workstream's design change for § Repository tree to say so (never the root's), and keeps the log:

```markdown
## Log

- 2026-10-06: the header uses the same agent-state icon as workspace rows (design/sidebar.md § Agent state).
- 2026-10-06: collapsed groups keep the focused worktree visible (WG-D4); screenshot in
  attachments/collapsed.png.
```

`workstreams/worktree-groups/attachments/README.md`:

```markdown
# Attachments

Files the documents here use. Only this index is in git; the files stay on the machine that made them.

- **[collapsed.png](collapsed.png)** (image, 48 KB, 2026-10-06): a repository with two groups, one collapsed
  with its focused worktree still showing. Read it to check the header and the collapsed state.
```

WG-T3 passes its tests, so the agent sets `status: review` and tells the person, who accepts it. The task becomes `done` and moves to `tasks/archive/`.

## 8. A staged review (illustrative)

With the code ready, the person asks two agents to review it at once, from different angles, in staged mode. Each writes only to its own pending file.

`workstreams/worktree-groups/pending/reviewer-ux.md`:

```markdown
# Pending: reviewer-ux, worktree groups (2026-10-06)

## Notes

- Ordering, collapsing and the menu work as designed.

## Decisions

- WG-D?1: A group's members stay next to each other in workspace order, so `prefix+1..9` follows the sidebar.
  Why: grouping makes herdr issue 2229 more visible.

## Tasks

- WG-T?1: Keep a group's members adjacent in workspace order. Rests on WG-D?1.
```

`pending/reviewer-compat.md` reports that the frozen endpoint fixtures pass unchanged.

The main agent applies them, oldest first:

- WG-D?1 becomes WG-D5, and WG-T?1 becomes WG-T6, with its reference updated.
- The compatibility result becomes a note under WG-D3: `> **Verified (2026-10-06):** the frozen endpoint fixtures pass unchanged.`
- Both review notes go into `notes.md`, and the pending files are deleted.

## 9. The parent changes underneath (illustrative)

Meanwhile RS, the row spacing workstream, is consolidated into the root. It modified `design/sidebar.md § Repository tree` too. While consolidating RS, the agent finds that WG changes the same section, and adds a note under WG's entry:

```markdown
## MODIFIED design/sidebar.md § Repository tree

> **Parent changed by RS (2026-10-06):** rows are packed with no blank line between them unless `row_gap`
> says otherwise.
```

The agent working on WG sees the note at once. Nothing in WG depends on the spacing, so it carries on.

## 10. Completion, forced

WG-T1 to WG-T5 are done. WG-T6, from the review, is not started, and the person wants worktree groups released now. They force completion. The agent lists what is open, and the person decides:

| Open item | Decision |
| --- | --- |
| WG-T6, keep members adjacent | carry up to the root's tasks, as T9 |
| WG-D5, its decision | stays in WG; T9 rests on it |
| Idea: rename a group in one step | carry up to the root's ideas |

The agent sets `status: complete`. The code branch is merged into `dev`.

## 11. Consolidation

At the start of the next session, the agent finds WG with `status: complete` and raises it first. The person says to consolidate.

1. **Reconcile.** For § Repository tree, the root's text no longer matches WG's "Previously:" line, and the "Parent changed by RS" note says why. The agent proposes text with both: groups as WG wrote them, rows packed as RS wrote them. The person approves. The new § Worktree groups requirement and the new § Worktree groups section in `design/api.md` apply as written.
2. **Apply.** The changes go into the root's `requirements.md`, `design/sidebar.md` and `design/api.md`. They are now the current truth.
3. **Carry up.** "Rename a group in one step" goes to the root's ideas, and T9 to the root's tasks.
4. **Attachments.** The agent suggests one choice:

   | File | Suggested | Why |
   | --- | --- | --- |
   | collapsed.png | move to the root's attachments | the consolidated sidebar text links to it |

   The person agrees. The agent moves the file and its index entry, and updates the link.
5. **Record.** The Outcome is written, the banner is added, and the status becomes `consolidated`:

   ```markdown
   # WG: Worktree groups

   > Consolidated into its parent on 2026-10-06.

   ## Outcome

   Shipped as designed, with one addition from the work itself: a collapsed group keeps its focused worktree
   visible (WG-D4). Forced: WG-T6 carried up as T9, and one idea to the root's ideas. collapsed.png moved to
   the root's attachments.
   ```

   The root's roadmap item is ticked and relinked to the archive, and the root's notes get a line.
6. **Archive.** The folder moves to `workstreams/archive/worktree-groups/`. (WG-D3) and (WG-T3) still resolve there.
7. **Review.** A fresh agent runs the health check and reviews the root: every change landed once; the combined § Repository tree reads as one text; the decisions cited exist; the code matches. It finds one link to `workstreams/worktree-groups/` that the move missed, fixes it, and adds its findings to the root's notes:

   ```markdown
   - 2026-10-06: WG consolidated (worktree groups). Review: one stale link fixed; T9 and one idea carried up.
   ```

8. **Commit.** The person approves, and the blueprint commits it all at once.

## 12. Sync

The blueprint has its own repository, so the code's merge into `dev` and the consolidation are separate commits in separate repositories. The next sync pass reads the commits since `dev@2e6e888c`. They all belong to WG, which is consolidated, so nothing needs writing back, and `synced_with` moves to the new `dev` commit.

## Where everything ended up

```text
.local/blueprint/
  README.md                       synced_with moved forward
  roadmap.md                      Worktree groups ticked, linked to the archive
  ideas.md                        outcomes added; "rename a group in one step" carried up
  notes.md                        one line on the consolidation and its review
  requirements.md                 § Worktree groups added
  design/
    sidebar.md                    § Repository tree: groups and row spacing together
    api.md                        § Worktree groups added
  tasks/
    keep-group-members-adjacent.md   T9, carried up from WG
  attachments/
    README.md                     collapsed.png's entry
    collapsed.png
  workstreams/
    archive/
      worktree-groups/            WG as history: its notes, research, decisions, tasks, Outcome
```

## What the example tested

Writing it out raised two points for the spec:

- **An idea taken up as a workstream** needs its own outcome wording, "Taken up in (WG)", besides "Chosen" and "Not chosen".
- **Discussion can start before the workstream exists.** Here the agent created a `draft` workstream as soon as the idea clearly needed one, so the discussion, research and decisions lived in it from the start. The spec should say that `draft` is also where a workstream's own discussion happens.
