# Essentials

<p align="center">
  <img alt="An orange robot at a workbench fits gears into a small machine, with an open skillbook on a stand beside it"
    src="../../assets/skillbook-essentials-robot.webp" width="600">
</p>

Essentials is skillbook’s base skill. It guides how an AI agent does any piece of work, whatever the project: understand what you want, act with care, and tell you plainly what it did. You can install it on its own. Other sets may build on it; essentials names no other set.

To install it, run one of these lines, then paste the setup line it prints into a new session of your agent:

```sh
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh                   # the latest release
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --preview   # the newest preview
```

[Installing skillbook](../install.md) covers checking, updating, previews and removing it.

Essentials uses the current agent’s own controls. Missing controls use the skill’s text or main-session fallback; required independent checks remain pending.

## Its goal

An agent without guidance often guesses what you meant, does more or less than you asked, takes risky steps without asking, claims work is done without checking, and reports in long text that hides the point. Essentials gives the agent rules and methods that stop these habits:

- **Understand first:** the agent asks when two likely readings would lead to different results. It makes the small choices itself and says what it went with.
- **Act with care:** the agent does what was asked, no more and no less. Before anything risky or hard to undo, it shows what it will do and waits for your answer.
- **Check before claiming:** "done", "fixed" or "passing" needs fresh evidence, not a guess.
- **Answer plainly:** the agent leads with the point and keeps its answer short and complete.

## How it works

- **Essentials is the skill in the agent’s skill list.** The files inside it are guides, rather than separate skills to look for in that list.
- **One file is read on every request:** the essentials skill itself, about 34,000 characters. It holds the rules for every request and the steps for understanding, deciding, arranging, handing out work, acting and answering. The key rules of what were the `understand`, `devise`, `coordinate`, `act` and `respond` guides are now its steps. An agent started by another agent follows the same rules and the guides its brief names.
- **Other guides are read when an instruction calls for them.** Each step names its guides, with a link, and says when to read them: for example `understand-clarify` when a choice or unknown would change the result, or `act-rightsize` before reworking material that already exists. A guide's own file gives its full boundary and the result it returns.
- **Guides are read whole before the work that needs them.** The agent reads the chosen guides and their parents together, and reuses their text while it remains in view. If the text drops out, it reads them again.

The essentials skill gives this exact name rule:

Names: a guide named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Before it, read each guide above it on its path that has a file, top-down, if you have not read it yet: `act-rightsize-lean` needs `act-rightsize` first, and each `organize-` guide needs `organize` first. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, go on with your own judgment, and name the file in your final answer.

For example, `act-rightsize-lean` needs `act-rightsize` first. A parent holds rules shared by the guides under it, so a guide read without its parent misses them.

The work moves through six stages: understand the request, decide how to do it, arrange its parts, hand work to other agents or later sessions, act, and answer. The agent picks the guides its steps name before its first action, then fits those stages into its own controls, such as a plan mode or task list. Its approach belongs in the devise stage; a plan for several steps stays in use across turns.

Other skills in the agent’s skill list and its tools do the work itself, such as writing code or a document. Essentials does not need to know their names or methods. When nothing covers the work, the agent uses its own judgment under essentials’ rules.

## The guides

Each line says in brief what a guide does. The top-level entries are the six stages; all except `organize` are steps of the essentials skill itself, and their entries list the guides under them. The [instructions](../../skills/essentials/SKILL.md#instructions) name each guide with a link.

- **understand:** understanding before acting, with the user and from sources. Further guides help with open choices, facts and decisions.
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
- **devise:** chooses how to do the work, with a design when its shape is open and a plan when it has several steps.
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
  - **brief:** writes what a worker this agent starts now needs to know, and the report it must return.
  - **carryover:** writes a note when work will continue without this conversation, using the specified or default path, and resumes from it.
  - **instruct:** proposes instruction documents for agents, such as `AGENTS.md`.
  - **setup:** checks skillbook's install and prepares its pointers and settings.
  - **learn:** finds what a session taught and proposes where each lasting lesson should be kept.
- **act:** how the agent acts, and the guides a step needs.
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

## Status

Essentials is built. Its tests are being run and its routing is being checked; see the [roadmap](../../blueprint/roadmap.md) for where it stands.
