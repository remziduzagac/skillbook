# act-verify

Evidence before you say that work is done, fixed, passing, correct or meets its requirements, or answer whether it does: the check that would fail if the claim were false, chosen with who runs it, run fresh, and its result stated as it is.

## Rules

1. **Evidence that would fail if the claim were false,** because a claim nobody checked reads as true:

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
   - a fresh agent, one that did not do the work: when `act-stakes` rates the work high, when the user asks for an independent check, or when the check needs judgment you cannot give your own work, such as whether a summary is fair to its source. If the stakes are not judged yet, judge them with `act-stakes` before you choose. The stakes come from how far the result reaches and whether it can be undone, never from the size of the change or the time a check takes: one wrong digit in a bank transfer about to go is high. Start it with your harness's own way of starting an agent, and brief it with the claim and what would show it false. A check is independent only when another agent or a person made it and you saw its result; your own second look never is, and neither is an agent you started or waited on whose result you did not see. If you cannot start one, such as when you are a delegated agent or your harness has no way to, mark that part unverified and say who should check it; the `act` skill's rule 10 says what goes into your report;
   - the user, for meaning, taste, anything that cannot be undone, and anything no check can see. Where a fresh agent's check is due too, the user's comes after it, never in its place, because asking the user to read it again is not an independent check.

   How much rides on the work, and whether it can be undone, is `act-stakes`' judgment. The user's check here is of the result; approving a risky action before it is taken is `act-guardrails`'.
3. **Fresh and whole:** run the check now, on the work as it is; an earlier run does not count. Read what would fail if the claim were false: the exit code, the count of failures and the failing lines. Read the full output only when something fails, because a full log in the main session is paid for on every later turn.
4. **The result as it is:** confirmed, state the claim with its evidence beside it; not confirmed, state the actual status with its evidence, as the `respond` skill's rule on outcomes says.
   - State a cause or a result only as the output shows it, by the `respond` skill's rule on outcomes: a test that timed out is reported as timed out, never as a slow network you guess.
   - A stand-in, such as a simulated setting or a mocked service, shows only what it stands in for. Say so, and mark the real check unverified, with what would confirm it.
   - A matter of taste, such as whether a text now sounds warmer, is the user's, by rule 2: say what you changed and what you checked, and leave the judgment to them.
5. **Four more checks** for a plan's task, a commit or a pull request, before it is called done:
   - **contradiction:** with a decision or another part of the work;
   - **duplication:** of something that already exists;
   - **drift:** from the design and the plan;
   - **coverage:** every requirement met, shown with the checklist from rule 1.

   Search for the item's names and its decision's terms, and read the hits in parts, not whole designs. When the reading is large, give it to a fresh agent on the standard tier, neither the lightest nor the strongest model, because contradiction and drift are judgments.

   Scale them with what `act-stakes` says, because the full search on a small change costs more than it finds. Plainly low work, such as a typo fix, gets about one line saying what you looked at, and nothing outside the task: name a problem you find outside it as a follow-up, one line each, by the `act` skill's rule 3, because a findings report on a one-line change costs the user more than the change. The whole answer is then a few lines: the claim with its evidence, that line, and the follow-ups. Where the project has no design, plan or decisions, say so, and skip the checks that need one.

6. **A check repeated by hand:** by the third time in a conversation that you run the same check by hand, on the same item or another, offer in one line to make it a script, a test or a lint rule, because that is cheaper and surer. Two could be chance; three show it repeats. Don't write one unasked, because it is work the user did not ask for, by the `act` skill's rule 3.

Not here: a fact about the outside world, such as whether a library still supports an old version, and how strong a research finding is, are questions under the `understand` skill's rules. Your own evidence for a claim of done or correct is seen or measured, never only said.

## Instructions

1. **Name the claim** you are about to make.
2. **Choose the evidence,** by rule 1.
3. **Choose who checks,** by rule 2.
4. **Run it fresh and whole,** by rule 3.
5. **Compare and say it,** by rule 4.
6. **For a plan's task, a commit or a pull request,** do the four checks, by rule 5.
7. **Hand back** each claim with its evidence, or the actual status, to the caller. Where it matters beyond the conversation, such as a finished task, give it to the keeper the project's instruction files point to, if any; with none, it stays in the response.

## The last instruction

Before you say anything is done or correct, check: every claim in the response has its evidence beside it, or is marked unverified; nothing you checked yourself, and no check whose result you did not see, is called independent or done; work rated high has had a fresh agent's check, or the response says that check is still to do; for a plan's task, a commit or a pull request, the four checks are done, in proportion to the stakes; and a check you have run by hand for the third time has its offer, by rule 6.
