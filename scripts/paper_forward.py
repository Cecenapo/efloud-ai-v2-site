#!/usr/bin/env python3
"""Hourly SOURCE-GATED state. No unverified strategies or fabricated PnL.

The Binance quote collector remains operational; this component only
documents the absence of approved automatic trade rules. No past experimental
shadow trades or invented fees/costs are counted as learned evidence.
"""
import datetime as dt
import json
from pathlib import Path
from source_policy import VERSION, source_status
from research_engine import ROOT, utc_now, utc_text

STATE_PATH=ROOT/"learning_state.json"

def update_learning(previous=None,feed=None,now=None):
    now=now or utc_now()
    # Deliberately ignore all prior speculative positions and learned weights.
    return {
        "schema":2,
        "kind":"SOURCE_GATED_NO_AUTOMATED_TRADE_OR_PNL",
        "updated_utc":utc_text(now),
        "strategy_version":VERSION,
        "approval":source_status(),
        "pending":[],"closed":[],"models":{},
        "new_closed_this_cycle":0,"tracked_open":0,"tracked_closed":0,
        "failed_feeds":[],
        "auto_trade":False,"validated_edge_count":0,
        "reason":"Complete source-confirmed signal, entry, structural stop and target rule not yet verified."
    }

def main():
    STATE_PATH.write_text(
        json.dumps(update_learning(),ensure_ascii=False,allow_nan=False,indent=2)+"\n",
        encoding="utf8"
    )
    print("Source guard active. No fabricated shadow signals and no assumed net R.")

if __name__=="__main__":
    main()
