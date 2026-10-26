import Ajv from "ajv";
import { readFileSync, existsSync } from "node:fs";
import { relative, dirname, basename, join, resolve } from "node:path";
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
  if (c.suite) {
    if (!c.goal?.trim() || !c.user?.description.trim() || !Object.keys(c.user.facts).length)
      throw Error("scenario needs a goal, user description and facts");
    if (c.suite === "short" && (c.turns.length < 3 || c.turns.length > 5))
      throw Error("short scenario needs three to five turns");
    for (const turn of c.turns) if (!turn.purpose?.trim() ||
      !["habit:point-first", "habit:requested-scope", "habit:clear-at-a-glance"].every(tag => turn.rubric?.some(r => r.tag === tag)))
      throw Error("scenario turns need purposes and all shared habit checks");
  }
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
  const ids = new Map<number, Set<string>>();
  for (const [i, t] of c.turns.entries()) {
    const current = new Set<string>();
    for (const tagged of [...(t.tagged_checks ?? []), ...(t.rubric ?? [])]) {
      if (current.has(tagged.id)) throw Error("duplicate tagged check id");
      current.add(tagged.id);
      if (!tagged.id.trim() || !tagged.tag.trim() || ("assert" in tagged ? !Object.keys(tagged.assert).length : !tagged.criterion.trim()))
        throw Error("tagged checks need an id, a tag and a nonempty assertion");
      const dep = tagged.depends_on;
      if (dep && (!Number.isInteger(dep.turn) || dep.turn < 1 || dep.turn > i || !ids.get(dep.turn)?.has(dep.check)))
        throw Error("dependency must name a check in an earlier turn");
    }
    ids.set(i + 1, current);
  }
  for (const checks of [
    c.checks,
    ...c.turns.flatMap((t) => [t.checks, ...(t.tagged_checks ?? []).map((x) => x.assert)]),
  ].filter(Boolean) as Checks[]) {
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
      ...(checks.changed ?? []),
      ...(checks.unchanged ?? []),
      ...(checks.removed ?? []),
      ...(checks.absent ?? []),
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
