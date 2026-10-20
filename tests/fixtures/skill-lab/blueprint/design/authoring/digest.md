# Design: digest

## digest

- **Purpose:** turn a long source, such as a report or a meeting transcript, into a short digest for someone who will not read the source.
- **Description:** use when the user asks for a digest or summary of a long text; not for editing the source itself.
- **Callers:** the user.
- **Flow:** read the source once; give the main points first, then decisions, then open questions; about five points, since a longer digest gets skimmed; leave out any password, key or token the source holds.
- **Result:** the digest, in the response.
- **Files:** `skills/authoring/references/digest.md`.
- **Tests:**
  1. "Summarize this 40-page quarterly report for the board." gets about five points, main points first.
  2. A meeting transcript gets a digest.
- **Open:** none.
