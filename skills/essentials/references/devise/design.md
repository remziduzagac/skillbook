# devise-design

## Purpose

Decides what something will be before it is made, with reasons its builder can use.

## When to use

Use when what to make is not settled, or the user asks for a design or a design review. For example, a new returns process for an online shop, whose steps and forms nobody has decided.

## When not

- One open choice: settle it with the `understand-clarify` guide, which applies the `understand` guide's who-decides rule. A whole design method adds little.
- An unclear goal: use the `understand-clarify` guide so the design solves the right problem.
- Arranging existing material: use the `organize` guide to preserve its meaning.
- A document for readers: use a skill in the harness’s list for writing that kind of document, if one fits. Otherwise use your judgment under the `act` guide. This method decides the design rather than writing the reader’s document.
- The steps of work already decided: use the `devise-plan` guide to plan how to do it.
- What to make is already settled: return the work to the main task for planning or action. A second design would reopen a decision.

## Gives back

A short or full design with its actual approval status, such as "not yet approved", or ranked review findings. A full design also gives what its review found, how each finding was resolved, and any check still open.

## Rules

1. **Work top-down.** Set the goal before parts and parts before details. Early details get redone when the goal changes.
2. **Correct a problem at the level that caused it.** A lower patch leaves its cause in place.
3. **Give every decision its reason.** A builder can then revisit a decision when its basis changes, and see which values move with it.
   - A value you chose, such as a timeout, a page size or a retry count, is a decision too.
   - One stated basis can cover many values, such as "match the existing API's naming" for every field name.
   - A value the user or a source already settled needs only its source, such as "from the brand guide".
   - A value you can base on nothing is not settled: mark it as an assumption, with what would settle it, such as a supplier's quote for a delivery time. A full design lists it under Open. A made-up reason would read as a basis.
4. **Settle the design before building it.** When building disproves it, revise the design first. Silent drift leaves the record wrong.
5. **Keep one home for each decision.** Put decision history where the skill that saves records says. If no skill saves records, put it in the design's decisions part. The design holds current truth. Copies drift.
6. **Write for a builder without this conversation.** Use a skill in the harness’s list that checks a document from its reader’s point of view, if one fits. Otherwise check it yourself: could a builder build from it without asking again?

## Instructions

Give a builder a design they can use without this conversation. Work from the goal to parts and details, keeping decisions and their reasons together. **Read the existing basis, choose the needed depth, then settle and check the design before execution.**

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

Keep the design where the caller or a loaded skill that saves records says.

- Without either, keep a short design in the response.
- Put a full design in the file the user names. Without one, write it to a new file named for what is designed, where the project keeps its documents, and name the file in the final answer. A new file is easy to move, so its place needs no question of its own.
- If the user wants the design only in the response, do that, by the `act` guide's rule 9.
- Lay it out with the `respond-layout` guide and size it with the `act-rightsize` guide. Divide a grown design with the `organize-split` guide, sizing parts for how they are read.

1. **Use the `devise-design-review` guide for a review-only request.** Editing during review would make choices the design owner has not approved.
   - Return findings without changing the design. A design-only request authorizes no execution.
2. **Read a supplied design and project facts before proposing replacements.** Replacing a design from memory can lose settled requirements and make the user repeat decisions.
   - Follow the supplied basis and check gaps. Label proposed additions as added.
3. **Choose short or full using the `act-stakes` guide and this guide's triggers.** Too little design leaves a builder guessing; unnecessary detail costs the reader without reducing risk.
   - Use full for serious possible effects, dependent choices across parts or a contract another builder relies on. A small reversible change is short only if none applies.
   - How long the result will last does not by itself require full: a private seating sketch with independent choices may stay short, while a shared evacuation route needs more care.
4. **Frame the design with the `understand-frame` guide.** A precise design can still solve the wrong problem if its goal or audience is assumed.
   - Reuse the caller's goal, scope, constraints, audience and good result. Clarify missing user intent through the `understand-clarify` guide.
   - Put the frame at the top of the design. It needs no approval of its own.
5. **Read existing work and earlier decisions before you choose, and fix a problem at the level that caused it, by rule 2.** New choices based on outdated assumptions can recreate a problem the project already solved.
   - Use the `understand-research` guide for outside facts. Return findings here without another design or plan.
   - List assumptions and unknowns with what would settle each.
6. **Divide requirements into parts through the `organize` guide.** A requirement without an owner can disappear between parts when building starts.
   - Give each part a one-sentence boundary and explain connections, including what passes between parts.
   - Use a fitting skill in the harness's list for software architecture. Otherwise give generic parts and connections only.
7. **Work through open items with the `understand-discuss` guide.** Unsettled decisions hidden in design prose become the builder's guesses.
   - Use the `understand-brainstorm` guide for options and the `understand-weigh` guide for comparisons. Reuse current comparisons.
   - Challenge decisions that are hard to undo or shape much of the work through the `understand-challenge` guide. Reuse an earlier challenge only as that guide's rule 7 allows.
   - Follow the `understand` guide for who decides and visible choices. Keep lasting changes with the caller.
8. **Write the design top-down, for a builder who was not in this conversation, by rules 1 and 6.** A builder should not need the old conversation to connect a detail to its purpose.
   - Use the full contents above without empty boilerplate, or give purpose, parts, choices and reasons briefly for a short design. Give each choice its reason, by rule 3. Include open questions and failure paths where needed.
   - Keep each decision in one place, by rule 5. Draw a text diagram only when it makes connections clearer. Keep the design where the paragraph above the steps says.
9. **Ask for any remaining user answer a short design needs through the `respond-ask` guide.** Acting on an open preference takes the choice from the user.
   - End the turn with the question. Resume after the answer without adding a full review. With no answer needed, give the short design in one response.
   - Before changes, follow the `act` guide's rules on choices and when to ask.
10. **Review a full design through the `devise-design-review` guide.** A design can read well while leaving a builder unable to handle an edge or failure case.
    - Return its actual findings and unfinished checks. Your own reread does not complete independent review.
11. **Obtain actual user approval before executing a full design, by rule 4.** Delivery of a draft does not authorize building it.
    - Ask through the `respond-ask` guide, include unfinished checks and end the turn before execution. Short designs still follow shared choice and approval rules.
12. **Return the design to its active caller.** Restarting the caller can reopen settled work or duplicate planning.
    - For a direct whole-design-and-build request, hand on once to the `devise-plan` guide after approval. End a design-only request with its result.
    - When building disproves the design, return to analysis or discussion, revise the design first and then the plan before continuing.
13. **Check the design and “Gives back” before returning it.** Always do this last. A design's approval and review status matter as much as its written contents.
    - Check the shape was open, supplied additions are marked, and a builder can act without asking again. Fix missing or unsupported parts.
    - Check each decision has its reason, each value you chose included, such as a count, a size or a limit, by rule 3. A shared basis may cover several. A value with no basis is marked as an assumption instead. Check each assumption and unknown has what would settle it.
    - Report actual full-design findings, unresolved checks and approval status. Preserve caller ownership and obtain required approval before execution.
