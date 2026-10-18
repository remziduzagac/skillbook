# act-rightsize-enrich

Adds what is missing to something that exists: what its reader would still ask, answered from the project, the person or research, each addition sourced and checked, what cannot be found marked as a gap.

## Rules

1. **What the reader would still ask decides what is missing,** by rightsize's second rule, since a missing part costs a question or a redo.
2. **Never invented:** each addition comes from the project's files, from the person when only they know, or from outside sources for outside facts; what is not found is marked as a gap, since an invented answer reads as true.
3. **Each addition is checked true; nothing is added that the reader would not ask for,** by rightsize's last instruction, so enriching does not become padding.
4. **The person approves first,** by rightsize's approval rule: the list holds each addition with its source and why; the result is reported with the gaps.
5. **Code is proposed, and changed under tests,** by rightsize's code rule: such as a missing error path or test.

## Instructions

1. **The reader,** and what the thing is for.
2. **What the reader would still ask:** found by reading as that reader would: where the authoring skill is installed, load it, then use `reader` by its name rule; otherwise, list the questions a newcomer would ask.
3. **Find each answer,** by rule 2: the project's files first; the person, through `respond-ask`, when only they know, such as which versions are supported; outside sources for outside facts. What is not found is marked as a gap.
4. **Apply,** after the approval rule 4 asks for, each addition with its source; for code, by rule 5.
5. **Check,** by rule 3.

## The last instruction

Before anything is returned: nothing invented; every addition has its source and was checked; nothing the reader would not ask for; the gaps are listed; where the person's or others' work changed, the list was approved; for code, the tests pass.
