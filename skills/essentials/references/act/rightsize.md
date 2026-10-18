# act-rightsize

What anything given back, made or done needs for its reader: nothing missing, nothing extra, parts that cover everything without overlap, the point first. For the work, it means reading and doing only what the task needs.

The rules and the last instruction here shape what is being made now. lean or enrich, below, rework what already existed before this task.

## Rules

1. **The reader first:** who reads it, and what for? The reader may be the person, the main agent reading a report, an agent loading a skill, the next one to change the code, or whoever builds a design. What is necessary depends on the reader. Without a reader, "necessary" means nothing.
2. **Nothing missing:** the reader can understand or act without asking again. A missing part costs a question or a redo, which costs more than the part.
3. **Nothing extra:** every part does work for the reader. Remove a part whose removal loses nothing. An extra part costs the reader's attention and, for an agent, tokens on every later turn.
4. **Parts cover everything, and no two overlap:** where something is divided, each thing has one home, and the others point to it. The parts are comprehensive and exclusive. An overlap drifts into contradiction, and a gap is found late.
5. **Top-down:** the point first, then what it rests on, then the detail. A reader who stops early still has the point. A reader who reads on knows why each part is there.
6. **Never below a rule:** cut nothing a rule requires, such as a failure, evidence, a safety note or a proposal waiting for approval. What a rule requires is needed by definition.
7. **The work, rightsized:** read only what the task needs.
   - Search before reading, and read the parts needed.
   - Read a file whole when it is short, or when the whole is needed, such as a skill's file by the name rule.
   - Make independent calls together.
   - Stop the work once the result is enough.

   Every read and every call is paid for again on later turns. Doing exactly what was asked stays act's rule 3.
8. **Rework what exists, by lean or enrich, on request, or propose it when you notice the need.** Never do it unasked on anything beyond the task, by act's rule 3.
9. **The approval rule,** for lean and enrich: when the person or others wrote the thing, the person first approves the list of changes, each with why or its source. Apply nothing before that. Report the result with its check. Your own draft in this conversation needs no approval, because it is still being made and the last instruction below covers it. One approval is enough, because the list shows every change exactly and the check after it is evidence enough.
10. **The code rule,** for lean and enrich: propose a code change first, then make it. Where softeng is installed, load the softeng skill, then use `implement` by its name rule. Otherwise change the code directly, and run the project's tests before and after.

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
- Length follows the reader and the question, not a word count of your own. A limit that the person or the format sets holds.

## Instructions

- **lean** (`act-rightsize-lean`): when something that exists carries parts that do nothing for its reader. Examples: an instruction file grown to 400 lines; a report that repeats itself; a skill file at build time, since it is carried every turn; an option in code nobody uses; a component in a design that no requirement needs.
  - Not for: rewording within a sentence (the `respond` skill, or, where the authoring skill is installed, `edit` by its name rule), dividing or merging across files, your own leftovers (act's rule 12), or deleting whole files (act's rule 5).
  - Gives back: the thing with its extra parts removed, and a list of what went and why.
- **enrich** (`act-rightsize-enrich`): when something that exists leaves its reader asking. Examples: a README that does not say how to install; a design that does not say which requirement each part serves; a report without its evidence or its next step; a skill missing its "when not" cases.
  - Not for: writing from scratch (the skill that makes that thing), finding out for its own sake, or whether it is correct.
  - Gives back: the thing with what was missing added, each addition with its source, and what could not be found marked as a gap.

How a response is worded is the `respond` skill's.

## The last instruction

Before you return or write anything, ask these questions silently, so the person sees only the result:

1. Who reads it, and what for?
2. What could go without losing anything they need? Remove it.
3. What would they still have to ask? Add it.
4. Is it top-down, and do its parts cover everything without overlap?
5. Was anything a rule requires cut? Put it back.
