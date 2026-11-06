---
name: skillbook-write
description: "Writes and changes the files of skillbook's skills from their designs: a set's main skill, the guide files under it, their size, their wording and their tests. Use when building a skill, changing a built skill's files, or testing one. Not for placing, naming, designing or reviewing a skill (skillbook-design), or for instruction files such as AGENTS.md."
---

# skillbook-write

## Purpose

Helps you turn a design into a skill's files: the main skill, its guides and their tests. The goal is files an agent follows as intended, in plain English, at a size it reads whole, and true to the design. This is a project skill. It is never shipped in a set.

## Rules

- **Write from the design.** Find it where skillbook-design says designs live.
  - **List missing rules, cases, routes or fallbacks for the user, then end the turn.** Invent none in files or design. The user settles gaps through skillbook-design before you write them.
  - If the files already do what was asked, report the line that shows it and change nothing.
  - Choose wording, examples and order that keep the design's intent.
  - If file and design disagree, ask the user which is wrong.
  - Before reporting, account for every required rule, route and fallback in the files. Name deferred behaviour and the fallback covering it.
- **Point to shared rules where they live.** Read skillbook-design for set and design locations, name-to-file mapping, exact name rule, how parents open (its checks 8 to 10) and checklist. Copy only text explicitly required word for word, such as the name rule. Do not retype from memory. Duplicate rules drift.
- **Plain English: use common words and short sentences.** Many readers, people and agents, are not native speakers. Plain text is just as exact for agents:
  - Use short sentences with one idea each;
  - Use active voice: "read the file whole", not "the file is read whole";
  - Use normal word order and common words;
  - Use lists instead of clauses chained by semicolons;
  - Use the same word for the same thing, following skillbook's glossary;
  - Call the human "the user", as harnesses do. Call people using the project's output "the project's users" or "end users";
  - Write "the `act` skill" for bare names that look like ordinary words, such as `act` or `respond`. Dashed names such as `respond-ask` need no qualifier.
- **Sharp instructions: give each instruction one clear action.** Models follow short rules and drop soft parts of long or mixed ones:
  - Never pair a message with going on in one instruction, such as "say the plan, then go ahead" or "show a one-line plan and start". The model goes on and writes the message only in its private thinking, which the user never sees. Pick one shape: show it, then end the turn; or put it in the final answer, after the work. "Show the plan. Then end the turn." works;
  - Use visible actions: end the turn, ask, propose, send a message, or write it in the final answer. Avoid "state", "note" and "keep in mind" for what the user must see before the work goes on;
  - Start a flow, a list of steps or a section with its goal, in a sentence or two. Give each step its action, then why it matters. Bare commands tell the reader what to do but not what for, so neither the user nor an agent can follow the flow or adapt it to a new case;
  - Put the must first as one short bold sentence. Give its reason in a separate sentence. Put each exception on its own line;
  - Keep one idea per sentence. Split sentences containing "but", "unless" or lists of cases;
  - Keep a rule's conditions and numbers in its bold must when you split it, such as "after about three attempts" or "as far as you know". Moved to a later sentence, they read as explanation;
  - Keep a rule's bold label when you rewrite it, and put the action after it. Other files and decisions name the rule by its label;
  - Check the shape of a failing rule before adding words. Extra clauses do not fix mixed instructions.
- **Concrete wording: name actions the agent can take.** An agent follows what it can act on:
  - Name the visible action for user-dependent verbs such as wait, ask, stop or confirm. Write "end the turn with the questions; never answer them yourself", not "wait";
  - Name things as tools see them. Call a registered skill by its name, such as `essentials` or `softeng`. Call a guide by its name with the word "guide", such as "the `act` guide" or "the `act-verify` guide": called a skill, a guide makes the agent look for it in its skill list, then search or give up. Give paths only in the main skill's guide map. skillbook-design's Names turns names into files;
  - Give the general term before narrow examples: "a different result, such as code, a document, a decision or an action", not "different code or files";
  - Vary examples across kinds of work, not just code. Give a different example wherever a rule repeats. Repeating one teaches the example, not the rule.
- **Keep each file to about 100 lines.** Count files separately, not the whole skill. Agents may preview longer files instead of reading them whole. Every loaded line costs tokens again. Trim an oversized file first. Then split it into a child or reference at its name's path. Cut no reason, "when not" case or fallback for size. Give the reason for unavoidable extra length in the design's Length field, not in the file: the loading agent does not need it.
- **Write about the job, not skillbook's progress.** Omit "for now", "not built yet" and "until X exists". Name no skill for a step without a built skill. The agent uses judgment where none is named. Progress notes cost tokens and go stale.
- **Block only where continuing would cause harm.** Needless blocks stop requested work. Do not use "stop", "wait", "never", "only" or "must" where a note or judgment would serve. An absolute's reason must cover every forbidden case. Write advice as advice. Use skillbook-design's check 4.
- **Rewrite outside ideas for skillbook,** as skillbook-design's rule on outside material says.

## Advice

- Write for an agent that has only this file and the files above it. Use plain steps and the words the user and the other skills use.
- Give one clear default rather than a list of options. Name an alternative only for the case that needs it.
- A short text diagram helps with a loop, a decision that is easy to miss, or a before-and-after. A long flow can offer a checklist the agent copies and ticks off.

## Instructions

These steps turn a design into a skill's files and their tests. They are guidelines, not a fixed procedure: use the steps your task needs, in this order, and fit them into your harness's own flow. What matters is that the files say what the design says, in a form an agent follows. **Read the design first, then go through each step your task needs.**

1. **Read the design and the files it touches before you write.** Files written from memory drift from the design, and the drift shows only when an agent fails.
   - Find the design where skillbook-design says designs live, with the decisions it cites and the notes under them.
   - Read the files you will change, and the guides that name them.
   - Compare files and design, and act on what you find by the rule "Write from the design": list gaps for the user and end the turn, change nothing where the files already do what was asked, and ask which is wrong when they disagree.
2. **Change a built skill's design before its files.** This step must not move. A file changed beyond its design leaves the design wrong, and the next builder copies it.
   - If the change alters what the design says, agree the design change with the user first, through skillbook-design. Then change the design, then the files.
   - A fix that keeps the design true, such as a typo or a lint error, goes to the files only.
   - To trim or fill a skill, follow skillbook-design's "Trim or fill an existing skill" step.
3. **Turn each designed test into small test cases before you write the files it tests.** A rule that no case can fail can break unseen. When model runs are due, this order is firm: write the cases and see them fail before steps 4 and 5, then rerun them after. A case written after the change cannot show that the change made it pass. Follow `blueprint/design/testing.md` for case format, runner and rules, and `tests/README.md` for the commands. The writing part follows:
   - **Follow the user's test schedule.** When model runs are deferred, write the cases and record that they have not run.
   - **Test first when model runs are due.** Cover new, changed or failing behaviour. Do not test every existing rule at once. Run the cases on the old text and see them fail. Change the wording, rerun and see them pass. Record before and after in the decision's Tested line. If they already pass, record that baseline. Change the skill only with evidence of a gap.
   - **Build each case from what its guide promises.** Give the guide, the result its "Gives back" promises, the rule it tests by the number the guide shows, and the wrong behaviour it rejects. Name the file `<guide>--<topic>.yaml` in the set's `small/` folder. Use three kinds: a request the guide covers (it must be read), a near miss (it must stay closed), and a request with yes-or-no questions on the behaviour.
   - **Cover each rule with a few varied cases, one held out.** Varied cases show more than repeats of one. Run each case about 3 times on each model the user names for tests, because single runs vary. Use messages unlike the skill's examples: copied examples can pass by matching. Run only on the user's machine, in a throwaway home, never their own.
   - **Compare every run.** Run the same cases without the skill (`--no-skill`), or on the old text and the new, judged the same way. Drop or rewrite a check that passes with no skill: it measures nothing.
   - **Keep a message consistent with its checks.** A message that forbids feedback cannot test suggested improvements to a dance routine.
   - **Require advice only when it affects the result.** Accept a justified omission.
   - **Distinguish a strength rating from a choice.** A weak case for a telescope upgrade chooses no winner.
   - **Leave what the run record cannot show unknown.** Follow the [Codex record-limit decision](../../../blueprint/decisions.md#d242-codex-test-runs-cannot-write-the-shared-tmp-and-what-codexs-record-cannot-show-stays-unknown-2026-10-24) (D242). Never fail a check on that limit alone.
   - Judge behaviour: results, not wording. Let scripts check what they can. Let `tests/judge-small.ts` answer the rest with questions that each name one thing, such as "Is 'DPF' explained where it first appears?", not "Is every hard term explained?". A broad question measures the judge. A question that does not apply is unknown. A guide that was read and gave a wrong result is a fail: loading is a diagnostic, not a pass.
   - Before you trust a question or a check, try it on saved answers: it must pass a good one and fail a bad one, such as a with-skill and a no-skill run. A check passed by refusal or a merely named file measures nothing. Read every failing answer before you change the skill.
   - **Keep a change only if it beats the old text** on its cases and on a held-out case written apart from the change. Otherwise revert it: text that does not help costs every user tokens on every turn. A gap of one or two runs is noise.
   - Report results per agent and model, such as "Codex with GPT-6.1 Sol". One model does not represent its agent or provider. Note a failure on one model and move on. For the same failure on both models, find the cause before changes. It is then likely in the skill.
   - Give each check one decision to test. A fixture detail that raises a second question, such as a file that differs in more than the change asked for, makes a failure ambiguous.
   - Fix patterns shared by failures, never individual cases. A failure is a sample. Case-specific rules or examples turn skills into scripts and stop tests measuring anything.
   - Give cost before running. Match budget claims to runner guarantees. Separate enforced and estimated limits. Unknown cost stays unknown, never zero. Keep large, personal raw runs out of the repository. Record what they showed in the decision's Tested line.
4. **Write the main skill so the harness loads it for the right requests and the agent finds every guide.** A description that misses the request leaves the skill unloaded. A map without the name rule leaves guides unread.
   - Start with frontmatter:
     - `name`: the set's name;
     - `description`: what it does and when to load it, in at most 1,024 characters, with no angle brackets and no overlap with another main skill;
     - `compatibility`: a capability the set needs, if any.
   - Write the body in the order of skillbook-design's check 8. Put the guide map, with the exact name rule at its top, between the advice and the instructions.
5. **Write each guide in the shape of skillbook-design's check 8.** The same shape in every guide lets a reader find each part in the same place.
   - Give it a `#` heading with its dashed name, `## Purpose`, `Needs:` if needed, and the three boundary sections by check 9. Then add Rules and Advice where it has them, and Instructions, whose last step is the final check.
   - Write the Instructions as check 8 says: an opening that ends in one clear instruction, then steps that each give the action, why it matters and what doing it well means.
   - Apply the wording rules above to every line, and keep the file to about 100 lines.
   - Turn the design's Files into scripts and templates at skillbook-design's paths. Leave Callers and Material in the design: the loading agent does not need them.
6. **Check every file before you report.** Always do this last. A file that fails the checks or drifts from its design reaches every agent that loads it.
   - Run the repository checks and skillbook-design's checklist on every file you wrote.
   - Account for every required rule, route and fallback, as the rule "Write from the design" says.
   - List differences from the design with file and line. Change the design only with the user.
