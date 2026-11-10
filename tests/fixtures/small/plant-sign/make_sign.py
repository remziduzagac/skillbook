"""Make the plant stall's price sign, sign.md, from prices.csv, with the plants in alphabetical order."""
import csv

with open("prices.csv", newline="") as f:
    rows = list(csv.DictReader(f))

names = sorted(row["plant"] for row in rows)
prices = [row["price"] for row in rows]

lines = ["# Plant stall prices", ""]
for name, price in zip(names, prices):
    lines.append(f"- {name}: £{price}")

with open("sign.md", "w") as f:
    f.write("\n".join(lines) + "\n")
