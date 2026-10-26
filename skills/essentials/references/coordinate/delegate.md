# coordinate-delegate

Chooses and manages permitted workers while keeping decisions, authority and verification with the caller.

Needs: permitted agent tools. Without helper controls, do ordinary work in the main session and report the limitation. Required independence stays outstanding by `act-verify` rule 2. Install nothing and bypass no opt-in.

## Rules

1. **Keep conversation, tracking and user decisions in the main session.** Follow the main skill's delegation advice for whether work should leave it. Large tool output distracts from the user's thread.
2. **Use a fresh worker when independence is required.** A fork shares the writer's history and blind spots. Do not use a fork for a review, a second check or a council member. Follow `act-verify` rule 2 to check whether a helper is available and what evidence the check needs. Missing log events do not prove that no helper was available.
3. **Choose a fresh worker's tier by the cost of being wrong.** Use `act-stakes` when the applicable row is not plain. If rows overlap, take the higher tier.

   | What catches a mistake? | Tier |
   | --- | --- |
   | Later validation; work is mechanical | light |
   | Later validation; work needs judgment | standard |
   | Nothing, but one commit undoes it | standard |
   | Nothing; shared contracts, production or data | strong |
   | Nothing; schemas, public interfaces, auth or security | strong plus a second check |

   Decisions other work builds on take strong and high effort. Judge their effects, not how easily their file is reverted. Use the strongest-model escalation only after strong falls short. Never use a light worker for judgment requiring review. Use the user’s model mapping. Without one, use the session model and report the limitation rather than guessing a model. If a mapped model is unavailable, report the limitation rather than silently substituting one.
4. **Choose effort separately from tier for fresh workers.** Use low effort to carry out known steps, search or collect facts. Use the harness default for ordinary work. Use high effort for judgment that no later step checks, validation, an unclear failure or a design decision. A later check can permit less effort. A tricky checked function can still need high effort. A mechanical security sweep with a validator can use standard and low effort. Keep a fork's model and effort. Change neither the main session's model nor its effort. Set worker effort only through a permitted exposed control.
5. **Check an obstacle before escalating a failed worker.** Missing facts, permissions, network or tools need fixing or a question. A stronger model does not repair them.
6. **Keep delegation inside the caller's authority.** The `act` skill's rule 10 bounds workers. Return questions, proposals for risky actions and approval prompts to the main caller. Do not answer for the user. Respect harness limits on nesting, concurrency, agent kinds and opt-in.
7. **Check returned work through `act-verify`.** A success report alone is not evidence. If verify started the worker, return its report to that active verification instead of starting another verification cycle.
8. **Apply `act-guardrails`' whole cost rule before starting workers.** Starting only one worker does not prove that its cost is trivial. Read the supporting price data only when cost needs stating. Report the estimated cost, uncertain amounts, usage or quota cost, and any enforced spending limits separately. Unknown cost is not zero. Propose a cost that needs approval through `respond-ask`. End the turn before starting. Reuse actual accepted cost only within its kind and scope.
9. **Use only the harness's permitted means or a user-chosen tool.** For a named tool, use its own skill or documentation. Send project data to another harness only when the user allows that harness and has approved sending data for this project to that harness. A worker in another harness is read-only by default. Changes need an approved scope for that worker. Ask before using a harness without a reference. Propose adding an unlisted harness rather than using it.

## Advice

- List the context the worker needs: decisions, files, constraints and user intent. A brief list favors fresh context for long work. A long list needing the discussion favors a fork. A short known task leaving little behind stays in the main session by its advice. A short task that reads or produces a large amount of material favors a fork. Independence still requires fresh context.
- For long work with little context, use fresh context and a lighter model when mechanical or checked. For long work needing much context, use a fork. If the harness shows its window nearly full, give the needed context in a file to a fresh worker. Do not inspect transcripts or calculate token counts for routine choices. Context is paid again each turn, so smaller context helps most on long work.
- Search before a reading fanout. Delegate a broad reading task to light workers only when the material left after searching is much larger than the workers' startup context, briefs and reports. About 80,000–100,000 tokens is a historical estimate. Do not calculate tokens to use that estimate as a trigger. A stronger model can help self-contained hard work.
- Keep a running list of tasks. For each task, record the worker, whether it is a fork or fresh, its tier, its start time, its expected result and its actual status. Use the main skill's progress rule for intermediate messages. Put results and ordinary notices in the final answer. Keep required notices and approval questions at their own timing.
- Wait through completion notices or an exposed waiting tool rather than repeatedly polling. Use the current harness's fallback if it has no notice. Return running, blocked, failed or cancelled status honestly.
- Take results from the returned report or file. Keep long reports in the scratch place and read only needed parts. Put a report that arrives during another discussion in the next appropriate answer. Ask only about a decision needed now.

## Instructions

1. **Choose the work pattern.** Use the caller's named pattern within its authority. Otherwise consider one worker first. Several earn their cost through large separate parts, independence or different lenses, accepted time savings, or a worker's limited window. Search first. Read the matching method below when several workers are needed. Run that method inside this active call after controls and approval are settled. A method's request for one worker uses this call's startup steps without selecting a method again. A single task needs no method child. Workers start no further workers.
2. **Choose fork or fresh by the advice and independence rule.** Use only capabilities actually available. Without a fork, give a fresh worker the needed context.
3. **Use the agent's own permitted controls for helpers.**
4. **Choose a fresh worker's model and effort by rules 3 and 4.** Resolve cost by rule 8 before starting. Report a missing mapping or control. Do not invent one.
5. **Write the worker's brief through `coordinate-brief`.**
6. **Start the authorized worker and record its identity.** Respect limits and keep its actual state on the running list. Use permitted waits while the conversation continues.
7. **Check the returned result by rule 7.** Handle obstacles by rule 5. Ask the worker to clean up before reporting and check its report through `act-cleanup`.
8. **Return a short report to the caller.** Report the task outcome, decisions needed from the user, paths to evidence, missing work and cost where needed. Report cleanup under cleaned, kept and proposed. Distinguish failed or unfinished work from completed work.

9. **council** (`coordinate-delegate-council`): **Read `coordinate-delegate-council` when several independent agents should answer the same question over the same material.**
    - Not for: separate parts or review lenses (`coordinate-delegate-fanout`), disjoint changes (`coordinate-delegate-crew`), or an unrequested recommendation.
    - Gives back: attributed answers, a summary preserving disagreement and missing members.
10. **fanout** (`coordinate-delegate-fanout`): **Read `coordinate-delegate-fanout` when search cannot narrow the work enough and separate large reading tasks, search areas or review angles remain.**
    - Not for: the same whole question to each worker (`coordinate-delegate-council`), parallel changes (`coordinate-delegate-crew`), or work one search settles.
    - Gives back: consolidated findings, actual validation status, sources and coverage limits.
11. **crew** (`coordinate-delegate-crew`): **Read `coordinate-delegate-crew` when agents will change separate items in parallel, with one owner for each shared item.**
    - Not for: changes all landing in one item (one writer), reading only (`coordinate-delegate-fanout`), or a plan-only request (return the plan).
    - Gives back: authorized changes, the final pass, actual verification and unfinished work.

Read [cost data](delegate/assets/prices.md) only when needed. Read [other-harness rules](delegate/assets/other-harnesses.md) only when another program is named or an allowed one fits.

## The last instruction

Every reported completion has checked evidence or an explicit unverified status. The running list preserves failures and pending work. Return a verification worker to its active caller. Report cost and cleanup honestly. Never widen authority or answer a user's approval prompt yourself.
