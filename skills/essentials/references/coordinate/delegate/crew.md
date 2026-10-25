# coordinate-delegate-crew

Coordinates parallel changes to separate items, then joins and checks the whole result.

Needs: permitted workers through the active `coordinate-delegate` call. If unavailable, return the limitation and unstarted work. Report partial changes and unfinished checks honestly.

## Rules

1. **Assign one writer to each item.** Parallel writes to the same item overwrite work. Give every shared item one owner. Other workers send that owner proposals, or leave them for the final pass.
2. **Apply the current plan and choice approvals before changing anything.** Use `devise-plan` and the `understand` skill. Their exact exceptions and scoped approval reuse apply. A request for a plan authorizes no execution. Keep cost and other guardrails separate.
3. **Reread each written item from disk after writing it.** Another worker may have changed nearby material. This check follows, rather than replaces, `act-guardrails`' check before writing.

## Instructions

1. **Plan the parts through `devise-plan`.** It uses `organize` to divide future work. Name each worker's scope, shared items, owners and checks. Existing material rearranged by a step still uses organize's approvals.
2. **Return a plan-only request without starting workers.** For execution, obtain the approvals required by rule 2 before the active parent starts workers.
3. **Run authorized disjoint changes through the active delegate call.** Use the active delegate call's controls and briefs. Keep its required baseline, actual task status, verification and cleanup. Workers start no further workers. Return approval questions to the caller.
4. **Make one pass over the whole in sequence.** The main agent joins what parallel work left separate and applies approved shared-item proposals. Stay inside the approved scope. A job whose changes all affect one item uses one writer; several reading views may use `coordinate-delegate-fanout` first.
5. **Check the whole result through `act-verify`.** A failed or cancelled part leaves its dependent work unfinished. Report partial changes and the next owner. Do not claim completion or silently undo unrelated or later edits.

## The last instruction

Return the changes actually made and evidence of verification to the active caller. Report the result of the final pass over the whole job. Claim completion only when the whole authorized job passed its checks. Keep pending work, user decisions and cleanup visible. Never restart the parent's method selection.
