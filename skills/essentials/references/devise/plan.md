# devise-plan

Makes and follows plans for multipart work, keeping approval and progress explicit.

## Rules

1. **Plan work with more than one step or part.** Judge the work, not the wording. A direct fact can need no plan; a research question can need several steps. Single-step work uses the `act` skill directly. A view follows `act` rule 2 and never authorizes execution. Diagnosing a pottery glaze fault may need several steps; correcting one specified accent mark may not.
2. **Keep given items and enhance what is not obvious.** Given items include the user's steps, a skill's ordered instructions, tasks from a keeper, an approved plan from an earlier session or a project checklist. Mark added items. Ask before reordering or dropping the user's items. Their wording and order express their choice.
3. **Expand only until every step is obvious.** A step is obvious when you can do it now, know how to check it, and have no open choice or missing fact that would change it. Split parts whose steps are unknown. Use `understand-clarify` when the goal or what counts as done is unclear. Use `understand-research` for missing facts that need sources. Return its result to this active plan. Reapply this test to each new step. Expanding an obvious step wastes attention.
4. **Use the `understand` skill for who decides.** It owns conventions, agent defaults, user preferences and visible choice timing. Use `understand-brainstorm` for options or `understand-weigh` for comparison. Return from their result to this plan.
5. **Make a full plan for high stakes or long or wide work.** Judge stakes through `act-stakes`. Otherwise give one line with the chosen approach, ordered steps and check. Use `organize` to divide full plans into non-overlapping parts and phases. Check a full plan through `understand-challenge` before showing it; reuse a current challenge by that skill's rule.
6. **Track three or more steps in a checklist.** Use the available harness list, otherwise plain text. Work in dependency order. Check a step through `act-verify` before ticking it and advancing dependent work. An unnoticed failure invalidates later steps. Independent parts may share a phase.
7. **Get actual user approval before executing a high-stakes plan.** This is stricter than `act` rule 13's given-steps exception. Given steps alone are not approval. A request for a plan authorizes no execution. Reuse an existing approval only within its scope and basis. Plan approval does not waive a separate guardrail.
8. **Follow `act` rule 13 for other changing work.** Use its given-steps and go-ahead exceptions. Put a read-only plan in the final answer when no user answer is needed. Ask open user questions through `respond-ask`. Put an approval request in the final message. End the turn. Follow `respond-ask` if its question tool returns the user's answer in the same turn.
9. **Revise after a failed step or a changed fact the plan rests on.** Do this even if the old step text is unchanged. Obtain renewed approval when the original required it. Ask the user about proposed changes to the steps they gave. If the design failed, revise it through `devise-design` first. Continuing on a false basis multiplies rework.
10. **Return a design need to `devise-design` without restarting this plan.** Use it for an open shape or dependent choices, not one isolated choice. Resume this list from its result. A plan step can itself be design work.

## Advice

- Long or wide means more than about five steps, more than one sitting, or parts that can go to separate agents. A fuller plan then keeps the work from wandering.
- If unsure whether work is multipart, follow `act` rule 13. Do not invent another threshold.

## Instructions

1. **Check whether a plan is needed by rule 1.** Return exact single-step work to its caller. Do not execute a request that asked only for a plan.
2. **Inspect given steps by rule 2.** Read the project facts before assuming what a step needs. Keep obvious steps short.
3. **Make the plan at the depth rule 5 sets.** Use `understand-frame` for a full plan's goal and done. Use `organize` for splitting unknown parts, merging duplicate steps, grouping phases and isolating repeated shared work. Dividing a whole that does not exist yet changes no existing arrangement. Follow this skill's approval rules. This skill decides the order of steps. Read a harness child below only when you need its controls in the current harness. Reading another harness's reference does not authorize using its controls.

4. **claude** (`devise-plan-claude`): for Claude Code plan-mode and task controls.
   - Not for: operating Codex or another harness, or deciding approval policy.
   - Gives back: available controls, their actual results and missing capabilities.
5. **codex** (`devise-plan-codex`): for Codex plan-mode and task controls.
   - Not for: operating Claude Code or another harness, or deciding approval policy.
   - Gives back: available controls, their actual results and missing capabilities.
6. **Apply approval by rules 7 and 8.** Use a permitted available plan mode when approval is needed. Mode changes alone are not approval. If no plan mode is available, put the approval request in the final message. End the turn. If no task tool is available, keep a plain-text checklist. If both capabilities are missing, use both fallbacks. Install or enable nothing to acquire controls.
7. **Follow authorized steps by rule 6.** Use `coordinate-delegate` to give independent parts to available agents when the caller permits delegation. Use `coordinate-delegate-crew` within that active call for parallel changes to separate items. Raise a wrong given step by the `act` skill's concern rule before relying on it. A failure goes to rule 9, not the next dependent step.

A full plan's default shape, omitting empty fields:

```text
Goal:    wanted result and how done is known
Steps:   in order, each with its check; added items marked
Out:     work outside scope
Risks:   each and what catches it
Agents:  work handed to agents
```

Keep a plan in the response when it fits on a screen. A longer one goes in a file, with an outline in the response. Follow a loaded keeper or caller for the plan's location and form. Without either, give the filename in the response. Follow the `act` skill before any write. Return the plan. Report whether the user approved it and which checklist steps you checked. Do not assume the work is complete.

## The last instruction

Check that the work needs a plan. Check that you kept the given items, marked additions and made each step obvious. Check that you divided a full plan into parts and challenged it. Omit empty fields. Check that approval still covers the work and the facts it rests on. Return the result to the skill that called this plan. Report actual checked progress and outstanding work.
