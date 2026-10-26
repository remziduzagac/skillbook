import { scoreRuns } from "./scoring";
import { readFileSync } from "node:fs";
import { walk } from "./inventory";
import type { Event } from "./types";
export function runStatus(r: Event) {
  const semantic = (r.turns ?? []).flatMap((t: Event) => [...(t.tagged_checks ?? []), ...(t.judgments ?? [])]);
  const failed = Object.entries(r.checks ?? {})
      .filter(([, v]) => v === false)
      .map(([n]) => n),
    unknown = Object.entries(r.checks ?? {})
      .filter(([, v]) => v === null)
      .map(([n]) => n);
  failed.push(...semantic.filter((s: Event) => s.verdict === false).map((s: Event) => `${s.tag}/${s.id}`));
  unknown.push(...semantic.filter((s: Event) => s.verdict === null).map((s: Event) => `${s.tag}/${s.id}`));
  let status = r.error
    ? "error"
    : failed.length
      ? "FAIL " + failed.join(", ")
      : unknown.length
        ? "unknown evidence: " + unknown.join(", ")
        : r.review?.length
          ? "automatic checks passed; review pending"
          : "ok";
  const price = r.cost === null ? "cost unknown" : "$" + r.cost.toFixed(3);
  return `${status} (${price}${r.cost_unknown ? "; additional cost unknown" : ""})`;
}
export function runsToJudge(folders: string[]): string {
  return folders
    .flatMap(walk)
    .filter((p) => p.endsWith("/summary.json"))
    .sort()
    .flatMap((path) =>
      (JSON.parse(readFileSync(path, "utf8")) as Event[])
        .filter((r) => !r.routing_only)
        .map((r) => [r.case, r.agent, r.model, r.run, path.replace(/\.json$/, ".md")].join("\t")),
    )
    .map((x) => x + "\n")
    .join("");
}
export function summarize(results: Event[], spent: number, unknown = 0): string {
  const lines = [
    "# AI test results",
    "",
    `Spent: $${spent.toFixed(3)}${unknown ? `, plus unquantified spending in ${unknown} runs` : ""}`,
    "",
    "Results are per agent and model. Automatic checks leave semantic review pending.",
    "",
  ];
  for (const [group, scores] of Object.entries(scoreRuns(results as any))) {
    lines.push(`## Scores: ${group}`, "", "95% Wilson intervals over scored checks; correlated turns are not independent trials.", "");
    for (const [tag, s] of Object.entries(scores))
      lines.push(`- ${tag}: ${s.passed}/${s.total}; ${s.rate === null ? "unknown" : (100*s.rate).toFixed(1)+"%"}; ` +
        `95% ${(100*s.interval[0]).toFixed(1)}–${(100*s.interval[1]).toFixed(1)}%; ` +
        `${s.unknown} unknown; ${s.not_reached} not reached`);
    lines.push("");
  }
  const fits: Record<string, { off: number; unknown: number; total: number }> = {};
  for (const r of results) if (r.user_mode === "fixed") {
    const counts = fits[r.case] ??= { off: 0, unknown: 0, total: 0 };
    const before = counts.total;
    for (const t of r.turns ?? []) if (t.fit) {
      counts.total++;
      counts.off += Number(t.fit.off_script === true);
      counts.unknown += Number(t.fit.off_script === null);
    }
    const missing = Math.max(0, (r.expected_turns ?? r.turns.length) - 1 - (counts.total - before));
    counts.total += missing;
    counts.unknown += missing;
  }
  lines.push("## Fixed-script fit", "", ...Object.entries(fits).map(([id, s]) =>
    `- ${id}: ${s.off} off-script / ${s.total} transitions; ${s.unknown} unknown`), "");
  const pairs = [...new Set(results.map((r) => JSON.stringify([r.agent, r.model])))].sort();
  const failures: Record<string, Set<string>> = {};
  for (const pair of pairs) {
    const [agent, model] = JSON.parse(pair),
      mine = results.filter((r) => r.agent === agent && r.model === model);
    const passed = mine.filter((r) => !r.error && Object.values(r.checks ?? {}).every((v) => v === true)).length;
    lines.push(`- ${agent} (${model}): every automatic check passed in ${passed} of ${mine.length} runs`);
    for (const r of mine)
      if (r.error || !Object.values(r.checks ?? {}).every((v) => v === true))
        (failures[r.case] ??= new Set()).add(`${agent} (${model})`);
  }
  lines.push("");
  const shared = Object.entries(failures).filter(([, models]) => models.size > 1);
  if (shared.length)
    lines.push(
      "Failed on more than one model, so worth looking into:",
      ...shared.map(([id, models]) => `- ${id}: ${[...models].sort().join(", ")}`),
      "",
    );
  const groups = [...new Set(results.map((r) => JSON.stringify([r.case, r.agent, r.model])))].sort();
  for (const group of groups) {
    const [id, agent, model] = JSON.parse(group),
      runs = results.filter((r) => r.case === id && r.agent === agent && r.model === model);
    lines.push(`## ${id} — ${agent} (${model})`, "");
    for (const r of runs) {
      lines.push(`- run ${r.run}: ${runStatus(r)}`);
      if (r.error) lines.push(`- error: ${r.error}`);
      if (r.changes?.length) lines.push(`- changed: ${r.changes.join(", ")}`);
      for (const [name, value] of Object.entries(r.checks ?? {}))
        lines.push(`- ${name}: ${value === null ? "0 of 1; 1 unknown" : value ? "1 of 1" : "0 of 1"}`);
      if (r.sequencing_unknown) lines.push(`- order unknown from: ${r.sequencing_unknown}`);
      if (r.agents_unseen) lines.push("- An agent may have run unseen in the exec record.");
      if (r.progress_findings?.length) lines.push("", "Unscored progress review:",
        ...r.progress_findings.map((f: Event) => `- Turn ${f.turn} (${f.flags.join(", ")}): ${f.text}`));
      if (r.review?.length) {
        lines.push("", "Semantic review pending; passing automatic checks is not a full scenario verdict.");
        for (const item of r.review) lines.push(`- [ ] ${item}`);
      }
      for (const [i, t] of (r.turns ?? []).entries()) {
        lines.push("", `Run ${r.run}, turn ${i + 1}, final answer:`, "", t.final_answer ?? t.answer ?? "(No answer.)");
        lines.push("", "Scripted message: " + (t.scripted_message ?? ""),
          "Sent message: " + (t.sent_message ?? ""), "Steered: " + String(t.steered ?? false));
        if (t.fit) lines.push("Fit: " + JSON.stringify(t.fit));
        if (t.judgments?.length) lines.push("Rubric results: " + JSON.stringify(t.judgments));
        if (t.between_tools?.length)
          lines.push("", "Text written between tool calls (also visible to the user):", "", ...t.between_tools);
        if (t.trace_complete === false) lines.push("", "Trace incomplete; absence of an action is not established.");
        if (t.left_running === null)
          lines.push("", `Whether anything was still running is unknown: ${t.left_unknown_because ?? "unavailable"}`);
        else if (t.left_running?.length)
          lines.push("", "Still running when the turn ended:", ...t.left_running.map((x: string) => "- " + x));
        if (t.tmp_listing?.entries?.length)
          lines.push("", "Temporary paths and sizes:", "```json", JSON.stringify(t.tmp_listing, null, 2), "```");
        if (t.actions?.length)
          lines.push("", "Recorded actions:", "```json", JSON.stringify(t.actions, null, 2), "```");
        for (const [path, diff] of Object.entries(t.file_diffs ?? {}))
          lines.push("", `Fixture changes: ${path}`, "", "```diff", String(diff).trimEnd(), "```");
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}
