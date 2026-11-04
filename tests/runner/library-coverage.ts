import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./paths";
import { ruleChecks, resultChecks } from "./rule-checks";
import type { RubricBook } from "./rubric-fixtures";
import type { Case } from "./types";

// The whole library is covered across scenarios, not by any one of them: every rule definition is a criterion in at
// least one active case, and every visible promised return is in at least one active book's library. Each book still
// covers exactly what its own case needs (validateRubricFixtures).
export function uncoveredRules(cases: Case[], rules = ruleChecks()): string[] {
  const keys = new Set(cases.flatMap(c => c.turns.flatMap(t => (t.rubric ?? []).map(r => r.source_check))));
  return rules.filter(rule => !keys.has(rule.key)).map(rule => rule.id);
}
export function uncoveredReturns(books: RubricBook[], results = resultChecks()): string[] {
  const covered = new Set(books.flatMap(b => (b.library ?? []).map(row => row.id)));
  return results.filter(part => !part.exclusion && !covered.has(part.id)).map(part => part.id);
}
// Every active trace book in tests/calibration, with the current cases its rows name.
export function activeBooks(cases: Case[], folder = join(REPO, "tests/calibration")) {
  return readdirSync(folder).filter(name => name.endsWith(".json")).sort().flatMap(name => {
    const path = join(folder, name), book = JSON.parse(readFileSync(path, "utf8"));
    if (book?.scope !== "active") return [];
    const ids = new Set((book as RubricBook).checks.map(row => row.case));
    return [{ path, book: book as RubricBook, cases: cases.filter(c => ids.has(c.id)) }];
  });
}
