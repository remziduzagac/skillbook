# Essentials

<p align="center">
  <img alt="An orange robot at a workbench fits gears into a small machine, with an open skillbook on a stand beside it"
    src="../../assets/skillbook-essentials-robot.webp" width="600">
</p>

Essentials is skillbook's base set. It holds how an AI agent does any piece of work, whatever the project: understand what you want, act with care, and tell you plainly what it did. The other sets build on it.

Essentials uses the current agent’s own controls. Missing controls use the skill’s text or main-session fallback; required independent checks remain pending.

## Its goal

An agent without guidance often guesses what you meant, does more or less than you asked, takes risky steps without asking, claims work is done without checking, and reports in long text that hides the point. Essentials gives the agent rules and methods that stop these habits:

- **Understand first:** the agent asks when two likely readings would lead to different results. It makes the small choices itself and says what it went with.
- **Act with care:** the agent does what was asked, no more and no less. Before anything risky or hard to undo, it shows what it will do and waits for your answer.
- **Check before claiming:** "done", "fixed" or "passing" needs fresh evidence, not a guess.
- **Answer plainly:** the agent leads with the point and keeps its answer short and complete.

## How it works

- **One main skill is always loaded.** The `essentials` skill holds the rules every request follows and the route to the skill for each step of the work.
- **Three start files are read at the start of each conversation:** `understand`, `act` and `respond`. They hold the rules for understanding a request, acting on it and answering.
- **Every other skill loads only when a step needs it.** A skill named `a-b-c` is the file `references/a/b/c.md`. A group's file holds the rules shared by everything under it, so the agent reads down the path: `act`, then `act-rightsize`, then `act-rightsize-lean`.
- **Keeping it light matters.** Only what the current step needs is in the agent's context, so the set can grow without slowing every turn.

The main skill's steps follow the order of the work: understand the request, follow the `act` skill's rules throughout, decide what the work will be and how it gets done, arrange its parts, share it with other agents or later sessions, do it, and answer.

## The skills

Each line says in brief what the skill does. The skill files themselves are in [skills/essentials/](../../skills/essentials/SKILL.md).

- **understand:** understanding before acting, with the user and from sources. It routes to the skill needed.
  - **clarify:** finds what the user means before acting, and decides what to ask and how deep to go.
    - **shallow:** asks the smallest round of questions that sets the direction.
    - **deep:** questions a plan level by level until everything that changes the work is settled.
    - **questionnaire:** writes questions only someone else can answer, as a document they can fill in.
  - **frame:** states one problem: its goal, scope, constraints and what a good answer looks like.
  - **discuss:** works through a topic with the user, one item at a time.
  - **brainstorm:** generates distinct options for one question.
  - **weigh:** compares named options on the same terms and recommends one.
  - **challenge:** attacks an idea, plan or decision before anyone relies on it.
  - **argue:** makes the strongest honest case for one side, labelled as one-sided.
  - **naming:** proposes shared names and glossary entries.
  - **research:** answers questions from sources, with each finding traceable to where it came from.
    - **fact:** answers one sourced question, or gives a verdict on one claim.
    - **survey:** finds existing options, such as tools or libraries, and compares them.
    - **analyze:** investigates why something happens and finds the evidence for its cause.
- **act:** how the agent acts on every request, and the tools a step loads when it needs them.
  - **stakes:** judges how much care an action needs: low, medium or high.
  - **guardrails:** what a risky action needs: a proposal with its exact scope, your approval, and a check afterwards.
  - **verify:** checks a claim that work is done or correct, with evidence that would fail if the claim were false.
  - **rightsize:** makes anything the agent gives back hold nothing missing and nothing extra for its reader.
    - **lean:** removes extra parts from existing material.
    - **enrich:** adds missing parts to existing material, each from a checked source.
  - **cleanup:** removes what the agent created or started for a task and no longer needs.
- **respond:** how the agent prepares every answer: what goes in, how it is put together, and how it is worded.
  - **ask:** how the agent asks you anything, and how it takes your answers.
  - **layout:** how to lay out anything the agent writes in markdown.
  - **explain:** clears up something the agent said that did not land.
- **devise:** chooses how to decide what the work will be or how its steps run.
  - **design:** decides what something will be before it is made, with reasons its builder can use.
    - **review:** checks whether a design holds together, covers its requirements and can be built.
  - **plan:** makes and follows plans for work in several parts, with approval and progress kept visible.
- **organize:** rearranges items, such as sections, files or modules, without changing what they mean.
  - **split:** divides one whole into parts, or sorts loose items into groups.
  - **merge:** combines duplicate versions of the same thing into one.
  - **compose:** adds a parent that states what selected items share.
  - **normalize:** moves a repeated part into one shared place that the others point to.
  - **cluster:** builds a view, such as an index or a map, that helps readers find items.
- **coordinate:** work shared with other agents now, or carried over to later sessions.
  - **delegate:** chooses and manages other agents for a task, while decisions and checks stay with the caller.
    - **council:** collects independent answers to one question and keeps where they disagree.
    - **fanout:** splits a large reading job between agents, then checks and combines their findings.
    - **crew:** has agents change separate items in parallel, then joins and checks the whole result.
  - **brief:** writes what an agent starting now needs to know, and the report it must return.
  - **carryover:** writes a note that lets later work go on without the old conversation, and resumes from it.
  - **instruct:** proposes instruction documents for agents, such as `AGENTS.md`.
  - **setup:** checks skillbook's install and prepares its pointers and settings.
  - **learn:** finds what a session taught and proposes where each lasting lesson should be kept.

## Status

Essentials is built. Its tests are being run and its routing is being checked; see the [roadmap](../../blueprint/roadmap.md) for where it stands.
