"""Deterministic regression tests: experimental lab never claims teacher signal."""
import datetime as dt
import json
import math
import unittest
from experimental_lab import (
    VERSION, PROVENANCE, MIN_BARS, pivot_index, available, detect, simulate,
    stats, evaluate, run_research, recent_observations
)
UTC=dt.timezone.utc

def synthetic(n=1200):
    start=dt.datetime(2025,1,1,tzinfo=UTC).timestamp()*1000
    candles=[]
    for i in range(n):
        price=100+3*math.sin(i*.20)
        o=100+3*math.sin((i-.2)*.20)
        high=max(price,o)+.20
        low=min(price,o)-.20
        t=int(start+i*900000)
        candles.append((t,o,high,low,price,t+900000-1))
    return candles

class IndependentLabTests(unittest.TestCase):
    def test_pivot_availability_never_has_future_confirmation(self):
        b=synthetic(300)
        hi,lo=pivot_index(b,3,3)
        for i in range(40,240,13):
            self.assertTrue(all(p[1]<i for p in available(hi,i)))
            self.assertTrue(all(p[1]<i for p in available(lo,i)))
        self.assertGreater(len(hi),0)
        self.assertGreater(len(lo),0)

    def test_no_lookahead_signal_future_candle_does_not_change_past_event(self):
        b=synthetic(450)
        cut=350
        events1=detect(b[:cut],3,3)
        hacked=b[:]
        # Historical code must not be allowed to see future changes.
        for i in range(cut,len(hacked)):
            t=b[i][0]
            hacked[i]=(t,9000,9900,8500,9000,b[i][5])
        events2=[e for e in detect(hacked,3,3) if e["i"]<cut]
        self.assertEqual(events1,events2)

    def test_same_bar_stop_and_tp_uses_stop_first(self):
        b=synthetic(30)
        i=12
        t=b[i+1][0]
        b[i+1]=(t,100,103,97,101,b[i+1][5])
        e={"i":i,"side":"LONG","stop":98,"target":102}
        r=simulate(b,e)
        self.assertEqual(r["outcome"],"STOP")
        self.assertAlmostEqual(r["gross_r"],-1)

    def test_next_open_and_scenario_cost_sensitivity(self):
        b=synthetic(35)
        i=12
        t=b[i+1][0]
        b[i+1]=(t,100,100.5,99.6,100.2,b[i+1][5])
        e={"i":i,"side":"LONG","stop":99,"target":105}
        trial0=simulate(b,e,cost_bps=0,max_hold=1)
        trial30=simulate(b,e,cost_bps=30,max_hold=1)
        self.assertEqual(trial0["entry_i"],i+1)
        self.assertEqual(trial0["entry"],100)
        self.assertGreater(trial0["net_r"],trial30["net_r"])

    def test_no_insufficient_data_fake_results(self):
        b=synthetic(900)
        report=run_research(fetch=lambda s,t,n:b, symbols=("BTCUSDT",),frames=("15m",),limit=1000)
        self.assertEqual(report["candidate_events_backtested"],0)
        self.assertEqual(report["reports"][0]["status"],"NOT_ENOUGH_CLOSED_BARS")
        self.assertFalse(report["real_orders"])
        self.assertEqual(report["source_verified_auto_rules"],0)

    def test_research_outputs_are_experimental_not_source_certified(self):
        b=synthetic(1200)
        report=run_research(fetch=lambda s,t,n:b, symbols=("BTCUSDT",),frames=("15m",),limit=1200)
        self.assertEqual(report["version"],VERSION)
        self.assertEqual(report["source_class"],PROVENANCE)
        self.assertEqual(report["reports"][0]["status"],"RESEARCHED_EXPERIMENTAL")
        self.assertFalse(report["real_orders"])
        self.assertTrue(all(v["not_instructor_rule"] for v in report["reports"][0]["variants"]))
        self.assertTrue(all(v["holdout_10bp"]["n"]>=0 for v in report["reports"][0]["variants"]))

    def test_radar_only_reports_latest_closed_candle(self):
        b=synthetic(250)
        events,errors=recent_observations(
          fetch=lambda s,t,n:b,symbols=("BTCUSDT",),frames=("15m",))
        self.assertEqual(errors,[])
        self.assertTrue(all(x["source_class"]==PROVENANCE and x["can_trade"] is False
                            and not x["order_placed"] for x in events))
        self.assertTrue(all(x["signal_open_ms"]==b[-1][0] for x in events))

if __name__=="__main__":unittest.main()
