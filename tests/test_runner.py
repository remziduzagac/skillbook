"""Check the test evidence without an account, network access or model calls."""

import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
import tomllib
from types import SimpleNamespace
import unittest
from unittest.mock import patch


SPEC = importlib.util.spec_from_file_location("skillbook_runner", Path(__file__).with_name("run.py"))
runner = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(runner)


def as_turn(responder):
    """A fake agent turn from a function that answers like subprocess.run, for tests that need no real process."""
    def turn(cmd, work, env, timeout, groups):
        try:
            done = responder(cmd, cwd=work, env=env, timeout=timeout)
        except subprocess.TimeoutExpired as exc:
            return {"stdout": exc.stdout or "", "stderr": "", "status": None, "left": [], "left_why": None, "tmp": None}
        return {"stdout": done.stdout, "stderr": done.stderr, "status": done.returncode, "left": [], "left_why": None,
                "tmp": None}
    return turn


def command_event(command, exit_code=0):
    return {"type": "item.completed", "item": {
        "type": "command_execution", "command": command, "exit_code": exit_code}}


class SkillResources(unittest.TestCase):
    def test_resources_are_not_callable_skills(self):
        for rel in ["references/coordinate/delegate/assets/prices.md",
                    "references/coordinate/delegate/scripts/help.md"]:
            with self.subTest(rel=rel):
                self.assertIsNone(runner.skill_name("essentials", rel))
        self.assertEqual(runner.skill_name("essentials", "references/coordinate/delegate/codex.md"),
                         "coordinate-delegate-codex")
        self.assertTrue(all("assets" not in path.parts and "scripts" not in path.parts
                            for _, path in runner.skill_files()))


class ReadEvidence(unittest.TestCase):
    def test_successful_direct_and_wrapped_reads(self):
        for command in ["cat /tmp/skills/essentials/references/act.md",
                        "/bin/zsh -lc 'cat /tmp/skills/essentials/references/act.md'",
                        "cd /tmp/skills/essentials && cat references/act.md"]:
            with self.subTest(command=command):
                self.assertEqual(runner.skills_read("codex", [[command_event(command)]], None, "essentials"), {"act"})

    def test_only_the_last_command_of_a_sequence_counts(self):
        act = "/tmp/skills/essentials/references/act.md"
        for command, found in [(f"cat /tmp/skills/essentials/SKILL.md; cat {act}", {"act"}),
                               (f"cat {act}; cat /missing/notes.md", set()),
                               ("cd /tmp/skills/essentials/references; cat act.md", set()),
                               (f"cat /tmp/x.md; cat {act} | head", set()),
                               (f"cat {act} && rg --files | head", {"act"}),
                               (f"cat {act} && pwd\ntrue", set()),
                               (f"cat {act} 2>/dev/null || true", set()),
                               (f"false || true && cat {act}", {"act"}),
                               (f"cat $(echo x) && cat {act}", set())]:
            with self.subTest(command=command):
                self.assertEqual(runner.skills_read("codex", [[command_event(command)]], None, "essentials"), found)

    def test_named_failed_skipped_and_masked_reads_do_not_count(self):
        for command, status in [
                ("echo /tmp/skills/essentials/references/act.md", 0),
                ("ls /tmp/skills/essentials/references/act.md", 0),
                ("cat /missing/skills/essentials/references/act.md", 1),
                ("false && cat /tmp/skills/essentials/references/act.md; true", 0),
                ("cat /missing/skills/essentials/references/act.md || true", 0),
                ("cat /missing/skills/essentials/references/act.md | cat", 0),
                ("cat /missing/skills/essentials/references/act.md & true", 0),
                ("awk 'BEGIN {print \"/tmp/skills/essentials/references/act.md\"}' /dev/null", 0),
                ("sed -n '/skills/essentials/references/act.md/p' /dev/null", 0),
                ("sed -n '' /tmp/skills/essentials/references/act.md", 0),
                ("cat --help /tmp/skills/essentials/references/act.md", 0)]:
            with self.subTest(command=command):
                self.assertFalse(runner.skills_read("codex", [[command_event(command, status)]], None, "essentials"))

    def test_a_whole_file_in_the_output_counts_whatever_the_command(self):
        clarify = (runner.REPO / "skills/essentials/references/understand/clarify.md").read_text()
        command = "cat /x/understand/clarify.md 2>/dev/null || cat /y/understand-clarify.md; git status --short"
        printed = {"type": "item.completed", "item": {"type": "command_execution", "command": command,
                                                       "exit_code": 0, "aggregated_output": clarify}}
        self.assertEqual(runner.skills_read("codex", [[printed]], None, "essentials"), {"understand-clarify"})
        head = {**printed, "item": {**printed["item"], "aggregated_output": "\n".join(clarify.splitlines()[:5])}}
        self.assertFalse(runner.skills_read("codex", [[head]], None, "essentials"))
        call = {"type": "assistant", "message": {"content": [{
            "type": "tool_use", "id": "bash-1", "name": "Bash", "input": {"command": command}}]}}
        result = {"type": "user", "message": {"content": [{
            "type": "tool_result", "tool_use_id": "bash-1", "is_error": False,
            "content": [{"type": "text", "text": clarify}]}]}}
        self.assertEqual(runner.skills_read("claude", [[call, result]], None, "essentials"), {"understand-clarify"})

    def test_claude_needs_a_matching_successful_result(self):
        call = {"type": "assistant", "message": {"content": [{
            "type": "tool_use", "id": "read-1", "name": "Read",
            "input": {"file_path": "/tmp/skills/essentials/references/act.md"}}]}}
        for result_id, error, expected in [("read-1", False, {"act"}), ("read-1", True, set()),
                                           ("another-call", False, set())]:
            result = {"type": "user", "message": {"content": [{
                "type": "tool_result", "tool_use_id": result_id, "is_error": error}]}}
            self.assertEqual(runner.skills_read("claude", [[call, result]], None, "essentials"), expected)
        self.assertFalse(runner.skills_read("claude", [[call]], None, "essentials"))


class ScenarioChecks(unittest.TestCase):
    def test_posthoc_prose_cannot_cover_unknown_or_unlogged_mutation(self):
        after = "I changed the requested file, preserving its requirements. " * 3
        codex_message = {"type": "item.completed", "item": {"type": "agent_message", "text": after}}
        traces = [
            ("codex", [{"type": "item.completed", "item": {"type": "mcp_tool_call",
              "tool": "update_file"}}, codex_message]),
            ("codex", [codex_message]),
            ("claude", [{"type": "assistant", "message": {"content": [
                {"type": "tool_use", "name": "WorkspaceUpdate", "id": "update-1", "input": {}},
                {"type": "text", "text": after}]}}])]
        for agent, events in traces:
            with self.subTest(agent=agent, events=events), tempfile.TemporaryDirectory() as root:
                work = Path(root)
                (work / "README.md").write_text("Changed")
                result = runner.observe(agent, [events], work, "essentials", {}, work, {})
                self.assertIsNone(runner.check({"states_before_change": True}, result)[
                    "text before its first change"])

    def test_run_wide_answer_checks_read_every_turn(self):
        first = {"type": "assistant", "message": {"content": [{"type": "text", "text": "Need act-stakes first."}]}}
        second = {"type": "assistant", "message": {"content": [{"type": "text", "text": "Level: high."}]}}
        checks = {"answer_not_contains": [r"\bact-stakes"], "answer_contains": ["high"]}
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            whole = runner.observe("claude", [[first], [second]], work, "essentials", {}, work, {})
            last = runner.observe("claude", [[second]], work, "essentials", {}, work, {})
        lacks = r"answer lacks /\bact-stakes/"
        self.assertEqual(runner.check(checks, whole), {lacks: False, "answer has /high/": True})
        self.assertEqual(runner.check(checks, last), {lacks: True, "answer has /high/": True})

    def test_missing_or_inconsistent_usage_stays_unknown(self):
        for usage in [None, {}, {"input_tokens": 100}, {"input_tokens": -1, "output_tokens": 0},
                      {"input_tokens": 1, "output_tokens": 0, "cached_input_tokens": 2},
                      {"input_tokens": 1.5, "output_tokens": 0}]:
            with self.subTest(usage=usage):
                event = {"type": "turn.completed", "usage": usage}
                self.assertIsNone(runner.cost("codex", "gpt-6-luna", [[event]]))
        for value in [None, -1, float("nan"), float("inf"), "0.1"]:
            with self.subTest(value=value):
                self.assertIsNone(runner.cost("claude", "haiku", [[{
                    "type": "result", "total_cost_usd": value}]]))

    def test_zero_and_cached_usage_have_valid_costs(self):
        event = {"type": "turn.completed", "usage": {"input_tokens": 0, "output_tokens": 0}}
        self.assertEqual(runner.cost("codex", "gpt-6-luna", [[event]]), 0)
        event["usage"] = {"input_tokens": 1_000_000, "cached_input_tokens": 500_000,
                          "output_tokens": 1_000_000}
        self.assertAlmostEqual(runner.cost("codex", "gpt-6-luna", [[event]]), 0.555)

    def test_link_to_separate_home_does_not_copy_credentials_into_evidence(self):
        with tempfile.TemporaryDirectory() as root:
            work = Path(root) / "work"
            work.mkdir()
            credential = Path(root) / "credential.json"
            credential.write_text("credential contents must stay outside evidence")
            (work / "linked.md").symlink_to(credential)
            evidence = runner.fixture_text(work)
            observed = runner.observe("codex", [[]], work, "essentials", {}, work,
                                      {"file_contains": {"linked.md": ["credential"]}})
            self.assertNotIn("credential contents", json.dumps(evidence))
            self.assertIsNone(observed["files"]["linked.md"])

    def test_unknown_sequencing_is_visible_in_summary(self):
        result = {"case": "unknown", "agent": "codex", "run": 1, "model": "fixture", "error": None,
                  "checks": {"text before its first change": None}, "changes": ["changed README.md"],
                  "changed_files": True, "before_change": ""}
        report = runner.summarize([result], 0)
        self.assertIn("0 of 1; 1 unknown", report)

    def test_each_model_gets_its_own_summary_section(self):
        results = [{"case": "essentials/a", "agent": "claude", "run": 1, "model": model, "error": None,
                    "checks": {}, "changes": [], "turns": [{"answer": f"answer from {model}"}], "review": ["x"]}
                   for model in ("haiku", "sonnet")]
        report = runner.summarize(results, 0)
        one, two = report.index("## essentials/a — claude (haiku)"), report.index("## essentials/a — claude (sonnet)")
        self.assertLess(one, report.index("answer from haiku"))
        self.assertLess(report.index("answer from haiku"), two)
        self.assertLess(two, report.index("answer from sonnet"))

    def test_opaque_edit_cannot_pass_sequencing_without_evidence(self):
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            target = work / "README.md"
            target.write_text("Before")
            before = runner.snapshot(work)
            target.write_text("After")
            event = command_event('python3 -c "write_a_file()"')
            result = runner.observe("codex", [[event]], work, "essentials", before, work, {})
            self.assertIsNone(runner.check({"states_before_change": True}, result)["text before its first change"])

    def test_readonly_command_with_quoted_writer_name_passes(self):
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            event = command_event('python3 -c "print(\'rm example\')"')
            result = runner.observe("codex", [[event]], work, "essentials", {}, work, {})
            self.assertTrue(runner.check({"states_before_change": True}, result)["text before its first change"])

    def test_statement_before_an_opaque_edit_is_sufficient(self):
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            (work / "README.md").write_text("After")
            statement = {"type": "item.completed", "item": {"type": "agent_message", "text":
                         "Going with a local, reversible default. I will update only the requested document, "
                         "preserving its existing requirements and checking the resulting content."}}
            result = runner.observe("codex", [[statement, command_event('python3 -c "write_a_file()"')]],
                                    work, "essentials", {}, work, {})
            self.assertTrue(runner.check({"states_before_change": True}, result)["text before its first change"])

    def test_plan_update_is_not_a_potential_mutation(self):
        statement = "Going with a five-minute lifetime, kept in memory only, so the command-line output stays the same."
        traces = [
            ("codex", [{"type": "item.completed", "item": {"type": "todo_list", "items": []}},
                       {"type": "item.completed", "item": {"type": "agent_message", "text": statement}},
                       {"type": "item.completed", "item": {"type": "file_change", "changes": []}}]),
            ("claude", [{"type": "assistant", "message": {"content": [
                {"type": "tool_use", "name": "TodoWrite", "id": "todo-1", "input": {}},
                {"type": "text", "text": statement},
                {"type": "tool_use", "name": "Edit", "id": "edit-1", "input": {}}]}}])]
        for agent, events in traces:
            with self.subTest(agent=agent):
                self.assertEqual(runner.text_before_change(agent, [events]), (statement, True, ""))

    def test_unknown_order_names_its_action(self):
        traces = [
            ("claude", [{"type": "assistant", "message": {"content": [
                {"type": "tool_use", "name": "Agent", "id": "agent-1", "input": {}}]}}], "tool Agent"),
            ("codex", [command_event('python3 -c "write_a_file()"')], 'command python3 -c "write_a_file()"')]
        for agent, events, action in traces:
            with self.subTest(agent=agent):
                self.assertEqual(runner.text_before_change(agent, [events]), ("", False, action))

    def test_content_loss_and_incorrect_routes_fail(self):
        checks = {"reads": ["act-rightsize-lean"], "reads_not": ["understand-clarify-deep"],
                  "shorter": ["NOTES.md"], "file_contains": {"NOTES.md": ["weather", "city"]}}
        good = {"reads": ["act-rightsize-lean"], "changes": [], "answer": "",
                "files": {"NOTES.md": "Weather for a city."}}
        self.assertTrue(all(runner.check(checks, good, "tiny-weather").values()))
        for files, reads in [({"NOTES.md": "Weather."}, ["act-rightsize-lean"]),
                             ({"NOTES.md": "Weather for a city."}, []),
                             ({"NOTES.md": "Weather for a city."},
                              ["act-rightsize-lean", "understand-clarify-deep"])]:
            with self.subTest(files=files, reads=reads):
                self.assertFalse(all(runner.check(checks, {**good, "files": files, "reads": reads},
                                                  "tiny-weather").values()))

    def test_per_turn_observation_includes_reads_and_file_contents(self):
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            (work / "NOTES.md").write_text("Weather for a city.")
            events = [[command_event("cat /tmp/skills/essentials/references/act.md")]]
            observed = runner.observe("codex", events, work, "essentials", {}, work,
                                      {"file_contains": {"NOTES.md": ["city"]}})
            self.assertEqual(observed["files"]["NOTES.md"], "Weather for a city.")
            self.assertEqual(observed["reads"], ["act"])
            self.assertEqual(observed["changes"], ["added NOTES.md"])

    def test_unrelated_preamble_is_not_a_semantic_verdict(self):
        case = {"case": "example", "agent": "codex", "run": 1, "model": "example", "error": None,
                "checks": {"no changes": True}, "review": ["The proposal identifies the actual choices."],
                "changes": [], "turns": [{"answer": "I cannot do this.", "changes": [], "reads": []}]}
        report = runner.summarize([case], 0, 1)
        self.assertIn("Semantic review pending", report)
        self.assertIn("I cannot do this.", report)
        self.assertIn("The proposal identifies", report)


class TurnLifecycle(unittest.TestCase):
    def run_fake(self, responder, turns, agent="codex", budget=1):
        args = SimpleNamespace(model=[], login=False, instruction="", keep=False, timeout=1)
        case = {"id": "test", "set": "essentials", "fixture": "tiny-weather", "pointer": True,
                "turns": turns, "checks": {"no_changes": True}, "review": ["Approval is respected."]}
        with tempfile.TemporaryDirectory() as output, patch.object(runner, "prepare_home"), \
                patch.object(runner, "agent_env", return_value={}), \
                patch.object(runner, "run_turn", side_effect=as_turn(responder)):
            return runner.run_one(case, agent, runner.DEFAULT_MODELS[agent], 1, args, Path(output), budget)

    def test_changed_counts_a_created_file_but_not_a_removed_one(self):
        result = {"reads": [], "answer": "", "changes": ["added notes/new.md", "removed old.md"]}
        out = runner.check({"changed": ["notes/new.md", "old.md"]}, result)
        self.assertEqual(out, {"changed notes/new.md": True, "changed old.md": False})

    def test_files_written_under_a_folder_are_counted_and_searched(self):
        checks = {"written_under": {"tests/cases/": 2}, "folder_lacks": {"tests/cases/": ["quarterly"]}}
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            (work / "tests" / "cases").mkdir(parents=True)
            (work / "tests" / "cases" / "a.toml").write_text("prompt = 'a recipe'")
            (work / "tests" / "cases" / "b.toml").write_text("prompt = 'the quarterly report'")
            (work / "other.md").write_text("quarterly")
            observed = runner.observe("codex", [[]], work, "essentials", {}, work, checks)
            self.assertEqual(sorted(observed["files"]), ["tests/cases/a.toml", "tests/cases/b.toml"])
            self.assertEqual(runner.check(checks, observed), {
                "at least 2 files written under tests/cases/": True,
                "files written under tests/cases/ lack /quarterly/": False})
            (work / "tests" / "cases" / "b.toml").unlink()
            observed = runner.observe("codex", [[]], work, "essentials", {}, work, checks)
            self.assertEqual(runner.check(checks, observed), {
                "at least 2 files written under tests/cases/": False,
                "files written under tests/cases/ lack /quarterly/": True})

    def test_every_run_in_the_results_folders_is_listed_for_judging(self):
        with tempfile.TemporaryDirectory() as root:
            folder = Path(root) / "case-a"
            folder.mkdir()
            runs = [{"case": "essentials/a", "agent": agent, "model": model, "run": 1}
                    for agent, model in [("claude", "haiku"), ("codex", "gpt-6-luna")]]
            (folder / "summary.json").write_text(json.dumps(runs))
            listed = runner.runs_to_judge([Path(root)]).splitlines()
            self.assertEqual(listed, [f"essentials/a\tclaude\thaiku\t1\t{folder / 'summary.md'}",
                                      f"essentials/a\tcodex\tgpt-6-luna\t1\t{folder / 'summary.md'}"])

    def test_claude_event_with_text_message_is_skipped(self):
        events = [{"type": "user", "message": "plain text"},
                  {"type": "assistant", "message": {"content": [
                      {"type": "tool_use", "name": "Read", "id": "t1", "input": {"file_path": "fees.md"}}]}}]
        actions = runner.action_evidence("claude", events)
        self.assertEqual([(a["tool"], a["file_path"]) for a in actions], [("Read", "fees.md")])

    def run_main(self, fake_run, runs=0, budget=1.0, jobs=4):
        args = SimpleNamespace(case="history-out-of-email", agents="claude,codex", runs=runs, model=[], login=False,
                               instruction="", budget=budget, timeout=1, keep=False, dry_run=False, coverage=False,
                               summary=False, yes=True, jobs=jobs, to_judge=None)
        with tempfile.TemporaryDirectory() as output, \
                patch.object(runner, "run_one", side_effect=fake_run), \
                patch.object(runner, "login_problem", return_value=None), \
                patch.object(runner, "parse_args", return_value=args), \
                contextlib.redirect_stdout(io.StringIO()) as printed:
            args.out = output
            runner.main()
            return json.loads((Path(output) / "summary.json").read_text()), printed.getvalue()

    @staticmethod
    def fake_result(case, agent, n, cost=0.01):
        return {"case": case["id"], "agent": agent, "run": n, "model": "m", "error": None, "cost": cost,
                "cost_unknown": False, "checks": {}, "reads": [], "changes": [], "answer": "", "review": [],
                "turns": []}

    def test_a_repeated_model_runs_an_agent_on_each_and_an_unknown_agent_stops_the_runner(self):
        args = SimpleNamespace(model=["claude=haiku", "claude=sonnet"])
        self.assertEqual(runner.models_for("claude", args), ["haiku", "sonnet"])
        self.assertEqual(runner.models_for("codex", args), [runner.DEFAULT_MODELS["codex"]])
        with self.assertRaises(SystemExit):
            runner.models_for("claude", SimpleNamespace(model=["sonnet"]))

    def test_runner_error_ends_one_run_and_marks_its_cost_unknown(self):
        results, _ = self.run_main(RuntimeError("boom"))
        self.assertEqual(len(results), 2)
        self.assertTrue(all(r["cost_unknown"] and "boom" in r["error"] for r in results))

    def test_jobs_run_at_the_same_time_and_keep_the_plan_order(self):
        lock, running, most = threading.Lock(), [0], [0]

        def fake(case, agent, model, n, args, out_dir, left):
            with lock:
                running[0] += 1
                most[0] = max(most[0], running[0])
            time.sleep(0.05)
            with lock:
                running[0] -= 1
            return self.fake_result(case, agent, n)

        results, _ = self.run_main(fake, runs=3, jobs=3)
        self.assertEqual(most[0], 3)
        self.assertEqual([(r["agent"], r["run"]) for r in results],
                         [("claude", 1), ("claude", 2), ("claude", 3), ("codex", 1), ("codex", 2), ("codex", 3)])

    def test_budget_stops_new_runs_across_jobs(self):
        results, printed = self.run_main(lambda case, agent, n, *rest: self.fake_result(case, agent, n, 0.6),
                                         runs=3, budget=1.0, jobs=1)
        self.assertEqual(len(results), 2)
        self.assertIn("4 runs not started", printed)

    def test_fixture_diffs_and_action_evidence_survive_cleanup(self):
        roots = []

        def respond(cmd, **kwargs):
            work = Path(kwargs["cwd"])
            roots.append(work)
            (work / "NOTES.md").write_text("Changed fixture text.\n")
            event = command_event('python3 -c "write_a_file()"')
            event["item"]["aggregated_output"] = "private tool output must not be retained"
            return subprocess.CompletedProcess(cmd, 0, json.dumps(event), "")

        result = self.run_fake(respond, [{"prompt": "Edit it."}])
        turn = result["turns"][0]
        self.assertIn("+Changed fixture text.", turn["file_diffs"]["NOTES.md"])
        self.assertEqual(turn["actions"][0]["command"], 'python3 -c "write_a_file()"')
        self.assertNotIn("private tool output", json.dumps(result))
        self.assertFalse(roots[0].exists())

    def test_timeout_keeps_completed_spending_and_marks_unknown_remainder(self):
        calls = []

        def respond(cmd, **kwargs):
            if calls:
                raise subprocess.TimeoutExpired(cmd, 1)
            calls.append(cmd)
            event = {"type": "turn.completed", "usage": {"input_tokens": 1_000_000, "output_tokens": 0}}
            return subprocess.CompletedProcess(cmd, 0, json.dumps(event), "")

        result = self.run_fake(respond, [{"prompt": "First."}, {"prompt": "Second."}])
        self.assertAlmostEqual(result["cost"], 0.10)
        self.assertTrue(result["cost_unknown"])
        self.assertFalse(result["turns"][-1]["trace_complete"])
        report = runner.summarize([result], result["cost"], 1)
        self.assertIn("$0.100, plus unquantified spending in 1 runs", report)
        self.assertIn("Trace incomplete", report)

    def test_claude_turn_caps_use_remaining_budget(self):
        caps = []

        def respond(cmd, **kwargs):
            caps.append(float(cmd[cmd.index("--max-budget-usd") + 1]))
            event = {"type": "result", "total_cost_usd": 0.60 if len(caps) == 1 else 0.10,
                     "session_id": "fixture-session"}
            return subprocess.CompletedProcess(cmd, 0, json.dumps(event), "")

        result = self.run_fake(respond, [{"prompt": "First."}, {"prompt": "Second."}], agent="claude")
        self.assertEqual(caps, [1.0, 0.4])
        self.assertAlmostEqual(result["cost"], 0.70)

    def test_claude_loads_no_mcp_server_but_those_the_runner_names(self):
        cmds = []

        def respond(cmd, **kwargs):
            cmds.append(cmd)
            return subprocess.CompletedProcess(cmd, 0, json.dumps({"type": "result", "total_cost_usd": 0.01}), "")

        self.run_fake(respond, [{"prompt": "First."}], agent="claude")
        self.assertIn("--strict-mcp-config", cmds[0])
        self.assertNotIn("--mcp-config", cmds[0])

    def test_claude_does_not_start_another_turn_after_exhausting_budget(self):
        calls = []

        def respond(cmd, **kwargs):
            calls.append(cmd)
            return subprocess.CompletedProcess(cmd, 0, json.dumps({"type": "result", "total_cost_usd": 1}), "")

        result = self.run_fake(respond, [{"prompt": "First."}, {"prompt": "Second."}], agent="claude")
        self.assertEqual(len(calls), 1)
        self.assertIn("budget", result["error"])

    def test_unauthorised_change_cannot_hide_behind_later_restore(self):
        calls = []

        def respond(cmd, **kwargs):
            work = Path(kwargs["cwd"])
            target = work / "NOTES.md"
            if not calls:
                calls.append(target.read_text())
                target.write_text("Changed before approval.")
            else:
                target.write_text(calls[0])
            events = [{"type": "thread.started", "thread_id": "fixture-thread"},
                      {"type": "item.completed", "item": {"type": "agent_message", "text": "Done."}}]
            return subprocess.CompletedProcess(cmd, 0, "\n".join(map(json.dumps, events)), "")

        result = self.run_fake(respond, [{"prompt": "Propose only.", "checks": {"no_changes": True}},
                                         {"prompt": "Undo it.", "checks": {"changed": ["NOTES.md"]}}])
        self.assertFalse(result["checks"]["turn 1: no changes"])
        self.assertTrue(result["checks"]["no changes"])
        self.assertEqual(len(result["turns"]), 2)

    def test_process_failure_with_json_is_still_an_error(self):
        def respond(cmd, **kwargs):
            event = {"type": "item.completed", "item": {"type": "agent_message", "text": "Looks fine."}}
            return subprocess.CompletedProcess(cmd, 1, json.dumps(event), "run failed")

        result = self.run_fake(respond, [{"prompt": "Check it."}])
        self.assertIn("exit 1", result["error"])


# A fake agent: it starts a sleeper, writes the sleeper's ID where the test can read it, then exits or waits.
FAKE_AGENT = """
import os, subprocess, sys, time
detached = sys.argv[2] == "detached"
sleeper = subprocess.Popen(["sleep", "60"], start_new_session=detached)
open(sys.argv[1], "w").write(str(sleeper.pid))
open(os.path.join(os.environ["TMPDIR"], "kept.txt"), "w").write("a note the agent kept")
if sys.argv[3] == "wait":
    time.sleep(60)
"""


class ClaudeSandbox(unittest.TestCase):
    def test_claude_runs_commands_only_inside_a_required_sandbox(self):
        with tempfile.TemporaryDirectory() as home, patch.object(runner.subprocess, "run"):
            runner.prepare_home(Path(home), "claude", {"pointer": False}, use_login=False)
            settings = json.loads((Path(home) / ".claude" / "settings.json").read_text())
        self.assertIn("Bash", settings["permissions"]["allow"])
        self.assertEqual(settings["sandbox"], {"enabled": True, "failIfUnavailable": True,
                                               "autoAllowBashIfSandboxed": True, "allowUnsandboxedCommands": False})

    def test_a_copied_login_reaches_no_connector_or_account_tool(self):
        with tempfile.TemporaryDirectory() as claude_home, tempfile.TemporaryDirectory() as codex_home, \
                patch.object(runner.subprocess, "run"):
            runner.prepare_home(Path(claude_home), "claude", {"pointer": False}, use_login=False)
            runner.prepare_home(Path(codex_home), "codex", {"pointer": False}, use_login=False)
            settings = json.loads((Path(claude_home) / ".claude" / "settings.json").read_text())
            codex = tomllib.loads((Path(codex_home) / ".codex" / "config.toml").read_text())
        self.assertIs(settings["disableClaudeAiConnectors"], True)
        self.assertIs(settings["syncClaudeAiSkills"], False)
        self.assertIs(settings["syncClaudeAiPlugins"], False)
        for tool in ("RemoteTrigger", "PushNotification", "DesignSync"):
            self.assertIn(tool, settings["permissions"]["deny"])
        self.assertEqual(codex["features"], {"apps": False, "plugins": False, "remote_plugin": False})


class LeftRunning(unittest.TestCase):
    """What an agent leaves running is recorded before the runner ends it, and nothing outlives the run."""

    def fake_agent(self, mode, wait="exit"):
        folder = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, folder, ignore_errors=True)
        pid_file = Path(folder) / "sleeper.pid"
        return [sys.executable, "-c", FAKE_AGENT, str(pid_file), mode, wait], pid_file

    def run_case(self, mode, wait="exit", checks=None):
        cmd, pid_file = self.fake_agent(mode, wait)
        real_turn = runner.run_turn
        seen = {}

        def turn(_cmd, work, env, timeout, groups):
            seen["env"], seen["tmp_exists"] = env, Path(env["TMPDIR"]).is_dir()
            return real_turn(cmd, work, env, timeout, groups)

        args = SimpleNamespace(model=[], login=False, instruction="", keep=False, timeout=2)
        case = {"id": "test", "set": "essentials", "fixture": "tiny-weather", "pointer": True,
                "turns": [{"prompt": "Start it."}], "checks": checks or {}, "review": []}
        with tempfile.TemporaryDirectory() as output, patch.object(runner, "prepare_home"), \
                patch.object(runner, "run_turn", side_effect=turn):
            result = runner.run_one(case, "codex", runner.DEFAULT_MODELS["codex"], 1, args, Path(output), 1)
        return result, int(pid_file.read_text()), seen

    def test_a_process_left_in_the_group_is_recorded_then_ended(self):
        result, pid, _ = self.run_case("grouped", checks={"nothing_left_running": True})
        self.assertTrue(any("sleep 60" in c for c in result["turns"][0]["left_running"]))
        self.assertFalse(result["checks"]["nothing left running"])
        self.assertFalse(runner.alive(pid))

    @unittest.skipUnless(Path("/proc/self/environ").exists(), "needs a system that shows a process's environment")
    def test_a_process_that_leaves_the_group_is_still_found_by_the_marker(self):
        result, pid, _ = self.run_case("detached")
        self.assertTrue(any("sleep 60" in c for c in result["turns"][0]["left_running"]))
        self.assertFalse(runner.alive(pid))

    def test_a_timeout_ends_the_agent_and_what_it_started(self):
        result, pid, _ = self.run_case("grouped", wait="wait")
        self.assertIn("took longer", result["error"])
        self.assertTrue(any("sleep 60" in c for c in result["turns"][0]["left_running"]))
        self.assertFalse(runner.alive(pid))

    def test_each_run_has_its_own_temporary_folder_inside_its_throwaway_folder(self):
        with patch.dict(os.environ, {"TMPDIR": "/the/users/own/tmp"}):
            result, _, seen = self.run_case("grouped")
        tmp = Path(seen["env"]["TMPDIR"])
        self.assertTrue(seen["tmp_exists"])
        self.assertEqual(tmp.name, "tmp")
        self.assertTrue(tmp.parent.name.startswith("skillbook-test-"))
        self.assertEqual(seen["env"][runner.MARKER], str(tmp))
        self.assertFalse(tmp.exists())
        self.assertEqual(runner.agent_env(Path("/h"), "codex", False, Path("/r/tmp"))["TMPDIR"], "/r/tmp")

    def test_nothing_left_running_passes_fails_or_stays_unknown(self):
        self.assertEqual(runner.check({"nothing_left_running": True}, {"left_running": [], "answer": ""}),
                         {"nothing left running": True})
        self.assertEqual(runner.check({"nothing_left_running": True}, {"left_running": ["sleep 60"], "answer": ""}),
                         {"nothing left running": False})
        self.assertEqual(runner.check({"nothing_left_running": True}, {"left_running": None, "answer": ""}),
                         {"nothing left running": None})

    def test_what_the_temporary_folder_holds_is_recorded_without_contents(self):
        result, _, _ = self.run_case("grouped")
        listing = result["turns"][0]["tmp_listing"]
        self.assertEqual(listing, {"entries": [["kept.txt", len("a note the agent kept")]], "cut": False})
        self.assertNotIn("a note the agent kept", json.dumps(result["turns"]))

    def test_the_temporary_folder_checks_see_every_path_not_the_cut_listing(self):
        result, _, _ = self.run_case("grouped", checks={"tmp_has": ["kept"], "tmp_lacks": ["kept", "old-recipes"]})
        self.assertEqual(result["checks"], {"temporary folder has /kept/": True,
                                            "temporary folder lacks /kept/": False,
                                            "temporary folder lacks /old-recipes/": True})
        self.assertNotIn("tmp_paths", json.dumps(result))
        with tempfile.TemporaryDirectory() as tmp:
            for i in range(60):
                (Path(tmp) / f"cache-{i:02}").write_text("x")
            (Path(tmp) / "zz" / "old-recipes").mkdir(parents=True)
            self.assertTrue(runner.tmp_listing(tmp)["cut"])
            paths = runner.tmp_paths(tmp)
        self.assertIn("zz/old-recipes/", paths)
        self.assertEqual(runner.check({"tmp_lacks": ["old-recipes"]}, {"answer": ""}, tmp=paths),
                         {"temporary folder lacks /old-recipes/": False})
        self.assertEqual(runner.check({"tmp_lacks": ["x"], "tmp_has": ["x"]}, {"answer": ""}),
                         {"temporary folder lacks /x/": None, "temporary folder has /x/": None})

    def test_the_listing_is_cut_at_a_cap_and_says_so(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "sub").mkdir()
            for i in range(5):
                (Path(tmp) / "sub" / f"f{i}.txt").write_text("x" * i)
            whole = runner.tmp_listing(tmp)
            cut = runner.tmp_listing(tmp, cap=3)
        self.assertEqual([path for path, _ in whole["entries"]], ["sub/"] + [f"sub/f{i}.txt" for i in range(5)])
        self.assertEqual(whole["entries"][3], ["sub/f2.txt", 2])
        self.assertFalse(whole["cut"])
        self.assertEqual((len(cut["entries"]), cut["cut"]), (3, True))
        self.assertIsNone(runner.tmp_listing(None))

    def test_a_system_that_hides_environments_reports_unknown_not_a_pass(self):
        with patch.object(runner, "sees_environments", return_value=False):
            left, why = runner.left_report({})
            self.assertIsNone(left)
            self.assertIn("environment", why)
            self.assertEqual(runner.left_report({7: "sleep 60"}), (["sleep 60"], None))
        with patch.object(runner, "sees_environments", return_value=True):
            self.assertEqual(runner.left_report({}), ([], None))
        self.assertEqual(runner.left_report(None)[0], None)

    @unittest.skipUnless(Path("/proc/self/environ").exists(), "needs a system that shows a process's environment")
    def test_a_child_started_while_the_group_is_ending_is_ended_too(self):
        folder = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, folder, ignore_errors=True)
        pid_file, ready = Path(folder) / "child.pid", Path(folder) / "ready"
        script = ("import signal, subprocess, sys, time\n"
                  "def term(*_):\n"
                  "    child = subprocess.Popen(['sleep', '60'])\n"
                  "    open(sys.argv[1], 'w').write(str(child.pid))\n"
                  "    sys.exit(0)\n"
                  "signal.signal(signal.SIGTERM, term)\n"
                  "open(sys.argv[2], 'w').write('up')\n"
                  "time.sleep(60)\n")
        marker = str(Path(folder) / "tmp")
        proc = subprocess.Popen([sys.executable, "-c", script, str(pid_file), str(ready)], start_new_session=True,
                                env={**os.environ, runner.MARKER: marker})
        self.addCleanup(proc.wait)
        while not ready.exists():
            time.sleep(0.05)
        runner.end_run([proc.pid], marker)
        proc.wait()
        self.assertFalse(runner.alive(int(pid_file.read_text())))

    def test_a_process_given_the_id_since_it_was_found_is_not_signalled(self):
        found = {123: (5, "100", "sleep 60")}
        with patch.object(runner.os, "kill") as kill, patch.object(runner.os, "killpg") as killpg:
            with patch.object(runner, "start_time", return_value="200"):
                runner.signal_owned(found, [], signal.SIGKILL, set())
            kill.assert_not_called()
            with patch.object(runner, "start_time", return_value="100"):
                runner.signal_owned(found, [], signal.SIGKILL, set())
            kill.assert_called_once_with(123, signal.SIGKILL)
            killpg.assert_not_called()

    def test_a_group_is_ended_with_a_group_signal(self):
        with patch.object(runner.os, "kill") as kill, patch.object(runner.os, "killpg") as killpg:
            runner.signal_owned({10: (9, "1", "a"), 11: (9, "2", "b")}, [9], signal.SIGTERM, set())
        killpg.assert_called_once_with(9, signal.SIGTERM)
        kill.assert_not_called()

    def test_the_fixture_server_stops_itself_within_about_two_minutes(self):
        text = (runner.FIXTURES / "recipe-box" / "serve.py").read_text()
        limit = int(re.search(r"^LIMIT_SECONDS = (\d+)", text, re.M).group(1))
        self.assertLessEqual(limit, 150)


class CaseInventory(unittest.TestCase):
    def test_trim_proposal_accepts_a_table_or_prose(self):
        case = next(c for c in runner.load_cases("trim-lists-first") if c["id"].endswith("trim-lists-first"))
        for answer in ["For NOTES.md I propose removing repeated descriptions "
                       "while preserving the service and city facts.",
                       "NOTES.md\n\n| Change | Reason |\n| --- | --- |\n| Merge repeated cache ideas | Same idea |"]:
            evidence = {"reads": [], "changes": [], "answer": answer}
            self.assertTrue(all(runner.check(case["turns"][0]["checks"], evidence).values()))

    def test_every_case_has_traceable_coverage_and_a_review_rubric(self):
        cases = runner.load_cases("")
        self.assertTrue(cases)
        for case in cases:
            with self.subTest(case=case["id"]):
                for field in ("skills", "category", "rejects", "source") + (() if case.get("routing_only") else ("review",)):
                    self.assertTrue(case.get(field), field)
                source = runner.REPO / case["source"].split(":", 1)[0]
                self.assertTrue(source.is_file(), str(source))
                self.assertTrue(case["checks"] or any(t.get("checks") for t in case["turns"]))

    def test_routing_inventory_contains_only_read_checks_and_no_review(self):
        cases = runner.load_cases("route-")
        self.assertTrue(cases)
        for case in cases:
            self.assertTrue(case.get("routing_only"), case["id"])
            self.assertEqual(len(case["turns"]), 1)
            self.assertFalse(case.get("review"))
            self.assertTrue(set(case["checks"]) <= {"reads", "reads_not"})
            self.assertTrue(case["checks"])

    def test_routing_cases_reject_semantic_assertions_and_reviews(self):
        for extra in [{"checks": {"answer_contains": ["yes"]}}, {"review": ["good answer"]}]:
            case = {"id": "routing", "routing_only": True, "turns": [{"prompt": "Read a fact"}],
                    "checks": {"reads": ["understand"]}, **extra}
            with self.subTest(extra=extra), self.assertRaisesRegex(ValueError, "routing-only"):
                runner.validate_case(case)

    def test_routing_results_are_excluded_from_semantic_judging(self):
        with tempfile.TemporaryDirectory() as tmp:
            record = {"case": "essentials/routing", "agent": "codex", "model": "gpt-6-luna", "run": 1}
            Path(tmp, "summary.json").write_text(json.dumps([{**record, "routing_only": True}, record]))
            self.assertEqual(len(runner.runs_to_judge([Path(tmp)]).splitlines()), 1)

    def test_typo_in_an_assertion_cannot_silently_pass(self):
        case = {"id": "bad", "turns": [{"prompt": "Hello"}], "checks": {"unchagned": ["NOTES.md"]}}
        with self.assertRaisesRegex(ValueError, "unknown checks"):
            runner.validate_case(case)

    def test_inspection_commands_need_neither_credentials_nor_agent_binaries(self):
        for flag in ("--coverage", "--dry-run"):
            with self.subTest(flag=flag), patch("sys.argv", ["run.py", flag]), \
                    patch.object(runner, "login_problem", side_effect=AssertionError("must not inspect login")), \
                    contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(runner.main(), 0)


class ReviewFollowUpTests(unittest.TestCase):
    def test_read_only_pipelines_and_searches(self):
        for command in ("rg foo api.py", "grep -n parse utils.py", "find . -name '*.py'", "wc -l NOTES.md",
                        "git status", "nl -ba api.py | sed -n 1,40p", "/usr/bin/zsh -lc 'rg --files'",
                        "rg foo || true",
                        "find . -type f -not -path '*/.git/*' | head -100 && echo --- && grep -rIl -iE 'api|route' .",
                        "cat a.md 2>/dev/null || cat b.md; git status --short", "rg foo 2>&1 | head",
                        'for f in ISSUE.md api.py; do echo "=== $f"; cat "$f"; done',
                        "S=/tmp/skills; cat $S/act.md; cd /tmp/work && grep -rn tiny . ; find . -iname '*x*'"):
            self.assertEqual(runner.command_effect(command), "read", command)

    def test_a_set_variable_does_not_hide_what_follows(self):
        self.assertEqual(runner.command_effect("D=/tmp/x; rm -r $D"), "write")
        self.assertEqual(runner.command_effect("PYTHONPATH=. python3 build.py"), "unknown")
        self.assertEqual(runner.command_effect("D=$(mktemp -d); ls $D"), "unknown")
        statement = {"type": "assistant", "message": {"content": [
            {"type": "tool_use", "name": "Bash", "input": {"command": "S=/tmp/s; cat $S/act.md; cd /tmp/w"}},
            {"type": "tool_use", "name": "Bash", "input": {"command": "sed -i 's/a/b/' README.md"}}]}}
        self.assertEqual(runner.text_before_change("claude", [[statement]]), ("", True, ""))

    def test_writing_or_opaque_forms_are_not_read(self):
        self.assertEqual(runner.command_effect("find . -name '*.pyc' -delete"), "unknown")
        self.assertEqual(runner.command_effect("cat api.py > copy.py"), "unknown")
        self.assertEqual(runner.command_effect("cat api.py | sed -n 'w out.txt'"), "unknown")
        self.assertEqual(runner.command_effect("rm old/notes.txt"), "write")
        self.assertEqual(runner.command_effect("cat a.md && rm old/notes.txt"), "write")
        for command in ("rg foo & rm x", "(cd old && ls)", "cat <<EOF\nx\nEOF", "ls; python3 build.py",
                        "echo x >> notes.md", "grep 'unclosed", 'for f in $(ls); do cat "$f"; done'):
            self.assertEqual(runner.command_effect(command), "unknown", command)

    def test_credential_like_content_is_withheld(self):
        with tempfile.TemporaryDirectory() as tmp:
            work = Path(tmp)
            (work / "copied.json").write_text('{"refresh_token": "abc"}')
            (work / "notes.md").write_text("plain notes")
            text = runner.fixture_text(work)
            self.assertIn("withheld", text["copied.json"])
            self.assertEqual(text["notes.md"], "plain notes")

    def test_errors_are_redacted(self):
        line = runner.redact("login failed for someone@example.com with token " + "a" * 40)
        self.assertNotIn("@example.com", line)
        self.assertNotIn("a" * 40, line)


def claude_text(text, parent=None):
    return {"type": "assistant", "parent_tool_use_id": parent, "message": {"content": [{"type": "text", "text": text}]}}


def claude_tool(name, tool_id, error=False, command="ls"):
    return [{"type": "assistant", "message": {"content": [
                {"type": "tool_use", "id": tool_id, "name": name, "input": {"command": command}}]}},
            {"type": "user", "message": {"content": [
                {"type": "tool_result", "tool_use_id": tool_id, "is_error": error}]}}]


def codex_message(text):
    return {"type": "item.completed", "item": {"type": "agent_message", "text": text}}


def case_checks(name):
    return next(c for c in runner.load_cases(name) if c["id"] == f"essentials/{name}")["checks"]


class TextBetweenToolCalls(unittest.TestCase):
    def test_the_summary_shows_the_final_answer_apart_from_progress_lines(self):
        claude = [claude_text("Reading the recipes now."), *claude_tool("Bash", "b1"),
                  claude_text("Need act-verify."), claude_text("A second line.", parent="b1"),
                  *claude_tool("Read", "r1"),
                  claude_text("Five recipes."), claude_text("Which one first?")]
        codex = [codex_message("Reading the recipes now."), command_event("ls"), codex_message("Need act-verify."),
                 {"type": "item.completed", "item": {"type": "reasoning", "text": "thinking"}},
                 command_event("cat a.md"), codex_message("Five recipes."), codex_message("Which one first?")]
        for agent, events in [("claude", claude), ("codex", codex)]:
            with self.subTest(agent=agent):
                final, between = runner.turn_parts(agent, events)
                self.assertEqual(final, "Five recipes.\n\nWhich one first?")
                self.assertEqual(between, ["Reading the recipes now.", "Need act-verify."])
                # the checks still read every line the user sees, but not a started agent's own text
                answer = runner.turn_answer(agent, events)
                self.assertIn("Need act-verify.", answer)
                self.assertNotIn("A second line.", answer)
                result = {"case": "essentials/x", "agent": agent, "run": 1, "model": "m", "error": None,
                          "checks": {}, "changes": [], "review": ["x"],
                          "turns": [{"answer": answer, "final_answer": final, "between_tools": between}]}
                report = runner.summarize([result], 0)
                self.assertLess(report.index("final answer:\n\nFive recipes."), report.index("between tool calls"))
                self.assertLess(report.index("between tool calls"), report.index("> Need act-verify."))

    def test_a_turn_with_no_text_after_its_last_tool_call_says_so(self):
        final, between = runner.turn_parts("claude", [claude_text("Starting."), *claude_tool("Bash", "b1")])
        self.assertEqual((final, between), ("", ["Starting."]))


# Text seen in runs that names a skill, a skill's file or a route to one; the default check must catch each.
SKILL_LEAKS = [
    "Need layout and rightsize for the response.",
    "Now the verify skill, layout, and the plan.",
    "I'll load the essentials skill, then check the README.",
    "I’ve loaded essentials. I’m checking its request.",
    "I’ll read the essentials guidance first, then check the notes.",
    "Asked how risky → act-stakes. Also respond-layout. Read those plus the relevant files.",
    "Need clarify (questionnaire for someone else), respond-layout, respond-ask, and maybe a peek at the project.",
    "The loaded [act-rightsize skill](/tmp/run/home/.agents/skills/essentials/references/act/rightsize.md) applies.",
    "The loaded [enrich skill](/tmp/run/home/x.md) requires that the user approves first.",
    "The [rule](`…/references/act.md`) says do nothing outward.",
    "Sending is risky; I need the guardrails, verify, and layout/ask skills.",
    "The question asks how careful to be → act-stakes. Also layout and ask skills.",
    "Deleting is risky, so I need guardrails and clarify; let me check the files first.",
    "This deletion is risky, so I need to read the script and the guardrails reference first.",
    "The referenced `coordinate` skill file was unavailable; proceeded using the brief.",
    "The referenced coordination skill was missing; proceeded using judgment.",
    "The `essentials` skill loaded, but its reference files are for other work.",
    "Per act/verify.md, the check comes first.",
    "SKILL.md says to read the start files.",
]

# Plausible correct answers, from runs and from ordinary prose; the default check must pass each.
SKILL_FINE = [
    "For the beans we need canes, twine and stakes.",
    "Last admission is 16:30 (4:30 pm), according to the brief.",
    "The server exited, so I couldn’t fetch `pancakes.md` or verify HTTP serving. No process was left running.",
    "I'll verify the date against fair.md before changing anything.",
    "The layout of the page stays the same: one heading and the stall list.",
    "Could you clarify the dates? I need to clarify one thing first: is the fair on the 14th?",
    "Greenway Nursery is a non-member, so that needs clarification rather than automatic rejection.",
    "The project has no markdown checker, so the brief's layout wasn't checked by one.",
    "Neighbours scanning a notice need the essentials fast: 14 November, 10:00 to 16:00, Harbor Hall.",
    "The stakes are high; for reference, the old line read 16:30.",
    "Scaling a recipe takes some skill, and the skills list in your README names knife work.",
    "Ask the committee whether a double pitch is allowed, and explain the one-pitch rule.",
    "I'll read the questionnaire first, then act on the plan and respond to the committee.",
    "scale.py needs cleanup: the two patterns can be named, and a lean version keeps the behaviour.",
    "I understand the request: rename the project in README.md and NOTES.md.",
    "Yes, this looks like a low-risk local refactor, with no approval requirement found in the project guidance.",
    "I'm running as a helper agent, and my working rules say a helper must not start further agents.",
    "The unpacked copy is in /tmp/run/tmp/recipes.Bfef/old-recipes/, kept as you asked.",
]


class SkillNamesInAnswers(unittest.TestCase):
    def test_the_default_pattern_catches_leaks_and_passes_ordinary_words(self):
        for text in SKILL_LEAKS:
            with self.subTest(leak=text):
                self.assertTrue(runner.SKILL_TALK.search(text))
        for text in SKILL_FINE:
            with self.subTest(fine=text):
                self.assertIsNone(runner.SKILL_TALK.search(text))

    def test_every_essentials_case_checks_it_unless_it_opts_out(self):
        cases = runner.load_cases("essentials/")
        self.assertTrue(cases)
        self.assertTrue(all(c["checks"].get("names_no_skill") in (True, False) for c in cases if not c.get("routing_only")))
        name = "answer names no skill or skill file"
        self.assertEqual(runner.check({"names_no_skill": True}, {"answer": SKILL_LEAKS[0]}), {name: False})
        self.assertEqual(runner.check({"names_no_skill": True}, {"answer": SKILL_FINE[0]}), {name: True})
        self.assertEqual(runner.check({"names_no_skill": False}, {"answer": SKILL_LEAKS[0]}), {})
        bad = {"id": "bad", "turns": [{"prompt": "Hello"}], "checks": {"names_no_skill": "no"}}
        with self.assertRaisesRegex(ValueError, "true or false"):
            runner.validate_case(bad)

    def test_codex_may_announce_essentials_in_one_line(self):
        announce = "I'll load the essentials skill, then check the README.\n\nThe port is 8080."
        self.assertFalse(runner.names_skill(announce, "codex"))
        self.assertTrue(runner.names_skill(announce, "claude"))
        self.assertTrue(runner.names_skill("I'll use the essentials and act-verify skills.\n\nDone.", "codex"))
        self.assertTrue(runner.names_skill(announce + "\nThe [rightsize skill](x/rightsize.md) applies.", "codex"))
        # Project rules in a progress line do not attribute behavior to the skill.
        self.assertFalse(runner.names_skill(
            "I'll load the essentials skill, then check the project terminology and naming rules.", "codex"))
        self.assertTrue(runner.names_skill(
            "Using the essentials rules, I declined the change.", "codex"))
        # a line that gives the skill as the reason is not an announcement
        self.assertTrue(runner.names_skill("I'll ask first, because the essentials skill prohibits deleting it.", "codex"))
        self.assertTrue(runner.names_skill("Using the essentials skill, which requires a proposal, I stopped.", "codex"))


class EvidenceChecks(unittest.TestCase):
    def test_a_statement_before_a_wide_change_must_name_its_files(self):
        checks = case_checks("act-guardrails-wide-rename")
        count = "I found four mentions across three Markdown files. This is a small rename, so I'll make the " \
                "replacements directly and check for any remaining mentions."
        named = "I'll rename tiny-weather to sky-glance in README.md and NOTES.md, then search again for the old name."
        for said, passes in [(count, False), (named, True)]:
            result = {"before_change": said, "changed_files": True, "sequencing_unknown": "", "answer": "",
                      "changes": [], "reads": []}
            out = {k: v for k, v in runner.check({"states_before_change": checks["states_before_change"]},
                                                 result).items()}
            self.assertEqual(all(out.values()), passes, out)

    def test_a_second_check_needs_a_started_agent_or_an_unverified_mark(self):
        for name in ("act-verify-second-check", "act-verify-print-run"):
            patterns = case_checks(name)["agent_started_or_answer"]
            for answer, started, passes in [
                    ("Corrected. An independent check confirmed the date and preserved formatting.", 0, False),
                    ("Corrected. I re-read the file myself; please read it once before it goes out.", 0, False),
                    ("Corrected. A separate agent compared the draft with fair.md and found it matches.", 1, True),
                    ("Corrected. I could not start a second agent here, so the independent check is still to do.",
                     0, True),
                    ("Corrected, but not yet independently verified: have someone check it before printing.", 0, True)]:
                with self.subTest(case=name, answer=answer):
                    out = runner.check({"agent_started_or_answer": patterns},
                                       {"answer": answer, "agents_started": started})
                    self.assertEqual(all(out.values()), passes)

    def test_a_waived_proposal_needs_exactly_the_named_files_removed(self):
        checks = case_checks("act-guardrails-waived-proposal")
        copies = [f"removed photos/{n}-copy.jpg" for n in ("beach", "picnic", "snow")]
        for changes, passes in [(copies, True), ([], False), (copies + ["removed photos/snow.jpg"], False)]:
            with self.subTest(changes=changes):
                out = runner.check(checks, {"changes": changes, "answer": "", "reads": []})
                self.assertEqual(all(out.values()), passes, out)

    def test_shared_tmp_names_lists_names_only(self):
        with tempfile.TemporaryDirectory() as root:
            (Path(root) / "recipes-x1").mkdir()
            (Path(root) / "note.txt").write_text("private")
            self.assertEqual(runner.shared_tmp_names(root), {"recipes-x1", "note.txt"})
        self.assertEqual(runner.shared_tmp_names("/nonexistent-skillbook-folder"), set())

    def test_only_a_successful_agent_start_counts(self):
        self.assertEqual(runner.agents_started("claude", [claude_tool("Agent", "a1")]), 1)
        self.assertEqual(runner.agents_started("claude", [claude_tool("Agent", "a1", error=True)]), 0)
        self.assertEqual(runner.agents_started("claude", [claude_tool("Bash", "b1")]), 0)
        wait = {"type": "item.completed", "item": {"type": "collab_tool_call", "tool": "wait",
                                                   "receiver_thread_ids": [], "status": "completed"}}
        spawn = {"type": "item.completed", "item": {"type": "collab_tool_call", "tool": "spawn_agent",
                                                    "status": "completed"}}
        named = {"type": "item.completed", "item": {"type": "collab_tool_call", "tool": "wait",
                                                    "receiver_thread_ids": ["t2"], "status": "completed"}}
        self.assertEqual(runner.agents_started("codex", [[wait, wait]]), 0)
        self.assertEqual(runner.agents_started("codex", [[spawn]]), 1)
        self.assertEqual(runner.agents_started("codex", [[named, named]]), 1)

    def test_codex_calls_about_agents_are_recorded_with_their_detail(self):
        # the shape of a recorded Codex run that waited twice, started no agent, and still claimed an independent check
        wait = {"type": "item.completed", "item": {
            "id": "item_7", "type": "collab_tool_call", "tool": "wait", "sender_thread_id": "s1",
            "receiver_thread_ids": [], "prompt": None, "agents_states": {}, "status": "completed"}}
        self.assertEqual(runner.action_evidence("codex", [wait]), [{
            "tool": "collab_tool_call", "phase": "item.completed", "call": "wait", "receiver_thread_ids": [],
            "agents_states": {}, "status": "completed"}])
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            claim = codex_message("Changed it to 17:00. An independent check confirmed this was the only change.")
            result = runner.observe("codex", [[wait, wait, claim]], work, "essentials", {}, work, {})
        patterns = case_checks("act-verify-print-run")["agent_started_or_answer"]
        # the exec record shows no spawn, so an agent may have run unseen: unknown, not failed
        self.assertEqual(result["agents_started"], 0)
        self.assertTrue(result["agents_unseen"])
        self.assertEqual(list(runner.check({"agent_started_or_answer": patterns}, result).values()), [None])
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            result = runner.observe("codex", [[claim]], work, "essentials", {}, work, {})
        self.assertFalse(result["agents_unseen"])
        self.assertEqual(list(runner.check({"agent_started_or_answer": patterns}, result).values()), [False])

    def test_kept_material_is_found_where_the_answer_says_inside_or_outside_the_run(self):
        patterns = case_checks("act-cleanup-kept-on-request")["answer_path_has"]
        with tempfile.TemporaryDirectory() as tmp:
            kept = Path(tmp) / "recipes-x" / "old-recipes"
            kept.mkdir(parents=True)
            (kept / "porridge.md").write_text("oats")
            for answer, passes in [(f"I left the unpacked copy in [ {kept} ]({kept}) for after lunch.", True),
                                   (f"The copy is at `{kept}/`.", True),
                                   (f"The copy is at {Path(tmp) / 'elsewhere' / 'old-recipes'}.", False),
                                   ("I left the unpacked copy in a temporary folder.", False)]:
                with self.subTest(answer=answer):
                    out = runner.check({"answer_path_has": patterns}, {"answer": answer})
                    self.assertEqual(all(out.values()), passes)
        # a path outside the system's temporary folders is never walked
        self.assertEqual(runner.named_paths(f"See {runner.REPO / 'tests'}."), [])

    def test_a_tidy_is_not_a_hunt_for_leftovers(self):
        checks = case_checks("act-cleanup-tidy-code")
        fine = {"answer": "Tidied scale.py.", "changes": ["changed scale.py"],
                "targets": ["python3 -m unittest -v", "/w/scale.py", "rm -rf __pycache__"]}
        self.assertTrue(all(runner.check(checks, fine).values()))
        for targets, changes in [(["ps aux"], []), (["ls scratch/run-0412"], []), (["find . -name '*.tmp'"], []),
                                 ([], ["removed scratch/run-0412/output.txt"]), ([], ["added scale_old.py"])]:
            with self.subTest(targets=targets, changes=changes):
                wrong = {**fine, "targets": fine["targets"] + targets, "changes": fine["changes"] + changes}
                self.assertFalse(all(runner.check(checks, wrong).values()))

    def test_the_committee_question_is_not_a_listing_line(self):
        pattern = case_checks("delegated-question-in-report")["answer_contains"][0]
        listing = "Added:\n\n- Hollis family: cakes; double pitch requested.\n\nCommittee decisions: confirm sizes."
        for answer, passes in [(listing, False),
                               ("The committee needs to decide whether a double pitch is allowed.", True),
                               ("**For the committee to decide**\n\n1. **The Hollis family's double pitch.**", True),
                               ("Should the Hollis family get a double pitch? fair.md allows one per stall.", True)]:
            with self.subTest(answer=answer):
                self.assertEqual(bool(re.search(pattern, answer, re.IGNORECASE)), passes)


class AspectCoverage(unittest.TestCase):
    def test_aspects_come_from_the_skill_text(self):
        names = runner.aspects()
        for aspect in ("act:rule:5", "act:route:act-rightsize", "act:not-for:act-rightsize", "essentials:step:1",
                       "essentials:not-for:step-1", "respond-ask:last", "skillbook-design:check:13"):
            self.assertIn(aspect, names)

    def test_unknown_and_uncovered_aspects_are_reported(self):
        cases = [{"id": "x/one", "covers": ["act:rule:5", "act:rule:999"]}]
        _, unknown, uncovered = runner.aspect_coverage(cases)
        self.assertIn("act:rule:999", unknown)
        self.assertNotIn("act:rule:5", uncovered)
        self.assertIn("act:rule:6", uncovered)

    def test_a_committed_fixture_has_history_but_no_counted_files(self):
        with tempfile.TemporaryDirectory() as root:
            work = Path(root)
            (work / "notes.md").write_text("one\n")
            runner.commit_fixture(work)
            log = subprocess.run(["git", "log", "--oneline"], cwd=work, capture_output=True, text=True, check=True)
            self.assertEqual(len(log.stdout.splitlines()), 1)
            self.assertEqual(list(runner.snapshot(work)), ["notes.md"])


if __name__ == "__main__":
    unittest.main()
