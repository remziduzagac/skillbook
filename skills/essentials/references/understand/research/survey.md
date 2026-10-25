# understand-research-survey

Finds existing candidates and compares them on common terms without taking over the caller's choice.

## Rules

1. **Set the scope and comparison terms before searching.** Reuse the caller's criteria or current frame. Otherwise follow `understand-frame` and the shared who-decides rule. Terms chosen afterward favor the first candidates found.
2. **Search widely before examining candidates deeply.** Use several relevant kinds of source where available. The most visible candidate need not be the best. Report unavailable coverage rather than inventing breadth.
3. **Compare every fully examined candidate on every term.** Give evidence or "not found" for each value. Use no guess or score without a meaningful measure.
4. **Name screened-out candidates with their reasons.** List an unexamined long tail separately as not compared, with the reason and coverage limit. A names-only list is not a completed comparison or an evidence-backed rejection.
5. **Treat the user's own option like every other candidate.** Give each candidate's supported strengths and weaknesses. Favoring one candidate hides information needed for the later choice.
6. **Report search coverage and its date.** Say where you searched, what you skipped and what remains unverified. A survey is a snapshot, not proof that nothing else exists.
7. **Add no survey-only approval checkpoint.** Follow the shared choice, plan and cost rules. End the turn for a required answer or approval. With no user decision needed, put the read-only approach, scope and terms in the final answer. Never pair a message with going on. Actual worker cost approval still happens before startup.
8. **Return the comparison to its active caller.** That caller owns the choice. For a direct user request that includes choosing, obtain `understand-weigh` after the comparison. Do not call an already active weigh operation or restart candidate generation. A request for existing options alone starts no choice round.

## Advice

- Lists and earlier comparisons are leads to check, not findings to repeat unchecked.
- A theme supported by fewer than about three independent origins is an anecdote worth investigating, not an established general finding. Apply this as guidance, with evidence quality and limits, not a vote by source count.
- Report notable absences with where you looked. For each compared candidate, explain who it suits and who it does not.
- Fully compare a useful handful of candidates by default. Name the long tail separately rather than hiding its unexamined status.
- Stop when new searches only return already found candidates. Report the actual coverage limit.
- Refresh an earlier survey by reporting what changed since its date. Recheck facts needed for the current answer. Do not treat old values as current solely because the update is narrow.

## Instructions

1. **Establish scope and terms by rule 1.** Ask user-owned consequential questions through `understand-clarify` when needed. Reuse a current caller frame.
2. **Search wide before deep.** Use `coordinate-delegate` with `coordinate-delegate-fanout` only for separate large parts that search cannot narrow enough. Otherwise search serially. Keep fanout's common worker limits and actual validation states.
3. **Screen each candidate against scope.** Name the reason for each exclusion and distinguish unexamined candidates.
4. **Compare on the agreed terms with evidence.** Give every compared candidate each term or an honest gap. A short table may help; use a list when the medium, width or user preference favors it.
5. **Return the requested comparison by rule 8.** Add scope, terms, screened-out candidates, the unexamined long tail, search coverage and date to the parent's result shape. Keep findings and unknowns with their actual evidence status.

## The last instruction

Check all compared candidates use the same terms and traceable evidence. Report exclusions, unexamined candidates, negative results, coverage and date honestly. Keep any choice and lasting record with its owner. Follow the parent's last instruction and return without recursively calling the caller.
