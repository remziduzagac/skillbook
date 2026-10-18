# respond-layout

How anything the agent writes in markdown is laid out: responses, markdown files, pull-request and issue text, and briefs to agents.

## Rules

Which rules win follows `act`'s rule on which instruction wins: in a markdown file, the project's lint configuration wins over these rules, the prose rule included; the person's instruction in the conversation wins over both.

1. **Sections get headings, not bold lines:** levels in order, each heading naming its section in a few words, since a bold line looks like a heading but cannot be navigated or linked to. A round of questions is laid out as `respond-ask` says.
2. **Bold is for a label or a key phrase inside a section;** a section's title is a heading, by rule 1.
3. **Tables for short values, lists for big ones:** a table holds short cells, such as three options compared on two short attributes, and its rows stay within 120 characters, since a wider row wraps into noise in a terminal; content that would make a wide table becomes a list with sub-items. When a table is worth it at all is the strong advice below.
4. **Prose is not wrapped by hand:** one line per paragraph or list item. In a response, never, since the harness wraps prose to its window and unwrapped text copies and pastes cleanly; in a file, not unless the project's own rules say otherwise.
5. **Numbers when things are referred to by number,** such as steps or questions; bullets otherwise, so the person can answer or point by number.
6. **Code, commands and text diagrams are fenced with the language named,** `text` for a diagram; file names, commands and identifiers inline go in backticks, so they render, highlight and copy cleanly.

## Strong advice

Followed unless the case gives a reason not to, and said when departed from:

- **Lists over tables:** a list by default; a table only for short values compared across items, since a list holds any length and reads well in a terminal.
- **Code lines and headings stay within 120 characters,** since a renderer cannot reflow them. A project whose linter enforces it makes it a rule there.

## Advice

- Nesting stops at about two levels of sub-items, since deeper levels lose the reader and render badly in a terminal; deeper detail becomes a new section.
- A response's sections start at `##`.

## The last instruction

Before a response or anything in markdown is returned, check that the six rules hold. For a markdown file, also load the `authoring` skill, then use `markdown` by its name rule, for the file rules and the linter; where that set is not installed, run the project's linter where it has one.
