"""RedK Amplifier independent ablation on SAME experimental price-action events.

The user-supplied RedK archive contains six research arms (including
"none" baseline). The oscillator formulas and masks are in redk_features.py.
All indicators evaluated ONLY on signal bar close. Next-bar-open entries,
conservative stop-first same-bar OHLC, and chronological split share the
base experimental_lab contract. Fees 0/10/30 bps are SENSITIVITY SCENARIOS,
not exchange-realistic measured costs; no live fills or orders.
"""
from __future__ import annotations
from collections import defaultdict
from redk_features import ARMS, INDICATOR_VERSION, feature_matrix, masks

VERSION="redk_ablation_v1"
ARMS_SOURCE="User supplied RedK Amplifier archive, MPL-2.0 © RedKTrader"
MINIMUM_VALIDATION_TRADES=20
MINIMUM_HOLDOUT_TRADES=20

def _split_trade(bars,trade):
    n=len(bars);train=int(n*.6);validation=int(n*.8)
    a,b=trade["entry_i"],trade["exit_i"]
    if b<train:return "train"
    if a>=train and b<validation:return "validation"
    if a>=validation:return "holdout"
    return None

def ablation_for(bars,events):
    """Compare five RedK filter arms to the *same-event* no-filter baseline.

    Disclosed multiple-comparison / dependence caveat: nominal confidence
    bounds assume independent events, which consecutive overlapping setups
    generally violate. "promote_to_real" ALWAYS false. Holdout never used
    to choose a filter. Stratification is per PA family/side/pivot L/R.
    """
    from experimental_lab import simulate,stats
    features=feature_matrix(bars)
    gate_cache={side:masks(features,side) for side in ("LONG","SHORT")}
    groups=defaultdict(list)
    for e in events:
        groups[(e["family"],e["side"],e["left"],e["right"])].append(e)
    report=[]
    for (family,side,left,right),evs in sorted(groups.items()):
        comparisons={}
        raw_entries=[]
        for e in evs:
            # Compute the base trade once per PA event (not for each arm).
            t=simulate(bars,e,cost_bps=0)
            if t is None:continue
            partition=_split_trade(bars,t)
            if partition is None:continue
            raw_entries.append((e,t,partition))
        for arm in ARMS:
            allowed=gate_cache[side][arm]
            filtered=[(e,t,k) for e,t,k in raw_entries if bool(allowed[e["i"]])]
            stats_by_period={}
            for period in ("train","validation","holdout"):
                subset=[t for _,t,k in filtered if k==period]
                stats_by_period[period]={}
                for bps in (0,10,30):
                    scenarios=[]
                    for t in subset:
                        # Same historical simulated entry/exit, only
                        # round-trip hypothetical cost scenario differs.
                        points=(t["entry"]+t["exit"])*(bps/10000)/t["risk"]
                        scenarios.append({"net_r":t["gross_r"]-points})
                    stats_by_period[period][str(bps)+"bps"]=stats(scenarios)
            val=stats_by_period["validation"]["10bps"]
            hold=stats_by_period["holdout"]["10bps"]
            # Compare to baseline only; do not select by holdout mean.
            comparisons[arm]={
                "arm":arm,"n_eligible_total":len(filtered),
                "n_base_events":len(raw_entries),
                "pass_rate":round(len(filtered)/len(raw_entries),4) if raw_entries else None,
                "train":stats_by_period["train"],
                "validation":stats_by_period["validation"],
                "holdout":stats_by_period["holdout"],
                "validation_gate":bool(val["n"]>=MINIMUM_VALIDATION_TRADES and
                  val["lower_95_r"] is not None and val["lower_95_r"]>0 and
                  stats_by_period["validation"]["30bps"]["mean_r"] is not None and
                  stats_by_period["validation"]["30bps"]["mean_r"]>0),
                "promote_to_real":False
            }
        base=comparisons["none"]
        for arm,result in comparisons.items():
            other=result["holdout"]["10bps"]
            baseline=base["holdout"]["10bps"]
            result["holdout_mean_r_difference_vs_unfiltered"]=(
                round(other["mean_r"]-baseline["mean_r"],5)
                if other["mean_r"] is not None and baseline["mean_r"] is not None else None)
            result["additional_caveat"]="Comparison is on a filtered SUBSET; higher average R may reflect selection/sample changes rather than a real edge."
        report.append({
            "family":family,"side":side,"left":left,"right":right,
            "baseline_event_count":len(raw_entries),
            "arms":[comparisons[arm] for arm in ARMS],
            "selected_arm":"none",  # No OOS-based picking; no live deployment.
            "holdout_used_for_selection":False
        })
    return {
        "version":VERSION,"indicator_source":ARMS_SOURCE,
        "indicator_version":INDICATOR_VERSION,
        "research_only":True,"source_approved_trade_rules":0,
        "real_orders":False,"promoted_models":0,
        "cost_scenarios_round_trip_bps":[0,10,30],
        "statistics_warning":"Nominal 95% normal bounds do not correct for serial dependence, multiple trials or model selection. Do not infer profitable future trading.",
        "groups":report,
        "tested_filter_arms":list(ARMS),
        "groups_tested":len(report),
        "arm_comparisons":sum(len(g["arms"]) for g in report)
    }
