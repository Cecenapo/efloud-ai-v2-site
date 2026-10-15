"""Causal pivot and structure-source research regression tests.

All synthetic candles are invented solely for algorithm tests; none implies
historical profit or lesson-exact automatic trading rules.
"""
import math
import unittest
from source_range import (
    pivots_before,range_at,latest_swing,structural_events,VERSION
)


def cyclic_bars(n=260):
    bars=[]
    for i in range(n):
        before=100.0+5*math.sin((i-.7)*.32)
        close=100.0+5*math.sin(i*.32)
        upper=max(before,close)+.23
        lower=min(before,close)-.23
        bars.append((i*300000,before,upper,lower,close,(i+1)*300000-1))
    return bars


class StructureRangeTests(unittest.TestCase):
    def test_pivots_are_confirmed_strictly_before_signal(self):
        bars=cyclic_bars()
        for i in range(30,220,7):
            for side,j,confirmation,price in pivots_before(bars,i):
                self.assertLess(confirmation,i)
                self.assertLess(j,confirmation)
                self.assertEqual(price,bars[j][2 if side=="HIGH" else 3])

    def test_range_independent_of_future_or_current_signal_wick(self):
        bars=cyclic_bars()
        valid=[(i,range_at(bars,i)) for i in range(70,210)
               if range_at(bars,i) is not None]
        self.assertTrue(valid, "Synthetic cyclic trend should produce confirmed repeated pivots")
        i,rg=valid[0]
        modified=list(bars)
        prev=bars[i]
        modified[i]=(prev[0],prev[1],prev[2]*5,prev[3]/5,prev[4],prev[5])
        modified += cyclic_bars(18)
        self.assertEqual(rg,range_at(modified,i))
        self.assertLess(rg["top_confirmed_i"],i)
        self.assertLess(rg["bottom_confirmed_i"],i)
        self.assertGreaterEqual(rg["top_touch_count"],2)
        self.assertGreaterEqual(rg["bottom_touch_count"],2)
        self.assertEqual(rg["eq"],(rg["high"]+rg["low"])/2)
        self.assertEqual(rg["method_version"],VERSION)

    def test_wick_stop_and_eq_target_are_structural_not_atr(self):
        bars=cyclic_bars()
        candidates=[(i,range_at(bars,i)) for i in range(80,210)
                    if range_at(bars,i) is not None]
        self.assertTrue(candidates)
        i,rg=next(((i,rg) for i,rg in candidates if
                   rg["low"]<=bars[i-1][4]<=rg["high"]), candidates[0])
        changed=bars[:i+1]
        original=changed[-1]
        width=rg["high"]-rg["low"]
        low=rg["low"]-width*.03
        close=rg["low"]+width*.12
        op=rg["low"]+width*.14
        high=max(op,close)+width*.01
        changed[-1]=(original[0],op,high,low,close,original[5])
        events=structural_events(changed)["RANGE_SWEEP_EQ"]
        matched=[e for e in events if e[0]==i and e[1]==1]
        self.assertEqual(len(matched),1)
        self.assertAlmostEqual(matched[0][2],low)
        self.assertAlmostEqual(matched[0][3],rg["eq"])

    def test_trending_candles_cannot_be_fabricated_into_a_range(self):
        bars=[]
        for i in range(220):
            v=100+i*.4
            bars.append((i*300000,v,v+.5,v-.1,v+.3,(i+1)*300000-1))
        self.assertIsNone(range_at(bars,180))
        self.assertEqual(structural_events(bars)["RANGE_SWEEP_EQ"],[])

if __name__=="__main__":
    unittest.main()
