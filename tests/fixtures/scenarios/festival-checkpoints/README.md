# Festival checkpoints

The project files at the start of each chapter of the [festival scenario](../../../../blueprint/design/scenarios/festival.md). The base fixture, `../festival/`, is chapter 1.

- Chapter N is the base, then the overlays `chapter-2/` to `chapter-N/` copied over it in order.
- Chapters 4 and 5 also remove `old-signups.csv`.
- Chapter 3 runs turns 12–22 in one session; the turn 13 typo fix carries into turn 17 without an overlay.
- `../../make-festival.py` writes the base and these overlays. Change it and run it again rather than editing the files by hand.
- The runner writes the project's `.gitignore`, holding `*.csv`, before the first commit. A `.gitignore` inside these folders would hide their CSV files from this repository.
