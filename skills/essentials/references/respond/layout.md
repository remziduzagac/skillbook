# respond-layout

## Purpose

Lays out responses and Markdown so readers can find, read and copy each part.

## When to use

Use when preparing any response, writing Markdown, or answering a layout question. This includes files, pull-request or issue text, and briefs. Example: “use headings, not bold lines”.

## When not

Every response and Markdown output still follows these layout rules. Use the methods below for the parts that layout does not cover.

- Wording, order or length, such as “make this reply shorter”: use the `respond` guide’s rules. Layout handles the written structure.
- A question round: use the `respond-ask` guide for question numbering and answers.
- Markdown file conventions and linting: use a skill in the harness’s list for that work, if one fits. Otherwise run the project’s linter, if any, as the final step of Instructions says. File rules go beyond response layout.
- Commit messages and code comments: follow project conventions. They are not Markdown response sections.

## Gives back

The response or Markdown material, laid out for its reader.

## Rules

To match the destination, follow the `act` guide's rule on which instruction wins:

- In a markdown file, the project's lint configuration wins over these rules, the prose rule included.
- The user's instruction in the conversation wins over both.
- The lists, heading levels and widths below are defaults. They give way to where the output goes, such as a message that does not render markdown or a narrow window, and to the user's preferences.

1. **Give headings to sections readers may seek or jump to.** Use them for two or more such parts. One short point needs none. Keep heading levels in order. Name each section in a few words. Bold lines cannot be navigated or linked to. Use the `respond-ask` guide for question rounds.
2. **Bold is for a label or a key phrase inside a section.** A section's title is a heading, by rule 1.
3. **Keep tables to short values.** Example: three options with two short attributes. Keep rows within 120 characters. Wider rows wrap into noise in a terminal. Turn wide content into a list with sub-items. Follow the strong advice below on whether to use a table.
4. **Write one line per paragraph or list item.** Do not wrap prose by hand.
   - In a response, never wrap it. The harness wraps prose to its window, and unwrapped text copies and pastes cleanly.
   - In a file, don't wrap it unless the project's own rules say otherwise.
5. **Number items readers will refer to by position.** Examples: ordered steps or questions answered by number. Use bullets for loose points. Numbers let the user answer or point to an item.
6. **Fence blocks the reader copies or reads together.** Name the language. Examples: a command, multiline code or a diagram (`text`). Put names within sentences in inline backticks: files, commands or identifiers. These render, highlight and copy cleanly.
7. **Give text for pasting or sending whole and on its own.** Use the destination's form. Put any note, such as a choice or assumption, after it in a line or two. Keep notes outside the text so it copies in one piece.

## Advice

The next two items are **strong advice** to fit the reader and medium. Follow them unless the case gives a reason not to. Say when you depart from them:

- **Lists over tables:** use a list by default. Use a table only for short values compared across items, because a list holds any length and reads well in a terminal.
- **Keep code lines and headings within 120 characters,** because a renderer cannot reflow them. In a project whose linter enforces this, it is a rule there.

- Stop nesting at about two levels of sub-items, because deeper levels lose the reader and render badly in a terminal. Turn deeper detail into a new section.
- Start a response's sections at `##`.

## Instructions

Make each part easy for its reader to find, read and copy. Match the destination and user’s preferences so structure helps rather than adding noise. **Apply the layout rules to the destination, then check the whole response or Markdown before returning it.**

1. **Check the output against “Gives back” and all seven layout rules.** Always do this last. A sound answer can still be hard to use if its sections cannot be found or its text cannot be copied cleanly.
   - Follow the destination and user preferences under the opening Rules. Use navigable headings for sections readers seek, and bold only for labels or key phrases within them.
   - Use lists by default. Keep tables for short compared values and rows within the applicable width; turn wide content into lists. Keep prose on one line per paragraph or item.
   - Number ordered or referable items. Fence copied or grouped blocks with a language and put names inside sentences in inline backticks. Give paste-ready text whole, with notes outside it.
   - Check heading order, code-line width and nesting against the medium and Advice. Say when departing from strong advice.
   - For files, use a fitting skill in the harness's list for Markdown conventions and linting. Otherwise run the project's linter if present. Fix layout or lint failures before returning; the wording check remains with the `respond` guide.
