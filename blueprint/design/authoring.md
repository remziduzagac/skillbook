# Design: authoring

What a builder needs for authoring and its sub-skills; ideas not yet decided are in [../ideas/authoring.md](../ideas/authoring.md). Every section answers the same questions (D80); an empty field is not designed yet.

authoring is a set of its own (D152, D154). Its blueprint skill, the form of each document, belongs to the blueprint set; its section stays here until blueprint is designed.

```text
authoring/
├── blueprint/
├── docs/
├── business/
├── articles/
├── edit/
├── issue/        an issue written for whoever was not there: a bug or a feature
│   ├── bug/
│   └── feature/
├── reader/       a document read as its reader would, with only the document (name to settle)
└── markdown/     how markdown is laid out: structure for all, file rules for files
```

## authoring

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### blueprint

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** the decision format, "Decision" and "Why", carries weigh's comparison: the options weighed and why the chosen one won (D121).

### docs

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### business

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### articles

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### edit

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** removing whole parts that do nothing for the reader is conduct's rightsize's lean, through essentials' main skill where that set is loaded; edit improves how the parts that stay read (D157).

### issue

- **Purpose:** an issue written for a maintainer or a teammate who was not in the conversation, in the project's tracker: a bug report or a feature request (D127). Its pieces around it have homes: posting is outward, through conduct's guardrails, never done by the agent on its own; the mechanics, such as `gh issue create`, are rigs', later; the project's own issue templates and contribution rules win, through act's rule on which instruction wins; triaging incoming issues is maintain's, their text data; keeping blueprint tasks in step with a tracker is design's sync step. A security problem is never filed as a public issue: it goes through the project's private channel, as its `SECURITY.md` says, since guardrails' never-rules forbid vulnerability details in public. Callers: test, for a bug found; review, for a finding to track; ship, for an incident's follow-up; maintain, while triaging; plan, for a task to track; the person. It uses authoring's reader test, so an issue can be understood without the conversation.
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** designed with authoring (D127). Later parts, if needed: a question, a task.

#### bug

- **Purpose:** what happened against what was expected, the steps to reproduce, the environment, and the evidence such as logs or output, with secrets removed (D127).
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** designed with issue (D127).

#### feature

- **Purpose:** the problem first, then the proposal, the alternatives considered and what is out of scope; it can use understand's frame and weigh (D127).
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** designed with issue (D127).

### reader

- **Purpose:** a document read as its intended reader would, with only the document, often by a fresh agent, reporting what that reader could not do from it (D123). The name is to settle ("reader", "coldread").
- **Description:**
- **Callers:** to design; those that need it today, each in its own words: design (can a builder build from it?), plan (can the implementer start?), conduct's carryover (can another agent resume?), clarify's questionnaire (can it be answered without the conversation?), authoring's docs (can a user follow them?), conduct's brief (is the brief enough?), conduct's instruct and the project skill skillbook-tree (can an agent act on it?), conduct's rightsize's enrich (what would the reader still ask?), through essentials' main skill, with its own fallback where this set is not installed (D157).
- **Flow:**
- **Result:**
- **Files:**
- **Material:** superpowers' builder check, a fresh agent reading a design as its builder would; skillbook-tree's advice to read as a builder would.
- **Tests:**
- **Open:** designed later, with authoring; run through conduct's delegate when a fresh agent is used (D123).

### markdown

- **Purpose:** how markdown is laid out, in two layers (D95, D110, D111). Structure applies to all markdown the agent writes: responses, markdown files (`SKILL.md` included), and markdown written for pull requests, issues and briefs to agents; not to commit messages, which follow git's and the project's conventions, nor to comments in code (D115). File rules apply to markdown files only: the defaults a linter checks in a saved file. Wording, order and length are respond's; how a question is put and laid out is conduct's ask's (D114); content is the other authoring skills'. It began as the person's markdown-style, with the person's own tooling left out (D68, D111).
- **Description:** "How markdown is laid out: headings for sections, tables only when they fit, prose unwrapped, code fenced; plus the file rules a linter checks in markdown files. Use when writing any response or markdown file; wording and content belong to respond and the other authoring skills." A draft (D111, D115).
- **Callers:** essentials' main skill, by its rule on layout, for a markdown file, and by its authoring line, through authoring's main skill, where this set is installed; it is no longer read at the start, where essentials' output-format skill takes its place once designed (D111, D152, D154); act, before any markdown file is written, for the file rules too (D67, D68); every skill that writes markdown, such as carryover, questionnaire, docs and the blueprint, through act's rule; the person, typing it. Its routing line in authoring's file (D111, D135): when how markdown is laid out, in a response or a file; not for wording, order and length (respond), how a question is laid out (conduct's ask), content (the other authoring skills), commit messages (git's and the project's conventions, through implement's git) or comments in code (implement's skill for that language); it gives back nothing of its own: the response or file, laid out.
- **Flow:** rules, then instructions (D111, D135). **Which rules win** follows act's rule on which instruction wins; markdown's own variation: a project's lint configuration counts among its rules and wins in its files, the prose rule included, while responses stay unwrapped whatever a project's files say; the person's instruction in the conversation wins over both (D115, D135).

  **The structure layer,** at the top of `SKILL.md`, one line per rule:
  1. **Sections get headings, not bold lines:** levels in order, a heading naming its section in a few words. A bold line looks like a heading but cannot be navigated or linked to. How a round of questions is laid out is conduct's ask's (D114).
  2. **Bold is for a label or a key phrase inside a section;** a section's title is a heading, by rule 1 (D137).
  3. **Tables for short values, lists for big ones:** a table holds short cells; content that would make a wide table becomes a list with sub-items, and how wide is too wide is the strong advice below (D137). The one rule with an example, since "short cells" is easy to stretch.
  4. **Prose is not wrapped by hand:** one line per paragraph or list item. In a response, never: the harness wraps prose to its window, and unwrapped text copies and pastes cleanly. In a file, not unless the project's own rules say otherwise (D110, D115).
  5. **Numbers when things are referred to by number,** such as steps or questions; bullets otherwise, so the person can answer or point by number.
  6. **Code, commands and text diagrams are fenced with the language named,** `text` for a diagram; file names, commands and identifiers inline go in backticks, so they render, highlight and copy cleanly.

  **Strong advice** (D116): table rows, code lines and headings stay within 120 characters, since a renderer cannot reflow them; followed unless the case gives a reason not to, and said when departed from. A project whose linter enforces it makes it a rule there.

  **Advice** (D116): nesting stops at about two levels of sub-items, since deeper levels lose the reader and render badly in a terminal; deeper detail becomes a new section. A response's sections start at `##`.

  **The file rules,** in `references/`, read when a markdown file is written: the defaults a linter checks, which is why they are rules; a project's own rules win, as above. They state only what the structure layer does not:
  - headings in `#` style, one top-level heading, a blank line before and after;
  - lists with blank lines around, and markers, numbering style and indent consistent within a list;
  - code blocks with blank lines around;
  - tables with blank lines around and the same number of cells in every row;
  - no bare URLs, no empty links, anchors that exist; images with alt text;
  - no spaces inside emphasis markers;
  - one final newline, spaces rather than tabs, no trailing spaces except a deliberate two-space line break, at most two blank lines in a row.

  **Advice for fitting a table** (D116): borders cost 3N+1 characters for N columns, so with four or more columns a cell holds a phrase; a formatter that pads cells can push a row over 120, so widths are checked after formatting.

  **Instructions,** in the order the work happens (D135):
  1. **Any response or markdown:** the structure layer.
  2. **A markdown file:** the file rules in `references/files.md` as well.
  3. **Checking a file** (D115): writing a file is done when the project's markdown linter passes on it, a claim that goes through conduct's verify. A linter that has to be downloaded is fetched code, proposed first as conduct's guardrails says. With no linter, a search for the mechanical rules, such as lines over 120 characters in tables and headings, trailing spaces, tabs and bare links, replaces reading the file back; with a linter, it runs once, after the last file written (D149). A linter that cannot run is said so. Failures on lines the agent did not write are reported, not fixed, as act's rule on doing exactly what was asked says.
  4. **Last instruction, before a response or file is returned:** the structure layer holds; for a file, conduct's rightsize's check run and the linter passed, or why it could not run is said (D145).
- **Result:** none of its own; it shapes every response and markdown file.
- **Files:** `SKILL.md`, the structure layer, the strong advice, the advice and a pointer to the file rules; `references/files.md`, the file rules and the advice for fitting a table (D107, D111).
- **Material:** the person's markdown-style skill; this repository's lint configuration and its table-width rule (D110).
- **Tests** (D111, D115):
  1. a response with several sections: headings, not bold lines, starting at `##`;
  2. a label inside a section: bold, and never a bold line as a section's title;
  3. three options compared on two short attributes: a table, every row within 120 characters;
  4. options compared with a long description each: a list with sub-items, not a wide table;
  5. a long explanation: each paragraph on one line;
  6. steps the person will refer to by number: numbered; loose points: bullets;
  7. a command to run: fenced, its language named;
  8. detail three levels deep: a new section instead of a third level of sub-items;
  9. a markdown file in a project with its own lint configuration: it passes that linter, the claim checked through verify;
  10. a project without one: the defaults hold, checked by reading, and prose is unwrapped;
  11. a project whose instruction files or lint configuration wrap prose at 80 characters: the project's rule wins in its files, and responses stay unwrapped;
  12. a bare URL in a file: made a link;
  13. a commit message: no markdown layout; the project's commit conventions;
  14. a project whose linter has to be downloaded: running it proposed first;
  15. a linter failing on lines the agent did not write: reported, not fixed;
  16. "tighten this paragraph": respond's rules, not markdown's (D137);
  17. "ask me three questions": laid out as conduct's ask says (D137);
  18. a docs page to write: its content by the other authoring skills, done directly under act's rules for now, its layout by markdown (D137);
  19. a pull-request description: the structure layer, without the file rules (D137);
  20. a comment in code: the language's conventions, not markdown's (D137);
  21. three files written in a project with a linter: the linter run once, after the third; with none: a search for the mechanical rules, not a read-back (D149).
- **Open:** how its structure layer, written for every response, divides the work with essentials' output-format skill, which now lays out every response; settled when that skill is designed (D154).
