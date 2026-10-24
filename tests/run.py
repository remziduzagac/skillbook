#!/usr/bin/env python3
"""Runs skillbook's AI test cases on this machine: each case, in each agent, a number of times.

Each run gets a throwaway home with skillbook installed by install.sh, the pointer in the user's instruction file, and
a copy of the case's toy project. The agent runs headless on a small model by default. Its event log is checked
against the case, and a short summary is written. Event logs and logins never enter the repository, and the throwaway
home is deleted after each run.

Login: an API key from the environment (ANTHROPIC_API_KEY for Claude Code, CODEX_API_KEY or OPENAI_API_KEY for Codex),
or, with --login, the user's own login copied into each throwaway home and deleted with it.

Cases are TOML files under tests/cases/<set>/. Python 3.11 or later, standard library only.
"""

import argparse
import datetime
import difflib
import hashlib
import json
import math
import os
import re
import shlex
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
import tomllib
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CASES = REPO / "tests" / "cases"
FIXTURES = REPO / "tests" / "fixtures"

POINTER = (
    "Before any work, load the essentials skill and follow it; load it again whenever its text is no longer in view, "
    "such as after compaction."
)
DEFAULT_MODELS = {"claude": "haiku", "codex": "gpt-6-luna"}
# US dollars per million tokens: input, cached input, output. Used for Codex, which reports tokens, not cost.
CODEX_PRICES = {"gpt-6-luna": (0.10, 0.01, 0.50)}
ESTIMATE_PER_TURN = 0.02  # a rough upper guess, in US dollars, for one turn on a small model
AGENT_DIRS = {".claude", ".codex", ".agents", "__pycache__"}  # made by agents or by compiling; not counted as changes
MARKER = "SKILLBOOK_TEST_RUN"  # set in each agent's environment, so a process that leaves its group is still found


def main():
    args = parse_args()
    if args.to_judge:
        print(runs_to_judge([Path(f) for f in args.to_judge]), end="")
        return 0
    cases = load_cases(args.case)
    if not cases:
        sys.exit(f"no case matches {args.case!r} under {CASES.relative_to(REPO)}")
    if args.coverage:
        if not args.summary:
            print(coverage(cases))
        report, unknown_ids, uncovered = aspect_coverage(load_cases(""))
        if args.summary:
            # for just check: one line, a warning only, since covering every aspect is advice to work towards
            print(f"aspects: {len(uncovered)} with nothing covering them; run `just test-coverage` for the list")
            for aspect in unknown_ids:
                print(f"unknown aspect named by a case or tests/manual.toml: {aspect}")
            return 1 if unknown_ids else 0
        print()
        print(report)
        if unknown_ids:
            return 1  # a case or the manual list names an aspect that no longer exists
        return 0

    agents = [a for a in args.agents.split(",") if a]
    models = {agent: models_for(agent, args) for agent in agents}
    plan = []
    for case in cases:
        for agent in agents:
            if agent not in case["agents"]:
                continue
            for model in models[agent]:
                for n in range(1, (args.runs or case["runs"]) + 1):
                    plan.append((case, agent, model, n))

    turns = sum(len(case["turns"]) for case, _, _, _ in plan)
    estimate = turns * ESTIMATE_PER_TURN
    print(f"{len(plan)} runs, {turns} turns, models: " + ", ".join(m for a in agents for m in models[a]))
    print(f"estimated cost: up to about ${estimate:.2f}")
    print(f"budget: no new run starts once known spending reaches ${args.budget:.2f}, and runs already started "
          f"finish, up to {args.jobs} at a time; "
          "each Claude call is also capped by "
          "--max-budget-usd; Codex cost is estimated from tokens and not capped; a model with no known price counts as "
          "unknown, not as zero")
    if args.login:
        print("login: your own, copied into each throwaway home and deleted with it")
    if args.dry_run:
        for case, agent, model, n in plan:
            print(f"  {case['id']}  {agent}  {model}  run {n}")
        return 0
    usable = {agent: login_problem(agent, args.login) for agent in agents}
    for agent, problem in usable.items():
        if problem:
            print(f"skipping {agent}: {problem}")
    plan = [p for p in plan if not usable[p[1]]]
    if not plan:
        sys.exit("nothing to run")
    if not args.yes and input("run? [y/N] ").strip().lower() != "y":
        return 1

    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    out_dir = Path(args.out or Path(tempfile.gettempdir()) / "skillbook-test-results" / stamp)
    out_dir.mkdir(parents=True, exist_ok=True)

    lock = threading.Lock()
    state = {"spent": 0.0, "unknown": 0, "next": 0, "stop": False}
    done = {}

    def worker():
        # each run keeps its own throwaway home and folder, so runs share nothing but the budget
        while True:
            with lock:
                if state["stop"] or state["next"] >= len(plan):
                    return
                if state["spent"] >= args.budget:
                    state["stop"] = True
                    print(f"budget of ${args.budget:.2f} reached; {len(plan) - state['next']} runs not started")
                    return
                i = state["next"]
                state["next"] += 1
                left = args.budget - state["spent"]
            case, agent, model, n = plan[i]
            try:
                result = run_one(case, agent, model, n, args, out_dir, left)
            except Exception as error:  # a runner bug ends this run, not the others; what it spent is unknown
                result = {"case": case["id"], "agent": agent, "run": n, "model": model,
                          "error": f"runner error: {error!r}", "cost": 0.0, "cost_unknown": True, "checks": {},
                          "reads": [], "changes": [], "answer": "", "review": case.get("review", []), "turns": []}
            with lock:
                state["spent"] += result["cost"] or 0.0
                state["unknown"] += int(result.get("cost_unknown", result["cost"] is None))
                done[i] = result
                print(f"  {case['id']}  {agent}  {model}  run {n}: {run_status(result)}")

    workers = [threading.Thread(target=worker) for _ in range(max(1, min(args.jobs, len(plan))))]
    for w in workers:
        w.start()
    try:
        for w in workers:
            w.join()
    except KeyboardInterrupt:
        # the agents get the interrupt too; let each run clean up its home, and start no new run
        state["stop"] = True
        print("interrupted; waiting for running runs to clean up")
        for w in workers:
            w.join()
    results = [done[i] for i in sorted(done)]
    spent, unknown = state["spent"], state["unknown"]

    summary = summarize(results, spent, unknown)
    (out_dir / "summary.md").write_text(summary)
    (out_dir / "summary.json").write_text(json.dumps(results, indent=2) + "\n")
    print()
    print(summary)
    print(f"summary written to {out_dir}")
    complete = all(not r["error"] and all(v is True for v in r["checks"].values()) for r in results)
    return 0 if complete and len(results) == len(plan) else 1


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--case", default="", help="run only cases whose id contains this text")
    p.add_argument("--agents", default="claude,codex", help="comma-separated: claude, codex")
    p.add_argument("--runs", type=int, default=0, help="runs per case and agent (default: the case's, else 1)")
    p.add_argument("--model", action="append", default=[],
                   help="agent=model, such as claude=sonnet; repeat it to run an agent on several models")
    p.add_argument("--login", action="store_true", help="copy your own login into each throwaway home")
    p.add_argument("--instruction", default="", help="a line added to the user's instruction file, for a variant")
    p.add_argument("--budget", type=float, default=1.0,
                   help="no new run starts once known spending reaches this many US dollars")
    p.add_argument("--jobs", type=int, default=4, help="runs at the same time, each in its own throwaway home")
    p.add_argument("--timeout", type=int, default=300, help="seconds per turn")
    p.add_argument("--keep", action="store_true", help="keep each run's event log in the results folder")
    p.add_argument("--out", help="results folder (default: a dated folder in the system's temporary folder)")
    p.add_argument("--dry-run", action="store_true", help="list the runs and the estimate, then stop")
    p.add_argument("--coverage", action="store_true", help="report scenario coverage without running an agent")
    p.add_argument("--summary", action="store_true", help="with --coverage: one line of aspect coverage, for just check")
    p.add_argument("--yes", action="store_true", help="run without asking")
    p.add_argument("--to-judge", nargs="+", metavar="FOLDER",
                   help="list every run in these results folders for semantic review, as tests/judge.md says")
    return p.parse_args()


def runs_to_judge(folders):
    """One tab-separated line per run: case, agent, model, run number and the summary that holds its answers."""
    lines = []
    for path in sorted(p for folder in folders for p in folder.rglob("summary.json")):
        for r in json.loads(path.read_text()):
            lines.append("\t".join([r["case"], r["agent"], r["model"], str(r["run"]), str(path.with_suffix(".md"))]))
    return "".join(line + "\n" for line in lines)


def load_cases(pattern):
    cases = []
    for path in sorted(CASES.glob("*/*.toml")):
        case_id = str(path.relative_to(CASES).with_suffix(""))
        if pattern not in case_id:
            continue
        data = tomllib.loads(path.read_text())
        data["id"] = case_id
        data["set"] = path.parent.name
        data.setdefault("agents", ["claude", "codex"])
        data.setdefault("runs", 1)  # cover a rule with several different cases, not repeats of one
        data.setdefault("pointer", True)
        data.setdefault("checks", {})
        if not (FIXTURES / data["fixture"]).is_dir():
            sys.exit(f"{case_id}: no fixture named {data['fixture']}")
        validate_case(data)
        cases.append(data)
    return cases


CHECK_NAMES = {"reads", "reads_not", "no_changes", "changed", "unchanged", "file_contains", "shorter",
               "states_before_change", "answer_contains", "answer_not_contains", "written_under", "folder_lacks",
               "nothing_left_running", "tmp_has", "tmp_lacks"}


def validate_case(case):
    """Reject misspelled assertions rather than silently running a case without its intended check."""
    if case.get("category", "normal") not in {"normal", "boundary", "edge"}:
        raise ValueError(f"{case['id']}: unknown category")
    if not case.get("turns"):
        raise ValueError(f"{case['id']}: at least one turn is required")
    for label, checks in [("run", case["checks"])] + [
            (f"turn {i}", t.get("checks", {})) for i, t in enumerate(case["turns"], 1)]:
        unknown = set(checks) - CHECK_NAMES
        if unknown:
            raise ValueError(f"{case['id']} {label}: unknown checks: {', '.join(sorted(unknown))}")
        for pattern in (checks.get("answer_contains", []) + checks.get("answer_not_contains", [])
                        + checks.get("tmp_has", []) + checks.get("tmp_lacks", [])):
            re.compile(pattern)
        for patterns in [*checks.get("file_contains", {}).values(), *checks.get("folder_lacks", {}).values()]:
            for pattern in patterns:
                re.compile(pattern)
    for skill in case.get("project_skills", []):
        if skill not in {"skillbook-design", "skillbook-write"}:
            raise ValueError(f"{case['id']}: unknown project skill {skill}")


def coverage(cases):
    """Count declared scenario coverage; this says nothing about observed model success."""
    names = {"essentials", "skillbook-design", "skillbook-write"}
    names.update(skill_name("essentials", str(p.relative_to(REPO / "skills" / "essentials")))
                 for p in (REPO / "skills" / "essentials" / "references").rglob("*.md"))
    lines = ["# Scenario coverage", "", "Executable cases, not observed results. Counts can overlap across skills.", "",
             "| Skill | Normal | Boundary | Edge | Multi-turn | Review |",
             "| --- | --- | --- | --- | --- | --- |"]
    for name in sorted(names):
        selected = [c for c in cases if name in c.get("skills", [])]
        counts = [sum(c.get("category") == category for c in selected) for category in ("normal", "boundary", "edge")]
        counts += [sum(len(c["turns"]) > 1 for c in selected), sum(bool(c.get("review")) for c in selected)]
        lines.append(f"| {name} | " + " | ".join(map(str, counts)) + " |")
    lines += ["", f"{len(cases)} cases; {sum(len(c['turns']) for c in cases)} scripted turns per agent.",
              "Review counts cases requiring a human or guiding agent to judge the semantic criteria."]
    return "\n".join(lines)


MANUAL = REPO / "tests" / "manual.toml"
SECTION_KINDS = {"Rules": "rule", "Advice": "advice", "Names": "names", "The checklist": "check"}


def skill_files():
    """Each built skill's file and name: a set's main skill, its plain files, and the project skills."""
    files = []
    for main in sorted((REPO / "skills").glob("*/SKILL.md")):
        set_name = main.parent.name
        files.append((set_name, main))
        for path in sorted((main.parent / "references").rglob("*.md")):
            files.append((skill_name(set_name, str(path.relative_to(main.parent))), path))
    for main in sorted((REPO / ".agents" / "skills").glob("*/SKILL.md")):
        files.append((main.parent.name, main))
    return files


def aspects():
    """Every aspect a skill states, named from its own text: each item of its rules, advice, names and checklist; each
    instruction, and for a routing line the route and its "Not for" cases; and its last instruction."""
    found = {}
    for name, path in skill_files():
        section, index, current = None, 0, None
        for line in path.read_text().splitlines():
            if line.startswith("## "):
                section, index, current = line[3:].strip(), 0, None
                if section == "The last instruction":
                    found[f"{name}:last"] = "the last instruction"
                continue
            top = re.match(r"^(?:\d+\.|-) (.*)", line)
            if top and section in SECTION_KINDS:
                index += 1
                found[f"{name}:{SECTION_KINDS[section]}:{index}"] = summary_of(top.group(1))
            elif top and section == "Instructions":
                route = re.search(r"\(`([a-z][a-z0-9-]*)`\)", top.group(1))
                index += 1
                current = route.group(1) if route else f"step-{index}"
                key = f"route:{current}" if route else f"step:{index}"
                found[f"{name}:{key}"] = summary_of(top.group(1))
            elif current and section == "Instructions" and line.strip().startswith("- Not for:"):
                found[f"{name}:not-for:{current}"] = summary_of(line.strip()[2:])
    return found


def summary_of(text):
    text = re.sub(r"[*`]", "", text).strip()
    return text[:70] + ("…" if len(text) > 70 else "")


def aspect_coverage(cases):
    """Which aspects a case or the manual list covers, which are named but unknown, and which nothing covers."""
    known = aspects()
    covered = {}
    for case in cases:
        for aspect in case.get("covers", []):
            covered.setdefault(aspect, []).append(case["id"])
    manual = tomllib.loads(MANUAL.read_text()).get("aspect", []) if MANUAL.is_file() else []
    by_hand = {m["id"]: m.get("reason", "") for m in manual}
    unknown_ids = sorted((set(covered) | set(by_hand)) - set(known))
    uncovered = [a for a in known if a not in covered and a not in by_hand]
    lines = ["# Aspect coverage", "",
             "Each aspect is an item a skill states: a rule, advice, a route or step and its Not-for cases, a checklist "
             "check, the last instruction. A case covers what its `covers` field names; tests/manual.toml lists what "
             "only a person can test. Counting coverage says nothing about any model passing.", "",
             "| Skill | Aspects | By a case | By hand | None |", "| --- | --- | --- | --- | --- |"]
    for name, _ in skill_files():
        mine = [a for a in known if a.split(":")[0] == name]
        lines.append(f"| {name} | {len(mine)} | {sum(a in covered for a in mine)} | "
                     f"{sum(a in by_hand and a not in covered for a in mine)} | {sum(a in uncovered for a in mine)} |")
    lines += ["", f"{len(known)} aspects; {len(uncovered)} with nothing covering them."]
    if unknown_ids:
        lines += ["", "Named but not found in any skill (renamed or renumbered?):"] + [f"- {a}" for a in unknown_ids]
    if uncovered:
        lines += ["", "Not covered:"] + [f"- `{a}`: {known[a]}" for a in uncovered]
    return "\n".join(lines), unknown_ids, uncovered


def models_for(agent, args):
    """The models an agent runs on: each one --model names for it, else its default."""
    for item in args.model:
        if item.partition("=")[0] not in DEFAULT_MODELS:
            # a value without a known agent would otherwise leave every agent on its default, unnoticed
            sys.exit(f"--model {item}: write it as agent=model, with agent one of {', '.join(DEFAULT_MODELS)}")
    named = [model for name, _, model in (item.partition("=") for item in args.model) if name == agent]
    return named or [DEFAULT_MODELS[agent]]


def login_problem(agent, use_login):
    binary = {"claude": "claude", "codex": "codex"}.get(agent)
    if not binary:
        return f"unknown agent {agent}"
    if not shutil.which(binary):
        return f"{binary} is not installed"
    if use_login:
        if not own_login(agent).is_file():
            return f"no login found at {own_login(agent)}"
        return None
    keys = {"claude": ["ANTHROPIC_API_KEY"], "codex": ["CODEX_API_KEY", "OPENAI_API_KEY"]}[agent]
    if not any(os.environ.get(k) for k in keys):
        return f"no API key ({' or '.join(keys)}); set one, or pass --login"
    return None


def own_login(agent):
    real_home = Path(os.path.expanduser("~"))
    return real_home / (".claude/.credentials.json" if agent == "claude" else ".codex/auth.json")


def run_status(result):
    failed = [name for name, ok in result["checks"].items() if ok is False]
    unresolved = [name for name, ok in result["checks"].items() if ok is None]
    status = "error" if result["error"] else ("ok" if not failed else "FAIL " + ", ".join(failed))
    if not result["error"] and not failed and unresolved:
        status = "unknown evidence: " + ", ".join(unresolved)
    elif not result["error"] and not failed and result.get("review"):
        status = "automatic checks passed; review pending"
    price = "cost unknown" if result["cost"] is None else f"${result['cost']:.3f}"
    if result.get("cost_unknown"):
        price += "; additional cost unknown"
    return f"{status}  ({price})"


def run_one(case, agent, model, n, args, out_dir, budget_left):
    result = {"case": case["id"], "agent": agent, "run": n, "model": model, "error": None,
              "cost": 0.0, "cost_unknown": False, "checks": {}, "reads": [], "changes": [], "answer": "",
              "review": case.get("review", []), "turns": []}
    root = Path(tempfile.mkdtemp(prefix="skillbook-test-"))
    groups = []  # each turn's process group, so what an agent leaves running is found and ended with the run
    marker = None
    try:
        home, work, tmp = root / "home", root / "work", root / "tmp"
        tmp.mkdir()
        shutil.copytree(FIXTURES / case["fixture"], work)
        # A fixture keeps one project instruction file, AGENTS.md; Claude Code reads only CLAUDE.md.
        if agent == "claude" and (work / "AGENTS.md").is_file() and not (work / "CLAUDE.md").exists():
            shutil.copyfile(work / "AGENTS.md", work / "CLAUDE.md")
        prepare_home(home, agent, case, args.login, args.instruction)
        before = snapshot(work)
        env = agent_env(home, agent, args.login, tmp)
        marker = env.get(MARKER)
        events = []
        session = None
        previous = before
        previous_text = fixture_text(work)
        turn_checks = {}
        last_tmp = None  # every path in the run's temporary folder when the last turn ended
        for i, turn in enumerate(case["turns"], 1):
            remaining = max(0.0, budget_left - result["cost"])
            if agent == "claude":
                if remaining <= 0 or result["cost_unknown"]:
                    result["error"] = f"turn {i}: remaining budget is exhausted or unknown"
                    break
                cmd = ["claude", "-p", turn["prompt"], "--model", result["model"], "--output-format", "stream-json",
                       "--verbose", "--permission-mode", "acceptEdits", "--max-budget-usd", f"{remaining:.8f}"]
                if session:
                    cmd += ["--resume", session]
            else:
                cmd = ["codex", "exec"] + (["resume"] if session else []) + [
                    "--json", "--skip-git-repo-check", "-m", result["model"]]
                # a resumed run takes no -s flag, so the same sandbox is set through the config
                cmd += ["-s", "workspace-write"] if not session else ["-c", 'sandbox_mode="workspace-write"']
                cmd += ([session] if session else []) + [turn["prompt"]]
            ran = run_turn(cmd, work, env, args.timeout, groups)
            stdout = ran["stdout"]
            if ran["status"] is None:
                failed = True
                result["error"] = f"turn {i}: took longer than {args.timeout} seconds"
            else:
                failed = ran["status"] != 0
                if failed:
                    result["error"] = f"turn {i}: exit {ran['status']}: {redact(ran['stderr'].strip()[-300:])}"
            turn_events = parse_events(stdout)
            if args.keep:
                model_name = re.sub(r"[^A-Za-z0-9._-]+", "-", result["model"])
                name = f"{case['id'].replace('/', '--')}--{agent}--{model_name}--{n}--turn{i}.jsonl"
                (out_dir / name).write_text(stdout)
            turn_cost = cost(agent, result["model"], [turn_events])
            result["cost"] += turn_cost or 0.0
            result["cost_unknown"] |= turn_cost is None or failed
            events.append(turn_events)
            session = session or session_id(agent, turn_events)
            now = snapshot(work)
            this_turn = observe(agent, [turn_events], home, case["set"], previous, work, turn.get("checks", {}))
            this_turn["left_running"] = ran["left"]
            this_turn["left_unknown_because"] = ran["left_why"]
            this_turn["tmp_listing"] = ran["tmp"]
            current_text = fixture_text(work)
            result["turns"].append({**this_turn, "actions": action_evidence(agent, turn_events),
                                    "file_diffs": fixture_diffs(previous_text, current_text),
                                    "trace_complete": not failed})
            last_tmp = ran.get("tmp_paths")
            if turn.get("checks"):
                for name, ok in check(turn["checks"], this_turn, case["fixture"], last_tmp).items():
                    turn_checks[f"turn {i}: {name}"] = ok
            previous = now
            previous_text = current_text
            if failed:
                break
        if events:
            result.update(observe(agent, events, home, case["set"], before, work, case["checks"]))
            result["left_running"] = result["turns"][-1]["left_running"]
            result["checks"] = {**turn_checks, **check(case["checks"], result, case["fixture"], last_tmp)}
    finally:
        # end what the agent left running before its folders go, so nothing outlives the run on the user's machine
        end_run(groups, marker)
        # remove a copied login first and say so if that fails, rather than trusting the folder removal to take it
        for login in (root / "home" / ".claude" / ".credentials.json", root / "home" / ".codex" / "auth.json"):
            try:
                login.unlink(missing_ok=True)
            except OSError as exc:
                result["error"] = (result["error"] or "") + f"; could not delete the copied login {login}: {exc}"
        shutil.rmtree(root, ignore_errors=True)
    return result


def run_turn(cmd, work, env, timeout, groups):
    """One agent turn, started in a session and process group of its own, so whatever it starts can be found.

    Returns its output, its error output, its exit status (None when it took longer than the timeout), what was
    still running from this run's turns once the agent had ended (None when that cannot be told, and why), and what
    the run's own temporary folder held, all recorded before anything is ended or removed. On a timeout, everything
    the run has running is ended at once, the agent included."""
    marker = env.get(MARKER)
    proc = subprocess.Popen(cmd, cwd=work, env=env, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, text=True, start_new_session=True)
    groups.append(proc.pid)
    try:
        stdout, stderr = proc.communicate(timeout=timeout)
        left, why = left_report(running(groups, marker))
        return {"stdout": stdout, "stderr": stderr, "status": proc.returncode, "left": left, "left_why": why,
                "tmp": tmp_listing(env.get("TMPDIR")), "tmp_paths": tmp_paths(env.get("TMPDIR"))}
    except subprocess.TimeoutExpired:
        # the agent may have ended while something it started still holds its output open; that is not a timeout
        finished = proc.poll() is not None
        left, why = left_report(running(groups, marker), proc.pid)
        listing, paths = tmp_listing(env.get("TMPDIR")), tmp_paths(env.get("TMPDIR"))
        end_run(groups, marker)
        proc.kill()
        try:
            stdout, stderr = proc.communicate(timeout=10)
        except subprocess.TimeoutExpired:
            stdout, stderr = "", ""  # something outside the group still holds the output; the trace stays incomplete
        return {"stdout": stdout or "", "stderr": stderr or "", "status": proc.returncode if finished else None,
                "left": left, "left_why": why, "tmp": listing, "tmp_paths": paths}


def left_report(found, skip=None):
    """The commands still running from a run's turns, as the summary shows them, and why that is unknown: None and
    a reason when the process list could not be read, or when it is empty on a system that does not show a process's
    environment, since one that left its group could then be running unseen."""
    if found is None:
        return None, "the process list could not be read"
    left = sorted(redact(c)[:200] for p, c in found.items() if p != skip)
    if not left and not sees_environments():
        return None, "this system does not show a process's environment, so one that left its group is not seen"
    return left, None


def sees_environments():
    return Path("/proc/self/environ").exists()


def tmp_listing(tmp, cap=50):
    """What a run's own temporary folder holds, as paths inside it with sizes and never contents, cut at cap entries,
    so a judge can see what the agent left or kept there before the folder goes with the run."""
    if not tmp:
        return None
    entries = []
    for folder, dirs, files in os.walk(tmp):
        dirs.sort()
        for name in sorted(files) + dirs:
            if len(entries) >= cap:
                return {"entries": entries, "cut": True}
            path = Path(folder) / name
            try:
                size = path.lstat().st_size
            except OSError:
                continue
            rel = str(path.relative_to(tmp)) + ("/" if name in dirs else "")
            entries.append([redact(rel)[:200], size])
    return {"entries": entries, "cut": False}


def tmp_paths(tmp):
    """Every path inside a run's own temporary folder, uncut, for the tmp_has and tmp_lacks checks. It is kept in
    memory for those checks only and never written to a summary, so the cut listing stays what a judge sees."""
    if not tmp:
        return None
    found = []
    for folder, dirs, files in os.walk(tmp):
        found += [str((Path(folder) / name).relative_to(tmp)) for name in files]
        found += [str((Path(folder) / name).relative_to(tmp)) + "/" for name in dirs]
    return found


def running(groups, marker):
    """The processes a run's agents left running, as {pid: command}: those still in one of its turns' process groups,
    and, where the system shows a process's environment, those that carry the run's marker after leaving the group.
    None when the process list cannot be read, so a check reports unknown rather than nothing."""
    found = owned(groups, marker)
    return None if found is None else {pid: command for pid, (_, _, command) in found.items()}


def owned(groups, marker):
    """Like running, as {pid: (process group, start time, command)}; the start time tells a process from a later one
    that was given the same ID."""
    if not groups:
        return {}
    try:
        listing = subprocess.run(["ps", "-A", "-o", "pid=,pgid=,stat=,args="], capture_output=True, text=True,
                                 timeout=10)
    except (OSError, subprocess.SubprocessError):
        return None
    if listing.returncode != 0:
        return None
    found = {}
    for line in listing.stdout.splitlines():
        parts = line.split(None, 3)
        if len(parts) < 3 or not parts[0].isdigit() or not parts[1].isdigit() or parts[2].startswith("Z"):
            continue  # a zombie has ended already; only its parent's bookkeeping is left
        pid, group = int(parts[0]), int(parts[1])
        if pid != os.getpid() and (group in groups or carries(pid, marker)):
            found[pid] = (group, start_time(pid), parts[3] if len(parts) > 3 else "")
    return found


def carries(pid, marker):
    """True when a process's environment holds this run's marker; False where the system does not show it."""
    if not marker:
        return False
    try:
        return f"{MARKER}={marker}".encode() in Path(f"/proc/{pid}/environ").read_bytes().split(b"\0")
    except OSError:
        return False


def start_time(pid):
    """When a process started, in the system's own ticks, or None where the system does not show it."""
    try:
        return Path(f"/proc/{pid}/stat").read_text().rpartition(")")[2].split()[19]
    except (OSError, IndexError):
        return None


def end_run(groups, marker):
    """End everything a run has running; where the process list cannot be read, end its turns' groups whole."""
    if owned(groups, marker) is None:
        for group in groups:
            try:
                os.killpg(group, signal.SIGKILL)
            except (ProcessLookupError, PermissionError):
                pass
        return
    end_processes(groups, marker)


def end_processes(groups, marker):
    """End what the run's turns left: each group by a group signal, TERM and then, after a moment, KILL. The list is
    read again all the while, so a process started during the ending is caught too. A process is never found by its
    name, only by its group or the run's marker."""
    for sig in (signal.SIGTERM, signal.SIGKILL):
        sent = set()
        deadline = time.monotonic() + 2
        while True:
            found = owned(groups, marker)
            if not found:
                return
            signal_owned(found, groups, sig, sent)
            if time.monotonic() >= deadline:
                break
            time.sleep(0.05)


def signal_owned(found, groups, sig, sent):
    """Signal what was found and not signalled yet: a group once for its new members, a process that left its groups
    alone and only if it still has the start time it was found with, so a process given its ID since is left be."""
    new = {pid: v for pid, v in found.items() if (pid, v[1]) not in sent}
    sent.update((pid, v[1]) for pid, v in new.items())
    for group in {v[0] for v in new.values() if v[0] in groups}:
        try:
            os.killpg(group, sig)
        except (ProcessLookupError, PermissionError):
            pass
    for pid, (group, started, _) in new.items():
        if group not in groups and started is not None and start_time(pid) == started:
            try:
                os.kill(pid, sig)
            except (ProcessLookupError, PermissionError):
                pass


def alive(pid):
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    try:
        return Path(f"/proc/{pid}/stat").read_text().rpartition(")")[2].split()[0] != "Z"
    except (OSError, IndexError):
        return True


def observe(agent, events, home, set_name, before, work, checks):
    """Use the same evidence for run-wide and turn-local assertions, including leaf reads and file contents. The answer
    is every given turn's text, so a run-wide answer check sees each turn, not only the last."""
    said, changed, uncertain = text_before_change(agent, events)
    delta = changes(before, snapshot(work))
    if delta and not changed and not uncertain:
        # no mutation boundary was observable; later prose is not a prior statement
        said, uncertain = "", "a change no action shows"
    paths = set(checks.get("file_contains", {})) | set(checks.get("shorter", []))
    folders = tuple(checks.get("folder_lacks", {}))
    paths |= {p for p in written(delta) if folders and p.startswith(folders)}
    return {"reads": sorted(skills_read(agent, events, home, set_name)),
            "changes": delta, "answer": "\n\n".join(a for a in (turn_answer(agent, turn) for turn in events) if a),
            "before_change": said, "changed_files": changed or bool(delta), "sequencing_unknown": uncertain,
            "files": {p: (work / p).read_text(errors="replace")
                      if (work / p).is_file() and not (work / p).is_symlink()
                      and (work / p).resolve().is_relative_to(work.resolve())
                      and not withheld((work / p).read_bytes()) else None for p in paths}}


def parse_events(stdout):
    events = []
    for line in stdout.splitlines():
        if line.startswith("{"):
            try:
                events.append(json.loads(line))
            except json.JSONDecodeError:
                continue  # a timeout can leave the final event incomplete
    return events


SECRET_MARKERS = (b"refresh_token", b"refreshToken", b"access_token", b"accessToken", b"sk-ant-", b"OPENAI_API_KEY",
                  b"CODEX_API_KEY", b"ANTHROPIC_API_KEY")


def withheld(data):
    """True for content that looks like a login or key, which a kept summary must never hold."""
    return any(marker in data for marker in SECRET_MARKERS)


def redact(text):
    text = re.sub(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", "(email)", text)
    return re.sub(r"[A-Za-z0-9_\-]{32,}", "(token)", text)


def fixture_text(work):
    """Only fixture files, never the separate credential home; binary files keep their content hash; a hard link, or
    content that looks like a login or key, is withheld, since an agent could copy one into the project."""
    files = {}
    for name, digest in snapshot(work).items():
        path = work / name
        if path.is_symlink():
            files[name] = f"(symlink to {os.readlink(path)})\n"
            continue
        data = path.read_bytes()
        if path.stat().st_nlink > 1 or withheld(data):
            files[name] = f"(content withheld: a hard link or credential-like content, sha256 {digest})\n"
            continue
        try:
            files[name] = data.decode("utf-8")
        except UnicodeDecodeError:
            files[name] = f"(binary file, sha256 {digest})\n"
    return files


def fixture_diffs(before, after):
    return {p: "".join(difflib.unified_diff(before.get(p, "").splitlines(keepends=True),
                                           after.get(p, "").splitlines(keepends=True),
                                           fromfile=f"before/{p}", tofile=f"after/{p}"))
            for p in sorted(before.keys() | after.keys()) if before.get(p) != after.get(p)}


def message_blocks(event):
    """A Claude event's content blocks; some events carry their message as plain text, which holds none."""
    message = event.get("message")
    content = message.get("content") if isinstance(message, dict) else None
    return [b for b in content if isinstance(b, dict)] if isinstance(content, list) else []


def action_evidence(agent, events):
    """Ordered tool names, commands and target paths, without tool outputs or credential-home contents."""
    actions = []
    outcomes = {}
    if agent == "claude":
        for e in events:
            for block in message_blocks(e):
                if block.get("type") == "tool_result":
                    outcomes[block.get("tool_use_id")] = "failed" if block.get("is_error") else "succeeded"
    for e in events:
        if agent == "claude" and e.get("type") == "assistant":
            for block in message_blocks(e):
                if block.get("type") == "tool_use":
                    data = block.get("input", {})
                    action = {"tool": block["name"], "id": block.get("id"),
                              "status": outcomes.get(block.get("id"), "unknown")}
                    action.update({k: data[k] for k in ("command", "file_path", "path", "url") if k in data})
                    actions.append(action)
        elif agent == "codex" and e.get("type") in {"item.started", "item.completed"}:
            item = e.get("item", {})
            if item.get("type") in {"agent_message", "reasoning"}:
                continue
            action = {"tool": item.get("type"), "phase": e["type"]}
            action.update({k: item[k] for k in ("command", "exit_code", "changes", "server", "tool") if k in item})
            actions.append(action)
    return actions


def prepare_home(home, agent, case, use_login, instruction=""):
    agent_dir = home / (".claude" if agent == "claude" else ".codex")
    agent_dir.mkdir(parents=True)
    subprocess.run([str(REPO / "install.sh"), "--agents", agent], env={**os.environ, "HOME": str(home)},
                   check=True, capture_output=True)
    skill_dir = home / (".claude" if agent == "claude" else ".agents") / "skills"
    for name in case.get("project_skills", []):
        # hidden files, such as an editor's swap file, are not part of the skill under test
        shutil.copytree(REPO / ".agents" / "skills" / name, skill_dir / name, ignore=shutil.ignore_patterns(".*"))
    if agent == "claude":
        # setup adds this read rule for a personal install, since the default mode asks before each reference file.
        # A print-mode run has nobody to approve a command, so commands run without asking, inside Claude Code's
        # sandbox: writes only in the run's folder and its TMPDIR, no network, and no start at all without it.
        settings = {"permissions": {"allow": ["Read(~/.claude/skills/**)", "Bash"]},
                    "sandbox": {"enabled": True, "failIfUnavailable": True, "autoAllowBashIfSandboxed": True,
                                "allowUnsandboxedCommands": False}}
        (agent_dir / "settings.json").write_text(json.dumps(settings, indent=2) + "\n")
    lines = ([POINTER] if case["pointer"] else []) + ([instruction] if instruction else [])
    if lines:
        (agent_dir / ("CLAUDE.md" if agent == "claude" else "AGENTS.md")).write_text("\n\n".join(lines) + "\n")
    if use_login:
        shutil.copy2(own_login(agent), agent_dir / own_login(agent).name)


def agent_env(home, agent, use_login, tmp):
    keep = ("PATH", "LANG", "LC_ALL", "TERM", "USER", "LOGNAME", "SHELL")
    env = {k: os.environ[k] for k in keep if k in os.environ}
    env["HOME"] = str(home)
    # the run's own temporary folder, inside its throwaway folder, so nothing the agent leaves there outlives the run
    env["TMPDIR"] = str(tmp)
    env[MARKER] = str(tmp)
    if agent == "codex":
        env["CODEX_HOME"] = str(home / ".codex")
    if not use_login:
        for k in ("ANTHROPIC_API_KEY", "CODEX_API_KEY", "OPENAI_API_KEY"):
            if k in os.environ:
                env[k] = os.environ[k]
        if agent == "codex" and "CODEX_API_KEY" not in env and "OPENAI_API_KEY" in env:
            env["CODEX_API_KEY"] = env["OPENAI_API_KEY"]
    return env


def snapshot(folder):
    files = {}
    for path in folder.rglob("*"):
        rel = path.relative_to(folder)
        if AGENT_DIRS.intersection(rel.parts):
            continue
        if path.is_symlink():
            files[str(rel)] = "symlink:" + hashlib.sha256(os.readlink(path).encode()).hexdigest()
        elif path.is_file():
            files[str(rel)] = hashlib.sha256(path.read_bytes()).hexdigest()
    return files


def written(changes):
    """The paths a list of changes added or changed, leaving out removals."""
    return [c.split(" ", 1)[1] for c in changes if c.startswith(("changed ", "added "))]


def changes(before, after):
    out = [f"added {p}" for p in after if p not in before]
    out += [f"removed {p}" for p in before if p not in after]
    out += [f"changed {p}" for p in before if p in after and before[p] != after[p]]
    return sorted(out)


def session_id(agent, events):
    for e in events:
        if agent == "claude" and e.get("session_id"):
            return e["session_id"]
        if agent == "codex" and e.get("type") == "thread.started":
            return e.get("thread_id")
    return None


def skill_name(set_name, rel):
    """The skill a file in a set's folder holds: SKILL.md is the set's main skill, references/a/b.md is a-b."""
    if rel == "SKILL.md":
        return set_name
    if rel.startswith("references/") and rel.endswith(".md"):
        return rel[len("references/"):-len(".md")].replace("/", "-")
    return None


def skills_read(agent, events, home, set_name):
    """Skills read through successful tool results or supported file-reading commands."""
    found = set()
    all_events = [e for turn in events for e in turn]
    succeeded, outputs = set(), {}
    for e in all_events:
        if agent == "claude" and e.get("type") == "user":
            content = e["message"].get("content", [])
            for block in content if isinstance(content, list) else []:
                if block.get("type") == "tool_result" and not block.get("is_error"):
                    succeeded.add(block.get("tool_use_id"))
                    text = block.get("content", "")
                    outputs[block.get("tool_use_id")] = text if isinstance(text, str) else "\n".join(
                        part.get("text", "") for part in text if isinstance(part, dict))
    for e in all_events:
        if agent == "claude" and e.get("type") == "assistant":
            for block in e["message"].get("content", []):
                if block.get("type") != "tool_use" or block.get("id") not in succeeded:
                    continue
                if block["name"] == "Skill":
                    found.add(block["input"].get("skill", "").split(":")[-1])
                elif block["name"] == "Bash":
                    found |= reads_in_command(block["input"].get("command", ""), set_name)
                    found |= skills_printed(outputs.get(block.get("id"), ""))
                elif block["name"] in READ_TOOLS:
                    found |= {skill_name(s, rel) for s, rel in FULL_PATH.findall(json.dumps(block["input"]))}
        if agent == "codex" and e.get("type") == "item.completed":
            item = e["item"]
            if item.get("type") == "command_execution":
                if item.get("exit_code") == 0:
                    found |= reads_in_command(item.get("command", ""), set_name)
                found |= skills_printed(item.get("aggregated_output") or "")
    found.discard(None)
    found.discard("")
    return found


def skill_ends():
    """Each skill's first heading and last line, from the repository's copies, which the throwaway homes install."""
    files = {p.parent.name: p for p in (REPO / ".agents" / "skills").glob("*/SKILL.md")}
    for folder in (REPO / "skills").iterdir():
        files.update({skill_name(folder.name, p.relative_to(folder).as_posix()): p for p in folder.rglob("*.md")})
    ends = {}
    for name, path in files.items():
        lines = [line.rstrip() for line in path.read_text().splitlines() if line.strip()]
        heading = next((line for line in lines if line.startswith("# ")), None)
        if name and heading:
            ends[name] = (heading, lines[-1])
    return ends


SKILL_ENDS = skill_ends()


def skills_printed(output):
    """Skills whose whole file a command printed, whatever the command: its heading and its last line are both there.
    The exit status of a sequence such as `cat a || cat b; ls` cannot prove a read; the output can."""
    lines = {line.rstrip() for line in output.splitlines()}
    return {name for name, (heading, last) in SKILL_ENDS.items() if heading in lines and last in lines}


READ_TOOLS = {"Read", "View"}
READERS = {"cat", "sed", "head", "tail", "nl", "awk", "bat"}
FULL_PATH = re.compile(r"skills/([a-z][a-z0-9-]*)/(SKILL\.md|references/[a-z0-9/_-]+\.md)")
CD_INTO_SET = re.compile(r"^cd\s+['\"]?[^\s'\"]*?skills/([a-z][a-z0-9-]*)((?:/[a-z0-9_-]+)*)/?['\"]?$")
MD_FILE = re.compile(r"(?<![\w/.-])((?:[a-z0-9_-]+/)*[a-z0-9_-]+\.md|SKILL\.md)")
SHELL_WRAPPER = re.compile(r"""^\S*(?:sh|bash|zsh)\s+-l?c\s+(['"])(.*)\1$""", re.S)
# Silencing output or joining its two streams changes no file and hides no exit status.
SAFE_REDIRECT = re.compile(r"\s*(?:[12]?>>?\s*/dev/null|2>&1)(?=\s|$|[;&|)])")


def reads_in_command(command, set_name):
    """The skills whose files a shell command prints with a reading command such as cat or sed, not merely names."""
    wrapped = SHELL_WRAPPER.match(command.strip())
    command = SAFE_REDIRECT.sub("", expand_braces(wrapped.group(2) if wrapped else command))
    # Command substitution and background jobs can hide a read anywhere, so nothing in such a command counts.
    if re.search(r"`|\$\(|(?<!&)&(?!&)", command):
        return set()
    # A zero exit proves only some steps ran and succeeded. After `a; b`, a new line or `a || b`, it proves only what
    # follows the last of them, and of `a || b && c` only `c`; in `a && b`, both. A step holding a pipe or a
    # redirection is left uncounted, since its own status can hide a failed read; the steps beside it still count.
    command = re.split(r"[;\n]", command)[-1]
    steps = command.split("&&")
    if "||" in command:
        steps = command.rsplit("||", 1)[1].split("&&")[1:]
    steps = [s for s in steps if not re.search(r"[|<>]", s)]
    command = " && ".join(steps)
    found = set()
    cd_set, base = None, None
    for segment in re.split(r"&&|\|\||;|\||\n", command):
        segment = segment.strip()
        try:
            words = shlex.split(segment)
        except ValueError:
            continue
        if not words:
            continue
        if words[0] == "cd":
            cd = CD_INTO_SET.match(segment)
            cd_set, base = (cd.group(1), cd.group(2).strip("/")) if cd else (None, None)
            continue
        for token in reader_operands(words):
            full = FULL_PATH.search(token)
            if full and full.end() == len(token):
                found.add(skill_name(*full.groups()))
                continue
            if not MD_FILE.fullmatch(token):
                continue
            if cd_set is not None:
                # after `cd .../skills/<set>/references`, a file is named relative to that folder
                rel = f"{base}/{token}" if base and token != "SKILL.md" else token
                found.add(skill_name(cd_set, rel))
            elif token == "SKILL.md" or token.startswith("references/"):
                found.add(skill_name(set_name, token))
    return found


def reader_operands(words):
    """Recognise a small set of read-only forms; program strings and unknown options are not file evidence."""
    program, args = os.path.basename(words[0]), list(words[1:])
    if program not in READERS:
        return []
    if program == "sed":
        quiet = args and args[0] == "-n"
        if args and args[0] == "-n":
            args.pop(0)
        script = args.pop(0) if args else None
        if script is None or (quiet and not script) or not re.fullmatch(r"(?:\d+(?:,(?:\d+|\$))?p)?", script):
            return []
    elif program == "awk":
        if not args or args.pop(0) != "1":
            return []
    allowed = {"cat": {"-n", "-b", "-s", "-v", "-A", "-E", "-T"},
               "nl": {"-ba", "-bt", "-bn"}, "bat": {"-p", "--plain", "--paging=never"}}
    operands = []
    while args:
        word = args.pop(0)
        if word == "--":
            return operands + args
        if program in {"head", "tail"} and word in {"-n", "-c"}:
            count = args.pop(0) if args else ""
            if not count.isdigit() or int(count) == 0:
                return []
        elif word.startswith("-"):
            if word not in allowed.get(program, set()):
                return []
        else:
            operands.append(word)
    return operands


MIN_STATEMENT = 80  # characters of text before the first change; less is a preamble, not a stated plan
WRITE_TOOLS = {"Edit", "Write", "MultiEdit", "NotebookEdit"}
WRITE_COMMANDS = {"rm", "mv", "cp", "mkdir", "touch", "tee", "truncate", "ln", "apply_patch"}
# Tools and items that cannot touch the toy project: a plan update or a search is not a potential mutation.
NO_FILE_TOOLS = {"claude": {"Skill", "Grep", "Glob", "LS", "TodoWrite", "WebSearch", "WebFetch", "ToolSearch"},
                 "codex": {"todo_list", "web_search", "error"}}


def command_effect(command):
    """Classify only direct known forms, joined by pipes, `&&`, `||` or `;`. Opaque scripts have an unknown effect, not
    a guessed one."""
    wrapped = SHELL_WRAPPER.match(command.strip())
    command = SAFE_REDIRECT.sub("", wrapped.group(2) if wrapped else command)
    if re.search(r"[\n`]|\$\(", command):
        return "unknown"
    lexer = shlex.shlex(command, posix=True, punctuation_chars=True)
    lexer.whitespace_split = True
    try:
        tokens = list(lexer)
    except ValueError:
        return "unknown"
    steps, words = [], []
    for token in tokens:
        if token in {"&&", "||", ";", "|"}:
            steps.append(words)
            words = []
        elif set(token) <= set("&|;<>()"):
            return "unknown"  # a background job, a subshell or a redirection: what it touches is not followed
        else:
            words.append(token)
    effects = {segment_effect(step) for step in steps + [words]}
    if "write" in effects:
        return "write"
    return "read" if effects == {"read"} else "unknown"


def segment_effect(words):
    """One simple command, as words: write, read, or unknown when it is not a known direct form. A `for` loop's own
    words only set its variable; the commands inside it are classified like any other."""
    if words[:1] == ["do"]:
        words = words[1:]
    if words == ["done"] or words[:1] == ["for"] and words[2:3] == ["in"]:
        return "read"
    while words and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*=\S*", words[0]):
        words = words[1:]  # a shell variable set for what follows; a command substitution was refused above
    if not words or words[0] == "cd" and len(words) <= 2:
        return "read"
    program = os.path.basename(words[0])
    if program in WRITE_COMMANDS or program == "sed" and any(w.startswith("-i") for w in words[1:]):
        return "write"
    if reader_operands(words) or program in {"pwd", "ls", "true", "false", "wc", "grep", "echo", "printf"}:
        return "read"
    if program == "rg" and not any(w.startswith("--pre") for w in words[1:]):
        return "read"
    if program == "find" and not any(w in {"-exec", "-execdir", "-delete", "-fprint", "-fprintf", "-fls", "-ok", "-okdir"}
                                     for w in words[1:]):
        return "read"
    if program == "git" and len(words) > 1 and words[1] in {"status", "diff", "log", "show"} and "--output" not in " ".join(words):
        return "read"
    if program == "sed" and any(re.search(r"(^|[;}\s])w\s", w) for w in words[1:]):
        return "unknown"  # sed's w command writes a file
    if program in {"sed", "nl", "head", "tail", "cat", "awk"}:
        return "read"  # inside a pipeline, reading its input; a file-writing form is caught above or by redirection
    return "unknown"


def text_before_change(agent, events):
    """Text before the first definite or potential mutation, whether it wrote, and the first action of unknown effect,
    named so an unknown order can be explained; empty when there was none."""
    said = []
    for e in (e for turn in events for e in turn):
        if agent == "claude" and e.get("type") == "assistant":
            for block in e["message"].get("content", []):
                if block.get("type") == "text":
                    said.append(block.get("text", ""))
                elif block.get("type") == "tool_use":
                    if block["name"] in WRITE_TOOLS:
                        return "\n\n".join(said), True, ""
                    if block["name"] == "Bash":
                        command = block["input"].get("command", "")
                        effect = command_effect(command)
                        if effect != "read":
                            return "\n\n".join(said), effect == "write", unknown_action(effect, command)
                    elif block["name"] not in READ_TOOLS | NO_FILE_TOOLS["claude"]:
                        return "\n\n".join(said), False, f"tool {block['name']}"
        if agent == "codex" and e.get("type") in ("item.started", "item.completed"):
            item = e["item"]
            if e["type"] == "item.completed" and item.get("type") == "agent_message":
                said.append(item.get("text", ""))
            elif item.get("type") == "file_change":
                return "\n\n".join(said), True, ""
            elif item.get("type") == "command_execution":
                command = item.get("command", "")
                effect = command_effect(command)
                if effect != "read":
                    return "\n\n".join(said), effect == "write", unknown_action(effect, command)
            elif item.get("type") not in {"agent_message", "reasoning"} | NO_FILE_TOOLS["codex"]:
                return "\n\n".join(said), False, f"item {item.get('type')}"
    return "\n\n".join(said), False, ""


def unknown_action(effect, command):
    """Names a command of unknown effect, shortened; empty for one whose effect is known."""
    return "command " + " ".join(command.split())[:80] if effect == "unknown" else ""


def expand_braces(text):
    """Expands shell braces one level, as in references/{act,respond}.md, so each file is seen by name."""
    brace = re.compile(r"([^\s'\"{}]*)\{([^{}\s]*,[^{}\s]*)\}([^\s'\"{}]*)")
    return brace.sub(lambda m: " ".join(m.group(1) + part + m.group(3) for part in m.group(2).split(",")), text)


def turn_answer(agent, turn_events):
    """Everything the agent said in the turn, so a question followed by a closing line still counts."""
    texts = []
    for e in turn_events:
        if agent == "claude" and e.get("type") == "assistant":
            texts += [b.get("text", "") for b in e["message"].get("content", []) if b.get("type") == "text"]
        if agent == "codex" and e.get("type") == "item.completed" and e["item"].get("type") == "agent_message":
            texts.append(e["item"].get("text", ""))
    return "\n\n".join(t for t in texts if t)


def cost(agent, model, events):
    total = 0.0
    seen = False
    for e in (e for turn in events for e in turn):
        if agent == "claude" and e.get("type") == "result":
            value = e.get("total_cost_usd")
            if type(value) not in {int, float} or not math.isfinite(value) or value < 0:
                return None
            total += value
            seen = True
        if agent == "codex" and e.get("type") == "turn.completed":
            seen = True
            prices = CODEX_PRICES.get(model)
            if not prices:
                return None
            u = e.get("usage")
            if not isinstance(u, dict):
                return None
            counts = [u.get("input_tokens"), u.get("output_tokens"), u.get("cached_input_tokens", 0)]
            if any(type(n) is not int or n < 0 for n in counts) or counts[2] > counts[0]:
                return None
            cached = u.get("cached_input_tokens", 0)
            total += ((u["input_tokens"] - cached) * prices[0] + cached * prices[1]
                      + u["output_tokens"] * prices[2]) / 1_000_000
    return total if seen else None


def check(checks, result, fixture=None, tmp=None):
    """The automatic checks for a run or a turn; tmp is every path in the run's temporary folder when the turn ended,
    or None when that is not known, which leaves the temporary-folder checks unknown."""
    out = {}
    for name in checks.get("reads", []):
        out[f"reads {name}"] = name in result["reads"]
    for name in checks.get("reads_not", []):
        out[f"no supported read observed for {name}"] = name not in result["reads"]
    if checks.get("no_changes"):
        out["no changes"] = not result["changes"]
    for path in checks.get("unchanged", []):
        out[f"unchanged {path}"] = not any(c.split(" ", 1)[1] == path for c in result["changes"])
    for path in checks.get("changed", []):
        # a file the turn created counts as changed: the case asks that it holds the work, not that it existed before
        out[f"changed {path}"] = path in written(result["changes"])
    if checks.get("states_before_change"):
        # the agent said what it was going to do before its first change; what the text says is judged by reading it
        said = len(result.get("before_change", "").strip()) >= MIN_STATEMENT
        if not result.get("changed_files") or said:
            out["text before its first change"] = True
        elif result.get("sequencing_unknown"):
            out["text before its first change"] = None
        else:
            out["text before its first change"] = False
    for path, patterns in checks.get("file_contains", {}).items():
        text = (result.get("files") or {}).get(path) or ""
        for pattern in patterns:
            out[f"{path} keeps /{pattern}/"] = bool(re.search(pattern, text, re.IGNORECASE))
    for path in checks.get("shorter", []):
        text = (result.get("files") or {}).get(path)
        original = (FIXTURES / fixture / path).read_text() if fixture else ""
        out[f"{path} shorter"] = text is not None and len(text) < len(original)
    for folder, least in checks.get("written_under", {}).items():
        count = sum(p.startswith(folder) for p in written(result["changes"]))
        out[f"at least {least} files written under {folder}"] = count >= least
    for folder, patterns in checks.get("folder_lacks", {}).items():
        texts = [t or "" for p, t in (result.get("files") or {}).items() if p.startswith(folder)]
        for pattern in patterns:
            out[f"files written under {folder} lack /{pattern}/"] = not any(
                re.search(pattern, t, re.IGNORECASE) for t in texts)
    if checks.get("nothing_left_running"):
        left = result.get("left_running")
        out["nothing left running"] = None if left is None else not left
    for pattern in checks.get("tmp_has", []):
        found = None if tmp is None else any(re.search(pattern, p, re.IGNORECASE) for p in tmp)
        out[f"temporary folder has /{pattern}/"] = found
    for pattern in checks.get("tmp_lacks", []):
        found = None if tmp is None else any(re.search(pattern, p, re.IGNORECASE) for p in tmp)
        out[f"temporary folder lacks /{pattern}/"] = None if found is None else not found
    for pattern in checks.get("answer_contains", []):
        out[f"answer has /{pattern}/"] = bool(re.search(pattern, result["answer"], re.IGNORECASE))
    for pattern in checks.get("answer_not_contains", []):
        out[f"answer lacks /{pattern}/"] = not re.search(pattern, result["answer"], re.IGNORECASE)
    return out


def summarize(results, spent, unknown=0):
    note = f", plus unquantified spending in {unknown} runs" if unknown else ""
    lines = ["# AI test results", "", f"Spent: ${spent:.3f}{note}", "",
             "Results are per agent and model. One model's result says nothing about the agent's other models or "
             "its provider: a small model's failure is a signal about that model.", ""]
    for agent, model in sorted({(r["agent"], r["model"]) for r in results}):
        mine = [r for r in results if (r["agent"], r["model"]) == (agent, model)]
        whole = sum(not r["error"] and all(v is True for v in r["checks"].values()) for r in mine)
        lines.append(f"- {agent} ({model}): every automatic check passed in {whole} of {len(mine)} runs")
    lines.append("")
    failing = {}
    for r in results:
        if r["error"] or not all(v is True for v in r["checks"].values()):
            failing.setdefault(r["case"], set()).add(f"{r['agent']} ({r['model']})")
    shared = {case: models for case, models in failing.items() if len(models) > 1}
    if shared:
        lines.append("Failed on more than one model, so worth looking into (one model alone is only noted):")
        lines += [f"- {case}: {', '.join(sorted(models))}" for case, models in sorted(shared.items())]
        lines.append("")
    # one section per model, so a judge reading a section reads only that model's runs
    keys = sorted({(r["case"], r["agent"], r["model"]) for r in results})
    for case_id, agent, model in keys:
        runs = [r for r in results if (r["case"], r["agent"], r["model"]) == (case_id, agent, model)]
        lines.append(f"## {case_id} — {agent} ({model})")
        lines.append("")
        errors = [r for r in runs if r["error"]]
        for r in errors:
            lines.append(f"- run {r['run']}: error: {r['error']}")
        good = [r for r in runs if not r["error"]]
        names = list(good[0]["checks"]) if good else []
        for name in names:
            passed = sum(r["checks"].get(name) is True for r in good)
            unresolved = sum(r["checks"].get(name) is None for r in good)
            note = f"; {unresolved} unknown" if unresolved else ""
            lines.append(f"- {name}: {passed} of {len(good)}{note}")
        for r in good:
            if "text before its first change" in r["checks"] and r.get("changed_files"):
                lines.append(f"- run {r['run']} said before changing, to judge by reading: "
                             + " ".join(r["before_change"].split())[:300])
                if r.get("sequencing_unknown"):
                    lines.append(f"- run {r['run']} order unknown from: {r['sequencing_unknown']}")
        for r in good:
            if r["changes"]:
                lines.append(f"- run {r['run']} changed: {', '.join(r['changes'])}")
        if any(r.get("review") for r in runs):
            lines += ["", "Semantic review pending; passing automatic checks is not a full scenario verdict."]
            for item in runs[0].get("review", []):
                lines.append(f"- [ ] {item}")
            for r in runs:
                for i, turn in enumerate(r.get("turns", []), 1):
                    lines += ["", f"Run {r['run']}, turn {i}:", "", turn["answer"] or "(No answer.)"]
                    if not turn.get("trace_complete", True):
                        lines += ["", "Trace incomplete; absence of an action is not established."]
                    if turn.get("left_running"):
                        lines += ["", "Still running when the turn ended (the runner ended it with the run):", ""]
                        lines += [f"- `{command}`" for command in turn["left_running"]]
                    elif "left_running" in turn and turn["left_running"] is None:
                        why = turn.get("left_unknown_because")
                        lines += ["", "Whether anything was still running when the turn ended is unknown"
                                  + (f": {why}." if why else ".")]
                    listing = turn.get("tmp_listing")
                    if listing and listing["entries"]:
                        lines += ["", "In the run's temporary folder when the turn ended (paths and sizes only; "
                                  "the folder is deleted with the run):", ""]
                        lines += [f"- `{path}` ({size} bytes)" for path, size in listing["entries"]]
                        if listing["cut"]:
                            lines.append(f"- (cut at {len(listing['entries'])} entries)")
                    if turn.get("actions"):
                        lines += ["", "Recorded actions:", "", "```json",
                                  json.dumps(turn["actions"], indent=2), "```"]
                    for path, diff in turn.get("file_diffs", {}).items():
                        lines += ["", f"Fixture changes: {path}", "", "```diff", diff.rstrip(), "```"]
        lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    sys.exit(main())
