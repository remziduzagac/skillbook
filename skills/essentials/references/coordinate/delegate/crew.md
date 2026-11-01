# coordinate-delegate-crew

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

1. To give each item one owner, plan the parts through the `devise-plan` guide. It uses the `organize` guide to divide future work. Name each worker's scope, shared items, owners and checks. Existing material rearranged by a step still uses the `organize` guide's approvals.
2. To keep a planning request read-only, return a plan-only request without starting workers. For execution, obtain the approvals required by rule 2 before the active parent starts workers.
3. To avoid overlapping changes, run allowed changes to separate items through the active delegate call. Use the active delegate call's controls and briefs. Keep its required baseline, actual task status, verification and cleanup. Workers start no further workers. Return approval questions to the caller.
4. To join the separate parts, make one pass over the whole in sequence. The main agent joins what parallel work left separate and applies approved shared-item proposals. Stay inside the approved scope. Several reading views may use the `coordinate-delegate-fanout` guide before the final pass.
5. To show whether the whole job works, check the whole result through the `act-verify` guide. A failed or cancelled part leaves its dependent work unfinished. Report partial changes and the next owner. Do not claim completion or silently undo unrelated or later edits.

## The last instruction

Return the changes actually made and evidence of verification to the active caller. Report the result of the final pass over the whole job. Claim completion only when the whole allowed job passed its checks. Keep pending work, user decisions and cleanup visible. Never restart the parent's method selection.
