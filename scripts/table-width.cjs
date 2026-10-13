// markdownlint rule: a table row is at most 120 characters. A renderer can reflow prose but not a table row, so prose
// has no limit and tables do; code blocks and headings are checked by MD013.
"use strict";

const limit = 120;

const tables = (tokens) =>
  tokens.flatMap((token) => (token.type === "table" ? [token] : tables(token.children || [])));

/** @type {import("markdownlint").Rule} */
module.exports = {
  names: ["table-width"],
  description: `Table rows are at most ${limit} characters`,
  tags: ["line_length"],
  parser: "micromark",
  function: (params, onError) => {
    for (const table of tables(params.parsers.micromark.tokens)) {
      for (let line = table.startLine; line <= table.endLine; line++) {
        const text = params.lines[line - 1];
        if (text.length > limit) {
          onError({ lineNumber: line, detail: `Expected: ${limit}; Actual: ${text.length}` });
        }
      }
    }
  },
};
