import { scoreRuns, scenarioReliability } from "./scoring";
import type { Event } from "./types";

export function offScriptCases(runs: Event[]): string[] {
  return [...new Set(runs.filter(r => r.user_mode === "fixed" &&
    r.turns?.some((t: Event) => t.fit?.off_script === true)).map(r => r.case))].sort();
}
export function compareModes(runs: Event[]): string {
  const lines = ["# Scenario mode comparison", "",
    "Semantic scores remain unknown without completed human/model calibration and correct/wrong trace validation.",
    "Intervals are Wilson 95% check intervals; turns within a conversation are correlated.", ""];
  const rate = (s: any) => !s ? "—" : `${s.passed}/${s.total}; ` +
    `${s.rate === null ? "unknown" : (100*s.rate).toFixed(1)+"%"} ` +
    `[${(100*s.interval[0]).toFixed(1)}, ${(100*s.interval[1]).toFixed(1)}]; ` +
    `unknown ${s.unknown}; not reached ${s.not_reached}`;
  const models = [...new Set(runs.map(r => `${r.agent}/${r.model}`))].sort();
  const scores = scoreRuns(runs as any);
  for (const model of models) {
    const fixed = scores[`${model}/fixed`] ?? {};
    lines.push(`## ${model}`, "", "### Main fixed layer: all scenarios", "");
    for (const tag of Object.keys(fixed).sort()) lines.push(`- ${tag}: ${rate(fixed[tag])}`);
    const simulatedCases = new Set(runs.filter(r => `${r.agent}/${r.model}` === model &&
      r.user_mode === "simulated").map(r => r.case));
    if (simulatedCases.size) {
      const matched = scoreRuns(runs.filter(r => `${r.agent}/${r.model}` === model && simulatedCases.has(r.case)) as any);
      const left = matched[`${model}/fixed`] ?? {}, right = matched[`${model}/simulated`] ?? {};
      lines.push("", "### Matched scenarios: fixed versus simulated", "",
        "Both columns include only the scenarios rerun in simulated mode.", "",
        "| Habit or skill | Fixed | Simulated |", "| --- | --- | --- |");
      for (const tag of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort())
        lines.push(`| ${tag} | ${rate(left[tag])} | ${rate(right[tag])} |`);
    }
    lines.push("");
  }
  lines.push("## Three-run reliability", "", "A null pass^3 is unknown; one run cannot establish three-run reliability.", "");
  for (const [key, result] of Object.entries(scenarioReliability(runs))) {
    lines.push(`- ${key}: average ${result.average ?? "unknown"}; pass^3 ${result.pass3 ?? "unknown"}`);
    for (const [id, row] of Object.entries(result.checks))
      lines.push(`  - ${id}: average ${row.average ?? "unknown"}; pass^3 ${row.pass3 ?? "unknown"}; unknown ${row.unknown}; not reached ${row.not_reached}`);
  }
  lines.push("", "## Fit and mode choice", "",
    "| Scenario | Fixed off-script | Unknown fit | Simulated runs | Recommendation |",
    "| --- | --- | --- | --- | --- |");
  for (const id of [...new Set(runs.map(r => r.case))].sort()) {
    const fixed = runs.filter(r => r.case === id && r.user_mode === "fixed");
    const sim = runs.filter(r => r.case === id && r.user_mode === "simulated");
    const fits = fixed.flatMap(r => r.turns.flatMap((t: Event) => t.fit ? [t.fit] : []));
    const off = fits.filter(f => f.off_script === true).length;
    const expected = fixed.reduce((n, r) => n + Math.max(0, (r.expected_turns ?? r.turns.length) - 1), 0);
    const unknown = fits.filter(f => f.off_script === null).length + Math.max(0, expected - fits.length);
    const incomplete = fixed.some(r => r.error);
    const recommendation = off ? (sim.length ? "pending calibrated comparison" : "rerun simulated") :
      incomplete || unknown || !fits.length ? "pending fit evidence" : "fixed";
    lines.push(`| ${id} | ${off}/${expected} | ${unknown} | ${sim.length} | ${recommendation} |`);
  }
  lines.push("", "## Run completeness", "");
  for (const model of models) {
    const own = runs.filter(r => `${r.agent}/${r.model}` === model);
    lines.push(`- ${model}: ${own.length} recorded runs; ${own.filter(r => r.error).length} errors; ` +
      `${own.filter(r => r.cost_unknown).length} runs have unquantified cost.`);
  }
  return lines.join("\n") + "\n";
}
