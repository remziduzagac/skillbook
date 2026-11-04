"""The page in the browser: lists tasks, adds them and finishes them. It listens on 127.0.0.1 only."""
import html
import http.server
import string
from urllib.parse import parse_qs

from jotdown import dates, tasks

HOST = "127.0.0.1"
DEFAULT_PORT = 8765

PAGE = string.Template("""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Jotdown</title>
</head>
<body>
<h1>Jotdown</h1>
<pre>$summary</pre>
<h2>Add a task</h2>
<form method="post" action="/add">
<input name="title" placeholder="Title" required>
<input name="due" placeholder="Due: friday, in 3 days, 2027-03-19">
<input name="tags" placeholder="Tags, separated by spaces">
<select name="repeat">
<option value="">Does not repeat</option>
<option value="daily">Daily</option>
<option value="weekly">Weekly</option>
</select>
<button>Add</button>
</form>
<h2>Tasks</h2>
<table>
$rows</table>
</body>
</html>
""")

ROW = string.Template("""<tr><td>$id</td><td>$title</td><td>$due</td><td>$tags</td><td>$repeat</td>
<td><form method="post" action="/done"><input type="hidden" name="id" value="$id"><button>Finish</button></form></td></tr>
""")


class Page:
    """The page's logic, apart from the network, so a test can call it without a socket."""

    def __init__(self, store, today=None):
        self.store = store
        self.today = today  # a fixed date for tests; None means the real date

    def handle(self, method, path, headers, body=b""):
        """Answer one request. Returns (status, headers, body)."""
        today = self.today or dates.current_date()
        if method == "GET" and path == "/":
            return self.show(today)
        if method == "POST" and path == "/add":
            return self.add(parse_qs(body.decode("utf-8")), today)
        if method == "POST" and path == "/done":
            return self.finish(parse_qs(body.decode("utf-8")), today)
        return self.text(404, "Not found")

    def text(self, status, message):
        return status, {"Content-Type": "text/plain; charset=utf-8"}, message.encode("utf-8")

    def show(self, today):
        data = self.store.load()
        rows = "".join(
            ROW.substitute(
                id=task["id"],
                title=html.escape(task["title"]),
                due=html.escape(task["due"] or ""),
                tags=html.escape(" ".join("#" + tag for tag in task["tags"])),
                repeat=html.escape(task["repeat"] or ""),
            )
            for task in tasks.visible_tasks(data)
        )
        summary = html.escape("\n".join(tasks.summary_lines(data, today)))
        page = PAGE.substitute(summary=summary, rows=rows)
        return 200, {"Content-Type": "text/html; charset=utf-8"}, page.encode("utf-8")

    def add(self, form, today):
        try:
            due_text = form.get("due", [""])[0].strip()
            due = dates.parse_due(due_text, today) if due_text else None
            data = self.store.load()
            tasks.add_task(
                data,
                form.get("title", [""])[0],
                due,
                form.get("tags", [""])[0].split(),
                form.get("repeat", [""])[0] or None,
                today,
            )
        except (tasks.TaskError, dates.DateError) as error:
            return self.text(400, str(error))
        self.store.save(data)
        return 303, {"Location": "/"}, b""

    def finish(self, form, today):
        try:
            data = self.store.load()
            tasks.finish_task(data, int(form.get("id", [""])[0]), today)
        except (tasks.TaskError, ValueError) as error:
            return self.text(400, str(error))
        self.store.save(data)
        return 303, {"Location": "/"}, b""


class Handler(http.server.BaseHTTPRequestHandler):
    """Passes each request to the server's Page."""

    def do_GET(self):
        self.answer("GET")

    def do_POST(self):
        self.answer("POST")

    def answer(self, method):
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length)
        status, headers, content = self.server.page.handle(method, self.path, self.headers, body)
        self.send_response(status)
        for name, value in headers.items():
            self.send_header(name, value)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


def serve(store, port, out):
    """Serve the page on 127.0.0.1 until the user presses Ctrl+C."""
    with http.server.HTTPServer((HOST, port), Handler) as server:
        server.page = Page(store)
        print(f"Jotdown is at http://{HOST}:{port}/ . Press Ctrl+C to stop.", file=out)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print(file=out)
