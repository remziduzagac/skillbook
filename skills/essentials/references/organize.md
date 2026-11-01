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

Give every required part a clear place without changing its meaning. Build the map before applying an arrangement.

1. **Find the whole, its purpose, the unit and the dividing principle.** This helps define the arrangement. Units can be sentences, sections, files, skills, functions, modules or system components. Follow rule 5 of the `understand` guide for who chooses and when choices are shown. The same rule governs which item survives a merge, which parent to add and where a shared part belongs.
2. **Return findings directly for a check-only request.** This helps keep a check-only request read-only. Compare written or planned parts with everything they must cover. Report gaps, overlaps, mixed levels and conflicting terms. Check a proposed new item against content already placed too. Change nothing. Ask for neither approval before a change nor confirmation afterward. This bounded check returns to its active caller without running the operation chooser again.
3. **Load the operation by what happens to the items.** This helps choose the right kind of arrangement. Children prepare a proposal first. Each child applies its proposal only under the `organize` guide's approved map.

   - the `organize-split` guide: divide a whole into parts.
   - the `organize-merge` guide: combine duplicate whole accounts.
   - the `organize-compose` guide: add a shared parent.
   - the `organize-normalize` guide: give repeated parts one home.
   - the `organize-cluster` guide: build a view for finding items.

   Use several operations when needed, such as normalize then cluster. A request fitting none uses judgment under the `act` guide. Renaming, reordering or moving one item is the work itself. Deletion uses the `act-guardrails` guide. For content editing, use a skill in the harness’s list for editing documents or code, if one fits. Otherwise return that edit to the caller under the `act` guide. Your own leftovers use the `act-cleanup` guide.

4. **Prepare the before-and-after map.** This helps let the user judge the change. Include every item's destination, boundaries, reference changes, retirements and exclusions. Show it whole when it fits on a screen. Otherwise put it in a named file and give the path, parts, counts and exceptions. Get rule 4's approval and end the turn before applying. For planning only, return the proposed parts to the active caller instead.
5. **Apply the approved map through the chosen child.** This helps keep the change within approval. Keep to the work the user approved and the facts behind that approval. Follow rule 8 for code.
6. **Check and return the actual result.** This helps show the actual checked result. Use the `act-verify` guide and rule 3's inventory or rule 8's code checks. Include the principle, boundaries, before-and-after map, each item's place, exceptions, evidence and what was retired, edited or relinked. Report which approvals the user gave, whether the check was independent and whether the user confirmed the result. Follow rules 5 and 6 for confirmation or rejection. The caller keeps the result; without a caller, keep it in the response.

7. **Distinguish findings, an unapplied proposal, a checked result awaiting confirmation and confirmed completion.** Always do this last. Required in-scope items have one home in a completed change. Preserve approved exclusions and mark retired items. Report actual checks, missing independent checks and approvals. Return the result to the caller without restarting its work. Apply each used child's final step of Instructions.
