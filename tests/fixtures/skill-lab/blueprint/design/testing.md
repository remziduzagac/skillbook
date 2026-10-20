# Testing

- One case per file: `tests/cases/<set>/<case>.toml`.
- Fields: `source`, the design file and the test's number; `prompt`, one for each turn; `rejects`, the plausible wrong behaviour; `review`, what a person judges by reading; and `[checks]`, with `reads`, `reads_not`, `no_changes`, `changed`, `unchanged` and `answer_contains`.
- This toy repository has no runner: its cases are written here and run elsewhere.
