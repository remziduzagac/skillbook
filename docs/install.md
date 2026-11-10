# Installing skillbook

Each set installs on its own, with one line, on Linux and macOS; on Windows, use WSL. For essentials:

```sh
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh                   # the latest release
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --preview   # the newest preview
```

The first line installs the latest release; the second installs the newest preview, as [Previews](#previews) says. Both install for you, in your home folder: each copies the set into `~/.claude/skills/essentials` for Claude Code, when `~/.claude` exists, and into `~/.agents/skills/essentials` for Codex, when `~/.codex` exists. To install for one project instead, see [For you or for one project](#for-you-or-for-one-project). The line needs no root, checks every download against its checksum, and never overwrites a folder it did not install.

## For you or for one project

Without options, the line installs the set for you, so every project you open can use it. To install it for one project only, run the line in that project's folder with `--project`:

```sh
cd my-project
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --project
```

This copies the set into the project's `.claude/skills/essentials` for Claude Code and `.agents/skills/essentials` for Codex. Your home folder stays as it was.

- **For you:** one copy serves every project, and one run updates it. Choose this to use the set everywhere.
- **For one project:** the copy stays with the project. Commit it so everyone working on the project uses the same version, or keep it out of version control if it is only for you.
- **Later runs:** in the project's folder, add `--project` to every run, to update, `--check` or `--uninstall`. Without it, the line works on the copy in your home.
- **Keep one copy:** when the same skill is in your home and in the project, Claude Code uses the one in your home and ignores the project's. To use only the project's copy, remove the one in your home with `sh -s -- --uninstall`, without `--project`.

## Setting up your agent

The install ends with a line to copy. Start a new session of your agent, in the project's folder for a project install, and paste it. For an install in your home, it reads:

> Set up skillbook on this machine: essentials is installed in ~/.claude/skills for Claude Code and ~/.agents/skills for Codex.

The line names the folders the install filled, so the agent sets up the copy you have. With your approval, the agent adds the line that tells it to load essentials before any work, and what it needs to read the installed files. Without the line at hand, ask your agent to **set up skillbook**. For a project install, it puts that line in the project's instruction files: the shared one when the set is committed, a local one kept out of version control when it is not.

To read a set installed in your home, Claude Code needs the rule `Read(~/.claude/skills/**)` in `permissions.allow` of `~/.claude/settings.json`. Without it, Claude Code asks before it reads each guide. You can add it yourself instead. A project install needs no such rule: Claude Code reads files in the folder you start it in without asking.

## Options

Options go after `sh -s --`:

```sh
curl -fsSL https://remziduzagac.github.io/skillbook/install-essentials.sh | sh -s -- --agents codex
```

- `--agents claude,codex`: the agents to install for. By default, those whose folder exists, `~/.claude` or `~/.codex`.
- `--project`: install into the current folder's `.claude/skills` and `.agents/skills` instead of your home, as [For you or for one project](#for-you-or-for-one-project) says.
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

Run the same line again, with `--project` in a project's folder. It installs the latest release, and the new copy replaces the old one only once it is complete. If you changed a guide by hand, it lists the changed files and stops; add `--force` to replace them. Start new agent sessions afterwards, since an open session keeps the text it has already read.

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

Run the line with `sh -s -- --uninstall`, adding `--project` in a project's folder. It removes only what it installed, and stops before removing files you changed unless you add `--force`. The pointer and settings that setup added stay; ask your agent to remove them.
