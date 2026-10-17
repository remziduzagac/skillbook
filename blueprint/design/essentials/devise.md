# Design: devise

What a builder needs for devise, essentials' group for deciding what the work will be and its steps (D164); ideas not yet decided are in [../../ideas/design.md](../../ideas/design.md) and [../../ideas/plan.md](../../ideas/plan.md). Its two sub-skills have their own design files: [design.md](design.md), whose general part is devise's design, and [plan.md](plan.md). Every section answers the same questions (D80); an empty field is not designed yet.

devise belongs to the essentials set (D152, D154, D164).

```text
devise/
├── design/    how to design anything; design.md
│   └── review/
└── plan/      planning multipart work, and following the plan; plan.md
```

## devise

- **Purpose:** deciding what the work will be and the steps to get there: design, how to design anything, and plan, planning multipart work before acting and following the plan (D164). Its own `SKILL.md` routes only, in the shape every skill with parts takes, with no rules of its own, since its two share none (D112, D164).
- **Description:** "Deciding what the work will be and its steps: a design for something new or changed, a plan for multipart work, and the plan followed." A draft (D164).
- **Callers:** the main skill, by its routing line (D164); other roots, through the main skill, such as understand's discuss for a design's or a plan's open parts; another set, through essentials' main skill by name, such as softeng, which adds its own design and plan's software parts, and blueprint, which keeps their results (D152, D156); the person, typing it.
- **Flow:** instructions, one routing line per sub-skill:
  - **plan:** when the work is multipart, or steps are given to follow; not for single-step work, which is done directly, a single risky action (conduct's guardrails), the person's choice in single-step work (conduct's ask), or a view asked for, which is act's rule, its plan made in plan but only shown; it gives back the plan, one line or full, and the checklist followed (D155);
  - **design:** added when design's general part is designed (D136).

  A request that fits neither line is done with the agent's own judgment, under act's rules.
- **Result:** whatever the sub-skill returns.
- **Files:** `SKILL.md` only (D164).
- **Material:** none of its own.
- **Tests** (D164):
  1. "add dark mode and release it": plan, the person's two items kept at the top, missing and non-obvious steps found (D155);
  2. "fix the typo in the README": single-step, no plan, done directly (D155);
  3. "design a settings page", before design is designed: done directly under act's rules.
- **Open:** design's routing line, once its general part is designed.
