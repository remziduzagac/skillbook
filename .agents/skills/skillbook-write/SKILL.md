---
name: skillbook-write
description: "Writes and changes the files of skillbook's skills from their designs: a set's main skill, the plain skill files under it, their size, their wording and their tests. Use when building a skill, changing a built skill's files, or testing one. Not for placing, naming, designing or reviewing a skill (skillbook-tree), or for instruction files such as AGENTS.md."
---

# skillbook-write

How to write a skill's files in this repository, from its design. This is a project skill. It is never shipped in a set.

## Rules

- **The design is the source.** Find the design where skillbook-tree says designs live. If the files need a rule, a case, a route or a fallback the design doesn't have, don't invent it: take the gap back to the design through skillbook-tree, then write the files. Wording, examples and order are yours, as long as they keep the design's intent. If a file and its design disagree, one of them is wrong, and the person decides which.
- **Shared rules stay where they live.** skillbook-tree holds where sets and designs live, how a name becomes a file, the exact name rule, parents that only route, and the checklist. Read them there and copy them exactly. Don't retype them from memory, because a rule written twice drifts.
- **Plain English.** Many readers, people and agents, are not native English speakers, and plain text is just as exact for agents. So:
  - one idea per sentence, and short sentences;
  - active voice: "read the file whole", not "the file is read whole";
  - normal word order and common words;
  - a list instead of a long chain of clauses joined by semicolons;
  - the same word for the same thing every time, as skillbook's glossary uses it.
  - a skill whose bare name could be read as an ordinary word, such as `act` or `respond`, written as "the `act` skill"; a dashed name such as `respond-ask` needs nothing.
- **About 100 lines per file.** This counts each file on its own, not the whole skill. An agent may only preview a longer file instead of reading it all, and every line costs tokens each time the file is read. If a file grows past it, trim it first, then split it into a child or a reference file at the path its name gives. Never cut a reason, a "when not" case or a fallback to make it fit. If a file truly needs more, its first lines say why.
- **Talk about the job, not about skillbook's progress.** Don't write "for now", "not built yet" or "until X exists". If a step's skill doesn't exist yet, just don't name one: an agent uses its own judgment wherever no skill is named, and a progress note costs tokens and goes out of date.
- **Block only where going on would cause harm.** A needless block stops work the person wanted done. So don't write "stop", "wait", "never", "only" or "must" where going on with a note, or the agent's own judgment, would work. Use an absolute only when its reason covers every case it forbids, and write advice as advice. skillbook-tree's check 4 is the test.
- **Adapt outside ideas, never copy them.** Rewrite an outside skill's idea for skillbook. Text kept close to the original would need that licence's notice, so avoid it.

## Advice

- Write for an agent that has only this file and the files above it. Use plain steps and the words the person and the other skills use.
- Give one clear default rather than a list of options. Name an alternative only for the case that needs it.
- A short text diagram helps with a loop, a decision that is easy to miss, or a before-and-after. A long flow can offer a checklist the agent copies and ticks off.

## Instructions

- **A main skill's file:** start with frontmatter:
  - `name`: the set's name;
  - `description`: what the set does and when to load it, at most 1,024 characters, no angle brackets, not overlapping another main skill's;
  - `compatibility`: a capability the set needs, if any.

  Then write the body in the order skillbook-tree's checklist gives, with the name rule from skillbook-tree, word for word, among the rules.
- **A plain skill file:** start with a `#` heading holding its dashed name, then one line saying what it does. If it needs a capability, add a line starting `Needs:` that names it and the fallback without it. Don't repeat when to use it, when not, or what it gives back: those live in its parent's line, which the agent reads first. Then write the body in the same order as a main skill's.
- **The rest of the design:** its Files become the skill's own scripts and templates, placed as skillbook-tree's names say. Its Tests become test cases (below). Its Callers and Material stay in the design.
- **Test cases:** run each test in the design through the harness, the way a person meets the skill:
  - install with the repository's install script into a throwaway home, never the person's own, so their setup stays as it was; copy in only the login needed, and remove it afterwards with the transcripts, which hold account details;
  - run in each supported agent, about three runs a case or more, since one run proves little;
  - judge by behaviour, such as which files were read, whole or in part, and what the answer did, not by its wording;
  - say the cost before running; keep raw runs out of the repository, since they are large and personal, and write what they showed into the test's result.
- **Changing a built skill:** if the change alters what the design says, change the design first, then the files. A fix that keeps the design true, such as a typo or a lint error, goes to the files only. To trim or fill a skill, follow skillbook-tree's instruction for it.

## The last instruction

Before reporting, run the repository's checks and skillbook-tree's checklist on every file you wrote. List anything that differs from the design, with its file and line. Change the design only with the person.
