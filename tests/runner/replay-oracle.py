"""Build replay expectations with the unchanged Python runner; never starts an agent."""
import importlib.util
import json
from pathlib import Path
import re
import sys

repo = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("legacy_runner", repo / "tests/run.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
cases = {case["id"]: case for case in runner.load_cases("")}
rows, skipped = [], []
for folder in map(Path, sys.argv[2:]):
    summary = folder / "summary.json"
    if not summary.is_file():
        continue
    saved = json.loads(summary.read_text())
    if not isinstance(saved, list):
        skipped.append({"folder": str(folder), "reason": "summary is not a run list"})
        continue
    for result in saved:
        case = cases.get(result.get("case"))
        if not case:
            skipped.append({"folder": str(folder), "case": result.get("case"), "reason": "case no longer present"})
            continue
        prefix = f"{case['id'].replace('/', '--')}--{result['agent']}"
        model = re.sub(r"[^A-Za-z0-9._-]+", "-", result["model"])
        paths = sorted(folder.glob(f"{prefix}--{model}--{result['run']}--turn*.jsonl"),
                       key=lambda p: int(re.search(r"turn(\d+)", p.name)[1]))
        if not paths:
            skipped.append({"folder": str(folder), "case": case["id"], "reason": "no matching kept event logs"})
            continue
        events = [runner.parse_events(path.read_text()) for path in paths]

        def observation(base, turns):
            said, changed, uncertain = runner.text_before_change(result["agent"], turns)
            if base.get("changes") and not changed and not uncertain:
                said, uncertain = "", "a change no action shows"
            return {**base, "agent": result["agent"],
                    "reads": sorted(runner.skills_read(result["agent"], turns, None, case["set"])),
                    "answer": "\n\n".join(filter(None, (runner.turn_answer(result["agent"], t) for t in turns))),
                    "before_change": said, "changed_files": changed or bool(base.get("changes")),
                    "sequencing_unknown": uncertain,
                    "agents_started": runner.agents_started(result["agent"], turns),
                    "agents_unseen": runner.agents_unseen(result["agent"], turns, uncertain == "a change no action shows"),
                    "targets": [value for turn in turns for action in runner.action_evidence(result["agent"], turn)
                                for key, value in action.items() if key in runner.TARGET_KEYS and isinstance(value, str)]}

        whole = observation(result, events)
        expected = runner.check(case["checks"], whole, case["fixture"], None)
        local = []
        for i, (turn, trace) in enumerate(zip(case["turns"], events)):
            base = result.get("turns", [])[i] if i < len(result.get("turns", [])) else {}
            observed = observation(base, [trace])
            checks = turn.get("checks", {})
            local.append({"checks": checks, "base": base,
                          "expected": runner.check(checks, observed, case["fixture"], None)})
        # Temporary paths and named paths cannot be restored after a sandbox has been deleted.
        rows.append({"folder": str(folder), "case": case["id"], "agent": result["agent"],
                     "model": result["model"], "run": result["run"], "set": case["set"],
                     "fixture": case["fixture"], "checks": case["checks"], "base": result,
                     "paths": list(map(str, paths)), "expected": expected, "local": local,
                     "reads": whole["reads"], "cost": runner.cost(result["agent"], result["model"], events)})
Path(sys.argv[1]).write_text(json.dumps({"rows": rows, "skipped": skipped}))
print(f"{len(rows)} saved runs prepared; {len(skipped)} without replayable data")
