import type { AccessTurn } from "./access";
import type { Verdict } from "./types";
function wilson(passed: number, total: number): [number, number] {
  const z = 1.959963984540054, p = passed / total, d = 1 + z*z/total;
  const center = (p + z*z/(2*total))/d;
  const half = z*Math.sqrt(p*(1-p)/total + z*z/(4*total*total))/d;
  return [Math.max(0,center-half), Math.min(1,center+half)];
}
export type Availability = "opened" | "not opened" | "unknown";
export interface Part {
  verdict: Verdict; deadline: number; deadline_known?: boolean; availability: Availability; evidence?: string; reused?: boolean;
}
export interface Opportunity {
  id: string; skill: string; turn: number; case: string; conversation: string;
  agent: string; model: string; mode: string; version: string; condition: "installed" | "no-skill";
  needed?: boolean | null; trigger: "trigger" | "near-miss"; origin: "scenario" | "action" | "claim";
  parts: Part[]; result?: Verdict | "excluded"; no_skill_eligible: boolean;
  timing?: "no change" | "attempted change" | "unknown";
  deadline?: number | null;
}
export function combine(parts: Verdict[]): Verdict {
  return parts.includes(false) ? false : parts.includes("not reached") ? "not reached" :
    !parts.length || parts.includes(null) ? null : true;
}
export function availability(access: AccessTurn, skill: string, deadline: number): Availability {
  return availableText(access, skill, deadline).availability;
}
export function availableText(access: AccessTurn, skill: string, deadline: number) {
  if (access.context_boundary_unknown) return { availability: "unknown" as Availability, reused: false };
  const boundary = Math.max(-1, ...(access.boundaries ?? []).filter(b => b <= deadline));
  if (access.records.some(r => r.skill === skill && r.extent === "whole" && r.result !== null && r.result <= deadline && r.result > boundary))
    return { availability: "opened" as Availability, reused: false };
  if (boundary < 0 && access.reused_whole?.some(r => r.skill === skill))
    return { availability: "opened" as Availability, reused: true };
  const uncertain = access.prior_whole?.includes(skill) || access.records.some(r =>
    r.skill === skill && (r.extent === "whole" && r.result !== null && r.result <= boundary ||
      r.extent === "unknown" && r.success !== false && (r.result ?? r.start) <= deadline));
  return { availability: access.complete && !uncertain ? "not opened" as Availability : "unknown" as Availability, reused: false };
}
export function opportunity(parts: Part[]) {
  const earliest = Math.min(...parts.map(p => p.deadline));
  const atDeadline = parts.filter(p => p.deadline === earliest).map(p => p.availability);
  return { verdict: combine(parts.map(p => p.verdict)), availability:
    parts.some(p => p.deadline_known === false) || atDeadline.includes("unknown") ? "unknown" : atDeadline.includes("not opened") ? "not opened" : "opened" };
}
export function verified(verdict: boolean | null, evidence: { quote?: string; action?: string }, answer: string, actions: { id: string }[]): Verdict {
  if (verdict === null) return null;
  return (evidence.quote?.trim() && answer.includes(evidence.quote)) ||
    (evidence.action && actions.some(a => a.id === evidence.action)) ? verdict : null;
}
export interface ResultPart {
  verdict: Verdict; kind: "visible" | "internal"; later_step?: string; exclusion?: string;
  alternatives?: string; alternative?: string;
}
export function selectResultAlternatives<T extends ResultPart>(parts: T[]): T[] {
  const selected = new Map<string, string>();
  for (const part of parts) if (part.alternatives && part.alternative && !selected.has(part.alternatives)) {
    const branch = parts.filter(p => p.alternatives === part.alternatives && p.alternative === part.alternative && !p.exclusion);
    if (branch.length && combine(branch.map(p => p.verdict)) === true) selected.set(part.alternatives, part.alternative);
  }
  return parts.map(p => p.alternatives && selected.has(p.alternatives) && p.alternative !== selected.get(p.alternatives) ?
    { ...p, exclusion: `Alternative ${selected.get(p.alternatives)} supplies this result; ${p.alternative} is not required.` } : { ...p });
}
export function promised(parts: ResultPart[]): Verdict | "excluded" {
  const included = selectResultAlternatives(parts).filter(p => !p.exclusion && (p.kind === "visible" || p.later_step));
  const values = included.filter(p => !p.alternatives).map(p => p.verdict);
  for (const group of new Set(included.map(p => p.alternatives).filter(Boolean))) {
    const alternatives = included.filter(p => p.alternatives === group);
    const branches = [...new Set(alternatives.map(p => p.alternative))].map(alt =>
      combine(alternatives.filter(p => p.alternative === alt).map(p => p.verdict)));
    values.push(branches.includes(true) ? true : branches.includes(null) ? null :
      branches.includes("not reached") ? "not reached" : false);
  }
  return included.length ? combine(values) : "excluded";
}
const rate = (passed: number, total: number) => ({ passed, total, rate: total ? passed / total : null,
  interval: total ? wilson(passed, total) : null });
export function grid(rows: Opportunity[]) {
  const cells = { opened_passed: 0, opened_failed: 0, not_opened_passed: 0, not_opened_failed: 0 };
  const unknown = { loading: 0, behavior: 0, both: 0, not_reached: 0 };
  const results = { passed_present: 0, passed_missing: 0, failed_present: 0, failed_missing: 0, unknown: 0, excluded: 0 };
  for (const row of rows) {
    const o = opportunity(row.parts);
    if (row.condition === "installed") {
      if (o.verdict === "not reached") unknown.not_reached++;
      else if (o.availability === "unknown" && o.verdict === null) unknown.both++;
      else if (o.availability === "unknown") unknown.loading++;
      else if (o.verdict === null) unknown.behavior++;
      else cells[`${o.availability === "opened" ? "opened" : "not_opened"}_${o.verdict ? "passed" : "failed"}`]++;
    }
    if (row.result === "excluded") results.excluded++;
    else if (typeof row.result !== "boolean" || typeof o.verdict !== "boolean") results.unknown++;
    else results[`${o.verdict ? "passed" : "failed"}_${row.result ? "present" : "missing"}`]++;
  }
  const total = Object.values(cells).reduce((a,b) => a+b,0);
  const reused = rows.filter(row => opportunity(row.parts).availability === "opened" &&
    row.parts.some(p => p.deadline === Math.min(...row.parts.map(x => x.deadline)) && p.reused)).length;
  return { cells: Object.fromEntries(Object.entries(cells).map(([k,v]) => [k, rate(v,total)])), unknown, results, reused,
    cases: new Set(rows.map(r => r.case)).size, conversations: new Set(rows.map(r => r.conversation)).size };
}
export function exercised(rows: Opportunity[], inventory: string[]) {
  const seen = new Set(rows.filter(r => typeof opportunity(r.parts).verdict === "boolean").map(r => r.id));
  return { exercised: inventory.filter(id => seen.has(id)), total: inventory.length,
    only_unknown: inventory.filter(id => !seen.has(id) && rows.some(r => r.id === id)),
    never_reached: inventory.filter(id => !rows.some(r => r.id === id)) };
}
export function compareConditions(rows: Opportunity[]) {
  const transitions = { pass_pass: 0, pass_fail: 0, fail_pass: 0, fail_fail: 0, unknown: 0 };
  const pairs = new Map<string, Opportunity[]>();
  for (const row of rows.filter(r => r.no_skill_eligible)) {
    const key = [row.case, row.agent, row.model, row.mode, row.version, row.turn, row.id,
      row.conversation.replace(/\/(?:installed|no-skill)$/, "")].join("|");
    pairs.set(key, [...(pairs.get(key) ?? []), row]);
  }
  for (const pair of pairs.values()) {
    const installed = pair.filter(r => r.condition === "installed"), absent = pair.filter(r => r.condition === "no-skill");
    if (installed.length !== 1 || absent.length !== 1) { transitions.unknown++; continue; }
    const left = opportunity(installed[0]!.parts).verdict, right = opportunity(absent[0]!.parts).verdict;
    if (typeof left !== "boolean" || typeof right !== "boolean") transitions.unknown++;
    else transitions[`${right ? "pass" : "fail"}_${left ? "pass" : "fail"}`]++;
  }
  const eligible = rows.filter(r => r.no_skill_eligible);
  const byCondition = (condition: string) => {
    const values = eligible.filter(r => r.condition === condition).map(r => opportunity(r.parts).verdict);
    return { ...rate(values.filter(v => v === true).length, values.filter(v => typeof v === "boolean").length),
      unknown: values.filter(v => typeof v !== "boolean").length };
  };
  const installed = byCondition("installed"), absent = byCondition("no-skill");
  return { installed, absent, transitions, regressions: transitions.pass_fail, difference_pp: installed.rate === null || absent.rate === null ? null :
    100 * (installed.rate - absent.rate), ineligible: rows.length - eligible.length };
}
export function loadingView(access: AccessTurn, needs: { skill: string; deadline: number | null; origin: string; needed?: boolean | null }[], inventory: string[]) {
  return inventory.map(skill => {
    const applicable = needs.filter(n => n.skill === skill && n.needed !== false), deadline = applicable.some(n => n.deadline === null) ? null :
      applicable.length ? Math.min(...applicable.map(n => n.deadline!)) : Infinity;
    const records = access.records.filter(r => r.skill === skill);
    return { skill, needed: applicable.some(n => n.needed !== null && n.needed !== false) ? true : applicable.length ? null : false, origins: applicable.map(n => n.origin), deadline,
      ...(deadline === null ? { availability: "unknown" as Availability, reused: false } : availableText(access, skill, deadline)), read_turn: access.reused_whole?.find(r => r.skill === skill)?.turn ??
        records.find(r => r.extent === "whole")?.turn ?? null, unneeded_tokens: null,
      partial: records.filter(r => r.extent === "partial").length,
      search: records.filter(r => r.operation === "search").length,
      late: records.filter(r => deadline !== null && r.extent === "whole" && r.result !== null && r.result > deadline).length };
  });
}
