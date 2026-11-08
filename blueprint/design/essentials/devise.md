# Design: devise

What a builder needs for the `devise` guide, essentials' group for deciding what the work will be and its steps (D164), and for its child guides, design with its review, and plan, which follow as sections; ideas not yet decided are in [../../ideas/design.md](../../ideas/design.md) and [../../ideas/plan.md](../../ideas/plan.md). Every section answers the same questions (D80); an empty field is not designed yet.

The `devise` guide belongs to essentials (D152, D154, D164). Skills in the harness’s list can add software architecture or keep project records when they cover that work (D281). plan's software parts, breakdown, slices and sequence, are kept, word for word, in [../../ideas/plan.md](../../ideas/plan.md), "Kept for the person's software-engineering skills", and belong to softeng (D151, D152, D154).

How guides reach each other here (D107, D186, D279, D281): essentials is the skill; its references are guides. The main skill’s guide map and name rule resolve a guide’s name to its file and parents. For another kind of work, use a skill in the harness’s list that covers it, if one fits. Otherwise use the fallback beside the call, under the `act` guide’s rules. Essentials names no other set.

```text
devise/
├── design/    how to design anything
│   └── review/
└── plan/      planning multipart work, and following the plan
```

## devise

- **Purpose:** an approach in thinking for every request before work starts, with design for an open shape and planning for several parts or an open earlier plan (D280, D286, D298, D300). Its own file holds the approach and each child’s part; the approach names the guides, skills and tools, order and checks. The main agent reads this guide with the other base guides on every request that a direct answer does not finish, since a stage test left it unread on turns where it fires (D300). A request with one obvious way and one part gets a one-line approach from it, with no design and no plan; a delegated worker does not read it by default, since its caller already planned the work (D290, D300).
- **Guide purpose** (D283, D298, D300): Chooses how to do the work, in thinking, before it starts. Uses design or planning where the work needs them.
- **Guide shape** (D283, D285, D286, D287): Instructions opens with its goal and one clear instruction. Four steps: settle the approach in thinking (the intent, goal and a good result; what the work touches; more than one way when the way is open, judged by goal, risk and cost; for each part the guide, skills and tools, order and checks, the checks named early so their evidence can be kept; one line for small work); design when what will be made is still open; plan for several parts or an open earlier plan, kept current as the work and the user's input change; the check, always last.
- **Description:** "An approach in thinking before the work starts, with design for an open shape and planning for several parts or an open earlier plan." (D280, D286, D298, D300).
- **When to use** (D279, D298, D300): Use before the first action on any request that a direct answer does not finish. Work with more than one plausible way, several parts or an open shape may also need design or planning, by steps 2 and 3. For example, planning a trip with flights, lodging and a budget has several parts. Several parts means more than one step or part, by the `act` guide's rule 13 test of multipart work. Work with one obvious way and one part needs a one-line approach, such as "rightsize, then answer" for a unit corrected in a table row.
- **When not** (D280, D286, D298, D300): A request a direct answer finishes, by the main skill's first rule: it reads no guide. A delegated worker whose brief does not name this guide: its caller already planned the work (D290, D300). Design or planning on work with one obvious way and one part, such as a unit corrected in a table row: the one-line approach is enough. When neither design nor planning fits, use your judgment under the `act` guide.
- **Callers:** the main skill, in its first rule and step 0, on every request that a direct answer does not finish (D279, D298, D300); other guides, such as the `understand-discuss` guide for a design’s or plan’s open parts; skills in the harness’s list that need a design or plan for their work or save its results (D152, D156, D281); the person, typing it.
- **Flow** (D280, D286, D287): the four steps under Guide shape. Design and plan may call each other for a different part of the work, never starting the caller again.
- **Gives back** (D279): The approach stays in thinking. Return any used child’s result to the active task.
- **Files:** `references/devise.md` (D257).
- **Material:** none of its own.
- **Tests** (D164):
  1. "add dark mode and release it": plan, the person's two items kept at the top, missing and non-obvious steps found (D155);
  2. "fix the typo in the README": single-step, no plan, done directly (D155);
  3. "design a CLI for X": design, a full design (D168);
  4. "a settings page with two independent toggles", low consequences with no dependent parts or separate builder: a short design (D257);
  5. "design a CLI for X, then build it": design first, then plan, by design's hand-on (D168);
  6. "make our onboarding better", its goal unclear: the `understand-clarify` guide first, not design;
  7. "reorganize these folders": the `organize` guide, not design;
  8. "write a user guide for X": a skill in the harness’s list for writing documents, if one fits, otherwise judgment for the writing task, not design (D281).
  9. An execution plan needs a design for one part: plan first, then design returns to that active plan; an explicit whole-design-and-build request starts in design. (D257);
  10. One open choice settled by a convention versus a user preference: use the full shared ownership rule, not an automatic question for both. (D257);
  11. Any request that a direct answer does not finish, such as renaming a heading: this guide read with the base before the first change, a one-line approach in thinking, no design and no plan; a delegated worker whose brief names no devise guide: this guide not read (D290, D300).
- **Open:** none known; the main guide’s own flow is its Instructions (D287).

## design

- **Purpose:** deciding what something will be before it is made: what it is for, its parts and how they connect, how it behaves, and the decisions behind it, each with its reason (D168). Anything: a feature, a tool, a set of skills, a folder layout, a process, a document's structure. A skill in the harness’s list for software architecture can add that part, and a record-saving skill can keep the result. This guide works without either (D154, D156, D168).
- **Guide purpose** (D283): Decides what something will be before it is made, with reasons its builder can use.
- **Guide shape** (D283): Instructions opens with: “Give the builder a settled design with reasons. Work from the goal to the parts and details.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Read the supplied basis, choose short or full, frame, analyze, divide, discuss and write top-down; short questions, full review and approval precede the caller handback. Keep thirteen steps, with full-review scope explicit in step 10 and final checks of additions, reasons, unknowns and actual status. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "How to design anything: what something will be, decided before it's made: its purpose, its parts and how they connect, its behaviour and its decisions, framed, divided, discussed, written and reviewed. Use when something new or changed is to be made and what it will be isn't settled, or a design is asked for." A draft (D168).
- **When to use** (D279, D293): Use when what to make is not settled, or the user asks for a design or a design review. For example, a new returns process for an online shop, whose steps and forms nobody has decided.
- **When not** (D279, D293):

  - One open choice: settle it with the `understand-clarify` guide, which applies the `understand` guide's who-decides rule. A whole design method adds little.
  - An unclear goal: use the `understand-clarify` guide so the design solves the right problem.
  - Arranging existing material: use the `organize` guide to preserve its meaning.
  - A document for readers: use a skill in the harness’s list for writing that kind of document, if one fits. Otherwise use your judgment under the `act` guide. This method decides the design rather than writing the reader’s document.
  - The steps of work already decided: use the `devise-plan` guide to plan how to do it.
  - What to make is already settled: return the work to the main task for planning or action. A second design would reopen a decision.
- **Callers:** the `devise` guide itself, from the main map, with its parent path read first (D279). Its other callers: the `devise-plan` guide, for an open shape met on the way, continuing from design’s result (D173); a skill in the harness’s list for software architecture, if one fits (D152, D154, D281); the person, typing it.
- **Flow** (D168):

  For a review-only request, use the `devise-design-review` guide and return its findings without making or changing a design.

  **Three checks,** in order:
  1. **Is what to make settled?** Then there is no design: it goes to plan, or is done directly. Settled means the agent could describe what it will make in a few lines, and what is open, if anything, is a single choice a question can settle, asked through the `respond-ask` guide, a variation of plan's obvious test, which asks the same of a step (D155, D173).
  2. **Is a design given,** such as a spec, an issue that describes the solution, or an existing design document? Then it is followed and checked for gaps; where something is not settled, it is added and marked as added.
  3. **Short or full?** Full when a mistake has consequential effects, parts depend on decisions in other parts, or another builder will rely on the design as a contract without this conversation. Judge consequences and undo through the `act-stakes` guide. A small change whose effects are easy to undo stays short only when no full trigger applies. Lasting a long time alone is not a trigger. Omit empty boilerplate from a full design (D257).

  **Rules,** each with its reason:
  - **top-down:** the goal before the parts, the parts before the details; details decided before the goal get redone;
  - **a correction goes up to the level it belongs to:** fixed lower, the cause stays;
  - **every decision carries its reason,** so it can be revisited when the reason changes and a builder sees which values move with it. A value the agent chose, such as a timeout or a page size, is a decision too. One stated basis can cover many values. A value the user or a source already settled needs only its source (D293). A value the agent can base on nothing is not settled: it is marked as an assumption, with what would settle it, such as a supplier's quote for a delivery time, and a full design lists it under Open (a short design has no Open part); a made-up reason would read as a basis, and both models on festival turn 7 gave team sizes and limits no basis, or only called them guesses (D293, D307);
  - **settled before it is built, and it follows the build back:** building on an unsettled design wastes the build, and a build that drifts unannounced leaves the design wrong;
  - **one home per decision:** written in two places, it drifts apart;
  - **written for its builder:** someone could build from it without asking. Use a skill in the harness’s list that checks a document from its reader’s point of view, if one fits. Otherwise this rule’s own question is the test: "can a builder build from it?" (D281).

  Use the `understand` guide's whole who-decides rule, without a local definition. A full design needs the user's actual approval before execution. A short design asks only for a user answer it needs; it keeps the shared pre-change timing. Approval covers only the scope and basis actually approved (D257).

  When a step needs evidence, it goes back to step 2. A short design reads available facts first. With no user answer needed, give its purpose, parts, choices and reasons in one brief response. Otherwise ask through the `respond-ask` guide and end the turn; resume after the answer without adding a full-design review. Follow the `understand` guide and the `act` guide before any lasting change (D257).

  **What a full design holds,** what goes in, the form being the keeper's (D156):
  1. purpose: the goal, who it is for and what a good result is, from the frame;
  2. scope: what is in, what is out, the constraints;
  3. parts: each with its boundary in one sentence and what it does;
  4. how the parts connect: what passes between them, and in what order;
  5. behaviour: how it works from the outside, the main cases, the edge cases and what happens when something fails;
  6. decisions: each choice with its reason and the options set aside; with a keeper, where it says, the design stating only the result;
  7. how it is checked: how anyone will know it works, so the builder knows when it is done;
  8. open questions: what is still open, with what would settle it, every assumption marked.

  A short design holds the purpose, the parts and the choices with their reasons, with open questions if any. A design says what the thing is as agreed now: a change rewrites it, and its history goes to the keeper, or without one to its decisions part. It is laid out by the `respond-layout` guide and rightsized by the `act-rightsize` guide; grown large, it is divided into documents through the `organize` guide, each sized to how it is read (D148). A diagram is drawn only where connections are easier to see than to read, as text in a code block.

  Other guides are steps of this flow, never child guides of design; review, with rules of its own, is its only child guide (D168).

  **A full design's steps,** each using the named guide:
  1. **frame,** through the `understand-frame` guide: the goal, constraints, scope and a good answer. Get the audience from the caller or known context. Use the `understand-clarify` guide for user intent that would change the result. Return the frame with the read-only design answer. Apply the `understand` guide's who-decides rule and the `act` guide's plan rule before changes; frame adds no checkpoint (D252);
  2. **analyse what exists:** the current thing, its documents and earlier decisions read before anything is asked; outside facts, such as how others solve it or a tool's limits, through the `understand-research` guide;
  3. **divide into parts,** through the `organize` guide, planning a whole not yet written: the requirements are the items, split into parts with each boundary in one sentence (D148); for software, use a skill in the harness’s list for software architecture, if one fits; otherwise give this design’s own generic parts and connections only (D281);
  4. **discuss and decide:** open questions through the `understand-discuss` guide, one item at a time. Use the `understand-brainstorm` guide for options and the `understand-weigh` guide for a comparison when needed. Reuse a comparison already returned instead of weighing twice. Use the `understand-challenge` guide for consequential decisions before relying on them, reusing an earlier challenge only as that guide's rule 7 allows. The agent recommends; the user decides. The caller owns lasting changes and records (D252);
  5. **write** the design, top-down, holding the contents listed above;
  6. The `devise-design-review` guide: check a design for its builder.
     Return review findings to discussion before approval (D279).
  7. **approve:** the person approves it;
  8. **hand on:** when called by an active plan, return the settled design to that caller. A direct design-and-build request hands on to the `devise-plan` guide once after approval. When only the design was wanted, return the design and do not execute it (D257);
  9. **adjust from building:** when building shows the design wrong or missing something, the design changes first, through step 4, before building goes on, and the plan is then revised by plan's re-planning; the build never quietly wins.

  10. **Check the result before returning it.** Always do this last. Before a design is shown or kept: settled work got no design; a given design's additions are marked as added; every decision carries its reason, each value the agent chose included, such as a count, a size or a limit, where a shared basis may cover several, and a value with no basis is marked as an assumption instead (D307); open questions are listed with what would settle each, every assumption marked, each assumption and unknown with what would settle it; a full design was reviewed, each finding fixed, accepted with a reason or parked, and approved by the person before plan; a short one asks for the user answers it needs and follows the shared pre-change timing; it is kept where "Where it is kept" says.
- **Gives back** (D279, D293): A short or full design with its actual approval status, such as "not yet approved", or ranked review findings. A full design also gives what its review found, how each finding was resolved, and any check still open.
- **Where it is kept** (D156, D163, D168, D293): a short design stays in the response. A full design goes in a file the person names; when they name none, the agent writes it to a new file named for what is designed, where the project keeps its documents, and names the file in the final answer, since a full design lost with the conversation would have to be redone. A new file is easy to move, so its place needs no question of its own. A user who wants the design only in the response gets that, by the `act` guide's rule 9. Where the project's instruction files point to a keeper, a record-saving skill in the harness’s list, it is kept where the keeper says, and design names none of the keeper's steps.
- **Files:** `references/devise/design.md` (D257).
- **Material:** the draft flow in [../../ideas/skill-tree.md](../../ideas/skill-tree.md); the blueprint method ([../../../docs/blueprint/idea.md](../../../docs/blueprint/idea.md)) and its worked example; this repository's own way of designing, as a worked example; adapted, never copied (D120).
- **Tests** (D168):
  1. "design a CLI for X": a full design, framed, divided, its open questions one at a time, written with the eight parts, reviewed by a fresh agent and approved before plan;
  2. "add a --verbose flag": settled, so no design; plan or done directly;
  3. a spec with gaps: followed, the gaps filled and marked as added;
  4. "where should this helper live?": one question, so brainstorm or the agent's own choice, not design;
  5. a small page with two independent controls, low consequences and no separate builder: short; a user answer adds an ask/end-turn round, not a full review (D257);
  6. building shows the design is wrong: the design changes first, through discuss and decide, then building resumes;
  7. a full design with no record-saving skill loaded and no file named: the agent writes it to a new file named for what is designed and names the file in the final answer, asking nothing about the place (D293); with a matching record-saving skill loaded, kept where that skill says, none of its steps named (D281);
  8. a software design: architecture added through a skill in the harness’s list for that work, if one fits; otherwise this design’s own generic parts and connections only (D281);
  9. a design grown large: divided into documents through the `organize` guide;
  10. a decision others will build on: challenged before approval;
  11. "add dark mode and release it": plan, its one open choice asked through the `respond-ask` guide, not design (D173);
  12. only the design wanted: no plan follows (D173).
  13. The same small deliverable is short with independent reversible choices, full when another builder needs its contract or a mistake has consequential effects. Longevity alone does not make it full. (D257);
  14. A short design with no missing user answer returns briefly; a material user answer requires ask/end-turn and resumes without the full review. (D257);
  15. A plan calls design for one open part: return that part, never start a second plan. A direct design-only request never starts building. (D257);
  16. A convention-set choice follows understand; an easy-to-undo user preference still belongs to the user. An agent default follows the current disclosure timing. (D257);
  17. A full review returns missing checks: design accounts for them before approval and does not claim independent completion. (D257);
  18. A full design has no relevant risks or open questions: omit empty fields, preserve the actual requirements and reasons. (D257);
  19. Already available project facts settle a short-design question: read them instead of asking. A lasting edit still follows the `act` guide's timing. (D257);
  20. A design whose chosen values include times, counts or sizes: each chosen value has a reason, or a stated basis that covers it with others, or is marked as an assumption with what would settle it (in a full design, under Open); a value from the user or a source names that source. Reject: reasons only for the main choices, with the chosen values left bare, or a value with a made-up reason or only called a guess (D293, D307).
- **Open:** none known.

### review

- **Purpose:** a design checked before it is approved: whether it holds together, covers what it must, and can be built from (D168). It holds what is its own, consistency and a builder walk-through, and runs the other checks from their homes as lenses.
- **Guide purpose** (D283): Checks whether a design holds together, covers its requirements and can be built.
- **Guide shape** (D283): Instructions opens with: “Give the design owner findings they can act on. Check the design against its basis without changing it.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Read the design basis with independence arranged, run consistency, builder, coverage, challenge, sizing and available specialist lenses, then return ranked findings. Keep nine steps; check evidence, pending lenses and independence without editing or waiting for resolution. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "A design checked before approval: consistency, a builder walk-through, coverage and overlap, challenge, lean, and architecture when a skill in the harness’s list covers that review; findings ranked, each with a fix, the reviewer only proposing. Use before a full design is approved, after a large change to one, or when a design review is asked for." A draft (D168, D281).
- **When to use** (D279, D293): Use for a full design, a large change to a design, or a request to review a design. For example, walk through whether a builder can handle the design’s main cases and failure paths.
- **When not** (D279):

  - Code review: use a skill in the harness’s list for reviewing code, if one fits. Otherwise use your judgment. This review checks a design, not its implementation.
  - Completion evidence: use the `act-verify` guide to check a claim about finished work.
  - One idea: use the `understand-challenge` guide for weak points. It does not need a full design review.
  - A skill’s design: use the project’s skill-making method, otherwise your judgment. That method holds its design checks.
- **Callers:** design’s review step, after discussion and before a full design is approved; the main skill’s map, with the parent path read first (D279); a skill in the harness’s list for reviewing finished work, if one fits and needs a design review (D39, D154, D281); the person, asking for a design review or typing it.
- **Flow** (D168):

  **One home per check:** gaps and overlaps between parts are the `organize` guide's check; contradiction, two things that cannot both hold, is review's; drift and coverage of built work against its design are the `act-verify` guide's; weaknesses, such as assumptions, failure modes and what would break it, are the `understand-challenge` guide's; what is extra is the `act-rightsize` guide's lean's. Each check is written once, in its home, so the checks cannot drift apart (D123, D168).

  **Lenses:**
  1. **consistency,** its own: no part contradicts another part, a decision or the requirements, and each term is used one way;
  2. **builder walk-through,** its own: the main cases and the edge cases walked through the parts, each with a part that handles it, and a builder able to follow it without asking;
  3. **coverage and overlap:** the `organize` guide's check, on the design's parts against its requirements, through the main skill;
  4. **challenge,** through the `understand-challenge` guide, for consequential decisions others will build on. Reuse an earlier challenge only as that guide's rule 7 allows (D252, D293);
  5. **lean:** what lean would remove; removing it is lean's (D157);
  6. **architecture,** for a software design only: use a skill in the harness’s list for reviewing software architecture, if one fits; otherwise say in the findings that this review was not done. Designs that are not software skip this lens, since reporting its skip there is noise (D281, D293).

  Review finishes when it returns ranked findings from the required lenses, with missing checks marked. It does not wait for the caller to resolve them. Design owns fixing, accepting or parking findings and accounts for outstanding checks before approval (D257).

  **Steps:**
  1. read the design, with what it must cover: the frame, the requirements and the decisions;
  2. run each lens with an independent reviewer, by the `act-verify` guide's rule 2. A reviewer already fresh from the writer may do it; otherwise arrange a fresh agent, since a fork shares the writer's blind spots. A large review uses one agent per lens through the `coordinate-delegate` guide when allowed. If no independent agent can be started, return provisional findings, mark that check outstanding and name its next owner. A delegated worker returns that need to its caller instead of delegating again. A missing run record alone proves no unavailability (D257);
  3. report the findings, ranked "must fix before approval", "should fix" and "note", each with where, what, why it matters and a suggested fix;
  4. propose only, since what changes is decided in design's discuss and decide, by the person: the findings go back there, and the fixes are made by rewriting the design.

  5. **Check that every required lens has a result or is marked unfinished.** Always do this last. Support findings with evidence. Leave the design unchanged. Return the findings to the caller to fix, accept or park before design approval. Never claim independent completion without another reviewer's result.
- **Gives back** (D279): Ranked findings with fixes, or a list of checks run when no problem was found. Mark unfinished checks. The design owner resolves findings before approval.
- **Files:** `references/devise/design/review.md`. Needs an independent reviewer; if unavailable, follow the `act-verify` guide's rule 2 and return provisional findings with the next owner (D257).
- **Material:** trailscout's design documents and mattpocock's skills (D39); the blueprint method's review after consolidation, by a fresh agent rather than the one that consolidated.
- **Tests** (D168):
  1. two parts handling the same case: an overlap, through the `organize` guide's check;
  2. a requirement no part covers: a gap;
  3. a part contradicting a decision: a consistency finding, "must fix before approval";
  4. an edge case no part handles: a walk-through finding;
  5. the design left unchanged by the reviewer, who only proposes;
  6. a full design: reviewed by a fresh agent, one agent per lens when it is large;
  7. "review this code change": a skill in the harness’s list for code review, if one fits, otherwise judgment, not this design review (D281);
  8. no findings: the report names the lenses that ran;
  9. a decision already challenged with unchanged inputs: reuse that challenge; changed evidence or constraints: challenge again before relying on it (D252);
  10. no skill in the harness’s list covers software architecture review: for a software design, skip that review and report the skip; a design that is not software reports nothing about it (D281, D293).
  11. No independent agent can start: return provisional findings with the check outstanding and next owner; never count a second self-read as independent. (D257);
  12. The reviewer is delegated and cannot start agents: return the outstanding check to its caller, without further delegation. (D257);
  13. Return findings before the caller resolves them; design, not review, fixes, accepts or parks them. (D257);
  14. No helper event appears in the record: alone this proves neither absence nor unavailability; preserve D242 uncertainty. (D257);
- **Open:** none known.

## plan

- **Purpose:** planning multipart work before acting, and following a plan step by step, whether writing, research, design or code: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong (D151, D155). It uses the current agent’s own controls with its text fallback (D267). The work around it already has homes, listed under "It uses" in its Callers field; a skill in the harness’s list for software work can add its own breakdown, slices and sequence (D154, D155).
- **Guide purpose** (D283): Makes and follows plans for multipart work, keeping approval and progress explicit.
- **Guide shape** (D283): Instructions opens with: “Keep multipart work clear, approved where needed and checked as it proceeds. Build on the current plan or given steps.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Keep planning read-only where requested, preserve the current plan, expand only non-obvious steps, track progress, obtain scoped approval and execute in dependency order. Keep seven steps; final checks cover current input, full-plan challenge, obvious steps, evidence and remaining work. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Planning multipart work before acting, and following it step by step: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong. Use before any work with more than one step or part, or when given steps to follow; an open shape met on the way is designed, through design, and the plan continues (D173)." A draft (D155).
- **When to use** (D279): Use for work with more than one step or part, including given steps to follow. Also use to follow or update an existing plan, even with one item left. New user input in a later turn may change that plan. Judge the work, not its wording: finding a pottery glaze fault may take several steps, while a direct fact may need none.
- **When not** (D279): Use these alternatives when the work needs no plan. If one is needed for a part of an existing plan, use it for that part and return to the plan.

  - An exact single-step action with no existing plan to follow or update: use the `act` guide directly. Correcting one specified accent mark may need no plan.
  - One risky action: use the `act-guardrails` guide for its proposal and approval.
  - One choice: use the `understand` guide to settle who decides and what information is needed.
  - A requested view: follow the `act` guide’s rule 2. A read-only plan may help the view, but it grants no permission to act.
  - An open part of what to make: use the `devise-design` guide for that part, then return to the plan. Steps need a settled design.
- **Callers** (D155):
  - the `devise` guide itself, from the main map, with its parent path read first (D279);
  - act, through the main skill, whose rule points here for when to plan;
  - design, its sibling under the `devise` guide, by name, at its hand-over to building (D168);
  - the `coordinate-delegate` guide's crew, whose first step plans the parts (D155);
  - the `understand-discuss` guide, for a plan's open parts, through the main skill;
  - the person, typing it.

  It uses the `organize` guide, to divide a full plan; the `understand-clarify` guide, for an unclear goal or done, frame, to state a full plan's goal, research, for something a step needs found out, and challenge, to check a full plan; the `respond-ask` guide, for the person's choices; the `act-stakes` guide, for how high the stakes are, and the `act-verify` guide, for each step's check; the `coordinate-delegate` guide, to hand parts to agents; all through the main skill, since they are in other groups. It uses design, its sibling under the `devise` guide, by name, for an open shape met on the way (D173).
- **Flow** (D151, D155). Planning has two halves: making a plan, and following one. Rules, each with its reason:
  1. **A requested view stays read-only.** Follow the `act` guide's rule 2. A shown plan does not give permission to execute it. The multipart test and the existing-plan exception are in this guide's boundary (D279).
  2. **Given steps are followed, and enhanced where they are not obvious:** steps count as given when they come from the person, a guide's or skill's ordered instructions, tasks a keeper holds, a plan already approved and carried over, or a checklist the project keeps. People usually name the main items and leave the rest to the agent, so given items are the top of the plan: missing items are added and marked, by the `organize` guide's check, the items set against the goal; items that are not obvious are expanded; obvious ones are left. The person's items keep their place and their wording, and reordering or dropping one is asked first, since they were the person's choice.
  3. **The obvious test sets how far any plan goes:** a step is obvious when the agent could do it now, knows how it will be checked, and has no choice left that would change the result and nothing to find out first. What failed says what to do: parts not yet known, the `organize-split` guide; an unclear goal or done, the `understand-clarify` guide; an open choice, handled by the `understand` guide's who-decides rule, with the `understand-brainstorm` guide for new options or the `understand-weigh` guide for comparison. The caller owns continuation from their results (D252); an open shape, parts or choices that depend on each other, through design, its sibling, by name, the plan continuing from its result (D173); something to find out, a quick look or the `understand-research` guide. Each new step is tested again, and expanding stops when every step passes: nothing obvious is expanded and nothing unclear is left, the `act-rightsize` guide applied to a plan (D145).
  4. **Use the `understand` guide's whole who-decides rule.** It owns user intent, preferences, irreversible effects, conventions, agent defaults and visible choice timing. Plan defines no second ownership test (D257).
  5. **One line, or a full plan:** a full plan when stakes are high, as the `act-stakes` guide rates them, or the work is long or wide; otherwise one line, holding the chosen way to do the work, the steps in order and the check. A full plan is divided through the `organize` guide, and challenged through the `understand-challenge` guide before it is shown, since others build on it (D150). What the challenge found goes in the plan's "Challenge" field, so the user sees it with the plan; an earlier challenge is reused only as that guide's rule 7 allows (D293).
  6. **Following, whoever wrote the steps:** at three steps or more, since fewer are held in mind without one, the steps go in a checklist, the harness's task list where it has one, otherwise a plain-text list in the response (D293); they are done in order, each checked by the `act-verify` guide before the next, since a step that fails unnoticed costs every step built on it, and ticked off. A given step that looks wrong is raised before going on, as the `act` guide's rule on concerns says; a step that fails stops the list and goes to re-planning.
  7. **Approval, for either depth:** get the user's actual approval before executing a high-stakes plan. This is a stricter variation of the `act` guide's rule 13, where the person's request is the go-ahead: that go-ahead does not approve high-stakes work, since steps the user listed may not show what could go wrong, and high-stakes work is hard to undo (D293, D312). Given steps alone are not approval. A request for a plan authorizes making the plan, not executing it. Reuse an unchanged approval only within its scope and basis. New questions go through the `respond-ask` guide. For other changing work, follow the `act` guide's rule 13: show the plan and end the turn only when the user must decide something first (D312). A rota or a set of renewal letters in new files, or a settings switch that leaves the old file alone, where nothing needs the user's decision, goes ahead in one turn; D293 and D250 stopped such work for approval, and in the trial both models had already done it at once and reported steps and checks well. When the work goes ahead without a stop, the final answer gives each step with its result, as the `act` guide's rule 13 says; plan points there and does not restate it. When a stop is needed, the plan and the question go in the final message, asked through the `respond-ask` guide, and the turn ends. Read-only work needing no answer also goes ahead without stopping first, its steps and results in the final answer (D293, D312). Where approval is required, use an available permitted plan mode and return the approval request; otherwise put it in the final message and end the turn. Mode changes alone are not approval. Plan approval never waives a separate guardrail. Use the current agent’s own available plan and task controls, with the response fallback for missing controls (D267).
  8. **Re-planning:** revise the current plan after a failed step, a changed fact it depends on, or new user input in a later turn. Start from the existing plan so open work is not lost. Keep open items, add the requested work, change or remove what the new input replaces, and mark an item finished only after its check, by rule 6 (D293). Revise even when the old step text has not changed. Get approval again when the original plan required it. Ask the user about proposed changes to steps they gave. If a failure shows that the design is wrong, revise the design first and then the plan (D168, D279).
  9. **Where it is kept, plan's own part only** (D156): in the response when it fits on a screen; in a file when it is longer, the response giving the outline. Which file, and in what form, is a keeper's, as chosen by the project’s instruction files, so plan never names one; by default, a file the agent names in the response.

  Advice (D116): long or wide means more than about five steps, more than one sitting, or parts that could each go to a different agent, the size where a plan keeps the work from wandering and lets parts be delegated. When unsure whether the work is multipart, it is treated as multipart (the `act` guide's rule 13, D250); re-planning catches the rest when the work turns out bigger.

  Use the current agent’s own available plan and task controls; otherwise keep the plan and checklist in the response (D267).

  With neither capability, return an approval plan in the final message and end the turn. Track three or more steps in a plain-text checklist. Tick a step only after its check passes. With only one capability, use it and keep the fallback for the other. Install or enable nothing to obtain a capability (D257).

  Instructions, in the order the work happens (D155):

  1. **Return the requested plan.** Keep planning separate from execution; asking for a plan does not approve the work (D279).
  2. **Keep the current work.** Read the existing plan and given steps. Keep open items, mark additions and finished items, and check each step with the obvious test (D279).
  3. **Make the plan** where none is given: the goal; the steps, expanded by the obvious test; then one line or a full plan, by rule 5. A full plan is divided through the `organize` guide, by its rules: split for the parts; merge where two steps do the same thing; compose where steps group into phases; normalize where a step repeats across parts, so it is done once. The order of the steps is plan's own, since the `organize` guide arranges boundaries, not sequence. The `organize` guide's two approvals do not apply, since nothing existing changes; plan's approval does (D148).
  4. **Challenge** a full plan through the `understand-challenge` guide, and put what it found in the plan's "Challenge" field (D293).
  5. **Approval,** by rule 7: a high-stakes plan needs actual approval even with given steps; for other changing work, follow the `act` guide's rule 13, and stop only when the user must decide something first. When the work goes ahead or only reads, give each step with its result in the final answer (D312).
  6. **Follow,** by rule 6, and **re-plan** by rule 8.
  7. **Check the result before returning it.** Always do this last. Before a plan is shown: a new single-step action needs no plan, but an existing plan is kept even with one item left. Open items stay, additions and finished items are marked, and new user input is reflected. Every step passes the obvious test. A full plan is divided, challenged with its findings shown, and leaves out empty sections. Get approval where rule 7 requires it (D279, D293).
- **Gives back** (D155, D279, D293): The one-line or full plan, its actual approval status, and the checklist showing which steps were checked when execution was allowed. A full plan also shows what its challenge found.

  ```text
  Goal:       what is wanted, and how it is known to be done
  Steps:      in order, each with its check; added items marked
  Out:        what is out of scope
  Risks:      each risk, and what catches it
  Agents:     what goes to agents
  Challenge:  what the plan's challenge found, and what it changed
  ```

  For example, "move the docs site to a new generator", divided by page set into phases, the build set up once:

  ```text
  Goal:       the same pages at the same addresses, the build passing
  Steps:      prepare: 1. list every page   2. convert one page as a trial, the build set up once here
              convert: 3. convert the rest, by folder
              check:   4. add redirects   5. compare the page list before and after
  Out:        rewriting any content
  Risks:      broken links, caught by the link checker; a lost page, caught by step 5
  Agents:     step 3 fanned out by folder
  Challenge:  the menu may not list every page; step 1 now lists the built site's files instead
  ```

- **Files:** `references/devise/plan.md`. Use the current agent’s available plan/task controls and the parent’s text approval/checklist fallbacks (D267).
- **Material:** superpowers' writing-plans ([../../research/skill-collections.md](../../research/skill-collections.md)); the harnesses' own plan modes and task lists.
- **Tests** (D155):
  1. "fix the typo in the README": single-step, no plan, done directly; "delete the old folder": a proposal under guardrails, not a plan; a single-step change whose two options give the person different results: asked through the `respond-ask` guide when the choice is the person's, or handled as an agent choice by the full the `understand` guide's rule, including its disclosure timing and exceptions (D217, D218);
  2. "add dark mode and release it": the person's two items kept at the top; a test that both themes render added and marked; "add dark mode" expanded, its parts found and "follow the system setting, or a switch in the app?" asked; "release it" left as it is where the project keeps release steps; the checklist followed;
  3. "delete the old folder, then copy the files out of it": the order raised before acting, since it would lose the files; a step of the person's own that fails: the revised steps go back to them before the work goes on;
  4. a multipart link correction with no given steps, where nothing needs the person's decision first: the corrections made in the one turn, and the final answer giving each step with its result; where the person must decide first, such as two sources that disagree on a fact the work needs: the plan shown with the question and the turn ended before changes; given exact corrections with permission to proceed: rule 13 of the `act` guide applies (D257, D312); "write the release notes": one line and, at four steps, the checklist;
  5. "migrate the user data to the new database": high stakes, so a full plan, challenged, what the challenge found shown in its "Challenge" field (D293); "compare twenty tools for us": wide, so a full plan divided through the `organize` guide; a full plan with nothing out of scope: no "Out" section;
  6. approval: the migration plan waits; "move the docs site to a new generator": holds the person's choice of generator, so it waits; the twenty-tool plan, read-only and needing no answer: proceed and give the plan in the final answer; a plan the person asked for: waits;
  7. a plan that waits, in a harness with a plan mode: the mode used; in one without: the plan in the response, the agent waiting;
  8. where it is kept: a plan that fits on a screen, in the response; a longer one, in a file the response names, with the outline; a project whose instructions name a record-saving skill: the file and form that skill says, plan’s own text naming none (D156, D281);
  9. "what do you think about X?": a view, and a plan where one helps, the plan shown, nothing started;
  10. across kinds of work: writing, the release notes; research, the twenty tools; design work, "design the data model and the screens", each a step that runs design, the data model before the screens that show it (D173); code, the user-data migration;
  11. a plan meeting parts that depend on each other, such as "add sync" with conflict handling still open: design run for that part, the plan continuing from its result (D173).
  12. Given high-stakes steps without actual approval: return the plan for approval and make no changes. A currently approved plan with unchanged scope/basis needs no duplicate approval. (D257);
  13. The step wording is unchanged but a fact it rests on changes: revise before continuing and obtain any required new approval. (D257);
  14. A user asks only for a plan: return it, never execute it. A read-only job with no question proceeds and gives its plan in the final answer. (D257);
  15. A direct factual question needs no plan; a question requiring multiple research steps is planned according to the work. (D257);
  16. An agent default, a project convention and a user preference follow the `understand` guide's complete rule and its exceptions. (D257);
  17. A plan calls design for an open part, then resumes its own list without a duplicate planning round. (D257);
  18. No plan mode and no task list: approval in final text, end turn, plaintext checklist after approval; no installation. (D257);
  19. Plan mode only: use permitted mode controls and a plaintext checklist. Task list only: text approval and native tracking. (D257);
  20. A mode transition or checked task box without a user answer is not approval or verification. (D257);
  21. A plan approval exists but an outward or irreversible action has its own guardrail: keep that check. (D257);
  22. A full plan contains independent work: phases retain their order while independent parts can be handed to available agents; no forced serial repetition within one part. (D257);
  23. An approved plan remains blocked by the session’s edit restriction. Reject: Treats approval as permission to bypass an edit restriction, invents an available exit control, or claims a live mode change. (D267).
  24. Uses its own available planning controls with an honest text fallback. Reject: Executes a plan-only request, omits usable checked steps, or invents successful control calls or verified completion. (D267).
  25. Work with several parts and new files only, no steps given, where nothing needs the person's decision, such as a volunteer rota for a three-day book sale and a note to each volunteer: done in the one turn; the answer gives each part with its result, the check and what it found, and the choices made. Reject: A stop for leave to do what was asked, a rota that misses a key holder, or a report with no check (D312).
  26. Work with several dependent parts, small and leaving the old file alone, such as a reminder tool's settings moved from an INI file to a JSON file: done in the one turn, each step with its result. Reject: A stop for leave, or a report with no steps (D312).
  27. Held out, written by a second reviewer apart from the fix: a specified conversion and aggregation into two new files, with every value and ordering rule given: done at once; a mailing to be prepared from three sources, by email where possible and by post otherwise, with next year's dates: done at once, each part with its result. Reject: Stopping for approval, losing a score, miscalculating a total, or reporting completion without the check and what it found (D312).
  28. Updating a letter and a form from a third source that disagrees on the trip date: the plan shown, the clash named and the question asked, with nothing changed; turn 2 updates both with the person's date. Reject: Updating the files with one of the dates, or asking with no plan (D312).
  29. Near miss: one name respelled everywhere it appears in one page: done at once with no plan, and this guide stays closed. Reject: A plan and a stop for approval, or reading the plan guide (D312).
  30. Two turns: work with several parts done in turn 1 with its plan; in turn 2 the person adds input that changes one step and adds one, such as a later deadline and one more group to send to: the plan revised from the open one by rule 9, finished items kept, the changed step redone and checked, the new one added, and the final answer giving what changed with each result. Reject: a fresh plan that loses finished or open items, or the new input applied with no step checked (D329).
- **Open:** live tool availability and approval flows need interactive validation. Available controls vary by agent and session. Use the conditional text fallback for missing controls (D267). Model behavior is untested under D253 (D257).
