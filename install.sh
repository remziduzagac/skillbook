#!/bin/sh
# skillbook's installer. It copies each chosen set's folder into the folders agents read skills from:
# ~/.claude/skills/<set> for Claude Code, when ~/.claude exists, and ~/.agents/skills/<set>, read by Codex and others,
# when ~/.codex exists. Nothing runs as root, and it never overwrites a folder it did not install: each folder it
# installs holds a .skillbook-install marker with the version and a checksum of every file, and it stops before
# replacing or removing a file you changed.
#
# A release carries one install-<set>.sh per set: this script with the version, the set and the archive's checksum
# filled in. It downloads that archive, checks it and installs it. Run from a working copy, this script installs the
# copy's skills/ folder instead. scripts/pack-release.sh fills in the three values below; they stay empty here.
set -eu

release_version=""
release_set=""
release_sum=""

releases="${SKILLBOOK_RELEASES:-https://github.com/remziduzagac/skillbook/releases}"

usage() {
	cat <<'EOF'
Installs skillbook's skill sets for Claude Code and Codex.

  install-<set>.sh [--agents claude,codex] [--project] [--check] [--uninstall] [--force]
  install.sh [--sets essentials,blueprint] [--agents claude,codex] [--project] [--link] [--check] [--uninstall]
             [--force]

A release's install-<set>.sh installs that set from the release; install.sh installs from a working copy.

  --sets       the sets to install from a working copy; every set by default
  --agents     the agents to install for; by default those whose folder exists, ~/.claude or ~/.codex
  --project    install into the current folder's .claude/skills and .agents/skills instead of your home
  --link       link the working copy's sets instead of copying them, for developing skillbook
  --check      show the installed version and the latest release's version; changes nothing
  --uninstall  remove what this script installed
  --force      replace or remove files you changed in an installed set
EOF
}

main() {
	sets=""
	agents=""
	scope="personal"
	mode="copy"
	action="install"
	force="no"

	while [ $# -gt 0 ]; do
		case "$1" in
		--sets) need_value "$@" && sets=$(printf '%s' "$2" | tr ',' ' ') && shift ;;
		--agents) need_value "$@" && agents=$(printf '%s' "$2" | tr ',' ' ') && shift ;;
		--project) scope="project" ;;
		--link) mode="link" ;;
		--check) action="check" ;;
		--uninstall) action="uninstall" ;;
		--force) force="yes" ;;
		-h | --help)
			usage
			exit 0
			;;
		*) err "unknown option: $1" ;;
		esac
		shift
	done

	work=$(mktemp -d "${TMPDIR:-/tmp}/skillbook-install.XXXXXX")
	trap 'rm -rf "$work"' EXIT
	trap 'exit 1' INT TERM
	find_sha256

	if [ -n "$release_version" ]; then
		[ "$mode" = copy ] || err "--link needs a working copy; this script installs from a release"
		for set in $sets; do
			[ "$set" = "$release_set" ] || err "this script installs $release_set only; $set has its own install-$set.sh"
		done
		sets="$release_set"
		version="$release_version"
	else
		case "$0" in
		install.sh | */install.sh) ;;
		*) err "run install.sh from a working copy, or use a release's install-<set>.sh" ;;
		esac
		src="$(cd "$(dirname "$0")" && pwd)/skills"
		[ -d "$src" ] || err "no skills/ folder next to this script; use a release's install-<set>.sh"
		[ -n "$sets" ] || sets=$(all_sets)
		[ -n "$sets" ] || err "no sets to install"
		for set in $sets; do
			[ -f "$src/$set/SKILL.md" ] || err "no set named $set"
		done
		version=$(git -C "$src" describe --tags --always --dirty 2>/dev/null || echo "working-copy")
	fi

	if [ "$scope" = "project" ]; then
		base="$PWD"
	else
		base="$HOME"
	fi
	if [ -z "$agents" ]; then
		[ -d "$HOME/.claude" ] && agents="claude"
		[ -d "$HOME/.codex" ] && agents="$agents codex"
		[ -n "$agents" ] || err "found neither ~/.claude nor ~/.codex; name the agents with --agents claude,codex"
	fi
	for agent in $agents; do
		folder_of "$agent" >/dev/null
	done

	if [ "$action" = "check" ]; then
		check_versions
		return 0
	fi
	if [ "$action" = "install" ] && [ -n "$release_version" ]; then
		download_release
	fi

	for agent in $agents; do
		dest=$(folder_of "$agent")
		for set in $sets; do
			if [ "$action" = "uninstall" ]; then
				uninstall_one "$dest/$set"
			else
				install_one "$src/$set" "$dest/$set"
				if [ "$set" != essentials ] && [ ! -d "$dest/essentials" ]; then
					log "note: $set builds on essentials, which is not installed in $dest; install it with install-essentials.sh"
				fi
			fi
		done
	done

	if [ "$action" = "install" ]; then
		log "next: ask your agent to set up skillbook; it adds the pointer and any read permission, with your approval"
	fi
}

all_sets() {
	for dir in "$src"/*/; do
		[ -f "$dir/SKILL.md" ] && basename "$dir"
	done | tr '\n' ' '
}

folder_of() {
	case "$1" in
	claude) echo "$base/.claude/skills" ;;
	codex) echo "$base/.agents/skills" ;;
	*) err "unknown agent: $1 (claude or codex)" ;;
	esac
}

# Downloads the release's archive of the set, checks it against the checksum filled in at release, and unpacks it
# into $work, which becomes the source.
download_release() {
	archive="$release_set-$release_version.tar.gz"
	fetch "$releases/download/v$release_version/$archive" "$work/$archive" ||
		err "could not download $archive from $releases"
	[ "$(sha256 "$work/$archive")" = "$release_sum" ] ||
		err "$archive does not match its checksum; nothing was installed"
	src="$work/src"
	mkdir "$src"
	tar -xzf "$work/$archive" -C "$src"
	[ -f "$src/$release_set/SKILL.md" ] || err "$archive holds no $release_set set; nothing was installed"
}

check_versions() {
	for agent in $agents; do
		dest=$(folder_of "$agent")
		for set in $sets; do
			if owned "$dest/$set"; then
				log "$dest/$set: $(head -n 1 "$dest/$set/.skillbook-install")"
			else
				log "$dest/$set: not installed by skillbook"
			fi
		done
	done
	if fetch "$releases/latest/download/version.txt" "$work/version.txt" &&
		latest=$(head -n 1 "$work/version.txt") && printf '%s\n' "$latest" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
		log "latest release: $latest; to update, run the set's install line again"
	else
		log "latest release: unknown, $releases could not be reached"
	fi
}

owned() {
	[ -L "$1" ] && [ -f "$1/.skillbook-install" ] && return 0
	[ -d "$1" ] && [ ! -L "$1" ] && [ -f "$1/.skillbook-install" ] && return 0
	return 1
}

install_one() {
	from="$1"
	to="$2"
	if [ -e "$to" ] || [ -L "$to" ]; then
		owned "$to" || err "$to exists and was not installed by skillbook; move it away first"
		unchanged_or_forced "$to" "replace"
		rm -rf "$to"
	fi
	mkdir -p "$(dirname "$to")"
	if [ "$mode" = "link" ]; then
		printf 'link %s\n' "$version" >"$from/.skillbook-install"
		ln -s "$from" "$to"
		log "linked $to -> $from"
	else
		cp -R "$from" "$to"
		rm -f "$to/.skillbook-install"
		write_marker "$to"
		log "copied $to ($version)"
	fi
}

uninstall_one() {
	to="$1"
	if [ ! -e "$to" ] && [ ! -L "$to" ]; then
		return 0
	fi
	owned "$to" || err "$to was not installed by skillbook; leaving it"
	unchanged_or_forced "$to" "remove"
	rm -rf "$to"
	log "removed $to"
}

# The marker's first line is the mode and version; each line after it is a file's checksum and path.
write_marker() {
	(cd "$1" && find . -type f ! -name .DS_Store ! -path '*/__pycache__/*' | sed 's|^\./||' | LC_ALL=C sort) >"$work/files"
	{
		printf 'copy %s\n' "$version"
		while IFS= read -r file; do
			printf '%s %s\n' "$(sha256 "$1/$file")" "$file"
		done <"$work/files"
	} >"$work/marker"
	mv "$work/marker" "$1/.skillbook-install"
}

# Stops when files in a copied folder differ from its marker, unless --force. A link, or a marker without checksums,
# has nothing to compare.
unchanged_or_forced() {
	[ -L "$1" ] && return 0
	marker="$1/.skillbook-install"
	sed 1d "$marker" >"$work/sums"
	[ -s "$work/sums" ] || return 0
	: >"$work/changes"
	while IFS= read -r line; do
		sum=${line%% *}
		file=${line#* }
		if [ ! -f "$1/$file" ]; then
			echo "removed  $file" >>"$work/changes"
		elif [ "$(sha256 "$1/$file")" != "$sum" ]; then
			echo "changed  $file" >>"$work/changes"
		fi
	done <"$work/sums"
	cut -d ' ' -f 2- "$work/sums" | LC_ALL=C sort >"$work/was"
	(cd "$1" && find . -type f ! -name .skillbook-install ! -name .DS_Store ! -path '*/__pycache__/*' |
		sed 's|^\./||' | LC_ALL=C sort) >"$work/now"
	LC_ALL=C comm -13 "$work/was" "$work/now" | sed 's/^/added    /' >>"$work/changes"
	[ -s "$work/changes" ] || return 0
	if [ "$force" = yes ]; then
		log "--force: replacing $(wc -l <"$work/changes" | tr -d ' ') files you changed in $1"
		return 0
	fi
	printf '  ! %s has files you changed:\n' "$1" >&2
	sed 's/^/      /' "$work/changes" >&2
	err "keep a copy of them, then run again with --force to $2 them"
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

sha256() {
	$sha256_tool "$1" | cut -d ' ' -f 1
}

fetch() {
	if command -v curl >/dev/null 2>&1; then
		curl -fsSL -o "$2" "$1"
	elif command -v wget >/dev/null 2>&1; then
		wget -q -O "$2" "$1"
	else
		err "needs curl or wget to download the release"
	fi
}

need_value() {
	[ $# -ge 2 ] && [ -n "$2" ] || err "$1 needs a value"
}

log() { printf '  > %s\n' "$1"; }
err() {
	printf '  ! %s\n' "$1" >&2
	exit 1
}

main "$@"
