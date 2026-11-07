#!/usr/bin/env bash
# Rename each JPEG to the date it was taken, read from its camera data.
set -euo pipefail
exiftool '-FileName<DateTimeOriginal' -d '%Y-%m-%d_%H%M%S%%-c.%%e' ./*.jpg
