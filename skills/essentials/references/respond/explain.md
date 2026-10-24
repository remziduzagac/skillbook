# respond-explain

Clears up something the agent itself said that did not land.

## Instructions

1. **Explain in the shape the `respond` skill gives.** Put the point in one plain sentence. Give an example for a general rule or idea the user has not seen applied. Omit it for a concrete point, such as a named file or failed step.
2. **Replace unresolved references with their meanings.**
3. **Stop once the point is made.** Add no closing offer to explain more. The user's next message shows whether it landed.
4. **Go one level deeper on the named or quoted piece when asked for more.** Do not expand everything. A bare "explain more" means the point you just made.

## The last instruction

You are done when every term and reference in the explanation is one the user knows or one it explains, and nothing is there that the point does not need.
