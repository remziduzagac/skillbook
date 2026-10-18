# Every check, the same way CI runs it. Tools: markdownlint-cli2 (through npx), lychee, ShellCheck, shfmt,
# actionlint and zizmor.
check: lint-markdown links lint-shell lint-workflows check-skills

# Markdown style, with the rules in .markdownlint-cli2.jsonc.
lint-markdown:
    npx --yes markdownlint-cli2@0.23.3

# Every local link and anchor resolves.
links:
    lychee --offline --include-fragments --no-progress '**/*.md'

# Shell scripts: ShellCheck, and shfmt with the settings in .editorconfig.
lint-shell:
    shellcheck install.sh scripts/*.sh
    shfmt -d install.sh scripts

# Workflows: actionlint and zizmor.
lint-workflows:
    actionlint
    zizmor .github/workflows

# Each set's skill files: headings match their names, lengths stay near the advice, named skills resolve to files.
check-skills:
    scripts/check-skills.sh

# Link this working copy's sets into the folders agents read, for a machine where skills are edited.
link:
    ./install.sh --link
