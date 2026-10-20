#!/bin/sh
# Checks every set in skills/: each plain skill file opens with a heading holding the name its path gives, each file
# stays near the length skillbook-write advises, and every skill named in backticks whose group exists in the set
# resolves to a file. Prints one line per problem and exits non-zero when there is any. Also prints, for each set, the
# characters of its start files (the main SKILL.md and the files its "Read `references/...`" line names), and warns,
# without failing, past the advised size.
set -eu

main() {
	repo="$(cd "$(dirname "$0")/.." && pwd)"
	limit=120         # about 100 lines is the advice; past this a file is reported
	start_limit=20000 # about 20,000 characters (about 5,000 tokens) for the start files, carried on every turn
	problems=0

	[ -d "$repo/skills" ] || {
		echo "no skills/ folder yet; nothing to check"
		exit 0
	}

	for set_dir in "$repo"/skills/*/; do
		[ -f "$set_dir/SKILL.md" ] || continue
		refs="${set_dir}references"
		start_files="$set_dir/SKILL.md $(grep '^Read `references/' "$set_dir/SKILL.md" |
			grep -o 'references/[a-z0-9/_-]*\.md' | sed "s|^|$set_dir|" | tr '\n' ' ')"
		# shellcheck disable=SC2086 # the list is split on spaces on purpose
		total=$(cat $start_files | wc -c | tr -d ' ')
		set_name=$(basename "$set_dir")
		if [ "$total" -gt "$start_limit" ]; then
			echo "$set_name: start files $total characters, past about $start_limit; warning only, trim when you can"
		else
			echo "$set_name: start files $total characters"
		fi
		for file in "$set_dir/SKILL.md" $(find "$refs" -name '*.md' 2>/dev/null | sort); do
			rel="${file#"$repo"/}"
			lines=$(wc -l <"$file")
			if [ "$lines" -gt "$limit" ]; then
				echo "$rel: $lines lines, past $limit; trim or split it"
				problems=$((problems + 1))
			fi
			case "$file" in
			"$refs"/*)
				name=$(printf '%s' "${file#"$refs"/}" | sed 's/\.md$//; s|/|-|g')
				first=$(sed -n '1p' "$file")
				if [ "$first" != "# $name" ]; then
					echo "$rel: first line should be '# $name'"
					problems=$((problems + 1))
				fi
				;;
			esac
			# The backticks are literal: they match a skill name written as code.
			# shellcheck disable=SC2016
			for word in $(grep -o '`[a-z][a-z]*\(-[a-z][a-z]*\)*`' "$file" | tr -d '`' | sort -u); do
				group="${word%%-*}"
				[ -f "$refs/$group.md" ] || continue
				path="$refs/$(printf '%s' "$word" | tr '-' '/').md"
				if [ ! -f "$path" ]; then
					echo "$rel: names \`$word\`, but ${path#"$repo"/} does not exist"
					problems=$((problems + 1))
				fi
			done
		done
	done

	# A test case's prompt must not be one of its set's own examples, or a pass may only show a matched example. A
	# case that tests an example on purpose says so with `uses_skill_example = true`.
	copied=$(for case in "$repo"/tests/cases/*/*.toml; do
		[ -f "$case" ] || continue
		grep -q '^uses_skill_example = true' "$case" && continue
		set_dir="$repo/skills/$(basename "$(dirname "$case")")"
		[ -d "$set_dir" ] || continue
		grep '^prompt = ' "$case" | sed 's/^prompt = "//; s/"$//; s/[.?!]$//' | while IFS= read -r prompt; do
			if grep -rqiF -- "$prompt" "$set_dir"; then
				echo "${case#"$repo"/}: its prompt \"$prompt\" appears in ${set_dir#"$repo"/}; word it differently"
			fi
		done
	done)
	if [ -n "$copied" ]; then
		echo "$copied"
		problems=$((problems + $(echo "$copied" | wc -l)))
	fi

	if [ "$problems" -gt 0 ]; then
		echo "$problems problem(s)"
		exit 1
	fi
	echo "skills: no problems"
}

main "$@"
