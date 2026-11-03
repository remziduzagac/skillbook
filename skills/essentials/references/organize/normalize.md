# organize-normalize

## Purpose

Extracts a repeated part into one shared home, preserving item-specific details and meaning.

## When to use

Use when several items repeat a part that should have one shared home and references. A repeated definition may belong in a glossary; shared code may belong in one function.

## When not

- Duplicate whole accounts: use the `organize-merge` guide. Normalize shares one repeated part rather than combining the whole items.

## Gives back

The shared part and working references to it. List copies with different meanings and leave them unchanged.

```text
A[x] B[x] → A[→X] B[→X] X
```

## Instructions

Give a repeated part one shared home without erasing meaningful differences. Similar wording is not enough: each eligible copy must mean the same thing. **Find and compare the copies, choose a reachable home, then replace only approved copies with working references.**

1. **Find the repeated part under the `organize` guide.** Extracting an entire item when only one part repeats can lose its local purpose.
   - Identify the shared content and the surrounding item-specific details.
2. **Check that each copy means the same, by the `organize` guide's rule 3.** Similar words can express different rules, and merging them would change what readers follow.
   - A copy that differs in meaning stays whole and unchanged, even where part of it matches the shared part, such as the same price inside a different refund rule. List it as left out of the normalization, with the difference.
   - A copy with the same meaning may sit beside details of its own item, such as a local note. Those details stay in the item, by step 5.
3. **Choose one home every eligible reader can reach, by the `understand` guide's who-decides rule.** A shared definition that some readers cannot load leaves those items incomplete.
   - A definition may belong in a glossary, a rule in its owning guide or skill, or code in a shared function.
   - If no home exists, propose one in the map, by the `organize` guide's step 4. The map's stop covers it, so it needs no turn of its own.
4. **Prepare the shared part to serve all eligible copies.** A version tailored to one item can silently weaken another.
   - Make it general enough for all eligible users and no broader. Write it only after the `organize` guide's map is approved.
5. **Replace eligible copies with references under the approved map.** Leaving one copy behind lets shared content drift again.
   - Keep local details and meaning. Check each reference reaches the shared part.
6. **Check the shared home and “Gives back” before returning to the parent.** Always do this last. One shared file does not prove all eligible items use it correctly.
   - Check the part exists once after application, each eligible item points to it and local meaning survives. Keep differing copies unchanged and listed.
   - Fix broken references or lost details before returning. Include the inventory check. After applying, return the checked result to the `organize` guide's step 6, which asks the user to confirm it.
