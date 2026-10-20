"""Adds up what each stall at the autumn fair owes, from stalls/stalls.csv."""

import csv

FEES = {"small": 10, "large": 18}


def main():
    total = 0
    with open("stalls/stalls.csv", newline="") as f:
        for row in csv.DictReader(f):
            fee = FEES[row["size"]]
            print(f"{row['stall']}: £{fee}")
            total += fee
    print(f"Total: £{total}")


if __name__ == "__main__":
    main()
