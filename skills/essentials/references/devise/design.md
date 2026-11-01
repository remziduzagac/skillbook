# devise-design

Decides what something will be before it is made, with reasons its builder can use.

## When to use

Use when what to make is not settled, or the user asks for a design or design review. A private seating sketch and a shared evacuation route both need choices about their parts; the care they need differs.

## When not

- One open choice: follow the `understand` guide’s who-decides rule. A whole design method adds little.
- An unclear goal: use the `understand-clarify` guide so the design solves the right problem.
- Arranging existing material: use the `organize` guide to preserve its meaning.
- A document for readers: use a skill in the harness’s list for writing that kind of document, if one fits. Otherwise use your judgment under the `act` guide. This method decides the design rather than writing the reader’s document.
- The steps of work already decided: use the `devise-plan` guide to plan how to do it.
- What to make is already settled: return the work to the main task for planning or action. A second design would reopen a decision.

## Gives back

A short or full design with its actual approval status, or ranked review findings. A full design also gives its review status.

## Rules

1. **Work top-down.** Set the goal before parts and parts before details. Early details get redone when the goal changes.
2. **Correct a problem at the level that caused it.** A lower patch leaves its cause in place.
3. **Give every decision its reason.** The decision can then be revisited when its basis changes.
4. **Settle the design before building it.** When building disproves it, revise the design first. Silent drift leaves the record wrong.
5. **Keep one home for each decision.** Put decision history where the skill that saves records says. If no skill saves records, put it in the design's decisions part. The design holds current truth. Copies drift.
6. **Write for a builder without this conversation.** Use a skill in the harness’s list that checks a document from its reader’s point of view, if one fits. Otherwise ask whether the builder can build without asking again.

## Instructions

1. For a review-only result, use the `devise-design-review` guide and return findings without changing the design. A design-only request authorizes no execution.
2. To preserve the supplied basis, read a supplied design before replacing anything. Follow it and check gaps. Label proposed additions as added. Read available project facts before asking.
3. To choose enough design detail, choose short or full. Use full when a mistake could have serious effects, parts depend on decisions in other parts, or another builder relies on this as a contract. Judge effects and undo with the `act-stakes` guide. A small reversible change is short only when no full trigger applies. How long the result will last does not by itself require a full design. A shared evacuation route has serious effects; a private seating sketch with independent choices may stay short.
4. To define a good result, frame through the `understand-frame` guide. Get goal, constraints, scope, audience and a good result from the caller or known context. Use the `understand-clarify` guide for user intent that would change it. Include the frame in the read-only answer. Do not ask for separate approval of the frame.
5. To ground decisions in existing facts, analyse the existing work and earlier decisions. Use the `understand-research` guide for outside facts where needed. Return the findings to this design without starting another design or plan. List assumptions and unknowns. Say what would settle each one.
6. To give every requirement a home, divide the requirements through the `organize` guide. Give each part a boundary in one sentence and explain connections. Use a skill in the harness’s list for software architecture, if one fits. Otherwise give generic parts and connections only.
7. To settle the open items, work through open items with the `understand-discuss` guide. Use the `understand-brainstorm` guide for options and the `understand-weigh` guide for comparisons. Reuse a current comparison. Use the `understand-challenge` guide for decisions that are hard to undo or shape much of the work; reuse a challenge only while its idea, goal, constraints and evidence hold. Follow the `understand` guide for who decides and visible choices. The caller is responsible for lasting changes.
8. To make the design usable by a builder, write the design top-down. A full design uses the shape below without empty boilerplate. A short design gives purpose, parts, choices and reasons briefly. List any open questions. Draw a text diagram in a code block only when connections become clearer.
9. To settle the short design’s remaining user choices, ask for any user answer the short design needs through the `respond-ask` guide. End the turn. Resume after the answer without adding a full review. With no answer needed, give the short design in one response. Before either path changes anything, follow the `act` guide's rules on when to ask or show choices.
10. The `devise-design-review` guide: check a design for its builder.
11. To keep execution under user control, get actual user approval before executing a full design. Include any unfinished checks when asking for approval. Delivering a draft or rereading it yourself does not complete independent review. For a short design, also follow the shared rules on user choices and when to show them.
12. To keep the next step with the caller, return a called design to its active caller. A direct whole-design-and-build request hands on to the `devise-plan` guide once after approval. A design-only request ends with its result. When building finds a gap, return to analysis or discussion first, then revise the plan before continuing.

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

Keep results where the caller or loaded skill that saves records says. Without either, keep a short design in the response. Put a full design in a file the user names. If they have not named one, ask through the `respond-ask` guide. Recommend a descriptive filename where the project keeps documents. End the turn. A user preference for response-only output follows the `act` guide's defaults rule. Use the `respond-layout` guide and the `act-rightsize` guide. Use the `organize-split` guide for a grown design, with parts sized for how they are read.

## The last instruction

Check that you did not design work whose shape was already settled. Check that additions to a supplied design are marked. Check that the result includes reasons and unknowns. Report the actual status of full-design findings and checks, including any unresolved ones. Obtain required approval before execution. Preserve caller ownership and follow the `understand` guide and the `act` guides before any lasting change.
