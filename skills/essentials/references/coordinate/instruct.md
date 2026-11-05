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

1. **Keep shared rules in their proper home.** Put preferences in the user's own instruction files. Put facts every tool needs in the project's shared file. Use the `coordinate-setup` guide for where an installed skillbook pointer belongs. For a skill's design or files, use the project's method for making skills. Use your judgment when the project has no such method. When the project keeps the same instructions in two files for different agents, change both alike, or only the one the other points to, and say which in the proposal.
   - When the user asks to put a personal preference in the shared file, propose it there as asked. In the same proposal, say that it would otherwise go in their own instruction file, and why: every agent in the project follows the shared file, whoever it works for.
2. **Write pointers with the key word first.** Say what the linked material is and when the reader needs it. An agent scanning the document must be able to find the right line.
3. **Give each named step an end or next step.** The agent needs to know when to move on.
4. **Write reasons and plain positive instructions.** A reason lets later agents apply the rule to cases it does not name. Capitals and a bare "never" do not.
   - When the user gives a rule without its reason, propose one in the draft and mark it as your suggestion, so they can correct it.
   - Give at most one example per rule, and only where the rule is hard to apply without one. Agents copy a list of examples instead of following the rule.
   - Use the project's terms, one word for each concept.
   - Make sure every reference points to something that exists, such as a file path or a named role.
   - Shared files name no tool available to only one agent.
5. **Keep only what every session needs in the document.** Put occasional procedures in a skill or linked file one level away. Leave out repeated skillbook rules only when the whole team uses skillbook. Otherwise those repeats may be needed by teammates without it.
6. **Save changes only after the user approves them.** Ask through the `respond-ask` guide. End the turn. An instruction document changes later sessions. A draft is not a saved change. Follow the `act-rightsize-lean` guide's rule to get approval for the list of changes to existing material. Use earlier approval again only if the work and the facts behind it have not changed.
7. **Keep instruction documents out of folders copied into other projects.** Otherwise their rules travel to projects whose users never chose them. Follow the user's explicit instructions under the `act` guide's hierarchy.

## Advice

- Aim for under about 200 lines. Every session pays for the text. This is guidance, not a reason to remove a required rule.

## Instructions

Prepare instructions that give later agents the guidance they need in every session. Keep shared facts, preferences and occasional procedures in their proper homes so the document stays usable. **Read the current document, draft and check the proposal, then save only approved changes.**

1. **Identify the reader and when the document is loaded through the `act-rightsize` guide.** Guidance every session loads costs attention even when its procedure is rarely needed.
   - Decide which facts and actions this reader needs each time, rather than judging by a fixed length alone.
2. **List the questions and requests the document must support.** Without a testable purpose, a tidy instruction file can still omit the answer an agent needs.
   - Use these as checks for the draft, including what lets an agent finish or move to the next step.
3. **Read the current document before updating, by rules 5 and 6.** Writing without the current text can discard guidance that remains true.
   - Keep needed facts and rules. Check whether the whole team uses skillbook before dropping repeated skillbook guidance.
4. **Draft a proposal under rules 1–5 and 7.** Instructions in the wrong home can be ignored, duplicated or copied into projects whose users did not choose them.
   - Put preferences in personal instructions and shared project facts in the shared file. When the user names the shared file for a preference, propose it there and say where else it would go, by rule 1. Use the `coordinate-setup` guide for pointer placement and the project's method for skills.
   - Use the `organize` guide for a new document's parts. Write key-word-first pointers and plain positive instructions, each with a reason. Mark a reason you supplied as your suggestion. Use project terms and at most one example per rule.
   - Resolve references and name each step's end or next step. Shared guidance names no tool available to only one agent.
   - Keep instruction documents outside folders copied into other projects, by rule 7, so their rules do not travel to users who never chose them. Follow an explicit user instruction under the `act` guide's hierarchy.
5. **Remove extras through the appropriate `act-rightsize` method.** Dropping an occasional procedure entirely can lose needed guidance while leaving it inline costs every session.
   - Check a new draft through the `act-rightsize` guide and existing material through the `act-rightsize-lean` guide. Propose moving occasional procedures one link away instead of losing their content.
6. **Check against step 2 and obtain approval before saving, by rule 6.** This order is firm: a saved instruction changes what later sessions follow.
   - Show the proposal or required change list through the `respond-ask` guide and end the turn. Reuse earlier approval only for unchanged work and basis.
   - Apply only approved changes. Check and report the saved result through the `act-verify` guide.
7. **Check the document and “Gives back” before returning.** Always do this last. A proposed document must not be reported as saved guidance.
   - Check intended questions, preserved facts, proper homes, a reason for each rule, references and approval before saving. Fix missing guidance or unresolved references.
   - Return the proposed or approved document, location and actual saved status, with evidence for completed changes.
