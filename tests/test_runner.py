"""Check the test evidence without an account, network access or model calls."""

import contextlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import threading
import time
from types import SimpleNamespace
import unittest
from unittest.mock import patch


SPEC = importlib.util.spec_from_file_location("skillbook_runner", Path(__file__).with_name("run.py"))
runner = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(runner)


def command_event(command, exit_code=0):
    return {"type": "item.completed", "item": {
        "type": "command_execution", "command": command, "exit_code": exit_code}}


class ReadEvidence(unittest.TestCase):
    def test_successful_direct_and_wrapped_reads(self):
        for command in ["cat /tmp/skills/essentials/references/act.md",
                        "/bin/zsh -lc 'cat /tmp/skills/essentials/references/act.md'",
                        "cd /tmp/skills/essentials && cat references/act.md"]:
            with self.subTest(command=command):
                self.assertEqual(runner.skills_read("codex", [[command_event(command)]], None, "essentials"), {"act"})

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
                self.assertEqual(runner.text_before_change(agent, [events]), (statement, True, False))

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
                patch.object(runner.subprocess, "run", side_effect=responder):
            return runner.run_one(case, agent, 1, args, Path(output), budget)

    def test_changed_counts_a_created_file_but_not_a_removed_one(self):
        result = {"reads": [], "answer": "", "changes": ["added notes/new.md", "removed old.md"]}
        out = runner.check({"changed": ["notes/new.md", "old.md"]}, result)
        self.assertEqual(out, {"changed notes/new.md": True, "changed old.md": False})

    def test_claude_event_with_text_message_is_skipped(self):
        events = [{"type": "user", "message": "plain text"},
                  {"type": "assistant", "message": {"content": [
                      {"type": "tool_use", "name": "Read", "id": "t1", "input": {"file_path": "fees.md"}}]}}]
        actions = runner.action_evidence("claude", events)
        self.assertEqual([(a["tool"], a["file_path"]) for a in actions], [("Read", "fees.md")])

    def run_main(self, fake_run, runs=0, budget=1.0, jobs=4):
        args = SimpleNamespace(case="history-out-of-email", agents="claude,codex", runs=runs, model=[], login=False,
                               instruction="", budget=budget, timeout=1, keep=False, dry_run=False, coverage=False,
                               summary=False, yes=True, jobs=jobs)
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

    def test_runner_error_ends_one_run_and_marks_its_cost_unknown(self):
        results, _ = self.run_main(RuntimeError("boom"))
        self.assertEqual(len(results), 2)
        self.assertTrue(all(r["cost_unknown"] and "boom" in r["error"] for r in results))

    def test_jobs_run_at_the_same_time_and_keep_the_plan_order(self):
        lock, running, most = threading.Lock(), [0], [0]

        def fake(case, agent, n, args, out_dir, left):
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
                for field in ("skills", "category", "rejects", "review", "source"):
                    self.assertTrue(case.get(field), field)
                source = runner.REPO / case["source"].split(":", 1)[0]
                self.assertTrue(source.is_file(), str(source))
                self.assertTrue(case["checks"] or any(t.get("checks") for t in case["turns"]))

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
                        "git status", "nl -ba api.py | sed -n 1,40p", "/usr/bin/zsh -lc 'rg --files'"):
            self.assertEqual(runner.command_effect(command), "read", command)

    def test_writing_or_opaque_forms_are_not_read(self):
        self.assertEqual(runner.command_effect("find . -name '*.pyc' -delete"), "unknown")
        self.assertEqual(runner.command_effect("cat api.py > copy.py"), "unknown")
        self.assertEqual(runner.command_effect("rg foo || true"), "unknown")
        self.assertEqual(runner.command_effect("cat api.py | sed -n 'w out.txt'"), "unknown")
        self.assertEqual(runner.command_effect("rm old/notes.txt"), "write")

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


class AspectCoverage(unittest.TestCase):
    def test_aspects_come_from_the_skill_text(self):
        names = runner.aspects()
        for aspect in ("act:rule:5", "act:route:act-rightsize", "act:not-for:act-rightsize", "essentials:step:1",
                       "essentials:not-for:step-1", "respond-ask:last", "skillbook-tree:check:13"):
            self.assertIn(aspect, names)

    def test_unknown_and_uncovered_aspects_are_reported(self):
        cases = [{"id": "x/one", "covers": ["act:rule:5", "act:rule:999"]}]
        _, unknown, uncovered = runner.aspect_coverage(cases)
        self.assertIn("act:rule:999", unknown)
        self.assertNotIn("act:rule:5", uncovered)
        self.assertIn("act:rule:6", uncovered)


if __name__ == "__main__":
    unittest.main()
