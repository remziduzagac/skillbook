#!/bin/sh
# Packs a skillbook release into a folder. For each set named in skills/released it writes <set>-<version>.tar.gz,
# the set's folder with the version in its SKILL.md, and install-<set>.sh, install.sh with the version, the set and
# the archive's checksum filled in. Then version.txt, holding the version, and SHA256SUMS over every file. The release
# workflow runs it on the tagged commit; the install tests run it to make a release they can install from.
#
#   scripts/pack-release.sh <version> <folder>
set -eu

main() {
	[ $# -eq 2 ] || err "usage: scripts/pack-release.sh <version> <folder>"
	version="$1"
	printf '%s\n' "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' || err "version must look like 0.2.0, not $version"
	repo="$(cd "$(dirname "$0")/.." && pwd)"
	mkdir -p "$2"
	out="$(cd "$2" && pwd)"
	[ -z "$(ls -A "$out")" ] || err "$out is not empty"
	find_sha256
	stage=$(mktemp -d "${TMPDIR:-/tmp}/skillbook-pack.XXXXXX")
	trap 'rm -rf "$stage"' EXIT
	trap 'exit 1' INT TERM

	sets=$(sed -e 's/#.*//' -e 's/[[:space:]]//g' -e '/^$/d' "$repo/skills/released")
	[ -n "$sets" ] || err "skills/released names no set"
	for set in $sets; do
		[ -f "$repo/skills/$set/SKILL.md" ] || err "skills/released names $set, which has no SKILL.md"
		cp -R "$repo/skills/$set" "$stage/$set"
		find "$stage/$set" \( -name .skillbook-install -o -name .DS_Store \) -exec rm -f {} +
		find "$stage/$set" -name __pycache__ -prune -exec rm -rf {} +
		[ -z "$(find "$stage/$set" -type l)" ] || err "skills/$set holds a link; a release packs only regular files"
		add_version "$stage/$set/SKILL.md"
		archive="$set-$version.tar.gz"
		(cd "$stage" && tar -czf "$out/$archive" "$set")
		sha256 "$out/$archive"
		sum="$digest"
		sed -e "s/^release_version=\"\"$/release_version=\"$version\"/" \
			-e "s/^release_set=\"\"$/release_set=\"$set\"/" \
			-e "s/^release_sum=\"\"$/release_sum=\"$sum\"/" "$repo/install.sh" >"$out/install-$set.sh"
		[ "$(grep -c -e "^release_version=\"$version\"$" -e "^release_set=\"$set\"$" -e "^release_sum=\"$sum\"$" \
			"$out/install-$set.sh")" -eq 3 ] || err "could not fill in install-$set.sh"
		chmod +x "$out/install-$set.sh"
		echo "packed $set: $archive, install-$set.sh"
	done

	printf '%s\n' "$version" >"$out/version.txt"
	: >"$stage/SHA256SUMS"
	for file in "$out"/*; do
		sha256 "$file"
		printf '%s  %s\n' "$digest" "$(basename "$file")" >>"$stage/SHA256SUMS"
	done
	mv "$stage/SHA256SUMS" "$out/SHA256SUMS"
	echo "wrote version.txt and SHA256SUMS in $out"
}

# Writes the version into SKILL.md's frontmatter as metadata.version, so an installed set shows its version.
add_version() {
	grep -q '^metadata:' "$1" && err "$1 already has a metadata field"
	awk -v version="$version" '
		NR == 1 && $0 == "---" { inside = 1; print; next }
		inside && $0 == "---" { print "metadata:"; print "  version: \"" version "\""; inside = 0; done = 1 }
		{ print }
		END { if (!done) exit 1 }
	' "$1" >"$1.new" || err "$1 has no frontmatter"
	mv "$1.new" "$1"
}

find_sha256() {
	if command -v sha256sum >/dev/null 2>&1; then
		sha256_tool="sha256sum"
	elif command -v shasum >/dev/null 2>&1; then
		sha256_tool="shasum -a 256"
	else
		err "needs sha256sum or shasum"
	fi
}

# Sets $digest to a file's SHA-256, or stops: a failed or malformed checksum must never reach a release.
sha256() {
	digest=$($sha256_tool "$1" 2>/dev/null) || err "could not compute the checksum of $1"
	digest=${digest%% *}
	[ ${#digest} -eq 64 ] || err "could not compute the checksum of $1"
	case $digest in
	*[!0-9a-f]*) err "could not compute the checksum of $1" ;;
	esac
}

err() {
	printf 'pack-release: %s\n' "$1" >&2
	exit 1
}

main "$@"
