# Jotdown

A small task list for the command line and for a page in your browser. It needs Python 3.12 or newer and nothing else.

## Install

You need Python 3.12 or newer and nothing else. To check, run `python3 --version`. On Windows, run `py --version`.

1. Copy the Jotdown folder to your computer and open a terminal in it.
2. Run `python3 -m jotdown`. On Windows, run `py -m jotdown`. With no tasks yet it says that nothing is due today.
3. To type `jd` in any folder, make a shortcut that points at the Jotdown folder. [docs/install.md](docs/install.md) shows how on Linux, macOS and Windows.

To update, copy the new Jotdown folder over the old one. Your tasks are not in that folder, so they stay as they are.

## Use

```text
jd add renew passport --due 2027-03-31 --tag admin
jd list
jd done 1
jd web
```

Run `jd` with no command to see what is late and what is due today. All the docs are listed in [docs/index.md](docs/index.md).

Your tasks are kept in one file in your home folder. See [Where your data lives](docs/usage.md#where-your-data-lives).

## More

- [Changelog](CHANGELOG.md)
- [Developer notes and the design's history](docs/development.md)

## Licence

Jotdown is released under the MIT licence.
