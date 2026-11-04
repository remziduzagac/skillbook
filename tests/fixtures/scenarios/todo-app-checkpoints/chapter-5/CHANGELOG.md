# Changelog

All notable changes to Jotdown.

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
