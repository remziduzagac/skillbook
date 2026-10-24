# Design: devise

What a builder needs for devise, essentials' group for deciding what the work will be and its steps (D164), and for its sub-skills, design with its review, and plan, which follow as sections; ideas not yet decided are in [../../ideas/design.md](../../ideas/design.md) and [../../ideas/plan.md](../../ideas/plan.md). Every section answers the same questions (D80); an empty field is not designed yet.

devise belongs to the essentials set (D152, D154, D164). softeng's own design, with architecture, is in [../softeng/design.md](../softeng/design.md); the blueprint set's recording steps are in [../blueprint/blueprint.md](../blueprint/blueprint.md) (D152, D154, D167). plan's software parts, breakdown, slices and sequence, are kept, word for word, in [../../ideas/plan.md](../../ideas/plan.md), "Kept for the person's software-engineering skills", and belong to softeng (D151, D152, D154).

How skills reach each other here (D107): a skill of the set, in the same group or another, is named by its name and read as a file by the main skill's name rule; a skill in another set is reached by loading that set's main skill and using the skill by its name rule; where that set is not installed, the one-line fallback written where it is used holds, and a request pointed to it is done directly under act's rules, as the main skill says (D152, D186, D187). This holds in design, its review and plan too.

```text
devise/
├── design/    how to design anything
│   └── review/
└── plan/      planning multipart work, and following the plan; references/ for each harness's plan mode
```

## devise

- **Purpose:** deciding what the work will be and the steps to get there: design, how to design anything, and plan, planning multipart work before acting and following the plan (D164). Its own `SKILL.md` routes only, with no rules of its own, since its two share none (D112, D164).
- **Description:** "Deciding what the work will be and its steps: a design for something new or changed, a plan for multipart work, and the plan followed. Use when something new or changed is to be designed, or the work is multipart or steps are given to follow." A draft (D164).
- **Callers:** the main skill, by its routing line (D164, D171, D172); other groups, through the main skill, such as understand's discuss for a design's or a plan's open parts; another set, through essentials' main skill by name, such as softeng, which adds its own design and plan's software parts, and blueprint, which keeps their results (D152, D156); the person, typing it.
- **Flow:**

  **Scope:** when the request's main question is what something will be, which devise sends to design, or the steps of multipart work to do, build or release, or steps given to follow, which it sends to plan (D173); not for single-step work or a view asked for, each sent where plan's line says; it gives back what its sub-skill returns (D155, D164, D168, D171).

  Instructions, one routing line per sub-skill:
  - **design:** when the request's main question is what something will be: something new or changed whose shape is not settled, or a design asked for; not for one open choice (respond's ask, with understand's brainstorm or weigh when options are wanted), an unclear request (understand's clarify), the steps of settled work (plan), rearranging what exists (organize) or a document for readers (authoring); it gives back the design, short or full, approved, and for a full one its review (D168);
  - **plan:** when the request's main question is the steps: multipart work to do, build or release, or steps given to follow; not for single-step work, which is done directly, what something will be (design, which plan also calls for an open shape it meets on the way), a single risky action (act's guardrails), the person's choice in single-step work (respond's ask), or a view asked for, which is act's rule, its plan made in plan but only shown; it gives back the plan, one line or full, and the checklist followed (D155, D168).

  When both apply, design runs first and hands on to plan, by its step 8 (D168). A request that fits neither line is done with the agent's own judgment, under act's rules.

  **Last instruction, before anything is returned:** the sub-skill's own last instruction holds (D134).
- **Result:** whatever the sub-skill returns.
- **Files:** `SKILL.md` only (D164).
- **Material:** none of its own.
- **Tests** (D164):
  1. "add dark mode and release it": plan, the person's two items kept at the top, missing and non-obvious steps found (D155);
  2. "fix the typo in the README": single-step, no plan, done directly (D155);
  3. "design a CLI for X": design, a full design (D168);
  4. "a settings page with two toggles": design, a short design (D168);
  5. "design a CLI for X, then build it": design first, then plan, by design's hand-on (D168);
  6. "make our onboarding better", its goal unclear: understand's clarify first, not design;
  7. "reorganize these folders": organize, not design;
  8. "write a user guide for X": authoring, a document for readers, not design.
- **Open:** none known.

## design

- **Purpose:** deciding what something will be before it is made: what it is for, its parts and how they connect, how it behaves, and the decisions behind it, each with its reason (D168). Anything: a feature, a tool, a set of skills, a folder layout, a process, a document's structure. softeng's design adds how good software is designed, architecture among it, and a keeper such as blueprint keeps the records; this method works without either (D154, D156, D168).
- **Description:** "How to design anything: what something will be, decided before it's made: its purpose, its parts and how they connect, its behaviour and its decisions, framed, divided, discussed, written and reviewed. Use when something new or changed is to be made and what it will be isn't settled, or a design is asked for." A draft (D168).
- **Callers:** devise's own skill, by its routing line in devise's flow (D168, D172). Its other callers: plan, its sibling, by path, for an open shape met on the way, continuing from design's result (D173); softeng's design, through essentials' main skill by name, adding architecture (D152, D154); the person, typing it.
- **Flow** (D168):

  **Three checks,** in order:
  1. **Is what to make settled?** Then there is no design: it goes to plan, or is done directly. Settled means the agent could describe what it will make in a few lines, and what is open, if anything, is a single choice a question can settle, asked through respond's ask, a variation of plan's obvious test, which asks the same of a step (D155, D173).
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
  1. **frame,** through `understand-frame`: the goal, constraints, scope and a good answer. Get the audience from the caller or known context. Use `understand-clarify` for user intent that would change the result. Return the frame with the read-only design answer. Apply `understand`'s who-decides rule and `act`'s plan rule before changes; frame adds no checkpoint (D252);
  2. **analyse what exists:** the current thing, its documents and earlier decisions read before anything is asked; outside facts, such as how others solve it or a tool's limits, through understand's research;
  3. **divide into parts,** through organize, planning a whole not yet written: the requirements are the items, split into parts with each boundary in one sentence (D148); for software, softeng's design adds architecture here, through softeng's main skill, where that set is installed; where it is not, design's own parts and connections only;
  4. **discuss and decide:** open questions through `understand-discuss`, one item at a time. Use `understand-brainstorm` for options and `understand-weigh` for a comparison when needed. Reuse a comparison already returned instead of weighing twice. Use `understand-challenge` for consequential decisions before relying on them, reusing a current challenge while its inputs remain unchanged. The agent recommends; the user decides. The caller owns lasting changes and records (D252);
  5. **write** the design, top-down, holding the parts below;
  6. **review** it, through review, by path: when a design is to be checked, before approval or after a large change; not for code or a change about to land (softeng's review), whether work is done (act's verify), a single idea (understand's challenge) or a skill's own design (the project's skill-making skill where it has one, otherwise the agent's own judgment); it gives back the findings, ranked, or with none the lenses that ran; problems go back to step 4;
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

  A short design holds the purpose, the parts and the choices with their reasons, with open questions if any. A design says what the thing is as agreed now: a change rewrites it, and its history goes to the keeper, or without one to its decisions part. It is laid out by respond's layout and rightsized by act's rightsize; grown large, it is divided into documents through organize, each sized to how it is read (D148). A diagram is drawn only where connections are easier to see than to read, as text in a code block.

  Other skills are steps of this flow, never sub-skills of design; review, with rules of its own, is its only sub-skill (D168).

  **Last instruction, before a design is shown or kept:** settled work got no design; a given design's additions are marked as added; every decision carries its reason; open questions are listed with what would settle each, every assumption marked; a full design was reviewed, each finding fixed, accepted with a reason or parked, and approved by the person before plan; a short one waits only for a choice that is the person's; it is kept where "Where it is kept" says.
- **Result:** the design, short or full; for a full one, its review and the person's approval.
- **Where it is kept** (D156, D163, D168): a short design stays in the response. A full design goes in a file the person names; when they name none, the agent asks, recommending a file named for what is designed, where the project keeps its documents, since a full design lost with the conversation would have to be redone. Where the project's instruction files point to a keeper, such as blueprint's main skill, it is kept where the keeper says, and design names none of the keeper's steps.
- **Files:** `SKILL.md` only (D168).
- **Material:** the draft flow in [../../ideas/skill-tree.md](../../ideas/skill-tree.md); the blueprint method ([../../../docs/blueprint/idea/blueprint.md](../../../docs/blueprint/idea/blueprint.md)) and its worked example; this repository's own way of designing, as a worked example; adapted, never copied (D120).
- **Tests** (D168):
  1. "design a CLI for X": a full design, framed, divided, its open questions one at a time, written with the eight parts, reviewed by a fresh agent and approved before plan;
  2. "add a --verbose flag": settled, so no design; plan or done directly;
  3. a spec with gaps: followed, the gaps filled and marked as added;
  4. "where should this helper live?": one question, so brainstorm or the agent's own choice, not design;
  5. "a settings page with two toggles": a short design in the response, with no review, waiting only for a choice that is the person's;
  6. building shows the design is wrong: the design changes first, through discuss and decide, then building resumes;
  7. a full design with no keeper loaded and no file named: the agent asks, recommending a file; with blueprint loaded, kept where blueprint says, none of its steps named;
  8. a software design: architecture added through softeng's main skill where that set is installed; where it is not, design's own parts and connections only;
  9. a design grown large: divided into documents through organize;
  10. a decision others will build on: challenged before approval;
  11. "add dark mode and release it": plan, its one open choice asked through respond's ask, not design (D173);
  12. only the design wanted: no plan follows (D173).
- **Open:** none known.

### review

- **Purpose:** a design checked before it is approved: whether it holds together, covers what it must, and can be built from (D168). It holds what is its own, consistency and a builder walk-through, and runs the other checks from their homes as lenses.
- **Description:** "A design checked before approval: consistency, a builder walk-through, coverage and overlap, challenge, lean, and architecture where softeng is installed; findings ranked, each with a fix, the reviewer only proposing. Use before a full design is approved, after a large change to one, or when a design review is asked for." A draft (D168).
- **Callers:** design's flow, by path, before a full design is approved, by its routing line in design's step 6 (D168, D172); softeng's review, for a design, through essentials' main skill (D39, D154); the person, asking for a design review or typing it.
- **Flow** (D168):

  **One home per check:** gaps and overlaps between parts are organize's check; contradiction, two things that cannot both hold, is review's; drift and coverage of built work against its design are act's verify's; weaknesses, such as assumptions, failure modes and what would break it, are understand's challenge's; what is extra is act's rightsize's lean's. Each check is written once, in its home, so the checks cannot drift apart (D123, D168).

  **Lenses:**
  1. **consistency,** its own: no part contradicts another part, a decision or the requirements, and each term is used one way;
  2. **builder walk-through,** its own: the main cases and the edge cases walked through the parts, each with a part that handles it, and a builder able to follow it without asking;
  3. **coverage and overlap:** organize's check, on the design's parts against its requirements, through the main skill;
  4. **challenge,** through `understand-challenge`, for consequential decisions others will build on. Reuse the earlier challenge only while the idea, goal, constraints and evidence remain unchanged. Changed inputs need renewed scrutiny (D252);
  5. **lean:** what lean would remove; removing it is lean's (D157);
  6. **architecture:** softeng's lens, through its main skill where that set is installed; where it is not, skipped and said so.

  **Steps:**
  1. read the design, with what it must cover: the frame, the requirements and the decisions;
  2. run each lens; every review is done by a fresh agent, not its writer, since a fork shares the writer's blind spots; a large one by one agent per lens, through coordinate's delegate;
  3. report the findings, ranked "must fix before approval", "should fix" and "note", each with where, what, why it matters and a suggested fix;
  4. propose only, since what changes is decided in design's discuss and decide, by the person: the findings go back there, and the fixes are made by rewriting the design.

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
  8. no findings: the report names the lenses that ran;
  9. a decision already challenged with unchanged inputs: reuse that challenge; changed evidence or constraints: challenge again before relying on it (D252);
  10. softeng not installed: the architecture lens skipped, and said so.
- **Open:** none known.

## plan

- **Purpose:** planning multipart work before acting, and following a plan step by step, whether writing, research, design or code: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong (D151, D155). It has no parts, since the work around it already has homes, listed under "It uses" in its Callers field; softeng's own plan adds breakdown, slices and sequence for software (D154, D155).
- **Description:** "Planning multipart work before acting, and following it step by step: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong. Use before any work with more than one step or part, or when given steps to follow; an open shape met on the way is designed, through design, and the plan continues (D173)." A draft (D155).
- **Callers** (D155):
  - devise's own skill, by its routing line in devise's flow (D164, D172);
  - act, through the main skill, whose rule points here for when to plan;
  - design, its sibling under devise, by path, at its hand-over to building (D168);
  - coordinate's delegate's crew, whose first step plans the parts (D155);
  - understand's discuss, for a plan's open parts, through the main skill;
  - the person, typing it.

  It uses organize, to divide a full plan; understand's clarify, for an unclear goal or done, frame, to state a full plan's goal, research, for something a step needs found out, and challenge, to check a full plan; respond's ask, for the person's choices; act's stakes, for how high the stakes are, and act's verify, for each step's check; coordinate's delegate, to hand parts to agents; all through the main skill, since they are in other groups. It uses design, its sibling under devise, by path, for an open shape met on the way (D173).
- **Flow** (D151, D155). Planning has two halves: making a plan, and following one. Rules, each with its reason:
  1. **Only multipart work is planned:** work that needs more than one step or part, as the agent sees it, whatever the wording; "fix the failing test" is one step when the error shows the cause, and several (reproduce, find the cause, fix, test again) when it does not. Single-step work needs no plan, since what a plan would add there already has a home: the person's choice goes to respond's ask, the agent's is simply made, and a single risky action is a proposal under act's guardrails. An answer to a question is single-step. A view asked for gets act's "a view and a plan": the plan is made here, shown, and never started.
  2. **Given steps are followed, and enhanced where they are not obvious:** steps count as given when they come from the person, a skill's ordered instructions, tasks a keeper holds, a plan already approved and carried over, or a checklist the project keeps. People usually name the main items and leave the rest to the agent, so given items are the top of the plan: missing items are added and marked, by organize's check, the items set against the goal; items that are not obvious are expanded; obvious ones are left. The person's items keep their place and their wording, and reordering or dropping one is asked first, since they were the person's choice.
  3. **The obvious test sets how far any plan goes:** a step is obvious when the agent could do it now, knows how it will be checked, and has no choice left that would change the result and nothing to find out first. What failed says what to do: parts not yet known, organize's split; an unclear goal or done, understand's clarify; an open choice, handled by `understand`'s who-decides rule, with `understand-brainstorm` for new options or `understand-weigh` for comparison. The caller owns continuation from their results (D252); an open shape, parts or choices that depend on each other, through design, its sibling, by path, the plan continuing from its result (D173); something to find out, a quick look or understand's research. Each new step is tested again, and expanding stops when every step passes: nothing obvious is expanded and nothing unclear is left, act's rightsize applied to a plan (D145).
  4. **A choice is the person's** when the options give them different results they would care about, such as scope, cost, how it looks or a public interface; it is the agent's when only the route differs, since then the person gets the same thing either way.
  5. **One line, or a full plan:** a full plan when stakes are high, as act's stakes rates them, or the work is long or wide; otherwise one line, holding the approach where a choice was made, the steps in order and the check. A full plan is divided through organize, and challenged through understand's challenge before it is shown, since others build on it (D150).
  6. **Following, whoever wrote the steps:** at about three steps or more, since fewer are held in mind without one, the steps go in a checklist, the harness's task list where it has one; they are done in order, each checked by act's verify before the next, since a step that fails unnoticed costs every step built on it, and ticked off. A given step that looks wrong is raised before going on, as act's rule on concerns says; a step that fails stops the list and goes to re-planning.
  7. **Approval, for either depth:** a plan waits for the person when stakes are high, the person asked for a plan, or it holds a question for them; otherwise it is shown and the work starts only for work that changes nothing; whether a plan for work that changes anything waits is act's rule 13 (D250), which shows the plan and ends the turn unless the user gave the steps, said to go ahead or has just answered, the plan then going in the final answer, since a plan costs a turn while going the wrong way costs the rework. When it waits, the harness's plan mode is used where there is one, since it holds changes until the person approves; elsewhere the plan goes in the response and the agent waits. The reference files say how each harness's mode is used.
  8. **Re-planning:** when a step fails, or a fact the plan rests on changes, the plan is revised before going on, since steps planned on a failed step or a changed fact no longer hold, and approved again if the first one needed approval; when the steps were the person's own, the revised steps go back to them. When a failure shows the design the plan builds on wrong, the design changes first, by design's step 9, and the plan is revised after it (D168).
  9. **Where it is kept, plan's own part only** (D156): in the response when it fits on a screen; in a file when it is longer, the response giving the outline. Which file, and in what form, is a keeper's, such as blueprint's where the project's instruction files point to it, so plan never names one; by default, a file the agent names in the response.

  Advice (D116): long or wide means more than about five steps, more than one sitting, or parts that could each go to a different agent, the size where a plan keeps the work from wandering and lets parts be delegated. When unsure whether the work is multipart, it is treated as multipart (act's rule 13, D250); re-planning catches the rest when the work turns out bigger.

  Instructions, in the order the work happens (D155):

  1. **Multipart?** By rule 1. When not, no plan, and the work is done directly.
  2. **Given?** By rule 2: missing items added and marked, and each item through the obvious test.
  3. **Make the plan** where none is given: the goal; the steps, expanded by the obvious test; then one line or a full plan, by rule 5. A full plan is divided through organize, by its rules: split for the parts; merge where two steps do the same thing; compose where steps group into phases; normalize where a step repeats across parts, so it is done once. The order of the steps is plan's own, since organize arranges boundaries, not sequence. organize's two approvals do not apply, since nothing existing changes; plan's approval does (D148).
  4. **Challenge** a full plan through understand's challenge.
  5. **Approval,** by rule 7.
  6. **Follow,** by rule 6, and **re-plan** by rule 8.
  7. **Last instruction, before a plan is shown:** single-step work has no plan; given items are kept, and added ones marked; every step passes the obvious test; a full plan is divided, challenged, and leaves out any section with nothing to say; the plan waits where rule 7 says.
- **Result** (D155): the one line, such as "collect the merged changes, group them by kind, write the notes, checked against the changelog", or the full plan in this form, a section with nothing to say left out:

  ```text
  Goal:     what is wanted, and how it is known to be done
  Steps:    in order, each with its check; added items marked
  Out:      what is out of scope
  Risks:    each risk, and what catches it
  Agents:   what goes to agents
  ```

  For example, "move the docs site to a new generator", divided by page set into phases, the build set up once:

  ```text
  Goal:     the same pages at the same addresses, the build passing
  Steps:    prepare: 1. list every page   2. convert one page as a trial, the build set up once here
            convert: 3. convert the rest, by folder
            check:   4. add redirects   5. compare the page list before and after
  Out:      rewriting any content
  Risks:    broken links, caught by the link checker; a lost page, caught by step 5
  Agents:   step 3 fanned out by folder
  ```

- **Files:** its own file; two children named after the agents, `devise-plan-claude` and `devise-plan-codex`, each read only when running in that agent (D197), saying where each harness has a plan mode and a task list, as each harness's reference file maps what a skill leaves generic (D144, D155).
- **Material:** superpowers' writing-plans ([../../research/skill-collections.md](../../research/skill-collections.md)); the harnesses' own plan modes and task lists.
- **Tests** (D155):
  1. "fix the typo in the README": single-step, no plan, done directly; "delete the old folder": a proposal under guardrails, not a plan; a single-step change whose two options give the person different results: asked through respond's ask when the choice is the person's, or made and stated in "going with" when it is the agent's, by understand's rule on who decides (D217, D218);
  2. "add dark mode and release it": the person's two items kept at the top; a test that both themes render added and marked; "add dark mode" expanded, its parts found and "follow the system setting, or a switch in the app?" asked; "release it" left as it is where the project keeps release steps; the checklist followed;
  3. "delete the old folder, then copy the files out of it": the order raised before acting, since it would lose the files; a step of the person's own that fails: the revised steps go back to them before the work goes on;
  4. "update the three broken links": one line, "fix the three links, then run the link checker", shown and started; "write the release notes": one line and, at four steps, the checklist;
  5. "migrate the user data to the new database": high stakes, so a full plan, challenged; "compare twenty tools for us": wide, so a full plan divided through organize; a full plan with nothing out of scope: no "Out" section;
  6. approval: the migration plan waits; "move the docs site to a new generator": holds the person's choice of generator, so it waits; the twenty-tool plan, low stakes with no question: shown and started; a plan the person asked for: waits;
  7. a plan that waits, in a harness with a plan mode: the mode used; in one without: the plan in the response, the agent waiting;
  8. where it is kept: a plan that fits on a screen, in the response; a longer one, in a file the response names, with the outline; a project whose instruction files point to blueprint: the file and form blueprint says, plan's own text naming none (D156);
  9. "what do you think about X?": a view, and a plan where one helps, the plan shown, nothing started;
  10. across kinds of work: writing, the release notes; research, the twenty tools; design work, "design the data model and the screens", each a step that runs design, the data model before the screens that show it (D173); code, the user-data migration;
  11. a plan meeting parts that depend on each other, such as "add sync" with conflict handling still open: design run for that part, the plan continuing from its result (D173).
- **Open:** Codex's plan mode and task list, for its reference file, are still to find out; plan doing and a keeper keeping, two skills in context complementing each other, is untested (D156).
