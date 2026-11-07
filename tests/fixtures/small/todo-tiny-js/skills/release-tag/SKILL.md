---
name: release-tag
description: "Tags a tiny-todo release and writes its changelog entry. Use when the user asks to cut a release."
---

# release-tag

## Steps

1. Run `npm test` and stop if anything fails.
2. Set the new version in `package.json`.
3. Add the changelog entry at the top of `CHANGELOG.md`.
4. Tag the commit with `git tag vX.Y.Z`.
