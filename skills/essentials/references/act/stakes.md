# act-stakes

Judges the care an action deserves as low, medium or high, from four questions. Returns the judgment to the caller, which decides what to do.

The four questions, each about a mistake in the action judged, such as a wrong value written or the wrong item changed:

- **Undo:** could a mistake be undone, and how easily: from version control, from a backup, or not at all?
- **Reach:** how far would it go: this file, the project, shared contracts, production, other people, the public?
- **Catch:** what would catch a mistake before it does harm: tests, lint, a validator, a review, the user, or nothing?
- **Cost:** what would a mistake cost: time, data, money, trust, security?

The level, from the four answers:

- **low:** a mistake would be caught, or cheaply undone, and stays inside the task;
- **high:** nothing would catch a mistake in time, and at least one of these holds: it is hard to undo; it reaches beyond the task, to shared contracts, production, other people or the public; it would cost data, money or security;
- **medium:** everything between.

## Rules

1. **Judge the actual action from facts.** Read what shows its effects: interface users, test coverage or an existing backup. Mark guesses. A judgment from a feeling changes between skills or runs.
   - Judge where the action lands, not its label. "A quick settings tweak" on the live payment service is not quick.
   - Judge the action asked about. Existing problems, such as other errors in the same spreadsheet, are not its reach or cost. They exist either way. Name them separately as findings.
   - Count what the action does to an existing problem, such as hiding a known failure from people reading a check. Hiding a problem weakens the check. `act-guardrails` always requires a proposal for that, whatever the level.
2. **Take the higher level when unsure.** An unneeded question costs a moment. An unguarded mistake cannot always be undone.
3. **Keep care at or above every rule.** The `act` skill's never-rules, `act-guardrails`' always-proposed kinds, and user or project instructions for more care hold at every level. The `act-stakes` skill can raise care, never lower it below a rule. Otherwise "low stakes" bypasses guardrails.
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

Not here: what could go wrong with an idea is a different question, under the `understand` skill's rules; what a risky action needs is `act-guardrails`'; whether work is done or correct is `act-verify`'s. A judgment that fits none of these is your own, under these rules.

## Instructions

1. **Identify the action and where it lands.** Find missing facts first, such as who calls a function, by the `understand` skill's facts-first rule.
2. **Answer the four questions** from facts, guesses marked. A plainly low case takes a glance.
3. **Set the level** by the definitions above. When unsure, the higher one.
4. **Check it against the rules:** nothing below a guardrail's kind or an instruction to be careful.
5. **Name what would lower it,** when that is cheap and the work is not plainly low.
6. **Return the judgment in this shape.** For plainly low work, use one line: "plainly low" and why.

   ```text
   Undo:    how a mistake would be undone, or that it could not be
   Reach:   how far it would go
   Catch:   what would catch it, or nothing
   Cost:    what it would cost
   Level:   low, medium or high, and why in one line
   Lower:   what would lower it cheaply, if anything
   ```

   How much the user hears:
   - nothing, when the level changes nothing the caller would do anyway;
   - one line with the reason, when it changes what happens, such as asking first, a stronger model, the user checking the result, or a debate of the options;
   - the full shape when the user asks about risk. For plainly low work, give only the line naming low and why, even when asked. Four answers add nothing there. A long report hides the point. Omit facts gathered to judge it, such as every use of a name.

   The `act-stakes` skill keeps nothing. The caller records the judgment where it matters: a decision's reason, a proposal's risk or a delegated brief's model choice.

## The last instruction

**Check the judgment before returning it.** Include the four answers or "plainly low" with its reason. Give the level and a one-line reason. Check that care is not below a rule. Take no action and ask no question here.
