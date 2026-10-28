import { test, expect } from "bun:test";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { accessTurn, retainAccess } from "./access";
import { availableText, availability, grid, opportunity, promised } from "./measurement";
import { applicableClaims, assessedResults, measuredOpportunities, measurementPlan, opportunityInventory } from "./measure-turn";
import { measurementReport } from "./measurement-report";
import { resultChecks, ruleChecks, validateSource } from "./rule-checks";
import { normalize } from "./cases";
import { parseArgs } from "./cli";
import { runOne } from "./run";
import type { Event, Rubric } from "./types";
import sameSkillReadSearch from "../fixtures/access/same-skill-read-search.json";

const sources = { "act-guardrails": "# guardrails\nwhole text\n", "understand-clarify": "# clarify\nwhole text\n", act: "# act\nwhole text\n", respond: "# respond\nwhole text\n" };
const run: Event = { case: "fix", agent: "codex", model: "sol", run: 1, user_mode: "fixed", condition: "installed", skill_sources: sources };
const done = (id: string, command: string, output = "") => ({ type: "item.completed", item: { id, type: "command_execution", command, aggregated_output: output, exit_code: 0 } });
const rubric = (key = "approval", id = key): Rubric => ({ id, tag: "rule", criterion: key, source_check: key });
const judgment = (id: string, deadline_action: string | null = null): Event => ({ id, verdict: true, quote: "Done", parts: [{ verdict: true, quote: "Done", deadline_action }] });
const turn = (extra: Event = {}): Event => ({ final_answer: "Done", actions: [], changes: [], judgments: [], author_rule_marks: [], ...extra });
const rowFor = (rows: ReturnType<typeof measuredOpportunities>, id: string) => rows.find(r => r.id === id)!;
function reportFor(t: Event, access: ReturnType<typeof accessTurn>, rubrics: Rubric[]) {
  const measurement = measurementPlan(t, rubrics, access);
  const opportunities = measuredOpportunities(run, t, measurement.rubrics, access, measurement.inventory);
  return measurementReport([{ ...run, turns: [{ ...t, access, opportunities }] }]);
}
function reportRule(report: ReturnType<typeof measurementReport>, id: string) {
  return report.views.flatMap(v => v.rules).find(r => r.id === id)!;
}

test("semantic parts cannot postpone a first-change or author deadline in either report view", () => {
  const access = accessTurn("codex", [done("write", "rm old.md"), done("read", "cat /sandbox/skills/essentials/references/act/guardrails.md", sources["act-guardrails"])], 1, sources);
  for (const deadline of [0, 10, "first change"]) for (const partDeadline of [null, "after"]) {
    const t = turn({ changes: ["removed old.md"], actions: [{ id: "after", order: 3 }],
      author_rule_marks: [{ id: "act-guardrails:rule:3", applies: true, deadline }], judgments: [judgment("approval", partDeadline)] });
    const report = reportFor(t, access, [rubric()]);
    expect(reportRule(report, "act-guardrails:rule:3").cells.not_opened_passed.passed).toBe(1);
    const loading = report.loading[0]!.skills.find((s: Event) => s.skill === "act-guardrails")!;
    expect(loading).toMatchObject({ needed: true, deadline: 0, availability: "not opened", late: 1 });
  }
});

test("no-change first-change deadlines use the answer and keep no-change status", () => {
  const access = accessTurn("codex", [done("read", "cat /sandbox/skills/essentials/references/understand/clarify.md", sources["understand-clarify"])], 1, sources);
  const t = turn({ author_rule_marks: [{ id: "understand-clarify:rule:2", applies: true, deadline: "first change" }] });
  const rows = measuredOpportunities(run, t, [rubric("wait-for-answer")], access);
  expect(rowFor(rows, "understand-clarify:rule:2").timing).toBe("no change");
  expect(reportRule(reportFor(t, access, [rubric("wait-for-answer")]), "understand-clarify:rule:2").cells.opened_passed.passed).toBe(1);
  const opaque = { ...access, change_unknown: true, first_opaque: 1 };
  expect(opportunity(rowFor(measuredOpportunities(run, t, [rubric("wait-for-answer")], opaque), "understand-clarify:rule:2").parts).availability).toBe("unknown");
});

test("unmarked deletions establish action needs without a judge applicability mark", () => {
  const access = accessTurn("codex", [done("delete", "rm old.md")], 1, sources);
  const t = turn({ changes: ["removed old.md"] });
  const plan = measurementPlan(t, [], access);
  const entry = plan.inventory.find(o => o.definition.key === "approval")!;
  expect(entry).toMatchObject({ applies: true, origin: "action", deadline: 0 });
  expect(plan.rubrics.some(r => r.source_check === "approval")).toBe(true);
  expect((plan.rubrics.find(r => r.source_check === "approval") as Event).measurement).toMatchObject({ applies: true, deadline: 0 });
  const r = rowFor(measuredOpportunities(run, t, plan.rubrics, access, plan.inventory), "act-guardrails:rule:3");
  expect(r.needed).toBe(true);
  expect(r.parts[0]).toMatchObject({ deadline: 0, availability: "not opened" });
  expect(reportFor(t, access, []).loading[0]!.skills.find((s: Event) => s.skill === "act-guardrails")).toMatchObject({ needed: true, deadline: 0 });
  const unexplained = { ...accessTurn("codex", [], 1, sources), change_confirmed: true };
  expect(measurementPlan(t, [], unexplained).inventory.find(o => o.definition.key === "approval")!.deadline).toBeNull();
  const withRead = { ...accessTurn("codex", [done("read", "cat /sandbox/skills/essentials/references/act/guardrails.md", sources["act-guardrails"])], 1, sources), change_confirmed: true };
  const report = reportFor(t, withRead, []);
  expect(report.loading[0]!.skills.find((s: Event) => s.skill === "act-guardrails")).toMatchObject({ needed: true, deadline: null, availability: "unknown" });
  expect(reportRule(report, "act-guardrails:rule:3").unknown.both).toBe(1);
});

test("verified claims and specific marks activate checks, result parts and the outcome batch together", async () => {
  const t = turn({ final_answer: "Tests pass", claim_text: "Tests pass", claim_messages: [{ text: "Tests pass", order: 1 }] });
  const marked = await applicableClaims(async () => ({ claims: [{ quote: "Tests pass", action: null }],
    marks: [{ key: "fresh-check", applicable: true, quote: "Tests pass", action: null }] }), t.claim_text, [], "", ruleChecks(), t.claim_messages);
  Object.assign(t, { claim_applicability: marked.claims, rule_applicability: marked.marks });
  const access = accessTurn("codex", [], 1, sources), plan = measurementPlan(t, [], access);
  expect(plan.rubrics.some(r => r.source_check === "fresh-check")).toBe(true);
  expect(plan.result_parts.some(p => p.skill === "act-verify")).toBe(true);
  const evidence = plan.rubrics.find(r => r.source_check === "evidence")!;
  t.judgments = [{ id: evidence.id, verdict: false, quote: "Tests pass", parts: [{ verdict: false, quote: "Tests pass" }] }];
  const rows = measuredOpportunities(run, t, plan.rubrics, access, plan.inventory);
  expect(opportunity(rowFor(rows, "act:rule:4").parts).verdict).toBe(false);
  expect(reportFor(t, access, []).loading[0]!.skills.find((s: Event) => s.skill === "act")).toMatchObject({ needed: true });
  const forged = turn({ claim_applicability: [{ quote: "Invented", action: null }], rule_applicability: [{ key: "fresh-check", applicable: true, quote: "Invented" }] });
  expect(measurementPlan(forged, [], access).inventory.some(o => o.definition.key === "fresh-check")).toBe(false);
});

test("code rejects a claim whose evidence result arrives after the claim", () => {
  const access = accessTurn("codex", [], 1, sources);
  const t = turn({ claim_text: "Tests pass\nDone", claim_messages: [{ text: "Tests pass", order: 1 }, { text: "Done", order: 5 }],
    actions: [{ id: "test", phase: "item.started", order: 0 }, { id: "test", phase: "item.completed", order: 3 }],
    claim_applicability: [{ quote: "Tests pass", action: "test" }] });
  const plan = measurementPlan(t, [], access), evidence = plan.rubrics.find(r => r.source_check === "evidence")!;
  t.judgments = [judgment(evidence.id)];
  expect(opportunity(rowFor(measuredOpportunities(run, t, plan.rubrics, access, plan.inventory), "act:rule:4").parts).verdict).toBe(false);
  t.claim_messages[0].order = 4;
  expect(opportunity(rowFor(measuredOpportunities(run, t, [evidence], access), "act:rule:4").parts).verdict).toBe(true);
});

test("two checks of one rule retain both deadlines with a denominator of one", () => {
  const access = accessTurn("codex", [done("early", "true"), done("read", "cat /sandbox/skills/essentials/references/respond.md", sources.respond), done("late", "true")], 1, sources);
  const rubrics = [rubric("plain-english", "first"), rubric("plain-english", "second")];
  const t = turn({ actions: [{ id: "early", order: 0 }, { id: "late", order: 2 }], judgments: [judgment("first", "early"), judgment("second", "late")] });
  const r = rowFor(measuredOpportunities(run, t, rubrics, access), "respond:rule:4");
  expect(r.parts.map(p => p.deadline)).toEqual([0, 2]);
  expect(opportunity(r.parts)).toEqual({ verdict: true, availability: "not opened" });
  const report = reportRule(reportFor(t, access, rubrics), "respond:rule:4");
  expect(report.cells.not_opened_passed).toMatchObject({ passed: 1, total: 1 });
});

const claudeRead = () => accessTurn("claude", [
  { type: "assistant", message: { content: [{ type: "tool_use", id: "read", name: "Read", input: { file_path: "/sandbox/skills/essentials/references/respond.md" } }] } },
  { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "read", content: sources.respond }] } },
], 1, sources);
test("observable same-session reuse is opened and counted apart in both views", () => {
  const first = retainAccess(claudeRead(), "session", []);
  const access = retainAccess(accessTurn("claude", [], 2, sources), "session", [{ session: "session", access: first }]);
  expect(availableText(access, "respond", 0)).toEqual({ availability: "opened", reused: true });
  const t = turn({ judgments: [judgment("plain-english")] });
  const report = reportFor(t, access, [rubric("plain-english")]);
  expect(reportRule(report, "respond:rule:4").reused).toBe(1);
  expect(report.loading_counts["codex/sol/installed/respond"]).toMatchObject({ needed_loaded: 1, reused: 1 });
  expect(report.loading[0]!.skills.find((s: Event) => s.skill === "respond")).toMatchObject({ reused: true, read_turn: 1 });
});
test("fresh, changed, compacted, resumed and unobservable sessions cannot assert reuse", () => {
  const first = retainAccess(claudeRead(), "session", []), history = [{ session: "session", access: first }];
  const empty = accessTurn("claude", [], 2, sources);
  expect(availability(retainAccess(empty, "session", history, true), "respond", 9)).toBe("not opened");
  expect(availability(retainAccess(empty, "different", history), "respond", 9)).toBe("not opened");
  for (const boundary of [{ type: "system", subtype: "compact_boundary" }, { type: "session.resumed" }]) {
    const access = retainAccess(accessTurn("claude", [boundary], 2, sources), "session", history);
    expect(availability(access, "respond", 9)).toBe("unknown");
    const third = retainAccess(accessTurn("claude", [], 3, sources), "session", [{ session: "session", access }]);
    expect(availability(third, "respond", 9)).toBe("unknown");
  }
  const codex = retainAccess(accessTurn("codex", [], 2, sources), "session", history);
  expect(availability(codex, "respond", 9)).toBe("unknown");
  expect(reportFor(turn(), codex, []).limitations.join(" ")).toContain("Codex exec JSON");
});

test("per-file attribution keeps compound reads separate from bare, absolute and env searches", () => {
  const path = "/sandbox/skills/essentials/references/act.md";
  const compound = accessTurn("codex", [done("read", `cat ${path} && rg x docs/`, sources.act)], 1, sources);
  expect(compound.records.find(r => r.skill === "act")).toMatchObject({ operation: "read", extent: "whole" });
  for (const search of ["grep", "/usr/bin/grep", "env grep", "/usr/bin/env -i MODE=test /usr/bin/grep"]) {
    const a = accessTurn("codex", [done("search", `${search} '' ${path}`, sources.act)], 1, sources);
    expect(a.records.find(r => r.skill === "act")).toMatchObject({ operation: "search", extent: "partial" });
    expect(availability(a, "act", 9)).toBe("not opened");
  }
  const opaque = accessTurn("codex", [done("opaque", `python show.py ${path}`, sources.act)], 1, sources);
  expect(opaque.records[0]).toMatchObject({ operation: "unknown", extent: "unknown" });
  expect(availability(opaque, "act", 9)).toBe("unknown");
  const mixed = accessTurn("codex", [done("mixed", `cat ${path} && grep '' /sandbox/skills/essentials/references/respond.md`, sources.act + sources.respond)], 1, sources);
  expect(mixed.records.find(r => r.skill === "act")).toMatchObject({ operation: "read", extent: "whole" });
  expect(mixed.records.find(r => r.skill === "respond")).toMatchObject({ operation: "search", extent: "partial" });
});

test("a whole read survives a search of the same skill without promoting partial reads", () => {
  const { events, sources } = sameSkillReadSearch;
  const access = accessTurn("codex", events, 1, sources);
  expect(access.records.find(r => r.skill === "act")).toMatchObject({ operation: "read", extent: "whole" });
  expect(availability(access, "act", 9)).toBe("opened");
  const path = "/sandbox/skills/essentials/references/act.md";
  for (const command of [`head -n 1 ${path} && grep '' ${path}`, `cat -s ${path} && grep '' ${path}`,
    `cat ${path}; grep '' ${path}`]) {
    const uncertain = accessTurn("codex", [done("mixed", command, sources.act)], 1, sources);
    expect(uncertain.records[0]!.extent).not.toBe("whole");
    expect(availability(uncertain, "act", 9)).toBe("unknown");
  }
});

test("compaction clears partial-range coverage and a later whole read can be reused", () => {
  const first = done("first", "sed -n '1,1p' /sandbox/skills/essentials/references/respond.md", "# respond");
  const last = done("last", "sed -n '2,2p' /sandbox/skills/essentials/references/respond.md", "whole text");
  const access = accessTurn("codex", [first, { type: "context.compacted" }, last], 1, sources);
  expect(access.records.every(r => r.extent !== "whole")).toBe(true);
  const read = claudeRead();
  const afterBoundary = { ...read, records: read.records.map(r => ({ ...r, start: 2, result: 3 })), boundaries: [1] };
  const next = retainAccess(accessTurn("claude", [], 2, sources), "session", [{ session: "session", access: afterBoundary }]);
  expect(availableText(next, "respond", 9)).toEqual({ availability: "opened", reused: true });
});

test("clarify alternatives each supply a present result and preserve the other exclusion", () => {
  const parts = resultChecks().filter(p => p.skill === "understand-clarify");
  expect(parts.every(p => p.source.line === 44)).toBe(true);
  for (const selected of parts) {
    const answer = selected.alternative === "questionnaire" ? "Who is the intended audience?" : "Going with: the project's default format. Assuming UTF-8 input.";
    const t = turn({ final_answer: answer, result_parts: parts, judgments: [{ id: selected.id, verdict: true, quote: answer }] });
    const scored = assessedResults(t);
    expect(promised(scored)).toBe(true);
    expect(scored.filter(p => p.exclusion)).toHaveLength(1);
    expect(scored.find(p => p.exclusion)!.exclusion).toContain(selected.alternative);
    const rows = measuredOpportunities(run, { ...t, author_rule_marks: [{ id: "understand-clarify:rule:1", applies: true, deadline: "answer" }],
      judgments: [...t.judgments, { id: "open-intent", verdict: true, quote: answer, parts: [{ verdict: true, quote: answer }] }] }, [rubric("open-intent")], accessTurn("codex", [], 1, sources));
    expect(grid([rowFor(rows, "understand-clarify:rule:1")]).results.passed_present).toBe(1);
  }
  expect(promised(parts.map(p => ({ ...p, verdict: false })))).toBe(false);
  expect(promised(parts.map(p => ({ ...p, verdict: null })))).toBeNull();
  expect(() => validateSource({ ...parts[0], source: { ...parts[0].source, line: 43 } })).toThrow("source drift");
});

test("not-reached judgments keep known loading and their own report group", () => {
  const access = claudeRead(), t = turn({ judgments: [{ id: "plain-english", verdict: "not reached", reason: "missing prerequisite" }] });
  const r = rowFor(measuredOpportunities(run, t, [rubric("plain-english")], access), "respond:rule:4");
  expect(opportunity(r.parts)).toEqual({ verdict: "not reached", availability: "opened" });
  expect(reportRule(reportFor(t, access, [rubric("plain-english")]), "respond:rule:4").unknown).toMatchObject({ not_reached: 1, behavior: 0 });
});

test("applicability follows definitions instead of special-casing known keys", () => {
  const access = accessTurn("codex", [], 1, sources), def = ruleChecks().find(c => c.key === "requested-work")!;
  const scoped = { ...def, applicability: "scenario" };
  expect(opportunityInventory(turn(), [rubric("requested-work")], access, [scoped])[0]!.applies).toBeNull();
  expect(opportunityInventory(turn(), [], access, [{ ...def, key: "new-always-key", applicability: "always" }])[0]!.applies).toBe(true);
});
test("a read before the first opaque command and write has known before timing", () => {
  const read = done("read", "cat /sandbox/skills/essentials/references/act.md", sources.act);
  const a = accessTurn("codex", [read, done("opaque", "make"), done("write", "rm old.md")], 1, sources);
  expect(a.records[0]!.timing).toBe("before");
  expect(accessTurn("codex", [done("opaque", "make"), read, done("write", "rm old.md")], 1, sources).records[0]!.timing).toBe("unknown");
});

test("retained recordings survive both conditions and each turn links its own evidence", async () => {
  const out = mkdtempSync(join(tmpdir(), "measurement-recordings-"));
  try {
    const c = normalize({ fixture: "tiny-weather", turns: [{ prompt: "Answer briefly" }] }, "essentials/recordings");
    for (const condition of ["installed", "no-skill"] as const) {
      const r = await runOne({ ...c, condition }, "codex", "gpt-6.1-sol", 1, { ...parseArgs(["--agents", "codex"]), keep: true }, out, 1,
        async () => ({ stdout: JSON.stringify({ type: "item.completed", item: { type: "agent_message", text: condition } }),
          stderr: "", status: 0, left: [], left_why: null, tmp: null, tmp_paths: [] }));
      expect(r.error).toBeNull();
      expect(readFileSync(r.turns[0].recording, "utf8")).toContain(condition);
    }
    expect(readdirSync(out)).toHaveLength(2);
    expect(readdirSync(out).some(f => f.includes("--installed--"))).toBe(true);
    expect(readdirSync(out).some(f => f.includes("--no-skill--"))).toBe(true);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
