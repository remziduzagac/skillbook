"""Consolidate local findings without fetching, executing or deciding the truth of claims."""
import argparse
import json
from pathlib import Path
import sys

STRENGTHS = {"seen_or_measured", "read_at_source", "inferred", "only_said"}


def text(value):
    return isinstance(value, str) and bool(value.strip())


def validate(record):
    if not isinstance(record, dict):
        raise ValueError("record must be an object")
    if record.get("kind") == "not_found":
        if not text(record.get("scope")) or not isinstance(record.get("looked_in"), list):
            raise ValueError("negative result needs scope and looked_in")
        if not all(text(x) for x in record["looked_in"]):
            raise ValueError("looked_in entries must be nonempty strings")
        return
    if record.get("kind") != "finding":
        raise ValueError("unknown record kind")
    if not all(text(record.get(k)) for k in ("id", "claim", "source")):
        raise ValueError("finding needs id, claim and source")
    if not isinstance(record.get("strength"), str) or record["strength"] not in STRENGTHS:
        raise ValueError("invalid strength")
    for key in ("quote", "applies_to", "source_file"):
        if key not in record or (record[key] is not None and not text(record[key])):
            raise ValueError("invalid or missing " + key)
    if "from_memory" in record and not isinstance(record["from_memory"], bool):
        raise ValueError("from_memory must be boolean")
    if record.get("from_memory") and record["strength"] != "only_said":
        raise ValueError("memory must be only_said")


def quote_status(record, root):
    if record["quote"] is None:
        return "not_applicable"
    if record["source_file"] is None:
        return "unavailable"
    try:
        source = (root / record["source_file"]).resolve()
        if not source.is_relative_to(root):
            return "outside_root"
        content = source.read_text(encoding="utf-8")
    except (OSError, UnicodeError, RuntimeError):
        return "unavailable"
    return "matched" if record["quote"] in content else "not_found"


def consolidate(paths, source_root):
    root = Path(source_root).resolve()
    findings, negatives, ids = {}, [], set()
    for path in paths:
        with Path(path).open(encoding="utf-8") as stream:
            for number, line in enumerate(stream, 1):
                if not line.strip():
                    continue
                record = json.loads(line)
                validate(record)
                evidence = {"record": record, "input_file": str(path), "input_line": number}
                if record["kind"] == "not_found":
                    negatives.append(evidence)
                    continue
                if record["id"] in ids:
                    raise ValueError("duplicate finding id: " + record["id"])
                ids.add(record["id"])
                evidence["quote_status"] = quote_status(record, root)
                key = (record["claim"], record["applies_to"])
                group = findings.setdefault(key, {"claim": key[0], "applies_to": key[1],
                                                   "evidence": [], "validation": "not_validated"})
                group["evidence"].append(evidence)
    return {"findings": list(findings.values()), "not_found": negatives}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", required=True)
    parser.add_argument("files", nargs="+")
    args = parser.parse_args()
    try:
        result = consolidate(args.files, args.source_root)
    except (OSError, ValueError, UnicodeError, RuntimeError) as exc:
        print("consolidation failed: " + str(exc), file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
