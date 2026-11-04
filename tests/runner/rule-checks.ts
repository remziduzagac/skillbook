import { readFileSync } from "node:fs";
import { join } from "node:path";
import { aspects, walk } from "./inventory";
import { REPO } from "./paths";
import type { Case } from "./types";
export function validateSource(check: any) {
  if (!Number.isInteger(check.source?.line) || check.source.line < 1 || !check.source.text?.trim())
    throw Error(`invalid source: ${check.id ?? check.part}`);
  const source = readFileSync(join(REPO, check.source.file), "utf8").split("\n");
  const start = check.source.line - 1;
  if (!source.slice(start).join("\n").startsWith(check.source.text))
    throw Error(`source drift: ${check.id ?? check.part}`);
  const preceding = source.slice(0, start).filter(line => line.trim()).at(-1);
  if (preceding === "## Gives back") {
    let end = source.findIndex((line, i) => i > start && line.startsWith("## "));
    if (end < 0) end = source.length;
    if (source.slice(start, end).join("\n").trimEnd() !== check.source.text.trimEnd())
      throw Error(`source must freeze the full block: ${check.id ?? check.part}`);
  }
  if (/^\d+\. /.test(source[start]!)) {
    let end = source.findIndex((line, i) => i > start && /^(?:\d+\. |## )/.test(line));
    if (end < 0) end = source.length;
    const prose = source.findIndex((line, i) => i > start && i < end && line && !line.startsWith(" "));
    if (prose >= 0) end = prose;
    if (source.slice(start, end).join("\n").trimEnd() !== check.source.text.trimEnd())
      throw Error(`source must freeze the full block: ${check.id ?? check.part}`);
    const number = check.id?.match(/:(?:rule|step):(\d+)$/)?.[1];
    if (number !== undefined && !source[start]!.startsWith(number + ". "))
      throw Error(`source number does not match id: ${check.id}`);
  }
}
export function ruleChecks() {
  const inventory = aspects();
  return walk(join(REPO, "tests/checks")).filter(p => p.endsWith(".yaml")).flatMap(p => {
    const doc = Bun.YAML.parse(readFileSync(p, "utf8")) as any;
    for (const check of doc.checks) {
      for (const context of check.source_context ?? []) validateSource(context);
      if (!(check.id in inventory)) throw Error(`absent rule id: ${check.id}`);
      for (const field of ["source", "applicability", "required_skill", "deadline", "expected", "rejected", "evidence"])
        if (!check[field]) throw Error(`missing ${field}: ${check.id}`);
      if (!["always", "scenario", "action", "claim"].includes(check.applicability)) throw Error(`invalid applicability: ${check.id}`);
      validateSource(check);
    }
    return doc.checks;
  });
}
export function resolveCriterion(criterion: string) {
  if (!criterion.startsWith("check:")) return criterion;
  const key = criterion.slice(6), check = ruleChecks().find(c => c.key === key);
  if (!check) throw Error(`unknown check reference: ${key}`);
  return check.expected;
}

export function resultChecks() {
  return walk(join(REPO, "tests/checks")).filter(p => p.endsWith(".yaml")).flatMap(p => {
    const doc = Bun.YAML.parse(readFileSync(p, "utf8")) as any;
    return (doc.results ?? []).map((part: any, index: number) => {
      validateSource(part);
      return { ...part, skill: doc.skill, id: `result:${doc.skill}:${index}` };
    });
  });
}
// A case offers and measures a `scenario` rule definition only if it declares it: in its covers, as a criterion or as
// an author's mark. So a scenario rule added to the library for another case never reaches this case's judging or
// scores. Definitions of the other applicabilities apply to every case, as before.
export function declaredRules(c: Pick<Case, "covers" | "turns">, rules = ruleChecks()) {
  const ids = new Set([...(c.covers ?? []), ...c.turns.flatMap(t => (t.rule_marks ?? []).map(m => m.id))]);
  const keys = new Set(c.turns.flatMap(t => (t.rubric ?? []).map(r => r.source_check).filter(Boolean)));
  return rules.filter(rule => rule.applicability !== "scenario" || ids.has(rule.id) || keys.has(rule.key));
}
