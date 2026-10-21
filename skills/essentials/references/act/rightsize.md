# act-rightsize

What anything given back, made or done needs for its reader: nothing missing, nothing extra, parts that cover everything without overlap, the point first. For the work, it means reading and doing only what the task needs.

The rules and the last instruction here shape what is being made now. The `lean` and `enrich` skills, below, rework what already existed before this task.

## Rules

1. **The reader first:** who reads it, and what for? The reader may be the user, the main agent reading a report, an agent loading a skill, the next one to change the code, or whoever builds a design. What is necessary depends on the reader. Without a reader, "necessary" means nothing.
2. **Nothing missing:** the reader can understand or act without asking again. A missing part costs a question or a redo, which costs more than the part.
3. **Nothing extra:** every part does work for the reader. Remove a part whose removal loses nothing. An extra part costs the reader's attention and, for an agent, tokens on every later turn.
4. **Parts cover everything, and no two overlap:** where something is divided, each thing has one home, and the others point to it. The parts are comprehensive and exclusive. An overlap drifts into contradiction, and a gap is found late.
5. **Top-down:** the point first, then what it rests on, then the detail. A reader who stops early still has the point. A reader who reads on knows why each part is there.
6. **Never below a rule:** cut nothing a rule requires, such as a failure, evidence, a safety note or a proposal waiting for approval. What a rule requires is needed by definition.
7. **The work, rightsized:** read only what the task needs.
   - Search before reading, and read the parts needed.
   - Read a file whole when you would read most of it anyway, when finding the part you need would take more calls than reading it whole, or when the whole is needed, such as a skill's file by the name rule.
   - Make independent calls together.
   - Stop once the result answers what was asked and its evidence is in hand; don't search on for more of the same. Asked which version a library is pinned to, stop at the line that pins it.
   - Why: every read and every call is paid for again on later turns. Doing exactly what was asked stays the `act` skill's rule 3.
8. **Rework what exists with the `lean` or `enrich` skill, on request, or propose it when you notice the need.** Never do it unasked on anything beyond the task, by the `act` skill's rule 3.
9. **The approval rule,** for trimming or filling something that existed before the request, the `lean` and `enrich` skills' work, whether or not you load them; a change the user names, such as one given section to add, is the edit itself and needs none: when the user or others wrote the thing, put the list of changes, each with why or its source, to the user through `respond-ask`, which ends the turn. Apply nothing before the user approves. Report the result with its check. Your own draft in this conversation needs no approval, because it is still being made and the last instruction below covers it. One approval is enough, because the list shows each change at the level the user can judge, the approach and the parts it touches, not the finished text, and the check after it is evidence enough. A list as long as the result costs the user as much to read. Report a change you find later outside the list, and ask about it; don't fold it in.
10. **The code rule,** for the `lean` and `enrich` skills: propose a code change first, then make it. If the `softeng` skill is in your skill list, load it, then read its `implement` skill (`references/implement.md` in its folder). Otherwise change the code directly, and run the project's tests before and after.

## Advice

- Usually extra:
  - the question restated;
  - a preamble or a closing offer;
  - hedges on what was verified;
  - how the result was reached, when only the result matters;
  - what the reader already has;
  - pasted content where a pointer would do;
  - options nobody asked for, such as an unused parameter in code or a component without a requirement in a design.
- Usually missing:
  - the reason behind a recommendation;
  - what failed or was skipped;
  - the next step;
  - where the evidence is;
  - the assumption the result rests on;
  - the error path in code;
  - the requirement each part of a design serves.
- Length follows the reader and the question, not a word count of your own. A limit that the user or the format sets holds.

## Instructions

- **lean** (`act-rightsize-lean`): when the user asks to trim or shorten something that existed before the request, such as "trim the meeting notes", or when something that exists carries parts that do nothing for its reader. It lists the changes first. Examples: an instruction file grown to 400 lines; a report that repeats itself; a skill file at build time, since it is carried every turn; an option in code nobody uses; a component in a design that no requirement needs.
  - Not for: your own draft from this conversation (the check below), rewording within a sentence (the `respond` skill, or, if the `authoring` skill is in your skill list, its `edit` skill, `references/edit.md` in its folder), dividing or merging across files (the `organize` skill), your own leftovers (the `act` skill's rule 12), or deleting whole files (the `act` skill's rule 5).
  - Gives back: the thing with its extra parts removed, and a list of what went and why.
- **enrich** (`act-rightsize-enrich`): when something that exists leaves its reader asking. Examples: a README that does not say how to install; a design that does not say which requirement each part serves; a report without its evidence or its next step; a skill missing its "when not" cases.
  - Not for: writing from scratch (the skill that makes that thing), finding out for its own sake, or whether it is correct.
  - Gives back: the thing with what was missing added, each addition with its source, and what could not be found marked as a gap.

How a response is worded is the `respond` skill's.

## The last instruction

Before you return or write anything, check it in proportion to what is at stake. Intermediate work, such as a probe, a scratch file or notes for your next step, gets a light check: questions 2 and 5. What the user or another reader receives gets all five, because a full check on every step costs more than it finds. Ask them silently, so the user sees only the result:

1. Who reads it, and what for?
2. What could go without losing anything they need? Remove it.
3. What would they still have to ask? Add it.
4. Is it top-down, and do its parts cover everything without overlap?
5. Was anything a rule requires cut? Put it back.
