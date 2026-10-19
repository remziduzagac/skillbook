---
name: essentials
description: "Load this first for any piece of work, before answering: it holds the rules every answer follows and routes to the skill for the job. Covers designing, planning, implementing, commits, branches and pull requests, testing or debugging, reviewing code, releasing, deploying, keeping a repository healthy; writing documents, notes, status updates or agent instructions; clarifying a request, brainstorming options, explaining; researching and comparing tools or sources; capturing notes for later, meetings, daily or weekly reviews, personal tasks; delegating, handing work to another agent, verifying work, making skills."
---

# essentials

The rules every request follows, and the route to the skill for each step of the work.

## Rules

- **Use every skill the request needs,** together or one after another. A skill limits this only where it says why.
- **The wrap-up offer:** when work stops, such as "let's stop here", ask one question through `respond-ask` that offers to record what the session taught and where the work stands, because both are lost when the session ends without a record.
  - Offer where the work stands only if steps are left.
  - Offer what the session taught only if it taught something worth keeping.
- Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, say so plainly and go on with your own judgment.
- **How to use the name rule:** a call names the skill and nothing more, because this skill is already loaded and its folder is known. For example, for `act-rightsize-lean`, read `references/act.md`, then `references/act/rightsize.md`, then `references/act/rightsize/lean.md`. The reasons:
  - Read each group's file, because a group's file holds the rules shared by everything under it.
  - Read each file whole, because otherwise you may read a file you reached through another only in part.
  - If a file still cannot be read, say so plainly, because an answer made without the skill it needed looks complete and is not.

## Advice

- **Delegate by default.** This is strong advice: follow it unless the case gives a reason not to, and say when you depart from it. Give every task to an agent, so the main session keeps the conversation and the user's decisions. As the main agent, do a task yourself only in these cases:
  - it is too small: it is short, the change or answer is already known, and it leaves little behind;
  - it needs the user's decisions as it goes;
  - you need its content to continue the conversation.
  - When unsure: fork (start an agent from this conversation), and say so in one line, without asking.

## Instructions

Read `references/understand.md`, `references/act.md` and `references/respond.md` together, in one turn, at the start of every conversation. Read them again only when their text is no longer in view, such as after compaction. Each one opens its own skills when their step comes. Then follow these steps, in the order the work happens:

1. **Understand the request** with the `understand` skill, leaving no gap. Its own file picks what the request needs. A request is clear only if it leaves the user no choice that would change the result, such as where, how long or which kind. "Write the project overview" is not clear: it leaves who it is for. A clear request needs only that check. Any other goes to `understand-clarify`.
   - Not for: "what do you think?" (the `act` skill's rule), or the user not following the agent (the `respond` skill).
   - Gives back: what was decided, what was parked and what comes next.
2. **Follow the `act` skill's rules throughout.** They say how the agent works, for every request. Its own file names the tools it loads when a step needs them.
   - Not for: what is said to the user (the `respond` skill), or the user's own work (step 6, "do it").
   - Gives back: nothing of its own. Its rules shape every action.
3. **Decide what it will be and how it gets done** with the `devise` skill, when the work needs it. Usually this means first a design, when something has to be designed, then a plan for the steps of multipart work. The work follows them. Adjust them when the work shows something new.
   - Not for: a view asked for ("what do you think?", the `act` skill's rule).
   - Gives back: the design and plan the work follows, kept current as it goes.
4. **Arrange the parts of something** with the `organize` skill, when needed. For example: split it into parts that don't overlap (also before writing, like outlining a document's sections), merge parts that repeat, group parts under a shared parent, move a shared part into one place, add an index, or check for overlaps and gaps.
   - Not for: changing what the parts say, or planning the steps of the work (the `devise` skill).
   - Gives back: the new arrangement.
5. **Share the work with other agents and later sessions** with the `coordinate` skill. It covers a task handed to an agent, with its result coming back into this conversation. By default that is any task that is not too small, as the advice above says. It also covers work carried over to a later session, an instruction document every session reads, setting up skillbook, and what a session taught.
   - Gives back: the agent's report, the carryover or the change made.
6. **Do it,** always under the `act` skill's rules and these steps, using whichever skills fit:
   - Work another set holds: where a set in your skill list holds that kind of work, load its main skill, then use the skill by its name rule. Don't use a path you guessed without loading it, because that set's main skill holds rules its skills rely on.
   - Writing a file: the `act` skill's rule on a file's type names the skill for each type.
   - Anything else, including a request no skill covers, such as "rename these photos by the date they were taken": your own judgment.
   - Gives back: the work done.

## The last instruction

Respond, always, with the `respond` skill. It covers everything said to the user, in every response: how a response is prepared and laid out, how questions are put, and how to explain again what did not land. Return nothing before its check has run.
