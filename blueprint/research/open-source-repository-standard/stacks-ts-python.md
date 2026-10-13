# Stack profiles for greenrepo: TypeScript/JavaScript and Python (state as of 2026-10-10)

Research notes for the greenrepo "Stack profiles" section. Version numbers and dates come from the GitHub releases API, the npm registry and PyPI JSON, queried on 2026-10-10, unless another source is given. Config details come from the repositories' own files, read on the same day with `gh api` (read-only). Where search snippets were the only source, the note says so.

## Toolchain and version pinning

### Takeaway

**Node:** Node 20 reached end of life on 2026-04-30, and Node 26 becomes LTS on 2026-10-28. A repo should develop on Node 24 or 26 LTS and test 22, 24 and 26. Corepack no longer ships with Node 25 or later, and Volta is unmaintained. Pin pnpm with the `packageManager` field, and pin Node with `.node-version` or `devEngines.runtime`, or with mise when the repo covers several stacks.

**Python:** Python 3.15.0 came out on 2026-10-09, and 3.10 reached end of life on 2026-10-01. Pin the interpreter with `.python-version`, set `requires-python = ">=3.11"`, and let uv install interpreters. mise is the multi-tool alternative.

### Cited Findings

#### TypeScript/JavaScript

- Node release lines (official schedule data): v20 end of life 2026-04-30; v22 in maintenance until 2027-04-30; v24 Active LTS since 2025-10-28, maintenance from 2026-10-20, end of life 2028-04-30; v25 end of life 2026-06-01; v26 released 2026-05-05, LTS 2026-10-28, end of life 2029-04-30; v27 alpha from 2026-10-28, released 2027-04-22 — [nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json)
- Latest Node release: v26.11.1, 2026-10-07 — [nodejs/node releases](https://github.com/nodejs/node/releases)
- The new release model was announced on 2026-03-10. There will be one major release a year, in April, promoted to LTS in October, and every line becomes LTS, so the odd/even split ends. Each line gets a 6-month Alpha channel, 6 months as Current and 30 months of LTS, 36 months in total. Node 27 is the first on this model, and "Node.js 26 is the last release line under the current model". The post says it "currently v24.21.0 as Latest LTS" and that library authors should test against Alpha releases in CI — [Node.js blog: Evolving the release schedule](https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule)
- The Node.js TSC voted to stop distributing Corepack. It is removed from Node 25 and later, still bundled with Node 24 LTS and earlier, and can be installed with `npm install -g corepack` — [Socket.dev](https://socket.dev/blog/node-js-tsc-votes-to-stop-distributing-corepack). The Corepack API page exists in the v24 docs (HTTP 200) but not in the v26 docs (HTTP 404) — [v24 corepack docs](https://nodejs.org/docs/latest-v24.x/api/corepack.html), [v26 corepack docs](https://nodejs.org/docs/latest-v26.x/api/corepack.html). The standalone `corepack` package is still maintained: v0.36.0 came out on 2026-08-28 — [nodejs/corepack](https://github.com/nodejs/corepack/releases)
- Volta's README says: "**Volta is unmaintained.** … We recommend migrating to `mise`". Its last release is v2.0.2, from 2024-12-05 — [volta-cli/volta](https://github.com/volta-cli/volta)
- mise is actively released with calendar versions (latest v2026.10.6, 2026-10-09) — [jdx/mise](https://github.com/jdx/mise/releases)
- The npm `package.json` docs describe a `devEngines` field with the sub-fields `runtime`, `packageManager`, `cpu`, `os` and `libc`, and `onFail` values `warn`, `error` or `ignore`. It is checked before `install`, `ci` and `run`, and is meant for people developing the package, whereas `engines` is aimed at its consumers — [npm docs: package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- The `pnpm/setup@v3` action installs pnpm 11 or later and also a runtime (Node, Bun or Deno) through `pnpm runtime set`. It reads `devEngines.runtime`, and if the manifest names no Node version it falls back to `.node-version`, then `.nvmrc`, then `.tool-versions`. The pnpm version comes from `packageManager` or `devEngines.packageManager`. The README's example uses `"devEngines": {"runtime": {"name": "node", "version": "^22.0.0", "onFail": "download"}}` — [pnpm/setup README](https://github.com/pnpm/setup)
- In pnpm 12, "globally installed Node/Deno/Bun automatically use the version pinned by the current project" — [pnpm 12.0 release notes](https://pnpm.io/blog/releases/12.0)
- `actions/setup-node` accepts `node-version-file`, and since v6 caches npm automatically when `packageManager` or `devEngines.packageManager` is `npm` — [actions/setup-node README](https://github.com/actions/setup-node)
- In practice, Vite pins `"packageManager": "pnpm@12.9.1"` and `"engines": {"node": "^20.19.0 || >=22.12.0"}` and tests Node 20, 22, 24 and 26 in CI — [vite package.json](https://github.com/vitejs/vite/blob/main/package.json), [vite ci.yml](https://github.com/vitejs/vite/blob/main/.github/workflows/ci.yml). Starlight pins `"packageManager": "pnpm@11.22.0"` and an exact Node (`22.23.1`) in its workflow — [starlight package.json](https://github.com/withastro/starlight/blob/main/package.json), [starlight ci.yml](https://github.com/withastro/starlight/blob/main/.github/workflows/ci.yml). Biome pins `"packageManager": "pnpm@12.6.0"` and `"engines": {"pnpm": "12.6.0", "node": ">=22.13"}` — [biome package.json](https://github.com/biomejs/biome/blob/main/package.json)
- Node strips TypeScript types without a flag since v23.6.0 and v22.18.0. The feature has been "Stability: 2 (Stable)" since v25.2.0 and v24.12.0, and `--experimental-transform-types` was removed in v26.0.0. Only erasable syntax works (no enums, no namespaces with runtime code, no parameter properties), imports need the `.ts` extension, `tsconfig` is ignored and nothing is type-checked. The recommended tsconfig flags are `erasableSyntaxOnly`, `verbatimModuleSyntax` and `rewriteRelativeImportExtensions` — [Node.js docs: TypeScript](https://nodejs.org/api/typescript.html). Vite runs `node scripts/detect-release.ts` directly in its publish workflow — [vite publish.yml](https://github.com/vitejs/vite/blob/main/.github/workflows/publish.yml)
- Bun: latest is v1.4.2 (2026-09-05) — [oven-sh/bun](https://github.com/oven-sh/bun/releases). Anthropic acquired Bun in December 2025, and Bun stays MIT-licensed open source — [DevClass](https://devclass.com/2025/12/03/bun-javascript-runtime-acquired-by-anthropic-tying-its-future-to-ai-coding/). Deno: latest is v2.9.7 (2026-09-17) — [denoland/deno](https://github.com/denoland/deno/releases)

#### Python

- Python branches: 3.9 end of life 2025-10-31; 3.10 end of life 2026-10-01; 3.11 security fixes only until 2027-10; 3.12 security until 2028-10; 3.13 security until 2029-10; 3.14 bugfix (released 2025-10-07); 3.15 bugfix, first released 2026-10-09; 3.16 in development, planned for 2027-10-06 — [Python devguide: versions](https://devguide.python.org/versions/). The CPython tag v3.15.0 is dated 2026-10-09 — [python/cpython tags](https://github.com/python/cpython/tags)
- uv 0.13.0 came out on 2026-10-09 and "makes Python 3.15 the default stable Python version" — [uv 0.13.0 release](https://github.com/astral-sh/uv/releases/tag/0.13.0)
- For GitHub Actions, uv's docs describe three ways to get Python: `uv python install`, which "respects the project's pinned Python version"; `actions/setup-python` with `.python-version`, which is faster thanks to GitHub's Python cache; and `actions/setup-python` reading `requires-python` from `pyproject.toml`. A matrix can be driven by the `python-version` input of `setup-uv` or by `UV_PYTHON` — [uv docs: GitHub integration](https://docs.astral.sh/uv/guides/integration/github/)
- `astral-sh/setup-uv` takes its uv version from config files (`uv.toml`, then `pyproject.toml`) by default or from `version-file`. Its `python-version` input sets `UV_PYTHON` and overrides `.python-version` and `pyproject.toml` — [setup-uv README](https://github.com/astral-sh/setup-uv). Latest is v10.3.0 (2026-10-09).
- pydantic sets `requires-python = '>=3.10'` and tests 3.10 to 3.15 in CI — [pydantic pyproject.toml](https://github.com/pydantic/pydantic/blob/main/pyproject.toml), [pydantic ci.yml](https://github.com/pydantic/pydantic/blob/main/.github/workflows/ci.yml). httpx still declares `requires-python = ">=3.9"`, a version that is now end of life, and tests 3.9 to 3.13 — [httpx pyproject.toml](https://github.com/encode/httpx/blob/master/pyproject.toml)
- Ruff 0.17.0 (2026-10-09) "now defaults to Python 3.11 instead of 3.10 when no Python version is configured through `target-version` or `requires-python`" — [Ruff 0.17.0 release](https://github.com/astral-sh/ruff/releases/tag/0.17.0)

### Inferences

**Node:**

- For a new project in October 2026, require Node `>=22.12` for consumers. That is the oldest supported LTS line (in maintenance until 2027-04-30), and `require(esm)` works there without a flag (see the build section). Vitest 5 and pnpm 11 also need Node 22 or later. Develop on 24 or 26 LTS and test 22, 24 and 26 in CI.
- Corepack is gone from new Node lines, so `packageManager` is now a plain declaration. It no longer gets the package manager automatically. pnpm's own actions, `setup-node` and `pnpm self-update` still read it. Pinning should state both the package manager version (`packageManager`) and the Node version (`.node-version` or `devEngines.runtime`).
- A multi-stack repo, or a maintainer who already uses mise, can use `mise.toml` as the single pin file for Node, pnpm, Python and uv. Volta should be marked deprecated in greenrepo.
- Node's built-in type stripping lets small scripts and repo tooling run `.ts` files with no build step, provided the code sticks to erasable syntax.

**Python:**

- Set `requires-python = ">=3.11"` and commit `.python-version` (the uv default for local development). Test 3.11 to 3.15 in CI.

### Gaps

- I did not verify how npm itself enforces `devEngines.runtime` with `onFail: "download"`. The npm docs list only `warn`, `error` and `ignore`, while pnpm documents `download`.
- I did not check which npm version ships with each Node 24 or 26 release.
- I found no primary source for current Deno-specific pinning practice (`deno.json`), so Deno is mentioned only in passing.

## Package management and lockfiles

### Takeaway

**TypeScript/JavaScript:** Vite, Starlight and Biome all use pnpm. pnpm 11 (2026-04-28) turned on supply-chain defaults: dependencies must be at least a day old, and lifecycle scripts run only for packages listed in `allowBuilds`. pnpm 12 (2026-08-26) is a Rust rewrite and is now npm's `latest`. npm is the zero-extra-tool fallback, and Bun and Yarn 4 are viable alternatives. Always commit the lockfile.

**Python:** use uv with a committed `uv.lock` and `[dependency-groups]` (PEP 735) for development tools. Poetry, PDM and pip-tools are still maintained but are not the default.

### Cited Findings

#### TypeScript/JavaScript

- pnpm 11.0.0 was published on 2026-04-28 and 12.0.0 on 2026-08-26 ([pnpm/pnpm releases](https://github.com/pnpm/pnpm/releases)). The npm `latest` tag now points to 12.10.1 (2026-10-06), and the 11.x line is still patched (11.28.5 on 2026-10-06) — [pnpm blog](https://pnpm.io/blog)
- pnpm 11 needs Node 22 or later and ships only as ESM. pnpm settings move to `pnpm-workspace.yaml` or the global `~/.config/pnpm/config.yaml`, while auth and registry settings stay in `.npmrc`. A single `allowBuilds` map replaces `onlyBuiltDependencies` and `neverBuiltDependencies`. Supply-chain protection is "on by default": `minimumReleaseAge` is 1440 minutes (1 day) and `blockExoticSubdeps` is enabled. Publishing is implemented natively (no npm CLI fallback), and the store index is now SQLite-backed — [pnpm 11.0 release notes](https://pnpm.io/blog/releases/11.0)
- pnpm 12 is "a complete Rust rewrite", though "upgrading should not feel like a migration". Lockfiles are now deterministic for cyclic dependencies, unknown settings in `pnpm-workspace.yaml` produce errors or warnings, and git dependencies are normalised to HTTPS in the lockfile. The notes also mention that "explicit frozen-lockfile boolean values" were removed — [pnpm 12.0 release notes](https://pnpm.io/blog/releases/12.0)
- Vite's publish job runs `yq '.allowBuilds[]=false' -i pnpm-workspace.yaml` ("Disallow installation scripts") before installing — [vite publish.yml](https://github.com/vitejs/vite/blob/main/.github/workflows/publish.yml). Its root `package.json` has `"preinstall": "npx only-allow pnpm"` — [vite package.json](https://github.com/vitejs/vite/blob/main/package.json)
- npm latest is 12.2.0 (2026-09-30), and npm 12.0.0 came out on 2026-07-08 ([npm registry](https://www.npmjs.com/package/npm)). Yarn Berry latest is 4.18.1 (2026-09-24) ([yarnpkg/berry](https://github.com/yarnpkg/berry/releases)). Bun latest is 1.4.2 ([oven-sh/bun](https://github.com/oven-sh/bun/releases)).
- OSV-Scanner reads `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` and `bun.lock` — [OSV-Scanner supported lockfiles](https://google.github.io/osv-scanner/supported-languages-and-lockfiles/)
- Vite, Starlight and Biome each commit `pnpm-lock.yaml` and `pnpm-workspace.yaml` at the repo root (root listings fetched with `gh api repos/<repo>/contents/`).

#### Python

- uv is at 0.13.0 (2026-10-09) and is still pre-1.0 — [PyPI uv](https://pypi.org/project/uv/). Its GitHub guide installs with `uv sync --locked --all-extras --dev` and runs `uv run pytest tests` — [uv docs: GitHub integration](https://docs.astral.sh/uv/guides/integration/github/)
- pydantic commits `uv.lock` and declares `[dependency-groups]` (PEP 735) for dev, lint and typecheck tools. It also uses `[tool.uv.sources]` and `[tool.uv.workspace]`. Its Makefile installs with `uv sync --frozen --all-groups --all-packages --all-extras` and refreshes the lock with `uv lock --upgrade`. CI sets `UV_FROZEN: true` — [pydantic pyproject.toml](https://github.com/pydantic/pydantic/blob/main/pyproject.toml), [pydantic Makefile](https://github.com/pydantic/pydantic/blob/main/Makefile), [pydantic ci.yml](https://github.com/pydantic/pydantic/blob/main/.github/workflows/ci.yml)
- uv's own publish workflow sets `UV_LOCKED: 1` — [uv publish-pypi.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/publish-pypi.yml)
- httpx takes another approach. It pins tooling in `requirements.txt` (`mypy==1.17.1`, `ruff==0.12.11`, `pytest==8.4.1` and so on) but leaves runtime dependencies unpinned "because our tests needs to pass with the latest version of the packages" — [httpx requirements.txt](https://github.com/encode/httpx/blob/master/requirements.txt)
- Alternatives are still maintained: Poetry 2.5.1 (2026-09-20), PDM 2.29.2 (2026-09-17) and pip-tools 7.6.2 (2026-10-07) — [PyPI poetry](https://pypi.org/project/poetry/), [PyPI pdm](https://pypi.org/project/pdm/), [jazzband/pip-tools](https://github.com/jazzband/pip-tools/releases)
- OSV-Scanner reads `uv.lock`, `poetry.lock`, `pdm.lock`, `requirements.txt`, `pylock.toml` and `Pipfile.lock` — [OSV-Scanner supported lockfiles](https://google.github.io/osv-scanner/supported-languages-and-lockfiles/)
- Astral announced on 2026-03-19 that it will join OpenAI ("Astral to join OpenAI") — [Astral blog](https://astral.sh/blog)

### Inferences

**TypeScript/JavaScript:**

- Default to pnpm. The reference repos use it, it has workspace support, and its pnpm 11 security defaults (`minimumReleaseAge`, `allowBuilds`) are exactly the supply-chain controls greenrepo cares about. pnpm 12 is `latest` but is only about six weeks old. A conservative maintainer can stay on 11.x, which is still patched, as Starlight does.
- Use npm when you want no extra tools. It works with `setup-node`'s automatic caching and is the reference client for trusted publishing.
- Commit the lockfile in libraries too. Consumers never see it, but it makes CI and agent runs reproducible.
- Record in the profile that new packages wait at least a day before they install (`minimumReleaseAge`). Agents and maintainers will otherwise be surprised when a just-published version does not resolve.

**Python:**

- Default to uv: commit `uv.lock`, run CI with `--locked` (or `UV_LOCKED=1`), and keep dev tools in `[dependency-groups]`, not in extras.
- The move of Astral (the company behind uv, Ruff and ty) to OpenAI is a governance fact. The profile could list it under its risks. The tools are open source and permissively licensed.

### Gaps

- I did not confirm whether pnpm 12 changed `--frozen-lockfile` behaviour. The 12.0 notes mention "explicit frozen-lockfile boolean values removed" without detail. The `pnpm/setup` README still documents `pnpm install --frozen-lockfile` for v11 and later.
- I did not fetch uv's own guidance on whether libraries should commit `uv.lock`. The recommendation above rests on pydantic's practice and on uv's CI guide using `--locked`.
- I did not verify Poetry 2's PEP 621 `[project]` support or PEP 751 `pylock.toml` export from uv; only OSV-Scanner's ability to read `pylock.toml` is confirmed.

## Formatting and linting

### Takeaway

**TypeScript/JavaScript:** there are three viable stacks. Biome 2.5 is one tool for formatting and linting, with type-aware rules that do not need `tsc`. ESLint 10 (flat config only) with typescript-eslint and Prettier has the largest plugin ecosystem. Oxlint 1.x with Oxfmt (still 0.x) is the fastest and is what Vite adopted for formatting. For a solo maintainer, Biome is the simplest default.

**Python:** Ruff covers both formatting and linting. Ruff 0.16 raised the default rule set from 59 to 413 rules.

### Cited Findings

#### TypeScript/JavaScript

- Biome: latest 2.5.15 (2026-09-30); 2.0.0 came out on 2025-06-17 ([npm @biomejs/biome](https://www.npmjs.com/package/@biomejs/biome)). The Biome blog describes the following. v2 introduced "Biotype", type inference for linting "without requiring TypeScript compilation". GritQL is the plugin language, and v2.5 added code fixes from plugins. v2.4 improved Vue, Svelte and Astro support. v2.5 added cross-file linting and promoted 70+ rules to stable, and the roadmap aims at 500+ rules — [Biome blog](https://biomejs.dev/blog/)
- ESLint v10.0.0 came out on 2026-02-06 and "completely removed" eslintrc. `.eslintrc.*` and `.eslintignore` are ignored, `ESLINT_USE_FLAT_CONFIG` is no longer honoured, and `/* eslint-env */` comments are errors. `eslint.config.*` is now looked up from each linted file's directory, which allows several configs in one run and helps monorepos. Migration: `npx @eslint/migrate-config .eslintrc.json` — [ESLint v10.0.0 released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/). Latest: 10.12.0 (2026-10-02) — [eslint/eslint](https://github.com/eslint/eslint/releases)
- typescript-eslint latest: v8.71.1 (2026-10-05) — [typescript-eslint releases](https://github.com/typescript-eslint/typescript-eslint/releases). Prettier latest: 3.9.9 (2026-09-23); `next` is 4.0.0-alpha.13 — [npm prettier](https://www.npmjs.com/package/prettier)
- Oxlint 1.0.0 came out on 2025-06-10, and the latest is 1.87.0 (2026-10-05) — [npm oxlint](https://www.npmjs.com/package/oxlint). Type-aware linting is enabled with `--type-aware` or `typeAware: true` and needs the `oxlint-tsgolint` package and "TypeScript 7.0+". It supports "59 out of 61" typescript-eslint type-aware rules, though "rule coverage is incomplete (but very close)". Monorepos must build dependent packages first so that their `.d.ts` files exist — [Oxlint type-aware docs](https://oxc.rs/docs/guide/usage/linter/type-aware.html). JS plugins (ESLint-compatible) reached alpha on 2026-03-11 — [Oxc blog: JS plugins alpha](https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha.html)
- Oxfmt: latest 0.72.0 (2026-10-05); 0.1.0 came out on 2025-09-12 ([npm oxfmt](https://www.npmjs.com/package/oxfmt)). The docs say "migrating from recent versions of Prettier should produce few or no formatting differences" and list JS/TS, JSON, YAML, TOML, HTML, Vue, Svelte, CSS, Markdown, MDX, GraphQL and more — [Oxfmt docs](https://oxc.rs/docs/guide/usage/formatter.html). A search snippet attributed to VoidZero says Oxfmt's beta "passes 100% of Prettier's JavaScript and TypeScript conformance tests" — [VoidZero Feb 2026 recap](https://voidzero.dev/posts/whats-new-feb-2026) (secondary, not fetched)
- Vite formats with Oxfmt (`"format": "oxfmt"`, `.oxfmtrc.json`, `oxfmt ^0.72.0`) and checks formatting in CI with `pnpm format && git diff --exit-code`. It lints with ESLint 9 (`eslint --cache . --concurrency auto`, flat config via `defineConfig` from `eslint/config`) plus typescript-eslint. Type-checked lint rules are switched on only in the IDE "as enabling it is slow" — [vite package.json](https://github.com/vitejs/vite/blob/main/package.json), [vite eslint.config.js](https://github.com/vitejs/vite/blob/main/eslint.config.js), [vite ci.yml](https://github.com/vitejs/vite/blob/main/.github/workflows/ci.yml)
- Starlight uses ESLint `^10.3.0` (`eslint . --max-warnings 0`), `eslint-config-prettier` and Prettier pinned to `3.3.3` with `prettier-plugin-astro` — [starlight package.json](https://github.com/withastro/starlight/blob/main/package.json)
- Biome's own repo provides a `ci` command (`"ci": "cargo biome-cli-dev ci"`) next to `check` and `check:write` — [biome package.json](https://github.com/biomejs/biome/blob/main/package.json)

#### Python

- Ruff 0.16.0 (2026-07-23) enables "413 rules by default, up from 59". The new defaults add flake8-bugbear and pyupgrade rules and drop 18 opinionated pycodestyle and pyflakes rules. The formatter now formats Python code blocks in Markdown and Quarto, `check` shows fixes as diffs, and there are new `ruff: ignore` and `ruff: file-ignore` comments — [Ruff v0.16.0 blog](https://astral.sh/blog/ruff-v0.16.0)
- Ruff 0.17.0 (2026-10-09) changed the defaults again: some DTZ rules left the default set, F406 joined it, and the default target is now Python 3.11. Its release binaries are now code-signed — [Ruff 0.17.0 release](https://github.com/astral-sh/ruff/releases/tag/0.17.0)
- pydantic runs `uv run ruff check` and `uv run ruff format --check` for lint, and `ruff check --fix` then `ruff format` to fix — [pydantic Makefile](https://github.com/pydantic/pydantic/blob/main/Makefile). httpx selects `["E", "F", "I", "B", "PIE"]` — [httpx pyproject.toml](https://github.com/encode/httpx/blob/master/pyproject.toml)
- uv has a `uv format` command ("Format Python code in the project"; extra arguments go to Ruff), according to `uv format --help` in uv 0.11.18, run locally.

### Inferences

**TypeScript/JavaScript:**

- Default: Biome 2.x, with `biome ci` in CI and `biome check --write` locally. It is one devDependency and one config file, it is fast for agent loops, and it does not depend on the TypeScript API that TS 7 lacks (see type checking).
- Alternative A: ESLint 10 flat config with typescript-eslint and Prettier (or Oxfmt), for framework-specific plugins (Astro, Vue, React hooks and so on) or established rule sets. Note that typescript-eslint still needs TS 6.
- Alternative B: Oxlint with Oxfmt, for maximum speed. Oxfmt is still 0.x, and type-aware Oxlint needs TS 7.
- Since ESLint 10, eslintrc is fully gone, so greenrepo should mark any `.eslintrc*` or `.eslintignore` as a finding.

**Python:**

- Default: `ruff format` and `ruff check` with the default rule set, plus explicit `extend-select` additions. Pin the Ruff version (in the lockfile or dev group), because Ruff's minor releases change default rules (0.16 and 0.17 both did). A Ruff bump should be its own commit.

### Gaps

- I did not read the Biome blog posts for exact v2.x release dates other than 2.0. "Vercel partnership" and "500+ rules" come from the blog index summary.
- I could not fetch the Oxfmt beta date or whether a 1.0 is planned; its version line (0.72) suggests it is pre-stable.

## Type checking

### Takeaway

**TypeScript/JavaScript:** TypeScript 7.0, the native Go port, shipped on 2026-07-08 as the `typescript` package (`tsc`). It is roughly 10x faster, but it has no compiler API until 7.1. Tools that embed TypeScript (typescript-eslint, Astro, Vue, Svelte, ts-morph) still need TypeScript 6.0, the last JS-based release (2026-03-23). Vite and Starlight are still on 6.0.

**Python:** mypy 2.x and pyright are the stable choices. ty (Astral) is beta at 0.0.x and moves fast, and pyrefly (Meta) reached 1.0 in May 2026.

### Cited Findings

#### TypeScript/JavaScript

- TypeScript 7.0 was announced on 2026-07-08. It installs as `typescript` with the `tsc` binary, and TS 6.0 stays available as `@typescript/typescript6` (binary `tsc6`). Builds are 8x to 12x faster (VS Code: 125.7 s on TS 6 versus 10.6 s). "TypeScript 7 does not yet expose a stable programmatic API", and "We expect TypeScript 7.1 to ship with a new (and different) API". Until then typescript-eslint, ts-morph, Vue, Svelte, Astro and Angular tools depend on 6.0, and the suggested side-by-side setup is `"typescript": "npm:@typescript/typescript6@^6.0.2"` — [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [InfoWorld](https://www.infoworld.com/article/4196378/go-based-typescript-7-0-arrives.html)
- New defaults in TS 7.0: `strict: true`, `module: esnext`, `noUncheckedSideEffectImports: true`, `types: []` (list `node` and others explicitly) and `rootDir: ./` (most projects need `"rootDir": "./src"`). These are now hard errors: `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10`/`classic`, `baseUrl`, AMD/UMD/SystemJS modules, `esModuleInterop: false` and import `asserts`. The recommended path is to adopt 6.0 first and fix its deprecations — [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- TypeScript 6.0.2 came out on 2026-03-23 ([microsoft/TypeScript releases](https://github.com/microsoft/TypeScript/releases)) as "the final JavaScript-based version". Options deprecated in 6.0 (`baseUrl`, ES5 target, `moduleResolution: node`) keep working with `"ignoreDeprecations": "6.0"` and are removed in 7.0, and `--stableTypeOrdering` helps the migration — [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) (via search snippet), [Socket.dev](https://socket.dev/blog/typescript-6-0-released-final-javascript-based-version)
- The npm `typescript` `latest` tag is 7.0.2 (published 2026-07-08), and `next` is 7.1.0-dev nightlies. `@typescript/native-preview` stopped at 7.0.0-dev.20260707.2 — [npm typescript](https://www.npmjs.com/package/typescript). The microsoft/TypeScript GitHub release v7.0.2 is dated 2026-08-20 ([releases](https://github.com/microsoft/TypeScript/releases)), which conflicts with the npm date. The npm publish date is the more reliable of the two.
- Vite uses `"typescript": "~6.0.2"` with `"typecheck": "tsc -p scripts && pnpm -r --parallel run typecheck"`, and its ESLint config enables `isolatedDeclarations: true` — [vite package.json](https://github.com/vitejs/vite/blob/main/package.json), [vite eslint.config.js](https://github.com/vitejs/vite/blob/main/eslint.config.js). Starlight uses `"typescript": "^6.0.3"` and `astro check` — [starlight package.json](https://github.com/withastro/starlight/blob/main/package.json)
- The TS 7 announcement says projects using `--isolatedDeclarations` with separate declaration emit get faster parallel builds of project references — [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)

#### Python

- mypy 2.0.0 came out on 2026-05-06 ([PyPI mypy](https://pypi.org/project/mypy/)), and the latest is 2.4.0 (2026-10-01). In 2.0, `--local-partial-types` and `--strict-bytes` are on by default, `--allow-redefinition` takes the newer behaviour (`--allow-redefinition-old` gives the old one), there is experimental parallel checking with `--num-workers`, and the lowest `--python-version` target is 3.10 — [mypy changelog](https://mypy.readthedocs.io/en/stable/changelog.html), [pydevtools: mypy 2.0](https://pydevtools.com/blog/mypy-2-0-parallel-type-checking/) (search snippets)
- pyright: latest 1.1.414 (2026-09-09) ([microsoft/pyright](https://github.com/microsoft/pyright/releases)). basedpyright: 1.40.2 (2026-10-04) ([PyPI basedpyright](https://pypi.org/project/basedpyright/))
- ty was announced in beta on 2025-12-16 as an "extremely fast Python type checker and language server, written in Rust" and an alternative to mypy, Pyright and Pylance. Astral "now uses ty exclusively in their own projects", and the post aims for a stable release in 2026 — [Astral blog: ty](https://astral.sh/blog/ty), [InfoWorld](https://www.infoworld.com/article/4108979/python-type-checker-ty-now-in-beta.html). The README still says "ty is currently in beta", with "`0.0.x` versioning", "does not yet have a stable API" and breaking changes possible. The latest is 0.0.85 (2026-10-06) — [astral-sh/ty](https://github.com/astral-sh/ty)
- pyrefly (Meta) 1.0.0 came out on 2026-05-12, and the latest is 1.3.2 (2026-09-28) — [PyPI pyrefly](https://pypi.org/project/pyrefly/). zuban: 0.10.0 (2026-09-18) — [PyPI zuban](https://pypi.org/project/zuban/)
- pydantic type-checks with pyright (in a pre-commit hook: `uv run pyright pydantic`) and also keeps mypy in a dependency group for its mypy plugin tests — [pydantic .pre-commit-config.yaml](https://github.com/pydantic/pydantic/blob/main/.pre-commit-config.yaml), [pydantic pyproject.toml](https://github.com/pydantic/pydantic/blob/main/pyproject.toml). httpx uses `[tool.mypy] strict = true` — [httpx pyproject.toml](https://github.com/encode/httpx/blob/master/pyproject.toml)

### Inferences

**TypeScript/JavaScript:**

- Default as of October 2026: if the lint stack does not need the TS API (Biome or Oxlint), use `typescript@^7` and `tsc --noEmit` (or `tsc -b`) as the type-check gate. If you use typescript-eslint type-aware rules or a framework checker (Astro, Vue, Svelte), stay on `typescript@~6.0` until 7.1 ships its API, or use TS 7 for CLI checks with TS 6 aliased for those tools.
- Either way, write a tsconfig that is already valid for TS 7: explicit `rootDir` and `types`, `module`/`moduleResolution` set to `nodenext` (or `bundler` for bundled apps), `strict`, `verbatimModuleSyntax`, no `baseUrl`. Libraries should add `isolatedDeclarations`.

**Python:**

- Default: one stable checker in strict mode in CI, either pyright (or basedpyright) or mypy 2.x. A solo maintainer can add ty as a fast, optional local or editor check. Make ty the gate only if they accept 0.0.x churn. greenrepo should require "a type checker, pinned, strict, in CI" rather than a specific tool.

### Gaps

- I did not verify how typescript-eslint plans to support TS 7.1, or when 7.1 is expected.
- I did not verify mypy 2.x behaviour details beyond search snippets, because the changelog page was not fetched in full.

## Tests and coverage

### Takeaway

**TypeScript/JavaScript:** default to Vitest 5 (2026-09-03, needs Node 22.12+) with `@vitest/coverage-v8`. Use `node:test` for very small, zero-dependency packages, and Jest 30 for existing suites.

**Python:** pytest 9 (native `[tool.pytest]` TOML config) with coverage.py 7.16, through pytest-cov or `coverage run`. Cover several Python versions with a CI matrix using `setup-uv` `python-version`. tox 4 with tox-uv, or nox, is for when you want the same matrix locally.

### Cited Findings

#### TypeScript/JavaScript

- Vitest 5.0.0 was published on 2026-09-03, and the latest is 5.0.3 (2026-09-30). Vitest 4.0.0 came out on 2025-10-22 — [npm vitest](https://www.npmjs.com/package/vitest). Secondary summaries of the v5 release say it requires Node 22.12.0+ and Vite 6.4.0+, clears mocks before every test by default, fails un-awaited async assertions, and adds nested projects and a Trace View in Browser Mode — [vitest v5.0.0 release](https://github.com/vitest-dev/vitest/releases/tag/v5.0.0), [OpenReplay](https://blog.openreplay.com/vitest-5-changes/) (via search snippets)
- `@vitest/coverage-v8` latest is 5.0.3 — [npm @vitest/coverage-v8](https://www.npmjs.com/package/@vitest/coverage-v8)
- Jest: 30.0.0 came out on 2025-06-10, and the latest is 30.5.2 (2026-09-18) — [npm jest](https://www.npmjs.com/package/jest)
- Vite tests itself with `vitest run` (unit) and separate e2e configs — [vite package.json](https://github.com/vitejs/vite/blob/main/package.json). Starlight runs `pnpm -r test:coverage` in CI — [starlight ci.yml](https://github.com/withastro/starlight/blob/main/.github/workflows/ci.yml)

#### Python

- pytest 9.0.0 came out on 2025-11-08, and the latest is 9.1.1 (2026-06-19) — [PyPI pytest](https://pypi.org/project/pytest/). Version 9.0 added native TOML configuration under `[tool.pytest]` (the old `[tool.pytest.ini_options]` treated every value as a string) and `pytest.toml`. You cannot use both tables at once — [pytest changelog](https://docs.pytest.org/en/stable/changelog.html), [pytest configuration docs](https://docs.pytest.org/en/stable/reference/customize.html) (via search snippets). pydantic already uses `[tool.pytest]` — [pydantic pyproject.toml](https://github.com/pydantic/pydantic/blob/main/pyproject.toml)
- coverage.py: latest 7.16.2 (2026-09-27) ([PyPI coverage](https://pypi.org/project/coverage/)). Since 7.9.1 (2025-06-13), "on Python 3.14+, the 'sysmon' core is now the default" where supported — [coverage CHANGES.rst](https://github.com/nedbat/coveragepy/blob/master/CHANGES.rst). pytest-cov: 7.1.0 (2026-03-21) — [PyPI pytest-cov](https://pypi.org/project/pytest-cov/)
- tox 4.65.0 (2026-10-09) and tox-uv 1.36.0 (2026-07-21). tox-uv "replaces `virtualenv` and pip with `uv` in your `tox` environments" and supports `uv.lock` and `dependency_groups` — [tox-uv README](https://github.com/tox-dev/tox-uv). nox: 2026.08.17 — [wntrblm/nox](https://github.com/wntrblm/nox/releases)
- setup-uv documents a matrix over `python-version` (for example `["3.10", "3.11", "3.12", "3.13"]`) — [setup-uv README](https://github.com/astral-sh/setup-uv). pydantic's lint job runs a 3.10 to 3.15 matrix through setup-uv — [pydantic ci.yml](https://github.com/pydantic/pydantic/blob/main/.github/workflows/ci.yml)
- httpx enforces coverage with a separate `scripts/coverage` step and sets `filterwarnings = ["error", ...]` in its pytest config — [httpx test-suite.yml](https://github.com/encode/httpx/blob/master/.github/workflows/test-suite.yml), [httpx pyproject.toml](https://github.com/encode/httpx/blob/master/pyproject.toml)

### Inferences

**TypeScript/JavaScript:**

- Default: `vitest run --coverage` with the v8 provider and a coverage threshold in `vitest.config.ts`. Vitest 5's stricter defaults (mocks cleared, un-awaited assertions fail) suit agent-written tests.

**Python:**

- Default: `uv run pytest --cov` with `[tool.coverage.run] branch = true` and a `fail_under` threshold, and `filterwarnings = ["error"]` in `[tool.pytest]`. Use the CI matrix for versions, and add tox or nox only when the same matrix must run locally.

### Gaps

- I did not read the Vitest 5 release notes or migration guide directly; the details above come from search snippets.
- I did not verify the current status of coverage in `node:test` (`--experimental-test-coverage`).

## Dependency and licence audit

### Takeaway

**TypeScript/JavaScript:** `pnpm audit` or `npm audit` for advisories, `pnpm licenses list` or license-checker-rseidelsohn for licences. The original `license-checker` has not been updated since 2019.

**Python:** `uv audit`, added in June 2026 and still experimental, or pip-audit 2.10 for advisories, and pip-licenses for licences.

**Both stacks:** OSV-Scanner v2.6 reads every major JS and Python lockfile. GitHub's `dependency-review-action` with `allow-licenses` gates licences on pull requests.

### Cited Findings

#### Cross-stack

- OSV-Scanner: latest v2.6.0 (2026-09-14) ([google/osv-scanner](https://github.com/google/osv-scanner/releases)). It supports the lockfiles listed in the package-management section, and its docs have a "License Scanning" section — [OSV-Scanner docs](https://google.github.io/osv-scanner/supported-languages-and-lockfiles/)
- `actions/dependency-review-action` (latest v5.0.0, 2026-05-08) takes `allow-licenses` with SPDX identifiers and fails pull requests that add dependencies under other licences. `deny-licenses` "is deprecated for possible removal in the next major release", and `allow-licenses`/`deny-licenses` cannot be combined — [dependency-review-action README](https://github.com/actions/dependency-review-action)

#### TypeScript/JavaScript

- `pnpm audit` checks installed packages for known issues and can fix them with `pnpm audit --fix` or with `overrides` in `pnpm-workspace.yaml`. Since v11 it queries the registry's bulk advisory endpoint and filters by GHSA ID, not CVE: `auditConfig.ignoreCves` is replaced by `audit.ignore` with GHSA IDs — [pnpm audit docs](https://pnpm.io/cli/audit)
- `pnpm licenses list` lists installed packages' licences; since v12.7.0 it lists only the current workspace project unless given `-r` or `--filter` — [pnpm licenses docs](https://pnpm.io/cli/licenses)
- `license-checker` latest is 25.0.1, from 2019-01-10. `license-checker-rseidelsohn` latest is 5.0.1 (2026-05-27), and `@quantco/pnpm-licenses` is at 2.4.2 (2026-06-16) — npm registry, [license-checker-rseidelsohn](https://www.npmjs.com/package/license-checker-rseidelsohn)
- `knip` (unused dependencies, files and exports) is actively released: 6.41.0 on 2026-10-09 — [npm knip](https://www.npmjs.com/package/knip)

#### Python

- On 2026-06-08 Astral announced `uv audit`, which checks locked dependencies against OSV for "known vulnerabilities and 'adverse' project statuses (such as being deprecated)", and is "4x and 10x faster" than pip-audit on typical projects. Both `uv audit` and the malware check are "in preview for now" and "considered unstable". The malware check is opt-in (`UV_MALWARE_CHECK=1`) and stops a sync "before the malicious code has a chance to run" — [Astral blog: uv audit](https://astral.sh/blog/uv-audit)
- `uv audit --help` in uv 0.11.18, run locally, shows these options: `--locked`, `--frozen`, `--no-dev`, `--only-group`, `--ignore <ID>`, `--ignore-until-fixed <ID>`, `--output-format text|json`, `--script`, `--python-version` and `--python-platform`. Running it prints "`uv audit` is experimental and may change without warning. Pass `--preview-features audit` to disable this warning."
- A reported bug in `uv audit`: it can report "no known vulnerabilities" and exit 0 when the OSV batch response has fewer results than queries — [astral-sh/uv#22102](https://github.com/astral-sh/uv/issues/22102)
- pip-audit: latest v2.10.1 (2026-06-10) — [pypa/pip-audit](https://github.com/pypa/pip-audit/releases)
- pip-licenses: 5.5.5 (2026-03-28) — [PyPI pip-licenses](https://pypi.org/project/pip-licenses/). liccheck's last release is 0.9.2, from 2023-09-22 — [PyPI liccheck](https://pypi.org/project/liccheck/)

### Inferences

**Cross-stack:**

- Run advisory audits on a schedule (and on lockfile changes), not as a blocking step on every pull request. A new advisory should not fail an unrelated agent PR.
- Use `dependency-review-action` with `allow-licenses` as the pull-request licence gate on both stacks. It works only for public repositories or ones with GitHub Advanced Security, which I did not verify here.
- OSV-Scanner is one tool that covers both stacks and suits a multi-stack greenrepo profile.

**TypeScript/JavaScript:**

- Default: `pnpm audit --prod` on a schedule, with `pnpm licenses list --json` or the dependency-review licence gate.

**Python:**

- Default: `uv audit --locked --preview-features audit` once the maintainer accepts that it is a preview feature. Otherwise use `uvx pip-audit` against an exported requirements file, or `osv-scanner` on `uv.lock`.

### Gaps

- I did not confirm whether `uv audit` is still experimental in uv 0.13.0; it was in 0.11.18.
- I did not fetch OSV-Scanner's licence-scanning flags or its allowlist syntax.
- I did not verify that `dependency-review-action` works on private repositories without GitHub Advanced Security.

## Building and publishing

### Takeaway

**TypeScript/JavaScript:** ESM-only packages are now practical, because `require(esm)` works without a flag on Node 20.19+, 22.12+ and 23+ and is non-experimental since 25.4. Use an `exports` map with `types` conditions and `files: ["dist"]`, and check the package with publint and arethetypeswrong. Libraries emit with `tsc` or bundle with tsdown; apps use Vite. Publish with npm trusted publishing (OIDC, npm ≥ 11.5.1, provenance automatic). Classic npm tokens were revoked on 2025-12-09.

**Python:** `pyproject.toml` with `uv_build` for pure-Python code (the `uv init` default), hatchling when you need build hooks, maturin or setuptools for extensions. Use PEP 639 `license` expressions and `license-files`. Publish through PyPI trusted publishing, either with `pypa/gh-action-pypi-publish`, which generates attestations automatically, or with `uv publish`.

### Cited Findings

#### TypeScript/JavaScript

- Node history for `require()` of ES modules: "no longer behind the `--experimental-require-module` CLI flag" in v23.0.0, v22.12.0 and v20.19.0, and "no longer experimental" in v25.4.0. It throws `ERR_REQUIRE_ASYNC_MODULE` if the graph has top-level `await`. An ES module can choose what CommonJS callers receive with `export { x as 'module.exports' }` — [Node.js docs: modules](https://nodejs.org/api/modules.html#loading-ecmascript-modules-using-require)
- Vite's published package is ESM-only (`"type": "module"`, an `exports` map pointing at `.js` files and `./package.json`). It declares `"engines": {"node": "^20.19.0 || >=22.12.0"}` and `"files": [...]` — [vite packages/vite/package.json](https://github.com/vitejs/vite/blob/main/packages/vite/package.json)
- Starlight builds with `tsdown`, checks with `publint` and `size-limit`, and publishes through `publishConfig.exports` entries of the form `{"types": "./dist/x.d.ts", "import": "./dist/x.js"}` with `"files": ["dist"]` — [starlight package.json](https://github.com/withastro/starlight/blob/main/package.json), [starlight packages/starlight/package.json](https://github.com/withastro/starlight/blob/main/packages/starlight/package.json)
- Library tool versions: tsdown 0.23.0 (2026-09-03), publint 0.3.25 (2026-10-01), `@arethetypeswrong/cli` 0.18.5 (2026-07-09). tsup's last release is 8.5.1 (2025-11-12) and unbuild's is 3.6.1 (2025-08-15) — npm registry ([tsdown](https://www.npmjs.com/package/tsdown), [publint](https://www.npmjs.com/package/publint))
- Rolldown 1.0 "hit stable on May 7, 2026", and Vite 8 uses Oxc for transforms and minification — [VoidZero recap](https://voidzero.dev/posts/whats-new-feb-2026) (search snippet, secondary)
- npm trusted publishing needs npm CLI 11.5.1 or later, Node 22.14.0 or later, and `id-token: write`. It works with GitHub Actions (GitHub-hosted runners), GitLab.com shared runners and CircleCI cloud, but not self-hosted runners. A package can have up to 10 trusted publishers, and once a connection is created its fields cannot change. "npm automatically generates and publishes provenance attestations … you don't need to add the `--provenance` flag", but only for public packages from public repositories. After setting it up, npm recommends "Require two-factor authentication and disallow tokens" — [npm docs: trusted publishers](https://docs.npmjs.com/trusted-publishers). npm 11.5.1 was published on 2025-07-24 — [npm registry](https://www.npmjs.com/package/npm)
- On 2025-12-09 all npm classic tokens were permanently revoked. `npm login` now gives 2-hour session tokens, granular write tokens last at most 90 days, and 2FA enforcement is the default for new packages — [GitHub changelog](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)
- Vite's publish job uses `environment: Release`, `id-token: write` and `contents: write`, and runs `npm i -g npm@^11.5.2` with the comment "npm 11.5.2+ is required for trusted publishing" before its publish script — [vite publish.yml](https://github.com/vitejs/vite/blob/main/.github/workflows/publish.yml). Biome's JS API release job runs on `ubuntu-24.04` ("Must be a GitHub hosted runner for provenance") with `environment: npm-publish` and `id-token: write`, then `npm publish … --access public` — [biome release_js_api.yml](https://github.com/biomejs/biome/blob/main/.github/workflows/release_js_api.yml)
- `actions/setup-node` v7 "removed the dummy `NODE_AUTH_TOKEN` fallback", and "npm Trusted Publishing (OIDC) is not affected" — [setup-node README](https://github.com/actions/setup-node)
- Starlight and Biome version and publish with Changesets (`@changesets/cli` 3.0.x and `changesets/action`) — [starlight release.yml](https://github.com/withastro/starlight/blob/main/.github/workflows/release.yml), [biome package.json](https://github.com/biomejs/biome/blob/main/package.json)

#### Python

- `uv_build` is "production-ready and used by default when you run `uv init`". The recommended configuration is `requires = ["uv_build>=0.13.0,<0.14"]`, `build-backend = "uv_build"`. It "only supports pure Python code", expects a `src/` layout by default (configurable through `module-name` and `module-root`), and points to hatchling for "build scripts or a more flexible project layout", maturin for Rust and setuptools for C/C++ — [uv docs: build backend](https://docs.astral.sh/uv/concepts/build-backend/). uv 0.13.0 has "no breaking changes to the configuration of the uv build backend", but upper bounds must be raised to `<0.14` — [uv 0.13.0 release](https://github.com/astral-sh/uv/releases/tag/0.13.0)
- Backend versions: hatchling 1.32.4 (2026-09-20), setuptools 84.0.0 (2026-08-08), flit-core 4.1.0, pdm-backend 2.5.0, poetry-core 2.5.0, build 1.6.1, twine 7.0.0 (2026-07-27) — PyPI JSON ([hatchling](https://pypi.org/project/hatchling/), [setuptools](https://pypi.org/project/setuptools/))
- PEP 639 licence metadata in use: pydantic has `license = 'MIT'` and `license-files = ['LICENSE']` ([pydantic pyproject.toml](https://github.com/pydantic/pydantic/blob/main/pyproject.toml)); uv has `license="MIT OR Apache-2.0"` with `license-files` ([uv pyproject.toml](https://github.com/astral-sh/uv/blob/main/pyproject.toml)); httpx has `license = "BSD-3-Clause"` ([httpx pyproject.toml](https://github.com/encode/httpx/blob/master/pyproject.toml)). pydantic and httpx build with hatchling plus `hatch-fancy-pypi-readme`.
- The PyPA guide's workflow has three jobs. A build job (`python3 -m build`, then upload `dist/` as an artifact) feeds a `publish-to-pypi` job (`if: startsWith(github.ref, 'refs/tags/')`, `environment: pypi`, `permissions: id-token: write`, `pypa/gh-action-pypi-publish@release/v1`) and an optional TestPyPI job. It recommends trusted publishing over API tokens and manual approval for the PyPI environment, and notes that attestations are generated automatically for each distribution — [PyPA guide: publishing with GitHub Actions](https://packaging.python.org/en/latest/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/). `pypa/gh-action-pypi-publish` latest is v1.14.2 (2026-07-29) — [releases](https://github.com/pypa/gh-action-pypi-publish/releases)
- Trusted publishing exchanges short-lived OIDC identity tokens, which "expire automatically" (15 minutes), for PyPI upload rights — [PyPI docs: trusted publishers](https://docs.pypi.org/trusted-publishers/)
- uv's guide uses separate build and publish jobs, with `id-token: write` and `uv publish` in the publish job, and no credentials needed under trusted publishing — [uv docs: GitHub integration](https://docs.astral.sh/uv/guides/integration/github/). uv publishes itself with `uv publish -v wheels_uv/*`, `environment: release` and `id-token: write`, and pins setup-uv with an explicit uv `version` and `checksum` — [uv publish-pypi.yml](https://github.com/astral-sh/uv/blob/main/.github/workflows/publish-pypi.yml)
- pydantic attests build provenance with `actions/attest@v4.2.2` and `attestations: write` on its build jobs, verifies the attestation in the release job, and runs `twine check --strict` on built distributions — [pydantic ci.yml](https://github.com/pydantic/pydantic/blob/main/.github/workflows/ci.yml)
- A counterexample: httpx still publishes with `TWINE_USERNAME: __token__` and `TWINE_PASSWORD: ${{ secrets.PYPI_TOKEN }}`, and uses tag-pinned `actions/checkout@v4` — [httpx publish.yml](https://github.com/encode/httpx/blob/master/.github/workflows/publish.yml)

### Inferences

**TypeScript/JavaScript:**

- Default for a library: ESM-only, `"type": "module"`, an `exports` map with `types` and `default`/`import` conditions plus `./package.json`, `files: ["dist"]`, and `engines.node >= 22.12`. Emit with `tsc` (unbundled, simplest, fast on TS 7) or bundle with tsdown when you need several entry points or a dual format. Check with `publint` and `attw --pack` before release.
- Default for an app: Vite, with Rolldown under the hood.
- Publish with npm trusted publishing from a protected environment on a GitHub-hosted runner, then set "disallow tokens" on the package. Keep `npm publish` as the step that runs at publish time, even in pnpm repos, as Biome and Vite do.

**Python:**

- Default: `uv_build` for pure Python, `uv build` in CI, and a protected `pypi` environment. Publish with `pypa/gh-action-pypi-publish` if you want PEP 740 attestations without extra work, or with `uv publish` for a pure-uv workflow.
- Replace token secrets (the httpx pattern) with trusted publishing, as a greenrepo "must".

### Gaps

- I did not verify whether `pnpm publish` (native since v11) supports npm OIDC trusted publishing and automatic provenance. The reference repos call `npm publish` or changesets.
- I did not verify whether `uv publish` creates or uploads PEP 740 attestations by itself.
- I did not fetch the PyPI documentation on "pending" trusted publishers (for creating a new project) or on attestations, because the fetched trusted-publishers page summary omitted them.
- I did not verify whether tsdown can generate `.d.ts` with TS 7, which has no API; Starlight uses it with TS 6.

## Example GitHub Actions jobs with caching

### Takeaway

The reference repos share one baseline. Actions are pinned to a commit SHA with a version comment. The workflow starts from `permissions: {}`, and each job grants what it needs. Checkout uses `persist-credentials: false`. Concurrency cancels superseded runs. The language-native action handles caching: `setup-node` with `cache: pnpm` (or `pnpm/setup` with `cache: true`), and `setup-uv`, whose cache is on automatically except on release and tag events. Publishing is a separate job with `id-token: write` and a protected environment.

### Cited Findings

- Current action versions: actions/checkout v7.0.1 (2026-07-20), actions/setup-node v7.1.0 (2026-10-08), actions/setup-python v7.0.0 (2026-07-20), actions/cache v6.1.0, pnpm/action-setup v6.1.0 (2026-09-05), pnpm/setup v3.0.0 (2026-09-20), astral-sh/setup-uv v10.3.0 (2026-10-09), actions/attest v4.2.2, zizmor v1.30.1 — GitHub releases API ([actions/checkout](https://github.com/actions/checkout/releases), [astral-sh/setup-uv](https://github.com/astral-sh/setup-uv/releases))
- setup-node v5 moved to the node24 runtime and turned caching on by default. Since v6, caching is automatic only for npm; pnpm and Yarn need `cache:`. Turn automatic caching off (`package-manager-cache: false`) for privileged workflows — [setup-node README](https://github.com/actions/setup-node)
- setup-uv's `enable-cache` defaults to `"auto"`: "enabled on GitHub-hosted runners except for release, tag push, pull_request_target, and workflow_run events; disabled on self-hosted runners". The cache key uses `pyproject.toml`, `uv.lock` and requirements files, and `prune-cache` is available — [setup-uv README](https://github.com/astral-sh/setup-uv)
- pnpm/setup v3 installs pnpm and the runtime in one step, uses `cache: true` for the store, runs `pnpm install` automatically, and with `require-lockfile: true` runs `pnpm install --frozen-lockfile` — [pnpm/setup README](https://github.com/pnpm/setup). Vite uses it with `runtime: node@${{ matrix.node_version }}` and `cache: true` — [vite ci.yml](https://github.com/vitejs/vite/blob/main/.github/workflows/ci.yml)
- Starlight uses `pnpm/action-setup` followed by `actions/setup-node` with `cache: 'pnpm'`, and `pnpm i` — [starlight ci.yml](https://github.com/withastro/starlight/blob/main/.github/workflows/ci.yml)
- Hardening seen in practice: workflow-level `permissions: {}` in Vite, Starlight and Vite's publish workflow; `persist-credentials: false` in Vite and Starlight; a zizmor workflow in Vite and in uv (`check-zizmor.yml`); a zizmor pre-commit hook in pydantic, with `# zizmor: ignore[cache-poisoning]` comments where caching is enabled on non-release jobs — [vite workflows](https://github.com/vitejs/vite/tree/main/.github/workflows), [pydantic ci.yml](https://github.com/pydantic/pydantic/blob/main/.github/workflows/ci.yml)
- The commit SHAs below were copied from the reference repos' workflows on 2026-10-10: checkout v7.0.1 `3d3c42e5…` (Vite, Biome, pydantic); setup-node v7.0.0 `82076278…` and pnpm/action-setup v6.1.0 `ea17c68d…` (Biome); setup-uv v10.2.0 `c18668ad…` (pydantic, uv); upload-artifact v7.0.1 `043fb46d…` and download-artifact v8.0.1 `3e5f45b2…` (Biome, pydantic, uv).

#### Example: TypeScript/JavaScript CI (pnpm, Biome, TS, Vitest)

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
permissions: {}
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        node: [22, 24, 26]
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # v6.1.0 (reads packageManager)
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec biome ci .          # format + lint, no writes
      - run: pnpm exec tsc --noEmit        # TS 7 (or TS 6 if typescript-eslint/framework tools need the API)
      - run: pnpm exec vitest run --coverage
      - run: pnpm run build
      - run: pnpm exec publint && pnpm exec attw --pack .   # libraries only
```

#### Example: TypeScript/JavaScript publish job (npm trusted publishing)

```yaml
  # Same workflow as above, with `tags: ['v*']` added under `on.push`.
  publish:
    if: startsWith(github.ref, 'refs/tags/v')
    needs: check
    runs-on: ubuntu-latest            # GitHub-hosted runner required for trusted publishing
    environment: npm                  # protected environment, required reviewer optional
    permissions:
      contents: read
      id-token: write                 # OIDC for trusted publishing; provenance is automatic
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # v6.1.0
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org
          package-manager-cache: false   # no cache in the privileged job
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: npm install -g npm@^11.5.1 && npm publish --access public
```

#### Example: Python CI (uv, Ruff, type checker, pytest)

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
permissions: {}
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
env:
  UV_LOCKED: "1"                       # fail if uv.lock is out of date
jobs:
  check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        python: ["3.11", "3.12", "3.13", "3.14", "3.15"]
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: astral-sh/setup-uv@c18668ad3cf93ea998bef934396af7bb5c839dc7 # v10.2.0
        with:
          python-version: ${{ matrix.python }}   # sets UV_PYTHON; cache is "auto" (on for PRs/pushes)
      - run: uv sync --all-extras
      - run: uv run ruff format --check
      - run: uv run ruff check
      - run: uv run pyright                       # or: uv run mypy . / uv run ty check
      - run: uv run pytest --cov --cov-report=xml
      - run: uv build
```

#### Example: Python publish jobs (PyPI trusted publishing)

```yaml
  build:
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: astral-sh/setup-uv@c18668ad3cf93ea998bef934396af7bb5c839dc7 # v10.2.0
      - run: uv build                    # cache auto-disabled on tag events
      - uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: dist
          path: dist/
  publish:
    needs: build
    runs-on: ubuntu-latest
    environment: pypi                  # protected environment matching the PyPI trusted publisher
    permissions:
      id-token: write
    steps:
      - uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1
        with:
          name: dist
          path: dist/
      - uses: pypa/gh-action-pypi-publish@release/v1   # pin to a v1.14.x SHA; attestations generated automatically
```

### Inferences

- Run scheduled jobs separately from PR CI: dependency audit, OSV-Scanner and zizmor on a cron or on lockfile and workflow changes.
- Keep publish jobs cache-free. setup-uv already skips the cache on tag events, and setup-node needs `package-manager-cache: false` set by hand. This avoids cache poisoning.
- For a pnpm repo, `pnpm/setup@v3` (pnpm plus runtime plus cache plus install in one step) is a newer, shorter alternative to `pnpm/action-setup` with `setup-node`. It requires pnpm 11 or later.

### Gaps

- I did not look up a SHA for `pypa/gh-action-pypi-publish` v1.14.2 or for setup-node v7.1.0. The SHAs above were copied from reference repos and should be checked before greenrepo publishes them.
- I did not check whether `pnpm install --frozen-lockfile` behaves differently in pnpm 12 (see the package-management gaps).

## Monorepo notes and pre-commit hooks

### Takeaway

**Monorepos:** pnpm workspaces (`pnpm-workspace.yaml`) with Changesets is the observed JS standard (Vite, Starlight, Biome). uv workspaces (`[tool.uv.workspace]`) are the Python equivalent (pydantic).

**Hooks:** JS repos use simple-git-hooks or husky with lint-staged, or lefthook. Python repos use pre-commit, or its Rust reimplementation prek (pre-1.0, adopted by CPython, Airflow, FastAPI and Ruff according to secondary sources). Hooks should call the same pinned tools as CI (`pnpm exec …`, `uv run …`).

### Cited Findings

#### TypeScript/JavaScript

- Vite, Starlight and Biome have a root `pnpm-workspace.yaml`. Starlight and Biome use Changesets (`@changesets/cli` 3.0.x, `changesets/action`), and Starlight filters with `pnpm --filter '@astrojs/*' build` — [starlight package.json](https://github.com/withastro/starlight/blob/main/package.json), [biome package.json](https://github.com/biomejs/biome/blob/main/package.json). Changesets latest: 3.0.3 (2026-09-14) — [changesets/changesets](https://github.com/changesets/changesets/releases)
- ESLint 10's per-file config lookup "can be particularly useful in monorepo setups" — [ESLint v10.0.0 released](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/)
- Oxlint type-aware linting in monorepos needs dependent packages built first — [Oxlint type-aware docs](https://oxc.rs/docs/guide/usage/linter/type-aware.html)
- Vite's hooks: `"postinstall": "simple-git-hooks"` with `"pre-commit": "pnpm exec lint-staged --concurrent false"`. lint-staged runs `oxfmt` on all staged files and `eslint --cache --fix` on TS sources — [vite package.json](https://github.com/vitejs/vite/blob/main/package.json)
- Hook tool versions: simple-git-hooks 2.14.0 (2026-08-28), lint-staged v17.6.0 (2026-09-26), lefthook v2.2.1 (2026-10-08), husky v9.1.7 (last release 2024-11-18) — GitHub releases API ([evilmartians/lefthook](https://github.com/evilmartians/lefthook/releases), [typicode/husky](https://github.com/typicode/husky/releases))

#### Python

- pydantic declares `[tool.uv.workspace]` and `[tool.uv.sources]` and syncs with `--all-packages` — [pydantic pyproject.toml](https://github.com/pydantic/pydantic/blob/main/pyproject.toml), [pydantic Makefile](https://github.com/pydantic/pydantic/blob/main/Makefile)
- pydantic's `.pre-commit-config.yaml` uses `pre-commit-hooks` v6.0.0 (`no-commit-to-branch`, `check-yaml`, `check-toml`, end-of-file and trailing-whitespace fixers), codespell, markdownlint-cli2, yamlfmt and zizmor, plus `local` hooks with `language: system` that call `make lint-python` and `uv run pyright pydantic`. It installs them with `uv run pre-commit install --install-hooks`, and CI runs `pre-commit/action` — [pydantic .pre-commit-config.yaml](https://github.com/pydantic/pydantic/blob/main/.pre-commit-config.yaml), [pydantic Makefile](https://github.com/pydantic/pydantic/blob/main/Makefile)
- pre-commit latest is v4.6.2 (2026-08-10), but `pre-commit/action` is still v3.0.1 from 2024-02-07 ([pre-commit/pre-commit](https://github.com/pre-commit/pre-commit/releases), [pre-commit/action](https://github.com/pre-commit/action/releases)). prek latest is v0.5.5 (2026-10-05), first published 2025-08-20 — [j178/prek](https://github.com/j178/prek/releases)
- prek is a Rust reimplementation of pre-commit that works with existing `.pre-commit-config.yaml` files. It is "pre-1.0, with roughly weekly releases and several breaking ones (including 0.5.0)", and reportedly used by CPython, Apache Airflow, FastAPI and astral-sh/ruff — [search summary citing prek adoption](https://arifsolmaz.github.io/repo/2026/02/13/prek/) (secondary)

### Inferences

**Monorepos:**

- A solo maintainer rarely needs Turborepo or Nx. `pnpm -r` and `--filter` with Changesets, or `uv sync --all-packages`, are enough.

**Hooks:**

- Hooks are a fast, local subset of CI (format and lint of staged files). They are not the gate, because agents can bypass them (`--no-verify`) and CI must re-run everything.
- For multi-stack repos, lefthook (a single Go binary) and prek (a single Rust binary, pre-commit config format) avoid a Node or Python dependency just to run hooks. husky has had no release since November 2024.
- `local` hooks with `language: system` that call `uv run` or `pnpm exec` keep the tool versions in the project's own lockfile, so the hook config and the dependency pins cannot drift apart.

### Gaps

- I did not verify prek's adopters from primary sources, for example the CPython or Ruff repos.
- I did not research Nx or Turborepo, since they are probably out of scope for a solo maintainer.

## Recommended default profiles (synthesis)

### Takeaway

The two defaults below are built from the cited findings above. Each sub-heading summarises one stack's default profile for greenrepo, with its alternatives.

### Cited Findings

- Every element below is sourced in the sections above. These snippets apply those sources; they are not new claims. Version floors use the latest releases as of 2026-10-10.

#### TypeScript/JavaScript default

**Pinning and packages.** Pin pnpm with `"packageManager": "pnpm@12.x"` (or 11.x) and pin Node with `.node-version` (24 or 26) or `devEngines.runtime`. Declare `engines.node: ">=22.12"` for consumers. Commit `pnpm-lock.yaml` and `pnpm-workspace.yaml`, keeping `minimumReleaseAge` and `allowBuilds` at their defaults.

**Quality checks.** Biome 2.x formats and lints (`biome ci`). TypeScript 7 runs `tsc --noEmit`, or 6.0 when typescript-eslint or a framework checker needs the API. Vitest 5 with coverage-v8 runs the tests.

**Audit, build and publish.** Run `pnpm audit` on a schedule and gate licences with `dependency-review-action`. Libraries emit ESM-only with `tsc` or tsdown and are checked with publint and attw. Publish with npm trusted publishing (provenance is automatic) and disallow tokens on the package.

**Hooks and versions.** Use simple-git-hooks or lefthook with lint-staged. Release with Changesets if you want changelogs.

**Alternatives.** npm instead of pnpm. ESLint 10 with typescript-eslint and Prettier or Oxfmt instead of Biome. Oxlint for speed. `node:test` for zero-dependency packages. Bun or Deno as a runtime, with their own built-in tooling.

```json
{
  "type": "module",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
               "./package.json": "./package.json" },
  "files": ["dist"],
  "engines": { "node": ">=22.12" },
  "packageManager": "pnpm@12.10.1",
  "scripts": {
    "check": "biome ci .", "fix": "biome check --write .", "typecheck": "tsc --noEmit",
    "test": "vitest run --coverage", "build": "tsc -p tsconfig.build.json"
  }
}
```

#### Python default

**Pinning and packages.** Commit `.python-version` (3.14 or 3.15) and set `requires-python = ">=3.11"`. uv manages interpreters. Commit `uv.lock`, keep dev tools in `[dependency-groups]`, and run CI with `--locked`.

**Quality checks.** Ruff formats and lints with the version pinned. pyright or mypy 2.x is the strict type gate, with ty optional. pytest 9 runs the tests with `[tool.pytest]` config, and coverage.py (through pytest-cov) adds `branch = true` and `fail_under`. CI runs a 3.11 to 3.15 matrix with setup-uv.

**Audit, build and publish.** Use `uv audit` (preview) or pip-audit, plus pip-licenses or the dependency-review licence gate. Build with `uv_build` for pure Python (hatchling if you need hooks, maturin for Rust), using PEP 639 `license` and `license-files`. Publish through PyPI trusted publishing with `pypa/gh-action-pypi-publish`, which handles attestations automatically, or with `uv publish`, from a protected environment.

**Hooks.** pre-commit or prek, with `local` hooks calling `uv run`.

**Alternatives.** Poetry, PDM or pip-tools instead of uv. mypy or pyright instead of each other. tox with tox-uv, or nox, for local matrices. setuptools for C extensions.

```toml
[project]
name = "example"
version = "0.1.0"
requires-python = ">=3.11"
license = "MIT"
license-files = ["LICENSE"]
dependencies = []

[dependency-groups]
dev = ["pytest>=9.1", "pytest-cov>=7.1", "ruff>=0.17", "pyright>=1.1.414"]

[build-system]
requires = ["uv_build>=0.13.0,<0.14"]
build-backend = "uv_build"

[tool.pytest]
testpaths = ["tests"]
addopts = ["--strict-markers"]
filterwarnings = ["error"]

[tool.coverage.run]
branch = true
source = ["example"]

[tool.coverage.report]
show_missing = true
fail_under = 90
```

### Inferences

**AI coding agents:**

- Both defaults favour single-binary, fast tools (Biome, tsc 7, uv, Ruff). Agents run the checks many times per task, so speed matters directly.
- Each repo should expose one command an agent can run, such as `pnpm check` or `uv run …`, or a `just`/`make` target, and AGENTS.md should name it.

**Version churn:**

- Several pieces are fresh or pre-1.0 in October 2026: pnpm 12 (six weeks old), TS 7 (no API yet), Oxfmt 0.x, uv 0.x, Ruff 0.x, ty 0.0.x, prek 0.x and `uv audit` (preview). greenrepo should name a tool category with a default, not hard-require a specific tool.
- greenrepo should also expect a re-check every six months. Node's annual cycle (Node 27 in April 2027) and Python's October releases make spring and autumn natural review points.

### Gaps

- The `fail_under = 90` coverage threshold and the 3.11 floor are judgement calls, not sourced norms.
- `[tool.uv] required-version` (for pinning uv itself) was not verified against the uv docs, so it is not included above. setup-uv reads the uv version from `pyproject.toml` and `uv.toml`, according to its README.
