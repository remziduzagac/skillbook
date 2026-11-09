#!/usr/bin/env bun
// The site's pages, gathered from ../docs before each build: docs/ stays the one source, read on GitHub as it is; the
// site shows the same pages.
//
//   - The docs map (docs/README.md) gives the sidebar: each `##` section a group, its list's links the pages, in order.
//     The map itself is the home's job (src/content/docs/index.mdx), so it is not gathered.
//   - A page's H1 is its title, its first paragraph its description; the H1 leaves the text (Starlight draws it).
//   - Links between the docs become the site's addresses (`../essentials/README.md#guides` →
//     `/skillbook/docs/essentials/#guides`); one to a file outside docs/ goes to it on GitHub. Code, fenced or
//     inline, is left as it is.
//   - Pictures in assets/ that a page shows, by Markdown or an <img> tag, are copied to public/images.
//   - The logo's variants in assets/skillbook-*.svg are copied to public/.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, posix, relative, resolve } from "node:path";
import { BASE, GITHUB } from "./about.ts";

const SITE = resolve(import.meta.dir, "..");
const REPO = resolve(SITE, "..");
const DOCS = join(REPO, "docs");
const OUT = join(SITE, "src", "content", "docs");
const PUBLIC = join(SITE, "public");

/** The map's groups: each `##` section of docs/README.md, with the pages in docs/ its list links, in order. */
export function readMap(text: string): { label: string; pages: string[] }[] {
  const groups: { label: string; pages: string[] }[] = [];
  for (const line of text.split("\n")) {
    const h = /^## (.+)$/.exec(line);
    if (h) groups.push({ label: h[1]!.trim(), pages: [] });
    const item = /^\s*[-*\d.]+\s+\[[^\]]*\]\(([^)#\s]+\.md)(?:#[^)]*)?\)/.exec(line);
    if (item && groups.length && !/^[a-z][a-z0-9+.-]*:/i.test(item[1]!) && !item[1]!.startsWith("../"))
      groups.at(-1)!.pages.push(item[1]!);
  }
  return groups.filter((g) => g.pages.length);
}

/** A page's address on the site, from its path in docs/ (`essentials/README.md`), with an anchor kept. */
export function pageUrl(docPath: string, anchor = ""): string {
  const slug = `${docPath.replace(/\.md$/, "").replace(/(^|\/)README$/, "")}/`; // a folder's README is the folder's
  return `${BASE}${slug.replace(/^\/+/, "")}${anchor}`;
}

/**
 * A link's target as the site has it, from the page at `from` (its path in docs/): another page's address, a picture
 * in assets/ copied beside the site's pages, a repository file on GitHub; an address, or an anchor in the same page,
 * as it is. `pictures` collects the pictures to copy.
 */
export function rewriteTarget(
  target: string,
  from: string,
  isDir: (repoPath: string) => boolean,
  pictures: Set<string>,
): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#") || target.startsWith("/")) return target;
  const hash = target.indexOf("#");
  const path = hash < 0 ? target : target.slice(0, hash);
  const anchor = hash < 0 ? "" : target.slice(hash);
  const inDocs = posix.normalize(posix.join(posix.dirname(from), path));
  if (!inDocs.startsWith("../") && inDocs.endsWith(".md")) return pageUrl(inDocs, anchor);
  const repoPath = posix.normalize(posix.join("docs", posix.dirname(from), path)).replace(/\/$/, "");
  if (/^assets\/[^/]+\.(webp|svg|png|jpe?g|gif)$/.test(repoPath)) {
    pictures.add(repoPath);
    return `${BASE}images/${basename(repoPath)}`;
  }
  return `${GITHUB}/${isDir(repoPath) ? "tree" : "blob"}/main/${repoPath}${anchor}`;
}

/** Every link's and picture's target in Markdown and <img> tags rewritten, code (fenced or inline) left as it is. */
export function rewriteLinks(text: string, rewrite: (target: string) => string): string {
  let fence: string | null = null;
  return text
    .split("\n")
    .map((line) => {
      const f = /^\s*(`{3,}|~{3,})/.exec(line);
      if (f) {
        if (fence === null) fence = f[1]!;
        else if (f[1]!.startsWith(fence[0]!) && f[1]!.length >= fence.length) fence = null;
        return line;
      }
      if (fence !== null) return line;
      // A reference's definition: `[c]: target`.
      const def = /^(\s*\[[^\]]+\]:\s*)(\S+)(.*)$/.exec(line);
      if (def) return `${def[1]}${rewrite(def[2]!)}${def[3]}`;
      // Outside inline code: `](target)`, `](target "title")` and an HTML tag's `src="target"`.
      return line
        .split(/(`+[^`]*`+)/)
        .map((part, i) =>
          i % 2
            ? part
            : part
                .replace(/\]\(([^)\s]+)(\s+"[^"]*")?\)/g, (_, t, title = "") => `](${rewrite(t)}${title})`)
                .replace(/\bsrc="([^"]+)"/g, (_, t) => `src="${rewrite(t)}"`),
        )
        .join("");
    })
    .join("\n");
}

/** A page's title (its H1), its description (its first paragraph, as plain text) and its body without the H1. */
export function splitPage(text: string): { title: string; description: string; body: string } {
  const lines = text.split("\n");
  const at = lines.findIndex((l) => /^# /.test(l));
  if (at < 0) throw new Error("a page without an H1");
  const title = lines[at]!.slice(2).trim();
  const rest = lines.slice(at + 1);
  while (rest.length && !rest[0]!.trim()) rest.shift();
  // The first paragraph of prose: past any HTML block, such as a centred picture.
  let i = 0;
  while (i < rest.length && (!rest[i]!.trim() || /^\s*</.test(rest[i]!))) {
    if (/^\s*</.test(rest[i]!)) while (i < rest.length && rest[i]!.trim()) i++;
    else i++;
  }
  const para: string[] = [];
  for (const l of rest.slice(i)) {
    if (!l.trim() || /^(#|```|\||[-*] |\d+\. |>)/.test(l)) break;
    para.push(l.trim());
  }
  const plain = para
    .join(" ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_]/g, "")
    .trim();
  const description = plain.length > 220 ? `${plain.slice(0, 217).replace(/\s+\S*$/, "")}…` : plain;
  return { title, description, body: rest.join("\n") };
}

function gather(): void {
  const map = readMap(readFileSync(join(DOCS, "README.md"), "utf8"));
  rmSync(PUBLIC, { recursive: true, force: true });
  mkdirSync(join(PUBLIC, "images"), { recursive: true });
  for (const entry of readdirSync(OUT)) if (entry !== "index.mdx") rmSync(join(OUT, entry), { recursive: true });
  const isDir = (p: string) => existsSync(join(REPO, p)) && statSync(join(REPO, p)).isDirectory();
  const pictures = new Set<string>();
  const sidebar: { label: string; items: { slug: string }[] }[] = [];
  let pages = 0;
  for (const group of map) {
    const items: { slug: string }[] = [];
    for (const page of group.pages) {
      const { title, description, body } = splitPage(readFileSync(join(DOCS, page), "utf8"));
      const front = [
        "---",
        `title: ${JSON.stringify(title)}`,
        ...(description ? [`description: ${JSON.stringify(description)}`] : []),
        `editUrl: ${JSON.stringify(`${GITHUB}/edit/main/docs/${page}`)}`,
        "---",
        "",
      ].join("\n");
      const out = join(OUT, page.replace(/(^|\/)README\.md$/, "$1index.md")); // a folder's README is the folder's
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, front + rewriteLinks(body, (t) => rewriteTarget(t, page, isDir, pictures)));
      items.push({ slug: page.replace(/\.md$/, "").replace(/(^|\/)README$/, "$1").replace(/\/$/, "") });
      pages++;
    }
    sidebar.push({ label: group.label, items });
  }
  writeFileSync(join(SITE, "src", "sidebar.json"), `${JSON.stringify(sidebar, null, 2)}\n`);
  for (const p of pictures) copyFileSync(join(REPO, p), join(PUBLIC, "images", basename(p)));
  for (const f of readdirSync(join(REPO, "assets")))
    if (/^skillbook-(logo|logomark|logotype)-(dark|light)\.svg$/.test(f))
      copyFileSync(join(REPO, "assets", f), join(PUBLIC, f));
  copyFileSync(join(REPO, "assets", "skillbook-robot.webp"), join(PUBLIC, "images", "skillbook-robot.webp"));
  console.log(`gather: ${pages} pages in ${sidebar.length} groups and ${pictures.size} pictures, from ${relative(REPO, DOCS)}/`);
}

if (import.meta.main) gather();
