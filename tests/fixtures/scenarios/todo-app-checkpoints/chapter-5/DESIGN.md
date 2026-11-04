# Jotdown design

Status: approved on 8 March 2027, with the reviewer's findings fixed. Changed on 26 April 2027 to name where the data lives.

## Purpose

Jotdown is a small task list for the command line and for a page in the browser. It is for its owner first and then for three friends, Sam, Priya and Leo, each on their own computer. Version 1 uses Python's standard library only.

## Scope

In version 1:

- tasks with a due date, tags and a daily or weekly repeat;
- commands to add, list, finish and edit tasks;
- a page in the browser that lists tasks, adds them and finishes them;
- a summary of late tasks and tasks due today, shown when the app opens;
- a one-time import of `my-todos.txt`.

Not in version 1: sharing or sync between people, a phone app, email reminders, and deleting tasks. To drop a task, finish it, or edit the file by hand.

## Words

The words are the ones in `glossary.md`: task, list, tag, tag group, due date and repeat. The commands, the page and the code use no other word for these things.

## Parts

### The store

The store reads and saves the list. The list is kept in `~/.jotdown/tasks.json`, in the home folder, or in the file that the environment variable `JOTDOWN_DATA` names. The folder the command runs in does not matter.

A save writes the whole list to a new file beside the old one, then renames the new file over the old one. A save that is cut off leaves the old file whole.

A missing file means a new, empty list. A file that exists but cannot be read as a list is an error: the store stops and says so. It never carries on with an empty list, because the next save would overwrite the file.

### The commands

The command is `jd`. With no command it shows the summary.

- `jd add TITLE`, with `--due`, `--tag` (more than once is fine) and `--repeat daily|weekly`.
- `jd list`, with `--tag` to show one tag group and `--done` to include finished tasks.
- `jd done ID` finishes a task.
- `jd edit ID`, with `--title`, `--due`, `--tag` and `--all`.
- `jd summary` shows what is late and what is due today.
- `jd import FILE` reads an old list.
- `jd web` starts the page.

### The page

`jd web` starts a page that listens on 127.0.0.1, the computer's own address, so only that computer can reach it. It shows the summary, lists the open tasks, adds a task from a form and finishes a task with a button. It uses `http.server` from the standard library.

### The import

`jd import FILE` reads a file such as `my-todos.txt`, one task per line. It takes `[ ]` and `[x]` at the start, a due date written as `(due YYYY-MM-DD)`, `#tags`, a weekday word such as `fri`, and the hints `every day`, `every week` and `every monday`. A line it cannot read as it is gets left out and listed with the reason. It never guesses. Running the import twice does not add a task twice.

### Repeats

The repeat rules are in `decisions.md`. In short:

- A missed repeat does not pile up. Only the next one shows.
- Finishing early sets the next task from the due date, not from the day it was finished.
- Editing one changes only that one, unless `--all` is given.

A repeating task is one open task at a time. Finishing it marks it done and adds the next one.

## File format

The file is one JSON object with three keys.

| Key | Meaning |
| --- | --- |
| `version` | The format version, a whole number. It is 1. |
| `next_id` | The id the next new task gets. Ids are never used twice. |
| `tasks` | A list of tasks, oldest first. |

Each task is an object with these fields.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | whole number | The task's number. The commands and the page use it. |
| `title` | text | What to do. |
| `done` | true or false | True once the task is finished. |
| `due` | date and time or null | The day and the time the task is due, as `YYYY-MM-DD HH:MM`. |
| `tags` | list of text | The task's tags, in lowercase, without the `#`, sorted. |
| `repeat` | text or null | `daily`, `weekly` or null. |
| `scheduled` | date or null | For a repeating task: the date the repeat schedule gave this task. |
| `series` | object, optional | After one repeating task is edited alone: the `title` and `tags` the next task copies. |

An example with one task:

```json
{
  "version": 1,
  "next_id": 2,
  "tasks": [
    {
      "id": 1,
      "title": "renew passport",
      "done": false,
      "due": "2027-03-31 09:00",
      "tags": ["admin"],
      "repeat": null,
      "scheduled": null
    }
  ]
}
```

## How the parts connect

The commands and the page read and save through the store, and they share the same rules for tasks. The page reads the file for every request, so a task added with a command shows on the page at the next request.

## Main cases and failure paths

- Add a task, list it, finish it.
- Finish a task that repeats: the next one appears with the right due date.
- A save is cut off: the old file is still whole.
- The data file is broken by hand: every command and the page stop and say so, and the file is left as it is.
- Two saves at the same moment: the later one wins. Version 1 has no lock, and the command and the page are not meant to save at the same time.
- An import line cannot be read: it is left out and listed. The rest is imported.

## Decisions

- One JSON file. SQLite is set aside because not every Python is built with it. todo.txt is set aside because it has no standard field for repeats.
- The page listens on 127.0.0.1 only, so only the same computer can reach it.
- The summary is shown when the app opens. Nothing is sent by email or in any other way.
- Ids are whole numbers that are never used twice, so a task keeps its number.
- Tags are lowercase, so `Garden` and `garden` are one tag.

## Checks a builder can run

- `python3 -m unittest` passes.
- A save that is cut off leaves the old file whole: the new file is written first and renamed over the old one.
- Run `jd` in two different folders. Both show the same list.
- Finish a daily task three days late: one new task, due today.
- Import `my-todos.txt`: every line is a task or is listed as left out.

## Open questions

- Whether the page and the commands need a lock if they are used at the same time.
- Whether Windows needs anything special for the data folder. It has not been tried.
