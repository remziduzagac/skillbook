# Every check, the same way CI runs it. Tools: markdownlint-cli2 (through npx), lychee, ShellCheck, shfmt,
# actionlint and zizmor.
check: lint-markdown links lint-shell lint-workflows check-skills test-runner check-runner-ts check-coverage

# Markdown style, with the rules in .markdownlint-cli2.jsonc.
lint-markdown:
    npx --yes markdownlint-cli2@0.23.3

# Every local link and anchor resolves.
links:
    lychee --offline --include-fragments --no-progress --exclude-path node_modules '**/*.md'

# Shell scripts: ShellCheck, and shfmt with the settings in .editorconfig.
lint-shell:
    shellcheck install.sh scripts/*.sh tests/*.sh .githooks/*
    shfmt -d install.sh scripts tests .githooks

# Workflows: actionlint and zizmor.
lint-workflows:
    actionlint
    zizmor .github/workflows

# Each set's skill files: headings match their names, lengths stay near the advice, named skills resolve to files.
check-skills:
    scripts/check-skills.sh

# install.sh in throwaway homes: copy and link modes, the marker, refusing a folder it did not install, uninstalling.
test-install:
    tests/install-test.sh

# AI test cases in throwaway homes, on small models by default; see tests/run.py --help. It asks before spending.
test-agents *args:
    python3 tests/run.py {{args}}

# Test the scenario runner and all case definitions without a model, account or network access.
test-runner:
    PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'

# Every aspect a case must name in `covers` still exists, and how many aspects nothing covers yet (a warning only).
check-coverage:
    python3 tests/run.py --coverage --summary

# Count executable normal, boundary and edge scenarios, and list the aspects no case covers; not a model pass rate.
test-coverage:
    python3 tests/run.py --coverage

# Turn on this repository's git hooks, which refuse a commit message that credits an AI tool; once per clone.
hooks:
    git config core.hooksPath .githooks

# No commit in the range credits an AI tool; by default, the commits not yet on origin/main.
check-commits range="origin/main..HEAD":
    scripts/check-commit-message.sh --range '{{range}}'

# Link this working copy's sets into the folders agents read, for a machine where skills are edited.
link:
    ./install.sh --link

# TypeScript runner: types, unit contracts, generated schema and every YAML conversion.
check-runner-ts:
    bun run typecheck
    bun test tests/runner
    bun tests/runner/schema.ts --check
    bun tests/run.ts --validate

# The Bun runner runs beside the Python runner during the port comparison.
test-agents-ts *args:
    bun tests/run.ts {{args}}
