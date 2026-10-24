# Design: authoring

What a builder needs for authoring and its sub-skills; ideas not yet decided are in [../../ideas/authoring.md](../../ideas/authoring.md). Every section answers the same questions (D80); an empty field is not designed yet.

authoring is a set of its own (D152, D154). The form of each kind of blueprint document belongs to the blueprint set, in [../blueprint/blueprint.md](../blueprint/blueprint.md) (D154, D167).

```text
authoring/
├── docs/
├── business/
├── articles/
├── edit/
├── issue/        an issue written for whoever was not there: a bug or a feature
│   ├── bug/
│   └── feature/
├── reader/       a document read as its reader would, with only the document (name to settle)
└── markdown/     the file rules a linter checks in markdown files; structure is essentials' layout
```

## authoring

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:** not designed yet, except that its rules hold the name rule, worded exactly as in essentials' main skill: "Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, go on with your own judgment, and name the file in your final answer." Calls inside the set name the skill and nothing more (D186, D188).
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

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
- **Open:** removing whole parts that do nothing for the reader is act's rightsize's lean, through essentials' main skill where that set is loaded; edit improves how the parts that stay read (D157).

### issue

- **Purpose:** an issue written for a maintainer or a teammate who was not in the conversation, in the project's tracker: a bug report or a feature request (D127). Its pieces around it have homes: posting is outward, through act's guardrails, never done by the agent on its own; the mechanics, such as `gh issue create`, are rigs', later; the project's own issue templates and contribution rules win, through act's rule on which instruction wins; triaging incoming issues is maintain's, their text data; keeping blueprint tasks in step with a tracker is design's sync step. A security problem is never filed as a public issue: it goes through the project's private channel, as its `SECURITY.md` says, since guardrails' never-rules forbid vulnerability details in public. Callers: test, for a bug found; review, for a finding to track; ship, for an incident's follow-up; maintain, while triaging; plan, for a task to track; the person. It uses authoring's reader test, so an issue can be understood without the conversation.
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

- **Purpose:** the problem first, then the proposal, the alternatives considered and what is out of scope; it can use understand's frame, weigh and argue (D127).
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
- **Callers:** to design; those that need it today, each in its own words: design (can a builder build from it?), coordinate's carryover (can another agent resume?), clarify's questionnaire (can it be answered without the conversation?), authoring's docs (can a user follow them?), coordinate's brief (is the brief enough?), coordinate's instruct (can an agent act on it?), act's rightsize's enrich (what would the reader still ask?), through essentials' main skill, with its own fallback where this set is not installed (D157).
- **Flow:**
- **Result:**
- **Files:**
- **Material:** superpowers' builder check, a fresh agent reading a design as its builder would; skillbook-design's advice to read as a builder would.
- **Tests:**
- **Open:** designed later, with authoring; run through coordinate's delegate when a fresh agent is used (D123).

### markdown

- **Purpose:** the file rules for markdown files: the defaults a linter checks in a saved file, a project's own lint configuration winning in its files, and running the linter (D95, D110, D111, D158). How anything written in markdown is laid out, responses included, is essentials' layout, which this skill builds on where essentials is installed, by the contract between sets; where it is not, a one-line fallback holds the structure (D156, D158). Not for commit messages, which follow git's and the project's conventions, nor comments in code (D115). Wording, order and length are respond's; how a question is put and laid out is respond's ask's (D114); content is the other authoring skills'. It began as the person's markdown-style, with the person's own tooling left out (D68, D111); its structure layer, written for every response, moved to essentials' layout (D158).
- **Description:** "The file rules a linter checks in markdown files, a project's own lint configuration winning, and running the linter; structure comes from essentials' layout. Use when writing or fixing a markdown file; how responses are laid out, wording and content belong to essentials' layout, respond and the other authoring skills." A draft (D111, D115, D158).
- **Callers:** essentials' main skill, by its sixth step, doing it, for a markdown file, through authoring's main skill, where this set is installed; it is not read at the start, where respond's layout is (D111, D152, D154, D158); act, before any markdown file is written, for the file rules (D67, D68); every skill that writes a markdown file, such as carryover, questionnaire, docs and the blueprint, through act's rule; the person, typing it. Its routing line in authoring's file (D111, D135, D158): when a markdown file is written or checked, its file rules and the linter; not for how anything written in markdown is laid out, responses included (essentials' layout), wording, order and length (respond), how a question is laid out (respond's ask), content (the other authoring skills), commit messages (git's and the project's conventions, through implement's git) or comments in code (implement's skill for that language); it gives back nothing of its own: the file, its rules met and its linter passed.
- **Flow:** rules, then instructions (D111, D135). **Which rules win** follows act's rule on which instruction wins; markdown's own variation: a project's lint configuration counts among its rules and wins in its files, the prose rule included, while responses, which are layout's, stay unwrapped whatever a project's files say; the person's instruction in the conversation wins over both (D115, D135, D158).

  **Structure** (D156, D158): essentials' layout, read through essentials' main skill where essentials is installed; the file rules below add to it and repeat none of it. Where essentials is not installed, a one-line fallback: headings for sections, lists over wide tables, prose unwrapped, code fenced.

  **The file rules,** in `references/`, read when a markdown file is written: the defaults a linter checks, which is why they are rules; a project's own rules win, as above. They state only what layout does not:
  - headings in `#` style, one top-level heading, a blank line before and after;
  - lists with blank lines around, and markers, numbering style and indent consistent within a list;
  - code blocks with blank lines around;
  - tables with blank lines around and the same number of cells in every row;
  - no bare URLs, no empty links, anchors that exist; images with alt text;
  - no spaces inside emphasis markers;
  - one final newline, spaces rather than tabs, no trailing spaces except a deliberate two-space line break, at most two blank lines in a row.

  **Advice for fitting a table** (D116): borders cost 3N+1 characters for N columns, so with four or more columns a cell holds a phrase; a formatter that pads cells can push a row over 120, so widths are checked after formatting.

  **Instructions,** in the order the work happens (D135, D158):
  1. **Structure:** essentials' layout, or the fallback above where essentials is not installed.
  2. **The file rules** in `references/files.md`.
  3. **Checking a file** (D115): writing a file is done when the project's markdown linter passes on it, a claim that goes through act's verify. A linter that has to be downloaded is fetched code, proposed first as act's guardrails says. With no linter, a search for the mechanical rules, such as lines over 120 characters in tables and headings, trailing spaces, tabs and bare links, replaces reading the file back; with a linter, it runs once, after the last file written (D149). A linter that cannot run is said so. Failures on lines the agent did not write are reported, not fixed, as act's rule on doing exactly what was asked says.
  4. **Last instruction, before a file is returned:** the structure holds, by layout or the fallback; act's rightsize's check run; the linter passed, or why it could not run is said (D145, D158).
- **Result:** none of its own; it shapes every markdown file.
- **Files:** `SKILL.md`: the pointer to essentials' layout with its fallback, which rules win, the instructions and a pointer to the file rules; `references/files.md`: the file rules and the advice for fitting a table (D107, D111, D158).
- **Material:** the person's markdown-style skill; this repository's lint configuration and its table-width rule (D110).
- **Tests** (D111, D115, D158); the structure tests moved to essentials' layout:
  1. a markdown file in a project with its own lint configuration: it passes that linter, the claim checked through verify;
  2. a project without one: the defaults hold, checked by reading, and prose is unwrapped;
  3. a project whose instruction files or lint configuration wrap prose at 80 characters: the project's rule wins in its files, and responses stay unwrapped;
  4. a bare URL in a file: made a link;
  5. a project whose linter has to be downloaded: running it proposed first;
  6. a linter failing on lines the agent did not write: reported, not fixed;
  7. a docs page to write: its content by the other authoring skills, done directly under act's rules for now, its structure by essentials' layout and its file rules here (D137, D158);
  8. three files written in a project with a linter: the linter run once, after the third; with none: a search for the mechanical rules, not a read-back (D149);
  9. a response, or a pull-request description: essentials' layout, not this skill (D158);
  10. authoring installed without essentials: the fallback line holds the structure, with the file rules and the linter (D156, D158).
- **Open:** none known.
