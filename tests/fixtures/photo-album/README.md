# photo-album

The family photo album. The files in `photos/` are small text stand-ins for the real pictures.

- `photos/`: one file per photo.
- `duplicates.txt`: copies found by the photo app, one per line: the copy, then its original.
- `dedupe.py`: deletes each copy listed in `duplicates.txt`, in order, once it has checked that the copy matches its original. Run it with `python3 dedupe.py`. Deleted copies are not kept anywhere.
