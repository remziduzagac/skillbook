# Guideline: hierarchical agent skills

Source material for the agent that writes the skill teaching how hierarchical agent skills work and how to organise them. It collects what skillbook's blueprint knows, each statement with its source, so nothing has to be found again.

## How to read this guideline

Every statement is one of three kinds, and the label is part of the statement.

- **Platform fact.** Tested or read about Claude Code 2.1.296 and Codex CLI 0.160.0, as recorded in [../research/skill-loading.md](../research/skill-loading.md) ("loading" below). Marked **Fact**, with the section of that file. *Ran* means tested by running both agents; *summary* means read in their documentation or source, not run. Other agent versions may differ. A skill that teaches this must say which versions the facts hold for.
- **Convention.** Something skillbook chose, with its decision number from [../decisions.md](../decisions.md). Marked **Convention (Dn, provisional)**. skillbook's initial design is open (D27), so every convention can change. A skill must present conventions as "skillbook does this" and never as "the platform requires this".
- **Outside practice.** What another collection does or advises, mostly mattpocock/skills, with its section. It is evidence to weigh, neither a platform rule nor a skillbook choice; where it was not tested here, it says so.
- **Not verified.** Needed, but in none of the sources. Collected in the last section. Do not turn these into facts.

Other sources: [../research/skill-writing-guides.md](../research/skill-writing-guides.md) ("guides"), [../research/mattpocock-skills.md](../research/mattpocock-skills.md) ("mattpocock"), [../design/how-it-works.md](../design/how-it-works.md) ("how-it-works"), [../ideas/skill-tree.md](../ideas/skill-tree.md) ("tree") and [../ideas/open.md](../ideas/open.md) ("open").

## Why a hierarchy

- **Fact:** The skill list is the only per-turn cost, and only model-invoked skills are in it. A user-invoked skill is absent from the list in both agents (loading, Summary and "What the model sees", *ran*).
- **Fact:** Claude Code cuts each description, with `when_to_use`, at 1,536 characters (loading, "What the model sees", *summary*). Codex gives the whole list 2% of the context window, or 8,000 characters when the window is unknown; it shortens descriptions first, then drops skills beyond the budget (same section, *summary*).
- **Fact:** `claude plugin details` reports about 30 tokens "always-on" for a user-invoked skill that the model's list does not contain. Its estimate is wrong for such skills (loading, "What the model sees", *ran*).
- A flat set of many model-invoked skills pays for every description on every turn, and on Codex may lose skills to the budget. A tree lists only its roots and reaches the rest by loading, so the cost stays small however large the tree grows. mattpocock calls this trade context load (always-loaded text) against cognitive load (the person must remember what exists) (mattpocock, 1.2).

**Worked cost example.** The figures below are arithmetic on sourced numbers; the characters-per-token ratio is an estimate made in mattpocock (2.2), not a measurement.

| Case | Listed descriptions | Characters at the median, 156 | Tokens, about 4 characters each |
| --- | --- | --- | --- |
| skillbook as a flat set, all model-invoked | 87 | about 13,600 | about 3,400 |
| skillbook as designed, the main skill only | 1 | about 620 (its tested description) | about 155 |

- The median 156 and maximum 417 are those of mattpocock's model-invoked descriptions (mattpocock, 2.2). The count 87 is the main skill, conduct and four roots, and the 81 skills below them (tree, "Counts"); the main skill's description is the one tested in loading, "Making the main skill load".
- On Codex with an unknown window, the 8,000-character budget is below the flat set's 13,600 characters, so descriptions would be shortened and some skills dropped (loading, "What the model sees", *summary*). Skillbook as designed fits with room to spare.
- **Convention (D48, D56, D59, provisional):** one main skill listed to the model, above conduct and four roots. The price of each layer: "a request under a group takes one more load than before" (tree, "The shape").

## Kinds of skill

| Kind | Listed every turn | Invoked by | Loaded by | Source |
| --- | --- | --- | --- | --- |
| Root | yes | the model, or the person | the Skill tool, or typing its name | how-it-works |
| Sub-skill | no | the person typing it, or a parent | its path, read by the parent | how-it-works |
| File | not a skill | nobody | a link from the skill using it | how-it-works |

- **Convention (D38, D43, D44, provisional):** the three kinds above. A root is model-invoked and routes to its sub-skills. A sub-skill is user-invoked only, so it costs nothing until used, and may have sub-skills of its own. A file sits in `references/`, `scripts/` or `assets/` and is linked directly from the skill that uses it. Depth comes from sub-skills with their own `SKILL.md`, never from chains of reference files (how-it-works, "Kinds of skill").
- **Convention (D56, D63, provisional):** above the roots sits one main skill, the only model-invoked skill. It routes to the roots after loading the rules every skill follows, which live in a group of their own (conduct) and are read by path, so the group costs no extra load. **Fact:** one visible main skill reached the right skill at least as often as six or thirteen visible roots, and applied its rule whenever it loaded (loading, "Top-level shapes", *ran*). **Fact:** Claude Code answered a third of requests without any skill until the main skill's description told it to load it first, or a line in `AGENTS.md` did (loading, "Making the main skill load", *ran*); skillbook uses both (D57, provisional).
- **Fact:** How to make a skill user-invoked differs by agent. Claude Code: `disable-model-invocation: true` in the frontmatter. Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (loading, "What the model sees", *ran*; mattpocock, 2.1 and 2.4).
- **Fact:** A model-invoked skill is listed in both agents, and the model loads it. A user-invoked skill typed by the person works: `/name` and `/plugin:name` in Claude Code, `$name` and `$plugin:name` in Codex (loading, "What the model sees", *ran*, 1/1 each).
- **Fact:** `user-invocable: false` (Claude Code only) is a different setting: the skill is listed and the model loads it, but typing its name does nothing (loading, "What the model sees", *ran*, 5 of 5). It does not hide a skill from the list; do not teach it as a way to save context.
- **Outside practice (mattpocock):** mattpocock/skills makes its flows user-invoked and the disciplines they call model-invoked, and states "A user-invoked skill may invoke model-invoked skills, but never another user-invoked one" (mattpocock, 2.1). skillbook inverts this: its sub-skills are user-invoked and are loaded by path, which the tests show works (see the next section). Present mattpocock's rule as a different choice.

## How one skill calls another

### By path

- **Fact:** A user-invoked skill is loaded by reading its path, never through the Skill tool. Reading `../quill-child/SKILL.md`, a sibling folder, worked 8 of 8 across both agents, in a project and in a plugin; through the Skill tool it loaded 0 of 8. Claude Code refuses with: "cannot be used with Skill tool due to disable-model-invocation. Ask the user to run /quill-child themselves." (loading, Summary, "Skill to skill" and "Namespaces and plugins", *ran*).
- **Fact:** Other wordings sometimes reached a user-invoked child: in Codex, no name, a bare name and `$name` 2 of 2, `/name` 1 of 2; in Claude Code, only a bare name, 2 of 2. Those passes came from the agent searching the disk, which works only because the test skills sat in the project; a plugin install keeps them elsewhere (loading, "Skill to skill", *ran*). For a user-invoked target, write the path.
- **Fact:** Relative links resolved from the child's folder; chains start, mid, leaf worked 2/2 in each agent; a sub-file that itself calls a skill worked 2/2 each (loading, "Skill to skill", *ran*).
- **Fact:** In the deep-tree test, run inside a plugin, each router read the next by path and the answer carried the root's rule. Claude Code loaded the root with the Skill tool and read each lower level with the shell; Codex read each `SKILL.md` and `CODE.md` in order (loading, "Deep trees", *ran*).

### By name

- **Fact:** A model-invoked target loads under every wording tested, from a bare name to "Call the Skill tool with", 12 of 12 runs per agent (loading, Summary and "Skill to skill", *ran*).
- **Fact:** A skill that is not installed: the agent says it is missing (loading, "Namespaces and plugins", *ran*).
- **Outside practice (mattpocock, not tested here):** mattpocock reports that "A skill that names another skill does not reliably cause that skill to load", and that the explicit "Call the Skill tool with" wording was the fix meant to raise the hit rate (mattpocock, 2.6, citing its own docs and changelog). Loading Gaps says the short fresh sessions tested cannot show this. So: write an explicit instruction at the step that needs the skill, not a mention.

### What the instruction should look like

- **Convention (D38, provisional):** The call sits at the step that needs it, as a plain instruction naming the path. mattpocock's advice carries over as reasoning, not as a tested rule for paths: "The pointer's wording, not its target, decides when the agent reaches the material" (mattpocock, 1.1).
- mattpocock's inference for sub-files (not tested for paths): an explicit "Read X before step 3" beats "see X" (mattpocock, 8.4, marked inference there). loading adds one data point: a strong pointer ("read `CODE.md`: it holds ...") and a weak one ("See CODE.md for details") each loaded 1/1 per agent (loading, "Nesting and files", *ran*). Both worked; the sample is too small to rank them.
- Say where control returns: end a sub-skill on what comes next in the parent, so the agent does not treat the end of the sub-skill as the end of the task (mattpocock, 8.5, marked inference there).
- Loading a sub-skill inline is not a context boundary. It does not stop an agent rushing the step in front of it (mattpocock, 1.4 and 1.5). A phase that needs a fresh context goes to a subagent (mattpocock, 8.6).

## Names and namespaces

- **Fact:** A plugin's namespace has one level: the plugin's name. Every skill in plugin `skillbook` becomes `skillbook:<name>`; a bare name also works when no other skill has it (loading, Summary, *ran*; Claude Code docs, *summary*).
- **Fact:** Agents in a Claude Code plugin may nest (`plugin:group:agent`); skills may not (loading, "Namespaces and plugins", *summary*). The Agent Skills specification forbids `:` in a skill's own name and has no grouping (same section, *summary*). The tree therefore cannot live in the namespace.
- **Fact:** A nested skill's name is its frontmatter `name` under the plugin, such as `sb:ugo-lat-ner-vix`. The folder path does not appear in it (loading, "Deep trees", *ran*).
- **Fact, clashes:** With a project skill of the same name, a bare-name call reaches the project skill, even when the call comes from inside the plugin, 2/2 in each agent; typing the clashing bare name does the same. The full name `plugin:name` always reaches the plugin's own skill (loading, Summary and "Namespaces and plugins", *ran*). In Codex a bare `$name` selects a skill only when the name is unique (same section, *summary*).
- **Fact:** A plugin skill calling its sibling by bare name worked 2/2 in each agent; the full name worked 1/1 each; a call into another plugin by bare name worked 2/2 each (loading, "Namespaces and plugins", *ran*).
- **Convention (D43, D71, provisional):** A skill's folder is short, and its `name` is the folder path below the main skill's folder joined by dashes: the name of `skills/skillbook/design/start/` is `design-start`; the main skill, in `skills/skillbook/`, is named `skillbook`. This keeps names unique in the one-level namespace while the repository shows the tree (D43, "Why").
- **Convention (D40, provisional):** Skills you do take bare verbs; groups and subjects take nouns (how-it-works, "Names").
- **Trade-off:** every name is the whole path below the main skill, so deep names grow: `maintain-repo-close-gaps` (tree). The cost is typed length in the slash menu and characters in every pointer; the gain is uniqueness and sorting under the parent. Each group layer adds to every name below it, one reason skillbook has none (D76).
- **Convention (open):** Calls by full name, `skillbook:<name>`, so that a personal skill of the same name never catches the call, is an idea, not a decision (open, "skillbook as a whole"). It is supported by the clash fact above. Sub-skills loaded by path avoid the question for sub-skills; the question remains for calls between roots.

## Folder layout

- **Convention (D43, D44, provisional):** Each skill is a short folder inside its parent's. Its `SKILL.md` is the only file at its top. Beside it: `references/` (read), `scripts/` (run), `assets/` (copied out), and the sub-skill folders. No sub-skill may take one of those three names. Which files a skill needs is decided when it is written (decisions D44; tree, "The tree").
- Reason given: the folder reads at a glance, and the three names are the ones the Agent Skills specification names, so other tools can read it (D44, "Why").
- **Convention (D43, provisional):** The repository tree and the installed names differ. Inside the repository a name no longer matches its folder, which a strict Agent Skills validator flags; installed flat, it matches again (D43, "Why").
- **Fact:** Claude Code and Codex register a skill by its frontmatter `name`, so a plugin needs no renaming (D43 cites loading, "Deep trees", *ran*).

### Guidance on what goes where

- A reference file is one level from the skill that uses it. Anthropic: nested references may be read only partly; mattpocock's flat sub-files are at most two hops deep (guides, Summary; mattpocock, 3.4).
- **Outside practice (mattpocock, 2.7 and 8.11):** never link from one skill folder into another's files (`../other-skill/FILE.md`), because installers such as skills.sh copy one skill at a time and Codex drops symlinks; reach another skill's material through the Skill tool instead.
- **Fact:** Inside a whole plugin, reading another skill's `SKILL.md` by a relative path works: a sibling (`../quill-child/SKILL.md`, 2 of 2 in each agent) and the root above (`../../SKILL.md` and deeper, in the deep-tree test) (loading, "Namespaces and plugins" and "Deep trees", *ran*). Not tested: an install that copies or links skills one at a time.
- So a parent reading its own child (`start/SKILL.md`) is safe wherever the parent's folder is installed whole. A call into another subtree's user-invoked skill is not settled; see "Disagreements" 11.
- A shared rule that several sub-skills need lives in the parent's `SKILL.md` or `references/`. In the deep-tree test each node below the root first read the root when its rule was not loaded (loading, "Deep trees", *ran*).
- Size targets seen in a real set: `SKILL.md` median 71 lines, range 7 to 170; Markdown sub-files median about 46 lines (mattpocock, 8.30). Anthropic: `SKILL.md` under 500 lines (guides, "Side by side"). **Convention (D38, provisional):** a file over 100 lines opens with a table of contents.
- Say once, in each main `SKILL.md`, that its paths are relative to the skill's own folder; relative links resolved from the reading skill's folder in the tests (loading, "Skill to skill", *ran*), and deeper trees make the question easy to get wrong (mattpocock, 8.8).

## How a main skill is written

All of this is **Convention (D38, provisional)**, drawing on three outside guides that agree on the points below (guides, Summary). Where the guides disagree, say so; the main disagreement is on evaluation (Anthropic wants it first; mattpocock: "There is no automated eval").

- **Rules, then one flow.** A main skill holds its rules and one full flow over its sub-skills, as clear procedures in natural language (how-it-works, "How a skill is written").
- **Named steps.** Each step has a heading with a meaningful name. superpowers forbids "labels without semantic meaning (step1, helper2)" (guides, Summary).
- **Plain conditions that point to a named step**, such as "Problems send it back to Discuss and decide". Anthropic's form: bold question, arrow, named workflow (guides, "Side by side").
- **Entry points.** A request enters at the step it fits and continues from there (D38). The skill says so once at the top.
- **"Done when".** Every step ends on a condition that tells the agent the work is done, or on what comes next. The strongest are checkable and exhaustive: "every modified model accounted for" beats "produce a change list" (mattpocock, 1.4). A vague end invites premature completion (same).
- **Sub-skill by branch.** Inline what every branch needs; push behind a pointer what only some branches reach (mattpocock, 1.3 and 8.2). A step whose logic grows complicated moves into a sub-skill (D38). A sub-skill exists because some runs skip it; if every run needs it, it stays in the parent.
- **Split by sequence** only where the steps after one tempt the agent to rush it, and note the split helps only across a real context boundary such as a subagent (mattpocock, 1.4 and 1.5).
- **Diagrams** only where a step is easy to get wrong: non-obvious decisions, loops where the agent might stop early, A-versus-B choices (guides, Summary, superpowers). Keep them simple, in plain text (D38; tree, "design's flow").
- **Checklists.** A long flow offers a checklist the agent copies and ticks off (D38; Anthropic, guides, Summary).
- **Positive wording; explain why.** Save capitals for real guardrails; a prohibition earns its place only when it cannot be phrased positively (guides, Summary; mattpocock, 1.6).
- **Descriptions.** A root's description is a context pointer: what it is, then "Use when" and one trigger per branch, with the leading word first (mattpocock, 1.1 and 2.2). A root's description is the only listed pointer for its whole subtree, so it must name every branch a sub-skill serves (mattpocock, 8.1, marked there as a lesson for hierarchy). A user-invoked skill's description is human-facing: a one-line summary without trigger lists (mattpocock, 2.2, as his style).
- **Router drift.** A parent's summary of a child is for orientation only; read the child before acting on it or telling the person what it does (mattpocock, 2.5, the `ask-matt` fix). Update the parent whenever a child is added, renamed or removed (same).
- **Harness-neutral text.** No tool names other than the generic "Skill tool" in text meant for both agents (mattpocock, 1.9 and 8.26).

## Where a skill lives

- **Convention (D39, provisional):** A skill sits where the knowledge it needs lives and where the flow that calls it most runs; other roots point to it. Example: design keeps its review, check and publish sub-skills because they need the design's whole context; prototype stays under implement, which holds the knowledge of making things.
- **Convention (D76, provisional):** no group layers: the seven lifecycle stages are roots under the main skill, which holds their order; knowledge and routines are set aside for later (how-it-works, "The roots").
- **Convention (D46, D47, provisional):** A flow skill calls its recording sub-skills. design's main skill is the flow; the steps that record (start, discuss, decide, write and the rest) are its own sub-skills, and they file their result in a project's `blueprint/` folder and are skipped where there is none. No blueprint sub-skill sits between, so one fewer level is loaded (D47, "Why").
- **Outside practice (mattpocock, 8.28 and 8.11):** a primitive used by several main skills should be a registered, callable skill of its own, not a file copied into each. In skillbook's tree many such primitives are user-invoked sub-skills of another root (`conduct-delegate` is called from design, implement, understand and test), which is the open question in "Disagreements" 11. The calls are listed in tree, "The graph".

## Worked example: a three-level slice

Taken from the sample tree (tree, "The tree" and "design's flow"). It is a sample, not a decision: "Nothing in this file is decided unless it cites a decision" (tree, opening). The skills below are not built.

### The slice

```text
skills/
└── skillbook/                        main skill    name: skillbook                  (model-invoked)
    └── design/                       root          name: design                     (user-invoked)
        └── start/                    leaf          name: design-start               (user-invoked)
            └── SKILL.md
```

Names count from below the main skill's folder (D43, D71, provisional).

### Frontmatter

Fields `name`, `description`, `disable-model-invocation` and `policy.allow_implicit_invocation` are in the sources. Whether the model-invoked main skill needs any `agents/openai.yaml` is not: see "Not verified".

```yaml
# skills/skillbook/SKILL.md : the main skill, the only one listed every turn
---
name: skillbook
description: "Load this first for any piece of work, before answering: it holds the rules every answer follows and
  routes to the skill for the job. Covers designing, planning, implementing, git commits, ..."
---
```

The main skill's description is the one tested in loading, "Making the main skill load", shortened here. It is quoted because it holds a colon and a space; an unquoted one made six skills invisible to skills.sh (mattpocock, 1.9 and 8.25).

```yaml
# skills/skillbook/design/SKILL.md : a root, hidden, reached through the main skill
---
name: design
description: "Design: shaping what to make. Use when an idea needs a design, a project has a blueprint, or a design
  needs reviewing or updating from the code."
disable-model-invocation: true
---
```

```yaml
# skills/skillbook/design/start/SKILL.md : a leaf
---
name: design-start
description: "A blueprint started, or an existing project described into one."
disable-model-invocation: true
---
```

For Codex, each user-invoked skill needs this beside its `SKILL.md`:

```yaml
# skills/skillbook/design/agents/openai.yaml, and the same in design/start/
policy:
  allow_implicit_invocation: false
```

- The hidden skills' descriptions are drafts from tree; they have "Use when" in them, which mattpocock strips from user-invoked descriptions (mattpocock, 2.2). The two sources differ here; in skillbook they are read by the routing skill above them. The leaf's is a short human-facing summary in mattpocock's style.
- `agents/openai.yaml` and D44 conflict; see "Disagreements".

### A few lines of the procedure

A sketch of how the root loads its sub-skill, and how the sub-skill loads its leaf, by path. The wording is illustrative, not tested; it follows the D38 shape and the path route the tests support.

```markdown
## Design

Use when the request is to shape what to make. Read `design/SKILL.md` and follow it from the step the request fits.
Done when the design is written and reviewed; then continue at Plan.
```

```markdown
## Frame

Find out what is to be designed and why: the goal, the constraints, what is out of scope. When a blueprint exists,
read `start/SKILL.md` and follow it, so the idea is recorded. Done when the goal and the scope are written down.
Then analyse.
```

The second block uses the step shape of tree, "design's flow" (Frame, then "With a blueprint, record the idea").

## Registering nested skills

- **Fact:** Claude Code scans one level of `skills/`. A nested `SKILL.md` (`quill-outer/quill-inner/SKILL.md`) is not in its list, in a project or a plugin; Codex registers it as `quill-inner`, or `qp:quill-inner` in a plugin (loading, "Nesting and files", *ran*; plugins reference, *summary*).
- **Fact:** With `plugin.json` listing every skill folder, all four nested skills registered in both agents. With no `skills` field, or only the top folder listed, Claude Code registered the top one only and Codex all four (loading, "Deep trees" table, *ran*).
- **Fact:** `plugin.json`'s `skills` field makes no difference for a flat `skills/<name>/` layout: absent, `[]`, a list and a directory each loaded the skill once in both agents (loading, "Nesting and files", *ran*). The sources disagree on meaning: Claude Code's documentation says the field adds to `skills/`; Codex's source says it replaces it; an empty list did not show which (same section, *summary*).
- **Fact:** Codex registers nested skills whatever the list says, so a sub-skill kept out of its list must be hidden with the Codex setting (`agents/openai.yaml`) as well as Claude Code's. A user-invoked skill was absent from both lists in a project and in a plugin (loading, "What the model sees", *ran*); whether that held for unlisted nested folders in Codex is not stated (see "Not verified").
- **Convention (D43, provisional):** `plugin.json` lists every skill folder. A check script verifies that each name equals its path joined by dashes and that `plugin.json` lists exactly the folders that hold a `SKILL.md` (decisions D43; open, "plugin.json with nested folders").
- **Outside practice (mattpocock, 8.21):** also check frontmatter YAML validity, that `openai.yaml` and frontmatter agree, and that every sub-file is linked from its parent. "An unlinked sub-skill is invisible to the agent." A real set shipped a YAML error and an orphan file because it had no such checks (mattpocock, 1.10).
- **Fact:** A local marketplace is read in place by Claude Code and copied by Codex into `plugins/cache/<marketplace>/<plugin>/<version>/` (loading, "Namespaces and plugins", *ran*). How machines where skills are edited install them is open (how-it-works, "Installing").
- **Convention (D74, provisional):** every machine installs the plugin; machines where skillbook is developed install the working copy as a local plugin. The link script that installed each skill flat (D43) is dropped.
- **Convention (D67, provisional):** skills that only one repository needs, such as skillbook's own rules for its tree, are project skills in that repository (`.agents/skills/` for Codex, `.claude/skills/` for Claude Code), never in the plugin. **Fact:** both agents load project skills from those folders; the project skill wins a bare-name clash (loading, "Namespaces and plugins", *ran*). Linking one folder to the other is not tested.

## Claude Code and Codex compared

| Topic | Claude Code | Codex | Source |
| --- | --- | --- | --- |
| Hide a skill from the model | `disable-model-invocation: true` | `policy.allow_implicit_invocation: false` | loading |
| Nested `SKILL.md` | ignored unless `plugin.json` lists it | registered whatever the list says | loading |
| Plugin `dependencies` | installed too | ignored | loading |
| Description limit | 1,536 characters each | 2% of window for the list | loading |
| Local marketplace | read in place | copied to a cache | loading |
| `user-invocable: false` | listed, not typeable | not covered | loading |
| Arguments after a name | `$ARGUMENTS`; a mode in text works | no arguments; text is prompt | loading |
| Skill tool on a user-invoked skill | refused, 0 of 4 | did not load, 0 of 4 | loading |

- All rows are **Fact** from loading ("What the model sees", "Namespaces and plugins", "Nesting and files"). The `dependencies` row: `qa` declaring `dependencies: ["qb"]` caused `qb` to install in Claude Code, 2/2; Codex ignored it, 0/1 (loading, table). The Codex "no arguments" statement is *summary* (source); the mode test passed 2/2 in each agent with the mode named in the request, without `$ARGUMENTS`.
- Claude Code's `init` event lists what a user can type, not what the model sees; to see the model's list, ask the agent to copy it, or use Codex's `codex debug prompt-input` (loading, Setup).

## Pitfalls

- **Treating mattpocock's habits as platform rules.** His user-invoked-calls-model-invoked rule is a choice (see above).
- **Calling a user-invoked skill through the Skill tool.** Refused in Claude Code every time (loading, *ran*). Load it by path.
- **Relying on the agent to find a skill on disk.** It worked only because test skills sat in the project (loading, "Skill to skill").
- **Expecting folder nesting to register in Claude Code.** Unlisted, it is ignored (loading). Codex registers it, so a sub-skill that is not hidden there appears in the list.
- **A bare-name call where a personal or project skill has the same name.** The project skill wins (loading).
- **Names that do not match the path.** The check script exists for this (D43).
- **Duplicated rules across levels.** A sub-skill must not restate its parent; duplication raises the rule's prominence and drifts (mattpocock, 8.18).
- **Chains of reference files.** Depth comes from sub-skills (D38, how-it-works).
- **Orphan files.** A file nothing links to is invisible; mattpocock's `teach/GLOSSARY-FORMAT.md` is one (mattpocock, 1.10).
- **Skills named by other skills may not load in long sessions.** Untested here (loading, Gaps; mattpocock, 2.6).
- **Descriptions with an unquoted colon and a space** invalidate the YAML (mattpocock, 1.9).
- **Dependence on tool names.** Keep text harness-neutral (mattpocock, 1.9).

## Disagreements and conflicts in the sources

1. **Depth.** D21 says "two levels deep by default"; loading shows trees five levels deep working in both agents (loading, "Deep trees"). mattpocock advises depth 2 by default and 3 for rare branches, marked inference (mattpocock, 8.7). D21 is amended by D38 (sub-skills may nest); the depth default is not restated in D38.
2. **Files named `SKILL.md`.** D21 says no file in a skill folder is named `SKILL.md` apart from the main one; D38 and D43 make sub-skills with their own `SKILL.md`. D21 is amended, but its sentence still stands in [../decisions.md](../decisions.md).
3. **Only `SKILL.md` at the top (D44) against `agents/openai.yaml`.** mattpocock puts `agents/openai.yaml` beside every `SKILL.md` (mattpocock, 2.4), and Codex needs it to hide a skill (loading). D44's top level lists only `references/`, `scripts/`, `assets/` and sub-skills. **Convention (D79, provisional):** resolved: a hidden skill's folder also holds `agents/openai.yaml`, written by a script from the hidden flag in `SKILL.md` and checked, and `agents` never names a sub-skill. **Fact (Codex source, *summary*):** the folder and file names are fixed, any folder named `agents` in a skill is read as its settings, and `SKILL.md` gives Codex only `name`, `description` and a short description.
4. **User-invoked skills calling user-invoked skills.** mattpocock forbids it (2.1); skillbook's design relies on it (how-it-works), and loading shows path loading works (8 of 8).
5. **Descriptions for user-invoked skills.** tree gives parts such as design a "Use when" trigger description, read by the root that routes to them; mattpocock strips triggers from user-invoked descriptions (2.2).
6. **Folder naming.** open ("Sub-skill names and folders") proposed folders named by full name; it says "Settled differently: short folders" (D43). Follow D43.
7. **Codex `skills` field.** Claude Code's documentation says it adds to `skills/`, Codex's source says it replaces it; an empty list did not show which (loading, "Nesting and files").
8. **Calling by name.** mattpocock tells skills to call others by the Skill tool and reports unreliable loading anyway (2.6); loading shows 12 of 12 for model-invoked targets in short sessions (loading, Summary). Both can be true; long sessions are untested.
9. **Evaluation.** Anthropic wants evaluations first; mattpocock says "There is no automated eval" (guides, Summary). open lists evaluation first as an open question.
10. **A tested number against a decision.** No decision found contradicts a tested fact. D21's depth and `SKILL.md` sentences are superseded in spirit by D38 and D43, as above.
11. **Calls into another subtree's sub-skill.** skillbook's graph has skills calling user-invoked sub-skills of other roots (tree, "The graph"). The Skill tool refuses them (loading), so the only tested route is a relative path into the other root's folder, which worked inside a whole plugin (loading, "Namespaces and plugins") and which mattpocock rules out because installers copy one skill at a time (2.7, 8.11). With every machine installing the whole plugin (D74), such paths stay inside one installed tree. The routes are a path across folders, making the shared skill model-invoked (mattpocock, 8.28; one more listed description), or calling the other root, which then routes. **Convention (D51, provisional):** for understand (think until D52), the last: other roots call it by name and it routes. For other roots no decision is made yet.

## What is still open

From open and the decisions; none of these is decided.

- Calls between roots by full name `skillbook:<name>` (open, "skillbook as a whole").
- How a skill reaches a user-invoked sub-skill of another root, beyond understand (D51) ("Disagreements" 11).
- Where Codex's `agents/openai.yaml` goes under D44 ("Disagreements" 3).
- Evaluation first: how skills are tested before and after writing (open).
- Installing from GitHub without SSH keys in Claude Code (D75).
- Partial installation: a skill that calls one not installed (open).
- How each lifecycle stage serves work other than software; where an activity meets a subject ("review my essay") (tree, "The shape" and "Questions for the brainstorm").
- Whether names skip the group (tree, question 7).
- Which roots to list besides the six: `markdown-style` and `agent-writing` (tree, question 4).
- The other flows, drawn like design's (tree, question 9).
- Trees deeper than five levels or wider than one branch per level; long sessions (loading, Gaps).
- The design is open (D27): every convention above can change.

## Not verified

Not found in the sources. Do not state as fact; check or mark as unverified in the skill.

1. The exact `plugin.json` syntax for a nested folder list. loading shows lists such as `["./skills/quill-child"]` and `["./skills/"]`, and "lists every skill folder"; the exact paths for nested folders are not given.
2. Whether a model-invoked root needs `agents/openai.yaml` (mattpocock has one beside every skill; loading does not say it is needed).
3. Whether a Codex skill hidden by `allow_implicit_invocation: false` can sit in a nested folder that is unlisted; loading tested registration and hiding separately. Treat the combination as untested.
4. Whether `name` must equal the folder name in either agent. The specification asks for it (open), D43 says a strict validator flags the mismatch, and loading shows the mismatched nested names registered.
5. The exact token cost per description (name plus description plus any fixed list overhead). Only the characters per description and an estimate of 4 characters per token appear.
6. How the agent finds a relative path when a sub-skill is read from the plugin cache. The deep-tree test passed inside a plugin, but loading does not say how the base folder is resolved.
7. Whether `$ARGUMENTS` or `argument-hint` matter for sub-skills; only the mode test appears.
8. Whether the hierarchy loads reliably in long sessions (loading, Gaps).
9. The Claude Code field names beyond `disable-model-invocation`, `user-invocable`, `when_to_use`, `paths` and `context: fork`: the last two are named but untested (loading, Gaps).
10. The effect of Claude Code's description cut on `name` and `when_to_use` together; loading gives only 1,536 characters for description with `when_to_use`.

## Checklist for reviewing a hierarchical skill set

- [ ] Only roots are model-invoked; every other skill is hidden in both agents (frontmatter and `agents/openai.yaml`).
- [ ] Each root's description is third person, says what it is, then "Use when" with one trigger per branch.
- [ ] Only `SKILL.md` sits at a folder's top; everything else is in `references/`, `scripts/`, `assets/` or a sub-skill folder (Codex's `agents/` is still open).
- [ ] Each name equals its folder path joined by dashes; no name is a duplicate.
- [ ] `plugin.json` lists exactly the folders that hold a `SKILL.md`.
- [ ] Every sub-skill and file is linked from its parent, at the step that needs it, with an explicit instruction.
- [ ] No sub-skill is loaded through the Skill tool; each is read by path, relative to the reading skill's folder.
- [ ] Every call into another root's sub-skill uses a route shown to work in the install it ships with.
- [ ] Each main skill has named steps, plain conditions, entry points and a "Done when" on every step.
- [ ] A sub-skill is split off only when some runs skip it; shared rules sit in the parent.
- [ ] No duplication between levels; only real files inside the plugin, no symlinks.
- [ ] Facts and conventions are labelled apart; unverified items are marked.
- [ ] Text is harness-neutral; descriptions with a colon and a space are quoted.
- [ ] A check script runs the consistency tests; `just check` passes.
