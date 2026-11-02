# coordinate-delegate

## Purpose

Chooses and manages permitted workers, so their work is checked while decisions and authority stay with the caller.

Needs: a permitted way to start agents. Without one, do the work in this conversation and say so in your final answer. A check that must be independent stays to do, with who should do it, by the `act-verify` guide's rule 2. Install nothing, and turn on no mode that needs the user's opt-in.

## When to use

Use when starting another agent now, or when several agents should answer, search or change things. For example, separate work or an independent check may need a worker. Follow the `coordinate` guide’s advice.

## When not

- Writing the worker’s context: use the `coordinate-brief` guide. Choosing a worker and briefing it are separate jobs.
- Continuing work later: use the `coordinate-carryover` guide. These workers start now.
- Deciding whether an independent check is needed: use the `act-verify` guide. It calls this guide to start the checker.

## Gives back

The actual work and check results, task status, cost where needed and cleanup results.

## Rules

1. **Keep conversation, tracking and user decisions in the main session.** Follow the `coordinate` guide's advice for whether work should leave it. Large tool output distracts from the user's thread.
2. **Use a fresh worker when independence is required.** A fork shares the writer's history and blind spots. Do not use a fork for a review, a second check or a council member. Follow the `act-verify` guide's rule 2 to check whether a helper is available and what evidence the check needs.
3. **Choose a fresh worker's tier by the cost of being wrong.** Use the `act-stakes` guide when the applicable row is not plain. If rows overlap, take the higher tier.

   | What catches a mistake? | Tier |
   | --- | --- |
   | Later validation; work is mechanical | light |
   | Later validation; work needs judgment | standard |
   | Nothing, but one commit undoes it | standard |
   | Nothing; shared contracts, production or data | strong |
   | Nothing; schemas, public interfaces, auth or security | strong plus a second check |

   Decisions other work builds on take strong and high effort. Judge their effects, not how easily their file is reverted. Use the strongest-model escalation only after strong falls short. Never use a light worker for judgment that needs a review. Checking weak judgment costs about as much as redoing it at the standard tier. Use the user’s model mapping. Without one, use the session model and report the limitation rather than guessing a model. If a mapped model is unavailable, report the limitation rather than silently substituting one.
4. **Choose effort separately from tier for fresh workers.** Use low effort to carry out known steps, search or collect facts. Use the harness default for ordinary work. Use high effort for judgment that no later step checks, validation, an unclear failure or a design decision. A later check can permit less effort. A tricky checked function can still need high effort. A mechanical security sweep with a validator can use standard and low effort. Keep a fork's model and effort. Change neither the main session's model nor its effort. Set worker effort only through a permitted exposed control.
5. **Check an obstacle before escalating a failed worker.** Missing facts, permissions, network or tools need fixing or a question. A stronger model does not repair them.
6. **Keep delegation inside the caller's authority.** The `act` guide's rule 10 bounds workers. Return questions, proposals for risky actions and approval prompts to the main caller. Do not answer for the user. Respect harness limits on nesting, concurrency, agent kinds and opt-in.
7. **Check returned work through the `act-verify` guide.** A success report alone is not evidence. If verify started the worker, return its report to that active verification instead of starting another verification cycle.
8. **Apply the `act-guardrails` guide's whole cost rule before starting workers.** Starting only one worker does not prove that its cost is trivial. Read the supporting price data only when cost needs stating. Report the estimated cost, uncertain amounts, usage or quota cost, and any enforced spending limits separately. Unknown cost is not zero. Propose a cost that needs approval through the `respond-ask` guide. End the turn before starting. Reuse actual accepted cost only within its kind and scope.
9. **Use only the harness's permitted means or a user-chosen tool.** For a named tool, use its own skill or documentation. Send project data to another harness only when the user allows that harness and has approved sending data for this project to that harness. A worker in another harness is read-only by default. Changes need an approved scope for that worker. Ask before using a harness without a reference. Propose adding an unlisted harness rather than using it.

## Advice

- **Fork or fresh:** list what the worker needs from this conversation: decisions, files read, constraints and what the user wants. Judge by the task's shape; do not count tokens or read transcripts for this. Each turn pays again for the whole context, so a smaller context helps most on long work:
  - long work with a short list: a fresh worker, on a lighter model when the work is mechanical or checked later;
  - long work with a long list, or one that needs the discussion behind it: a fork. If the harness shows its window nearly full, write the list to a file for a fresh worker instead;
  - a short task that reads or produces a lot: a fork;
  - a short task that leaves little behind: do it here, by the `coordinate` guide's advice;
  - a review, a second check or a council member: a fresh worker, by rule 2.
- Search before a reading fanout. Give a broad reading task to light workers only when what is left after the search is much larger than the workers' startup, briefs and reports together, such as hundreds of source files or a year of meeting minutes. Judge this from the material's shape; do not count tokens. A stronger model can help self-contained hard work.
- Use the main skill's progress rule for messages while workers run. Put results and ordinary notices in the final answer. Keep required notices and approval questions at their own timing.
- Take results from the returned report or file. Keep long reports in the scratch place and read only needed parts. Put a report that arrives during another discussion in the next appropriate answer. Ask only about a decision needed now.

## Instructions

Obtain checked results from workers while user decisions and authority stay with the caller. Choose context, ability and cost before startup, then track actual work rather than trusting success reports. **Select and brief permitted workers, track them, then return checked outcomes and unfinished work.**

- The `coordinate-delegate-council` guide: collect independent answers.
- The `coordinate-delegate-fanout` guide: combine findings from separate parts.
- The `coordinate-delegate-crew` guide: coordinate parallel changes.

Read [cost data](delegate/assets/prices.md) only when needed. Read [other-harness rules](delegate/assets/other-harnesses.md) only when another program is named or an allowed one fits.

1. **Choose the work pattern under rule 1 and the `coordinate` guide's advice.** Extra workers can cost more than they save when a search or one worker settles the task.
   - When the user or the guide that called this one names a pattern, such as one agent per supplier contract, use it within their authority.
   - Otherwise, consider one worker first, and search before splitting large reading work. Use several workers for large separate parts, independence, different lenses, time savings the user accepts, or work too big for one worker's context.
   - Whenever several workers will run, read the matching guide above whole before you start them, whoever chose the pattern. Its rules shape the briefs and what you report. Run it inside this call, after controls and approval are settled.
   - A guide that needs one worker uses these startup steps without choosing the pattern again. Workers start no further workers.
2. **Choose fork or fresh using Advice and rule 2.** Shared history saves briefing but can carry the writer's blind spots into a supposed independent check.
   - Use fresh for a review, second check or council member. Otherwise judge needed context and expected reading or output.
   - Use only available capabilities; without a fork, give a fresh worker its needed context.
3. **Use permitted helper controls under rule 9 and “Needs”.** An unavailable helper is a limitation, not permission to bypass an opt-in or install another program.
   - Follow a named tool's skill or documentation. Another harness requires permission for both the harness and sending this project's data; changes also need approved scope.
   - Without them, do the work in this conversation and say so in your final answer. A required independent check stays to do, with who should do it.
4. **Choose a fresh worker's model and effort by rules 3 and 4, and settle cost under rule 8.** An underpowered worker can miss an unchecked error; an unnecessary escalation wastes the user's budget.
   - Choose tier from what catches a mistake and its effects, taking the higher applicable row. Use the user's mapping; report missing mappings or unavailable models rather than silently substituting.
   - Choose effort separately through exposed permitted controls. Keep a fork's model and effort and leave the main session's settings alone.
   - Resolve cost before startup. Separate estimates, uncertainty, quota or usage cost and enforced limits. If approval is needed, ask through the `respond-ask` guide and end the turn before starting.
5. **Prepare the worker's brief through the `coordinate-brief` guide before startup.** Starting without the brief lets the worker begin from an incomplete task.
   - Include scope, missing context, first step, success criterion, operating baseline, report and cleanup requirements.
6. **Start the allowed worker and record its actual identity and state.** An untracked worker can keep running or be reported complete without a result.
   - Keep worker, task, fork or fresh, tier, start time, expected result and status on the running list. Respect nesting, concurrency, kinds and opt-in limits.
   - Use completion notices or permitted waits instead of repeated polling. Keep running, blocked, failed and cancelled distinct from completed work.
   - Without a notice or a permitted wait, return the actual pending state and the missing control to the caller.
7. **Check returned work through the `act-verify` guide, by rule 7.** A success report alone cannot show what changed or whether it passed.
   - Inspect the report's evidence and actual work. Check obstacles before escalating: missing facts, tools, network or permissions need their own resolution.
   - Check the cleanup report through the `act-cleanup` guide. Return a verification worker's result to the active verification rather than starting another cycle.
8. **Report the outcome in your final answer, or in your report to the guide that called this one.** A report that hides partial work can make the caller rely on an unfinished result.
   - Give the outcome, user decisions, proposals, evidence paths, missing work and cost where needed. Keep bulk detail in the scratch place.
   - Say what happened to each worker and what it left behind, under cleaned, kept and proposed. One line serves when nothing is left, such as "all four checkers finished and left no files". Keep each worker's actual status and any pending check.
9. **Check delegated results and “Gives back” before reporting.** Always do this last. Authority and uncertainty can be lost when several worker reports become one answer.
   - Check every completion has evidence or an explicit unverified status. Check failures, pending work, cost, cleanup and the next owner remain visible.
   - Fix unsupported claims before returning to the active caller. Widen no authority and answer no user approval prompt yourself.
