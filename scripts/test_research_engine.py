"""Offline regression tests for source-preserved, read-only research pipeline."""
import datetime as dt
import math
import unittest
from research_engine import (
    ARMS,FAMILIES,indicators,run_trades,research_one,
    last_closed_candles,shrinkage,stats
)
from collect_live import collect

UTC=dt.timezone.utc

def sample_bars(n=1200):
    origin=int(dt.datetime(2025,1,1,tzinfo=UTC).timestamp()*1000)
    result=[]
    for i in range(n):
        start=origin+i*4*3600*1000
        close=100+0.005*i+3*math.sin(i/5)
        opened=100+0.005*(i-1)+3*math.sin((i-1)/5)
        high=max(close,opened)+0.8;low=min(close,opened)-0.8
        result.append((start,opened,high,low,close,start+4*3600*1000-1))
    return result

class ResearchTests(unittest.TestCase):
    def test_minimum_4_families_6_arms(self):
        self.assertEqual(len(FAMILIES),4)
        self.assertEqual(len(ARMS),6)
        report=research_one(sample_bars(),"BTCUSDT","4h")
        self.assertEqual(len(report["results"]),24)
        self.assertEqual(report["status"],"RESEARCH_ONLY_NO_TRADE")
        self.assertTrue(all(r["forward_closed_trades"]==0 for r in report["results"]))
    def test_causal_indicator_extension(self):
        candles=sample_bars()
        first=indicators(candles)
        newest=candles[-1]
        extras=[(newest[0]+14400000,2000.,2200.,1900.,2100.,newest[5]+14400000)]
        extended=indicators(candles+extras)
        for key in first:
            self.assertEqual(first[key],extended[key][:-1])
    def test_target_result_frozen_before_later_stop(self):
        candles=sample_bars(65)
        bs=list(candles)
        at=51
        candle=bs[at]
        bs[at]=(candle[0],100.,112.,99.,109.,candle[5])
        for i in range(52,len(bs)):
            old=bs[i];bs[i]=(old[0],100.,100.,70.,75.,old[5])
        trade=run_trades(bs,[(50,1,90.,110.)],"none",indicators(bs))
        self.assertEqual(len(trade),1)
        self.assertEqual(trade[0]["outcome"],"TP")
        self.assertEqual(trade[0]["exit"],51)
    def test_limit_and_earliest_ohlc_exclusion(self):
        b=sample_bars(1200)
        def fake(path,params):
            end=params["endTime"]
            eligible=[x for x in b if x[0] <= end]
            return [[x[0],x[1],x[2],x[3],x[4],0,x[5],0,0,0,0,0]
                    for x in eligible[-params["limit"]:]]
        timestamp=dt.datetime.fromtimestamp((b[-1][5]+1)/1000,tz=UTC)
        result=last_closed_candles("BTCUSDT","4h",1200,fetch=fake,now=timestamp)
        self.assertEqual(len(result),1200)
        self.assertEqual(result[0][0],b[0][0])
        before=dt.datetime.fromtimestamp(b[-1][5]/1000,tz=UTC)
        clipped=last_closed_candles("BTCUSDT","4h",1100,fetch=fake,now=before)
        self.assertNotIn(b[-1][0],[r[0] for r in clipped])
    def test_no_confidence_without_30_training_closed_trades(self):
        short=[{"net_r":10.0}]*29
        self.assertIsNone(shrinkage(short))
        self.assertEqual(stats([])["mean_net_r"],None)
    def test_quote_feed_failures_are_visible(self):
        now=dt.datetime(2026,10,15,tzinfo=UTC)
        def fail(path,params):
            raise RuntimeError("rate limit")
        d=collect(fetch=fail,clock=now)
        self.assertEqual(len(d["symbols"]),4)
        self.assertTrue(all(v["status"]=="UNAVAILABLE" for v in d["symbols"].values()))

if __name__=="__main__":
    unittest.main()
