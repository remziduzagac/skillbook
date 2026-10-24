# respond-layout

How to lay out anything the agent writes in markdown: responses, markdown files, pull-request and issue text, and briefs to agents.

## Rules

Which rules win follows the `act` skill's rule on which instruction wins:

- In a markdown file, the project's lint configuration wins over these rules, the prose rule included.
- The user's instruction in the conversation wins over both.
- The lists, heading levels and widths below are defaults. They give way to where the output goes, such as a message that does not render markdown or a narrow window, and to the user's preferences.

1. **Give headings to sections readers may seek or jump to.** Use them for two or more such parts. One short point needs none. Keep heading levels in order. Name each section in a few words. Bold lines cannot be navigated or linked to. Use `respond-ask` for question rounds.
2. **Bold is for a label or a key phrase inside a section.** A section's title is a heading, by rule 1.
3. **Keep tables to short values.** Example: three options with two short attributes. Keep rows within 120 characters. Wider rows wrap into noise in a terminal. Turn wide content into a list with sub-items. Follow the strong advice below on whether to use a table.
4. **Write one line per paragraph or list item.** Do not wrap prose by hand.
   - In a response, never wrap it. The harness wraps prose to its window, and unwrapped text copies and pastes cleanly.
   - In a file, don't wrap it unless the project's own rules say otherwise.
5. **Number items readers will refer to by position.** Examples: ordered steps or questions answered by number. Use bullets for loose points. Numbers let the user answer or point to an item.
6. **Fence blocks the reader copies or reads together.** Name the language. Examples: a command, multiline code or a diagram (`text`). Put names within sentences in inline backticks: files, commands or identifiers. These render, highlight and copy cleanly.
7. **Give text for pasting or sending whole and on its own.** Use the destination's form. Put any note, such as a choice or assumption, after it in a line or two. Keep notes outside the text so it copies in one piece.

## Strong advice

Follow it unless the case gives a reason not to, and say when you depart from it:

- **Lists over tables:** use a list by default. Use a table only for short values compared across items, because a list holds any length and reads well in a terminal.
- **Keep code lines and headings within 120 characters,** because a renderer cannot reflow them. In a project whose linter enforces this, it is a rule there.

## Advice

- Stop nesting at about two levels of sub-items, because deeper levels lose the reader and render badly in a terminal. Turn deeper detail into a new section.
- Start a response's sections at `##`.

## The last instruction

**Check all seven rules before returning markdown.** This includes responses. For markdown files, load `authoring` if in your skill list. Read its `markdown` skill (`references/markdown.md` in its folder) for file rules and linting. Otherwise run the project's linter, if any.
