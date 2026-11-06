"""The jd command."""
import argparse
import sys

from jotdown import dates, importer, tasks, web
from jotdown.store import Store


def build_parser():
    parser = argparse.ArgumentParser(prog="jd", description="Jotdown: a small task list.")
    commands = parser.add_subparsers(dest="command")

    commands.add_parser("summary", help="show what is late and what is due today")

    add = commands.add_parser("add", help="add a task")
    add.add_argument("title", nargs="+")
    add.add_argument("--due", help='a date such as friday, "in 3 days" or 2027-03-19')
    add.add_argument("--tag", action="append", default=[], help="a tag; repeat the option for more")
    add.add_argument("--repeat", choices=sorted(tasks.REPEAT_DAYS))

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
    page.add_argument("--port", type=int, default=web.DEFAULT_PORT)
    return parser


def cmd_summary(args, store, today, out):
    print("\n".join(tasks.summary_lines(store.load(), today)), file=out)
    return 0


def cmd_add(args, store, today, out):
    due = dates.parse_due(args.due, today) if args.due else None
    data = store.load()
    task = tasks.add_task(data, " ".join(args.title), due, args.tag, args.repeat, today)
    store.save(data)
    print(f"Added {tasks.format_task(task)}", file=out)
    return 0


def cmd_list(args, store, today, out):
    shown = tasks.visible_tasks(store.load(), args.tag, args.done)
    if not shown:
        print("No tasks.", file=out)
    for task in shown:
        print(("x " if task["done"] else "  ") + tasks.format_task(task), file=out)
    return 0


def cmd_done(args, store, today, out):
    data = store.load()
    task, following = tasks.finish_task(data, args.id, today)
    store.save(data)
    print(f"Done: {tasks.format_task(task)}", file=out)
    if following:
        print(f"Next: {tasks.format_task(following)}", file=out)
    return 0


def cmd_edit(args, store, today, out):
    due = dates.parse_due(args.due, today) if args.due else None
    data = store.load()
    task = tasks.edit_task(data, args.id, args.title, due, args.tag, args.whole_series)
    store.save(data)
    print(f"Changed {tasks.format_task(task)}", file=out)
    return 0


def cmd_import(args, store, today, out):
    data = store.load()
    try:
        added, skipped, rejected = importer.import_file(args.file, data, today)
    except OSError as error:
        raise tasks.TaskError(f"Cannot read {args.file}: {error.strerror}.") from None
    store.save(data)
    print(f"Imported {added} tasks. {skipped} were already in the list.", file=out)
    if rejected:
        print(f"{len(rejected)} lines were left out:", file=out)
        for number, line, reason in rejected:
            print(f"  line {number}: {line} ({reason})", file=out)
    return 0


def cmd_web(args, store, today, out):
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
    today = today or dates.current_date()
    try:
        return COMMANDS[args.command or "summary"](args, store, today, out)
    except (tasks.TaskError, dates.DateError) as error:
        print(f"jd: {error}", file=err)
        return 1
