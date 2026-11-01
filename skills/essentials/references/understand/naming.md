# understand-naming

## Purpose

Proposes shared names and glossary entries without writing or renaming anything.

## When to use

Use when a shared or public name is open, a new concept needs a term, terms clash, glossary changes need proposing, or a supplied name needs checks. For example, one word used for two concepts needs a terminology check.

## When not

- Local names in code: follow project conventions. They do not need a shared terminology decision.
- Repeated definitions: return them to the work arranging those files. A new name would not remove the duplication.
- Wording: use the `respond` guide or the document-writing task. Naming settles the concept’s term.
- An unclear subject: use the `understand-frame` guide or the `understand-clarify` guide first. The concept must be understood before it is named.
- Applying a rename or glossary edit: return it to the main task. This guide proposes and checks names without writing them.

## Gives back

The chosen name, reasons and rejected words, or proposed glossary changes. Say which existing terms and possible name clashes you checked. Write or rename nothing here.

## Rules

1. **Keep one word per concept and one concept per word.** Add no synonym for an existing term or word already meaning something else in the project or nearby field. Readers could not tell which meaning is meant.
2. **Do not name a part after its whole.** The whole's name would mean two things.
3. **Use a plain word where one works.** Coin only when none works and give the reason. Plain words are understood; coined words must be learned.
4. **Leave a shared name to the user’s choice.** Readers will rely on the chosen term.
   - **For a supplied name, check the glossary, existing usage and potential collisions.**
   - **For a supplied name, report the check results in `Checked`, even when nothing clashes.** The caller needs to know what was checked.
   - Reopen a supplied name for a real conflict under the `act` guide’s concern rule. When the user has settled the name, start no new candidate or approval round.
5. **Return rejected words and reasons.** The caller can record them so they are not proposed again.
6. **Write and rename nothing.** The caller applies approved names and glossary entries under the `act` guide. A wide rename follows the `act-guardrails` guide. Propose the old word under Avoid. Half a rename leaves two words for one thing. For a direct request, the main work flow owns the change.
7. **Propose one glossary definition per term.** Use one sentence, words to avoid and an example where needed. Duplicate definitions drift. The caller writes approved entries.
8. **Flag a term used two ways.** Propose splitting it or holding it to one meaning. Until settled, list it under flagged ambiguities with both meanings, so it is not forgotten.

## Advice

- Say what the thing is to a newcomer.
- Keep names short, easy to say and searchable.
- Fit existing project patterns.
- Avoid clashes with well-known field terms, tools or commands.
- Start from the user's own words where available.
- Avoid abbreviations except established ones and jokes a newcomer would not understand.

## Instructions

Propose a shared name or glossary entry that fits existing terms. Check and prepare the proposal with these steps.

Use the `understand-research-fact` guide for public-name availability from the relevant registry, domain or trademark sources. Return the actual checks and limits here without another naming choice. A limited check is not broader legal or availability certainty.

Return one of these default shapes:

```text
Thing:       what is named
Chosen:      the name and why
Rejected:    words considered and why not
Checked:     potential clashes and results
Avoid:       words to list under the term
```

```text
Term:        the word
Definition:  one sentence
Avoid:       synonyms and nearby meanings
Example:     where needed
```

List unresolved ambiguities with both meanings. Keep no lasting record and write no file yourself. Return the decision, rejected words and proposed glossary changes. The caller writes approved entries; the main work flow does so for a direct request.

Propose the existing glossary as destination. With no existing glossary, propose `GLOSSARY.md` at the project root. The caller creates it when the user approves an entry. Code, docs and contributors share it. In someone else's project, use the location a loaded skill that saves records gives. If no skill saves records, ask the user for the location. These are destination defaults, not permission to write.

1. **Read the glossary and existing usage first.** Clashes give one word two meanings. Check code, docs and design before proposing names.
2. **Handle the open naming choice or supplied name.** An open choice needs candidates; a settled name needs checks. For an open name, ask the `understand-brainstorm` guide for candidates only, compare once through the `understand-weigh` guide on the naming criteria, and ask through the `respond-ask` guide. For a supplied name, use rule 4’s checks without reopening a settled choice.
3. **Return the name or proposed glossary changes.** The caller needs the decision and rejected words to apply or record it. Include check results, reasons, rejected words and any unresolved ambiguities, under the rules above. Write and rename nothing.

4. **Check existing terminology and collisions, clear criteria, reasons and rejected words.** Always do this last. Respect a supplied name unless a real conflict needs raising. Return a chosen name or proposed glossary changes, with any unresolved ambiguity. Leave every write and rename to its owner. Follow the `understand` guide's rules.
