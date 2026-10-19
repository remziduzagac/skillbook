#!/bin/sh
# Checks every set in skills/: each plain skill file opens with a heading holding the name its path gives, each file
# stays near the length skillbook-write advises, and every skill named in backticks whose group exists in the set
# resolves to a file. Prints one line per problem and exits non-zero when there is any.
set -eu

main() {
	repo="$(cd "$(dirname "$0")/.." && pwd)"
	limit=120 # about 100 lines is the advice; past this a file is reported
	problems=0

	[ -d "$repo/skills" ] || {
		echo "no skills/ folder yet; nothing to check"
		exit 0
	}

	for set_dir in "$repo"/skills/*/; do
		[ -f "$set_dir/SKILL.md" ] || continue
		refs="${set_dir}references"
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

	if [ "$problems" -gt 0 ]; then
		echo "$problems problem(s)"
		exit 1
	fi
	echo "skills: no problems"
}

main "$@"
