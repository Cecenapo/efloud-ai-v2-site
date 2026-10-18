"""Guard the 358 imported ASR notes from being mislabeled as trade signals."""
from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parent.parent


class InstructorAtlasTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT/"instructor_rules.json").read_text(encoding="utf-8"))
        cls.source = (ROOT/"docs"/"EFLOUD_TRAINING_ASR_RULES.md").read_text(encoding="utf-8")

    def test_full_source_exact_index(self):
        rows=self.data["rules"]
        self.assertEqual(self.data["rule_count"], 358)
        self.assertEqual(self.data["lesson_count"], 32)
        self.assertEqual(len(rows), 358)
        self.assertTrue(self.data["source_truncated"])
        self.assertEqual(self.data["incomplete_rule_ids"], ["K40.3"])
        self.assertFalse(rows[-1]["note_complete"])
        self.assertEqual(len({r["id"] for r in rows}), 358)
        self.assertEqual(len(re.findall(r"^\*\*K\d+\.\d+\s*·", self.source, re.M)), 358)
        self.assertEqual(len(self.source), self.data["original_markdown_characters"])
        self.assertTrue(all(r["id"] in self.source for r in rows))

    def test_fail_closed_evidence(self):
        self.assertFalse(self.data["orders_enabled"])
        self.assertEqual(self.data["approved_auto_setup_count"], 0)
        self.assertTrue(self.data["requires_video_frame_verification"])
        self.assertTrue(all(r["approved_signal"] is False
            and r["approved_order"] is False
            and r["teacher_numeric_contract_verified"] is False
            for r in self.data["rules"]))

    def test_ui_is_connected_and_sanitizes_notes(self):
        html=(ROOT/"index.html").read_text(encoding="utf-8")
        js=(ROOT/"instructor-rules-ui.js").read_text(encoding="utf-8")
        self.assertIn('id="instructor-atlas"',html)
        self.assertIn('src="./instructor-rules-ui.js?v=1"',html)
        self.assertIn('href="./instructor-rules.css?v=1"',html)
        self.assertIn('fetch("./instructor_rules.json"',js)
        self.assertIn("escape(strip(r.note_markdown))",js)


if __name__ == "__main__":
    unittest.main()
