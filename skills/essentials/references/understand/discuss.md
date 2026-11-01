# understand-discuss

## Purpose

Works through a topic with the user so each item is decided, parked or handed on.

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

Work through the topic with the user until each item is decided, parked or handed on. Keep the whole visible while handling one item at a time so later choices do not quietly undo earlier ones. **Frame the topic, settle and close each item, then return the agreed summary and next steps.**

Return the `understand` guide's result shape, adding:

```text
Decided:      each item and why
Parked:       each item, why and what would reopen it
Handed on:    items and destinations
Side topics:  each and where it went
Next:         next steps
```

Use agreed lines to carry the result so far. Gather it in the final summary. Keep no lasting record yourself. The caller passes a requested record to a loaded skill that saves records. If no skill is loaded to save records, the main work flow writes a file the user names. The caller reports what it wrote and where. Commit only when the user asks. When the user says they are stopping, follow the main skill's rule to offer a record of what the session taught and where the work stands. That offer uses the `coordinate-carryover` guide when work remains.

1. **Frame the topic with the `understand-frame` guide, by rule 1.** A later item can undo an early decision if the user never saw the whole.
   - Divide the topic into items, using the `organize` guide where needed. Put the whole list with the first item in the question round.
   - Order prerequisites first. Let the user reorder or drop items before their dependencies are settled.
2. **Use the guide or skill that can settle the current item.** Treating every item as a question of taste can leave facts unchecked and options unexplored.
   - Use the `understand-clarify` guide for intent, the `understand-research` guide for facts, the `understand-frame` guide for a problem and the `understand-brainstorm` guide for new options.
   - Use the `understand-weigh` guide for comparison, the `understand-challenge` guide for weaknesses, the `understand-argue` guide for a requested case and the `understand-naming` guide for names. Any other fitting guide or skill may serve an item; otherwise give your view with reasons.
   - Put open decisions through the `respond-ask` guide, with grounded recommended answers under rule 3. Follow the `understand` guide's who-decides rule for your choices.
3. **Close the item and update the list under rules 3, 4 and 6.** An item left silently open becomes an assumption in later work.
   - Mark decided only after agreement, parked with why, or handed on with a destination. Show changes when an answer adds, merges or splits items.
   - Name a superseded decision when a new one changes it. Keep your reason when you disagree; the user still decides.
4. **Place side topics under rule 5 and return to the item.** Following every tangent loses the thread; ignoring them can lose useful decisions.
   - Take a small or blocking side topic now. Otherwise list it as open with where it belongs, keeping the current item visible.
5. **Keep independent analysis separate from lasting work under the `understand` guide.** An analysis result does not authorize changing the project.
   - Use available means for analysis that needs no user decision. Hand lasting work and records back to the caller; discussion changes nothing itself.
6. **Return a requested action to the work-owning caller.** Agreement about an item alone is not permission to act on it.
   - Return even an action requested midway. The caller follows the `act` guide's plan rule and the `act-guardrails` guide. Resume discussion from its result.
7. **Offer recording through the `respond-ask` guide when decisions risk being lost.** A long discussion can lose decisions at compaction even when they seemed settled.
   - End the turn with the offer. Once recording is requested, return it to the caller; keep no lasting record here.
   - For a completed topic, give decisions and reasons, mark unknown reasons, give the next step and offer recording under rule 7. If the user is stopping, follow the main skill's stopping offer.
8. **Check each turn and “Gives back” before returning it.** Always do this last. The user needs a clear current question or an accurate closing summary, rather than empty fields.
   - For an item turn, check a useful agreed line, one item, actual open questions, grounded recommendations and remaining items. Follow a request to see more at once.
   - For a completed topic, check every item is closed, every side topic placed, and decisions, reasons and next steps are present. Invent no extra item, question or recommendation.
   - Fix omissions before returning under the `understand` guide's rules. Make no lasting change and end the closing turn as rule 7 requires.
