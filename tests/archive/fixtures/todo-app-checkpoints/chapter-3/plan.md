# Plan for version 1

Status: approved on 8 March 2027.

Goal: Jotdown version 1 as `DESIGN.md` describes it, working for the owner and usable by three friends.

## Steps

- [ ] 1. The store. Check: tests for saving, loading, the missing file and the safe save.
- [ ] 2. The commands. Needs the store's interface from step 1. Check: tests for each command and for the repeat rules.
- [ ] 3. The browser page. Needs the store's interface from step 1. Check: tests that call the page's request handler.
- [ ] 4. The import of `my-todos.txt`. Needs step 1. Check: every line is a task or is listed as left out, counted.
- [ ] 5. The README. Needs steps 2 and 3. Check: it names the commands, where tasks are kept and how to keep a copy.
- [ ] 6. The friends try it. Needs step 5. Check: the friends find their tasks and keep a copy using the README.

Steps 1 to 3 touch separate files. Once the store's interface is fixed in `DESIGN.md`, they can be built at the same time.

## Out

Sharing, a phone app, email reminders and deleting tasks.

## Risks

- `my-todos.txt` is the only copy of the owner's list and is not under version control. The import must leave it alone until the result is checked.
- The friends' ways of using tasks differ. Step 6 finds what the app leaves out.
