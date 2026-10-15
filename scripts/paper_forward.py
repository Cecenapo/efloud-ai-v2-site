#!/usr/bin/env python3
"""Hourly causal shadow-trade learner for EFLOUD AI 2.0.

NO BROKER, NO LIVE ORDERS, NO VALIDATED SIGNALS. Register candidate research
events only if observed on a completed candle at the scheduled check; use the
public last-price snapshot as the hypothetical fill at observation time.
Then evaluate *future closed* OHLC only. Unresolved trades stay OPEN; outcomes
update each model's simple online EWMA only when matured.
"""
from __future__ import annotations
import datetime as dt
import hashlib
import json
import math
import pathlib
from research_engine import (
    ROOT, SYMBOLS, TIMEFRAMES, FAMILIES, ARMS,
    UTC, CLOSE_OUT, FEE, FRICTION,
    last_closed_candles, signals, indicators, arm_pass, utc_now, utc_text,
)

STATE_PATH=ROOT/"learning_state.json"
MAX_RECENT=1500
MAX_PENDING=400
MIN_R=.5
ALPHA=.05

def valid_quote(quote,now):
    if not isinstance(quote,dict) or quote.get("status")!="OK":return None
    try:
        observed=dt.datetime.fromisoformat(quote["observed_utc"].replace("Z","+00:00"))
        if not 0 <= (now-observed).total_seconds() <= 900:return None
        price=float(quote["last_price"])
        return price if math.isfinite(price) and price>0 else None
    except (KeyError,ValueError,TypeError):
        return None

def evaluate_pending(pending,bars,now):
    """No lookahead: only candles OPENING after the entry observation time."""
    start_ms=int(dt.datetime.fromisoformat(pending["observed_utc"].replace("Z","+00:00")).timestamp()*1000)
    direction=1 if pending["side"]=="LONG" else -1
    stop=pending["stop"]; target=pending["target"]; entry=pending["entry_exec"]
    risk=abs(entry-stop); outcome=None
    newer=[b for b in bars if b[0]>start_ms and b[5]<=int(now.timestamp()*1000)]
    for k,b in enumerate(newer):
        _,op,high,low,cl,_=b
        if direction==1:
            if op<=stop: raw=op;outcome="STOP_GAP"
            elif op>=target: raw=target;outcome="TP_GAP"
            elif low<=stop and high>=target: raw=stop;outcome="STOP_AMBIGUOUS"
            elif low<=stop: raw=stop;outcome="STOP"
            elif high>=target: raw=target;outcome="TP"
        else:
            if op>=stop: raw=op;outcome="STOP_GAP"
            elif op<=target: raw=target;outcome="TP_GAP"
            elif high>=stop and low<=target: raw=stop;outcome="STOP_AMBIGUOUS"
            elif high>=stop: raw=stop;outcome="STOP"
            elif low<=target: raw=target;outcome="TP"
        if outcome is None and k+1>=CLOSE_OUT:
            outcome="TIMEOUT";raw=cl
        if outcome:
            exit_exec=raw*(1-FRICTION*direction)
            net=(direction*(exit_exec-entry)-FEE*(entry+exit_exec))/risk
            return {"id":pending["id"],"symbol":pending["symbol"],"timeframe":pending["timeframe"],
                "family":pending["family"],"arm":pending["arm"],"side":pending["side"],
                "observed_utc":pending["observed_utc"],
                "signal_closed_utc":pending.get("signal_closed_utc"),
                "entry_exec":entry,"stop":stop,"target":target,
                "closed_utc":dt.datetime.fromtimestamp(b[5]/1000,UTC).isoformat(),
                "exit_exec":round(exit_exec,12),
                "evidence":pending.get("evidence"),
                "net_r":round(net,8),"outcome":outcome,"status":"CLOSED_SHADOW_SIMULATION",
                "no_real_order":True}
    return None

def evidence_at_signal(bars, i, family, side):
    """Freeze rule inputs on the actual completed signal candle for chart audit."""
    if i < 49:
        raise ValueError("Signal does not have required historical candles")
    last48 = bars[i-48:i]
    rh = max(b[2] for b in last48)
    rl = min(b[3] for b in last48)
    tr = [max(bars[k][2]-bars[k][3],
              abs(bars[k][2]-bars[k-1][4]),
              abs(bars[k][3]-bars[k-1][4]))
          for k in range(i-13, i+1)]
    atr = sum(tr)/len(tr)
    proof = {
        "as_of_close_ms": bars[i][5],
        "lookback_range_bars": 48,
        "range_high": rh,
        "range_low": rl,
        "equilibrium": (rh+rl)/2,
        "atr14": atr,
        "atr_safety_buffer": .15*atr,
        "signal_open": bars[i][1],
        "signal_high": bars[i][2],
        "signal_low": bars[i][3],
        "signal_close": bars[i][4],
        "rule_family": family,
        "direction": "LONG" if side == 1 else "SHORT",
        "scope": "observed_closed_binance_spot_candles",
        "is_research_hypothesis": True,
    }
    if family == "RANGE_BREAKOUT":
        proof["stop_rule"] = ("range_high - 0.15 ATR14" if side == 1
                              else "range_low + 0.15 ATR14")
        proof["target_rule"] = ("range_high + 0.55*(range_high-range_low)" if side == 1
                                else "range_low - 0.55*(range_high-range_low)")
    elif family == "RANGE_SWEEP_EQ":
        proof["sweep_wick"] = bars[i][3] if side == 1 else bars[i][2]
        proof["stop_rule"] = ("signal_low - 0.15 ATR14" if side == 1
                              else "signal_high + 0.15 ATR14")
        proof["target_rule"] = "(range_high + range_low)/2"
    elif family == "FVG_RETEST":
        b4,b2 = bars[i-4],bars[i-2]
        proof["fvg_lower"] = b4[2] if side == 1 else b2[2]
        proof["fvg_upper"] = b2[3] if side == 1 else b4[3]
        proof["stop_rule"] = ("fvg_prior_high - 0.15 ATR14" if side == 1
                              else "fvg_prior_low + 0.15 ATR14")
        proof["target_rule"] = "range_high" if side == 1 else "range_low"
    elif family == "OTE_RETRACEMENT":
        swing = bars[i-20:i]
        hi = max(b[2] for b in swing)
        lo = min(b[3] for b in swing)
        delta = hi-lo
        proof["swing_high"]=hi
        proof["swing_low"]=lo
        proof["ote_lower"]=hi-.786*delta if side == 1 else lo+.618*delta
        proof["ote_upper"]=hi-.618*delta if side == 1 else lo+.786*delta
        proof["stop_rule"]="swing_low - 0.15 ATR14" if side == 1 else "swing_high + 0.15 ATR14"
        proof["target_rule"]="swing_high" if side == 1 else "swing_low"
    return proof


def fresh_events(bars,price,symbol,tf,now):
    """Only final fully closed candle may become an hourly observed signal."""
    if len(bars)<1000:return []
    latest=bars[-1]
    # A stale final candle must not be presented as an immediate opportunity.
    if int(now.timestamp()*1000)-latest[5]>2*86400000:
        return []
    feature=indicators(bars)
    events=signals(bars)
    candidate=[]
    for family,rows in events.items():
        for i,side,stop,target in rows:
            if i != len(bars)-1:continue
            direction="LONG" if side==1 else "SHORT"
            exec_entry=price*(1+side*FRICTION)
            risk=side*(exec_entry-stop); reward=side*(target-exec_entry)
            if risk<=0 or reward<=0 or reward/risk<MIN_R:continue
            for arm in ARMS:
                if not arm_pass(arm,direction,i,feature):continue
                key=symbol+"|"+tf+"|"+family+"|"+arm+"|"+str(latest[0])
                identity=hashlib.sha256(key.encode("utf8")).hexdigest()[:20]
                candidate.append({
                    "id":identity,"symbol":symbol,"timeframe":tf,
                    "family":family,"arm":arm,"side":direction,
                    "observed_utc":utc_text(now),
                    "signal_closed_utc":dt.datetime.fromtimestamp(latest[5]/1000,UTC).isoformat(),
                    "entry_exec":round(exec_entry,12),"stop":stop,"target":target,
                    "evidence":evidence_at_signal(bars, i, family, side),
                    "original_r":risk,"status":"OPEN_SHADOW","order_placed":False,
                })
    return candidate

def update_learning(previous, feed, now=None):
    """Reproducible state transition; called by scheduled hourly workflow."""
    now=now or utc_now()
    state=previous if isinstance(previous,dict) else {}
    pending=list(state.get("pending",[]))
    outcomes=list(state.get("closed",[]))
    scores=dict(state.get("models",{}))
    known={t["id"] for t in pending+outcomes}
    backup=feed.get("symbols",{})
    ticks={}
    errors=[]
    for symbol in SYMBOLS:
        price=valid_quote(backup.get(symbol),now)
        if price is None:continue
        for tf in TIMEFRAMES:
            if tf in ("1w","1M"):continue # <1000 bars; cannot qualify.
            try:
                bars=last_closed_candles(symbol,tf,target=1000,now=now)
                ticks[(symbol,tf)]=bars
            except Exception as exc:
                errors.append({"symbol":symbol,"tf":tf,"error":str(exc)[:100]})
    new_pending=[]
    new_closed=[]
    for p in pending:
        bars=ticks.get((p["symbol"],p["timeframe"]))
        if not bars:
            new_pending.append(p);continue
        result=evaluate_pending(p,bars,now)
        if result:
            if result["id"] not in {x["id"] for x in outcomes+new_closed}:
                new_closed.append(result)
        else:
            new_pending.append(p)
    for entry in new_closed:
        key="|".join((entry["symbol"],entry["timeframe"],entry["family"],entry["arm"]))
        val=float(entry["net_r"])
        old=scores.get(key,{"closed_trades":0,"mean_net_r":0.0,"ewma_net_r":0.0})
        n=int(old["closed_trades"])+1
        mean=float(old["mean_net_r"])+(val-float(old["mean_net_r"]))/n
        ewma=val if n==1 else (1-ALPHA)*float(old["ewma_net_r"])+ALPHA*val
        scores[key]={"closed_trades":n,"mean_net_r":mean,
                     "ewma_net_r":ewma,"updated_utc":utc_text(now),
                     "validated":False}
    outcomes=(outcomes+new_closed)[-MAX_RECENT:]
    known.update(x["id"] for x in new_closed)
    for (symbol,tf),bars in ticks.items():
        price=valid_quote(backup[symbol],now)
        for entry in fresh_events(bars,price,symbol,tf,now):
            if entry["id"] not in known and len(new_pending)<MAX_PENDING:
                new_pending.append(entry); known.add(entry["id"])
    return {
       "schema":1,"kind":"HOURLY_CAUSAL_PAPER_SHADOW_LEARNER_NOT_LIVE_EXECUTION",
       "updated_utc":utc_text(now),
       "pending":new_pending,"closed":outcomes,"models":scores,
       "new_closed_this_cycle":len(new_closed),
       "tracked_open":len(new_pending),"tracked_closed":len(outcomes),
       "failed_feeds":errors,
       "auto_trade":False,"validated_edge_count":0,
       "warning":"Hourly observed shadow setups, simulated fills/slippage. Correlated variants are not independent. This is NOT execution-grade paper trading or statistically verified edge.",
    }

def main():
    if not (ROOT/"live.json").exists():
        print("Missing hourly public quote snapshot");return
    feed=json.loads((ROOT/"live.json").read_text(encoding="utf8"))
    old=json.loads(STATE_PATH.read_text(encoding="utf8")) if STATE_PATH.exists() else {}
    now=utc_now()
    updated=update_learning(old,feed,now)
    if not updated["models"] and not updated["pending"] and updated["failed_feeds"]:
        print("All markets unavailable, no state update");return
    STATE_PATH.write_text(json.dumps(updated,ensure_ascii=False,allow_nan=False,
                      separators=(",",":"))+"\n",encoding="utf8")
    print("Shadow learner: closed",updated["tracked_closed"],
          "new",updated["new_closed_this_cycle"],"open",updated["tracked_open"],
          "feed errors",len(updated["failed_feeds"]))

if __name__ == "__main__":
    main()
