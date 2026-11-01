import { check } from "./checks";
import type { Event, SkillNeed, Turn } from "./types";

export const ALWAYS_NEEDED = ["essentials", "act", "understand", "devise", "organize", "coordinate", "respond",
  "respond-layout", "act-rightsize"];
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
