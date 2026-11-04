"""Reading the dates a person types."""
import datetime
import sys
from pathlib import Path

# tinydate is vendored. Find it from this file's own location, so it works from any folder.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "vendor" / "tinydate"))

import tinydate  # noqa: E402


class DateError(ValueError):
    """The text is not a date Jotdown can read."""


def current_date():
    return datetime.date.today()


def parse_due(text, today):
    """Return the date for text such as "friday", "in 3 days" or "2027-03-19"."""
    try:
        return tinydate.parse(text, today)
    except ValueError as error:
        raise DateError(str(error)) from None
