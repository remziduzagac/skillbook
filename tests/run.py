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
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
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


def main():
    args = parse_args()
    cases = load_cases(args.case)
    if not cases:
        sys.exit(f"no case matches {args.case!r} under {CASES.relative_to(REPO)}")

    agents = [a for a in args.agents.split(",") if a]
    plan = []
    for case in cases:
        for agent in agents:
            if agent not in case["agents"]:
                continue
            for n in range(1, (args.runs or case["runs"]) + 1):
                plan.append((case, agent, n))

    usable = {agent: login_problem(agent, args.login) for agent in agents}
    for agent, problem in usable.items():
        if problem:
            print(f"skipping {agent}: {problem}")
    plan = [p for p in plan if not usable[p[1]]]
    if not plan:
        sys.exit("nothing to run")

    turns = sum(len(case["turns"]) for case, _, _ in plan)
    estimate = turns * ESTIMATE_PER_TURN
    print(f"{len(plan)} runs, {turns} turns, models: " + ", ".join(model_for(a, args) for a in agents))
    print(f"estimated cost: up to about ${estimate:.2f}; budget cap: ${args.budget:.2f}")
    if args.login:
        print("login: your own, copied into each throwaway home and deleted with it")
    if args.dry_run:
        for case, agent, n in plan:
            print(f"  {case['id']}  {agent}  run {n}")
        return 0
    if not args.yes and input("run? [y/N] ").strip().lower() != "y":
        return 1

    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    out_dir = Path(args.out or Path(tempfile.gettempdir()) / "skillbook-test-results" / stamp)
    out_dir.mkdir(parents=True, exist_ok=True)

    spent = 0.0
    results = []
    for case, agent, n in plan:
        if spent >= args.budget:
            print(f"budget of ${args.budget:.2f} reached; {len(plan) - len(results)} runs not started")
            break
        result = run_one(case, agent, n, args, out_dir, args.budget - spent)
        spent += result["cost"] or 0.0
        results.append(result)
        failed = [name for name, ok in result["checks"].items() if not ok]
        status = "error" if result["error"] else ("ok" if not failed else "FAIL " + ", ".join(failed))
        print(f"  {case['id']}  {agent}  run {n}: {status}  (${result['cost'] or 0:.3f})")

    summary = summarize(results, spent)
    (out_dir / "summary.md").write_text(summary)
    (out_dir / "summary.json").write_text(json.dumps(results, indent=2) + "\n")
    print()
    print(summary)
    print(f"summary written to {out_dir}")
    complete = all(not r["error"] and all(r["checks"].values()) for r in results)
    return 0 if complete and len(results) == len(plan) else 1


def parse_args():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--case", default="", help="run only cases whose id contains this text")
    p.add_argument("--agents", default="claude,codex", help="comma-separated: claude, codex")
    p.add_argument("--runs", type=int, default=0, help="runs per case and agent (default: the case's, else 1)")
    p.add_argument("--model", action="append", default=[], help="agent=model, such as claude=sonnet")
    p.add_argument("--login", action="store_true", help="copy your own login into each throwaway home")
    p.add_argument("--instruction", default="", help="a line added to the user's instruction file, for a variant")
    p.add_argument("--budget", type=float, default=1.0, help="stop starting runs past this many US dollars")
    p.add_argument("--timeout", type=int, default=300, help="seconds per turn")
    p.add_argument("--keep", action="store_true", help="keep each run's event log in the results folder")
    p.add_argument("--out", help="results folder (default: a dated folder in the system's temporary folder)")
    p.add_argument("--dry-run", action="store_true", help="list the runs and the estimate, then stop")
    p.add_argument("--yes", action="store_true", help="run without asking")
    return p.parse_args()


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
        cases.append(data)
    return cases


def model_for(agent, args):
    for item in args.model:
        name, _, model = item.partition("=")
        if name == agent:
            return model
    return DEFAULT_MODELS[agent]


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


def run_one(case, agent, n, args, out_dir, budget_left):
    result = {"case": case["id"], "agent": agent, "run": n, "model": model_for(agent, args), "error": None,
              "cost": None, "checks": {}, "reads": [], "changes": [], "answer": ""}
    root = Path(tempfile.mkdtemp(prefix="skillbook-test-"))
    try:
        home, work = root / "home", root / "work"
        shutil.copytree(FIXTURES / case["fixture"], work)
        prepare_home(home, agent, case, args.login, args.instruction)
        before = snapshot(work)
        env = agent_env(home, agent, args.login)
        events = []
        session = None
        for i, turn in enumerate(case["turns"], 1):
            if agent == "claude":
                cmd = ["claude", "-p", turn["prompt"], "--model", result["model"], "--output-format", "stream-json",
                       "--verbose", "--permission-mode", "acceptEdits", "--max-budget-usd", f"{budget_left:.2f}"]
                if session:
                    cmd += ["--resume", session]
            else:
                cmd = ["codex", "exec"] + (["resume"] if session else []) + [
                    "--json", "--skip-git-repo-check", "-m", result["model"]]
                cmd += ["-s", "workspace-write"] if not session else []
                cmd += ([session] if session else []) + [turn["prompt"]]
            proc = subprocess.run(cmd, cwd=work, env=env, stdin=subprocess.DEVNULL, capture_output=True, text=True,
                                  timeout=args.timeout)
            turn_events = [json.loads(line) for line in proc.stdout.splitlines() if line.startswith("{")]
            if args.keep:
                (out_dir / f"{case['id'].replace('/', '--')}--{agent}--{n}--turn{i}.jsonl").write_text(proc.stdout)
            if proc.returncode != 0 and not turn_events:
                result["error"] = f"turn {i}: exit {proc.returncode}: {proc.stderr.strip()[-300:]}"
                return result
            events.append(turn_events)
            session = session or session_id(agent, turn_events)
        result["cost"] = cost(agent, result["model"], events)
        result["reads"] = sorted(skills_read(agent, events, home, case["set"]))
        result["changes"] = changes(before, snapshot(work))
        result["answer"] = last_answer(agent, events[-1])
        result["checks"] = check(case["checks"], result)
    except subprocess.TimeoutExpired:
        result["error"] = f"a turn took longer than {args.timeout} seconds"
    finally:
        shutil.rmtree(root, ignore_errors=True)
    return result


def prepare_home(home, agent, case, use_login, instruction=""):
    agent_dir = home / (".claude" if agent == "claude" else ".codex")
    agent_dir.mkdir(parents=True)
    subprocess.run([str(REPO / "install.sh"), "--agents", agent], env={**os.environ, "HOME": str(home)},
                   check=True, capture_output=True)
    if agent == "claude":
        # setup adds this read rule for a personal install, since the default mode asks before each reference file
        settings = {"permissions": {"allow": ["Read(~/.claude/skills/**)"]}}
        (agent_dir / "settings.json").write_text(json.dumps(settings, indent=2) + "\n")
    lines = ([POINTER] if case["pointer"] else []) + ([instruction] if instruction else [])
    if lines:
        (agent_dir / ("CLAUDE.md" if agent == "claude" else "AGENTS.md")).write_text("\n\n".join(lines) + "\n")
    if use_login:
        shutil.copy2(own_login(agent), agent_dir / own_login(agent).name)


def agent_env(home, agent, use_login):
    keep = ("PATH", "LANG", "LC_ALL", "TERM", "TMPDIR", "USER", "LOGNAME", "SHELL")
    env = {k: os.environ[k] for k in keep if k in os.environ}
    env["HOME"] = str(home)
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
        if path.is_file() and not AGENT_DIRS.intersection(rel.parts):
            files[str(rel)] = hashlib.sha256(path.read_bytes()).hexdigest()
    return files


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
    found = set()
    for e in (e for turn in events for e in turn):
        if agent == "claude" and e.get("type") == "assistant":
            for block in e["message"].get("content", []):
                if block.get("type") != "tool_use":
                    continue
                if block["name"] == "Skill":
                    found.add(block["input"].get("skill", "").split(":")[-1])
                elif block["name"] == "Bash":
                    found |= reads_in_command(block["input"].get("command", ""), set_name)
                else:
                    found |= reads_in_command(json.dumps(block["input"]), set_name, bare=False)
        if agent == "codex" and e.get("type") == "item.completed":
            item = e["item"]
            if item.get("type") == "command_execution":
                found |= reads_in_command(item.get("command", ""), set_name)
    found.discard(None)
    found.discard("")
    return found


FULL_PATH = re.compile(r"skills/([a-z][a-z0-9-]*)/(SKILL\.md|references/[a-z0-9/_-]+\.md)")
CD_INTO_SET = re.compile(r"\bcd\s+['\"]?[^\s'\";&|]*?skills/([a-z][a-z0-9-]*)((?:/[a-z0-9_-]+)*)/?['\"]?(?=[\s;&|]|$)")
MD_FILE = re.compile(r"(?<![\w/.-])((?:[a-z0-9_-]+/)*[a-z0-9_-]+\.md|SKILL\.md)")


def reads_in_command(command, set_name, bare=True):
    """The skills whose files a command names: by full path, or by a path relative to a set's folder."""
    command = expand_braces(command)
    found = {skill_name(s, rel) for s, rel in FULL_PATH.findall(command)}
    if not bare:
        return found
    rest = FULL_PATH.sub("", command)
    cd = CD_INTO_SET.search(rest)
    if cd:
        # after `cd .../skills/<set>/references`, a file is named relative to that folder
        set_name, base = cd.group(1), cd.group(2).strip("/")
        rest = rest[cd.end():]
    else:
        base = ""
    for token in MD_FILE.findall(rest):
        rel = f"{base}/{token}" if base and token != "SKILL.md" else token
        if cd or rel == "SKILL.md" or rel.startswith("references/"):
            found.add(skill_name(set_name, rel))
    return found


def expand_braces(text):
    """Expands shell braces one level, as in references/{act,respond}.md, so each file is seen by name."""
    brace = re.compile(r"([^\s'\"{}]*)\{([^{}\s]*,[^{}\s]*)\}([^\s'\"{}]*)")
    return brace.sub(lambda m: " ".join(m.group(1) + part + m.group(3) for part in m.group(2).split(",")), text)


def last_answer(agent, turn_events):
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
    for e in (e for turn in events for e in turn):
        if agent == "claude" and e.get("type") == "result":
            total += e.get("total_cost_usd") or 0.0
        if agent == "codex" and e.get("type") == "turn.completed":
            prices = CODEX_PRICES.get(model)
            if not prices:
                return None
            u = e.get("usage", {})
            cached = u.get("cached_input_tokens", 0)
            total += ((u.get("input_tokens", 0) - cached) * prices[0] + cached * prices[1]
                      + u.get("output_tokens", 0) * prices[2]) / 1_000_000
    return total


def check(checks, result):
    out = {}
    for name in checks.get("reads", []):
        out[f"reads {name}"] = name in result["reads"]
    if checks.get("no_changes"):
        out["no changes"] = not result["changes"]
    for path in checks.get("changed", []):
        out[f"changed {path}"] = any(c.split(" ", 1)[1] == path for c in result["changes"] if c.startswith("changed "))
    for pattern in checks.get("answer_contains", []):
        out[f"answer has /{pattern}/"] = bool(re.search(pattern, result["answer"], re.IGNORECASE))
    for pattern in checks.get("answer_not_contains", []):
        out[f"answer lacks /{pattern}/"] = not re.search(pattern, result["answer"], re.IGNORECASE)
    return out


def summarize(results, spent):
    lines = ["# AI test results", "", f"Spent: ${spent:.3f}", ""]
    keys = sorted({(r["case"], r["agent"]) for r in results})
    for case_id, agent in keys:
        runs = [r for r in results if r["case"] == case_id and r["agent"] == agent]
        lines.append(f"## {case_id} — {agent} ({runs[0]['model']})")
        lines.append("")
        errors = [r for r in runs if r["error"]]
        for r in errors:
            lines.append(f"- run {r['run']}: error: {r['error']}")
        good = [r for r in runs if not r["error"]]
        names = list(good[0]["checks"]) if good else []
        for name in names:
            passed = sum(1 for r in good if r["checks"].get(name))
            lines.append(f"- {name}: {passed} of {len(good)}")
        for r in good:
            if r["changes"]:
                lines.append(f"- run {r['run']} changed: {', '.join(r['changes'])}")
        lines.append("")
    return "\n".join(lines)


if __name__ == "__main__":
    sys.exit(main())
