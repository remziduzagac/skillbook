# Installing Jotdown

## What you need

Python 3.12 or newer. Nothing else: Jotdown uses only Python's standard library. To check, run `python3 --version`. On Windows, run `py --version`.

## Run it

1. Copy the Jotdown folder to your computer and open a terminal in it.
2. Run `python3 -m jotdown`. On Windows, run `py -m jotdown`. With no tasks yet it says that nothing is due today.
3. To type `jd` in any folder, make a shortcut that points at the Jotdown folder, as below.

## A shortcut for `jd`

On Linux and macOS, add this line to `~/.bashrc` or `~/.zshrc`, with the real path to the Jotdown folder:

```text
alias jd='PYTHONPATH=/path/to/jotdown python3 -m jotdown'
```

On Windows, open PowerShell, run `notepad $PROFILE`, and add this function, with the real path:

```text
function jd { $env:PYTHONPATH = "C:\path\to\jotdown"; py -m jotdown @args }
```

Open a new terminal and run `jd`.

## Updating

Copy the new Jotdown folder over the old one. Your tasks are not in that folder, so they stay as they are. To see where they are, read [Where your data lives](usage.md#where-your-data-lives).
