// skillbook's documentation site, served from GitHub Pages at /skillbook/docs/ beside the install lines. The pages
// are the Markdown in ../docs, gathered into src/content/docs by scripts/gather.ts before each build; the sidebar is
// the docs map's (../docs/README.md) order and groups, which the gathering writes to src/sidebar.json.
import { readFileSync } from "node:fs";
import starlight from "@astrojs/starlight";
import { defineConfig, passthroughImageService } from "astro/config";
import { BASE, DESCRIPTION, GITHUB, SITE } from "./scripts/about.ts";

const sidebar = JSON.parse(readFileSync(new URL("./src/sidebar.json", import.meta.url), "utf8"));

export default defineConfig({
  site: SITE,
  base: BASE.replace(/\/$/, ""),
  trailingSlash: "always",
  // The pictures as they are: no image processing. sharp, which would do it, is not installed: package.json's
  // override puts a placeholder in its place (stubs/sharp), so libvips is never fetched.
  image: { service: passthroughImageService() },
  integrations: [
    starlight({
      title: "skillbook",
      logo: {
        light: "./public/skillbook-logotype-dark.svg",
        dark: "./public/skillbook-logotype-light.svg",
        replacesTitle: true,
      },
      favicon: "/skillbook-logomark-dark.svg",
      description: DESCRIPTION,
      social: [{ icon: "github", label: "GitHub", href: GITHUB }],
      // Each gathered page carries its own edit link, to its file in docs/ (its frontmatter's editUrl).
      editLink: { baseUrl: `${GITHUB}/edit/main/site/` },
      lastUpdated: false,
      sidebar,
    }),
  ],
});
