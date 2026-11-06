import datetime
import tempfile
import unittest
from pathlib import Path

from jotdown.store import Store
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
