# tally

Prints each runner's total lap time from a CSV file of `name,m:ss` rows.

    python3 tally.py laps.csv --sort total

## Rules for this tool

- One Python file with no dependencies, so a coach can copy it onto any laptop and run it.
- It works offline. Nothing to install and no accounts.

## Decisions

- Options are read with `argparse` from the standard library (decided in March).
