---
status: current
created: "2026-10-10"
---

# Research: how agents load skills, and what namespaces allow

Whether skillbook's skills can form a tree: skills that load other skills, under one namespace, without every skill costing context on every turn. Facts about Claude Code and Codex were read in their documentation and source, then tested by running both agents on throwaway skills. Provenance as in the blueprint's conventions: *read*, *summary*, *ran*.

## Summary

- **A skill can load another skill in both agents, whatever the wording.** Twelve of twelve runs per agent, for six wordings from a bare name to "Call the Skill tool with ...", when the target is model-invoked.
- **The skill list is the only per-turn cost, and only model-invoked skills are in it.** A user-invoked skill is left out of the list in both agents; Claude Code's `plugin details` estimate counts it anyway, wrongly.
- **A user-invoked skill is loaded by its path, never by its name.** Reading `../child/SKILL.md` worked 8 of 8; the Skill tool refuses it (0 of 8). A tree can therefore have free inner nodes that the person can still type.
- **A namespace has one level: the plugin's name.** Every skill in plugin `skillbook` becomes `skillbook:<name>`; a bare name works when no other skill has it.
- **On a name clash, a bare name reaches the project or personal skill,** even when the call comes from inside the plugin. The full name `skillbook:<name>` always reaches the plugin's own skill.
- **A tree five levels deep works in both agents,** walked down from a plain request or entered at a deep node that then loads its root's shared rules.
- **Skill folders can nest by topic when `plugin.json` lists every one.** Unlisted, a nested `SKILL.md` is ignored by Claude Code; Codex registers every nested `SKILL.md` whatever the list says.
- **Plugin dependencies exist in Claude Code only.** Installing a plugin installed what it depends on; Codex ignored the field.
- **`plugin.json`'s `skills` field makes no difference for a `skills/<name>/` layout.** Absent, empty, a list and a directory each loaded the skill once in both agents.
- **Sub-skill files load reliably,** three files deep, and a mode named in the request is found without `$ARGUMENTS`.
- **A local marketplace is read in place by Claude Code and copied by Codex,** so edits reach Claude Code at once.
- **One visible main skill reaches the right skill as often as six or thirteen visible roots,** and its rules are applied whenever it loads; a group layer makes no measurable difference. Claude Code at first answered a third of requests without any skill; a description that says to load it first, or a pointer in `AGENTS.md`, ended that ([Top-level shapes](#top-level-shapes)).
- **A skill loaded once is reused for the rest of the conversation,** after compaction too, without any instruction; Claude Code sometimes searches the skill folders instead of reading a skill, which a rule in the skills stops ([Loading once, using many times](#loading-once-using-many-times), [Following routes, not searching](#following-routes-not-searching)).
- **An installed plugin picks up a change** at the next session when Claude Code reads it in place, after `codex plugin add` again for a local Codex plugin, and, from Git, after a version bump and two update commands in Claude Code ([Picking up a changed plugin](#picking-up-a-changed-plugin)).
- **Two plugins, each a set with a listed main skill and hidden skills nested below it, work in both agents.** Only the main skills are listed; the tree is walked down; a one-sentence name rule in the main skill (a skill named `a-b-c` is the file `a/b/c/SKILL.md` inside the skill's folder) turns a name into a file without a search; a call between plugins works through the other plugin's main skill, with a fallback where it is missing; and a long sub-skill read before compaction was found again afterwards. Claude Code's compaction did not re-attach the main skill loaded through the skill tool, only the summary carried its rules ([Plugins with nested skills](#plugins-with-nested-skills)).
- **A set's other skills can be plain markdown files under its main skill, and both agents follow them as far as nested skills.** Chains of up to seven files, within a set and across two sets, were read whole in both agents, by the name rule or, without it, after a search of the folder; a parent that did part of its child's work made Codex stop at the parent; after compaction a rule buried in a file read before was applied in 12 of 12 runs, and a sentence telling the agent to read the file again made no difference ([Flattened reference files](#flattened-reference-files)).
- **A set installed as a plain folder by a script loads as well as a plugin, and a plugin has no advantage.** Copies and links in the personal and project skill folders passed in both agents, each agent listing the set once although both `~/.claude/skills` and `~/.agents/skills` hold it; in Claude Code's default permission mode the reference files outside the project are refused for personal skills and plugins alike, a rule `Read(~/.claude/skills/**)` in the user settings removes that and the same rule in a project's settings did not, and the agent that is refused answers from the main skill alone without saying so ([Installed by a script](#installed-by-a-script)).
- **After compaction, Claude Code drops the main skill and any start file not among the last five read, and a reload line alone did not bring them back; four compaction hooks that print the start files did.** Codex kept the pointer and reloaded with it. The earlier finding that a skill is reused after compaction holds for files re-attached by the harness ([Reloading after compaction](#reloading-after-compaction)). Codex ignores ask's numbered rounds because its own instructions outrank skills ([How Codex asks questions](#how-codex-asks-questions)).

## Setup

- **Agents:** Claude Code 2.1.296 with `claude-opus-5-5`; Codex CLI 0.160.0 with its default model, which the CLI does not print. Both run non-interactively (`claude -p`, `codex exec`) on 2026-10-10.
- **Isolation:** each case in its own folder, a clean environment, and plugin installs in temporary configuration folders (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`), so the person's own setup was not changed.
- **Detection:** each target skill holds a code word that appears nowhere else; a run passes when the final answer contains it. The event logs show each Skill tool call (Claude Code) and each file read (Codex).
- **Scale:** 157 recorded runs, 91 in Claude Code and 66 in Codex, one or two per case. Claude Code's usage cost US$8.89.
- **Listing:** what the model sees came from Codex's `codex debug prompt-input`, and from asking Claude Code to copy its own skill listing. Claude Code's `init` event lists the skills a user can type, not what the model sees.

## Skill to skill

A start skill, invoked by the user, tells the agent to get a code word from a child skill (*ran*).

| Wording in the start skill | Child model-invoked<br>Claude / Codex | Child user-invoked<br>Claude / Codex |
| --- | --- | --- |
| none: "whichever skill provides it" | 2/2 · 2/2 | 0/2 · 2/2 |
| bare name: "Apply the quill-child skill" | 2/2 · 2/2 | 2/2 · 2/2 |
| `/quill-child` | 2/2 · 2/2 | 0/2 · 1/2 |
| `$quill-child` | 2/2 · 2/2 | 2/2 · 2/2 |
| "Call the Skill tool with "quill-child"" | 2/2 · 2/2 | 0/2 · 0/2 |
| "Read `../quill-child/SKILL.md`" | 2/2 · 2/2 | 2/2 · 2/2 |

- With a user-invoked child, Claude Code's Skill tool answers: "cannot be used with Skill tool due to disable-model-invocation. Ask the user to run /quill-child themselves."
- The other passes with a user-invoked child came from the agent searching the disk and reading the file. That works only because the test skills sat inside the project; a plugin install keeps them elsewhere.
- **Chains:** start → mid → leaf, 2/2 in each agent. A skill that then reads its own sub-file, 2/2 each; relative links resolved from the child's folder. A sub-file that calls a skill, 2/2 each.

## What the model sees

- **Model-invoked:** listed in both agents (*ran*).
- **User-invoked** (`disable-model-invocation: true`; `policy.allow_implicit_invocation: false` in `agents/openai.yaml`): absent from both lists, in a project and in a plugin (*ran*). Typing it works: `/quill-child` and `/qp:quill-child`, `$quill-child` and `$qp:quill-child`, 1/1 each (*ran*).
- **`user-invocable: false`** (Claude Code only): listed, and the model loads it (5 of 5), but typing its name does nothing (*ran*).
- **`claude plugin details`** reports about 30 tokens "always-on" for a user-invoked skill that the model's listing does not contain (*ran*).
- **Codex's settings file** (Codex source, *summary*): always `<skill folder>/agents/openai.yaml`; the names are fixed, and any folder named `agents` in a skill is read as its settings. Without the file a skill stays visible. From `SKILL.md` Codex reads only `name`, `description` and `metadata.short-description`, not `disable-model-invocation`.
- **Limits on the list:** Claude Code cuts each description, with `when_to_use`, at 1,536 characters ([skills](https://code.claude.com/docs/en/skills), *summary*). Codex gives the whole list 2% of the context window, or 8,000 characters when unknown, shortening descriptions and then dropping skills beyond it (Codex docs and source, through a research agent, *summary*).

## Namespaces and plugins

| Case (*ran*) | Claude Code | Codex |
| --- | --- | --- |
| a plugin skill calls its sibling by bare name | 2/2 | 2/2 |
| the same call with the full name `qp:quill-child` | 1/1 | 1/1 |
| the user types a plugin skill's bare name | 1/1 | 1/1 |
| plugin `qa` calls a skill in plugin `qb` by bare name | 2/2 | 2/2 |
| bare-name call with a project skill of the same name | project wins, 2/2 | project wins, 2/2 |
| the user types that clashing bare name | project wins | project wins |
| `qa` declares `dependencies: ["qb"]`; only `qa` installed | `qb` installed too; 2/2 | ignored; 0/1 |
| the called skill is not installed | says it is missing | says it is missing |
| user-invoked sibling read by path | 2/2 | 2/2 |
| user-invoked sibling through the Skill tool | refused, 0/2 | 0/2 |

- Claude Code names plugin skills `<plugin>:<skill>`; the bare name also works "unless another command already uses that name" ([skills](https://code.claude.com/docs/en/skills), *summary*). Agents in a plugin may nest (`plugin:group:agent`); skills may not ([plugins reference](https://code.claude.com/docs/en/plugins-reference), *summary*).
- Codex names them the same way, and a bare `$name` selects a skill only when the name is unique (source, through a research agent, *summary*). The Agent Skills specification forbids `:` in a skill's own name and has no grouping ([specification](https://agentskills.io/specification), *summary*).
- A local marketplace: Claude Code reported "Read from:" the source folder; Codex copied the plugin into `plugins/cache/<marketplace>/<plugin>/<version>/` (*ran*).

## Nesting and files

- **Nested `SKILL.md`** (`quill-outer/quill-inner/SKILL.md`): not in Claude Code's list, in a project or a plugin; registered by Codex as `quill-inner`, or `qp:quill-inner` in a plugin (*ran*). Claude Code scans one level of `skills/` ([plugins reference](https://code.claude.com/docs/en/plugins-reference), *summary*).
- **Sub-skill files:** a strong pointer ("read `CODE.md`: it holds ...") and a weak one ("See CODE.md for details") each 1/1 per agent; a chain three files deep 2/2 each (*ran*).
- **Modes:** "Pick the mode the request names" with `/quill-modes beta` or `$quill-modes beta` read only the beta file, 2/2 each (*ran*). Codex passes no arguments; text after the name is part of the prompt (source, through a research agent, *summary*).
- **`plugin.json` `skills` field:** absent, `[]`, `["./skills/quill-child"]` and `["./skills/"]` each loaded the skill once in both agents (*ran*). Claude Code documents the field as adding to `skills/`; Codex's source as replacing it (*summary*), which an empty list did not show.

## Deep trees

A topic root in plugin `sb`, model-invoked, with user-invoked routers in nested folders below it (`skills/ugo/lat/ner/...`) and a leaf skill holding `CODE.md`. Each router reads the next by path; every node below the root first reads the root if its shared rule is not loaded, and the answer must carry that rule's marker (*ran*).

| Case | Claude Code | Codex |
| --- | --- | --- |
| walked down from a plain request: 3 levels and a file | 2/2 | 2/2 |
| the same, 5 levels and a file | 2/2 | 2/2 |
| the person types the level-4 node; it loads the root's rule | 2/2 | 2/2 |
| registered when `plugin.json` lists every skill folder | all 4 | all 4 |
| registered with no `skills` field | the top one | all 4 |
| registered with only the top folder listed | the top one | all 4 |

- A nested skill's name is its frontmatter `name` under the plugin, `sb:ugo-lat-ner-vix`; the folder path does not appear in it (*ran*).
- In Claude Code the agent loaded the root with the Skill tool, then read each level with the shell; in Codex it read each `SKILL.md` and `CODE.md` in order (*ran*).

## Top-level shapes

Whether a request reaches the right skill depending on what sits at the top of the tree (*ran*, 2026-10-11). The plugin held skillbook's sample tree, 94 skills with their drafted descriptions, every router listing its sub-skills with a condition each; every leaf held a code word, and a main skill's rule added a marker to the answer. Four shapes:

- **A:** six visible roots (engineering, write, understand, research, productivity, agents), the rest hidden.
- **B:** one visible main skill above those six roots, all hidden.
- **C:** one visible main skill above the thirteen parts directly, without the engineering and productivity groups.
- **D:** the thirteen parts as visible roots, no main skill.

Ten everyday requests, each aimed at one skill (a flaky test, a commit message, breaking a feature into tasks, a code review, naming options, comparing link checkers, meeting notes, "note this down for later", a status update, a handoff), and two that should load nothing. Each ran twice per agent; Claude Code with an empty configuration folder, so none of the person's own skills or settings were present.

| Shape | Claude Code: right, wrong skill, no skill | Codex: right, wrong, none | Rule applied |
| --- | --- | --- | --- |
| A: six roots | 11, 2, 7 | 18, 0, 2 | no main skill |
| B: main skill, groups | 13, 1, 6 | 18, 0, 2 | Claude 14, Codex 20 |
| C: main skill, no groups | 12, 2, 6 | 19, 0, 1 | Claude 14, Codex 20 |
| D: thirteen roots | 12, 2, 6 | 17, 0, 3 | no main skill |

- **Nothing loaded skillbook** for the two requests that needed nothing (arithmetic, a translation), in any shape.
- **Once the main skill loaded, it routed to a leaf every time in Claude Code** and applied its rule. Every Claude Code miss labelled "no skill" loaded no skill at all: the model did the task itself (a commit message, a short review, a survey from memory) or used its own memory feature for "note this down".
- **Codex missed one request in every shape:** the commit message. Under a main skill it routed to write and stopped there, short of the git skill under engineering.
- **Ambiguous requests went different ways by shape:** naming options reached write's naming with visible roots and understand's brainstorm under a main skill; "note this down for later, I'll sort it out next week" reached routines' tasks under a main skill.
- **Cost:** about US$0.10 per Claude Code run in every shape; a main skill adds one or two file reads per request.
- Two runs per case show direction, not rates.

### Making the main skill load

Three fixes for the requests Claude Code answered without a skill, on shape B (*ran*, 2026-10-11). Seven requests (the four that missed, three that worked) and the two that need nothing, twice per agent:

- **Pointer:** the project's `AGENTS.md`, included by `CLAUDE.md`, says "Before answering any request in this project, load the `sb:main` skill and follow it".
- **Sharper description:** the main skill's description opens with "Load this first for any piece of work, before answering", and engineering's routing line names git commits, branches and pull requests.
- **Both.**

| Variant | Claude Code: right, wrong, no skill | Codex: right, wrong, none | Loaded for the two trivial requests |
| --- | --- | --- | --- |
| none (shape B above) | 7, 1, 6 | 12, 0, 2 | neither agent |
| pointer | 13, 1, 0 | 13, 0, 1 | both agents, every time |
| sharper description | 12, 2, 0 | 14, 0, 0 | Codex only |
| both | 12, 2, 0 | 14, 0, 0 | both agents, every time |

- **Each fix ended the "no skill" answers in Claude Code.** Its remaining misses were all one request, "note this down for later, I'll sort it out next week", routed to routines' tasks instead of knowledge's capture: a routing choice, not a missed trigger.
- **Codex's commit miss was a routing problem:** naming git work in engineering's routing line fixed it; the pointer alone did not.
- **The main skill's rule was applied in every run that loaded it.**
- **The pointer loads the main skill for every request,** trivial ones included, in both agents; the sharper description alone kept Claude Code from loading it for arithmetic or a translation, while Codex loaded it anyway.

### The pointer's exception

The pointer in a project's `AGENTS.md` with "any request" against the narrow exception "except a one-line answer that needs no tool and no file, such as arithmetic or a translation", on the current tree (*ran*, 2026-10-11). Six real requests (a commit message, a code review, comparing link checkers, a flaky test, a status update, naming options) and three trivial ones (arithmetic, a translation, "what does HTTP 404 mean? One line"), twice per agent.

| Pointer | Claude Code: real requests | trivial ones skipped | Codex: real requests | trivial ones skipped |
| --- | --- | --- | --- | --- |
| any request | main skill loaded 12 of 12; right 11 | 0 of 6 | loaded 12 of 12; right 12 | 0 of 6 |
| narrow exception | main skill loaded 12 of 12; right 11 | 6 of 6 | loaded 12 of 12; right 11 | 1 of 6 |

- **The narrow exception did not bring back skipping:** every real request loaded the main skill in both agents. The three misses were routing inside the tree: naming options went to understand's naming instead of brainstorm, or stopped at the main skill, and Codex once answered the commit message after loading the main skill.
- **Claude Code honoured the exception** for all three trivial requests; Codex loaded the main skill for most of them anyway, which costs one small read.

## Loading once, using many times

Whether a skill loaded earlier in a conversation is loaded again when it is needed again, and what happens after the conversation is compacted (*ran*, 2026-10-11). The plugin held the current tree (93 skills: the main skill, conduct, engineering, understand, author); the main skill read conduct's answer first, whose rule adds a marker to every answer, and the debug skill asked for steps numbered with Roman numerals. One conversation of seven turns, resumed turn by turn (`claude -p --session-id`, then `-r`; `codex exec`, then `codex exec resume`): a flaky test; another flaky test; a test written first; a commit message; compaction (`/compact` in Claude Code; in Codex the setting `model_auto_compact_token_limit` on that turn, which compacts); a flaky test again; testing in a browser, a skill not used before. Two variants, the skills as designed and the same with "if you already read this earlier in this conversation, do not read it again", twice per agent; eight conversations, 56 turns.

| Turn | Claude Code | Codex |
| --- | --- | --- |
| 1, first request | the main skill through the Skill tool, then 4 files | 5 files, the main skill first |
| 2, the same skill | nothing loaded; right, rule and numerals kept, 4 of 4 | the same, 4 of 4 |
| 3, a sibling skill | only the new skill's file, 4 of 4 | the same, 4 of 4 |
| 4, another branch | routers and skill read (2), or the skill folders searched (2) | read (1), or no skill (3) |
| 6, after compaction | nothing read; rule and numerals kept, 4 of 4 | nothing read (3), re-read (1); kept, 4 of 4 |
| 7, a new skill | only its file (3), or its router and file (1) | only its file, 4 of 4 |

- **Both agents reuse what they read without being told:** neither loaded the main skill again after the first turn, nor any skill or router it had read. The instruction to reuse made no difference.
- **After compaction both kept following the skills,** their rules and the debug skill's numbering included, mostly without reading them again. Claude Code's compaction cut the context from about 30,000 to 3,800 tokens; Codex's from about 21,000 to 15,500. The skills were short and their effects showed in earlier answers; a long skill whose details never appeared in an answer is not tested.
- **Claude Code sometimes searched the skill folders instead of routing:** for the commit message, in 2 of 4 runs it searched them for "commit" and answered from the matching lines, without reading the commit skill's file.
- **Codex answered the commit message without any skill** in 3 of 4 runs, as in the earlier routing tests.
- Claude Code's runs cost US$8.54 in all.

## Following routes, not searching


act's rule, "reach a skill by following its route from the main skill, and read its whole `SKILL.md` before following it; never search the skill folders for keywords", against the same tree without it (*ran*, 2026-10-11). The first four turns of the conversation above, three times per agent and variant; on the fourth, the commit message, Claude Code had searched the skill folders before.

| Fourth turn, the commit message | Claude Code | Codex |
| --- | --- | --- |
| without the rule | searched the skill folders, 3 of 3; once answered without reading the skill | routed, 3 of 3 |
| with the rule | routed through implement and git to the skill, 3 of 3 | routed, 3 of 3 |

All 48 turns reached the right skill. Claude Code's runs cost US$5.26.

## Picking up a changed plugin

A small plugin (a visible skill and one hidden skill holding a code word) installed in an empty configuration folder; the code word was then changed at the source, and each agent asked in a new session after each step (*ran*, 2026-10-11). The Git source was a repository served over HTTP on the same machine, standing in for GitHub.

| Step | Claude Code | Codex |
| --- | --- | --- |
| local folder: source edited | new word at the next session | old word: the plugin was copied |
| local folder: `marketplace upgrade` | (not needed) | old word: it upgrades Git sources only |
| local folder: plugin added again | (not needed) | new word |
| Git: new commit, same version | old word, even after both updates and installing again | new word, next session |
| Git: new commit, version raised | new word after both updates, not after `plugin update` alone | (not run) |

- **Claude Code reads a local plugin in place;** its own message says "edits there take effect at the next session start". From Git it copies the plugin into a folder per version, and updates only when the version rises, after refreshing the marketplace.
- **Codex copies a local plugin** and picks up an edit only when the plugin is added again; **from Git it refreshed the marketplace and the plugin by itself** at the next session.
- **GitHub itself** (a throwaway public repository, since deleted) gave the same results: Claude Code installed from `owner/repo`, cloning over SSH, kept the old word after a same-version commit even after both updates, and took the new one once the version was raised and both updates ran; Codex installed over HTTPS and had the new word at the next session after each commit, raised version or not.
- Not tested: Claude Code installing from GitHub without SSH keys.

## Plugins with nested skills

Whether skillbook's sets can be plugins of their own, each with a listed main skill and hidden skills nested below it, as D152 and D185 describe (*ran*, 2026-10-18, Claude Code 2.1.302 with `claude-opus-5-5` and Codex CLI 0.163.0 with its default model). The earlier tests ran on one plugin; this one ran on two, installed from a local marketplace, and once from a Git source to read files in the real plugin cache.

**Setup.** Two plugins, `alpha` and `beta`, in one marketplace with a manifest for each agent. alpha's main skill is listed; below it sit `plan/`, `plan/steps/`, `plan/detail/` (30,963 characters with two facts buried in it, a code word each) and `review/`, which names `plan-steps` by name only. beta's main skill says: "For a release note, use alpha's plan-steps, through the alpha skill; where alpha isn't installed, write BETA-FALLBACK instead." A control copy of alpha lacked the name rule, worded in alpha as: "Names: a skill named `a-b-c` is the file `a/b/c/SKILL.md` inside this skill's folder; read that file to use it." Every hidden skill carried `disable-model-invocation: true` and an `agents/openai.yaml` with implicit invocation off; Claude Code's `plugin.json` listed the five skill folders, and Codex's pointed at the `skills/` folder. Each variant ran in its own configuration folder (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`) with only the sign-in files copied, deleted afterwards, and each run in a fresh empty folder. Claude Code ran as `claude -p` with the Skill, Read, Glob and Grep tools allowed; Codex as `codex exec --json`. Compaction was `/compact` through a resumed Claude Code session, and in Codex a low `model_auto_compact_token_limit` on the resumed turn. Two runs per cell; Claude Code's cost was about US$3.50 for 23 results. Codex hit an account usage limit for about two minutes; those runs were repeated. The scripts and logs were kept outside the repository, as for the other tests here.

| Case | Claude Code | Codex |
| --- | --- | --- |
| 1, only the main skills listed | pass | pass |
| 2, down the tree to plan-steps | 2/2 | 2/2 |
| 3, name rule present | 2/2, direct reads | 2/2, direct reads |
| 3, name rule absent | 1/2, a search first; one run never opened the child | 2/2, a search first |
| 4, between plugins, both installed | 2/2 | 2/2, by listing files |
| 4, between plugins, alpha missing | 2/2 fallback | 2/2 fallback |
| 5, second buried fact after compaction | 2/2, one search | 2/2, one full re-read, one none |

- **Listing:** the model saw alpha and beta and no nested skill, in both agents, as in the one-plugin tests.
- **Down the tree:** both agents read alpha, then plan, then plan-steps; Claude Code read the 30,000-character plan-detail unprompted in one of two runs.
- **The name rule** let all four runs read the right file at once, with no search. Without it three of four reached the right file, each after a `Glob` or `rg --files` over the folders, and one Claude Code run never opened the review skill's child at all.
- **Between plugins,** told to use the skill "through the alpha skill", Codex found plan-steps by listing alpha's folder in both runs, not by the name rule; the caller's wording did not say to apply it. With alpha missing, all four runs wrote the fallback word.
- **After compaction,** all four conversations answered the second fact of plan-detail correctly. Claude Code found it again with one search, not a full read, and its summary had also written the fact down; Codex re-read the whole file in one run and not in the other.
- **What Claude Code's compaction kept** (resumed sessions, read from the transcripts): a written summary holding the name rule in its own words, a shared rule's marker and the code words; the two small sub-skill files re-attached whole; plan-detail replaced by a note that its contents were too large and to use `Read`. The main `SKILL.md`, loaded through the Skill tool, was not re-attached: its sentence "Names: a skill named" occurs nowhere after the compaction boundary, so only the summary carried its rules.
- **Permissions:** no prompt and no denial in any run (23 Claude Code result events with an empty denial list), including reads in the real plugin cache outside the working folder.
- **The skill tool and a hidden skill:** Claude Code refuses it with "cannot be used with Skill tool due to disable-model-invocation. Ask the user to run /alpha:plan-steps themselves ... Do not replicate this skill's workflow by other means". No real run reached it, since the models read files; an agent that tried the tool first would be pushed away from reading the file.
- **A local-folder marketplace:** Claude Code reads the plugin's files from the marketplace folder, not from its cache copy.
- **Variation:** with two runs per cell, extra reads varied a great deal between runs, so nothing can be ranked finer than pass or fail.

## Flattened reference files

Whether a set's other skills can be plain markdown files under its main skill instead of hidden nested skills, as D188 describes (*ran*, 2026-10-18, Claude Code 2.1.302 with `claude-opus-5-5` and Codex CLI 0.163.0 with `gpt-6.1-sol`, read from its rollout files). Two sets, `essentials` and `blueprint`, each a plugin in a local marketplace with a manifest for each agent; every file but the main `SKILL.md` sat under `references/` at the path its name gives (`references/understand/clarify/deep.md` for `understand-clarify-deep`).

**Setup.** Files of 41 to 56 lines, each with rules, steps, notes, a section near the end naming the next file, and a last line asking for a code word in the answer; no prompt named a file, level or code word. essentials held understand, clarify, deep, organize and merge; blueprint held record and decide. Four marketplaces: flat with the name rule, flat without it, nested (essentials as hidden `SKILL.md` folders with `disable-model-invocation`, `agents/openai.yaml` and a `plugin.json` listing the folders), and flat with a sentence in the name rule telling the agent to read a file again after compaction. Each variant had its own configuration folder with only the sign-in files, deleted afterwards. Claude Code ran as `claude -p` with the Skill, Read, Glob and Grep tools allowed; Codex as `codex exec --json`. For compaction, Claude Code ran `/compact` on a resumed session and Codex a throw-away second turn with `model_auto_compact_token_limit=3000`, then both asked a follow-up that needed a rule buried in the deepest file. Three runs per cell; Codex hit an account usage limit and 28 runs were repeated.

| Case | Claude Code | Codex |
| --- | --- | --- |
| A chain of five files, three levels, flat with the name rule | 3/3, one folder search in one run | 3/3, no search |
| B the same without the name rule | 3/3, each after a search | 3/3, each after a search; 2 wrong path guesses |
| C a jump straight to `organize-merge` | 3/3 | 3/3 |
| D the same chain as hidden nested skills | 3/3, one search in one run | 3/3, no search |
| E blueprint to essentials, first `record.md` | 3/3 | 0/3, stopped at the parent |
| F essentials missing, first `record.md` | 2/2 fallback | 0/2, stopped at the parent |
| E2 blueprint to essentials, corrected `record.md` | 3/3 | 3/3 |
| F2 essentials missing, corrected `record.md` | 2/2 fallback | 2/2 fallback |
| G after compaction, flat | 3/3 rule applied, no re-read | 3/3 rule applied, 3/3 re-read whole |
| H after compaction, with the reload sentence | 3/3 rule applied, no re-read | 3/3 rule applied, 3/3 re-read whole |

- **Chains of plain files work:** with the name rule, every file on the path was read whole, with no offset or limit, and every code word appeared, in both agents. Hidden nested skills behaved the same, so a plain file is followed no less far than a nested skill.
- **The name rule saves a search, not the reach:** without it both agents still found every file, but only after a `Glob` over the skill folder (Claude Code, 3 of 3) or `rg --files` or `ls -R` (Codex, 3 of 3), two Codex runs after a guess at a path that does not exist.
- **A parent that does part of its child's work makes Codex stop at the parent.** In the first E and F runs, blueprint's `record.md` held the drafting steps of `decide.md`; Codex read it, drafted the entry and never reached `decide.md`, essentials' deep file or the fallback (0 of 5). The clarify file also made deep conditional on a broad request, which partly explains the stop there. With `record.md` cut to its shared rules and one line saying when to use `record-decide`, `decide.md` holding the whole method and its call, and clarify's condition removed, Codex went the whole way, 3 of 3, and wrote the fallback marker 2 of 2. Claude Code passed both ways. The F2 Codex runs searched for files by name, once in the plugin folders, and read or loaded no essentials file.
- **Compaction in Claude Code:** after `/compact` the transcript re-attached every file read in the session, whole and equal to the file on disk (five per run, four in one), and the summary also carried the buried rule's label and code word. No post-compaction tool call was made; the follow-up applied the rule exactly in 6 of 6. As in the earlier test, the main `SKILL.md`, loaded through the skill tool, was not re-attached.
- **Compaction in Codex:** the compacted history is one opaque encrypted item, so what it keeps cannot be read. After it the agent read the deepest file again, whole, with `cat` in 6 of 6 runs, with and without the reload sentence, 2 or 3 of them from the main skill down; the rule was applied exactly in 6 of 6.
- **The reload sentence made no difference** with these short files: Claude Code never needed it, Codex read again without it. It is neither shown to be needed nor to do harm.
- **Permissions:** one Claude Code run (G-3) tried a shell `find` and was denied, then used `Read`; no other prompt or denial in any run.
- **Cost:** Claude Code about US$6.0 for cases A to H and about US$1.10 for E2 and F2; Codex's cost is not reported.

**What the test does not show.** Three runs per cell, so pass or fail, not rates; one model per harness; files of 41 to 56 lines, so nothing about long files, and chains of at most seven files; compaction was manual in Claude Code and forced by a low limit in Codex, so an automatic compaction in the middle of real work is untested; every run was non-interactive; the Claude Code runs of A to F were made before the buried rule was added to the files, the Codex runs after; the first A to D runs used a clarify file with the broad-request condition that E2 and F2 removed, and were not repeated; Codex loaded essentials before blueprint on its own in the first E runs. Not tested: files that are optional at each step, deeper chains, and whether the skill list is sent again after automatic compaction (an open Claude Code issue says not, [skill-managers.md](skill-managers.md)).

## Installed by a script

Whether a set installed as a plain folder, by copy or by link, into the agents' skill folders loads as a plugin does, as D189 asks (*ran*, 2026-10-18, Claude Code 2.1.302 with `claude-opus-5-5` and Codex CLI 0.163.0). The script itself is not written; its result was made by hand in a fake home folder for each cell, with only the sign-in files, deleted afterwards. The skill was the flattened `essentials` of the previous section, unchanged: the name rule in `SKILL.md`, five reference files, a request that needs all five, six code words, passing when all five were read and all six words appeared. The set sat in both `~/.claude/skills/essentials` and `~/.agents/skills/essentials`, for the person or for a project, as a real copy or as a link to a store folder (`~/.local/share/skillbook/<version>/essentials`, a `current` link to it).

**Setup.** Claude Code ran as `claude -p` in two ways: permissive, with Skill, Read, Glob and Grep allowed, two runs per cell; and strict, in the default permission mode with only Skill allowed, two runs per cell, where a prompt shows as a refusal because a non-interactive run has no one to ask. Codex ran as `codex exec --json` with its default sandbox. A follow-up, Claude Code strict only, ran two plugin layouts, a local marketplace and a Git one, and settings-file rules for the personal copy.

| Case | Claude Code, reads allowed | Claude Code, default mode | Codex |
| --- | --- | --- | --- |
| personal, link | 2/2 | 0/2, read refused | 2/2 |
| personal, copy | 2/2 | 0/2, read refused | 2/2 |
| project, link | 2/2 | 0/2, read refused | 2/2 |
| project, copy | 2/2 | 2/2 | 2/2 |
| plugin, local marketplace | not run | 0/2, read refused | not run |
| plugin, Git marketplace | not run | 0/2, read refused | not run |
| personal copy, user settings rule | not run | 2/2 (`~` form 1/1, absolute 1/1) | not run |
| personal copy, project settings rule | not run | 0/3 (`~` form 0/2, absolute 0/1) | not run |

- **Every layout loads when reads are allowed:** in both agents all five files were read whole, in order, with no search in Codex, and all six words appeared.
- **Each agent lists the set once** although both folders hold it: Claude Code does not read `~/.agents/skills` and Codex does not read `~/.claude/skills`, shown by installing into one folder only (one run each). Installing into both does not list it twice.
- **The folder the agent is given is the link path,** never the folder it resolves to: Claude Code's "Base directory for this skill" and Codex's skill root table both show the link, and the agents read through it.
- **Codex needed no trust setting** for a project's skills in an untrusted folder, with the link pointing outside it: no approval or sandbox block in four runs.
- **Claude Code's default mode refuses the reference files outside the project,** for a personal copy as well as a link, and for a plugin's files in its cache or in the marketplace folder, exactly as for a personal skill. Only the skill tool's own load of `SKILL.md` is exempt. A project copy passes because the files sit in the working folder; a project link fails because the link resolves outside it. The earlier plugin tests saw no prompt because their allow list granted Read everywhere (*inferred*; they were not rerun).
- **A rule in the user settings removes the refusal:** `Read(~/.claude/skills/**)` passed in its `~` and its absolute form, one run each. The same rule in the project's `.claude/settings.json` did not, in three runs; the cause was not examined, nor whether a rule in `settings.local.json` behaves differently. Command-line forms also worked, one run each: allow rules for a linked store, and `--add-dir`.
- **A refusal is quiet:** in every failing run the agent answered from `SKILL.md` and its own grouping, reached the first code word only, and did not say that files could not be read.
- **Cost:** Claude Code about US$5.4 in all, a little over the planned cap; Codex's is not reported.

**What the test does not show.** One or two runs per cell, so pass or fail, not rates; one model per agent; non-interactive runs, where a prompt counts as a refusal and interactively it would be a prompt, so whether an approval or "always allow" persists is untested; the real script, relative links, a version switch and `--project` as the script will do them are untested, as are Codex's workspace-write and untrusted-approval modes and its prompts in the interactive UI; the settings-file forms were run only for the personal copy, and the store rule for a link only on the command line. Codex's skill roots show the link path, so a retargeted `current` link would take effect without a new install (*inferred*, not run).

## Instruction files

Which instruction files each agent reads, and whether they add to or replace each other (2026-10-12).

- **Claude Code** read a project's `CLAUDE.local.md` together with its `CLAUDE.md`: with a different word in each, asked without reading any file, it reported both (*ran*, one run, Claude Code 2.1.296).
- **Codex** looks in each folder from the project root down to the working folder for `AGENTS.override.md`, then `AGENTS.md`, then any names configured in `project_doc_fallback_filenames`, and takes only the first that exists: an override replaces the shared file in that folder rather than adding to it. In its home folder it reads `AGENTS.override.md` or `AGENTS.md` the same way, as the person's own instructions on top of the project's (Codex source, *summary*).

## Delegating wide reading

Whether handing the reading of many documents to lighter subagents saves cost (*ran*, 2026-10-12, Claude Code with `claude-opus-5-5` as the main agent). Fifty generated meeting notes, about 60,000 words, twelve of them stating a date for a fictional billing cutover in varied words, five of those without the system's name, and five traps. The main agent alone, or five subagents with haiku or sonnet each reading ten files, three runs each.

| Setup | Found | Average cost | Main agent's context at its peak |
| --- | --- | --- | --- |
| alone | 12 of 12, all runs | US$0.21 | about 28,000 tokens |
| five haiku subagents | 12 of 12, all runs | US$0.43 | about 40,000 tokens |
| five sonnet subagents | 12 of 12, all runs | US$1.02 | about 39,000 tokens |

- **The main agent alone searched instead of reading,** with patterns such as "go-live, cutover, Ledgerline, LL", and found every mention; every planted sentence held a searchable word.
- **The haiku subagents' reading cost about US$0.04** for all fifty files; the briefs and reports added about 12,000 tokens to the main agent's context, paid at its price, which doubled the cost.
- So delegating reading saves nothing when a search can narrow the material.

A second test asked which of fifty notes report the project running behind schedule, fourteen phrased each in their own words, with eight traps using "late", "delay" or "deadline" otherwise; three runs alone, three with five haiku subagents told to read in full. All found 14 of 14 with no false finding; alone cost US$0.27 on average, delegated US$0.44. The result does not carry over to real documents: the solo agent found the planted sentences by counting how often each sentence occurred in the generated filler, and once by a phrase the generator put before each of them. What both tests do measure is the overhead of a five-subagent fanout with opus as the main agent: about US$0.35 to US$0.45 for briefing, taking in the reports and consolidating, against about US$0.03 for haiku's reading of all 60,000 words. From that, as an inference not a measurement, delegating reading pays off only when what no search can narrow would cost the main agent more than that overhead to read, very roughly 80,000 to 100,000 tokens at opus prices. A test on a real corpus is left for a real task.

## Reloading after compaction

What survives compaction, and whether the main skill and its three start files can be put back (*ran*, 2026-10-18 and 2026-10-19, Claude Code 2.1.302 with `claude-opus-5-5` and Codex 0.163.0, the built `essentials`, the install script's copy in a fake home, non-interactive runs, compaction forced by a small window). Evidence: [E15](../evidence.md).

- **What compaction keeps in Claude Code:** a summary written by the model, and the last five files read, whole. The main skill, loaded through the skill tool, is not kept, and neither are start files read before the last five. The pointer in the project's instruction file is kept, and the summary usually repeats a reload instruction in the agent's own words. In the baseline no turn after compaction read a start file again, 0 of 8.
- **What compaction keeps in Codex:** the skills list, the user messages, the pointer among them, and one opaque item holding the rest. After compaction one of 11 baseline turns read the main skill again.
- **The pointer's line** ("load it again whenever its text is no longer in view, such as after compaction"): Claude Code reloaded the main skill and the three group files in 1 of 1 chain at a 20,000-token window, then in 0 of 3 chains at 52,000, each summary carrying the instruction and the agent answering with no tool call; at 36,000 one replay loaded the main skill and a second compaction came before the group files. Without the pointer, 0 of 2. Codex reloaded the main skill in 3 of 3 pointer chains and the group files in 2 of 3, against 0 of 2 without. A small window makes the reload itself trigger more compaction, so the counts at a real window are unknown.
- **What a `SessionStart` hook does:** with the matcher `compact` it fired after automatic compaction, and in a session resumed non-interactively, once per compaction, with the hook's output added to the context as an attachment after the summary and the re-attached files. It did not fire on earlier turns. The hook's `$HOME` was the run's own home, so `cat "$HOME/.claude/skills/essentials/SKILL.md"` needed no absolute path.
- **Limits on a hook** (*summary*, Claude Code's hooks documentation, not re-read when this was written): each output is capped at 10,000 characters, and a hook in a skill's frontmatter registers only after the skill is invoked, so a hook meant for compaction goes in the user settings.
- **One hook printing the main skill:** its text was in the context in 2 of 2 runs. The group files were read again in 1 of 2, and 0 of 3 in the earlier runs with the pointer and no hook; with two runs, that is not shown to be an effect.
- **Four hooks, one per start file** (6,104, 3,731, 7,816 and 5,682 bytes, 23,333 together, each under the cap): all four outputs arrived whole in 2 of 2 runs, run in parallel in 5 to 7 ms, in a different order each time. Nothing was read again, and the next response followed respond's rules in both.
- **The cost of the four hooks:** about 23,300 characters, roughly 5,800 tokens at 4 characters per token (*inferred*), added again at each compaction. Whether the token count Claude Code reports after compaction includes it was not checked.
- **Codex** needed no hook in these runs: the pointer in its retained user messages was enough.

**What the tests do not show.** Two runs per hook arrangement; no run without hooks in the four-hook test; a commit-message request as the final turn, too small to separate reload from no reload by answer quality; forced windows of 20,000 to 52,000 tokens; non-interactive runs, so an interactive session and a manual `/compact` are untested; one model per agent.

## How Codex asks questions

Why Codex asked one unnumbered question, in prose, where Claude Code put a numbered round under headings (*read*, 2026-10-18, codex-cli 0.163.0: the source at tag `rust-v0.163.0`, and the model catalog the program caches on the machine, which holds the instructions the GPT-6 models are sent; the model of the failing runs was not recorded, and `gpt-6.1-sol` is the machine's default). The cause is read, not reproduced.

- **Codex's own instructions outrank a skill's.** The default mode says to strongly prefer reasonable assumptions over stopping to ask. The base instructions say to bias towards action, that the user is frustrated by needless confirmation, and to bundle the most critical freeform questions into one question. For some models they say to write connected prose and to avoid section headings. A skill's instruction wins over these mostly where it states an explicit requirement.
- **The question tool is limited.** `request_user_input` works only in Plan mode by default and takes one to three questions. `codex exec` rejects it, so a scripted run has no working way to ask. An asynchronous question tool exists for some models; what it does in `codex exec` was not read.
- **The format ask asks for** (a round of numbered questions, each under its own heading) therefore met Codex's instructions head on in 0 of 7 runs as first counted. A test of ask's Codex file belongs in a normal interactive Codex session, not in `codex exec`.
- **Tables:** nothing in the instructions opposes a wide table, which fits the table rows of 152 to 191 characters.

## Gaps

- **Long sessions:** every run was a fresh, short session. mattpocock/skills reports skills named by other skills not loading in practice ([mattpocock-skills.md](mattpocock-skills.md), 2.6); runs this short cannot show it.
- **One model per agent,** one or two runs per case: enough to show what is possible, not a rate.
- **Reloading after compaction, not tested:** an interactive session or a manual `/compact` with the hooks; a realistic window instead of a forced small one; a control run without the hooks in the four-hook arrangement; answer quality with and without the hooks, on a task that needs respond's or ask's rules; Codex's compaction with hooks.
- **Not tested:** trees deeper than five levels, or wider than one branch per level; skills.sh; whether Codex picks up an edited local plugin without a reinstall; Claude Code's `paths` and `context: fork` fields; symlinks inside a plugin (Codex's source drops them, *summary*).

## Sources

- Claude Code: [skills](https://code.claude.com/docs/en/skills), [plugins reference](https://code.claude.com/docs/en/plugins-reference), read 2026-10-10.
- Codex: [skills](https://learn.chatgpt.com/docs/build-skills), [plugins](https://developers.openai.com/plugins/build/plugins), and `openai/codex` at commit `806d973`, read by a research agent 2026-10-10.
- [Agent Skills specification](https://agentskills.io/specification).
- The test skills, scripts and logs were kept outside the repository; they can be added if the runs are to be repeated on new versions.
