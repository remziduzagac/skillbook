#!/bin/sh
# The install line's address for one set, on skillbook's Pages site. scripts/site-files.sh writes it there as
# install-<set>.sh, with the set filled in below:
#
#   curl -fsSL https://remziduzagac.github.io/skillbook/install-<set>.sh | sh                   # the latest release
#   curl -fsSL https://remziduzagac.github.io/skillbook/install-<set>.sh | sh -s -- --preview   # the newest preview
#
# It installs nothing itself. It reads the channel's file from the site, stable or preview, whose line for the set
# names a release's tag and the checksum of that release's install-<set>.sh. It downloads that script, checks it, and
# runs it with the other options. --check, --uninstall and --help need no particular release: when the stable channel
# has none for the set yet, they use the preview's. SKILLBOOK_SITE and SKILLBOOK_RELEASES read from elsewhere, such as
# a mirror or a test's folder.
set -eu

set_name=""

site="${SKILLBOOK_SITE:-https://remziduzagac.github.io/skillbook}"
releases="${SKILLBOOK_RELEASES:-https://github.com/remziduzagac/skillbook/releases}"

main() {
	[ -n "$set_name" ] || err "this script names no set; use a set's install line from the Pages site"
	# --preview picks the preview channel; every other option goes to the release's script, in order.
	channel=stable
	manage=no
	n=$#
	while [ "$n" -gt 0 ]; do
		arg=$1
		shift
		n=$((n - 1))
		case "$arg" in
		--preview) channel=preview ;;
		--check | --uninstall | -h | --help) manage=yes && set -- "$@" "$arg" ;;
		*) set -- "$@" "$arg" ;;
		esac
	done

	work=$(mktemp -d "${TMPDIR:-/tmp}/skillbook-bootstrap.XXXXXX")
	trap 'rm -rf "$work"' EXIT
	trap 'exit 1' INT TERM
	find_sha256

	line=$(channel_line "$channel")
	if [ -z "$line" ] && [ "$channel" = stable ] && [ "$manage" = yes ]; then
		channel=preview
		line=$(channel_line preview)
	fi
	if [ -z "$line" ]; then
		[ "$channel" = stable ] || err "there is no preview of $set_name now; install the latest release without --preview"
		err "$set_name has no release yet; the newest preview installs with --preview"
	fi
	tag=${line%% *}
	sum=${line#* }
	sum=${sum%% *}
	if ! is_tag "$tag" || ! is_digest "$sum"; then
		err "$site/$channel is not a channel's file; nothing was installed"
	fi

	log "the $channel channel's release: $tag"
	fetch "$releases/download/$tag/install-$set_name.sh" "$work/install.sh" ||
		err "could not download install-$set_name.sh of $tag from $releases"
	sha256 "$work/install.sh"
	[ "$digest" = "$sum" ] || err "install-$set_name.sh of $tag does not match its checksum; nothing was installed"
	sh "$work/install.sh" "$@"
}

# The channel's line for this set, "<tag> <checksum> install-<set>.sh", or nothing.
channel_line() {
	fetch "$site/$1" "$work/$1" || err "could not read the $1 channel from $site"
	grep " install-$set_name\.sh\$" "$work/$1" || true
}

find_sha256() {
	if command -v sha256sum >/dev/null 2>&1; then
		sha256_tool="sha256sum"
	elif command -v shasum >/dev/null 2>&1; then
		sha256_tool="shasum -a 256"
	else
		err "needs sha256sum or shasum to check files"
	fi
}

# Sets $digest to a file's SHA-256, or stops: a failed or malformed checksum must never pass as a match.
sha256() {
	digest=$($sha256_tool "$1" 2>/dev/null) || err "could not compute the checksum of $1"
	digest=${digest%% *}
	is_digest "$digest" || err "could not compute the checksum of $1"
}

is_digest() {
	[ ${#1} -eq 64 ] || return 1
	case $1 in
	*[!0-9a-f]*) return 1 ;;
	esac
}

# A release's tag, v<x.y.z>, or a preview's, preview-<12-digit UTC time>-<7-hex commit>; it goes into an address.
is_tag() {
	printf '%s\n' "$1" | grep -Eq '^(v[0-9]+\.[0-9]+\.[0-9]+|preview-[0-9]{12}-[0-9a-f]{7})$'
}

fetch() {
	if command -v curl >/dev/null 2>&1; then
		curl --proto '=https,file' --proto-redir '=https' -fsSL -o "$2" "$1"
	elif command -v wget >/dev/null 2>&1; then
		wget -q -O "$2" "$1"
	else
		err "needs curl or wget to download the release"
	fi
}

log() { printf '  > %s\n' "$1"; }
err() {
	printf '  ! %s\n' "$1" >&2
	exit 1
}

main "$@"
