"""Only explicit, dated anchor calculations are supported."""
import unittest
from source_range import explained_range,structural_events
class SourceRangeTests(unittest.TestCase):
    def test_explicit_pivots_are_required(self):
        with self.assertRaises(ValueError): explained_range(None,90,2,2,4)
        with self.assertRaises(ValueError): explained_range(100,90,8,2,4)
        with self.assertRaises(ValueError): explained_range(90,100,2,2,4)
    def test_eq_has_source_anchors_and_no_signals(self):
        r=explained_range(110,90,10,11,13)
        self.assertEqual(r["eq"],100)
        self.assertEqual(r["status"],"DESCRIPTIVE_LEVELS_ONLY_NOT_TRADE_SIGNAL")
        self.assertEqual(structural_events([]),{})
if __name__=="__main__":unittest.main()
