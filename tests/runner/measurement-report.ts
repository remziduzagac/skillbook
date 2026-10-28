import { createHash } from "node:crypto";
import { grid, exercised, compareConditions, loadingView, type Opportunity } from "./measurement";
import { ruleChecks } from "./rule-checks";
import { resolveDeadline } from "./measure-turn";
import type { Event } from "./types";
import annotations from "../fixtures/access/annotations.json";
export function measurementReport(runs: Event[]) {
  const checks = ruleChecks(), rows = runs.flatMap(r => r.turns.flatMap((t: Event) => t.opportunities ?? [])) as Opportunity[];
  const groupedRows = rows.map(row => ({ ...row, version: createHash("sha256").update(row.version).digest("hex") }));
  const groups = [...new Set(groupedRows.map(r => [r.agent,r.model,r.mode,r.version,r.trigger].join("/")))];
  const views = groups.map(group => {
    const own = groupedRows.filter(r => [r.agent,r.model,r.mode,r.version,r.trigger].join("/") === group);
    return { group, rules: [...new Set(own.map(r => r.id))].map(id => {
      const selected = own.filter(r => r.id === id);
      return { id, ...grid(selected.filter(r => r.condition === "installed")), no_skill_results: grid(selected.filter(r => r.condition === "no-skill")).results, comparison: compareConditions(selected),
        results_comparison: compareConditions(selected.filter(r => r.result !== "excluded").map(r =>
          ({ ...r, parts: [{ verdict: r.result === undefined ? null : r.result as any, deadline: 0, availability: "unknown" as const }] }))) };
    }), exercised: Object.fromEntries(["installed", "no-skill"].map(condition => [condition, exercised(own.filter(r => r.condition === condition), checks.map(c => c.id))])) };
  });
  const loading = runs.flatMap(run => run.turns.filter((t: Event) => t.access).map((t: Event) => {
    const needs = (t.opportunities ?? []).filter((o: Opportunity) => o.needed !== false && o.trigger !== "near-miss").map((o: Opportunity) =>
      ({ skill: o.skill, needed: o.needed, deadline: o.deadline === null ? null : Math.min(...o.parts.map(p => p.deadline)), origin: o.origin }));
    for (const need of t.skill_needs ?? []) needs.push({ skill: need.skill, needed: true, origin: "scenario",
      deadline: resolveDeadline(need.deadline, t.access) });
    for (const skill of ["essentials", "act", "understand", "respond"])
      needs.push({ skill, needed: true, deadline: resolveDeadline("first change", t.access), origin: "mandatory startup" });
    return { case: run.case, agent: run.agent, model: run.model, condition: run.condition, turn: t.access.turn,
      skills: run.condition === "no-skill" ? [] : loadingView(t.access, needs, Object.keys(run.skill_sources ?? {})) };
  }));
  const loading_counts: Record<string, Record<string, number>> = {};
  for (const turn of loading) for (const skill of turn.skills) {
    const key = [turn.agent, turn.model, turn.condition, skill.skill].join("/");
    const counts = loading_counts[key] ??= { needed_loaded: 0, needed_not_loaded: 0,
      not_needed_loaded: 0, not_needed_not_loaded: 0, unknown: 0, reused: 0 };
    if (skill.reused) counts.reused!++;
    if (skill.needed === null || skill.availability === "unknown") counts.unknown!++;
    else counts[`${skill.needed ? "needed" : "not_needed"}_${skill.availability === "opened" ? "loaded" : "not_loaded"}`]!++;
  }
  return { loading_counts, reader_validation: { codex: { reader: annotations.reader_version,
    sessions: annotations.sessions.length, agreement: annotations.agreement, user_check: "pending; timing is reader-assisted" },
    claude: "pending recordings" },
    views, scenarios: [...new Set(groupedRows.map(r => r.case))].map(id => ({ id,
      comparison: compareConditions(groupedRows.filter(r => r.case === id)),
      results: compareConditions(groupedRows.filter(r => r.case === id && r.result !== "excluded").map(r =>
        ({ ...r, parts: [{ verdict: r.result === undefined ? null : r.result as any, deadline: 0, availability: "unknown" as const }] }))) })),
    loading, result_parts: runs.flatMap(run => run.turns.flatMap((t: Event) =>
      (t.result_parts ?? []).map((p: Event) => ({ case: run.case, turn: t.access?.turn, condition: run.condition, ...p,
        judgment: t.judgments?.find((j: Event) => j.id === p.id) ?? null })))), frozen_checks: checks, limitations: ["Repeated turns are correlated; Wilson ranges describe this sample.",
      "Codex exec JSON cannot establish absence of compaction; reuse requires complete native 0.163.0 rollout checkpoints from the throwaway home.",
      "Missing, changed, unsupported or compacted native history leaves Codex retention unknown; native boundaries leave current-turn loading unknown when order cannot be aligned.",
      "Claude reuse requires the same recorded session with no compaction/resume boundary; native reader validation is pending.",
      "Helpers and unsupported opaque command effects remain unknown.",
      "Result parts without completed evidence remain unknown; internal returns without visible requirements are excluded."] };
}
