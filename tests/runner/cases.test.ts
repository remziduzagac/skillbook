import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateCase, normalize, loadCases, compareConversions } from "./cases";

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
test("conversion comparison checks pairs and ignores standalone YAML", () => {
  const root = mkdtempSync(join(tmpdir(), "runner-conversions-"));
  try {
    const toml = 'fixture = "tiny-weather"\n[[turns]]\nprompt = "Inspect"\n';
    const data = Bun.TOML.parse(toml);
    writeFileSync(join(root, "pair.toml"), toml);
    writeFileSync(join(root, "pair.yaml"), Bun.YAML.stringify(data));
    writeFileSync(join(root, "standalone.yaml"), Bun.YAML.stringify(base()));
    expect(compareConversions(root)).toBe(1);
    writeFileSync(join(root, "pair.yaml"), Bun.YAML.stringify(base()));
    expect(() => compareConversions(root)).toThrow("conversion differs");
  } finally { rmSync(root, { recursive: true, force: true }); }
});
