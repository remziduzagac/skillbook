# understand-naming

Proposes shared names and glossary entries without writing or renaming anything.

## Rules

1. **Read the glossary and existing usage first.** Check code, docs and design before proposing names. Clashes give one word two meanings.
2. **Keep one word per concept and one concept per word.** Add no synonym for an existing term or word already meaning something else in the project or nearby field. Readers could not tell which meaning is meant.
3. **Do not name a part after its whole.** The whole's name would mean two things.
4. **Use a plain word where one works.** Coin only when none works and give the reason. Plain words are understood; coined words must be learned.
5. **Leave a shared name to the user's choice.** For an open name, ask `understand-brainstorm` for candidates only, compare once through `understand-weigh` on the naming criteria, and ask through `respond-ask`.
   - **For a supplied name, check the glossary, existing usage and potential collisions.**
   - **For a supplied name, report the check results in `Checked`, even when nothing clashes.** The caller needs to know what was checked.
   - Reopen a supplied name for a real conflict under the `act` skill's concern rule. When the user has settled the name, start no new candidate or approval round.
6. **Return rejected words and reasons.** The caller can record them so they are not proposed again.
7. **Write and rename nothing.** The caller applies approved names and glossary entries under the `act` skill. A wide rename follows `act-guardrails`. Propose the old word under Avoid. Half a rename leaves two words for one thing. For a direct request, the main work flow owns the change.
8. **Propose one glossary definition per term.** Use one sentence, words to avoid and an example where needed. Duplicate definitions drift. The caller writes approved entries.
9. **Flag a term used two ways.** Propose splitting it or holding it to one meaning. Until settled, list it under flagged ambiguities with both meanings, so it is not forgotten.

## Advice

- Say what the thing is to a newcomer.
- Keep names short, easy to say and searchable.
- Fit existing project patterns.
- Avoid clashes with well-known field terms, tools or commands.
- Start from the user's own words where available.
- Avoid abbreviations except established ones and jokes a newcomer would not understand.

Find public-name availability from the relevant sources, including registry, domain or trademark checks. Use project conventions for local code names. Return repeated definitions to the work arranging those files. Use `understand-frame` or `understand-clarify` before naming an unclear domain. Wording belongs to the `respond` skill or the work writing the document.

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

Propose the existing glossary as destination. With no existing glossary, propose `GLOSSARY.md` at the project root. The caller creates it when the user approves an entry. Code, docs and contributors share it. In someone else's project, use the location a loaded keeper gives. With no keeper, ask the user for the location. These are destination defaults, not permission to write.

## The last instruction

Check existing terminology and collisions, clear criteria, reasons and rejected words. Respect a supplied name unless a real conflict needs raising. Return a chosen name or proposed glossary changes, with any unresolved ambiguity. Leave every write and rename to its owner. Follow the `understand` skill's rules.
