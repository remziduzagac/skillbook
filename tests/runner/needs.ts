import { check } from "./checks";
import type { Event, SkillNeed, Turn } from "./types";

// The base every request that a direct answer does not finish reads. The other main guides (understand, organize,
// coordinate) are read at their stage, so a turn lists them in its own needs (D298, D300).
export const ALWAYS_NEEDED = ["essentials", "act", "respond", "respond-layout", "act-rightsize", "devise"];
export interface ResolvedNeed extends SkillNeed {
  needed: boolean | null;
  origin: string;
  path?: string;
}
export function resolvedNeeds(turn: Turn, evidence: Event, always = false): ResolvedNeed[] {
  const labels: ResolvedNeed[] = [
    ...(always ? ALWAYS_NEEDED.map(skill => ({ skill, deadline: "first change" as const, needed: true,
      origin: "always needed" })) : []),
    ...(turn.skill_needs ?? []).map(n => ({ ...n, needed: true, origin: "needs" })),
    ...(turn.also_called ?? []).map(n => ({ ...n, needed: true, origin: "also called" })),
    ...(turn.if_taken ?? []).map(n => {
      const verdicts = n.taken_when ? Object.values(check(n.taken_when, evidence)) : [];
      const mark = (evidence.path_marks ?? []).find((m: Event) => m.path === n.path &&
        typeof m.taken === "boolean" && ((m.quote?.trim() && evidence.answer?.includes(m.quote)) ||
          (m.action && evidence.actions?.some((a: Event) => a.id === m.action))));
      const needed = verdicts.length ? verdicts.includes(false) ? false : verdicts.includes(null) ? null : true :
        mark?.taken ?? null;
      return { skill: n.skill, deadline: n.deadline, path: n.path, needed, origin: "if taken" };
    }),
  ];
  // Each parent inherits the child's deadline and applicability, top down.
  return labels.flatMap(n => n.skill === "essentials" ? [n] : n.skill.split("-").map((_, i, all) =>
    ({ ...n, skill: all.slice(0, i + 1).join("-") })));
}
// Every guide a turn can need: its labels, including conditional paths whether or not taken, and the guides of rules
// it states as criteria or marks as applying, unless marked as a near miss or not applying, as measurementPlan judges
// them. Parents come with their children, as in resolvedNeeds.
export function reachableGuides(turn: Turn, rules: { id: string; key: string; required_skill: string }[] = []): Set<string> {
  const guides = new Set(resolvedNeeds({ ...turn, if_taken: [] }, {}, true).map(n => n.skill));
  const add = (skill: string) => skill.split("-").forEach((_, i, all) => guides.add(all.slice(0, i + 1).join("-")));
  for (const need of turn.if_taken ?? []) add(need.skill);
  const ids = new Set([...(turn.rule_marks ?? []).filter(m => m.applies && !m.near_miss).map(m => m.id),
    ...rules.filter(r => turn.rubric?.some(c => c.source_check === r.key)).map(r => r.id)]);
  for (const rule of rules) if (ids.has(rule.id) &&
    !(turn.rule_marks ?? []).some(m => m.id === rule.id && (m.near_miss || !m.applies))) add(rule.required_skill);
  return guides;
}
