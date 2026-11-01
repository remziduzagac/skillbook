# understand-research-survey

## Purpose

Finds existing candidates and compares them on common terms without taking over the caller's choice.

## When to use

Use when the user needs to know what already exists on a subject, compared on the same terms. Examples include existing tools, papers or alternatives.

## When not

- Inventing options: use the `understand-brainstorm` guide. A survey finds options that already exist.
- Choosing between known options: use the `understand-weigh` guide. The survey supplies the comparison, not the choice.
- One fact about a candidate: use the `understand-research-fact` guide. A field-wide comparison is unnecessary.

## Gives back

Candidates compared on the same terms, sources, excluded and unexamined candidates, search coverage and date.

## Rules

1. **Set the scope and comparison terms before searching.** Reuse the caller's criteria or current frame. Otherwise follow the `understand-frame` guide and the shared who-decides rule. Terms chosen afterward favor the first candidates found.
2. **Search widely before examining candidates deeply.** Use several relevant kinds of source where available. The most visible candidate need not be the best. Report unavailable coverage rather than inventing breadth.
3. **Compare every fully examined candidate on every term.** Give evidence or "not found" for each value. Use no guess or score without a meaningful measure.
4. **Name screened-out candidates with their reasons.** List an unexamined long tail separately as not compared, with the reason and coverage limit. A names-only list is not a completed comparison or an evidence-backed rejection.
5. **Treat the user's own option like every other candidate.** Give each candidate's supported strengths and weaknesses. Favoring one candidate hides information needed for the later choice.
6. **Report search coverage and its date.** Say where you searched, what you skipped and what remains unverified. A survey is a snapshot, not proof that nothing else exists.
7. **Add no survey-only approval checkpoint.** Follow the shared choice, plan and cost rules. End the turn for a required answer or approval. With no user decision needed, put the search scope, comparison terms and how you searched in the final answer. Never pair a message with going on. Actual worker cost approval still happens before startup.
8. **Return the comparison to its active caller.** That caller owns the choice. For a direct user request that includes choosing, obtain the `understand-weigh` guide after the comparison. Do not call an already active weigh operation or restart candidate generation. A request for existing options alone starts no choice round.

## Advice

- Lists and earlier comparisons are leads to check, not findings to repeat unchecked.
- A theme supported by fewer than about three independent origins is an anecdote worth investigating, not an established general finding. Apply this as guidance, with evidence quality and limits, not a vote by source count.
- Report notable absences with where you looked. For each compared candidate, explain who it suits and who it does not.
- Fully compare a useful handful of candidates by default. Name the long tail separately rather than hiding its unexamined status.
- Stop when new searches only return already found candidates. Report the actual coverage limit.
- Refresh an earlier survey by reporting what changed since its date. Recheck facts needed for the current answer. Do not treat old values as current solely because the update is narrow.

## Instructions

Find existing candidates and compare them on terms chosen before the search. Keep excluded candidates separate from ones you have not examined so the caller can see what the survey actually covers. **Set scope, search wide, screen, then compare and return the evidence without taking over the caller’s choice.**

1. **Set scope and comparison terms under rule 1.** Terms chosen after seeing candidates can favor the most visible one and waste the caller's later comparison.
   - Reuse the caller's criteria or current frame. Use the `understand-frame` guide for missing terms and the `understand-clarify` guide for consequential user-owned questions.
   - Add no survey-only approval checkpoint, by rule 7. Shared choice, plan and worker-cost approvals still come before affected work; end the turn when one is needed.
2. **Search wide before deep, by rule 2.** Deep reading of the first candidate can hide better options elsewhere.
   - Search several relevant kinds of source where available. Earlier lists and comparisons are leads to recheck.
   - Search serially unless separate large parts remain after narrowing; then use the `coordinate-delegate` guide with the `coordinate-delegate-fanout` guide. Preserve its limits and validation states.
3. **Screen candidates against scope, by rule 4.** A silent omission can look like an evidence-backed rejection.
   - Name each excluded candidate and its reason. List the unexamined long tail separately with why it was not compared.
   - Fully compare a useful handful by default. Stop when new searches repeat candidates and report that actual limit.
4. **Compare every examined candidate on every term, by rules 3 and 5.** Unequal terms or favoritism hides information the user needs for a later choice.
   - Give evidence or “not found” for every value, including the user's own option. Explain supported strengths, weaknesses and who each candidate suits or does not.
   - Treat themes with few independent origins as anecdotes to investigate, not a vote. Use no score without a meaningful measure.
   - Use a short table or list that fits the medium. When refreshing a survey, report changes and recheck facts needed for the current answer.
5. **Return the comparison to its owner under rules 6–8.** A survey that silently chooses can bypass the caller's decision and conceal incomplete coverage.
   - Give scope, terms, comparison, exclusions, unexamined candidates, searched and skipped areas, date and unverified findings. Add these to the parent's result shape.
   - For a direct request that includes choosing, use the `understand-weigh` guide after comparison. Otherwise return to the active caller without restarting weighing or generation.
   - With no user decision needed, put scope, terms and how you searched in the final answer. Keep lasting records with their owner.
6. **Check the survey and “Gives back” before returning it.** Always do this last. A names-only list cannot stand in for a completed comparison.
   - Check common terms, traceable evidence, honest gaps, exclusions, unexamined candidates, negative results, coverage and date. Preserve actual validation states.
   - Fix missing values or overstated coverage before returning under the `understand-research` guide's final step. Leave the choice with its owner.
