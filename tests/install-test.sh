#!/bin/sh
# Tests install.sh and the scripts that release it: the packing, the Pages site's channel files and install lines,
# and preview versions. Each test copies them and the skills/ folder into a fresh temporary folder and runs them there,
# with HOME pointing at a throwaway home, so the working copy and the real home are never touched. Releases and the
# site are folders reached by file:// addresses. Prints one line per test and exits non-zero when any fails.
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
		for script in pack-release.sh bootstrap.sh site-files.sh preview-version.sh; do
			cp "$repo/scripts/$script" "$root/src/scripts/$script"
		done
		published=0
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

# Ends the test as failed. Each test runs in its own subshell, so exiting here stops it at the first failed check,
# whatever follows.
fail() {
	echo "$1"
	[ -f "$out" ] && sed 's/^/  install.sh: /' "$out"
	exit 1
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

# Packs the copied sets at version $1 into a folder laid out like GitHub's release downloads, as the release and
# preview workflows would, and lists it in releases.tsv as published after every earlier pack, as the Pages workflow
# lists GitHub's releases. Sets $release to its folder and $tag to its tag.
pack() {
	case $1 in
	*-preview.*) tag=$(printf '%s\n' "$1" | sed 's/^.*-preview\.\([0-9]*\)\.g\([0-9a-f]*\)$/preview-\1-\2/') ;;
	*) tag="v$1" ;;
	esac
	release="$root/releases/download/$tag"
	"$root/src/scripts/pack-release.sh" "$1" "$release" >"$out" 2>&1 || fail "pack-release.sh failed"
	published=$((published + 1))
	case $tag in
	preview-*) prerelease=true ;;
	*) prerelease=false ;;
	esac
	printf '%s\t%s\t2026-11-09T10:%02d:00Z\n' "$tag" "$prerelease" "$published" >>"$root/releases.tsv"
}

# Writes the Pages site's files from releases.tsv into $root/site, as the Pages workflow does.
site() {
	SKILLBOOK_RELEASES="file://$root/releases" "$root/src/scripts/site-files.sh" "$root/releases.tsv" "$root/site" \
		>"$out" 2>&1 || fail "site-files.sh failed"
}

# Runs the packed install-<set>.sh as `curl … | sh` does: read from standard input, so it has no file of its own.
run_release() {
	SKILLBOOK_RELEASES="file://$root/releases" SKILLBOOK_SITE="file://$root/site" sh -s -- "$@" \
		<"$release/install-$set_name.sh" >"$out" 2>&1
}

# Runs the install line: the site's install-<set>.sh, read from standard input.
run_line() {
	SKILLBOOK_RELEASES="file://$root/releases" SKILLBOOK_SITE="file://$root/site" sh -s -- "$@" \
		<"$root/site/install-$set_name.sh" >"$out" 2>&1
}

# Runs the packed install-<set>.sh like run_release, with checksum tools that always fail first on the PATH.
broken_tool_release() {
	PATH="$root/fakebin:$PATH" SKILLBOOK_RELEASES="file://$root/releases" sh -s \
		<"$release/install-$set_name.sh" >"$out" 2>&1
}

# Makes a git repository in $root/git holding preview-version.sh, with one commit made at 2026-11-09 15:30 UTC.
preview_repo() {
	mkdir -p "$root/git/scripts"
	cp "$root/src/scripts/preview-version.sh" "$root/git/scripts/"
	git -C "$root/git" init -q
	commit_at "2026-11-09T15:30:00Z"
}

commit_at() {
	echo "$1" >>"$root/git/file"
	git -C "$root/git" add -A
	GIT_COMMITTER_DATE="$1" GIT_AUTHOR_DATE="$1" git -C "$root/git" -c user.name=test -c user.email=test@example.com \
		commit -q -m "change at $1"
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
	rm "$src/references/organize.md"
	run || fail "second install failed" || return 1
	[ ! -e "$HOME/.claude/skills/$set_name/references/organize.md" ] || fail "a file removed from the set was kept"
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

test_ends_with_the_setup_line() {
	mkdir "$HOME/.claude" "$HOME/.codex"
	run --sets "$set_name" || fail "install failed" || return 1
	line="Set up skillbook on this machine: $set_name is installed in ~/.claude/skills for Claude Code"
	grep -Fqx "$line and ~/.agents/skills for Codex." "$out" ||
		fail "no setup line naming both agents' folders in the home" || return 1
	run --sets "$set_name" --project --agents codex || fail "install --project failed" || return 1
	grep -Fqx "Set up skillbook in this project: $set_name is installed in its .agents/skills for Codex." "$out" ||
		fail "no setup line naming the project's folder" || return 1
	run --uninstall || fail "uninstall failed" || return 1
	if grep -q "Set up skillbook" "$out"; then fail "uninstall printed a setup line"; fi
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
	echo "my note" >>"$dest/references/organize.md"
	if run; then fail "an update replaced a file the user changed"; fi
	grep -q "references/organize.md" "$out" || fail "the changed file was not named" || return 1
	grep -q "my note" "$dest/references/organize.md" || fail "the user's change was lost" || return 1
	run --force || fail "install --force failed" || return 1
	same_tree "$src" "$dest"
}

test_stops_before_replacing_added_or_removed_files() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed" || return 1
	echo mine >"$dest/references/mine.md"
	rm "$dest/references/act/verify.md"
	if run; then fail "an update replaced a folder with files the user added and removed"; fi
	grep -q "references/mine.md" "$out" || fail "the added file was not named" || return 1
	grep -q "references/act/verify.md" "$out" || fail "the removed file was not named" || return 1
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
	echo "my note" >>"$dest/references/organize.md"
	if run --uninstall; then fail "uninstall removed a file the user changed"; fi
	grep -q "references/organize.md" "$out" || fail "the changed file was not named" || return 1
	[ -f "$dest/references/organize.md" ] || fail "the user's changed file was removed" || return 1
	run --uninstall --force || fail "uninstall --force failed" || return 1
	[ ! -e "$dest" ] || fail "uninstall --force left the folder"
}

test_stops_for_an_install_without_checksums() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed"
	echo "copy old" >"$dest/.skillbook-install"
	echo "my note" >>"$dest/references/organize.md"
	if run; then fail "an update replaced an install whose marker holds no checksums"; fi
	grep -q -- "--force" "$out" || fail "no message naming --force"
	grep -q "my note" "$dest/references/organize.md" || fail "the user's change was lost"
	run --force || fail "install --force failed"
	same_tree "$src" "$dest"
}

test_stops_for_links_in_a_copied_set() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed"
	ln -s "$dest/references/organize.md" "$dest/references/mine.md"
	cp "$dest/references/act/verify.md" "$root/same.md"
	rm "$dest/references/act/verify.md"
	ln -s "$root/same.md" "$dest/references/act/verify.md"
	ln -s "$root/nowhere" "$dest/references/broken.md"
	if run; then fail "an update replaced a set holding links the user made"; fi
	for file in mine.md act/verify.md broken.md; do
		grep -q "references/$file" "$out" || fail "references/$file was not named"
	done
	if run --uninstall; then fail "uninstall removed a set holding links the user made"; fi
	[ -L "$dest/references/mine.md" ] || fail "the user's link was removed"
}

test_failed_copy_keeps_the_old_install() {
	[ "$(id -u)" -ne 0 ] || return 0 # root reads files whatever their mode
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed"
	cp -R "$dest" "$root/before"
	chmod 000 "$src/references/act/verify.md"
	if run; then fail "an update succeeded although a file could not be read"; fi
	chmod 644 "$src/references/act/verify.md"
	diff -r "$root/before" "$dest" >/dev/null || fail "the failed update changed the installed set"
	run || fail "a second try after the failure was refused"
	same_tree "$src" "$dest"
}

test_failing_checksum_tool_stops_everything() {
	mkdir "$HOME/.claude" "$root/fakebin"
	dest="$HOME/.claude/skills/$set_name"
	for tool in sha256sum shasum; do
		printf '#!/bin/sh\nexit 1\n' >"$root/fakebin/$tool"
		chmod +x "$root/fakebin/$tool"
	done
	if PATH="$root/fakebin:$PATH" "$root/src/scripts/pack-release.sh" 9.9.9 "$root/broken" >"$out" 2>&1; then
		fail "packing succeeded without a working checksum tool"
	fi
	pack 9.9.9
	if broken_tool_release; then fail "a release installed without a working checksum tool"; fi
	[ ! -e "$dest" ] || fail "something was installed without a working checksum tool"
	run_release || fail "the release's install failed"
	cp -R "$dest" "$root/before"
	if broken_tool_release; then fail "an update ran without a working checksum tool"; fi
	diff -r "$root/before" "$dest" >/dev/null || fail "the failed update changed the installed set"
}

test_recovers_an_interrupted_update() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	run || fail "install failed"
	echo "my note" >>"$dest/references/organize.md"
	mkdir "$HOME/.claude/.skillbook-staging"
	mv "$dest" "$HOME/.claude/.skillbook-staging/$set_name.old"
	if run; then fail "an update replaced the kept copy of an interrupted update without checking it"; fi
	grep -q "my note" "$dest/references/organize.md" || fail "the interrupted update's kept copy was not put back"
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
	run --project --sets garden || fail "install --project --sets garden failed"
	if grep -q "builds on essentials" "$out"; then fail "the note showed although essentials is in the home"; fi
}

test_working_copy_script_needs_its_own_file() {
	mkdir "$HOME/.claude"
	if sh -s <"$root/src/install.sh" >"$out" 2>&1; then fail "a working copy's script ran without its own file"; fi
	grep -q "install-" "$out" || fail "no message pointing to a set's own install script"
}

test_pack_writes_the_release_files() {
	pack 9.9.9 || return 1
	for f in "$set_name-9.9.9.tar.gz" "install-$set_name.sh" SHA256SUMS; do
		[ -f "$release/$f" ] || fail "the release has no $f" || return 1
	done
	grep -q '^release_tag="v9.9.9"$' "$release/install-$set_name.sh" || fail "install-$set_name.sh holds no tag v9.9.9"
	(cd "$release" && sha256_check SHA256SUMS) >"$out" 2>&1 || fail "SHA256SUMS does not match the files"
}

test_pack_a_preview() {
	pack 9.9.10-preview.202611091530.g1a2b3c4
	[ "$tag" = preview-202611091530-1a2b3c4 ] || fail "the test's own tag is wrong: $tag"
	grep -q '^release_tag="preview-202611091530-1a2b3c4"$' "$release/install-$set_name.sh" ||
		fail "install-$set_name.sh holds no preview tag"
	for version in 9.9 9.9.9-rc.1 9.9.9-preview.2026.g1a2b3c4 "9.9.9-preview.202611091530.g1a2b3c4x"; do
		if "$root/src/scripts/pack-release.sh" "$version" "$root/bad" >"$out" 2>&1; then
			fail "packing accepted the version $version"
		fi
		rm -rf "$root/bad"
	done
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

test_check_shows_installed_latest_and_preview() {
	mkdir "$HOME/.claude"
	marker="$HOME/.claude/skills/$set_name/.skillbook-install"
	pack 9.9.9
	site
	run_release || fail "the release's install failed"
	before=$(cat "$marker")
	run_release --check || fail "--check failed"
	grep -q "copy 9\.9\.9" "$out" || fail "--check did not show the installed version"
	grep -q "latest release: v9\.9\.9" "$out" || fail "--check did not show the latest release"
	grep -q "newest preview: v9\.9\.9" "$out" || fail "--check did not show the release as the newest preview"
	pack 9.9.10
	pack 9.9.11-preview.202611091530.g1a2b3c4
	site
	run_release --check || fail "--check failed"
	grep -q "latest release: v9\.9\.10" "$out" || fail "--check did not show the newer release"
	grep -q "newest preview: preview-202611091530-1a2b3c4" "$out" || fail "--check did not show the preview"
	[ "$(cat "$marker")" = "$before" ] || fail "--check changed the install"
	rm -rf "$root/site"
	run_release --check || fail "--check failed without a site"
	grep -q "latest release: unknown" "$out" || fail "--check did not say the site could not be read"
}

test_site_names_each_channel() {
	pack 0.9.0
	pack 0.10.0-preview.202611091000.g1111111
	pack 0.10.0
	pack 0.10.1-preview.202611091200.g2222222
	site
	sum=$(awk '/  install-essentials.sh$/ { print $1 }' "$root/releases/download/v0.10.0/SHA256SUMS")
	[ "$(cat "$root/site/stable")" = "v0.10.0 $sum install-$set_name.sh" ] ||
		fail "stable does not name v0.10.0's install script: $(cat "$root/site/stable")"
	grep -q '^preview-202611091200-2222222 ' "$root/site/preview" || fail "preview does not name the newest preview"
	grep -q '^set_name="essentials"$' "$root/site/install-$set_name.sh" || fail "the install line names no set"
	grep -q 'docs/' "$root/site/index.html" || fail "index.html does not send visitors to the docs"
	pack 0.10.1
	site
	grep -q '^v0.10.1 ' "$root/site/preview" || fail "preview fell behind a release published after it"
	pack 0.10.2-preview.202611091530.gfffffff
	pack 0.10.2-preview.202611091530.g1111111
	site
	grep -q '^preview-202611091530-1111111 ' "$root/site/preview" ||
		fail "preview does not name the preview published last: $(cat "$root/site/preview")"
}

test_site_without_releases() {
	: >"$root/releases.tsv"
	site
	[ -f "$root/site/stable" ] && [ ! -s "$root/site/stable" ] || fail "stable is not an empty file"
	[ -f "$root/site/preview" ] && [ ! -s "$root/site/preview" ] || fail "preview is not an empty file"
	[ ! -e "$root/site/install-$set_name.sh" ] || fail "an install line was written with no release"
	pack 0.1.0-preview.202611091530.g1a2b3c4
	site
	[ ! -s "$root/site/stable" ] || fail "stable names a preview"
	grep -q '^preview-202611091530-1a2b3c4 ' "$root/site/preview" || fail "preview does not name the preview"
	mkdir "$HOME/.claude"
	if run_line; then fail "the install line installed with no release"; fi
	grep -q -- "--preview" "$out" || fail "no message pointing to --preview"
	run_line --preview || fail "the install line with --preview failed"
	marker_is "$HOME/.claude/skills/$set_name" "copy 0.1.0-preview.202611091530.g1a2b3c4"
	run_line --check || fail "--check through the install line failed with no release"
	grep -q "newest preview: preview-202611091530-1a2b3c4" "$out" || fail "--check did not name the preview"
	run_line --uninstall || fail "--uninstall through the install line failed with no release"
	[ ! -e "$HOME/.claude/skills/$set_name" ] || fail "--uninstall left the preview installed"
}

test_install_line_installs_the_latest_release_or_the_newest_preview() {
	mkdir "$HOME/.claude"
	dest="$HOME/.claude/skills/$set_name"
	pack 9.9.9
	pack 9.9.10-preview.202611091530.g1a2b3c4
	site
	run_line || fail "the install line failed"
	grep -q "stable channel's release: v9.9.9" "$out" || fail "the install line did not name the release"
	marker_is "$dest" "copy 9.9.9"
	run_line --preview --agents claude || fail "the install line with --preview failed"
	marker_is "$dest" "copy 9.9.10-preview.202611091530.g1a2b3c4"
	grep -q '^  version: "9.9.10-preview.202611091530.g1a2b3c4"$' "$dest/SKILL.md" || fail "SKILL.md holds no preview"
	run_line --help || fail "--help through the install line failed"
	grep -q -- "--preview" "$out" || fail "--help did not reach the release's script"
}

test_install_line_refuses_a_changed_script() {
	mkdir "$HOME/.claude"
	pack 9.9.9
	site
	echo "echo planted" >>"$release/install-$set_name.sh"
	if run_line; then fail "the install line ran a script that does not match its channel"; fi
	grep -q "checksum" "$out" || fail "no message naming the checksum"
	[ ! -e "$HOME/.claude/skills/$set_name" ] || fail "something was installed"
	pack 9.9.10
	sum=$(awk '/  install-essentials.sh$/ { print $1 }' "$release/SHA256SUMS")
	printf 'v9.9.10/../v9.9.10 %s install-%s.sh\n' "$sum" "$set_name" >"$root/site/stable"
	if run_line; then fail "the install line accepted a tag that is not a tag"; fi
	grep -q "not a channel's file" "$out" || fail "no message naming the malformed channel file"
}

test_preview_version() {
	preview_repo
	hash=$(git -C "$root/git" rev-parse HEAD | cut -c 1-7)
	[ "$("$root/git/scripts/preview-version.sh")" = "0.1.0-preview.202611091530.g$hash preview-202611091530-$hash" ] ||
		fail "before any release: $("$root/git/scripts/preview-version.sh")"
	git -C "$root/git" tag v0.9.0
	git -C "$root/git" tag v0.10.0
	[ -z "$("$root/git/scripts/preview-version.sh")" ] || fail "a released commit got a preview version"
	commit_at "2026-11-10T08:05:00Z"
	hash=$(git -C "$root/git" rev-parse HEAD | cut -c 1-7)
	[ "$("$root/git/scripts/preview-version.sh")" = "0.10.1-preview.202611100805.g$hash preview-202611100805-$hash" ] ||
		fail "after v0.10.0: $("$root/git/scripts/preview-version.sh")"
}

main "$@"
