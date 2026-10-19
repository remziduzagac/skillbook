"""Small helpers for api.py."""

from datetime import date


def parse_date(text):
    year, month, day = (int(part) for part in text.split("-"))
    return date(year, month, day)
