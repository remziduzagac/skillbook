import type { AccessTurn } from "./access";
import type { Event, Verdict } from "./types";
// These checks need explicit applicability and affected paths. An empty diff alone proves no opportunity.
export function codeOutcome(key: string, input: {
  applies: boolean | null; access: AccessTurn; actions: Event[]; changed: string[];
  affected?: string[]; evidence_action?: string; claim_event?: number;
}): Verdict {
  if (input.applies !== true) return null;
  if (key === "wait-for-answer") {
    if (input.affected?.length && input.changed.some(p => input.affected!.some(a => p.endsWith(a)))) return false;
    if (input.access.complete && !input.access.change_unknown && (!input.changed.length || input.affected?.length)) return true;
    return null;
  }
  if (key === "evidence" && input.evidence_action && input.claim_event !== undefined) {
    const matching = input.actions.filter(a => a.id === input.evidence_action);
    const action = matching.find(a => a.phase === "item.completed") ?? matching[0];
    const ready = action?.result_order ?? (action?.phase === "item.started" ? null : action?.order);
    if (typeof ready !== "number" || ready < 0) return null;
    if (ready >= input.claim_event) return false;
    // The semantic check still decides whether this evidence supports the claim.
    return null;
  }
  return null;
}
