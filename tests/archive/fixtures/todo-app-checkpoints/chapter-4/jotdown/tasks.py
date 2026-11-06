"""What a task is, and what adding, finishing and editing one do."""
import datetime

from jotdown import dates

REPEAT_DAYS = {"daily": 1, "weekly": 7}


class TaskError(Exception):
    """The request cannot be done. The message says why."""


def clean_tags(tags):
    return sorted({tag.strip().lstrip("#").lower() for tag in tags if tag.strip().lstrip("#")})


def add_task(data, title, due=None, tags=(), repeat=None, today=None):
    """Add a task to data and return it. A repeating task without a due date is due today."""
    title = title.strip()
    if not title:
        raise TaskError("A task needs a title.")
    if repeat is not None and repeat not in REPEAT_DAYS:
        raise TaskError(f"A task cannot repeat {repeat!r}. Use daily or weekly.")
    if repeat and due is None:
        due = today or dates.current_date()
    task = {
        "id": data["next_id"],
        "title": title,
        "done": False,
        "due": due.isoformat() if due else None,
        "tags": clean_tags(tags),
        "repeat": repeat,
        "scheduled": due.isoformat() if repeat else None,
    }
    data["next_id"] += 1
    data["tasks"].append(task)
    return task


def find_task(data, task_id):
    for task in data["tasks"]:
        if task["id"] == task_id:
            return task
    raise TaskError(f"There is no task {task_id}.")


def next_due(scheduled, repeat, today):
    """The next date a repeat falls on: counted from the scheduled date, and never in the past."""
    step = datetime.timedelta(days=REPEAT_DAYS[repeat])
    following = scheduled + step
    if following < today:
        # A missed repeat does not pile up. Jump to the first date on the schedule that is not past.
        missed = (today - following).days
        following += step * -(-missed // step.days)
    return following


def finish_task(data, task_id, today):
    """Mark a task done. A repeating task also gets its next task. Returns (task, next task or None)."""
    task = find_task(data, task_id)
    if task["done"]:
        raise TaskError(f"Task {task_id} is already done.")
    task["done"] = True
    if not task["repeat"]:
        return task, None
    scheduled = datetime.date.fromisoformat(task["scheduled"] or task["due"])
    following = next_due(scheduled, task["repeat"], today)
    series = task.get("series", task)
    new = add_task(data, series["title"], following, series["tags"], task["repeat"], today)
    return task, new


def edit_task(data, task_id, title=None, due=None, tags=None, whole_series=False):
    """Change a task. On a repeating task, the change is for this task only unless whole_series is true."""
    task = find_task(data, task_id)
    if task["done"]:
        raise TaskError(f"Task {task_id} is done. Edit the open one.")
    if title is None and due is None and tags is None:
        raise TaskError("Nothing to change. Give --title, --due or --tag.")
    if title is not None and not title.strip():
        raise TaskError("A task needs a title.")
    repeating = bool(task["repeat"])
    if repeating and not whole_series and (title is not None or tags is not None):
        # The next task is copied from the series, which this edit must not touch.
        task.setdefault("series", {"title": task["title"], "tags": list(task["tags"])})
    if title is not None:
        task["title"] = title.strip()
    if tags is not None:
        task["tags"] = clean_tags(tags)
    if due is not None:
        task["due"] = due.isoformat()
        if repeating and whole_series:
            task["scheduled"] = due.isoformat()
    if repeating and whole_series:
        task.pop("series", None)
    return task


def visible_tasks(data, tag=None, include_done=False):
    """The tasks to show: open ones by default, soonest due first, tasks with no due date last."""
    shown = [t for t in data["tasks"] if include_done or not t["done"]]
    if tag:
        wanted = tag.lstrip("#").lower()
        shown = [t for t in shown if wanted in t["tags"]]
    return sorted(shown, key=lambda t: (t["due"] or "9999-99-99", t["id"]))


def format_task(task):
    parts = [f"[{task['id']}] {task['title']}"]
    if task["due"]:
        parts.append(f"(due {task['due']})")
    if task["tags"]:
        parts.append(" ".join("#" + tag for tag in task["tags"]))
    if task["repeat"]:
        parts.append(f"({task['repeat']})")
    return " ".join(parts)


def summary_lines(data, today):
    """The summary shown when the app opens: late tasks first, then the tasks due today."""
    iso = today.isoformat()  # ISO dates sort in date order as text
    open_tasks = [t for t in data["tasks"] if not t["done"] and t["due"]]
    past_due = sorted((t for t in open_tasks if t["due"] < iso), key=lambda t: (t["due"], t["id"]))
    due_today = [t for t in open_tasks if t["due"] == iso]
    if not past_due and not due_today:
        return ["Nothing is due today."]
    lines = []
    if past_due:
        lines.append("Overdue")
        lines.extend("  " + format_task(t) for t in past_due)
    if due_today:
        lines.append("Due today")
        lines.extend("  " + format_task(t) for t in due_today)
    return lines
