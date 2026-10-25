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
  - **delegate** (`coordinate-delegate`): when a task goes to an agent, the default for any task that is not too small, as the main skill's advice says, or several agents should answer, search or change things in parallel; not for what an agent is told (brief), passing work on for later (carryover), or checking work with a second agent, which starts in verify and uses delegate to start the agent; it gives back the delegated work checked, with its cost where one is stated and what each agent left behind.
  - **brief** (`coordinate-brief`): when a task is handed to an agent, fork or fresh, and what it is told is written; not for who gets the work, its type, tier or cost (delegate), or the state written down for a later session (carryover); it gives back the brief, with the report it asks for (D147).

  **Later:**
  - **carryover** (`coordinate-carryover`): when work is carried over for later, to a later session or another agent, or picked up from a carryover; offered by the wrap-up offer and at a task's, milestone's or phase's end in a long session (D160); not for work given to an agent now (brief, delegate) or what a session taught (learn); it gives back the carryover written, or the state checked and the work continued (D147).

  **Every session:**
  - **instruct:** when a rule in an instruction document, `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md` or the person's own, is added, tidied or cut down, or which file a rule belongs in is decided; not for setting skillbook up (setup), a skill's own design or files (the project's skill-making skill where it has one, otherwise the agent's own judgment) or a carryover (carryover); it gives back the change proposed, in the file it belongs in.
  - **setup:** when skillbook is set up on a machine or in a project, or its pointer is moved between a project's local and shared files; not for writing a rule into an instruction document (instruct) or making a skill (the project's skill-making skill where it has one, otherwise the agent's own judgment); it gives back the install checked, the pointer added, the blueprint started, the instruction files checked and skills recommended.
  - **learn:** when the person asks what a session taught, or accepts it from the wrap-up offer, and never unasked; not for recording a design decision as it is made (design) or writing the state down for later (carryover); it gives back the highlights judged, each made into a rule, a decision or an insight with the person's approval, or dropped.

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
- **Harness routes** (D260):
  - **claude** (`coordinate-delegate-claude`): current claude controls for delegate. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
  - **codex** (`coordinate-delegate-codex`): current codex controls for delegate. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
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
- **Flow** (D99, D101, D107): the question scoped; the members chosen, about three, as advice: enough to see disagreement while staying cheap (D116); mixing models and agents where it helps (different models; a Codex agent beside a Claude one, only for a harness on the person's allow-list, by delegate's rule on other harnesses), since answers from one model share its blind spots, and none at the light tier, since each answer is a judgment (D115); each member briefed with the question and the material only, never the main agent's own view; each answers on its own; a summary that keeps the disagreements and says which member said what; every answer kept visible; the person decides or asks for more. How to start another agent is in delegate's reference file for it; the cost follows guardrails' rule on cost.

  Done when every member has answered, or failed after delegate's rule 4 and is named in the summary as missing, and the summary, with the answers beside it, is in front of the person (D107).
- **Result:** the summary, with the answers beside it.
- **Files:** `SKILL.md` only.
- **Material:** rig and workslate (posts, a spokesman, the person as authority).
- **Tests** (D107): members who disagree: the disagreement kept, each view named by its member; a question with the main agent's view already stated: the view absent from the members' briefs; "should we use X or Y?" asked of three agents, and "review this change" asked of three for overall verdicts: both councils (D115).
- **Open:** none known.

### fanout

- **Purpose:** the work split into parts, each agent with a part the others do not have, a different place to look or a different sub-question such as one review lens, and the findings combined (D99, D107, D115).
- **Description:** "Several agents search or read different places; their findings, each with its source, combined, checked against the sources and validated. Use when the work splits into parts, each agent with a part the others do not have; the same question to each is council's." A draft (D107).
- **Callers:** delegate, by its routing line in delegate's flow (D138, D172). Its other callers: understand's research and its parts, survey above all; any wide, light reading.
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
- **Description:** "Several agents each change their own items of one job; a shared item has one owner, who applies the others' proposals; then one pass over the whole. Use when several agents each change their own items of one job in parallel." A draft (D107).
- **Callers:** delegate, by its routing line in delegate's flow (D138, D172). Its other callers: authoring's edit, for parallel passes over one document (D70, D107).
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
  - **claude** (`coordinate-carryover-claude`): current claude controls for carryover. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
  - **codex** (`coordinate-carryover-codex`): current codex controls for carryover. Not for another harness or parent policy. Gives back actual controls/results, limitations and next owner.
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
- **Flow** (D94):
  1. **Reader and cost,** by act's rightsize's first rule: which agent reads the document, and when; a document read on every turn stays short (D145).
  2. **What it must let an agent answer:** the questions and requests it serves, written first; they are its tests.
  3. **When updating, read the current document first** and keep what is still true.
  4. **Draft,** by the rules below; a new document's parts are planned through organize, whose split takes what the document must cover as its items (D148).
  5. **Prune:** a new document by act's rightsize's check; an existing one through rightsize's lean, the one home for removing from what exists; every line that changes nothing removed; what only some work needs moved into a skill or a linked file (D145, D157).
  6. **Check** against step 2.
  7. **Propose:** the person approves before it is saved; an instruction document changes every later session.

  Done when the document answers step 2's questions and the person has approved it (D107).
- **Rules** (D94):
  - **Pointers:** a line read every turn says what something is and when to use it, the key word first, so an agent scanning the lines finds the one it needs.
  - **Steps:** named, each ending on "done when" or what comes next, so the agent knows when a step is finished.
  - **Wording:** reasons instead of capitals; positive wording; one example per rule; the project's terms, one word per concept; no reference the reader cannot resolve; in `AGENTS.md` and other shared files, no tool name only one agent has (D107).
  - **Shape:** what every session needs stays in the document; what only some work needs goes to a skill or a linked file, one level away.
  - **Which file:** the person's own files for the person's preferences; the pointer where the skills are installed, by setup's rule on where it goes (D165); `CLAUDE.local.md` for project-only personal instructions; a project's shared file only for facts any tool needs (D78, D93).
  - **Limits:** no rule that repeats a skillbook rule where the whole team uses skillbook, as setup says; elsewhere a repeat may stay, so teammates without skillbook keep it. Never an instruction document inside a folder that is copied into other projects, since it would carry rules that are not theirs. Advice: under about 200 lines, since every line is read at every session (D107, D115, D116).
- **Result:** the document, written or updated after approval.
- **Files:** `SKILL.md` only (D94).
- **Material:** mattpocock's `writing-for-agents`; superpowers' `writing-skills`; workslate's and the person's agent customisations' rules for principles files; meddah; the writing guides compared in [../../research/skill-writing-guides.md](../../research/skill-writing-guides.md).
- **Tests** (D94):
  1. "add a rule": added to the right file, with its reason, without repeating a skillbook rule where the team uses skillbook;
  2. a bloated `AGENTS.md` full of procedures: cut down to the facts through rightsize's lean, with the procedures proposed elsewhere (D157);
  3. "ALWAYS" and "NEVER" in capitals: rewritten with reasons;
  4. a tool name only one agent has, in a shared `AGENTS.md`: made neutral (D107);
  5. a personal preference to add: placed in the person's own file, not the shared one.
- **Open:** none known.

## setup

- **Purpose:** skillbook set up, on request: on a machine, the install checked, the pointer added where the skills are installed, and Claude Code's read rule and compaction hooks added; in a project, its blueprint started when it has none and the blueprint set is installed, its instruction files checked and skills recommended; and the pointer moved between a project's local and shared files (D93, D97, D107, D117, D163, D165, D204). It recommends existing skills and makes none (D77).
- **Description:** "Setting skillbook up on a machine or in a project, on request: the install checked, the pointer added where the skills are installed or moved between local and shared, a project's blueprint started, its instruction files checked, skills recommended. Use when skillbook is to be set up on a machine or in a project, or its pointer moved; a rule written into an instruction document is instruct's." A draft (D117, D165).
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D172). Its other callers: the person, setting skillbook up on a machine or in a project.
- **Flow:** three ways in (D97, D165).

  **A machine,** once per computer:
  1. for each agent the person uses, found by its folders (`~/.claude` for Claude Code, `~/.codex` for Codex), check that each set the person wants is installed, essentials first; if not, show how to install it, by the install script (D189, D191);
  2. add the pointer where the skills are installed, through instruct, unless it is already there, by the rule on where it goes below (D165);
  3. for an agent whose default permission mode asks before reading a skill's files outside the project, show its read permission, from that agent's reference file, and add it to the agent's user settings with the person's approval, unless it is already there: a refused read leaves the agent answering from the main skill alone; today only Claude Code with a personal install needs one, and a project install as a copy needs none (D193, D194);
  4. for Claude Code with essentials installed, show four `SessionStart` hooks with the matcher `compact`, from its reference file, and add them to its user settings with the user's approval, unless they are already there: each prints one start file of essentials, because Claude Code's compaction drops their text and the pointer alone did not bring them back; Codex needs none, since the pointer alone reloaded essentials there (D204);
  5. no question about which other agent programs delegation may run: none by default, and nothing is written; the result says that one can be allowed by naming it, which then goes into the person's own instruction file as one line in the form setup's reference files give, which delegate reads, since a question whose answer has a safe default costs the person a round (D102, D107, D115, D149);
  6. check that a fresh session loads the main skill for a request that needs a file, such as "what does this project's README say?": the agent starts one where its reference file says how, and otherwise asks the person to start it (D107, D115).

  Done when each agent the person uses loads the main skill on its own.

  **A project,** once per project:
  1. read the project: what it is, its languages and tools, its instruction files and project skills;
  2. start its blueprint through blueprint's main skill when it has none and that set is installed; where it is not, nothing is started or said about it, and each skill's result goes where its default says (D152, D156, D163). Where a blueprint lives in a project the person does not own is asked by blueprint's start step (D117, D163);
  3. check its instruction files through instruct: keep the facts, propose what is missing, such as how to build, test and check. What repeats a skillbook rule is proposed for removal from a shared file only when the whole team uses skillbook; the agent does not ask, since keeping the repeats is the safe default, counts the team as not using it, and says so in one line, inviting a correction; otherwise it stays, and the person is told why (D107, D115, D149);
  4. recommend what fits: the skillbook sets and skills that will matter there, each named with the reason, such as a language's code skill or maintain's repository standard; outside skills only from sources the person already uses. Installing any of them is an action through guardrails (D107);
  5. where the skills are installed in the project, check the install and add the pointer to the project's local file, kept out of version control, by the rule on where it goes below (D165);
  6. propose everything as one list, and apply what the person approves.

  **Moving the pointer,** when the person asks, such as from a project's local file to its shared file once the team commits the skills: the pointer moved through instruct, never left in both, then checked as a machine's step 6 checks it (D165).

  Done when the pointer is where the install puts it, the instruction files hold only what they should and the recommendations are listed. Running either again changes nothing that is already right, and says so (D97). Other hooks are proposed only when a rule keeps being broken despite the skills, never by default (D97); the compaction hooks are the exception, offered to a Claude Code install with essentials, and removed when the user asks (D204).

  Decided content:
  - the pointer sentence: "Before any work, load the essentials skill and follow it; load it again whenever its text is no longer in view, such as after compaction." (D78, D152, D153, D199). Its job is after compaction: the main skill's text, and any reload instruction inside it, is gone then, while the pointer in an instruction file survives; without compaction, the skill's own description is enough to load it (D199). In Claude Code the compaction hooks put the start files back as well, and the pointer stays for every agent (D204);
  - **where it goes** (D165): where the skills are installed: installed for the person, across projects, their own instruction files; installed in a project and not committed, the project's local file, kept out of version control, the default for a project; committed for the team, the project's shared `AGENTS.md` or `CLAUDE.md`, since every contributor then has the skills. Which file each harness reads is its reference file's; the install script never writes the pointer (D165, D191);
  - **a project's shared `AGENTS.md` or `CLAUDE.md`** changes only when the person asks, as a proposal; the pointer goes there when the team commits the skills, and, asked for while they are not committed, it is proposed with a warning that contributors without skillbook would be told to load a skill they lack (D165); beside the pointer, it holds only the facts any tool needs: what the project is, where things are, the commands, the project's conventions (D78, D93).
- **Result:** what was done, reported: the install checked, the pointer added or moved, Claude Code's read rule and compaction hooks added, the blueprint started, the instruction files checked, skills recommended; instruction files are changed only with the person's approval (D63, D137).
- **Files:** its own file; two children named after the agents, `coordinate-setup-claude` and `coordinate-setup-codex`, each read only when running in that agent (D197), holding each agent's paths and commands: which instruction files it reads, personal, local and shared, how each set is installed and checked, by the install script (D191), Claude Code's read rule, `Read(~/.claude/skills/**)` in its user settings (D193, D194), and, beside it, the four compaction hooks (D204): one `SessionStart` entry with the matcher `compact` and four command hooks, one per start file of essentials, `SKILL.md`, `references/understand.md`, `references/act.md` and `references/respond.md`, each `cat "$HOME/.claude/skills/essentials/<file>" 2>/dev/null || true`, so a hook prints nothing and fails nothing when the files are gone, for example after `install.sh --uninstall`; one hook per file because Claude Code caps a hook's output at 10,000 characters and the four files together are about 23,300; the order they arrive in does not matter, since each file stands on its own; removed when the user asks; and the one-line form of the allow-list delegate reads (D97, D102, D107, D137). Codex's local file is settled with the install routes, its personal file meanwhile, since as far as known Codex has none that adds to `AGENTS.md`: its `AGENTS.override.md` replaces the shared file in that folder (D93, D165).
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
  12. a machine with a personal Claude Code install and no read rule in its user settings: the rule shown and added with the person's approval; with the rule already there, nothing; Codex, or a project install as a copy: no rule (D193).
  13. a machine with Claude Code and essentials installed, no compaction hooks in its user settings: the four hooks shown and added with the user's approval, beside the read rule; with them already there, nothing; asked to remove them, removed; Codex, or essentials not installed: no hooks; with essentials removed by `install.sh --uninstall`, the hooks print nothing and fail nothing (D204).
- **Open:** other hooks, until there is a real case; see the ideas document. The compaction hooks are decided (D204); whether the other sets need such hooks is decided when they are built. Setup learns which agents the person uses by their folders, as the install script finds them (D191). The pointer in the person's own instruction files is not tested yet; Claude Code reading `CLAUDE.local.md` with `CLAUDE.md` is ([../../evidence.md](../../evidence.md), E7).

## learn

- **Purpose:** what a session taught, and where each lesson goes (D65, D66).
- **Description:** "What a session taught: highlights collected and judged, then, with approval, made into a rule, a decision or an insight, or dropped. Use when the person asks what a session taught, or accepts it from the wrap-up offer." (D98)
- **Callers:** coordinate's own skill, by its routing line in coordinate's flow (D134, D172). Its other callers: the person, asking what was learned; the main skill's wrap-up offer, when work stops with steps left; never run by itself unasked, since every promotion needs the person's approval, so running unasked would only interrupt (D98, D107, D115).
- **Flow** (D66): collect highlights, the moments in the conversation that changed the work: a correction from the person, a mistake found, a decision taken, a method that worked or failed (D115); judge each one, whether it is reusable, meaning it would apply beyond this session, and where it belongs; promote it with the person's approval, or drop it; record what went where. Where each kind goes (D98):
  - a rule, into an instruction document, through instruct;
  - a decision or an insight, to the keeper where one is loaded, which says where it goes; with none, listed in the response, with the offer of a file the person names (D163);
  - a lesson that belongs in a skill, until promoting it is designed, is kept as an insight, by that route.

  Done when every highlight is promoted with approval or dropped, and the record says where each went (D107).
- **Result:** the promotions, and their record: a list in the response of each highlight and where it went, or why it was dropped; each promotion is also recorded where it lands (D107).
- **Files:** `SKILL.md` only (D98).
- **Material:** workslate's sort of what was learned; mattpocock's and gstack's retro; Claude Code's official plugins.
- **Tests** (D98):
  1. a session where the person corrected the agent's habit twice: proposed as a rule for the person's own instruction file, through instruct;
  2. a session that settled a design choice: proposed as a decision;
  3. a session with nothing reusable: says so, and promotes nothing;
  4. "let's stop here" with steps left: offered with carryover in one question, by the main skill's wrap-up offer (D115);
  5. a lesson that belongs in one skill, no keeper loaded: listed in the response as an insight, not made a rule in an instruction file.
- **Open:** promoting a lesson into a skill, and where highlights wait, are future work in the roadmap; see the ideas document (D66, D77).

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
