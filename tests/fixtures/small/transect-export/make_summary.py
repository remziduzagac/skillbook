import csv
from collections import Counter
from pathlib import Path

source = Path("observations.csv")
with source.open(newline="") as stream:
    counts = Counter(row["date"] for row in csv.DictReader(stream))

destination = Path("handoff/daily-counts.csv")
destination.parent.mkdir(parents=True, exist_ok=True)
with destination.open("w", newline="") as stream:
    writer = csv.writer(stream)
    writer.writerow(["date", "count"])
    writer.writerows(sorted(counts.items()))

source.unlink()
print(f"Wrote {destination}")
