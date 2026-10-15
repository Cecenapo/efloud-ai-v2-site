"""Document only explicit, already confirmed swing anchors. No auto signal.

EFLOUD lesson 3 teaches RH, RL and EQ; it does not give a universal pivot
selection function. Therefore candidate ranges are only constructed from
externally, explicitly chosen and time-stamped anchors. Automated detection
requires review of original teacher chart frames before implementation.
"""
from source_policy import VERSION, STATUS

def explained_range(upper, lower, upper_confirmed_at, lower_confirmed_at, asof):
    """Compute sourced EQ arithmetic without selecting any unknown pivots."""
    if None in (upper, lower, upper_confirmed_at, lower_confirmed_at, asof):
        raise ValueError("Both actual confirmed source anchors are required")
    high,low=float(upper),float(lower)
    if not 0<low<high:
        raise ValueError("Range high must exceed range low")
    if not (upper_confirmed_at<asof and lower_confirmed_at<asof):
        raise ValueError("Future-confirmed pivots cannot be used")
    return {"rh":high,"rl":low,"eq":(high+low)/2,
            "top_confirmed_at":upper_confirmed_at,
            "bottom_confirmed_at":lower_confirmed_at,
            "method_version":VERSION,
            "status":"DESCRIPTIVE_LEVELS_ONLY_NOT_TRADE_SIGNAL"}

def structural_events(bars, only_last=False):
    """No source-approved automatic swing/pivot selection or trade recipes."""
    return {}
