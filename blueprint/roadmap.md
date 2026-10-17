# Roadmap

Status: **Design**, the initial design is open (D27): changes go straight into the root, without workstreams. Now: skillbook as a whole, from the top.

## Design: in progress

- [x] **The first design:** the blueprint method, greenrepo and skillbook's first organisation (D1–D26), 2026-10-07 to 2026-10-10; kept as material in [notes/first-design/](notes/first-design/README.md) (D42).
- [x] **Skill loading and namespaces,** tested in Claude Code and Codex ([research/skill-loading.md](research/skill-loading.md)). 2026-10-10.
- [ ] **The design as a whole:** [requirements.md](requirements.md) and [design/how-it-works.md](design/how-it-works.md), from D27 onward.
- [ ] **The tree:** what sits under each root ([ideas/skill-tree.md](ideas/skill-tree.md)).
- [x] **conduct,** designed (D81–D106) and revised after an outside review (D107), 2026-10-12.
- [x] **The designed skills reviewed** with the project skill skillbook-tree, built first with its review checklist (D113): the main skill, conduct, clarify and author's markdown; about 130 findings ([notes/skill-review.md](notes/skill-review.md)). Questions got their own skill, conduct's ask (D114); twelve contradictions were settled with the person and the rest fixed as proposed (D115); numbers became advice (D116). The new shape waits for the flows. 2026-10-13.
- [ ] **Towards the baseline** (D108): understand, then author's markdown skill, then the flows again: the main skill in the shape every main skill takes, with conduct's own skill and clarify checked against it ([ideas/open.md](ideas/open.md)). clarify and its three parts are designed (D109); so is author's markdown skill (D111); so is that shape: rules, advice, when to use each skill, a last instruction, which settles routing to more than one root and guidance rather than a script (D112). brainstorm is designed, and frame, weigh and challenge join understand, then naming and research (D118); frame, weigh and challenge are designed (D119, D122, D124), and naming (D125). Every project using skillbook has a blueprint, which setup starts (D117). conduct gains stakes, designed after weigh and challenge (D121). conduct gains cleanup, designed right after research (D126). research is designed, with fact, survey and analyze (D128), and cleanup (D129). understand gains discuss, designed (D130), and its own skill is designed (D131). understand gains argue, designed (D132). conduct's stakes is designed (D133). The flows are revisited: conduct's own skill, act, respond, ask, clarify, author's markdown and the main skill take the shape, and the main skill routes to understand, author's markdown and conduct for now (D134, D135, D136). The baseline review's small fixes are applied (D137). Delegation is the default and delegate takes the shape (D138); skills stay generic, and the harness's limits hold (D139). research takes the shape, and the ranking of evidence lives in it (D140); organize takes the shape (D141). What delegating costs is recorded, and delegate chooses the type, then fork or fresh, then the model (D142); delegation by default carries its cost reason (D143); skills name tiers, never a model, each harness's reference file mapping its own, and effort is chosen apart from the model, by how much reasoning the step needs (D144); anything given back, made or done is rightsized for its reader, nothing missing and nothing extra, by conduct's rightsize, the lean idea renamed (D145); a delegated agent's report is rightsized for the main agent, and a reference stays as it is only when its reader can tell what it is on the spot (D146); brief and carryover are the two halves of writing for a reader who was not there, handoff renamed carryover and offered at a phase's end when a fresh session would cost less (D147); organize also plans wholes not yet written, and parts are sized to how they are read (D148); a fresh agent reviewed the baseline for cost, and its fixes were applied: skills on one route read in one turn, skills loaded only when needed, bulk kept out of the main session, lighter checks, fewer questions, and a cost check in skillbook-tree (D149); decisions others build on take the strong tier and high effort, and a recommendation is challenged before it is put, at a depth set by stakes (D150); plan becomes the root for planning any work before acting, its software-engineering parts kept for the person's own software-engineering skills (D151).
- [ ] **The parts:** a design document and an ideas document per root and for the main skill (D80), filled in this order: conduct and understand first, then design, plan, implement, test, review, ship, maintain and author, then the main skill. design starts from the blueprint method, maintain's repo from greenrepo.
- [ ] **The glossary and SCOPE.md,** brought in line with the tree.

## Build: later

Starts with the baseline (D108); the rest once the person declares the initial design settled.

- [ ] **The baseline:** the main skill with its draft flow, conduct, understand's clarify and author's markdown skill, built and then tested with the harness and in use, while the rest of the design stays open (D108). Once built, its start-up, what loading the main skill, act, respond, author's markdown and rightsize costs in tokens, is measured and kept small by a figure set then, as advice, since those files are carried on every turn of every session (D149).

- [ ] **The repository's checks:** the check script (names, `plugin.json`, Codex settings matching `SKILL.md`, D79), the script that writes Codex settings, `claude plugin validate`, release-please.
- [ ] **The first skills,** as their parts are designed.
- [ ] **This repository's `AGENTS.md`,** cut down to the project's facts once conduct exists; the pointer lives in the person's own files (D78, D93).
- [ ] **The first release:** the manifest, docs pages, install instructions.

## Later

Agreed, but not scheduled.

- [ ] **knowledge and routines,** set aside on 2026-10-11 (D64): their design starts from what was known then, in [notes/knowledge-and-routines.md](notes/knowledge-and-routines.md): the skills they held, the decisions that still stand, the folder proposal (`skillbook/` with `blueprint/` and a knowledge folder), where learn's highlights wait, and the open questions.
- [ ] **More repository profiles:** containers, mobile, deploy targets, frameworks, each after a short research round.
- [ ] **Wider install routes:** Claude Code's official marketplace and skills.sh, once the set is stable.
