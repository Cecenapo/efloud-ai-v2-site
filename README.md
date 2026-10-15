# EFLOUD AI 2.0 — Public Research Site

**Site:** https://cecenapo.github.io/efloud-ai-v2-site/

## Live and bounded research architecture

GitHub Pages serves static HTML, CSS, JavaScript and JSON. **It cannot host a permanent Python worker.** Instead, public GitHub Actions schedules read-only research and republishes aggregated JSON into Pages. Standard GitHub-hosted Actions minutes for public repositories are free according to GitHub billing documentation (abuse/time/rate limits still apply).

| Component | Runtime | Timing |
|---|---|---|
| Live price | Browser WebSocket from Binance data-stream.binance.vision | While a site tab is open and network works |
| Backup live price | Browser REST (data-api.binance.vision) | Every 60 seconds if streaming unavailable |
| Durable quote archive | `scripts/collect_live.py`, GitHub Actions | Hourly; cached `live.json` |
| Bounded shadow learner | `scripts/paper_forward.py`, GitHub Actions | Hourly; `learning_state.json` |
| Backtest and chronological re-calibration | `scripts/research_engine.py`, GitHub Actions | Daily; `model_results.json` & `pipeline_status.json` |

### Actual executed research

Initial completed run 15 October 2026: [Daily research run](https://github.com/Cecenapo/efloud-ai-v2-site/actions/runs/38739304758). **576 genuinely executed scenario backtests** from 4 deterministic Price Action hypothesis families × 6 RedK filter arms on 24 symbol-timeframe records with >=1000 closed Binance candles. Eight weekly/monthly symbol-timeframe records had fewer than 1000 candles and were marked DATA_INSUFFICIENT. This is not the full 7,680-recipe catalogue, not 245,760 executed tests, and not 10 years of history on every timeframe.

The four implemented research families are: Range Sweep EQ, Range Breakout, FVG Retest, Fibonacci OTE Retracement. Six ablation arms are unfiltered, RSI direction, Stochastic flip, CCI impulse, MACD histogram impulse and RSI+MACD agreement. The mechanics are research hypotheses, not literal certified trading techniques.

Chronological training/holdout 70/30 is shown. Selection uses training only. This is **not independent paper-forward evidence**. No automatic trade signals are approved.

### Hourly shadow learning

Signal candidates are registered **only after a candle is closed and when actually observed by the scheduled workflow**; their hypothetical fill is the public quote at detection time. From then on, only later *closed* candles may resolve TP, stop, ambiguous same-candle stop, or timeout. Outcomes are deduplicated, and an EWMA plus observed mean net-R is updated **only after closure**. OPEN outcomes must never be treated as training labels. The simulated fills are not brokerage records; open OHLC gaps, spread, fee assumptions, order book and latency are simplified. An hourly schedule misses some 5-minute events and must not be described as exhaustive forward trading.

### Reliability / cost controls

- Actions workflows `hourly-prices.yml` and `daily-research.yml`; only standard public-hosted Ubuntu runners.
- Binance public market-data-only API; no keys, no accounts, no exchange orders.
- Research daily capped at **3,000 completed candles per symbol/timeframe**; hourly at 1,000 candles per supported stream, with rate-aware request pacing. Insufficient historical coverage is reported, never filled with fake candles.
- GitHub Action runs may be delayed, disabled due inactivity, or fail due API outage. Check UTC update timestamps and GitHub Actions status.
- If API fails, historic reports remain marked stale; there is no fabricated quote or model result.
- Public repository contains only code appropriate for open publication and public market results — no 44-lesson source PDFs, user credentials, or private training materials.
- These are prototype research outputs, never financial advice, never trade placement.

## Test and run locally
```bash
PYTHONPATH=scripts python -m unittest discover -s scripts -p "test_*.py" -v
python scripts/collect_live.py
python scripts/paper_forward.py
RESEARCH_MAX_BARS=3000 python scripts/research_engine.py
```

## Evidence & automation
- [Hourly price snapshots](https://github.com/Cecenapo/efloud-ai-v2-site/actions/workflows/hourly-prices.yml)
- [Daily historical studies](https://github.com/Cecenapo/efloud-ai-v2-site/actions/workflows/daily-research.yml)

