# coordinate-delegate-crew

## Purpose

Coordinates parallel changes to separate items, then joins and checks the whole result.

Needs: permitted workers through the active the `coordinate-delegate` guide call. If unavailable, return the limitation and unstarted work. Report partial changes and unfinished checks honestly.

## When to use

Use when agents will change separate items in parallel. Give each shared item one writer. For example, separate parts can be changed in parallel before a final pass over the whole.

## When not

- Changes all landing in one item: use one writer to avoid overwriting each other’s work.
- Reading only: use the `coordinate-delegate-fanout` guide. There are no parallel edits to join.
- A plan-only request: return the plan without starting workers. Planning does not approve execution.

## Gives back

The approved changes, the final pass over the whole, actual check results and unfinished work.

## Rules

1. **Assign one writer to each item.** Parallel writes to the same item overwrite work. Give every shared item one owner. Other workers send that owner proposals, or leave them for the final pass.
2. **Apply the current plan and choice approvals before changing anything.** Use the `devise-plan` guide and the `understand` guide. Their exact exceptions and scoped approval reuse apply. A request for a plan authorizes no execution. Keep cost and other guardrails separate.
3. **Reread each written item from disk after writing it.** Another worker may have changed nearby material. This check follows, rather than replaces, the `act-guardrails` guide' check before writing.

## Instructions

Join parallel changes to separate items into one checked result. Give shared items one writer so workers do not overwrite each other’s work. **Plan ownership and obtain required approvals before startup, then join the changes in sequence and check the whole.**

1. **Plan separate ownership through the `devise-plan` guide, by rule 1.** Parallel writers on the same item can erase each other's changes.
   - Name worker scopes, shared items, owners and checks. Other workers send shared-item proposals to its owner or leave them for the final pass.
   - Use the `organize` guide for future parts and its own approvals for any rearrangement of existing material.
2. **Return plan-only work without starting workers; obtain execution approvals under rule 2.** Planning is not the user's permission to apply changes.
   - Apply current plan and choice approvals before the active parent starts workers. Keep worker cost and other guardrails separate.
3. **Run allowed separate changes through the active `coordinate-delegate` guide call.** A child startup flow that restarts delegation can lose common limits or assign overlapping work.
   - Use the parent's controls, briefs, baseline, status tracking, verification and cleanup. Workers delegate no further and return approval questions to the caller.
   - Recheck before writes under the `act-guardrails` guide, then reread each written item from disk under rule 3. The post-write read does not replace the pre-write check.
4. **Make one sequential pass over the whole after parallel changes.** Separate successful edits can still leave gaps where their parts meet.
   - Join what the workers left separate and apply only approved shared-item proposals. Stay inside scope.
   - Use the `coordinate-delegate-fanout` guide for several reading views before this final pass where needed.
5. **Check the whole through the `act-verify` guide after the final pass.** Separate worker checks do not prove the joined result works.
   - Keep work dependent on a failed or cancelled part unfinished. Report partial changes and the next owner.
   - Do not claim completion or undo unrelated or later edits silently.
6. **Check joined work and “Gives back” before returning.** Always do this last. A crew report must describe the whole allowed job, including what remains.
   - Check ownership, actual changes, the sequential pass and whole-result evidence. Fix gaps within allowed scope before claiming completion.
   - Return to the active caller with pending work, user decisions and cleanup visible. Restart no parent method selection.
