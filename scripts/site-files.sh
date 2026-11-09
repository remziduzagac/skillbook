#!/bin/sh
# Writes the Pages site's own files into a folder, beside the docs the site's build adds under docs/:
#
#   - stable and preview, the channel files: one line per released set, "<tag> <checksum> install-<set>.sh", from
#     that release's SHA256SUMS. stable names the highest release; preview names the newest preview, or the latest
#     release when it was published later, so previews never fall behind. A channel with no release is an empty file.
#   - install-<set>.sh for each set a channel names: scripts/bootstrap.sh with the set filled in, the install line's
#     address.
#   - index.html, which sends a visitor to the docs.
#
#   scripts/site-files.sh <releases.tsv> <folder>
#
# releases.tsv lists the published releases and previews, one per line: tag, whether it is a pre-release (true or
# false) and when it was published, tab-separated, as the Pages workflow writes it with gh api. SHA256SUMS files are
# downloaded from SKILLBOOK_RELEASES, laid out as GitHub's releases are.
set -eu

releases="${SKILLBOOK_RELEASES:-https://github.com/remziduzagac/skillbook/releases}"
docs="${SKILLBOOK_DOCS:-https://remziduzagac.github.io/skillbook/docs/}"

main() {
	[ $# -eq 2 ] || err "usage: scripts/site-files.sh <releases.tsv> <folder>"
	list="$1"
	[ -f "$list" ] || err "no such file: $list"
	repo="$(cd "$(dirname "$0")/.." && pwd)"
	mkdir -p "$2"
	out="$(cd "$2" && pwd)"
	work=$(mktemp -d "${TMPDIR:-/tmp}/skillbook-site.XXXXXX")
	trap 'rm -rf "$work"' EXIT
	trap 'exit 1' INT TERM

	tab=$(printf '\t')
	stable=$(awk -F "$tab" '$2 == "false" && $1 ~ /^v[0-9]+\.[0-9]+\.[0-9]+$/ { print substr($1, 2) }' "$list" |
		sort -t . -k 1,1n -k 2,2n -k 3,3n | tail -n 1)
	[ -z "$stable" ] || stable="v$stable"
	preview=$(awk -F "$tab" '$2 == "true" && $1 ~ /^preview-[0-9]{12}-[0-9a-f]{7}$/ { print $1 }' "$list" |
		LC_ALL=C sort | tail -n 1)
	if [ -n "$stable" ] && [ -n "$preview" ] && later "$(published "$stable")" "$(published "$preview")"; then
		preview="$stable"
	fi
	[ -n "$preview" ] || preview="$stable"

	channel stable "$stable"
	channel preview "$preview"
	cat "$out/stable" "$out/preview" | sed 's/^.* install-\(.*\)\.sh$/\1/' | LC_ALL=C sort -u >"$work/sets"
	while IFS= read -r set; do
		sed "s/^set_name=\"\"$/set_name=\"$set\"/" "$repo/scripts/bootstrap.sh" >"$out/install-$set.sh"
		grep -q "^set_name=\"$set\"$" "$out/install-$set.sh" || err "could not fill in install-$set.sh"
		echo "wrote install-$set.sh"
	done <"$work/sets"
	cat >"$out/index.html" <<EOF
<!doctype html>
<meta charset="utf-8">
<title>skillbook: agent skills for any kind of project</title>
<link rel="canonical" href="$docs">
<meta http-equiv="refresh" content="0; url=$docs">
<p><a href="$docs">skillbook documentation</a></p>
EOF
}

# When a tag in the list was published.
published() {
	awk -F "$tab" -v tag="$1" '$1 == tag { print $3 }' "$list"
}

# Whether the first time, as GitHub writes it (2026-11-09T15:30:00Z), is later than the second.
later() {
	[ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | LC_ALL=C sort | tail -n 1)" = "$1" ]
}

# Writes a channel's file: the install scripts' lines from its release's SHA256SUMS, or nothing for no release.
channel() {
	: >"$out/$1"
	if [ -z "$2" ]; then
		echo "$1: no release"
		return 0
	fi
	fetch "$releases/download/$2/SHA256SUMS" "$work/SHA256SUMS" || err "could not download SHA256SUMS of $2"
	awk -v tag="$2" '$1 ~ /^[0-9a-f]{64}$/ && $2 ~ /^install-[a-z][a-z0-9-]*\.sh$/ { print tag " " $1 " " $2 }' \
		"$work/SHA256SUMS" >"$out/$1"
	[ -s "$out/$1" ] || err "$2's SHA256SUMS lists no install script"
	echo "$1: $2"
}

fetch() {
	curl --proto '=https,file' --proto-redir '=https' -fsSL -o "$2" "$1"
}

err() {
	printf 'site-files: %s\n' "$1" >&2
	exit 1
}

main "$@"
