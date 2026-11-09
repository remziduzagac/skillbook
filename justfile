# Every check, the same way CI runs it. Tools: markdownlint-cli2 (through npx), lychee, typos, ShellCheck, shfmt,
# actionlint and zizmor.
check: lint-markdown links spelling lint-shell lint-workflows check-skills test-runner check-runner-ts test-health

# Markdown style, with the rules in .markdownlint-cli2.jsonc.
lint-markdown:
    npx --yes markdownlint-cli2@0.23.3

# Every local link and anchor resolves.
links:
    lychee --offline --include-fragments --no-progress --exclude-path node_modules --exclude-path tmp \
        --exclude-path site/src/content '**/*.md'

# Spelling, over the files git tracks, with the project's own words in _typos.toml.
spelling:
    typos

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

# install.sh in throwaway homes: copy, link and release modes, the marker, protected edits, --check, uninstalling; and
# the packing, the Pages site's channel files and install lines, and preview versions.
test-install:
    tests/install-test.sh

# AI test cases in throwaway homes; see tests/run.ts --help. It asks before spending.
test-agents *args:
    bun tests/run.ts {{args}}

# Python unit tests of the replay runner, the skill-file check and the skills' scripts; no model, account or network.
test-runner:
    PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'

# Turn on this repository's git hooks, which refuse a commit message that credits an AI tool; once per clone.
hooks:
    git config core.hooksPath .githooks

# No commit in the range credits an AI tool; by default, the commits not yet on origin/main.
check-commits range="origin/main..HEAD":
    scripts/check-commit-message.sh --range '{{range}}'

# Cut a release: date the changelog, commit, tag, and push dev, test, main and the tag; see scripts/release.sh.
release version:
    scripts/release.sh {{version}}

# Pack a release into a folder the way the release workflow does, to look at it before releasing.
pack version folder:
    scripts/pack-release.sh {{version}} {{folder}}

# Build the docs site from docs/ into site/dist, as CI and the Pages workflow do; fails on a link that does not land.
site:
    cd site && bun install --frozen-lockfile && bun run build

# Link this working copy's sets into the folders agents read, for a machine where skills are edited.
link:
    ./install.sh --link

# TypeScript runner: types, unit contracts, generated schema and every YAML conversion.
check-runner-ts:
    bun run typecheck
    bun test tests/runner
    bun tests/runner/schema.ts --check
    bun tests/run.ts --validate

# The weekly health check's pure parts: the upkeep files, the comparisons, the issue and the workflow's shape.
test-health:
    bun test tests/health.test.ts

# Explicit alias for the TypeScript runner.
test-agents-ts *args:
    bun tests/run.ts {{args}}
