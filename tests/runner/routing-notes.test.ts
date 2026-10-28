import { test, expect } from "bun:test";
import { measurementReport } from "./measurement-report";
import type { Event } from "./types";
import { collectRoutingNotes, consideredNotes } from "./routing-notes";
import fixtures from "../fixtures/routing-notes.json";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runOne } from "./run";
import { normalize } from "./cases";
import { parseArgs } from "./cli";
import { judgeEvidence } from "./scenario";

const opportunity = { id: "act-verify:rule:1", skill: "act-verify", turn: 1, case: "routing",
  conversation: "routing/codex/gpt-6.1-sol/1/installed", agent: "codex", model: "gpt-6.1-sol", mode: "fixed",
  version: "snapshot", condition: "installed", needed: true, trigger: "trigger", origin: "scenario",
  no_skill_eligible: true, deadline: 1,
  parts: [{ verdict: false as const, availability: "not opened" as const, deadline: 1 }], result: false };

for (const fixture of fixtures) test(fixture.name, () => {
  const notes = collectRoutingNotes("codex", fixture.events);
  const result = consideredNotes(notes, { ...opportunity, deadline: fixture.deadline });
  expect(result.considered).toBe(fixture.expected);
  if (fixture.expected === "considered") expect(result.quotes[0]).toMatchObject({ order: 0,
    source: "reasoning", text: "Consider act-verify before reporting the result." });
  if (fixture.name === "mention after the deadline") {
    expect(result.quotes).toEqual([]);
    expect(result.late_quotes[0]).toMatchObject({ order: 1, text: "I skipped act-verify." });
  }
});

test("report puts quoted consideration beside its grid opportunity without changing its cell", () => {
  const turn: Event = { opportunities: [opportunity], routing_notes: [
    { source: "reasoning", order: 0, text: "Consider act-verify before reporting the result." } ] };
  const run = { case: "routing", agent: "codex", model: "gpt-6.1-sol", turns: [turn] };
  const row = measurementReport([run]).views[0]!.rules[0]! as Event;
  expect(row.routing_notes?.[0]?.considered).toBe("considered");
  expect(row.routing_notes[0]).toMatchObject({ availability: "not opened", verdict: false });
  expect(row.routing_notes[0].quotes[0]).toMatchObject({ order: 0,
    text: "Consider act-verify before reporting the result." });
  expect(row.cells.not_opened_failed).toMatchObject({ passed: 1, total: 1 });
  const without = measurementReport([{ ...run, turns: [{ opportunities: [opportunity] }] }]);
  const { routing_notes, ...rest } = row;
  const { routing_notes: omitted, ...baseline } = without.views[0]!.rules[0]! as Event;
  expect(rest).toEqual(baseline);
});

test("progress can mention a skill without thinking; the final answer is not a routing note", () => {
  const events = [
    { type: "item.completed", item: { type: "agent_message", text: "I should use act-verify." } },
    { type: "item.started", item: { type: "command_execution", command: "true" } },
    { type: "item.completed", item: { type: "agent_message", text: "Final: act-verify." } },
  ];
  const notes = collectRoutingNotes("codex", events);
  expect(notes).toEqual([{ source: "progress", order: 0, text: "I should use act-verify." }]);
  expect(consideredNotes(notes, opportunity).considered).toBe("considered");
});

test("report keeps each mode and frozen version linked to its own notes", () => {
  const report = measurementReport([
    { turns: [{ opportunities: [opportunity], routing_notes: [
      { source: "reasoning", order: 0, text: "Consider act-verify." },
    ] }] },
    { turns: [{ opportunities: [{ ...opportunity, mode: "simulated", version: "different snapshot" }],
      routing_notes: [{ source: "reasoning", order: 0, text: "Use understand-clarify." }] }] },
  ]);
  expect(report.views.map(v => v.rules[0]!.routing_notes[0]!.considered))
    .toEqual(["considered", "not mentioned"]);
});

test("Claude thinking and progress retain block order; redacted and helper thinking supply no text", () => {
  const notes = collectRoutingNotes("claude", [
    { type: "assistant", message: { content: [
      { type: "thinking", thinking: "Consider act-verify.", signature: "not retained" },
      { type: "text", text: "Checking the sources." },
      { type: "tool_use", id: "read", name: "Read", input: { file_path: "notes.md" } },
    ] } },
    { type: "assistant", parent_tool_use_id: "helper", message: { content: [
      { type: "thinking", thinking: "Helper used another skill." },
    ] } },
    { type: "assistant", message: { content: [
      { type: "redacted_thinking", data: "opaque hidden content" }, { type: "text", text: "Final act-verify." },
    ] } },
  ]);
  expect(notes.map(n => [n.source, n.order, n.block])).toEqual([
    ["thinking", 0, 0], ["progress", 0, 1], ["thinking", 2, 0],
  ]);
  expect(JSON.stringify(notes)).not.toMatch(/signature|opaque hidden content|Helper/);
  expect(consideredNotes(notes, opportunity).considered).toBe("considered");
  expect(consideredNotes([notes[2]!], opportunity).considered).toBe("no thinking available");
  const sameEvent = consideredNotes(notes, { ...opportunity, deadline: 0 });
  expect(sameEvent.quotes).toEqual([]);
  expect(sameEvent.unplaced_quotes).toHaveLength(1);
});

test("file names, rule ids and rule phrases count; a different child or ordinary verb does not", () => {
  const row = { ...opportunity, id: "act:rule:4", skill: "act" };
  const rule = "4. **Get evidence before making a claim.** Use recorded actions.\n" +
    "**Read act-verify before claiming work is done, fixed, passing or correct.**";
  for (const [text, matched_by] of [
    ["Read references/act.md first.", "file"], ["Review act:rule:4 before reporting.", "rule id"],
    ["We need evidence before making a claim.", "rule phrase"], ["Read the act skill.", "skill"],
    ["Before claiming work is done, I should check.", "rule phrase"],
  ]) {
    const result = consideredNotes([{ source: "reasoning", order: 0, text: text! }], row, rule);
    expect(result.considered).toBe("considered");
    expect(result.quotes[0]!.matched_by).toBe(matched_by);
  }
  for (const text of ["Use act-verify instead.", "Consider the skill act-verify.", "We can act tomorrow."])
    expect(consideredNotes([{ source: "reasoning", order: 0, text }], row, rule).considered).toBe("not mentioned");
  const unknown = consideredNotes([{ source: "reasoning", order: 0, text: "Read act:rule:4." }],
    { ...row, deadline: null });
  expect(unknown.quotes).toEqual([]);
  expect(unknown.unplaced_quotes).toHaveLength(1);
});

test("runner collects notes outside loading and judge evidence, using equal settings in both conditions", async () => {
  const out = mkdtempSync(join(tmpdir(), "routing-notes-")), configurations: string[] = [];
  try {
    const c = normalize({ fixture: "tiny-weather", turns: [{ prompt: "Answer briefly", rule_marks: [
      { id: "act-verify:rule:1", applies: true, deadline: "answer" },
    ] }] }, "essentials/routing-notes");
    const settings = [];
    for (const condition of ["installed", "no-skill"] as const) {
      const result = await runOne({ ...c, condition }, "codex", "gpt-6.1-sol", 1,
        parseArgs(["--agents", "codex"]), out, 1, async (_cmd, _work, env) => {
          configurations.push(readFileSync(join(env.CODEX_HOME!, "config.toml"), "utf8"));
          const events = [
            { type: "item.completed", item: { type: "reasoning",
              text: "ROUTING_DIAGNOSTIC_ONLY: I considered act-verify and claim to have read it." } },
            { type: "item.completed", item: { type: "agent_message", text: "I will check the sources." } },
            { type: "item.completed", item: { type: "command_execution", command: "true", exit_code: 0 } },
            { type: "item.completed", item: { type: "agent_message", text: "Done." } },
          ];
          return { stdout: events.map(e => JSON.stringify(e)).join("\n"), stderr: "", status: 0,
            left: [], left_why: null, tmp: null, tmp_paths: [] };
        });
      expect(result.error).toBeNull();
      const turn = result.turns[0];
      expect(turn.routing_notes).toHaveLength(2);
      expect(turn.access.records).toEqual([]);
      expect(turn.claim_text).not.toContain("ROUTING_DIAGNOSTIC_ONLY");
      const evidence = JSON.stringify(judgeEvidence([turn]));
      expect(evidence).not.toMatch(/routing_notes|ROUTING_DIAGNOSTIC_ONLY/);
      const report = measurementReport([result]);
      const row = report.views[0]!.rules.find(r => r.id === "act-verify:rule:1")!;
      expect(row.routing_notes[0]!.considered).toBe("considered");
      if (condition === "installed") expect(report.loading[0]!.skills.find((s: Event) =>
        s.skill === "act-verify")).toMatchObject({ availability: "not opened" });
      settings.push(result.thinking_settings);
    }
    expect(configurations.every(c => /^model_reasoning_summary = "auto"$/m.test(c))).toBe(true);
    expect(settings[0]).toEqual(settings[1]);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
