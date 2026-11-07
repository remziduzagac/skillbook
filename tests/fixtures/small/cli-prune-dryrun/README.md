# prune

Deletes backup files whose date, written in the file name, is older than a number of days.

    python3 prune.py backups --days 30

With `--dry-run` the old files are listed and nothing is deleted.
