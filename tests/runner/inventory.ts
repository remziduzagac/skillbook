import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO } from "./paths";
import { skill_name } from "./shell";
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
// The text of every skill file at run time, kept in each result as a record of the text that was tested.
export const frozenSkills = () => Object.fromEntries(skillFiles().map(([name, path]) => [name, readFileSync(path, "utf8")]));
