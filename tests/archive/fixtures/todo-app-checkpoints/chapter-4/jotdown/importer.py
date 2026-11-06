"""Reading the loose lines of an old list, such as my-todos.txt, into tasks."""
import re

from jotdown import dates, tasks

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
            due = dates.parse_due(found.group(1), today)
        except dates.DateError:
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
            due = dates.parse_due(word, today)
        text = EVERY.sub("", text, count=1)
    weekday = WEEKDAY.search(text)
    if weekday and due is None:
        due = dates.parse_due(weekday.group(1), today)
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
        task = tasks.add_task(data, fields["title"], due, fields["tags"], fields["repeat"], today)
        task["done"] = fields["done"]
        known.add((task["title"], task["due"]))
        added += 1
    return added, skipped, rejected


def import_file(path, data, today):
    with open(path, encoding="utf-8") as f:
        return import_text(f.read(), data, today)
