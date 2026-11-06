# Installing Jotdown

## What you need

Python 3.12 or newer. Nothing else: Jotdown uses only Python's standard library. To check, run `python3 --version`. On Windows, run `py --version`.

## Run it

1. Copy the Jotdown folder to your computer and open a terminal in it.
2. Run `python3 -m jotdown`. On Windows, run `py -m jotdown`. With no tasks yet it says that nothing is due today.

## Where your data lives

Jotdown keeps your tasks in one file, `data/tasks.json`, inside the folder you run `jd` from. Run `jd` from the same folder every time, because in another folder it starts a new, empty list. Nobody else has a copy of this file, so copy it somewhere safe now and then.
