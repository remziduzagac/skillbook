# Maintaining skillbook

The steps only the maintainer takes, and the upkeep that keeps the repository healthy: who maintains skillbook and decides, how work moves from `dev` to a release, how previews, releases and the docs site are made, and how dependencies and settings are kept. Agents working here follow it too ([AGENTS.md](AGENTS.md)). How to contribute is in [CONTRIBUTING.md](CONTRIBUTING.md).

## The maintainer

skillbook has one maintainer, Remzi Duzagac ([@remziduzagac](https://github.com/remziduzagac)), who merges, releases and sets up the repository.

- **Governance:** the maintainer decides what goes into skillbook, what is released and when, and how the repository is set up. Design decisions are written down with their reasons in [blueprint/decisions.md](blueprint/decisions.md), so they can be read and questioned. Anyone may open an issue. If more maintainers join, they are listed here, with how they decide together; until then, the maintainer's decision stands.
- **Time:** skillbook is maintained by one person, in their own time. Releases come when there is something worth releasing, on no schedule. Issues are answered as time allows; [SECURITY.md](SECURITY.md) gives the times for a vulnerability report.
- **Agents** do what [AGENTS.md](AGENTS.md) allows: they work on `dev`, run the checks and propose. Merging, moving `test` or `main`, releasing, changing settings and closing issues are the maintainer's, or an agent's when the maintainer asks.

### Access continuity

What skillbook's delivery depends on, and who can recover it:

- **The GitHub account `remziduzagac`** owns the repository, its settings, its releases and its Pages site. Only the maintainer holds it, and recovers it through GitHub's account recovery.
- **The Pages site,** <https://remziduzagac.github.io/skillbook/>, serves the install lines, the channel files and the docs. It is deployed by this repository's workflows, with no domain of its own to renew.
- **Nothing else:** releases are attested through GitHub's own signing, so there is no signing key, secret, deploy key, domain or registry account.

Nobody else has admin access. If the maintainer cannot go on, nobody can merge, release or change a setting. The skills stay available under the Apache License 2.0, and the published releases stay downloadable: anyone may fork skillbook and carry on, and a user can point a release's install script at another place laid out as GitHub's releases and the Pages site are, with `SKILLBOOK_RELEASES` and `SKILLBOOK_SITE`.

## Branches

Work moves through three branches, each a step further. `test` and `main` take nothing but `dev`'s commits, by fast-forward, and their ruleset forbids deleting them or forcing them back.

- **`dev`:** where work comes together, in commits and merged pull requests, Dependabot's included. CI runs on every push.
- **`test`:** what is being tried. Moving `dev` to `test` publishes a preview, as "Previews" says.
- **`main`:** what is released, and what GitHub shows by default. `just release` moves it with each release.

Pull requests target `dev`. The main checkout stays on `dev`.

## Versions

The whole repository has one version, tagged `v<version>`. A release packs every set named in `skills/released` at that version; a set still being built stays off the list. [Versions](docs/versions.md) says the same for users.

- **Public interface:** the set names, the guide names a user or another set uses, and the install scripts' options.
- **Major:** removes or renames part of the public interface.
- **Minor:** adds a guide or changes how a guide behaves.
- **Patch:** fixes wording without changing behaviour.
- **0.x:** while the version starts with 0, a minor version may also remove or rename. skillbook stays at 0.x until the sets have been used for a while.

A version is used once: a tag is never moved, and a release that went wrong is followed by the next patch.

## Previews

A preview is what `test` has, published as a pre-release before it is released, to try it as users get it. Move `dev` to `test` once CI passed on `dev`:

```sh
git fetch origin && git push origin origin/dev:test
```

The push starts `.github/workflows/preview.yml`. It runs the install tests on Linux and macOS, packs every released set with `scripts/pack-release.sh` as a release is packed, attests the files and publishes them as the pre-release `preview-<time>-<commit>`. Then it deletes all but the newest ten previews, with their tags, and runs `pages.yml`, so the site's preview channel names the new preview.

- **The version** comes from `scripts/preview-version.sh`: the next patch after the latest release, then the commit's UTC time and short hash, such as `0.1.1-preview.202611091530.g1a2b3c4`. It is written into the packed files only, never committed.
- **A released commit gets no preview:** `just release` moves `test` with every release, and the preview channel then names the release, since it was published later.
- **Which preview:** the one published last, or the latest release when it was published after every preview.
- **Who it reaches:** whoever adds `--preview` to a set's install line. Stable installs and the releases feed's latest release are untouched.

What trying a preview finds is fixed on `dev`, and `test` moves again. `test` only moves forward.

### The first time

GitHub runs a workflow by hand only once it is on the default branch, `main`. Before the first preview or release, Pages must be on, built by GitHub Actions ("Repository settings"), and `main` must hold `pages.yml` and what it builds, or neither workflow can deploy the site. So, once, fast-forward `main` to `dev` before the first preview:

```sh
git fetch origin && git push origin origin/dev:main
```

That push deploys the site, with empty channels. Until the first release, a set's install line says it has no release yet and points to `--preview`; `--check` and `--uninstall` use the preview.

## Releasing

A release is a `v<version>` tag on `main`. Pushing it starts `.github/workflows/release.yml`, which runs the install tests on Linux and macOS, packs every released set, attests the files, publishes the release with the changelog's section as its notes, and runs `pages.yml`, so the site's stable channel names it.

1. **Write the changelog.** `CHANGELOG.md`'s Unreleased section says what changed for users, each entry naming its set, with any known limits.
2. **Try it as a preview,** if the release changes the install scripts, the packing or the workflows: move `dev` to `test`, as "Previews" says, and install the preview in a throwaway home.
3. **Release.** On `dev`, with everything committed and pushed and CI passed, run `just release <version>`. It refuses a version that is not newer than the newest tag, and an empty Unreleased section. It runs `just check` and the install tests, dates the changelog section, commits `chore(release): v<version>`, tags it, and pushes `dev`, `test`, `main` and the tag together.
4. **Watch the workflows.** `gh run watch` follows the Release workflow; the Pages workflow runs after it.
5. **Check the published release** as a user would, in a throwaway home: the install line, then the same line with `--check`, which names the new release as the latest. Check the files as "Verifying a release" says.

The Release workflow can also rehearse a version by hand, building a private draft without attestation: `gh workflow run release.yml --ref main -f version=<version>`, then `gh release delete v<version>-rehearsal.<run> --yes` once it is tried. A preview usually serves better, since it is published and installed the way a release is.

## Trying a release

`just pack <version> <folder>` packs a release locally, as the workflows do. To install from such a folder, or from a downloaded draft, put its files in `<dir>/download/v<version>/` and run, in a throwaway home:

```sh
HOME=$(mktemp -d) SKILLBOOK_RELEASES="file://<dir>" sh <dir>/download/v<version>/install-essentials.sh --agents claude,codex
```

## Verifying a release

In a folder holding a release's files, `sha256sum -c SHA256SUMS` checks them; on macOS, `shasum -a 256 -c SHA256SUMS`. `gh attestation verify <file> --repo remziduzagac/skillbook` checks that a file was built by this repository's Release or Preview workflow.

## The documentation site

`site/` is an Astro Starlight project. Before each build, `site/scripts/gather.ts` copies the pages listed in [docs/README.md](docs/README.md), the docs map, into `site/src/content/docs`: each `##` section of the map becomes a sidebar group, links between pages become the site's addresses, and links to other files go to GitHub. `docs/` stays the one source, read on GitHub as it is. A new page needs a line in the map.

```sh
cd site
bun install --frozen-lockfile
bun run dev      # live at http://localhost:4321/skillbook/docs/
bun run build    # the site in dist/; fails on a link between pages that does not land
```

`.github/workflows/pages.yml` deploys the Pages site, <https://remziduzagac.github.io/skillbook/>:

- `docs/`: the documentation, from `main`;
- `install-<set>.sh`: each released set's install line, `scripts/bootstrap.sh` with the set filled in;
- `stable` and `preview`: the channel files the install lines read, from the releases as they are when it runs (`scripts/site-files.sh`);
- `index.html`, which sends visitors to the docs.

It runs when a push to `main` changes the docs or the site, and by hand on `main` after every release and preview. Each run reads its deployment back from the site and fails if it is not served; run it again by hand with `gh workflow run pages.yml --ref main`.

## Dependencies

- **Dependabot** (`.github/dependabot.yml`) opens grouped pull requests once a month, into `dev`, for the workflows' actions and the `bun` packages of the test runner and the docs site, each version at least seven days old. Read what each update changes, run the checks, and merge it like any change.
- **The docs site's install** runs under `site/bunfig.toml`'s gates: no package's install script runs, a version is taken only once it is a week old, and `bun add` pins the exact version. `site/package.json` puts a placeholder in place of `sharp`, so no image library is installed.
- **Pins Dependabot does not see,** reviewed twice a year, in April and October: Bun in `mise.toml` and the workflows' `bun-version`, the tools CI installs in `.github/workflows/ci.yml`, and markdownlint-cli2 in the justfile.

## Repository settings

The settings the repository should have. The maintainer changes them by hand; agents never do.

- **Branches:** `main` is the default branch. The ruleset "Long-lived branches" stops `dev`, `test` and `main` from being deleted or force-pushed, for everyone. The ruleset "Release tags" lets only repository admins create, move or delete `v*` tags, so nothing else can start a release.
- **Merging:** squash, merge or rebase, as the change needs; merged branches are deleted.
- **Releases:** immutable, so a published release's files cannot change. A release or preview is drafted, its files uploaded, then published.
- **Pages:** built by GitHub Actions. The `github-pages` environment takes deployments from `main` only.
- **Actions:** the default workflow token can only read, Actions cannot approve pull requests, and actions must be pinned by their full commit.
- **Security:** private vulnerability reporting, Dependabot alerts and security updates, secret scanning with push protection, and code scanning with CodeQL's default setup.
- **Features:** issues on; wiki, projects and discussions off.
- **The front page:** the description, the topics and the docs site as the homepage.

To get past a ruleset in an emergency, disable it under Settings, then Rules, and turn it back on.

## A vulnerability report

[SECURITY.md](SECURITY.md) is what the reporter is promised. The steps behind it:

1. **Within 7 days,** acknowledge the report in its thread.
2. **Reproduce it** and judge it. One that is not a vulnerability is closed with the reason; an ordinary bug in it becomes an issue without the security details.
3. **Fix it in private,** in the advisory's temporary private fork. Nothing public carries a detail until the fix is released.
4. **Release the fix** as a new patch, and publish the advisory, crediting the reporter unless they prefer otherwise.

## Tests

- **Static checks, the install tests and the docs site's build** run in CI on pull requests and on pushes to `dev`, `test` and `main`; the Release and Preview workflows run the install tests again before they publish. `just check`, `just test-install` and the site's `bun run build` run them locally.
- **AI tests** run by hand on the maintainer's machine, in throwaway homes, when a guide changes. They never run in CI, a preview or a release: they cost money, need logins and vary from run to run. [tests/README.md](tests/README.md) says how.
