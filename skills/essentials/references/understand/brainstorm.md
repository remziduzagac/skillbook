# understand-brainstorm

Generates distinct options for one question and returns what its caller asked for.

## When to use

Use when one question needs new options, including a request for candidates without a choice. For example, the task may need ideas that differ in kind rather than several wordings of one idea.

## When not

- Unclear intent: use the `understand-clarify` guide to settle what options are needed.
- Known options: use the `understand-weigh` guide to compare them. They do not need generating.
- Facts: read or find sources. Invented options cannot settle a factual question.
- A whole design: return it to the main task’s design work. Options are only one part of a design.
- Several open questions: use the `understand-discuss` guide to handle the topic one part at a time.
- A direct naming request: use the `understand-naming` guide for terminology and collision checks. When naming asks for candidates, return them to it.

## Gives back

The requested options or candidates. Add a comparison and a decision, or why the choice is set aside, only when a choice was requested.

## Rules

1. **Frame one question through the `understand-frame` guide before generating options.** Name several questions separately. Take them one at a time or park them. A topic with several open parts goes to the `understand-discuss` guide. Mixed questions produce options that cannot be compared.
2. **List options before judging any.** Early judgment narrows everything to the first idea, the failure this guide prevents.
3. **Make options differ in kind.** Rewordings of one idea are one option.
4. **Use the `understand-weigh` guide only for a requested choice.** Compare on the same terms. Requested options or candidates need no selection round. Their caller owns what follows.
5. **Follow the `understand` guide's who-decides rule.** For a requested choice, the recommendation is the recommended answer, or the choice is parked with why and what would settle it. Use that rule for disclosure of agent-made choices. When a caller asks for candidates only, return them before making any choice. A tool must not decide its caller's question.

## Advice

- Follow this order: frame, generate, develop, return. When the user requests a choice, weigh the options and return a decision or park the choice.
- List earlier proposals first and mark them earlier. Read where the project keeps them.
- Aim for about three to seven options. Stop when additions repeat. Include easy-to-miss options such as doing nothing or changing the question.
- Ask for the user's picture before offering options when they likely have one. Options steer.
- Develop promising options as needed: make one or two concrete, combine strengths and use the `understand-challenge` guide. Reuse a current challenge instead of repeating it.
- Show what the request needs, by the `respond` guide's first rule. Use the shared who-decides rule for agent-made choices. Show all options when asked. Quiet analysis does not replace a required visible result.
- Name and park a new side topic instead of following it.

Use the `understand-research` guide for a fact an option depends on, and the `understand-research-survey` guide for needed existing alternatives or prior art. Return those results here without taking over generation or choice. Use the `understand-clarify` guide for unclear user intent. Return a whole-design need to the caller. Return any remaining development need rather than calling an active caller back.

Return the question and requested options or candidates. When the user requests a choice, add the comparison and decision or explain why you parked it. Keep no lasting record yourself, by the `understand` guide. Return the developed options, open or parked options and any decision for the skill that saves records. If no skill saves records, offer a long result as a file the user names.

## The last instruction

Check that you have returned what the caller requested: options, candidates, or a choice you weighed and decided or parked. Check distinctness, earlier options, factual gaps and side topics. Follow the `understand` guide's rules. Make no lasting change and start no unrequested choice round.
