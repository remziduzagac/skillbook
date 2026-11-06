import datetime
import unittest

from jotdown import dates

MONDAY = datetime.date(2027, 4, 12)


class ParseDueTests(unittest.TestCase):
    def test_today_and_tomorrow(self):
        self.assertEqual(dates.parse_due("today", MONDAY), MONDAY)
        self.assertEqual(dates.parse_due("tomorrow", MONDAY), datetime.date(2027, 4, 13))

    def test_a_weekday_is_the_next_such_day(self):
        self.assertEqual(dates.parse_due("friday", MONDAY), datetime.date(2027, 4, 16))
        self.assertEqual(dates.parse_due("fri", MONDAY), datetime.date(2027, 4, 16))

    def test_the_same_weekday_means_next_week(self):
        self.assertEqual(dates.parse_due("monday", MONDAY), datetime.date(2027, 4, 19))

    def test_in_some_days(self):
        self.assertEqual(dates.parse_due("in 3 days", MONDAY), datetime.date(2027, 4, 15))
        self.assertEqual(dates.parse_due("in 1 day", MONDAY), datetime.date(2027, 4, 13))

    def test_a_full_date(self):
        self.assertEqual(dates.parse_due("2027-03-19", MONDAY), datetime.date(2027, 3, 19))

    def test_capitals_and_spaces_do_not_matter(self):
        self.assertEqual(dates.parse_due("  Friday ", MONDAY), datetime.date(2027, 4, 16))

    def test_words_it_cannot_read_are_an_error(self):
        with self.assertRaises(dates.DateError):
            dates.parse_due("sometime soon", MONDAY)

    def test_a_date_that_does_not_exist_is_an_error(self):
        with self.assertRaises(dates.DateError):
            dates.parse_due("2027-02-30", MONDAY)
