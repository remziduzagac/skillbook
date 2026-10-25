# understand-brainstorm

Generates distinct options for one question and returns what its caller asked for.

## Rules

1. **Frame one question through `understand-frame` before generating options.** Name several questions separately. Take them one at a time or park them. A topic with several open parts goes to `understand-discuss`. Mixed questions produce options that cannot be compared.
2. **List options before judging any.** Early judgment narrows everything to the first idea, the failure this skill prevents.
3. **Make options differ in kind.** Rewordings of one idea are one option.
4. **Use `understand-weigh` only for a requested choice.** Compare on the same terms. Requested options or candidates need no selection round. Their caller owns what follows.
5. **Follow the `understand` skill's who-decides rule.** For a requested choice, the recommendation is the recommended answer, or the choice is parked with why and what would settle it. Use that rule for disclosure of agent-made choices. When a caller asks for candidates only, return them before making any choice. A tool must not decide its caller's question.

## Advice

- Follow this order: frame, generate, develop, return. When the user requests a choice, weigh the options and return a decision or park the choice.
- List earlier proposals first and mark them earlier. Read where the project keeps them.
- Aim for about three to seven options. Stop when additions repeat. Include easy-to-miss options such as doing nothing or changing the question.
- Ask for the user's picture before offering options when they likely have one. Options steer.
- Develop promising options as needed: make one or two concrete, combine strengths and use `understand-challenge`. Reuse a current challenge instead of repeating it.
- Show what the request needs, by the `respond` skill's first rule. Use the shared who-decides rule for agent-made choices. Show all options when asked. Quiet analysis does not replace a required visible result.
- Name and park a new side topic instead of following it.

Find a fact an option depends on from sources. Use `understand-clarify` for unclear user intent. Return a whole-design need to the caller. Return any remaining development need rather than calling an active caller back.

Return the question and requested options or candidates. When the user requests a choice, add the comparison and decision or explain why you parked it. Keep no lasting record yourself, by the `understand` skill. Return the developed options, open or parked options and any decision for a keeper to record. With no keeper, offer a long result as a file the user names.

## The last instruction

Check that you have returned what the caller requested: options, candidates, or a choice you weighed and decided or parked. Check distinctness, earlier options, factual gaps and side topics. Follow the `understand` skill's rules. Make no lasting change and start no unrequested choice round.
