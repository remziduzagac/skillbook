# act-verify

Checks claims that work is done, fixed, passing, correct or meets requirements, including answers about whether it does. Chooses evidence that would fail if the claim were false and who checks it. Runs it fresh and reports the actual result.

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
     - Judge the stakes with `act-stakes` first if they are not judged yet. Judge by reach and undo, not by the size of the change or the time left. One wrong digit in a bank transfer about to go out is high.
     - Start one too when the user asks for an independent check, or when the check needs judgment you cannot give your own work, such as whether a summary is fair to its source.
     - Start the agent through your harness. Brief it with the claim and what would show it false.
     - Count a check as independent only after you see another agent's or person's result. Your own second look does not count. Neither does starting or waiting on an agent without seeing its result.
     - If you cannot start one, write in your report that this check is still to do, and who should do it. This includes delegated agents and harnesses without agents. Follow the `act` skill's rule 10 for your report;
   - the user: for meaning, taste, irreversible results and anything no check can see. Get any required fresh agent's check first. The user's check does not replace it: asking them to reread is not independent checking.

   How much rides on the work, and whether it can be undone, is `act-stakes`' judgment. The user's check here is of the result; approving a risky action before it is taken is `act-guardrails`'.
3. **Run the check now on the current work.** Earlier runs do not count. Read what would fail if the claim were false: exit code, failure count and failing lines. Read full output only on failure. Full logs in the main session cost again on every later turn.
4. **Report the actual result with evidence beside it.** If confirmed, give the claim. Otherwise give the actual status, by the `respond` skill's outcomes rule.
   - Report only causes and results shown by output, by the `respond` skill's outcomes rule. Report a timed-out test as timed out, not as a guessed slow network.
   - Say what a stand-in, such as a simulated setting or mocked service, actually shows. Mark the real check unverified. Give what would confirm it.
   - Leave taste to the user, by rule 2. For warmer wording, for example, say what you changed and checked. Leave the judgment to them.
5. **Run four more checks before calling a plan's task, commit or pull request done:**
   - **contradiction:** with a decision or another part of the work;
   - **duplication:** of something that already exists;
   - **drift:** from the design and the plan;
   - **coverage:** every requirement met, shown with the checklist from rule 1.

   Search for the item's names and decision terms. Read hits in parts, not whole designs. Delegate large reading to a fresh agent on the standard tier, neither lightest nor strongest. Contradiction and drift need judgment.

   Scale checks by `act-stakes`. A full search on a small change costs more than it finds. For plainly low work such as a typo, give about one line on what you checked. Stay inside the task. Report outside problems as one-line follow-ups by the `act` skill's rule 3. A findings report costs more than a one-line change. The whole answer is a few lines: claim and evidence, check line, follow-ups. If the project lacks a design, plan or decisions, say so. Skip checks that need the missing item.

6. **On the third time you run the same check by hand in a conversation, end your answer with a one-line offer to make it a script, a test or a lint rule.** Automation is cheaper and surer. Two runs could be chance; three show repetition.
   - The same check counts across items, such as the same format check on a second and a third file.
   - Write nothing unasked. It is extra work, by the `act` skill's rule 3.

Not here: a fact about the outside world, such as whether a library still supports an old version, and how strong a research finding is, are questions under the `understand` skill's rules. Your own evidence for a claim of done or correct is seen or measured, never only said.

## Instructions

1. **Name the claim** you are about to make.
2. **Choose the evidence,** by rule 1.
3. **Choose who checks,** by rule 2.
4. **Run it fresh and whole,** by rule 3.
5. **Compare and say it,** by rule 4.
6. **For a plan's task, a commit or a pull request,** do the four checks, by rule 5.
7. **Return each claim with its evidence or actual status to the caller.** If it matters beyond the conversation, such as a finished task, give it to the keeper in the project's instruction files. Without one, keep it in the response.

## The last instruction

**Check before calling anything done or correct.** Each claim has evidence beside it or is marked unverified. Never call your own check independent. Never call a check done or independent if you did not see its result. High-stakes work has a fresh agent's check or an explicit pending check. A plan's task, commit or pull request has the four checks, scaled to stakes. The third manual run has its automation offer, by rule 6.
