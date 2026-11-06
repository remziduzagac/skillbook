# Plan for version 1

Status: approved on 8 March 2027. Progress updated on 12 April 2027.

Goal: Jotdown version 1 as `DESIGN.md` describes it, working for the owner and usable by three friends.

## Steps

- [x] 1. The store. Evidence: `jotdown/store.py` and `tests/test_store.py`.
- [x] 2. The commands. Evidence: `jotdown/cli.py`, `jotdown/tasks.py`, `tests/test_cli.py` and `tests/test_tasks.py`.
- [x] 3. The browser page. Evidence: `jotdown/web.py` and `tests/test_web.py`.
- [x] 4. The import of `my-todos.txt`. Evidence: `data/tasks.json` holds 46 tasks; the 2 lines left out were the separator `----` and `pay rent (due 2027-02-30)`; `my-todos.txt` now says where the list lives.
- [ ] 5. The README. Open: the usage section still says "To do".
- [ ] 6. The friends try it. In progress. Sam, Priya and Leo have used it, but the README does not yet tell them where tasks are kept or how to keep a copy.

## Out

Sharing, a phone app, email reminders and deleting tasks.

## Risks

- The data files are the only copies of each person's tasks and are not under version control.
- The friends' ways of using tasks differ. Step 6 finds what the app leaves out.
