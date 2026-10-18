---
name: essentials
description: "Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills."
---

# essentials

The rules every request follows, and the route to the skill for each step of the work.

## Rules

- **Every skill the request needs is used,** together or in turn; a skill limits this only where it says why.
- **The wrap-up offer:** when work stops with steps left, such as "let's stop here", one question, put through `respond-ask`, offers to record what the session taught, then where the work stands for a later session, since both are lost when the session ends unrecorded. With nothing unfinished, where the work stands is not offered, and what the session taught is offered only when it taught something worth keeping.
- Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, say so plainly and go on with your own judgment.
- **How the name rule is used:** a call names the skill and nothing more, since this skill is already loaded and its folder is known. For `act-rightsize-lean`, read `references/act.md`, then `references/act/rightsize.md`, then `references/act/rightsize/lean.md`, since a group's file holds the rules shared by everything under it; each file whole, since a file reached through another may otherwise be read only in part; and a file that still cannot be read said plainly, since an answer made without the skill it needed looks complete and is not.

## Advice

- **Delegation by default,** strong advice, followed unless the case gives a reason not to, the departure said: every task goes to an agent, so the main session keeps the conversation and the person's decisions. The main agent does a task itself only when it is too small (short, the change or answer already known, and leaving little behind), when it needs the person's decisions as it goes, or when it needs the content to continue the conversation. When unsure, fork, an agent that starts from this conversation, and say so in one line, without asking.

## Instructions

Load `understand`, `act` and `respond` together, in one turn, at the start of every conversation, and again only when their text is no longer in view, such as after compaction; each opens its own skills when their step comes. Then, in the order the work happens:

1. **Understand the request,** leaving no gap, through `understand`, whose own file picks what the request needs, a clear request needing only that check; not for "what do you think?" (`act`'s rule) or the person not following the agent (`respond`); it gives back what was decided, what was parked and what comes next.
2. **Throughout, `act`'s rules:** how the agent works, for every request, its own file naming the tools it loads when a step needs them; not for what is said to the person (`respond`) or the person's own work (the next step); it gives back nothing of its own, its rules shaping every action.
3. **What it will be, and its steps,** when needed, through `devise`: a design, or a plan for multipart work; not for a view asked for ("what do you think?", `act`'s rule); it gives back the design or the plan.
4. **Arrange things,** when needed, through `organize`: dividing, joining, grouping or indexing, planning a whole's parts, or checking parts for overlaps and gaps; not for changing what the items say, nor the steps of the work (`devise`); it gives back the arrangement.
5. **Share the work with other agents and later sessions,** through `coordinate`: a task handed to an agent, by default any task that is not too small, as the advice above says, its result coming back into this conversation; work carried over to a later session; an instruction document every session reads; skillbook set up; or what a session taught; it gives back the agent's report, the carryover or the change made.
6. **Do it,** always under `act`'s rules and these steps, using whichever skills fit: another set's main skill where one in your skill list holds that kind of work, loaded and then the skill used by its name rule, not by a path guessed without loading it, since that set's main skill holds rules its skills rely on; otherwise your own judgment. `act`'s rule on a file's type names each type's skill. A request no skill covers, such as "rename these photos by the date they were taken", is done the same way.
7. **Respond, always,** through `respond`: everything said to the person, in every response, how it is prepared and laid out, how questions are put, and what did not land explained again; it gives back nothing of its own, shaping every response.

## The last instruction

Nothing is returned before `respond`'s check has run on it.
