# How skillbook works

skillbook as a whole, at the level of its sets and their trees. Each root gets a design of its own later; where the first design already covers one, it waits as material in [../notes/first-design/](../notes/first-design/README.md): the blueprint method for design, greenrepo for maintain's repository standard.

## What it is

A collection of sets in one repository, for Claude Code and Codex, each set installed on its own so people install only what they need: essentials, blueprint, softeng and authoring; later rigs, a knowledge base (once vaultops) and routines (D20, D152). Each set works alone. Its main skill is listed to the model and named after the set; its other skills are hidden, so the tree inside a set lives in how its skills route to each other, not in their names (D152).

- **Across sets:** a skill that needs another set's skill goes through that set's main skill, by name, since only a listed skill can be called by name from another package, and a hidden one is read by its path only inside its own; the agent tells whether the set is installed from its skill list. When it is not, the caller's one-line fallback, or a hint, written where it is used and naming the skill it stands in for, keeps the set whole: a variation, not a second home. No set depends on another ([../research/skill-loading.md](../research/skill-loading.md), D152, D156).
- **Sets complement each other** (D156): each part of a piece of work has one owner: the caller says when it happens and what for, the doer how it is done and what goes in, the keeper where the result lives and in what form. Each skill says only its own part, so parts in different sets do not contradict, such as plan saying a long plan is kept in a file and blueprint saying which file; it works both ways, blueprint calling essentials' clarify or plan, and essentials' plan and carryover kept by blueprint. Where a doer's set is missing, the caller's fallback holds; where a keeper's is, the doer's default; each is one line, written down, holding the rule that matters most there, never left to the agent's own sense. A project uses blueprint when its instruction files point to blueprint's main skill, a pointer blueprint's start step adds, so essentials checks nothing and names no other set for this. For a rare real conflict, a skill's word on where or in what form is a default and gives way to any loaded instruction for the same case, by act's rule on which instruction wins. The same holds for every pair of sets, such as essentials' design and softeng's, and essentials' layout and authoring's markdown. This is the contract's one home.
- **Names across sets:** a namespace has one level, the plugin's name, so the same skill name may appear in two sets, told apart by their set, such as essentials' design and softeng's design. How each set is installed, its folder layout, and the names on a route without a namespace are open ([../ideas/open.md](../ideas/open.md), D152, D154).

## The sets and their roots

Four sets, each with its main skill, the only skill of the set listed to the model; more later (D56, D63, D67, D103, D152, D154):

```text
essentials     the main skill loaded first for any work; it holds three rules and seven steps
  understand   discuss · clarify · frame · brainstorm · weigh · challenge · argue · naming · research
  act          rules · stakes · guardrails · cleanup · verify · rightsize (lean · enrich)
  devise       design (how to design anything, design review) · plan (multipart work, and following it)
  organize     split · merge · compose · normalize · cluster
  coordinate   delegate · brief · carryover · instruct · setup · learn
  respond      rules · layout · ask · explain
blueprint      the spec-to-dev flow and its records: start · discuss · research · decide · evidence · write ·
               workstream · tasks · work · sync · consolidate · parallel · check · publish · document forms
softeng        design · plan's software parts · implement (with code) · test · review · ship · maintain
authoring      docs · business · articles · edit · issue · reader · markdown
later          rigs · a knowledge base · routines
```

The full tree, every skill with its one-line description, is in [skill-tree.md](skill-tree.md) (D167).

- **essentials** is what any work needs (D63, D153, D154, D164, D177–D179). act holds how the agent works: its rules, which hold for all the work, and its tools, loaded when a step needs them: stakes, how much care something deserves, guardrails, verify, cleanup, what it created and no longer needs, and rightsize, nothing missing and nothing extra for the reader (D65, D67, D94, D145, D177, D179). respond holds everything said to the person: its rules, layout, how anything written in markdown is laid out, ask, how it asks the person anything, the harness's question tool included, and explain (D158, D159, D179). understand is understanding before acting, with the person and from sources. organize arranges anything with boundaries (D85). coordinate is working with agents not in this conversation: another agent now (delegate, brief), a later session (carryover), and every session, through the instruction documents it reads (instruct), skillbook set up in them (setup) and a session's lessons (learn) (D77, D97, D147). devise is deciding what the work will be and its steps: design, how to design anything, and plan, planning multipart work before acting (D59, D151). The main skill holds three rules, among them the wrap-up offer, which offers learn, then a carryover, when work stops with steps left, and seven steps, one per group or kind of work (D164, D178). layout, under respond, holds the structure for every response and anything written in markdown; authoring's markdown adds the file rules where that set is installed (D154, D158, D179).
- **blueprint** keeps the spec-to-dev flow running: a project's design record from the idea to the hand-over to code, its files and folders, and the procedures that keep them intact, with the form of each document. It requires no design or engineering skill and uses whatever the person has, ours or their own; where its topics touch others, such as splitting a design file, which touches organize and modularity, it gives a hint pointing to the skill that holds the topic (D46, D47, D154).
- **softeng** explains how good software is designed and made: its own design, architecture among it; planning's software parts, breakdown, slices and sequence; implement, which holds code, how to write each programming language well; test, review, ship and maintain (D36, D67, D68, D154).
- **authoring** is writing work for people, sorted by reader: docs for users, business documents for stakeholders, articles for the public and issues for whoever was not there, with edit, reader and markdown serving them all (D40, D67, D68, D69, D70, D154).
- **The lifecycle is no longer general:** essentials holds design and plan, which any work needs; doing, checking and delivering are each set's, softeng's for software and authoring's for writing; with no such set installed, the work is done under act's rules. act sends every file written to the skill for its type, code or markdown, where that set is installed (D35, D67, D68, D76, D154).
- **Later:** rigs, a set for the programs agents drive, git and the GitHub CLI, other agent programs, herdr, nvim, containers, each program with one home that other skills point to (D103, D154); a knowledge base, the person's notes and sources, once called vaultops, and routines, their daily work ([../notes/knowledge-and-routines.md](../notes/knowledge-and-routines.md), D64, D152).

**Project skills.** Skills that only skillbook itself needs live in this repository's project skill folders (`.agents/skills/`, linked from `.claude/skills/`) and are never shipped in any set (D67, D152): skillbook-tree, for placing, naming, designing and reviewing a skill (D77, D112, D181), and skillbook-write, for writing a skill's files, written when the first skill is built (D181).

What each root holds is drafted in [skill-tree.md](skill-tree.md), each root marked with its set.

## Kinds of skill

- **A set's main skill:** each set has one, model-invoked and named after the set, so its description is in the agent's context every turn; it holds its set's rules and says when to use each of its groups or roots (D56, D152).
- **essentials' main skill,** named `essentials`, is the one loaded first for any piece of work (D152, D153). Its rules and advice come first, the few that hold for every request and have no skill of their own: every skill a request needs is used, delegation by default, and the wrap-up offer; then seven steps, in the order the work happens, one per group or kind of work: understand the request, act's rules throughout, devise, organize, coordinate, doing it, and respond, always; understand, act and respond are loaded at the start of every conversation, the others when their step comes, and each group's own skill loads its tools in turn (D112, D149, D177–D179); its last instruction is that nothing is returned before respond's check has run (D56, D63, D81, D111, D112). The two rule groups are respond, how every response is prepared, rightsized by act's rightsize, things named in words, never by a reference the person cannot resolve, outcomes reported as they happened (D55, D60, D81); and act, how the agent works, asking before acting on what is not understood, evidence before saying done, and proposing before a risky action (D58, D63, D107). A skill that needs another root's skill asks the main skill for it, and one that needs another set's skill goes through that set's main skill, by name (D56, D152). Its description tells the agent to load it first for any piece of work, and setting skillbook up adds one sentence to the agent's instruction files saying the same, so the rules hold in every answer (D57). Where its folder sits waits for the layout (D71, D152).
- **Root:** a sub-skill of a set's main skill with sub-skills of its own (in essentials, a group); its own skill holds the rules of its scope and says when to use each of them (D56, D112).
- **Sub-skill:** invoked by the person only, so it costs nothing until used. The skill that needs it loads it by its path, from inside the same set, and the person can type it by the name its install route gives it (D152). A sub-skill may have sub-skills of its own (D38).
- **File:** inside a skill's folder, only `SKILL.md` sits at the top. What the skill reads goes in `references/`, what it runs in `scripts/`, what it copies out in `assets/`; each file is linked directly from the skill that uses it (D38, D44). A hidden skill's folder also holds `agents/openai.yaml`, Codex's setting that hides it, written by a script from the hidden flag in `SKILL.md` (D79). Those four folder names are never used for a sub-skill.

Depth comes from sub-skills, each with its own `SKILL.md`, never from chains of reference files (D39).

## How a skill is written

- **Placing, naming, designing and reviewing a skill:** skillbook-tree, this repository's project skill, holds the shape every skill's design takes, level by level and actions, not tools among it, and the checklist each design is reviewed against (D112, D177, D180, D181).
- **Writing a skill's files:** skillbook-write, a second project skill, written when the first skill is built: the harness's own skill-writing skill, `skill-creator` in both Claude Code and Codex, for the general craft, with only skillbook's extras added, and Anthropic's skill authoring best practices where it is not installed (D181). The two lines below wait for it:
  - a simple text diagram shows a loop, a decision that is easy to miss, or what an operation does to its items, before and after; a long flow offers a checklist the agent copies and ticks off (D38, D88);
  - the three guides compared, mattpocock/skills, superpowers and Anthropic's, are in [../research/skill-writing-guides.md](../research/skill-writing-guides.md) (D22).

## Names

How skills are named, and where each goes in the tree, is skillbook-tree's (D181). The folder a project's design lives in stays `blueprint/` (D33).

## design, blueprint, understand and maintain

- **design,** essentials', holds how to design anything, from an idea to a design, the hand-over to implementation, and the design adjusted from what implementation shows (D29, D31, D46); its own skill takes the shape every main skill takes, design's rules and when to use each of its sub-skills (D112). Its result is design, never a PRD. softeng has a design of its own, how good software is designed, architecture among it; the two share a name, told apart by their set (D154). plan, essentials', plans multipart work before acting and follows a plan step by step; its software parts are softeng's (D36, D151, D154, D155). Daily routines stay outside it (D31).
- **blueprint** is a set of its own, not a part of design: its steps (start, discuss, decide, write, and the rest) file results in the project's `blueprint/` folder and keep the spec-to-dev flow running, with whatever design skill the person has (D46, D47, D117, D154). A project uses blueprint when its instruction files point to blueprint's main skill; where none does, each skill's result goes where its own default says, each default settled with its skill (D152, D156).
- **understand** holds thinking methods any skill can use. Its own skill takes the shape every main skill takes and is designed after its sub-skills; it holds the shared rules and which part to choose, the discussion with the person being a sub-skill of its own, discuss (D53, D109, D112, D130, D131). Its sub-skills are discuss, clarify, frame, brainstorm, weigh, challenge, argue, naming and research (D59, D67, D118, D130, D132); explain, which it once held, moved to respond (D63, D179), and organize became a group of its own (D164). explain explains top-down whatever the agent said that did not land (D54). They keep nothing themselves; each ends on what was decided, what was parked and what comes next, and the caller keeps it (D50). Other groups and sets reach them through the main skill (D51, D56).
- **maintain,** softeng's, holds the repository standard, first designed as greenrepo and now named repo (D37); ship works within its release rules (D34, D35, D154).

## Installing

Each set is installed on its own (D152). How is open: a plugin from skillbook's marketplace, `npx skills add` through skills.sh, or both, decided later with the folder layout ([../ideas/open.md](../ideas/open.md)). What was decided for one plugin holds for that route if it is kept (D23, D74, D75):

- **Using skillbook:** add skillbook's marketplace and install the sets wanted, in Claude Code and in Codex. Each installed set's skills are registered, so any of them can be typed; only each set's main skill is listed to the model. Setting up then adds the sentence pointing to essentials' main skill to the person's instruction files (D57).
- **Developing skillbook:** install the working copy of this repository locally instead of the published sets, never both on one machine. Same skills, same names; the files come from the working copy, so a change can be tried in a real session before it is released.
- **Updating:** every release raises the version. Claude Code updates with `claude plugin marketplace update` then `claude plugin update`; Codex refreshes by itself at the next session. On a development machine Claude Code reads edits at the next session, and Codex needs the plugin added again (D75). How each set is versioned is decided with the routes (D152).

Project skills such as skillbook-tree are not installed with any set; they work only inside this repository (D67).
