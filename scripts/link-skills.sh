#!/usr/bin/env bash
# Links every skill in skills/ and beta/ into the folders agents read skills from, so a change in this working copy
# takes effect at once. For machines where skills are edited; elsewhere, install the plugin instead, never both, or
# every skill appears twice.
set -euo pipefail

repo="$(cd "$(dirname "$0")/.." && pwd)"
destinations=("$HOME/.claude/skills" "$HOME/.agents/skills")

linked=0
for dest in "${destinations[@]}"; do
	if [ -L "$dest" ]; then
		echo "error: $dest is a symlink; make it a real directory first" >&2
		exit 1
	fi
	mkdir -p "$dest"
	for skill_md in "$repo"/skills/*/SKILL.md "$repo"/beta/*/SKILL.md; do
		[ -e "$skill_md" ] || continue
		src="$(dirname "$skill_md")"
		target="$dest/$(basename "$src")"
		if [ -e "$target" ] && [ ! -L "$target" ]; then
			echo "skipped $target: a real directory is in the way" >&2
			continue
		fi
		ln -sfn "$src" "$target"
		linked=$((linked + 1))
	done
done
echo "linked $linked skill entries"
