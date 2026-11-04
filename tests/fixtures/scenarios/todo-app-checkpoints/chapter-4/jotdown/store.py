"""Reading and saving the one JSON file that holds the list."""
import json
import os
from pathlib import Path

# The file that holds the list.
DATA_PATH = Path("data") / "tasks.json"


def new_data():
    return {"version": 1, "next_id": 1, "tasks": []}


class Store:
    def __init__(self, path=None):
        self.path = Path(path) if path else DATA_PATH

    def load(self):
        try:
            with open(self.path, encoding="utf-8") as f:
                return json.load(f)
        except (OSError, ValueError):
            return new_data()

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
