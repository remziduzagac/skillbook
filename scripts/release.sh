#!/bin/sh
# Cuts a skillbook release.
#
#   scripts/release.sh <version>     such as scripts/release.sh 0.2.0, or just release 0.2.0
#
# Run it in the main working copy, on dev, with every change committed and pushed. It runs just check and the install
# tests, turns CHANGELOG.md's "## [Unreleased]" section into "## [<version>] - <date>" under a new empty Unreleased
# section, commits "chore(release): v<version>", tags it, and pushes dev, main and the tag together; main only
# fast-forwards. The tag starts the Release workflow, which tests, packs, attests and publishes the release.
set -eu

main() {
	[ $# -eq 1 ] || die "usage: scripts/release.sh <version>"
	version="$1"
	printf '%s\n' "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' || die "version must look like 0.2.0"
	cd "$(dirname "$0")/.."

	[ "$(git branch --show-current)" = dev ] || die "run this on dev"
	[ -z "$(git status --porcelain --untracked-files=no)" ] || die "commit or stash your changes first"
	git fetch -q --tags origin
	[ "$(git rev-parse dev)" = "$(git rev-parse origin/dev)" ] || die "dev must match origin/dev; push or pull first"
	git merge-base --is-ancestor origin/main dev || die "main has commits dev lacks; merge main into dev first"
	! git rev-parse -q --verify "refs/tags/v$version" >/dev/null || die "v$version already exists"
	newest=$(git tag -l 'v*' | sed -n 's/^v\([0-9]*\.[0-9]*\.[0-9]*\)$/\1/p' |
		sort -t . -k 1,1n -k 2,2n -k 3,3n | tail -n 1)
	if [ -n "$newest" ]; then
		higher=$(printf '%s\n%s\n' "$newest" "$version" | sort -t . -k 1,1n -k 2,2n -k 3,3n | tail -n 1)
		[ "$higher" = "$version" ] && [ "$newest" != "$version" ] || die "$version is not newer than v$newest"
	fi

	grep -q '^## \[Unreleased\]$' CHANGELOG.md || die "CHANGELOG.md has no \"## [Unreleased]\" section"
	awk '/^## \[Unreleased\]$/ { on = 1; next } on && /^## \[/ { exit } on && /[^[:space:]]/ { found = 1 }
		END { exit !found }' CHANGELOG.md || die "CHANGELOG.md's Unreleased section is empty"

	just check
	tests/install-test.sh

	date=$(date -u +%Y-%m-%d)
	awk -v heading="## [$version] - $date" '
		$0 == "## [Unreleased]" { print; print ""; print heading; next }
		{ print }
	' CHANGELOG.md >CHANGELOG.md.new
	mv CHANGELOG.md.new CHANGELOG.md
	git commit -q -m "chore(release): v$version" CHANGELOG.md
	git tag -a "v$version" -m "skillbook $version"
	git push --atomic origin dev dev:main "v$version"
	echo "pushed v$version; the Release workflow publishes it: gh run list --workflow release.yml"
}

die() {
	echo "release: $1" >&2
	exit 1
}

main "$@"
