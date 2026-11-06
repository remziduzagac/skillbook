import datetime
import tempfile
import unittest
from pathlib import Path

from jotdown import importer
from jotdown.store import new_data

IMPORT_DAY = datetime.date(2027, 3, 15)  # a Monday


class ParseLineTests(unittest.TestCase):
    def test_a_checkbox_and_a_due_date(self):
        fields = importer.parse_line("[ ] renew passport (due 2027-03-31)", IMPORT_DAY)
        self.assertEqual(
            fields,
            {"title": "renew passport", "done": False, "due": datetime.date(2027, 3, 31), "tags": [], "repeat": None},
        )

    def test_a_finished_task(self):
        fields = importer.parse_line("[x] fix bike", IMPORT_DAY)
        self.assertEqual((fields["title"], fields["done"], fields["due"]), ("fix bike", True, None))

    def test_a_weekday_word_means_the_next_such_day_and_tags_are_read(self):
        fields = importer.parse_line("call mum fri #family", IMPORT_DAY)
        self.assertEqual(
            (fields["title"], fields["due"], fields["tags"]), ("call mum", datetime.date(2027, 3, 19), ["family"])
        )

    def test_every_monday_repeats_weekly(self):
        fields = importer.parse_line("[ ] put the bins out every monday #home", IMPORT_DAY)
        self.assertEqual(
            (fields["title"], fields["repeat"], fields["due"]), ("put the bins out", "weekly", datetime.date(2027, 3, 22))
        )

    def test_every_day_repeats_daily(self):
        fields = importer.parse_line("[ ] water the tomatoes every day #garden", IMPORT_DAY)
        self.assertEqual((fields["title"], fields["repeat"], fields["due"]), ("water the tomatoes", "daily", None))

    def test_a_weekday_inside_another_word_is_not_a_weekday(self):
        fields = importer.parse_line("[ ] book the wedding venue", IMPORT_DAY)
        self.assertEqual((fields["title"], fields["due"]), ("book the wedding venue", None))

    def test_a_separator_is_not_a_task(self):
        with self.assertRaises(importer.ImportLineError):
            importer.parse_line("----", IMPORT_DAY)

    def test_a_date_that_does_not_exist_is_not_guessed(self):
        with self.assertRaises(importer.ImportLineError) as caught:
            importer.parse_line("pay rent (due 2027-02-30)", IMPORT_DAY)
        self.assertIn("2027-02-30", str(caught.exception))


class ImportTextTests(unittest.TestCase):
    TEXT = "[ ] renew passport (due 2027-03-31)\n----\n[x] fix bike\n\npay rent (due 2027-02-30)\n[ ] water the plants every day\n"

    def test_good_lines_are_added_and_bad_lines_are_listed(self):
        data = new_data()
        added, skipped, rejected = importer.import_text(self.TEXT, data, IMPORT_DAY)
        self.assertEqual((added, skipped), (3, 0))
        self.assertEqual([(number, line) for number, line, _ in rejected], [(2, "----"), (5, "pay rent (due 2027-02-30)")])
        self.assertEqual([t["title"] for t in data["tasks"]], ["renew passport", "fix bike", "water the plants"])
        self.assertTrue(data["tasks"][1]["done"])

    def test_a_repeat_with_no_day_starts_on_the_day_of_the_import(self):
        data = new_data()
        importer.import_text(self.TEXT, data, IMPORT_DAY)
        self.assertEqual(data["tasks"][2]["due"], "2027-03-15")

    def test_a_second_import_adds_nothing(self):
        data = new_data()
        importer.import_text(self.TEXT, data, IMPORT_DAY)
        added, skipped, rejected = importer.import_text(self.TEXT, data, IMPORT_DAY)
        self.assertEqual((added, skipped, len(rejected)), (0, 3, 2))
        self.assertEqual(len(data["tasks"]), 3)

    def test_a_file_is_read(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "old.txt"
            path.write_text(self.TEXT)
            added, _, _ = importer.import_file(path, new_data(), IMPORT_DAY)
        self.assertEqual(added, 3)
