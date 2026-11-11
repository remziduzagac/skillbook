"""The skill-size check counts what every request reads: the main skill alone."""
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


class SkillChecksTest(unittest.TestCase):
    def test_start_size_counts_the_main_skill_alone(self):
        source = Path(__file__).resolve().parents[1] / "scripts" / "check-skills.sh"
        for bold in (False, True):
            with self.subTest(bold=bold), tempfile.TemporaryDirectory(prefix="skill-check-") as tmp:
                root = Path(tmp)
                (root / "scripts").mkdir()
                script = root / "scripts/check-skills.sh"
                shutil.copyfile(source, script)
                skill = root / "skills/demo"
                refs = skill / "references"
                refs.mkdir(parents=True)
                startup = "Read `references/understand.md`, `references/act.md` and `references/respond.md` when starting."
                main = "# demo\n\n" + ("**" + startup + "**" if bold else startup)
                main += "\n\nAn unrelated reference is `references/extra.md`.\n"
                (skill / "SKILL.md").write_text(main)
                total = len(main.encode())
                for name in ("understand", "act", "respond", "extra"):
                    (refs / (name + ".md")).write_text("# " + name + "\n\n" + name * 20 + "\n")
                run = subprocess.run(["sh", str(script)], capture_output=True, text=True, check=True)
                self.assertIn(f"demo: start files {total} characters\n", run.stdout)


if __name__ == "__main__":
    unittest.main()
