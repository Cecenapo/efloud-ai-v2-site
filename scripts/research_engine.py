#!/usr/bin/env python3
"""Source-gated market data coverage, NOT speculative trade backtesting.

All historical OHLC values are real closed Binance Spot candles. No arbitrary
pivot, FVG, OTE, RedK entry, fee, stop/TP, or confidence threshold creates a
simulated trade. The 1000-bar minimum is the USER's requested data-quality
floor, not a trading signal or instructor rule.
"""
from __future__ import annotations
import datetime as dt
import json
import math
import os
import pathlib
import time
import urllib.error
from collect_live import request_json
from source_policy import VERSION, source_status

ROOT=pathlib.Path(__file__).resolve().parents[1]
SYMBOLS=("BTCUSDT","ETHUSDT","SOLUSDT","DODOUSDT")
TIMEFRAMES=("5m","15m","1h","4h","6h","1d","1w","1M")
MAX_BARS=min(5000,max(1000,int(os.getenv("RESEARCH_MAX_BARS","3000"))))
DATA_QUALITY_MIN_BARS=1000
UTC=dt.timezone.utc

def utc_now(): return dt.datetime.now(UTC)
def utc_text(value): return value.isoformat().replace("+00:00","Z")

def last_closed_candles(symbol,timeframe,target=MAX_BARS,fetch=request_json,now=None):
    """Paginate actual Binance historical candles without lookahead."""
    if symbol not in SYMBOLS or timeframe not in TIMEFRAMES:
        raise ValueError("Unknown symbol/timeframe")
    cutoff=int((now or utc_now()).timestamp()*1000)
    cursor=cutoff;combined={}
    while len(combined)<target:
        take=min(1000,target-len(combined))
        batch=fetch("/api/v3/klines",{"symbol":symbol,"interval":timeframe,
                                    "limit":take,"endTime":cursor,"timeZone":"0"})
        if not isinstance(batch,list): raise ValueError("Non-list candle response")
        if not batch: break
        oldest=None
        for row in batch:
            if len(row)<7: raise ValueError("Malformed candle")
            stamp=int(row[0]);close_stamp=int(row[6])
            oldest=stamp if oldest is None else min(oldest,stamp)
            if close_stamp>=cutoff:continue
            o,h,l,c=[float(row[j]) for j in (1,2,3,4)]
            if not all(math.isfinite(x) and x>0 for x in (o,h,l,c)):
                raise ValueError("Invalid prices")
            if h<max(o,c) or l>min(o,c) or l>h:
                raise ValueError("Invalid OHLC geometry")
            combined[stamp]=(stamp,o,h,l,c,close_stamp)
        if oldest is None or oldest>=cursor:break
        cursor=oldest-1
        if len(batch)<take:break
        time.sleep(.045) # public Binance API rate pacing; not source-trading rule
    return [combined[k] for k in sorted(combined)][-target:]

def inspect_history(bars,symbol,tf):
    return {
        "symbol":symbol,"timeframe":tf,"bars":len(bars),
        "first_open_utc":dt.datetime.fromtimestamp(bars[0][0]/1000,UTC).isoformat() if bars else None,
        "last_close_utc":dt.datetime.fromtimestamp(bars[-1][5]/1000,UTC).isoformat() if bars else None,
        "source":"Binance Spot CLOSED OHLC",
        "status":"DATA_READY_FOR_FUTURE_SOURCE_VALIDATION" if len(bars)>=DATA_QUALITY_MIN_BARS else "DATA_INSUFFICIENT",
        "minimum_bars_requested_by_user":DATA_QUALITY_MIN_BARS,
        "completed_strategy_backtests":0,
        "strategy_rules":"UNVERIFIED — no automatic trades or profit simulation",
    }

def research_all(fetch=request_json,now=None,max_bars=MAX_BARS):
    asof=now or utc_now()
    reports=[];errors=[]
    for symbol in SYMBOLS:
        for tf in TIMEFRAMES:
            try:
                bars=last_closed_candles(symbol,tf,target=max_bars,fetch=fetch,now=asof)
                reports.append(inspect_history(bars,symbol,tf))
            except (ValueError,RuntimeError,TypeError,IndexError,urllib.error.URLError) as exc:
                msg={"symbol":symbol,"timeframe":tf,"reason":str(exc)[:175]}
                errors.append(msg)
                reports.append({"symbol":symbol,"timeframe":tf,"status":"DATA_UNAVAILABLE",
                                "completed_strategy_backtests":0})
    return {
        "schema":2,"kind":"SOURCE_GATED_REAL_MARKET_DATA_AUDIT",
        "generated_utc":utc_text(asof),
        "model_rule_version":VERSION,
        "approval":source_status(),
        "symbols":list(SYMBOLS),"timeframes":list(TIMEFRAMES),
        "data_checks_performed":len(reports),
        "adequate_history_count":sum(r["status"]=="DATA_READY_FOR_FUTURE_SOURCE_VALIDATION" for r in reports),
        "actually_executed_backtests":0,
        "candidate_models":0,
        "validated_signals":0,
        "forward_paper_trades":0,
        "trading_enabled":False,
        "reports":reports,"errors":errors,
        "caveat":"No source-confirmed entry, stop, target and fill contract; not a strategy test."
    }

def main():
    report=research_all()
    status={"generated_utc":report["generated_utc"],
            "status":"SOURCE_RULES_AWAITING_VERIFICATION",
            "data_checks_performed":report["data_checks_performed"],
            "adequate_history_count":report["adequate_history_count"],
            "completed_backtests":0,
            "model_rule_version":VERSION,
            "errors":report["errors"]}
    (ROOT/"model_results.json").write_text(
        json.dumps(report,ensure_ascii=False,allow_nan=False,indent=2)+"\n",encoding="utf8")
    (ROOT/"pipeline_status.json").write_text(
        json.dumps(status,ensure_ascii=False,allow_nan=False,indent=2)+"\n",encoding="utf8")
    print("Real data groups",report["data_checks_performed"],
          "sufficient",report["adequate_history_count"],
          "source-approved trading backtests ZERO")
if __name__=="__main__":
    main()
