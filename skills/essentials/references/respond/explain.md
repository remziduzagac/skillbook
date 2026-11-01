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

Make an earlier point clear where the user did not follow it. Start from the main idea and add only the detail needed for that point. **Explain the missed point in plain words, resolve its references, then stop once it is clear.**

1. **Explain through the `respond` guide's shape, with the point in one plain sentence.** Repeating the same wording can leave the user with the same gap.
   - Give context and basis as needed. Use an example for a general idea the user has not seen applied; omit one for a concrete file or failed step already in front of them.
2. **Replace unresolved references with meanings under the `respond` guide's reference rule.** A bare decision number or unfamiliar term sends the user to another lookup before they can follow the explanation.
   - Keep references they can resolve now. Put an unfamiliar term or reference into words where it is used.
3. **Stop when the point is made, using “Gives back”.** Extra explanation can bury the answer the user needed.
   - Add no closing offer to explain more. Let the user's next message show whether it landed.
4. **Go one level deeper on the requested piece if asked again.** Expanding the whole topic can miss the specific gap the user identified.
   - Follow the piece they name or quote. A bare “explain more” means the point just made.
5. **Check the explanation and “Gives back” before returning.** Always do this last. The user should not need another reference explained just to understand this explanation.
   - Check every term and reference is already known or explained, and every part serves the missed point. Fix unclear terms and remove extras before returning.
