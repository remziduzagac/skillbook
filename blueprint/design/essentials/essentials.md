# Design: essentials, the main skill

What a builder needs for essentials' main skill, listed to the model like every set's main skill and the one loaded first for any work (D56, D71, D152, D153); ideas not yet decided are in [../../ideas/essentials.md](../../ideas/essentials.md). It is designed last, once the groups it routes to are designed (D80). Every section answers the same questions (D80); an empty field is not designed yet.

## essentials

- **Purpose:** essentials' main skill, loaded first for any piece of work: it holds the rules every response follows and uses every group a request needs (D56, D57, D71, D136, D152). It routes to essentials' five groups, understand, devise, for design and plan, organize, coordinate and conduct, and, of the other sets, only to authoring's markdown skill, through authoring's main skill, where that set is installed (D155, D164, D168). The other sets' main skills are added as each is designed; until then, the work they will cover is done directly under act's rules (D115, D136, D152).
- **Description:** the one tested (D57), kept as it is: "Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, git commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills." It decides whether the main skill loads at all, so it stays broad while the other sets' main skills are not yet routed: act's and respond's rules then hold for any piece of work. A change to it is re-run through the test harness (D136). With the sets, the kinds of work it names are revisited when the other sets' main skills are written, since each of those names its own (D152).
- **Callers:** the harness, by its description, as every set's main skill is listed (D56, D152); the pointer, which goes where the skills are installed, through setup when the install route has not written it (D57, D165); the person, typing it; any skill in essentials that needs another group's skill, by asking the main skill, which routes through that group (D56, D106); a skill in another set, through this main skill by name, never a hidden skill's path (D152).
- **Flow:** in the shape every main skill takes (D112, D136):
  1. **Rules:**
     - act's and respond's rules hold for every request (D63, D115);
     - every response and every markdown file is laid out by conduct's layout, and a markdown file also by authoring's markdown where that set is installed; other files follow act's rule on a file's type; this is the rule's one home (D111, D136, D154, D158);
     - everything given back or made, and the work done to get there, is rightsized for its reader by conduct's rightsize, whose check respond's last instruction runs (D145);
     - every skill a request needs is used, together or in turn; a skill limits this only where it says why (D112, D115);
     - a delegated fresh agent loads only what its brief names, as coordinate's brief says (D149);
     - **the wrap-up offer** (D107, D115, D164): when work stops with steps left, such as "let's stop here", one question, through conduct's ask, offers coordinate's learn, then its carryover, since what a session taught and where the work stands are lost when it ends unrecorded; with nothing unfinished, nothing is offered. Before work stops, conduct's cleanup goes through what the agent created, as act's rule on cleanup says (D129, D149).
  2. **Advice:** strong advice, **delegation by default:** every task goes to an agent through coordinate's delegate, so the main session keeps the conversation and the person's decisions; delegate holds the reasons and the choice of agent (D138, D143, D149). The main agent does a task itself only when it is too small, when it needs the person's decisions as it goes, or when it needs the content to continue the conversation; when unsure, it forks without asking (D142, D143).
  3. **Instructions:** read act, respond, conduct's rightsize and conduct's layout by path, together in one turn, once per conversation (D72, D111, D149, D154, D158). Then one line per group, each giving back what its sub-skill returns; the full lines, with every case that is not the group's, are in each group's own flow, and here only the neighbours a request could be confused with (D112, D136, D171):
     - **understand:** understanding before acting: a topic to discuss, an unclear request, a fact to find, options or a choice, an idea to test, a case to make, a name; not "what do you think?" (act's rule) or the person not following the agent (conduct's explain);
     - **devise:** what something will be, or the steps of multipart work (D155, D168, D173);
     - **organize:** dividing, joining, grouping or indexing things, planning a whole's parts, or checking parts for overlaps and gaps; not changing what the items say, nor the steps of the work (devise) (D164);
     - **authoring,** another set, its markdown skill only for now, through authoring's main skill where that set is installed: a markdown file's layout and its linter; not a response's layout (conduct's layout) or its wording (respond); where it is not installed, conduct's layout, and the project's linter through verify where there is one (D137, D152, D158);
     - **conduct:** the agent's own way of working: asking, explaining, stakes, guardrails, verifying, rightsizing, cleaning up (D164);
     - **coordinate:** work handed to an agent not in this conversation, now, later or in every session: delegating, briefing, carryovers, instruction documents, setup, learning (D164).

     Any other request, including work the other sets will cover, such as git or tests, is done directly under act's rules, or through another set's main skill once that set is designed and installed (D115, D136, D152).
  4. **The last instruction:** every response is checked against respond before the person sees it, and what fails the check is fixed first (D81, D115).
- **Result:** none of its own; its rules shape every response (D136).
- **Files:** `SKILL.md` only (D136).
- **Material:** the pointer and description tests, and how Claude Code and Codex load skills ([../../research/skill-loading.md](../../research/skill-loading.md)); superpowers' start-of-session skill and hyperframes' entry skill with its routing table ([../../research/skill-collections.md](../../research/skill-collections.md)), adapted, never copied (D120).
- **Tests** (D136):
  1. any request in a new session: the main skill loaded first, and act, respond, rightsize and layout read once, together in one turn (D149, D154, D158);
  2. a second request in the same conversation: none of the four read again;
  3. "let's discuss X": understand, then discuss;
  4. "is this really done?": conduct, then verify;
  5. "check X's limits, then add it": understand's research, then the work done directly under act's rules;
  6. a request no group or set covers yet, such as "write a deploy script": done directly under act's rules;
  7. a one-line question after the main skill is loaded: respond's rules still hold;
  8. a response that would cite a bare decision number: caught by the respond check and fixed before the person sees it;
  9. writing a YAML file: the project's conventions, not the markdown rules;
  10. respond and act read by path, never routed through conduct;
  11. "fix the layout of this file", authoring installed: authoring's markdown, through authoring's main skill, its file rules and the linter check (D137, D152);
  12. "rewrite this paragraph shorter": respond's rules, done directly, not authoring's markdown (D137);
  13. "what do you think about X?": act's rule, a view and a plan, not understand (D137);
  14. "I don't follow": conduct's explain (D137);
  15. a task that is not too small, such as reviewing a folder of designs: delegated through coordinate's delegate (D138);
  16. unsure whether a task is too small: a fork, without asking; the one-line start notice shown (D138, D143);
  17. a short task that reads a long file, such as answering one question from a large document: delegated, a fork, not done in the main session (D142);
  18. a question about the design section being discussed: the main agent reads it itself, not delegated, since it needs the content to continue the conversation (D143);
  19. a long reply that restates the question and repeats what the person already has: caught by the respond check, which runs conduct's rightsize, and cut before the person sees it (D145);
  20. a fresh agent started for a task: told by its brief not to load the main skill (D149);
  21. the baseline built: its start-up measured, against the figure set then (D149);
  22. "fix the layout of this file", authoring not installed: conduct's layout and the project's linter through verify, no file of another set read by its path (D152, D158);
  23. a request that needs another set's skill, that set installed: through that set's main skill, by name, never a hidden skill's path (D152);
  24. "add dark mode and release it": devise, then plan, the person's two items kept at the top, missing and non-obvious steps found (D155);
  25. "fix the typo in the README": single-step, no plan, done directly (D155);
  26. "set up skillbook in this project": coordinate, then setup (D164);
  27. "split this document into parts": organize, then split (D164);
  28. "let's wrap up" or "I'm stopping for today" with steps left: the main skill's wrap-up offer, one question offering learn, then carryover; with nothing unfinished, nothing offered (D107, D115, D164);
  29. "write a carryover": coordinate, then carryover (D164);
  30. "design a CLI for X": devise, then design (D168);
  31. "add a rule to our `CLAUDE.md`": coordinate, then instruct, not conduct (D164);
  32. "trim this report", which exists: conduct, then rightsize's lean, not organize (D157, D164);
  33. "what did this session teach?": coordinate, then learn, not understand (D164);
  34. "plan the sections of this report before I write it": organize, then split, planning a whole into parts, not devise's plan (D148, D164);
  35. "check these sections for overlaps and gaps": organize's check, nothing changed (D168).
- **Open:** the lines for the other sets' main skills, added as each is designed (D136, D152, D154); the main skill as a whole, to be revisited: its trim (D171) is a start.
