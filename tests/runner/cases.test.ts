import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateCase, normalize, loadCases, compareConversions } from "./cases";
import { walk } from "./inventory";
import { CASES } from "./paths";

const base = () => ({ fixture: "routing-studio", turns: [{ prompt: "Inspect the document." }] });
test("invalid input is rejected rather than dropping intended checks", () => {
  for (const value of [
    { ...base(), checks: { no_changes: "false" } },
    { ...base(), checks: { answer_contains: ["["] } },
    { ...base(), fixture: "../../../" },
    { ...base(), runs: 0 },
    { ...base(), project_skills: ["unknown"] },
    { ...base(), routing_only: true, review: ["Judge this"], checks: { reads: ["act"] } },
    { ...base(), turns: [{ prompt: "x", tagged_checks: [{ id: "a", tag: "habit", assert: {} }] }] },
    {
      ...base(),
      turns: [
        {
          prompt: "x",
          tagged_checks: [{ id: "a", tag: "habit", assert: { no_changes: true }, depends_on: { turn: 1, check: "a" } }],
        },
      ],
    },
  ])
    expect(() => validateCase(value)).toThrow();
});
test("earlier-turn dependencies and explicit default overrides are kept", () => {
  const value = {
    ...base(),
    turns: [
      { prompt: "x", tagged_checks: [{ id: "a", tag: "habit", assert: { no_changes: true } }] },
      {
        prompt: "y",
        tagged_checks: [{ id: "b", tag: "habit", assert: { no_changes: true }, depends_on: { turn: 1, check: "a" } }],
      },
    ],
  };
  expect(() => validateCase(value)).not.toThrow();
  expect(normalize({ ...base(), checks: { names_no_skill: false } }, "essentials/x").checks.names_no_skill).toBe(false);
});
test("a malformed unmatched YAML file still prevents running any cases", () => {
  const root = mkdtempSync(join(tmpdir(), "runner-invalid-corpus-"));
  try {
    writeFileSync(join(root, "wanted.yaml"), Bun.YAML.stringify(base()));
    writeFileSync(join(root, "unmatched.yaml"), Bun.YAML.stringify({ ...base(), checks: { reed: ["act"] } }));
    expect(() => loadCases("wanted", root)).toThrow();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test("converted data matches TOML and samples every existing assertion and setting", () => {
  expect(compareConversions()).toBe(74);
  const features = (rows: any[]) => {
    const found = new Set<string>();
    for (const c of rows) {
      for (const key of Object.keys(c))
        if (!["about", "source", "fixture", "checks", "turns"].includes(key)) found.add("setting:" + key);
      for (const checks of [c.checks ?? {}, ...c.turns.map((t: any) => t.checks ?? {})])
        for (const [key, value] of Object.entries(checks))
          found.add("check:" + key + ":" + (Array.isArray(value) ? "array" : typeof value));
    }
    return found;
  };
  const paths = walk(CASES),
    toml = paths.filter((p) => p.endsWith(".toml")).map((p) => Bun.TOML.parse(readFileSync(p, "utf8"))),
    yaml = paths.filter((p) => p.endsWith(".yaml")).map((p) => Bun.YAML.parse(readFileSync(p, "utf8")));
  const selected = features(yaml);
  expect([...features(toml)].filter((x) => !selected.has(x))).toEqual([]);
});
