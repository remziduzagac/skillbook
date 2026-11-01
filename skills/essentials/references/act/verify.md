# act-verify

## Purpose

Checks claims that work is done or correct, using fresh evidence and a clear choice of who checks it.

## When to use

Use before claiming that work is done, fixed, passing, correct or meets its requirements, and when the user asks whether it does. Read it before work starts so needed evidence can be kept. For example, a report’s original numbers may be lost when it is rewritten. Run the checks before making the claim.

## When not

- Getting approval before a risky action: use the `act-guardrails` guide. Verification checks what happened, not permission to act.
- Reviewing finished work about to land: use a skill in the harness’s list for reviewing that kind of work, if one fits. Otherwise use your judgment under the `act` guide. That review examines the work, not just a claim about it.
- Checking whether an idea holds, an outside fact is true, or a research finding is well supported: use the `understand` guide. These are questions about reasoning or sources.

## Gives back

Each claim with its evidence, whether it was confirmed, and who checked it. Put the evidence beside the claim in the report.

## Rules

1. **Choose evidence that would fail if the claim were false.** An unchecked claim reads as true:

   | Claim | Evidence | Not enough |
   | --- | --- | --- |
   | tests pass | the test run: 0 failures | an earlier run, "should pass" |
   | bug fixed | the original symptom, now gone | the code changed |
   | requirements met | a line-by-line checklist | tests passing |
   | another agent's work done | its changes, seen | its own report of success |
   | nothing lost in a merge or split | the inventory of what was there | "looks complete" |
   | something made is correct | each part against its source, or each figure worked out again | "reads right" |

2. **Who checks:**
   - you, for what a command or a file can show;
   - **a fresh agent: before you report high-stakes work, start one that did not do the work to check it.** Your own read of your own work misses what you got wrong.
     - Judge the stakes with the `act-stakes` guide first if they are not judged yet. Judge by reach and undo, not by the size of the change or the time left. One wrong digit in a bank transfer about to go out is high.
     - Start one too when the user asks for an independent check, or when the check needs judgment you cannot give your own work, such as whether a summary is fair to its source.
     - Start the agent through the `coordinate-delegate` guide. Brief it with the claim and what would show it false.
     - Count a check as independent only after you see another agent's or person's result. Your own second look does not count. Neither does starting or waiting on an agent without seeing its result.
     - If you cannot start one, write in your report that this check is still to do, and who should do it. This includes delegated agents and harnesses without agents. Follow the `act` guide's rule 10 for your report;
   - the user: for meaning, taste, irreversible results and anything no check can see. Get any required fresh agent's check first. The user's check does not replace it: asking them to reread is not independent checking.

   How much rides on the work, and whether it can be undone, is the `act-stakes` guide' judgment. The user's check here is of the result; approving a risky action before it is taken is the `act-guardrails` guide'.
3. **Run the check now on the current work.** Earlier runs do not count. Read what would fail if the claim were false: exit code, failure count and failing lines. Read full output only on failure. Full logs in the main session cost again on every later turn.
4. **Report the actual result with evidence beside it.** If confirmed, give the claim. Otherwise give the actual status, by the `respond` guide's outcomes rule.
   - Report only causes and results shown by output, by the `respond` guide's outcomes rule. Report a timed-out test as timed out, not as a guessed slow network.
   - Say what a stand-in, such as a simulated setting or mocked service, actually shows. Mark the real check unverified. Give what would confirm it.
   - Leave taste to the user, by rule 2. For warmer wording, for example, say what you changed and checked. Leave the judgment to them.
5. **Run four more checks before calling a plan's task, commit or pull request done:**
   - **contradiction:** with a decision or another part of the work;
   - **duplication:** of something that already exists, through the `organize` guide's bounded check;
   - **drift:** from the design and the plan;
   - **coverage:** every requirement met, shown with the checklist from rule 1.

   Search for the item's names and decision terms. Read hits in parts, not whole designs. Use the `coordinate-delegate` guide for large reading by a fresh agent on the standard tier, neither lightest nor strongest. Contradiction and drift need judgment.

   Scale checks by the `act-stakes` guide. A full search on a small change costs more than it finds. For plainly low work such as a typo, give about one line on what you checked. Stay inside the task. Report outside problems as one-line follow-ups by the `act` guide's rule 3. A findings report costs more than a one-line change. The whole answer is a few lines: claim and evidence, check line, follow-ups. If the project lacks a design, plan or decisions, say so. Skip checks that need the missing item.

6. **On the third time you run the same check by hand in a conversation, end your answer with a one-line offer to make it a script, a test or a lint rule.** Automation is cheaper and surer. Two runs could be chance; three show repetition.
   - The same check counts across items, such as the same format check on a second and a third file.
   - Write nothing unasked. It is extra work, by the `act` guide's rule 3.

Your own evidence for a claim of done or correct is seen or measured, never only said.

## Instructions

Make each claim about completed or correct work rest on fresh evidence the reader can judge. Choose evidence and a checker before it is lost or the work is reported. **Name the claim, obtain the right check on the current result, then report only what its evidence shows.**

1. **Name the exact claim you are about to make.** A broad claim such as “done” can hide an unchecked part the user will rely on.
   - Identify whether you are claiming a passing test, fixed symptom, met requirement, preserved content or a correct result. Keep needed before-change evidence, such as original report figures or an inventory.
2. **Choose evidence that would fail if the claim were false, by rule 1.** A changed file or plausible explanation does not prove the user's problem was solved.
   - Use a current run for passing tests, the original symptom now gone for a fix, and a requirement checklist for coverage. Compare each made part with its source or recalculate figures.
   - Inspect another agent's actual changes. For a merge or split, use the original inventory rather than judging by appearance.
3. **Choose the checker under rule 2.** Your own second look can repeat the error, while asking the user to reread cannot replace required independence.
   - Check what commands or files can show yourself. For high stakes, requested independence or judgment you cannot give your own work, use the `coordinate-delegate` guide for a fresh checker.
   - Use the `act-stakes` guide if stakes are not settled. Count independence only after seeing another agent's or person's result. If unavailable, name the pending check and who should arrange it.
   - Leave meaning, taste, irreversible results and things no check can see to the user, after any required fresh check.
4. **Run the check now on the current work, by rule 3.** An earlier passing run cannot show what a later edit broke.
   - Read the exit code, failure count and failing lines. Read full output on failure rather than carrying routine full logs in the conversation.
5. **Compare evidence with the claim and report the actual result, by rule 4.** Calling a timeout a pass or guessing its cause gives the user false confidence.
   - Keep evidence beside each confirmed claim. Otherwise give the observed status, including failures, skips or an unverified check.
   - Say what a simulation or mock actually shows and what remains to check in reality. Describe wording changes and checks without deciding the user's taste.
6. **Run contradiction, duplication, drift and coverage checks for a plan's task, commit or pull request, by rule 5.** Individual passing checks can miss a conflict with the rest of the work.
   - Search names and decision terms; compare with decisions, design, plan and every requirement. Use the `organize` guide's bounded check for duplication.
   - Scale to stakes. Name missing design, plan or decisions and skip only checks needing them. Keep outside findings as one-line follow-ups rather than widening the task.
7. **Return each claim with evidence or actual status to the caller.** Evidence separated from the claim is easy to lose when the result is reported again.
   - For results needing a lasting record, use the skill the project's instructions name; otherwise keep them in the response.
   - On the third manual run of the same check, end the answer with rule 6's one-line offer to automate it. Write no automation unasked.
8. **Check the claims and “Gives back” before saying done or correct.** Always do this last. The user should never have to infer which claim remains unverified.
   - Check evidence is beside every claim or its unverified status is explicit. Check actual checker identity, required independence or pending owner, and the scaled four checks where required.
   - Fix unsupported claims or missing checks before reporting. Include the automation offer when due; claim no result or independent check you did not see.
