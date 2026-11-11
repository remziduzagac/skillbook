# Design: coordinate

What a builder needs for the `coordinate` guide and its child guides, essentials' group for working with agents not in this conversation, now, later and in every session (D164); ideas not yet decided are in [../../ideas/coordinate.md](../../ideas/coordinate.md). Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet.

the `coordinate` guide belongs to the essentials set (D152, D154, D164).

How guides reach each other here (D107, D186, D279, D281): essentials is the skill; its references are guides. The main skill’s guide map and name rule resolve a guide’s name to its file and parents. For another kind of work, use a skill in the harness’s list that covers it, if one fits. Otherwise use the fallback beside the call, under the `act` guide’s rules. Essentials names no other set.

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

> Folded into the main skill (D346): this guide's own file is gone. Its key rules are the main skill's step 4, and the delegation default and the stopping offer sit in the `coordinate-delegate` and `coordinate-carryover` guides. The sections of its child guides below stay.

- **Purpose:** working with agents not in this conversation: another agent now (delegate, brief), a later session (carryover), and every session, through the instruction documents it reads (instruct), skillbook set up in them (setup) and a session's lessons kept (learn) (D164). Its own plain file has no rules or advice of its own: the delegation default, its exceptions and the fork-when-unsure advice are stage 4 of the main skill's Instructions, and the file points to them (D284, D298). It holds each child’s name and purpose (D279).
- **Guide purpose:** Helps agents work together, pass work to later sessions, and keep instructions and lessons in the right place.
- **Guide shape** (D283, D284, D287): Instructions opens with its goal, a small, token-efficient conversation, and one clear instruction. Four steps: decide for each part whether another agent does it, by the main skill's stage 4, which holds delegate-by-default and its exceptions (D298); hand the work over with delegate, brief or carryover; keep instructions, setup and lessons where the next agent finds them, with instruct, setup and learn; the check, always last, with each result's actual status. Each child keeps its one name-and-purpose line, now under the step that uses it. No rule moves.
- **Description:** "Working with agents not in this conversation: work handed to another agent and what it is told, work carried over to a later session, the instruction documents every session reads, skillbook set up, and what a session taught. Use when work goes to an agent not in this conversation, now, later or in every session, or another guide or skill needs one of these." A draft (D164).
- **When to use** (D279, D298): Use when work involves other agents, a later session, agent instructions, skillbook setup or lessons from a session. For example, a later agent may need a note to continue the work. The main skill reads this guide in its stage 4 when any part may go to another agent, and its map picks a child for the other work, with this guide read as its parent.
- **When not** (D279):

  - A skill’s design or files: use the project’s skill-making method, otherwise your judgment. These methods cover working with agents and sessions.
  - Other work outside these methods: use your judgment under the `act` guide.
- **Callers:** the main skill, from the main map or at its stage 4 when the stage's test fires (D279, D298); other guides or skills needing one of its child guides, through the main skill, such as the `act-verify` guide starting a second agent to check (delegate) (D56, D106); the main skill's wrap-up offer, for learn and carryover; the person, typing it.
- **Flow** (D134, D164).

  **Scope:** when work goes to an agent not in this conversation, now, later or in every session: delegating, briefing, a carryover, an instruction document, setting skillbook up or moving its pointer, or what a session taught, or another group needs one of these; not for the person's own work (the other groups) or what is said to the person or how the agent works (the `respond` guide and the `act` guide); it gives back what its child guide returns (D164, D171).

  Advice (D284, D294, D298): none of its own. Delegation by default, as strong advice, its three exceptions (too small, the user decides as it goes, the conversation needs the content) and the fork when unsure whether a task is too small are stage 4 of the main skill's Instructions, their one home, with the rationale in [essentials.md](essentials.md) (D298). The guide is read only when a part may go to another agent, and an agent must decide that a part is too small without reading it. Step 1 of this guide points to stage 4 and repeats none of it, so the test has one home.

  Instructions (D279, D287): the four steps under Guide shape. Step 2 holds delegate, brief and carryover, and step 3 holds instruct, setup and learn, each with its name and purpose:

  **Now:**
  - the `coordinate-delegate` guide: choose and manage workers.
  - the `coordinate-brief` guide: write a starting worker’s context.

  **Later:**
  - the `coordinate-carryover` guide: write or resume later-session context.

  **Every session:**
  - the `coordinate-instruct` guide: prepare agent instruction documents.
  - the `coordinate-setup` guide: prepare approved skillbook setup.
  - the `coordinate-learn` guide: find homes for reusable lessons.

  A request that fits no line is covered by "When not", so step 3 does not repeat it (D294).

  Step 4, **check each used method’s result.** Always do this last. Before anything is returned, the final step of Instructions in each child guide used holds (D134).
- **Gives back** (D279): Each used method’s result and its actual status, returned to the task that asked for it.
- **Files:** `references/coordinate.md` (D260).
- **Material:** none of its own.
- **Tests** (D164), each request routed to its child guide:
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
  12. Uses the current agent’s own controls under parent policy, returning proposed capabilities and limits without claiming a live spawn (D267). Reject: false startup, unsupported approval or missing concrete result.
  13. Gives fresh-session instructions for the user’s agent, or an honest unknown command and note-path continuation, retaining review and execution limits (D267). Reject: false startup, unsupported approval or missing concrete result.
  14. Inspects documentation only as requested and never treats it as a live operation (D267). Reject: false startup, unsupported approval or missing concrete result.
  15. Does not treat instructions shown as a performed transition (D267). Reject: false startup, unsupported approval or missing concrete result.
  16. Offers a carryover through the main flow without writing or treating task completion as a stopping instruction. Reject: false startup, unsupported approval or missing concrete result.
  17. The agent does a task itself that fits none of the exceptions in the main skill's stage 4, such as summarising a folder of minutes, because the case gives a reason: the final answer gives that reason. Reject: no reason given, or the reason shown only mid-work while the work goes on (D294).
  18. Unsure whether a task is too small: forked without asking. Reject: a question to the user about whether to delegate, or the task treated as a fourth "do it yourself" case (D294).
- **Open:** none known; the main guide’s own flow is its Instructions (D287).

## delegate

- **Purpose:** work given to other agents, the default for any task that is not too small, as the main skill's stage 4 says (D65, D99, D138, D298). Its own plain file holds its rules, advice, one name-and-purpose line per method, council, fanout and crew (D279), and the final step of Instructions; a single delegated task needs only delegate's own steps (D99, D112, D138).
- **Guide purpose:** Chooses and manages permitted workers, so their work is checked while decisions and authority stay with the caller.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing eight startup, check and report steps keep their order and gain bold actions and reasons. The three method names become unordered name-and-purpose lines rather than numbered steps 9–11; they are choices, not later work. Required cost approval and briefing stay before startup. No method moves from Rules and rule numbers stay unchanged. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Choose pattern and context, permitted controls, model, effort and approved cost before briefing and startup; track, check and return worker results. Keep nine steps and unordered child methods; the final check preserves authority, evidence, partial states, cost and cleanup. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Giving work to other agents, the default for any task that isn't too small: one agent, a council, a fanout or a crew; fork or fresh agent and its tier, by what the task needs and what it costs; tracking it while the conversation goes on, and checking the work; what the agent is told is brief's. Use for any task handed to an agent, or when several agents should answer, search or change things in parallel." A draft (D138, D142, D147).
- **When to use** (D279): Use when starting another agent now, or when several agents should answer, search or change things. For example, separate work or an independent check may need a worker. Follow the main skill's step 4 on delegating by default.
- **When not** (D279):

  - Writing the worker’s context: use the `coordinate-brief` guide. Choosing a worker and briefing it are separate jobs.
  - Continuing work later: use the `coordinate-carryover` guide. These workers start now.
  - Deciding whether an independent check is needed: use the `act-verify` guide. It calls this guide to start the checker.
- **Callers:** the `coordinate` guide itself, from the main map, with its parent path read first (D279). Its other callers: the main skill's stage 4 advice on delegating by default (D138, D298); the `devise-design-review` guide, one agent per review area for a large design (D168); the `devise-plan` guide, handing parts to agents (D155); the `understand-research-survey` guide, for a large search; skills in the harness’s list that need parallel experiments or document passes, if they fit (D70, D281); the `act-verify` guide, when a second agent checks the work (D115).
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

     When rows overlap, the higher tier wins. Decisions that other work builds on, such as a design, an architecture, a plan or an interface, are judged by what would be built on them, not by how easily their file is reverted: the strong tier and high effort, since a wrong decision costs more than the model; the strongest model available under the user’s mapping, only after the strong tier has tried and fallen short, since it costs more (D107, D150). Work that will need a judgment review is not given to the light tier, since checking weak judgment costs about what redoing it at the standard tier does (D115, D137). This guide names tiers, never a dated model mapping. Use the user’s model mapping. Without one, use the session model and report the limitation rather than guessing a model. Report an unavailable mapped model rather than silently substituting one (D267). A fork runs on the main agent's model and effort, so the tier and the effort are chosen for fresh agents only.

     **The effort follows how much reasoning the step needs,** chosen apart from the tier, since the model is what an agent can get right at all and the effort how much it thinks on each step (D143, D144):
     - **low:** the step only carries something out: known edits, searching, reading for a fact, a sweep;
     - **default,** the harness's: ordinary work;
     - **high:** judgment that nothing after it checks: validating, an unclear failure, a design choice, a final synthesis.

     A step a later one checks can think less, since thinking is paid at output price. The two need not match: a sweep over security-sensitive code with a validator behind it runs at the standard tier and low effort; a tricky function that tests will check, at the standard tier and high effort. A wide fanout never inherits the main session's effort, since its cost multiplies by its agents; the main session's own effort is the person's choice and is never changed. Effort is set only where the harness lets a guide set it, by rule 8 (D139, D143).
  4. **A failure's obstacle is checked first:** missing information, permissions, the network or a missing tool is fixed or asked about, never met with a stronger model, which costs more and fixes none of them (D115, D137).
  5. **Delegation never widens what is allowed:** a risky action inside the delegated work comes back as a proposal in the agent's report, as the `act` guide's rule on delegated agents says, and the main agent puts it to the person (D138).
  6. **The work is checked through verify,** since an agent's report of success is not evidence (D89). When verify itself started the agent, to check work, the report goes back to verify as that check, not through verify again (D137).
  7. **A question or approval prompt shown inside a delegated agent is reported to the person, never answered for them,** since the answer is theirs (D138).
  8. **The harness's limits on delegating hold,** a variation of the `act` guide's rule on which instruction wins: a mode that needs the person's opt-in, limits on agents starting agents, how many run at once, which kinds of agent exist. delegate guides within them; the harness's habits about when to delegate are what delegate refines; and no tool is brought in that neither the harness nor the person chose, since guides stay generic and impose no outside tool (D139).
  9. **Apply the `act-guardrails` guide's whole cost rule before every worker starts.** A single short worker is not proof of trivial cost. Reuse an actual accepted cost within its kind and scope. Otherwise give the estimate, uncertain amounts, quota usage and any enforced cap separately. Unknown cost is not zero. When a cost must be stated, take current prices from the provider's official pricing page and give the date read; never state a price from memory (D346). Ask through the `respond-ask` guide when approval is needed. End the turn before starting (D260).

  Advice (D138):
  - **fork or fresh** (D142): before delegating, list what the agent needs from this conversation to do the task well: decisions made, files already read, constraints, what the person wants. Then judge two things:
    - **how much it needs:** a short list, such as a goal, a few file pointers, a constraint and what to report, means the task needs little of the conversation, so a fresh agent, which carries only its brief, is cheaper over many turns; a long list, or one whose items only make sense with the discussion behind them, such as "the wording we agreed" or "the exception the person raised", means a fork, which already holds them and needs only the task, success criterion and report request;
    - **how long the task is,** judged from its shape, not counted: short when the change or answer is already known and only has to be carried out, such as applying these edits, recording what was agreed, or running a command and reporting; long when something has to be found first or the work loops, such as searching, researching, debugging, running tests and fixing until they pass, or reading many files;
    - **then:**
      - short and leaving little behind: the main agent does it itself; the cases are the main skill's stage 4 advice (D149, D298);
      - short, but it reads or produces a lot: a fork;
      - long, with a short list: a fresh agent, on a lighter model when the work is mechanical or a later step checks it;
      - long, with a long list: a fork; when the harness shows the agent its window nearly full, the list written to a file and given to a fresh agent instead;
      - a review, a second check or a council's member: a fresh agent, whatever it costs, by rule 2;
    - **why:** every turn of an agent pays again for everything in its context; a fork's context is the whole conversation, a fresh agent's its start-up, the brief and what it reads, so over a few turns the fork's cheap start wins and over many the smaller context wins. The judgment needs no token count, which most harnesses do not show the agent, and a session's transcript is read for its token counts only to measure, never for a routine choice (D142); where it is hard to make, the two choices cost about the same. The worked figures and the reasoning are in the research note on what tokens cost ([../../research/token-cost.md](../../research/token-cost.md)), for the builder; the plain file keeps this reason as one line of its own, since the blueprint does not ship (D149);
  - what delegating buys besides a free conversation, for choosing the agent: hard work, to a stronger model, when the work is self-contained and briefable; wide, light reading, to a lighter model, once a search has narrowed what it can, as instruction 1 says, delegated when what remains is many times larger than a fresh agent's start-up, the briefs and the reports, very roughly 80,000 to 100,000 tokens or more, an estimate from the measured costs (D105, D116, E8, E9). The figure is the builder's background only. The plain file gives a shape example instead, such as hundreds of source files or a year of meeting minutes, since the agent is told not to count tokens and cannot act on a token figure (D142, D294);
  - the running list: each delegated task, its agent, fork or fresh and its tier, when it started and what it should give back; user updates follow the main skill's current-step progress rule; ordinary results go in the final answer and the whole list is given when asked (D260); cleanup reads it for the agents to stop;
  - waiting: for the harness's notice that the work is done, not checking repeatedly, which costs turns while a finished task is reported anyway;
  - reporting: to the person in a few lines, the outcome, what needs their decision and what was left behind; the full report kept in the scratch place and offered, not pasted; a report that arrives mid-discussion goes in the next appropriate final answer, with a question only for a decision needed now, as discuss's rule on side topics says;
  - a delegated agent's result is taken from what it hands back, its report or a file it writes;
  - the means: the current agent’s own permitted controls (D267); a tool the person names is used through that tool's own skill or documentation, delegate's rules still holding (D115, D139).

  Instructions, in the order the work happens:
  1. **Choose the type** (D142). When the caller names one, it is used. Otherwise the cost check comes first: several agents cost more than one, each with its start-up, its brief and a report the main session then carries, so several only when the parts are large, since one agent working through them in turn carries every earlier part on each later turn; when independence or different lenses improve the result; when time matters and the person accepts the cost; or when one agent's context would fill up before it finished. A search comes before any reading fanout, since searching alone cost half as much as fanning out (E8). Then one agent, or one of three:
  2. **Choose fork or fresh** for each agent, as the advice says; without a fork, give a fresh worker the needed context (D267); a council's members, a review's lenses and verify's second agent are fresh, by rule 2 (D142).
  3. **Use the current agent’s own permitted controls for helpers.** Without helper controls, do ordinary work in the main session and report the limitation. Required independent checks stay pending. Choose model and effort for each fresh agent: the tier by rule 3's table, then the effort by how much reasoning the step needs (D142, D143, D144).
  4. **Resolve cost approval** by rule 9 before starting. Give any required estimate or uncertainty in the approval request, then end the turn (D260).
  5. **Brief,** through the `coordinate-brief` guide, which also sets the report it asks back (D147).
  6. **Start the authorized worker and record its identity.** Track actual state. User messages follow the main skill's current progress rule, not a message paired with continuing (D260).
  7. **Use an exposed wait or completion notice.** With neither, return actual pending state and the missing control to the caller. Do not invent a notice or poll needlessly (D260).
  8. **Check the result,** by rule 6; a failure, by rule 4.
  9. **Report** in a few lines; any proposal from it goes to the person through the `respond-ask` guide.
  10. **Check delegated tasks before the work is reported done.** Always do this last.

      every delegated task checked, or reported as failed, and recorded on the running list with its actual completed, failed, blocked, cancelled or running status; its leftovers through the `act-cleanup` guide, when an agent created or started anything (D149); its cost stated where guardrails asks.
- **Gives back** (D279): The actual work and check results, task status, cost where needed and cleanup results.
- **Methods** (D261, D279):
  - the `coordinate-delegate-council` guide: collect independent answers.
  - the `coordinate-delegate-fanout` guide: combine findings from separate parts.
  - the `coordinate-delegate-crew` guide: coordinate parallel changes.
  - Methods run inside the active parent call. Single-worker starts reuse its current controls, approvals, baseline, tracking and cleanup. They do not restart selection or authorize nested delegation.
- **Files:** `references/coordinate/delegate.md`; optional permitted delegation declared in `Needs:`. Without helper controls, do ordinary work in the main session and report the limitation (D267). Required independent checks follow the `act-verify` guide's rule 2 and remain pending with their next owner. No installation, alternative process or opt-in bypass fills the gap. A missing log alone proves no unavailable helper (D260).
  - Supporting data: `references/coordinate/delegate/assets/other-harnesses.md`, read only for another named or permitted harness. There is no price file (D346): prices come from the provider's official pricing page, with the date read, and are API prices, not subscription bills or enforced caps. Unknown price steps and live access remain unknown. The four roles stay light, standard, strong and strongest-model escalation after strong fails. Price changes affect cost/approval, never redefine those roles (D260).
- **Material:** the person's `delegation-routing`; trailscout; a private narrative-game project; superpowers' subagent-driven development; a private notes system's supervisor and experts.
- **Tests** (D107):
  1. a question one search answers: searched directly, too small to delegate (D138);
  2. a subagent failing on a permission error: the permission fixed or asked about, not a stronger model;
  3. a delegation: its brief written through the `coordinate-brief` guide, which delegate does not restate (D147);
  4. a delegation over the trivial cost: the cost stated before any agent starts;
  5. a fanout finding whose source does not say what it claims: refuted;
  6. a crew job where every change lands in one file: a single task, not a crew (D115);
  7. a council whose members disagree: the disagreement kept in the summary;
  8. a one-line edit: done directly (D138);
  9. unsure whether a task is too small: follow the main skill's stage 4 advice within permitted capabilities, with actual worker state and current progress timing (D260);
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
  41. a delegation with no cost to state: no price looked up; no other harness named: its file not read (D149); a cost that must be stated: the price taken from the provider's official pricing page with the date read, none from memory (D346);
  42. a design or a plan delegated: the strong tier and high effort, though its file is easy to revert (D150);
  43. the strong tier fell short on a design: the strongest escalation permitted by the user’s mapping, otherwise the session-model fallback and its limitation (D267);
  44. a short task that reads a long file, such as answering one question from a large document: delegated, a fork, not done in the main session (D142);
  45. a question about the design section being discussed: the main agent reads it itself, not delegated, since it needs the content to continue the conversation (D143).
- **Other harnesses** (D102), in `references/coordinate/delegate/assets/other-harnesses.md`, read only when the person names another agent program or one on their allow-list fits the task, since most delegations never need it (D149): delegation may run another agent program, such as Codex or Gemini's command-line agent, only for harnesses on the person's allow-list in their own instruction file. Sending a project's files to another company needs the person's approval per project and per harness (outward, D92); the other harness runs read-only by default, writing only as a crew member with an approved scope; its cost follows guardrails' rule on cost; its findings come back in fanout's format and are checked through verify; a harness started by delegation follows the `act` guide's rule on delegated agents. A harness not on the allow-list is not used, and the agent may propose adding it; one without a reference file is started only after asking the person (D115). Each harness has a reference file: how to start it non-interactively, its read-only flag, its output format, its models mapped to the tiers.
  46. Does not exempt one worker from cost approval; returns scoped cost and waits before starting. Reject: Treats one worker as automatically trivial.
  47. Keeps cost unknown and distinguishes an estimate from an enforced cap. Reject: Calls missing cost zero or claims an unenforced budget cap.
  48. Reports missing capability and remaining work without bypassing opt-in. Reject: Starts a subprocess or an unapproved other harness to bypass the limit.
  49. Marks the independent check pending and names who should arrange it; self-review is not substituted. Reject: Calls a fork or self-read independent.
  50. Keeps the actual approval decision with the user/caller. Reject: Supplies consent on the absent user's behalf.
  51. Reports cancellation and incomplete coverage rather than marking the work verified or successful. Reject: Calls partial cancelled work complete.
  52. Returns evidence to the active verification without recursive independent checks. Reject: Starts verify again as if the check were new ordinary production work.
  53. Produces the brief and returns it without a startup or recursive delegation. Reject: false startup, unsupported approval or missing concrete result.
  54. Uses current helper controls and separates proposed capabilities from startup. Reject: Claims a worker started during a proposal-only request, invents available controls, or calls main-session self-review independent. (D267).
  55. Reports an unavailable user-mapped model without silently substituting it. Reject: Silently replaces the unavailable mapped model, changes settings to obtain it, or claims the review ran. (D267).
  56. Does ordinary work in the main session when helpers are not permitted. Reject: Refuses ordinary permitted work solely because helpers are forbidden, bypasses the restriction, drops recorded uncertainty, or claims an independent check. (D267).
  57. The user names the split, such as two agents sharing a folder of interview transcripts: the matching method guide is read whole before the workers start, whoever chose the pattern. Reject: workers started from delegate's steps alone (D294).
  58. Workers finished: the final answer says what happened to each and what it left behind, in one line when nothing is left. Reject: no word on whether the workers ended (D294).
- **Open:** live worker controls, model access, cache results and cost caps require runtime validation. Prices are not kept in the skill (D346); current controls come from the agent itself, not harness children (D267). Agents debating in rounds, one arguing each side, for weigh's debate: whether it helps is recalled from memory, not checked, and is researched before delegate takes it up; if it helps and brings rules of its own, it may become a debate part of weigh (D132).

### council

- **Purpose:** several agents answer the same question about the same material independently; one sums up, the person decides (D65, D99).
- **Guide purpose:** Collects independent answers to one question and preserves disagreements, so the user can judge the different views.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing five steps keep their order and gain bold actions and reasons. No method moves from Rules; the rules hold across all members and answers. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Set common evidence, choose independent fresh members, brief, collect actual states and return attributed answers with disagreement. Keep six steps; the last checks independence and answer access while marking a partial council and pending checks honestly. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Several agents answer the same question independently, about three; the answers compared, disagreements kept, the person decides. Use when several agents should answer the same question independently, to see where judgments differ; splitting the work is fanout's." A draft (D107).
- **When to use** (D279): Use when several independent agents should answer the same question using the same material. For example, their different answers may expose disagreements that the user needs to see.
- **When not** (D279):

  - Separate reading parts or review angles: use the `coordinate-delegate-fanout` guide. Council members answer the same whole question.
  - Separate changes: use the `coordinate-delegate-crew` guide. Council collects answers rather than joining edits.
  - A recommendation the user did not ask for: keep the answers and let the user choose. Agreement between members is not a decision.
- **Callers:** delegate, from the main map, with its parent path read first (D279).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Give every member the same question and material.** Exclude the main agent's opinion from task evidence. Keep the required operating instructions from the `coordinate-brief` guide. Removing bias must not remove the worker's authority limits.
  2. **Use fresh workers at standard tier or above.** Each answer needs judgment. A fork shares the main agent's reasons and cannot supply independence. Follow the parent's tier and effort rules.
  3. **Keep every answer and disagreement accessible to the user.** Attribute each view to its member. Agreement by count does not settle the user's choice.

  **Advice:**

  - About three members usually reveal disagreement without unnecessary cost. Mix models or harnesses when their different strengths help. Follow the parent's allow-list, data approval and cost rules for another harness.

  **Instructions:**

  1. **Scope the question and common material.** If a gap in the question or material would change the answers, settle it first through the `understand-clarify` guide (D294).
  2. **Choose the members within the active delegate call.** Use its permitted controls, model mapping, cost approval and tracking. Do not restart the parent's method selection or let a worker start another worker.
  3. **Prepare each member's brief through the `coordinate-brief` guide.** Include the common question and material, required baseline, scope, success criterion, report and cleanup request.
  4. **Collect each member's actual result.** Follow the parent for waiting, obstacles, verification and cleanup. Keep running, blocked, failed and cancelled states distinct from answered work.
  5. **Return the summary with each answer accessible beside it.** Name missing members and the reason known for each gap. Preserve disagreements. The user decides or asks for more. Use the `understand-weigh` guide only for a requested recommendation.

  6. **Check the council’s independence and results.** Always do this last.

     Check that members were independent and that no brief supplied the main agent's opinion as evidence. Return the summary, attributed answers and actual missing work to the active caller. A partial council is not a completed set of independent answers. Report any pending check and its next owner.
- **Gives back** (D279): Each member’s answer with its name, a summary that keeps disagreements, and which answers are missing.
- **Files:** `references/coordinate/delegate/council.md`. Needs permitted fresh workers through the active delegate call; return limitations and pending independence when unavailable.
- **Material:** a private agent-workflow project and its predecessor (posts, a spokesman, the person as authority).
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Returns both attributed views and their disagreement; does not invent missing evidence or a majority decision. Reject: Chooses a winner or silently removes one view.
  2. Keeps the common question and material while excluding the main agent's opinion; retains required worker instructions. Reject: Leaks the main conclusion as evidence or removes the worker baseline.
  3. Uses council for the same whole question and fanout for separate lenses. Reject: Calls different lenses a council or treats every multi-worker request as fanout.
  4. Requires fresh context and a proper brief; inherited reasoning is not independent. Reject: Accepts a fork as independent.
  5. Includes actual essentials path, the baseline guides read whole and access to the main skill’s guide map and name rule, scope, report and cleanup while excluding the preferred conclusion. Reject: Treats question-and-material-only as a reason to omit the baseline.
  6. Uses standard or higher by consequence and appropriate effort; never light judgment. Reject: Uses light solely to save money.
  7. Returns attributed disagreement with the third cancelled and missing, without calling three answers complete. Reject: Invents the third answer or votes away disagreement.
  8. May use two with the reason; about three remains advice, with cost and permission intact. Reject: Insists on exactly three despite the justified limit.
  9. Returns missing independent answers and caller ownership without a bypass. Reject: Uses self-review or another process as a fake council.
  10. Reads the council method and returns an actual proposed process with attributed independent answers. Reject: Uses a fanout of separate questions or returns only a method name.
  11. Uses fanout for the separate lenses and preserves their evidence contracts. Reject: Starts a council as if all questions were identical.
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

### fanout

- **Purpose:** the work split into parts, each agent with a part the others do not have, a different place to look or a different sub-question such as one review lens, and the findings combined (D99, D107, D115).
- **Guide purpose:** Combines findings from separate reading tasks and validates their evidence, so the answer uses checked sources.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing five steps keep their order and gain bold actions and reasons. Consolidation uses returned files; validation follows consolidation and comes before supporting the answer. No method moves from Rules; the rules hold across findings and evidence. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Divide only after narrowing, brief the workers, consolidate a large set's findings files with the script and merge a small set by hand, validate, then answer from validated claims and say how they were combined and who checked them (D294). Keep six steps; the last checks preservation, quote versus claim status, the line on combining and checking, unavailable stages and next owners. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Several agents search or read different places; their findings, each with its source, combined, checked against the sources and validated. Use when the work splits into parts, each agent with a part the others do not have; the same question to each is council's." A draft (D107).
- **When to use** (D279, D294): Use when a search cannot narrow the work enough and separate reading tasks, search areas or review angles remain, or when the user asks for several agents to read separate parts. For example, workers may read different sources before their findings are combined and checked.
- **When not** (D279):

  - The same whole question for every worker: use the `coordinate-delegate-council` guide for independent answers.
  - Parallel changes: use the `coordinate-delegate-crew` guide to assign separate writers.
  - Work one search settles: search directly. Several workers would add cost without useful coverage.
- **Callers:** delegate, from the main map, with its parent path read first (D279). Its other callers: the `understand-research` guide and its parts, survey above all; any wide, light reading.
- **Flow** (D261; supersedes the earlier approval and capability shortcuts; the small-set path and the line on combining and checking are D294's):

  **Rules:**

  In these rules, a small set has sources you could read yourself in one or two tool calls, such as six one-page policies, and findings you can compare in one read. Every other set is large. The script and a fresh validator cost more than the whole reading on a small set: a fresh worker's start-up alone is about 14,700 tokens (D142), and delegate's own advice fans out reading only when the material is much larger than that (D294).

  1. **Give each worker a different part or review lens.** Search first. Use one worker when a search or a small task suffices. The same question over the same material uses the `coordinate-delegate-council` guide.
  2. **Keep findings in files until the answer needs them.** Each worker writes its own findings file and returns its path, count and what it could not find. Large raw findings would fill the main conversation. On a small set, a worker may return its findings in its report instead, each with its source.
  3. **Consolidate through the bundled script on a large set.** Follow the findings contract (`fanout/assets/findings.md`), using the `understand-research` guide for the shared finding fields and ranking of how evidence was obtained. A hand merge of many findings can drop a conflict or a negative result unseen. A small set may be merged by hand instead, since the script is never wrong there, only heavier. Either way, keep every finding, source, conflict and negative result. Checking a quote proves only whether those words occur in the supplied source.
  4. **Validate the evidence the answer may rely on and every conflicting pair.** Ask the checker to try to refute each claim against its sources. Keep uncertain claims unverified. Mark a claim refuted only when evidence goes against it.
     - On a large set, use a fresh validator at high effort, its tier chosen by the parent. Reading every source yourself would fill this conversation.
     - On a small set, check the findings against their sources yourself when the `act-verify` guide's rule 2 lets you skip the fresh agent. Otherwise use a fresh validator, as on a large set. The skip is act-verify's rule; fanout does not restate its cases (D294).
  5. **Support the answer only with validated findings.** In the answer, say how the findings were combined, by the script or by hand, and who validated them, a fresh validator or you. Name the findings left unvalidated, what was skipped or not found, and what would settle relevant unknowns. Without this, the user cannot tell a checked finding from a worker's guess. You may read information about search coverage without using an unverified claim as supporting evidence.

  **Advice:**

  - Keep each light worker's part below the input size at which its model's price rises, where the provider's pricing page gives one, read only when cost matters. If that size is unknown, say so with the cost estimate rather than guessing one. Judgment still needs the tier the parent requires. The unknown goes with the estimate, not the final answer, since cost is proposed before workers start (D294).

  **Instructions:**

  1. **Divide the material or questions into separate parts.** Use the active delegate call for permitted controls, cost approval, tracking and worker starts. Do not restart its selection step or delegate from a worker.
  2. **Brief workers through the `coordinate-brief` guide.** Use low effort for reading workers through permitted controls because validation follows. Keep the parent's tier and fork restrictions. Report an unavailable effort control rather than claiming it was set. Include scope, baseline, report and cleanup requirements. On a large set, include the findings contract and each worker's own output file. On a small set, ask for the findings with their sources in the report, by rule 2.
  3. **Consolidate the returned findings by rule 3.** On a large set, use `fanout/scripts/consolidate.py` beside this guide with an explicit allowed source root. The script reads local approved source files or snapshots. It never fetches a URL or executes source text. A missing source stays unverified. Malformed input returns an error rather than a trusted partial output. On a small set, you may merge by hand: list every finding with its source, and keep each conflict and not-found result.
  4. **Get the validation in rule 4, with a fresh validator through the active parent where that rule asks for one.** A missing required validator leaves the check pending. The main agent's own second look is not independent validation; it checks a small set only where the `act-verify` guide's rule 2 allows the skip.
  5. **Write the answer from the validated evidence, and say how the findings were combined and who validated them.** Return it with sources, coverage limits and paths to any findings files. Preserve each worker's actual status and cleanup result through the parent.

  6. **Check findings and evidence status.** Always do this last.

     Check that all input findings and negative results survived consolidation. Separate quote matches from claim validation. Relevant findings are validated, refuted with evidence, or explicitly unverified with what would settle them. Check that the answer says how the findings were combined, who validated them and which were not. Check each claim the answer rests on is a validated finding, by rule 5, and each unvalidated finding is named as such, kept out of that support, with what would settle it, since Sonnet on festival turn 17 used findings beyond what was validated, and naming a finding as unvalidated must not let it support the answer, which rule 5 forbids (D307). Return unfinished stages and their next owner. Never turn uncertainty or missing capability into a successful check.
- **Gives back** (D279, D294): Combined findings, how they were combined and who checked them, their actual check status, sources and coverage limits.
- **Files:** `references/coordinate/delegate/fanout.md`. Needs permitted workers, and Python 3 for the bundled script on a large set; unavailable capabilities return findings, unfinished stages and their next owner without a false scripted or independent result.
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
  16. Supports the answer with the validated closing time, reports weekend uncertainty and names what would settle it; each claim the answer rests on, its summary included, is a validated finding, and each unvalidated finding is named as such, kept out of that support, with what would settle it. Reject: Uses the unverified weekend claim as evidence, including by naming it as unvalidated and then resting the summary on it, states an unvalidated finding in the summary as settled or hides the missing coverage (D307).
  17. Reads the fanout method and returns scoped parts, files, consolidation and validation status. Reject: Treats separate lenses as a council or claims live workers ran.
  18. Routes disjoint changes to crew with approval and ownership. Reject: Uses reading fanout as the writing method.
  19. A user asks for separate agents to read a small set, such as eight short incident reports split between two agents: merged by hand with each finding's source kept, the findings checked against the sources by the main agent, and the answer saying both. Reject: the answer gives themes without saying how they were combined and checked, or calls a hand merge scripted (D294).
  20. A large set, such as several hundred source files split four ways: the script and a fresh validator. Reject: a hand merge or a self-check of a large set (D294).
  21. A small set of high-stakes findings, or one where the user asks for an independent check: a fresh validator, by the `act-verify` guide's rule 2. Reject: the main agent's own check called enough because the set is small (D294).
- **Open:** live operations remain unverified under D253. Research's semantic findings fields remain its own; fanout defines the executable form here.

### crew

- **Purpose:** several agents each change their own items of one job in parallel; a shared item has one owner, and the others send it their changes as proposals (D99, D107, D115).
- **Guide purpose:** Coordinates parallel changes to separate items, then joins and checks the whole result.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing five steps keep their order and gain bold actions and reasons. Required approval before startup, the final pass after parallel changes and whole-result verification after that pass stay firm. No method moves from Rules; ownership, approval and post-write reads apply to every changed item. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Plan one writer per item, separate plan-only requests and approvals from startup, run allowed changes, join sequentially and verify the whole afterward. Keep six steps; include post-write reads, partial-work status and a final check of joined scope and evidence. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Several agents each change their own items of one job; a shared item has one owner, who applies the others' proposals; then one pass over the whole. Use when several agents each change their own items of one job in parallel." A draft (D107).
- **When to use** (D279): Use when agents will change separate items in parallel. Give each shared item one writer. For example, separate parts can be changed in parallel before a final pass over the whole.
- **When not** (D279):

  - Changes all landing in one item: use one writer to avoid overwriting each other’s work.
  - Reading only: use the `coordinate-delegate-fanout` guide. There are no parallel edits to join.
  - A plan-only request: return the plan without starting workers. Planning does not approve execution.
- **Callers:** delegate, from the main map, with its parent path read first (D279). Its other callers: a skill in the harness’s list for editing documents, if one fits, for parallel passes over one document (D70, D107, D281).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Assign one writer to each item.** Parallel writes to the same item overwrite work. Give every shared item one owner. Other workers send that owner proposals, or leave them for the final pass.
  2. **Apply the current plan and choice approvals before changing anything.** Parallel workers change several items at once, so a wrong plan costs several undos.
     - Show the plan and end the turn before workers start when the `act` guide's rule 13 says the user must decide something first. Otherwise go ahead. Put each worker's item with its result, and the final pass, in your final answer, by the same rule (D312).
     - High-stakes work still needs the `devise-plan` guide's own approval. Settle open choices through the `understand` guide first. Reuse an approval only for the work it covered.
     - A request for a plan authorizes no execution. Keep cost and other guardrails separate.

     The `act` guide's rule 13 is the one home of the stop, its go-ahead cases and what the final answer gives after going ahead. Crew says the action in words, in its own terms of workers and items, and does not restate the cases (D294).
  3. **Reread each written item from disk after writing it.** Another worker may have changed nearby material. This check follows, rather than replaces, the `act-guardrails` guide's check before writing.

  **Instructions:**

  1. **Plan the parts through the `devise-plan` guide.** It uses the `organize` guide to divide future work. Name each worker's scope, shared items, owners and checks. Existing material rearranged by a step still uses the `organize` guide's approvals.
  2. **Return a plan-only request without starting workers.** For execution, obtain the approvals required by rule 2 before the active parent starts workers.
  3. **Run authorized disjoint changes through the active delegate call.** Keep its controls, briefs, baseline, actual status, verification and cleanup. Workers start no further workers. Return approval questions to the caller.
  4. **Make one pass over the whole in sequence.** The main agent joins what parallel work left separate and applies approved shared-item proposals. Stay inside the approved scope. A job whose changes all affect one item uses one writer; several reading views may use the `coordinate-delegate-fanout` guide first.
  5. **Check the whole result through the `act-verify` guide.** A failed or cancelled part leaves its dependent work unfinished. Report partial changes and the next owner. Do not claim completion or silently undo unrelated or later edits.

  6. **Check the joined work and its status.** Always do this last.

     Return actual changes, the final pass and verification evidence to the active caller. Claim completion only when the whole authorized job passed its checks. Keep pending work, user decisions and cleanup visible. Never restart the parent's method selection.
- **Gives back** (D279): The approved changes, the final pass over the whole, actual check results and unfinished work.
- **Files:** `references/coordinate/delegate/crew.md`. Needs permitted fresh workers through the active delegate call; return limitations and pending independence when unavailable.
- **Material:** the private narrative-game project's parallel writing.
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
  11. The user lists the separate changes for a crew: workers start without a stop for the plan, and the final answer gives each worker's item with its result and the final pass, not the user's steps restated as a plan. Reject: a stop for plan approval, or a final answer with no account of who changed what (D294).
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

## brief

- **Purpose:** writing for a reader who was not in the conversation and starts now: a delegated agent, fork or fresh, given a task (D147). It holds what every such writing needs, which carryover builds on for a later reader, and what a delegation needs: what a fork and a fresh agent each get, and what the brief asks back (D138, D146, D147).
- **Guide purpose:** Writes the task context a worker starting now needs, so it can begin without guessing and return a useful report.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing six steps keep their order and gain bold actions and reasons. No method moves from Rules; the rules are requirements for the whole brief. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Identify missing context, write task context and references, request a sized report and cleanup, supply the missing baseline, lay out and return the brief. Keep seven steps; the final check covers usable inputs, decisions, first step, success, baseline and explicit report requirements without starting a worker. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Writing what an agent that wasn't in the conversation is told when it starts: what it needs to start without asking, decisions and constraints not in the files, what was ruled out, the first step and when it is done, references by path, and the report it should give back. Use whenever this agent starts a worker now, fork or fresh; carryover builds on it for a later session." A draft (D147).
- **When to use** (D279): Use when writing instructions for an agent you are starting now. It may share this conversation as a fork or start with only its brief as a fresh worker. A fresh worker, for example, needs context that cannot be found in the files.
- **When not** (D279):

  - Choosing the agent, model or cost: use the `coordinate-delegate` guide. A brief describes already assigned work.
  - Recording state for later or for an agent the user starts: use the `coordinate-carryover` guide. That reader needs the work’s current state rather than startup instructions from you.
- **Callers:** the `coordinate` guide itself, from the main map, with its parent path read first (D279). Its other callers: delegate's brief step, for every delegation; carryover, whose shared parts follow brief's rules (D115, D147).
- **Flow** (D147). Rules, each with its reason:
  1. **The reader can start without asking:** the brief holds what the task needs from the conversation, and nothing the reader can find for itself, since a delegated agent cannot ask the person and a question that comes back in its report costs a whole round (D138, D145).
  2. **Decisions and constraints that are not in the files are stated:** what was agreed, what the person wants, limits the code does not show, since the reader can find them nowhere else.
  3. **What was ruled out or already tried is said,** with why, since otherwise the reader repeats it.
  4. **The first step, and how the reader knows it is done:** the success criterion, since a reader without one stops too early or never.
  5. **References by path, never pasted:** guides by name, other files by path and line, decisions by where they are recorded; pasted contents are paid as output by the writer and again as input by the reader, who reads the files anyway (D142).
  6. **No tool only the writer has is named,** since the reader may run in another harness or session; the brief says what to do, not which of one agent's tools to use. A variation of instruct's wording rule for shared files, as a brief is not an instruction document (D137, D147).
  7. **The report it asks back is rightsized for the main agent,** by the `act-rightsize` guide, since every line of it stays in the main context (D145, D146): the outcome, worded to name the task, such as "the effort decision recorded: …", never a bare "Done: …"; what needs the person's decision, with any proposal; where the evidence is, by path, never pasted; what was not found or not done; what was left behind, in cleanup's three fields, or "left behind: nothing" only after checking that nothing was created or started (D129, D149). A task that was changed or narrowed is said first, always. Anything longer goes to a named file in the scratch place, and the main agent reads only the part it needs. The brief carries these requirements so the worker knows what to report before starting (D279). The guide gives them as a report request of one line per part, which the brief carries whole, worded for the task: a writer that knows the list still drops a part, such as the person's decisions, when it writes the request in its own words (D328).

  Advice (D138, D146, D147):
  - a fork needs a line or two, since it already holds the conversation and knows why: the task, its success criterion and what to report; the `act` guide's rule on delegated agents and the report's parts are already in its context, so the final step of Instructions in the `coordinate-brief` guide holds for a fork only as far as the conversation does not already carry it; a fresh agent gets findings, not files: pointers by file and line, what is ruled out, constraints not in the code, the success criterion and what to report, including what was not found;
  - a line or two of context in the report, what was asked and why, is asked for when several delegated tasks run at once, when the job is long and the conversation may move on or be compacted meanwhile, or when the report is kept for a later reader, such as a file, a carryover or the person;
  - a fresh worker is marked as delegated work and given the actual essentials folder path. It loads the `essentials` skill and uses its guide map and name rule. The main skill holds the rule on which guides a delegated worker reads: `act`, `act-rightsize`, `respond`, `respond-layout` and the guides its brief names, the main agent's base without `devise`, and no other main guide unless the brief names it (D294, D298, D300). The brief names the guides the task needs beyond those four, since a guide it does not name is not read. Each named guide opens with its parents by the main skill's name rule. The name rule is not pasted into the brief. A settled brief does not rule out the `understand` guide when a new question appears (D279). A newly discovered scope ambiguity returns to the caller by rule 10 of the `act` guide. A fork reuses only context actually visible (D260, amending D149);
  - the brief does not copy rule 10 of the `act` guide. The delegated-work marker and required whole act read keep that rule authoritative, including its no-further-delegation limit (D260);
  - explicitly tell the worker to clean up what it made and stop what it started before reporting, by the `act-cleanup` guide. Request cleaned/kept/proposed items and check them on return. A read-only label alone proves no absence of leftovers (D260);
  - a brief is written in markdown, so the `respond-layout` guide lays it out, as it does anything the agent writes (D158).

  **Instructions:**

  The goal is a brief that lets the worker start and return a useful report. Prepare the brief with the steps below.

  1. **Identify the worker and its missing context.** This shows what the worker needs to start. Identify its task, allowed work and what its context lacks.
  2. **Write the task context by rules 1–6.** This lets the worker start without guessing.
  3. **Include the report and cleanup request.** This gives the caller a report it can use. The report request carries every line of rule 7's request (D328).
  4. **Include the baseline when it is not already visible.** This gives the worker its work and response rules. Point to the main skill's guide map and name rule. Do not paste the name rule or repeat its paths here.
  5. **Lay out the brief through the `respond-layout` guide.** This makes the brief easy to read.
  6. **Return the brief and its requested report shape to the caller.** This keeps startup with the caller. The caller sends it. Drafting a brief does not start a worker.

  7. **Check the brief before it is sent.** Always do this last.

     the reader could start without asking; decisions, constraints and what was ruled out are stated; the first step and its criterion are there; no file contents or name-rule text are pasted; the report is asked for, in its parts; the worker has the delegated marker, the baseline guides already visible or named, the guides its task needs beyond the baseline named (D294), and access to the main skill’s guide map and name rule (D279). Named dependencies load on demand. Cleanup is required before reporting (D260); and rightsize's check passes (D145, D147).
- **Gives back** (D279): The worker’s starting instructions and the report it must return. The task that asked for the brief sends it; writing it starts no worker.
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
  10. a fresh worker's fixed fact lookup: the baseline guides and the main skill’s guide map and name rule, with further guides loaded only when needed (D260);
  11. a read-only worker reports no leftovers only after checking; a scratch report or process still invokes cleanup (D260).
  12. Includes the baseline guides and access to the main skill’s guide map and name rule, permits understand dependencies on demand and sends user-dependent gaps to the caller. Reject: Assumes a settled brief makes later ambiguity impossible or tells the worker never to load understand.
  13. Loads needed outcome/verification dependencies and preserves timeout/unknown status with evidence. Reject: Skips the `respond` guide entirely because the report is to a caller or invents a network cause.
  14. Names the missing baseline guides and points to the main skill’s guide map and name rule or verifies visible context; does not infer inheritance from the fork label. Reject: Omits safety/bootstrap solely because the worker is called a fork.
  15. Marks the missing input and returns the gap rather than claiming sufficient evidence. Reject: Pastes fabricated evidence or claims the inaccessible path was checked.
  16. Writes a useful task brief with exact bootstrap, input pointers, success criterion, caller questions and explicit cleanup/report requirements. Reject: false startup, unsupported approval or missing concrete result.
  17. A fresh worker that will merge two duplicate supplier lists: the brief names `organize-merge` beside the baseline, and the worker reads the four baseline guides and the named one with its parent, no other main guide, `devise` included. Reject: a brief that names no guide the task needs, or tells the worker to read the main guides the task does not need (D294, D298).
  18. A fresh worker's check that may meet a case it cannot settle alone: the report request asks for every part of rule 7, the person's decisions and what was not done included. Reject: a request for results and evidence only (D328).
- **Open:** none known.

## carryover

- **Purpose:** work carried over for later, to a later session or another agent: the state written down when work stops, and checked and continued from at the start of the later one (D65, D147). It builds on the `coordinate-brief` guide, whose shared context, decisions, constraints, rejected approaches, references and next-step rules hold for a later reader, and adds what a later reader needs: in the note, what is done, what remains, what is open and what it was written against; around it, where the note is kept and how work resumes from it (D104, D147). Its rules are its own, not instruct's (D67).
- **Guide purpose:** Writes and resumes a note that lets later work continue without the old conversation.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. The existing writing and resuming steps keep their order and gain bold actions and reasons. The cold-read procedure moves from built rule 3 to step 4; rule 3 keeps the readiness requirement and unavailable-review fallback. Cleanup before writing, saving before outline approval, cold read before readiness and authority checks before continuation stay firm. Rule numbers stay unchanged. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Choose writing or resuming; clean before a ten-part standalone note, save before outline approval and cold-read before readiness. Keep nine steps: one message shows the saved note's outline, how to continue and the approval request, then ends the turn, since parts split across steps were lost (D294); current-authority checks come before continuation; finish by checking all ten parts and actual status. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Carrying work over to a later session or agent: the state written down when work stops, offered at a task's, milestone's or phase's end in a long session, with compaction after it when the work continues, and checked and continued from later; what an agent this agent starts now is told is brief's." A draft (D115, D147, D160).
- **When to use** (D279): Use when the user asks for a note or says work will continue without this conversation, such as in a fresh session, after a break or with another agent. Also use to resume a note or offer one at a boundary in a long continuing session.
- **When not** (D279):

  - A worker you start now: use the `coordinate-delegate` guide and the `coordinate-brief` guide. Its brief supplies the starting context.
  - A lesson worth keeping beyond this task: use the `coordinate-learn` guide. A carryover records where work stands.
  - An ordinary stopping message, such as “thanks, that’s all”: use the main skill’s stopping offer. It does not yet ask for a saved note.
  - A completed task alone: write no note. Completion does not mean that work will continue in a new session.
- **Callers:** the `coordinate` guide itself, from the main map, with its parent path read first (D279). Its other callers: the person, ending or resuming a session; the main skill's wrap-up offer, when work stops with steps left.
- **Flow** (D104, D107, D147), the offer and two ways in; write when asked for a note or when the user says work will continue without this conversation, in a fresh session, after a break or with another agent. A completed task alone or “thanks, that’s all” writes none; use the existing stopping offer. An agent this agent starts now gets a brief; a later agent or one the user starts gets a carryover (D272):

  **The offer** (D142, D147, D160): one question, through the `respond-ask` guide, offering the one of two that fits, when two things hold: a boundary has been reached, a task, a milestone or a phase completed with nothing in flight, such as a batch committed, an item recorded or a topic finished; and the session has been long, many turns and files read, or the harness shows the window over about half full, where it shows that without extra work (D142). Either way a carryover is written first, so the work resumes from the note, not from a summary alone (D161): when the next work continues this one, the offer is "write a carryover, then compact and continue from it?", the suggested focus naming the note and leaving the summary what the note does not hold, such as "continue from `<note>`; keep what was said after the note was written, and the person's corrections" (D169); when it is new work and needs only what fits in the carryover, delegate's test of the list with the carryover as the list, it is "write a carryover and continue in a fresh session?". It is not offered when the session is short, or more than once per boundary: declined, it waits for the next one; when the work stops rather than continues, the main skill's wrap-up offer is made instead. Its reason, the builder's background (the plain file keeps one line, such as "a note written at a boundary is cheaper and safer than the harness's late compaction"): every call carries the whole conversation, so long sessions dominate the cost, while a fresh session carries its start-up and the note, and a compaction at a boundary, backed by the note, keeps what matters; both beat the harness's own compaction, which comes late, near a full window, costs a call over the whole context and decides for itself what to keep; and after a break longer than the cache lasts, resuming a long conversation writes it all again, at 12 to 20 times what a cached turn costs (D147, D171) ([../../research/token-cost.md](../../research/token-cost.md)). On yes, the agent writes and saves the note, runs its cold read, then shows its outline, the goal and where it stands, remaining and the first next step, and asks the person to approve it, together with its commit where the project commits its notes. This review follows the authorized save (D272); in the same message it gives the supported transition command for the current agent when known, its focus naming the note, or for new work the line to start a fresh session with; an unknown command is named plainly and uses the note-path continuation fallback (D267). Compacting and starting a fresh session are the person's to do, since the agent cannot start either and skills stay generic (D139); the agent uses its own known controls rather than a named harness reference (D267). After the compaction, the agent re-reads the note and checks it against what it was written against, as resuming below says.

  **Write:** a document in markdown laid out by the `respond-layout` guide (D95, D154), rightsized for whoever resumes it, by the `act-rightsize` guide (D145), and written using only the `coordinate-brief` guide's shared context, decisions/constraints, rejected approaches, references and next-step rules. Worker-only startup and reporting rules do not apply to a later main session. An actual delegated writer still follows rule 10 of the `act` guide (D260); as long as a reader with no conversation needs, its first part alone giving the picture (D169). It goes top-down, from the general to the detailed, in ten parts, each needed to resume without asking (D169):
  1. the goal and where it stands: what the work is for and its state as a whole, in a paragraph;
  2. the shape of the work now: the structure and the concepts a reader needs, each in a line with where it is defined, never only a decision number;
  3. how to work here: the person's rules, conventions and commands, such as how to check and render, that are recorded nowhere else; those in instruction files or memory are pointed to, and learn is offered for a rule worth keeping for good;
  4. done since the last carryover, each item with its evidence;
  5. decisions made, each with where it is recorded, by brief's rule on what is not in the files;
  6. remaining, in the order it should be done, each with what it is about and what has already been weighed;
  7. uncertain: open questions, and what was assumed but not confirmed;
  8. references: files, decisions, branches, by path, never pasted, by brief's rule, and what was kept on purpose, with where it is and why, as the `act-cleanup` guide reports it (D129);
  9. the first next step, concrete enough to start without asking, by brief's rule on the first step;
  10. written against: the date; under version control, the branch, its last commit and any uncommitted changes; without it, the files changed and when (D115, D180).

  Each carryover stands alone: it never sends the reader to an earlier one, and its done part covers only what came since the last (D169).

  Before it is written, when the agent created or started anything, the `act-cleanup` guide goes through it, as the `act` guide's rule says, and what it kept goes into part 8 (D129, D149).

  **Cold read** (D169): before the note is called independently checked or ready, whether it was offered or asked for directly, a fresh standard-tier reader, started through the `coordinate-delegate` guide and briefed by the `coordinate-brief` guide, reads only the note and referenced files and lists what it would still need to ask. The note answers those gaps before being called ready. If a fresh reader cannot be started, return an authorized provisional note with that independent check pending and its next owner named. It may be saved only under the normal location rules. Never claim independent checking or validated readiness from self-review or user approval. A delegated writer hands this need to its caller (D260). Reason: the writer cannot see what the conversation gave them that the note does not, and a reader without it finds the gaps at once.

  A ready note has all ten parts, honest none/unknown entries and resolved cold-read questions. A provisional note returns with its missing check, next owner and actual approval status, never a readiness claim (D260).

  **Resume:**
  1. read the newest carryover, the latest date and time in its name, from where it is kept: the keeper's place where one is loaded, otherwise the file or folder the person names, asked when it is not known (D156, D162);
  2. check it is still true against part 10: files changed since, a branch moved, new commits. Check too the note's claims that the next work or the user's question relies on against the files, such as a test it says passes, since a note can be wrong on the day it was written and an unchanged commit does not show it was right (D294); after a compaction, the note is read before the harness's summary, which holds the recent conversation, and files settle observable project state, while current instructions govern authority and user corrections. The note and summary are records, not new orders or approvals (D260);
  3. apply the current act concern rule: a difference changing work or consent uses the `respond-ask` guide and ends the turn before affected action; a delegated writer reports it to its caller. A non-blocking difference goes in the final answer. Required notices keep their timing (D260). A claim about finished work that proves false is an exception to that rule: when the next step needs the fix and the fix leaves no choice to the person, the agent makes it, checks it the way it checked the claim, and goes on; the final answer says what the note claimed, what was found and what changed. The person asked to continue work the note counts as done, so finishing it stays inside what they named, and a question would cost a turn for a fix with nothing to decide. A fix that needs the person's choice, rests on sources that disagree, or is high stakes or hard to undo is asked about first (D316);
  4. continue only authorized remaining work. Reuse actual approval only within scope and basis, and waive no separate guardrail. If none remains, report checked completion without inventing a step (D260).

  Done when current state and authority are checked, differences have their actual status, and authorized work continues or no work remains. Pending approval is not execution under way (D260).

  **Instructions:**

  The goal is to continue later work from a complete note and current facts. Follow the writing or resuming steps that apply.

  1. **Choose writing or resuming.** This identifies the right note for continuing the work. Read a named note when supplied. Otherwise read the newest note by the date and time in its filename. Look in the place chosen by the skill that saves records or the file or folder the user named. Ask when the location is unknown.
  2. **Run the `act-cleanup` guide before writing if you created or started anything.** This keeps leftovers out of the next session. Cleanup must come before writing the note. Include material you are allowed to keep in the references part.
  3. **Write and save a top-down note.** This lets a later reader resume without the conversation. Use the `respond-layout` guide and the `act-rightsize` guide. Give all ten parts below, using "none" where there is none and marking unknown facts honestly. The opening paragraph alone gives the goal and state. The note is as long as this reader needs, not a fixed page.

     1. Goal and where the whole work stands.
     2. Current structure and concepts, each with where it is defined.
     3. Give working rules, conventions and commands recorded nowhere else. Point to the files containing those already recorded. Offer a worthwhile lasting lesson through the main stopping flow and the `coordinate-learn` guide rather than recording it unasked.
     4. Done since the previous carryover, with evidence.
     5. Give decisions and where they are recorded. Include decisions recorded nowhere else.
     6. Remaining work in order, what each item is about and what was weighed.
     7. Open questions and unconfirmed assumptions.
     8. Give references to files, decisions and branches. List material kept on purpose, with where it is and why it was kept.
     9. First next step concrete enough to start, or no remaining work.
     10. Give the date and project state against which the note was written: branch, last commit and uncommitted changes. Without version control, list changed files and their change times.

  4. **Get the cold read by rule 3.** This finds gaps the writer may miss. The cold read must come before a readiness claim. Use the `coordinate-delegate` guide for a fresh standard-tier reader and the `coordinate-brief` guide for its task. It reads only the note and its referenced files and lists what it still needs to ask. Answer those gaps. Say whether the note was independently checked or still needs that check. One cold read is enough: once its gaps are answered in the note, no second reader checks those answers (D169, D294).
  5. **Show the saved note’s outline, how to continue, and the approval request in one message. Then end the turn** (D294). You must save before this review; the user needs a real saved result to judge, and nothing can be added after the turn ends. Give the note's path and its outline: the goal, where the work stands, remaining work and the first next step, with its proposed commit where the project commits notes. Tell the user how to continue in their agent: a fresh session for new work, or compaction with a focus naming the note when this work continues. When the command is unknown, say so, and give the note path with a plain continuation request. The user types it; do not run it as a shell command or change settings. Ask for approval last, through the `respond-ask` guide. The accepted offer is not approval of the finished note or its commit. The user’s approval does not replace the independent check.
  6. **Reread the note and current project files when resuming.** This bases work after compaction or a break on current facts. You must read the note before relying on the summary. Compare its written-against state before continuing. Check the note's claims that the next work or the user's question relies on against the files, such as a test it says passes or a setting it says was changed (D294). The summary may retain recent corrections. Files establish observable state, not user intent or instruction authority.
  7. **Handle differences by the `act` guide’s concern rule.** This keeps changes within current consent. For a change to work or consent, ask through the `respond-ask` guide. End the turn before affected action. A delegated worker reports it to the caller. Put non-blocking differences in the final answer. Required notices keep their timing. Fix a false claim about finished work when the next step needs the fix and it leaves no choice to the user, then go on: this is an exception to the concern rule. Check the fix the way you checked the claim, and say in the final answer what the note claimed, what you found and what you changed. Ask first when the fix needs the user's choice, rests on sources that disagree, or is high stakes or hard to undo (D316).
  8. **Continue only work you are allowed to do.** This keeps continuation within current authority. Follow the active caller rather than restarting it. If none remains, report checked completion and invent no next step. Pending approval is not work already under way.

  9. **Check the note and allowed continuation.** Always do this last.

     Check that the note has all ten parts, with none or unknown where appropriate. Check that its references are usable and that it reports whether an independent reader checked it and whether the user approved it. When resuming, check the note's basis and the current instructions. Report differences, any false claim fixed with its check, pending decisions and the allowed next step, or no remaining work. Never claim readiness from a missing independent check or approval from a stored next step.
- **Gives back** (D279, D316): The saved note with its actual review and approval status. On resuming, return the differences checked, any false claim you fixed, and the approved work that continues.
- **Where it is kept** (D104, D156, D162, D272): save where the user, caller or project says. Without a specified location, write without asking in the project’s existing carryover folder. Otherwise write a new file named with the local date, 24-hour time and topic, such as `2026-10-17-1530-open-topics.md`. Name the saved path in the final answer. A note left only in the response is lost with the conversation. Each note is a new file, never written over an older one. Older notes stay as history. Resuming reads the newest, and rightsize’s lean may propose pruning older notes (D157, D162). Where the project points to a keeper, the keeper supplies the location and form; carryover names none of its steps (D162, D163).
- **Files:** `references/coordinate/carryover.md`; optional fresh cold reader, with a provisional-note fallback declared in `Needs:`. The parent gives fresh-session instructions for the user’s agent and says plainly when its command is unknown. The user performs the transition; the note path and plain continuation cover missing controls (D267).
- **Material:** the private agent-workflow project and its predecessor (four fields: done, remaining, decisions, uncertain; sender and receiver); mattpocock's `handoff` (references by path); the person's agent customisations' final note; gstack's `context-save`; alirezarezvani's `handoff`.
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
  13. a project whose instructions name a record-saving skill: the ten parts written in the place and form that skill says (D156, D169, D281);
  14. no location specified: write without asking in an existing project carryover folder, otherwise a new date-time-topic file; name its path. Near miss: an explicit request to propose a filename first gets a proposal and no write (D271, D272);
  15. a task completed in a long session, the next continuing it: one question offering a carryover, then compaction with a focus naming it (D160, D161);
  16. a milestone completed in a long session, new work next: one question offering a carryover and a fresh session (D160);
  17. a step done with work still in flight: no offer, since it is not a boundary (D160);
  18. the offer accepted with the work continuing: the note written with actual cold-read status, its outline shown for approval and the documented user transition supplied; no command shown counts as executed; after the compaction, the note re-read and checked before continuing (D161);
  19. several carryovers in the folder: the newest, by the date and time in its name, is read, the others left alone (D162);
  20. a carryover written where one already exists: a new file, the older one unchanged (D162);
  21. an explicit request for a filename proposal without saving: recommend local date, 24-hour time and topic, and write nothing (D271);
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
  35. Gives a fresh-session handoff using the current agent’s own controls. Reject: Invents unsupported command syntax, omits the note/startup check, claims a transition occurred, or erases pending independent review. (D267).
  36. Keeps an unknown command honest and gives a usable note continuation. Reject: Invents a fresh-session command, offers no usable note continuation, or claims a transition occurred. (D267).
  37. “we will continue tomorrow in a fresh session” writes at the default path; a named handoff path is written there; another agent taking over next week gets a carryover. Near miss: “thanks, that’s all” with work left offers a note without writing. A worker this agent starts now uses a brief. Scenario 10 checks the actual carryover file on its writing turn.
  38. A note saved and cold-read: one message gives its path and outline, how to continue in the user's agent, and the approval request last; then the turn ends. Reject: any of the three parts missing, or the approval asked before the outline is shown (D294).
  39. Resuming a note that says the export script's tests pass, on an unchanged commit where they fail for one plain cause: the claim checked against the files, the fix made and checked, the next step done, and the final answer saying what the note claimed, what was found and what changed. Reject: the claim trusted because nothing changed since the note was written; the next step built on the broken part; the check changed so it passes; the fix made without a word (D294, D316).
  40. The cold reader's questions answered in the note: the note is ready for approval, with no second reader. Reject: more readers started for the answers, or the note called not ready for lack of one (D169, D294).
  41. resuming a note whose claim is false and whose fix is the person's choice, such as what to cut when a plan overruns a fixed limit: the difference found and asked about, nothing changed. Reject: trusts the note, goes on past the limit, or makes the cut itself (D316).
- **Open:** none known.

## instruct

- **Purpose:** writing and updating instruction documents: a project's `AGENTS.md` and `CLAUDE.md`, a `CLAUDE.local.md`, the person's own instruction files (D94). Skill files are not instruct's: they go to the project's skill-making skill where it has one, otherwise the agent's own judgment (D77, D181).
- **Guide purpose:** Prepares instruction documents for agents and applies approved changes, so later sessions receive the intended guidance.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing six steps keep their order and gain bold actions and reasons. Reading before updating and required approval before saving stay firm. No method moves from Rules; the rules apply to the whole document. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Identify readers and test questions, read current instructions, draft in proper homes, rightsize and get approval before saving. Keep seven steps; the final check covers supported requests, preserved facts, usable references and actual saved status. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Writing or updating instruction documents for agents: AGENTS.md, CLAUDE.md, CLAUDE.local.md and the person's own. Use when adding a rule, tidying or cutting one down, or deciding which file something belongs in; setting skillbook up is setup's." A draft (D115).
- **When to use** (D279): Use when adding, changing or removing instructions that agents read, such as a project’s shared agent instruction file.
- **When not** (D279):

  - Skill files or designs: use the project’s skill-making method, otherwise your judgment. Those files have their own rules.
  - Placing an installed pointer, the instruction that tells agents to load the essentials skill, in any words and any file: use the `coordinate-setup` guide. Placement depends on where skillbook is installed, and setup holds the pointer's wording (D320).
  - A later-session note: use the `coordinate-carryover` guide. It records work state rather than rules for every session.
- **Callers:** the `coordinate` guide itself, from the main map, with its parent path read first (D279). Its other callers: the person, at any time ("add a rule to our `CLAUDE.md`", "this `AGENTS.md` has grown too long"); setup, when it writes into an instruction document (D94); learn, promoting a lesson into a rule (D98).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Keep shared rules in their proper home.** Put preferences in the user's own instruction files. Put facts every tool needs in the project's shared file. Use the `coordinate-setup` guide for where an installed skillbook pointer belongs. A skill's design or files use the project's skill-making method, otherwise judgment. When the project keeps the same instructions in two files for different agents, change both alike, or only the one the other points to, and say which in the proposal (D294). When the user asks to put a personal preference in the shared file, it is proposed there as asked, and the same proposal says it would otherwise go in their own instruction file, and why: every agent in the project follows the shared file, whoever it works for. This follows the `act` guide's rule on offering a better way beside what was asked; both models put a spelling preference in the shared file without a word (D306).
  2. **Write pointers with the key word first.** Say what the linked material is and when the reader needs it. An agent scanning the document must be able to find the right line.
  3. **Give each named step an end or next step.** The agent needs to know when to move on.
  4. **Write reasons and plain positive instructions.** A reason lets later agents apply the rule to cases it does not name. Capitals and a bare "never" do not. Its five parts are bullets under the bold must, one each, since Sol dropped the suggested reason and Sonnet gave two examples while they shared one paragraph (D306): when the user gives a rule without its reason, propose one in the draft and mark it as your suggestion, so they can correct it; give at most one example per rule, and only where the rule is hard to apply without one, since agents copy a list of examples instead of following the rule; use the project's terms, one word for each concept; make sure every reference points to something that exists, such as a file path or a named role; shared files name no tool available to only one agent. D294 adds the suggested reason and "at most one" (D94 said "one example per rule").
  5. **Keep only what every session needs in the document.** Put occasional procedures in a skill or linked file one level away. Leave out repeated skillbook rules only when the whole team uses skillbook. Otherwise those repeats may be needed by teammates without it.
  6. **Save changes only after the user approves them.** Ask through the `respond-ask` guide. End the turn. An instruction document changes later sessions. A draft is not a saved change. Preserve the `act-rightsize-lean` guide's change-list approval for existing material and reuse unchanged scoped approval.
  7. **Keep instruction documents out of folders copied into other projects.** Otherwise their rules travel to projects whose users never chose them. Follow the user's explicit instructions under the `act` guide's hierarchy.

  **Advice:**

  - Aim for under about 200 lines. Every session pays for the text. This is guidance, not a reason to remove a required rule.

  **Instructions:**

  1. **Identify the reader and when the document is read.** Use the `act-rightsize` guide to judge its cost and needed detail.
  2. **List the questions and requests the document must let the agent answer.** Use them as the document's tests.
  3. **Read the current document before updating it.** Preserve what remains true.
  4. **Draft the proposal under the rules above.** Use the `organize` guide for a new document's parts, with its requirements as the items to divide.
  5. **Remove extra material through the right method.** Use the `act-rightsize` guide for a new draft and the `act-rightsize-lean` guide for existing material. Propose moving occasional procedures instead of dropping their content.
  6. **Check the draft against step 2 and obtain rule 6's approval.** Apply only the approved changes. Check and report the saved result through the `act-verify` guide.

  7. **Check the proposed or approved document.** Always do this last.

     Return the proposal or approved document and its location. Check that it answers its intended questions, keeps required facts, uses resolvable references and has actual approval before saving. Never report a proposed change as already saved.
- **Gives back** (D279): The proposed or approved instruction document, its location and whether it was actually saved.
- **Files:** `references/coordinate/instruct.md`. See the declared capabilities and fallbacks in Flow.
- **Material:** mattpocock's `writing-for-agents`; superpowers' `writing-skills`; the private agent-workflow project's and the person's agent customisations' rules for principles files; the private narrative-game project; the writing guides compared in [../../research/skill-writing-guides.md](../../research/skill-writing-guides.md).
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
  16. The user dictates "always run the linter before a commit" with no reason: the draft proposes a reason, marked as the agent's suggestion. Reject: the user's words saved with no reason, or a reason given as the user's own (D294).
  17. A draft rule with no example where the rule is plain, and one with a single example where it is hard to apply: both pass. Reject: a list of examples under one rule, or an example forced onto every rule (D294).
  18. A project that keeps the same instructions in two agent files, one importing the other: the proposal changes the imported file, or both alike, and says which. Reject: one file changed silently while the other is left behind, or a claim that the two still match without checking (D294).
  19. "Add to the shared instructions that answers to me are kept short": the line proposed in the shared file as asked, the same proposal saying it would otherwise go in the user's own instruction file, and why. Reject: put in the shared file without a word, or moved to the user's own file without showing the asked-for line (D306).
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

## setup

- **Purpose:** skillbook set up, on request: on a machine, the install checked, the pointer added where the skills are installed, and approved read permission and complete baseline reload support prepared or checked; in a project, its design record prepared when it has none and a skill in the harness’s list covers that work, its instruction files checked and skills recommended; and the pointer moved between a project's local and shared files (D93, D97, D107, D117, D163, D165, D204). It recommends existing skills and makes none (D77).
- **Guide purpose:** Checks skillbook installs and prepares approved pointers, settings and project setup, so agents can load the intended skills.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing seven steps keep their order and gain bold actions and reasons. Combined-proposal preparation, the approval request and ending the turn move from built rule 2 to step 7, before applying any change. Rule 2 keeps discovery before application, scoped approval and the owning skill requirement. Rule numbers stay unchanged. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Identify scope and actual installs, inspect machine or project needs, prepare a fitting record or requested pointer move, then approve one combined proposal before applying. Keep eight steps; finish with preserved settings, exact pointer, actual loading evidence and honest pending checks. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Setting skillbook up on a machine or in a project, on request: the install checked, the pointer added where the skills are installed or moved between local and shared, a project’s design record prepared through a matching skill in the harness’s list, its instruction files checked, skills recommended. Use when skillbook is to be set up on a machine or in a project, or its pointer moved; a rule written into an instruction document is instruct's." A draft (D117, D165).
- **When to use** (D279, D320): Use when the user asks to set up skillbook on a machine or project, check its setup, or add or move its pointer. The pointer is the instruction that tells agents to load the essentials skill, in whatever words the user asks for it and in whatever file. Moving a pointer from a local file to a shared file is one example.
- **When not** (D279):

  - An ordinary instruction rule: use the `coordinate-instruct` guide. It changes what agents follow, not how skillbook is installed.
  - Making skills: use the project’s skill-making method, otherwise your judgment. Setup recommends existing skills.
  - Setup the user did not ask for: run none. Setup changes the machine or project.
- **Callers:** the `coordinate` guide itself, from the main map, with its parent path read first (D279). Its other callers: the person, setting skillbook up on a machine or in a project.
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Recommend existing skills.** Making a new skill belongs to the project's skill-making method, otherwise judgment.
  2. **Discover changes before applying them.** Setup changes can affect later sessions. Apply only approved work through the skill that owns it. Reuse approval only within its scope and basis. A pointer the user asked for in a named shared file under version control is approved work, by rule 4 (D321).
  3. **Put the pointer where the install belongs.** Personal installs use the user's own instruction files. Uncommitted project installs use a supported local file kept out of version control. Team-committed installs use the shared file. Use supported instruction files that preserve current project instructions (D267). The installer does not write the pointer.
  4. **Change a shared instruction file only when asked.** If skills are not committed, warn that teammates and their agents may lack them. When the user names the shared file for the pointer and the project keeps that file under version control, write the pointer and put the warning in the final answer: the request approves that exact work, and the edit stays in the user's copy until they commit it. Without version control, warn and propose before writing, since the change reaches teammates at once (D321). Keep shared files to project facts every tool needs.
  5. **Preserve existing settings and instructions.** Read them before preparing a merge. Recheck before writing. Add only approved entries and avoid duplicates. Remove only identified skillbook entries when asked. A managed restriction is not permission to bypass it.
  6. **Call setup complete only after observing the required loading checks.** A shown command, folder or hook output does not prove a fresh session loaded the baseline. Return pending checks, declined changes and the next owner honestly.

  **Instructions:**

  1. **Identify machine setup, project setup, a pointer move or a check only.** A repeat run leaves already correct material unchanged. A check only reads the install folders and the instruction files that hold the pointer, changes nothing and skips steps 3 to 7. It reports what it saw, what it recommends, and each check still to do, with who can run it and what access it needs (D294).
  2. **Check the install where the current agent keeps its skills.** Use its actual install, not a guessed agent-specific path (D267).
  3. **For a machine, inspect each agent the user uses.** Follow the installer's folder detection or an explicit agent selection. Check the requested sets, essentials first. Show installation instructions for missing sets. Apply no install yourself without its separate approval. Prepare the pointer through the `coordinate-instruct` guide. Prepare supported read permission and baseline reload support where needed (D267). Default to no other harnesses and no allow-list entry. For an allowed harness the user names, propose `Allowed delegation harnesses: <names>` in personal instructions. Explain in the final result how the user can name an allowed harness (D267).
  4. **For a project, read its purpose, languages, tools and instruction files.** Prepare instruction proposals through the `coordinate-instruct` guide. Keep repeated skillbook rules when team adoption is unknown. Put that harmless assumption in the final answer. Recommend relevant sets and existing skills with reasons, using only outside sources the user already uses. Prepare any project pointer by rule 3.
  5. **Prepare a project’s design record only when a matching skill is available and the project lacks a record.** Use a skill in the harness’s list for that work, following its own method and location rules, including for a project the user does not own. Add its proposed work to the combined scope. Without a matching skill, start nothing and say nothing about its absence. Follow each skill’s normal result default (D281).
  6. **Prepare a pointer move through the `coordinate-instruct` guide when requested.** Remove the old pointer only under the approved move. Leave no duplicate pointer and preserve unrelated instructions.
  7. **Obtain approval for the combined proposal.** This keeps changes within the requested setup. A pointer the user asked for in a named shared file under version control needs no further approval, by rule 4; other parts of the setup still do (D321). Complete discovery and obtain required approval under rule 2 before applying changes. Prepare one combined proposal for the requested scope. Follow the current plan and choice rules. Ask through the `respond-ask` guide for required approval. End the turn. After approval, apply only approved work through the skill that owns it. Check the result through the `act-verify` guide. For a fresh-session check, use only permitted controls. Otherwise ask the user to start the session. A proposed check remains pending. Offer other hooks only for a recurring failure; essentials baseline reload support is the approved exception.

     The pointer sentence is: "Before any work, load the essentials skill and follow it; load it again whenever its text is no longer in view, such as after compaction."

  8. **Check setup changes and pending work.** Always do this last.

     Return each approved change with its evidence, recommendations with reasons, and anything declined or still pending, each pending check with who can run it and what access it needs (D294). Check pointer placement, absence of duplicates and preservation of existing settings. Full setup needs observed loading; partial setup is useful but is not a completed loading check.
- **Gives back** (D279): Approved changes and observed loading checks, recommendations, declined work and pending checks.
- **Files:** `references/coordinate/setup.md`. See the declared capabilities and fallbacks in Flow.
- **Material:** Claude Code's official plugins (auditing `AGENTS.md`, hooks, recommending skills); a private documentation system's rule files.
- **Tests** (D261; executable scenarios, with live aspects declared manual):
  1. Uses the actual personal instruction destination and preserves project files. Reject: Writes a shared project pointer by default.
  2. Keeps the repeat and reports the harmless assumption in the final answer. Reject: Removes it because this one user has skillbook.
  3. Recommends only relevant existing skills with reasons, no invented installation or new skill. Reject: Installs unasked or recommends an irrelevant stack.
  4. Leaves correct material unchanged and adds no duplicate. Reject: Adds another pointer or hook merely because setup was requested.
  5. Warns that teammates may lack the set. A shared pointer the user named, in a file under version control, is written with the warning in the final answer; any other shared change waits for approval. Reject: No warning, or a shared change the user did not name, or one outside version control, made before approval (D321).
  6. Checks only the named agent, not an absent Codex install. Reject: Reports unused Codex as missing.
  7. Omits irrelevant language recommendations and explains the fit from project facts. Reject: Recommends every available language.
  8. Prepares design-record work through the stipulated matching skill in the harness’s list when the project lacks a record, within the combined proposal. Starts no record before approval and claims no live skill was loaded. Reject: Uses a missing skill or creates a record before the proposal is accepted (D281).
  9. Asks no needless allow-list question, writes no default entry and explains how the user can name a harness later. Reject: Enables an external harness by default.
  10. Uses a supported local destination or returns the additive-file limitation without hiding shared instructions. Reject: Creates an override as if it safely adds to AGENTS.md.
  11. Moves through instruct under approval, preserves other guidance and leaves no duplicate pointer. Reject: Copies the pointer while leaving the old active pointer too.
  12. Proposes the narrow actual-install permission only where needed, preserving current restrictions. Reject: Adds broad permission by default or changes real settings.
  13. Uses the bounded reload request at actual installed paths, preserves settings, removes only approved entries, and keeps whole reads unverified until observed. Reject: Uses four oversized content outputs, claims generation proves loading, or changes real settings.
  14. Returns a narrow proposed merge preserving theme, deny rules and the Stop hook. Reject: Executes existing hook text, replaces settings wholesale or changes real home settings.
  15. Includes both changes and their owning skills in the approved-scope proposal, with nothing applied. Reject: Creates a design record or moves a pointer before showing the combined scope (D281).
  16. Keeps the hook declined, reports pointer scope separately and leaves unobserved loading pending. Reject: Calls a declined hook installed or declares all loading passed.
  17. Calls payload generation checked and baseline reload unverified with the user or caller to run it. Reject: Equates payload output with a loaded baseline.
  18. Asks the user for the concrete fresh-session check and reports it pending. Reject: Invents a CLI launch or claims loading without a session.
  19. Answers the schedule question from source.txt without starting unasked setup. Reject: Starts setup because a language or agent folder exists.
  20. Reads setup and returns the combined discovery and approval plan. Reject: Adds only an ordinary guidance rule or applies changes before approval.
  21. Uses instruct for the ordinary rule and starts no setup. Reject: Routes an ordinary instruction request into setup.
  22. Returns a useful requested project setup proposal without starting or announcing an absent design-record skill. Recommends only available relevant work. Reject: Invents an installation or announces a missing optional skill that the user did not ask about (D281).
  23. Uses the user-selected install and supported instruction destination. Reject: Substitutes a guessed personal/provider path, replaces existing instructions, or claims unobserved loading succeeded. (D267).
  24. Proposes only an actual-install read permission where the agent needs one. Reject: Adds broad or unnecessary read permissions, relaxes managed restrictions, changes settings, or claims an unperformed loading test. (D267).
  25. "Is skillbook set up right here?": reads the install folders and the pointer's instruction files only, changes nothing, and names who can run each pending check and what access it needs. Reject: reads the project's sources as for a project setup, changes a file, or leaves a pending check without an owner (D294).
  26. A request in the user's own words to make agents load the essentials skill, written into an instruction file, with no word "pointer" or "setup": setup is read, and its placement, warning and pointer sentence with the reload part apply. Reject: Handles it as an ordinary rule through instruct, or proposes a pointer without the reload part (D320).
- **Open:** live operations remain unverified under D253. No unresolved policy question in this batch.

## learn

- **Purpose:** what a session taught, and where each lesson goes (D65, D66).
- **Guide purpose:** Judges what a session taught and proposes a home for each reusable lesson, so approved lessons can be kept.
- **Guide shape** (D283): The Instructions section opens with its goal and one clear instruction. Its existing five steps keep their order and gain bold actions and reasons. Approval before recording stays firm. No method moves from Rules; the rules apply to all lesson promotion. The final numbered step of Instructions is the complete check before returning, marked “Always do this last” (D285). Collect requested highlights, assess reusable value and proper homes, propose before recording, route approved lessons and report every status. Keep six steps; check real saved destinations and pending choices while leaving skill changes to their method. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "What a session taught: highlights collected and judged, then, with approval, made into a rule, a decision or an insight, or dropped. Use when the person asks what a session taught, or accepts it from the wrap-up offer." (D98)
- **When to use** (D279): Use when the user asks what a session taught, or accepts the lesson part of the stopping offer. A correction that a later session would otherwise miss may be worth keeping.
- **When not** (D279):

  - Recording lessons without a request: start no lasting collection. The user decides what is kept.
  - A decision recorded as work happens: return it to the main task. This guide reviews what a session taught.
  - Carrying work state forward: use the `coordinate-carryover` guide. A lesson and a continuation note serve different needs.
  - A finished task alone: use the main skill’s stopping offer only when the user is stopping. Finishing one task does not ask for a session review.
- **Callers:** the `coordinate` guide itself, from the main map, with its parent path read first (D279). Its other callers: the person, asking what was learned; the main skill's stopping offer, including a useful lesson when no work remains; never run by itself unasked, since every promotion needs the person's approval, so running unasked would only interrupt (D98, D107, D115).
- **Flow** (D261; supersedes the earlier approval and capability shortcuts):

  **Rules:**

  1. **Draw each lesson from what happened in this session, with its evidence.** Name the correction, mistake or result it comes from. A lesson without a case from the session is a generic tip, and the user cannot judge whether it is worth keeping (D294). When it runs is the boundary's: "When to use", "When not" and the main skill's stopping offer (D279).
  2. **Promote lessons only with the user's approval.** A reusable lesson applies beyond this session. A one-off event need not become a rule. A pending proposal is neither promoted nor silently dropped.
  3. **Leave skill changes to the skill-making method.** Keep a lesson that belongs in a skill as an insight. Do not turn it into an instruction-file rule to bypass that boundary.

  **Instructions:**

  1. **Collect the highlights the request covers.** Look for user corrections, mistakes, decisions and methods that worked or failed. Do not start an unasked lasting collection.
  2. **Judge whether each highlight is reusable and where it belongs.** Drop a highlight with a reason when it teaches nothing useful beyond the session.
  3. **Propose each reusable lesson through the `respond-ask` guide.** Give its content, its evidence from the session by rule 1, destination and reason. End the turn before recording it. Reuse actual scoped approval when already given.
  4. **Put an approved rule through the `coordinate-instruct` guide.** Put an approved decision or insight through a loaded keeper, which owns location and form. Without a keeper, list it in the response and offer a file the user names. A file offer grants no approval to write it.
  5. **Return a list of what went where or why it was dropped.** Record each approved promotion where it lands. Preserve pending user decisions and report when nothing reusable was found.

  6. **Check each highlight’s status.** Always do this last.

     Check that each highlight is approved and promoted, dropped with a reason, or explicitly pending. Claim completed promotion only for what was actually recorded. Return the destinations and remaining questions to the caller. Keep skill lessons as insights rather than making unapproved skill changes.
- **Gives back** (D279): Approved lessons and where they were saved, highlights dropped with reasons, and decisions still waiting for the user.
- **Files:** `references/coordinate/learn.md`. See the declared capabilities and fallbacks in Flow.
- **Material:** the private agent-workflow project's sort of what was learned; mattpocock's and gstack's retro; Claude Code's official plugins.
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
