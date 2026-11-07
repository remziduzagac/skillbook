#!/usr/bin/env bash
# Make web-sized copies of every JPEG in the current folder.
set -euo pipefail
mkdir -p small
for f in *.jpg; do
	convert "$f" -resize 1600x1600 "small/$f"
done
