# Design: proofread

## proofread

- **Purpose:** check a finished draft for mistakes before it reaches its readers.
- **Description:** use when a draft is done and the user wants it checked; not for writing or restructuring a draft.
- **Callers:** the user.
- **Flow:** load spelling for word-level mistakes and tone for voice; collect what each child found.
- **Result:** proposed corrections, grouped by child; the draft stays unchanged until the user approves them.
- **Files:** `skills/authoring/references/proofread.md`.
- **Tests:** a finished blog post gets both children's findings; a request to rewrite its opening does not load proofread.
- **Open:** none.

## proofread-spelling

- **Purpose:** find misspelled and doubled words.
- **Description:** use when proofread checks words; not for grammar or voice.
- **Callers:** proofread.
- **Flow:** read the draft; list each misspelled or doubled word with its line and the fix, using the agent's own judgment; keep names and quoted text as their owners wrote them.
- **Result:** a list of words, each with its line and fix.
- **Files:** `skills/authoring/references/proofread/spelling.md`.
- **Tests:** "recieve" in a newsletter is listed with its line; a quoted brand name spelled oddly is left alone.
- **Open:** none.

## proofread-tone

- **Purpose:** find sentences whose voice does not fit the draft's readers.
- **Description:** use when proofread checks voice; not for spelling.
- **Callers:** proofread.
- **Flow:** find the readers the draft names; for each sentence whose voice does not fit them, propose a rewording with the reason.
- **Result:** a list of sentences, each with a proposed rewording and its reason.
- **Files:** `skills/authoring/references/proofread/tone.md`.
- **Tests:** a joke in a formal apology is flagged with a proposed rewording; a casual line in a team chat message is not.
- **Open:** none.
