#!/usr/bin/env bun
// After the build: every link from one page of the site to another lands, on the page there and the heading its
// anchor names. A path on the domain outside the docs fails too, but the Pages site's own files beside them: its
// index, the install lines and the channel files (scripts/site-files.sh). Addresses elsewhere are not checked here.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { BASE } from "./about.ts";

const DIST = resolve(import.meta.dir, "..", "dist");
const BESIDE = /^\/skillbook\/(install-[a-z][a-z0-9-]*\.sh|stable|preview)?$/;

const pages = new Map<string, string>();
const walk = (dir: string) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, e.name);
    if (e.isDirectory()) walk(path);
    else if (e.name.endsWith(".html")) pages.set(path, readFileSync(path, "utf8"));
  }
};
walk(DIST);

const broken: string[] = [];
for (const [page, html] of pages) {
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = raw!.replaceAll("&amp;", "&");
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (!url.startsWith(BASE)) {
      if (!BESIDE.test(url)) broken.push(`${page}: ${url} (outside the site)`);
      continue;
    }
    const [path, hash] = url.split("#") as [string, string | undefined];
    const rel = decodeURIComponent(path.slice(BASE.length));
    const file = rel === "" || rel.endsWith("/") ? join(DIST, rel, "index.html") : join(DIST, rel);
    if (!existsSync(file)) broken.push(`${page}: ${url} (no such page)`);
    else if (hash && file.endsWith(".html") && !(pages.get(file) ?? readFileSync(file, "utf8")).includes(`id="${hash}"`))
      broken.push(`${page}: ${url} (no heading #${hash})`);
  }
}
if (broken.length) {
  console.error(`check-links: ${broken.length} broken\n${broken.join("\n")}`);
  process.exit(1);
}
console.log(`check-links: ${pages.size} pages, every link within the site lands`);
