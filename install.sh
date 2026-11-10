#!/bin/sh
# skillbook's installer. It copies each chosen set's folder into the folders agents read skills from:
# ~/.claude/skills/<set> for Claude Code, when ~/.claude exists, and ~/.agents/skills/<set>, read by Codex and others,
# when ~/.codex exists. Nothing runs as root, and it never overwrites a folder it did not install: each folder it
# installs holds a .skillbook-install marker with the version and a checksum of every file, and it stops before
# replacing or removing a file you changed. A new copy replaces the old one only once it is complete.
#
# A release or a preview carries one install-<set>.sh per set: this script with the version, its release's tag, the
# set and the archive's checksum filled in. It downloads that archive, checks it and installs it. The install line's
# address, on the Pages site, runs scripts/bootstrap.sh, which picks a release and runs its install-<set>.sh. Run from
# a working copy, this script installs the copy's skills/ folder instead. scripts/pack-release.sh fills in the four
# values below; they stay empty here.
set -eu

release_version=""
release_tag=""
release_set=""
release_sum=""

# Where releases are downloaded from, laid out as GitHub's are, and the Pages site whose channel files, stable and
# preview, name the latest release and the newest preview. A mirror or a test's folder can stand in for either.
releases="${SKILLBOOK_RELEASES:-https://github.com/remziduzagac/skillbook/releases}"
site="${SKILLBOOK_SITE:-https://remziduzagac.github.io/skillbook}"

usage() {
	cat <<'EOF'
Installs skillbook's skill sets for Claude Code and Codex.

  curl -fsSL https://remziduzagac.github.io/skillbook/install-<set>.sh | sh -s -- [options]
  install.sh [--sets essentials,blueprint] [--link] [options]

The install line installs one set from the latest release; install.sh installs from a working copy.

  --preview    install the newest preview instead of the latest release; read by the install line's address
  --sets       the sets to install from a working copy; every set by default
  --agents     the agents to install for; by default those whose folder exists, ~/.claude or ~/.codex
  --project    install into the current folder's .claude/skills and .agents/skills instead of your home
  --link       link the working copy's sets instead of copying them, for developing skillbook
  --check      show the installed version, the latest release and the newest preview; changes nothing
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
	trap cleanup EXIT
	trap 'exit 1' INT TERM
	find_sha256

	if [ -n "$release_version" ]; then
		[ "$mode" = copy ] || err "--link needs a working copy; this script installs from a release"
		is_digest "$release_sum" || err "this script holds no valid checksum; download it again"
		is_tag "$release_tag" || err "this script holds no valid release tag; download it again"
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
		case "$agent" in
		claude | codex) ;;
		*) err "unknown agent: $agent (claude or codex)" ;;
		esac
	done

	if [ "$action" = "check" ]; then
		check_versions
		return 0
	fi
	if [ "$action" = "install" ] && [ -n "$release_version" ]; then
		download_release
	fi

	for agent in $agents; do
		dest=$(folder_of "$agent" "$base")
		for set in $sets; do
			if [ "$action" = "uninstall" ]; then
				uninstall_one "$dest/$set"
			else
				install_one "$src/$set" "$dest/$set"
				note_missing_essentials "$agent" "$set"
			fi
		done
	done

	if [ "$action" = "install" ]; then
		show_setup_line
	fi
}

# Ends an install with a line to paste into a new session of the agent: a request to set skillbook up that names the
# sets and the folders the install filled, so setup checks those folders instead of guessing them. The line has no
# prefix, so it copies cleanly.
show_setup_line() {
	set --
	for set in $sets; do
		set -- "$@" "$set"
	done
	if [ $# -gt 1 ]; then
		installed="$(and_list "$@") are installed"
	else
		installed="$1 is installed"
	fi
	set --
	for agent in $agents; do
		case "$agent" in
		claude) set -- "$@" "$(shown_folder claude) for Claude Code" ;;
		codex) set -- "$@" "$(shown_folder codex) for Codex" ;;
		esac
	done
	if [ "$scope" = "project" ]; then
		when="once in this project: start a new session of your agent in this folder"
		line="Set up skillbook in this project: $installed in its $(and_list "$@")."
	else
		when="once on this machine: start a new session of your agent"
		line="Set up skillbook on this machine: $installed in $(and_list "$@")."
	fi
	log "next, $when and paste the line below. It proposes the pointer and any read permission for your approval."
	printf '\n%s\n' "$line"
}

# An agent's skill folder as the setup line shows it: from the home, as ~/..., or from the project's folder.
shown_folder() {
	folder=$(folder_of "$1" "")
	folder=${folder#/}
	if [ "$scope" = "project" ]; then
		printf '%s' "$folder"
	else
		printf '%s/%s' '~' "$folder"
	fi
}

# Joins its arguments as words do: "a", "a and b", "a, b and c".
and_list() {
	list="$1"
	shift
	while [ $# -gt 1 ]; do
		list="$list, $1"
		shift
	done
	if [ $# -eq 1 ]; then
		list="$list and $1"
	fi
	printf '%s' "$list"
}

all_sets() {
	for dir in "$src"/*/; do
		[ -f "$dir/SKILL.md" ] && basename "$dir"
	done | tr '\n' ' '
}

folder_of() {
	case "$1" in
	claude) echo "$2/.claude/skills" ;;
	codex) echo "$2/.agents/skills" ;;
	esac
}

note_missing_essentials() {
	[ "$2" = essentials ] && return 0
	[ -d "$(folder_of "$1" "$base")/essentials" ] && return 0
	[ -d "$(folder_of "$1" "$HOME")/essentials" ] && return 0
	log "note: $2 builds on essentials, which is not installed for $1; install it with install-essentials.sh"
}

# Downloads the release's archive of the set, checks it against the checksum filled in at release, and unpacks it
# into $work, which becomes the source.
download_release() {
	archive="$release_set-$release_version.tar.gz"
	fetch "$releases/download/$release_tag/$archive" "$work/$archive" ||
		err "could not download $archive from $releases"
	sha256 "$work/$archive"
	[ "$digest" = "$release_sum" ] || err "$archive does not match its checksum; nothing was installed"
	src="$work/src"
	mkdir "$src"
	tar -xzf "$work/$archive" -C "$src"
	[ -f "$src/$release_set/SKILL.md" ] || err "$archive holds no $release_set set; nothing was installed"
}

check_versions() {
	for agent in $agents; do
		dest=$(folder_of "$agent" "$base")
		for set in $sets; do
			if owned "$dest/$set"; then
				log "$dest/$set: $(head -n 1 "$dest/$set/.skillbook-install")"
			else
				log "$dest/$set: not installed by skillbook"
			fi
		done
	done
	log "latest release: $(channel_tag stable)"
	log "newest preview: $(channel_tag preview)"
	log "to update, run the set's install line again; add --preview for previews"
}

# The tag a channel's file on the site names: one line per set, "<tag> <checksum> install-<set>.sh", the same tag on
# each. "none" when the site has no file for the channel, and "unknown" when it cannot be read.
channel_tag() {
	if ! fetch "$site/$1" "$work/$1" 2>/dev/null; then
		echo "unknown, $site/$1 could not be read"
		return 0
	fi
	read -r tag _ <"$work/$1" || true
	if [ -z "${tag:-}" ]; then
		echo "none"
	elif is_tag "$tag"; then
		echo "$tag"
	else
		echo "unknown, $site/$1 is not a channel's file"
	fi
}

owned() {
	[ -L "$1" ] && [ -f "$1/.skillbook-install" ] && return 0
	[ -d "$1" ] && [ ! -L "$1" ] && [ -f "$1/.skillbook-install" ] && return 0
	return 1
}

# Sets $staging, a folder beside the agent's skills folder and on the same disk, where a new copy is made whole
# before it replaces the old one, and where the old one waits until the new one is in place. Agents never load from
# it. An old copy left there by an interrupted run goes back in place, so it is checked like any install.
stage_for() {
	staging="$(dirname "$(dirname "$1")")/.skillbook-staging"
	new="$staging/$(basename "$1").new"
	old="$staging/$(basename "$1").old"
	if [ ! -e "$1" ] && [ ! -L "$1" ] && { [ -e "$old" ] || [ -L "$old" ]; }; then
		mv "$old" "$1"
		log "put back $1, kept by an earlier run that was interrupted"
	fi
	rm -rf "$new" "$old"
}

install_one() {
	from="$1"
	to="$2"
	stage_for "$to"
	if [ -e "$to" ] || [ -L "$to" ]; then
		owned "$to" || err "$to exists and was not installed by skillbook; move it away first"
		unchanged_or_forced "$to" replace
	fi
	mkdir -p "$(dirname "$to")" "$staging"
	if [ "$mode" = "link" ]; then
		printf 'link %s\n' "$version" >"$from/.skillbook-install"
		ln -s "$from" "$new"
	else
		cp -R "$from" "$new" || err "could not copy $from; $to is unchanged"
		rm -f "$new/.skillbook-install"
		write_marker "$new"
	fi
	if [ -e "$to" ] || [ -L "$to" ]; then
		mv "$to" "$old" || err "could not move $to aside; it is unchanged"
	fi
	if ! mv "$new" "$to"; then
		if [ -e "$old" ] || [ -L "$old" ]; then
			mv "$old" "$to"
		fi
		err "could not put the new copy in place; $to is unchanged"
	fi
	rm -rf "$old"
	rmdir "$staging" 2>/dev/null || true
	if [ "$mode" = "link" ]; then
		log "linked $to -> $from"
	else
		log "copied $to ($version)"
	fi
}

uninstall_one() {
	to="$1"
	stage_for "$to"
	if [ ! -e "$to" ] && [ ! -L "$to" ]; then
		return 0
	fi
	owned "$to" || err "$to was not installed by skillbook; leaving it"
	unchanged_or_forced "$to" remove
	mkdir -p "$staging"
	mv "$to" "$old" || err "could not remove $to"
	rm -rf "$old"
	rmdir "$staging" 2>/dev/null || true
	log "removed $to"
}

# Every file and link in a copied folder, by path, leaving out the marker and files the system or Python adds.
inventory() {
	(cd "$1" && find . ! -type d ! -name .skillbook-install ! -name .DS_Store ! -path '*/__pycache__/*' |
		sed 's|^\./||' | LC_ALL=C sort)
}

# The marker's first line is the mode and version; each line after it is a file's checksum and path.
write_marker() {
	inventory "$1" >"$work/files"
	printf 'copy %s\n' "$version" >"$work/marker"
	while IFS= read -r file; do
		sha256 "$1/$file"
		printf '%s %s\n' "$digest" "$file" >>"$work/marker"
	done <"$work/files"
	mv "$work/marker" "$1/.skillbook-install"
}

# Stops when a copied folder's files differ from its marker, unless --force. A link has nothing to compare; a copy
# whose marker holds no checksums, made by an older install script, cannot be compared, so it stops too.
unchanged_or_forced() {
	[ -L "$1" ] && return 0
	sed 1d "$1/.skillbook-install" >"$work/sums"
	if [ ! -s "$work/sums" ]; then
		[ "$force" = yes ] && return 0
		err "$1 has no checksums to find files you changed; keep a copy of any you changed, then run again with --force"
	fi
	: >"$work/changes"
	while IFS= read -r line; do
		sum=${line%% *}
		file=${line#* }
		if [ -L "$1/$file" ]; then
			echo "changed  $file, now a link" >>"$work/changes"
		elif [ ! -f "$1/$file" ]; then
			echo "removed  $file" >>"$work/changes"
		else
			sha256 "$1/$file"
			[ "$digest" = "$sum" ] || echo "changed  $file" >>"$work/changes"
		fi
	done <"$work/sums"
	cut -d ' ' -f 2- "$work/sums" | LC_ALL=C sort >"$work/was"
	inventory "$1" >"$work/now"
	LC_ALL=C comm -13 "$work/was" "$work/now" | sed 's/^/added    /' >>"$work/changes"
	[ -s "$work/changes" ] || return 0
	if [ "$force" = yes ]; then
		log "--force: going on to $2 $(wc -l <"$work/changes" | tr -d ' ') files you changed in $1"
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

# Removes the temporary folder, and a new copy that was not put in place.
cleanup() {
	rm -rf "$work"
	if [ -n "${new:-}" ] && { [ -e "$new" ] || [ -L "$new" ]; }; then
		rm -rf "$new"
		rmdir "$staging" 2>/dev/null || true
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
