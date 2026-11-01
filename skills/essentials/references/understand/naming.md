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

Find a shared name or glossary entry that fits the project’s existing words. An open name needs a choice; a supplied name needs checks without another candidate round. **Read existing terminology first, handle the name’s actual status, then return the proposal and check results.**

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

1. **Read the glossary and existing usage before proposing, under rules 1–3.** A familiar word used for two concepts forces readers to guess its meaning.
   - Check code, documents and design. Identify the thing in words a newcomer can understand and check whether it already has a term.
   - Look for a part named after its whole, nearby field terms and possible tool or command clashes. Favor plain, short, searchable words that fit project patterns.
2. **Handle an open or supplied name under rule 4.** Another choice round wastes the user's settled decision; skipping checks can leave a real conflict hidden.
   - For an open name, ask the `understand-brainstorm` guide for candidates only. Compare once through the `understand-weigh` guide on naming criteria, then ask through the `respond-ask` guide.
   - For a supplied name, check glossary, existing usage and possible collisions. Report the checks even when nothing clashes. Reopen only a real conflict through the `act` guide's concern rule.
   - For public availability, use the `understand-research-fact` guide and report the actual registry, domain or trademark checks and their limits. A narrow check gives no broader certainty.
3. **Return the name or proposed glossary changes under rules 5–8.** Without rejected words and check results, the caller can repeat old proposals or apply only half a rename.
   - Give the chosen name and reasons, rejected words and why, checked clashes and words to avoid. For a glossary entry, give one sentence per term and an example where needed.
   - List unresolved ambiguities with both meanings. Propose the existing glossary or the destination default above, without treating that as permission to write.
   - Leave every write and rename to the caller, or the main work flow for a direct request. A wide rename follows the `act-guardrails` guide.
4. **Check the proposal and “Gives back” before returning it.** Always do this last. A plausible name is insufficient if its meaning or checked scope is unclear.
   - Check terminology, collisions, naming criteria, reasons, rejected words and proposed definitions. Respect a supplied name without hiding a real conflict.
   - Fix missing checks or unclear meanings before returning under the `understand` guide's rules. Report unresolved ambiguities and write or rename nothing here.
