"""The first version of api.py, replaced by api.py. Kept for reference."""

import urllib.request

URL = "https://old-weather.example.com/today"


def get(city):
    return urllib.request.urlopen(f"{URL}/{city}").read()
