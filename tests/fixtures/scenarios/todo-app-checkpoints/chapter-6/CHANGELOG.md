# Changelog

All notable changes to Jotdown.

## 1.0.0 - 2027-05-17

- The first release for the friends.
- Everything from 0.1.0 to 0.4.0: the store, the commands, repeats, the summary, the page, plain-word dates, the import, and a data file that does not depend on the folder you run `jd` from.
- The summary heading for late tasks now reads Late.
- Docs for installing, using and developing Jotdown, with an index in `docs/index.md`. The file format is described once, in `docs/format.md`.

## 0.4.0 - 2027-04-26

- The data file is now `~/.jotdown/tasks.json`, or the file that `JOTDOWN_DATA` names. It no longer depends on the folder you run `jd` from.
- A data file that cannot be read stops the command with a clear error. It is never overwritten.
- The page refuses requests that change tasks unless they come from the page itself.
- The commands, the date reading, the repeat rules, the summary and the import are in one module, `jotdown/cli.py`.

## 0.3.0 - 2027-03-15

- Importing an old list with `jd import`.
- Due dates in plain words, such as `friday` and `in 3 days`, through tinydate.

## 0.2.0 - 2027-03-15

- The page in the browser, started with `jd web`.

## 0.1.0 - 2027-03-15

- The store, the commands, daily and weekly repeats and the summary.
