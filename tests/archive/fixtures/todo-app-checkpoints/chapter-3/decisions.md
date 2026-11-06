# Decisions

What is settled for Jotdown. Anything not written here is still open.

## Who it is for

For the owner first, then three friends, Sam, Priya and Leo, each on their own computer.

Reason: the owner builds it for their own use; the friends may join later (`notes/idea.md`).

## What it looks like

A command-line tool, plus a page in the browser that only the same computer can reach.

Reason: the owner lives in the terminal (`notes/idea.md`). The page is for days when typing is a chore. Reason for the limit on the page: not given.

## Python and packages

Python's standard library only, with nothing to install.

Reason: the friends should not have to install a lot of things (`notes/idea.md`), and `AGENTS.md` says so.

## No sharing in version 1

No sharing or sync between people. A phone app is also out.

Reason: not given. The notes say the owner would rather not build sharing.

## Storage

One JSON file.

Reason: JSON needs nothing to install and can be edited by hand (`research/storage-notes.md`).

## Name and command

The app is called Jotdown. The command is `jd`.

Reason for `jd`: the command `jot` comes with macOS, and Leo has a Mac (`research/existing-apps.md`). Reason for Jotdown: not given.

## Words

The words in `glossary.md` are the only words the app, its docs and its code use.

Reason: the notes used several words for the same thing.

## Reminders

A summary of due and late tasks, shown when the app opens. Nothing is sent anywhere.

Reason: not given.

## Repeating tasks

Tasks can repeat daily or weekly.

Reason: not given. The rules are under "Repeat rules".

## The old list

`my-todos.txt` is imported once. After that the app's file is the only list.

Reason: the owner wants to stop keeping two lists (`notes/idea.md`).

## Repeat rules

Settled on 8 March 2027. The first three are the owner's choices; the rest were taken from the recommended answers.

1. A missed repeat does not pile up. Only the next one shows. Reason: not given.
2. Finishing a repeating task early sets the next one from its due date, not from the day it was finished. Reason: not given.
3. Editing one repeating task changes only that task, unless the owner says all. Reason: not given.
4. A repeat is daily or weekly. A repeating task always has a due date; if none is given, it is today.
5. Finishing a repeating task makes the next task at once. The finished one stays in the file as done. Reason: the file then shows what was done.
6. How a task repeats cannot be edited in version 1. To change it, remove its open task from `data/tasks.json` by hand, then add a new task with the new repeat; finishing the old task would make another with the old repeat. Reason: it keeps the rules above small.
