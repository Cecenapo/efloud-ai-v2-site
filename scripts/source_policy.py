"""Source provenance contract for EFLOUD AI 2.0.

Based on the 44-lesson editorial educational atlas (13 Oct 2026).
The atlas explicitly marks suggested software recipes as RESEARCH HYPOTHESES,
NOT verbatim, instructor-verified automated trading rules.
Never turn a concept into an active trade without an independently approved
replay-tested complete entry / invalidation / target contract.
"""
VERSION = "source_guard_v3"
STATUS = "SOURCE_RULES_AWAITING_VERIFICATION"
SOURCE = "EFLOUD 44-lesson atlas, editorial collection (2026-10-13)"
LESSON_TOPICS = (
    ("range_rh_rl_eq", 3, "RH, RL, EQ; range anchored to identified structure"),
    ("sweep_deviation", 4, "Wick sweep versus close-based breakout"),
    ("breakout_origin", 6, "Breakout, retest, return-to-origin concepts"),
    ("ote", 10, "OTE 0.618–0.786 area, not automatic entry"),
    ("fvg", 13, "Distinguish three-candle FVG, real gap and liquidity void"),
    ("swing_structure", 14, "Major/minor confirmed swing; no future data"),
    ("order_blocks", 18, "Order block conceptual study, needs annotated source confirmation"),
    ("htf_ltf", 1, "Context and lower-timeframe confirmation requirements"),
)
# This is NOT a promise the recorded videos were all independently validated.
ACTIVE_SETUP_RULES = ()
SOURCE_VERIFIED_FULL_AUTOMATIC_RULES = 0
NO_TRADE_REASON = (
    "Video/source evidence does not specify a complete reproducible "
    "pivot selection + HTF/LTF trigger + entry + stop + target + fill contract. "
    "Do not manufacture parameters or trades."
)
UNSUPPORTED_AUTOMATIC_ASSUMPTIONS = (
    "48/180 fixed-bar range selection",
    "3-left/3-right pivot auto-confirmation and 8%-range clustering tolerance",
    "two pivot touches automatically constituting a range",
    "FVG-touch or OTE-band directional candle as standalone trade entry",
    "stochastic recent-3 flip, RSI 50 bias, CCI/MACD slope as entry filters",
    "0.5R minimum or 72-bar forced exit",
    "7.5bp fee, 5bp slippage/spread assumed to equal true net returns",
    "25-observation shrinkage weight and 30-trade release preselection",
    "six RedK arms times 1280 variants promoted as validated models",
)
def source_status():
    return {
        "rule_version": VERSION,
        "status": STATUS,
        "source": SOURCE,
        "approved_auto_setup_count": 0,
        "validated_trading_edge_count": 0,
        "real_orders_enabled": False,
        "concepts": [
            {"key": key, "lesson": lesson, "concept": desc,
             "classification": "SOURCE_CONCEPT_NOT_AUTOMATED_TRADE"}
            for key, lesson, desc in LESSON_TOPICS
        ],
        "disallowed_assumptions": list(UNSUPPORTED_AUTOMATIC_ASSUMPTIONS),
        "reason": NO_TRADE_REASON,
        "redk": (
            "RedK Pine Script oscillator sources are distinct user-supplied "
            "indicator material; oscillator signals were NOT established as "
            "EFLOUD teacher's trade-entry rules."
        )
    }
