#!/usr/bin/env python3
"""EFLOUD AI 2.0 public, scheduled, bounded Price Action/RedK research.

Explicit public-domain engineering hypotheses, NOT proprietary EFLOUD lessons.
Executes four genuinely mechanical price-action families x six indicator arms,
on available real, completed Binance Spot candles. Never places orders. No
claim that the other 16 event families or 7,680 recipes have been tested.
"""
from __future__ import annotations
import collections
import datetime as dt
import json
import math
import os
import pathlib
import statistics
import time
import urllib.error
import urllib.parse
import urllib.request

from collect_live import request_json

ROOT = pathlib.Path(__file__).resolve().parents[1]
SYMBOLS = ("BTCUSDT", "ETHUSDT", "SOLUSDT", "DODOUSDT")
TIMEFRAMES = ("5m", "15m", "1h", "4h", "6h", "1d", "1w", "1M")
FAMILIES = ("RANGE_SWEEP_EQ", "RANGE_BREAKOUT", "FVG_RETEST", "OTE_RETRACEMENT")
ARMS = ("none", "rsi_bias", "stoch_flip_recent", "cci_impulse", "macd_expansion", "rsi_macd_agree")
MAX_BARS = min(5000, max(1000, int(os.getenv("RESEARCH_MAX_BARS", "3000"))))
START_LOOKBACK = 50
FEE = 7.5 / 10000
FRICTION = (3.0 + 4.0 / 2) / 10000
CLOSE_OUT = 72
UTC = dt.timezone.utc

def utc_now():
    return dt.datetime.now(UTC)

def utc_text(value):
    return value.isoformat().replace("+00:00", "Z")

def last_closed_candles(symbol, timeframe, target=MAX_BARS, fetch=request_json, now=None):
    """Paginate backwards; excludes candles open at observed UTC time."""
    cutoff = int((now or utc_now()).timestamp() * 1000)
    cursor = cutoff
    combined = {}
    while len(combined) < target:
        take = min(1000, target - len(combined))
        batch = fetch("/api/v3/klines", {"symbol":symbol,"interval":timeframe,"limit":take,
                                         "endTime":cursor,"timeZone":"0"})
        if not isinstance(batch, list):
            raise ValueError("Non-list candle response")
        if not batch:
            break
        oldest = None
        for row in batch:
            if len(row) < 7:
                raise ValueError("Malformed candlestick")
            stamp = int(row[0]); close_stamp = int(row[6])
            oldest = stamp if oldest is None else min(oldest, stamp)
            if close_stamp >= cutoff:
                continue  # strictly completed candles
            values = tuple(float(row[j]) for j in (1,2,3,4))
            if not all(math.isfinite(x) and x>0 for x in values):
                raise ValueError("Invalid prices")
            o,h,l,c = values
            if h<max(o,c) or l>min(o,c) or l>h:
                raise ValueError("Invalid OHLC candle")
            combined[stamp] = (stamp,o,h,l,c,close_stamp)
        if oldest is None or oldest >= cursor:
            break
        cursor = oldest-1
        if len(batch)<take:
            break
        time.sleep(0.045)
    bars = [combined[k] for k in sorted(combined)]
    if not bars: return []
    if len(bars)>target: bars=bars[-target:]
    if any(bars[i+1][0]<=bars[i][0] for i in range(len(bars)-1)):
        raise ValueError("Out-of-order candles")
    return bars

def ema(values, period):
    alpha=2.0/(period+1)
    last=None; output=[]
    for v in values:
        last=v if last is None else last + alpha*(v-last)
        output.append(last)
    return output

def indicators(bars):
    """All indicator features calculated causally on closed candles only."""
    n=len(bars)
    closes=[b[4] for b in bars]
    highs=[b[2] for b in bars]; lows=[b[3] for b in bars]
    typical=[(highs[i]+lows[i]+closes[i])/3 for i in range(n)]
    rsi=[None]*n; stoch=[None]*n; cci=[None]*n
    delta=[closes[i]-closes[i-1] for i in range(1,n)]
    ag=al=0.0
    prev_k=None
    for i in range(n):
        if i == 14:
            ag=sum(max(x,0) for x in delta[:14])/14
            al=sum(max(-x,0) for x in delta[:14])/14
        elif i>14:
            change=delta[i-1]
            ag=(ag*13+max(change,0))/14
            al=(al*13+max(-change,0))/14
        if i>=14: rsi[i] = 100.0 if al==0 else 100.0-100.0/(1+ag/al)
        if i>=13:
            hh=max(highs[i-13:i+1]); ll=min(lows[i-13:i+1])
            stoch[i]=(closes[i]-ll)/(hh-ll)*100 if hh>ll else 50.
        if i>=19:
            window=typical[i-19:i+1]; avg=sum(window)/20
            dev=sum(abs(x-avg) for x in window)/20
            cci[i]=(typical[i]-avg)/(0.015*dev) if dev>0 else 0
    m12=ema(closes,12);m26=ema(closes,26)
    diff=[a-b for a,b in zip(m12,m26)]
    signal=ema(diff,9)
    hist=[a-b for a,b in zip(diff,signal)]
    return dict(rsi=rsi,stoch=stoch,cci=cci,macd=hist)

def arm_pass(arm,direction,i,f):
    if arm=="none":return True
    v=1 if direction=="LONG" else -1
    r=f["rsi"][i];s=f["stoch"][i];c=f["cci"][i];m=f["macd"][i]
    if arm=="rsi_bias":return r is not None and (r-50)*v>0
    if arm=="stoch_flip_recent":
        if i<3 or s is None:return False
        return (s-50)*v>0 and any(
            f["stoch"][k-1] is not None and (f["stoch"][k-1]-50)*v<=0
            and (f["stoch"][k]-50)*v>0 for k in range(i-2,i+1)
        )
    if arm=="cci_impulse":return c is not None and f["cci"][i-1] is not None and c*v>0 and (c-f["cci"][i-1])*v>0
    if arm=="macd_expansion":return i>26 and m*v>0 and (m-f["macd"][i-1])*v>0
    if arm=="rsi_macd_agree":return r is not None and i>26 and (r-50)*v>0 and m*v>0
    raise ValueError("Unknown filter")

def signals(bars):
    """Derive four different observable event families using historical bars."""
    n=len(bars);out={name:[] for name in FAMILIES}
    for i in range(START_LOOKBACK,n):
        row=bars[i];prev=bars[i-1]
        o,h,l,cl=row[1:5]; prevcl=prev[4]
        window=bars[i-48:i]
        rh=max(b[2] for b in window)
        rl=min(b[3] for b in window)
        eq=(rh+rl)/2
        tr=[max(b[2]-b[3],abs(b[2]-bars[j-1][4]),abs(b[3]-bars[j-1][4]))
            for j,b in ((j,bars[j]) for j in range(i-13,i+1))]
        atr=sum(tr)/len(tr)
        if atr<=0:continue
        if rl<=prevcl<=rh and l<rl and rl<cl<rh:
            out["RANGE_SWEEP_EQ"].append((i,1,l-0.15*atr,eq))
        if rl<=prevcl<=rh and h>rh and rl<cl<rh:
            out["RANGE_SWEEP_EQ"].append((i,-1,h+0.15*atr,eq))
        if prevcl<=rh and cl>rh and cl>o:
            out["RANGE_BREAKOUT"].append((i,1,rh-0.15*atr,rh+(rh-rl)*0.55))
        if prevcl>=rl and cl<rl and cl<o:
            out["RANGE_BREAKOUT"].append((i,-1,rl+0.15*atr,rl-(rh-rl)*0.55))
        # Standard 3-candle FVG formed two candles ago, now first possible retest.
        if bars[i-2][3] > bars[i-4][2] and l<=bars[i-2][3] and cl>bars[i-2][3]:
            out["FVG_RETEST"].append((i,1,bars[i-4][2]-0.15*atr,rh))
        if bars[i-2][2] < bars[i-4][3] and h>=bars[i-2][2] and cl<bars[i-2][2]:
            out["FVG_RETEST"].append((i,-1,bars[i-4][3]+0.15*atr,rl))
        swing=bars[i-20:i]
        top=max(b[2] for b in swing); bot=min(b[3] for b in swing)
        height=top-bot
        if height>0:
            if top-.786*height<=cl<=top-.618*height and cl>o:
                out["OTE_RETRACEMENT"].append((i,1,bot-0.15*atr,top))
            if bot+.618*height<=cl<=bot+.786*height and cl<o:
                out["OTE_RETRACEMENT"].append((i,-1,top+0.15*atr,bot))
    return out

def run_trades(bars,events,arm,features):
    """Next-bar open; original-risk R; first TP/SL touch frozen; no overlap."""
    result=[];next_allowed=0
    for i,direction,stop,target in events:
        if i+1>=len(bars) or i+1<next_allowed or not arm_pass(arm,"LONG" if direction==1 else "SHORT",i,features):
            continue
        open_px=bars[i+1][1]
        entry=open_px*(1+FRICTION*direction)
        risk=direction*(entry-stop);reward=direction*(target-entry)
        if risk<=0 or reward<=0 or reward/risk<.5 or not math.isfinite(reward/risk):continue
        exit_i=None;raw=None;kind=None
        for j in range(i+1,min(len(bars),i+1+CLOSE_OUT)):
            _,op,hi,lo,cl,_=bars[j]
            if direction==1:
                if op<=stop:raw=op;kind="STOP_GAP"
                elif op>=target:raw=target;kind="TP_GAP"
                elif lo<=stop and hi>=target:raw=stop;kind="STOP_AMBIGUOUS"
                elif lo<=stop:raw=stop;kind="STOP"
                elif hi>=target:raw=target;kind="TP"
            else:
                if op>=stop:raw=op;kind="STOP_GAP"
                elif op<=target:raw=target;kind="TP_GAP"
                elif hi>=stop and lo<=target:raw=stop;kind="STOP_AMBIGUOUS"
                elif hi>=stop:raw=stop;kind="STOP"
                elif lo<=target:raw=target;kind="TP"
            if kind:
                exit_i=j;break
        if kind is None:
            # Do NOT label an open position TIMEOUT simply because the
            # historical snapshot ends; only closed mature outcomes train.
            if i+CLOSE_OUT>=len(bars):
                continue
            exit_i=i+CLOSE_OUT
            raw=bars[exit_i][4]
            kind="TIMEOUT"
        actual=raw*(1-FRICTION*direction)
        net_r=(direction*(actual-entry)-FEE*(actual+entry))/risk
        if not math.isfinite(net_r):continue
        result.append({"signal":i,"entry":i+1,"exit":exit_i,
                       "net_r":net_r,"outcome":kind,
                       "exit_timestamp_ms":bars[exit_i][5]})
        next_allowed=exit_i+1
    return result

def stats(trades):
    v=[float(t["net_r"]) for t in trades]
    if not v:return {"n":0,"mean_net_r":None,"win_rate":None,"cum_net_r":0,"max_drawdown_r":None}
    cur=top=dd=0.0
    for x in v:
        cur+=x;top=max(top,cur);dd=max(dd,top-cur)
    return {"n":len(v),"mean_net_r":sum(v)/len(v),
            "win_rate":sum(x>0 for x in v)/len(v),"cum_net_r":cur,
            "max_drawdown_r":dd}

def shrinkage(trades,prior_weight=25):
    """Training-only conservative lower score. Not a calibrated probability."""
    v=[t["net_r"] for t in trades]
    if len(v)<30:return None
    mean=sum(v)/len(v)
    stdev=statistics.stdev(v) if len(v)>1 else 0
    lower=mean-1.96*(stdev/math.sqrt(len(v)))
    return lower*len(v)/(len(v)+prior_weight)

def research_one(bars,symbol,tf):
    events=signals(bars); features=indicators(bars)
    split=int(len(bars)*.7)
    outcomes=[]
    for family in FAMILIES:
        for arm in ARMS:
            trades=run_trades(bars,events[family],arm,features)
            train=[t for t in trades if t["exit"]<split]
            holdout=[t for t in trades if t["entry"]>=split]
            outcomes.append({
                "family":family,"arm":arm,
                "train":stats(train),"test":stats(holdout),
                "train_selection_lower_shrunk_r":shrinkage(train),
                "status":"NO_TRADE",
                "forward_closed_trades":0,
            })
    valid_training=[a for a in outcomes if a["train_selection_lower_shrunk_r"] is not None
                    and a["train_selection_lower_shrunk_r"]>0]
    # Select on TRAIN only; do not optimize using TEST labels.
    selection=max(valid_training,key=lambda a:a["train_selection_lower_shrunk_r"]) if valid_training else None
    return {
        "symbol":symbol,"timeframe":tf,"bars":len(bars),
        "first_open_utc":dt.datetime.fromtimestamp(bars[0][0]/1000,UTC).isoformat(),
        "last_close_utc":dt.datetime.fromtimestamp(bars[-1][5]/1000,UTC).isoformat(),
        "source":"Binance Spot completed OHLC",
        "executed_hypotheses":len(outcomes),
        "results":outcomes,
        "best_by_training_only":({
            "family":selection["family"],"arm":selection["arm"],
            "train_lower_shrunk_r":selection["train_selection_lower_shrunk_r"],
            "unselected_holdout_report":selection["test"],
            "allowed_to_recommend":False,
        } if selection else None),
        "status":"RESEARCH_ONLY_NO_TRADE",
        "limitations":["Hypotheses correlated; multiple-testing adjustment pending.",
            "Futures shorts hypothetically simulated on spot OHLC; cannot execute spot shorts.",
            "Costs are illustrative; no order-book or real fill data.",
            "No independent forward paper-trade sample."],
    }

def research_all(fetch=request_json, now=None, max_bars=MAX_BARS):
    asof=now or utc_now()
    reports=[];errors=[];completed=0
    for symbol in SYMBOLS:
        for tf in TIMEFRAMES:
            try:
                bars=last_closed_candles(symbol,tf,max_bars,fetch=fetch,now=asof)
                if len(bars)<1000:
                    reports.append({"symbol":symbol,"timeframe":tf,"bars":len(bars),
                          "status":"DATA_INSUFFICIENT","reason":"Minimum 1000 closed candles not available"})
                    continue
                report=research_one(bars,symbol,tf)
                reports.append(report);completed+=report["executed_hypotheses"]
            except (RuntimeError,ValueError,TypeError,IndexError,urllib.error.URLError) as exc:
                errors.append({"symbol":symbol,"timeframe":tf,"reason":str(exc)[:175]})
                reports.append({"symbol":symbol,"timeframe":tf,"status":"DATA_UNAVAILABLE"})
    return {
        "schema":1,
        "kind":"HISTORICAL_RESEARCH_NOT_LIVE_ORDERS",
        "generated_utc":utc_text(asof),
        "candidate_models":7680,
        "candidate_model_timeframe_trials":245760,
        "implemented_family_count":len(FAMILIES),
        "implemented_indicator_arms":len(ARMS),
        "actually_executed_backtests":completed,
        "symbols":list(SYMBOLS),"timeframes":list(TIMEFRAMES),
        "reports":reports,"errors":errors,
        "continuous_learning_mode":"scheduled daily full chronological recalibration from closed historical trades",
        "forward_paper_trades":0,
        "validated_signals":0,
        "trading_enabled":False,
        "caveat":"Public prototype: no 10-year multi-timeframe claim, independent edge proof, or trading signal.",
    }

def main():
    report=research_all()
    # Failure must not silently overwrite last successful research with an empty result.
    if report["actually_executed_backtests"]==0:
        (ROOT/"pipeline_status.json").write_text(json.dumps({
            "generated_utc":report["generated_utc"],"status":"SOURCE_UNAVAILABLE",
            "errors":report["errors"]},indent=2)+"\n",encoding="utf-8")
        raise SystemExit("No backtests executed: retained previous model_results.json")
    path=ROOT/"model_results.json"
    path.write_text(json.dumps(report,ensure_ascii=False,allow_nan=False,separators=(",",":"))+"\n",
                    encoding="utf-8")
    (ROOT/"pipeline_status.json").write_text(json.dumps({
        "generated_utc":report["generated_utc"],"status":"FINISHED",
        "backtests":report["actually_executed_backtests"],
        "errors":report["errors"]},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Actual backtests",report["actually_executed_backtests"],
          "missing feeds",len(report["errors"]))

if __name__ == "__main__":
    main()
