import { inside, chapterAt } from "./chapters";
import { resolveCriterion, ruleChecks } from "./rule-checks";
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
  for (const [agent, models] of Object.entries(c.models ?? {}))
    if (!c.agents?.includes(agent as any) || !models.length || new Set(models).size !== models.length || models.some(m => !m.trim()))
      throw Error("models must name nonempty unique choices for a case agent");
  for (const snapshot of c.source_snapshots ?? []) {
    inside(FIXTURES, snapshot.path);
    if (!/^[0-9a-f]{64}$/.test(snapshot.sha256) || !snapshot.text.trim()) throw Error("invalid source snapshot");
  }
  if (new Set(c.source_snapshots?.map(s => s.path)).size !== (c.source_snapshots?.length ?? 0))
    throw Error("duplicate source snapshot");
  if (c.chapters) {
    if (!c.chapters.length || c.chapters[0]!.start_turn !== 1) throw Error("chapters must start at turn 1");
    for (const [i, ch] of c.chapters.entries()) {
      if (ch.number !== i + 1 || !Number.isInteger(ch.start_turn) || ch.start_turn > c.turns.length ||
        (i > 0 && ch.start_turn <= c.chapters[i - 1]!.start_turn))
        throw Error("chapters need ordered consecutive numbers and increasing start turns");
      for (const path of [ch.checkpoint.fixture, ...(ch.checkpoint.overlays ?? [])])
        if (!existsSync(inside(FIXTURES, path))) throw Error(`no checkpoint fixture named ${path}`);
      for (const path of ch.checkpoint.remove ?? []) {
        inside(FIXTURES, path);
        if (path.split("/").includes(".git")) throw Error("checkpoint removal cannot name .git");
      }
    }
  }
  for (const turn of c.turns) {
    if (turn.timeout !== undefined && (!Number.isFinite(turn.timeout) || turn.timeout <= 0))
      throw Error("turn timeout must be positive seconds");
    for (const path of turn.judge_files ?? []) inside(FIXTURES, path);
    for (const need of [...(turn.skill_needs ?? []), ...(turn.also_called ?? []), ...(turn.if_taken ?? [])]) {
      if (!/^[a-z][a-z0-9-]*$/.test(need.skill) ||
        typeof need.deadline === "number" && (!Number.isInteger(need.deadline) || need.deadline < 0))
        throw Error("needs require a guide name and a valid deadline");
    }
    for (const need of turn.if_taken ?? []) if (!need.path.trim() || need.taken_when && !Object.keys(need.taken_when).length)
      throw Error("conditional needs require a path and nonempty taken_when when supplied");
  }
  if (c.suite) {
    if (!c.goal?.trim() || !c.user?.description.trim() || !Object.keys(c.user.facts).length)
      throw Error("scenario needs a goal, user description and facts");
    if (c.suite === "short" && (c.turns.length < 3 || c.turns.length > 5))
      throw Error("short scenario needs three to five turns");
    for (const turn of c.turns) if (!turn.purpose?.trim() ||
      !["habit:point-first", "habit:requested-scope"].every(tag => turn.rubric?.some(r => r.tag === tag)))
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
  const ruleIds = new Set(ruleChecks().map(c => c.id));
  for (const turn of c.turns) for (const mark of turn.rule_marks ?? [])
    if (!ruleIds.has(mark.id)) throw Error(`absent rule mark: ${mark.id}`);
  const ids = new Map<number, Set<string>>();
  for (const [i, t] of c.turns.entries()) {
    const current = new Set<string>();
    for (const tagged of [...(t.tagged_checks ?? []), ...(t.rubric ?? [])]) {
      if (current.has(tagged.id)) throw Error("duplicate tagged check id");
      current.add(tagged.id);
      if (!tagged.id.trim() || !tagged.tag.trim() || ("assert" in tagged ? !Object.keys(tagged.assert).length : !tagged.criterion.trim()))
        throw Error("tagged checks need an id, a tag and a nonempty assertion");
      const dep = tagged.depends_on;
      if (dep && (!Number.isInteger(dep.turn) || dep.turn < 1 || dep.turn > i || !ids.get(dep.turn)?.has(dep.check) ||
        chapterAt(c, dep.turn)?.number !== chapterAt(c, i + 1)?.number))
        throw Error("dependency must name a check in an earlier turn");
    }
    ids.set(i + 1, current);
  }
  for (const checks of [
    c.checks,
    ...c.turns.flatMap((t) => [t.checks, ...(t.tagged_checks ?? []).map((x) => x.assert),
      ...(t.if_taken ?? []).map(n => n.taken_when)]),
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
    for (const p of [...Object.values(checks.file_contains ?? {}), ...Object.values(checks.folder_contains ?? {}), ...Object.values(checks.folder_lacks ?? {})].flat())
      regex(p);
    for (const spec of Object.values(checks.index_links ?? {}))
      if (typeof spec !== "string") for (const p of spec.contains ?? []) regex(p);
    for (const limit of Object.values(checks.words_under ?? {}))
      if (!Number.isInteger(limit) || limit <= 0) throw Error("word bounds must be positive integers");
    for (const replacement of Object.values(checks.only_replacement ?? {}))
      if (!replacement.from || replacement.from === replacement.to) throw Error("replacement must change nonempty text");
    for (const p of [
      ...Object.keys(checks.words_under ?? {}), ...Object.keys(checks.only_replacement ?? {}),
      ...Object.keys(checks.index_links ?? {}), ...Object.values(checks.index_links ?? {}).map(s => typeof s === "string" ? s : s.folder),
      ...(checks.keeps_lines ?? []), ...(checks.unchanged_under ?? []),
      ...Object.keys(checks.written_under ?? {}), ...Object.keys(checks.folder_lacks ?? {}), ...Object.keys(checks.folder_contains ?? {}),
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
    turns: data.turns.map(t => ({ ...t, rubric: t.rubric?.map(r => ({ ...r, ...(r.criterion.startsWith("check:") ? { source_check: r.criterion.slice(6) } : {}), criterion: resolveCriterion(r.criterion) })) })),
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
