# Ways to store the tasks

My notes from February 2027. Three options.

## One JSON file

- Python reads and writes JSON with nothing to install, because the `json` module is in the standard library.
- I can open the file in an editor and fix it by hand.
- Every save writes the whole file. If the program is cut off in the middle of a save, the file can end up broken, unless the new version is written to a separate file first and then renamed over the old one.

## SQLite

- Python has an `sqlite3` module in the standard library. It only works when Python was built with the SQLite library, and not every Python is.
- It handles two programs writing at the same time.
- I cannot edit the file by hand without a tool.

## todo.txt

- A plain-text format: one task per line, so I can edit it by hand.
- It has no standard field for repeats. The `rec:` add-on is a convention that other tools may not read.
