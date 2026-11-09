#!/bin/sh
# Tests install.sh. Each test copies the script and the skills/ folder into a fresh temporary folder and runs it there,
# with HOME pointing at a throwaway home, so the working copy and the real home are never touched. Prints one line per
# test and exits non-zero when any fails.
set -u

main() {
	repo="$(cd "$(dirname "$0")/.." && pwd)"
	set_name="essentials"
	passed=0
	failed=0

	tests=$(sed -n 's/^test_\([a-z_]*\)() {$/\1/p' "$0")
	tmp=${TMPDIR:-/tmp}
	tmp=${tmp%/} # macOS ends TMPDIR with a slash, which would double it in every path
	for t in $tests; do
		root=$(mktemp -d "$tmp/skillbook-install-test.XXXXXX")
		mkdir -p "$root/src" "$root/home" "$root/project"
		cp "$repo/install.sh" "$root/src/install.sh"
		cp -R "$repo/skills" "$root/src/skills"
		mkdir "$root/src/scripts"
		cp "$repo/scripts/pack-release.sh" "$root/src/scripts/pack-release.sh" 2>/dev/null
		rm -f "$root/src/skills/"*/.skillbook-install
		src="$root/src/skills/$set_name"
		HOME="$root/home"
		out="$root/out"
		if (cd "$root/project" && "test_$t") >"$root/log" 2>&1; then
			passed=$((passed + 1))
			echo "ok    $t"
		else
			failed=$((failed + 1))
			echo "FAIL  $t"
			sed 's/^/      /' "$root/log"
		fi
		rm -rf "$root"
	done

	echo "install tests: $passed passed, $failed failed"
	[ "$failed" -eq 0 ]
}

# Runs install.sh with the given options, its output kept in $out; returns its exit status.
run() {
	"$root/src/install.sh" "$@" >"$out" 2>&1
}

fail() {
	echo "$1"
	[ -f "$out" ] && sed 's/^/  install.sh: /' "$out"
	return 1
}

same_tree() {
	diff -r -x .skillbook-install "$1" "$2" >/dev/null || fail "$2 differs from $1"
}

marker_is() {
	[ -f "$1/.skillbook-install" ] || fail "no marker in $1" || return 1
	first=$(head -n 1 "$1/.skillbook-install")
	case $first in
	"$2" | "$2 "*) return 0 ;;
	*) fail "marker in $1 starts '$first', expected '$2 ...'" ;;
	esac
}

# Packs the copied sets at version $1 into a folder laid out like GitHub's release downloads, as the release
# workflow would, with version.txt also under latest/. Sets $release to that version's folder.
pack() {
	release="$root/releases/download/v$1"
	"$root/src/scripts/pack-release.sh" "$1" "$release" >"$out" 2>&1 || fail "pack-release.sh failed" || return 1
	mkdir -p "$root/releases/latest/download"
	cp "$release/version.txt" "$root/releases/latest/download/version.txt"
}

# Runs the packed install-<set>.sh as `curl … | sh` does: read from standard input, so it has no file of its own.
run_release() {
	SKILLBOOK_RELEASES="file://$root/releases" sh -s -- "$@" <"$release/install-$set_name.sh" >"$out" 2>&1
}

sha256_check() {
	if command -v sha256sum >/dev/null 2>&1; then
		sha256sum -c "$1"
	else
		shasum -a 256 -c "$1"
	fi
}

test_copy_into_both_agents() {
	mkdir "$HOME/.claude" "$HOME/.codex"
	run || fail "install failed" || return 1
	for dest in "$HOME/.claude/skills/$set_name" "$HOME/.agents/skills/$set_name"; do
		[ -d "$dest" ] && [ ! -L "$dest" ] || fail "$dest is not a copied folder" || return 1
		same_tree "$src" "$dest" || return 1
		marker_is "$dest" copy || return 1
	done
	[ ! -e "$src/.skillbook-install" ] || fail "copy mode wrote a marker into the source"
}

test_finds_only_the_agents_present() {
	mkdir "$HOME/.claude"
	run || fail "install failed" || return 1
	[ -d "$HOME/.claude/skills/$set_name" ] || fail "Claude Code's folder was not filled" || return 1
	[ ! -e "$HOME/.agents" ] || fail "the home's .agents was written although .codex is missing"
}

test_no_agent_found_is_an_error() {
	if run; then fail "install succeeded with neither ~/.claude nor ~/.codex"; fi
	grep -q "found neither" "$out" || fail "no message naming the missing folders"
}

test_agents_named_explicitly() {
	run --agents codex || fail "install failed" || return 1
	[ -d "$HOME/.agents/skills/$set_name" ] || fail "the home's .agents/skills was not filled" || return 1
	[ ! -e "$HOME/.claude" ] || fail "the home's .claude was written although only codex was named"
}

test_link_mode() {
	mkdir "$HOME/.claude"
	run --link || fail "install --link failed" || return 1
	dest="$HOME/.claude/skills/$set_name"
	[ -L "$dest" ] || fail "$dest is not a link" || return 1
	[ "$(readlink "$dest")" = "$src" ] || fail "$dest points to $(readlink "$dest"), not $src" || return 1
	marker_is "$src" link
}

test_refuses_a_folder_it_did_not_install() {
	mkdir -p "$HOME/.claude/skills/$set_name"
	echo mine >"$HOME/.claude/skills/$set_name/SKILL.md"
	if run; then fail "install overwrote a folder without a marker"; fi
	[ "$(cat "$HOME/.claude/skills/$set_name/SKILL.md")" = mine ] || fail "the user's own file was changed"
}

test_runs_twice() {
	mkdir "$HOME/.claude"
	run || fail "first install failed" || return 1
	run || fail "second install failed" || return 1
	same_tree "$src" "$HOME/.claude/skills/$set_name"
}

test_reinstall_drops_removed_files() {
	mkdir "$HOME/.claude"
	run || fail "first install failed" || return 1
	rm "$src/references/act.md"
	run || fail "second install failed" || return 1
	[ ! -e "$HOME/.claude/skills/$set_name/references/act.md" ] || fail "a file removed from the set was kept"
}

test_switches_between_copy_and_link() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "copy failed" || return 1
	run --link || fail "copy to link failed" || return 1
	[ -L "$dest" ] || fail "$dest is not a link after --link" || return 1
	run || fail "link to copy failed" || return 1
	[ -d "$dest" ] && [ ! -L "$dest" ] || fail "$dest is not a copied folder after copying again" || return 1
	[ -f "$src/SKILL.md" ] || fail "replacing the link removed the source"
}

test_uninstall() {
	mkdir "$HOME/.claude" "$HOME/.codex"
	run || fail "install failed" || return 1
	run --uninstall || fail "uninstall failed" || return 1
	[ ! -e "$HOME/.claude/skills/$set_name" ] || fail "Claude Code's copy is still there" || return 1
	[ ! -e "$HOME/.agents/skills/$set_name" ] || fail "the ~/.agents copy is still there"
}

test_uninstall_a_link_keeps_the_source() {
	mkdir "$HOME/.claude"
	run --link || fail "install --link failed" || return 1
	run --uninstall || fail "uninstall failed" || return 1
	[ ! -e "$HOME/.claude/skills/$set_name" ] || fail "the link is still there" || return 1
	[ -f "$src/SKILL.md" ] || fail "uninstalling the link removed the source"
}

test_uninstall_leaves_a_folder_it_did_not_install() {
	mkdir -p "$HOME/.claude/skills/$set_name"
	echo mine >"$HOME/.claude/skills/$set_name/SKILL.md"
	if run --uninstall; then fail "uninstall removed or accepted a folder without a marker"; fi
	[ -f "$HOME/.claude/skills/$set_name/SKILL.md" ] || fail "the user's own folder was removed"
}

test_uninstall_when_nothing_is_installed() {
	mkdir "$HOME/.claude"
	run --uninstall || fail "uninstall failed with nothing installed"
}

test_project_scope() {
	mkdir "$HOME/.claude"
	run --project || fail "install --project failed" || return 1
	[ -d "$PWD/.claude/skills/$set_name" ] || fail "the project's .claude/skills was not filled" || return 1
	[ ! -e "$HOME/.claude/skills" ] || fail "--project also wrote to the home"
}

test_sets_option() {
	mkdir "$HOME/.claude"
	run --sets "$set_name" || fail "install --sets $set_name failed" || return 1
	[ -d "$HOME/.claude/skills/$set_name" ] || fail "the named set was not installed" || return 1
	if run --sets no-such-set; then fail "an unknown set was accepted"; fi
	grep -q "no set named" "$out" || fail "no message naming the unknown set"
}

test_bad_options() {
	if run --nonsense; then fail "an unknown option was accepted"; fi
	if run --sets; then fail "--sets without a value was accepted"; fi
	run --help || fail "--help failed" || return 1
	grep -q "install.sh" "$out" || fail "--help printed no usage"
}

test_stops_before_replacing_a_changed_file() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed" || return 1
	echo "my note" >>"$dest/references/act.md"
	if run; then fail "an update replaced a file the user changed"; fi
	grep -q "references/act.md" "$out" || fail "the changed file was not named" || return 1
	grep -q "my note" "$dest/references/act.md" || fail "the user's change was lost" || return 1
	run --force || fail "install --force failed" || return 1
	same_tree "$src" "$dest"
}

test_stops_before_replacing_added_or_removed_files() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed" || return 1
	echo mine >"$dest/references/mine.md"
	rm "$dest/references/respond.md"
	if run; then fail "an update replaced a folder with files the user added and removed"; fi
	grep -q "references/mine.md" "$out" || fail "the added file was not named" || return 1
	grep -q "references/respond.md" "$out" || fail "the removed file was not named" || return 1
	[ -f "$dest/references/mine.md" ] || fail "the user's added file was lost"
}

test_ignores_finder_files() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed" || return 1
	echo finder >"$dest/references/.DS_Store"
	run || fail "a .DS_Store file stopped the update"
}

test_uninstall_stops_before_removing_a_changed_file() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed" || return 1
	echo "my note" >>"$dest/references/act.md"
	if run --uninstall; then fail "uninstall removed a file the user changed"; fi
	grep -q "references/act.md" "$out" || fail "the changed file was not named" || return 1
	[ -f "$dest/references/act.md" ] || fail "the user's changed file was removed" || return 1
	run --uninstall --force || fail "uninstall --force failed" || return 1
	[ ! -e "$dest" ] || fail "uninstall --force left the folder"
}

test_replaces_an_install_without_checksums() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed" || return 1
	echo "copy old" >"$dest/.skillbook-install"
	echo changed >>"$dest/references/act.md"
	run || fail "an install whose marker holds no checksums was refused" || return 1
	same_tree "$src" "$dest"
}

test_another_set_names_essentials_when_missing() {
	mkdir "$HOME/.claude"
	mkdir "$root/src/skills/garden"
	printf -- '---\nname: garden\ndescription: a test set\n---\n' >"$root/src/skills/garden/SKILL.md"
	run --sets garden || fail "install --sets garden failed" || return 1
	grep -q "builds on essentials" "$out" || fail "no note that essentials is missing" || return 1
	run --sets "$set_name" || fail "install --sets $set_name failed" || return 1
	run --sets garden || fail "install --sets garden failed again" || return 1
	if grep -q "builds on essentials" "$out"; then fail "the note showed although essentials is installed"; fi
}

test_working_copy_script_needs_its_own_file() {
	mkdir "$HOME/.claude"
	if sh -s <"$root/src/install.sh" >"$out" 2>&1; then fail "a working copy's script ran without its own file"; fi
	grep -q "install-" "$out" || fail "no message pointing to a set's own install script"
}

test_pack_writes_the_release_files() {
	pack 9.9.9 || return 1
	for f in "$set_name-9.9.9.tar.gz" "install-$set_name.sh" version.txt SHA256SUMS; do
		[ -f "$release/$f" ] || fail "the release has no $f" || return 1
	done
	[ "$(cat "$release/version.txt")" = 9.9.9 ] || fail "version.txt does not hold 9.9.9" || return 1
	(cd "$release" && sha256_check SHA256SUMS) >"$out" 2>&1 || fail "SHA256SUMS does not match the files"
}

test_pack_leaves_out_unreleased_sets() {
	mkdir "$root/src/skills/garden"
	printf -- '---\nname: garden\ndescription: a test set\n---\n' >"$root/src/skills/garden/SKILL.md"
	pack 9.9.9 || return 1
	[ ! -e "$release/install-garden.sh" ] || fail "a set missing from skills/released was packed"
}

test_release_installs_its_set() {
	mkdir "$HOME/.claude" "$HOME/.codex"
	pack 9.9.9 || return 1
	run_release || fail "the release's install failed" || return 1
	for dest in "$HOME/.claude/skills/$set_name" "$HOME/.agents/skills/$set_name"; do
		diff -r -x .skillbook-install -x SKILL.md "$src" "$dest" >/dev/null || fail "$dest differs from the set" || return 1
		grep -q '^  version: "9.9.9"$' "$dest/SKILL.md" || fail "$dest/SKILL.md holds no version 9.9.9" || return 1
		sed -e '/^metadata:$/d' -e '/^  version: "9.9.9"$/d' "$dest/SKILL.md" | diff - "$src/SKILL.md" >/dev/null ||
			fail "$dest/SKILL.md differs from the set beyond its version" || return 1
		marker_is "$dest" "copy 9.9.9" || return 1
	done
}

test_release_ignores_a_skills_folder_beside_it() {
	mkdir "$HOME/.claude"
	pack 9.9.9 || return 1
	mkdir -p "$PWD/skills/$set_name"
	echo planted >"$PWD/skills/$set_name/SKILL.md"
	run_release || fail "the release's install failed" || return 1
	if grep -q planted "$HOME/.claude/skills/$set_name/SKILL.md"; then fail "it installed the current folder's skills"; fi
}

test_release_refuses_a_wrong_checksum() {
	mkdir "$HOME/.claude"
	pack 9.9.9 || return 1
	echo extra >>"$release/$set_name-9.9.9.tar.gz"
	if run_release; then fail "it installed an archive that does not match its checksum"; fi
	grep -q "checksum" "$out" || fail "no message naming the checksum" || return 1
	[ ! -e "$HOME/.claude/skills/$set_name" ] || fail "something was installed"
}

test_release_installs_only_its_set() {
	mkdir "$HOME/.claude"
	pack 9.9.9 || return 1
	if run_release --sets garden; then fail "a set's script accepted another set"; fi
	grep -q "install-garden.sh" "$out" || fail "no message naming the other set's script"
}

test_release_help_when_piped() {
	pack 9.9.9 || return 1
	run_release --help || fail "--help failed when piped" || return 1
	grep -q "install" "$out" || fail "--help printed no usage"
}

test_check_shows_installed_and_latest() {
	mkdir "$HOME/.claude"
	marker="$HOME/.claude/skills/$set_name/.skillbook-install"
	pack 9.9.9 || return 1
	run_release || fail "the release's install failed" || return 1
	echo 9.9.10 >"$root/releases/latest/download/version.txt"
	before=$(cat "$marker")
	run_release --check || fail "--check failed" || return 1
	grep -q "9\.9\.9" "$out" || fail "--check did not show the installed version" || return 1
	grep -q "9\.9\.10" "$out" || fail "--check did not show the latest version" || return 1
	[ "$(cat "$marker")" = "$before" ] || fail "--check changed the install"
}

main "$@"
