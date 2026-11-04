# Todo app checkpoints

The project files at the start of each chapter of the [todo app scenario](../../../../blueprint/design/scenarios/todo-app.md). The base fixture, `../todo-app/`, is chapter 1.

- Chapter N is the base, then the overlays `chapter-2/` to `chapter-N/` copied over it in order, then the removals below.
- Chapter 4 removes `config/reminders.env`.
- Chapters 5 and 6 remove `config/reminders.env`, `data/tasks.json`, `jotdown/dates.py`, `jotdown/importer.py` and `jotdown/tasks.py`. The user's tasks have moved out of the project, and `cli.py` holds what those three modules held. A folder that is left empty by a removal is not part of the checkpoint.
- Chapter 4 holds `data/tasks.json` with the 46 tasks that `jd import` takes from the base `my-todos.txt`. It leaves out two lines, `----` and `pay rent (due 2027-02-30)`. `my-todos.txt` is replaced by a note from chapter 4 on, and chapter 5 changes where the note says the list lives.
- Every test file that chapter 4 holds is written again in chapter 5, so no test in chapter 5 or 6 imports a removed module. Chapter 6 changes only `tests/test_summary.py` and `jotdown/cli.py` of the code, to the heading `Late`.
- The tests run with `python3 -m unittest` from the assembled folder. They use temporary folders and an environment variable for the data path, and never write into the project or the real home folder.
- `../../make-todo-app.py` writes the base and these overlays, and makes `data/tasks.json` with the chapter 4 importer. Change it and run it again rather than editing the files by hand.
- The runner writes the project's `.gitignore`, holding `my-todos.txt`, `data/` and `__pycache__/`, before the first commit. A `.gitignore` inside these folders would hide `data/` and `my-todos.txt` from this repository.
