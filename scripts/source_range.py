"""Source-auditable structural price range RESEARCH CANDIDATE.

Educational references: EFLOUD chapters 3 (RH/RL/EQ), 4 (deviation vs
breakout), 14 (pivot-confirmed-at). Source does NOT specify these algorithm
parameters; left/right, touch tolerance and search bound are transparent,
separately testable engineering research choices, NOT instructor rules.

No fixed 48-bar range and NO ATR in entry/stop/TP or invalidation.
All pivots must be confirmed BEFORE the signal candle is processed.
"""
from __future__ import annotations

PIVOT_LEFT = 3
PIVOT_RIGHT = 3
SEARCH_LIMIT = 180            # bounded computation; not a range length
CLUSTER_TOLERANCE = .08       # price-range fraction; unvalidated hypothesis
MIN_CONFIRMING_TOUCHES = 2   # per side, confirmed distinct pivots
VERSION = "pivot_range_research_v2"
RULE_STATUS = "ENGINEERING_HYPOTHESIS_NOT_VERIFIED_EFLOUD_AUTO_RULE"


def pivots_before(bars, signal_i, left=PIVOT_LEFT, right=PIVOT_RIGHT, limit=SEARCH_LIMIT):
    """Return confirmed (kind, pivot_index, confirmation_index, price).

    Ties are NOT extrema. Pivot at j becomes visible only when bar j+right
    closes; for a signal at index signal_i, confirmed_at must be < signal_i.
    """
    first=max(left,signal_i-limit)
    last=min(signal_i-right-1,len(bars)-right-1)
    out=[]
    for j in range(first,last+1):
        curr_h=bars[j][2]
        curr_l=bars[j][3]
        prev=bars[j-left:j]
        after=bars[j+1:j+right+1]
        if all(curr_h > b[2] for b in prev+after):
            out.append(("HIGH",j,j+right,curr_h))
        if all(curr_l < b[3] for b in prev+after):
            out.append(("LOW",j,j+right,curr_l))
    out.sort(key=lambda p:(p[2],p[1],p[0]))
    return out


def range_at(bars, signal_i, pivots=None):
    """Find a recent pivot-confirmed, repeatedly tested, bounded range candidate.

    This is not an instructor's fixed pivot algorithm. The pivot confirmation
    and repeated near-level tests prevent selecting an arbitrary last-N high
    and low retrospectively. We reject ambiguous/no-range candidates.
    """
    ps=pivots if pivots is not None else pivots_before(bars,signal_i)
    highs=[p for p in ps if p[0]=="HIGH"]
    lows=[p for p in ps if p[0]=="LOW"]
    if len(highs)<MIN_CONFIRMING_TOUCHES or len(lows)<MIN_CONFIRMING_TOUCHES:
        return None
    candidates=[]
    for hi in highs[-14:]:
        for lo in lows[-14:]:
            upper=hi[3]
            lower=lo[3]
            if upper<=lower or abs(hi[1]-lo[1])<4:
                continue
            size=upper-lower
            tol=size*CLUSTER_TOLERANCE
            compatible_h=[p for p in highs if abs(p[3]-upper)<=tol]
            compatible_l=[p for p in lows if abs(p[3]-lower)<=tol]
            if len(compatible_h)<MIN_CONFIRMING_TOUCHES or len(compatible_l)<MIN_CONFIRMING_TOUCHES:
                continue
            # Keep a coherent structure: the last prices prior to signal
            # remained inside, and high/low boundaries were repeatedly tested.
            anchor=min(hi[1],lo[1],compatible_h[-2][1],compatible_l[-2][1])
            confirming=max(hi[2],lo[2],compatible_h[-1][2],compatible_l[-1][2])
            if confirming >= signal_i or signal_i-anchor<8:
                continue
            # If price has already accepted outside, old range is invalid.
            check=bars[max(confirming+1,signal_i-3):signal_i]
            if not check or not all(lower<=b[4]<=upper for b in check):
                continue
            candidates.append({
                "high":upper,"low":lower,"eq":(upper+lower)/2,
                "top_pivot_i":hi[1],"bottom_pivot_i":lo[1],
                "top_confirmed_i":hi[2],"bottom_confirmed_i":lo[2],
                "first_pivot_i":anchor,
                "confirmed_at_i":confirming,
                "top_touch_count":len(compatible_h),
                "bottom_touch_count":len(compatible_l),
                "pivot_left":PIVOT_LEFT,"pivot_right":PIVOT_RIGHT,
                "search_limit":SEARCH_LIMIT,
                "touch_tolerance_range_fraction":CLUSTER_TOLERANCE,
                "method_version":VERSION,"source_rule_status":RULE_STATUS
            })
    if not candidates:
        return None
    # Chosen only by data available before signal candle.
    return max(candidates,key=lambda v:(v["confirmed_at_i"],v["top_pivot_i"]+v["bottom_pivot_i"]))


def latest_swing(bars, signal_i, pivots=None):
    """Most recently confirmed opposite-direction pivot pair."""
    ps=pivots if pivots is not None else pivots_before(bars,signal_i)
    highs=[p for p in ps if p[0]=="HIGH"]
    lows=[p for p in ps if p[0]=="LOW"]
    if not highs or not lows:
        return None
    high=highs[-1]
    low=lows[-1]
    if high[3]<=low[3] or high[1]==low[1]:
        return None
    return {
        "high":high[3],"low":low[3],
        "top_pivot_i":high[1],"bottom_pivot_i":low[1],
        "top_confirmed_i":high[2],"bottom_confirmed_i":low[2],
        "method_version":VERSION,
    }


def next_structure_target(bars, signal_i, threshold, side):
    """Next already-confirmed older liquidity swing BEYOND a broken boundary.

    If none exists, do not invent a projection (e.g. 0.55 x range).
    """
    ps=pivots_before(bars,signal_i,limit=720)
    if side==1:
        levels=[p[3] for p in ps if p[0]=="HIGH" and p[3]>threshold]
        return min(levels) if levels else None
    levels=[p[3] for p in ps if p[0]=="LOW" and p[3]<threshold]
    return max(levels) if levels else None


def structural_events(bars, only_last=False):
    """Return events compatible with the legacy research backtest tuple format.

    RANGE_SWEEP_EQ: wick below/above a *previously confirmed* range boundary,
    then closing back within it. Stop beyond the SIGNAL WICK without arbitrary
    ATR buffer. Target is the range's EQ, not an arbitrary R multiple.

    RANGE_BREAKOUT: close outside confirmed pivot-boundary and in direction;
    structural stop is last confirmed opposing swing if it is on the proper
    side of entry. TP must be another independently confirmed past swing
    outside range, otherwise abstain.

    FVG/OTE: independent engineering event definitions, not claimed to be
    instructor-verbatim algorithms. Both use structural invalidation ONLY.
    """
    out={"RANGE_SWEEP_EQ":[],"RANGE_BREAKOUT":[],"FVG_RETEST":[],"OTE_RETRACEMENT":[]}
    indices=range(max(32,len(bars)-1),len(bars)) if only_last else range(32,len(bars))
    for i in indices:
        row=bars[i]
        o,h,l,close=row[1:5]
        previous=bars[i-1][4]
        confirmed=pivots_before(bars,i)
        rg=range_at(bars,i,pivots=confirmed)
        sw=latest_swing(bars,i,pivots=confirmed)
        if rg:
            rh,rl,eq=rg["high"],rg["low"],rg["eq"]
            if rl<=previous<=rh and l<rl and rl<close<rh and l<eq:
                out["RANGE_SWEEP_EQ"].append((i,1,l,eq))
            if rl<=previous<=rh and h>rh and rl<close<rh and h>eq:
                out["RANGE_SWEEP_EQ"].append((i,-1,h,eq))
            if rl<=previous<=rh and close>rh and close>o:
                stop=sw["low"] if sw else None
                target=next_structure_target(bars,i,rh,1)
                if stop is not None and stop<rh and target is not None and target>close:
                    out["RANGE_BREAKOUT"].append((i,1,stop,target))
            if rl<=previous<=rh and close<rl and close<o:
                stop=sw["high"] if sw else None
                target=next_structure_target(bars,i,rl,-1)
                if stop is not None and stop>rl and target is not None and target<close:
                    out["RANGE_BREAKOUT"].append((i,-1,stop,target))
        # FVG retest: separate experimental geometry, stop at FVG's actual
        # structural far edge (not an ATR fraction), target confirmed swing.
        if sw and i>=4:
            b4,b2=bars[i-4],bars[i-2]
            if b2[3]>b4[2] and l<=b2[3] and close>b2[3]:
                if sw["high"]>close and b4[2]<close:
                    out["FVG_RETEST"].append((i,1,b4[2],sw["high"]))
            if b2[2]<b4[3] and h>=b2[2] and close<b2[2]:
                if sw["low"]<close and b4[3]>close:
                    out["FVG_RETEST"].append((i,-1,b4[3],sw["low"]))
        # OTE band from confirmed opposing structural pivots, not fixed last
        # 20 candles. This OTE event definition remains an ENGINEERING hypothesis.
        if sw:
            top,bot=sw["high"],sw["low"]
            height=top-bot
            if height>0:
                if top-.786*height<=close<=top-.618*height and close>o:
                    out["OTE_RETRACEMENT"].append((i,1,bot,top))
                if bot+.618*height<=close<=bot+.786*height and close<o:
                    out["OTE_RETRACEMENT"].append((i,-1,top,bot))
    return out
