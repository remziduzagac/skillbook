---
status: current
created: "2026-10-18"
---

# Research: how other projects distribute, switch and serve agent skills

How other projects get skills into agent harnesses, turn single skills on and off, serve them on demand and refer from one skill to another, read for the manager CLI idea in [../ideas/open.md](../ideas/open.md) (D185) and for the install routes of [install-routes.md](install-routes.md). Researched on 2026-10-18 by a research agent through web searches and page fetches (GitHub READMEs, the GitHub API for stars and last push, vendor documentation, issue pages). Nothing was installed or run. Page text was treated as data.

## How to read this file

- **Provenance:** *read*, seen on a named page; *inferred*, from a search snippet, a third party's summary, or reasoning. Star counts, creation dates and last pushes are from the GitHub API on 2026-10-18 unless stated.
- **Checked:** the research agent's claims were not verified when it wrote them. On 2026-10-18 five were checked against their sources by fetching the pages, and each is marked *checked* with the date and the page where it appears below; every claim not so marked is unchecked. The five: Claude Code ignores `skillOverrides` for plugin skills, and per-skill disabling inside a plugin is an open request; the open Claude Code issue that the skill list is not sent again after automatic compaction; the Skills-over-MCP extension is final and few clients implement it; Claude Code re-attaches skills after compaction within a token budget; and Codex's skill list budget with its per-skill `enabled = false` setting.
- **Checked, one correction:** the research agent wrote that the extension targets protocol revision 2026-07-28; the SEP mentions that revision only for the list-caching attributes of `skills/list`.

## Summary

- **Most projects are CLI writers, and they all converge on the same layout.** One canonical store (`~/.agents/skills`, `.agents/skills`, `~/.skill-manager`, a hub folder) plus symlinks (copy as fallback) into each harness's native skill folder: Vercel `skills`, dotagents (Sentry), skillshare, Skills-Manager, mode-io skill-manager, skills-npm, Tessl, `gh skill`. Ruler and rulesync generate or copy files instead of linking. This is the manager CLI of the CLI idea in [../ideas/open.md](../ideas/open.md), and it is the dominant, best-tested shape. *read*
- **Per-skill on/off is mostly done by adding or removing a link, not by a flag.** `skm enable/disable <skill> --for <tool>` removes the symlink; mode-io disables a harness binding and keeps the package; dotagents adds an `exclude` entry; abubakarsiddik31 moves skills to a `.disabled/` folder (that one is *inferred*). Harnesses also have their own switches: Claude Code `skillOverrides` (on, name-only, user-invocable-only, off) and `disable-model-invocation`; Codex `[[skills.config]] enabled=false` keyed by SKILL.md path. *read*, *checked* 2026-10-18 for the Codex setting (<https://learn.chatgpt.com/docs/build-skills>). Important gap: Claude Code's `skillOverrides` is ignored for plugin skills, and per-skill disabling inside a plugin is an open request (#98220, #14920), so plain plugins cannot give per-skill off today. *read*, *checked* 2026-10-18: Claude Code's skills page says "Plugin skills are not affected by `skillOverrides`. Manage those through `/plugin` instead." (<https://code.claude.com/docs/en/skills>); #98220, "Let `skillOverrides` disable individual plugin skills", is open, opened 2026-09-29, and says a `plugin:skill` entry is silently ignored (<https://github.com/anthropics/claude-code/issues/98220>); #14920, "Add ability to disable individual Claude plugin skills", is open, opened 2025-12-20, last comment 2026-10-05 (<https://github.com/anthropics/claude-code/issues/14920>).
- **Nobody solves nesting well; the field flattens.** Claude Code does not scan below the top level of a skills folder (several issues, plus a documented lazy load of nested `.claude/skills/` only when files in that subtree are touched). Vercel `skills` walks three levels but a shallower SKILL.md shadows deeper ones; skills-npm and openskills treat every skill as flat. The MCP Skills extension (SEP-2640, Final) is the only spec that allows nested skills, and it says a nested SKILL.md read as a supporting file is plain markdown and activating it needs fresh user consent. Superpowers keeps a flat namespace. *read*; *checked* 2026-10-18 that SEP-2640 is Final (<https://modelcontextprotocol.io/seps/2640-skills-extension>).
- **Cross-package references are unsolved at the skill level; only package-level dependencies exist.** Claude Code plugins have `dependencies` with semver ranges and cross-marketplace allowlists, but a skill still names another only by prose ("REQUIRED SUB-SKILL: superpowers:test-driven-development"). Tessl and skills-npm resolve packages and name collisions (direct beats transitive), not links between skills. Within one skill, the Agent Skills spec says references are relative paths, one level deep. *read*
- **The listing budget is real and tightening, and every harness has its own number.** Codex: 2% of the context window, 8,000 characters when the window is unknown, overridable with `skills.max_context_tokens` up to 10,000 tokens, shortens descriptions first then drops whole skills. Claude Code: 1% of the context window (`skillListingBudgetFraction`), every name always listed, descriptions dropped starting with the least-invoked, each description capped at 1,536 characters, `SLASH_COMMAND_TOOL_CHAR_BUDGET` as a fixed override. The 8,000-character Codex figure is documented as the fallback, not the usual value (about 5,440 characters on a 272K window, per a third-party blog *inferred*). *read* for the vendor docs; *checked* 2026-10-18: Codex's 2%, 8,000 characters and `skills.max_context_tokens` up to 10,000 tokens (<https://learn.chatgpt.com/docs/build-skills>), Claude Code's 1% and 1,536 characters (<https://code.claude.com/docs/en/skills>, "Skill descriptions are cut short").
- **Fits a manager CLI that writes skill files.** Real per-skill on/off, multi-harness output, hidden nested skills in a folder no harness scans, and no listing cost for hidden skills (a disabled skill costs no budget in Codex). The proven pattern is canonical store plus symlinks, with copy fallback because Windows symlinks and Cursor symlink discovery have both broken in practice (Cursor staff confirmed a symlink-discovery bug fixed in 2.5, with later regressions reported). Risks: you ship and maintain a CLI, installs happen outside any harness's trust and update path, and users must run a second tool. *read*
- **Fits a tool the plugin provides, such as an MCP server.** An MCP server removes the listing problem for the hidden skills (`list`/`read`/`search` served on demand), works in any MCP-capable harness, and the official Skills-over-MCP extension is Final. But no major CLI harness supports the extension yet: the client matrix lists only ChatGPT, fast-agent and MCP Inspector as partial, and mcpc as full; Claude Code, Codex and Cursor are absent. Existing MCP skill servers are small (3 to 400 stars, two unmaintained or proprietary). Every server in the field needs an agent instruction ("master skill") installed to use it reliably. *read*; the client matrix was *checked* 2026-10-18 (<https://modelcontextprotocol.io/extensions/client-matrix>): the Skills column marks mcpc as supported, ChatGPT, fast-agent and MCP Inspector as partial, and lists neither Claude Code nor Codex.
- **MCP-served text is ordinary tool output to the harness; skills get special treatment.** Claude Code keeps an invoked skill in context, dedupes identical re-invocations, and on compaction re-attaches the most recent invocation of each skill (first 5,000 tokens each, 25,000 tokens combined). A SKILL.md read with the file Read tool or an MCP tool gets none of that; older tool outputs are cleared first at compaction. MCP results over 25,000 tokens (default) or 50,000 characters are written to a file and the agent gets a path. The MCP spec tells hosts to treat served skills as untrusted input, tag their origin and gate activation. *read* that skills get re-attached and tool results get cleared, the re-attaching *checked* 2026-10-18 (<https://code.claude.com/docs/en/skills>, "Skill content lifecycle": the first 5,000 tokens of the most recent invocation of each skill, 25,000 tokens combined, newest first, older skills can drop entirely); the claim that file-read skills lose protection is *inferred*.
- **Main risks for a decision.** (1) Plugin-only distribution gives no per-skill off in Claude Code and an unknown path-keyed workaround in Codex. (2) A CLI writer fights harness-specific bugs (symlinks, Windows, Cursor) and the listing budget still applies to anything it enables. (3) An MCP route has little harness support today and loses skill-specific compaction handling; large skills hit result-size caps. (4) Compaction can drop the skill listing in Claude Code (open issue #82017, 0 of 17 routings after compaction in one test, *checked* 2026-10-18, <https://github.com/anthropics/claude-code/issues/82017>), which matters for any design that relies on one listed main skill. (5) Rule and skill tools churn: many are single-maintainer, and two (openskills, skillz) have had no push for about nine months.

## Harness facts that bound the options

### Claude Code skills

- Listing: every skill name always listed; descriptions share a budget of 1% of the context window, overflow drops descriptions of the least-invoked skills; combined `description` plus `when_to_use` capped at 1,536 characters (`skillListingMaxDescChars`); budget raised with `skillListingBudgetFraction` or `SLASH_COMMAND_TOOL_CHAR_BUDGET`. *read* (<https://code.claude.com/docs/en/skills>, troubleshooting section "Skill descriptions are cut short"). Setting names and default 0.01 also confirmed by a third-party author who extracted them from the binary. *read* (claudefa.st).
- On/off: `disable-model-invocation: true` removes the description from context; `skillOverrides` in settings takes `on`, `name-only`, `user-invocable-only`, `off`; "Plugin skills are not affected by `skillOverrides`. Manage those through `/plugin` instead." *read*, *checked* 2026-10-18 (<https://code.claude.com/docs/en/skills>).
- Nesting: project skills load from `.claude/skills/` in the start directory and parents up to the repo root; `.claude/skills/` directories below the start directory load only the first time Claude reads or edits a file in that subdirectory. Issues #18192, #28266, #20979, #39138 show skills nested inside a skills folder are not scanned (one closed as resolved, causes unclear). *read* for the docs and the #28266 / #98220 titles via issue pages and snippets; the other issue contents are *inferred* from search snippets.
- Lifecycle: invoked skill content "enters the conversation as a single message and stays there"; Claude Code "does not re-read the skill file on later turns"; identical re-invocation adds a short "already loaded" note; auto-compaction re-attaches the most recent invocation of each skill, first 5,000 tokens each, 25,000 combined, newest first, older skills can drop entirely. *read*, *checked* 2026-10-18 (<https://code.claude.com/docs/en/skills>).
- Compaction vs listing: issue #82017 (open): after auto-compaction the full skill listing is not re-sent, only deltas, so the model sees about 1 of 85 skills; a skill fired 11 of 11 times without compaction and 0 of 17 after; workarounds are `/reload-skills` or a SessionStart hook matched on `compact`. *read*, *checked* 2026-10-18 (<https://github.com/anthropics/claude-code/issues/82017>): open, opened 2026-07-28, last comment 2026-10-16; 11 of 11 firings without compaction and 0 of 17 after, as cited; the "1 of 85" figure was not found in the page read and is unchecked. The issue adds that 50 of 50 compacted sessions in its controlled test received no listing after the compaction boundary, that `claude -p --resume` hides the fault because a new process sends the full listing, that the Skill tool still accepts an unlisted skill by name (6 of 6), and that a SessionStart hook matched on `compact` returning `reloadSkills: true` fired 5 of 5 times in the reporter's test but does not cover an automatic compaction in the middle of a turn.

### Claude Code plugins

- Plugin skills are namespaced `/plugin-name:skill-name`; a manifest `skills` field adds directories to the default `skills/` scan; every component path must resolve inside the plugin root. `dependencies` accepts names, `name@marketplace`, or objects with semver ranges, resolved against git tags `<plugin>--v<version>`; cross-marketplace dependencies need `allowCrossMarketplaceDependenciesOn`. *read* (<https://code.claude.com/docs/en/plugins-reference> and /plugins/dependencies).
- Plugins can ship MCP servers (`.mcp.json` or inline), named `mcp__plugin_<plugin>_<server>__<tool>`; users cannot add or remove them with `/mcp`, only toggle off. *read*
- Per-skill disable inside a plugin: open request #98220 (opened 2026-09-29, v2.1.282, no maintainer reply); override entries for plugin skills are "ignored silently"; the only way to remove one is to disable the whole plugin, which also disables its MCP servers and hooks. Related #14920 is open with 19 comments; #82832 resolved. *read* (claudeissues.com mirror); *checked* 2026-10-18 on GitHub (<https://github.com/anthropics/claude-code/issues/98220>, <https://github.com/anthropics/claude-code/issues/14920>): both open, "no maintainer reply" and "19 comments" were not checked. #14920 lists the workarounds its commenters use: denying the skill with a `Skill(name)` permission rule, an instruction in CLAUDE.md, a hook that blocks it, forking the plugin, or disabling the whole plugin; none was run here.
- No cross-plugin skill reference syntax found; the dependency field exists so one plugin's MCP server or skill can be called by another, but no doc was found of how a skill names a skill in another plugin. *read* for the dependencies page; the negative result is from reading that page and the plugin reference.

### Codex

- Listing: the initial list includes each skill's file path; budget "at most 2% of the model's context window" with an 8,000-character fallback when the window is unknown; descriptions are shortened first and "may omit some skills from the initial list and show a warning"; `skills.max_context_tokens` raises it up to 10,000 tokens. *read* (<https://learn.chatgpt.com/docs/build-skills>, redirected from developers.openai.com/codex/skills). A third-party blog adds about 5,440 characters on a 272K window and v0.146 changes (metadata compression, truncation warnings naming skills, "executor-provided skills" that load only when selected and bypass the startup budget). *inferred*, the blog citing release notes and issues #19679 (ceiling hardcoded request) and #24299 (`.system/` skills regenerate).
- On/off: `[[skills.config]]` entries in `~/.codex/config.toml` with `enabled = false` keyed by the skill's path, restart required; `allow_implicit_invocation: false` in `agents/openai.yaml` stops implicit use, explicit `$skill` still works; plugins have `[plugins."name@marketplace"] enabled=false`. *read* for the skills doc, *checked* 2026-10-18 (<https://learn.chatgpt.com/docs/build-skills:> `[[skills.config]]` entries in `~/.codex/config.toml` with `enabled = false` and the skill's `path`, restart needed); the plugin table and the idea of path-keyed overrides reaching plugin cache paths are *inferred*, and per-skill disable inside a plugin could not be confirmed.
- Scanning: `.agents/skills` in every directory from the working directory up to the repo root, `$HOME/.agents/skills`, `/etc/codex/skills`, system; symlinked skill folders are followed; same-name skills are not merged. *read* No doc of scanning nested folders below a skills folder was found.
- Plugins "distribute reusable skills and connectors"; the doc does not say how plugin skills are named. *read*
- Compaction of skills: no official statement found on whether Codex preserves skill text through compaction. A third-party blog says compaction drops earlier file-read content. *inferred*

### Agent Skills format

- `name` must match the parent directory; references are relative to the skill root and "one level deep from SKILL.md"; progressive disclosure is metadata (about 100 tokens), body under 5,000 tokens, resources on demand; keep SKILL.md under 500 lines. No concept of skill-to-skill references or nesting. *read* (<https://agentskills.io/specification>).

## Section per project

### Vercel `skills` CLI (vercel-labs/skills) and skills.sh

- What: "The CLI for the open agent skills ecosystem"; supports Claude Code, Codex, Cursor, OpenCode "and 75 more". *read* 35.4k stars, created 2026-01-14, last push 2026-10-09, about 1,155 open issues (GitHub API count includes PRs).
- Shape: CLI writer. Installs into a canonical copy then symlinks into each agent's folder (project `./<agent>/skills/`, global `-g`), or `--copy`. *read*
- Discovery/loading: harness-native; the CLI does not serve skills. *read*
- On/off: no enable/disable; `add`/`remove` with `--agent` and `--skill`; `metadata.internal: true` hides a skill unless `INSTALL_INTERNAL_SKILLS=1`; open request #2499 for a `--disable-model-invocation` flag. *read*
- Nesting: walks container directories up to three levels deep, a shallower SKILL.md shadows a nested one, `--full-depth` goes further; issue #2528 "Two level catalog layout silently drops skills and is order dependent". *read*
- References: none between skills. Lock file recorded (`skills-lock.json` mentioned by skills-npm and issue #2524); `update` re-downloads unchanged skills (#2512), `@tag` installs the default branch HEAD instead (#2526). *read*
- Problems reported: symlinks fail without Windows Developer Mode (fallback `--copy`); a Windows install reported success while skills never loaded because the agent-specific link was not created (microsoft/azure-sql-database-container issue 113, via search snippet *inferred*); Cursor did not follow symlinks to discover skills (forum thread, fix promised for and confirmed in Cursor 2.5, then new reports about agents/rules folders and skills turning into Rules) *read*; discovery directory list drifted from the registry so 30 documented agent directories were never searched (#2502) *read*.
- Lesson: the market leader chose symlinks plus copy fallback and accepted many harness-specific bugs; it never added a real enable/disable.

### openskills (numman-ali/openskills)

- What: "Universal skills loader for AI coding agents"; npm CLI. *read* 10.8k stars, created 2025-10-26, last push 2026-01-18, 44 open issues (API). Unmaintained signals: issue #94 asks whether the project is still maintained *read*.
- Shape: CLI writer plus a shell-callable reader. `openskills install` puts skills in `./.claude/skills`, `./.agent/skills` (`--universal`) or global; `openskills sync` writes an `<available_skills>` XML block into `AGENTS.md`; the agent runs `npx openskills read <name>` to pull a skill's full text. *read*
- Discovery/loading: listed up front in AGENTS.md (names and descriptions), full text retrieved on demand through a shell command. This is the closest existing thing to a CLI "reader" (between a CLI that writes files and an MCP server). *read*
- On/off: none; `remove` and `manage` only. *read*
- Harnesses: Claude Code, Cursor, Windsurf, Aider, Codex, "any tool that reads AGENTS.md". *read*
- Nesting/references: none; precedence order across four folders. Issue #92 "Duplicate skill discovery when repos include examples or mirrored SKILL.md files". *read*
- Problems: Windows path issues (#71, #65, #64), updates only for skills installed from git. *read*
- Lesson: a read-by-shell design needs the agent to run a command per skill load and depends on AGENTS.md, and the project went quiet.

### Skillz (intellectronica/skillz)

- What: "An MCP server for loading skills (shim for non-claude clients)", PyPI and Docker. *read* 404 stars, created 2025-10-18, last push 2026-01-30, 2 open issues (API).
- Shape: MCP server (stdio, HTTP, SSE). Scans a root folder (default `~/.skillz`) of skill folders or `.zip`/`.skill` archives; exposes skill instructions and bundled files as downloadable resources, can run bundled helper scripts. The README does not name its tool schemas. *read*
- Nesting: accepts nested subdirectories and archives, and says Claude Code does not ("Nested directories are not discovered"). *read* This is the one tool built specifically to serve nested skills, via MCP.
- On/off, harnesses: not described. *read* Warning: "Experimental proof-of-concept. Potentially unsafe."
- Lesson: it exists as a shim for clients without native skills; native support arriving removed its reason to exist.

### K-Dense claude-skills-mcp

- What: MCP server doing vector search over skills from GitHub repos (including Claude Code plugins) and local dirs. *read* 407 stars, created 2025-10-21, last push 2026-07-20.
- Shape: MCP server with three tools: `find_helpful_skills`, `read_skill_document` (scripts, data, references), `list_skills`. Multi-level loading (metadata, then full content, then files). Light stdio frontend (about 15 MB) plus heavy backend (about 250 MB, PyTorch and sentence-transformers, 60 to 120 seconds first start). *read*
- Status: "This MCP server is no longer hosted or maintained" and "major AI platforms now support Agent Skills natively, so the MCP bridge is no longer needed". *read*
- On/off: none; control through source config. Nesting: only plugin sources. *read*
- Lesson: semantic retrieval over skills carried a very heavy dependency and was retired once native skills arrived.

### StacklokLabs/skills-mcp

- What: "Serve Agent Skills over MCP with centralized hosting and token-efficient progressive disclosure." *read* 3 stars, created 2026-01-07, last push 2026-10-17, 6 open (API). README license text is "Proprietary" and the API license field is empty, so not reusable. *read*
- Shape: MCP server (Streamable HTTP). Tools `list_skills`, `get_skill`, `get_skill_resource`, `validate_skill`; skills also as `skills://` resources, and one MCP prompt per skill (usable as slash commands). Sources: local, git (`git://host/owner/repo[@ref][#subdir]`), OCI registries; local beats git beats OCI on collisions. *read*
- Notable: `list_skills` "embeds the skill catalog in its always-loaded description" so the model sees the catalog in the tool definition, a way to get a listing without the harness's skill budget. Per-connection expansion state. *read*
- Nesting, references, on/off: not covered. *read*

### Jignesh-Ponamwar/skills-mcp

- What: self-hostable semantically searchable skills registry over MCP, three-tier loading. *read* 10 stars, 40 commits, Apache-2.0.
- Tools (seven): `skills_find_relevant`, `skills_list_all`, `skills_get_body`, `skills_get_options`, `skills_get_reference`, `skills_run_script`, `skills_get_asset`. Only descriptions and trigger phrases are embedded (Qdrant, Cloudflare Workers AI). Runs on Cloudflare Workers or Docker. *read*
- Reported limits: "Agents need a master skill file installed for reliable behavior", token use grows with collection size and `top_k`, `skills_run_script` works only on the local server, embedding model fixed. *read* Hosted demo has no SLA and no auth.
- Lesson: even a retrieval server needs a skill (or rules text) installed in the harness to make agents use it.

### JayCheng113/skill-retrieval-mcp

- What: local MCP server with semantic and keyword search over 374 skills. *read* 134 stars, created 2026-03-14, last push 2026-08-27.
- Tools: `search_skills`, `keyword_search`, `get_skill`, `list_categories`. Local embeddings (all-MiniLM-L6-v2, FAISS, SQLite FTS5), no API calls. *read*
- Measured (author's own 43-query eval): 81.4% correct at rank 1, 90.7% in top 3; five summaries cost "a few hundred tokens", one skill read about 2,400 tokens; the author argues listing every name and description for this corpus costs 37K tokens and full text 960K. *read*
- Problems: index only works with the model that built it; silent failures when the data dir is wrong (empty results, no error). *read*
- Lesson: this is the only quantified evidence for retrieval beating listing, at 374 skills; skillbook's four sets would be far below that scale.

### Other skills-over-MCP servers (not read in depth)

- zouyingcao/agentskills-mcp (stdio/SSE/HTTP), PederHP/skillsdotnet (C# with MCP integration), maiconsouza89/agents-skills issue #24 (proposal for a read-only server: search, read, fetch). Seen only in a search result; shape and maturity unknown. *inferred*
- jmcdice/superpower-mcp: third-party MCP server wrapping Superpowers for Augment CLI with `find_skills` and `use_skill` tools (search snippet only). *inferred*
- No project found that serves a single main skill plus hidden sub-skills through one MCP read tool; the closest are the servers above.

### Skills over MCP: the official extension (SEP-2640)

- What: extension `io.modelcontextprotocol/skills`, SEP-2640 status Final, PR merged 2026-09-13, created 2026-04-23. Maintained by the Skills Over MCP Working Group. *read*, *checked* 2026-10-18 for Final status, the PR number and the merge date, which came from the GitHub API (pull request 2640 of modelcontextprotocol/modelcontextprotocol, merged 2026-09-13); the SEP names protocol versions 2026-07-28 and later only for the list-caching attributes of `skills/list`, so the earlier note that it targets that revision is unchecked. (modelcontextprotocol.io/seps/2640-skills-extension, /extensions/skills/overview).
- Shape: skills as MCP resources, `skill://<skill-path>/<file>` (path may be nested, last segment must equal the skill `name`); methods `skills/list`, `skills/get`, optional `resources/directory/read`; listing carries frontmatter plus a manifest with SHA-256 digests and sizes; hosts must not prefetch files. *read*
- Nesting: allowed. "Nested content is supporting content"; a nested SKILL.md read as a supporting file is plain markdown; activating it needs fresh explicit user consent; "Publication is flat" (listing does not mark nesting). *read*
- References: relative paths resolved against the skill root, same as filesystem skills. *read*
- Trust (answers the harness-treatment question): hosts MUST treat MCP-served skill content as untrusted input, MUST tag it with its originating server and not present it as a local skill, bind resource reads to the originating server, require per-skill approval for `allowed-tools` or host-side code execution, and bind persisted approval to the digest set (changed file revokes approval). A `resources/read` of a SKILL.md "does not itself activate a skill"; the host must route it through its skill-loading path. *read*
- Caching: hosts SHOULD cache verified content on demand; list results carry `ttlMs` and `cacheScope`. Servers SHOULD NOT exceed 512 files or 16 MiB per skill. *read*
- Harness support: client matrix lists Skills as supported by mcpc, partial for ChatGPT (via a plugin MCP-server import page), fast-agent and MCP Inspector; blank for Claude (web), Claude Desktop, VS Code Copilot, Cursor, Goose and others; Claude Code and Codex are not rows in the matrix. "SDK and host support is still being implemented." *read*, *checked* 2026-10-18 (<https://modelcontextprotocol.io/extensions/client-matrix>).
- Lesson: it is the standard route for a tool that serves skills, with the right trust model, but it is not usable in Claude Code or Codex today; a plain tool-based `skillbook_read` would sit outside the standard.

### Ruler (intellectronica/ruler)

- What: "apply the same rules to all coding agents"; about 30 agents. *read* 2.9k stars, created 2025-05-20, last push 2026-10-14, 19 open issues.
- Shape: CLI writer. `.ruler/` holds markdown rules concatenated into each agent's file (`CLAUDE.md`, `AGENTS.md`, `.cursor/...`); `ruler apply` writes them, `.bak` backups, `ruler revert`. *read*
- Skills (experimental): `.ruler/skills/<name>/SKILL.md` copied to native skill folders (`.claude/skills/`, `.agents/skills/`) for agents that support them; agents without native skills are skipped with a warning. Subagents likewise (experimental, off by default). *read*
- On/off: per agent only, `[agents.<name>] enabled`, `default_agents`, `--agents`; no per-skill switch. Nested mode (experimental) loads rules from every `.ruler/` in the tree; the README does not say whether skills participate. *read*
- Problems: beta research preview; gitignored generated files are not copied into git worktrees so `ruler apply` must be rerun; generated files overwritten. *read*

### rulesync (dyoshikawa/rulesync)

- What: Node CLI generating configs for about 70 tools from `.rulesync/` (rules, commands, MCP, ignore, subagents, skills, hooks, permissions). *read* 1.5k stars, created 2025-06-18, last push 2026-10-18 (same day), 56 open issues.
- Shape: CLI writer with `generate`, `import`, `convert --from cursor --to copilot`, `fetch` for official skills; global mode for some tools. Per-target and per-feature selection (`--targets`, `--features`). *read*
- Skills: a feature support table marks "project, global or simulated" skills per tool; the README does not say which tools get simulated skills. *read*
- Problems: several targets deprecated or end-of-life (Continue, Roo Code, Tabnine CLI legacy, Rovo Dev), `ignore` deprecated for `permissions`; Antigravity has a 24,000-byte per-file limit and `generate --delete` never removes shared global rules there. *read* A lockfile for npm transport sources exists (search snippet *inferred*).
- Lesson: supporting 70 tools costs constant churn; per-tool quirks (byte limits, global dirs) are the main maintenance load.

### dotagents (getsentry/dotagents)

- What: declare skills, MCP servers, hooks, subagents and plugins in `agents.toml`; it configures Claude, Cursor, Codex, Copilot CLI, Grok, VS Code, OpenCode and Pi. *read* 253 stars, created 2026-02-07, last push 2026-10-15, MIT. (Not to be confused with yourconscience/dotagents, a Go CLI with a `~/.agents` repo and commit-pinned audited external skills, search snippet only *inferred*.)
- Shape: CLI writer. Skills live in `.agents/skills/` and are symlinked into tool folders (`.claude/skills/`); `~/.agents/agents.toml` and `agents.lock` for global state, `--project` for repo state; commands `init`, `add`, `remove`, `install`, `list`, `sync`, `mcp`, `trust`, `doctor`. Sources: GitHub, GitLab, any git server, well-known HTTPS sources, local dirs; plugins are installed as canonical bundles with disposable per-target outputs. *read*
- On/off: removing a skill supplied by a wildcard source adds it to that source's `exclude` array; an include option is not mentioned. Lock contents (commit pin, integrity hash) are from a search snippet *inferred*.
- Limits: Pi plugin skills land in the shared `.agents/skills/`, so other clients see them; plugin-bundled MCP servers not projected to Pi. *read*
- Lesson: the cleanest model found of a CLI that writes skill files: manifest, lock file, canonical store, symlinks, exclude list, a doctor command.

### skillshare (runkids/skillshare)

- What: CLI plus desktop app and web dashboard, one source synced to Claude Code, Codex, Pi, OpenCode and more; also agents, rules, MCP, hooks, plugins. *read* 2.8k stars, created 2026-01-14, last push 2026-10-17, v0.25.13.
- Shape: CLI writer; symlinks on macOS/Linux, NTFS junctions on Windows, file symlinks need Developer Mode or are copied; per-tool `--mode copy`. A `.skillignore` file exists and the README "links to a filtering guide" for choosing "what each tool receives", but the mechanism was not described in what I read. Project-level skills via `init -p`. *read*
- Problems: Windows symlink fallback to copies is silent. *read*

### Skills-Manager (jiweiyeah) and other desktop/CLI managers

- jiweiyeah/Skills-Manager: desktop app plus `skm` CLI, 32 tools, about 1.0k stars, created 2026-02-06, last push 2026-09-10. Central hub folder, symlinks into each tool (Windows: symlink, then junction, then tracked copy). `skm enable <skill> --for <tool>` / `skm disable` add or remove the link; `skm adopt` moves existing skills into the hub; `skm doctor` / `fix`. No nesting or MCP. *read*
- mode-io/skill-manager: local app for Codex CLI, Claude Code, Cursor, OpenCode, Hermes Agent, OpenClaw; 17 stars. One copy in a shared store linked to chosen harnesses; "Disabling a harness removes only that link, and the package stays in the store". Per-skill and per-harness toggles; Hermes category layout noted; Windows support narrow (Codex only). *read*
- emanuelet/skill-manager (fork of omrikais/skill-manager): `sm` CLI for Claude Code and Codex; canonical store `~/.skill-manager/skills/`, deploy/undeploy per tool with symlinks, `depends` in frontmatter deployed first, auto-adopt that removes the original from tool folders, an MCP server and a SessionStart hook for trigger-based activation; 0 stars. *read* (Auto-adopt of skills placed by hand is an example of a manager surprising users.)
- abubakarsiddik31/skill-manager: desktop app; moves disabled skills to a sibling `.disabled/` folder. *inferred* (search snippet only). SkillDock (wanghuan9) also listed, not read.
- Lesson: the on/off verb in these tools is "link or unlink". None of them add dependency or nesting semantics.

### skills-npm (antfu/skills-npm)

- What: CLI that symlinks skills shipped inside installed npm packages into the agent skills folder, plus remote skills declared in a package's `skills` field. *read* 569 stars, created 2026-01-31, last push 2026-10-15; being merged into the Vercel `skills` CLI (`skills experimental_sync`).
- Cross-package behaviour (the closest thing to cross-package skill handling): name collisions resolve by a priority ladder, shipped beats remote, direct dependency beats transitive, unresolved ties are skipped with a warning and settled by `include`/`exclude`; `skills-lock.json` records remote sources (full 40-character SHAs for commits); links are relative into `node_modules` so they can be committed. *read*
- Lesson: when skills ship in packages, collisions between packages need an explicit policy; it is a flat namespace problem, not a reference problem.

### Tessl

- What: "package manager and registry for agent context" (tiles contain skills, docs, rules); `tessl install` into the project, recorded in `tessl.json`; installs for every detected agent unless `--agent` is given; paths such as `.claude/skills/`, `.cursor/skills/`; `tessl init` also configures MCP. Registry with evals and security scanning (3,000+ skills per a third-party overview). *inferred* (docs.tessl.io search snippets; a direct fetch of the glossary did not define tile or dependencies, and I found no dependency-resolution spec).
- Glossary distinction worth noting: skills are loaded "lazy push" when judged relevant; rules are always-on "eager push". *read*

### GitHub CLI `gh skill`

- What: `gh skill install|search|update|publish|preview` (public preview since v2.90.0, April 2026) for Copilot, Claude Code, Cursor, Codex, Gemini CLI, Antigravity; `--agent`, `--scope user`, `--pin`. *read*
- Notable: writes tracking metadata (repo, ref, tree SHA) into the skill's `SKILL.md` frontmatter so provenance travels with copies; updates compare tree SHAs; `publish` validates against agentskills.io and offers immutable releases; warns skills "may contain prompt injections". *read*
- On/off, nesting, references: not covered. Lesson: a first-party vendor chose a CLI writer too, not MCP.

### obra/superpowers and its early Codex script

- What: the largest skills project (301k stars, created 2025-10-09, last push 2026-10-10). Installed per harness by each harness's plugin mechanism (Claude Code marketplace, Codex marketplace, Cursor, Gemini CLI extensions, OpenCode INSTALL.md, and about a dozen more). *read*
- Discovery: a `using-superpowers` skill plus per-harness bootstrap; skills trigger automatically from descriptions. Pi and Muse inject the bootstrap through a session-start hook. Hermes "has no post-compaction hook", so long sessions can lose the bootstrap. *read*
- References between skills: bare names in the README; in the writing guide `**REQUIRED SUB-SKILL:** Use superpowers:test-driven-development`, never `@` links ("force-loads files immediately, consuming 200k+ context"), "Flat namespace - all skills in one searchable namespace". *read*
- Early skill-finding scripts: a third-party doc (lzw.me) describes `~/.codex/superpowers/.codex/superpowers-codex` with `bootstrap`, `find-skills` and `use-skill <name>` subcommands, using `skills-core.js` to search skill dirs recursively with a depth limit, a `superpowers:` prefix for the official copy, personal skills with no prefix that override. It calls Codex support experimental. *read* (that page) but whether the script still exists upstream is *inferred*: the release notes I read (v6.0.0 to v6.4.1) do not mention it, and the current README describes plugin marketplaces. I did not find the commit that removed it.
- Lesson: this is a worked example of a "CLI reader" (between a CLI that writes files and an MCP server) that was later replaced by native plugin installs once harnesses grew skill support.

### Rule distributors for editors (vibe-rules and others)

- vibe-rules (FutureExcited): CLI saving rules and loading them per editor (`.cursor/rules/<name>.mdc`, Claude Code `~/.claude/CLAUDE.md`), converts between editor formats, installs rules from npm packages that export an `llms` entry. *inferred* (README snippets). Vibe MCP (@jinjos/vibe-mcp): an MCP server exposing a unified rules system with a sync tool, covering Claude Code, Cursor, Copilot, Gemini CLI. *inferred*
- Not found: a Cursor-specific or Copilot-specific skill toggle manager that is not one of the multi-harness tools above.

### Requests for lazy skill search in harnesses

- Claude Code #43816 "SkillSearch" (2026-04-05): asks for a name-only listing, an on-demand description search, and the existing full-body load; cites 81+ skills listed, about 4 to 5K tokens listing cost by the author's estimate (inconsistent figures), Tool Search cutting MCP tool context 77K to 8.7K. Closed "not planned" 2026-06-05 by the stale bot, locked 2026-08-08, no Anthropic staff reply. *read*
- Claude Code #21545 (2026-01-28): name-only stubs for skills and MCP servers; closed as not planned by the stale bot 2026-02-28. *read*
- OpenCode #13188 (2026-02-11): the skill tool description lists every skill every turn; 21 agents plus 3 skills cost about 2,000 tokens per turn; a commenter with about 1,500 skills measured about 148K tokens (56% of a 262K window); closed as not planned by a bot 2026-07-09. *read*
- Hermes Agent #22620 (2026-05-09, open, P3): 200+ skills add 10 to 15K tokens per call; proposals are vector routing, lazy listing, config groups; workaround of disabling 90 skills cut context about 37%. *read*
- Lesson: users want listing relief; harness vendors have not shipped it for skills, and the ask closes unanswered. Claude Code did ship deferred loading for MCP tools ("Tool search ... on by default"). *read* That is an argument that an MCP tool is cheap to host even with many sub-skills.

## Questions asked at the start

### Are MCP tool results reused across turns like file reads?

- Within a conversation, an MCP result is just another tool result in the transcript, so it stays visible to the model until compaction clears it. *inferred* from Claude Code docs: "It clears older tool outputs first, then summarizes the conversation if needed." *read*
- Reuse by the harness is a different thing. Claude Code's Read tool deduplicates unchanged re-reads (changelog v2.1.86 per a docs issue, and several bug reports about stale "Unchanged since last read" answers), and the Skill tool dedupes identical re-invocations ("a short note that the skill is already loaded"). *read* for the Skill behavior; the Read dedupe is *inferred* (issue pages and snippets, not the changelog itself). I found no evidence that MCP tool results are deduplicated, cached by the harness, or re-attached after compaction. *read* that nothing is documented; the absence is a negative result.
- Size handling: Claude Code warns above 10,000 tokens, caps MCP output at 25,000 tokens by default (`MAX_MCP_OUTPUT_TOKENS`), writes text over 50,000 characters or over the cap to a file in the session `tool-results` folder and gives Claude the path; a server can raise its own limit with `anthropic/maxResultSizeChars`. A very large result that refills context after each summary can stop auto-compaction ("thrashing error"). *read*
- Prompt cache: a repeated large MCP result re-enters the context as new tokens, so reading the same hidden skill twice costs twice. Third-party teardowns describe microcompaction clearing old tool results while preserving the cache. *inferred*

### Do harnesses treat MCP-served instructions differently from skills?

- Claude Code skills are first-class: listed up front, loaded into a single message that persists, re-attached after compaction (5,000 tokens each, 25,000 combined), subject to `disable-model-invocation`, `skillOverrides` and `Skill(name)` permission rules. *read* MCP tools are governed by tool permissions and project-server approval prompts (a cloned repo cannot approve its own servers). *read*
- Content returned by an MCP tool is ordinary tool output: it falls in the "older tool outputs cleared first" bucket, gets no re-attachment, and is not covered by skill permission rules. *inferred*
- Server-level `instructions` and tool definitions: Claude Code defers MCP tool definitions by default via tool search, "so only tool names and server instructions consume context until Claude uses a specific tool." *read* The MCP SEP says server `instructions` are "practically bounded in size", which is its motivation for a skills extension. *read*
- Trust: the Skills extension requires hosts to mark served skills as untrusted input, show their origin, gate `allowed-tools` and code execution per skill and re-prompt on changed files. This applies to hosts that implement the extension; none of Claude Code, Codex or Cursor appear in the support matrix. *read*
- Compaction in Codex: no official statement found either way. *inferred*

## Negative results (what was looked for and not found)

- No documented way to disable one skill inside a Claude Code plugin; no confirmed one for Codex plugins (path-keyed `[[skills.config]]` may work on cached plugin paths, untested).
- No documented cross-plugin skill-reference syntax in Claude Code or Codex; only plugin-level `dependencies` (Claude Code).
- No project that gives true hierarchical (parent to child) skills with on/off per level in Claude Code or Codex; Skillz and the MCP extension allow nested trees only on the MCP side.
- No official OpenAI statement that Codex preserves skill text across compaction.
- No evidence that Claude Code or Codex implements `skill://` or `skills/list`; the client matrix does not list them.
- No GitHub issue found in openai/codex quoting "8,000 characters" as a bug; the figure appears only as the documented fallback. A search for `openai/codex` issues on the topic returned only a third-party blog and an upd.dev mirror.
- The superpowers `find-skills` / `use-skill` script was found only in a third-party doc, not in upstream release notes or in the current README; upstream source and history were not read.
- Stack and maturity of Tessl's dependency model: not confirmed.

## Sources

Harness documentation

- <https://code.claude.com/docs/en/skills> (read)
- <https://code.claude.com/docs/en/how-claude-code-works> (read)
- <https://code.claude.com/docs/en/mcp> (read, first 100,000 characters)
- <https://code.claude.com/docs/en/plugins-reference> (read)
- <https://code.claude.com/docs/en/plugins/dependencies> (read)
- <https://learn.chatgpt.com/docs/build-skills> (read; redirect target of <https://developers.openai.com/codex/skills>)
- <https://agentskills.io/specification> (read)
- <https://claudefa.st/blog/guide/mechanics/skill-listing-budget> (read, third party)
- <https://codex.danielvaughan.com/2026/07/30/codex-cli-skill-context-budget-pressure-v0146-retention-truncation-profile-strategies/> (read, third party)

MCP Skills extension

- <https://modelcontextprotocol.io/seps/2640-skills-extension.md> (read); <https://modelcontextprotocol.io/seps/2640-skills-extension> and the client matrix (checked 2026-10-18)
- <https://modelcontextprotocol.io/extensions/skills/overview> (read)
- <https://modelcontextprotocol.io/extensions/client-matrix> (read)
- <https://github.com/modelcontextprotocol/experimental-ext-skills> (read)

Projects

- <https://github.com/vercel-labs/skills> and <https://github.com/vercel-labs/skills/issues> (read)
- <https://github.com/numman-ali/openskills> and <https://github.com/numman-ali/openskills/issues> (read)
- <https://github.com/intellectronica/skillz> (read)
- <https://github.com/K-Dense-AI/claude-skills-mcp> (read)
- <https://github.com/StacklokLabs/skills-mcp> (read)
- <https://github.com/Jignesh-Ponamwar/skills-mcp> (read)
- <https://github.com/JayCheng113/skill-retrieval-mcp> (read)
- <https://github.com/intellectronica/ruler> (read)
- <https://github.com/dyoshikawa/rulesync> (read)
- <https://github.com/getsentry/dotagents> (read)
- <https://github.com/runkids/skillshare> (read)
- <https://github.com/jiweiyeah/Skills-Manager> (read)
- <https://github.com/mode-io/skill-manager> (read)
- <https://github.com/emanuelet/skill-manager> (read)
- <https://github.com/antfu/skills-npm> (read)
- <https://github.com/obra/superpowers> and its releases page (read); <https://raw.githubusercontent.com/obra/superpowers/main/skills/writing-skills/SKILL.md> (read)
- <https://lzw.me/docs/opencodedocs/obra/superpowers/platforms/codex/index.html> (read, third party)
- <https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/> (read)
- <https://docs.tessl.io/reference/glossary> (read); <https://docs.tessl.io/introduction-to-tessl> (search snippet only)
- <https://github.com/zouyingcao/agentskills-mcp>, <https://github.com/PederHP/skillsdotnet>, <https://github.com/maiconsouza89/agents-skills/issues/24>, <https://github.com/abubakarsiddik31/skill-manager>, <https://github.com/wanghuan9/skilldock> (search snippets only)
- vibe-rules (<https://unpkg.com/vibe-rules@0.3.41/README.md>) and @jinjos/vibe-mcp (<https://lobehub.com/ko/mcp/jinjos-vibe-mcp>) (search snippets only)

Issues and forum threads

- <https://github.com/anthropics/claude-code/issues/43816> (read)
- <https://github.com/anthropics/claude-code/issues/21545> (read)
- <https://github.com/anthropics/claude-code/issues/98220> and <https://github.com/anthropics/claude-code/issues/14920> (checked 2026-10-18)
- <https://github.com/anthropics/claude-code/issues/82017> (checked 2026-10-18)
- <https://claudeissues.com/issue/98220-feature-let-skilloverrides-disable-individual-plugin-skills> (read)
- <https://claudeissues.com/issue/82017-compaction-continued-sessions-lose-the-skill-inventory-skill-listing-only-deltas> (read)
- <https://github.com/anthropics/claude-code/issues/28266> and /18192 and claudeissues.com mirrors #20979, #39138, #39787, #40640 (search snippets only)
- <https://github.com/anomalyco/opencode/issues/13188> (read)
- <https://github.com/NousResearch/hermes-agent/issues/22620> (read)
- <https://forum.cursor.com/t/cursor-doesnt-follow-symlinks-to-discover-skills/149693> (read)
- <https://claudeissues.com/issue/40123> and /45748 (Read tool dedupe; search snippets only)
- GitHub API repo metadata (stars, created_at, pushed_at, open issues) for the repositories above, fetched 2026-10-18
