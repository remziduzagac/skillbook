# respond-explain

## Purpose

Clears up something the agent itself said that did not land.

## When to use

Use when the user did not follow something you said, such as “I don’t follow” or “what do you mean?”.

## When not

- Explaining a new topic, such as a function or concept: use the `understand` guide. This method revisits something you already said.
- A document for readers: use a skill in the harness’s list for writing that kind of document, if one fits. Otherwise use your judgment under the `act` guide. It needs writing for that audience.
- A request may need this explanation and one of those other results. Use both methods for their own parts.

## Gives back

The earlier point explained from the main idea to its details, with references in words. Stop once it is clear.

## Instructions

Make the earlier point clear. Explain it from the main idea to its details with these steps:

1. **Explain in the shape the `respond` guide gives.** This makes the missed point clear. Put the point in one plain sentence. Give an example for a general rule or idea the user has not seen applied. Omit it for a concrete point, such as a named file or failed step.
2. **Replace unresolved references with their meanings.** The user needs to understand them without looking them up.
3. **Stop once the point is made.** This keeps the explanation focused. Add no closing offer to explain more. The user's next message shows whether it landed.
4. **Go one level deeper on the named or quoted piece when asked for more.** This answers the actual follow-up. Do not expand everything. A bare "explain more" means the point you just made.

5. **Check the explanation before returning it.** Always do this last. You are done when every term and reference in the explanation is one the user knows or one it explains, and nothing is there that the point does not need.
