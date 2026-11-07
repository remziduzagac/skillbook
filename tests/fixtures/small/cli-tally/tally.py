"""Add up lap times from a CSV file."""
import argparse
import csv

parser = argparse.ArgumentParser(description="Total each runner's lap times.")
parser.add_argument("file")
parser.add_argument("--sort", choices=["name", "total"], default="name")
args = parser.parse_args()


def to_seconds(text):
    minutes, seconds = text.split(":")
    return int(minutes) * 60 + int(seconds)


def load_rows(path):
    d = []
    with open(path) as handle:
        for row in csv.reader(handle):
            try:
                d.append((row[0], to_seconds(row[1])))
            except (IndexError, ValueError):
                continue
    return d


totals = {}
for name, seconds in load_rows(args.file):
    totals[name] = totals.get(name, 0) + seconds

order = sorted(totals) if args.sort == "name" else sorted(totals, key=totals.get)
for name in order:
    minutes, seconds = divmod(totals[name], 60)
    print(f"{name}: {minutes}:{seconds:02d}")
