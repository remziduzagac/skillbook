---
name: skillbook-write
description: "Writes and changes the files of skillbook's skills from their designs: a set's main skill, the plain skill files under it, their size, their wording and their tests. Use when building a skill, changing a built skill's files, or testing one. Not for placing, naming, designing or reviewing a skill (skillbook-tree), or for instruction files such as AGENTS.md."
---

# skillbook-write

How to write a skill's files in this repository, from its design. This is a project skill. It is never shipped in a set.

## Rules

- **The design is the source.** Find the design where skillbook-tree says designs live. If the files need a rule, a case, a route or a fallback the design doesn't have, don't invent it: take the gap back to the design through skillbook-tree, then write the files. Wording, examples and order are yours, as long as they keep the design's intent. If a file and its design disagree, one of them is wrong, and the user decides which. Before reporting, account for the design's required behaviour in the built files: each rule, route and fallback is there, or named as deferred with the fallback that covers it meanwhile.
- **Shared rules stay where they live.** skillbook-tree holds where sets and designs live, how a name becomes a file, the exact name rule, parents that only route, and the checklist. Read them there. Copy word for word only the text a rule requires word for word, such as the name rule; point to the other shared rules instead of copying them. Don't retype them from memory, because a rule written twice drifts.
- **Plain English.** Many readers, people and agents, are not native English speakers, and plain text is just as exact for agents. So:
  - one idea per sentence, and short sentences;
  - active voice: "read the file whole", not "the file is read whole";
  - normal word order and common words;
  - a list instead of a long chain of clauses joined by semicolons;
  - the same word for the same thing every time, as skillbook's glossary uses it;
  - "the user" for the human the agent works with, the word the harnesses use; "the project's users" or "end users" for the people who use what a project builds;
  - a skill whose bare name could be read as an ordinary word, such as `act` or `respond`, written as "the `act` skill"; a dashed name such as `respond-ask` needs nothing.
- **Concrete wording.** An agent follows what it can act on. So:
  - for a verb that depends on the user, such as wait, ask, stop or confirm, write the action: "end the turn with the questions; never answer them yourself", not "wait";
  - name a thing as the agent's tools see it: a registered skill by its name, and a file the agent opens directly, such as a start file the main skill reads, by its path. "Load the `understand` skill" made a model look for a registered skill and give up; naming the file by path fixed it. Inside a set, a call names a skill by its name, and the name rule turns it into the file, as skillbook-tree's Names says;
  - use the general word, with the narrow cases as examples: "a different result, such as code, a document, a decision or an action", not "different code or files";
  - vary the examples: take them from different kinds of work, not only code, and give a rule stated in several places a different example in each. One example repeated everywhere teaches the example, not the rule.
- **About 100 lines per file.** This counts each file on its own, not the whole skill. An agent may only preview a longer file instead of reading it all, and every line costs tokens each time the file is read. If a file grows past it, trim it first, then split it into a child or a reference file at the path its name gives. Never cut a reason, a "when not" case or a fallback to make it fit. If a file truly needs more, its first lines say why.
- **Talk about the job, not about skillbook's progress.** Don't write "for now", "not built yet" or "until X exists". If a step's skill doesn't exist yet, just don't name one: an agent uses its own judgment wherever no skill is named, and a progress note costs tokens and goes out of date.
- **Block only where going on would cause harm.** A needless block stops work the user wanted done. So don't write "stop", "wait", "never", "only" or "must" where going on with a note, or the agent's own judgment, would work. Use an absolute only when its reason covers every case it forbids, and write advice as advice. skillbook-tree's check 4 is the test.
- **Adapt outside ideas, never copy them.** Rewrite an outside skill's idea for skillbook. Text kept close to the original would need that licence's notice, so avoid it.

## Advice

- Write for an agent that has only this file and the files above it. Use plain steps and the words the user and the other skills use.
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
- **Test cases:** turn each test in the design into an AI test case, run the way a user meets the skill. blueprint/design/testing.md has the case format, the runner and its rules; this is the part that is about writing.
  - **Test first** for a behaviour rule that is new, changed or has failed, not for every existing rule at once. Write the case (`tests/cases/<set>/`, run by `tests/run.py`), run it on the small models and see it fail, change the wording, run it again and see it pass. Record the before and after in the decision's Tested line. If a new case already passes, record that as the baseline, and change the skill only when evidence shows a gap.
  - Check a case against a correct trace and a plausible wrong trace before trusting its result: the correct one passes and the wrong one fails. A check that a refusal or a merely named file can pass measures nothing.
  - Run on the user's machine only, in a throwaway home, never their own. Small models are the default. Cover each rule with about three or more different cases, each run once, rather than one case run three times: varied prompts show more for the same cost. Repeat a case only when it fails or its results disagree. A failure only on a small model is a signal to look at, not a reason to add text at once.
  - Word each test's prompt unlike any example in the skill's text, and keep at least one such held-out case per rule. A prompt copied from the skill's own example can pass by matching it, without showing that the rule works.
  - Judge by behaviour, such as which files were read and what the answer did, not by its wording.
  - A failing case is a sample. Fix the pattern several failures share, in general, never the one case: a rule or example added just to make a case pass turns the skill into a script and stops the case from measuring anything.
  - Say the cost before running. A budget claim matches what the runner guarantees: say which limits are enforced and which are estimated, and keep an unknown cost unknown, never zero. Keep raw runs out of the repository, since they are large and personal, and write what they showed into the test's result.
- **Changing a built skill:** if the change alters what the design says, change the design first, then the files. A fix that keeps the design true, such as a typo or a lint error, goes to the files only. To trim or fill a skill, follow skillbook-tree's instruction for it.

## The last instruction

Before reporting, run the repository's checks and skillbook-tree's checklist on every file you wrote. List anything that differs from the design, with its file and line. Change the design only with the user.
