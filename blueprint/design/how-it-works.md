# How skillbook works

skillbook as a whole, at the level of its tree. Each root gets a design of its own later; where the first design already covers one, it waits as material in [../notes/first-design/](../notes/first-design/README.md): the blueprint method for design, greenrepo for maintain's repository standard.

## What it is

One plugin, `skillbook`, for Claude Code and Codex (D20, D23). Every skill in it is reached as `skillbook:<name>`. A plugin's namespace has one level, so the tree lives in how skills route to each other, not in their names ([../research/skill-loading.md](../research/skill-loading.md)).

## The roots

Ten roots and the conduct group under one main skill, which is the only skill listed to the model (D56, D63, D67, D76, D103):

```text
conduct        respond · act · ask · organize · explain · verify · guardrails · stakes · cleanup · instruct ·
               setup · learn · delegate · handoff
understand     clarify · frame · brainstorm · weigh · challenge · naming · research
lifecycle      design → plan → implement (with code) → test → review → ship → maintain
author         blueprint · docs · business · articles · edit · issue · reader · markdown
rigs           the programs agents drive; contents to design (D103)
```

- **conduct** holds how the agent acts: how it behaves in every root (respond and act, which the main skill loads first; ask, how it asks the person anything; organize, explain, verify, guardrails, stakes, how much care something deserves, and cleanup, what it created and no longer needs), the instruction documents it writes and updates (instruct), how it sets skillbook up (setup), how it learns from sessions (learn), and how it works with other agents (delegate, handoff) (D63, D65, D67, D77, D94, D97).
- **rigs** will hold skills for the programs agents drive: git and the GitHub CLI, other agent programs, herdr, nvim, containers, each program with one home that other skills point to. Its contents are designed later (D103).
- **The lifecycle,** seven roots, is what any project goes through: a program, a book, a research project (D35, D36). The main skill holds the stages' order, and each stage says what comes next (D76). Software is one specialisation inside each stage; other kinds of work get theirs as the parts are designed. implement holds code, how to write each programming language well; act sends every file written to the skill for its type, code or markdown (D67, D68).
- **understand and author** are activities that serve every stage: understanding before acting, with the person and from sources (clarify, brainstorm, naming, research); and writing work for people, sorted by reader: blueprint documents for the project's record, docs for users, business documents for stakeholders, articles for the public, with edit and markdown serving them all (D40, D59, D67, D68, D69, D70).
- knowledge, the person's notes and sources, and routines, their daily work, are set aside for later ([../notes/knowledge-and-routines.md](../notes/knowledge-and-routines.md), D64).

**Project skills.** Skills that only skillbook itself needs, such as skillbook-tree for making a skill (the general craft of descriptions, rules, instructions and tests; this tree's rules for naming, placing and checking it; and the checks of a skill for overlaps, contradictions, gaps and restrictions that are not needed) (D77, D112), live in this repository's project skill folders (`.agents/skills/`, linked from `.claude/skills/`) and are never shipped in the plugin (D67). skillbook-tree is built first with its review checklist; making a skill is added later (D113).

What each root holds is drafted in [../ideas/skill-tree.md](../ideas/skill-tree.md).

## Kinds of skill

- **The main skill:** the one model-invoked skill, so its description is the only one in the agent's context every turn. Its rules come first: act's and respond's rules hold for every request, every response and file is laid out with author's markdown, and every skill a request needs is used, so it reads act, respond and author's markdown first; its instructions say when to use each root, several for one request where the work needs them; its last instruction checks every response against respond before it is returned (D56, D63, D81, D111, D112). The two rule skills are respond, how every response is prepared, necessary and sufficient, things named in words, never by a reference the person cannot resolve, outcomes reported as they happened (D55, D60, D81); and act, how the agent acts, asking before acting on what is not understood, evidence before saying done, and proposing before a risky action (D58, D63, D107). A skill that needs another root's skill asks the main skill for it (D56). Its description tells the agent to load it first for any piece of work, and setting skillbook up adds one sentence to the agent's instruction files saying the same, so the rules hold in every answer (D57). It is named `skillbook` and lives in `skills/skillbook/` (D71).
- **Root:** a sub-skill of the main skill with sub-skills of its own; its own skill holds the rules of its scope and says when to use each of them (D56, D112).
- **Sub-skill:** invoked by the person only, so it costs nothing until used. The skill that needs it loads it by its path, and the person can type it as `/skillbook:<name>`. A sub-skill may have sub-skills of its own (D38).
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

In the repository the main skill is `skills/skillbook/`, named `skillbook`, and every other skill is a short folder inside its parent's (`skills/skillbook/design/start/`); its name is the path below `skills/skillbook/` joined by dashes (`design-start`) (D43, D71). `plugin.json` lists every skill folder.

## design, understand and maintain

- **design** holds how to design anything, from an idea to a design, the hand-over to implementation, and the design adjusted from what implementation shows (D29, D31, D46); its own skill takes the shape every main skill takes, design's rules and when to use each of its sub-skills (D112). Its result is design, never a PRD. Its sub-skills are general methods such as architecture and review, and the steps that record (start, discuss, decide, write, and the rest), which file their result in the project's `blueprint/` folder, which every project using skillbook has (D46, D47, D117). plan breaks the design into tasks (D36). Daily routines stay outside it (D31).
- **understand** holds thinking methods any skill can use. Its own skill takes the shape every main skill takes and is designed after its sub-skills; the first idea for it, a discussion with the person that takes the open questions one at a time and closes each with a decision or a park, is weighed then (D53, D109, D112). Its sub-skills are clarify, frame, brainstorm, weigh, challenge, naming and research (D59, D67, D118); organize and explain, which it once held, moved to conduct (D63). explain explains top-down whatever the agent said that did not land (D54). They keep nothing themselves; each ends on what was decided, what was parked and what comes next, and the caller keeps it (D50). Other roots reach them through the main skill (D51, D56).
- **maintain** holds the repository standard, first designed as greenrepo and now named repo (D37); ship works within its release rules (D34, D35).

## Installing

Every machine installs the `skillbook` plugin (D23, D74):

- **Using skillbook:** add skillbook's marketplace and install the plugin, in Claude Code and in Codex. The whole tree is installed and every skill registered, so any of them can be typed; only the main skill is listed to the model. Setting up then adds the sentence pointing to the main skill to the person's instruction files (D57).
- **Developing skillbook:** install the working copy of this repository as a local plugin instead of the published one, never both on one machine. Same skills, same names; the files come from the working copy, so a change can be tried in a real session before it is released.

- **Updating:** every release raises the plugin's version. Claude Code updates with `claude plugin marketplace update` then `claude plugin update`; Codex refreshes by itself at the next session. On a development machine Claude Code reads edits at the next session, and Codex needs the plugin added again (D75).

Project skills such as skillbook-tree are not installed by the plugin; they work only inside this repository (D67).
