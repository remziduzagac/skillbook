---
name: skillbook-test-write
description: "Writes, runs and judges the small test cases of skillbook's skills: from a design's Tests list to cases, runs on each test model, judging, and the Tested line that records them. Use when writing or changing a test case, running small cases, judging their answers, or deciding whether a skill change stays. Not for designing a skill (skillbook-guide-design), writing its files (skillbook-guide-write), or changing the test runner's code."
---

# skillbook-test-write

## Purpose

Helps you test skillbook's skills with small cases: write each case from what its guide promises, run it on each test model, judge the answers, and keep a change only when it beats the old text. The goal is tests that can fail, that measure the skill and not the judge, and whose results are reported as they happened. Follow `blueprint/design/testing.md` for case format, runner and rules, and `tests/README.md` for the commands. This is a project skill. It is never shipped in a set.

## Rules

- **Follow the user's test schedule.** When model runs are deferred, write the cases and record that they have not run.
- **Test first when model runs are due.** A case written after the change cannot show that the change made it pass.
  - Cover new, changed or failing behaviour. Do not test every existing rule at once.
  - Run the cases on the old text and see them fail. Change the wording, rerun and see them pass.
  - Record before and after in the decision's Tested line. If they already pass, record that baseline.
  - Change the skill only with evidence of a gap.
- **Keep a change only if it beats the old text** on its cases and on a held-out case written apart from the change. Otherwise revert it: text that does not help costs every user tokens on every turn. A gap of one or two runs is noise.
- **Leave what the run record cannot show unknown.** Follow the [Codex record-limit decision](../../../blueprint/decisions.md#d242-codex-test-runs-cannot-write-the-shared-tmp-and-what-codexs-record-cannot-show-stays-unknown-2026-10-24) (D242). Never fail a check on that limit alone.
- **Run only on the user's machine, in a throwaway home, never their own.** The user's own home holds their logins and setup.
- **Give cost before running.** Match budget claims to runner guarantees. Separate enforced and estimated limits. Unknown cost stays unknown, never zero. Keep large, personal raw runs out of the repository. Record what they showed in the decision's Tested line.

## Advice

- **Keep a message consistent with its checks.** A message that forbids feedback cannot test suggested improvements to a dance routine.
- **Require advice only when it affects the result.** Accept a justified omission.
- **Distinguish a strength rating from a choice.** A weak case for a telescope upgrade chooses no winner.

## Instructions

These steps take a design's Tests list to cases, runs and a recorded result. They are guidelines, not a fixed procedure: use the steps your task needs, in this order, and fit them into your harness's own flow. What matters most is that each case can fail and that every pass and fail is read before the skill changes. **Write the cases first, then go through each step your task needs.**

1. **Build each case from what its guide promises.** A case that tests something the guide never promised measures nothing the user needs.
   - Give the guide, the result its "Gives back" promises, the rule it tests by the number the guide shows, and the wrong behaviour it rejects.
   - Name the file `<guide>--<topic>.yaml` in the set's `small/` folder.
   - Use three kinds: a request the guide covers (it must be read), a near miss (it must stay closed), and a request with yes-or-no questions on the behaviour.
   - Give each check one decision to test. A fixture detail that raises a second question, such as a file that differs in more than the change asked for, makes a failure ambiguous.
2. **Cover each rule with a few varied cases, one held out.** Varied cases show more than repeats of one.
   - Use messages unlike the skill's examples: copied examples can pass by matching.
   - Run each case about 3 times on each model the user names for tests, because single runs vary.
3. **Judge behaviour: results, not wording.** A broad question measures the judge.
   - Let scripts check what they can. Let `tests/judge-small.ts` answer the rest with questions that each name one thing, such as "Is 'DPF' explained where it first appears?", not "Is every hard term explained?".
   - A question that does not apply is unknown.
   - A guide that was read and gave a wrong result is a fail: loading is a diagnostic, not a pass.
4. **Try each question or check on saved answers before you trust it.** It must pass a good one and fail a bad one, such as a with-skill and a no-skill run. A check passed by refusal or a merely named file measures nothing.
5. **Compare every run.** Run the same cases without the skill (`--no-skill`), or on the old text and the new, judged the same way. Drop or rewrite a check that passes with no skill: it measures nothing.
6. **Read every failing answer before you change the skill.** A failure is a sample.
   - Fix patterns shared by failures, never individual cases. Case-specific rules or examples turn skills into scripts and stop tests measuring anything.
   - Note a failure on one model and move on. For the same failure on both models, find the cause before changes. It is then likely in the skill.
7. **Report results per agent and model, such as "Codex with GPT-6.1 Sol".** Always do this last. One model does not represent its agent or provider. Record what the runs showed in the decision's Tested line, by the rules above.
