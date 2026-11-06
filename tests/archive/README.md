# Frozen long scenarios

This folder is a frozen record of the two long scenarios, the festival and the todo app. They are not run, and nothing here is loaded or validated by the runner or by `just check`, apart from the markdown lint and the link check. Skills are tested with small cases now (D310, D311; see [the testing design](../../blueprint/design/testing.md)).

- `cases/`: the two cases, `festival.yaml` and `todo-app.yaml`, as they were last run.
- `fixtures/`: their project files: each scenario's base, its chapter checkpoints and the todo app's home folder.
- `traces/`: the hand-written trace books, `festival-traces.json` and `todo-app-traces.json`, that the retired judge was checked against.
- `make-festival.py`, `make-todo-app.py` and `make-todo-app-case.py`: the scripts that wrote the fixtures and the todo app's case.

The scenario designs are [festival.md](../../blueprint/design/scenarios/festival.md) and [todo-app.md](../../blueprint/design/scenarios/todo-app.md). Paths inside these files name the places they had while the scenarios ran, such as `tests/fixtures/scenarios/` and `tests/checks/`. The code that ran and judged them, and the rule copies in `tests/checks/`, are in git history before the D311 build.
