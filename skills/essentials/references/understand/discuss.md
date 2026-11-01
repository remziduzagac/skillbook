# understand-discuss

Works through a topic with the user, one item at a time.

## When to use

Use when the user wants to work through several open parts of a topic, plan, design or proposal. A brainstorm with several questions is one example.

## When not

- One question: use the guide or skill for that question. Discussion manages several open parts.
- Unclear intent: use the `understand-clarify` guide to find what the user means.
- A requested view: use the `act` guide. An opinion is not permission to do the work.
- The user did not follow you: use the `respond-explain` guide to explain your earlier point.
- Applying decisions or keeping changes in the project: return that work to the main task. Discussion makes no lasting changes.

## Gives back

What was decided, set aside or passed to another task, with reasons. Include side topics and next steps; give the user the agreed summary.

## Rules

1. **Show the whole before the first item.** Frame the topic through the `understand-frame` guide. Divide it into items. A later item can undo an earlier decision. The list lets the user reorder or drop items.
2. **Discuss one item in each item turn.** Discussing several items at once blurs which answer belongs where. Show the remaining items as a default. Follow the user's request to see more at once. When you close the discussion, invent no extra discussion item, question or recommendation.
3. **Give a recommended answer for each question when the files or conversation give a basis.** Give its reason through the `respond-ask` guide. Otherwise the user does all the thinking.
   - Give no recommendation for a fact only the user knows. Explain why it has none, by the `respond-ask` guide's rule 2.
   - Count an item as decided only after the user agrees. An unagreed choice would become a decision.
4. **Close every item.** Mark the item decided, parked with its reason, or handed on with its destination. An item left silently open becomes an assumption later.
5. **Place side topics.** Discuss a side topic now if it is small or blocks the current item. Otherwise list it as open with where it belongs. Return to the item. Side topics bring useful ideas and forgotten decisions. The caller owns lasting records.
6. **Name the earlier decision when a new one changes it.** Mark it superseded. Conflicting decisions let work follow the old one.
7. **When a topic is complete, give each decision with its reason.** Mark a reason not given as unknown. Invent no reason.
   **Give the next step.**
   **Offer recording through the `respond-ask` guide.**
   **Then end the turn.**

## Advice

- Discuss prerequisites before the items that depend on them.
- Open an item turn with a useful line on what was agreed. Omit an empty line or a summary the user already has.
- Ask a few questions per item through the `respond-ask` guide.
- Update the list when an answer adds, merges or splits items. Show the change in the returned list.
- Keep your view when the user disagrees. Give your reason. Leave the decision to the user.
- Use the `understand-frame` guide when discussion circles.
- Hand a topic that becomes one question to that question's guide or skill.

## Instructions

1. To show the whole topic first, frame the topic through the `understand-frame` guide. Divide it into items. Put the whole list with the first item in the question round.
2. To help settle the current item, use what the item needs. Use the `understand-frame` guide for its problem, the `understand-clarify` guide for user intent, the `understand-brainstorm` guide for options, the `understand-weigh` guide for comparison, the `understand-challenge` guide for an attack, the `understand-argue` guide for a requested case and the `understand-naming` guide for names. Use the `understand-research` guide for an item's factual needs and return to that item. Any other guide or skill may serve an item. Otherwise give your view with reasons. Put open decisions through the `respond-ask` guide. Agent-made choices follow the `understand` guide's who-decides rule.
3. To keep each item’s status clear, close the item. Update remaining items.
4. To avoid losing side topics, place each side topic by rule 5. Keep the current item visible.
5. To keep discussion separate from action, keep independent analysis separate from lasting work. Use available means for analysis that needs no user decision. Return lasting work to the caller. Discussion changes nothing itself.
6. To keep action with its owner, return a requested action to its work-owning caller. This includes an action asked for midway. The caller follows the `act` guide, its plan rule and the `act-guardrails` guide. Resume from its result. Agreement to an item alone authorizes no action.
7. To avoid losing decisions from a long discussion, offer recording when a long discussion risks losing decisions. Use the `respond-ask` guide. End the turn. For a completed topic, follow rule 7. Once the user requests recording, return the record to the caller.
8. To return a usable discussion turn, check each returned turn. Normal item layout is a useful agreed line, one item, actual open questions and remaining items. Use these as defaults, not empty fields to fill. Give recommended answers by rule 3. When no items remain, follow rule 7.

Return the `understand` guide's result shape, adding:

```text
Decided:      each item and why
Parked:       each item, why and what would reopen it
Handed on:    items and destinations
Side topics:  each and where it went
Next:         next steps
```

Use agreed lines to carry the result so far. Gather it in the final summary. Keep no lasting record yourself. The caller passes a requested record to a loaded skill that saves records. If no skill is loaded to save records, the main work flow writes a file the user names. The caller reports what it wrote and where. Commit only when the user asks. When the user says they are stopping, follow the main skill's rule to offer a record of what the session taught and where the work stands. That offer uses the `coordinate-carryover` guide when work remains.

## The last instruction

To close a completed topic, follow rule 7.
Check that you have closed every item and placed every side topic. Use the normal item layout where it helps. Apply the `understand` guide's rules. Make no lasting change yourself.
