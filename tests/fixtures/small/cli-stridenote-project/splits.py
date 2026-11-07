"""Print a runner's split times."""
import argparse
import csv

parser = argparse.ArgumentParser()
parser.add_argument("file")
parser.add_argument("--per", choices=["km", "mile"], default="km")
args = parser.parse_args()

with open(args.file) as handle:
    for row in csv.reader(handle):
        print(f"{row[0]} per {args.per}: {row[1]}")
