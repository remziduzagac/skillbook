"""tinydate: read a few plain words for dates.

>>> import datetime
>>> parse("friday", datetime.date(2027, 3, 15))
datetime.date(2027, 3, 19)
"""
import datetime
import re

__version__ = "0.2.1"

_WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
_FULL = {name: number for number, name in enumerate(_WEEKDAYS)}
_SHORT = {name[:3]: number for number, name in enumerate(_WEEKDAYS)}
_IN_DAYS = re.compile(r"in (\d+) days?")
_ISO = re.compile(r"(\d{4})-(\d{2})-(\d{2})")


def parse(text, today):
    """Return the datetime.date that text means, counted from today.

    Understood: "today", "tomorrow", a weekday name such as "friday" or "fri" (the next such day, never today),
    "in 3 days" and a date such as 2027-03-19. Raises ValueError for anything else.
    """
    if not isinstance(today, datetime.date):
        raise TypeError("today must be a datetime.date")
    words = " ".join(text.lower().split())
    if words == "today":
        return today
    if words == "tomorrow":
        return today + datetime.timedelta(days=1)
    weekday = _FULL.get(words, _SHORT.get(words))
    if weekday is not None:
        ahead = (weekday - today.weekday()) % 7 or 7
        return today + datetime.timedelta(days=ahead)
    match = _IN_DAYS.fullmatch(words)
    if match:
        return today + datetime.timedelta(days=int(match.group(1)))
    match = _ISO.fullmatch(words)
    if match:
        year, month, day = (int(part) for part in match.groups())
        try:
            return datetime.date(year, month, day)
        except ValueError:
            raise ValueError(f"tinydate: {text} is not a real date") from None
    raise ValueError(f"tinydate cannot read a date from {text!r}")
