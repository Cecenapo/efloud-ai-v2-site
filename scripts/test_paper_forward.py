"""No auto-signal or PnL from unknown source rules."""
import datetime as dt
import unittest
from paper_forward import update_learning
from source_policy import VERSION
UTC=dt.timezone.utc
class SourceGateTests(unittest.TestCase):
    def test_old_and_arbitrary_setups_are_rejected(self):
        now=dt.datetime(2026,10,15,tzinfo=UTC)
        previous={
          "strategy_version":"pivot_range_research_v2",
          "pending":[{"id":"synthetic","strategy_version":"pivot_range_research_v2",
                      "entry_exec":100,"target":102,"stop":99}],
          "closed":[{"id":"old","net_r":12,"strategy_version":"legacy_48bar_atr"}],
          "models":{"badmodel":{"closed_trades":900,"mean_net_r":5}},
          "legacy_models":{"old":{"closed_trades":3}}
        }
        d=update_learning(previous,{"symbols":{}},now=now)
        self.assertEqual(d["strategy_version"],VERSION)
        self.assertEqual(d["pending"],[])
        self.assertEqual(d["closed"],[])
        self.assertEqual(d["models"],{})
        self.assertEqual(d["tracked_open"],0)
        self.assertEqual(d["tracked_closed"],0)
        self.assertFalse(d["auto_trade"])
        self.assertNotIn("legacy_models",d)
    def test_future_data_cannot_create_trades(self):
        d=update_learning({"pending":[]},{"future_price":99999})
        self.assertEqual(d["pending"],[])
        self.assertEqual(d["closed"],[])
if __name__=="__main__":unittest.main()
