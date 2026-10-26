import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO } from "./paths";
import { skill_name } from "./shell";
import type { Case } from "./types";
export function walk(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => (e.isDirectory() ? walk(join(root, e.name)) : [join(root, e.name)]));
}
export function skillFiles(): [string, string][] {
  const out: [string, string][] = [];
  for (const folder of readdirSync(join(REPO, "skills")).sort()) {
    const root = join(REPO, "skills", folder),
      main = join(root, "SKILL.md");
    if (!existsSync(main)) continue;
    out.push([folder, main]);
    for (const path of walk(join(root, "references")).filter((x) => x.endsWith(".md"))) {
      const n = skill_name(folder, relative(root, path));
      if (n) out.push([n, path]);
    }
  }
  for (const path of walk(join(REPO, ".agents/skills")).filter((p) => p.endsWith("/SKILL.md")))
    out.push([path.split("/").at(-2)!, path]);
  return out;
}
export function aspects() {
  const found: Record<string, string> = {},
    kinds: Record<string, string> = { Rules: "rule", Advice: "advice", Names: "names", "The checklist": "check" };
  for (const [name, path] of skillFiles()) {
    let section = "",
      index = 0,
      current = "";
    for (const line of readFileSync(path, "utf8").split("\n")) {
      if (line.startsWith("## ")) {
        section = line.slice(3).trim();
        index = 0;
        current = "";
        if (section === "The last instruction") found[`${name}:last`] = "the last instruction";
        continue;
      }
      const top = line.match(/^(?:\d+\.|-) (.*)/);
      const summary = (s: string) => {
        s = s.replace(/[*`]/g, "").trim();
        return s.slice(0, 70) + (s.length > 70 ? "…" : "");
      };
      if (top && kinds[section]) found[`${name}:${kinds[section]}:${++index}`] = summary(top[1]!);
      else if (top && section === "Instructions") {
        const route = top[1]!.match(/\(`([a-z][a-z0-9-]*)`\)/);
        index++;
        current = route?.[1] ?? `step-${index}`;
        found[`${name}:${route ? "route:" + current : "step:" + index}`] = summary(top[1]!);
      } else if (current && section === "Instructions" && line.trim().startsWith("- Not for:"))
        found[`${name}:not-for:${current}`] = summary(line.trim().slice(2));
    }
  }
  return found;
}
export function aspectCoverage(cases: Case[]) {
  const known = aspects(),
    covered = new Set(cases.flatMap((c) => c.covers ?? []));
  const manual = Bun.TOML.parse(readFileSync(join(REPO, "tests/manual.toml"), "utf8")) as { aspect?: { id: string }[] };
  const hand = new Set((manual.aspect ?? []).map((x) => x.id));
  return {
    known,
    covered,
    hand,
    unknown: [...new Set([...covered, ...hand])].filter((x) => !(x in known)).sort(),
    uncovered: Object.keys(known).filter((x) => !covered.has(x) && !hand.has(x)),
  };
}
export function coverage(cases: Case[], summary = false) {
  const { known, unknown, uncovered, covered, hand } = aspectCoverage(cases);
  if (summary)
    return (
      `aspects: ${uncovered.length} with nothing covering them; ` +
      "run `bun tests/run.ts --coverage` for the list\n" +
      unknown.map((x) => `unknown aspect: ${x}\n`).join("")
    );
  const names = skillFiles()
    .map(([name]) => name)
    .sort();
  const lines = [
    "# Scenario coverage",
    "",
    "Executable cases, not observed results. Counts can overlap across skills.",
    "",
    "| Skill | Normal | Boundary | Edge | Multi-turn | Review |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  for (const name of names) {
    const selected = cases.filter((c) => c.skills?.includes(name));
    const counts = ["normal", "boundary", "edge"].map(
      (category) => selected.filter((c) => c.category === category).length,
    );
    counts.push(selected.filter((c) => c.turns.length > 1).length, selected.filter((c) => c.review?.length).length);
    lines.push(`| ${name} | ${counts.join(" | ")} |`);
  }
  const turns = cases.reduce((n, c) => n + c.turns.length, 0);
  lines.push(
    "",
    `${cases.length} cases; ${turns} scripted turns per agent.`,
    "",
    "# Aspect coverage",
    "",
    "Counting coverage says nothing about a model passing.",
    "",
    "| Skill | Aspects | By a case | By hand | None |",
    "| --- | --- | --- | --- | --- |",
  );
  for (const name of names) {
    const mine = Object.keys(known).filter((a) => a.split(":")[0] === name);
    const counts = [
      mine.length,
      mine.filter((a) => covered.has(a)).length,
      mine.filter((a) => hand.has(a) && !covered.has(a)).length,
      mine.filter((a) => uncovered.includes(a)).length,
    ];
    lines.push(`| ${name} | ${counts.join(" | ")} |`);
  }
  lines.push("", `${Object.keys(known).length} aspects; ${uncovered.length} with nothing covering them.`);
  if (unknown.length) lines.push("", "Named but not found in any skill:", ...unknown.map((a) => "- " + a));
  if (uncovered.length) lines.push("", "Not covered:", ...uncovered.map((a) => `- \`${a}\`: ${known[a]}`));
  return lines.join("\n");
}
