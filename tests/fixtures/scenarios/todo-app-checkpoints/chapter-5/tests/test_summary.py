import datetime
import unittest

from jotdown import cli
from jotdown.store import new_data

TODAY = datetime.date(2027, 4, 12)  # a Monday


class SummaryTests(unittest.TestCase):
    def data(self):
        data = new_data()
        cli.add_task(data, "pay council tax", datetime.date(2027, 4, 9), ["admin"])
        cli.add_task(data, "call mum", datetime.date(2027, 4, 12), ["family"])
        cli.add_task(data, "renew passport", datetime.date(2027, 4, 30))
        return data

    def test_nothing_due(self):
        self.assertEqual(cli.summary_lines(new_data(), TODAY), ["Nothing is due today."])

    def test_late_tasks_come_first_under_a_heading(self):
        lines = cli.summary_lines(self.data(), TODAY)
        self.assertEqual(lines[0], "Overdue")
        self.assertIn("pay council tax", lines[1])

    def test_tasks_due_today_come_next(self):
        lines = cli.summary_lines(self.data(), TODAY)
        self.assertEqual(lines[2], "Due today")
        self.assertIn("call mum", lines[3])

    def test_later_tasks_are_left_out(self):
        self.assertNotIn("renew passport", "\n".join(cli.summary_lines(self.data(), TODAY)))

    def test_finished_tasks_are_left_out(self):
        data = self.data()
        cli.finish_task(data, 1, TODAY)
        self.assertNotIn("pay council tax", "\n".join(cli.summary_lines(data, TODAY)))

    def test_a_repeating_task_that_was_missed_shows_once(self):
        data = new_data()
        cli.add_task(data, "water the plants", datetime.date(2027, 4, 5), repeat="daily", today=TODAY)
        lines = cli.summary_lines(data, TODAY)
        self.assertEqual(sum("water the plants" in line for line in lines), 1)
