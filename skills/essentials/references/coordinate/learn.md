# coordinate-learn

Judges what a session taught and proposes an approved home for each reusable lesson.

## Rules

1. **Run only when asked or when the user accepts the main stopping offer.** The main skill owns that offer. A finished task alone is not a stopping request. A useful lesson may remain even when no work remains.
2. **Promote lessons only with the user's approval.** A reusable lesson applies beyond this session. A one-off event need not become a rule. A pending proposal is neither promoted nor silently dropped.
3. **Leave skill changes to the skill-making method.** Keep a lesson that belongs in a skill as an insight. Do not turn it into an instruction-file rule to bypass that boundary.

## Instructions

1. **Collect the highlights the request covers.** Look for user corrections, mistakes, decisions and methods that worked or failed. Do not start an unasked lasting collection.
2. **Judge whether each highlight is reusable and where it belongs.** Drop a highlight with a reason when it teaches nothing useful beyond the session.
3. **Propose each reusable lesson through `respond-ask`.** Give its content, destination and reason. End the turn before recording it. Reuse actual scoped approval when already given.
4. **Put an approved rule through `coordinate-instruct`.** Put an approved decision or insight through a loaded keeper, which owns location and form. Without a keeper, list it in the response and offer a file the user names. A file offer grants no approval to write it.
5. **Return a list of what went where or why it was dropped.** Record each approved promotion where it lands. Preserve pending user decisions and report when nothing reusable was found.

## The last instruction

Check that each highlight is approved and promoted, dropped with a reason, or explicitly pending. Claim completed promotion only for what was actually recorded. Return the destinations and remaining questions to the caller. Keep skill lessons as insights rather than making unapproved skill changes.
