# Design: devise

What a builder needs for devise, essentials' group for deciding what the work will be and its steps (D164); ideas not yet decided are in [../../ideas/design.md](../../ideas/design.md) and [../../ideas/plan.md](../../ideas/plan.md). Its two sub-skills have their own design files: [design.md](design.md), whose general part is devise's design, and [plan.md](plan.md). Every section answers the same questions (D80); an empty field is not designed yet.

devise belongs to the essentials set (D152, D154, D164).

How skills reach each other here (D107): design and plan, siblings, read each other by path; a skill in another group is reached through the main skill, and a skill in another set through that set's main skill, by name; where that set is not installed, the one-line fallback written where it is used holds, and a request pointed to it is done directly under act's rules, as the main skill says (D56, D152). This holds in design.md and plan.md too.

```text
devise/
├── design/    how to design anything; design.md
│   └── review/
└── plan/      planning multipart work, and following the plan; plan.md
```

## devise

- **Purpose:** deciding what the work will be and the steps to get there: design, how to design anything, and plan, planning multipart work before acting and following the plan (D164). Its own `SKILL.md` routes only, in the shape every skill with parts takes, with no rules of its own, since its two share none (D112, D164).
- **Description:** "Deciding what the work will be and its steps: a design for something new or changed, a plan for multipart work, and the plan followed. Use when something new or changed is to be designed, or the work is multipart or steps are given to follow." A draft (D164).
- **Callers:** the main skill, by its routing line (D164, D171, D172); other groups, through the main skill, such as understand's discuss for a design's or a plan's open parts; another set, through essentials' main skill by name, such as softeng, which adds its own design and plan's software parts, and blueprint, which keeps their results (D152, D156); the person, typing it.
- **Flow:**

  **Scope:** when the request's main question is what something will be, which devise sends to design, or the steps of multipart work to do, build or release, or steps given to follow, which it sends to plan (D173); not for single-step work, which is done directly, a single risky action (conduct's guardrails), the person's choice in single-step work (conduct's ask), or a view asked for, which is act's rule, its plan made in plan but only shown; it gives back what its sub-skill returns: the plan, one line or full, and the checklist followed, or the design (D155, D164, D168, D171).

  Instructions, one routing line per sub-skill:
  - **design:** when the request's main question is what something will be: something new or changed whose shape is not settled, or a design asked for; not for one open choice (conduct's ask, with understand's brainstorm or weigh when options are wanted), an unclear request (understand's clarify), the steps of settled work (plan), rearranging what exists (organize) or a document for readers (authoring); it gives back the design, short or full, approved, and for a full one its review (D168);
  - **plan:** when the request's main question is the steps: multipart work to do, build or release, or steps given to follow; not for single-step work, which is done directly, what something will be (design, which plan also calls for an open shape it meets on the way), a single risky action (conduct's guardrails), the person's choice in single-step work (conduct's ask), or a view asked for, which is act's rule, its plan made in plan but only shown; it gives back the plan, one line or full, and the checklist followed (D155, D168).

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
  5. "design a CLI for X, then build it": design first, then plan, by design's hand-on (D168).
- **Open:** none known.
