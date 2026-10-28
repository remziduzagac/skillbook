import { readFileSync } from "node:fs";
import { join } from "node:path";
import { aspects, walk } from "./inventory";
import { REPO } from "./paths";
export function validateSource(check: any) {
  const source = readFileSync(join(REPO, check.source.file), "utf8").split("\n");
  if (source.slice(check.source.line - 1).join("\n").indexOf(check.source.text) !== 0)
    throw Error(`source drift: ${check.id ?? check.part}`);
}
export function ruleChecks() {
  const inventory = aspects();
  return walk(join(REPO, "tests/checks")).filter(p => p.endsWith(".yaml")).flatMap(p => {
    const doc = Bun.YAML.parse(readFileSync(p, "utf8")) as any;
    for (const check of doc.checks) {
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
