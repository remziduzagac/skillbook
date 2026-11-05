# Carryover: Jotdown

Written on 15 March 2027 for the agent that continues the work.

## Goal and state

Build Jotdown version 1 as `DESIGN.md` describes it, following `plan.md`. Steps 1 to 4 are built and the tests pass. The README's usage section is written. Step 6, the friends, is next.

## Done so far

- The store, the commands and the page: `jotdown/`, with tests in `tests/`.
- The import of `my-todos.txt`: `data/tasks.json` holds 46 tasks. Two lines were left out, the separator `----` and `pay rent (due 2027-02-30)`. `my-todos.txt` now says where the list lives.
- Dates in plain words, through the vendored `vendor/tinydate/`.
- The README's usage section is written.
- The test command `python3 -m unittest` passes.

## Decisions

All are in `decisions.md`, and the approved design is `DESIGN.md`. The repeat rules are in `decisions.md`.

## Remaining work

1. Step 6 of `plan.md`: the friends try it.
2. The friends' answers to `questions-for-friends.md`, once the owner has them.
3. Next: delete prototype/ (the user agreed).

## Open questions

- Whether the page and the commands need a lock if they are used at the same time: `DESIGN.md`, Open questions.
- How the friends will keep a copy of their tasks.

## References

- `DESIGN.md`, `plan.md`, `decisions.md`, `glossary.md`, `questions-for-friends.md`, `AGENTS.md`.

## First next step

Ask the owner how the friends got on, and update `plan.md`.

## Written against

The files listed above, as they stood on 15 March 2027.
