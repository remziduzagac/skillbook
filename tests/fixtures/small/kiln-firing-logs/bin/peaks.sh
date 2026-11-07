#!/bin/sh
# Print the peak temperature of each firing log in firings/ and save the lines to reports/peaks.txt.
set -eu

cd "$(dirname "$0")/.."
out=reports/peaks.txt

if [ -e "$out" ]; then
	printf '%s already exists. Overwrite it? [y/N] ' "$out"
	read -r answer || answer=n
	if [ "$answer" != y ] && [ "$answer" != Y ]; then
		echo
		echo "Not overwritten. Nothing was written."
		exit 1
	fi
fi

mkdir -p reports
for log in firings/*.csv; do
	awk -F, -v name="$(basename "$log")" '
		NR > 1 && $2 + 0 > max { max = $2 + 0; at = $1 }
		END { printf "%s: peak %d C at minute %d\n", name, max, at }
	' "$log"
done | tee "$out"
