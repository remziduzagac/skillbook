import datetime
import io
import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from jotdown.cli import main
from jotdown.store import DataFileError, Store, default_path, new_data


class StoreTests(unittest.TestCase):
    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.path = Path(folder.name) / "data" / "tasks.json"

    def test_a_missing_file_is_a_new_list(self):
        self.assertEqual(Store(self.path).load(), new_data())

    def test_save_then_load(self):
        data = new_data()
        data["tasks"].append({"id": 1, "title": "renew passport"})
        Store(self.path).save(data)
        self.assertEqual(Store(self.path).load(), data)

    def test_save_replaces_the_old_file(self):
        store = Store(self.path)
        store.save(new_data())
        data = new_data()
        data["next_id"] = 5
        store.save(data)
        self.assertEqual(store.load()["next_id"], 5)

    def test_save_leaves_no_second_file_behind(self):
        Store(self.path).save(new_data())
        self.assertEqual([p.name for p in self.path.parent.iterdir()], ["tasks.json"])

    def test_text_outside_ascii_survives(self):
        data = new_data()
        data["tasks"].append({"id": 1, "title": "caf\u00e9"})
        Store(self.path).save(data)
        self.assertEqual(Store(self.path).load()["tasks"][0]["title"], "caf\u00e9")


class DataLocationTests(unittest.TestCase):
    """Where the data file is, and that the folder the command runs in does not matter."""

    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.folder = Path(folder.name).resolve()
        home = str(self.folder / "home")
        patcher = mock.patch.dict(os.environ, {"HOME": home, "USERPROFILE": home})
        patcher.start()
        self.addCleanup(patcher.stop)
        os.environ.pop("JOTDOWN_DATA", None)
        before = os.getcwd()
        self.addCleanup(os.chdir, before)

    def test_the_default_is_in_the_home_folder(self):
        self.assertEqual(default_path(), self.folder / "home" / ".jotdown" / "tasks.json")

    def test_jotdown_data_names_another_file(self):
        os.environ["JOTDOWN_DATA"] = str(self.folder / "mine.json")
        self.assertEqual(default_path(), self.folder / "mine.json")

    def test_the_folder_the_command_runs_in_does_not_matter(self):
        (self.folder / "a").mkdir()
        (self.folder / "b").mkdir()
        os.chdir(self.folder / "a")
        first = default_path()
        os.chdir(self.folder / "b")
        self.assertEqual(default_path(), first)

    def test_tasks_saved_in_one_folder_are_found_from_another(self):
        os.environ["JOTDOWN_DATA"] = str(self.folder / "mine.json")
        (self.folder / "a").mkdir()
        (self.folder / "b").mkdir()
        os.chdir(self.folder / "a")
        data = new_data()
        data["tasks"].append({"id": 1, "title": "renew passport"})
        Store().save(data)
        os.chdir(self.folder / "b")
        self.assertEqual(Store().load()["tasks"][0]["title"], "renew passport")
        self.assertEqual(sorted(p.name for p in self.folder.iterdir()), ["a", "b", "mine.json"])


class BrokenFileTests(unittest.TestCase):
    """A data file that cannot be read stops the command and is never overwritten."""

    def setUp(self):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.path = Path(folder.name) / "tasks.json"

    def test_text_that_is_not_json_is_an_error(self):
        self.path.write_text('{"tasks": [')
        with self.assertRaises(DataFileError) as caught:
            Store(self.path).load()
        self.assertIn(str(self.path), str(caught.exception))

    def test_json_of_the_wrong_shape_is_an_error(self):
        self.path.write_text("[]")
        with self.assertRaises(DataFileError):
            Store(self.path).load()

    def test_a_command_stops_and_leaves_the_file_as_it_was(self):
        broken = '{"tasks": ['
        self.path.write_text(broken)
        out, err = io.StringIO(), io.StringIO()
        status = main(["add", "buy milk"], store=Store(self.path), today=datetime.date(2027, 4, 12), out=out, err=err)
        self.assertEqual(status, 2)
        self.assertIn(str(self.path), err.getvalue())
        self.assertEqual(self.path.read_text(), broken)
