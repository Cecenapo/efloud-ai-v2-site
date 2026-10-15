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
from source_range import range_at, latest_swing, VERSION as RULE_VERSION
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
                "strategy_version":pending.get("strategy_version","legacy_48bar_atr"),
                "net_r":round(net,8),"outcome":outcome,"status":"CLOSED_SHADOW_SIMULATION",
                "no_real_order":True}
    return None

def evidence_at_signal(bars, i, family, side):
    """Save structural evidence known before/at signal CLOSE; no ATR stops.

    Source-supported concepts: confirmed pivots, contextual RH/RL/EQ, sweep
    versus breakout, structural invalidation. Implementation hyperparameters
    remain separately-labeled engineering research hypotheses.
    """
    rg=range_at(bars,i)
    sw=latest_swing(bars,i)
    p={
        "method_version":RULE_VERSION,
        "as_of_close_ms":bars[i][5],
        "rule_family":family,
        "direction":"LONG" if side==1 else "SHORT",
        "signal_open":bars[i][1],
        "signal_high":bars[i][2],
        "signal_low":bars[i][3],
        "signal_close":bars[i][4],
        "scope":"observed_closed_binance_spot_candles",
        "no_atr_stop":True,
        "rule_provenance":"EFLOUD chapters 3/4/14: concepts; structural detection is separately-testable ENGINEERING hypothesis",
    }
    if rg:
        p.update({"range_high":rg["high"],"range_low":rg["low"],
            "equilibrium":rg["eq"],"top_pivot_i":rg["top_pivot_i"],
            "bottom_pivot_i":rg["bottom_pivot_i"],
            "top_confirmed_i":rg["top_confirmed_i"],
            "bottom_confirmed_i":rg["bottom_confirmed_i"],
            "top_touch_count":rg["top_touch_count"],
            "bottom_touch_count":rg["bottom_touch_count"],
            "first_pivot_i":rg["first_pivot_i"],
            "range_age_bars_at_signal":i-rg["first_pivot_i"],
            "top_pivot_closed_ms":bars[rg["top_pivot_i"]][5],
            "bottom_pivot_closed_ms":bars[rg["bottom_pivot_i"]][5],
            "top_confirmed_closed_ms":bars[rg["top_confirmed_i"]][5],
            "bottom_confirmed_closed_ms":bars[rg["bottom_confirmed_i"]][5],
            "pivot_left":rg["pivot_left"],"pivot_right":rg["pivot_right"],
            "source_rule_status":rg["source_rule_status"]})
    if sw:
        p.update({"swing_high":sw["high"],"swing_low":sw["low"],
            "swing_high_pivot_i":sw["top_pivot_i"],
            "swing_low_pivot_i":sw["bottom_pivot_i"]})
    if family=="RANGE_SWEEP_EQ":
        p["stop_rule"]="beyond signal sweep wick (no ATR padding)"
        p["target_rule"]="midpoint of confirmed candidate range RH/RL"
    elif family=="RANGE_BREAKOUT":
        p["stop_rule"]="last confirmed opposing structural swing"
        p["target_rule"]="next previously confirmed external swing, if available"
    elif family=="FVG_RETEST":
        b4,b2=bars[i-4],bars[i-2]
        p["fvg_lower"]=b4[2] if side==1 else b2[2]
        p["fvg_upper"]=b2[3] if side==1 else b4[3]
        p["stop_rule"]="far FVG boundary (no ATR padding)"
        p["target_rule"]="confirmed structural opposing swing"
    elif family=="OTE_RETRACEMENT":
        if sw:
            top,bot=sw["high"],sw["low"]
            delta=top-bot
            p["ote_lower"]=top-.786*delta if side==1 else bot+.618*delta
            p["ote_upper"]=top-.618*delta if side==1 else bot+.786*delta
        p["stop_rule"]="confirmed structural swing extreme"
        p["target_rule"]="opposite confirmed structural swing extreme"
    return p


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
                    "strategy_version":RULE_VERSION,
                    "original_r":risk,"status":"OPEN_SHADOW","order_placed":False,
                })
    return candidate

def update_learning(previous, feed, now=None):
    """Reproducible state transition; called by scheduled hourly workflow."""
    now=now or utc_now()
    state=previous if isinstance(previous,dict) else {}
    pending=list(state.get("pending",[]))
    outcomes=list(state.get("closed",[]))
    historical_version=state.get("strategy_version")
    # Re-start learning independently; previous EMA evidence was produced by
    # the obsolete 48-bar and arbitrary ATR/target rules.
    scores=dict(state.get("models",{})) if historical_version==RULE_VERSION else {}
    legacy_models=state.get("legacy_models",{}) if historical_version==RULE_VERSION else dict(state.get("models",{}))
    for entry in pending+outcomes:
        entry.setdefault("strategy_version","legacy_48bar_atr")
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
        if entry.get("strategy_version")!=RULE_VERSION:
            # Legacy outcomes can still be audited on the site, but never
            # teach the updated structural-pivot research model.
            continue
        key="|".join((RULE_VERSION,entry["symbol"],entry["timeframe"],entry["family"],entry["arm"]))
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
       "strategy_version":RULE_VERSION,
       "legacy_hypotheses_preserved":True,
       "legacy_models":legacy_models,
       "pending":new_pending,"closed":outcomes,"models":scores,
       "legacy_open_count":sum(p.get("strategy_version")!=RULE_VERSION for p in new_pending),
       "legacy_closed_count":sum(p.get("strategy_version")!=RULE_VERSION for p in outcomes),
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
