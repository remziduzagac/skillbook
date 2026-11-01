# coordinate-instruct

## Purpose

Prepares instruction documents for agents and applies approved changes, so later sessions receive the intended guidance.

## When to use

Use when adding, changing or removing instructions that agents read, such as a project’s shared agent instruction file.

## When not

- Skill files or designs: use the project’s skill-making method, otherwise your judgment. Those files have their own rules.
- Placing an installed pointer: use the `coordinate-setup` guide. Placement depends on where skillbook is installed.
- A later-session note: use the `coordinate-carryover` guide. It records work state rather than rules for every session.

## Gives back

The proposed or approved instruction document, its location and whether it was actually saved.

## Rules

1. **Keep shared rules in their proper home.** Put preferences in the user's own instruction files. Put facts every tool needs in the project's shared file. Use the `coordinate-setup` guide for where an installed skillbook pointer belongs. For a skill's design or files, use the project's method for making skills. Use your judgment when the project has no such method.
2. **Write pointers with the key word first.** Say what the linked material is and when the reader needs it. An agent scanning the document must be able to find the right line.
3. **Give each named step an end or next step.** The agent needs to know when to move on.
4. **Write reasons and plain positive instructions.** Use the project's terms, one word for each concept, and one example per rule. Resolve every reference. Shared files name no tool available to only one agent.
5. **Keep only what every session needs in the document.** Put occasional procedures in a skill or linked file one level away. Leave out repeated skillbook rules only when the whole team uses skillbook. Otherwise those repeats may be needed by teammates without it.
6. **Save changes only after the user approves them.** Ask through the `respond-ask` guide. End the turn. An instruction document changes later sessions. A draft is not a saved change. Follow the `act-rightsize-lean` guide's rule to get approval for the list of changes to existing material. Use earlier approval again only if the work and the facts behind it have not changed.
7. **Keep instruction documents out of folders copied into other projects.** Otherwise their rules travel to projects whose users never chose them. Follow the user's explicit instructions under the `act` guide's hierarchy.

## Advice

- Aim for under about 200 lines. Every session pays for the text. This is guidance, not a reason to remove a required rule.

## Instructions

The goal is useful instruction guidance saved only with approval. Prepare the document with the steps below.

1. **Identify the reader and when the document is read.** This makes the document fit the actual reader. Use the `act-rightsize` guide to judge its cost and needed detail.
2. **List the questions and requests the document must let the agent answer.** This defines what the document must support. Use them as the document's tests.
3. **Read the current document before updating it.** This helps preserve what remains true. You must read it before changing it. Keep the parts that remain true.
4. **Draft the proposal under the rules above.** This gives the user a concrete document to judge. Use the `organize` guide for a new document's parts, with its requirements as the items to divide.
5. **Remove extra material through the right method.** This keeps occasional work out of shared instructions. Use the `act-rightsize` guide for a new draft and the `act-rightsize-lean` guide for existing material. Propose moving occasional procedures instead of dropping their content.
6. **Check the draft against step 2 and obtain rule 6’s approval.** This keeps saved changes checked and approved. You must obtain required approval before applying the changes. Apply only the approved changes. Check and report the saved result through the `act-verify` guide.

7. **Check the proposed or approved document.** Always do this last.

   Return the proposal or approved document and its location. Check that it answers its intended questions, keeps required facts, uses resolvable references and has actual approval before saving. Never report a proposed change as already saved.
