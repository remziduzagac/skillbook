import datetime
import tempfile
import unittest
from pathlib import Path

from jotdown.store import Store, new_data
from jotdown.web import Page

TODAY = datetime.date(2027, 4, 12)  # a Monday


class PageTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.store = Store(Path(folder.name) / "tasks.json")
        self.page = Page(self.store, today=TODAY)

    def save_task(self, title, due=None):
        data = self.store.load()
        data["tasks"].append(
            {"id": data["next_id"], "title": title, "done": False, "due": due, "tags": [], "repeat": None, "scheduled": None}
        )
        data["next_id"] += 1
        self.store.save(data)

    def get(self, path="/"):
        status, headers, body = self.page.handle("GET", path, {})
        return status, headers, body.decode("utf-8")

    def test_the_page_lists_the_open_tasks(self):
        self.save_task("renew passport", "2027-04-30")
        status, headers, body = self.get()
        self.assertEqual(status, 200)
        self.assertEqual(headers["Content-Type"], "text/html; charset=utf-8")
        self.assertIn("renew passport", body)

    def test_titles_are_escaped(self):
        self.save_task("<script>alert(1)</script>")
        _, _, body = self.get()
        self.assertIn("&lt;script&gt;", body)
        self.assertNotIn("<script>alert", body)

    def test_the_summary_is_on_the_page(self):
        self.save_task("call mum", "2027-04-12")
        _, _, body = self.get()
        self.assertIn("Due today", body)

    def test_an_empty_list_still_shows_the_page(self):
        status, _, body = self.get()
        self.assertEqual(status, 200)
        self.assertIn("Nothing is due today.", body)

    def test_another_address_is_not_found(self):
        self.assertEqual(self.get("/elsewhere")[0], 404)


class ChangingRequestTests(unittest.TestCase):
    """The page changes tasks only for requests that come from the page itself."""

    ORIGIN = "http://127.0.0.1:8765"

    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.store = Store(Path(folder.name) / "tasks.json")
        self.page = Page(self.store, port=8765, today=TODAY)
        data = new_data()
        data["tasks"].append(
            {"id": 1, "title": "fix bike", "done": False, "due": None, "tags": [], "repeat": None, "scheduled": None}
        )
        data["next_id"] = 2
        self.store.save(data)

    def post(self, path, body, origin=None):
        headers = {} if origin is None else {"Origin": origin}
        return self.page.handle("POST", path, headers, body)[0]

    def titles(self):
        return [t["title"] for t in self.store.load()["tasks"]]

    def done(self):
        return [t["done"] for t in self.store.load()["tasks"]]

    def test_the_page_adds_a_task(self):
        self.assertEqual(self.post("/add", b"title=call+mum&due=friday", self.ORIGIN), 303)
        self.assertEqual(self.titles(), ["fix bike", "call mum"])

    def test_the_page_finishes_a_task(self):
        self.assertEqual(self.post("/done", b"id=1", self.ORIGIN), 303)
        self.assertEqual(self.done(), [True])

    def test_localhost_is_also_the_page(self):
        self.assertEqual(self.post("/done", b"id=1", "http://localhost:8765"), 303)

    def test_a_request_from_another_origin_is_refused(self):
        self.assertEqual(self.post("/add", b"title=call+mum", "https://evil.example"), 403)
        self.assertEqual(self.post("/done", b"id=1", "https://evil.example"), 403)
        self.assertEqual(self.titles(), ["fix bike"])
        self.assertEqual(self.done(), [False])

    def test_a_request_with_no_origin_is_refused(self):
        self.assertEqual(self.post("/add", b"title=call+mum"), 403)
        self.assertEqual(self.titles(), ["fix bike"])

    def test_an_origin_that_only_looks_like_the_page_is_refused(self):
        for origin in ("http://127.0.0.1:9999", "http://127.0.0.1:8765.evil.example", "https://127.0.0.1:8765", "null"):
            self.assertEqual(self.post("/add", b"title=call+mum", origin), 403, origin)
        self.assertEqual(self.titles(), ["fix bike"])

    def test_the_name_of_the_header_can_be_in_any_case(self):
        self.assertEqual(self.page.handle("POST", "/done", {"origin": self.ORIGIN}, b"id=1")[0], 303)

    def test_a_task_that_is_not_there_is_a_bad_request(self):
        self.assertEqual(self.post("/done", b"id=9", self.ORIGIN), 400)

    def test_reading_the_page_needs_no_origin(self):
        self.assertEqual(self.page.handle("GET", "/", {"Origin": "https://other.example"})[0], 200)


class BrokenFileTests(unittest.TestCase):
    def test_the_page_reports_a_broken_data_file_and_leaves_it_alone(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "tasks.json"
            path.write_text("{ not json")
            page = Page(Store(path), port=8765, today=TODAY)
            status, _, body = page.handle("POST", "/add", {"Origin": "http://127.0.0.1:8765"}, b"title=call+mum")
            self.assertEqual(status, 500)
            self.assertIn(str(path), body.decode("utf-8"))
            self.assertEqual(path.read_text(), "{ not json")
