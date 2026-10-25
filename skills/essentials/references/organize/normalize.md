# organize-normalize

Extracts a repeated part into one shared home, preserving item-specific details and meaning.

```text
A[x] B[x] → A[→X] B[→X] X
```

## Instructions

1. **Find the repeated part.**
2. **Check that it means the same thing in each eligible item.** Similar words are not enough. Leave copies with different meanings unchanged. List those copies as excluded from normalization.
3. **Choose one home every eligible reader can reach.** A definition may belong in a glossary, a rule in the skill whose scope it covers, or code in a shared function. Follow the parent's shared choice rule. If no home exists, propose one through `respond-ask`. End the turn.
4. **Prepare the shared part once.** Make it general enough for every eligible user and no broader. Write the shared part only after the user approves the `organize` skill's map.
5. **Replace eligible copies with working references under the approved map.** Keep item-specific details and meaning. Check each reference reaches the shared part.

## The last instruction

Return the proposal or authorized result to the parent. The shared part exists once after applying. Every eligible copy points to it and keeps its meaning. Differing copies remain unchanged and listed. Follow the `organize` skill's inventory check and both approval checkpoints.
