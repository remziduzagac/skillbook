"""Reading and saving the one JSON file that holds the list."""
import json
import os
from pathlib import Path


class DataFileError(Exception):
    """The data file exists but cannot be used. Nothing was changed."""


def default_path():
    """The data file: the file JOTDOWN_DATA names, else ~/.jotdown/tasks.json. The working folder does not matter."""
    named = os.environ.get("JOTDOWN_DATA")
    if named:
        return Path(named).expanduser()
    return Path.home() / ".jotdown" / "tasks.json"


def new_data():
    return {"version": 1, "next_id": 1, "tasks": []}


class Store:
    def __init__(self, path=None):
        self.path = Path(path) if path else default_path()

    def load(self):
        """Return the list. A missing file is a new list. A file that cannot be used raises DataFileError."""
        try:
            text = self.path.read_text(encoding="utf-8")
        except FileNotFoundError:
            return new_data()
        except (OSError, UnicodeDecodeError) as error:
            raise DataFileError(f"Cannot read {self.path}: {error}. Nothing was changed.") from None
        try:
            data = json.loads(text)
        except ValueError as error:
            raise DataFileError(
                f"{self.path} is not valid JSON ({error}). Fix or move the file. Jotdown has not changed it."
            ) from None
        if not isinstance(data, dict) or not isinstance(data.get("tasks"), list):
            raise DataFileError(f"{self.path} does not hold a Jotdown list. Jotdown has not changed it.")
        return data

    def save(self, data):
        """Write the new file beside the old one, then rename it over the old one."""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        temp = self.path.with_name(self.path.name + ".new")
        with open(temp, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp, self.path)
