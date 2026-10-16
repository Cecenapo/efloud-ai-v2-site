#!/usr/bin/env python3
"""EFLOUD independent EXPERIMENTAL research lab, not instructor trading rules.

Strict separation:
 - EFLOUD teachings: qualitative swing structure / liquidity sweep concepts.
 - Every numerical pivot, lookback, horizon and fee value here: RESEARCH
   PARAMETER, tested and reported; NEVER presented as EFLOUD teacher's rule.
 - Forward observations are read-only, NOT orders, not claims of fills or PnL.
 - Historical entries occur AFTER the signal bar closes (next candle open).
 - Confirmed pivots require right-side bars CLOSED before a signal; no hindsight.
"""
from __future__ import annotations
import datetime as dt
import json
import math
import os
import pathlib
import statistics
import sys
from dataclasses import dataclass

sys.path.insert(0,str(pathlib.Path(__file__).resolve().parent))
from research_engine import ROOT, SYMBOLS, TIMEFRAMES, last_closed_candles, utc_now, utc_text

VERSION="independent_lab_v1"
PROVENANCE="INDEPENDENT_EXPERIMENT_NOT_EFLOUD_INSTRUCTOR_RULE"
PIVOT_VARIANTS=((2,2),(3,3),(4,4))
MIN_BARS=1000  # user-requested research input floor
# These are explicitly unverified sensitivity scenarios, not user's actual fees.
COST_BPS=(0,10,30)
MAX_HOLD_BARS=48  # finite test observation horizon, NOT educator exit rule
ENTRY_SLIPPAGE_BPS=0 # hypothetical next bar OPEN only, NOT actual execution
MAX_CANDIDATES=80

def candle(b):
    return (int(b[0]),float(b[1]),float(b[2]),float(b[3]),float(b[4]),int(b[5]))

def pivot_index(bars,left,right):
    """Produce extrema available only after their right-side candle closes."""
    highs=[];lows=[]
    for j in range(left,len(bars)-right):
        h=bars[j][2];lo=bars[j][3]
        if all(h>bars[k][2] for k in range(j-left,j)) and all(h>=bars[k][2] for k in range(j+1,j+right+1)):
            highs.append((j,j+right,h))
        if all(lo<bars[k][3] for k in range(j-left,j)) and all(lo<=bars[k][3] for k in range(j+1,j+right+1)):
            lows.append((j,j+right,lo))
    return highs,lows

def available(pivots,signal_index,lookback=180):
    # lookback bounds *search cost*; it is NOT a 180-candle range.
    return [p for p in pivots if p[1]<signal_index and p[0]>=signal_index-lookback]

def detect(bars,left,right,start=0):
    """Find two transparent and independently testable structural hypotheses.

    SWING_SWEEP: confirmed pivot wick sweep and reclaim by a closed candle,
      invalidation at that very candle's extremum; target = previously
      confirmed opposite swing, not arbitrary R multiple.
    PIVOT_BREAK: candle CLOSE crosses confirmed pivot; stop at prior opposing
      swing; target = older confirmed external liquidity pivot when available.
    Both require positive actual planned reward/risk; no minimum RR invented.
    """
    highs,lows=pivot_index(bars,left,right)
    out=[]
    for i in range(max(start,left+right+10),len(bars)):
        bar=bars[i];prev=bars[i-1];o,h,lo,cl=bar[1:5]
        hi=available(highs,i);low=available(lows,i)
        if not hi or not low:continue
        # candidate anchors were known strictly before observing the signal
        last_hi=hi[-1];last_lo=low[-1]
        pivs={"RH":{"value":last_hi[2],"pivot_i":last_hi[0],"confirmed_i":last_hi[1]},
              "RL":{"value":last_lo[2],"pivot_i":last_lo[0],"confirmed_i":last_lo[1]}}
        if pivs["RH"]["value"]<=pivs["RL"]["value"]:continue
        # True one-bar crossing: previous close must be on the inside.
        candidates=[]
        if prev[4]>=last_lo[2] and lo<last_lo[2] and cl>last_lo[2]:
            candidates.append(("SWING_SWEEP","LONG",lo,last_hi[2],"Wick swept confirmed swing low, closed back above it.", "Stop at signal wick low; breaks reclaim idea.","Previously confirmed opposite swing high."))
        if prev[4]<=last_hi[2] and h>last_hi[2] and cl<last_hi[2]:
            candidates.append(("SWING_SWEEP","SHORT",h,last_lo[2],"Wick swept confirmed swing high, closed back below it.","Stop at signal wick high; breaks reclaim idea.","Previously confirmed opposite swing low."))
        # Breakouts need an *older* confirmed external level known at the signal.
        if prev[4]<=last_hi[2] and cl>last_hi[2] and cl>o:
            levels=[p[2] for p in hi if p[2]>cl]
            if levels:candidates.append(("PIVOT_BREAK","LONG",last_lo[2],min(levels),"Closed above a confirmed swing high.","Stop at confirmed opposing swing low.","Closest known external swing high above price."))
        if prev[4]>=last_lo[2] and cl<last_lo[2] and cl<o:
            levels=[p[2] for p in low if p[2]<cl]
            if levels:candidates.append(("PIVOT_BREAK","SHORT",last_hi[2],max(levels),"Closed below a confirmed swing low.","Stop at confirmed opposing swing high.","Closest known external swing low below price."))
        for family,side,stop,target,event,why_stop,why_target in candidates:
            # Signal CLOSE is available. The actual next OPEN may invalidate
            # proposed entry; backtest checks using next bar opening only.
            indicative=cl
            if not (stop<indicative<target if side=="LONG" else target<indicative<stop):
                continue
            out.append({
                "i":i,"family":family,"side":side,"left":left,"right":right,
                "signal_closed_utc":dt.datetime.fromtimestamp(bar[5]/1000,dt.timezone.utc).isoformat(),
                "signal_open_ms":bar[0],"indicative_entry":indicative,
                "stop":stop,"target":target,"rh":pivs["RH"],"rl":pivs["RL"],
                "reasons":{"entry":event+" Planned entry: first price of NEXT candle; signal close is not a fill.",
                           "stop":why_stop,"target":why_target},
                "research_hypothesis":True,"source_class":PROVENANCE
            })
    return out

def simulate(bars,event,cost_bps=0,max_hold=MAX_HOLD_BARS):
    """Conservative historical OHLC test, no claim of actual fills.

    Filled next candle OPEN, if stop/target already passed: reject setup.
    If both crossed in one candle, assign STOP (worst case).
    Nominal risk = |entry-stop|; scenario cost round trip in entry-price units.
    """
    i=event["i"]; side=1 if event["side"]=="LONG" else -1
    if i+1>=len(bars):return None
    entry=bars[i+1][1];stop=event["stop"];target=event["target"]
    risk=abs(entry-stop)
    if risk<=0 or not (stop<entry<target if side==1 else target<entry<stop):
        return None
    end=min(len(bars),i+1+max_hold)
    if end<=i+1:return None
    exit_price=None;outcome="TIME_EXIT";exit_i=end-1
    for j in range(i+1,end):
        b=bars[j]
        stop_touch=(b[3]<=stop) if side==1 else (b[2]>=stop)
        target_touch=(b[2]>=target) if side==1 else (b[3]<=target)
        if stop_touch: # same bar both touched -> conservative stop first
            exit_price=stop;outcome="STOP";exit_i=j;break
        if target_touch:
            exit_price=target;outcome="TARGET";exit_i=j;break
    if exit_price is None:exit_price=bars[exit_i][4]
    gross=side*(exit_price-entry)/risk
    cost=(entry+exit_price)*(cost_bps/10000)/risk
    return {"net_r":gross-cost,"gross_r":gross,"cost_r":cost,
            "entry":entry,"exit":exit_price,"risk":risk,
            "entry_i":i+1,"exit_i":exit_i,"outcome":outcome,
            "cost_scenario_bps_round_trip":cost_bps}

def stats(trades):
    n=len(trades)
    if not n:return {"n":0,"mean_r":None,"win_rate":None,"max_drawdown_r":None,"lower_95_r":None}
    vals=[x["net_r"] for x in trades];mean=sum(vals)/n
    stderr=statistics.stdev(vals)/math.sqrt(n) if n>1 else float("inf")
    peak=0;equity=0;dd=0
    for x in vals:
        equity+=x;peak=max(peak,equity);dd=max(dd,peak-equity)
    return {"n":n,"mean_r":round(mean,5),"win_rate":round(sum(v>0 for v in vals)/n,4),
            "max_drawdown_r":round(dd,4),
            "lower_95_r":round(mean-1.96*stderr,5) if n>1 else None}

def evaluate(bars,events):
    """Chronological non-overlapping independent splits by ENTRY/EXIT index.

    Train 0-59%, validation 60-79%, untouched forward-like holdout 80-100%.
    A selected parameter has to be chosen WITHOUT peeking at holdout.
    All variants reported; no post-hoc selecting the best holdout.
    """
    n=len(bars);train_end=int(n*.6);val_end=int(n*.8)
    by_variant={}
    for e in events:
        key=(e["family"],e["side"],e["left"],e["right"])
        by_variant.setdefault(key,[]).append(e)
    reports=[]
    for (family,side,left,right),ev in sorted(by_variant.items()):
        splits={"train":[],"validation":[],"holdout":[]}
        for e in ev:
            # deterministic rollforward observation only, reject any trade
            # crossing split boundary, to avoid train/holdout leakage
            trial=simulate(bars,e,cost_bps=0)
            if not trial:continue
            a,b=trial["entry_i"],trial["exit_i"]
            split=("train" if b<train_end else
                   "validation" if a>=train_end and b<val_end else
                   "holdout" if a>=val_end else None)
            if split is None:continue
            splits[split].append((e,trial))
        validation_gross=[t for _,t in splits["validation"]]
        # Hypothesis is only *eligible for followup*, not validated profitability:
        # very conservative rule, and must pass both cost sensitivities, with
        # no optimization on holdout. Thresholds are experimental gate policy.
        val10=stats([simulate(bars,e,10) for e,_ in splits["validation"]])
        val30=stats([simulate(bars,e,30) for e,_ in splits["validation"]])
        qualifies=val10["n"]>=20 and val30["n"]>=20 and (
           val10["lower_95_r"] is not None and val10["lower_95_r"]>0 and
           val30["mean_r"] is not None and val30["mean_r"]>0)
        oos10=stats([simulate(bars,e,10) for e,_ in splits["holdout"]])
        oos30=stats([simulate(bars,e,30) for e,_ in splits["holdout"]])
        verified=qualifies and oos10["n"]>=20 and oos10["lower_95_r"] is not None and oos10["lower_95_r"]>0 and oos30["mean_r"]>0
        reports.append({
            "family":family,"side":side,"research_params":{"left":left,"right":right,
                "max_hold_bars":MAX_HOLD_BARS},
            "train":stats([simulate(bars,e,10) for e,_ in splits["train"]]),
            "validation_10bp":val10,"validation_30bp":val30,
            "holdout_10bp":oos10,"holdout_30bp":oos30,
            "independent_hypothesis":True,
            "gate":"HOLDOUT_PASSED_EXPERIMENTAL" if verified else
                "VALIDATION_ONLY_EXPERIMENTAL" if qualifies else "NO_EVIDENCE",
            "not_instructor_rule":True
        })
    return reports

def run_research(fetch=None,asof=None,limit=None,symbols=SYMBOLS,frames=TIMEFRAMES):
    asof=asof or utc_now()
    maxbars=limit or min(5000,max(1000,int(os.getenv("LAB_MAX_BARS","3000"))))
    reports=[];errors=[];total_events=0
    for symbol in symbols:
        for tf in frames:
            try:
                if fetch is None:
                    bars=last_closed_candles(symbol,tf,target=maxbars,now=asof)
                else:bars=fetch(symbol,tf,maxbars)
                bars=[candle(b) for b in bars]
                if len(bars)<MIN_BARS:
                    reports.append({"symbol":symbol,"timeframe":tf,"bars":len(bars),
                      "status":"NOT_ENOUGH_CLOSED_BARS","variants":[]})
                    continue
                events=[]
                for left,right in PIVOT_VARIANTS:events.extend(detect(bars,left,right))
                total_events+=len(events)
                variants=evaluate(bars,events)
                from redk_ablation import ablation_for
                redk=ablation_for(bars,events)
                reports.append({"symbol":symbol,"timeframe":tf,"bars":len(bars),
                   "status":"RESEARCHED_EXPERIMENTAL","event_count":len(events),
                   "first_closed_ms":bars[0][5],"last_closed_ms":bars[-1][5],
                   "variants":variants,"redk_ablation":redk})
            except Exception as exc:
                errors.append({"symbol":symbol,"timeframe":tf,"error":str(exc)[:200]})
                reports.append({"symbol":symbol,"timeframe":tf,"status":"ERROR","variants":[]})
    flat=[v for r in reports for v in r.get("variants",[])]
    redk_groups=sum(r.get("redk_ablation",{}).get("groups_tested",0) for r in reports)
    redk_trials=sum(r.get("redk_ablation",{}).get("arm_comparisons",0) for r in reports)
    return {
        "schema":1,"version":VERSION,"kind":"INDEPENDENT_HYPOTHESIS_RESEARCH_NOT_TEACHER_RULE",
        "generated_utc":utc_text(asof),"source_class":PROVENANCE,
        "symbols":list(symbols),"timeframes":list(frames),"input_min_bars":MIN_BARS,
        "cost_scenarios_bps_round_trip":list(COST_BPS),
        "cost_disclaimer":"10 and 30 bps are sensitivity scenarios, NOT actual Binance fees or slippage; no real fills.",
        "train_fraction":.6,"validation_fraction":.2,"holdout_fraction":.2,
        "candidate_events_backtested":total_events,"variant_results":len(flat),
        "experimental_holdout_passed":sum(v["gate"]=="HOLDOUT_PASSED_EXPERIMENTAL" for v in flat),
        "redk_ablation_version":"redk_ablation_v1",
        "redk_indicators_from_user_archive":True,
        "redk_group_comparisons":redk_groups,
        "redk_arm_comparisons":redk_trials,
        "redk_arms_including_baseline":["none","rsi_bias","stoch_flip_recent","cci_impulse","macd_expansion","rsi_macd_agree"],
        "redk_promoted_as_profitable":0,
        "source_verified_auto_rules":0,"real_orders":False,
        "reports":reports,"errors":errors,
        "notes":"OOS variants are statistical research findings, not verified instructor rules or live investment recommendations."
    }

def recent_observations(asof=None,fetch=None,symbols=SYMBOLS,frames=("5m","15m","1h","4h","6h","1d")):
    """Hourly read-only candidate radar; no orders, no automatic PnL credit."""
    asof=asof or utc_now();seen=[];errors=[]
    for symbol in symbols:
        for tf in frames:
            try:
                bars=(last_closed_candles(symbol,tf,target=400,now=asof) if fetch is None
                      else fetch(symbol,tf,400))
                bars=[candle(b) for b in bars]
                if len(bars)<200:continue
                # Only last completely closed candle is a fresh event.
                i=len(bars)-1
                from redk_features import feature_matrix, evaluate_at, INDICATOR_VERSION
                redk_features=feature_matrix(bars)
                for left,right in PIVOT_VARIANTS:
                    for event in detect(bars,left,right,start=i):
                        if event["i"]!=i:continue
                        redk_evidence=evaluate_at(redk_features,i,event["side"])
                        event={k:v for k,v in event.items() if k!="i"}
                        event["redk_indicator_version"]=INDICATOR_VERSION
                        event["redk_ablation_filters"]=redk_evidence
                        event["redk_gate_source"]="USER_UPLOADED_RED_K_AMPLIFIER_RESEARCH_NOT_TEACHER_RULE"
                        key=f"{symbol}:{tf}:{event['family']}:{event['side']}:{left}:{right}:{event['signal_open_ms']}"
                        seen.append({"id":key,"symbol":symbol,"timeframe":tf,
                           "observed_utc":utc_text(asof),"status":"EXPERIMENTAL_OBSERVATION_ONLY",
                           "can_trade":False,"order_placed":False,**event})
            except Exception as e:errors.append({"symbol":symbol,"timeframe":tf,"error":str(e)[:120]})
    return seen,errors

def write_research():
    result=run_research()
    # Full results are provided for audit, but compact JSON avoids wasting
    # GitHub Pages/mobile bandwidth due to indentation of nested evidence.
    (ROOT/"experimental_lab.json").write_text(
        json.dumps(result,separators=(",",":"),ensure_ascii=False,allow_nan=False)+"\n",encoding="utf8")
    # Public summary contains counts/validation; never post-select best OOS arm.
    from redk_features import ARMS,INDICATOR_VERSION
    aggregate={arm:{"groups_tested":0,"validation_groups_with_20plus":0,
                    "oos_groups_with_20plus":0,"oos_groups_positive_10bps":0,
                    "oos_groups_positive_30bps":0,"oos_groups_nominal_lower95_positive":0,
                    "oos_variant_observations":0,"validation_gate_groups":0}
               for arm in ARMS}
    for report in result.get("reports",[]):
        for group in report.get("redk_ablation",{}).get("groups",[]):
            for a in group.get("arms",[]):
                z=aggregate[a["arm"]]
                validation=a["validation"]["10bps"]
                oos=a["holdout"]["10bps"]
                stress=a["holdout"]["30bps"]
                z["groups_tested"]+=1
                z["validation_groups_with_20plus"]+=int(validation["n"]>=20)
                z["oos_groups_with_20plus"]+=int(oos["n"]>=20)
                z["oos_groups_positive_10bps"]+=int(oos["mean_r"] is not None and oos["mean_r"]>0)
                z["oos_groups_positive_30bps"]+=int(stress["mean_r"] is not None and stress["mean_r"]>0)
                z["oos_groups_nominal_lower95_positive"]+=int(oos["lower_95_r"] is not None and oos["lower_95_r"]>0)
                z["oos_variant_observations"]+=oos["n"]
                z["validation_gate_groups"]+=int(a["validation_gate"])
    summary={"schema":1,"version":"redk_ablation_v1","generated_utc":result["generated_utc"],
      "source":"User-provided RedK Indicator Amplifier / RedKTrader MPL-2.0",
      "indicator_version":INDICATOR_VERSION,
      "data_groups":len(result.get("reports",[])),
      "pa_historical_variant_events":result.get("candidate_events_backtested",0),
      "redk_group_comparisons":result.get("redk_group_comparisons",0),
      "redk_arm_comparisons":result.get("redk_arm_comparisons",0),
      "source_approved_models":0,"real_orders":False,
      "promoted_profitable_models":0,"data_errors":result.get("errors",[]),
      "arms":aggregate,
      "limitations":"Counts are overlapping variant observations, NOT independent trades. Positive means/nominal normal CI are not multiple-testing or serial-correlation adjusted. 10/30bp are hypothetical cost scenarios. No actual broker fills; no established improvement in future profitability."}
    (ROOT/"experimental_redk_summary.json").write_text(
        json.dumps(summary,ensure_ascii=False,indent=2,allow_nan=False)+"\n",encoding="utf8")
    print("Independent experimental research:",len(result["reports"]),"groups",
      result["candidate_events_backtested"],"historical events;",
      result["experimental_holdout_passed"],"holdout candidates; errors",len(result["errors"]))

def write_radar():
    path=ROOT/"experimental_radar.json"
    prior={}
    try:prior=json.loads(path.read_text(encoding="utf8"))
    except (OSError,ValueError):pass
    fresh,errors=recent_observations()
    # Historical study status is informative; never label an hourly observation
    # a verified educator rule or a filled order.
    study={}
    lab_redk={}
    try:
        lab=json.loads((ROOT/"experimental_lab.json").read_text(encoding="utf8"))
        if lab.get("version")==VERSION:
            study={
               (rep["symbol"],rep["timeframe"],v["family"],v["side"],
                v["research_params"]["left"],v["research_params"]["right"]):v
               for rep in lab.get("reports",[]) for v in rep.get("variants",[])
            }
            lab_redk={
              (rep["symbol"],rep["timeframe"],g["family"],g["side"],g["left"],g["right"]):
              {"version":rep["redk_ablation"]["version"],
               "arms":[{"arm":a["arm"],"n":a["holdout"]["10bps"]["n"],
                        "holdout_mean_r_10bps":a["holdout"]["10bps"]["mean_r"],
                        "holdout_lower95_10bps":a["holdout"]["10bps"]["lower_95_r"],
                        "holdout_mean_r_30bps":a["holdout"]["30bps"]["mean_r"],
                        "validation_gate":a["validation_gate"],
                        "promote_to_real":False} for a in g["arms"]]}
              for rep in lab.get("reports",[]) if rep.get("redk_ablation")
              for g in rep["redk_ablation"].get("groups",[])
            }
    except (OSError,ValueError,KeyError,TypeError):
        pass
    for candidate in fresh:
        v=study.get((candidate["symbol"],candidate["timeframe"],
             candidate["family"],candidate["side"],candidate["left"],candidate["right"]))
        candidate["historical_gate"]=v["gate"] if v else "NOT_YET_TESTED"
        candidate["historical_oos"]=v.get("holdout_10bp") if v else None
        candidate["stress_oos"]=v.get("holdout_30bp") if v else None
        candidate["research_policy"]="NEVER_AN_ORDER_RECOMMENDATION"
        candidate["redk_historical_ablation"]=(
           lab_redk.get((candidate["symbol"],candidate["timeframe"],
              candidate["family"],candidate["side"],candidate["left"],candidate["right"]))
           if isinstance(lab_redk,dict) else None)
    # Keep latest candidate each id for inspection; never imply fills.
    recorded={s["id"]:s for s in prior.get("observations",[]) if s.get("status")=="EXPERIMENTAL_OBSERVATION_ONLY"}
    for x in fresh:recorded[x["id"]]=x
    cutoff=utc_now()-dt.timedelta(hours=72)
    freshlist=[r for r in recorded.values() if dt.datetime.fromisoformat(r["observed_utc"].replace("Z","+00:00"))>=cutoff]
    freshlist.sort(key=lambda v:v["observed_utc"],reverse=True)
    output={"schema":1,"version":VERSION,"kind":"HOURLY_RESEARCH_RADAR_NO_ORDERS",
       "updated_utc":utc_text(utc_now()),"observations":freshlist[:MAX_CANDIDATES],
       "new_events":len(fresh),"errors":errors,"real_orders":False,
       "notice":"Independent experimental event detection, not EFLOUD instructor signal, validated edge or actual trade."}
    path.write_text(json.dumps(output,indent=2,ensure_ascii=False,allow_nan=False)+"\n",encoding="utf8")
    print("Radar independent hypotheses:",len(fresh),"new events, total",len(output["observations"]))

if __name__=="__main__":
    mode=sys.argv[1] if len(sys.argv)>1 else "daily"
    if mode=="daily":write_research()
    elif mode=="radar":write_radar()
    else:raise SystemExit("Usage: experimental_lab.py daily|radar")
