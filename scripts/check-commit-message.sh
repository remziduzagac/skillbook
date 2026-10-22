#!/bin/sh
# Refuses a commit message that credits an AI tool: a trailer such as Co-authored-by naming one, a "Generated with"
# line naming one, or the robot emoji such tools add. Naming a tool otherwise is fine, since skillbook writes about
# them. As a commit-msg hook it checks the message file it is given; with --range it checks every commit in a range,
# as CI does. Prints each offending line and exits non-zero when there is any.
set -eu

tools='claude|anthropic|codex|openai|chatgpt|gpt-[0-9]|copilot|cursor|gemini|aider|devin|windsurf'
pattern="^[[:space:]]*[a-z-]+-by:.*($tools)|generated (with|by) .*($tools)|🤖"

# The lines of a message on standard input that credit an AI tool. Comment lines, and everything below the scissors
# line that `git commit -v` adds, are not part of the message.
offending() {
	sed -e '/^# -\{24\} >8 -\{24\}$/,$d' -e '/^#/d' | grep -iE "$pattern" || true
}

main() {
	if [ "${1-}" = --range ]; then
		status=0
		for commit in $(git rev-list "$2"); do
			found="$(git log -1 --format=%B "$commit" | offending)"
			if [ -n "$found" ]; then
				printf 'commit %s credits an AI tool:\n%s\n' "$commit" "$found"
				status=1
			fi
		done
		exit "$status"
	fi
	found="$(offending <"$1")"
	if [ -n "$found" ]; then
		printf '%s\n%s\n%s\n' "This commit message credits an AI tool, which skillbook's commits never do:" "$found" \
			"Remove that line and commit again." >&2
		exit 1
	fi
}

main "$@"
