import datetime as dt
import unittest
from unittest.mock import patch
from paper_forward import evaluate_pending,valid_quote,update_learning
from test_research_engine import sample_bars

UTC=dt.timezone.utc

class ShadowTests(unittest.TestCase):
    def test_only_post_observation_candles_close_a_trade(self):
        bars=sample_bars(100)
        row=bars[52]
        future=(row[0],100.,112.,99.,109.,row[5])
        modified=bars[:52]+[future]+bars[53:]
        observed=dt.datetime.fromtimestamp((bars[50][5]+100)/1000,tz=UTC)
        p={"id":"one","symbol":"BTCUSDT","timeframe":"4h","family":"RANGE_SWEEP_EQ",
           "arm":"none","side":"LONG","observed_utc":observed.isoformat(),
           "entry_exec":100.,"stop":90.,"target":110.}
        result=evaluate_pending(p,modified,dt.datetime.fromtimestamp((row[5]+1)/1000,tz=UTC))
        self.assertEqual(result["outcome"],"TP")
        self.assertTrue(result["net_r"]>0)
        waiting=evaluate_pending(p,modified,observed)
        self.assertIsNone(waiting)
    def test_outdated_price_is_rejected(self):
        now=dt.datetime(2026,10,15,tzinfo=UTC)
        row={"status":"OK","last_price":500.0,"observed_utc":"2026-10-14T00:00:00Z"}
        self.assertIsNone(valid_quote(row,now))
    def test_no_duplicate_shadow_rewards(self):
        bars=sample_bars()
        now=dt.datetime.fromtimestamp((bars[-1][5]+1000)/1000,tz=UTC)
        quote={"symbols":{s:{"status":"OK","last_price":bars[-1][4],
                "observed_utc":now.isoformat()} for s in ("BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT")}}
        with patch("paper_forward.last_closed_candles",return_value=bars):
            first=update_learning({},quote,now)
            second=update_learning(first,quote,now)
        self.assertEqual(first["tracked_closed"],0)
        self.assertEqual(second["tracked_closed"],0)
        self.assertEqual([p["id"] for p in first["pending"]],[p["id"] for p in second["pending"]])
        self.assertFalse(second["auto_trade"])

if __name__=="__main__":unittest.main()
