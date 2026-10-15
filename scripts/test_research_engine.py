"""Source gate: accurate Binance candles, no strategies, no synthetic net R."""
import datetime as dt
import math
import unittest
from research_engine import (
    TIMEFRAMES,SYMBOLS,last_closed_candles,inspect_history,research_all
)
from source_policy import source_status

UTC=dt.timezone.utc
def sample_bars(n=1200):
    start=int(dt.datetime(2025,1,1,tzinfo=UTC).timestamp()*1000)
    result=[]
    for i in range(n):
        price=100+.02*i+math.sin(i/7)
        ts=start+i*4*3600*1000
        result.append((ts,price-.12,price+.4,price-.4,price,ts+14400000-1))
    return result
class ResearchTests(unittest.TestCase):
    def test_no_automatic_rule_or_backtest(self):
        approval=source_status()
        self.assertEqual(approval["approved_auto_setup_count"],0)
        self.assertEqual(approval["validated_trading_edge_count"],0)
        self.assertFalse(approval["real_orders_enabled"])
        report=inspect_history(sample_bars(),"BTCUSDT","4h")
        self.assertEqual(report["completed_strategy_backtests"],0)
        self.assertEqual(report["status"],"DATA_READY_FOR_FUTURE_SOURCE_VALIDATION")
    def test_actual_closed_candles_paginate_without_future(self):
        bars=sample_bars()
        def fake(path,params):
            selected=[b for b in bars if b[0]<=params["endTime"]]
            return [[b[0],b[1],b[2],b[3],b[4],0,b[5],0] for b in selected[-params["limit"]:]]
        now=dt.datetime.fromtimestamp((bars[-1][5]+1)/1000,UTC)
        out=last_closed_candles("BTCUSDT","4h",1200,fetch=fake,now=now)
        self.assertEqual(len(out),1200)
        self.assertEqual(out[0][0],bars[0][0])
        before=dt.datetime.fromtimestamp(bars[-1][5]/1000,UTC)
        clipped=last_closed_candles("BTCUSDT","4h",1100,fetch=fake,now=before)
        self.assertNotIn(bars[-1][0],[x[0] for x in clipped])
    def test_full_data_report_contains_zero_trials(self):
        sample=sample_bars(1010)
        def fake(path,params):
            rows=[b for b in sample if b[0]<=params["endTime"]]
            return [[b[0],b[1],b[2],b[3],b[4],0,b[5],0] for b in rows[-params["limit"]:]]
        now=dt.datetime.fromtimestamp((sample[-1][5]+1)/1000,UTC)
        r=research_all(fetch=fake,now=now,max_bars=1000)
        self.assertEqual(len(r["reports"]),len(SYMBOLS)*len(TIMEFRAMES))
        self.assertEqual(r["actually_executed_backtests"],0)
        self.assertEqual(r["candidate_models"],0)
        self.assertTrue(all("net_r" not in x for x in r["reports"]))
        self.assertFalse(r["trading_enabled"])
if __name__=="__main__":unittest.main()
