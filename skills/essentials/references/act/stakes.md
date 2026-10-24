# act-stakes

Judges how much care something deserves, from four questions, as low, medium or high, and hands the judgment back to the caller, which decides what to do with it.

The four questions:

- **Undo:** could a mistake be undone, and how easily: from version control, from a backup, or not at all?
- **Reach:** how far would it go: this file, the project, shared contracts, production, other people, the public?
- **Catch:** what would catch a mistake before it does harm: tests, lint, a validator, a review, the user, or nothing?
- **Cost:** what would a mistake cost: time, data, money, trust, security?

The level, from the four answers:

- **low:** a mistake would be caught, or cheaply undone, and stays inside the task;
- **high:** nothing would catch a mistake in time, and at least one of these holds: it is hard to undo; it reaches beyond the task, to shared contracts, production, other people or the public; it would cost data, money or security;
- **medium:** everything between.

## Rules

1. **Judge from facts, on what is actually done.** Answer from what you can read, such as who depends on an interface, whether tests cover it, or whether a backup exists, and mark a guess as a guess. Judge the real action and where it lands, not its label: "a quick settings tweak" applied to the live payment service is not quick. A judgment from a feeling changes from one skill or run to the next.
2. **When unsure, take the higher level,** because an unneeded question costs a moment, and an unguarded mistake cannot always be undone.
3. **Never below a rule:** the `act` skill's never-rules, `act-guardrails`' kinds of action that are always proposed, and an instruction from the user or the project to be more careful hold whatever the level is. stakes can raise care, never lower it below a rule. Otherwise "low stakes" becomes a way around a guardrail.
4. **stakes judges; the caller acts:** return the answers and the level. Take no action and ask nothing here; each caller decides what the level means for its own work. The judgment then has one home, and each response to it stays where it is used.
5. **Judge again when what it rests on changes,** such as the change growing, moving from a local copy to production, a test being removed, or a backup turning out to be missing. A level judged at the start goes stale.

## Advice

- **In proportion:** what is plainly low takes a glance, and "plainly low" with its reason is a full answer. Work through the four answers only when it is not plainly low. Reordering a list in notes only you will read is plainly low. One wrong word in the opening hours on a shop's live website is not, because it reaches the public.
- **Catch often decides:** when tests or a validator would catch a mistake before it lands, a change across many files of the project stays low. Where it lands still counts: a change that reaches production is medium even when tests would catch a mistake.
- **Size and subject mislead:** running the project's formatter over two hundred files can be low, and changing one rounding rule in invoice totals can be high.
- **Reach includes people:** others' work, shared branches, messages sent, anything public.
- **Undo means the real way back:** a fix that needs a new release to reach users, a step that deletes records, or a text message already delivered is hard to undo.
- **Cost includes the user's time and trust,** not only data and money.
- **Ways to lower the stakes** are offered to the caller, never applied here: a backup first, a dry run, a branch, a feature flag, a test added before the change. Lowering the stakes is often cheaper than taking the extra care.

Not here: what could go wrong with an idea is a different question, under the `understand` skill's rules; what a risky action needs is `act-guardrails`'; whether work is done or correct is `act-verify`'s. A judgment that fits none of these is your own, under these rules.

## Instructions

1. **Know what is judged:** the action or change, and where it lands. A fact you need that is not at hand, such as who calls a function, find first, as the `understand` skill's rule on facts first says.
2. **Answer the four questions** from facts, guesses marked. A plainly low case takes a glance.
3. **Set the level** by the definitions above. When unsure, the higher one.
4. **Check it against the rules:** nothing below a guardrail's kind or an instruction to be careful.
5. **Name what would lower it,** when that is cheap.
6. **Hand it back** in this shape, or, for what is plainly low, in one line, "plainly low" and why:

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
   - the full shape, when the user asks how risky something is.

   stakes keeps nothing. The caller's own record names the judgment where it matters, such as a decision's reason, a proposal's risk, or a delegated brief's reason for its model.

## The last instruction

Before you hand the judgment back, check: the four answers, or "plainly low" with its reason; the level, with a one-line reason; nothing below a rule; and no action taken or question asked by stakes itself.
