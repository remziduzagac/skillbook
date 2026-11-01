# devise-plan

## Purpose

Makes and follows plans for multipart work, keeping approval and progress explicit.

## When to use

Use for work with more than one step or part, including given steps to follow. Also use to follow or update an existing plan, even with one item left. New user input in a later turn may change that plan. Judge the work, not its wording: finding a pottery glaze fault may take several steps, while a direct fact may need none.

## When not

Use these alternatives when the work needs no plan. If one is needed for a part of an existing plan, use it for that part and return to the plan.

- An exact single-step action with no existing plan to follow or update: use the `act` guide directly. Correcting one specified accent mark may need no plan.
- One risky action: use the `act-guardrails` guide for its proposal and approval.
- One choice: use the `understand` guide to settle who decides and what information is needed.
- A requested view: follow the `act` guide’s rule 2. A read-only plan may help the view, but it grants no permission to act.
- An open part of what to make: use the `devise-design` guide for that part, then return to the plan. Steps need a settled design.

## Gives back

The one-line or full plan, its actual approval status, and the checklist showing which steps were checked when execution was allowed.

## Rules

1. **Treat a requested view as read-only.** Follow the `act` guide's rule 2. A view authorizes no execution.
2. **Keep given items and enhance what is not obvious.** Given items include the user's steps, a guide's or skill's ordered instructions, tasks from a skill that saves records, an approved plan from an earlier session or a project checklist. Mark added items. Ask before reordering or dropping the user's items. Their wording and order express their choice.
3. **Expand only until every step is obvious.** A step is obvious when you can do it now, know how to check it, and have no open choice or missing fact that would change it. Split parts whose steps are unknown. Use the `understand-clarify` guide when the goal or what counts as done is unclear. Use the `understand-research` guide for missing facts that need sources. Return its result to this active plan. Reapply this test to each new step. Expanding an obvious step wastes attention.
4. **Use the `understand` guide for who decides.** It owns conventions, agent defaults, user preferences and visible choice timing. Use the `understand-brainstorm` guide for options or the `understand-weigh` guide for comparison. Return from their result to this plan.
5. **Make a full plan for high stakes or long or wide work.** Judge stakes through the `act-stakes` guide. Otherwise give one line with the chosen way to do the work, ordered steps and check. Use the `organize` guide to divide full plans into non-overlapping parts and phases. Check a full plan through the `understand-challenge` guide before showing it; reuse a current challenge by that guide's rule.
6. **Track three or more steps in a checklist.** Use the available harness list, otherwise plain text. Work in dependency order. Check a step through the `act-verify` guide before ticking it and advancing dependent work. An unnoticed failure invalidates later steps. Independent parts may share a phase.
7. **Get actual user approval before executing a high-stakes plan.** This is stricter than the `act` guide's rule 13's given-steps exception. Given steps alone are not approval. A request for a plan authorizes no execution. Reuse approval only for the work the user approved, while the facts behind it still hold. Plan approval does not waive a separate guardrail.
8. **Follow the `act` guide's rule 13 for other changing work.** Use its given-steps and go-ahead exceptions. Put a read-only plan in the final answer when no user answer is needed. Ask open user questions through the `respond-ask` guide. Put an approval request in the final message. End the turn. Follow the `respond-ask` guide if its question tool returns the user's answer in the same turn.
9. **Revise the current plan after a failed step, a changed fact it depends on, or new user input in a later turn.** Start from the existing plan so open work is not lost. Keep its open items. Add what the new input asks for. Change or remove what it replaces. Mark finished items. Revise even if the old step text is unchanged. Obtain renewed approval when the original required it. Ask the user about proposed changes to the steps they gave. If the design failed, revise it through the `devise-design` guide first. Continuing on a false basis multiplies rework.
10. **Return a design need to the `devise-design` guide without restarting this plan.** Use it for an open shape or dependent choices, not one isolated choice. Resume this list from its result. A plan step can itself be design work.

## Advice

- Long or wide means more than about five steps, more than one sitting, or parts that can go to separate agents. A fuller plan then keeps the work from wandering.
- If unsure whether work is multipart, follow the `act` guide's rule 13. Do not invent another threshold.

## Instructions

Keep multipart work tied to its goal, current facts and checked progress. Build on given steps or the open plan so new input does not erase unfinished work. **Read the open plan and any given steps, expand only unclear steps, then follow only the approved work and revise as facts change.**

A full plan's default shape, omitting empty fields:

```text
Goal:    wanted result and how done is known
Steps:   in order, each with its check; added items marked
Out:     work outside scope
Risks:   each and what catches it
Agents:  work handed to agents
```

Keep a plan in the response when it fits on a screen. For a longer plan, write a file and give an outline in the response. Use the place and format chosen by the caller or the loaded skill that saves records. If neither has chosen a place, name the file in the response. Follow the `act` guide before writing. Return the plan with its actual approval status and the steps you checked. Do not assume the work is complete.

1. **Keep planning separate from execution under rule 1.** A useful plan is still a read-only result when the user asked only for a view or plan.
   - Return plan-only work without starting execution. Keep an open design need with the `devise-design` guide rather than treating an undecided shape as an obvious action.
2. **Inspect the existing plan and given steps under rules 2 and 9.** Starting afresh can lose open work or silently change the user's order.
   - Read relevant project facts. Keep given items, mark additions and ask before dropping or reordering the user's steps.
   - Incorporate later user input, mark finished items and preserve what remains open, even if one item remains. Keep obvious steps short.
3. **Make each step executable and checkable, at rule 5's depth.** A step with an open choice or missing fact can fail only after dependent work has begun.
   - Expand under rule 3 until each step can be done now, has a check and has no result-changing unknown. Research facts and clarify user choices; return to this plan.
   - Use a full plan for high stakes or long or wide work. Otherwise give the way, ordered steps and check in one line.
   - For a full plan, use the `understand-frame` guide for goal and done, and the `organize` guide for distinct parts and phases. Group shared work once. This guide owns step order.
   - Challenge a full plan through the `understand-challenge` guide, reusing only a current check. Omit empty fields in the default shape above.
4. **Track the plan with available harness controls, by rule 6.** Untracked progress can let an unfinished prerequisite look done on the next turn.
   - Use the harness plan or task list where available. Track three or more steps in a checklist; otherwise use plain text in the response.
5. **Obtain required approval before execution, under rules 7 and 8.** A mode change or an unchecked task box is not the user's approval.
   - A high-stakes plan needs actual approval even with given steps. Reuse approval only within its work and unchanged basis; separate guardrails still apply.
   - For other changing work, use the `act` guide's plan rule and its exceptions. Put a read-only plan in the final answer when no user answer is needed.
   - Use an available permitted plan mode, or put the approval request in the final message and end the turn. With no task tool, use a plain-text checklist. Install or enable no controls.
6. **Follow allowed steps in dependency order, checking before advancing, by rules 6 and 9.** An unnoticed failure can invalidate every step built on it.
   - Use the `act-verify` guide before ticking each step. Independent parts may share a phase. Give permitted independent work to the `coordinate-delegate` guide, using the `coordinate-delegate-crew` guide for parallel changes to separate items.
   - Raise a wrong given step through the `act` guide's concern rule. On failure, changed facts or new input, revise this plan rather than advancing dependent work.
   - Revise a failed design through the `devise-design` guide first. Ask about changes to user-given steps and renew required approval before affected work.
7. **Check the plan, progress and “Gives back” before returning.** Always do this last. A checklist is not evidence that the work passed.
   - Check open items, additions, new input, completed items and each step's executable detail. Check full-plan parts and challenge status.
   - Fix omissions and verify approval still covers the work and facts. Return actual checked progress, remaining work and approval status to the active caller without claiming unfinished work complete.
