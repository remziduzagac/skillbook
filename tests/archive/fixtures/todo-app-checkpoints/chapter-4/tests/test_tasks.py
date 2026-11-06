import datetime
import unittest

from jotdown import tasks
from jotdown.store import new_data

TODAY = datetime.date(2027, 4, 12)  # a Monday


def day(month, number):
    return datetime.date(2027, month, number)


class AddTests(unittest.TestCase):
    def test_ids_count_up(self):
        data = new_data()
        first = tasks.add_task(data, "renew passport")
        second = tasks.add_task(data, "fix bike")
        self.assertEqual((first["id"], second["id"], data["next_id"]), (1, 2, 3))

    def test_tags_are_lowercase_sorted_and_without_the_hash(self):
        task = tasks.add_task(new_data(), "prune the roses", tags=["#Garden", "home", "garden"])
        self.assertEqual(task["tags"], ["garden", "home"])

    def test_a_task_needs_a_title(self):
        with self.assertRaises(tasks.TaskError):
            tasks.add_task(new_data(), "   ")

    def test_a_repeating_task_without_a_date_is_due_today(self):
        task = tasks.add_task(new_data(), "water the plants", repeat="daily", today=TODAY)
        self.assertEqual((task["due"], task["scheduled"]), ("2027-04-12", "2027-04-12"))

    def test_only_daily_and_weekly_repeat(self):
        with self.assertRaises(tasks.TaskError):
            tasks.add_task(new_data(), "water the plants", repeat="monthly")


class FinishTests(unittest.TestCase):
    def test_finishing_marks_the_task_done(self):
        data = new_data()
        tasks.add_task(data, "fix bike")
        task, following = tasks.finish_task(data, 1, TODAY)
        self.assertTrue(task["done"])
        self.assertIsNone(following)

    def test_finishing_twice_is_an_error(self):
        data = new_data()
        tasks.add_task(data, "fix bike")
        tasks.finish_task(data, 1, TODAY)
        with self.assertRaises(tasks.TaskError):
            tasks.finish_task(data, 1, TODAY)

    def test_a_task_that_does_not_exist_is_an_error(self):
        with self.assertRaises(tasks.TaskError):
            tasks.finish_task(new_data(), 7, TODAY)

    def test_the_next_task_copies_the_title_tags_and_repeat(self):
        data = new_data()
        tasks.add_task(data, "water the plants", day(4, 15), ["home"], "daily", TODAY)
        _, following = tasks.finish_task(data, 1, TODAY)
        self.assertEqual((following["title"], following["tags"], following["repeat"]), ("water the plants", ["home"], "daily"))
        self.assertEqual(following["id"], 2)

    def test_finishing_early_counts_from_the_due_date_not_from_today(self):
        data = new_data()
        tasks.add_task(data, "water the plants", day(4, 15), repeat="daily", today=TODAY)
        _, following = tasks.finish_task(data, 1, TODAY)
        self.assertEqual(following["due"], "2027-04-16")

    def test_a_missed_weekly_task_does_not_pile_up(self):
        data = new_data()
        tasks.add_task(data, "put the bins out", day(3, 29), repeat="weekly", today=TODAY)
        _, following = tasks.finish_task(data, 1, day(4, 14))
        self.assertEqual(following["due"], "2027-04-19")
        self.assertEqual([t["id"] for t in data["tasks"] if not t["done"]], [2])

    def test_a_missed_daily_task_comes_back_today(self):
        data = new_data()
        tasks.add_task(data, "water the plants", day(4, 9), repeat="daily", today=TODAY)
        _, following = tasks.finish_task(data, 1, TODAY)
        self.assertEqual(following["due"], "2027-04-12")


class EditTests(unittest.TestCase):
    def weekly(self):
        data = new_data()
        tasks.add_task(data, "water the plants", day(4, 12), ["home"], "weekly", TODAY)
        return data

    def test_editing_one_task_moves_only_that_task(self):
        data = self.weekly()
        tasks.edit_task(data, 1, due=day(4, 14))
        self.assertEqual(data["tasks"][0]["due"], "2027-04-14")
        _, following = tasks.finish_task(data, 1, day(4, 14))
        self.assertEqual(following["due"], "2027-04-19")

    def test_editing_the_title_of_one_task_leaves_the_repeat_alone(self):
        data = self.weekly()
        tasks.edit_task(data, 1, title="water the ferns")
        self.assertEqual(data["tasks"][0]["title"], "water the ferns")
        _, following = tasks.finish_task(data, 1, TODAY)
        self.assertEqual(following["title"], "water the plants")

    def test_editing_all_changes_every_task_of_the_repeat(self):
        data = self.weekly()
        tasks.edit_task(data, 1, title="water the ferns", due=day(4, 13), whole_series=True)
        _, following = tasks.finish_task(data, 1, TODAY)
        self.assertEqual((following["title"], following["due"]), ("water the ferns", "2027-04-20"))

    def test_editing_a_task_that_does_not_repeat(self):
        data = new_data()
        tasks.add_task(data, "fix bike")
        task = tasks.edit_task(data, 1, title="fix the bike", due=day(4, 20), tags=["Home"])
        self.assertEqual((task["title"], task["due"], task["tags"]), ("fix the bike", "2027-04-20", ["home"]))

    def test_nothing_to_change_is_an_error(self):
        data = new_data()
        tasks.add_task(data, "fix bike")
        with self.assertRaises(tasks.TaskError):
            tasks.edit_task(data, 1)

    def test_a_finished_task_cannot_be_edited(self):
        data = new_data()
        tasks.add_task(data, "fix bike")
        tasks.finish_task(data, 1, TODAY)
        with self.assertRaises(tasks.TaskError):
            tasks.edit_task(data, 1, title="fix the bike")


class ListTests(unittest.TestCase):
    def setUp(self):
        self.data = new_data()
        tasks.add_task(self.data, "no date")
        tasks.add_task(self.data, "later", day(5, 1), ["garden"])
        tasks.add_task(self.data, "sooner", day(4, 20), ["garden", "home"])
        tasks.add_task(self.data, "finished", day(4, 1))
        tasks.finish_task(self.data, 4, TODAY)

    def titles(self, **options):
        return [t["title"] for t in tasks.visible_tasks(self.data, **options)]

    def test_open_tasks_come_soonest_first_and_undated_last(self):
        self.assertEqual(self.titles(), ["sooner", "later", "no date"])

    def test_a_tag_shows_one_tag_group(self):
        self.assertEqual(self.titles(tag="#Garden"), ["sooner", "later"])

    def test_finished_tasks_show_on_request(self):
        self.assertEqual(self.titles(include_done=True)[0], "finished")

    def test_a_task_is_shown_with_its_number_date_tags_and_repeat(self):
        task = tasks.add_task(self.data, "water", day(4, 13), ["home"], "daily", TODAY)
        self.assertEqual(tasks.format_task(task), "[5] water (due 2027-04-13) #home (daily)")
