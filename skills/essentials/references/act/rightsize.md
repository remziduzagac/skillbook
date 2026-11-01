# act-rightsize

## Purpose

Fits work and its results to the reader’s purpose, with nothing missing or extra and the point first.

## When to use

Use when deciding what to read, do, make or return for a reader. Read before changing existing material that the user asks you to trim, shorten, fill or complete, or check for missing or extra parts. Examples: “trim the meeting notes”, “complete the onboarding page” or “what is this README missing?”.

## When not

The rules and final check still apply to anything made, done or returned. The alternatives below concern a rework pass, not those general rules.

- Your own draft from this conversation: use the final check here. It is still being made and needs no separate rework pass.
- Checking correctness or completion: use the `act-verify` guide for evidence. Keep the sizing rules for what you return.
- Dividing something into parts: use the `organize` guide to arrange it. Keep the sizing rules for each part.
- Judging how careful to be: use the `act-stakes` guide to assess mistakes and their effects.
- A named change, such as a given section to add: make that edit. A fill or complete request still needs this method because you must find what goes in.

## Gives back

The output or work plan fitted to its reader, with the point first. For reworked material, also return the list of changes. The sizing check itself stays in thinking.

The rules and the final step of Instructions here shape what is being made now. The `act-rightsize-lean` and `act-rightsize-enrich` guides, below, rework what already existed before this task.

## Rules

1. **Identify the reader and purpose.** The reader may be the user, a main agent reading a report, an agent loading a skill, the next code maintainer or a design's builder. What is necessary depends on that reader. Without one, "necessary" means nothing.
2. **Include what the reader needs to understand or act without asking again.** A missing part costs a question or redo, more than the part itself.
3. **Remove parts whose removal loses nothing.** Every part must work for the reader. Extra parts cost attention and, for agents, tokens on every later turn.
4. **Give each thing one home when dividing work.** Other parts point there. Cover everything without overlap. Overlaps drift into contradiction. Gaps are found late.
5. **Put the point first, then its basis, then detail.** Readers who stop early get the point. Those reading on know why each part is there.
6. **Keep everything a rule requires.** Examples: a failure, evidence, safety note or pending proposal. A rule makes it necessary by definition.
7. **Read only what the task needs.**
   - Search before reading, and read the parts needed.
   - Read a file whole if you need most of it, finding the needed part would take more calls, or the whole is required, such as by the guide name rule.
   - Make independent calls together.
   - Stop when the result answers the request and you have evidence. Do not search for more of the same. Asked a library's pinned version, stop at the line that pins it.
   - Why: every read and every call is paid for again on later turns. Doing exactly what was asked stays the `act` guide's rule 3.
8. **Use the `act-rightsize-lean` or `act-rightsize-enrich` guide to rework existing material on request.** Propose it when you notice the need. Never do it unasked beyond the task, by the `act` guide's rule 3.
9. **Get approval for a list before trimming or filling existing material.** This covers work in the `act-rightsize-lean` and `act-rightsize-enrich` guides whether you load them or not.
   - A named change, such as a given section to add, is the edit itself and needs no such approval. Filling, completing or making something sufficient is filling even if the request names what is lacking: you still find what goes in.
   - For work written by the user or others, put the change list through the `respond-ask` guide. Give each change's reason or source. End the turn. Apply nothing before approval.
   - Report the result and its check.
   - Your own draft in this conversation needs no approval. It is still being made and the final step of Instructions covers it.
   - One approval is enough. Show how you will change it and the parts touched, at a level the user can judge, not finished text. The later check is enough evidence. A list as long as the result costs as much to read.
   - Report later changes outside the list. Ask about them instead of folding them in.
10. **Propose code changes before making them in the `act-rightsize-lean` or `act-rightsize-enrich` guide.** Use a skill in the harness’s list for changing code, if one fits. Otherwise edit directly under the project’s tests, run before and after.

## Advice

- Common extras:
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

Fit existing material to its reader. Use the method needed for the parts being reworked; these methods have no fixed order.

- the `act-rightsize-lean` guide: remove extra parts.
- the `act-rightsize-enrich` guide: add missing parts.

How a response is worded is the `respond` guide's.

1. **Check before returning or writing anything.** Always do this last. Scale to stakes. For intermediate probes, scratch files or notes for your next step, use questions 2 and 5. For anything another reader receives, use all five. A full check on every step costs more than it finds. Ask silently so the user sees only the result:

   1. Who reads it, and what for?
   2. What could go without losing anything they need? Remove it.
   3. What would they still have to ask? Add it.
   4. Is it top-down, and do its parts cover everything without overlap?
   5. Was anything a rule requires cut? Put it back.
