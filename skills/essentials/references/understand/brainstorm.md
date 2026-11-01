# understand-brainstorm

## Purpose

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

1. **Make options differ in kind.** Rewordings of one idea are one option.
2. **Use the `understand-weigh` guide only for a requested choice.** Compare on the same terms. Requested options or candidates need no selection round. Their caller owns what follows.
3. **Follow the `understand` guide's who-decides rule.** For a requested choice, the recommendation is the recommended answer, or the choice is parked with why and what would settle it. Use that rule for disclosure of agent-made choices. When a caller asks for candidates only, return them before making any choice. A tool must not decide its caller's question.

## Advice

- List earlier proposals first and mark them earlier. Read where the project keeps them.
- Aim for about three to seven options. Stop when additions repeat. Include easy-to-miss options such as doing nothing or changing the question.
- Ask for the user's picture before offering options when they likely have one. Options steer.
- Show what the request needs, by the `respond` guide's first rule. Use the shared who-decides rule for agent-made choices. Show all options when asked. Quiet analysis does not replace a required visible result.
- Name and park a new side topic instead of following it.

## Instructions

Generate options that differ in kind for one question. Listing before judging keeps the first idea from crowding out useful alternatives. **Frame, generate, develop and return the requested options; add a choice only when requested.**

Use the `understand-research` guide for a fact an option depends on, and the `understand-research-survey` guide for needed existing alternatives or prior art. Return those results here without taking over generation or choice. Use the `understand-clarify` guide for unclear user intent. Return a whole-design need to the caller. Return any remaining development need rather than calling an active caller back.

Return the question and requested options or candidates. When the user requests a choice, add the comparison and decision or explain why you parked it. Keep no lasting record yourself, by the `understand` guide. Return the developed options, open or parked options and any decision for the skill that saves records. If no skill saves records, offer a long result as a file the user names.

1. **Frame one question with the `understand-frame` guide before generating.** Mixed questions produce options that answer different needs and cannot be compared.
   - Name separate questions and take them one at a time or park them. Use the `understand-discuss` guide for a topic with several open parts.
   - Ask for the user's picture first when they likely have one; offered options can steer it.
2. **List distinct options before judging any, by rule 1.** Early judgment can turn every later option into a version of the first.
   - Read earlier proposals, list them first and mark them earlier. Aim for about three to seven options and stop when additions repeat.
   - Consider easy-to-miss options, such as doing nothing or changing the question. Rewordings count as one idea.
3. **Develop promising options to the depth the caller needs.** A bare name can hide whether an option is usable or has a serious weakness.
   - Make one or two concrete where useful, combine strengths and use the `understand-challenge` guide. Reuse a current challenge.
   - Use the `understand-research` guide for deciding facts and the `understand-research-survey` guide for existing alternatives. Return those findings here. Place side topics rather than following them.
4. **Return options or a requested choice under rules 2 and 3.** Choosing for a caller that asked only for candidates takes over a decision it still owns.
   - Return requested options or candidates without a selection round. For a requested choice, use the `understand-weigh` guide and return the decision or why it is parked and what would settle it.
   - Use the `understand` guide's who-decides rule for visible choices. Return a whole-design or remaining development need to the caller without calling an active caller back.
5. **Check the options and “Gives back” before returning.** Always do this last. A list of renamed duplicates or an unrequested winner does not meet the request.
   - Check distinctness, earlier proposals, factual gaps and side topics. Include developed and open or parked options, with any requested decision.
   - Fix what falls short, follow the `understand` guide's rules and keep lasting records with their owner. Start no unrequested choice round.
