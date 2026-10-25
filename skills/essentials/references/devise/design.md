# devise-design

Decides what something will be before it is made, with reasons its builder can use.

## Rules

1. **Work top-down.** Set the goal before parts and parts before details. Early details get redone when the goal changes.
2. **Correct a problem at the level that caused it.** A lower patch leaves its cause in place.
3. **Give every decision its reason.** The decision can then be revisited when its basis changes.
4. **Settle the design before building it.** When building disproves it, revise the design first. Silent drift leaves the record wrong.
5. **Keep one home for each decision.** Put decision history where the keeper says. Without a keeper, put it in the design's decisions part. The design holds current truth. Copies drift.
6. **Write for a builder without this conversation.** If `authoring` is installed, load it and use its reader test by its name rule. Otherwise ask whether the builder can build without asking again.

## Instructions

1. **Check the requested result.** A review-only request uses `devise-design-review` and returns findings without changing the design. If the shape is already settled, hand the work back to the caller for planning or direct action. A single open choice follows `understand`'s who-decides rule. A design-only request authorizes no execution.
2. **Read a supplied design before replacing anything.** Follow it and check gaps. Label proposed additions as added. Read available project facts before asking.
3. **Choose short or full.** Use full when a mistake has consequential effects, parts depend on decisions in other parts, or another builder relies on this as a contract. Judge effects and undo with `act-stakes`. A small reversible change is short only when no full trigger applies. How long the result will last does not by itself require a full design. A shared evacuation route has consequential effects; a private seating sketch with independent choices may stay short.
4. **Frame through `understand-frame`.** Get goal, constraints, scope, audience and a good result from the caller or known context. Use `understand-clarify` for user intent that would change it. Include the frame in the read-only answer. Do not ask for separate approval of the frame.
5. **Analyse the existing work and earlier decisions.** Use `understand-research` for outside facts where needed. Return the findings to this design without starting another design or plan. List assumptions and unknowns. Say what would settle each one.
6. **Divide the requirements through `organize`.** Give each part a boundary in one sentence and explain connections. If `softeng` is installed, load it and use its design method by its name rule for software architecture. Otherwise give generic parts and connections only.
7. **Work through open items with `understand-discuss`.** Use `understand-brainstorm` for options and `understand-weigh` for comparisons. Reuse a current comparison. Use `understand-challenge` for consequential decisions; reuse a challenge only while its idea, goal, constraints and evidence hold. Follow the `understand` skill for who decides and visible choices. The caller is responsible for lasting changes.
8. **Write the design top-down.** A full design uses the shape below without empty boilerplate. A short design gives purpose, parts, choices and reasons briefly. List any open questions. Draw a text diagram in a code block only when connections become clearer.
9. **Ask for any user answer the short design needs through `respond-ask`.** End the turn. Resume after the answer without adding a full review. With no answer needed, give the short design in one response. Before either path changes anything, follow the `act` skill's rules on when to ask or show choices.
10. **review** (`devise-design-review`): for a full design, a large change or an explicit design review request.
    - Not for: code review (an installed `softeng` review, otherwise judgment), completion evidence (`act-verify`), one idea (`understand-challenge`), or a skill's design (the project's skill-making method, otherwise judgment).
    - Gives back: ranked findings with fixes, or the lenses run; missing checks remain marked. Return problems to discussion. Fix, accept with reasons or park findings before approval.
11. **Get actual user approval before executing a full design.** Include any unfinished checks when asking for approval. Delivering a draft or rereading it yourself does not complete independent review. For a short design, also follow the shared rules on user choices and when to show them.
12. **Return a called design to its active caller.** A direct whole-design-and-build request hands on to `devise-plan` once after approval. A design-only request ends with its result. When building finds a gap, return to analysis or discussion first, then revise the plan before continuing.

A full design's default contents:

```text
Purpose:      goal, audience and a good result
Scope:        in, out and constraints
Parts:        each boundary and responsibility
Connections:  what passes between parts and in what order
Behavior:     main cases, edge cases and failure paths
Decisions:    each choice, reason and options set aside
Checks:       how a builder knows it works
Open:         questions, assumptions and what settles each
```

Keep results where the caller or loaded keeper says. Without either, keep a short design in the response. Put a full design in a file the user names. If they have not named one, ask through `respond-ask`. Recommend a descriptive filename where the project keeps documents. End the turn. A user preference for response-only output follows the `act` skill's defaults rule. Use `respond-layout` and `act-rightsize`. Use `organize-split` for a grown design, with parts sized for how they are read.

## The last instruction

Check that you did not design work whose shape was already settled. Check that additions to a supplied design are marked. Check that the result includes reasons and unknowns. Report the actual status of full-design findings and checks, including any unresolved ones. Obtain required approval before execution. Preserve caller ownership and follow the `understand` and `act` skills before any lasting change.
