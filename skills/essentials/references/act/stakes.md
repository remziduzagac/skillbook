# act-stakes

## Purpose

Judges how careful an action needs to be from the effects of a mistake and how it could be caught or undone.

## When to use

Use when the user asks how risky an action is or what a mistake would cost, or when a guide needs to know how careful an action should be. For example: “how bad would it be if the price import went wrong?” A request that is both a risk question and an action, such as “can I archive these without checking with anyone?”, reads this guide, then the `act-guardrails` guide.

## When not

- Deciding whether an action needs approval: use the `act-guardrails` guide. A risk level does not grant approval.
- Finding weak points in an idea: use the `understand-challenge` guide. That question concerns the idea, not the care an action needs.
- Checking whether work is done or correct: use the `act-verify` guide for evidence.
- Reviewing code security: use a skill in the harness’s list for code security review, if one fits. Otherwise use your judgment under the main skill's step 5. This guide only judges the care needed.

## Gives back

The risk level and a short reason, with the four answers or a “plainly low” judgment. When the user asked about the risk, they see the level and the four answers in plain words, unless it is plainly low. Otherwise the task that asked decides what the user needs to see.

The four questions, each about a mistake in the action judged, such as a wrong value written or the wrong item changed:

- **Undo:** could a mistake be undone, and how easily: from version control, from a backup, or not at all?
- **Reach:** how far would it go: this file, the project, shared contracts, production, other people, the public?
- **Catch:** what would catch a mistake before it does harm: tests, lint, a validator, a review, the user, or nothing?
- **Cost:** what would a mistake cost: time, data, money, trust, security?

The level, from the four answers:

- **Low:** a mistake would be caught, or cheaply undone, and stays inside the task;
- **High:** nothing would catch a mistake in time, and at least one of these holds: it is hard to undo; it reaches beyond the task, to shared contracts, production, other people or the public; it would cost data, money or security;
- **Medium:** everything between.

## Rules

1. **Judge the actual action from facts.** Read what shows its effects: interface users, test coverage or an existing backup. Mark guesses. A judgment from a feeling changes between guides or runs.
   - Judge where the action lands, not its label. "A quick settings tweak" on the live payment service is not quick.
   - Judge the action asked about. Existing problems, such as other errors in the same spreadsheet, are not its reach or cost. They exist either way. Name them separately as findings.
   - Count what the action does to an existing problem, such as hiding a known failure from people reading a check. Hiding a problem weakens the check. The `act-guardrails` guide always requires a proposal for that, whatever the level.
2. **Take the higher level when unsure.** An unneeded question costs a moment. An unguarded mistake cannot always be undone.
3. **Keep care at or above every rule.** The main skill's never-rules, the `act-guardrails` guide's always-proposed kinds, and user or project instructions for more care hold at every level. The `act-stakes` guide can raise care, never lower it below a rule. Otherwise "low stakes" bypasses guardrails.
4. **Return the answers and level without acting or asking.** The caller decides what the level means for its work. Judgment has one home. Each response to it stays where it is used.
5. **Judge again when the basis changes.** Examples: a change grows, moves from a local copy to production, loses a test, or has no backup after all. The starting level goes stale.

## Advice

- **Use a glance for plainly low work.** "Plainly low" with its reason is a full answer. Work through all four answers otherwise. Reordering notes only you read is plainly low. One wrong word in a shop's live opening hours is not: it reaches the public.
- **Consider what catches mistakes.** Tests or a validator catching mistakes before they land can keep a change across many project files low. Where it lands still counts. A production change is medium even with tests.
- **Size and subject mislead:** running the project's formatter over two hundred files can be low, and changing one rounding rule in invoice totals can be high.
- **Reach includes people:** others' work, shared branches, messages sent, anything public.
- **Undo means the real way back:** a fix that needs a new release to reach users, a step that deletes records, or a text message already delivered is hard to undo.
- **Cost includes the user's time and trust,** not only data and money.
- **Offer ways to lower stakes to the caller.** Never apply them here. Examples: a backup, dry run, branch, feature flag or test before the change. Lowering stakes is often cheaper than extra care.

A judgment that fits none of the guides under "When not" is your own, under these rules.

## Instructions

Judge the care an action needs from the effects of a mistake, rather than its size or label. Undo, reach, catch and cost give the caller one grounded level without taking action here. **Identify the actual action, answer the four questions, then return the level and any cheap ways to lower it.**

1. **Identify the action and where it lands, by rule 1.** A small edit on a public or live surface can have effects its label hides.
   - Read facts that show callers, coverage, backups or recipients by the main skill's step 1 (explore the sources before you ask or assume anything).
   - Judge effects caused by this action. Keep pre-existing problems separate, while counting an action that hides them as weaker checking.
2. **Answer Undo, Reach, Catch and Cost from facts, by rule 1.** A feeling about risk can change from one guide to another and leave the user with inconsistent care.
   - Say how a mistake is undone, who or what it reaches, what catches it before harm and its cost in time, data, money, trust or security. Mark guesses.
   - A plainly low case needs only a glance and its reason. Work through all four answers otherwise.
3. **Choose low, medium or high from the definitions above, by rule 2.** Understating an uncertain level can leave a mistake uncaught when it matters.
   - Take the higher level when unsure. Judge real consequences: a sent message or a fix needing another release is harder to undo than editing its source file.
4. **Keep care at or above guardrails and instructions, by rule 3.** A low label must not become permission to skip a required safeguard.
   - Check the main skill's never-rules, always-proposed kinds in the `act-guardrails` guide, and user or project instructions requiring more care.
5. **Offer cheap ways to lower stakes for work that is not plainly low, using Advice.** Reducing exposure can cost less than adding a large review to the same risky action.
   - Consider a backup, dry run, branch, feature flag or test. Offer them to the caller rather than applying them here.
6. **Return the judgment under rule 4.** The caller needs a usable level, not a second guide making its action or approval decision.

   ```text
   Undo:    the real way back, or none
   Reach:   where a mistake goes
   Catch:   what catches it before harm, or nothing
   Cost:    what the mistake costs
   Level:   low, medium or high, with a one-line reason
   Lower:   cheap ways to lower it, if any
   ```

   - For plainly low work, give only “plainly low” and why, even when asked about risk. Otherwise use the full shape when the user asks about the risk, one line when it changes the caller's action, or nothing when it changes nothing.
   - Keep facts gathered only to judge it out of the user-facing result. The caller records the level where it matters. Rejudge under rule 5 when scope, destination, checks or undo changes.
7. **Check the judgment and “Gives back” before returning.** Always do this last. A correct-looking level without its basis cannot guide consistent care.
   - Check the four answers or a plainly low reason, level, uncertainty and required safeguards. Fix any unsupported basis or level below a rule.
   - Return without taking action or asking a question here. Leave the caller to use the judgment.
