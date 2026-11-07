# Slow Boats show notes

This folder holds the show notes for the Slow Boats podcast, one folder per episode under `episodes/`. Each folder has `transcript.txt` from the editor and `notes.md`, which we publish. Guest names and roles are in `guests.md`.

## Rules

- Write show notes from the transcript only. A claim the transcript does not make stays out.
- Write timestamps as mm:ss.
- Spell guest names as in `guests.md`.
- Name a new episode folder `epNN`, with two digits.

## Publishing an episode

Run these steps once per release, in order:

1. Ask the guest to approve the notes by email.
2. Copy `notes.md` into the website's `_posts` folder.
3. Rename the copy to `YYYY-MM-DD-slug.md`.
4. Add the episode's audio link to the post's front matter.
5. Open a pull request on the website repository.
6. After it merges, post the link in the listeners' newsletter.
