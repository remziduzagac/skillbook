"""Fetches the weather for a city from a public weather service."""

import json
import sys
import urllib.request

from utils import parse_date

BASE_URL = "https://weather.example.com/v1/today"


def fetch_weather(city):
    with urllib.request.urlopen(f"{BASE_URL}?city={city}") as response:
        return json.load(response)


def main():
    city = sys.argv[1] if len(sys.argv) > 1 else "Istanbul"
    report = fetch_weather(city)
    day = parse_date(report["date"])
    print(f"{city}, {day:%d %B}: {report['summary']}, {report['temperature']} °C")


if __name__ == "__main__":
    main()
