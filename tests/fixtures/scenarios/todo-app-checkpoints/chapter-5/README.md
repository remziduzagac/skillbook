# Jotdown

A small task list for the command line and for a page in your browser. It needs Python 3.12 or newer and nothing else.

## Install

Install Python 3.12 or newer, copy the Jotdown folder to your computer, and run `python3 -m jotdown` inside it. More in [docs/install.md](docs/install.md).

## Use

```text
jd add renew passport --due 2027-03-31 --tag admin
jd list
jd done 1
jd web
```

Run `jd` with no command to see what is late and what is due today. The commands are in [docs/usage.md](docs/usage.md), and the data file is described in [docs/format.md](docs/format.md).

## Where your data lives

Jotdown keeps your tasks in one file, `~/.jotdown/tasks.json`, in your home folder. It does not matter which folder you run `jd` from. To use another file, set the environment variable `JOTDOWN_DATA` to its path. Jotdown makes the folder and the file when you add your first task. Nobody else has a copy of this file, so copy it somewhere safe now and then.

## Developer notes

- Run the tests with `python3 -m unittest` from the project folder. They use temporary folders and never touch your own tasks.
- `jotdown/cli.py` holds the commands, the reading of dates, the repeat rules, the summary and the import. `jotdown/store.py` reads and saves the file. `jotdown/web.py` is the page.
- `vendor/tinydate/` is a small date reader that Jotdown uses as it is.
- Standard library only. A new command is a function in `jotdown/cli.py` and an entry in its `COMMANDS` table.

## History of the design

Jotdown began as a shell script, `prototype/jot.sh`. The first design chose one JSON file over SQLite and todo.txt: JSON needs nothing to install, and not every Python is built with SQLite. A friend's Python turned out to have no `sqlite3` module, which confirmed the choice.

Version 0.4.0 moved the data file out of the working folder. Before that, two friends ran `jd` from a different folder and thought their tasks had vanished. The design had named `data/tasks.json` without saying what it was relative to.

## Changelog

### 0.4.0 - 2027-04-26

- The data file is now `~/.jotdown/tasks.json`, or the file that `JOTDOWN_DATA` names. It no longer depends on the folder you run `jd` from.
- A data file that cannot be read stops the command with a clear error. It is never overwritten.
- The page refuses requests that change tasks unless they come from the page itself.
- The commands, the date reading, the repeat rules, the summary and the import are in one module, `jotdown/cli.py`.

### 0.3.0 - 2027-03-15

- Importing an old list with `jd import`.
- Due dates in plain words, such as `friday` and `in 3 days`, through tinydate.

### 0.2.0 - 2027-03-15

- The page in the browser, started with `jd web`.

### 0.1.0 - 2027-03-15

- The store, the commands, daily and weekly repeats and the summary.

## Licence

Jotdown is released under the MIT licence.
