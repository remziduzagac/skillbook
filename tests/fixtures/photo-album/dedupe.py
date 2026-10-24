"""Deletes the duplicate photos listed in duplicates.txt.

Each line names a copy, then its original. Line by line, in order, a copy is deleted when its bytes match the
original's. A copy that differs stops the run, since it may hold an edit worth keeping. Deleted copies are not kept.
"""

import sys
from pathlib import Path


def main():
    for number, line in enumerate(Path("duplicates.txt").read_text().splitlines(), 1):
        if not line.strip():
            continue
        copy, original = line.split()
        if Path(copy).read_bytes() != Path(original).read_bytes():
            print(f"error: line {number}: {copy} differs from {original}; stopping", file=sys.stderr)
            return 1
        Path(copy).unlink()
        print(f"deleted {copy}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
