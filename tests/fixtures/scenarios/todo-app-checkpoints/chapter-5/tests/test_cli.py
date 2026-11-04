import datetime
import io
import tempfile
import unittest
from pathlib import Path

from jotdown.cli import main
from jotdown.store import Store

TODAY = datetime.date(2027, 4, 12)  # a Monday


class CommandTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.folder = Path(folder.name)
        self.store = Store(self.folder / "tasks.json")

    def jd(self, *argv):
        out, err = io.StringIO(), io.StringIO()
        status = main(list(argv), store=self.store, today=TODAY, out=out, err=err)
        return status, out.getvalue(), err.getvalue()

    def test_add_then_list(self):
        self.assertEqual(self.jd("add", "renew", "passport", "--due", "2027-04-20", "--tag", "admin")[0], 0)
        status, out, _ = self.jd("list")
        self.assertEqual(status, 0)
        self.assertIn("renew passport", out)
        self.assertIn("#admin", out)

    def test_a_due_date_can_be_a_plain_word(self):
        _, out, _ = self.jd("add", "call mum", "--due", "friday")
        self.assertIn("(due 2027-04-16)", out)

    def test_a_date_it_cannot_read_saves_nothing(self):
        status, _, err = self.jd("add", "call mum", "--due", "sometime soon")
        self.assertEqual(status, 1)
        self.assertTrue(err.startswith("jd: "))
        self.assertEqual(self.store.load()["tasks"], [])

    def test_list_can_show_one_tag_group(self):
        self.jd("add", "prune the roses", "--tag", "garden")
        self.jd("add", "call mum", "--tag", "family")
        _, out, _ = self.jd("list", "--tag", "garden")
        self.assertIn("prune the roses", out)
        self.assertNotIn("call mum", out)

    def test_an_empty_list_says_so(self):
        self.assertEqual(self.jd("list")[1], "No tasks.\n")

    def test_done_finishes_a_task(self):
        self.jd("add", "fix bike")
        status, out, _ = self.jd("done", "1")
        self.assertEqual(status, 0)
        self.assertIn("Done: [1] fix bike", out)
        self.assertEqual(self.jd("list")[1], "No tasks.\n")
        self.assertIn("x [1] fix bike", self.jd("list", "--done")[1])

    def test_done_on_a_task_that_does_not_exist(self):
        status, _, err = self.jd("done", "9")
        self.assertEqual(status, 1)
        self.assertIn("There is no task 9.", err)

    def test_done_on_a_repeating_task_shows_the_next_one(self):
        self.jd("add", "water the plants", "--due", "today", "--repeat", "daily")
        _, out, _ = self.jd("done", "1")
        self.assertIn("Next: [2] water the plants (due 2027-04-13)", out)

    def test_edit_changes_one_task(self):
        self.jd("add", "fix bike")
        _, out, _ = self.jd("edit", "1", "--title", "fix the bike", "--due", "in 3 days")
        self.assertIn("[1] fix the bike (due 2027-04-15)", out)

    def test_no_command_shows_the_summary(self):
        self.jd("add", "call mum", "--due", "today")
        status, out, _ = self.jd()
        self.assertEqual(status, 0)
        self.assertIn("Due today", out)
        self.assertIn("call mum", out)

    def test_import_reads_an_old_list(self):
        old = self.folder / "old.txt"
        old.write_text("[ ] renew passport (due 2027-03-31)\n----\n")
        status, out, _ = self.jd("import", str(old))
        self.assertEqual(status, 0)
        self.assertIn("Imported 1 tasks.", out)
        self.assertIn("line 2: ----", out)

    def test_import_of_a_file_that_is_not_there(self):
        status, _, err = self.jd("import", str(self.folder / "missing.txt"))
        self.assertEqual(status, 1)
        self.assertIn("Cannot read", err)
