# respond-layout

How to lay out anything the agent writes in markdown: responses, markdown files, pull-request and issue text, and briefs to agents.

## Rules

Which rules win follows the `act` skill's rule on which instruction wins:

- In a markdown file, the project's lint configuration wins over these rules, the prose rule included.
- The person's instruction in the conversation wins over both.

1. **Sections get headings, not bold lines.** Keep heading levels in order. Each heading names its section in a few words. A bold line looks like a heading, but nobody can navigate to it or link to it. Lay out a round of questions as `respond-ask` says.
2. **Bold is for a label or a key phrase inside a section.** A section's title is a heading, by rule 1.
3. **Tables for short values, lists for big ones:** a table holds short cells, such as three options compared on two short attributes. Keep its rows within 120 characters, because a wider row wraps into noise in a terminal. Turn content that would make a wide table into a list with sub-items. The strong advice below says when a table is worth it at all.
4. **Don't wrap prose by hand:** write one line per paragraph or list item.
   - In a response, never wrap it. The harness wraps prose to its window, and unwrapped text copies and pastes cleanly.
   - In a file, don't wrap it unless the project's own rules say otherwise.
5. **Numbers when things are referred to by number,** such as steps or questions, so the person can answer or point by number. Use bullets otherwise.
6. **Fence code, commands and text diagrams, with the language named:** `text` for a diagram. Put file names, commands and identifiers inline in backticks. They then render, highlight and copy cleanly.

## Strong advice

Follow it unless the case gives a reason not to, and say when you depart from it:

- **Lists over tables:** use a list by default. Use a table only for short values compared across items, because a list holds any length and reads well in a terminal.
- **Keep code lines and headings within 120 characters,** because a renderer cannot reflow them. In a project whose linter enforces this, it is a rule there.

## Advice

- Stop nesting at about two levels of sub-items, because deeper levels lose the reader and render badly in a terminal. Turn deeper detail into a new section.
- Start a response's sections at `##`.

## The last instruction

Before you return a response or anything in markdown, check that the six rules hold. For a markdown file, also load the `authoring` skill, then use `markdown` by its name rule, for the file rules and the linter. Where that set is not installed, run the project's linter, if it has one.
