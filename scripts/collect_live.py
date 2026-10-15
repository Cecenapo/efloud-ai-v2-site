#!/usr/bin/env python3
"""Public, unauthenticated Binance read-only live snapshot collector.

Runs periodically on GitHub Actions. NO user keys, trades, or model claims.
"""
import datetime as dt
import json
import os
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
SYMBOLS = ("BTCUSDT", "ETHUSDT", "SOLUSDT", "DODOUSDT")
BASE = "https://data-api.binance.vision"
UTC = dt.timezone.utc

def request_json(path, params):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    last_error = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "EfloudV2Research/1.0"})
            with urllib.request.urlopen(req, timeout=18) as res:
                return json.load(res)
        except (urllib.error.URLError, TimeoutError, ValueError) as err:
            last_error = err
            time.sleep(min(3, 0.6 * (attempt + 1)))
    raise RuntimeError(str(last_error))

def collect(fetch=request_json, clock=None):
    now = clock or dt.datetime.now(UTC)
    rows = {}
    for symbol in SYMBOLS:
        try:
            info = fetch("/api/v3/ticker/24hr", {"symbol": symbol})
            rows[symbol] = {
                "last_price": float(info["lastPrice"]),
                "change_24h_percent": float(info["priceChangePercent"]),
                "volume_base_24h": float(info["volume"]),
                "quote_volume_24h": float(info["quoteVolume"]),
                "observed_utc": now.isoformat().replace("+00:00", "Z"),
                "status": "OK",
            }
        except (RuntimeError, KeyError, ValueError, TypeError) as exc:
            rows[symbol] = {"status": "UNAVAILABLE", "reason": str(exc)[:110]}
    return {
        "schema": 1,
        "kind": "HOURLY_PUBLIC_PRICE_SNAPSHOT_NOT_ORDER_SIGNAL",
        "source": "Binance Spot market-data-only REST API",
        "fetched_utc": now.isoformat().replace("+00:00", "Z"),
        "symbols": rows,
        "note": "Hourly backup; browser streams live quotes while page is open. Public data may be regionally unavailable.",
    }

def main():
    result = collect()
    dest = ROOT / "live.json"
    content = json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False) + "\n"
    if dest.exists() and dest.read_text(encoding="utf8") == content:
        print("No change")
        return
    dest.write_text(content, encoding="utf8")
    print("Quote updates:", [(k, v["status"]) for k, v in result["symbols"].items()])

if __name__ == "__main__":
    main()
