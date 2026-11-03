import { readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { walk } from "./inventory";

// Parse YAML rather than matching its surface: folded, quoted and block prompts all count.
export function copiedExamples(repo: string): string[] {
  const found: string[] = [];
  for (const path of walk(join(repo, "tests/cases")).filter(p => /\.ya?ml$/.test(p))) {
    const c = Bun.YAML.parse(readFileSync(path, "utf8")) as any;
    if (c.uses_skill_example === true) continue;
    const set = relative(join(repo, "tests/cases"), path).split("/")[0]!;
    const folder = join(repo, set === "project" ? ".agents/skills" : `skills/${set}`);
    if (!existsSync(folder)) continue;
    const sources = walk(folder).filter(p => p.endsWith(".md")).map(p => readFileSync(p, "utf8").toLowerCase());
    for (const turn of c.turns ?? []) {
      const prompt = turn.prompt?.trim().replace(/[.?!]$/, "").toLowerCase();
      if (prompt && sources.some(s => s.includes(prompt))) found.push(`${relative(repo, path)}: prompt appears in ${relative(repo, folder)}; word it differently`);
    }
  }
  return found;
}
