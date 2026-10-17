# Blueprint

Draft v3, 2026-10-07 to 2026-10-10, agreed in the design discussion recorded in [../notes/initial-design.md](../../initial-design.md). Built from that discussion, the research in [../research/design-documentation-approaches/](../../../research/design-documentation-approaches/README.md) and trailscout's design docs, an earlier project's working example. [blueprint-example.md](blueprint-example.md) follows one feature through every part of it.

## What this is

A blueprint is a folder of markdown documents that holds a project's thinking: its ideas, the discussions, the research, the decisions and their reasons, what the project must do, how it works, and the work planned to get there. It sits beside the code and is written before and alongside it.

It exists because that thinking otherwise lives in chat histories and in one person's head. There it is lost between sessions, every AI agent starts without it, and design and code drift apart unnoticed. A blueprint gives every session, human or agent, the same starting point.

It is built for a developer working with AI agents, and stays readable for collaborators who join later. It is plain markdown, read in an editor or on GitHub; nothing special is needed to read it.

It is not:

- the user documentation, which lives in the project's `docs/` and is written for users;
- an issue tracker, though its tasks can be mirrored to one;
- a description of the code: it says what the system does and why, and names modules, but never repeats code.

### Principles

- **Current truth and history are kept apart.** Requirements and design always describe the project as agreed now. Everything else (ideas, notes, research, decisions, finished work) is history, kept so that the reasons behind the truth are never lost.
- **Top-down.** Work starts from the general problem and goes down: the idea and its goals, the requirements, the design as a whole, then its parts, workstreams and finally tasks. Work flows down; corrections found lower down go back up to the level they belong to. See [Working top-down](#working-top-down).
- **Two-way sync.** The blueprint and the code are kept in step in both directions: planned work flows from the blueprint into the code, and whatever the code changes that the blueprint describes is written back. See [Two-way sync](#two-way-sync).
- **Work is split into workstreams, and consolidated back.** A workstream is a contained part of the work; when it is complete, its changes are consolidated into its parent. See [Working with workstreams](#working-with-workstreams) and [Consolidation](#consolidation).
- **One home per fact.** Each fact is written in one place, and everything else links to it.
- **Start small.** A document starts as a file and becomes a folder only when it grows.
- **The person decides; the agent keeps the records.** See [Roles](#roles).

## The strands

A strand is one kind of document. Each answers one question:

| Strand | Answers |
| --- | --- |
| ideas | What could we do? |
| notes | What did we discuss? |
| carryovers | Where does the work stand, to pick it up? |
| research | What did we learn, and from where? |
| decisions | What did we agree, and why? |
| requirements | What must the project do and be? |
| design | How does it work? |
| roadmap | In what order is the work done? |
| tasks | What exactly needs doing? |
| workstreams | Which part of the work does this belong to? |

### ideas

Proposals and options: things that could be done, and the alternatives weighed against them. Grouped by topic, each with the date it came up. An idea stays until it is settled; then its outcome is added: chosen or not chosen, with the decision's ID, or taken up in a workstream, with its key. Nothing in ideas is agreed.

### notes

The record of each discussion: what was asked, what was offered, what was agreed, in the order it happened, under a dated heading per session. Notes are only ever added to. They make long design work resumable: an agent reading them knows where a topic stands and how it got there.

Ideas and notes differ in direction. An idea is a proposal waiting for an answer; a note records a conversation that happened. An idea raised in a discussion appears in both: the proposal in ideas, and what was said about it in notes.

### research

What was learned from outside: documentation, source code, issues, papers, experiments. One document per topic, with a summary first and every claim marked with how it was obtained (its provenance). Research informs decisions but decides nothing.

### decisions

What was agreed, and why. Each decision is a short numbered entry with its reasons: D1, D2, … at the root, and WG-D1, WG-D2, … in a workstream with the key WG. It is written once agreed and never rewritten: a later change is a new decision, with a dated note under the old one. That note is what lets a reader trust an old entry: it says whether the entry still holds.

### requirements

What the project must do and be: goals, non-goals, capabilities, quality goals and constraints. Current truth: it always says what is agreed now, and each point names the decisions behind it.

### design

How the project works: its concepts, its parts and how they fit, and why it is built that way. Current truth, like requirements. It names modules but never repeats code, and leaves facts users see to the user documentation. Two design files are common: `terms.md`, the vocabulary, and `how-it-works.md`, a walkthrough of the whole system.

### roadmap

The order of work: the steps, grouped in phases if the project has them, each linked to its workstream when it has one, and a Later list of agreed items not yet scheduled.

### tasks

Units of work small enough to finish in one go, each saying what to do, how to know it is done, and how it relates to other tasks. One file per task. See [Working with tasks](#working-with-tasks).

### workstreams

Contained parts of the work, each part of its parent: the blueprint, or another workstream. Once the initial design is settled, changes to the project are made through workstreams: a feature, a redesign, a migration. Workstreams also split work so that several agents can work in parallel. A workstream has the same strands as the blueprint, its own workstreams included, and when it is complete it is consolidated into its parent. See [Working with workstreams](#working-with-workstreams).

### How they work together

1. An idea is written in ideas.
2. It is discussed, and the session is recorded in notes.
3. If the discussion needs evidence, research is done and written up.
4. When agreed, the outcome is recorded as a decision, and the idea gets its outcome.
5. The decision is applied to requirements and design: directly during the initial design, or, inside a workstream, as changes that wait until the workstream is consolidated.
6. The work is planned: a step on the roadmap, a workstream for it, tasks for the doing.
7. When the work is complete, the workstream is consolidated into its parent; at the top, its changes become the current truth.

## Working top-down

A blueprint grows from the top. Each level is settled, at least in outline, before the one below it starts:

1. **The problem and the idea**, in ideas, as first written.
2. **The goals**, non-goals and constraints, in requirements, once agreed.
3. **The design as a whole**, in `how-it-works.md`: the big picture, before any part is designed in detail.
4. **The parts**, one design file each, then their sub-parts as detail arrives.
5. **The steps**, on the roadmap, general topics first.
6. **Workstreams** for the steps, each with its goals and design changes before its tasks; a part big enough gets a sub-workstream.
7. **Tasks**, last: the doing.

Steps 1 to 4 are the **initial design**, written directly in the root. The person says when it is settled; that is recorded as a decision and shown in the roadmap's status line. From then on, every change to requirements or design goes through a workstream. Until then there are no workstreams: changes go straight into the root. While nothing depends on the design yet, the person may reopen it, recorded as a decision and shown in the status line in the same way, and changes go straight into the root again.

- **Discussion follows the same order:** the general questions first. trailscout settled its foundations (the goal, documents, the graph) before scoring, and scoring before results.
- **Every lower document points up** to what it serves: a task to the requirement and design sections it delivers, a design part to the decisions behind it, a workstream to its roadmap step.
- **Corrections go up, then down again.** When work lower down finds that something above is wrong or missing, it is not patched where it was found. The question goes up to the level it belongs to, is decided there, and flows down again.
- **Files first is top-down too:** a document starts general, in one file, and splits into specific files as detail arrives.

Why: decisions made at the top constrain everything below them. Settling them first means the details are worked out once, inside a frame that already holds.

## Starting from an existing project

A project that already has code or documents does not start from a blank page. What exists is used and converted, and once converted, the blueprint's root is the base of truth. The order is still top-down; each level describes what is already there.

- **Describing what exists is not a change.** It goes straight into the root, without a workstream, like a sync pass. Only planned changes go through workstreams.
- **Code without a blueprint**, such as herdsman:
  1. requirements: the goals and constraints, drafted from what the project already says about itself (its README, `AGENTS.md`, the user docs) and corrected by the person;
  2. `how-it-works.md`: the whole system, from the code's structure, its main parts and how they connect;
  3. design files only for the areas about to be worked on; the rest are written when a workstream first touches them;
  4. decisions: no history is backfilled, only the big choices that explain today's code, each marked "recorded later";
  5. `synced_with` set to the current commit, and the initial design declared settled.
- **Documents in another layout**, such as trailscout's: a one-off conversion by an agent, in one commit, followed by a health check. Each document moves to the strand it belongs to, number prefixes go, READMEs take over the order, and links are rewritten. Discussion notes become notes, goals and constraints become requirements, a glossary becomes `design/terms.md`, an overview becomes `design/how-it-works.md`.
- The skill holds the step-by-step procedures.

## Layout

### A new blueprint

```text
blueprint/
  README.md            what this is, and the map
  roadmap.md           the order of work
  ideas.md             ideas and alternatives
  requirements.md      what the project must do and be
  design.md            how it does it
```

The other strands appear when they first have content: `notes.md`, `research.md`, `decisions.md`, `tasks/` and `workstreams/`; `carryovers/` when the first carryover is written, one file each, named by the date and time it was written; `attachments/` when a document first needs a file that is not markdown; `pending/` when agents first work in staged mode.

### A grown blueprint

```text
blueprint/
  README.md
  roadmap.md
  ideas.md
  notes.md
  research/
    README.md
    prior-art.md
    application/                  a write-up that gained full reports
      README.md
      write-up.md
      runtime.md
  decisions/
    README.md
    foundations.md
    scoring.md
  requirements.md
  design/
    README.md
    terms.md
    how-it-works.md
    model.md
    interfaces/
      README.md
      protocol.md
      sdk.md
  tasks/                          small work not worth a workstream
    README.md                     what the folder holds; the files are the list
    update-ci-comments.md
    archive/
  attachments/                    files the root's documents use; only the index is in git
    README.md                     the index: what each file is, and when to read it
    escape.mjs
  workstreams/
    README.md                     what the folder holds; the roadmap gives the order
    worktree-groups/              WG, a small active workstream
      README.md
      requirements.md
      design.md
      tasks/
        README.md
        store-groups.md
        draw-group-headers.md
      attachments/
        README.md
        collapsed.png
    mcp-server/                   MCP, a grown one
      README.md
      roadmap.md                  the order of its sub-workstreams
      ideas.md
      notes.md
      research.md
      decisions.md
      requirements.md
      design/                     mirrors its parent's design tree
        interfaces/
          protocol.md
      tasks/
      pending/                    agents' staged updates, waiting to be applied
        reviewer-security.md
        reviewer-api.md
      workstreams/
        README.md
        sdk/                      SDK, a sub-workstream
    archive/
      foundations/                consolidated workstreams, kept for reference
```

## Where the blueprint lives

The blueprint is a folder, and where it lives is the owner's choice:

- **In the project's repository**, committed with the code. The simplest, and as public as the code.
- **In its own repository**, cloned or symlinked into the project and ignored there. This keeps it private while the code is public, or shares it with only some people. Ignore it in `.git/info/exclude`, so the public repository never mentions it. Not as a git submodule: a submodule breaks clones for anyone without access.

The default place is `.local/blueprint/` for a private blueprint, an ignored folder, and `blueprint/` for a public one. A blueprint can start private and be published later; nothing in its structure changes.

### How agents find it

- **A private blueprint** is never mentioned in the project. The pointer lives in the person's user-level agent instructions, kept in their dotfiles, with the same lines for every agent they use (for example `~/.claude/CLAUDE.md` for Claude Code, `~/.codex/AGENTS.md` for Codex):

  ```markdown
  ## Blueprints

  A project may have a blueprint, a folder of design documents at `blueprint/` or `.local/blueprint/`. When
  one is present, load the blueprint skill before planning or changing anything, and follow it.
  ```

- **A public blueprint** is pointed to from the project's `AGENTS.md`, so any contributor's agent finds it:

  ```markdown
  ## Blueprint

  This project's design lives in `blueprint/`: what it must do, how it works, the decisions behind it, and the
  work in progress. Before planning or changing anything, read its README and roadmap. A change that alters
  what the blueprint describes updates it in the same piece of work.
  ```

- A contributor's agent may not have the skill, so a public blueprint's root README ("How things are recorded") must be enough to work correctly at a basic level. The skill adds the full procedures.

### Publishing a private blueprint

- **Publishing is a one-time switch.** There is only ever one blueprint: once published, the public one is the blueprint, and the private copy is retired, never kept as a second version. Everything written after that is public.
- **What is private is the person's call.** Documents are written naturally, not trimmed in advance for a public audience. Before publishing, the person decides what must not be published and tells the agent; the agent can search for likely candidates (names, email addresses, personal paths, private links, secrets) when asked.
- **The agent removes it everywhere it would be published:** from the documents, and from the git history too when the history is published with them. Rewriting history is irreversible for anyone who has the old history, so the agent keeps a backup of the old history and confirms with the person before any force-push.
- **Attachments are never published**; they are not in git.

## Roles

The person decides; the agent keeps the records.

**The person** brings ideas, discusses them, agrees decisions, accepts and splits workstreams, sets priorities, says which mode agents work in, and approves completing and consolidating work.

**The agent** orchestrates everything else:

- records each discussion in notes as it happens, and each decision once agreed;
- creates documents from the templates, assigns IDs, and keeps links current;
- applies decisions to requirements and design, and consolidates workstreams into their parents;
- applies other agents' staged updates;
- moves consolidated work to the archive and ticks the roadmap;
- keeps external tools in step through its own connections: opens and updates issues in GitHub, Linear or Jira, and records their links in the task;
- checks its own work before each commit, and runs a health check when asked.

The blueprint is the source of truth, and external trackers mirror it. When the agent finds a tracker changed elsewhere (an issue closed, a comment added), it reports the difference and updates the task. It asks before doing anything other people can see, such as opening or closing a public issue, unless the person has said otherwise for the project.

Why an agent: keeping many small documents consistent is exactly the bookkeeping people skip. With the agent doing it, the structure costs the person almost nothing. How the agent does it, step by step, is in [The agent at work](#the-agent-at-work).

## Working with workstreams

A workstream is a contained part of the work that belongs to its parent: the blueprint, or another workstream. Once the initial design is settled, every change to requirements or design is made through one. Workstreams also split work into parts that can go ahead on their own, so several agents can work in parallel, one per workstream. Every level works the same way: a workstream proposes changes to its parent and, when complete, is consolidated into it.

- **When to start one:** for any change to requirements or design after the initial design, and for work too big for one task. Work that changes neither (a fix, a chore) is a task. It is created as a `draft` as soon as an idea clearly needs one, so its discussion, research and decisions live in it from the start; the idea in the parent gets the outcome "Taken up in (WG)".
- **Splitting work.** The main agent and the person split work at the parent's level, into parts that each have their own goal, touch their own sections of requirements and design, and can be reviewed on their own.
  - Work that needs another workstream's changes before they are consolidated goes inside that workstream as a sub-workstream, or waits.
  - Something that must land sooner is split out as its own workstream: a workstream is consolidated whole, never in pieces.
- **Its key.** Each workstream gets a short key when it is created: 2 to 5 capital letters or digits, such as `WG` for worktree groups. The key is the workstream's ID (`# WG: Worktree groups`) and the prefix of every ID inside it: WG-D1, WG-T1. Keys are unique across the blueprint, so IDs never collide, even when workstreams run in parallel or on different branches.
- **Isolation.** A workstream writes only inside its own folder until it is consolidated. Its parent's files are read-only to it.
- **Contents:** the same strands as the blueprint, created as needed. Most have a `README.md` (what it is, its status), `requirements.md` (its goals, what it builds on, its acceptance criteria and its changes to the parent's requirements), `design.md` (its changes to the parent's design) and `tasks/`.
- **Changes, not copies.** A workstream's requirements and design hold changes to its parent's, named by path and section: ADDED, MODIFIED (with the full new text, and the parent's text as it was in a "Previously:" line) or REMOVED (with the reason). Why: the parent stays intact while the work is in progress, a change named by section can be reviewed and consolidated exactly, and "Previously:" shows at consolidation whether the parent changed since.
- **Builds on.** Its requirements also list the parent sections it relies on without changing them. With its change entries, that tells the consolidation of any other workstream when this one is affected.
- **What it sees:** its parent's requirements and design, with the parent's own changes applied. At the top, that is the root's.
- **Statuses:** `draft` while being written, which includes its own discussion, research and decisions; `active` once agreed; `complete` when the work is finished and waits for consolidation; `consolidated` once consolidated. It can also end as `dropped` or `superseded`.
- **Where they sit:** a sub-workstream lives in its parent's `workstreams/`, so the folder says who the parent is. Active and complete workstreams sit directly in `workstreams/`; consolidated, dropped and superseded ones move to `workstreams/archive/`, kept for reference. Their IDs still resolve there.
- **Decisions** made in a workstream live in it, numbered with its key. The root's decision map lists every decision in the blueprint.

## Consolidation

Consolidation is how a complete workstream's changes become part of its parent. It is the blueprint's own merge, separate from a git merge; [Workstreams and git](#workstreams-and-git) says how the two line up.

### When a workstream is complete

- Every task is done or dropped, every sub-workstream is consolidated or dropped, its acceptance criteria are met, and its code, if any, has landed. The agent then sets `status: complete`.
- **The person can force completion.** The agent lists what is still open: tasks, sub-workstreams, decisions waiting for verification, unsettled ideas. For each, the person decides: carry it up to the parent (as a task or an idea), move it to another workstream, or drop it with a reason. The Outcome records what was forced and where each item went.

### Staying aware of the parent

When a workstream is consolidated, the agent looks for active workstreams under the same parent that change or build on the same sections, and adds a dated note under each affected entry:

```markdown
### MODIFIED design/sidebar.md § Group headers

> **Parent changed by ST (2026-10-09):** headers now show the agent count.
```

The agent finds these overlaps by searching the change headings, since every entry names its path and section. A workstream so learns about each change to its parent when it happens, not at its own consolidation.

### The steps

1. **Reconcile.** For each MODIFIED entry, compare its "Previously:" text with the parent's current text. Where they match, the change applies as written. Where they differ, the "Parent changed" notes say why; the agent proposes combined text, and the person decides.
2. **Apply.** The ADDED, MODIFIED and REMOVED changes go into the parent's requirements and design. When the parent is itself a workstream, a change to a section the parent also changes replaces the parent's new text; any other change is added to the parent's changes. At the top, the changes become the current truth.
3. **Carry up.** Ideas still unsettled move to the parent's ideas, so the archive does not bury them.
4. **Attachments.** The agent lists the workstream's attachments, with a suggested choice for each:
   - move it to the parent's attachments, when text being consolidated links to it;
   - keep it with the archived workstream, when only archived documents use it;
   - delete it, when nothing links to it.

   The person confirms or changes the choices in one list, and says where in the parent moved files go. The agent moves the files and their index entries, and updates the links.
5. **Record.** The Outcome is written (what shipped, where it differs from the plan, what was forced, which attachments moved where), the banner is added, and the status becomes `consolidated`. The parent's roadmap item is ticked and relinked, and the parent's notes get a line.
6. **Archive.** The folder moves to the parent's `workstreams/archive/`.
7. **Review.** An agent, ideally a fresh one rather than the one that consolidated, runs the health check and reviews the result: every change landed once and none was lost; text from different workstreams does not contradict itself; every decision cited exists; task and roadmap states are right; the code still matches what the blueprint says. It fixes what is mechanical, reports the rest to the person, and adds its findings to the parent's notes.
8. **Commit.** Once the person approves, everything goes in one commit.

### Not forgetting it

- `complete` is the signal. At the start of every session, and before every commit, the agent looks for workstreams with `status: complete` and raises them with the person before anything else.
- If work landed while its workstream is still `active`, the sync pass notices the commits and asks about it.
- No git hooks or scripts are needed.

## Parallel work

The blueprint is treated like code: one agent edits a file at a time. Workstreams split the work into parts; modes say how agents write to the blueprint:

| Mode | When |
| --- | --- |
| Direct | the default: one agent per workstream, writing straight into it, or into the root |
| Staged | several agents on the same data, such as reviews from different angles |
| Branched | the blueprint changes on a git branch; usually comes with a code branch |

- **How an agent knows its mode:** usually the person says so, in the prompt or the task. The agent may infer it when the context makes it obvious, asks when unsure, and works in direct mode otherwise.
- **Staged mode.** Each agent writes only to its own file in a `pending/` folder, at whichever level the work is, root or workstream: `pending/<agent>-<topic>.md`.
  - The file holds everything the agent would otherwise write: notes, decisions, changes, task updates and log lines, ideas.
  - New decisions and tasks get placeholder IDs, such as `WG-D?1`, used within the file; real numbers are given when the file is applied.
  - The main agent applies the pending files when the person asks, or at a natural point such as the end of a review. It works oldest first, gives the IDs, moves everything into place, and asks the person when two files change the same section. Then it runs the health check, deletes the applied files and commits.
- **Branched mode** is described in [Workstreams and git](#workstreams-and-git).
- **Claims never clash:** in parallel work each agent has its own workstream, and in staged mode the person assigns the work.

## Workstreams and git

The blueprint never needs a branch of its own: branches belong to the code. A workstream may have one, named in its `branch` field, but it does not have to, and several workstreams can share a branch. Consolidation is the same in every case; only the order around it changes.

- **Workstreams without a branch of their own.** Each writes only in its own folder, so nothing conflicts. Consolidation is a commit on the branch they share.
- **A workstream with its own branch, blueprint in the code repository.** Its folder and its code travel together on the branch. To finish:
  1. update the branch from its parent branch, which brings in whatever was consolidated meanwhile;
  2. consolidate on the branch;
  3. git-merge the branch: the code and the blueprint arrive together.

  A sub-workstream's branch merges into its parent workstream's branch the same way.
- **Blueprint in its own repository, not branched.** One copy; workstreams are kept apart by their folders. A workstream is consolidated when its code branch merges in the code repository.
- **A conflict in the blueprint during a git merge** is resolved like one in code, and the consolidation review runs afterwards.

## Working with tasks

A task is a unit of work small enough to finish in one go. Tasks live in a `tasks/` folder: the root's for small work, a workstream's for its own.

- **One file per task**, named by its slug, with its ID in the H1: `# WG-T2: Draw group headers`. A task is always one file; the files it needs (screenshots, captures, logs) go to its workstream's `attachments/`.
- **IDs** count up within each `tasks/` folder: T1, T2, … at the root; WG-T1, WG-T2, … in workstream WG.
- **Status:** `todo`, `doing`, `review`, `done`, `dropped`. `review` means the work is finished and waits for the person, typically after an agent did it.
- **Assignee:** who is on it, a person or an agent. An agent sets itself when it starts.
- **Relations:** `blocked_by` lists the tasks this one waits for, `related` any others worth knowing. "Blocks" is never written: it is the other side of `blocked_by`, and the agent works it out when asked. A task is blocked while any task it waits for is not done; that is derived, not a status.
- **Trackers:** when a task is mirrored to GitHub, Linear or Jira, `tracker` holds the issue's link. The task file stays the source of truth; the agent keeps the issue in step.
- **Where they sit:** open tasks directly in `tasks/`, done and dropped ones in `tasks/archive/`.
- **Too big:** a task that needs sub-tasks becomes a sub-workstream of the workstream it was in. The task is dropped with the reason "became SDK", and the new workstream's README says which task it came from.

## Attachments

Files the documents use that are not markdown: screenshots, terminal captures, logs, data, small scripts. The blueprint and each workstream have one `attachments/` folder, shared by all their strands, created when the first file arrives.

- **Not in git by default.** Attachments are often large, binary or private, and they are rarely needed on another machine. Only the index, `attachments/README.md`, is committed. The blueprint's own `.gitignore` does this, wherever the blueprint lives:

  ```text
  **/attachments/*
  !**/attachments/README.md
  ```

  To share one file, add a `!` line for it.
- **The index** says, for each file, what it is and when it is worth reading, so an agent can decide without opening it: its kind, size and date, what it shows, and when to read it. The agent writes the entry when it adds the file. On a machine without the file, the entry is still there, so a link to it is never a mystery.
- **Documents link to attachments by path:** `attachments/collapsed.png`.
- **At consolidation**, the person decides what happens to each file; see [The steps](#the-steps).
- **Markdown is not an attachment.** A research agent's full report is research, and a diagram belongs in its design document as a Mermaid block.
- How attachment files are stored beyond this, and how they travel between machines, is left open.

## Two-way sync

The blueprint and the code describe the same project. Either can change first, and the other follows, so both can be trusted.

- **Blueprint to code.** Planned work starts in the blueprint: a decision, a change to requirements or design, a task. The code implements it, and the task's acceptance criteria check it.
- **Code to blueprint.** Whatever the code changes that the blueprint describes is written back in the same piece of work: behaviour in requirements, structure in design, a choice made while coding as a decision, progress in the task. A change the blueprint does not describe, such as a refactor inside one module, needs nothing.
- **Changes made elsewhere.** Code also changes outside the blueprint's flow: a quick fix by hand, a merge from an upstream project, a dependency update. The root README records the branch the blueprint follows and the last commit it was reconciled with, in `synced_with: dev@2e6e888c`. A sync pass reviews every commit since, writes back what the blueprint describes, and moves the marker. It also notices work that landed for a workstream still marked `active`.
- **Branches.** `synced_with` follows the project's main development branch, which it names. Work on a workstream's branch is synced as it goes, and reaches the root when the workstream is consolidated.
- **Disagreements are resolved, never patched quietly.** When the two differ, the agent reports it, and the person decides which is right: the code (a decision and a design change) or the blueprint (a task to fix the code).
- **Design names the modules** each part lives in, so a sync pass knows where to look.
- **Sync points:** every commit that changes what the blueprint describes, every finished task, every consolidation, and a sync pass before each release.

Why both ways: a blueprint that only flows down goes stale the first time the code teaches something, and one that only follows the code is documentation, with no reasons and no plan.

### User documentation

The user documentation (the docs site, the README, an agent skill for users, the changelog) stays outside the blueprint, in the project, written for users. It is kept in step the same way as the code:

- A workstream whose changes users will see has a docs task, and its acceptance criteria say what the docs must cover. A root task that changes what users see includes the docs in its own acceptance criteria.
- The docs are written for users, never copied from the blueprint. Design files such as `how-it-works.md` and `terms.md` can be source material.
- The docs never link to a private blueprint.

## References

Every document links to what it rests on, so a reader can follow any point back to its reasons.

- **History by ID:** root decisions (D201) and tasks (T5); workstreams by key (WG); a workstream's decisions (WG-D2) and tasks (WG-T3). IDs survive files being moved, split or archived.
- **Current truth by path and section:** `design/interfaces/protocol.md § Handshake`. A section names the exact text that is meant.
- **Navigation by link:** the roadmap and every README link to files by path.

What links to what:

| Document | Links to |
| --- | --- |
| ideas | the decision that settled each idea |
| notes | the decisions recorded, the research asked for |
| research | its sources; in its summary, the decisions it changes |
| decisions | where it was agreed (notes), its evidence (research), the alternatives (ideas) |
| requirements, design | the decisions behind each point |
| roadmap | each step's workstream; for Later items, the decision that deferred them |
| workstream | the parent sections it changes and builds on; the task it came from |
| task | the sections it delivers, the decisions and research it rests on, its issue |

## Rules

1. **Files first.** A strand or document starts as a file and becomes a folder of the same kind when it grows: its content is split into files by topic, and `README.md` becomes their map. Content never changes kind when it moves. A file is created only when it has content. Why: a small project stays small, and structure appears where it is needed.
2. **Collections of items are folders from the start:** `workstreams/` and `tasks/`. Each workstream is a folder; each task is a file, and stays one.
3. **A README describes its folder.** In a strand's folder: a sentence or two on what it holds, then links with a line each, in an order chosen by hand. In a workstream's folder: the workstream itself. In `workstreams/` and `tasks/`: what the folder holds, since the files are the list. In `attachments/`: the index of its files. The root README also says how things are recorded and lists the project's conventions. An `archive/` or `pending/` folder has no README; its parent's list covers the archive, and pending files are temporary.
4. **No numbers in file names.** IDs live in headings (D201, WG, WG-D2, WG-T3); names live in file names; order lives in READMEs. Why: inserting or reordering never renames a file, and IDs survive moves.
5. **IDs never collide.** Root items are numbered plainly (D1, T1); a workstream's items carry its key (WG-D1, WG-T1); keys are unique across the blueprint.
6. **The title is the H1.**
7. **Current truth is the root's requirements and design.** During the initial design they are written directly. After it, they change only when a top-level workstream is consolidated, or when what the code already does is written down: by a sync pass, or when an existing project is first described.
8. **One home per fact.** Anything that can be worked out is left out: lists of workstreams, tasks or decisions (the folders and IDs give them), a workstream's parent (its folder), what a task blocks, dates of last change (git has them). Two facts are kept twice on purpose, and the health check makes sure they agree with the item's status: whether an item sits in `archive/`, and a workstream's roadmap tick.
9. **No tooling required.** Everything is plain markdown that an agent reads, writes and checks with the tools it already has: file search and git. Nothing is generated.
10. **Front matter only where it is used:** the root README, workstream READMEs, tasks and research. Nothing else has any.
11. **Workstreams nest, and consolidate upward.** Every level works the same way and is consolidated into its parent, never past it.
12. **Not everything needs a workstream.** Work that changes neither requirements nor design is a task.

## Front matter

YAML at the top of a file, between `---` lines. Only four kinds of document have it.

### Root `README.md`

| Field | Values |
| --- | --- |
| `synced_with` | the branch the blueprint follows and its last reconciled commit: `dev@2e6e888c` |

### Workstream `README.md`

| Field | Values |
| --- | --- |
| `status` | `draft`, `active`, `complete`, `consolidated`, `dropped`, `superseded` |
| `created` | a quoted date: `"2026-10-07"` |
| `superseded_by` | a workstream key; only when superseded |
| `branch` | optional: the git branch the work is done on |

The workstream's key is in its H1, not in the front matter.

### Task

| Field | Values |
| --- | --- |
| `status` | `todo`, `doing`, `review`, `done`, `dropped` |
| `assignee` | a person's handle or an agent's name; empty when nobody is on it |
| `priority` | optional: `high`, `normal`, `low`; `normal` when left out |
| `blocked_by` | task IDs: `[WG-T1, T4]` |
| `related` | optional: task IDs |
| `tracker` | optional: issue links: `[gh:#42, linear:ENG-118, jira:OPS-7]` |
| `created` | a quoted date |

### Research

| Field | Values |
| --- | --- |
| `status` | `current`, `outdated` |
| `created` | a quoted date |

## Finding things

Nothing is generated, so nothing can go stale. The structure itself answers the usual questions:

| Question | Where the answer is |
| --- | --- |
| Which workstreams are there, in what order? | the roadmap, which links each one |
| Which are finished? | those in `workstreams/archive/` |
| Which wait for consolidation? | those with `status: complete` |
| Which tasks are open? | the files in a `tasks/` folder, outside its `archive/` |
| Where does WG-D2 live? | in workstream WG, whose key it carries |
| Which decisions still need verifying? | entries with a **Verify:** line and no Verified note |

The agent answers these with a file search; the person asks the agent.

## The agent at work

How an agent uses the blueprint during development, from finding its way in to committing. The skill teaches these procedures.

### Finding its way in

- It looks for the blueprint at `.local/blueprint/` or `blueprint/`, as its instructions say. If there is none, for example in a clone without the private blueprint, it works from the code alone and says so.
- It looks for workstreams with `status: complete` first, and raises any with the person before anything else.
- It reads little at first: the root README and the roadmap. Then only what the job needs: the workstream's README and requirements, the task in hand, the requirement and design sections they name, the decisions they cite.
- It finds things by ID or path: `## WG-D2:` in decisions, `# WG:` in workstreams. For an attachment, it reads the index entry before deciding to open the file.
- It never reads the whole blueprint up front: most of it is history, and it is large.

### Discussing and designing

- Ideas the person raises, and options the agent offers, go to ideas.
- As the discussion goes, the agent keeps the notes: the questions in order, what was asked, what was agreed.
- When a question needs evidence, research comes first, written up with provenance.
- A decision is recorded only once the person agrees: the entry, a note under each earlier entry it changes, and the outcome on the idea it settles.
- Then the decision is applied: during the initial design, to the root's requirements and design; after it, as changes in the requirements and design of the workstream the work belongs to.

### Planning work

- It reads the roadmap's status line first. While the initial design is open, a change to requirements or design goes straight into the root, and it proposes no workstream.
- It plans top-down: the levels above the work must already hold. A question that belongs higher up (a goal, the overall design) is settled there first.
- For a change to requirements or design, or work too big for one task, the agent drafts a workstream inside the parent the work belongs to: its key, its README, its requirements (goals, what it builds on, acceptance criteria) and its design changes. It asks the person to accept it, sets `status: active`, adds or links the step on the parent's roadmap, and, if the project works that way, creates its branch or worktree and records it in `branch`.
- When work is to run in parallel, it is split into workstreams first, one per agent, before the agents start.
- Only then does it split each workstream into tasks, each complete enough to do without asking, with `blocked_by` where order matters.
- Work that changes neither requirements nor design is a task, in the root's `tasks/` or its workstream's.

### Working alongside other agents

- It works in the mode the person gives; without one, in direct mode.
- In direct mode it writes only inside its own workstream; the parent's files and other workstreams are read-only to it.
- In staged mode it writes only to its own pending file, using placeholder IDs.

### Picking up a task

- It takes the task the person named, or else the first `todo` task in its workstream that is not blocked, highest priority first.
- Before starting, it sets `assignee` to itself and `status: doing`, and updates the tracker issue if there is one.
- It reads the task's references, and no more unless the work leads there.

### Doing the work

- The code follows the task's acceptance criteria and the design it names.
- Findings, dead ends and follow-ups go in the task's Log as they happen, not at the end.
- Screenshots, captures and logs go to `attachments/`, each with an index entry.
- A question that needs a decision stops the work: the agent asks, and records the decision once agreed. It never decides alone.
- Whatever the code changes that the blueprint describes is written back in the same piece of work. When the approach changes the design, that means the workstream's design changes, never its parent's, with a decision where one is needed.
- A problem that belongs to a higher level (a requirement that cannot hold, a design that does not fit) goes up as a question to the person, not as a workaround in the code.
- New work found on the way becomes a new task, or an idea, rather than growing the current one.

### When the code and the blueprint disagree

- The agent never quietly changes either to match the other. It reports the difference.
- If the code is right, the fix is a decision and a design change. If the blueprint is right, it is a task to fix the code.

### Syncing changes made elsewhere

- When the code has moved past `synced_with` (a fix made by hand, an upstream merge, a dependency update), the agent runs a sync pass: it reads the commits since the marker (`git log 2e6e888c..dev`), and for each one that changes what the blueprint describes, it updates requirements or design, records a decision for any choice made, and ticks any task the commit finished. Commits that finish a workstream still marked `active` are raised with the person.
- What it cannot place, it reports to the person rather than guessing.
- Then it moves `synced_with` to the commit it reviewed up to.
- It runs a sync pass when the person asks, before starting a workstream, and before each release.

### Finishing a task

- It checks every acceptance criterion, running the tests, and notes the results in the Log.
- It sets `status: review` and tells the person. Once the person accepts, the task is `done` and moves to `tasks/archive/`; the assignee stays as the record of who did it.
- It closes or updates the tracker issue.
- When it was the workstream's last open task and the acceptance criteria are met, it sets the workstream to `complete` and tells the person.

### Consolidating a workstream

- It follows [Consolidation](#consolidation): reconcile, apply, carry up, attachments, record, archive, review.
- It asks the person about every conflict, every forced item and every attachment, and commits once the person approves.
- When the workstream has a branch, it follows the order in [Workstreams and git](#workstreams-and-git).

### Before committing

- It checks whether the commit changes anything the blueprint describes, and if so updates the blueprint in the same piece of work.
- It checks its own changes: the IDs and links it wrote resolve, and statuses match folders and the roadmap.
- A blueprint inside the project's repository is committed with the code it describes. A blueprint in its own repository is committed there at the same time, and the task's Log names the code commit.
- Commit messages and public issues never quote a private blueprint; the tracker issue is the public reference.

### Running a health check

When the person asks, and as part of every consolidation review, the agent checks the whole blueprint with file search and git:

- every ID and link resolves, and no key or ID appears twice;
- statuses agree with folders (`archive/`) and with the roadmap's ticks;
- consolidated workstreams have their Outcome and banner, and no open tasks;
- front matter uses only the allowed fields and values;
- every attachment present has an index entry.

It fixes what is mechanical and reports the rest.

### What an agent never does

- Record a decision the person has not agreed.
- Rewrite a decision entry; it adds a note under it instead.
- Write outside its own workstream, or its own pending file in staged mode.
- Change a parent's requirements or design for work still inside a workstream.
- Consolidate without the person's approval.
- Work around a problem in the code that belongs to a higher level of the blueprint.
- Move `synced_with` past commits it has not reviewed.
- Commit an attachment, or copy a private blueprint's content anywhere public.

## Tooling

- **A skill** for agents: what the blueprint is, where things go, the procedures in [The agent at work](#the-agent-at-work), and the templates below.
- **No script.** Every procedure uses what an agent already has: reading and writing files, file search, and git. A link checker the project already runs, such as markdownlint, can check links too.

Why no script: it would be one more thing to install, keep working and keep in step with the structure. The structure is built so that it is not needed: IDs say where things live, folders say what is finished, and nothing is generated. If a blueprint ever grows past what an agent can check reliably, a script can be added then, without changing anything else.

Where the skill and the templates live is part of the parked template plan.

## Templates

Suggested sections. A section not marked optional is expected once the document has content.

### Root `README.md`

The entry point: what the project is, where to start, and the map of the strands.

```markdown
---
synced_with: dev@2e6e888c
---

# <Project> blueprint

<What the project is, in a paragraph, and where it stands.>

## Where to start

1. [design/how-it-works.md](design/how-it-works.md): how it works, end to end.
2. [roadmap.md](roadmap.md): what is done, what comes next, what waits.

## The strands

- [roadmap.md](roadmap.md): the order of work.
- [ideas.md](ideas.md): ideas and alternatives, and what became of them.
- [notes.md](notes.md): how each topic was discussed.
- [research/](research/README.md): what was learned, and from where.
- [decisions/](decisions/README.md): every decision with its reasons, D1 onward.
- [requirements.md](requirements.md): what the project must do and be.
- [design/](design/README.md): how it works now.
- [tasks/](tasks/README.md): small work not worth a workstream.
- [workstreams/](workstreams/README.md): the parts of the work, active and archived.

## How things are recorded

- Requirements and design are the current truth; decisions say why; workstreams propose changes, are
  consolidated into their parents when complete, and are then archived.
- Decisions are append-only: a change is a new entry, and a note goes under each earlier entry it changes.
- Work goes top-down, from the goals to the tasks; corrections go back up to the level they belong to.
- The blueprint and the code are synced both ways; `synced_with` is the last commit reconciled.

## Conventions

- **Provenance** of a claim: *read*, seen in a named source; *ran*, executed; *summary*, through a fetched
  page's summary; *memory*, unverified knowledge; *ours*, a value of our own with no source.
- <Project conventions: licences, markdown, …>
```

### `roadmap.md`

The order of work, and what waits for later.

```markdown
# Roadmap

Status: **<phase>**, <state>. Now: <what is being worked on>.

## <Phase>: in progress

- [x] **[<Step>](workstreams/archive/<name>/README.md)** (FND): <what it covers>.
- [ ] **[<Step>](workstreams/<name>/README.md)** (WG): <what it covers>.
- [ ] **<Step without a workstream>**: <what it covers>.

## Later

Agreed, but not scheduled.

- [ ] **<Item>**: <what it is> (D106).
```

- Phases are optional; a small project has one list.
- The status line says whether the initial design is open or settled; agents read it before planning.
- Ideas not yet agreed belong in ideas, not in Later.

### `ideas.md`

Proposals and alternatives, by topic, each with its outcome once settled.

```markdown
# Ideas

## <Topic>

- <An idea or alternative, as it came.> (2026-10-07)
- <An alternative that lost.> Not chosen (D201).
- <An idea that was taken up.> Chosen (D202).
- <An idea big enough for its own work.> Taken up in (WG).
```

### `notes.md`

One dated section per discussion: the questions in order and what came of each.

```markdown
# Notes: <topic>

## <Session> (2026-10-07)

- **Questions:** 1 <first>; 2 <second>; …
- 1, <first>: agreed as offered (D201).
- 2, <second>: agreed after <what was asked, measured or changed> (D202).
- **Research:** <what was asked for>, in research/<topic>.md.
- **Open:** <what is still open>.
```

### `research.md`

One topic's findings, conclusion first, every claim with its source.

```markdown
---
status: current
created: "2026-10-07"
---

# Research: <topic>

<What it was for, and how sources were read.>

## Summary          the conclusions, one bold-led line each, including any that change earlier decisions

## <Area>           the findings, each claim with its source and provenance

## Verification     optional: which key claims were re-checked, and how

## Gaps             what was looked for and not found

## Sources
```

- A comparison of options is a finding; the options themselves go to ideas.
- When a topic keeps the research agents' full reports, it becomes a folder: `write-up.md` (this template) and one file per report.

### `decisions.md`

Numbered entries, append-only, each with its reasons and any later notes. At the root, IDs are D1, D2, …; in a workstream, they carry its key: WG-D1, WG-D2, ….

```markdown
# Decisions: <theme>

## D201: <Title> (2026-10-07)

> **Detailed by D209 (2026-10-07):** <what it added>.
>
> **Verified (2026-10-12):** <the result of the check>.

**Decision:** <what was decided>.

**Why:** <the reasons and their evidence>.

**Cost:** optional: <what this makes harder or gives up>.

**Not chosen:** optional: <the alternative>, because <reason> (ideas.md § <Topic>).

**Verify:** optional: <the test, measurement or check that would confirm it>.
```

- New entries go at the end of the latest file.
- Notes under an entry: Superseded, Amended, Detailed, Clarified or Corrected by `<ID>`, or Verified; each dated, with one line on what changed. The later entry names the earlier one. An entry with no Superseded note is in force.
- A Verify check is a task. Its result is a Verified note; a failed check leads to a new decision correcting the entry.
- `decisions/README.md`: the rules, and a "Renamed terms" note so older entries read correctly. A workstream's decisions live in its own folder, and their key says which.

### Root `requirements.md`

What the project must do and be.

```markdown
# Requirements

<Who it is for and what it lets them do.>

## Goals            outcomes that mean success (D7)

## Non-goals

## <Capability>     what it must do, one heading each

## Quality goals    the few qualities that matter most, each with how it is checked

## Constraints      fixed from outside: licences, platforms, dependencies
```

### `design.md`

How one part of the project works.

```markdown
# <Topic>

<What this covers.>

## <Concept>        one heading per concept; each point names its decisions (D201)
```

- Headings stay stable: workstreams name them in their changes.

### Task

One task, complete enough for an agent to pick up and finish without asking.

```markdown
---
status: todo
assignee:
blocked_by: [WG-T1]
tracker: [gh:#42]
created: "2026-10-07"
---

# WG-T2: Draw group headers

<What this task does, in a sentence or two.>

## Description

<What needs to be done, in enough detail to start without asking.>

## Acceptance criteria

- <A checkable outcome, ideally a test.>

## Out of scope

- <What this task leaves alone.>

## Approach         optional: steps, modules touched

## Risks            optional: what could go wrong, and what to do then

## References

- Delivers: requirements.md § Groups; design/sidebar.md § Group headers.
- Rests on: (WG-D1); research/sidebar.md.
- Attachments: attachments/collapsed.png.

## Log              optional: dated notes as work goes on: findings, dead ends, follow-ups
```

`tasks/README.md` says only what the folder holds: open tasks are its files, finished ones are in `archive/`.

### Workstream `README.md`

What the workstream is, its status, and its map.

```markdown
---
status: active
created: "2026-10-06"
branch: worktree-groups
---

# WG: Worktree groups

<What this workstream does, in two or three sentences. If it came from a task: "Came from T7.">

- [requirements.md](requirements.md): its goals, what it builds on, and its changes to the parent's requirements.
- [design.md](design.md): its changes to the parent's design.
- [tasks/](tasks/README.md): its tasks.

## Outcome          written at consolidation: what shipped, where it differs from the plan, what was forced,
                    which attachments moved where
```

When consolidated, a banner goes under the H1: `> Consolidated into its parent on 2026-10-20.`

### Workstream `requirements.md`

The workstream's goals, what it builds on, and its changes to the parent's requirements.

```markdown
# Requirements

## Goals                what this workstream must achieve

## Non-goals

## Builds on            parent sections it relies on without changing them

- design/sidebar.md § Collapse state

## Acceptance criteria  checkable outcomes for the whole workstream

## Changes              to the parent's requirements

### ADDED requirements.md § <Section>

<the new section>

### MODIFIED requirements.md § <Section>

> **Parent changed by ST (2026-10-09):** <what changed underneath>.

<the full new text>

Previously: <the parent's text when this change was written>.

### REMOVED requirements.md § <Section>

Reason: <why> (WG-D3).
```

### Workstream `design.md`

The workstream's changes to the parent's design.

```markdown
# Design changes

## MODIFIED design/<file>.md § <Section>

<the full new text>

Previously: <the parent's text when this change was written>.
```

- ADDED and REMOVED work as in requirements; "Parent changed" notes go under the entry they affect.
- Grown into a folder, it mirrors its parent's design tree. A new design file is written whole, and moves to the parent at consolidation.

### Pending file (`pending/<agent>-<topic>.md`)

One agent's staged updates, waiting for the main agent to apply them.

```markdown
# Pending: <agent>, <topic> (2026-10-09)

## Notes             what to append, and where

## Ideas

## Decisions         new entries with placeholder IDs: WG-D?1, WG-D?2

## Changes           ADDED / MODIFIED / REMOVED entries, as in a workstream

## Tasks             new tasks (WG-T?1), status changes, log lines
```

### `attachments/README.md`

The index of the files in `attachments/`, enough for an agent to decide whether to open one.

```markdown
# Attachments

Files the documents here use. Only this index is in git; the files stay on the machine that made them.

- **[collapsed.png](collapsed.png)** (image, 48 KB, 2026-10-08): the sidebar with two groups collapsed, on
  the 2026-10-08 build. Read it to check the collapsed header style.
- **[blocked-capture.txt](blocked-capture.txt)** (text, 3 KB, 2026-10-08): the pane's bottom buffer while
  the agent waits for approval. Read it when changing the blocked-state rule.
```

## From trailscout

trailscout's docs were the working example behind this draft.

- Its `ideas/` folder is what this calls notes.
- The Goal and Constraints in its `design/README.md` are this blueprint's requirements; its Terms become `design/terms.md`, and its overview `design/how-it-works.md`.
- Its design phase is the initial design: its topics (foundations, scoring, interfaces, …) were discussed and applied to the root directly, as here. Workstreams begin once that design is settled.
- Its "To verify on real machines" and "Left to the evaluation" lists become Verify lines on their decisions.
- Kept from it: the roadmap's status line, phases and Later; dated decision notes; the notes' question-by-question record; research's summary, verification, gaps and provenance tags.

## Open questions

- Writing guidelines for each kind of document: how to write ideas, notes, research, decisions, requirements, design, roadmap, tasks and workstream files (tone, length, what to include and leave out). To discuss.
- The skill's exact procedures, beyond the outline in "The agent at work": the commands it runs, what it asks the person, and how it syncs each tracker.
- How attachment files are stored beyond the index, and how they travel between machines.
- Where the skill and the templates live (the parked template plan).
