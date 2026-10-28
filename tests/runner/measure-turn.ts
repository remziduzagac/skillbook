import { codeOutcome } from "./rule-outcomes";
import { resultChecks, ruleChecks } from "./rule-checks";
import { availableText, verified, promised, selectResultAlternatives, type Opportunity, type Part } from "./measurement";
import type { StructuredCall } from "./scenario";
import type { AccessTurn } from "./access";
import type { Event, Rubric, Verdict } from "./types";

export interface Claim { quote: string; action: string | null; order: number | null }
export function verifiedClaims(claims: Event[], answer: string, actions: Event[], messages: Event[] = []): Claim[] {
  const checked = claims.flatMap(c => {
    if (typeof c.quote !== "string" || !c.quote.trim() || !answer.includes(c.quote) ||
      !(c.action === null || actions.some(a => a.id === c.action))) return [];
    const positions = messages.filter(m => typeof m.text === "string" && m.text.includes(c.quote) && Number.isInteger(m.order));
    return positions.length ? positions.map(m => ({ quote: c.quote, action: c.action, order: m.order })) :
      [{ quote: c.quote, action: c.action, order: null }];
  });
  return [...new Map(checked.map(c => [JSON.stringify([c.quote, c.action, c.order]), c])).values()];
}
export function verifiedMarks(marks: Event[], answer: string, prompt: string, actions: Event[], checks: Event[]) {
  return marks.filter(m => checks.some(c => c.key === m.key) && typeof m.applicable === "boolean" &&
    ((typeof m.quote === "string" && m.quote.trim() && (answer.includes(m.quote) || prompt.includes(m.quote))) ||
      typeof m.action === "string" && actions.some(a => a.id === m.action)));
}
// One applicability batch per turn; code supplies claim positions from the native record.
export async function applicableClaims(call: StructuredCall, answer: string, actions: Event[], prompt = "", checks: Event[] = [], messages: Event[] = []) {
  const response = await call(
    'Mark claims and rule applicability. Return {"claims":[{"quote":string,"action":string|null}],"marks":[{"key":string,"applicable":boolean,"quote":string,"action":string|null}]}. ' +
    'Each claim quote must be verbatim in the answer, including text before tools. Include claims of project contents, behavior, completion or checks. ' +
    'Action is an existing evidence action id, or null when there is no recorded evidence. Do not infer execution from prose. ' +
    'For each check, mark applicability according to its full source rule; a mark needs a verbatim answer/prompt quote or an existing action id.',
    { answer, actions, prompt, checks });
  if (!Array.isArray(response.claims)) throw Error("invalid claim applicability batch");
  return { claims: verifiedClaims(response.claims, answer, actions, messages),
    marks: verifiedMarks(response.marks ?? [], answer, prompt, actions, checks) };
}

export interface TurnOpportunity {
  definition: Event; rubrics: Rubric[]; applies: boolean | null; deadline: number | null;
  trigger: "trigger" | "near-miss"; origin: "scenario" | "action" | "claim";
  author_marks: Event[]; observed_marks: Event[]; claims: Claim[];
}
export const ANSWER_DEADLINE = Number.MAX_SAFE_INTEGER;
export function resolveDeadline(when: string | number, access: AccessTurn): number | null {
  if (typeof when === "number") return when;
  if (when === "answer") return ANSWER_DEADLINE;
  if (access.first_attempt !== null) return access.first_opaque !== null && access.first_opaque !== undefined &&
    access.first_opaque < access.first_attempt ? null : access.first_attempt;
  return access.change_unknown || access.change_confirmed ? null : ANSWER_DEADLINE;
}

// This inventory is frozen before outcome judging and reused by scoring and reporting.
export function opportunityInventory(turn: Event, rubrics: Rubric[], access: AccessTurn, definitions = ruleChecks()): TurnOpportunity[] {
  const answer = turn.claim_text ?? turn.final_answer ?? "", actions = turn.actions ?? [];
  const claims = verifiedClaims(turn.claim_applicability ?? [], answer, actions, turn.claim_messages ?? []);
  const marks = verifiedMarks(turn.rule_applicability ?? [], answer, turn.sent_message ?? "", actions, definitions);
  const changed = access.first_attempt !== null || access.change_confirmed || !!turn.changes?.length;
  return definitions.flatMap(def => {
    const own = rubrics.filter(r => r.source_check === def.key);
    const authored = (turn.author_rule_marks ?? []).filter((m: Event) => m.id === def.id);
    const observed = marks.filter(m => m.key === def.key);
    const actionApplies = def.applicability === "action" && changed;
    const claimApplies = def.applicability === "claim" && claims.length > 0;
    if (!own.length && !authored.length && !observed.length && !actionApplies && !claimApplies && def.applicability !== "always") return [];
    const applies = actionApplies || def.applicability === "always" ? true : authored.length ? authored.some((m: Event) => m.applies) :
      observed.length ? observed.some(m => m.applicable) : claimApplies ? true : null;
    const deadlines = [resolveDeadline(def.deadline, access), ...authored.map((m: Event) => resolveDeadline(m.deadline, access))];
    const deadline = deadlines.includes(null) ? null : Math.min(...deadlines as number[]);
    return [{ definition: def, rubrics: own.length ? own : [{ id: `rule:${def.id}`, tag: `rule:${def.id}`, source_check: def.key, criterion: def.expected }],
      applies, deadline, trigger: authored.some((m: Event) => m.near_miss) || applies === false ? "near-miss" as const : "trigger" as const,
      origin: actionApplies ? "action" as const : claimApplies ? "claim" as const : "scenario" as const,
      author_marks: authored, observed_marks: observed, claims: def.applicability === "claim" ? claims : [] }];
  });
}
export function inventoryRubrics(rubrics: Rubric[], inventory: TurnOpportunity[]): Rubric[] {
  return [...rubrics.filter(r => !r.source_check), ...inventory.flatMap(o => o.rubrics.map(r => ({ ...r,
    measurement: { applies: o.applies, deadline: o.deadline, claims: o.claims, author_marks: o.author_marks, observed_marks: o.observed_marks } })))];
}
export function measurementPlan(turn: Event, rubrics: Rubric[], access: AccessTurn) {
  const inventory = opportunityInventory(turn, rubrics, access);
  const needed = new Set(inventory.filter(o => o.applies !== false && o.trigger !== "near-miss").map(o => o.definition.required_skill));
  return { inventory, rubrics: inventoryRubrics(rubrics, inventory), result_parts: resultChecks().filter(p => needed.has(p.skill)) };
}
export function assessedResults(turn: Event) {
  return selectResultAlternatives((turn.result_parts ?? []).map((p: Event) => {
    const judged = turn.judgments?.find((j: Event) => j.id === p.id);
    return { ...p, verdict: judged && typeof judged.verdict === "boolean" ?
      verified(judged.verdict, judged, turn.final_answer ?? "", turn.actions ?? []) : null };
  }));
}
function partAt(access: AccessTurn, skill: string, deadline: number | null, verdict: Verdict, applies: boolean | null, evidence?: string): Part {
  return { verdict: applies === null && verdict !== "not reached" ? null : verdict, deadline: deadline ?? ANSWER_DEADLINE, deadline_known: deadline !== null,
    ...(deadline === null ? { availability: "unknown" as const, reused: false } : availableText(access, skill, deadline)), evidence };
}
export function measuredOpportunities(run: Event, turn: Event, rubrics: Rubric[], access: AccessTurn,
  inventory: TurnOpportunity[] = opportunityInventory(turn, rubrics, access)): Opportunity[] {
  const resultParts = assessedResults(turn);
  return inventory.map(entry => {
    const def = entry.definition, parts: Part[] = [];
    const affected = entry.observed_marks.flatMap(m => m.affected_paths ?? []);
    const automatic = codeOutcome(def.key, { applies: entry.applies, access, actions: turn.actions ?? [], changed: turn.changes ?? [], affected });
    if (automatic !== null) parts.push(partAt(access, def.required_skill, entry.deadline, automatic, entry.applies));
    for (const claim of entry.claims) {
      const order = codeOutcome(def.key, { applies: entry.applies, access, actions: turn.actions ?? [], changed: turn.changes ?? [],
        evidence_action: claim.action ?? undefined, claim_event: claim.order ?? undefined });
      if (order !== null) parts.push(partAt(access, def.required_skill, entry.deadline, order, entry.applies, claim.quote));
    }
    if (automatic === null) for (const rubric of entry.rubrics) {
      const judgment = turn.judgments?.find((j: Event) => j.id === rubric.id);
      if (judgment?.verdict === "not reached") {
        parts.push(partAt(access, def.required_skill, entry.deadline, "not reached", entry.applies));
        continue;
      }
      if (judgment?.parts?.length) for (const p of judgment.parts) {
        const action = p.deadline_action ? turn.actions?.find((a: Event) => a.id === p.deadline_action) : undefined;
        const named = p.deadline_action ? typeof action?.order === "number" ? action.order : null : ANSWER_DEADLINE;
        const at = entry.deadline === null || named === null ? null : Math.min(entry.deadline, named);
        const verdict = typeof p.verdict === "boolean" ? verified(p.verdict, p, turn.final_answer ?? "", turn.actions ?? []) : null;
        parts.push(partAt(access, def.required_skill, at, verdict, entry.applies, p.quote ?? p.action));
      }
      else parts.push(partAt(access, def.required_skill, entry.deadline, null, entry.applies));
      if (judgment?.verdict === false && verified(false, judgment, turn.final_answer ?? "", turn.actions ?? []) === false)
        parts.push(partAt(access, def.required_skill, entry.deadline, false, entry.applies));
    }
    if (!parts.length) parts.push(partAt(access, def.required_skill, entry.deadline, null, entry.applies));
    const ownResults = resultParts.filter((p: Event) => p.skill === def.required_skill);
    return { id: def.id, skill: def.required_skill, turn: access.turn, case: run.case,
      conversation: `${run.case}/${run.agent}/${run.model}/${run.run}/${run.condition}`, agent: run.agent,
      model: run.model, mode: run.user_mode, version: JSON.stringify(run.skill_sources), condition: run.condition,
      needed: entry.applies, result: ownResults.length ? promised(ownResults) : undefined,
      deadline: parts.some(p => p.deadline_known === false) ? null : Math.min(...parts.map(p => p.deadline)),
      trigger: entry.trigger, origin: entry.origin, no_skill_eligible: def.no_skill_eligible,
      timing: access.first_attempt !== null ? "attempted change" : access.change_unknown || access.change_confirmed ? "unknown" : "no change", parts };
  });
}
