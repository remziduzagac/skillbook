# Versions

skillbook has one version for the whole repository, such as `0.1.0`. A release installs every released set at that version, and an installed set shows it in its `SKILL.md` and in the `.skillbook-install` file beside it.

## What a version promises

What you rely on is the set names, the guide names you or another set use, and the install script's options.

- **A major version** removes or renames one of them.
- **A minor version** adds a guide or changes how one behaves.
- **A patch version** fixes wording without changing behaviour.

skillbook stays at `0.x` until the sets have been used for a while. Until then, a minor version may also remove or rename something; the [changelog](../CHANGELOG.md) says so, and what to do.

## Which versions get fixes

Only the latest release. A fix comes as a new release; run the install line again to get it, as [Installing](install.md#updating) says.

## Previews

A preview's version is the next patch after the latest release, then the time and commit it was made from, such as `0.1.1-preview.202611091530.g1a2b3c4`. It sorts after the release before it and before the next one. [Installing](install.md#previews) says how to install one.
