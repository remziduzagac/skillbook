# understand-naming

## Purpose

Proposes shared names and glossary entries without writing or renaming anything.

## When to use

Use when a shared or public name is open, a new concept needs a term, terms clash, glossary changes need proposing, or a supplied name needs checks. For example, one word used for two concepts needs a terminology check.

## When not

- Local names in code: follow project conventions. They do not need a shared terminology decision.
- Repeated definitions: return them to the work arranging those files. A new name would not remove the duplication.
- Wording: use the main skill's step 6 or the document-writing task. Naming settles the concept’s term.
- An unclear subject: use the `understand-frame` guide or the `understand-clarify` guide first. The concept must be understood before it is named.
- Applying a rename or glossary edit: return it to the main task. This guide proposes and checks names without writing them.

## Gives back

For an open name, the candidates, each with why it fits, or the chosen name and why. For a glossary change, the proposed entries. Add the rejected words with their reasons, and which existing terms and possible clashes you checked. Write or rename nothing here.

Use one of these default shapes:

```text
Thing:       what is named
Candidates:  each name and why it fits, while the user still chooses
Chosen:      the name and why, once chosen
Rejected:    words considered and why not
Checked:     what each name was checked against, and the result
Avoid:       words to list under the term
```

```text
Term:        the word
Definition:  one sentence
Avoid:       synonyms and nearby meanings
Example:     where needed
```

Propose the existing glossary as destination. With no existing glossary, propose `GLOSSARY.md` at the project root. The caller creates it when the user approves an entry. Code, docs and contributors share it. In someone else's project, use the location a loaded skill that saves records gives. If no skill saves records, ask the user for the location. These are destination defaults, not permission to write.

## Rules

1. **Keep one word per concept and one concept per word.** Readers could not tell which meaning is meant. Add no synonym for an existing term, and no word already meaning something else in the project or nearby field.
2. **Do not name a part after its whole.** The whole's name would mean two things.
3. **Use a plain word where one works.** Plain words are understood. Coined words must be learned. Coin only when none works, and give the reason.
4. **Leave a shared name to the user’s choice.** Readers will rely on the chosen term.
   - **For a supplied name, check the glossary, existing usage and potential collisions.**
   - **For a supplied name, report the check results in `Checked`, even when nothing clashes.** The caller needs to know what was checked. Give each check, where you looked and what it found, such as "glossary: none in the project". Claim no check wider than the search you ran.
   - **When a supplied name has a real conflict, ask the user through the `respond-ask` guide whether to keep it, then end the turn.** In the question, name the clash and how serious it is, such as a well-known tool with the same name in the same field. This is the main skill's step 5 on raising a concern. When the user has settled the name, start no new candidate or approval round.
5. **Return rejected words and reasons, whether or not a name is chosen yet.** The caller can record them, so they are not proposed again. A word left out for a clash counts.
6. **Write and rename nothing.** The caller applies approved names and glossary entries under the main skill's step 5. A wide rename follows the `act-guardrails` guide. Propose the old word under Avoid. Half a rename leaves two words for one thing. For a direct request, the main work flow owns the change.
7. **Propose one glossary definition per term.** Duplicate definitions drift. Use one sentence, words to avoid and an example where needed. The caller writes approved entries.
8. **Flag a term used two ways.** Propose splitting it or holding it to one meaning. Until it is settled, list it under flagged ambiguities with both meanings, so it is not forgotten.

## Advice

- Say what the thing is to a newcomer.
- Keep names short, easy to say and searchable.
- Fit existing project patterns.
- Avoid clashes with well-known field terms, tools or commands.
- Start from the user's own words where available.
- Use only established abbreviations. Use no joke a newcomer would not get.

## Instructions

Find a shared name or glossary entry that fits the project’s existing words. An open name needs a choice. A supplied name needs checks, without another candidate round. **Read existing terminology first, handle the name as open or supplied, then return the proposal and check results.**

1. **Read the glossary and existing usage before proposing, under rules 1–3.** A familiar word used for two concepts forces readers to guess its meaning.
   - Check code, documents and design. Say what the thing is in words a newcomer can understand. Check whether it already has a term.
   - Look for a part named after its whole, nearby field terms and possible tool or command clashes. Favor plain, short, searchable words that fit project patterns.
2. **Handle an open or supplied name under rule 4.** Another choice round wastes the user's settled decision. Skipped checks can leave a real conflict hidden.
   - For an open name, ask the `understand-brainstorm` guide for candidates only. Compare them once through the `understand-weigh` guide on the naming criteria. Then ask through the `respond-ask` guide. If the user asked for candidates without a pick, skip the comparison and the question. Return each candidate with why it fits.
   - For a supplied name, check the glossary, existing usage and possible collisions. Report the checks even when nothing clashes. For a real conflict, ask the user whether to keep the name, then end the turn, by rule 4.
   - For public availability, use the `understand-research` guide’s “Check a fact” part. Report the actual registry, domain or trademark checks and their limits. A narrow check gives no broader certainty.
3. **Return the name or proposed glossary changes under rules 5–8.** Without rejected words and check results, the caller can repeat old proposals or apply only half a rename.
   - Give the candidates or the chosen name, each with why it fits, the rejected words and why, checked clashes and words to avoid. For a glossary entry, give one sentence per term and an example where needed.
   - List unresolved ambiguities with both meanings. Propose the existing glossary or the destination default above. That is not permission to write.
   - Leave every write and rename to the caller, or to the main work flow for a direct request. A wide rename follows the `act-guardrails` guide.
4. **Check the proposal and “Gives back” before returning it.** Always do this last. A plausible name is not enough if its meaning or checked scope is unclear.
   - Check terminology, collisions, naming criteria, reasons, rejected words and proposed definitions. Respect a supplied name. Do not hide a real conflict.
   - For a supplied name, check that `Checked` gives each check, the glossary, existing usage and collisions, with where you looked and its result, by rule 4.
   - Fix missing checks or unclear meanings before returning, under the main skill's step 1 rules. Report unresolved ambiguities. Write or rename nothing here.
