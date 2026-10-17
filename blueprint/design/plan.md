# Design: plan

What a builder needs for plan; ideas not yet decided are in [../ideas/plan.md](../ideas/plan.md). Every section answers the same questions (D80); an empty field is not designed yet.

plan belongs to the essentials set; its software parts, breakdown, slices and sequence, kept in [../ideas/plan.md](../ideas/plan.md), belong to softeng (D152, D154).

```text
plan/
├── SKILL.md
└── references/      claude.md, codex.md: where each harness has a plan mode and a task list
```

Its former software-engineering parts, breakdown, slices and sequence, are kept, word for word, in [../ideas/plan.md](../ideas/plan.md), "Kept for the person's software-engineering skills", for the person's own software-engineering skills (D151).

## plan

- **Purpose:** planning multipart work before acting, and following a plan step by step, whether writing, research, design or code: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong (D151, D155). It has no parts, since the work around it already has homes: organize divides the work, understand's challenge checks a full plan, understand's clarify and research and conduct's ask expand what is not obvious, and coordinate's delegate hands parts to agents; softeng's own plan adds breakdown, slices and sequence for software (D154, D155).
- **Description:** "Planning multipart work before acting, and following it step by step: whether a plan is needed, given items enhanced where they are not obvious, one line or a full plan, whose approval it waits for, and revising it when the work shows it wrong. Use before any work with more than one step or part, or when given steps to follow." A draft (D155).
- **Callers** (D155):
  - essentials' main skill, by its routing line: when the work is multipart, or steps are given to follow; not for single-step work, which is done directly, a single risky action (conduct's guardrails), the person's choice in single-step work (conduct's ask), or a view asked for, which is act's rule, its plan made here but only shown; it gives back the plan, one line or full, and the checklist followed;
  - act, whose rule points here for when to plan;
  - design, at its hand-over to implementation, through the main skill;
  - coordinate's delegate, when it divides work for agents, as crew's first step does;
  - understand's discuss, for a plan's open parts, through the main skill;
  - the person, typing it.

  It uses organize, to divide a full plan; understand's clarify, for an unclear goal or done, frame, to state a full plan's goal, research, for something a step needs found out, and challenge, to check a full plan; conduct's ask, for the person's choices, stakes, for how high the stakes are, and verify, for each step's check; all through the main skill, since they are other roots.
- **Flow** (D151, D155). Planning has two halves: making a plan, and following one. Rules, each with its reason:
  1. **Only multipart work is planned:** work that needs more than one step or part, as the agent sees it, whatever the wording; "fix the failing test" is one step when the error shows the cause, and several (reproduce, find the cause, fix, test again) when it does not. Single-step work needs no plan, since what a plan would add there already has a home: the person's choice goes to conduct's ask, the agent's is simply made, and a single risky action is a proposal under conduct's guardrails. An answer to a question is single-step. A view asked for gets act's "a view and a plan": the plan is made here, shown, and never started.
  2. **Given steps are followed, and enhanced where they are not obvious:** steps count as given when they come from the person, a skill's ordered instructions, blueprint's tasks, a plan already approved and carried over, or a checklist the project keeps. People usually name the main items and leave the rest to the agent, so given items are the top of the plan: missing items are added and marked, by organize's gap check (done in full, do the items reach the goal?); items that are not obvious are expanded; obvious ones are left. The person's items keep their place and their wording, and reordering or dropping one is asked first, since they were the person's choice.
  3. **The obvious test sets how far any plan goes:** a step is obvious when the agent could do it now, knows how it will be checked, and has no choice left that would change the result and nothing to find out first. What failed says what to do: parts not yet known, organize's split; an unclear goal or done, understand's clarify; an open choice, made and stated when it is the agent's, asked through conduct's ask when it is the person's; something to find out, a quick look or understand's research. Each new step is tested again, and expanding stops when every step passes: nothing obvious is expanded and nothing unclear is left, conduct's rightsize applied to a plan (D145).
  4. **A choice is the person's** when the options give them different results they would care about, such as scope, cost, how it looks or a public interface; it is the agent's when only the route differs, since then the person gets the same thing either way.
  5. **One line, or a full plan:** a full plan when stakes are high, as conduct's stakes rates them, or the work is long or wide; otherwise one line, holding the approach where a choice was made, the steps in order and the check. A full plan is divided through organize, and challenged through understand's challenge before it is shown, since others build on it (D150).
  6. **Following, whoever wrote the steps:** at about three steps or more, the steps go in a checklist, the harness's task list where it has one; they are done in order, each checked by conduct's verify before the next, and ticked off. A given step that looks wrong is raised before going on, as act's rule on concerns says; a step that fails stops the list and goes to re-planning.
  7. **Approval, for either depth:** a plan waits for the person when stakes are high, the person asked for a plan, or it holds a question for them; otherwise it is shown and the work starts, and the person can still stop it, since a plan costs a turn while going the wrong way costs the rework. When it waits, the harness's plan mode is used where there is one, since it holds changes until the person approves; elsewhere the plan goes in the response and the agent waits. No skill names a harness's mode; the reference files say how.
  8. **Re-planning:** when a step fails, or a fact the plan rests on changes, the plan is revised before going on, and approved again if the first one needed approval; when the steps were the person's own, the revised steps go back to them.
  9. **Where it is kept, plan's own part only** (D156): in the response when it fits on a screen; in a file when it is longer, the response giving the outline. Which file, and in what form, is a keeper's, such as blueprint's where the project's instruction files point to it, so plan never names one; by default, a file the agent names in the response.

  Advice (D116): long or wide means more than about five steps, more than one sitting, or parts that could each go to a different agent, the size where a plan keeps the work from wandering and lets parts be delegated; a checklist starts to pay at about three steps, since fewer are held in mind without one. When unsure whether the work is multipart or a step obvious, a one-line plan is stated and the work starts; re-planning catches the rest when the work turns out bigger.

  Instructions, in the order the work happens (D155):

  ```text
  1. Is the work multipart?            no  → no plan; the work done directly
  2. Are the steps already given?      yes → follow them, enhanced where not obvious
  3. One line, or a full plan?         full when stakes are high or the work is long or wide; otherwise one line
  ```

  1. **Multipart?** By rule 1. When not, no plan, and the work is done directly.
  2. **Given?** By rule 2: missing items added and marked, and each item through the obvious test.
  3. **Make the plan** where none is given: the goal; the steps, expanded by the obvious test; then one line or a full plan, by rule 5. A full plan is divided through organize: split for the parts, one dividing principle, each part's boundary in one sentence, no overlap and no gap, since overlapping steps do work twice and a gap leaves something undone; merge where two steps do the same thing; compose where steps group into phases, each stating what its steps share; normalize where a step repeats across parts, so it is done once. The order of the steps is plan's own, since organize arranges boundaries, not sequence. organize's two approvals do not apply, since nothing existing changes; plan's approval does (D148).
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

- **Files:** `SKILL.md`; `references/claude.md` and `references/codex.md`, saying where each harness has a plan mode and a task list, as each harness's reference file maps what a skill leaves generic (D144, D155).
- **Material:** superpowers' writing-plans ([../research/skill-collections.md](../research/skill-collections.md)); the harnesses' own plan modes and task lists.
- **Tests** (D155):
  1. "fix the typo in the README": single-step, no plan, done directly; "delete the old folder": a proposal under guardrails, not a plan; a single-step change whose two options give the person different results: asked through conduct's ask;
  2. "add dark mode and release it": the person's two items kept at the top; a test that both themes render added and marked; "add dark mode" expanded, its parts found and "follow the system setting, or a switch in the app?" asked; "release it" left as it is where the project keeps release steps; the checklist followed;
  3. "delete the old folder, then copy the files out of it": the order raised before acting, since it would lose the files; a step of the person's own that fails: the revised steps go back to them before the work goes on;
  4. "update the three broken links": one line, "fix the three links, then run the link checker", shown and started; "write the release notes": one line and, at four steps, the checklist;
  5. "migrate the user data to the new database": high stakes, so a full plan, challenged; "compare twenty tools for us": wide, so a full plan divided through organize; a full plan with nothing out of scope: no "Out" section;
  6. approval: the migration plan waits; "move the docs site to a new generator": holds the person's choice of generator, so it waits; the twenty-tool plan, low stakes with no question: shown and started; a plan the person asked for: waits;
  7. a plan that waits, in a harness with a plan mode: the mode used; in one without: the plan in the response, the agent waiting;
  8. where it is kept: a plan that fits on a screen, in the response; a longer one, in a file the response names, with the outline; a project whose instruction files point to blueprint: the file and form blueprint says, plan's own text naming none (D156);
  9. "what do you think about X?": a view and a plan, the plan shown, nothing started;
  10. across kinds of work: writing, the release notes; research, the twenty tools; design, "design the data model and the screens", the data model planned before the screens that show it; code, the user-data migration.
- **Open:** Codex's plan mode and task list, for its reference file, are still to find out; plan doing and a keeper keeping, two skills in context complementing each other, is untested (D156).
