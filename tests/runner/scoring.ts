import { check } from "./checks";
import type { Observation, TaggedCheck, TaggedResult, Verdict, RubricJudge, JudgeRequest } from "./types";
export function evaluateTagged(
  checks: TaggedCheck[],
  observation: Partial<Observation>,
  earlier: Record<string, Verdict>,
  fixture?: string,
  tmp: string[] | null = null,
): TaggedResult[] {
  return checks.map((c) => {
    const dep = c.depends_on;
    if (dep && earlier[`${dep.turn}:${dep.check}`] !== true) return {
      id: c.id, tag: c.tag,
      verdict: earlier[`${dep.turn}:${dep.check}`] === null ? null : "not reached",
    };
    const verdicts = Object.values(check(c.assert, observation, fixture, tmp));
    return { id: c.id, tag: c.tag, verdict: verdicts.includes(false) ? false : verdicts.includes(null) ? null : true };
  });
}
export function score(rows: TaggedResult[]) {
  const result: Record<
    string,
    {
      passed: number;
      total: number;
      unknown: number;
      not_reached: number;
      rate: number | null;
      interval: [number, number];
    }
  > = {};
  for (const row of rows) {
    const s = (result[row.tag] ??= { passed: 0, total: 0, unknown: 0, not_reached: 0, rate: null, interval: [0, 1] });
    if (row.verdict === null) s.unknown++;
    else if (row.verdict === "not reached") s.not_reached++;
    else {
      s.total++;
      s.passed += Number(row.verdict);
    }
  }
  for (const s of Object.values(result))
    if (s.total) {
      const n = s.total,
        p = s.passed / n,
        z = 1.959963984540054,
        d = 1 + (z * z) / n,
        center = (p + (z * z) / (2 * n)) / d,
        half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
      s.rate = p;
      s.interval = [Math.max(0, center - half), Math.min(1, center + half)];
    }
  return result;
}
export async function judgeRubric(judge: RubricJudge, request: JudgeRequest) {
  const result = await judge(request);
  if (
    result.id !== request.rubric.id ||
    result.tag !== request.rubric.tag ||
    ![true, false, null, "not reached"].includes(result.verdict) ||
    !result.reason.trim()
  )
    throw Error("invalid rubric judgment");
  return result;
}

export function scoreRuns(
  runs: { agent: string; model: string; user_mode?: string; unreached_turn_checks?: TaggedResult[]; run_checks?: TaggedResult[]; turns: { tagged_checks?: TaggedResult[]; judgments?: TaggedResult[] }[] }[],
) {
  const groups: Record<string, TaggedResult[]> = {};
  for (const run of runs) {
    const key = `${run.agent}/${run.model}${run.user_mode ? "/" + run.user_mode : ""}`;
    (groups[key] ??= []).push(...run.turns.flatMap((t) => [...(t.tagged_checks ?? []), ...(t.judgments ?? [])]), ...(run.unreached_turn_checks ?? []), ...(run.run_checks ?? []));
  }
  return Object.fromEntries(Object.entries(groups).map(([key, rows]) => [key, score(rows)]));
}
