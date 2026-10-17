# Design: coordinate

What a builder needs for coordinate and its sub-skills, essentials' group for working with agents not in this conversation, now, later and in every session (D164); ideas not yet decided are in [../../ideas/conduct.md](../../ideas/conduct.md), kept with conduct's until they are split. Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet.

coordinate belongs to the essentials set (D152, D154, D164).

How skills reach each other here (D107): a sibling within coordinate is read by its path, such as carryover building on brief; a skill in another group is reached through the main skill (D56).

```text
coordinate/
├── delegate/    work given to other agents now
│   ├── council/ several agents, one question, answered independently
│   ├── fanout/  several agents search or read different parts
│   └── crew/    several agents each change their own items; a shared item has one owner
├── brief/       what an agent that was not there is told when it starts
├── carryover/   work carried over to a later session or agent
├── instruct/    instruction documents written and updated
├── setup/       skillbook set up on a machine or in a project, on request
└── learn/       what a session taught
```


## coordinate

- **Purpose:** working with agents not in this conversation: another agent now (delegate, brief), a later session (carryover), and every session, through the instruction documents it reads (instruct), skillbook set up in them (setup) and a session's lessons kept (learn) (D164). Its own `SKILL.md` takes the shape every skill with parts takes: no rules or advice of its own, one routing line per sub-skill read on demand, under three headings (D112, D164).
- **Description:** "Working with agents not in this conversation: work handed to another agent and what it is told, work carried over to a later session, the instruction documents every session reads, skillbook set up, and what a session taught." A draft (D164).
- **Callers:** the main skill, by its routing line (D164); other skills needing one of its sub-skills, through the main skill, such as conduct's verify starting a second agent to check (delegate) (D56, D106); the main skill's wrap-up offer, for learn and carryover; the person, typing it.
- **Flow:** instructions, one routing line per sub-skill read on demand, moved from conduct's own skill (D134, D164):

  **Now:**
  - **delegate:** when a task goes to an agent, the default for any task that is not too small, as the main skill's advice says, or several agents should answer, search or change things in parallel; not for what an agent is told (brief), passing work on for later (carryover), or checking work with a second agent, which starts in verify and uses delegate to start the agent; it gives back the delegated work checked, with its cost and what each agent left behind.
  - **brief:** when a task is handed to an agent, fork or fresh, and what it is told is written; not for who gets the work, its type, tier or cost (delegate), or the state written down for a later session (carryover); it gives back the brief, with the report it asks for (D147).

  **Later:**
  - **carryover:** when work is carried over for later, to a later session or another agent, or picked up from a carryover; offered by the wrap-up offer and at a task's, milestone's or phase's end, with compaction after it when the work continues (D160, D161), never written unasked; not for work given to an agent now (brief, delegate) or what a session taught (learn); it gives back the carryover written, or the state checked and the work continued (D147).

  **Every session:**
  - **instruct:** when a rule in an instruction document, `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md` or the person's own, is added, tidied or cut down, or which file a rule belongs in is decided; not for setting skillbook up (setup), skill files (skillbook-tree) or a carryover (carryover); it gives back the change proposed, in the file it belongs in.
  - **setup:** when skillbook is set up on a machine or in a project, or its pointer is moved between a project's local and shared files; not for writing a rule into an instruction document (instruct) or making a skill (skillbook-tree, in this repository); it gives back the install checked, the pointer added, the blueprint started, the instruction files checked and skills recommended.
  - **learn:** when the person asks what a session taught, or accepts it from the wrap-up offer, and never unasked; not for recording a design decision as it is made (design) or writing the state down for later (carryover); it gives back the highlights judged, each made into a rule, a decision or a note with the person's approval, or dropped.

  A request about working with other agents that fits no line is done with the agent's own judgment, under act's rules (D115).
- **Result:** whatever the sub-skill returns.
- **Files:** `SKILL.md` only (D164).
- **Material:** none of its own.
- **Tests** (D164), each request routed to its sub-skill:
  1. "set up skillbook in this project": setup;
  2. "write a carryover": carryover (D147);
  3. "search these 200 files with cheap agents": delegate, then fanout;
  4. "review this change with three agents, one lens each": delegate, then fanout; "ask three agents whether to use X or Y": delegate, then council (D107);
  5. "add a rule to our `CLAUDE.md`": instruct, not setup (D107);
  6. "write the state down so another agent can continue tomorrow": carryover, not delegate or brief (D107, D147);
  7. "check my work with another agent": verify, which chooses who checks, and delegate to start the second agent; two rows serve one request (D115);
  8. "write the brief for this agent": brief; "who should do this, and at which tier?": delegate (D147);
  9. "this `AGENTS.md` has grown too long": instruct, whose prune step goes through lean (D157);
- **Open:** none known.

## delegate

- **Purpose:** work given to other agents, the default for any task that is not too small, as the main skill's advice says (D65, D99, D138). Its own `SKILL.md` takes the shape every skill with parts takes: its rules, advice, one routing line per kind of delegation, council, fanout and crew, and the last instruction; a single delegated task needs only delegate's own steps (D99, D112, D138). The main session keeps the conversation, the tracking and the person's decisions; the tasks go to agents, forks or fresh ones.
- **Description:** "Giving work to other agents, the default for any task that isn't too small: one agent, a council, a fanout or a crew; fork or fresh agent and its tier, by what the task needs and what it costs; tracking it while the conversation goes on, and checking the work; what the agent is told is brief's. Use for any task handed to an agent, or when several agents should answer, search or change things in parallel." A draft (D138, D142, D147).
- **Callers:** coordinate's own skill, by its routing line (D134, D138, D164): when a task goes to an agent, the default for any task that is not too small, or several agents should answer, search or change things in parallel; not for what an agent is told (brief), passing work on for later (carryover), or checking work with a second agent, which starts in verify; it gives back the delegated work checked, with its cost and what each agent left behind. Its other callers: the main skill's advice on delegating by default (D138); design (consolidating, parallel work, review), implement's plan, understand's survey, test's experiment, authoring's edit for parallel passes (D70); verify, when a second agent checks the work (D115).
- **Flow** (D99, D107, D138). Rules, each with its reason:
  1. **The main session keeps the conversation, the tracking and the person's decisions; tasks go to agents.** A main session filled with every task's output loses the person's thread and its own context.
  2. **Independence needs a fresh agent:** a review, fresh eyes, verify's second agent or a council's member is never a fork, since a fork shares the main agent's reasons and blind spots.
  3. **The tier follows what happens if the agent is wrong,** as stakes judges it, read only when it is not plain which row applies, since a fork has no tier and plainly mechanical work fits the first row (D149): the table maps its answers to a tier (D133, D144):

     | If the agent is wrong… | Tier |
     | --- | --- |
     | a later step catches it (a validator, tests, lint) | light if mechanical, else standard |
     | nothing catches it, but one commit undoes it | standard |
     | nothing catches it; shared contracts, production or data | strong |
     | nothing catches it; schemas, public interfaces, auth or security | strong, and a second check |

     When rows overlap, the higher tier wins. Decisions that other work builds on, such as a design, an architecture, a plan or an interface, are judged by what would be built on them, not by how easily their file is reverted: the strong tier and high effort, since a wrong decision costs more than the model; the strongest model, which each reference file names, only after the strong tier has tried and fallen short (D150). Work that will need a judgment review is not given to the light tier, since checking weak judgment costs about what redoing it at the standard tier does (D115, D137). A skill names tiers, never a model: each harness's reference file maps them to the names it takes, since names differ by harness and skills stay generic (D139, D144). A fork runs on the main agent's model, so the tier applies to fresh agents.

     **The effort follows how much reasoning the step needs,** chosen apart from the tier, since the model is what an agent can get right at all and the effort how much it thinks on each step (D143, D144):
     - **low:** the step only carries something out: known edits, searching, reading for a fact, a sweep;
     - **default,** the harness's: ordinary work;
     - **high:** judgment that nothing after it checks: validating, an unclear failure, a design choice, a final synthesis.

     A step a later one checks can think less. The two need not match: a sweep over security-sensitive code with a validator behind it runs at the standard tier and low effort; a tricky function that tests will check, at the standard tier and high effort. A fork keeps the main agent's model and effort. A wide fanout never inherits the main session's effort, since its cost multiplies by its agents; the main session's own effort is the person's choice and is never changed. Effort is set only where the harness lets a skill set it, since thinking is paid at output price and how far a skill may set it is the harness's limit (D139, D143).
  4. **A failure's obstacle is checked first:** missing information, permissions, the network or a missing tool is fixed or asked about, never met with a stronger model, which costs more and fixes none of them (D115, D137).
  5. **Delegation never widens what is allowed:** a risky action inside the delegated work comes back as a proposal in the agent's report, as act's rule on delegated agents says, and the main agent puts it to the person (D138).
  6. **The work is checked through verify,** since an agent's report of success is not evidence (D89). When verify itself started the agent, to check work, the report goes back to verify as that check, not through verify again (D137).
  7. **A question or approval prompt shown inside a delegated agent is reported to the person, never answered for them,** since the answer is theirs (D138).
  8. **The harness's limits on delegating hold,** a variation of act's rule on which instruction wins: a mode that needs the person's opt-in, limits on agents starting agents, how many run at once, which kinds of agent exist. delegate guides within them; the harness's habits about when to delegate are what delegate refines; and no tool is brought in that neither the harness nor the person chose (D139).

  The cost is guardrails' rule: a large delegation, many agents or a long job, above the trivial cost and not already accepted for that kind of work, is proposed with its cost first, and on a plan with usage limits, usage counts as cost, stated in those terms where the harness shows it; a single fork or fresh agent is never asked about, so guardrails is read for the cost only when several agents or a long job are planned (D92, D107, D138, D149). What an agent is told, with act's rule on delegated agents and the report it asks back, is coordinate's brief (D107, D129, D147).

  Advice (D138):
  - **fork or fresh,** a sample of how the `SKILL.md` puts it (D142): before delegating, list what the agent needs from this conversation to do the task well: decisions made, files already read, constraints, what the person wants. Then judge two things:
    - **how much it needs:** a short list, such as a goal, a few file pointers, a constraint and what to report, means the task needs little of the conversation, so a fresh agent, which carries only its brief, is cheaper over many turns; a long list, or one whose items only make sense with the discussion behind them, such as "the wording we agreed" or "the exception the person raised", means a fork, which already holds them and needs no brief;
    - **how long the task is,** judged from its shape, not counted: short when the change or answer is already known and only has to be carried out, such as applying these edits, recording what was agreed, or running a command and reporting; long when something has to be found first or the work loops, such as searching, researching, debugging, running tests and fixing until they pass, or reading many files;
    - **then:**
      - short and leaving little behind: the main agent does it itself; the cases are the main skill's advice (D149);
      - short, but it reads or produces a lot: a fork;
      - long, with a short list: a fresh agent, on a lighter model when the work is mechanical or a later step checks it;
      - long, with a long list: a fork; when the harness shows the agent its window nearly full, the list written to a file and given to a fresh agent instead;
      - a review, a second check or a council's member: a fresh agent, whatever it costs, by rule 2;
    - **why:** every turn of an agent pays again for everything in its context; a fork's context is the whole conversation, a fresh agent's its start-up, the brief and what it reads, so over a few turns the fork's cheap start wins and over many the smaller context wins. The judgment needs no token count, which most harnesses do not show the agent; where it is hard to make, the two choices cost about the same. The worked figures and the reasoning are in the research note on what tokens cost ([../../research/token-cost.md](../../research/token-cost.md)), for the builder; the `SKILL.md` keeps this reason as one line of its own, since the blueprint does not ship (D149);
  - what delegating buys besides a free conversation, for choosing the agent: hard work, to a stronger model, when the work is self-contained and briefable; wide, light reading, to a lighter model, once a search has narrowed what it can, as instruction 1 says, delegated when what remains is many times larger than a fresh agent's start-up, the briefs and the reports, very roughly 80,000 to 100,000 tokens or more, an estimate from the measured costs (D105, D116, E8, E9);
  - the rule against delegating once the files are read is about a fresh agent reading them again, so it does not hold for a fork, which inherits what was read;
  - the running list: each delegated task, its agent, fork or fresh and its tier, when it started and what it should give back; one line to the person when it starts and when it comes back, and the whole list when asked; cleanup reads it for the agents to stop;
  - waiting: for the harness's notice that the work is done, not checking repeatedly, which costs turns while a finished task is reported anyway;
  - reporting: to the person in a few lines, the outcome, what needs their decision and what was left behind; the full report kept in the scratch place and offered, not pasted; a report that arrives mid-discussion gets one line at the start of the next turn, and a question only when a decision is needed now, as discuss's rule on side topics says;
  - a delegated agent's result is taken from what it hands back, its report or a file it writes;
  - the means: the harness's own, such as Claude Code's subagents, forks and background tasks; a tool the person names is used through that tool's own skill or documentation, delegate's rules still holding (D115, D139).

  Instructions, in the order the work happens:
  1. **Choose the type** (D142). When the caller names one, it is used. Otherwise the cost check comes first: several agents cost more than one, each with its start-up, its brief and a report the main session then carries, so several only when the parts are large, since one agent working through them in turn carries every earlier part on each later turn; when independence or different lenses improve the result; when time matters and the person accepts the cost; or when one agent's context would fill up before it finished. A search comes before any reading fanout, since searching alone cost half as much as fanning out (E8). Then one agent, or one of three:
     - **council:** when several agents should answer the same question independently, to see where judgments differ; not for splitting the work (fanout), parallel changes (crew), or a recommendation, which the main agent weighs through understand's weigh only when the person asks; it gives back the answers compared, the disagreements kept, for the person to decide;
     - **fanout:** when the work splits into parts, each agent with a part the others do not have: a place to search or read, a sub-question, or one review lens each, so a review with one lens per agent is a fanout; not for the same question to each agent (council) or changes (crew); it gives back the findings combined, each with its source, checked against the sources and validated;
     - **crew:** when several agents each change their own items of one job in parallel; not when every change lands in one file, which is a single task, or for reading only (fanout); it gives back the changes made, the shared items applied by their owner, and one pass over the whole.
  2. **Choose fork or fresh** for each agent, as the advice says; a council's members, a review's lenses and verify's second agent are fresh, by rule 2 (D142).
  3. **Choose the model, then the effort,** for each fresh agent: the tier by rule 3's table, then the effort by how much reasoning the step needs; a fork runs on the main agent's model and effort (D142, D143, D144).
  4. **State the cost** where guardrails' rule asks: several agents or a long job (D149).
  5. **Brief,** by coordinate's brief, which also sets the report it asks back (D147).
  6. **Start it:** it goes on the running list, and the person gets one line.
  7. **Wait,** while the conversation goes on.
  8. **Check the result,** by rule 6; a failure, by rule 4.
  9. **Report** in a few lines; any proposal from it goes to the person through conduct's ask.
  10. **Last instruction, before the work is reported done:** every delegated task checked, or reported as failed, and marked done on the running list; its leftovers through conduct's cleanup, when an agent created or started anything (D149); its cost stated where guardrails asks.

  Done when the work is checked through verify and reported with its cost (D107).
- **Result:** the delegated work, checked, with its cost and what each agent left behind, in cleanup's three fields (D129, D137).
- **Files:** `SKILL.md`; `references/claude.md` and `references/codex.md`, of which delegate reads only the current harness's (D149), mapping the tiers to the model names that harness takes, and the efforts to its effort levels, saying whether a skill may set an agent's effort, naming its own tools for subagents, whether it can fork, its limits on delegating, and, where the person picks models from several providers, how to find the ones available (D99, D138, D139, D143, D144); how its fork uses the cache, and what context use it shows the agent, such as a warning near the limit, which delegate uses only where it is shown without extra work; reading a session's transcript for its token counts is for measuring, never for routine choices (D142). For Claude: light, standard and strong are haiku, sonnet and opus, the short names Claude Code takes; fable only after opus has been tried on the same work and fallen short, since it costs more (D107); Haiku 5.5's price step, every token five times dearer once a prompt passes 100,000 tokens, kept in `references/prices.md` (D144, D149). Claude Code lets a fresh agent's effort be set when the person, their instruction file or a skill asks for it, and delegate's effort lines are that ask; a fork keeps the session's (D143). Codex's file maps the tiers to OpenAI's models, checked when it is written (D144). The person's own instruction file can set or override the mapping; with no mapping, neither a reference file nor the person's, every agent runs on the session's model, since a guessed name could start an agent that does not exist, or one that costs more than meant (D144). The reference files are interim: how to drive each agent program moves to rigs once rigs is designed (D107). `references/prices.md` holds each model's price, any price step and the date read, read only when a cost is stated, since choosing a tier needs only the names; `references/other-harnesses.md` holds the rules for other harnesses below, read only when one is named (D149).
- **Material:** the person's `delegation-routing`; trailscout; meddah; superpowers' subagent-driven development; VaultOps' supervisor and experts.
- **Tests** (D107):
  1. a question one search answers: searched directly, too small to delegate (D138);
  2. a subagent failing on a permission error: the permission fixed or asked about, not a stronger model;
  3. a delegation: its brief written by coordinate's brief, which delegate does not restate (D147);
  4. a delegation over the trivial cost: the cost stated before any agent starts;
  5. a fanout finding whose source does not say what it claims: refuted;
  6. a crew job where every change lands in one file: a single task, not a crew (D115);
  7. a council whose members disagree: the disagreement kept in the summary;
  8. a one-line edit: done directly (D138);
  9. unsure whether a task is too small, even with the examples: a fork, without asking the person; the one-line start notice still shown (D138, D143);
  10. a task the conversation just decided: a fork with a one-line brief (D138);
  11. a review: a fresh agent, never a fork (D138);
  12. wide reading: fresh agents at the light tier (D138);
  13. a task starts: one line, added to the running list; "what's running?": the list (D138);
  14. a report arrives mid-discussion: one line at the next turn (D138);
  15. a council of five above the trivial cost: proposed with its cost; a single fork: not asked about (D138);
  16. a delegated agent wants to delete files: the proposal comes back and is put to the person (D138);
  17. a question prompt inside a delegated agent: reported, not answered (D138);
  18. the person names a tool to run agents in: its own skill, delegate's rules still holding (D139);
  19. verify starts a second agent: its report goes back to verify (D137);
  20. a review with one lens per agent: fanout (D138);
  21. a harness whose multi-agent mode needs the person's opt-in: a large fanout uses ordinary agents, or asks, never that mode unasked (D139);
  22. a harness without forks: a fresh agent with a full brief (D138);
  23. a tool nobody named: never used to run agents (D139);
  24. recording what was agreed, in a long conversation: a fork (D142);
  25. a long task with a short list, such as measuring something by running a tool: a fresh agent, at the light tier where the work is mechanical or a later step checks it (D142);
  26. a review whose list would be long: still a fresh agent (D142);
  27. parts a search can find: searched, no fanout (D142);
  28. the harness shows the window nearly full, and the list is long: a fresh agent, with the list in a file (D142);
  29. choosing fork or fresh: no token count computed or asked for (D142);
  30. a mechanical sweep fanout: low effort, never the main session's (D143);
  31. a validator, which nothing checks: high effort (D143);
  32. a fork: its effort not set, the main session's kept (D143);
  33. any delegation: the main session's own effort never changed (D143);
  34. a sweep over security-sensitive code with a validator behind it: the standard tier and low effort (D144);
  35. a tricky function that tests will check: the standard tier and high effort (D144);
  36. delegate's own text: tiers and effort levels only, no model named (D144);
  37. a harness with no reference file and no mapping from the person: every agent on the session's model (D144);
  38. the person's instruction file maps a tier to another model: that model used (D144);
  39. a single fork for a decided task: neither stakes nor guardrails read (D149);
  40. a fanout of five: guardrails' cost rule read, the cost stated (D149);
  41. a delegation with no cost to state: the prices file not read; no other harness named: its file not read (D149);
  42. a design or a plan delegated: the strong tier and high effort, though its file is easy to revert (D150);
  43. the strong tier fell short on a design: the strongest model, as the reference file names it (D150).
- **Other harnesses** (D102), in `references/other-harnesses.md`, read only when the person names another agent program or one on their allow-list fits the task, since most delegations never need it (D149): delegation may run another agent program, such as Codex or Gemini's command-line agent, only for harnesses on the person's allow-list in their own instruction file. Sending a project's files to another company needs the person's approval per project and per harness (outward, D92); the other harness runs read-only by default, writing only as a crew member with an approved scope; its cost follows guardrails' rule on cost; its findings come back in fanout's format and are checked through verify; a harness started by delegation follows act's rule on delegated agents. A harness not on the allow-list is not used, and the agent may propose adding it; one without a reference file is started only after asking the person (D115). Each harness has a reference file: how to start it non-interactively, its read-only flag, its output format, its models mapped to the tiers.
- **Open:** Codex's subagents and models, for its reference file; a test of delegating to `codex exec` (D102). Agents debating in rounds, one arguing each side, for weigh's debate: whether it helps is recalled from memory, not checked, and is researched before delegate takes it up; if it helps and brings rules of its own, it may become a debate part of weigh (D132).

### council

- **Purpose:** several agents answer the same question about the same material independently; one sums up, the person decides (D65, D99). It compares independent judgments of one question over the same material; fanout splits the work into parts, a different place or a different sub-question each, and combines the findings, so a review with one lens per agent is a fanout (D107, D115).
- **Description:** "Several agents answer the same question independently, about three; the answers compared, disagreements kept, the person decides." A draft (D107).
- **Callers:** delegate, by its routing line (D138): when several agents should answer the same question independently; not for splitting the work (fanout), parallel changes (crew) or a recommendation; it gives back the answers compared, the disagreements kept.
- **Flow** (D99, D101, D107): the question scoped; the members chosen, about three, as advice: enough to see disagreement while staying cheap (D116); mixing models and agents where it helps (different models; a Codex agent beside a Claude one), since answers from one model share its blind spots, and none at the light tier, since each answer is a judgment (D115); each member briefed with the question and the material only, never the main agent's own view; each answers on its own; a summary that keeps the disagreements and says which member said what; every answer kept visible; the person decides or asks for more. How to start another agent is in delegate's reference file for it; the cost follows guardrails' rule on cost.

  Done when every member has answered and the summary, with the answers beside it, is in front of the person (D107).
- **Result:** the summary, with the answers beside it.
- **Files:** `SKILL.md` only.
- **Material:** rig and workslate (posts, a spokesman, the person as authority).
- **Tests** (D107): members who disagree: the disagreement kept, each view named by its member; a question with the main agent's view already stated: the view absent from the members' briefs; "should we use X or Y?" asked of three agents, and "review this change" asked of three for overall verdicts: both councils (D115).
- **Open:** none known.

### fanout

- **Purpose:** the work split into parts, each agent with a part the others do not have, a different place to look or a different sub-question such as one review lens, and the findings combined (D99, D107, D115). A council, by contrast, asks every member the same question.
- **Description:** "Several agents search or read different places; their findings, each with its source, combined, checked against the sources and validated." A draft (D107).
- **Callers:** delegate, by its routing line (D138): when the work splits into parts, each agent with a part the others do not have, one review lens each included; not for the same question to each agent (council) or changes (crew); it gives back the findings combined, checked and validated. Its other callers: understand's research and its parts, survey above all; any wide, light reading.
- **Flow** (D99, D107):
  1. **Split by part, not by count:** each agent gets a part the others do not have: a place (official sources, code, issue trackers; a folder, a symbol, a date range) or a sub-question (for a review, one lens) (D115).
  2. **Search or read,** each agent at low effort, since validation checks after it (D144): each writes its findings in the findings format, whose one home is understand's research, to its own file in the scratch place, and reports only the path, the count and what it could not find, as coordinate's brief's report rule says, so the findings never pass through the main context (D149); how its agents write them so the script can read them is fanout's, and delegate and other harnesses use it (D115, D128).
  3. **Consolidate** with `scripts/consolidate`, not by an agent, reading step 2's files, in its format (D149): duplicates merged, nothing dropped; the script also checks that each quote exists at its source and marks the ones that do not.
  4. **Validate adversarially:** a validator at high effort, its tier by delegate's table, since nothing checks after it (D144), reads the consolidated file by path and tries to refute the findings the answer rests on, and any that contradict each other, defaulting to "refuted" when unsure, since an unchecked finding is plausible, not true; the rest are listed as "not validated", and the script's quote check still runs on all (D149).
  5. **Synthesize** the answer, by the main agent, which reads only the validated findings, saying what was skipped and what was not validated (D149).

  Advice (D144): a light agent's part is sized so its context stays under its model's price step, where its model has one, since above the step every token costs several times more; the step is in delegate's prices reference file (D149).

  Done when every finding the answer rests on, and every pair that contradicts, is validated or refuted, the rest marked "not validated", and the answer says what was skipped (D107, D149).
- **Result:** the findings that survived validation, with sources, those not validated marked so, and what was skipped (D149).
- **Files:** `SKILL.md`; `scripts/consolidate` (D107).
- **Material:** the person's `delegation-routing` (sweep, consolidate, validate, synthesize); trailscout.
- **Tests** (D107): a finding quoting words not at its source: marked by the script; a finding with a real quote but a wrong claim: refuted by the validator; an agent that found nothing: its "not found" kept in the answer; "review this change for security, performance and correctness": a fanout, three sub-questions (D115); a light sweep whose part would pass its model's price step: split into smaller parts (D144); five agents' findings: each written to its own file, the main context holding only paths and counts until the validated findings are read (D149); a finding the answer does not rest on: marked "not validated", its quote still checked by the script (D149).
- **Open:** the form its agents write the findings format in, for `scripts/consolidate`, is to define (D128).

### crew

- **Purpose:** several agents each change their own items of one job in parallel; a shared item has one owner, and the others send it their changes as proposals (D99, D107, D115).
- **Description:** "Several agents each change their own items of one job; a shared item has one owner, who applies the others' proposals; then one pass over the whole." A draft (D107).
- **Callers:** delegate, by its routing line (D138): when several agents each change their own items of one job in parallel; not when every change lands in one file, or for reading only (fanout); it gives back the changes made and one pass over the whole. Its other callers: design's parallel staged mode, when several agents work in one blueprint; authoring's edit, for parallel passes over one document (D70, D107).
- **Flow** (D99, D107):
  1. **Plan the parts,** through plan, which divides the work through organize (D155): each agent's part and scope, and which items are shared; the plan listed first, as guardrails' rule for wide changes says, waiting for approval only where guardrails' other kinds apply (D137).
  2. **One owner per item:** no item is written by two agents, since parallel writes to one item overwrite each other; a shared item, such as an index or a changelog the others' changes touch, has one owner, and the others send it their changes as proposals that the owner applies, or it waits for the pass in sequence (D115).
  3. **Run in parallel;** each re-reads its file from disk after writing, since another agent may have written beside it; this is crew's own rule, beside guardrails' safe writes, which check before writing (D137).
  4. **One pass in sequence** over the whole, by the main agent, to join what the parallel pass left separate (D115).
  5. **Check** through verify.

  Done when the pass in sequence is finished and verify passes (D107). A job whose changes all land in one item is not a crew: it runs as a single task, or, when several views are wanted first, as a fanout whose findings one agent applies (D115).
- **Result:** the changes, checked through verify.
- **Files:** `SKILL.md` only.
- **Material:** meddah's parallel writing.
- **Tests** (D107, D115): four agents on four files: each writes only its own; four files and one shared index: the index has one owner, who applies the others' proposals; edits whose changes all land in one file: a single task, not a crew.
- **Open:** none known.

## brief

- **Purpose:** writing for a reader who was not in the conversation and starts now: a delegated agent, fork or fresh, given a task (D147). It holds what every such writing needs, which carryover builds on for a later reader, and what a delegation needs: what a fork and a fresh agent each get, and what the brief asks back. delegate decides who gets the work; brief decides what they are told (D138, D146, D147).
- **Description:** "Writing what an agent that wasn't in the conversation is told when it starts: what it needs to start without asking, decisions and constraints not in the files, what was ruled out, the first step and when it is done, references by path, and the report it should give back. Use whenever work is handed to an agent, fork or fresh; carryover builds on it for a later session." A draft (D147).
- **Callers:** coordinate's own skill, by its routing line under "Now" (D134, D147, D164): when a task is handed to an agent, fork or fresh, and what it is told is written; not for who gets the work, its type, tier or cost (delegate), or the state written down for a later session (carryover); it gives back the brief, with the report it asks for. Its other callers: delegate's brief step, for every delegation, council, fanout and crew included; carryover, whose shared parts follow brief's rules; verify, through delegate, when a second agent checks the work (D115, D147).
- **Flow** (D147). Rules, each with its reason:
  1. **The reader can start without asking:** the brief holds what the task needs from the conversation, and nothing the reader can find for itself, since a delegated agent cannot ask the person and a question that comes back in its report costs a whole round (D138, D145).
  2. **Decisions and constraints that are not in the files are stated:** what was agreed, what the person wants, limits the code does not show, since the reader can find them nowhere else.
  3. **What was ruled out or already tried is said,** with why, since otherwise the reader repeats it.
  4. **The first step, and how the reader knows it is done:** the success criterion, since a reader without one stops too early or never.
  5. **References by path, never pasted:** files by path and line, decisions by where they are recorded; pasted contents are paid as output by the writer and again as input by the reader, who reads the files anyway (D142).
  6. **No tool only the writer has is named,** since the reader may run in another harness or session; the brief says what to do, not which of one agent's tools to use. A variation of instruct's wording rule for shared files, as a brief is not an instruction document (D137, D147).

  Advice (D138, D146, D147):
  - a fork needs a line or two, since it already holds the conversation and knows why; a fresh agent gets findings, not files: pointers by file and line, what is ruled out, constraints not in the code, the success criterion and what to report, including what was not found;
  - what to ask back: the report, rightsized for its reader, the main agent, by conduct's rightsize, since every line of it stays in the main context (D145, D146). Its parts: the outcome, worded to name the task, such as "the effort decision recorded: …", never a bare "Done: …"; what needs the person's decision, with any proposal; where the evidence is, by path, never pasted; what was not found or not done; what was left behind, in cleanup's three fields, or "left behind: nothing" for an agent that only read (D129, D149). Anything longer goes to a named file in the scratch place, and the main agent reads only the part it needs. A line or two of context, what was asked and why, is asked for when several delegated tasks run at once, when the job is long and the conversation may move on or be compacted meanwhile, or when the report is kept for a later reader, such as a file, a carryover or the person. A task that was changed or narrowed is said first, always. The brief carries all of this, since a fresh agent may never load rightsize;
  - a fresh agent is told not to load essentials' main skill, since the brief carries what it needs and every fresh agent would otherwise pay for the baseline again; the brief names any skill the agent does need, such as research's fact part for a question to settle (D149);
  - the brief carries act's rule on delegated agents, whose one home is act: questions and proposals back in the report, nothing outward, the work inside the brief, no further delegation (D107, D138);
  - a brief is written in markdown, so conduct's layout lays it out, as it does anything the agent writes (D158).

  **Last instruction, before the brief is sent:** the reader could start without asking; decisions, constraints and what was ruled out are stated; the first step and its criterion are there; nothing is pasted; the report is asked for, in its parts; act's rule on delegated agents is carried; a fresh agent is told not to load the main skill, with any skill it needs named (D149); and rightsize's check passes (D145, D147).
- **Result:** the brief; from the agent, the report it asked for.
- **Files:** `SKILL.md` only (D147).
- **Material:** delegate's earlier advice on the brief and the report back (D138, D146); the person's `delegation-routing` (findings, not files); mattpocock's `handoff` (references by path); adapted, never copied (D120).
- **Tests** (D147):
  1. a fresh agent's brief: pointers by path and line, no pasted file contents;
  2. a fork's brief for a task the conversation just decided: a line or two;
  3. a task that depends on a wording the person agreed: the wording stated, since no file holds it;
  4. a task where one approach was already tried and failed: the brief says so, and why;
  5. a brief with no success criterion: one added before it is sent;
  6. a brief for an agent in another harness: no tool named that only the writer has;
  7. a fresh agent's report: the outcome naming the task, what needs a decision, the evidence by path, what was not found, what was left behind; longer material in a named file the main agent reads only in part (D146);
  8. three delegated tasks running at once: each brief asks for a line on what was asked and why, and each report opens with it (D146);
  9. a task narrowed while it ran: said first in the report (D146);
  10. a fresh agent's brief for a fact to settle: it says not to load the main skill and names research's fact part (D149);
  11. a read-only agent's report: "left behind: nothing" (D149).
- **Open:** none known.

## carryover

- **Purpose:** work carried over for later, to a later session or another agent: the state written down when work stops, and checked and continued from at the start of the later one (D65, D147). It builds on coordinate's brief, whose rules hold for any reader who was not in the conversation, and adds what a later reader needs: what is done, what remains, what is open, what it was written against, where it is kept and how to resume (D104, D147). Its rules are its own, not instruct's (D67). Named carryover, since "carryover" also reads as a brief, handing work to an agent now (D147).
- **Description:** "Carrying work over to a later session or agent: the state written down when work stops, offered at a task's, milestone's or phase's end in a long session, with compaction after it when the work continues, and checked and continued from later; what an agent starting now is told is brief's." A draft (D115, D147, D160).
- **Callers:** coordinate's own skill, by its routing line (D134, D147, D164): when work is carried over for later, to a later session or another agent, or picked up from a carryover; offered by the wrap-up offer and at a task's, milestone's or phase's end, with compaction after it when the work continues (D160, D161), never written unasked; not for work given to an agent now (brief, delegate) or what a session taught (learn); it gives back the carryover written, or the state checked and the work continued. Its other callers: the person, ending or resuming a session; the main skill's wrap-up offer, when work stops with steps left. It is never written unasked (D104, D107, D115).
- **Flow** (D104, D107, D147), the offer and two ways in:

  **The offer** (D142, D147, D160): one question, through conduct's ask, offering the one of two that fits, when two things hold: a boundary has been reached, a task, a milestone or a phase completed with nothing in flight, such as a batch committed, an item recorded or a topic finished; and the session has been long, many turns and files read, or the harness shows the window over about half full, where it shows that without extra work (D142). Either way a carryover is written first, so the work resumes from the note, not from a summary alone (D161): when the next work continues this one, the offer is "write a carryover, then compact and continue from it?", the suggested focus naming the note, such as "continue from the carryover note; keep the open questions"; when it is new work and needs only what fits in the carryover, delegate's test of the list with the carryover as the list, it is "write a carryover and continue in a fresh session?". It is not offered when the session is short, or more than once per boundary: declined, it waits for the next one. Its reason: every call carries the whole conversation, so long sessions dominate the cost, while a fresh session carries its start-up and a page, and a compaction at a boundary, backed by the note, keeps what matters; both beat the harness's own compaction, which comes late, near a full window, costs a call over the whole context and decides for itself what to keep ([../../research/token-cost.md](../../research/token-cost.md)). On yes, the agent writes the note, shows its outline, done, remaining and the first next step, and asks the person to approve it, together with its commit where the project commits its notes; in the same message it gives the exact command to type, from the harness's reference file, its focus naming the note, or for new work the line to start a fresh session with. Compacting and starting a fresh session are the person's to do, since the agent cannot start either and skills stay generic (D139); no skill names a harness's command, and each harness's reference file says how (D160, D161). After the compaction, the agent re-reads the note and checks it against what it was written against, as resuming below says.

  **Write:** a document in markdown laid out by the main skill's rule on layout (D95, D154), rightsized for whoever resumes it, by conduct's rightsize (D145), and written by brief's rules, which hold for any reader who was not in the conversation (D147); about a page, as advice (D116); with seven parts, each needed to resume without asking:
  1. done, each item with its evidence;
  2. remaining, in the order it should be done;
  3. decisions made, each with where it is recorded, by brief's rule on what is not in the files;
  4. uncertain: open questions, and what was assumed but not confirmed;
  5. references: files, decisions, branches, by path, never pasted, by brief's rule, and what was kept on purpose, with where it is and why, as conduct's cleanup reports it (D129);
  6. the first next step, concrete enough to start without asking, by brief's rule on the first step;
  7. written against: the date; in git, the branch, its last commit and any uncommitted changes; without git, the files changed and when (D115).

  For another agent, brief's rule on tools holds: no tool only one agent has is named (D137, D147).

  Done when all seven parts are filled, or a part says "none" (D107).

  **Resume:**
  1. read the newest carryover, the latest date and time in its name (D162);
  2. check it is still true against part 7: files changed since, a branch moved, new commits;
  3. report any difference before acting; when one touches the first next step, ask through conduct's ask and wait, as act's rule on concerns says (D115);
  4. continue from the first next step.

  Done when the differences are reported and the first next step is under way (D107).
- **Result:** the carryover; on resuming, the differences found and the work continued.
- **Where it is kept** (D104, D156, D162): carryover says what goes in, and where it is kept only by default: a file the person names; when they name none, the agent asks, recommending a file named by the date and time it is written, then a short topic, in local 24-hour time, such as `2026-10-17-1530-open-topics.md`, so that sorting by name sorts by time, since a carryover in the response alone is lost with the conversation (D115). Each carryover is a new file, never written over an older one; older ones stay as history, resuming reads the newest, and conduct's lean can propose pruning them when they pile up (D157, D162). Where the project's instruction files point to a keeper, such as blueprint's main skill, the keeper says where it lives and in what form, and carryover's own text names none; blueprint's is its `carryovers/` folder, named the same way (D162).
- **Files:** `SKILL.md`; `references/claude.md` and `references/codex.md`, how each harness compacts with a focus and starts a fresh session, both typed by the person, Codex's still to find out (D104, D160, D161).
- **Material:** workslate and rig (four fields: done, remaining, decisions, uncertain; sender and receiver); mattpocock's `handoff` (references by path); OpenCode's final note; gstack's `context-save`; alirezarezvani's `handoff`.
- **Tests** (D104, D107):
  1. after a multi-step session: all seven parts filled, references by path;
  2. resuming after a commit was added since: the change reported before any action;
  3. nothing left to do: said so, no next step invented;
  4. a carryover for another agent: no tool name that only one agent has;
  5. "I'm stopping for today" with steps left: one question offering learn, then carryover, by the main skill's wrap-up offer; nothing written unasked (D115);
  6. resuming when the branch moved and the first next step depends on it: asked before continuing (D115);
  7. a project without git: part 7 lists the files changed and when (D115);
  8. a batch committed at the end of a long session, the next item needing only what fits in a page: one question offering a carryover and a fresh session (D147);
  9. the next item depends on the discussion just had: a carryover, then compaction, its focus naming the note and that discussion, not a fresh session (D147, D160, D161);
  10. a short session at a phase's end: no offer (D147);
  11. the offer declined: not made again until the next boundary (D147, D160);
  12. a carryover's decisions, references and first next step: written by brief's rules, not restated here (D147);
  13. a project whose instruction files point to blueprint: the seven parts written in the place and form blueprint says (D156);
  14. no keeper loaded and no file named: the agent asks, recommending a file (D115, D156);
  15. a task completed in a long session, the next continuing it: one question offering a carryover, then compaction with a focus naming it (D160, D161);
  16. a milestone completed in a long session, new work next: one question offering a carryover and a fresh session (D160);
  17. a step done with work still in flight: no offer, since it is not a boundary (D160);
  18. the offer accepted with the work continuing: the note written, its outline shown for approval with the command to type, its focus naming the note; after the compaction, the note re-read and checked before continuing (D161);
  19. three carryovers in the folder: the newest, by the date and time in its name, is read, the others left alone (D162);
  20. a carryover written where one already exists: a new file, the older one unchanged (D162);
  21. no keeper loaded and no file named: the recommended file is named by the date and time, then a short topic (D162).
- **Open:** none known.

## instruct

- **Purpose:** writing and updating instruction documents: a project's `AGENTS.md` and `CLAUDE.md`, a `CLAUDE.local.md`, the person's own instruction files (D94). Skill files are not instruct's: they are skillbook-tree's, in this repository (D77).
- **Description:** "Writing or updating instruction documents for agents: AGENTS.md, CLAUDE.md, CLAUDE.local.md and the person's own. Use when adding a rule, tidying or cutting one down, or deciding which file something belongs in; setting skillbook up is setup's." A draft (D115).
- **Callers:** coordinate's own skill, by its routing line (D134, D164): when a rule in an instruction document is added, tidied or cut down, or which file it belongs in is decided; not for setting skillbook up (setup), skill files (skillbook-tree) or a carryover (carryover); it gives back the change proposed, in the file it belongs in. Its other callers: the person, at any time ("add a rule to our `CLAUDE.md`", "this `AGENTS.md` has grown too long"); setup, when it writes into an instruction document (D94); learn, promoting a lesson into a rule (D98).
- **Flow** (D94):
  1. **Reader and cost,** by conduct's rightsize's first rule: which agent reads the document, and when; a document read on every turn stays short (D145).
  2. **What it must let an agent answer:** the questions and requests it serves, written first; they are its tests.
  3. **When updating, read the current document first** and keep what is still true.
  4. **Draft,** by the rules below; a new document's parts are planned through organize, whose split takes what the document must cover as its items (D148).
  5. **Prune:** a new document by conduct's rightsize's check; an existing one through rightsize's lean, the one home for removing from what exists; every line that changes nothing removed; what only some work needs moved into a skill or a linked file (D145, D157).
  6. **Check** against step 2.
  7. **Propose:** the person approves before it is saved; an instruction document changes every later session.

  Done when the document answers step 2's questions and the person has approved it (D107).
- **Rules** (D94):
  - **Pointers:** a line read every turn says what something is and when to use it, the key word first.
  - **Steps:** named, each ending on "done when" or what comes next.
  - **Wording:** reasons instead of capitals; positive wording; one example per rule; the project's terms, one word per concept; no reference the reader cannot resolve; in `AGENTS.md` and other shared files, no tool name only one agent has (D107).
  - **Shape:** what every session needs stays in the document; what only some work needs goes to a skill or a linked file, one level away.
  - **Which file:** the person's own files for the person's preferences and the pointer; `CLAUDE.local.md` for project-only personal instructions; a project's shared file only for facts any tool needs, changed only when the person asks (D78, D93).
  - **Limits:** no rule that repeats a skillbook rule where the whole team uses skillbook, as setup says; elsewhere a repeat may stay, so teammates without skillbook keep it. Never an instruction document inside a folder that is copied into other projects, since it would carry rules that are not theirs. Advice: under about 200 lines, since every line is read at every session (D107, D115, D116).
- **Result:** the document, written or updated after approval.
- **Files:** `SKILL.md` only (D94).
- **Material:** mattpocock's `writing-for-agents`; superpowers' `writing-skills`; workslate's and OpenCode's rules for principles files; meddah; the writing guides compared in [../../research/skill-writing-guides.md](../../research/skill-writing-guides.md).
- **Tests** (D94):
  1. "add a rule": added to the right file, with its reason, without repeating a skillbook rule where the team uses skillbook;
  2. a bloated `AGENTS.md` full of procedures: cut down to the facts through rightsize's lean, with the procedures proposed elsewhere (D157);
  3. "ALWAYS" and "NEVER" in capitals: rewritten with reasons;
  4. a tool name only one agent has, in a shared `AGENTS.md`: made neutral (D107);
  5. a personal preference to add: placed in the person's own file, not the shared one.
- **Open:** none known.

## setup

- **Purpose:** skillbook set up, on request: on a machine, the install checked and the pointer added where the skills are installed; in a project, its blueprint started when it has none and the blueprint set is installed, its instruction files checked and skills recommended (D93, D97, D107, D117, D163). It recommends existing skills and makes none (D77). It runs only on request: the first set-up where the install route has not written the pointer, moving the pointer between a project's local and shared files, and checking that a fresh session loads the main skill (D165).
- **Description:** "Setting skillbook up on a machine or in a project, on request: the install checked, the pointer added where the skills are installed or moved between local and shared, a project's blueprint started, its instruction files checked, skills recommended." A draft (D117, D165).
- **Callers:** coordinate's own skill, by its routing line (D134, D164): when skillbook is set up on a machine or in a project; not for writing a rule into an instruction document (instruct) or making a skill (skillbook-tree); it gives back the install checked, the pointer added, the blueprint started, the instruction files checked and skills recommended. Its other callers: the person, setting skillbook up on a machine or in a project.
- **Flow:** three ways in (D97, D165).

  **A machine,** once per computer:
  1. for each agent the person uses, check that each set the person wants is installed, essentials first; if not, show how to install it, by the route decided later (D152);
  2. add the pointer where the skills are installed, through instruct, unless it is already there, by the rule on where it goes below (D165);
  3. no question about which other agent programs delegation may run: none by default, and nothing is written; the result says that one can be allowed by naming it, which then goes into the person's own instruction file as one line in the form setup's reference files give, which delegate reads, since a question whose answer has a safe default costs the person a round (D102, D107, D115, D149);
  4. check that a fresh session loads the main skill for a request that needs a file, such as "what does this project's README say?": the agent starts one where its reference file says how, and otherwise asks the person to start it (D107, D115).

  Done when each agent the person uses loads the main skill on its own.

  **A project,** once per project:
  1. read the project: what it is, its languages and tools, its instruction files and project skills;
  2. start its blueprint through blueprint's main skill when it has none and that set is installed; where it is not, nothing is started or said about it, and each skill's result goes where its default says (D152, D156, D163). Where a blueprint lives in a project the person does not own is asked by blueprint's start step (D117, D163);
  3. check its instruction files through instruct: keep the facts, propose what is missing, such as how to build, test and check. What repeats a skillbook rule is proposed for removal from a shared file only when the whole team uses skillbook; the agent does not ask, counts the team as not using it, and says so in one line, inviting a correction; otherwise it stays, and the person is told why (D107, D115, D149);
  4. recommend what fits: the skillbook sets and skills that will matter there, each named with the reason, such as a language's code skill or maintain's repository standard; outside skills only from sources the person already uses. Installing any of them is an action through guardrails (D107);
  5. propose everything as one list, and apply what the person approves.

  **Moving the pointer,** when the person asks, such as from a project's local file to its shared file once the team commits the skills: the pointer moved through instruct, never left in both, then checked as a machine's step 4 checks it (D165).

  Done when the instruction files hold only what they should and the recommendations are listed. Running either again changes nothing that is already right, and says so (D97). Hooks are proposed only when a rule keeps being broken despite the skills, never by default (D97).

  Decided content:
  - the pointer sentence: "before answering any request, load the essentials skill and follow it, except a one-line answer that needs no tool and no file" (D78, D152, D153). The exception is the pointer's: once the main skill is loaded, act's and respond's rules hold for every request (D115);
  - **where it goes** (D165): where the skills are installed: installed for the person, across projects, their own instruction files, such as `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`; installed in a project and not committed, the project's local file, such as `CLAUDE.local.md`, kept out of git through `.git/info/exclude`, the default for a project; committed for the team, the project's shared `AGENTS.md` or `CLAUDE.md`, since every contributor then has the skills. Which file each harness reads, and whether an install route writes the pointer itself, are its reference file's, settled with the install routes (D165);
  - **Codex's local file:** as far as known, Codex has none that adds to `AGENTS.md`: its `AGENTS.override.md` replaces the shared file in that folder, so Codex's local file is settled with the install routes, its personal file meanwhile (D93, D165);
  - **a project's shared `AGENTS.md` or `CLAUDE.md`** changes only when the person asks, as a proposal; the pointer goes there when the team commits the skills (D165); it holds only the facts any tool needs: what the project is, where things are, the commands, the project's conventions (D78, D93).
- **Result:** what was done, reported: the install checked, the pointer added or moved, the blueprint started, the instruction files checked, skills recommended; instruction files are changed only with the person's approval (D63, D137).
- **Files:** `SKILL.md`; `references/claude.md` and `references/codex.md`, holding each agent's paths and commands: which instruction files it reads, personal, local and shared, how each set is installed and checked, by the route decided later (D152), and the one-line form of the allow-list delegate reads (D97, D102, D107, D137).
- **Material:** Claude Code's official plugins (auditing `AGENTS.md`, hooks, recommending skills); loomcraft's rule files.
- **Tests** (D97):
  1. a machine, skills installed for the person, without the pointer: added to their own files, no project file touched (D165);
  2. a project whose shared `CLAUDE.md` repeats skillbook rules: the team counted as not using skillbook, said in one line with a correction invited, the repeats kept, facts kept (D107, D149);
  3. a Python project: the Python skill and maintain's repository standard recommended;
  4. setup run twice: nothing duplicated;
  5. "add the pointer to our shared `AGENTS.md`" with the skills not committed: proposed with a warning about contributors without skillbook (D165);
  6. a machine where the person uses only Claude Code: Codex not checked, and not reported as missing (D107);
  7. a project where a skill does not fit, such as a language it does not use: not recommended (D115);
  8. a project with no blueprint, that set installed: one started through blueprint's main skill; the set not installed: nothing started and nothing said about it (D163);
  9. a machine set up: no question about other agent programs, no allow-list written, delegation runs none, and the result says how to allow one (D137, D149);
  10. a project install, not committed: the pointer in the project's local file (D165);
  11. the team commits the skills and asks to move the pointer: moved from the local file to the shared one, not left in both, and checked (D165);
  12. an install whose route already wrote the pointer: nothing to do, said so (D165).

  The pointer in the person's own instruction files is not tested yet; Claude Code reading `CLAUDE.local.md` with `CLAUDE.md` is ([../../evidence.md](../../evidence.md), E7).
- **Open:** hooks, until there is a real case; see the ideas document.

## learn

- **Purpose:** what a session taught, and where each lesson goes (D65, D66).
- **Description:** "What a session taught: highlights collected and judged, then, with approval, made into a rule, a decision or a note, or dropped." (D98)
- **Callers:** coordinate's own skill, by its routing line (D134, D164): when the person asks what a session taught, or accepts it from the wrap-up offer; not for recording a design decision as it is made (design) or writing the state down for later (carryover); it gives back the highlights judged, each made into a rule, a decision or a note with approval, or dropped. Its other callers: the person, asking what was learned; the main skill's wrap-up offer, when work stops with steps left; never run by itself unasked (D98, D107, D115).
- **Flow:** decided (D66): collect highlights, the moments in the conversation that changed the work: a correction from the person, a mistake found, a decision taken, a method that worked or failed (D115); judge each one, whether it is reusable, meaning it would apply beyond this session, and where it belongs; promote it with the person's approval, or drop it; record what went where. Where each kind goes (D98):
  - a rule, into an instruction document, through instruct;
  - a decision or an insight, to the keeper where one is loaded, which says where it goes; with none, listed in the response, with the offer of a file the person names (D163).

  Done when every highlight is promoted with approval or dropped, and the record says where each went (D107). Promoting a lesson into a skill, and where highlights wait, are future work (D66, D77).
- **Result:** the promotions, and their record: a list in the response of each highlight and where it went, or why it was dropped; each promotion is also recorded where it lands (D107).
- **Files:** `SKILL.md` only (D98).
- **Material:** workslate's sort of what was learned; mattpocock's and gstack's retro; Claude Code's official plugins.
- **Tests** (D98):
  1. a session where the person corrected the agent's habit twice: proposed as a rule for the person's own instruction file, through instruct;
  2. a session that settled a design choice: proposed as a decision;
  3. a session with nothing reusable: says so, and promotes nothing;
  4. "let's stop here" with steps left: offered with carryover in one question, by the main skill's wrap-up offer (D115).
- **Open:** future work in the roadmap; see the ideas document.
