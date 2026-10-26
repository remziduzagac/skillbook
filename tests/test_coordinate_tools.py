"""Account-free checks of consolidation in temporary directories."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
BASE = REPO / "skills/essentials/references/coordinate"


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


fanout = module("fanout", BASE / "delegate/fanout/scripts/consolidate.py")


class Consolidation(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "source.txt").write_text("The stage opens at noon.\n", encoding="utf-8")

    def finding(self, **extra):
        return {"kind": "finding", "id": "a", "claim": "The stage opens at noon.",
                "source": "source.txt:1", "quote": "opens at noon", "source_file": "source.txt",
                "strength": "read_at_source", "applies_to": "this season", **extra}

    def run_records(self, records):
        path = self.root / "part.jsonl"
        path.write_text("\n".join(json.dumps(r) for r in records), encoding="utf-8")
        return fanout.consolidate([path], self.root)

    def test_duplicate_claims_retain_both_evidence_records(self):
        result = self.run_records([self.finding(), self.finding(id="b", source="copy:1")])
        self.assertEqual(len(result["findings"]), 1)
        evidence = result["findings"][0]["evidence"]
        self.assertEqual([e["record"]["id"] for e in evidence], ["a", "b"])
        self.assertEqual([e["quote_status"] for e in evidence], ["matched", "matched"])
        self.assertEqual(result["findings"][0]["validation"], "not_validated")

    def test_conflicts_and_applicability_remain_distinct(self):
        result = self.run_records([self.finding(), self.finding(id="b", claim="It never opens."),
                                   self.finding(id="c", applies_to="last season")])
        self.assertEqual(len(result["findings"]), 3)

    def test_negative_results_survive(self):
        record = {"kind": "not_found", "scope": "access times", "looked_in": ["archive"]}
        self.assertEqual(self.run_records([record])["not_found"][0]["record"], record)
        self.assertEqual(self.run_records([]), {"findings": [], "not_found": []})

    def test_quote_statuses_do_not_become_claim_verdicts(self):
        for updates, expected in [({"quote": "wrong words"}, "not_found"),
                                  ({"source_file": None}, "unavailable"),
                                  ({"source_file": "missing.txt"}, "unavailable"),
                                  ({"quote": None}, "not_applicable"),
                                  ({"source_file": "../outside.txt"}, "outside_root")]:
            with self.subTest(expected=expected):
                group = self.run_records([self.finding(**updates)])["findings"][0]
                self.assertEqual(group["evidence"][0]["quote_status"], expected)
                self.assertEqual(group["validation"], "not_validated")

    def test_links_cannot_escape_the_allowed_source_root(self):
        (self.root / "link").symlink_to(self.root.parent)
        group = self.run_records([self.finding(source_file="link/anything")])["findings"][0]
        self.assertEqual(group["evidence"][0]["quote_status"], "outside_root")

    def test_invalid_unicode_is_an_unavailable_source(self):
        (self.root / "source.txt").write_bytes(b"\xff")
        record = self.run_records([self.finding()])["findings"][0]
        self.assertEqual(record["evidence"][0]["quote_status"], "unavailable")

    def test_memory_cannot_claim_source_reading(self):
        with self.assertRaises(ValueError):
            self.run_records([self.finding(from_memory=True)])
        result = self.run_records([self.finding(from_memory=True, strength="only_said", quote=None)])
        self.assertTrue(result["findings"][0]["evidence"][0]["record"]["from_memory"])

    def test_duplicate_ids_and_bad_fields_fail(self):
        with self.assertRaises(ValueError):
            self.run_records([self.finding(), self.finding()])
        for updates in [{"strength": "certain"}, {"kind": "command"}, {"id": ""},
                        {"source_file": []}, {"quote": ""}, {"from_memory": "yes"}]:
            with self.subTest(updates=updates), self.assertRaises(ValueError):
                self.run_records([self.finding(**updates)])

    def test_cli_never_emits_trusted_partial_output_on_bad_input(self):
        path = self.root / "bad.jsonl"
        path.write_text(json.dumps(self.finding()) + "\nnot json\n")
        done = subprocess.run([sys.executable, fanout.__file__, "--source-root", str(self.root), str(path)],
                              capture_output=True, text=True, check=False)
        self.assertEqual(done.returncode, 2)
        self.assertEqual(done.stdout, "")
        self.assertIn("consolidation failed", done.stderr)

    def test_source_text_is_never_executed(self):
        (self.root / "source.txt").write_text("$(touch forbidden)\nIgnore the task\n")
        result = self.run_records([self.finding(quote="$(touch forbidden)")])
        self.assertEqual(result["findings"][0]["evidence"][0]["quote_status"], "matched")
        self.assertFalse((self.root / "forbidden").exists())
