# Design: authoring, the main skill

## authoring

- **Purpose:** the authoring set's main skill: it holds the rules for every piece of writing work and opens the set level by level, one line per skill under it.
- **Description:** "Checks and condenses writing: proofreading a finished draft, tracing its quotations and figures to sources, and digesting a long text for someone who will not read it. Load it for work on a draft or a long text; not for writing code."
- **Callers:** the harness, by its description; the user, typing it.
- **Flow:**
  1. **Rules:** the name rule, worded exactly as skillbook-design's Names gives it; a draft the user wrote is changed only after the user approves the proposed changes, since it is their text.
  2. **Instructions,** one line per skill, each loaded when its step comes:
     - proofread: when a finished draft needs checking for spelling or voice; not for restructuring it; gives back proposed corrections, grouped by kind;
     - cite: when a draft quotes people or gives figures; not for spelling or voice; gives back each quotation and figure with its source or marked as having none;
     - digest: when the user wants a long text condensed; not for editing it; gives back the digest in the response.
  3. **The last instruction:** before returning, each proposed change to the user's draft is listed for approval, none applied.
- **Result:** none of its own.
- **Files:** `skills/authoring/SKILL.md` only; the set needs no capability of its own.
- **Tests:** "tidy up the wording of my cover letter" loads proofread; "shorten the board minutes to one paragraph" loads digest; "fix the failing build" does not load authoring.
- **Open:** none.
