#!/bin/sh
# skillbook's installer. It copies each chosen set's folder into the folders agents read skills from:
# ~/.claude/skills/<set> for Claude Code, when ~/.claude exists, and ~/.agents/skills/<set>, read by Codex and others,
# when ~/.codex exists. Nothing runs as root, and it never overwrites a folder it did not install: each folder it
# installs holds a .skillbook-install marker with the version.
#
#   install.sh [--sets essentials,blueprint] [--agents claude,codex] [--project] [--link] [--uninstall]
#
# For now it installs from this working copy (the folder the script sits in); installing from a release, with its
# checksums, comes with the first release. --link links the working copy's set folders instead of copying them, for
# developing skillbook. --project installs into the current folder's .claude/skills and .agents/skills.
set -eu

main() {
	src="$(cd "$(dirname "$0")" && pwd)/skills"
	sets=""
	agents=""
	scope="personal"
	mode="copy"
	action="install"

	while [ $# -gt 0 ]; do
		case "$1" in
		--sets) need_value "$@" && sets=$(printf '%s' "$2" | tr ',' ' ') && shift ;;
		--agents) need_value "$@" && agents=$(printf '%s' "$2" | tr ',' ' ') && shift ;;
		--project) scope="project" ;;
		--link) mode="link" ;;
		--uninstall) action="uninstall" ;;
		-h | --help)
			sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'
			exit 0
			;;
		*) err "unknown option: $1" ;;
		esac
		shift
	done

	[ -d "$src" ] || err "no skills/ folder next to this script; installing from a release is not available yet"
	[ -n "$sets" ] || sets=$(all_sets)
	[ -n "$sets" ] || err "no sets to install"

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

	version=$(git -C "$src" describe --tags --always --dirty 2>/dev/null || echo "working-copy")

	for agent in $agents; do
		case "$agent" in
		claude) dest="$base/.claude/skills" ;;
		codex) dest="$base/.agents/skills" ;;
		*) err "unknown agent: $agent (claude or codex)" ;;
		esac
		for set in $sets; do
			[ -f "$src/$set/SKILL.md" ] || err "no set named $set"
			if [ "$action" = "uninstall" ]; then
				uninstall_one "$dest/$set"
			else
				install_one "$src/$set" "$dest/$set"
			fi
		done
	done

	if [ "$action" = "install" ]; then
		log "next: ask your agent to set up skillbook (it adds the pointer and any read permission, with your approval)"
	fi
}

all_sets() {
	for dir in "$src"/*/; do
		[ -f "$dir/SKILL.md" ] && basename "$dir"
	done | tr '\n' ' '
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
		rm -rf "$to"
	fi
	mkdir -p "$(dirname "$to")"
	if [ "$mode" = "link" ]; then
		printf 'link %s\n' "$version" >"$from/.skillbook-install"
		ln -s "$from" "$to"
		log "linked $to -> $from"
	else
		cp -R "$from" "$to"
		printf 'copy %s\n' "$version" >"$to/.skillbook-install"
		log "copied $to ($version)"
	fi
}

uninstall_one() {
	to="$1"
	if [ ! -e "$to" ] && [ ! -L "$to" ]; then
		return 0
	fi
	owned "$to" || err "$to was not installed by skillbook; leaving it"
	rm -rf "$to"
	log "removed $to"
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
