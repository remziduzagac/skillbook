"""Emit a bounded reload request for an explicitly selected essentials install; change nothing."""
import argparse
import json
import shlex
from pathlib import Path

FILES = ("SKILL.md", "references/understand.md", "references/act.md", "references/respond.md")


def payload(folder):
    try:
        root = Path(folder).absolute()
        paths = [root / name for name in FILES]
        if not all(path.is_file() for path in paths):
            return None
        message = ("The approved essentials baseline is at these installed paths: "
                   + json.dumps([str(path) for path in paths], ensure_ascii=True)
                   + ". The existing reload rule requires each file to be read whole before work after "
                   "compaction. Missing or refused reads remain unverified; do not infer loading from this message.")
        if len(message) > 8000:
            return None
        return {"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": message}}
    except (OSError, ValueError, RuntimeError):
        return None


def hook_command(folder, script):
    helper = shlex.quote(str(Path(script).absolute()))
    install = shlex.quote(str(Path(folder).absolute()))
    return ("if command -v python3 >/dev/null 2>&1 && [ -f " + helper + " ]; then "
            "python3 " + helper + " --essentials " + install + "; fi")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--essentials", required=True)
    parser.add_argument("--command", action="store_true", help="print a guarded POSIX command; run nothing")
    args = parser.parse_args()
    if args.command:
        print(hook_command(args.essentials, Path(__file__)))
        return
    result = payload(args.essentials)
    if result:
        print(json.dumps(result))


if __name__ == "__main__":
    main()
