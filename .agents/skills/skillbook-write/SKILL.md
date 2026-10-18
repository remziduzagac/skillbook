---
name: skillbook-write
description: "Writes and changes the files of skillbook's skills from their designs: a set's main skill and the plain skill files under it, their heads, their size, and their tests through the harness. Use when building a skill, changing a built skill's files, or testing one; not for placing, naming, designing or reviewing a skill, which is skillbook-tree's, nor for instruction files such as AGENTS.md."
---

# skillbook-write

How a skill's files are written in this repository, from its design. A project skill, never shipped in any set.

## Rules

- **The design is the source:** a skill's files carry its design, found where skillbook-tree says designs live. What the design does not say is not invented while writing: the gap goes back to the design through skillbook-tree, then the files follow. A file that departs from its design is a defect in one of the two, and the person decides which.
- **Shared rules stay where they live:** where sets and designs live, how a name becomes a file, the exact name rule, a parent that only routes, and the checklist are skillbook-tree's. Read them there and carry them as they are, never retyped from memory, since a rule written twice drifts.
- **About 100 lines per file,** each file on its own, a main skill's file and every plain skill file under it: an agent may preview a longer file instead of reading it whole, and every line is paid each time the file is read. A file past it is trimmed first; what remains is split into a child or a reference file, at the path its name gives. Nothing a rule needs is cut to fit, such as a reason, a "when not" case or a fallback; a file that truly needs more says why in its first lines.
- **A skill speaks of its job, never of skillbook's progress:** no "for now", "not built yet" or "until"; a step whose skill does not exist yet simply names none, since an agent uses its own judgment wherever no skill is named, and a note about progress costs tokens on every read and goes stale.
- **Adapted, never copied:** an outside skill's idea is rewritten for skillbook's case; outside text kept close to its original would need that licence's notice, so it is avoided.

## Advice

- Write for an agent that has only this file and the files above it: plain imperative steps, in the words the person and the other skills use.
- One clear default beats a list of options; name an alternative only for the case that needs it.
- A short text diagram shows a loop, a decision that is easy to miss, or what an operation does to its items, before and after; a long flow offers a checklist the agent copies and ticks off.

## Instructions

- **A main skill's file:** frontmatter with `name`, the set's name, and `description`, what the set does and when to load it, within the format's limits (at most 1,024 characters, no angle brackets) and not overlapping another main skill's; `compatibility` names a capability the set needs. The body follows the design's flow in the order skillbook-tree's checklist gives, with the name rule from skillbook-tree, word for word, among the rules.
- **A plain skill file:** it opens with a `#` heading holding its dashed name, then one line saying what it does; then, only when it needs a capability, a line starting `Needs:` that names it and the fallback without it. When to use it, when not and what it gives back are not repeated: they live in its parent's line, which the agent reads first. Its body follows, in the same order as a main skill's.
- **The rest of the design:** its Files become the skill's own scripts and templates, beside its file as skillbook-tree's names place them; its Tests become test cases, below; its Callers and Material stay in the design.
- **Test cases:** each test in the design is run through the harness the way a person meets the skill:
  - installed with the repository's install script into a throwaway home, never the person's own, since a test must leave their setup as it was; only the login it needs is copied in, and removed afterwards with the transcripts, which hold the account's details;
  - run in each supported agent, about three runs a case or more, since one run proves little;
  - judged by behaviour, which files were read, whole or in part, and what the answer did, not by its wording;
  - the cost stated before running; raw runs kept out of the repository, being bulky and personal, what they showed written into the test's result.
- **Changing a built skill:** the design changes first, then the files; trimming or filling one follows skillbook-tree's instruction for it.

## The last instruction

Before reporting, run the repository's checks and skillbook-tree's checklist over every file written, and list what departs from the design, each with its file and line; the design changes only with the person.
