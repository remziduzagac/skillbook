# Developing Jotdown

## Notes for developers

- Run the tests with `python3 -m unittest` from the project folder. They use temporary folders and never touch your own tasks.
- `jotdown/cli.py` holds the commands, the reading of dates, the repeat rules, the summary and the import. `jotdown/store.py` reads and saves the file. `jotdown/web.py` is the page.
- `vendor/tinydate/` is a small date reader that Jotdown uses as it is.
- Standard library only. A new command is a function in `jotdown/cli.py` and an entry in its `COMMANDS` table.
- `pip install -e .` from the project folder also gives a `jd` command, because `pyproject.toml` declares one.

## History of the design

Jotdown began as a shell script, `prototype/jot.sh`. The first design chose one JSON file over SQLite and todo.txt: JSON needs nothing to install, and not every Python is built with SQLite.

Version 0.4.0 moved the data file out of the working folder. Before that, two friends ran `jd` from a different folder and thought their tasks had vanished. The design had named `data/tasks.json` without saying what it was relative to.
