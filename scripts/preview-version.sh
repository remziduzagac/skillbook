#!/bin/sh
# Prints a preview's version and tag for a commit, on one line: "<version> <tag>". The version is the next patch after
# the highest v<x.y.z> tag, or 0.1.0 before the first release, then the commit's UTC time and short hash, so previews
# sort after the release before them and before the next one:
#
#   scripts/preview-version.sh [<commit>]    # 0.1.1-preview.202611091530.g1a2b3c4 preview-202611091530-1a2b3c4
#
# It prints nothing, and exits 0, for a commit that already has a v<x.y.z> tag: that release covers it.
set -eu

commit="${1:-HEAD}"
cd "$(dirname "$0")/.."
git rev-parse -q --verify "$commit^{commit}" >/dev/null || {
	echo "preview-version: no such commit: $commit" >&2
	exit 1
}
if [ -n "$(git tag -l --points-at "$commit" 'v[0-9]*.[0-9]*.[0-9]*')" ]; then
	exit 0
fi
newest=$(git tag -l 'v*' | sed -n 's/^v\([0-9]*\.[0-9]*\.[0-9]*\)$/\1/p' |
	sort -t . -k 1,1n -k 2,2n -k 3,3n | tail -n 1)
if [ -n "$newest" ]; then
	next=$(printf '%s\n' "$newest" | awk -F . '{ print $1 "." $2 "." $3 + 1 }')
else
	next=0.1.0
fi
time=$(TZ=UTC git show -s --format=%cd --date=format-local:%Y%m%d%H%M "$commit")
hash=$(git rev-parse "$commit" | cut -c 1-7)
echo "$next-preview.$time.g$hash preview-$time-$hash"
