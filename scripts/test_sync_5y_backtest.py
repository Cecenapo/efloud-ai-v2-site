"""Fail-closed tests of public 5y evidence synchronization. No network."""
from datetime import datetime,timezone
from copy import deepcopy
import unittest
from sync_5y_backtest import project,SYMBOLS,FRAMES,WIDTHS,SPLITS


def fixture():
    stamp=datetime.now(timezone.utc).isoformat()
    metric=[]
    cov=[]
    records=[]
    for sym in SYMBOLS:
        for tf in FRAMES:
            cov.append({"symbol":sym,"timeframe":tf,"fiveYearDataCoverageVerified":False,
                        "coverageMetadataMissing":True})
            for w in WIDTHS:
                for split in SPLITS:
                    metric.append({"symbol":sym,"timeframe":tf,
                         "experimentalPivotWidth":w,"split":split,
                         "frozenWatches":5,"resolvedWithinSplit":3,
                         "meanEstimatedNetRBase":-.1,"meanEstimatedNetRStress":-.3,
                         "blockBootstrapOneSided95LowerBaseR":None})
                records.append({"symbol":sym,"timeframe":tf,
                    "experimentalPivotWidth":w,"status":"HISTORICAL_COST_FAIL",
                    "ordersEnabled":False,"tradeAllowed":False,
                    "eligibleForAutomatedTrading":False,
                    "reasons":["NO_INDEPENDENT_EVIDENCE"],"sampleSize":{"train":3,"validation":3,"holdout":3},
                    "netStressMeanR":{"train":-.3,"validation":-.3,"holdout":-.3},
                    "gapFreeFiveYearDataVerified":False})
    src={"schema":1,"engine":"EFLOUD_447_RULE_FIVE_YEAR_CAUSAL_REPLAY_V1",
         "venue":"BINANCE_SPOT","tradeAllowed":False,"ordersEnabled":False,
         "teacherApprovedStrategies":0,"certifiedPositiveNetEVStrategies":0,
         "liveOrderFills":0,"historicalSeriesTested":32,
         "seriesStillMissing":[],"all32SeriesRun":True,
         "metrics":metric,"seriesCoverage":cov,"updatedUtc":stamp,
         "requestedFromUtc":"2021-10-19T00:00:00+00:00",
         "totalFrozenResearchWatches":960,"estimatedRoundTripCosts":{
             "baseRoundTripPct":.3,"stressRoundTripPct":.6}}
    ev={"schema":1,"kind":"EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1",
        "sourceReportUtc":stamp,"marketVenue":"BINANCE_SPOT",
        "ordersEnabled":False,"tradeAllowed":False,
        "certifiedPositiveNetEVStrategies":0,
        "teacherApprovedStrategies":0,"realExecutionCount":0,
        "historicalCoverage":{
            "completedSeries":32,"experimentalVariantsSeen":64,
            "all32ChronologicalReplaysCompleted":True,
            "missingVariants":[]},
        "assessments":records,
        "verdictCounts":{"HISTORICAL_COST_FAIL":64},
        "generatedUtc":stamp}
    return src,ev


class FiveYearEvidenceMirrorTests(unittest.TestCase):
    def test_matches_both_documents_and_never_approves_a_trade(self):
        src,e=fixture()
        web,gate=project(src,e)
        self.assertEqual(web["historicalSeriesTested"],32)
        self.assertEqual(len(web["metrics"]),192)
        self.assertEqual(len(gate["assessments"]),64)
        self.assertEqual(gate["sourceReportUtc"],web["updatedUtc"])
        self.assertEqual(web["realOrders"],0)
        self.assertEqual(web["independentlyProvenStrategies"],0)
        self.assertFalse(gate["tradeAllowed"])

    def test_refuses_stale_64_variant_assessment(self):
        src,e=fixture()
        e["sourceReportUtc"]="2020-01-01T00:00:00+00:00"
        with self.assertRaisesRegex(ValueError,"stale"):
            project(src,e)

    def test_refuses_partial_32_series_data(self):
        src,e=fixture()
        src["historicalSeriesTested"]=28
        with self.assertRaises(ValueError):
            project(src,e)

    def test_refuses_missing_split_or_duplicate_variant(self):
        src,e=fixture()
        src["metrics"][-1]=deepcopy(src["metrics"][0])
        with self.assertRaises(ValueError):
            project(src,e)

    def test_refuses_unsafe_trade_flag_even_on_profitable_numbers(self):
        src,e=fixture()
        e["assessments"][0]["eligibleForAutomatedTrading"]=True
        with self.assertRaises(ValueError):
            project(src,e)

    def test_refuses_fake_overlap_certification(self):
        src,e=fixture()
        src["metrics"][0]["overlapAudit"]={
            "nonOverlappingResolvedPaperOutcomes":2,
            "realOrderFills":1,"independentEvidenceEstablished":True}
        with self.assertRaisesRegex(ValueError,"overlap"):
            project(src,e)



    def test_spot_long_only_audit_is_preserved_and_never_promoted(self):
        src,e=fixture()
        src["metrics"][0]["spotLongOnlyResolvedWithinSplit"]=2
        src["metrics"][0]["spotLongOnlyAudit"]={
            "nonOverlappingResolvedPaperOutcomes":1,
            "nonOverlappingMeanEstimatedNetRStress":-.40,
            "unresolvedPaperExposureNotIgnored":True,
            "sameBarCloseAndNewTouchBlocked":True,
            "onePaperPositionPerMarketAndPivot":True,
            "realOrderFills":0,"independentEvidenceEstablished":False}
        result,gate=project(src,e)
        spot=result["metrics"][0]["spotLongOnlyAudit"]
        self.assertEqual(spot["nonOverlappingResolvedPaperOutcomes"],1)
        self.assertEqual(spot["nonOverlappingMeanEstimatedNetRStress"],-.40)
        self.assertEqual(result["realOrders"],0)

    def test_fake_spot_long_fills_fail_closed(self):
        src,e=fixture()
        src["metrics"][0]["spotLongOnlyResolvedWithinSplit"]=3
        src["metrics"][0]["spotLongOnlyAudit"]={
            "nonOverlappingResolvedPaperOutcomes":3,
            "realOrderFills":1,"independentEvidenceEstablished":False}
        with self.assertRaisesRegex(ValueError,"LONG-only"):
            project(src,e)

if __name__=="__main__":
    unittest.main()
