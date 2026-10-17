# Design: essentials, the main skill

What a builder needs for essentials' main skill, listed to the model like every set's main skill and the one loaded first for any work (D56, D71, D152, D153); ideas not yet decided are in [../ideas/essentials.md](../ideas/essentials.md). It is designed last, once the roots it routes to are designed (D80). Every section answers the same questions (D80); an empty field is not designed yet.

## essentials

- **Purpose:** essentials' main skill, loaded first for any piece of work: it holds the rules every response follows and uses every root a request needs (D56, D57, D71, D136, D152). For now it routes only to what is designed: understand, plan and conduct, and authoring's markdown skill, through authoring's main skill, where that set is installed (D155). Each other root is added when it is designed; until then, the work it will cover is done directly under act's rules (D115, D136).
- **Description:** the one tested (D57), kept as it is: "Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, git commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills." It decides whether the main skill loads at all, so it stays broad while only three roots are routed: act's and respond's rules then hold for any piece of work. A change to it is re-run through the test harness (D136). With the sets, the kinds of work it names are revisited when the other sets' main skills are written, since each of those names its own (D152).
- **Callers:** the harness, by its description, as every set's main skill is listed (D56, D152); the pointer that setup adds to the person's own instruction files (D57, D93); the person, typing it; any skill in essentials that needs another root's skill, by asking the main skill, which routes through that root (D56, D106); a skill in another set, through this main skill by name, never a hidden skill's path (D152).
- **Flow:** in the shape every main skill takes (D112, D136):
  1. **Rules:**
     - act's and respond's rules hold for every request (D63, D115);
     - every response and every markdown file is laid out by conduct's layout, and a markdown file also by authoring's markdown where that set is installed; this is the rule's one home, and respond and act point here; other files follow act's rule on a file's type (D111, D115, D136, D154, D158);
     - everything given back or made, and the work done to get there, is rightsized for its reader, by conduct's rightsize: nothing missing, nothing extra, the point first; rightsize holds the rule and its check, and respond's last instruction runs the check before every response (D145);
     - every skill a request needs is used, together or in turn; a skill limits this only where it says why (D112, D115);
     - a fresh agent delegated a task does not load the main skill: its brief carries what it needs and names any skill it does need, as conduct's brief says (D149);
     - the pointer's exception for a one-line answer is the pointer's: once the main skill is loaded, its rules hold for every request (D78, D115).
  2. **Advice:** strong advice, **delegation by default:** every task goes to an agent, a fork or a fresh one, through conduct's delegate, so the main session keeps the conversation, the tracking and the person's decisions. It holds on cost too; the cost reasoning is delegate's (D143, D149). The main agent does a task itself only in three cases: when it is too small: short, its change or answer already known, and leaving little behind, no large reads or outputs, such as a one-line edit or a single command, since whatever the main session reads is paid for again on every later turn, while what a delegated agent reads is not (D142); when it needs the person's decisions as it goes, since a delegated agent cannot ask them; or when it needs the content itself to continue the conversation, such as reading what is being discussed in order to explain it or decide with the person, since delegating it would mean reading the report and then the content anyway (D143). When the agent cannot tell whether a task is too small, even with these examples, it forks without asking: where the call is hard, the two cost about the same, and the one-line start notice still lets the person stop it (D138, D143). The stage-order advice is held here and added with design and plan, since it names roots the main skill does not route to yet (D136): work usually runs design → plan, then the doing, checking and delivering through the set for its kind of work, softeng for software, authoring for writing, or directly under act's rules where none is installed; that set's own main skill holds the order of its stages. The work decides: a stage that adds nothing is skipped, and work can start at any stage; each stage's own skill says what usually comes next (D76, D115, D154).
  3. **Instructions:** read act, respond, conduct's rightsize and conduct's layout by path, together in one turn, once per conversation, since respond's check runs rightsize before the first response anyway and layout lays out every response (D72, D111, D149, D154, D158). Then one line per root, in the order the work happens (D112, D136):
     - **understand:** when understanding is needed before acting: a topic to discuss, a request not yet clear, a fact to find, options or a choice, an idea to test, a case to make, a name; not for doing the work, "what do you think?" (act's rule) or the person not following the agent (conduct's explain); it gives back what was decided, what was parked and what comes next;
     - **plan:** when the work is multipart, or steps are given to follow; not for single-step work, which is done directly, a single risky action (conduct's guardrails), the person's choice in single-step work (conduct's ask), or a view asked for, which is act's rule, its plan made in plan but only shown; it gives back the plan, one line or full, and the checklist followed (D155);
     - **authoring,** another set, its markdown skill only for now, reached through authoring's main skill where that set is installed: when a request is about a markdown file's layout, such as "fix the layout of this file" or "make this pass the markdown linter", which adds the file rules and the linter check; not for a response's layout (conduct's layout), wording, order and length (respond), how a question is laid out (conduct's ask), commit messages or comments in code (the project's conventions, under act's rules), or writing content, such as docs or a proposal, which is done directly under act's rules until authoring's other skills exist; it gives back the file laid out, and checked by the linter or the reason it could not be (D137, D152). Where authoring is not installed, the fallback: conduct's layout, and the project's linter through verify where there is one (D152, D158);
     - **conduct:** when a request is about the agent's own way of working, asking, explaining, stakes, guardrails, organizing, delegating, briefing, cleaning up, verifying, rightsizing, setup, instruction documents, learning or carryovers, or another root needs one of these; not for respond and act, read first by path, or the person's own work (the other roots); it gives back what its sub-skill returns.

     Any other request, including work the later roots and the other sets will cover, such as design, git or tests, is done directly under act's rules, or through another set's main skill once that set is designed and installed (D115, D136, D152).
  4. **The last instruction:** every response is checked against respond before the person sees it, and what fails the check is fixed first (D81, D115).

  The earlier draft, a diagram of steps routing to one root, gave way to this shape (D108, D112).
- **Result:** none of its own; its rules shape every response (D136).
- **Files:** `SKILL.md` only (D136).
- **Material:** the pointer and description tests, and how Claude Code and Codex load skills ([../research/skill-loading.md](../research/skill-loading.md)); superpowers' start-of-session skill and hyperframes' entry skill with its routing table ([../research/skill-collections.md](../research/skill-collections.md)), adapted, never copied (D120).
- **Tests** (D136):
  1. any request in a new session: the main skill loaded first, and act, respond, rightsize and layout read once, together in one turn (D149, D154, D158);
  2. a second request in the same conversation: none of the four read again;
  3. "let's discuss X": understand, then discuss;
  4. "is this really done?": conduct, then verify;
  5. "check X's limits, then add it": understand's research, then the work done directly under act's rules;
  6. a request no root covers yet, such as "write a deploy script": done directly under act's rules;
  7. a one-line question after the main skill is loaded: respond's rules still hold;
  8. a response that would cite a bare decision number: caught by the respond check and fixed before the person sees it;
  9. writing a YAML file: the project's conventions, not the markdown rules;
  10. respond and act read by path, never routed through conduct;
  11. "fix the layout of this file", authoring installed: authoring's markdown, through authoring's main skill, its file rules and the linter check (D137, D152);
  12. "rewrite this paragraph shorter": respond's rules, done directly, not authoring's markdown (D137);
  13. "what do you think about X?": act's rule, a view and a plan, not understand (D137);
  14. "I don't follow": conduct's explain (D137);
  15. a task that is not too small, such as reviewing a folder of designs: delegated through conduct's delegate (D138);
  16. unsure whether a task is too small: a fork, without asking; the one-line start notice shown (D138, D143);
  17. a short task that reads a long file, such as answering one question from a large document: delegated, a fork, not done in the main session (D142);
  18. a question about the design section being discussed: the main agent reads it itself, not delegated, since it needs the content to continue the conversation (D143);
  19. a long reply that restates the question and repeats what the person already has: caught by the respond check, which runs conduct's rightsize, and cut before the person sees it (D145);
  20. a fresh agent started for a task: told by its brief not to load the main skill (D149);
  21. the baseline built: its start-up measured, against the figure set then (D149);
  22. "fix the layout of this file", authoring not installed: conduct's layout and the project's linter through verify, no file of another set read by its path (D152, D158);
  23. a request that needs another set's skill, that set installed: through that set's main skill, by name, never a hidden skill's path (D152);
  24. "add dark mode and release it": plan, the person's two items kept at the top, missing and non-obvious steps found (D155);
  25. "fix the typo in the README": single-step, no plan, done directly (D155).
- **Open:** the line for design, and for the other sets' main skills, and the stage-order advice, added as each is designed (D136, D152, D154).
