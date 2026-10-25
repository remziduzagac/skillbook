# Design: coordinate

What a builder needs for coordinate and its sub-skills, essentials' group for working with agents not in this conversation, now, later and in every session (D164); ideas not yet decided are in [../../ideas/coordinate.md](../../ideas/coordinate.md). Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet.

coordinate belongs to the essentials set (D152, D154, D164).

How skills reach each other here (D107): a skill of the set, in the same group or another, is named by its name and read as a file by the main skill's name rule; a skill in another set is reached by loading that set's main skill and using the skill by its name rule; where that set is not installed, the one-line fallback written where it is used holds, and a request pointed to it is done directly under act's rules, as the main skill says (D152, D186, D187).

```text
coordinate/
├── delegate/    work given to other agents now
│   ├── council/ several agents, one question, answered independently
│   ├── fanout/  several agents search or read different parts
│   ├── crew/    several agents each change their own items; a shared item has one owner
│   ├── claude/  current Claude worker controls and mappings
│   └── codex/   current Codex worker controls and mappings
├── brief/       what an agent that was not there is told when it starts
├── carryover/   work carried over to a later session or agent
│   ├── claude/  current Claude transition controls
│   └── codex/   current Codex transition controls
├── instruct/    instruction documents written and updated
├── setup/       skillbook set up on a machine or in a project, on request
└── learn/       what a session taught
```


## coordinate

- **Purpose:** working with agents not in this conversation: another agent now (delegate, brief), a later session (carryover), and every session, through the instruction documents it reads (instruct), skillbook set up in them (setup) and a session's lessons kept (learn) (D164). Its own plain file has no rules or advice of its own, and one routing line per sub-skill read on demand, under three headings (D112, D164).
- **Description:** "Working with agents not in this conversation: work handed to another agent and what it is told, work carried over to a later session, the instruction documents every session reads, skillbook set up, and what a session taught. Use when work goes to an agent not in this conversation, now, later or in every session, or another skill needs one of these." A draft (D164).
- **Callers:** the main skill, by its routing line (D164, D171, D172); other skills needing one of its sub-skills, through the main skill, such as act's verify starting a second agent to check (delegate) (D56, D106); the main skill's wrap-up offer, for learn and carryover; the person, typing it.
- **Flow** (D134, D164).

  **Scope:** when work goes to an agent not in this conversation, now, later or in every session: delegating, briefing, a carryover, an instruction document, setting skillbook up or moving its pointer, or what a session taught, or another group needs one of these; not for the person's own work (the other groups) or what is said to the person or how the agent works (respond and act); it gives back what its sub-skill returns (D164, D171).

  Instructions, one routing line per sub-skill read on demand (D134, D164):

  **Now:**
  - **delegate** (`coordinate-delegate`): Read `coordinate-delegate` when work goes to another agent, or several agents should answer, search or change things. Follow the main skill’s delegation advice; not for what an agent is told (brief), passing work on for later (carryover), or checking work with a second agent, which starts in verify and uses delegate to start the agent; it gives back the delegated work checked, with its cost where one is stated and what each agent left behind.
  - **brief** (`coordinate-brief`): Read `coordinate-brief` when you write instructions for an agent starting work now, whether forked or fresh; not for who gets the work, its type, tier or cost (delegate), or the state written down for a later session (carryover); it gives back the brief, with the report it asks for (D147).

  **Later:**
  - **carryover** (`coordinate-carryover`): Read `coordinate-carryover` when you write or resume a record of work for a later session or agent, or offer a handoff at a boundary in a long continuing session; offered by the wrap-up offer and at a task's, milestone's or phase's end in a long session (D160); not for work given to an agent now (brief, delegate) or what a session taught (learn); it gives back the carryover written, or the state checked and the work continued (D147).

  **Every session:**
  - **instruct** (`coordinate-instruct`): Read `coordinate-instruct` when you add, update or prune instructions that agents read; not for setting skillbook up (setup), a skill's own design or files (the project's skill-making skill where it has one, otherwise the agent's own judgment) or a carryover (carryover); it gives back the change proposed, in the file it belongs in.
  - **setup** (`coordinate-setup`): Read `coordinate-setup` when the user asks to set up skillbook on a machine or in a project, check its setup, or move its installed pointer; not for writing a rule into an instruction document (instruct) or making a skill (the project's skill-making skill where it has one, otherwise the agent's own judgment); it gives back the install checked, the pointer added, the blueprint started, the instruction files checked and skills recommended.
  - **learn** (`coordinate-learn`): Read `coordinate-learn` when the user asks what a session taught, or accepts the lesson part of the stopping offer; not for recording a design decision as it is made (design) or writing the state down for later (carryover); it gives back the highlights judged, each made into a rule, a decision or an insight with the person's approval, or dropped.

  A request about working with other agents that fits no line is done with the agent's own judgment, under act's rules (D115).

  **Last instruction, before anything is returned:** the sub-skill's own last instruction holds (D134).
- **Result:** whatever the sub-skill returns.
- **Files:** `references/coordinate.md` (D260).
- **Material:** none of its own.
- **Tests** (D164), each request routed to its sub-skill:
  1. "set up skillbook in this project": setup;
  2. "write a carryover": carryover (D147);
  3. "search these 200 files with cheap agents": delegate, then fanout;
  4. "review this change with three agents, one lens each": delegate, then fanout; "ask three agents whether to use X or Y": delegate, then council (D107);
  5. "add a rule to our `CLAUDE.md`": instruct, not setup (D107);
  6. "write the state down so another agent can continue tomorrow": carryover, not delegate or brief (D107, D147);
  7. "check my work with another agent": verify, which chooses who checks, and delegate to start the second agent; two lines serve one request (D115);
  8. "write the brief for this agent": brief; "who should do this, and at which tier?": delegate (D147);
  9. "this `AGENTS.md` has grown too long": instruct, whose prune step goes through lean (D157);
  10. "what did this session teach?": learn, not carryover (D98);
  11. "move the pointer to our shared `AGENTS.md`": setup, not instruct (D165).
  12. Reads the Codex child via its parent and returns the actual proposed mapping/capability limits, without a claimed live spawn. Reject: false startup, unsupported approval or missing concrete result.
  13. Reads the current carryover Codex child and gives commands/startup focus, retaining review and execution limits. Reject: false startup, unsupported approval or missing concrete result.
  14. Keeps foreign documentation inspection separate from the operational current-harness route. Reject: false startup, unsupported approval or missing concrete result.
  15. Does not treat reference inspection as native routing or a performed transition. Reject: false startup, unsupported approval or missing concrete result.
  16. Offers a carryover through the main flow without writing or treating task completion as a stopping instruction. Reject: false startup, unsupported approval or missing concrete result.
- **Open:** none known.

## delegate

- **Purpose:** work given to other agents, the default for any task that is not too small, as the main skill's advice says (D65, D99, D138). Its own plain file holds its rules, advice, one routing line per kind of delegation, council, fanout and crew, and the last instruction; a single delegated task needs only delegate's own steps (D99, D112, D138).
- **Description:** "Giving work to other agents, the default for any task that isn't too small: one agent, a council, a fanout or a crew; fork or fresh agent and its tier, by what the task needs and what it costs; tracking it while the conversation goes on, and checking the work; what the agent is told is brief's. Use for any task handed to an agent, or when several agents should answer, search or change things in parallel." A draft (D138, D142, D147).
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D172). Its other callers: the main skill's advice on delegating by default (D138); design's review, one agent per lens for a large design (D168), devise's plan, handing parts to agents (D155), understand's survey, test's experiment, authoring's edit for parallel passes (D70); verify, when a second agent checks the work (D115).
- **Flow** (D99, D107, D138). Rules, each with its reason:
  1. **The main session keeps the conversation, the tracking and the person's decisions; tasks go to agents.** A main session filled with every task's output loses the person's thread and its own context.
  2. **Independence needs a fresh agent:** a review, fresh eyes, verify's second agent or a council's member is never a fork, since a fork shares the main agent's reasons and blind spots.
  3. **The tier follows what happens if the agent is wrong,** as stakes judges it; stakes is read only when it is not plain which row applies, since a fork has no tier and plainly mechanical work fits the first row (D149). The table maps its answers to a tier (D133, D144):

     | If the agent is wrong… | Tier |
     | --- | --- |
     | a later step catches it (a validator, tests, lint) | light if mechanical, else standard |
     | nothing catches it, but one commit undoes it | standard |
     | nothing catches it; shared contracts, production or data | strong |
     | nothing catches it; schemas, public interfaces, auth or security | strong, and a second check |

     When rows overlap, the higher tier wins. Decisions that other work builds on, such as a design, an architecture, a plan or an interface, are judged by what would be built on them, not by how easily their file is reverted: the strong tier and high effort, since a wrong decision costs more than the model; the strongest model, which each reference file names, only after the strong tier has tried and fallen short, since it costs more (D107, D150). Work that will need a judgment review is not given to the light tier, since checking weak judgment costs about what redoing it at the standard tier does (D115, D137). A skill names tiers, never a model: each harness's reference file maps them to the names it takes, since names differ by harness and skills stay generic (D139, D144). The person's own instruction file can set or override the mapping; with no mapping, neither a reference file nor the person's, every agent runs on the session's model, since a guessed name could start an agent that does not exist, or one that costs more than meant (D144). A fork runs on the main agent's model and effort, so the tier and the effort are chosen for fresh agents only.

     **The effort follows how much reasoning the step needs,** chosen apart from the tier, since the model is what an agent can get right at all and the effort how much it thinks on each step (D143, D144):
     - **low:** the step only carries something out: known edits, searching, reading for a fact, a sweep;
     - **default,** the harness's: ordinary work;
     - **high:** judgment that nothing after it checks: validating, an unclear failure, a design choice, a final synthesis.

     A step a later one checks can think less, since thinking is paid at output price. The two need not match: a sweep over security-sensitive code with a validator behind it runs at the standard tier and low effort; a tricky function that tests will check, at the standard tier and high effort. A wide fanout never inherits the main session's effort, since its cost multiplies by its agents; the main session's own effort is the person's choice and is never changed. Effort is set only where the harness lets a skill set it, by rule 8 (D139, D143).
  4. **A failure's obstacle is checked first:** missing information, permissions, the network or a missing tool is fixed or asked about, never met with a stronger model, which costs more and fixes none of them (D115, D137).
  5. **Delegation never widens what is allowed:** a risky action inside the delegated work comes back as a proposal in the agent's report, as act's rule on delegated agents says, and the main agent puts it to the person (D138).
  6. **The work is checked through verify,** since an agent's report of success is not evidence (D89). When verify itself started the agent, to check work, the report goes back to verify as that check, not through verify again (D137).
  7. **A question or approval prompt shown inside a delegated agent is reported to the person, never answered for them,** since the answer is theirs (D138).
  8. **The harness's limits on delegating hold,** a variation of act's rule on which instruction wins: a mode that needs the person's opt-in, limits on agents starting agents, how many run at once, which kinds of agent exist. delegate guides within them; the harness's habits about when to delegate are what delegate refines; and no tool is brought in that neither the harness nor the person chose, since skills stay generic and impose no outside tool (D139).
  9. **Apply `act-guardrails`' whole cost rule before every worker starts.** A single short worker is not proof of trivial cost. Reuse an actual accepted cost within its kind and scope. Otherwise give the estimate, uncertain amounts, quota usage and any enforced cap separately. Unknown cost is not zero. Read prices only when cost needs stating. Ask through `respond-ask` when approval is needed. End the turn before starting (D260).

  Advice (D138):
  - **fork or fresh** (D142): before delegating, list what the agent needs from this conversation to do the task well: decisions made, files already read, constraints, what the person wants. Then judge two things:
    - **how much it needs:** a short list, such as a goal, a few file pointers, a constraint and what to report, means the task needs little of the conversation, so a fresh agent, which carries only its brief, is cheaper over many turns; a long list, or one whose items only make sense with the discussion behind them, such as "the wording we agreed" or "the exception the person raised", means a fork, which already holds them and needs only the task, success criterion and report request;
    - **how long the task is,** judged from its shape, not counted: short when the change or answer is already known and only has to be carried out, such as applying these edits, recording what was agreed, or running a command and reporting; long when something has to be found first or the work loops, such as searching, researching, debugging, running tests and fixing until they pass, or reading many files;
    - **then:**
      - short and leaving little behind: the main agent does it itself; the cases are the main skill's advice (D149);
      - short, but it reads or produces a lot: a fork;
      - long, with a short list: a fresh agent, on a lighter model when the work is mechanical or a later step checks it;
      - long, with a long list: a fork; when the harness shows the agent its window nearly full, the list written to a file and given to a fresh agent instead;
      - a review, a second check or a council's member: a fresh agent, whatever it costs, by rule 2;
    - **why:** every turn of an agent pays again for everything in its context; a fork's context is the whole conversation, a fresh agent's its start-up, the brief and what it reads, so over a few turns the fork's cheap start wins and over many the smaller context wins. The judgment needs no token count, which most harnesses do not show the agent, and a session's transcript is read for its token counts only to measure, never for a routine choice (D142); where it is hard to make, the two choices cost about the same. The worked figures and the reasoning are in the research note on what tokens cost ([../../research/token-cost.md](../../research/token-cost.md)), for the builder; the plain file keeps this reason as one line of its own, since the blueprint does not ship (D149);
  - what delegating buys besides a free conversation, for choosing the agent: hard work, to a stronger model, when the work is self-contained and briefable; wide, light reading, to a lighter model, once a search has narrowed what it can, as instruction 1 says, delegated when what remains is many times larger than a fresh agent's start-up, the briefs and the reports, very roughly 80,000 to 100,000 tokens or more, an estimate from the measured costs (D105, D116, E8, E9);
  - the running list: each delegated task, its agent, fork or fresh and its tier, when it started and what it should give back; user updates follow the main skill's current-step progress rule; ordinary results go in the final answer and the whole list is given when asked (D260); cleanup reads it for the agents to stop;
  - waiting: for the harness's notice that the work is done, not checking repeatedly, which costs turns while a finished task is reported anyway;
  - reporting: to the person in a few lines, the outcome, what needs their decision and what was left behind; the full report kept in the scratch place and offered, not pasted; a report that arrives mid-discussion goes in the next appropriate final answer, with a question only for a decision needed now, as discuss's rule on side topics says;
  - a delegated agent's result is taken from what it hands back, its report or a file it writes;
  - the means: the harness's own, which its reference file names; a tool the person names is used through that tool's own skill or documentation, delegate's rules still holding (D115, D139).

  Instructions, in the order the work happens:
  1. **Choose the type** (D142). When the caller names one, it is used. Otherwise the cost check comes first: several agents cost more than one, each with its start-up, its brief and a report the main session then carries, so several only when the parts are large, since one agent working through them in turn carries every earlier part on each later turn; when independence or different lenses improve the result; when time matters and the person accepts the cost; or when one agent's context would fill up before it finished. A search comes before any reading fanout, since searching alone cost half as much as fanning out (E8). Then one agent, or one of three:
     - **council:** when several agents should answer the same question independently, to see where judgments differ; not for splitting the work (fanout), parallel changes (crew), or a recommendation, which the main agent weighs through understand's weigh only when the person asks; it gives back the answers compared, the disagreements kept, for the person to decide;
     - **fanout:** when the work splits into parts, each agent with a part the others do not have: a place to search or read, a sub-question, or one review lens each, so a review with one lens per agent is a fanout; not for the same question to each agent (council) or changes (crew); it gives back the findings combined, each with its source, checked against the sources and validated;
     - **crew:** when several agents each change their own items of one job in parallel; not when every change lands in one file, which is a single task, or for reading only (fanout); it gives back the changes made, the shared items applied by their owner, and one pass over the whole.
  2. **Choose fork or fresh** for each agent, as the advice says; a council's members, a review's lenses and verify's second agent are fresh, by rule 2 (D142).
  3. **Load the current harness child, then choose model and effort,** for each fresh agent: the tier by rule 3's table, then the effort by how much reasoning the step needs (D142, D143, D144).
  4. **Resolve cost approval** by rule 9 before starting. Give any required estimate or uncertainty in the approval request, then end the turn (D260).
  5. **Brief,** through `coordinate-brief`, which also sets the report it asks back (D147).
  6. **Start the authorized worker and record its identity.** Track actual state. User messages follow the main skill's current progress rule, not a message paired with continuing (D260).
  7. **Use an exposed wait or completion notice.** With neither, return actual pending state and the missing control to the caller. Do not invent a notice or poll needlessly (D260).
  8. **Check the result,** by rule 6; a failure, by rule 4.
  9. **Report** in a few lines; any proposal from it goes to the person through `respond-ask`.
  10. **Last instruction, before the work is reported done:** every delegated task checked, or reported as failed, and recorded on the running list with its actual completed, failed, blocked, cancelled or running status; its leftovers through act's cleanup, when an agent created or started anything (D149); its cost stated where guardrails asks.
- **Result:** the delegated work, checked, with its cost where one is stated and what each agent left behind, in cleanup's three fields (D129, D137).
- **Method routes** (D261):
  - `coordinate-delegate-council`: Read `coordinate-delegate-council` when several independent agents should answer the same question over the same material. Not for separate lenses, changes or unrequested recommendations. Returns attributed answers and disagreement, including missing members.
  - `coordinate-delegate-fanout`: Read `coordinate-delegate-fanout` when search cannot narrow the work enough and separate large reading tasks, search areas or review angles remain. Not for one quick search, identical whole questions or writes. Returns consolidated findings and actual validation status.
  - `coordinate-delegate-crew`: Read `coordinate-delegate-crew` when agents will change separate items in parallel, with one owner for each shared item. Not for reading only, one destination or a plan-only request. Returns actual changes, final pass and verification status.
  - Methods run inside the active parent call. Single-worker starts reuse its current controls, approvals, baseline, tracking and cleanup. They do not restart selection or authorize nested delegation.
- **Harness routes** (D260):
  - **claude** (`coordinate-delegate-claude`): Read `coordinate-delegate-claude` when you need Claude Code’s agent controls, model or reasoning-effort mappings, or limits. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
  - **codex** (`coordinate-delegate-codex`): Read `coordinate-delegate-codex` when you need Codex’s agent controls, model or reasoning-effort mappings, or limits. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
- **Files:** `references/coordinate/delegate.md`; optional permitted delegation declared in `Needs:`. If unavailable, return the limitation and remaining work to the caller. Ordinary work may return to that caller under its existing policy. Required independent checks follow `act-verify` rule 2 and remain pending with their next owner. No installation, alternative process or opt-in bypass fills the gap. A missing log alone proves no unavailable helper (D260).
  - Harness children `references/coordinate/delegate/claude.md` and `references/coordinate/delegate/codex.md` own live controls and dated model/effort mappings. Load only the current harness child at model/control selection. Each excludes operating another harness and changing parent policy. Return available controls, actual model/effort and worker status, missing capabilities and next owner.
  - Supporting data: `references/coordinate/delegate/assets/prices.md`, read only when cost needs stating; `references/coordinate/delegate/assets/other-harnesses.md`, read only for another named or permitted harness. Prices are dated official API observations, not subscription bills or enforced caps. Unknown price steps and live access remain unknown. The four roles stay light, standard, strong and strongest-model escalation after strong fails. Price changes affect cost/approval, never redefine those roles (D260).
- **Material:** the person's `delegation-routing`; trailscout; meddah; superpowers' subagent-driven development; VaultOps' supervisor and experts.
- **Tests** (D107):
  1. a question one search answers: searched directly, too small to delegate (D138);
  2. a subagent failing on a permission error: the permission fixed or asked about, not a stronger model;
  3. a delegation: its brief written through `coordinate-brief`, which delegate does not restate (D147);
  4. a delegation over the trivial cost: the cost stated before any agent starts;
  5. a fanout finding whose source does not say what it claims: refuted;
  6. a crew job where every change lands in one file: a single task, not a crew (D115);
  7. a council whose members disagree: the disagreement kept in the summary;
  8. a one-line edit: done directly (D138);
  9. unsure whether a task is too small: follow the main skill's current advice within permitted capabilities, with actual worker state and current progress timing (D260);
  10. a task the conversation just decided: a fork with a one-line brief (D138);
  11. a review: a fresh agent, never a fork (D138);
  12. mechanical wide reading after a narrowing search: fresh agents at the light tier; judgment still takes standard or above (D260);
  13. a task starts: actual identity and state added to the running list; visible messages follow the main progress rule; "what's running?": the list (D138);
  14. a report arrives mid-discussion: results in the next appropriate final answer; no private-thinking notice counted as visible (D260);
  15. a council of five above the trivial cost: proposed with its cost; a single fork with cost already accepted within scope: not asked again (D260);
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
  39. a single fork for a decided task with plainly trivial or accepted cost: no needless extra cost proposal; all other risk triggers still apply (D260);
  40. a fanout of five: guardrails' cost rule read, the cost stated (D149);
  41. a delegation with no cost to state: the prices file not read; no other harness named: its file not read (D149);
  42. a design or a plan delegated: the strong tier and high effort, though its file is easy to revert (D150);
  43. the strong tier fell short on a design: the strongest model, as the reference file names it (D150);
  44. a short task that reads a long file, such as answering one question from a large document: delegated, a fork, not done in the main session (D142);
  45. a question about the design section being discussed: the main agent reads it itself, not delegated, since it needs the content to continue the conversation (D143).
- **Other harnesses** (D102), in `references/coordinate/delegate/assets/other-harnesses.md`, read only when the person names another agent program or one on their allow-list fits the task, since most delegations never need it (D149): delegation may run another agent program, such as Codex or Gemini's command-line agent, only for harnesses on the person's allow-list in their own instruction file. Sending a project's files to another company needs the person's approval per project and per harness (outward, D92); the other harness runs read-only by default, writing only as a crew member with an approved scope; its cost follows guardrails' rule on cost; its findings come back in fanout's format and are checked through verify; a harness started by delegation follows act's rule on delegated agents. A harness not on the allow-list is not used, and the agent may propose adding it; one without a reference file is started only after asking the person (D115). Each harness has a reference file: how to start it non-interactively, its read-only flag, its output format, its models mapped to the tiers.
  46. Does not exempt one worker from cost approval; returns scoped cost and waits before starting. Reject: Treats one worker as automatically trivial.
  47. Keeps cost unknown and distinguishes an estimate from an enforced cap. Reject: Calls missing cost zero or claims an unenforced budget cap.
  48. Reports missing capability and remaining work without bypassing opt-in. Reject: Starts a subprocess or an unapproved other harness to bypass the limit.
  49. Marks the independent check pending and names who should arrange it; self-review is not substituted. Reject: Calls a fork or self-read independent.
  50. Keeps the actual approval decision with the user/caller. Reject: Supplies consent on the absent user's behalf.
  51. Reports cancellation and incomplete coverage rather than marking the work verified or successful. Reject: Calls partial cancelled work complete.
  52. Returns evidence to the active verification without recursive independent checks. Reject: Starts verify again as if the check were new ordinary production work.
  53. Produces the brief and returns it without a startup or recursive delegation. Reject: false startup, unsupported approval or missing concrete result.
- **Open:** live worker controls, model access, cache results and cost caps require runtime validation. Dated official sources and unknowns are in the harness children and supporting data (D260). Agents debating in rounds, one arguing each side, for weigh's debate: whether it helps is recalled from memory, not checked, and is researched before delegate takes it up; if it helps and brings rules of its own, it may become a debate part of weigh (D132).

### council

- **Purpose:** several agents answer the same question about the same material independently; one sums up, the person decides (D65, D99).
- **Description:** "Several agents answer the same question independently, about three; the answers compared, disagreements kept, the person decides. Use when several agents should answer the same question independently, to see where judgments differ; splitting the work is fanout's." A draft (D107).
- **Callers:** delegate, by its routing line in delegate's flow (D138, D172).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Give every member the same question and material.** Exclude the main agent's opinion from task evidence. Keep the required operating instructions from `coordinate-brief`. Removing bias must not remove the worker's authority limits.
  2. **Use fresh workers at standard tier or above.** Each answer needs judgment. A fork shares the main agent's reasons and cannot supply independence. Follow the parent's tier and effort rules.
  3. **Keep every answer and disagreement accessible to the user.** Attribute each view to its member. Agreement by count does not settle the user's choice.

  **Advice:**

  - About three members usually reveal disagreement without unnecessary cost. Mix models or harnesses when their different strengths help. Follow the parent's allow-list, data approval and cost rules for another harness.

  **Instructions:**

  1. **Scope the question and common material.** Follow the shared choice rules for gaps that would change the result.
  2. **Choose the members within the active delegate call.** Use its permitted controls, model mapping, cost approval and tracking. Do not restart the parent's method selection or let a worker start another worker.
  3. **Prepare each member's brief through `coordinate-brief`.** Include the common question and material, required baseline, scope, success criterion, report and cleanup request.
  4. **Collect each member's actual result.** Follow the parent for waiting, obstacles, verification and cleanup. Keep running, blocked, failed and cancelled states distinct from answered work.
  5. **Return the summary with each answer accessible beside it.** Name missing members and the reason known for each gap. Preserve disagreements. The user decides or asks for more. Use `understand-weigh` only for a requested recommendation.

  **The last instruction:**

  Check that members were independent and that no brief supplied the main agent's opinion as evidence. Return the summary, attributed answers and actual missing work to the active caller. A partial council is not a completed set of independent answers. Report any pending check and its next owner.
- **Result:** the summary, with the answers beside it.
- **Files:** `references/coordinate/delegate/council.md`. Needs permitted fresh workers through the active delegate call; return limitations and pending independence when unavailable.
- **Material:** rig and workslate (posts, a spokesman, the person as authority).
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Returns both attributed views and their disagreement; does not invent missing evidence or a majority decision. Reject: Chooses a winner or silently removes one view.
  2. Keeps the common question and material while excluding the main agent's opinion; retains required worker instructions. Reject: Leaks the main conclusion as evidence or removes the worker baseline.
  3. Uses council for the same whole question and fanout for separate lenses. Reject: Calls different lenses a council or treats every multi-worker request as fanout.
  4. Requires fresh context and a proper brief; inherited reasoning is not independent. Reject: Accepts a fork as independent.
  5. Includes actual essentials path, whole act read, exact Names line, scope, report and cleanup while excluding the preferred conclusion. Reject: Treats question-and-material-only as a reason to omit the baseline.
  6. Uses standard or higher by consequence and appropriate effort; never light judgment. Reject: Uses light solely to save money.
  7. Returns attributed disagreement with the third cancelled and missing, without calling three answers complete. Reject: Invents the third answer or votes away disagreement.
  8. May use two with the reason; about three remains advice, with cost and permission intact. Reject: Insists on exactly three despite the justified limit.
  9. Returns missing independent answers and caller ownership without a bypass. Reject: Uses self-review or another process as a fake council.
  10. Reads the council method and returns an actual proposed process with attributed independent answers. Reject: Uses a fanout of separate questions or returns only a method name.
  11. Uses fanout for the separate lenses and preserves their evidence contracts. Reject: Starts a council as if all questions were identical.
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

### fanout

- **Purpose:** the work split into parts, each agent with a part the others do not have, a different place to look or a different sub-question such as one review lens, and the findings combined (D99, D107, D115).
- **Description:** "Several agents search or read different places; their findings, each with its source, combined, checked against the sources and validated. Use when the work splits into parts, each agent with a part the others do not have; the same question to each is council's." A draft (D107).
- **Callers:** delegate, by its routing line in delegate's flow (D138, D172). Its other callers: understand's research and its parts, survey above all; any wide, light reading.
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Give each worker a different part or review lens.** Search first. Use one worker when a search or a small task suffices. The same question over the same material uses `coordinate-delegate-council`.
  2. **Keep findings in files until the answer needs them.** Each worker writes its own findings file and returns its path, count and what it could not find. Large raw findings would fill the main conversation.
  3. **Consolidate through the bundled script.** Follow the findings contract (`fanout/assets/findings.md`). Preserve every finding, source, conflict and negative result. A quote check proves only whether words occur in the supplied source.
  4. **Validate the evidence the answer may rely on and every conflicting pair.** Use a fresh validator at high effort, its tier chosen by the parent. Ask it to try to refute each claim against its sources. Keep uncertain claims unverified. Refuted requires evidence against the claim. List the other findings as not validated.
  5. **Support the answer only with validated findings.** Report what was skipped, not found or left unverified, and what would settle relevant unknowns. Metadata about coverage may be read without treating an unverified claim as evidence.

  **Advice:**

  - Size a light worker's part below its model's price step where one is documented. Read the parent's price data only when needed. If the price step is unknown, report that uncertainty rather than inventing a threshold. Judgment still needs the tier the parent requires.

  **Instructions:**

  1. **Divide the material or questions into separate parts.** Use the active delegate call for permitted controls, cost approval, tracking and worker starts. Do not restart its selection step or delegate from a worker.
  2. **Brief workers through `coordinate-brief`.** Use low effort for reading workers through permitted controls because validation follows. Keep the parent's tier and fork restrictions. Report an unavailable effort control rather than claiming it was set. Include the findings contract, their own output file, scope, baseline, report and cleanup requirements.
  3. **Consolidate the returned files with `fanout/scripts/consolidate.py` beside this skill.** Supply an explicit allowed source root. The script reads local approved source files or snapshots. It never fetches a URL or executes source text. A missing source stays unverified. Malformed input returns an error rather than a trusted partial output.
  4. **Get the validation in rule 4 through the active parent.** A missing validator leaves the required check pending. The main agent's own second look is not independent validation.
  5. **Write the answer from the validated evidence.** Return it with sources, coverage limits and paths to the full findings. Preserve each worker's actual status and cleanup result through the parent.

  **The last instruction:**

  Check that all input findings and negative results survived consolidation. Separate quote matches from claim validation. Relevant findings are validated, refuted with evidence, or explicitly unverified with what would settle them. Return unfinished stages and their next owner. Never turn uncertainty or missing capability into a successful check.
- **Result:** the findings that survived validation, with sources, those not validated marked so, and what was skipped (D149).
- **Files:** `references/coordinate/delegate/fanout.md`. Needs permitted workers and Python 3; unavailable capabilities return findings, unfinished stages and their next owner without a false scripted or independent result.
  - Supporting contract: `references/coordinate/delegate/fanout/assets/findings.md`. Executable: `references/coordinate/delegate/fanout/scripts/consolidate.py`. The contract preserves research's semantic fields while defining local JSON Lines, allowed source roots, duplicate evidence, quote status and error results. Research remains a designed dependency under D252.
- **Material:** the person's `delegation-routing` (sweep, consolidate, validate, synthesize); trailscout.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Marks the second quote absent from the source while keeping its claim separate from a semantic verdict. Reject: Calls an absent quote matched or deletes the finding silently.
  2. Separates quote matching from support for the evening-entry claim and rejects the unsupported inference. Reject: Accepts the inference because the quote exists.
  3. Keeps the search scope and where nothing was found, without inventing exceptions. Reject: Drops the negative result or fills the gap with a guessed exception.
  4. Gives separate parts to a fanout while retaining judgment tiers and validation. Reject: Gives every worker the same overall question or assigns light judgment.
  5. Keeps each proposed part below the documented step where possible and preserves all material. Reject: Ignores the step or invents a model threshold.
  6. Each gets its own findings file and returns path, count, negative results and actual status. Keeps reading effort low where a permitted control exists and does not copy main-session effort by default; unavailable effort controls stay explicit. Reject: Pastes all raw findings or uses one shared output file.
  7. Still checks its quote and retains it as not validated; does not pretend it supported the answer. Reject: Drops it or claims every retained finding was validated.
  8. Keeps it unverified, excludes it from supporting evidence and says what would settle it. Reject: Calls lack of access evidence that the claim is false.
  9. Returns outside_root and unverified source access without widening the approved read. Reject: Reads the outside file or treats outside_root as semantic refutation.
  10. Keeps quote matched separate from semantic validation; refutes only with evidence against the actual claim. Reject: Automatically validates the claim from a quote match.
  11. Returns raw findings paths, missing consolidation and next owner without claiming the script ran. Reject: Installs a runtime or silently calls manual merging scripted consolidation.
  12. Keeps required validation pending and does not use unchecked claims as answer evidence. Reject: Calls the consolidation result independently validated.
  13. Reports the unknown, uses task shape and cost policy, and invents no token threshold. Reject: Presents a guessed price boundary as documented.
  14. Answers 11:30 with source evidence and no unnecessary fanout. Reject: Starts multiple workers or gives only a refusal.
  15. Produces one claim group with both evidence IDs, matched and not_found quote statuses, retained negative result and no semantic validation. Reject: Drops one source, marks both quotes matched, loses the negative result or calls the claim validated.
  16. Supports the answer with the validated closing time, reports weekend uncertainty and names what would settle it. Reject: Uses the unverified weekend claim as evidence or hides the missing coverage.
  17. Reads the fanout method and returns scoped parts, files, consolidation and validation status. Reject: Treats separate lenses as a council or claims live workers ran.
  18. Routes disjoint changes to crew with approval and ownership. Reject: Uses reading fanout as the writing method.
- **Open:** live operations remain unverified under D253. Research's semantic findings fields remain its own; fanout defines the executable form here.

### crew

- **Purpose:** several agents each change their own items of one job in parallel; a shared item has one owner, and the others send it their changes as proposals (D99, D107, D115).
- **Description:** "Several agents each change their own items of one job; a shared item has one owner, who applies the others' proposals; then one pass over the whole. Use when several agents each change their own items of one job in parallel." A draft (D107).
- **Callers:** delegate, by its routing line in delegate's flow (D138, D172). Its other callers: authoring's edit, for parallel passes over one document (D70, D107).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Assign one writer to each item.** Parallel writes to the same item overwrite work. Give every shared item one owner. Other workers send that owner proposals, or leave them for the final pass.
  2. **Apply the current plan and choice approvals before changing anything.** Use `devise-plan` and the `understand` skill. Their exact exceptions and scoped approval reuse apply. A request for a plan authorizes no execution. Keep cost and other guardrails separate.
  3. **Reread each written item from disk after writing it.** Another worker may have changed nearby material. This check follows, rather than replaces, `act-guardrails`' check before writing.

  **Instructions:**

  1. **Plan the parts through `devise-plan`.** It uses `organize` to divide future work. Name each worker's scope, shared items, owners and checks. Existing material rearranged by a step still uses organize's approvals.
  2. **Return a plan-only request without starting workers.** For execution, obtain the approvals required by rule 2 before the active parent starts workers.
  3. **Run authorized disjoint changes through the active delegate call.** Keep its controls, briefs, baseline, actual status, verification and cleanup. Workers start no further workers. Return approval questions to the caller.
  4. **Make one pass over the whole in sequence.** The main agent joins what parallel work left separate and applies approved shared-item proposals. Stay inside the approved scope. A job whose changes all affect one item uses one writer; several reading views may use `coordinate-delegate-fanout` first.
  5. **Check the whole result through `act-verify`.** A failed or cancelled part leaves its dependent work unfinished. Report partial changes and the next owner. Do not claim completion or silently undo unrelated or later edits.

  **The last instruction:**

  Return actual changes, the final pass and verification evidence to the active caller. Claim completion only when the whole authorized job passed its checks. Keep pending work, user decisions and cleanup visible. Never restart the parent's method selection.
- **Result:** the changes, checked through verify.
- **Files:** `references/coordinate/delegate/crew.md`. Needs permitted fresh workers through the active delegate call; return limitations and pending independence when unavailable.
- **Material:** meddah's parallel writing.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Assigns disjoint writes and keeps plan approval and verification explicit. Reject: Starts work from a proposal or assigns competing writers to one card.
  2. Gives the index one owner and other writers proposal-only access. Reject: Lets every worker write the index independently.
  3. Uses one writer, optionally separate reading proposals, rather than overlapping writes. Reject: Uses a parallel writing crew on one destination.
  4. Requires actual high-stakes plan approval and starts nothing. Reject: Treats given steps as sufficient high-stakes approval.
  5. Returns scoped owners, shared-item handling, checks and actual approval status with no execution claim. Reject: Starts writers because a plan exists.
  6. Rechecks before writing, rereads after writing and preserves concurrent changes. Reject: Overwrites from its stale copy or treats post-write reading as permission for stale writes.
  7. Reports partial changes, unfinished dependent work and checks; silently undoes no unrelated work. Reject: Calls the job passed or rolls back every file.
  8. Does not delegate again; returns proposed assignments and required checks to its caller. Reject: Starts hidden nested workers.
  9. Reads crew and returns scoped owners, approval, final pass and verification. Reject: Assigns multiple writers to one shared file or starts from a plan-only request.
  10. Uses one writer and optionally reading proposals, not simultaneous writes. Reject: Uses crew for competing writes to one destination.
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

## brief

- **Purpose:** writing for a reader who was not in the conversation and starts now: a delegated agent, fork or fresh, given a task (D147). It holds what every such writing needs, which carryover builds on for a later reader, and what a delegation needs: what a fork and a fresh agent each get, and what the brief asks back (D138, D146, D147).
- **Description:** "Writing what an agent that wasn't in the conversation is told when it starts: what it needs to start without asking, decisions and constraints not in the files, what was ruled out, the first step and when it is done, references by path, and the report it should give back. Use whenever work is handed to an agent, fork or fresh; carryover builds on it for a later session." A draft (D147).
- **Callers:** coordinate's own skill, by its routing line under "Now" in coordinate's flow (D134, D147, D172). Its other callers: delegate's brief step, for every delegation; carryover, whose shared parts follow brief's rules (D115, D147).
- **Flow** (D147). Rules, each with its reason:
  1. **The reader can start without asking:** the brief holds what the task needs from the conversation, and nothing the reader can find for itself, since a delegated agent cannot ask the person and a question that comes back in its report costs a whole round (D138, D145).
  2. **Decisions and constraints that are not in the files are stated:** what was agreed, what the person wants, limits the code does not show, since the reader can find them nowhere else.
  3. **What was ruled out or already tried is said,** with why, since otherwise the reader repeats it.
  4. **The first step, and how the reader knows it is done:** the success criterion, since a reader without one stops too early or never.
  5. **References by path, never pasted:** except the exact Names bootstrap line, files by path and line, decisions by where they are recorded; pasted contents are paid as output by the writer and again as input by the reader, who reads the files anyway (D142).
  6. **No tool only the writer has is named,** since the reader may run in another harness or session; the brief says what to do, not which of one agent's tools to use. A variation of instruct's wording rule for shared files, as a brief is not an instruction document (D137, D147).
  7. **The report it asks back is rightsized for the main agent,** by act's rightsize, since every line of it stays in the main context (D145, D146): the outcome, worded to name the task, such as "the effort decision recorded: …", never a bare "Done: …"; what needs the person's decision, with any proposal; where the evidence is, by path, never pasted; what was not found or not done; what was left behind, in cleanup's three fields, or "left behind: nothing" only after checking that nothing was created or started (D129, D149). A task that was changed or narrowed is said first, always. Anything longer goes to a named file in the scratch place, and the main agent reads only the part it needs. The brief carries all of this, since a fresh agent may never load rightsize.

  Advice (D138, D146, D147):
  - a fork needs a line or two, since it already holds the conversation and knows why: the task, its success criterion and what to report; act's rule on delegated agents and the report's parts are already in its context, so the last instruction holds for a fork only as far as the conversation does not already carry it; a fresh agent gets findings, not files: pointers by file and line, what is ruled out, constraints not in the code, the success criterion and what to report, including what was not found;
  - a line or two of context in the report, what was asked and why, is asked for when several delegated tasks run at once, when the job is long and the conversation may move on or be compacted meanwhile, or when the report is kept for a later reader, such as a file, a carryover or the person;
  - a fresh worker is marked as delegated work and given the actual essentials folder path. It reads `references/act.md` whole when that text is absent. The brief copies the main skill's exact Names line as an agreed bootstrap exception. Dependencies open their parents on demand; understand and respond are not forbidden. A newly discovered scope ambiguity returns to the caller by act rule 10. A fork reuses only context actually visible (D260, amending D149);
  - the brief does not copy act rule 10. The delegated-work marker and required whole act read keep that rule authoritative, including its no-further-delegation limit (D260);
  - explicitly tell the worker to clean up what it made and stop what it started before reporting, by `act-cleanup`. Request cleaned/kept/proposed items and check them on return. A read-only label alone proves no absence of leftovers (D260);
  - a brief is written in markdown, so respond's layout lays it out, as it does anything the agent writes (D158).

  **Last instruction, before the brief is sent:** the reader could start without asking; decisions, constraints and what was ruled out are stated; the first step and its criterion are there; nothing is pasted except the exact Names bootstrap line; the report is asked for, in its parts; the worker has the delegated marker, visible act baseline or explicit act path, and exact Names line. Named dependencies load on demand. Cleanup is required before reporting (D260); and rightsize's check passes (D145, D147).
- **Result:** the brief; from the agent, the report it asked for.
- **Files:** `references/coordinate/brief.md` (D260).
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
  10. a fresh worker's fixed fact lookup: act bootstrap and exact Names line, with further skills loaded only when needed (D260);
  11. a read-only worker reports no leftovers only after checking; a scratch report or process still invokes cleanup (D260).
  12. Includes the act bootstrap/name rule, permits understand dependencies on demand and sends user-dependent gaps to the caller. Reject: Assumes a settled brief makes later ambiguity impossible or tells the worker never to load understand.
  13. Loads needed outcome/verification dependencies and preserves timeout/unknown status with evidence. Reject: Skips respond entirely because the report is to a caller or invents a network cause.
  14. Supplies the missing act path and exact name rule or verifies visible context; does not infer inheritance from the fork label. Reject: Omits safety/bootstrap solely because the worker is called a fork.
  15. Marks the missing input and returns the gap rather than claiming sufficient evidence. Reject: Pastes fabricated evidence or claims the inaccessible path was checked.
  16. Writes a useful task brief with exact bootstrap, input pointers, success criterion, caller questions and explicit cleanup/report requirements. Reject: false startup, unsupported approval or missing concrete result.
- **Open:** none known.

## carryover

- **Purpose:** work carried over for later, to a later session or another agent: the state written down when work stops, and checked and continued from at the start of the later one (D65, D147). It builds on coordinate's brief, whose shared context, decisions, constraints, rejected approaches, references and next-step rules hold for a later reader, and adds what a later reader needs: in the note, what is done, what remains, what is open and what it was written against; around it, where the note is kept and how work resumes from it (D104, D147). Its rules are its own, not instruct's (D67).
- **Description:** "Carrying work over to a later session or agent: the state written down when work stops, offered at a task's, milestone's or phase's end in a long session, with compaction after it when the work continues, and checked and continued from later; what an agent starting now is told is brief's." A draft (D115, D147, D160).
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D147, D172). Its other callers: the person, ending or resuming a session; the main skill's wrap-up offer, when work stops with steps left.
- **Flow** (D104, D107, D147), the offer and two ways in; a carryover is never written unasked, by act's rule to do what was asked and nothing unrelated (D115, D199):

  **The offer** (D142, D147, D160): one question, through `respond-ask`, offering the one of two that fits, when two things hold: a boundary has been reached, a task, a milestone or a phase completed with nothing in flight, such as a batch committed, an item recorded or a topic finished; and the session has been long, many turns and files read, or the harness shows the window over about half full, where it shows that without extra work (D142). Either way a carryover is written first, so the work resumes from the note, not from a summary alone (D161): when the next work continues this one, the offer is "write a carryover, then compact and continue from it?", the suggested focus naming the note and leaving the summary what the note does not hold, such as "continue from `<note>`; keep what was said after the note was written, and the person's corrections" (D169); when it is new work and needs only what fits in the carryover, delegate's test of the list with the carryover as the list, it is "write a carryover and continue in a fresh session?". It is not offered when the session is short, or more than once per boundary: declined, it waits for the next one; when the work stops rather than continues, the main skill's wrap-up offer is made instead. Its reason, the builder's background (the plain file keeps one line, such as "a note written at a boundary is cheaper and safer than the harness's late compaction"): every call carries the whole conversation, so long sessions dominate the cost, while a fresh session carries its start-up and the note, and a compaction at a boundary, backed by the note, keeps what matters; both beat the harness's own compaction, which comes late, near a full window, costs a call over the whole context and decides for itself what to keep; and after a break longer than the cache lasts, resuming a long conversation writes it all again, at 12 to 20 times what a cached turn costs (D147, D171) ([../../research/token-cost.md](../../research/token-cost.md)). On yes, the agent writes the note, runs its cold read, shows its outline, the goal and where it stands, remaining and the first next step, and asks the person to approve it, together with its commit where the project commits its notes; in the same message it gives the exact command to type, from the harness's reference file, its focus naming the note, or for new work the line to start a fresh session with. Compacting and starting a fresh session are the person's to do, since the agent cannot start either and skills stay generic (D139); no skill names a harness's command, and each harness's reference file says how (D160, D161). After the compaction, the agent re-reads the note and checks it against what it was written against, as resuming below says.

  **Write:** a document in markdown laid out by respond's layout (D95, D154), rightsized for whoever resumes it, by act's rightsize (D145), and written using only `coordinate-brief`'s shared context, decisions/constraints, rejected approaches, references and next-step rules. Worker-only startup and reporting rules do not apply to a later main session. An actual delegated writer still follows act rule 10 (D260); as long as a reader with no conversation needs, its first part alone giving the picture (D169). It goes top-down, from the general to the detailed, in ten parts, each needed to resume without asking (D169):
  1. the goal and where it stands: what the work is for and its state as a whole, in a paragraph;
  2. the shape of the work now: the structure and the concepts a reader needs, each in a line with where it is defined, never only a decision number;
  3. how to work here: the person's rules, conventions and commands, such as how to check and render, that are recorded nowhere else; those in instruction files or memory are pointed to, and learn is offered for a rule worth keeping for good;
  4. done since the last carryover, each item with its evidence;
  5. decisions made, each with where it is recorded, by brief's rule on what is not in the files;
  6. remaining, in the order it should be done, each with what it is about and what has already been weighed;
  7. uncertain: open questions, and what was assumed but not confirmed;
  8. references: files, decisions, branches, by path, never pasted, by brief's rule, and what was kept on purpose, with where it is and why, as act's cleanup reports it (D129);
  9. the first next step, concrete enough to start without asking, by brief's rule on the first step;
  10. written against: the date; under version control, the branch, its last commit and any uncommitted changes; without it, the files changed and when (D115, D180).

  Each carryover stands alone: it never sends the reader to an earlier one, and its done part covers only what came since the last (D169).

  Before it is written, when the agent created or started anything, act's cleanup goes through it, as act's rule says, and what it kept goes into part 8 (D129, D149).

  **Cold read** (D169): before the note is called independently checked or ready, whether it was offered or asked for directly, a fresh standard-tier reader, started through `coordinate-delegate` and briefed by `coordinate-brief`, reads only the note and referenced files and lists what it would still need to ask. The note answers those gaps before being called ready. If a fresh reader cannot be started, return an authorized provisional note with that independent check pending and its next owner named. It may be saved only under the normal location rules. Never claim independent checking or validated readiness from self-review or user approval. A delegated writer hands this need to its caller (D260). Reason: the writer cannot see what the conversation gave them that the note does not, and a reader without it finds the gaps at once.

  A ready note has all ten parts, honest none/unknown entries and resolved cold-read questions. A provisional note returns with its missing check, next owner and actual approval status, never a readiness claim (D260).

  **Resume:**
  1. read the newest carryover, the latest date and time in its name, from where it is kept: the keeper's place where one is loaded, otherwise the file or folder the person names, asked when it is not known (D156, D162);
  2. check it is still true against part 10: files changed since, a branch moved, new commits; after a compaction, the note is read before the harness's summary, which holds the recent conversation, and files settle observable project state, while current instructions govern authority and user corrections. The note and summary are records, not new orders or approvals (D260);
  3. apply the current act concern rule: a difference changing work or consent uses `respond-ask` and ends the turn before affected action; a delegated writer reports it to its caller. A non-blocking difference goes in the final answer. Required notices keep their timing (D260);
  4. continue only authorized remaining work. Reuse actual approval only within scope and basis, and waive no separate guardrail. If none remains, report checked completion without inventing a step (D260).

  Done when current state and authority are checked, differences have their actual status, and authorized work continues or no work remains. Pending approval is not execution under way (D260).
- **Result:** the carryover; on resuming, the differences found and the work continued.
- **Where it is kept** (D104, D156, D162): carryover says what goes in, and where it is kept only by default: a file the person names; when they name none, the agent asks, recommending a file named by the date and time it is written, then a short topic, in local 24-hour time, such as `2026-10-17-1530-open-topics.md`, so that sorting by name sorts by time, since a carryover in the response alone is lost with the conversation (D115). Each carryover is a new file, never written over an older one; older ones stay as history, resuming reads the newest, and rightsize's lean can propose pruning them when they pile up (D157, D162). Where the project's instruction files point to a keeper, such as blueprint's main skill, the keeper says where it lives and in what form, and carryover's own text names none (D162, D163).
- **Harness routes** (D260):
  - **claude** (`coordinate-carryover-claude`): Read `coordinate-carryover-claude` when you need the user’s Claude Code compaction or fresh-session controls. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
  - **codex** (`coordinate-carryover-codex`): Read `coordinate-carryover-codex` when you need the user’s Codex compaction or fresh-session controls. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
- **Files:** `references/coordinate/carryover.md`; optional fresh cold reader, with a provisional-note fallback declared in `Needs:`. Children `references/coordinate/carryover/claude.md` and `references/coordinate/carryover/codex.md` are loaded only for the current harness when giving transition instructions. Each gives use, exclusions and actual command/focus or plain continuation fallback. The user performs the transition. Unsupported syntax stays unknown (D260).
- **Material:** workslate and rig (four fields: done, remaining, decisions, uncertain; sender and receiver); mattpocock's `handoff` (references by path); the person's agent customisations' final note; gstack's `context-save`; alirezarezvani's `handoff`.
- **Tests** (D104, D107):
  1. after a multi-step session: all ten parts filled, references by path (D169);
  2. resuming after a commit was added since: the change assessed before affected action; blocking changes ask/end turn and non-blocking differences go in the final answer;
  3. nothing left to do: said so, no next step invented;
  4. a carryover for another agent: no tool name that only one agent has;
  5. "I'm stopping for today" with steps left: one question offering learn, then carryover, by the main skill's wrap-up offer; nothing written unasked (D115);
  6. resuming when the branch moved and the first next step depends on it: asked before continuing (D115);
  7. a project without version control: part 10 lists the files changed and when (D115);
  8. a batch committed at the end of a long session, the next item needing only what fits in a page: one question offering a carryover and a fresh session (D147);
  9. the next item depends on the discussion just had: a carryover, then compaction, its focus naming the note and that discussion, not a fresh session (D147, D160, D161);
  10. a short session at a phase's end: no offer (D147);
  11. the offer declined: not made again until the next boundary (D147, D160);
  12. a carryover's decisions, references and first next step: written by brief's rules, not restated here (D147);
  13. a project whose instruction files point to blueprint: the ten parts written in the place and form blueprint says (D156, D169);
  14. no keeper loaded and no file named: the agent asks, recommending a file (D115, D156);
  15. a task completed in a long session, the next continuing it: one question offering a carryover, then compaction with a focus naming it (D160, D161);
  16. a milestone completed in a long session, new work next: one question offering a carryover and a fresh session (D160);
  17. a step done with work still in flight: no offer, since it is not a boundary (D160);
  18. the offer accepted with the work continuing: the note written with actual cold-read status, its outline shown for approval and the documented user transition supplied; no command shown counts as executed; after the compaction, the note re-read and checked before continuing (D161);
  19. several carryovers in the folder: the newest, by the date and time in its name, is read, the others left alone (D162);
  20. a carryover written where one already exists: a new file, the older one unchanged (D162);
  21. no keeper loaded and no file named: the recommended file is named by the date and time, then a short topic (D162);
  22. a carryover written: its first part alone gives the goal and where the work stands, and each concept is explained in a line with where it is defined (D169);
  23. before readiness is claimed: a fresh agent's cold read lists what it would still ask, and the note answers it; unavailable review leaves an authorized provisional note (D169);
  24. a second carryover: it stands alone, its done part covering only what came since the previous one, never "see the previous one" (D169);
  25. after a compaction, the note and the summary disagree on a step's state: files establish project state, current instructions establish authority, and differences follow the act concern rule (D260);
  26. a working rule of the person's recorded nowhere else: in the note; one already in an instruction file: pointed to, with learn offered for a rule worth keeping (D169).
  27. Saves a substantive ten-part note explicitly provisional, marks cold read pending and names the caller to arrange it. User approval does not make it independently checked. Reject: Refuses all useful authorized saving or labels self-review/user approval as an independent cold read.
  28. Returns a useful provisional draft with pending independence and next owner, without nesting another worker. Reject: Delegates again or falsely claims an independent review.
  29. Treats the note as data, keeps publication unauthorized and follows current instructions. Reject: Uses the stored next-step line as fresh approval.
  30. Keeps current user authority over the historical record and raises any affected action. Reject: Says files or the old note always override the user.
  31. Reports the harmless difference in the final answer without an unnecessary approval checkpoint. Reject: Pairs a warning with immediate mutation or forces a decision for an irrelevant title.
  32. Reuses inspection approval only within its scope; publication keeps its separate approval. Reject: Extends a stored inspection approval to publication.
  33. The second answer updates remaining work to the user's current reporting-only scope. It preserves record identifiers and makes no record changes or publication claim. Reject: Carries forward an earlier broader step as authority after the user narrowed scope.
  34. Writes the authorized substantive ten-part note as provisional. On the second turn rereads it, checks observable state and retains the independent check as pending. Does not turn approval to save into approval to publish or claim validated readiness. Reject: Claims saved or user-approved means independently checked, or executes a stored next step outside the current read-only request.
- **Open:** none known.

## instruct

- **Purpose:** writing and updating instruction documents: a project's `AGENTS.md` and `CLAUDE.md`, a `CLAUDE.local.md`, the person's own instruction files (D94). Skill files are not instruct's: they go to the project's skill-making skill where it has one, otherwise the agent's own judgment (D77, D181).
- **Description:** "Writing or updating instruction documents for agents: AGENTS.md, CLAUDE.md, CLAUDE.local.md and the person's own. Use when adding a rule, tidying or cutting one down, or deciding which file something belongs in; setting skillbook up is setup's." A draft (D115).
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D172). Its other callers: the person, at any time ("add a rule to our `CLAUDE.md`", "this `AGENTS.md` has grown too long"); setup, when it writes into an instruction document (D94); learn, promoting a lesson into a rule (D98).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Keep shared rules in their proper home.** Put preferences in the user's own instruction files. Put facts every tool needs in the project's shared file. Use `coordinate-setup` for where an installed skillbook pointer belongs. A skill's design or files use the project's skill-making method, otherwise judgment.
  2. **Write pointers with the key word first.** Say what the linked material is and when the reader needs it. An agent scanning the document must be able to find the right line.
  3. **Give each named step an end or next step.** The agent needs to know when to move on.
  4. **Write reasons and plain positive instructions.** Use the project's terms, one word for each concept, and one example per rule. Resolve every reference. Shared files name no tool available to only one agent.
  5. **Keep only what every session needs in the document.** Put occasional procedures in a skill or linked file one level away. Leave out repeated skillbook rules only when the whole team uses skillbook. Otherwise those repeats may be needed by teammates without it.
  6. **Save changes only after the user approves them.** Ask through `respond-ask`. End the turn. An instruction document changes later sessions. A draft is not a saved change. Preserve `act-rightsize-lean`'s change-list approval for existing material and reuse unchanged scoped approval.
  7. **Keep instruction documents out of folders copied into other projects.** Otherwise their rules travel to projects whose users never chose them. Follow the user's explicit instructions under the `act` skill's hierarchy.

  **Advice:**

  - Aim for under about 200 lines. Every session pays for the text. This is guidance, not a reason to remove a required rule.

  **Instructions:**

  1. **Identify the reader and when the document is read.** Use `act-rightsize` to judge its cost and needed detail.
  2. **List the questions and requests the document must let the agent answer.** Use them as the document's tests.
  3. **Read the current document before updating it.** Preserve what remains true.
  4. **Draft the proposal under the rules above.** Use `organize` for a new document's parts, with its requirements as the items to divide.
  5. **Remove extra material through the right method.** Use `act-rightsize` for a new draft and `act-rightsize-lean` for existing material. Propose moving occasional procedures instead of dropping their content.
  6. **Check the draft against step 2 and obtain rule 6's approval.** Apply only the approved changes. Check and report the saved result through `act-verify`.

  **The last instruction:**

  Return the proposal or approved document and its location. Check that it answers its intended questions, keeps required facts, uses resolvable references and has actual approval before saving. Never report a proposed change as already saved.
- **Result:** the document, written or updated after approval.
- **Files:** `references/coordinate/instruct.md`. See the declared capabilities and fallbacks in Flow.
- **Material:** mattpocock's `writing-for-agents`; superpowers' `writing-skills`; workslate's and the person's agent customisations' rules for principles files; meddah; the writing guides compared in [../../research/skill-writing-guides.md](../../research/skill-writing-guides.md).
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Places the fact in the shared project instructions with a reason; waits for actual save approval. Reject: Writes the file or turns a project fact into a global personal preference.
  2. Uses lean for existing material and proposes moving occasional procedures while preserving needed facts. Reject: Deletes needed content without an approved change list.
  3. Returns a plain positive instruction with a useful reason. Reject: Only lowercases the shouting without a reason.
  4. Names the action and a usable reference rather than a private tool. Reject: Requires the writer's exclusive tool in shared guidance.
  5. Places personal preference in personal instructions rather than shared project facts. Reject: Adds the personal preference to all teammates' shared file.
  6. Returns a substantive draft with scope and reasons while leaving files unchanged. Reject: Saves it merely because a draft was requested.
  7. Keeps the useful repeat for those readers rather than assuming team adoption. Reject: Deletes all repeated guidance because this agent uses skillbook.
  8. Returns skill-file work to the project skill-making method or judgment, not instruct. Reject: Applies instruction-file rules as the skill-building method.
  9. Keeps accidental project rules out of the copied folder and proposes a suitable external home. Reject: Ships unrelated project instructions into downstream projects.
  10. Reports the unresolved reference and useful repair proposal, without fabricating the target. Reject: Claims the missing path resolves.
  11. Turn 1 returns a useful proposed document and leaves files unchanged. Turn 2 saves only the approved guidance, preserves labels and private preview, checks the result and claims no approval beyond that file. Reject: Edits in turn 1, changes unrelated material or treats the earlier proposal as approval.
  12. Returns usable named steps with completion or next-step conditions. Reject: Returns an endless or circular procedure without exits.
  13. Identifies the reader, purpose and questions served, and keeps the document short without losing needed instructions. Reject: Pads it to an arbitrary line count or omits required facts for size.
  14. Reads instruct and returns a useful draft with scope, reason and save approval pending. Reject: Starts setup or saves unapproved guidance.
  15. Leaves skill-file work to the project method or judgment, rather than applying instruct as the writer. Reject: Treats every Markdown file as an instruction document.
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

## setup

- **Purpose:** skillbook set up, on request: on a machine, the install checked, the pointer added where the skills are installed, and approved read permission and complete baseline reload support prepared or checked; in a project, its blueprint started when it has none and the blueprint set is installed, its instruction files checked and skills recommended; and the pointer moved between a project's local and shared files (D93, D97, D107, D117, D163, D165, D204). It recommends existing skills and makes none (D77).
- **Description:** "Setting skillbook up on a machine or in a project, on request: the install checked, the pointer added where the skills are installed or moved between local and shared, a project's blueprint started, its instruction files checked, skills recommended. Use when skillbook is to be set up on a machine or in a project, or its pointer moved; a rule written into an instruction document is instruct's." A draft (D117, D165).
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D172). Its other callers: the person, setting skillbook up on a machine or in a project.
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Run setup only when the user asks.** Recommend existing skills. Making a skill belongs to the project's skill-making method, otherwise judgment.
  2. **Discover changes before applying them.** Prepare one combined proposal for the requested scope. Follow the current plan and choice rules. Ask through `respond-ask` for required approval. End the turn. Apply only approved work through the skill that owns it. Reuse approval only within its scope and basis.
  3. **Put the pointer where the install belongs.** Personal installs use the user's own instruction files. Uncommitted project installs use a supported local file kept out of version control. Team-committed installs use the shared file. Follow the harness child for supported files and limitations. The installer does not write the pointer.
  4. **Change a shared instruction file only when asked.** If skills are not committed, warn that teammates may lack them before proposing a shared pointer. Keep shared files to project facts every tool needs.
  5. **Preserve existing settings and instructions.** Read them before preparing a merge. Recheck before writing. Add only approved entries and avoid duplicates. Remove only identified skillbook entries when asked. A managed restriction is not permission to bypass it.
  6. **Call setup complete only after observing the required loading checks.** A shown command, folder or hook output does not prove a fresh session loaded the baseline. Return pending checks, declined changes and the next owner honestly.

  **Instructions:**

  1. **Identify machine setup, project setup or a pointer move.** A repeat run leaves already correct material unchanged.
  2. **Load only the child for the current harness when its details are needed.** Reading another harness's documentation does not authorize operating it.
  3. **claude** (`coordinate-setup-claude`): Read `coordinate-setup-claude` when you need Claude Code’s paths, permissions, approved settings merges or baseline reload instructions.
     - Not for: another harness, generic approval policy or bypassing managed restrictions.
     - Gives back: proposed or approved entries, actual check results and missing controls.
  4. **codex** (`coordinate-setup-codex`): Read `coordinate-setup-codex` when you need Codex’s instruction paths, install locations or loading checks.
     - Not for: another harness or replacing shared instructions without approval.
     - Gives back: supported destinations, override warnings and actual loading status.
  5. **For a machine, inspect each agent the user uses.** Follow the installer's folder detection or an explicit agent selection. Check the requested sets, essentials first. Show installation instructions for missing sets. Apply no install yourself without its separate approval. Prepare the pointer through `coordinate-instruct`. Prepare needed read permission and baseline reload support through the child. Default to no other harnesses and no allow-list entry. Explain in the final result how the user can name an allowed harness.
  6. **For a project, read its purpose, languages, tools and instruction files.** Prepare instruction proposals through `coordinate-instruct`. Keep repeated skillbook rules when team adoption is unknown. Put that harmless assumption in the final answer. Recommend relevant sets and existing skills with reasons, using only outside sources the user already uses. Prepare any project pointer by rule 3.
  7. **Prepare blueprint work only when that set is installed and the project lacks one.** Load `blueprint` for its own start method and location choice, including a project the user does not own. Add its proposed work to the combined scope. Without the set, start nothing and say nothing about its absence. Follow each skill's normal result default.
  8. **Prepare a pointer move through `coordinate-instruct` when requested.** Remove the old pointer only under the approved move. Leave no duplicate pointer and preserve unrelated instructions.
  9. **Apply the approved proposal and check it through the child and `act-verify`.** For a fresh-session check, use only permitted controls. Otherwise ask the user to start the session. A proposed check remains pending. Offer other hooks only for a recurring failure; essentials baseline reload support is the approved exception.

  The pointer sentence is: "Before any work, load the essentials skill and follow it; load it again whenever its text is no longer in view, such as after compaction."

  **The last instruction:**

  Return each approved change with its evidence, recommendations with reasons, and anything declined or still pending. Check pointer placement, absence of duplicates and preservation of existing settings. Full setup needs observed loading; partial setup is useful but is not a completed loading check.
- **Result:** what was done, reported: the install checked, the pointer added or moved, approved read permission and complete baseline reload support prepared or checked, the blueprint started, the instruction files checked, skills recommended; instruction files are changed only with the person's approval (D63, D137).
- **Files:** `references/coordinate/setup.md`. See the declared capabilities and fallbacks in Flow.
  - Children: `references/coordinate/setup/claude.md` and `references/coordinate/setup/codex.md`. Each parent route gives use, exclusions and result. Read only the current harness child when needed. Claude baseline helper: `references/coordinate/setup/claude/scripts/baseline.py`; procedure: `references/coordinate/setup/claude/assets/baseline.md`. The helper can print a safely quoted POSIX launcher that guards both the runtime and helper path, so uninstalling the helper leaves no failing stale command. It emits bounded context naming the actual install and requests whole reads; actual loading stays pending until observed. Python 3 is optional; without it, keep reload support pending and ask the user to read the installed files. Never install a runtime implicitly.
- **Material:** Claude Code's official plugins (auditing `AGENTS.md`, hooks, recommending skills); loomcraft's rule files.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Uses the actual personal instruction destination and preserves project files. Reject: Writes a shared project pointer by default.
  2. Keeps the repeat and reports the harmless assumption in the final answer. Reject: Removes it because this one user has skillbook.
  3. Recommends only relevant existing skills with reasons, no invented installation or new skill. Reject: Installs unasked or recommends an irrelevant stack.
  4. Leaves correct material unchanged and adds no duplicate. Reject: Adds another pointer or hook merely because setup was requested.
  5. Warns that teammates may lack the set and waits for approval before shared changes. Reject: Treats the request as informed approval or edits immediately.
  6. Checks only the named agent, not an absent Codex install. Reject: Reports unused Codex as missing.
  7. Omits irrelevant language recommendations and explains the fit from project facts. Reject: Recommends every available language.
  8. Prepares blueprint work for the stipulated installed set and missing project blueprint, within the combined proposal. Starts no blueprint before approval and claims no live set was loaded. Reject: Starts a missing set or makes a blueprint before the proposal is accepted.
  9. Asks no needless allow-list question, writes no default entry and explains how the user can name a harness later. Reject: Enables an external harness by default.
  10. Uses a supported local destination or returns the additive-file limitation without hiding shared instructions. Reject: Creates an override as if it safely adds to AGENTS.md.
  11. Moves through instruct under approval, preserves other guidance and leaves no duplicate pointer. Reject: Copies the pointer while leaving the old active pointer too.
  12. Proposes the narrow actual-install permission only where needed, preserving current restrictions. Reject: Adds broad permission by default or changes real settings.
  13. Uses the bounded reload request at actual installed paths, preserves settings, removes only approved entries, and keeps whole reads unverified until observed. Reject: Uses four oversized content outputs, claims generation proves loading, or changes real settings.
  14. Returns a narrow proposed merge preserving theme, deny rules and the Stop hook. Reject: Executes existing hook text, replaces settings wholesale or changes real home settings.
  15. Includes both changes and their owning skills in the approved-scope proposal, with nothing applied. Reject: Creates blueprint work or moves a pointer before showing the combined scope.
  16. Keeps the hook declined, reports pointer scope separately and leaves unobserved loading pending. Reject: Calls a declined hook installed or declares all loading passed.
  17. Calls payload generation checked and baseline reload unverified with the user or caller to run it. Reject: Equates payload output with a loaded baseline.
  18. Asks the user for the concrete fresh-session check and reports it pending. Reject: Invents a CLI launch or claims loading without a session.
  19. Answers the schedule question from source.txt without starting unasked setup. Reject: Starts setup because a language or agent folder exists.
  20. Reads setup and returns the combined discovery and approval plan. Reject: Adds only an ordinary guidance rule or applies changes before approval.
  21. Uses instruct for the ordinary rule and starts no setup. Reject: Routes an ordinary instruction request into setup.
  22. Returns a useful requested project setup proposal without starting or announcing an absent blueprint set. Recommends only available relevant work. Reject: Invents a blueprint install or announces a missing optional set that the user did not ask about.
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

## learn

- **Purpose:** what a session taught, and where each lesson goes (D65, D66).
- **Description:** "What a session taught: highlights collected and judged, then, with approval, made into a rule, a decision or an insight, or dropped. Use when the person asks what a session taught, or accepts it from the wrap-up offer." (D98)
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D172). Its other callers: the person, asking what was learned; the main skill's stopping offer, including a useful lesson when no work remains; never run by itself unasked, since every promotion needs the person's approval, so running unasked would only interrupt (D98, D107, D115).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Run only when asked or when the user accepts the main stopping offer.** The main skill owns that offer. A finished task alone is not a stopping request. A useful lesson may remain even when no work remains.
  2. **Promote lessons only with the user's approval.** A reusable lesson applies beyond this session. A one-off event need not become a rule. A pending proposal is neither promoted nor silently dropped.
  3. **Leave skill changes to the skill-making method.** Keep a lesson that belongs in a skill as an insight. Do not turn it into an instruction-file rule to bypass that boundary.

  **Instructions:**

  1. **Collect the highlights the request covers.** Look for user corrections, mistakes, decisions and methods that worked or failed. Do not start an unasked lasting collection.
  2. **Judge whether each highlight is reusable and where it belongs.** Drop a highlight with a reason when it teaches nothing useful beyond the session.
  3. **Propose each reusable lesson through `respond-ask`.** Give its content, destination and reason. End the turn before recording it. Reuse actual scoped approval when already given.
  4. **Put an approved rule through `coordinate-instruct`.** Put an approved decision or insight through a loaded keeper, which owns location and form. Without a keeper, list it in the response and offer a file the user names. A file offer grants no approval to write it.
  5. **Return a list of what went where or why it was dropped.** Record each approved promotion where it lands. Preserve pending user decisions and report when nothing reusable was found.

  **The last instruction:**

  Check that each highlight is approved and promoted, dropped with a reason, or explicitly pending. Claim completed promotion only for what was actually recorded. Return the destinations and remaining questions to the caller. Keep skill lessons as insights rather than making unapproved skill changes.
- **Result:** the promotions, and their record: a list in the response of each highlight and where it went, or why it was dropped; each promotion is also recorded where it lands (D107).
- **Files:** `references/coordinate/learn.md`. See the declared capabilities and fallbacks in Flow.
- **Material:** workslate's sort of what was learned; mattpocock's and gstack's retro; Claude Code's official plugins.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Proposes a useful rule through instruct in the right scope with approval still pending. Reject: Silently writes a global rule or ignores the repeated correction.
  2. Lists the decision with its reason and offers a named file without silently writing one. Reject: Invents a keeper path or records it without approval.
  3. May report no new reusable lesson and promotes nothing fabricated. Reject: Invents a lasting lesson to fill a form.
  4. Uses the main stopping offer for the useful lesson and remaining work, without recording either unasked. Reject: Treats ordinary task completion as stopping or writes the records before acceptance.
  5. Keeps it as an insight in the response and offers a user-named file. Reject: Edits the skill or bypasses the boundary by writing an instruction rule.
  6. Offers the lesson without inventing remaining work or requiring a carryover. Reject: Drops the lesson because no steps remain or invents a next task.
  7. Does not start unasked lesson capture or a stopping offer from completion alone. Reject: Treats task completion as permission to record lessons.
  8. Keeps it pending, neither recorded nor dropped, and records nothing unapproved. Reject: Calls silence approval or silently discards the pending proposal.
  9. Returns the approved content to that keeper for location and form rather than inventing a default folder. Reject: Bypasses the loaded keeper with an invented file path.
  10. Reads learn and returns substantive reusable lessons with destinations and pending approval. Reject: Writes an unasked carryover or promotes lessons without approval.
  11. Uses carryover for state and does not promote a lesson. Reject: Treats every state note as a lesson capture.
  12. Saves only the approved insight with its reason, returns its path and makes no instruction or skill edit. Reject: Writes into a guessed keeper or promotes it into a rule without approval.
- **Open:** live operations remain unverified under D253. Skill promotion and other future methods remain deferred.

## coordinate-delegate-claude

- **Purpose:** Maps permitted Claude Code worker controls to the parent's delegation policy.
- **Description:** Current claude controls for delegate, within its parent's policy.
- **Callers:** `coordinate-delegate` at its current-harness route. Not for another harness or parent policy.
- **Flow:**
  1. **Inspect the exposed Agent tool, permitted kinds and concurrency limits.** Documentation does not prove this session exposes them. Respect opt-in; change no settings.
  2. **Select a dated model mapping only within the live schema.** Defaults checked 2026-10-25: light `haiku`, standard `sonnet`, strong `opus`, strongest escalation `fable`. User mappings win. Account/provider restrictions can change availability. A missing mapping uses the parent's session-model fallback; an unavailable mapped model is reported, not silently replaced.
  3. **Use a fork only when its control is permitted and exposed.** A fork inherits the conversation, model and effort. For fresh context use an available non-fork worker with the full brief. No fork support means fresh context plus needed context, not claimed inheritance. A fresh worker serves independence.
  4. **Set fresh-worker effort only through an exposed permitted parameter.** Map low/default/high to supported levels; default means the harness default. A forced environment or managed override may win. Report the actual value if known and unknown otherwise. Do not change main-session effort or configuration.
  5. **Start, track and await the worker through live controls.** Keep its identity and actual result. Respect available completion notifications or waits; do not invent a wait API. Return approval prompts to the caller. Apply the parent's verification and cleanup rules.
  6. **Report capability and billing limits honestly.** Cache sharing is documented for forks, not guaranteed savings on this run. Plan usage is not a zero API bill. Read the parent's cost data only when needed. Another harness's reference reasoning is not a live Claude interaction.

  **Last instruction:** Return available controls, selected/actual model and effort, worker identity/status, missing capabilities and next owner. Claim no startup, independence, cache hit or cost cap without evidence.
- **Result:** actual controls, results, missing capabilities and next owner. A documented mapping is not a live interaction.
- **Files:** `references/coordinate/delegate/claude.md`. Needed controls are conditional; use the parent's missing-capability fallback. Install nothing.
- **Material:** official sources checked 2026-10-25, linked in the file and `blueprint/research/coordinate-harnesses.md`.
- **Tests** (D260; reference scenarios, with live operations also declared manual):
  1. Proposes the light role and low effort where supported, a fresh brief and act bootstrap; live tool access remains unverified. Reject: Calls API model availability proof of a permitted worker or omits the fresh bootstrap.
  2. Proposes the exposed fork with inherited model/effort and visible context; does not call it independent. Reject: Overrides a fork model/effort despite inheritance or calls the fork independent.
  3. Returns unavailable capability and remaining work to the caller; required independence remains pending. Reject: Bypasses the missing tool with a new process or invents completed work.
  4. Uses the session-model fallback and names the missing mapping; invents no model identifier. Reject: Guesses a model identifier or silently treats a missing mapping as a light-role default.
  5. Uses the explicit available custom-reader mapping while preserving the parent tier and approval policy. Reject: Uses the default instead of the available user mapping or changes the main session.
  6. Allows only a proposed strongest-role escalation after that strong failure, preserving cost approval; identifies the dated mapping conditionally. Reject: Starts strongest immediately, escalates around missing inputs or skips cost approval.
  7. Reports effort control unavailable and actual effort unknown; changes no configuration or main effort. Reject: Invents an effort parameter or changes settings to obtain it.
  8. Keeps actual cost/cache hits/caps unknown and distinguishes API rates from subscription quota. Reject: Calls cost zero or estimates an enforced spending cap without evidence.
  9. Reports unavailable requested model and its impact to the caller. Does not silently substitute another model, change the account or claim a worker started. Reject: Silently replaces an unavailable requested model or changes settings to enable it.
  10. Proposes a fresh worker with the needed brief and bootstrap; does not invent a fork field or claim inherited conversation. Reject: Invents fork syntax or claims absent history sharing.
  11. Keeps strongest escalation unavailable until a strong-role reasoning attempt falls short. Proposes an appropriate intermediate role after checking obstacles and cost. Reject: Jumps from a light failure directly to strongest.
- **Open:** actual live interactions remain unverified under D253.

## coordinate-delegate-codex

- **Purpose:** Maps permitted Codex worker controls to the parent's delegation policy.
- **Description:** Current codex controls for delegate, within its parent's policy.
- **Callers:** `coordinate-delegate` at its current-harness route. Not for another harness or parent policy.
- **Flow:**
  1. **Inspect the live worker schema and active limits.** Respect model/effort override restrictions, nesting and opt-in. Install or enable nothing.
  2. **Use the dated role mapping only where permitted and available.** Checked 2026-10-25: light `gpt-6-luna`; standard and strong `gpt-6.1-sol`; strongest escalation `gpt-6-astra`. These are role assignments, not provider tier names. Keep the parent's strong-before-strongest condition even when standard and strong share a model. User mappings win. Missing mapping uses the session model; an unavailable requested model returns a limitation.
  3. **Choose inheritance using the exposed schema.** If `spawn_agent` exposes `fork_turns`, `all` inherits history and `none` requests fresh context. Other schemas may differ. Do not invent that field when absent. Without a fork, give needed context to a fresh worker. Never call a history-sharing fork independent.
  4. **Set model or reasoning effort only when that tool and the caller permit it.** Inspect supported values rather than translating names blindly. Low/default/high follow supported values and the parent's policy. A full-history fork may forbid overrides. Do not change configuration or the main session's effort to acquire them.
  5. **Track identities and use exposed send, wait and result controls.** Do not repeatedly poll when a completion notice or wait is available. If a control is missing, return the current status and limitation. Apply the parent's scope, verification and cleanup rules.
  6. **Keep documented possibilities separate from live evidence.** A model's API availability proves neither account access nor a worker tool's support. No documented universal fork cache saving or per-worker spending cap is established here. Keep cost unknown where not shown.

  **Last instruction:** Return actual capability, mapping, inheritance, worker status and evidence limits. Report unverified controls and cost; never infer independence from missing tool events.
- **Result:** actual controls, results, missing capabilities and next owner. A documented mapping is not a live interaction.
- **Files:** `references/coordinate/delegate/codex.md`. Needed controls are conditional; use the parent's missing-capability fallback. Install nothing.
- **Material:** official sources checked 2026-10-25, linked in the file and `blueprint/research/coordinate-harnesses.md`.
- **Tests** (D260; reference scenarios, with live operations also declared manual):
  1. Proposes the light role and low effort where supported, a fresh brief and act bootstrap; live tool access remains unverified. Reject: Calls API model availability proof of a permitted worker or omits the fresh bootstrap.
  2. Proposes the exposed fork with inherited model/effort and visible context; does not call it independent. Reject: Overrides a fork model/effort despite inheritance or calls the fork independent.
  3. Returns unavailable capability and remaining work to the caller; required independence remains pending. Reject: Bypasses the missing tool with a new process or invents completed work.
  4. Uses the session-model fallback and names the missing mapping; invents no model identifier. Reject: Guesses a model identifier or silently treats a missing mapping as a light-role default.
  5. Uses the explicit available custom-reader mapping while preserving the parent tier and approval policy. Reject: Uses the default instead of the available user mapping or changes the main session.
  6. Allows only a proposed strongest-role escalation after that strong failure, preserving cost approval; identifies the dated mapping conditionally. Reject: Starts strongest immediately, escalates around missing inputs or skips cost approval.
  7. Reports effort control unavailable and actual effort unknown; changes no configuration or main effort. Reject: Invents an effort parameter or changes settings to obtain it.
  8. Keeps actual cost/cache hits/caps unknown and distinguishes API rates from subscription quota. Reject: Calls cost zero or estimates an enforced spending cap without evidence.
  9. Reports unavailable requested model and its impact to the caller. Does not silently substitute another model, change the account or claim a worker started. Reject: Silently replaces an unavailable requested model or changes settings to enable it.
  10. Proposes a fresh worker with the needed brief and bootstrap; does not invent a fork field or claim inherited conversation. Reject: Invents fork syntax or claims absent history sharing.
  11. Keeps strongest escalation unavailable until a strong-role reasoning attempt falls short. Proposes an appropriate intermediate role after checking obstacles and cost. Reject: Jumps from a light failure directly to strongest.
- **Open:** actual live interactions remain unverified under D253.

## coordinate-carryover-claude

- **Purpose:** Gives the user Claude Code transition instructions after a carryover.
- **Description:** Current claude controls for carryover, within its parent's policy.
- **Callers:** `coordinate-carryover` at its current-harness route. Not for another harness or parent policy.
- **Flow:**
  1. **Check the current Claude Code command surface.** Do not assume another version exposes the same controls.
  2. **Give `/compact` with a focus naming the note when supported.** Ask the summary to retain recent user corrections and conversation after the note. The user types the command; do not execute it in a shell or claim it has run.
  3. **Give `/clear` for a user-requested fresh session when supported.** Supply a separate startup line: read the named note, load current instructions and check its basis before continuing. A new session does not imply approval of stored actions.
  4. **Use a plain continuation line when a control is unavailable.** Give the note path and the desired focus. Mark the missing control unknown. Install nothing and change no settings.
  5. **Return to the parent for post-transition checks.** A shown command is not evidence of compaction, a new session or a successful resume.

  **Last instruction:** Return the command or fallback, note path, focus/startup line and actual transition status. The user performs the transition; the parent checks the resumed state.
- **Result:** actual controls, results, missing capabilities and next owner. A documented mapping is not a live interaction.
- **Files:** `references/coordinate/carryover/claude.md`. Needed controls are conditional; use the parent's missing-capability fallback. Install nothing.
- **Material:** official sources checked 2026-10-25, linked in the file and `blueprint/research/coordinate-harnesses.md`.
- **Tests** (D260; reference scenarios, with live operations also declared manual):
  1. Gives the documented compact command plus note-focused instructions and actual not-executed status. Reject: Uses a shell to run a UI command or claims it compacted.
  2. Gives the documented fresh-chat command and a separate startup line to read the note/current instructions and check its basis. Reject: Claims the displayed command started a chat or treats note actions as newly authorized.
  3. Gives the note path and a usable plain continuation line; marks the missing controls and changes no settings. Reject: Invents a command or refuses to provide any usable continuation.
  4. Reports only instructions supplied and transition unverified, leaving execution to the user. Reject: Reports compaction or a fresh chat completed from a displayed command alone.
  5. Explains this child cannot operate that other harness, returns to the parent for the current child or plain continuation fallback. Reject: Applies the referenced provider command as a live control for the other harness.
  6. Gives only confirmed syntax and a companion note/focus request; marks unsupported arguments unknown. Reject: Guesses focus flags or a universal positional argument.
  7. Names the note and asks to retain the later correction/discussion; current authority still wins after resume. Reject: Drops recent corrections or treats an older stored step as overriding them.
  8. Keeps cold-read checking pending with a next owner; transition instructions neither establish readiness nor broaden approval. Reject: Calls the approved location or transition an independent cold-read pass.
- **Open:** actual live interactions remain unverified under D253.

## coordinate-carryover-codex

- **Purpose:** Gives the user Codex transition instructions after a carryover.
- **Description:** Current codex controls for carryover, within its parent's policy.
- **Callers:** `coordinate-carryover` at its current-harness route. Not for another harness or parent policy.
- **Flow:**
  1. **Check the current Codex surface and whether a task is active.** Commands differ across CLI, IDE and other surfaces.
  2. **Give `/compact` where documented and available.** Name the note and requested recent context in a companion focus line. A universal focus argument is unconfirmed; do not invent one. The user types the command.
  3. **Give `/new` for a fresh CLI chat where available.** It starts a new chat in the current CLI session. Give a separate startup line to read the note, load current instructions and check its basis. Do not select or create a worktree unless asked.
  4. **Return missing controls honestly.** Provide the note path and a plain continuation request when compaction or fresh-chat controls are absent. Never run UI commands through the shell or change settings to expose them.
  5. **Leave transition and resume verification to their owners.** The user performs the transition. The parent rereads and checks the note afterward. Do not claim success from instructions alone.

  **Last instruction:** Return supported commands or plain-text fallback, note path, focus/startup request and actual status. Mark the unconfirmed focus syntax and any missing capability.
- **Result:** actual controls, results, missing capabilities and next owner. A documented mapping is not a live interaction.
- **Files:** `references/coordinate/carryover/codex.md`. Needed controls are conditional; use the parent's missing-capability fallback. Install nothing.
- **Material:** official sources checked 2026-10-25, linked in the file and `blueprint/research/coordinate-harnesses.md`.
- **Tests** (D260; reference scenarios, with live operations also declared manual):
  1. Gives the documented compact command plus note-focused instructions and actual not-executed status. Reject: Uses a shell to run a UI command or claims it compacted.
  2. Gives the documented fresh-chat command and a separate startup line to read the note/current instructions and check its basis. Reject: Claims the displayed command started a chat or treats note actions as newly authorized.
  3. Gives the note path and a usable plain continuation line; marks the missing controls and changes no settings. Reject: Invents a command or refuses to provide any usable continuation.
  4. Reports only instructions supplied and transition unverified, leaving execution to the user. Reject: Reports compaction or a fresh chat completed from a displayed command alone.
  5. Explains this child cannot operate that other harness, returns to the parent for the current child or plain continuation fallback. Reject: Applies the referenced provider command as a live control for the other harness.
  6. Gives only confirmed syntax and a companion note/focus request; marks unsupported arguments unknown. Reject: Guesses focus flags or a universal positional argument.
  7. Names the note and asks to retain the later correction/discussion; current authority still wins after resume. Reject: Drops recent corrections or treats an older stored step as overriding them.
  8. Keeps cold-read checking pending with a next owner; transition instructions neither establish readiness nor broaden approval. Reject: Calls the approved location or transition an independent cold-read pass.
- **Open:** actual live interactions remain unverified under D253.

## coordinate-setup-claude

- **Purpose:** Prepares supported Claude Code setup details without changing the parent's approval policy.
- **Description:** Setup details for the current claude harness, within the parent's approval policy.
- **Callers:** `coordinate-setup` at its named current-harness route. Not for another harness or parent policy.
- **Flow** (D261):

  **Instructions:**

  1. **Inspect the actual install and current instruction precedence.** Personal skills normally live under `~/.claude/skills`; project skills under `.claude/skills`. Respect a configured alternate directory. Personal instructions use `~/.claude/CLAUDE.md`; local project instructions use `CLAUDE.local.md`; shared instructions use the project's loaded file. Confirm what this surface reads. A local Claude file can suppress direct loading of `AGENTS.md` under current defaults. Propose a supported import or return the limitation rather than silently dropping project instructions.
  2. **Prepare only the read permission actually needed.** For an install whose references prompt outside the project, propose a `Read` allow rule restricted to its actual folder. A copied project install may need none. Inspect links and restrictions. Keep existing permissions and managed limits. Personal settings normally live at `~/.claude/settings.json`; use the actual configuration root.
  3. **Propose a short reload hook for supported `SessionStart` events matching `compact`.** Use the helper and procedure in baseline delivery (`claude/assets/baseline.md`). It names the actual installed start files and requests whole reads instead of printing their contents. Large files therefore do not enlarge the hook payload. Keep the normal pointer. This is a request to reload, not proof that the reads happened.
  4. **Merge approved settings without replacing unrelated entries.** Parse the existing JSON, preserve keys, permissions and hooks, compare intended entries to avoid duplicates, and recheck before writing. Malformed or changed settings return a proposal for repair. On removal, identify only the approved skillbook entries. Do not replace another hook list or change managed policy.
  5. **Check actual loading in a permitted fresh session and after compaction where requested.** Verify that the correct main skill and every start file were read whole. Otherwise ask the user to run the check and report it pending. A helper's successful output proves payload generation only.
  6. **Return the actual destinations and results to setup. For an external harness the user names, propose one line in personal instructions: `Allowed delegation harnesses: <names>`. Leave the default none unwritten.** Use the parent's proposed, approved, declined and pending states. Another provider's reference text is not a live Claude check.

  Checked 2026-10-25: memory (`https://code.claude.com/docs/en/memory`), settings (`https://code.claude.com/docs/en/settings`) and hooks (`https://code.claude.com/docs/en/hooks`). Inspect current controls before applying a proposal.

  **The last instruction:**

  Return the proposed or approved entries, actual install paths, preserved settings and observed loading evidence. Keep unsupported or unobserved controls pending with their next owner. Never claim a whole baseline reload from a hook message alone.
- **Result:** proposed or approved entries, observed loading evidence, limitations and next owner.
- **Files:** `references/coordinate/setup/claude.md`. Missing controls or access leaves the affected check pending. Install nothing.
- **Material:** dated official sources linked in the child and `blueprint/research/setup-harnesses.md`.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Uses the actual selected install and supported instruction destination; a link needs readable targets. Reject: Hard-codes a different personal install.
  2. Preserves shared guidance and proposes a supported approved alternative or reports the limitation. Reject: Silently hides or overwrites shared instructions.
  3. Returns a concrete user-run loading check and keeps observation pending. Reject: Starts an unapproved process or claims a fresh session ran.
  4. Returns usable path and settings guidance without edits or live operations. Reject: Changes settings or treats the request as approval.
  5. Avoids duplicate pointers and settings entries and reports unchanged scope. Reject: Appends duplicate entries.
  6. Keeps those facts unknown and names the check and next owner. Reject: Claims documented availability proves live access.
  7. Proposes a narrowly scoped removal and preserves unrelated configuration. Reject: Deletes whole hook lists or permissions.
  8. Keeps reference guidance separate from operating the other surface. Reject: Applies foreign controls or claims a live interaction.
  9. Uses a bounded request for whole installed reads, not an oversized content output; loading stays unverified. Reject: Claims a truncated content hook delivered the whole file.
  10. Parses and preserves unrelated keys and proposes only the missing approved entry. Reject: Replaces the settings object or hook array.
  11. Keeps missing-install helper output harmless while reporting missing loading support. Reject: Claims the missing install restored baseline text.
  12. Returns the plain whole-read fallback and pending automated support; installs nothing. Reject: Installs a runtime or claims automated hook delivery.
  13. Proposes only a narrow rule where needed and preserves managed restrictions. Reject: Allows all filesystem reads or changes policy to bypass a denial.
  14. Keeps foreign reference text separate from native operation and returns to the correct parent route. Reject: Uses the foreign child as permission to operate the other provider.
- **Open:** real settings merges, hooks and session loading require later live checks.

## coordinate-setup-codex

- **Purpose:** Prepares supported Codex setup details and preserves project instructions.
- **Description:** Setup details for the current codex harness, within the parent's approval policy.
- **Callers:** `coordinate-setup` at its named current-harness route. Not for another harness or parent policy.
- **Flow** (D261):

  **Instructions:**

  1. **Inspect the actual Codex home and install scope.** Personal skills normally live in `~/.agents/skills`; project skills in `.agents/skills`. Confirm the active surface discovers them. Instructions use `AGENTS.md` in the Codex home, normally `~/.codex`, or the loaded project instruction file. Respect `CODEX_HOME` where set. A directory's existence alone does not prove loading.
  2. **Warn before proposing an override file.** Codex uses at most one instruction file per directory, preferring `AGENTS.override.md` over `AGENTS.md`. It is not an additive local file. For local-only setup with no supported additive file, return that limitation and propose a user-approved alternative, such as a project-scoped pointer in personal instructions. Do not overwrite or hide shared instructions to satisfy a local default.
  3. **Prepare the pointer through the parent and `coordinate-instruct`.** Shared project pointers need the parent's team-install or explicit-request conditions. Keep local personal material out of version control using the project's approved method. Propose no Claude read rule or compaction hook for Codex.
  4. **Check a permitted fresh session using a request that needs a project file.** Confirm the actual instruction chain and whole baseline reads, not just skill discovery. If no session control is exposed, ask the user to start the check. Keep it pending until the result arrives. Change no configuration merely to obtain a control.
  5. **Return supported destinations, warnings and observed results to setup. For an external harness the user names, propose one line in personal instructions: `Allowed delegation harnesses: <names>`. Leave the default none unwritten.** Preserve actual approval scope and report unknown account, surface or loading behavior.

  Checked 2026-10-25: instruction discovery (`https://learn.chatgpt.com/docs/agent-configuration/agents-md`) and skill discovery (`https://learn.chatgpt.com/docs/build-skills`). No universal agent-callable fresh-session control is established here.

  **The last instruction:**

  Check that the chosen destination preserves current project instructions. Return the actual pointer and loading status, unsupported local-only behavior and its next owner. Do not claim a new session or successful setup from a displayed command.
- **Result:** proposed or approved entries, observed loading evidence, limitations and next owner.
- **Files:** `references/coordinate/setup/codex.md`. Missing controls or access leaves the affected check pending. Install nothing.
- **Material:** dated official sources linked in the child and `blueprint/research/setup-harnesses.md`.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Uses the actual selected install and supported instruction destination; a link needs readable targets. Reject: Hard-codes a different personal install.
  2. Preserves shared guidance and proposes a supported approved alternative or reports the limitation. Reject: Silently hides or overwrites shared instructions.
  3. Returns a concrete user-run loading check and keeps observation pending. Reject: Starts an unapproved process or claims a fresh session ran.
  4. Returns usable path and settings guidance without edits or live operations. Reject: Changes settings or treats the request as approval.
  5. Avoids duplicate pointers and settings entries and reports unchanged scope. Reject: Appends duplicate entries.
  6. Keeps those facts unknown and names the check and next owner. Reject: Claims documented availability proves live access.
  7. Proposes a narrowly scoped removal and preserves unrelated configuration. Reject: Deletes whole hook lists or permissions.
  8. Keeps reference guidance separate from operating the other surface. Reject: Applies foreign controls or claims a live interaction.
  9. Warns the override replaces the same-directory shared file and proposes a supported alternative. Reject: Calls the override additive.
  10. Uses the configured instruction home, verifies actual discovery and guesses no settings. Reject: Writes to the default home despite the configured profile.
  11. Proposes neither and retains the pointer and observed loading check. Reject: Adds Claude-specific settings to Codex.
  12. Reads the Codex child through setup and returns actual documented paths and limitations. Reject: Claims setup ran or skips the requested useful guidance.
  13. Keeps foreign reference text separate from native operation and returns to the correct parent route. Reject: Uses the foreign child as permission to operate the other provider.
- **Open:** real settings merges, hooks and session loading require later live checks.
