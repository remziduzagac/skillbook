#!/usr/bin/env bash
# Remove files in /tmp that nobody has touched for a week.
set -euo pipefail
find /tmp -type f -mtime +7 -delete
