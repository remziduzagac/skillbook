# Design: design

What a builder needs for essentials' design, how to design anything, and its review, under devise (D164); ideas not yet decided are in [../../ideas/design.md](../../ideas/design.md). Every section answers the same questions (D80); an empty field is not designed yet.

softeng's own design, with architecture, is in [../softeng/design.md](../softeng/design.md); the blueprint set's recording steps are in [../blueprint/blueprint.md](../blueprint/blueprint.md) (D152, D154, D167).

```text
design/
└── review/
```

## design

- **Purpose:** deciding what something will be before it is made: what it is for, its parts and how they connect, how it behaves, and the decisions behind it, each with its reason (D168). Anything: a feature, a tool, a set of skills, a folder layout, a process, a document's structure. softeng's design adds how good software is designed, architecture among it, and a keeper such as blueprint keeps the records; this method works without either (D154, D156, D168).
- **Description:** "How to design anything: what something will be, decided before it's made: its purpose, its parts and how they connect, its behaviour and its decisions, framed, divided, discussed, written and reviewed. Use when something new or changed is to be made and what it will be isn't settled, or a design is asked for." A draft (D168).
- **Callers:** devise's own skill, by its routing line in devise's flow (D168, D172). Its other callers: plan, its sibling, by path, for an open shape met on the way, continuing from design's result (D173); softeng's design, through essentials' main skill by name, adding architecture (D152, D154); the person, typing it.
- **Flow** (D168):

  **Three checks,** in order:
  1. **Is what to make settled?** Then there is no design: it goes to plan, or is done directly. Settled means the agent could describe what it will make in a few lines, and what is open, if anything, is a single choice a question can settle, asked through conduct's ask, a variation of plan's obvious test, which asks the same of a step (D155, D173).
  2. **Is a design given,** such as a spec, an issue that describes the solution, or an existing design document? Then it is followed and checked for gaps; where something is not settled, it is added and marked as added.
  3. **Short or full?** Full when stakes are high, others will build on it, it has many parts, or it will last; short otherwise, for small things where a wrong choice is cheap to change.

  **Rules,** each with its reason:
  - **top-down:** the goal before the parts, the parts before the details; details decided before the goal get redone;
  - **a correction goes up to the level it belongs to:** fixed lower, the cause stays;
  - **every decision carries its reason,** so it can be revisited when the reason changes;
  - **settled before it is built, and it follows the build back:** building on an unsettled design wastes the build, and a build that drifts unannounced leaves the design wrong;
  - **one home per decision:** written in two places, it drifts apart;
  - **written for its builder:** someone could build from it without asking: authoring's reader test, "can a builder build from it?", through authoring's main skill where that set is installed; where it is not, this rule's own question is the test.

  Who decides is understand's rule: choices that change what the person gets are theirs. A full design waits for the person's approval before plan; a short one is shown, and waits only when it holds a choice that is the person's.

  **A full design's steps,** each using the skill named:
  1. **frame,** through understand's frame: the goal, who it is for, the constraints, what is out of scope and what a good answer looks like; clarify first when the request is not clear; the frame shown, so the person can correct it;
  2. **analyse what exists:** the current thing, its documents and earlier decisions read before anything is asked; outside facts, such as how others solve it or a tool's limits, through understand's research;
  3. **divide into parts,** through organize, planning a whole not yet written: the requirements are the items, split into parts with each boundary in one sentence (D148); for software, softeng's design adds architecture here, through softeng's main skill, where that set is installed; where it is not, design's own parts and connections only;
  4. **discuss and decide:** the open questions dividing turns up, through understand's discuss, one item at a time, with brainstorm when options are wanted, weigh to compare them and challenge for decisions others will build on; the agent recommends, the person decides;
  5. **write** the design, top-down, holding the parts below;
  6. **review** it, through review, by path: when a design is to be checked, before approval or after a large change; not for code or a change about to land (softeng's review), whether work is done (conduct's verify), a single idea (understand's challenge) or a skill in this repository (skillbook-tree); it gives back the findings, ranked, or with none the lenses that ran; problems go back to step 4;
  7. **approve:** the person approves it;
  8. **hand on:** when it is to be built, to plan, by path, then to building; when only the design was wanted, it ends here (D173);
  9. **adjust from building:** when building shows the design wrong or missing something, the design changes first, through step 4, before building goes on, and the plan is then revised by plan's re-planning; the build never quietly wins.

  When a step needs evidence, it goes back to step 2. A short design runs the same steps, each in a line, in one response, with no separate rounds or review.

  **What a full design holds,** what goes in, the form being the keeper's (D156):
  1. purpose: the goal, who it is for and what a good result is, from the frame;
  2. scope: what is in, what is out, the constraints;
  3. parts: each with its boundary in one sentence and what it does;
  4. how the parts connect: what passes between them, and in what order;
  5. behaviour: how it works from the outside, the main cases, the edge cases and what happens when something fails;
  6. decisions: each choice with its reason and the options set aside; with a keeper, where it says, the design stating only the result;
  7. how it is checked: how anyone will know it works, so the builder knows when it is done;
  8. open questions: what is still open, with what would settle it, every assumption marked.

  A short design holds the purpose, the parts and the choices with their reasons, with open questions if any. A design says what the thing is as agreed now: a change rewrites it, and its history goes to the keeper, or without one to its decisions part. It is laid out by conduct's layout and rightsized by conduct's rightsize; grown large, it is divided into documents through organize, each sized to how it is read (D148). A diagram is drawn only where connections are easier to see than to read, as text in a code block.

  Other skills are steps of this flow, never sub-skills of design; review, with rules of its own, is its only sub-skill (D168).

  **Last instruction, before a design is shown or kept:** settled work got no design; a given design's additions are marked as added; every decision carries its reason; open questions are listed with what would settle each, every assumption marked; a full design was reviewed, each finding fixed, accepted with a reason or parked, and approved by the person before plan; a short one waits only for a choice that is the person's; it is kept where "Where it is kept" says.
- **Result:** the design, short or full; for a full one, its review and the person's approval.
- **Where it is kept** (D156, D163, D168): a short design stays in the response. A full design goes in a file the person names; when they name none, the agent asks, recommending a file named for what is designed, where the project keeps its documents, since a full design lost with the conversation would have to be redone. Where the project's instruction files point to a keeper, such as blueprint's main skill, it is kept where the keeper says, and design names none of its steps.
- **Files:** `SKILL.md` only (D168).
- **Material:** the draft flow in [../../ideas/skill-tree.md](../../ideas/skill-tree.md); the blueprint method ([../../notes/first-design/design/blueprint.md](../../notes/first-design/design/blueprint.md)) and its worked example; this repository's own way of designing, as a worked example; adapted, never copied (D120).
- **Tests** (D168):
  1. "design a CLI for X": a full design, framed, divided, its open questions one at a time, written with the eight parts, reviewed by a fresh agent and approved before plan;
  2. "add a --verbose flag": settled, so no design; plan or done directly;
  3. a spec with gaps: followed, the gaps filled and marked as added;
  4. "where should this helper live?": one question, so brainstorm or the agent's own choice, not design;
  5. "a settings page with two toggles": a short design in the response, waiting only for a choice that is the person's;
  6. building shows the design is wrong: the design changes first, through discuss and decide, then building resumes;
  7. a full design with no keeper loaded and no file named: the agent asks, recommending a file; with blueprint loaded, kept where blueprint says, none of its steps named;
  8. a software design: architecture added through softeng's main skill where that set is installed; where it is not, design's own parts and connections only;
  9. a design grown large: divided into documents through organize;
  10. a decision others will build on: challenged before approval;
  11. "add dark mode and release it": plan, its one open choice asked through conduct's ask, not design (D173);
  12. only the design wanted: no plan follows (D173).
- **Open:** none known.

### review

- **Purpose:** a design checked before it is approved: whether it holds together, covers what it must, and can be built from (D168). It holds what is its own, consistency and a builder walk-through, and runs the other checks from their homes as lenses.
- **Description:** "A design checked before approval: consistency, a builder walk-through, coverage and overlap, challenge, lean, and architecture where softeng is installed; findings ranked, each with a fix, the reviewer only proposing. Use before a full design is approved, after a large change to one, or when a design review is asked for." A draft (D168).
- **Callers:** design's flow, by path, before a full design is approved, by its routing line in design's step 6 (D168, D172); softeng's review, for a design, through essentials' main skill (D39, D154); the person, asking for a design review or typing it.
- **Flow** (D168):

  **One home per check:** gaps and overlaps between parts are organize's check; contradiction, two things that cannot both hold, is review's; drift and coverage of built work against its design are conduct's verify's; weaknesses, such as assumptions, failure modes and what would break it, are understand's challenge's; what is extra is conduct's rightsize's lean's. Each check is written once, in its home, so the checks cannot drift apart (D123, D168).

  **Lenses:**
  1. **consistency,** its own: no part contradicts another part, a decision or the requirements, and each term is used one way;
  2. **builder walk-through,** its own: the main cases and the edge cases walked through the parts, each with a part that handles it, and a builder able to follow it without asking;
  3. **coverage and overlap:** organize's check, on the design's parts against its requirements, through the main skill;
  4. **challenge,** for decisions others will build on that were not challenged when they were decided, through the main skill, since nothing is challenged twice (understand's challenge);
  5. **lean:** what lean would remove; removing it is lean's (D157);
  6. **architecture:** softeng's lens, through its main skill where that set is installed; where it is not, skipped and said so.

  **Steps:**
  1. read the design, with what it must cover: the frame, the requirements and the decisions;
  2. run each lens; a full design is reviewed by a fresh agent, not its writer, since a fork shares the writer's blind spots; a large one by one agent per lens, through coordinate's delegate;
  3. report the findings, ranked "must fix before approval", "should fix" and "note", each with where, what, why it matters and a suggested fix;
  4. propose only: the findings go back to design's discuss and decide, and the fixes are made by rewriting the design.

  Done when every lens has run and each finding is fixed, accepted with a reason, or parked as an open question.
- **Result:** the findings, ranked, each with its fix; with none, the lenses that ran.
- **Files:** `SKILL.md` only (D168).
- **Material:** trailscout's design documents and mattpocock's skills (D39); the blueprint method's review after consolidation, by a fresh agent rather than the one that consolidated.
- **Tests** (D168):
  1. two parts handling the same case: an overlap, through organize's check;
  2. a requirement no part covers: a gap;
  3. a part contradicting a decision: a consistency finding, "must fix before approval";
  4. an edge case no part handles: a walk-through finding;
  5. the design left unchanged by the reviewer, who only proposes;
  6. a full design: reviewed by a fresh agent, one agent per lens when it is large;
  7. "review this code change": softeng's review, not this one;
  8. no findings: the report names the lenses that ran.
- **Open:** none known.
