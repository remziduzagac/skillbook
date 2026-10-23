---
name: essentials
description: "Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills."
---

# essentials

The rules every request follows, and the route to the skill for each step of the work.

## Rules

- **Use every skill the request needs,** together or one after another. A skill limits this only where it says why.
- **The wrap-up offer:** when the user says they are stopping, such as "let's stop here" or "that's it for today", ask one question through `respond-ask` that offers to record what the session taught and where the work stands, because both are lost when the session ends without a record. A finished task is not stopping.
  - Offer where the work stands only if steps are left.
  - Offer what the session taught only if a later session would otherwise get it wrong or have to find it again, such as a correction from the user, a fact about the project that was hard to find, or a way of working the user asked for.
- Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, say so plainly and go on with your own judgment.
- **How to use the name rule:** a call names the skill and nothing more, because this skill is loaded and its folder known. For `act-rightsize-lean`, read `references/act.md`, then `references/act/rightsize.md`, then `references/act/rightsize/lean.md`, because a group's file holds the rules shared by everything under it. Never let a search stand in for this, because a search finds matching lines and misses the rest of the skill, and an answer made without the skill it needed looks complete and is not. Read the skills a route names for the same step together, in one turn, because each read is a turn that carries the whole context again.

## Advice

- **Delegate by default,** as strong advice: follow it unless the case gives a reason not to, and say when you depart from it. Give every task to an agent, so the main session keeps the conversation and the user's decisions. Do a task yourself only when:
  - it is too small: you know the change or the answer, it takes about three tool calls or fewer, and what it reads or prints is short, such as renaming a heading you have seen or reading one setting, not summarising a folder of reports, since a brief and a report would cost more;
  - the user must decide things as it goes, not only at the start;
  - the conversation needs its content itself, not a report of a few lines, such as a file the user wants to go through with you line by line.
  - When unsure: fork (start an agent from this conversation), and say so in one line, without asking.

## Instructions

Read `references/understand.md`, `references/act.md` and `references/respond.md` together, in one turn, at the start of every conversation, and again only when their text is no longer in view, such as after compaction. Each opens its own skills when their step comes. Then, in the order the work happens:

1. **Understand the request** with the `understand` skill, leaving no gap. A choice or an unknown that would change the result goes to `understand-clarify`.
   - Not for: "what do you think?" (the `act` skill's rule), or the user not following you (the `respond` skill).
   - Gives back: what was decided, what was parked and what comes next.
2. **Follow the `act` skill's rules throughout,** for every request.
   - Not for: what is said to the user (the `respond` skill), or the work that steps 4 to 6 route: arranging things, work with other agents, instruction documents or setup, and the user's own work.
   - Gives back: nothing of its own. Its rules shape every action.
3. **Decide what it will be and how it gets done** with the `devise` skill: first a design, when the request leaves open what something will be, then a plan, when the work is multipart by the `act` skill's planning rule. Single-step work, such as answering a question, needs neither.
   - Not for: a view asked for ("what do you think?", the `act` skill's rule).
   - Gives back: the design and plan the work follows, kept current as it goes.
4. **Arrange the parts of something** with the `organize` skill, when the request or a step changes how something is divided, not what it says: split it into parts that don't overlap (outlining a document before writing included), merge repeats, group parts under a parent, move a shared part into one place, index, or check for overlaps and gaps.
   - Not for: changing what the parts say, or planning the steps of the work (the `devise` skill).
   - Gives back: the new arrangement.
5. **Share the work with other agents and later sessions** with the `coordinate` skill: a task handed to an agent, its result coming back here; work carried over to a later session; an instruction document every session reads; setting up skillbook; and what a session taught.
   - Gives back: the agent's report, the carryover or the change made.
6. **Do it,** always under the `act` skill's rules and these steps, using whichever skills fit:
   - Work another set holds: if a set in your skill list holds that kind of work, load its main skill, then use the skill by its name rule, never by a path guessed without loading it, because that set's main skill holds rules its skills rely on.
   - Writing a file: the `act` skill's rule on a file's type.
   - Anything else, including a request no skill covers, such as "rename these photos by the date they were taken": your own judgment.
   - Gives back: the work done.

## The last instruction

Respond, always, with the `respond` skill, which covers everything said to the user. Return nothing before its check has run.
