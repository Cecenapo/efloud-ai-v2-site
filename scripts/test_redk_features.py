"""Regression against uploaded RedK Indicator Amplifier MPL-2.0 reference.

Known numerical samples precomputed directly from user archive
backend/features/redk_amplifier.py (not inferred from chart appearance).
"""
import math
import unittest
from redk_features import feature_matrix,masks,ARMS
from redk_ablation import ablation_for

def bars(n=240):
    out=[]
    for i in range(n):
        close=100+.03*i+2*math.sin(i*.22)+.4*math.cos(i*.8)
        t=i*900000
        out.append((t,close-.05,close+.6,close-.65,close,t+900000-1))
    return out

class RedKSourceTests(unittest.TestCase):
    def test_matches_uploaded_redk_oscillators_and_normalizations(self):
        f=feature_matrix(bars())
        known={
            150:{"amp_rsi_oscillator":77.93944576,
                 "amp_rsi_scaled":0.5587889152,
                 "amp_stochastic_scaled":0.8043778433,
                 "amp_cci_scaled":0.6645288441,
                 "amp_macd_hist_scaled":0.9530307804,
                 "amp_rsi_up_peak":6.},
            220:{"amp_rsi_oscillator":35.5009480665,
                 "amp_rsi_scaled":-0.2899810387,
                 "amp_stochastic_scaled":-0.687995845,
                 "amp_cci_scaled":-0.5227827866,
                 "amp_macd_hist_scaled":-0.8393744221},
            239:{"amp_rsi_oscillator":60.3052957278,
                 "amp_rsi_scaled":0.2061059146,
                 "amp_stochastic_scaled":0.5071124735,
                 "amp_cci_scaled":0.2522937751,
                 "amp_macd_hist_scaled":0.4097703469}
        }
        for i,fields in known.items():
            for key,expected in fields.items():
                with self.subTest(bar=i,field=key):
                    self.assertAlmostEqual(float(f.loc[i,key]),expected,places=7)

    def test_nan_warmup_is_not_false_success(self):
        f=feature_matrix(bars())
        self.assertTrue(math.isnan(float(f.loc[95,"amp_macd_hist_scaled"])))
        self.assertTrue(math.isnan(float(f.loc[95,"amp_cci_scaled"])))
        r=masks(f,"LONG")
        self.assertEqual(tuple(r),ARMS)
        self.assertFalse(r["macd_expansion"][95])
        self.assertFalse(r["cci_impulse"][95])
        self.assertTrue(r["none"].all())

    def test_future_bars_do_not_repaint_past_redk_features(self):
        b=bars()
        small=feature_matrix(b[:190])
        fake=b+[(b[-1][0]+900000,500,501,499,500,b[-1][5]+900000)]
        larger=feature_matrix(fake)
        for name in ("rsi","stochastic","cci","macd_hist"):
            key="amp_"+name+"_scaled"
            a=small[key].to_numpy()
            z=larger[key].iloc[:190].to_numpy()
            for i,(x,y) in enumerate(zip(a,z)):
                if math.isnan(x):self.assertTrue(math.isnan(y))
                else:self.assertAlmostEqual(float(x),float(y),places=10)

    def test_ablation_baseline_is_same_pa_events_with_no_promotion(self):
        from experimental_lab import detect
        b=bars(1300)
        events=detect(b,3,3)
        r=ablation_for(b,events)
        self.assertTrue(r["research_only"])
        self.assertFalse(r["real_orders"])
        self.assertEqual(r["promoted_models"],0)
        self.assertEqual(r["source_approved_trade_rules"],0)
        for group in r["groups"]:
            arms={a["arm"]:a for a in group["arms"]}
            self.assertEqual(tuple(arms),ARMS)
            baseline=arms["none"]
            for a in group["arms"]:
                self.assertFalse(a["promote_to_real"])
                self.assertLessEqual(a["n_eligible_total"],baseline["n_eligible_total"])
                stat=a["holdout"]["10bps"]
                costly=a["holdout"]["30bps"]
                if stat["n"] and stat["mean_r"] is not None:
                    self.assertGreaterEqual(stat["mean_r"],costly["mean_r"])
if __name__=="__main__":unittest.main()
