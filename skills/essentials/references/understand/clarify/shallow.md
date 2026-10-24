# understand-clarify-shallow

Gets the whole level before going deeper. Asks the smallest round that sets direction, with recommendations where grounded. Shows "going with" for answers and choices.

## Rules

1. **See the whole level before going deeper into any part.** Start at the request's top level, or an inner level reached by deep. Depth becomes clear only after seeing the whole. Ask the smallest round that sets direction. Ask later questions when needed. Long routine rounds cost more than they settle.
2. **Ask one round through `respond-ask`.** The user answers at once and sees the whole level.
3. **Show "Going with: …" before work.** Sum up decisions, assumptions and open questions the work rests on. The user must see that basis. Do not repeat their latest answers except where you interpreted them. Omit minor choices by the `understand` skill's who-decides rule. Repeating everything hides what matters.

## Advice

Ask first the questions that others depend on. There is no fixed number of questions.

## Instructions

1. **Read across the whole level first.** Ask about unsettled choices belonging to the user by clarify's first rule, such as newsletter length. For your own choices settled only by a likely value, choose it. Show it in "going with", never quietly. Example: rows per page in a new list view.
2. **Leave out questions clarify's rules exclude.** If no user choice remains, ask nothing. Show "going with" by the `understand` skill's who-decides rule.
3. **Ask in one round,** each question with its recommended answer and a short reason, as `respond-ask` says.
4. **End the turn with the round.** Follow `respond-ask`. Take answers when the user replies.
5. **Offer deep for a part with dependent answers that would change the work.** Offer it if unsure too. This ends shallow for that part. Follow the last instruction for the offer. Ask no deep question before a yes. Deep can take many rounds. The user may not see why more questions come or may prefer your guesses.
   - After a yes, the part goes back to clarify, which loads deep.
   - If deep called shallow, the user has said yes already. Make no offer; the part goes back to deep.

You are done when every question in the round is answered, taken with its recommended answer, parked, or in a questionnaire, or when its part has been offered to deep and the user has said yes or no.

## The last instruction

**Show "Going with: …" for the rest before work starts.** Follow rule 3: decisions, assumptions, parked questions and questionnaire items.

In the same response, offer deep for each part handed over:

- Name the part, and say why it needs more questions: its answers depend on each other and would change the work.
- Ask, as `respond-ask` says, whether to question the user on it. Recommend yes, with a short reason. "Go ahead" accepts it.
- If the user declines, treat that part's open questions as `respond-ask` does when the user stops. Take recommendations as assumed. Park questions without recommendations. Supply no fact only the user knows. Show both in "going with" before work on the part.

Hand it back to clarify. What comes next is the work, or deep on a part after a yes.
