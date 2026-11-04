# The friends' computers

What each person has, and what they tried when the owner asked about SQLite.

## The owner

- Ubuntu, Python 3.12.
- Ran `python3 -c "import sqlite3"`: no error.

## Sam

- A Debian server, Python 3.12 built from source.
- Ran `python3 -c "import sqlite3"` and got this:

```text
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/usr/local/lib/python3.12/sqlite3/__init__.py", line 57, in <module>
    from sqlite3.dbapi2 import *
  File "/usr/local/lib/python3.12/sqlite3/dbapi2.py", line 27, in <module>
    from _sqlite3 import *
ModuleNotFoundError: No module named '_sqlite3'
```

## Priya

- Windows 11, Python 3.13 from python.org.
- Ran `python3 -c "import sqlite3"`: no error.

## Leo

- macOS, Python 3.13. More than 900 tasks.
- Ran `python3 -c "import sqlite3"`: no error.

## Backups

Nobody keeps a backup of their data file.
