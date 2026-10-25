# devise-plan

Makes and follows plans for multipart work, keeping approval and progress explicit.

## Rules

1. **Plan work with more than one step or part.** Judge the work, not the wording. A direct fact can need no plan; a research question can need several steps. Single-step work uses the `act` skill directly. A view follows `act` rule 2 and never authorizes execution. Diagnosing a pottery glaze fault may need several steps; correcting one specified accent mark may not.
2. **Keep given items and enhance what is not obvious.** Given means user steps, ordered skill instructions, keeper tasks, an approved carried-over plan or a project checklist. Mark added items. Ask before reordering or dropping the user's items. Their wording and order express their choice.
3. **Expand only until every step is obvious.** You can do it now, know its check, and have no material choice or fact left unsettled. Split unknown parts; clarify an unclear goal or done through `understand-clarify`; find missing facts from sources. Reapply this test to each new step. Expanding an obvious step wastes attention.
4. **Use the `understand` skill for who decides.** It owns conventions, agent defaults, user preferences and visible choice timing. Use `understand-brainstorm` for options or `understand-weigh` for comparison. Return from their result to this plan.
5. **Make a full plan for high stakes or long or wide work.** Judge stakes through `act-stakes`. Otherwise give one line with the chosen approach, ordered steps and check. Divide full plans into non-overlapping parts and phases. Check a full plan through `understand-challenge` before showing it; reuse a current challenge by that skill's rule.
6. **Track three or more steps in a checklist.** Use the available harness list, otherwise plain text. Work in dependency order. Check a step through `act-verify` before ticking it and advancing dependent work. An unnoticed failure invalidates later steps. Independent parts may share a phase.
7. **Get actual user approval before executing a high-stakes plan.** This is stricter than `act` rule 13's given-steps exception. Given steps alone are not approval. A request for a plan authorizes no execution. Reuse an existing approval only within its scope and basis. Plan approval does not waive a separate guardrail.
8. **Follow `act` rule 13 for other changing work.** Use its given-steps and go-ahead exceptions. Put a read-only plan in the final answer when no user answer is needed. Ask open user questions through `respond-ask`. An approval request is shown in the final message and ends the turn, subject to that skill's actual-answer handling.
9. **Revise after a failed step or a changed fact the plan rests on.** Do this even if the old step text is unchanged. Obtain renewed approval when the original required it. Return revisions to user-given steps to the user. If the design failed, revise it through `devise-design` first. Continuing on a false basis multiplies rework.
10. **Return a design need to `devise-design` without restarting this plan.** Use it for an open shape or dependent choices, not one isolated choice. Resume this list from its result. A plan step can itself be design work.

## Advice

- Long or wide means more than about five steps, more than one sitting, or parts that can go to separate agents. A fuller plan then keeps the work from wandering.
- If unsure whether work is multipart, follow `act` rule 13. Do not invent another threshold.

## Instructions

1. **Check whether a plan is needed by rule 1.** Return exact single-step work to its caller. Do not execute a request that asked only for a plan.
2. **Inspect given steps by rule 2.** Read the project facts before assuming what a step needs. Keep obvious steps short.
3. **Make the plan at the depth rule 5 sets.** Use `understand-frame` for a full plan's goal and done. Split unknown parts, merge duplicate steps, group phases and isolate repeated shared work. Planning a new whole does not change an existing arrangement; plan's approval applies. Keep sequencing here.
Use the current harness child only when its controls are needed. An inspection of another harness's reference is documentation, not operation.

4. **claude** (`devise-plan-claude`): for Claude Code plan-mode and task controls.
   - Not for: operating Codex or another harness, or deciding approval policy.
   - Gives back: available controls, their actual results and missing capabilities.
5. **codex** (`devise-plan-codex`): for Codex plan-mode and task controls.
   - Not for: operating Claude Code or another harness, or deciding approval policy.
   - Gives back: available controls, their actual results and missing capabilities.
6. **Apply approval by rules 7 and 8.** Use a permitted available plan mode when approval is needed. Mode changes alone are not approval. With no mode, use final-text approval and end the turn. With no task tool, keep a plain-text checklist. With neither, use both fallbacks. Install or enable nothing to acquire controls.
7. **Follow authorized steps by rule 6.** Hand independent parts to available agents within the caller's authority. Raise a wrong given step by the `act` skill's concern rule before relying on it. A failure goes to rule 9, not the next dependent step.

A full plan's default shape, omitting empty fields:

```text
Goal:    wanted result and how done is known
Steps:   in order, each with its check; added items marked
Out:     work outside scope
Risks:   each and what catches it
Agents:  work handed to agents
```

Keep a plan in the response when it fits on a screen. A longer one goes in a file, with an outline in the response. A loaded keeper or caller owns the location and form; without one, name the file in the response. Follow the `act` skill before any write. Return the actual plan, approval and checklist status, not an assumed completed result.

## The last instruction

Check the multipart boundary, preserved given items, marked additions and each step's obvious test. A full plan is divided and challenged, with empty fields omitted. Preserve approval scope, current facts and caller continuation. Report actual checked progress and outstanding work.
