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
	case $(cat "$1/.skillbook-install") in
	"$2 "*) return 0 ;;
	*) fail "marker in $1 is '$(cat "$1/.skillbook-install")', expected '$2 ...'" ;;
	esac
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

main "$@"
