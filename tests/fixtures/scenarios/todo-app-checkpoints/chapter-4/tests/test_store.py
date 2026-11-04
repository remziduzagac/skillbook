import tempfile
import unittest
from pathlib import Path

from jotdown.store import Store, new_data


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
