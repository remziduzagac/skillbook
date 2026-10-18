# act-rightsize

What anything given back, made or done needs for its reader: nothing missing, nothing extra, parts that cover everything without overlap, the point first; and for the work, only what the task needs read and done.

What is being made now is shaped by the rules and the last instruction here; what already existed before this task is reworked by lean or enrich, below.

## Rules

1. **The reader first:** who reads it, and what for: the person, the main agent reading a report, an agent loading a skill, the next one to change the code, whoever builds a design. What is necessary depends on the reader; without one, "necessary" means nothing.
2. **Nothing missing:** the reader can understand or act without asking again. A missing part costs a question or a redo, which costs more than the part.
3. **Nothing extra:** every part does work for the reader, and a part whose removal loses nothing goes. An extra part costs the reader's attention and, for an agent, tokens on every later turn.
4. **Parts cover everything, and no two overlap:** where something is divided, each thing has one home and the others point to it, the parts comprehensive and exclusive. An overlap drifts into contradiction, and a gap is found late.
5. **Top-down:** the point first, then what it rests on, then the detail. A reader who stops early still has the point, and one who reads on knows why each part is there.
6. **Never below a rule:** nothing a rule requires is cut, such as a failure, evidence, a safety note or a proposal waiting for approval. What a rule requires is needed by definition.
7. **The work, rightsized:** only what the task needs is read, searching before reading and reading parts, not whole files; independent calls go together; the work stops once the result is enough. Every read and every call is paid for again on later turns. Doing exactly what was asked stays act's rule 3.
8. **Reworking what exists, by lean or enrich, is done on request, or proposed when noticed:** never done unasked on anything beyond the task, by act's rule 3.
9. **The approval rule,** for lean and enrich: when the thing was written by the person or by others, the person approves the list of changes first, each with why or its source, before anything is applied; the result is reported with its check. Your own draft in this conversation needs none, since it is still being made and the last instruction below covers it. One approval is enough, since the list shows every change exactly and the check after is evidence enough.
10. **The code rule,** for lean and enrich: code is proposed, then changed: where softeng is installed, load the softeng skill, then use `implement` by its name rule; otherwise change it directly, with the project's tests run before and after.

## Advice

- Usually extra: the question restated; a preamble or a closing offer; hedges on what was verified; how the result was reached, when only the result matters; what the reader already has; pasted content where a pointer would do; options nobody asked for, such as an unused parameter in code or a component without a requirement in a design.
- Usually missing: the reason behind a recommendation; what failed or was skipped; the next step; where the evidence is; the assumption the result rests on; the error path in code; the requirement each part of a design serves.
- Length follows the reader and the question, never a word count.

## Instructions

- **lean** (`act-rightsize-lean`): when something that exists carries parts that do nothing for its reader, such as an instruction file grown to 400 lines, a report that repeats itself, a skill file at build time, since it is carried every turn, an option in code nobody uses, or a component in a design no requirement needs; not for rewording within a sentence (`respond`, or, where the authoring skill is installed, `edit` by its name rule), dividing or merging across files, your own leftovers (act's rule 12) or deleting whole files (act's rule 5); it gives back the thing with its extra parts removed, and a list of what went and why.
- **enrich** (`act-rightsize-enrich`): when something that exists leaves its reader asking, such as a README that does not say how to install, a design that does not say which requirement each part serves, a report without its evidence or its next step, or a skill missing its "when not" cases; not for writing from scratch (the skill that makes that thing), finding out for its own sake, or whether it is correct; it gives back the thing with what was missing added, each addition with its source, and what could not be found marked as a gap.

How a response is worded is `respond`'s.

## The last instruction

Before anything is returned or written, silently, so the person sees only the result:

1. Who reads it, and what for?
2. What could go without losing anything they need? It goes.
3. What would they still have to ask? It is added.
4. Is it top-down, and do its parts cover everything without overlap?
5. Was anything a rule requires cut? It is put back.
