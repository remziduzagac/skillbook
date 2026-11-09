# Installing skillbook

Each set installs on its own, with one line, on Linux and macOS; on Windows, use WSL. For essentials:

```sh
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh                   # the latest release
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --preview   # the newest preview
```

The first line installs the latest release; the second installs the newest preview, as [Previews](#previews) says. Each line copies the set into `~/.claude/skills/essentials` for Claude Code, when `~/.claude` exists, and into `~/.agents/skills/essentials` for Codex, when `~/.codex` exists. It needs no root, checks every download against its checksum, and never overwrites a folder it did not install.

## Setting up your agent

After installing, ask your agent to **set up skillbook**. With your approval, it adds the line that tells the agent to load essentials before any work, and what your agent needs to read the installed files.

In Claude Code, that is the rule `Read(~/.claude/skills/**)` in `permissions.allow` of `~/.claude/settings.json`. Without it, Claude Code asks before it reads each guide. You can add it yourself instead.

## Options

Options go after `sh -s --`:

```sh
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --agents codex
```

- `--agents claude,codex`: the agents to install for. By default, those whose folder exists, `~/.claude` or `~/.codex`.
- `--project`: install into the current folder's `.claude/skills` and `.agents/skills` instead of your home.
- `--preview`: install the newest preview instead of the latest release, as [Previews](#previews) says.
- `--check`: show the installed version, the latest release and the newest preview. It changes nothing.
- `--uninstall`: remove what the script installed.
- `--force`: replace or remove files you changed in an installed set.
- `--help`: list the options.

## Reading the script first

The line runs a short script that picks the release, downloads that release's own `install-essentials.sh`, checks it against the checksum the site lists, and runs it. To read the release's script before you run it, download it from the [releases page](https://github.com/remziduzagac/skillbook/releases), for the latest release:

```sh
curl -fsSLO https://github.com/remziduzagac/skillbook/releases/latest/download/install-essentials.sh
less install-essentials.sh
sh install-essentials.sh
```

## Checking the files

Each release carries a `SHA256SUMS` file, and every file in it is attested by the workflow that built it. In a folder holding the release's files:

```sh
sha256sum -c SHA256SUMS            # on macOS: shasum -a 256 -c SHA256SUMS
gh attestation verify install-essentials.sh --repo remziduzagac/skillbook
```

## Updating

Run the same line again. It installs the latest release, and the new copy replaces the old one only once it is complete. If you changed a guide by hand, it lists the changed files and stops; add `--force` to replace them. Start new agent sessions afterwards, since an open session keeps the text it has already read.

- **Your version and the latest:** add `--check`, as in `curl -fsSL …/install-essentials.sh | sh -s -- --check`.
- **New releases:** watch the repository's releases on GitHub (Watch, then Custom, then Releases), or follow the [releases feed](https://github.com/remziduzagac/skillbook/releases.atom). The [changelog](../CHANGELOG.md) says what changed.
- **A given version:** run that release's own script, such as `curl -fsSL https://github.com/remziduzagac/skillbook/releases/download/v0.1.0/install-essentials.sh | sh`.

## Previews

A preview is what is being prepared for the next release, published to try it before it is released. Each one is a pre-release on the releases page, tagged `preview-<time>-<commit>`, with a version such as `0.1.1-preview.202611091530.g1a2b3c4`.

- **Install the newest preview:** add `--preview` to the line. It installs the preview published last, or the latest release when that was published after every preview:

  ```sh
  curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --preview
  ```

- **Update a preview:** run the same line again; it installs whatever preview is newest then.
- **Go back to releases:** run the line without `--preview`. It replaces the preview with the latest release.

Previews may change or break between one and the next, and only the newest ten are kept.

## Removing

Run the line with `sh -s -- --uninstall`. It removes only what it installed, and stops before removing files you changed unless you add `--force`. The pointer and settings that setup added stay; ask your agent to remove them.
