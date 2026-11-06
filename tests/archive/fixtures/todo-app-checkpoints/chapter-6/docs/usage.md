# Using Jotdown

Run `jd` with a command. Run `jd` with no command to see the summary.

## The summary

When you run `jd` with no command, Jotdown shows the tasks that are late first, then the tasks that are due today, each group under its own heading. If nothing is late or due, it says so.

## Adding a task

```text
jd add renew passport --due 2027-03-31 --tag admin
```

A task has a title, and may have a due date, tags and a repeat. Give `--tag` more than once for more tags. Tags are lowercase, and a leading `#` is ignored.

## Dates

`--due` takes a date such as `2027-03-19`, and also plain words: `today`, `tomorrow`, a weekday name such as `friday` or `fri` (the next such day, never today) and `in 3 days`.

## Showing tasks

`jd list` shows the open tasks, soonest due first. Add `--tag garden` to show one tag group, or `--done` to include finished tasks.

## Repeats

`jd add water the plants --due today --repeat daily` adds a task that repeats every day. `--repeat weekly` repeats it every week.

- A repeating task is one open task at a time. When you finish it, the next one appears.
- A missed repeat does not pile up. Only the next one shows.
- Finishing early sets the next one from the due date, not from the day you finished.
- Editing one changes only that one, unless you add `--all`.

## Finishing and editing

`jd done 3` finishes task 3. `jd edit 3 --title "call mum" --due friday` changes it. On a repeating task, `jd edit 3 --all --title "water the ferns"` changes every task of the repeat.

## The page

`jd web` starts a page in your browser at `http://127.0.0.1:8765/`. Only the computer it runs on can reach it. The page shows the summary and the open tasks, adds a task and finishes a task. It accepts those changes only from the page itself, not from other pages that your browser has open. Press Ctrl+C in the terminal to stop it.

## Where your data lives

Jotdown keeps your tasks in one file, `~/.jotdown/tasks.json`, in your home folder. It does not matter which folder you run `jd` from. To use another file, set the environment variable `JOTDOWN_DATA` to its path. Jotdown makes the folder and the file when you add your first task. Nobody else has a copy of this file, so copy it somewhere safe now and then.

## Importing an old list

`jd import my-todos.txt` reads a file with one task per line: `[ ]` or `[x]` at the start, a due date written `(due 2027-03-31)`, `#tags`, a weekday word such as `fri`, and the hints `every day`, `every week` and `every monday`. A line it cannot read is left out and listed with the reason. Importing the same file twice adds nothing the second time.
