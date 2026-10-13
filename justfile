# Every check, the same way CI runs it. Tools: markdownlint-cli2 (through npx), lychee, ShellCheck, shfmt,
# actionlint and zizmor.
check: lint-markdown links lint-shell lint-workflows

# Markdown style, with the rules in .markdownlint-cli2.jsonc.
lint-markdown:
    npx --yes markdownlint-cli2@0.23.3

# Every local link and anchor resolves.
links:
    lychee --offline --include-fragments --no-progress '**/*.md'

# Shell scripts: ShellCheck, and shfmt with the settings in .editorconfig.
lint-shell:
    shellcheck scripts/*.sh
    shfmt -d scripts

# Workflows: actionlint and zizmor.
lint-workflows:
    actionlint
    zizmor .github/workflows

# Link every skill into the folders agents read, for a machine where skills are edited.
link:
    scripts/link-skills.sh
