# organize

## Purpose

Arranges existing or planned parts without changing their meaning, and checks for missing or overlapping parts.

Needs: optional delegation through the `coordinate-delegate` guide for inventory judgment. Without it, use scripts and compare old parts with their new places yourself. Required independent checks follow the `act-verify` guide's rule 2.

## When to use

Use when existing or planned parts need arranging without changing what they mean. Also use to check for missing or overlapping parts, such as whether planned sections cover every requirement.

## When not

- Changing what the content says: use a skill in the harness’s list for editing documents or code, if one fits. Otherwise return the edit to the main task under the `act` guide. The `organize` guide preserves meaning.
- Choosing the order of work steps: use the `devise-plan` guide. An arrangement of parts is not an execution plan.

## Gives back

The grouping principle, each part’s boundary, each item’s place, and any missing or overlapping parts. After a change, also return the before-and-after map, checks, approvals and what was moved, changed or marked as replaced.

```text
split       A               → A1 A2 A3
merge       A A' A"          → A
compose     A B C            → P over A, B, C
normalize   A[x] B[x]        → A[→X] B[→X] X
cluster     A B C            → view over A, B, C
```

## Rules

1. **Use one dividing principle at a time.** One question sorts the items. Mixing principles creates overlaps.
2. **Give each part a boundary in one sentence.** Follow the `act-rightsize` guide for parts that cover everything without overlap. An unstated boundary hides overlaps.
3. **Preserve meaning when rearranging existing material.** Map every original statement to its new place with the same meaning. Nothing substantive is lost, added or changed. Use scripts for mechanical checks. Use the `coordinate-delegate` guide to have available agents check decisions that need judgment, where delegation is permitted. Without a helper, compare each old part with its new place yourself and report the inventory as self-checked. This fallback permits rereading. Avoid carrying the whole collection twice when smaller comparisons suffice. A count alone does not check meaning. Follow the `act-verify` guide's rule 2 when independence is required. Report an unfinished independent check and who should arrange it. User confirmation does not replace it.
4. **Get the user's approval before changing any item or view.** Show the map by step 4. Ask through the `respond-ask` guide. End the turn before applying. Reuse approval only for the work the user approved, while the facts behind it still hold. The two checkpoints still apply when the user gives the steps, when the `act` guide's rule 13 allows work to proceed, or when the `act-rightsize` guide requires one approval. Meaning is at stake. A mode change, task box or unanswered question is not approval. A delegated worker returns questions to its caller.
5. **Get the user's confirmation after checking the applied result.** Return the evidence and mark the result as awaiting the user's confirmation. End the turn. Claim confirmed completion only after the user replies to confirm the result. Repair lost statements or failed checks and rerun the check before asking for confirmation. A rejected plan returns to planning, or to step 1 if the principle was rejected.
6. **Undo only this operation's changes when its result is rejected.** Check for later edits first. Preserve later and unrelated work. If safe undo cannot be shown or needs a risky new action, report the state and ask about recovery through the `act-guardrails` guide. Do not overwrite others' work to restore an old snapshot. After safe undo, plan again.
7. **Keep retired items marked with where their content went.** Links and history may still lead there. Use a notice such as "merged into …". Deleting them is a separate action through the `act-guardrails` guide.
8. **Use the whole code-preservation check for code and packages.** Use a skill in the harness’s list that covers software architecture and code changes, if one fits. Without one, propose generic parts and connections, then make only approved changes directly. Run project tests before and after. Keep public interfaces, documented behavior and untested requirements, by the `act-rightsize` guide’s code rule. Passing tests alone do not prove that public interfaces, documented behavior and untested requirements were preserved. Report unavailable checks. Claim no specialist architecture review from the fallback.
9. **Preserve items the user approved excluding outside the scope being changed.** Every required in-scope item has one home in a completed arrangement. A check or unapplied proposal may report gaps. A partly resolved change is not complete.
10. **Use the creating guide's or skill's approvals when only planning a future whole.** Its requirements are the items to divide. Rules 3–7 do not apply because planning a future whole changes no existing arrangement. Writing a view over existing items still uses both checkpoints. A mixed request keeps the safeguards for existing material.

## Advice

- An "other" or "misc" part can hide a missing principle.
- Parts side by side should have the same level of detail and use the same terms.
- More than about seven parts at one level can be hard to hold in mind.
- A part readers mostly open to skip may contain several parts' worth.

## Instructions

Organizing gives every required part one clear place without changing what it means. What matters most is the map: built and checked before anything moves, and approved by the user, because a part lost or changed is hard to see once the work is done. **Build the map first, then change only what the user approved.**

1. **Find the whole, its purpose, the unit and one dividing principle.** Two principles mixed, or one changed halfway, leave parts that overlap, by rule 1.
   - Name the unit: sentences, sections, files, skills, functions, modules or system components.
   - Choose one question that sorts every item, such as topic, reader or time.
   - Follow rule 5 of the `understand` guide for who chooses and when choices are shown. The same rule decides which item survives a merge, which parent to add and where a shared part belongs.
2. **For a check only, return the findings and change nothing.** The user asked to see the state of the parts, not to change them.
   - Compare the written or planned parts with everything they must cover. Report gaps, overlaps, mixed levels and conflicting terms. Check a proposed new item against content already placed too.
   - Ask for no approval before a change and no confirmation after it. Return to the active caller without choosing an operation again.
3. **Choose the operation by what happens to the items.** Each operation guards against its own kind of loss, so the wrong one misses it. Each child prepares a proposal first, and applies it only under this guide's approved map.
   - the `organize-split` guide: divide a whole into parts.
   - the `organize-merge` guide: combine duplicate whole accounts.
   - the `organize-compose` guide: add a shared parent.
   - the `organize-normalize` guide: give repeated parts one home.
   - the `organize-cluster` guide: build a view for finding items.
   - Use several when needed, such as normalize then cluster. A request fitting none uses judgment under the `act` guide. Renaming, reordering or moving one item is the work itself. Deletion uses the `act-guardrails` guide. For content editing, use a skill in the harness's list for editing documents or code, if one fits. Otherwise return that edit to the caller under the `act` guide. Your own leftovers use the `act-cleanup` guide.
4. **Show the before-and-after map, then end the turn.** This step must not move: nothing changes until the user approves, by rule 4. The user can judge a change only from its map, and a part lost unseen is hard to find later.
   - Include every item's destination, each part's boundary in one sentence, reference changes, retirements and exclusions.
   - Check the map for gaps and overlaps, then run step 7's check on it before you show it.
   - Show it whole when it fits on a screen. Otherwise put it in a named file and give the path, parts, counts and exceptions.
   - Ask through the `respond-ask` guide. When you only plan a whole not yet written, return the proposed parts to the active caller instead, by rule 10.
5. **Apply the approved map through the chosen operation's guide.** A change beyond the approval is one the user never judged.
   - Keep to the work the user approved and the facts behind that approval. Follow rule 8 for code.
6. **Check the applied result, then return it and end the turn for the user's confirmation.** A change looks complete before anyone has checked that nothing was lost, by rules 3 and 5.
   - Check through the `act-verify` guide, with rule 3's inventory or rule 8's code checks.
   - Return the principle, boundaries, before-and-after map, each item's place, exceptions, evidence, and what was retired, edited or relinked.
   - Report which approvals the user gave, whether the check was independent and whether the user confirmed the result.
   - Run step 7's check before you return it. Follow rules 5 and 6 for confirmation or rejection. The caller keeps the result. Without a caller, keep it in the response.
7. **Check every result before you return it, and say which state it is in.** Always do this last, before each return: findings, a map shown for approval, a plan for a new whole, or a changed arrangement. A proposal reported as done, or a check reported as confirmed, misleads the user about what changed.
   - The states: findings, an unapplied proposal, a checked result awaiting confirmation, or confirmed completion.
   - In a completed change, every required in-scope item has one home, approved exclusions are kept and retired items are marked.
   - Report the checks actually run, any missing independent check, and the approvals. Return the result to the caller without restarting its work.
   - Follow the final step of each guide you used.
