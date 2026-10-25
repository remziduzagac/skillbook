# organize

Arranges bounded items while preserving what they mean. Also plans the parts of a future whole and checks gaps and overlaps.

Needs: optional delegation for inventory judgment. Without it, use scripts and compare old parts with their new places yourself. Required independent checks follow `act-verify` rule 2.

```text
split       A               → A1 A2 A3
merge       A A' A"          → A
compose     A B C            → P over A, B, C
normalize   A[x] B[x]        → A[→X] B[→X] X
cluster     A B C            → view over A, B, C
```

## Rules

1. **Use one dividing principle at a time.** One question sorts the items. Mixing principles creates overlaps.
2. **Give each part a boundary in one sentence.** Follow `act-rightsize` for parts that cover everything without overlap. An unstated boundary hides overlaps.
3. **Preserve meaning when rearranging existing material.** Map every original statement to its new place with the same meaning. Nothing substantive is lost, added or changed. Use scripts for mechanical checks. Use available permitted agents for judgment. Without a helper, compare each old part with its new place yourself and report the inventory as self-checked. This fallback permits rereading. Avoid carrying the whole collection twice when smaller comparisons suffice. A count alone does not check meaning. Follow `act-verify` rule 2 when independence is required. Report an unfinished independent check and who should arrange it. User confirmation does not replace it.
4. **Get the user's approval before changing any item or view.** Show the map by step 9. Ask through `respond-ask`. End the turn before applying. Reuse actual approval only within its scope and basis. Given steps, a go-ahead shortcut in `act` rule 13, or rightsize's one-approval rule do not waive these two checkpoints. Meaning is at stake. A mode change, task box or unanswered question is not approval. A delegated worker returns questions to its caller.
5. **Get the user's confirmation after checking the applied result.** Return the evidence and result marked awaiting confirmation. End the turn. Confirmed completion needs the user's actual reply. Repair lost statements or failed checks and rerun the check before asking for confirmation. A rejected plan returns to planning, or to step 1 if the principle was rejected.
6. **Undo only this operation's changes when its result is rejected.** Check for later edits first. Preserve later and unrelated work. If safe undo cannot be shown or needs a risky new action, report the state and ask about recovery through `act-guardrails`. Do not overwrite others' work to restore an old snapshot. After safe undo, plan again.
7. **Keep retired items marked with where their content went.** Links and history may still lead there. Use a notice such as "merged into …". Deleting them is a separate action through `act-guardrails`.
8. **Use the whole code-preservation check for code and packages.** Load `softeng` when installed. Use `design-architecture` and `implement` by its name rule. Without it, propose generic parts and connections, then make only approved changes directly. Run project tests before and after. Keep public interfaces, documented behavior and untested requirements, by `act-rightsize`'s code rule. Passing tests alone prove less. Report unavailable checks. Claim no specialist architecture review from the fallback.
9. **Leave approved exclusions preserved outside the changed scope.** Every required in-scope item has one home in a completed arrangement. A check or unapplied proposal may report gaps. A partly resolved change is not complete.
10. **Use the creating skill's approvals when only planning a future whole.** Its requirements are the items to divide. No existing arrangement changes, so rules 3–7 do not apply. Writing a view over existing items still uses both checkpoints. A mixed request keeps the safeguards for existing material.

## Advice

- An "other" or "misc" part can hide a missing principle.
- Parts side by side should have the same level of detail and use the same terms.
- More than about seven parts at one level can be hard to hold in mind.
- A part readers mostly open to skip may contain several parts' worth.

## Instructions

1. **Find the whole, its purpose, the unit and the dividing principle.** Units can be sentences, sections, files, skills, functions, modules or system components. Follow `understand` rule 5 for who chooses and when choices are shown. It also governs survivor, parent and home choices below.
2. **Return findings directly for a check-only request.** Compare written or planned parts with everything they must cover. Report gaps, overlaps, mixed levels and conflicting terms. Check a proposed new item against content already placed too. Change nothing and ask neither approval. This bounded check returns to its active caller without running the operation chooser again.
3. **Load the operation by what happens to the items.** Children prepare a proposal first. They apply only under this parent's approved map.

4. **split** (`organize-split`): one written or planned whole becomes parts, or all loose items are sorted into groups by one principle.
   - Not for: selected items getting a shared parent (`organize-compose`), a view for finding items (`organize-cluster`), or duplicate accounts of one whole (`organize-merge`).
   - Gives back: parts, boundaries and each item's place, with unresolved placements marked.
5. **merge** (`organize-merge`): duplicate accounts of the same whole become one survivor, keeping compatible unique details.
   - Not for: a shared part (`organize-normalize`) or only a theme (`organize-compose`).
   - Gives back: the survivor or proposal, its statement map, reference changes and retired items.
6. **compose** (`organize-compose`): selected items get a parent that says what they share, moving under it where folders hold the arrangement.
   - Not for: sorting every item into groups (`organize-split`) or only finding items (`organize-cluster`).
   - Gives back: the parent, what it states the items share and the selected items with their content unchanged.
7. **normalize** (`organize-normalize`): a repeated part becomes one shared home that eligible items reference.
   - Not for: duplicate whole accounts (`organize-merge`).
   - Gives back: the shared part and working references, with differing copies unchanged and listed.
8. **cluster** (`organize-cluster`): a view helps find items, with source content unchanged. Navigation tags may be written into items only when the user asks for that form.
   - Not for: moving items into groups (`organize-split`), adding a shared parent (`organize-compose`), or effects beyond navigation (the caller and `act-guardrails`).
   - Gives back: the view, how it stays current and exact requested tag edits. Source content is otherwise unchanged.

9. **Prepare the before-and-after map.** Include every item's destination, boundaries, reference changes, retirements and exclusions. Show it whole when it fits on a screen. Otherwise put it in a named file and give the path, parts, counts and exceptions. Get rule 4's approval before applying. For planning only, return the proposed parts to the active caller instead.
10. **Apply the approved map through the chosen child.** Stay within its scope and basis. Follow rule 8 for code.
11. **Check and return the actual result.** Use `act-verify` and rule 3's inventory or rule 8's code checks. Include the principle, boundaries, before-and-after map, each item's place, exceptions, evidence and what was retired, edited or relinked. Give approval, independence and confirmation status. Follow rules 5 and 6 for confirmation or rejection. The caller keeps the result; without a caller, keep it in the response.

Use several operations when needed, such as normalize then cluster. A request fitting none uses judgment under the `act` skill. Renaming, reordering or moving one item is the work itself. Deletion uses `act-guardrails`. For content editing, load `authoring` for `edit` or `softeng` for `implement` when that set is installed. Use its name rule. Otherwise return that edit to the caller under the `act` skill. Your own leftovers use `act-cleanup`.

## The last instruction

Distinguish findings, an unapplied proposal, a checked result awaiting confirmation and confirmed completion. Required in-scope items have one home in a completed change. Preserve approved exclusions and mark retired items. Report actual checks, missing independent checks and approvals. Return to the active caller without restarting it. Apply each used child's last instruction.
