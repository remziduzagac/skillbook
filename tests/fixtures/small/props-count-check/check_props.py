import csv
from pathlib import Path

with Path("props.csv").open(newline="") as stream:
    total = sum(int(row["count"]) for row in csv.DictReader(stream))

expected = 9
status = "PASS" if total == expected else "FAIL"
message = f"{status}: expected {expected} props, counted {total}.\n"
Path("count-check.txt").write_text(message)
print(message, end="")
raise SystemExit(0 if total == expected else 1)
