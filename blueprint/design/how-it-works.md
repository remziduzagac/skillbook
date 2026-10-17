# How skillbook works

skillbook as a whole, at the level of its sets and their trees. Each root gets a design of its own later; where the first design already covers one, it waits as material in [../notes/first-design/](../notes/first-design/README.md): the blueprint method for design, greenrepo for maintain's repository standard.

## What it is

A collection of sets in one repository, for Claude Code and Codex, each set installed on its own so people install only what they need: essentials, blueprint, softeng and authoring; later rigs, a knowledge base (once vaultops) and routines (D20, D152). Each set works alone. Its main skill is listed to the model and named after the set; its other skills are hidden, so the tree inside a set lives in how its skills route to each other, not in their names (D152).

- **Across sets:** a skill that needs another set's skill goes through that set's main skill, by name, since only a listed skill can be called by name from another package, and a hidden one is read by its path only inside its own; the agent tells whether the set is installed from its skill list. When it is not, a short fallback or hint written where it is used, a rule or two that matter for that case naming the skill it stands in for, keeps the set whole: a variation, not a second home. No set depends on another ([../research/skill-loading.md](../research/skill-loading.md), D152).
- **Names across sets:** a namespace has one level, the plugin's name, so the same skill name may appear in two sets, told apart by their set, such as essentials' design and softeng's design. How each set is installed, its folder layout, and the names on a route without a namespace are open ([../ideas/open.md](../ideas/open.md), D152, D154).

## The sets and their roots

Four sets, each with its main skill, the only skill of the set listed to the model; more later (D56, D63, D67, D103, D152, D154):

```text
essentials     the main skill loaded first for any work
  conduct      respond · act · ask · organize · explain · verify · guardrails · stakes · rightsize · cleanup ·
               instruct · setup · learn · delegate · brief · carryover
  understand   discuss · clarify · frame · brainstorm · weigh · challenge · argue · naming · research
  design       how to design anything: its flow, its principles, design review
  plan         planning any work before acting
blueprint      the spec-to-dev flow and its records: start · discuss · research · decide · evidence · write ·
               workstream · tasks · work · sync · consolidate · parallel · check · publish · document forms
softeng        design · plan's software parts · implement (with code) · test · review · ship · maintain
authoring      docs · business · articles · edit · issue · reader · markdown
later          rigs · a knowledge base · routines
```

- **essentials** is what any work needs. conduct holds how the agent acts: how it behaves in every root (respond and act, which the main skill loads first; ask, how it asks the person anything; organize, explain, verify, guardrails, stakes, how much care something deserves, rightsize, nothing missing and nothing extra for the reader, and cleanup, what it created and no longer needs), the instruction documents it writes and updates (instruct), how it sets skillbook up (setup), how it learns from sessions (learn), and how it works with other agents (delegate, brief, carryover) (D63, D65, D67, D77, D94, D97, D147). understand is understanding before acting, with the person and from sources; design is how to design anything; plan is planning any work before acting (D59, D151, D154). A small output-format skill, generic layout rules for its outputs, is designed later; respond already prepares every response, so whether it sits in respond or beside it is decided then (D154).
- **blueprint** keeps the spec-to-dev flow running: a project's design record from the idea to the hand-over to code, its files and folders, and the procedures that keep them intact, with the form of each document. It requires no design or engineering skill and uses whatever the person has, ours or their own; where its topics touch others, such as splitting a design file, which touches organize and modularity, it gives a hint pointing to the skill that holds the topic (D46, D47, D154).
- **softeng** explains how good software is designed and made: its own design, architecture among it; planning's software parts, breakdown, slices and sequence; implement, which holds code, how to write each programming language well; test, review, ship and maintain (D36, D67, D68, D154).
- **authoring** is writing work for people, sorted by reader: docs for users, business documents for stakeholders, articles for the public and issues for whoever was not there, with edit, reader and markdown serving them all (D40, D67, D68, D69, D70, D154).
- **The lifecycle is no longer general:** essentials holds design and plan, which any work needs; doing, checking and delivering are each set's, softeng's for software and authoring's for writing; with no such set installed, the work is done under act's rules. act sends every file written to the skill for its type, code or markdown, where that set is installed (D35, D67, D68, D76, D154).
- **Later:** rigs, a set for the programs agents drive, git and the GitHub CLI, other agent programs, herdr, nvim, containers, each program with one home that other skills point to (D103, D154); a knowledge base, the person's notes and sources, once called vaultops, and routines, their daily work ([../notes/knowledge-and-routines.md](../notes/knowledge-and-routines.md), D64, D152).

**Project skills.** Skills that only skillbook itself needs, such as skillbook-tree for making a skill (the general craft of descriptions, rules, instructions and tests; this tree's rules for naming, placing and checking it; and the checks of a skill for overlaps, contradictions, gaps and restrictions that are not needed) (D77, D112), live in this repository's project skill folders (`.agents/skills/`, linked from `.claude/skills/`) and are never shipped in any set (D67, D152). skillbook-tree is built first with its review checklist; making a skill is added later (D113).

What each root holds is drafted in [../ideas/skill-tree.md](../ideas/skill-tree.md), each root marked with its set.

## Kinds of skill

- **A set's main skill:** each set has one, model-invoked and named after the set, so its description is in the agent's context every turn; it holds its set's rules and says when to use each of its roots (D56, D152).
- **essentials' main skill,** named `essentials`, is the one loaded first for any piece of work (D152, D153). Its rules come first: act's and respond's rules hold for every request, every response and file is laid out by its rule on layout, every skill a request needs is used, and everything given back, made or done is rightsized for its reader, by conduct's rightsize, so it reads act, respond, rightsize and, once designed, essentials' output-format skill first, together in one turn (D149, D154); its instructions say when to use each root, several for one request where the work needs them; its last instruction checks every response against respond before it is returned (D56, D63, D81, D111, D112). The two rule skills are respond, how every response is prepared, rightsized by conduct's rightsize, things named in words, never by a reference the person cannot resolve, outcomes reported as they happened (D55, D60, D81); and act, how the agent acts, asking before acting on what is not understood, evidence before saying done, and proposing before a risky action (D58, D63, D107). A skill that needs another root's skill asks the main skill for it, and one that needs another set's skill goes through that set's main skill, by name (D56, D152). Its description tells the agent to load it first for any piece of work, and setting skillbook up adds one sentence to the agent's instruction files saying the same, so the rules hold in every answer (D57). Where its folder sits waits for the layout (D71, D152).
- **Root:** a sub-skill of a set's main skill with sub-skills of its own; its own skill holds the rules of its scope and says when to use each of them (D56, D112).
- **Sub-skill:** invoked by the person only, so it costs nothing until used. The skill that needs it loads it by its path, from inside the same set, and the person can type it by the name its install route gives it (D152). A sub-skill may have sub-skills of its own (D38).
- **File:** inside a skill's folder, only `SKILL.md` sits at the top. What the skill reads goes in `references/`, what it runs in `scripts/`, what it copies out in `assets/`; each file is linked directly from the skill that uses it (D38, D44). A hidden skill's folder also holds `agents/openai.yaml`, Codex's setting that hides it, written by a script from the hidden flag in `SKILL.md` (D79). Those four folder names are never used for a sub-skill.

Depth comes from sub-skills, each with its own `SKILL.md`, never from chains of reference files. A skill lives with the knowledge it needs and where the flow that calls it most runs; other skills point to it (D39).

## How a skill is written

- A main skill (the main skill, a root's own skill, or any skill with sub-skills of its own) holds, in this order (D112):
  1. **Rules, at the top:** the musts and must-nots for its whole scope. Each rule has one home: here, or a skill of its own that this section tells the agent to follow. A rule appears twice only for a clear variation, which names the rule it changes; a restriction only where something real is at risk, with its reason.
  2. **Advice:** the shoulds, apart from the musts, left to the agent's judgment. Strong advice is followed unless the case gives a reason not to, and the agent says so when it departs. A number is advice, "about N" with its reason, unless a rule cannot be applied without it (D116).
  3. **Instructions, in the order the work happens:** for each skill it uses, when to use it, when not, and what it gives back. If-then-else only where an order must be imposed. A gap is stated where it falls, with where to go: another skill or the agent's own judgment. Several skills may serve one request. It never says how a sub-skill works inside.
  4. **The last instruction:** what is done before anything is returned.
- Every skill, leaf skills too: each instruction names the skill it needs; nothing ambiguous or contradictory, no gap left unstated; comprehensive and exclusive, every case covered or named as a gap, each rule and concern with one home. skillbook-tree checks this (D112).
- A simple text diagram shows a loop, a decision that is easy to miss, or what an operation does to its items, before and after; a long flow offers a checklist the agent copies and ticks off (D38, D88).
- When an instruction grows complicated, its logic becomes a sub-skill, which may call other sub-skills (D38).
- The writing rules come from mattpocock/skills, superpowers and Anthropic's guidance ([../research/skill-writing-guides.md](../research/skill-writing-guides.md); D22). Where an outside skill maps to one of ours, it is read before ours is written, and what fits is adapted, never copied: rewritten for skillbook's case inside the skill, in a reference file of its own where needed, or as a new skill where it is a concern other skills need too; no outside file is used as it is (D30, D120).

## Names

Skills you do are bare verbs; skills about something, the groups among them, are nouns (D40, D48). Leaf skills take short verbs or nouns, and a name is coined only where a plain word will not do; the folder a project's design lives in stays `blueprint/` (D33).

Each set's main skill is named after its set: `essentials`, `blueprint`, `softeng`, `authoring` (D152, D153). Inside a set, every other skill is a short folder inside its parent's, and its name is the path below its set's main skill joined by dashes (`conduct-delegate-fanout`) (D43, D71). The same name may appear in two sets, told apart by their set. Where the sets' folders sit, what lists them, and the names on a route without a namespace wait for the install routes (D152).

## design, blueprint, understand and maintain

- **design,** essentials', holds how to design anything, from an idea to a design, the hand-over to implementation, and the design adjusted from what implementation shows (D29, D31, D46); its own skill takes the shape every main skill takes, design's rules and when to use each of its sub-skills (D112). Its result is design, never a PRD. softeng has a design of its own, how good software is designed, architecture among it; the two share a name, told apart by their set (D154). plan, essentials', plans any work before acting; its software parts are softeng's (D36, D151, D154). Daily routines stay outside it (D31).
- **blueprint** is a set of its own, not a part of design: its steps (start, discuss, decide, write, and the rest) file results in the project's `blueprint/` folder and keep the spec-to-dev flow running, with whatever design skill the person has (D46, D47, D117, D154). What the other sets do with their results where the blueprint set is not installed is open (D152).
- **understand** holds thinking methods any skill can use. Its own skill takes the shape every main skill takes and is designed after its sub-skills; it holds the shared rules and which part to choose, the discussion with the person being a sub-skill of its own, discuss (D53, D109, D112, D130, D131). Its sub-skills are discuss, clarify, frame, brainstorm, weigh, challenge, argue, naming and research (D59, D67, D118, D130, D132); organize and explain, which it once held, moved to conduct (D63). explain explains top-down whatever the agent said that did not land (D54). They keep nothing themselves; each ends on what was decided, what was parked and what comes next, and the caller keeps it (D50). Other roots reach them through the main skill (D51, D56).
- **maintain,** softeng's, holds the repository standard, first designed as greenrepo and now named repo (D37); ship works within its release rules (D34, D35, D154).

## Installing

Each set is installed on its own (D152). How is open: a plugin from skillbook's marketplace, `npx skills add` through skills.sh, or both, decided later with the folder layout ([../ideas/open.md](../ideas/open.md)). What was decided for one plugin holds for that route if it is kept (D23, D74, D75):

- **Using skillbook:** add skillbook's marketplace and install the sets wanted, in Claude Code and in Codex. Each installed set's skills are registered, so any of them can be typed; only each set's main skill is listed to the model. Setting up then adds the sentence pointing to essentials' main skill to the person's instruction files (D57).
- **Developing skillbook:** install the working copy of this repository locally instead of the published sets, never both on one machine. Same skills, same names; the files come from the working copy, so a change can be tried in a real session before it is released.
- **Updating:** every release raises the version. Claude Code updates with `claude plugin marketplace update` then `claude plugin update`; Codex refreshes by itself at the next session. On a development machine Claude Code reads edits at the next session, and Codex needs the plugin added again (D75). How each set is versioned is decided with the routes (D152).

Project skills such as skillbook-tree are not installed with any set; they work only inside this repository (D67).
