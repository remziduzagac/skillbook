#!/usr/bin/env bash
# Compress logs older than a month, then drop the compressed ones after a year.
set -euo pipefail
find "$HOME/logs" -name '*.log' -mtime +30 -exec gzip {} +
find "$HOME/logs" -name '*.log.gz' -mtime +365 -delete
