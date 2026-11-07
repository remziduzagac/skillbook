"""Delete dated backup files that are older than a number of days."""
import argparse
import datetime
import pathlib
import re

parser = argparse.ArgumentParser()
parser.add_argument("folder")
parser.add_argument("--days", type=int, default=30)
parser.add_argument("--dry-run", action="store_true", help="list the old files without deleting them")
args = parser.parse_args()

cutoff = datetime.date.today() - datetime.timedelta(days=args.days)
for path in sorted(pathlib.Path(args.folder).glob("backup-*.tar")):
    match = re.search(r"(\d{4}-\d{2}-\d{2})", path.name)
    if not match:
        continue
    if datetime.date.fromisoformat(match.group(1)) < cutoff:
        print(f"old: {path.name}")
        if not args.dry_run:
            path.unlink()
