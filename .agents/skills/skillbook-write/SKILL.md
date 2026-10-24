---
name: skillbook-write
description: "Writes and changes the files of skillbook's skills from their designs: a set's main skill, the plain skill files under it, their size, their wording and their tests. Use when building a skill, changing a built skill's files, or testing one. Not for placing, naming, designing or reviewing a skill (skillbook-design), or for instruction files such as AGENTS.md."
---

# skillbook-write

How to write a skill's files in this repository, from its design. This is a project skill. It is never shipped in a set.

## Rules

- **Write from the design.** Find it where skillbook-design says designs live.
  - Name missing rules, cases, routes or fallbacks to the user. Invent none in files or design. The user settles gaps through skillbook-design before you write them.
  - Choose wording, examples and order that keep the design's intent.
  - If file and design disagree, ask the user which is wrong.
  - Before reporting, account for every required rule, route and fallback in the files. Name deferred behaviour and the fallback covering it.
- **Point to shared rules where they live.** Read skillbook-design for set and design locations, name-to-file mapping, exact name rule, routing-only parents and checklist. Copy only text explicitly required word for word, such as the name rule. Do not retype from memory. Duplicate rules drift.
- **Plain English: use common words and short sentences.** Many readers, people and agents, are not native speakers. Plain text is just as exact for agents:
  - Use short sentences with one idea each;
  - Use active voice: "read the file whole", not "the file is read whole";
  - Use normal word order and common words;
  - Use lists instead of clauses chained by semicolons;
  - Use the same word for the same thing, following skillbook's glossary;
  - Call the human "the user", as harnesses do. Call people using the project's output "the project's users" or "end users";
  - Write "the `act` skill" for bare names that look like ordinary words, such as `act` or `respond`. Dashed names such as `respond-ask` need no qualifier.
- **Sharp instructions: give each instruction one clear action.** Models follow short rules and drop soft parts of long or mixed ones:
  - Split actions: "Show the plan. Then end the turn." Pairing "say the plan" with "go ahead" can hide the plan in private thinking;
  - Use visible actions: end the turn, ask, propose or send a message. Avoid "state", "note" and "keep in mind";
  - Put the must first as one short bold sentence. Give its reason in a separate sentence. Put each exception on its own line;
  - Keep one idea per sentence. Split sentences containing "but", "unless" or lists of cases;
  - Keep a rule's conditions and numbers in its bold must when you split it, such as "after about three attempts" or "as far as you know". Moved to a later sentence, they read as explanation;
  - Keep a rule's bold label when you rewrite it, and put the action after it. Other files and decisions name the rule by its label;
  - Check the shape of a failing rule before adding words. Extra clauses do not fix mixed instructions.
- **Concrete wording: name actions the agent can take.** An agent follows what it can act on:
  - Name the visible action for user-dependent verbs such as wait, ask, stop or confirm. Write "end the turn with the questions; never answer them yourself", not "wait";
  - Name things as tools see them: registered skills by name, directly opened files by path. Calling a start file, such as `understand`, a registered skill can make the agent search and give up. Use its path. Inside a set, call skills by name. skillbook-design's Names turns names into files;
  - Give the general term before narrow examples: "a different result, such as code, a document, a decision or an action", not "different code or files";
  - Vary examples across kinds of work, not just code. Give a different example wherever a rule repeats. Repeating one teaches the example, not the rule.
- **Keep each file to about 100 lines.** Count files separately, not the whole skill. Agents may preview longer files instead of reading them whole. Every loaded line costs tokens again. Trim an oversized file first. Then split it into a child or reference at its name's path. Cut no reason, "when not" case or fallback for size. Explain unavoidable extra length in the first lines.
- **Write about the job, not skillbook's progress.** Omit "for now", "not built yet" and "until X exists". Name no skill for a step without a built skill. The agent uses judgment where none is named. Progress notes cost tokens and go stale.
- **Block only where continuing would cause harm.** Needless blocks stop requested work. Do not use "stop", "wait", "never", "only" or "must" where a note or judgment would serve. An absolute's reason must cover every forbidden case. Write advice as advice. Use skillbook-design's check 4.
- **Rewrite outside ideas for skillbook.** Never copy them. Close copies need the original licence notice, so avoid them.

## Advice

- Write for an agent that has only this file and the files above it. Use plain steps and the words the user and the other skills use.
- Give one clear default rather than a list of options. Name an alternative only for the case that needs it.
- A short text diagram helps with a loop, a decision that is easy to miss, or a before-and-after. A long flow can offer a checklist the agent copies and ticks off.

## Instructions

- **Start a main skill with frontmatter:**
  - `name`: the set's name;
  - `description`: give what it does and when to load it. Use at most 1,024 characters, no angle brackets and no overlap with another main skill;
  - `compatibility`: a capability the set needs, if any.

  Write the body in skillbook-design's checklist order. Put its exact name rule among the rules.
- **Start a plain skill with a `#` heading holding its dashed name.** Add one line saying what it does. If needed, add `Needs:` with its capability and fallback. Leave use, exclusions and results in the parent's line: the agent reads that first. Write the body in main-skill order.
- **Turn the design's Files into scripts and templates at skillbook-design's paths.** Turn Tests into cases as below. Leave Callers and Material in the design.
- **Test cases: turn each designed test into an AI case, run the way a user meets the skill.** Follow blueprint/design/testing.md for case format, runner and rules. The writing part follows:
  - **Test first for new, changed or failing behaviour.** Do not test every existing rule at once. Write a case in `tests/cases/<set>/`, run it with `tests/run.py` on small models and see it fail. Change wording, rerun and see it pass. Record before and after in the decision's Tested line. If it already passes, record that baseline. Change the skill only with evidence of a gap.
  - Check each case against a correct trace and a plausible wrong one. Require the first to pass and the second to fail before trusting it. A check passed by refusal or a merely named file measures nothing.
  - Run only on the user's machine in a throwaway home, never their own. Default to small models. Cover each rule with about three or more different cases, once each. Varied prompts show more for the same cost than three runs of one case. Repeat only on failure or conflicting results. A small-model-only failure is a signal, not an immediate reason for more text.
  - Use prompts unlike the skill's examples. Keep at least one held-out case per rule. Copied examples can pass by matching without showing the rule works.
  - List tested aspects in each case's `covers`, using `just test-coverage` ids. Put person-only aspects, such as the harness's question tool, in `tests/manual.toml` with a reason. Before reporting, run `just test-coverage`. Cover every aspect of the written skill or name each gap and why. Claim coverage only where checks or review can fail, not where a case merely touches an aspect.
  - Judge behaviour: answers and changes, not wording. Check skill reads only when reading is the tested behaviour, such as routing. Otherwise check results: models can reach them without the file. Have every run judged against its rubric by `tests/judge.md`. Report verdicts beside automatic results. Checks alone pass weak answers and fail good ones.
  - Report results per agent and model, such as "Codex with GPT-6 Luna". One model does not represent its agent or provider. Note a single small-model failure and move on. For the same failure on several models, or on a larger model, find the cause before changes. It is then likely in the skill.
  - Give a case one decision to test. A fixture detail that raises a second question, such as a file that differs in more than the change asked for, makes a failure ambiguous. Read a failing answer before you change the skill.
  - Before you blame a change for a failing case, run that case a few times on the old text and on the new, judged the same way. Single runs vary, and the old text may fail too.
  - Fix patterns shared by failures, never individual cases. A failure is a sample. Case-specific rules or examples turn skills into scripts and stop tests measuring anything.
  - Give cost before running. Match budget claims to runner guarantees. Separate enforced and estimated limits. Unknown cost stays unknown, never zero. Keep large, personal raw runs out of the repository. Record findings in the test's result.
- **Changing a built skill: if the change alters what the design says, agree the design change with the user first.** Then change the design, then the files. A fix that keeps the design true, such as a typo or a lint error, goes to the files only. Follow skillbook-design's instruction to trim or fill.

## The last instruction

**Run repository checks and skillbook-design's checklist before reporting.** Check every file written. List design differences with file and line. Change the design only with the user.
