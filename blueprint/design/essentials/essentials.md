# Design: essentials, the main skill

What a builder needs for essentials' main skill, listed to the model like every set's main skill and the one loaded first for any work (D56, D71, D152, D153); ideas not yet decided are in [../../ideas/essentials.md](../../ideas/essentials.md). Every section answers the same questions (D80); an empty field is not designed yet.

## essentials

- **Purpose:** essentials' main skill, loaded first for any piece of work: it holds the few rules that hold for every request and opens essentials level by level, one line per group, each loaded when its step comes (D56, D152, D177, D178).
- **Description:** the one tested (D57), kept as it is: "Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills." It decides whether the main skill loads at all, so it stays broad while the other sets' main skills are not yet routed: act's and respond's rules then hold for any piece of work. A change to it is re-run through the test harness (D136).
- **Callers:**
  - the harness, by its description, as every set's main skill is listed (D56, D152);
  - the pointer, which goes where the skills are installed (D57, D165);
  - the person, typing it;
  - a skill in essentials naming another group's skill, which the main skill's lines locate (D56);
  - a skill in another set, which loads this main skill and then uses the skill by its name rule, not by a path guessed without loading it, since that set's main skill holds rules its skills rely on and its folders are its own (D152, D187, D199).
- **Flow** (D112, D177, D178):
  1. **Rules and advice** that hold for every request and have no skill of their own:
     - every skill a request needs is used, together or in turn; a skill limits this only where it says why (D112, D115);
     - strong advice, **delegation by default:** every task goes to an agent through coordinate's delegate, so the main session keeps the conversation and the person's decisions; the main agent does a task itself only when it is too small (short, the change or answer already known, and leaving little behind), when it needs the person's decisions as it goes, or when it needs the content to continue the conversation; when unsure, it forks without asking and says so in one line, so the person sees the work leave the conversation (D198); delegate holds the reasons and the choice of agent (D138, D142, D143, D149);
     - **the wrap-up offer:** when work stops with steps left, such as "let's stop here", one question, through respond's ask, offers coordinate's learn, then its carryover, since what a session taught and where the work stands are lost when it ends unrecorded; with nothing unfinished, the carryover is not offered, and learn is offered only when the session taught something worth keeping (D107, D115, D164, D199);
     - **the name rule,** worded exactly: "Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, say so plainly and go on with your own judgment." A call inside the set names the skill and nothing more, since this skill is already loaded and the harness gives the folder of a loaded skill. The path is read top-down, `references/organize.md` and then `references/organize/merge.md` for `organize-merge`, since a group skill holds the rules shared by everything under it (D177), and each file whole, since a file reached through another may otherwise be read only in part (D186, D188). The last sentence is there because an agent whose reads were refused answered from the main skill alone and barely said so; every main skill holds it, since reads across sets happen from every set (D193).
  2. **Instructions,** in the order the work happens; understand, act and respond are loaded together at the start of every conversation, and again only when their text is no longer in view, such as after compaction, since compaction can drop their text, and their rules with it (D199); the others when their step comes; each group's Scope line says what it gives back (D178):
     1. **understand** the request, leaving no gap, through understand, whose own skill picks what the request needs, a clear request needing only that check; not "what do you think?" (act's rule) or the person not following the agent (respond's explain);
     2. **throughout, act's rules,** through act, loaded with understand and respond; its own skill names the tools it loads when a step needs them (D179);
     3. **what it will be, and its steps,** when needed, through devise; not a view asked for ("what do you think?", act's rule) (D173);
     4. **arrange things,** when needed, through organize: dividing, joining, grouping or indexing, planning a whole's parts, or checking parts for overlaps and gaps; not changing what the items say, nor the steps of the work (devise) (D164);
     5. **share the work with other agents and later sessions,** through coordinate: a task handed to an agent, by default any task that is not too small, as the advice above says, its result coming back into the conversation; work carried over to a later session; an instruction document every session reads; skillbook set up; or what a session taught (D164);
     6. **do it,** always under act's rules and this skill's steps, using whichever skills fit: another set's main skill where one in the agent's skill list holds that kind of work, loaded and then the skill used by its name rule; otherwise the agent's own judgment; act's rule on a file's type names each type's skill (D152, D200);
     7. **respond,** always, through respond (D179).
  3. **The last instruction:** nothing is returned before respond's check has run on it (D81, D115).
- **Result:** none of its own; its rules shape every response (D136).
- **Files:** `SKILL.md` only (D136).
- **Material:** the pointer and description tests, and how Claude Code and Codex load skills ([../../research/skill-loading.md](../../research/skill-loading.md)); superpowers' start-of-session skill and hyperframes' entry skill with its routing table ([../../research/skill-collections.md](../../research/skill-collections.md)), adapted, never copied (D120).
- **Tests** (D136, D178):
  1. any request in a new session: the main skill loaded first, then understand, act and respond together; respond's layout and act's rightsize with the first response;
  2. a second request in the same conversation, their text still in view: none of them read again; after compaction has dropped it, read again (D199);
  3. "let's discuss X": understand, then discuss;
  4. "is this really done?": act, then verify;
  5. "design a CLI for X": devise, then design;
  6. "add dark mode and release it": devise, then plan;
  7. "split this document into parts": organize, then split;
  8. "plan the sections of this report before I write it": organize, then split, not devise's plan (D148);
  9. "write a carryover": coordinate, then carryover;
  10. "what do you think about X?": act's rule, a view, and a plan where one helps, not understand (D137, D199);
  11. "I don't follow": respond, then explain;
  12. "trim this report", which exists: act, then rightsize's lean, not organize (D157);
  13. "fix the layout of this file", authoring installed: authoring's markdown, through authoring's main skill; not installed: respond's layout and the project's linter through act's verify (D152, D158);
  14. a request no group or set covers yet, such as "write a deploy script": done directly under act's rules;
  15. a request that needs another set's skill, that set installed: that set's main skill loaded, then the skill by its name rule, not by a path guessed without loading it (D152, D187, D199);
  16. "let's wrap up" with steps left: the wrap-up offer, one question offering learn, then carryover; with nothing unfinished, no carryover offered, and learn offered only when the session taught something worth keeping (D107, D115, D199);
  17. a task that is not too small: delegated through coordinate's delegate; unsure whether it is too small: a fork, without asking (D138, D143);
  18. the baseline built: its start-up measured against about 5,000 tokens for the files loaded at every start, the main skill and the three group files, advice with its reason, since they are carried on every turn of every session; measured at about 20,000 characters, roughly 5,000 tokens, in Claude Code (D149, D199);
  19. "use `organize-merge`", organize's file not yet read: `references/organize.md` then `references/organize/merge.md`, read whole, no search (D186, D188);
  20. the baseline built, after automatic compaction, with real, longer reference files: the agent still uses the real text of a file read before, and whether a sentence telling it to read the file again is needed (D188);
  21. the baseline built, after automatic compaction: essentials still chosen for a new request, with and without the pointer, since an open Claude Code issue reports that the skill list is not sent again after automatic compaction, which was read in the issue and not reproduced ([../../research/skill-managers.md](../../research/skill-managers.md), D188).
  22. a skill file renamed or moved: the agent looks for it by its name in the skill's folder, reads the file found whole, and goes on; not found, it says so and goes on with its own judgment (D197, D199).
- **Open:** none known. Each other set's line, and the kinds of work the description names, are added when that set is designed (D136, D152, D154, D183); the map of the groups for people is essentials' page in `docs/` (D183). The baseline ran the pointer's test and the two on compaction: the pointer made no difference to the first load, and after compaction neither agent used essentials again, which the reload line in the pointer and this skill's start line address, a retest pending (D199, D200).
