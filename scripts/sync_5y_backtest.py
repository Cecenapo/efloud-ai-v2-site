"""Safely synchronize evidence-only EFLOUD 5y replay to the free GitHub Pages site.

Two matched, complete, independently generated public read-only reports are
required. No orders, no trade promotion, no stale-downgrade, no made-up data.
Uses GitHub authenticated Contents read-only endpoint; no Binance API or paid service. No credential is created or requested by this script.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import json
import os
from base64 import b64decode
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parent.parent
UPSTREAM="https://api.github.com/repos/Cecenapo/efloud-ai-cloud/contents/public/data/binance_v2/"
REPLAY="auto_structure_5y_backtest.json"
EVIDENCE="auto_structure_evidence.json"
SYMBOLS=("BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT")
FRAMES=("5m","15m","1h","4h","6h","1d","1w","1M")
WIDTHS=(2,4)
SPLITS=("train","validation","holdout")
EXPECTED={(s,f,w,t) for s in SYMBOLS for f in FRAMES for w in WIDTHS for t in SPLITS}


def _date(value):
    if not isinstance(value,str):
        raise ValueError("Missing timestamp")
    d=datetime.fromisoformat(value.replace("Z","+00:00"))
    if d.tzinfo is None:
        raise ValueError("Timestamp lacks timezone")
    return d.astimezone(timezone.utc)


def _fetch(name):
    if name not in (REPLAY,EVIDENCE):
        raise ValueError("Unapproved upstream file")
    token=os.environ.get("EFLOUD_RESEARCH_READ_TOKEN")
    if not token:
        raise RuntimeError("A repository-scoped read-only token is required; private research was NOT exposed.")
    request=Request(UPSTREAM+name+"?ref=main",headers={
        "User-Agent":"EFLOUD-Research-Sync-ReadOnly/1",
        "Authorization":"Bearer "+token,
        "Accept":"application/vnd.github+json",
        "X-GitHub-Api-Version":"2022-11-28",
    })
    with urlopen(request,timeout=30) as response:
        body=response.read(4500000)
    data=json.loads(body)
    if (not isinstance(data,dict) or data.get("type")!="file" or
            data.get("encoding")!="base64" or
            not isinstance(data.get("content"),str)):
        raise ValueError("Private source did not return a verified GitHub Contents file")
    decoded=b64decode(data["content"],validate=False)
    if len(decoded)>3000000:
        raise ValueError("Unusually large upstream report")
    return json.loads(decoded)


def project(replay: dict,evidence: dict) -> tuple[dict,dict]:
    """Checks stronger than display contract; reject different-day/partial pairs."""
    if (not isinstance(replay,dict) or
        replay.get("schema")!=1 or
        replay.get("engine")!="EFLOUD_447_RULE_FIVE_YEAR_CAUSAL_REPLAY_V1" or
        replay.get("venue")!="BINANCE_SPOT" or
        replay.get("tradeAllowed") is not False or
        replay.get("ordersEnabled") is not False or
        replay.get("teacherApprovedStrategies")!=0 or
        replay.get("certifiedPositiveNetEVStrategies")!=0 or
        replay.get("liveOrderFills")!=0 or
        replay.get("historicalSeriesTested")!=32 or
        replay.get("seriesStillMissing") or
        replay.get("all32SeriesRun") is not True):
        raise ValueError("Backtest source incomplete, unapproved or mismatched")
    updated=_date(replay.get("updatedUtc"))
    _date(replay.get("requestedFromUtc"))
    if (updated-datetime.now(timezone.utc)).total_seconds()>600:
        raise ValueError("Upstream result is from the future")
    metrics=replay.get("metrics")
    if not isinstance(metrics,list) or len(metrics)!=len(EXPECTED):
        raise ValueError("Require all 192 results before publishing")
    seen=set()
    compact=[]
    for m in metrics:
        if not isinstance(m,dict):
            raise ValueError("Invalid source historical metric")
        key=(m.get("symbol"),m.get("timeframe"),m.get("experimentalPivotWidth"),m.get("split"))
        if key not in EXPECTED or key in seen:
            raise ValueError("Unexpected or duplicate variant/split")
        seen.add(key)
        if (type(m.get("frozenWatches")) is not int or
            type(m.get("resolvedWithinSplit")) is not int or
            not 0<=m["resolvedWithinSplit"]<=m["frozenWatches"]):
            raise ValueError("Invalid historical candidate counts")
        o=m.get("overlapAudit")
        if o is not None:
            if (not isinstance(o,dict) or o.get("realOrderFills")!=0 or
                o.get("independentEvidenceEstablished") is not False or
                type(o.get("nonOverlappingResolvedPaperOutcomes")) is not int or
                o["nonOverlappingResolvedPaperOutcomes"]>m["resolvedWithinSplit"]):
                raise ValueError("Malformed or promoted overlap research")
        compact.append({
            "symbol":m["symbol"],"timeframe":m["timeframe"],
            "pivotWidth":m["experimentalPivotWidth"],"split":m["split"],
            "frozenWatches":m["frozenWatches"],
            "resolved":m["resolvedWithinSplit"],
            "netBase":m.get("meanEstimatedNetRBase"),
            "netStress":m.get("meanEstimatedNetRStress"),
            "bootstrapLower":m.get("blockBootstrapOneSided95LowerBaseR"),
            "counts":m.get("outcomeCounts",{}),
            "overlapAudit":o
        })
    if seen!=EXPECTED:
        raise ValueError("Historical matrix not complete")
    coverage=replay.get("seriesCoverage")
    if (not isinstance(coverage,list) or len(coverage)!=32 or
        len({(c.get("symbol"),c.get("timeframe")) for c in coverage
             if isinstance(c,dict)})!=32):
        raise ValueError("Required real-candle coverage matrix incomplete")
    if (not isinstance(evidence,dict) or
        evidence.get("kind")!="EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1" or
        evidence.get("schema")!=1 or
        evidence.get("sourceReportUtc")!=replay.get("updatedUtc") or
        evidence.get("marketVenue")!="BINANCE_SPOT" or
        evidence.get("ordersEnabled") is not False or
        evidence.get("tradeAllowed") is not False or
        evidence.get("certifiedPositiveNetEVStrategies")!=0 or
        evidence.get("teacherApprovedStrategies")!=0 or
        evidence.get("realExecutionCount")!=0):
        raise ValueError("Evidence gate stale, inconsistent or unsupported")
    ec=evidence.get("historicalCoverage",{})
    if (ec.get("completedSeries")!=32 or
        ec.get("experimentalVariantsSeen")!=64 or
        ec.get("all32ChronologicalReplaysCompleted") is not True or
        ec.get("missingVariants")):
        raise ValueError("Evidence gate not complete")
    assessments=evidence.get("assessments")
    if not isinstance(assessments,list) or len(assessments)!=64:
        raise ValueError("Require all 64 evidence assessments")
    keys=set()
    mapped=[]
    for x in assessments:
        if not isinstance(x,dict):
            raise ValueError("Malformed evidence assessment")
        key=(x.get("symbol"),x.get("timeframe"),x.get("experimentalPivotWidth"))
        if (key in keys or key not in {(s,f,w) for s in SYMBOLS for f in FRAMES for w in WIDTHS}
            or x.get("ordersEnabled") is not False
            or x.get("tradeAllowed") is not False
            or x.get("eligibleForAutomatedTrading") is not False):
            raise ValueError("Unsafe or duplicated evidence assessment")
        keys.add(key)
        mapped.append({
            "symbol":key[0],"timeframe":key[1],"width":key[2],
            "status":x["status"],"reasons":x.get("reasons",[]),
            "sampleSize":x["sampleSize"],
            "netStressMeanR":x["netStressMeanR"],
            "holdout5thPercentileBaseR":x.get("holdout5thPercentileBaseR"),
            "gapFreeFiveYearDataVerified":x["gapFreeFiveYearDataVerified"]
        })
    statuses=evidence.get("verdictCounts",{})
    if sum(statuses.values())!=64:
        raise ValueError("Evidence status counts do not total 64")
    public={
        "schema":1,"kind":"EFLOUD_V2_PUBLIC_HISTORICAL_5Y_SNAPSHOT",
        "origin":"Cecenapo/efloud-ai-cloud",
        "engine":replay["engine"],"updatedUtc":replay["updatedUtc"],
        "requestedFromUtc":replay["requestedFromUtc"],
        "reportStatus":replay.get("reportStatus"),
        "historicalSeriesTested":32,
        "totalFrozenResearchWatches":replay["totalFrozenResearchWatches"],
        "reportedTimeframes":list(FRAMES),
        "availableTimeframes":list(FRAMES),
        "feeScenarioPct":replay["estimatedRoundTripCosts"],
        "teacherApprovedStrategies":0,
        "independentlyProvenStrategies":0,"realOrders":0,
        "complete32Series":True,
        "fiveYearsGapFree":replay.get("all32SeriesHaveUnbrokenFiveYearHistory") is True,
        "seriesStillMissing":[],"seriesCoverage":coverage,
        "errorsOrUnavailableSeries":replay.get("errorsOrUnavailableSeries",[]),
        "validationNote":"Developer hypotheses, historical simulated references only. "
             "No certified teacher setups, verified fills or guaranteed positive EV.",
        "metrics":compact
    }
    gate={
        "schema":1,"kind":"EFLOUD_447_RESEARCH_EVIDENCE_GATE_V1",
        "sourceReportUtc":evidence["sourceReportUtc"],
        "generatedUtc":evidence["generatedUtc"],
        "historicalCoverage":ec,
        "verdictCounts":statuses,
        "multipleTestingAdjusted95ConfidenceEstablished":
            evidence.get("multipleTestingAdjusted95ConfidenceEstablished"),
        "certifiedPositiveNetEVStrategies":0,
        "teacherApprovedStrategies":0,"realExecutionCount":0,
        "ordersEnabled":False,"tradeAllowed":False,
        "assessments":mapped
    }
    return public,gate


def _save(path:Path,value):
    temp=path.with_name(path.name+".tmp")
    temp.write_text(json.dumps(value,ensure_ascii=False,sort_keys=True,
                               indent=2,allow_nan=False)+"\n",encoding="utf-8")
    temp.replace(path)


def main():
    report=_fetch(REPLAY)
    evidence=_fetch(EVIDENCE)
    public,gate=project(report,evidence)
    before=ROOT/REPLAY
    if before.is_file():
        existing=json.loads(before.read_text(encoding="utf-8"))
        previous=existing.get("updatedUtc")
        if previous and _date(previous)>_date(public["updatedUtc"]):
            raise ValueError("Refuse to downgrade already-published research timestamp")
    _save(ROOT/REPLAY,public)
    _save(ROOT/EVIDENCE,gate)
    print(json.dumps({"origin":public["origin"],"timeUtc":public["updatedUtc"],
                     "series":32,"variants":64,
                     "overlapAudited":sum(bool(m["overlapAudit"]) for m in public["metrics"]),
                     "publishedRealTrades":0,"tradeAllowed":False}))
    return 0


if __name__=="__main__":
    raise SystemExit(main())
