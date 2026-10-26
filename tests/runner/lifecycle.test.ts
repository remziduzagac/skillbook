import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, symlinkSync, linkSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { prepareHome, agentEnv, snapshot, fixtureText, observe } from "./files";
import { runTurn, endRun, owned } from "./process";
import { check } from "./checks";
import { cost } from "./cost";
import { score, evaluateTagged } from "./scoring";
import { loadCases, validateCase } from "./cases";
import { parseArgs } from "./cli";
import { summarize, runsToJudge } from "./reports";

function temporary(fn: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "runner-unit-"));
  try {
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
test("home installs only into the supplied sandbox and suppresses account features", () =>
  temporary((root) => {
    const home = join(root, "home");
    prepareHome(home, "codex", { set: "essentials", pointer: true, project_skills: [] }, false, "Extra instruction");
    expect(existsSync(join(home, ".agents/skills/essentials/SKILL.md"))).toBe(true);
    expect(Bun.file(join(home, ".codex/config.toml")).size).toBeGreaterThan(0);
    const env = agentEnv(home, "codex", true, join(root, "tmp"));
    expect(env.HOME).toBe(home);
    expect(env.CODEX_HOME).toBe(join(home, ".codex"));
    expect(env.OPENAI_API_KEY).toBeUndefined();
  }));
test("symlinks, hardlinks and credentials cannot enter retained file content", () =>
  temporary((root) => {
    const work = join(root, "work");
    mkdirSync(work);
    writeFileSync(join(root, "login"), "refresh_token=secret");
    symlinkSync(join(root, "login"), join(work, "linked"));
    linkSync(join(root, "login"), join(work, "hard"));
    expect(JSON.stringify(fixtureText(work))).not.toContain("secret");
    const observation = observe("codex", [[]], "essentials", {}, work, {
      file_contains: { linked: ["secret"], hard: ["secret"] },
    });
    expect(observation.files).toEqual({ linked: null, hard: null });
  }));
test("unlogged edits leave sequencing unknown; a later statement cannot fix it", () =>
  temporary((work) => {
    writeFileSync(join(work, "x"), "after");
    const observation = observe(
      "codex",
      [[{ type: "item.completed", item: { type: "agent_message", text: "A plan. ".repeat(30) } }]],
      "essentials",
      {},
      work,
      {},
    );
    expect(check({ states_before_change: true }, observation)["text before its first change"]).toBeNull();
  }));
test("costs preserve zero, invalid usage and unknown model prices", () => {
  expect(
    cost("codex", "gpt-6-luna", [[{ type: "turn.completed", usage: { input_tokens: 0, output_tokens: 0 } }]]),
  ).toBe(0);
  expect(
    cost("codex", "unpriced", [[{ type: "turn.completed", usage: { input_tokens: 0, output_tokens: 0 } }]]),
  ).toBeNull();
});
test("tag scores exclude unknown and not reached and retain a 95 percent interval", () => {
  const result = score([
    { tag: "habit", verdict: true },
    { tag: "habit", verdict: false },
    { tag: "habit", verdict: null },
    { tag: "habit", verdict: "not reached" },
  ]);
  expect(result.habit).toMatchObject({ passed: 1, total: 2, unknown: 1, not_reached: 1, rate: 0.5 });
  expect(result.habit!.interval[0]).toBeLessThan(0.5);
  expect(result.habit!.interval[1]).toBeGreaterThan(0.5);
  expect(
    evaluateTagged(
      [{ id: "b", tag: "habit", depends_on: { turn: 1, check: "a" }, assert: { no_changes: true } }],
      {},
      { "1:a": false },
    ),
  ).toEqual([{ id: "b", tag: "habit", verdict: "not reached" }]);
});
test("YAML is validated before filtering and unknown checks fail", () => {
  expect(loadCases("route-").length).toBe(62);
  expect(() => validateCase({ fixture: "routing-studio", turns: [{ prompt: "x" }], checks: { reed: [] } })).toThrow();
  expect(() => validateCase({ fixture: "routing-studio", turns: [] })).toThrow();
});
test("CLI rejects unsafe numeric settings and misspelled agents or model selectors", () => {
  for (const args of [
    ["--jobs", "0"],
    ["--budget", "NaN"],
    ["--agents", "typo"],
    ["--model", "gpt-6-luna"],
    ["--timeout", "-1"],
  ])
    expect(() => parseArgs(args)).toThrow();
});
test("reports keep model sections, unknown costs and pending reviews; judge list excludes routing", () =>
  temporary((root) => {
    const rows = ["a", "b"].map((model) => ({
      case: "x",
      agent: "codex",
      model,
      run: 1,
      error: null,
      cost: null,
      cost_unknown: true,
      checks: { check: null },
      review: ["Useful answer"],
      turns: [{ answer: model }],
      changes: [],
    }));
    const report = summarize(rows, 0, 2);
    expect(report).toContain("unquantified");
    expect(report).toContain("Semantic review pending");
    expect(report.indexOf("(a)")).toBeLessThan(report.indexOf("(b)"));
    writeFileSync(join(root, "summary.json"), JSON.stringify([...rows, { ...rows[0], routing_only: true }]));
    expect(runsToJudge([root]).trim().split("\n")).toHaveLength(2);
  }));
test("timeout ends owned children and preserves partial output", async () => {
  const root = mkdtempSync(join(tmpdir(), "runner-process-"));
  const groups: number[] = [];
  const env = { ...process.env, TMPDIR: root, SKILLBOOK_TEST_RUN: root };
  try {
    const result = await runTurn(["sh", "-c", "echo partial; sleep 30 & wait"], root, env, 0.15, groups);
    expect(result.status).toBeNull();
    expect(result.stdout).toContain("partial");
    expect(Object.keys(owned(groups, root) ?? {})).toHaveLength(0);
  } finally {
    await endRun(groups, root);
    rmSync(root, { recursive: true, force: true });
  }
});

test("Python absolute regex anchors keep their meaning", async () => {
  const { matches } = await import("./regex");
  expect(matches("\\A---\\ntime: 40 minutes\\n---", "---\ntime: 40 minutes\n---")).toBe(true);
  expect(matches("\\Aheader", "prefix header")).toBe(false);
  expect(matches("end\\Z", "end\n")).toBe(false);
});

test("agent adapters preserve sandbox and resume controls", async () => {
  const { agentCommand } = await import("./agents");
  expect(agentCommand("codex", "gpt-6-luna", "x", 1)).toContain("workspace-write");
  expect(agentCommand("codex", "gpt-6-luna", "x", 1, "session")).toContain('sandbox_mode="workspace-write"');
  const claude = agentCommand("claude", "haiku", "x", 0.25, "session");
  expect(claude).toContain("--strict-mcp-config");
  expect(claude).toContain("0.25000000");
});

test("aspect inventory includes routes, exclusions and project checks", async () => {
  const { aspects } = await import("./inventory");
  const inventory = aspects();
  for (const id of ["act:rule:5", "act:route:act-rightsize", "essentials:step:1", "skillbook-design:check:13"])
    expect(inventory[id]).toBeDefined();
});

test("kept paths include nested folders and reject merely named missing paths", () =>
  temporary((root) => {
    const kept = join(root, "recipes-x", "old-recipes");
    mkdirSync(kept, { recursive: true });
    writeFileSync(join(kept, "porridge.md"), "oats");
    expect(
      check({ answer_path_has: ["old-recipes/"] }, { answer: `Kept at ${root}/recipes-x/` })[
        "a temporary path the answer names holds /old-recipes//"
      ],
    ).toBe(true);
    expect(Object.values(check({ answer_path_has: ["old-recipes/"] }, { answer: `Kept at ${root}/missing/` }))).toEqual(
      [false],
    );
  }));

test("scores keep agents and models separate and include rubric judgments", async () => {
  const { scoreRuns, judgeRubric } = await import("./scoring");
  const rubric = { id: "clear", tag: "plain-answer", criterion: "Lead with the point" };
  const judgment = await judgeRubric(
    async () => ({ id: "clear", tag: "plain-answer", verdict: false, reason: "The point is missing." }),
    { rubric, answer: "Preamble only", evidence: {} },
  );
  const scores = scoreRuns([
    { agent: "codex", model: "one", turns: [{ judgments: [judgment] }] },
    { agent: "codex", model: "two", turns: [{ tagged_checks: [{ tag: "plain-answer", verdict: true }] }] },
  ]);
  expect(scores["codex/one"]!["plain-answer"]!.rate).toBe(0);
  expect(scores["codex/two"]!["plain-answer"]!.rate).toBe(1);
});

test("judge CLI accepts several folders after one flag", () => {
  expect(parseArgs(["--to-judge", "/tmp/one", "/tmp/two"]).to_judge).toEqual(["/tmp/one", "/tmp/two"]);
});

test("reports expose runner errors and failures shared by models", () => {
  const rows = ["one", "two"].map((model) => ({
    case: "case",
    agent: "codex",
    model,
    run: 1,
    error: "turn timed out",
    cost: 0,
    cost_unknown: true,
    checks: { check: false },
    turns: [],
  }));
  const report = summarize(rows, 0, 2);
  expect(report).toContain("turn timed out");
  expect(report).toContain("Failed on more than one model");
  expect(report).toContain("every automatic check passed in 0 of 1 runs");
});
