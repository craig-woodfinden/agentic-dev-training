# Three alerts every production agent needs

## 1. "Is anything on fire?" — error spike
- Trigger: error_rate > 5% over a rolling 5-minute window.
- Action: page on-call. Look at the latest failing trace.

## 2. "Are we hemorrhaging money?" — cost spike
- Trigger: cost in last hour > 2× the 7-day rolling average for the same hour-of-day.
- Action: notify (not page). Inspect tool-use rate and avg tokens-per-request.

## 3. "Did quality drop?" — eval / behaviour drift
Pick the strongest signal you can wire up:
- If evals run live: pass-rate drops below threshold.
- If not: tool_use_rate drops >30% (often means the model is short-circuiting).
- Action: notify. Compare last 24h of traces against a known-good baseline.
