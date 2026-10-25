# coordinate-instruct

Proposes and applies approved instruction documents for agents.

## Rules

1. **Keep shared rules in their proper home.** Put preferences in the user's own instruction files. Put facts every tool needs in the project's shared file. Use `coordinate-setup` for where an installed skillbook pointer belongs. A skill's design or files use the project's skill-making method, otherwise judgment.
2. **Write pointers with the key word first.** Say what the linked material is and when the reader needs it. An agent scanning the document must be able to find the right line.
3. **Give each named step an end or next step.** The agent needs to know when to move on.
4. **Write reasons and plain positive instructions.** Use the project's terms, one word for each concept, and one example per rule. Resolve every reference. Shared files name no tool available to only one agent.
5. **Keep only what every session needs in the document.** Put occasional procedures in a skill or linked file one level away. Leave out repeated skillbook rules only when the whole team uses skillbook. Otherwise those repeats may be needed by teammates without it.
6. **Save changes only after the user approves them.** Ask through `respond-ask`. End the turn. An instruction document changes later sessions. A draft is not a saved change. Preserve `act-rightsize-lean`'s change-list approval for existing material and reuse unchanged scoped approval.
7. **Keep instruction documents out of folders copied into other projects.** Otherwise their rules travel to projects whose users never chose them. Follow the user's explicit instructions under the `act` skill's hierarchy.

## Advice

- Aim for under about 200 lines. Every session pays for the text. This is guidance, not a reason to remove a required rule.

## Instructions

1. **Identify the reader and when the document is read.** Use `act-rightsize` to judge its cost and needed detail.
2. **List the questions and requests the document must let the agent answer.** Use them as the document's tests.
3. **Read the current document before updating it.** Preserve what remains true.
4. **Draft the proposal under the rules above.** Use `organize` for a new document's parts, with its requirements as the items to divide.
5. **Remove extra material through the right method.** Use `act-rightsize` for a new draft and `act-rightsize-lean` for existing material. Propose moving occasional procedures instead of dropping their content.
6. **Check the draft against step 2 and obtain rule 6's approval.** Apply only the approved changes. Check and report the saved result through `act-verify`.

## The last instruction

Return the proposal or approved document and its location. Check that it answers its intended questions, keeps required facts, uses resolvable references and has actual approval before saving. Never report a proposed change as already saved.
