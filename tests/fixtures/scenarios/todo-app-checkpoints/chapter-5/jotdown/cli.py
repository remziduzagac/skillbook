"""The jd command: its commands, the reading of dates, the repeat rules, the opening summary and the import."""
import argparse
import datetime
import re
import sys
from pathlib import Path

from jotdown.store import DataFileError, Store

# tinydate is vendored. Find it from this file's own location, so it works from any folder.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "vendor" / "tinydate"))

import tinydate  # noqa: E402


# --- Reading dates ----------------------------------------------------------------------------------------------------

class DateError(ValueError):
    """The text is not a date Jotdown can read."""


def current_date():
    return datetime.date.today()


def parse_due(text, today):
    """Return the date for text such as "friday", "in 3 days" or "2027-03-19"."""
    try:
        return tinydate.parse(text, today)
    except ValueError as error:
        raise DateError(str(error)) from None


# --- Tasks and the repeat rules ---------------------------------------------------------------------------------------

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
        due = today or current_date()
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


# --- The opening summary ----------------------------------------------------------------------------------------------

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


# --- Importing an old list --------------------------------------------------------------------------------------------

CHECKBOX = re.compile(r"^\[([ xX])\]\s*")
DUE = re.compile(r"\(due\s+(\d{4}-\d{2}-\d{2})\)")
TAG = re.compile(r"(?<!\S)#([\w-]+)")
DAYS = "monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun"
EVERY = re.compile(rf"\b(?:every\s+(day|week|{DAYS})|(daily|weekly))\b", re.IGNORECASE)
WEEKDAY = re.compile(rf"\b({DAYS})\b", re.IGNORECASE)


class ImportLineError(Exception):
    """A line that cannot be taken as it is."""


def parse_line(line, today):
    """Read one line. Returns a dict with title, done, due, tags and repeat. Raises ImportLineError."""
    text = line.strip()
    done = False
    box = CHECKBOX.match(text)
    if box:
        done = box.group(1).lower() == "x"
        text = text[box.end():]
    due = None
    found = DUE.search(text)
    if found:
        try:
            due = parse_due(found.group(1), today)
        except DateError:
            raise ImportLineError(f"{found.group(1)} is not a real date") from None
        text = DUE.sub("", text)
    tags = TAG.findall(text)
    text = TAG.sub("", text)
    repeat = None
    every = EVERY.search(text)
    if every:
        word = (every.group(1) or every.group(2)).lower()
        repeat = "daily" if word in ("day", "daily") else "weekly"
        if word not in ("day", "week", "daily", "weekly") and due is None:
            due = parse_due(word, today)
        text = EVERY.sub("", text, count=1)
    weekday = WEEKDAY.search(text)
    if weekday and due is None:
        due = parse_due(weekday.group(1), today)
        text = WEEKDAY.sub("", text, count=1)
    title = " ".join(text.split())
    if not re.search(r"\w", title):
        raise ImportLineError("not a task")
    return {"title": title, "done": done, "due": due, "tags": tags, "repeat": repeat}


def import_text(text, data, today):
    """Add the readable lines to data. Returns (added, skipped, rejected).

    skipped counts lines whose task is already in the list, so a second import adds nothing.
    rejected holds (line number, line, reason) for each line that could not be read.
    """
    known = {(t["title"], t["due"]) for t in data["tasks"]}
    added = skipped = 0
    rejected = []
    for number, line in enumerate(text.splitlines(), start=1):
        if not line.strip():
            continue
        try:
            fields = parse_line(line, today)
        except ImportLineError as error:
            rejected.append((number, line.strip(), str(error)))
            continue
        due = fields["due"]
        if fields["repeat"] and due is None:
            due = today  # a repeat needs a date to start from
        if (fields["title"], due.isoformat() if due else None) in known:
            skipped += 1
            continue
        task = add_task(data, fields["title"], due, fields["tags"], fields["repeat"], today)
        task["done"] = fields["done"]
        known.add((task["title"], task["due"]))
        added += 1
    return added, skipped, rejected


def import_file(path, data, today):
    with open(path, encoding="utf-8") as f:
        return import_text(f.read(), data, today)


# --- The commands -----------------------------------------------------------------------------------------------------

def build_parser():
    parser = argparse.ArgumentParser(prog="jd", description="Jotdown: a small task list.")
    commands = parser.add_subparsers(dest="command")

    commands.add_parser("summary", help="show what is late and what is due today")

    add = commands.add_parser("add", help="add a task")
    add.add_argument("title", nargs="+")
    add.add_argument("--due", help='a date such as friday, "in 3 days" or 2027-03-19')
    add.add_argument("--tag", action="append", default=[], help="a tag; repeat the option for more")
    add.add_argument("--repeat", choices=sorted(REPEAT_DAYS))

    show = commands.add_parser("list", help="show the open tasks")
    show.add_argument("--tag", help="show only the tasks with this tag")
    show.add_argument("--done", action="store_true", help="include finished tasks")

    done = commands.add_parser("done", help="finish a task")
    done.add_argument("id", type=int)

    edit = commands.add_parser("edit", help="change a task")
    edit.add_argument("id", type=int)
    edit.add_argument("--title")
    edit.add_argument("--due")
    edit.add_argument("--tag", action="append", help="the new tags; repeat the option for more")
    edit.add_argument("--all", action="store_true", dest="whole_series", help="change every task of a repeat")

    load = commands.add_parser("import", help="read an old list such as my-todos.txt")
    load.add_argument("file")

    page = commands.add_parser("web", help="start the page in the browser")
    page.add_argument("--port", type=int, default=8765)
    return parser


def cmd_summary(args, store, today, out):
    print("\n".join(summary_lines(store.load(), today)), file=out)
    return 0


def cmd_add(args, store, today, out):
    due = parse_due(args.due, today) if args.due else None
    data = store.load()
    task = add_task(data, " ".join(args.title), due, args.tag, args.repeat, today)
    store.save(data)
    print(f"Added {format_task(task)}", file=out)
    return 0


def cmd_list(args, store, today, out):
    shown = visible_tasks(store.load(), args.tag, args.done)
    if not shown:
        print("No tasks.", file=out)
    for task in shown:
        print(("x " if task["done"] else "  ") + format_task(task), file=out)
    return 0


def cmd_done(args, store, today, out):
    data = store.load()
    task, following = finish_task(data, args.id, today)
    store.save(data)
    print(f"Done: {format_task(task)}", file=out)
    if following:
        print(f"Next: {format_task(following)}", file=out)
    return 0


def cmd_edit(args, store, today, out):
    due = parse_due(args.due, today) if args.due else None
    data = store.load()
    task = edit_task(data, args.id, args.title, due, args.tag, args.whole_series)
    store.save(data)
    print(f"Changed {format_task(task)}", file=out)
    return 0


def cmd_import(args, store, today, out):
    data = store.load()
    try:
        added, skipped, rejected = import_file(args.file, data, today)
    except OSError as error:
        raise TaskError(f"Cannot read {args.file}: {error.strerror}.") from None
    store.save(data)
    print(f"Imported {added} tasks. {skipped} were already in the list.", file=out)
    if rejected:
        print(f"{len(rejected)} lines were left out:", file=out)
        for number, line, reason in rejected:
            print(f"  line {number}: {line} ({reason})", file=out)
    return 0


def cmd_web(args, store, today, out):
    from jotdown import web  # loaded only when the page is wanted, because web.py imports this module

    web.serve(store, args.port, out)
    return 0


COMMANDS = {
    "summary": cmd_summary,
    "add": cmd_add,
    "list": cmd_list,
    "done": cmd_done,
    "edit": cmd_edit,
    "import": cmd_import,
    "web": cmd_web,
}


def main(argv=None, store=None, today=None, out=None, err=None):
    """Run one command. Returns the exit status. The other arguments are for tests."""
    out = out or sys.stdout
    err = err or sys.stderr
    args = build_parser().parse_args(argv)
    store = store or Store()
    today = today or current_date()
    try:
        return COMMANDS[args.command or "summary"](args, store, today, out)
    except (TaskError, DateError) as error:
        print(f"jd: {error}", file=err)
        return 1
    except DataFileError as error:
        print(f"jd: {error}", file=err)
        return 2
