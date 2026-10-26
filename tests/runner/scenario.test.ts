import { test, expect } from "bun:test";
import { simulate, fit, rubricJudge } from "./scenario";
import { normalize, validateCase, loadCases } from "./cases";
import { parseArgs } from "./cli";
import { evaluateTagged, scoreRuns } from "./scoring";

const scenario = () => normalize({ fixture: "tiny-weather", goal: "choose", user: {
  mode: "fixed", description: "owner", facts: { budget: "$10" },
}, turns: [{ prompt: "Pick one", purpose: "choose" }] }, "essentials/unit-scenario");

test("mode and suite overrides validate", () => {
  expect(parseArgs(["--user-mode", "simulated", "--suite", "master"]).user_mode).toBe("simulated");
  expect(() => parseArgs(["--user-mode", "other"])).toThrow();
  expect(() => parseArgs(["--suite", "other"])).toThrow();
});
test("simulated user receives full script and facts, records steering, rejects malformed output", async () => {
  const c = scenario();
  const r = await simulate(async (instruction, data: any) => {
    expect(instruction).toContain("Add no facts");
    expect(data.script).toEqual([{ prompt: "Pick one", purpose: "choose" }]);
    expect(data.user.facts.budget).toBe("$10");
    expect(data.history[0].answer).toBe("Budget?");
    return { message: "$10. Pick one.", steered: true };
  }, c, 0, [{ answer: "Budget?" }]);
  expect(r).toEqual({ message: "$10. Pick one.", steered: true });
  for (const bad of [{ message: "", steered: false }, { message: "x" }, { message: 1, steered: true }])
    expect(simulate(async () => bad, c, 0, [])).rejects.toThrow();
});
test("fit distinguishes incompatible, compatible and unknown traces", async () => {
  for (const off_script of [true, false, null])
    expect((await fit(async () => ({ off_script, reason: "evidence" }), "Question?", "Fixed")).off_script)
      .toBe(off_script);
  expect(fit(async () => ({ off_script: "yes", reason: "bad" }), "x", "y")).rejects.toThrow();
});
test("rubric judgments preserve ids and evidence; malformed verdicts cannot pass", async () => {
  const request = { rubric: { id: "reason", tag: "skill:design", criterion: "gives reason" },
    answer: "Use paper because no phones", evidence: {} };
  for (const verdict of [true, false, null, "not reached"] as const) {
    const r = await rubricJudge(async (_instruction, data) => {
      expect(data).toEqual(request);
      return { verdict, reason: "observed reason" };
    }, request);
    expect(r).toEqual({ id: "reason", tag: "skill:design", verdict, reason: "observed reason" });
  }
  expect(rubricJudge(async () => ({ verdict: "yes", reason: "x" }), request)).rejects.toThrow();
});
test("assertions reject wrong traces rather than mere file mentions", () => {
  const checks = [{ id: "delete", tag: "skill:guardrails", assert: { removed: ["old.csv"] } }];
  expect(evaluateTagged(checks, { changes: ["removed old.csv"] }, {} )[0]!.verdict).toBe(true);
  expect(evaluateTagged(checks, { changes: [], answer: "removed old.csv" }, {})[0]!.verdict).toBe(false);
});
test("rubric dependency must name an earlier real check", () => {
  const c = scenario();
  c.turns[0]!.rubric = [{ id: "x", tag: "x", criterion: "x", depends_on: { turn: 1, check: "x" } }];
  expect(() => validateCase(c)).toThrow();
});
test("score groups keep fixed and simulated results separate", () => {
  const runs = ["fixed", "simulated"].map(user_mode => ({ agent: "codex", model: "m", user_mode,
    turns: [{ tagged_checks: [{ tag: "habit:scope", verdict: user_mode === "fixed" }] }] }));
  expect(Object.keys(scoreRuns(runs))).toEqual(["codex/m/fixed", "codex/m/simulated"]);
});
test("scenario inventory has 14 shorts and one master with habits on each turn", () => {
  const cases = loadCases("scenario-");
  expect(cases.filter(c => c.suite === "short")).toHaveLength(14);
  expect(cases.filter(c => c.suite === "master")).toHaveLength(1);
  for (const c of cases) {
    expect(c.turns.length).toBeGreaterThanOrEqual(c.suite === "short" ? 3 : 12);
    for (const t of c.turns) {
      expect(t.rubric?.map(r => r.tag)).toContain("habit:point-first");
      expect(t.rubric?.map(r => r.tag)).toContain("habit:requested-scope");
    }
  }
});

test("calibration reports disagreements and leaves incomplete human ratings pending", async () => {
  const { calibrationReport } = await import("./calibration");
  const samples = [true, false, null].map((human, i) => ({ id: String(i), answer: "sample", human,
    judgment: { tag: "design", verdict: true, reason: "reason" } }));
  expect(calibrationReport(samples).complete).toBe(false);
  expect(calibrationReport(samples).disagreements.map(s => s.id)).toEqual(["1"]);
  samples[2]!.human = true;
  expect(calibrationReport(samples).complete).toBe(true);
});

test("structured model transport rejects tools, bad JSON and unsuccessful calls", async () => {
  const { structuredCall } = await import("./scenario");
  const accounts: (number | null)[] = [];
  const result = (text: string, status = 0, action = false) => ({
    stdout: [
      ...(action ? [{ type: "item.completed", item: { type: "command_execution", command: "ls", exit_code: 0 } }] : []),
      { type: "item.completed", item: { type: "agent_message", text } },
      { type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } },
    ].map(x => JSON.stringify(x)).join("\n"), stderr: "failure", status,
    left: [], left_why: null, tmp: null, tmp_paths: null,
  });
  const caller = (text: string, status = 0, action = false) => structuredCall("/tmp", {}, 1, [],
    amount => accounts.push(amount), async command => {
      expect(command).toContain("read-only");
      expect(command).toContain("gpt-6.1-sol");
      return result(text, status, action);
    });
  expect(await caller('{"ok":true}')('test', {})).toEqual({ ok: true });
  expect(caller("not JSON")("test", {})).rejects.toThrow();
  expect(caller('{"ok":true}', 1)("test", {})).rejects.toThrow();
  expect(caller('{"ok":true}', 0, true)("test", {})).rejects.toThrow();
  expect(accounts.every(x => x === null)).toBe(true);
});

test("every scenario assertion accepts a correct state and rejects a plausible wrong state", () => {
  for (const c of loadCases("scenario-")) for (const t of c.turns) for (const tagged of t.tagged_checks ?? []) {
    const a = tagged.assert;
    const good: any = { changes: [], files: {}, paths_present: {}, answer: "Completed the requested operation." };
    for (const path of a.absent ?? []) good.paths_present[path] = false;
    for (const path of a.changed ?? []) good.changes.push("changed " + path);
    for (const path of a.removed ?? []) good.changes.push("removed " + path);
    const samples: Record<string, string> = {
      "totals.py": "def add(values):\n    sum = 0\n    for value in values:\n        sum += value\n    return sum\n",
      "carryover.md": "Goal: prepare museum labels. Remaining work: check the uncertain date. Next: read source.md.",
    };
    for (const path of Object.keys(a.file_contains ?? {})) {
      expect(samples[path]).toBeDefined();
      good.files[path] = samples[path];
    }
    expect(evaluateTagged([tagged], good, {})[0]!.verdict).toBe(true);
    const wrong = structuredClone(good);
    if (a.absent?.length) wrong.paths_present[a.absent[0]!] = true;
    else if (a.no_changes) wrong.changes.push("removed user-source.md");
    else if (a.removed?.length) wrong.changes = wrong.changes.filter((x: string) => x !== "removed " + a.removed![0]);
    else if (a.changed?.length) { wrong.changes = []; wrong.files = {}; }
    expect(evaluateTagged([tagged], wrong, {})[0]!.verdict).toBe(false);
  }
});

test("only observed fixed off-script scenarios are selected for simulated reruns", async () => {
  const { offScriptCases, compareModes } = await import("./comparison");
  const rows = [
    { case: "a", user_mode: "fixed", turns: [{ fit: { off_script: true } }] },
    { case: "b", user_mode: "fixed", turns: [{ fit: { off_script: null } }] },
    { case: "c", user_mode: "simulated", turns: [{ fit: { off_script: true } }] },
  ].map(r => ({ ...r, agent: "codex", model: "m" }));
  expect(offScriptCases(rows)).toEqual(["a"]);
  expect(compareModes(rows)).toContain("rerun simulated");
  expect(compareModes(rows)).toContain("pending fit evidence");
});

test("absence replay uses full state deltas, preserves unknowns and rejects changed scripts", async () => {
  const { recheckScenario } = await import("./recheck");
  const c = scenario();
  c.turns[0]!.tagged_checks = [{ id: "absent", tag: "cleanup", assert: { absent: ["scratch.txt"] } }];
  const original = { turns: [{ scripted_message: "Pick one", changes: [] as string[], tagged_checks: [],
    trace_complete: true }] };
  expect(recheckScenario(original, c).turns[0].tagged_checks[0].verdict).toBe(true);
  original.turns[0]!.changes.push("added scratch.txt");
  expect(recheckScenario(original, c).turns[0].tagged_checks[0].verdict).toBe(false);
  original.turns[0]!.trace_complete = false;
  expect(recheckScenario(original, c).turns[0].tagged_checks[0].verdict).toBeNull();
  original.turns[0]!.scripted_message = "changed";
  expect(() => recheckScenario(original, c)).toThrow();
});

test("batched saved-answer judgments validate ids and cannot see earlier verdict labels", async () => {
  const { rubricBatch, judgeEvidence } = await import("./scenario");
  const evidence = judgeEvidence([{ sent_message: "Do it", final_answer: "Done", judgments: [{ verdict: true }],
    tagged_checks: [{ verdict: false }], actions: [] }], { "source.md": "facts" });
  expect(JSON.stringify(evidence)).not.toContain("verdict");
  const request = { rubric: { id: "a", tag: "skill:a", criterion: "a" }, answer: "Done", evidence };
  expect(await rubricBatch(async () => ({ results: [{ id: "a", verdict: false, reason: "missing result" }] }),
    [request])).toEqual([{ id: "a", tag: "skill:a", verdict: false, reason: "missing result" }]);
  expect(rubricBatch(async () => ({ results: [{ id: "wrong", verdict: true, reason: "x" }] }), [request]))
    .rejects.toThrow();
});

test("fit report counts missing transitions as unknown after an interrupted conversation", async () => {
  const { compareModes } = await import("./comparison");
  const report = compareModes([{ case: "interrupted", agent: "codex", model: "m", user_mode: "fixed",
    expected_turns: 3, error: "timeout", turns: [{ answer: "partial" }] }]);
  expect(report).toContain("| interrupted | 0/2 | 2 |");
  expect(report).toContain("pending fit evidence");
});

test("failed prerequisites are not reached while unknown prerequisites stay unknown in pooled scores", async () => {
  const { score } = await import("./scoring");
  const check = { id: "later", tag: "skill:plan", assert: { no_changes: true },
    depends_on: { turn: 1, check: "design" } };
  const verdicts = [true, false, null].map(verdict =>
    evaluateTagged([check], { changes: [] }, { "1:design": verdict })[0]!);
  expect(verdicts.map(v => v.verdict)).toEqual([true, "not reached", null]);
  const counts = score(verdicts)["skill:plan"]!;
  expect([counts.passed, counts.total, counts.unknown, counts.not_reached]).toEqual([1, 1, 1, 1]);
  expect(counts.rate).toBe(1);
  expect(counts.interval[0]).toBeLessThan(1);
  expect(counts.interval[1]).toBeCloseTo(1);
});

test("mode comparison uses the same scenario cohort in both columns", async () => {
  const { compareModes } = await import("./comparison");
  const rows = [
    { case: "a", user_mode: "fixed", run_checks: [{ tag: "habit:x", verdict: true }] },
    { case: "b", user_mode: "fixed", run_checks: [{ tag: "habit:y", verdict: true }] },
    { case: "a", user_mode: "simulated", run_checks: [{ tag: "habit:x", verdict: false }] },
  ].map(r => ({ ...r, agent: "codex", model: "m", turns: [] }));
  const report = compareModes(rows);
  const matched = report.split("### Matched scenarios:")[1]!;
  expect(report).toContain("habit:y");
  expect(matched).toContain("habit:x");
  expect(matched).not.toContain("habit:y");
});

test("the allowed Codex startup notice is checked per turn in conversation-wide assertions", async () => {
  const { check } = await import("./checks");
  const turns = [{ answer: "I'll load the essentials skill.\nFirst answer." },
    { answer: "I'll load the essentials skill.\nSecond answer." }];
  const observation = { agent: "codex", answer: turns.map(t => t.answer).join("\n"), turns };
  expect(check({ names_no_skill: true }, observation)["answer names no skill or skill file"]).toBe(true);
  turns[1]!.answer = "The act-guardrails skill forbids this.";
  expect(check({ names_no_skill: true }, observation)["answer names no skill or skill file"]).toBe(false);
});

test("every semantic criterion has distinct synthetic correct/wrong evidence and no expected label in judge input", async () => {
  const { validateRubricFixtures, rubricFixtures, resolveRubricTrace } = await import("./rubric-fixtures");
  expect(validateRubricFixtures()).toBe(269);
  const trace = resolveRubricTrace(rubricFixtures.checks[0]!.positive);
  expect(trace.turns[0].final_answer).toContain("Who will borrow");
  expect(JSON.stringify(trace)).not.toContain('"expected"');
});

test("large model inputs use stdin rather than exceeding operating-system argument limits", async () => {
  const { mkdtempSync, rmSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { runTurn, endRun } = await import("./process");
  const root = mkdtempSync(join(tmpdir(), "runner-large-input-")), groups: number[] = [];
  try {
    const result = await runTurn(["wc", "-c"],
      root, { ...process.env, TMPDIR: root }, 10, groups, "x".repeat(250000));
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("250000");
  } finally { await endRun(groups); rmSync(root, { recursive: true, force: true }); }
});

test("an invalid calibration context cannot enable semantic scoring even if ratings are filled", async () => {
  const { requireCalibration } = await import("./calibration");
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const root = mkdtempSync(join(tmpdir(), "runner-calibration-")), path = join(root, "invalid.json");
  try {
    writeFileSync(path, JSON.stringify({ model: "gpt-6.1-sol", valid_for_scoring: false,
      samples: [1, 2, 3].map(id => ({ id: String(id), answer: "x", human: true,
        judgment: { verdict: true, reason: "x" } })) }));
    expect(() => requireCalibration(path)).toThrow("context was marked invalid");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("semantic scoring requires every current correct/wrong fixture judgment, without duplicates", async () => {
  const { rubricFixtures, rubricFixtureHash, validateRubricReport } = await import("./rubric-fixtures");
  const results = rubricFixtures.checks.flatMap(row => [true, false].map(expected => ({
    check: `${row.case}:${row.turn}:${row.id}`, expected, judgment: { verdict: expected },
  })));
  const report = { model: "gpt-6.1-sol", fixture_hash: rubricFixtureHash(), results };
  expect(validateRubricReport(report)).toBe(538);
  expect(() => validateRubricReport({ ...report, results: results.slice(1) })).toThrow();
  expect(() => validateRubricReport({ ...report, results: [...results.slice(1), results[1]] })).toThrow();
  expect(() => validateRubricReport({ ...report, fixture_hash: "old" })).toThrow();
});
