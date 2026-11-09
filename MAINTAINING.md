# Maintaining skillbook

How skillbook is versioned, released and tested. How to contribute is in [CONTRIBUTING.md](CONTRIBUTING.md).

## Branches

- `dev`: where work lands.
- `main`: the latest release, which GitHub shows by default. The release script fast-forwards it to dev. A pull request merged into main, such as one from Dependabot, is merged into dev before the next release; the release script checks this.

## Versions

The whole repository has one version, tagged `v<version>`. A release packs every set named in `skills/released` at that version; a set still being built stays off the list.

- **Public interface:** the set names, the guide names a user or another set uses, and the install scripts' options.
- **Major:** removes or renames part of the public interface.
- **Minor:** adds a guide or changes how a guide behaves.
- **Patch:** fixes wording without changing behaviour.
- **0.x:** while the version starts with 0, a minor version may also remove or rename. skillbook stays at 0.x until the sets have been used for a while.

## Releasing

1. **Write the changelog.** `CHANGELOG.md`'s Unreleased section says what changed for users, each entry naming its set, with any known limits.
2. **Rehearse, if the release changes the install script or the workflow.** Run the Release workflow by hand: `gh workflow run release.yml --ref dev -f version=<version>`. It builds a private draft release, `v<version>-rehearsal.<run>`. Download it with `gh release download v<version>-rehearsal.<run> -D <folder>`, try it as "Trying a release" says, then delete it with `gh release delete v<version>-rehearsal.<run> --yes`.
3. **Release.** On dev, with everything committed and pushed, run `just release <version>`. It runs `just check` and the install tests, dates the changelog section, commits, tags, and pushes dev, main and the tag together.
4. **Watch the workflow.** The tag starts the Release workflow: the install tests on Linux and macOS, then packing, attestation and publishing. `gh run watch` follows it.
5. **Check the published release.** Install it into a throwaway home with the README's line, and run it again with `--check`.

## Trying a release

`just pack <version> <folder>` packs a release locally, as the workflow does. To install from such a folder, or from a downloaded draft, put its files in `<dir>/download/v<version>/` and run, in a throwaway home:

```sh
HOME=$(mktemp -d) SKILLBOOK_RELEASES="file://<dir>" sh <dir>/download/v<version>/install-essentials.sh --agents claude,codex
```

## Verifying a release

In a folder holding a release's files, `sha256sum -c SHA256SUMS` checks them; on macOS, `shasum -a 256 -c SHA256SUMS`. `gh attestation verify <file> --repo remziduzagac/skillbook` checks that a file was built by this repository's Release workflow.

## Tests

- **Static checks and install tests** run in CI on pull requests and pushes to main, and the Release workflow runs the install tests again before it publishes. `just check` and `just test-install` run them locally.
- **AI tests** run by hand on the maintainer's machine, in throwaway homes, when a guide changes. They never run in CI or in a release: they cost money, need logins and vary from run to run. [tests/README.md](tests/README.md) says how.
