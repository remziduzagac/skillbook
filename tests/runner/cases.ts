import Ajv from "ajv";
import { readFileSync, existsSync } from "node:fs";
import { relative, resolve } from "node:path";
import schema from "../case.schema.json";
import { CASES, FIXTURES } from "./paths";
import { walk } from "./inventory";
import { regex } from "./regex";
import type { Case, CaseFile, Checks } from "./types";
const validator = new Ajv({ allErrors: true, strict: false }).compile(schema);
export function validateCase(data: unknown): asserts data is CaseFile {
  if (!validator(data)) throw Error("invalid case: " + JSON.stringify(validator.errors));
  const c = data as CaseFile;
  if (!c.turns.length) throw Error("at least one turn is required");
  if (c.runs !== undefined && (!Number.isInteger(c.runs) || c.runs < 1)) throw Error("runs must be a positive integer");
  if (!c.agents?.length && c.agents) throw Error("agents must not be empty");
  const fixture = resolve(FIXTURES, c.fixture);
  if (relative(FIXTURES, fixture).startsWith("..") || !existsSync(fixture))
    throw Error(`no fixture named ${c.fixture}`);
  for (const [agent, models] of Object.entries(c.models ?? {}))
    if (!c.agents?.includes(agent as any) || !models.length || new Set(models).size !== models.length || models.some(m => !m.trim()))
      throw Error("models must name nonempty unique choices for a case agent");
  for (const turn of c.turns)
    if (turn.timeout !== undefined && (!Number.isFinite(turn.timeout) || turn.timeout <= 0))
      throw Error("turn timeout must be positive seconds");
  if (c.routing_only) {
    const checks = [c.checks ?? {}, c.turns[0]!.checks ?? {}];
    if (
      c.turns.length !== 1 ||
      c.review?.length ||
      !checks.some((x) => Object.keys(x).length) ||
      checks.some((x) => Object.keys(x).some((k) => !["reads", "reads_not"].includes(k)))
    )
      throw Error("routing-only cases have one turn, reads and reads_not only, and no review");
  }
  for (const t of c.turns) {
    const ids = new Set<string>();
    for (const rubric of t.rubric ?? []) {
      if (ids.has(rubric.id)) throw Error("duplicate rubric id");
      ids.add(rubric.id);
      if (!rubric.id.trim() || !rubric.tag.trim() || !rubric.criterion.trim())
        throw Error("rubric questions need an id, a tag and a criterion");
    }
  }
  for (const checks of [c.checks, ...c.turns.map((t) => t.checks)].filter(Boolean) as Checks[]) {
    for (const key of [
      "answer_contains",
      "answer_not_contains",
      "tmp_has",
      "tmp_lacks",
      "actions_lack",
      "answer_path_has",
      "agent_started_or_answer",
    ] as const)
      for (const p of checks[key] ?? []) regex(p);
    if (Array.isArray(checks.states_before_change)) for (const p of checks.states_before_change) regex(p);
    for (const p of [...Object.values(checks.file_contains ?? {}), ...Object.values(checks.folder_lacks ?? {})].flat())
      regex(p);
    for (const p of [
      ...Object.keys(checks.written_under ?? {}), ...Object.keys(checks.folder_lacks ?? {}),
      ...(checks.changed ?? []),
      ...(checks.unchanged ?? []),
      ...(checks.removed ?? []),
      ...(checks.shorter ?? []),
      ...Object.keys(checks.file_contains ?? {}),
    ])
      if (p.startsWith("/") || p.split("/").includes("..")) throw Error("asserted paths must stay inside the fixture");
  }
}
export function normalize(data: CaseFile, id: string): Case {
  const set = id.split("/")[0]!,
    checks = { ...data.checks };
  if (set === "essentials" && !data.routing_only) checks.names_no_skill ??= true;
  return {
    ...data,
    id,
    set,
    agents: data.agents ?? ["claude", "codex"],
    runs: data.runs ?? 1,
    pointer: data.pointer ?? true,
    checks,
  };
}
export function loadCases(pattern = "", root = CASES): Case[] {
  // Validate the whole corpus before filtering; a typo must never silently remove an assertion.
  return walk(root)
    .filter((p) => /\.ya?ml$/.test(p))
    .map((path) => {
      const data = Bun.YAML.parse(readFileSync(path, "utf8"));
      validateCase(data);
      const id = relative(root, path).replace(/\.ya?ml$/, "");
      return normalize(data, id);
    })
    .filter((c) => c.id.includes(pattern));
}
export function compareConversions(root = CASES) {
  let count = 0;
  const canonical = (x: any): any =>
    Array.isArray(x)
      ? x.map(canonical)
      : x && typeof x === "object"
        ? Object.fromEntries(
            Object.keys(x)
              .sort()
              .map((k) => [k, canonical(x[k])]),
          )
        : x;
  for (const path of walk(root).filter((p) => /\.yaml$/.test(p))) {
    const toml = path.replace(/\.yaml$/, ".toml");
    if (!existsSync(toml)) continue;
    const yaml = Bun.YAML.parse(readFileSync(path, "utf8")),
      original = Bun.TOML.parse(readFileSync(toml, "utf8"));
    if (JSON.stringify(canonical(yaml)) !== JSON.stringify(canonical(original)))
      throw Error(`conversion differs: ${path}`);
    count++;
  }
  return count;
}
