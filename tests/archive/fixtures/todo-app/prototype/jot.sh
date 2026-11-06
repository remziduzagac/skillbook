#!/usr/bin/env bash
# jot: a tiny task list kept in one text file. Last year's prototype.
#
# Usage:
#   jot.sh add "buy milk" [YYYY-MM-DD]   add a task, with a due date if one is given
#   jot.sh list                          show the tasks with their numbers
#   jot.sh done N                        remove task number N
#   jot.sh today                         count the tasks due today
set -eu

file="${JOT_FILE:-$HOME/.jot-tasks}"
touch "$file"

usage() {
	sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'
}

case "${1:-list}" in
add)
	[ -n "${2:-}" ] || {
		usage
		exit 1
	}
	printf '%s|%s\n' "${3:--}" "$2" >>"$file"
	;;
list)
	awk -F'|' '{ printf "%d  %s  %s\n", NR, ($1 == "-" ? "" : $1), $2 }' "$file"
	;;
done)
	case "${2:-}" in
	'' | *[!0-9]*)
		echo "jot: done needs a task number" >&2
		exit 1
		;;
	esac
	sed "${2}d" "$file" >"$file.tmp"
	mv "$file.tmp" "$file"
	;;
today)
	count=$(grep -c "^$(date +%F)|" "$file" || true)
	echo "$count due today"
	;;
*)
	usage
	exit 1
	;;
esac
