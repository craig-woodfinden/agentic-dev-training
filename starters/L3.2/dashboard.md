# One-screen dashboard — required panels

Whatever tool you use (Grafana, Honeycomb, Langfuse, a Streamlit app fed by
the JSONL trace file), the dashboard must answer all six of these on one
screen, last 24 hours by default.

## Required panels

1. **Requests per hour** — single time-series chart.
2. **Median + p95 latency per step** — two lines per `kind` (model_call vs tool_call).
3. **Cost per request** — distribution + total cost today.
4. **Error rate** — % requests with `error != null`.
5. **Tool-use rate** — % of agent runs that called any tool.
6. **Top 10 slowest runs in the last 24h** — table, linked to trace.

## Useful exploratory queries

```sql
-- biggest cost run yesterday and why
SELECT trace_id, sum(cost_usd) AS total, count(*) AS steps
FROM agent_events
WHERE date(ts) = current_date - 1
GROUP BY trace_id
ORDER BY total DESC
LIMIT 1;

-- p95 latency by step kind, last 24h
SELECT kind, percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms)
FROM agent_events
WHERE ts > now() - interval '24 hours'
GROUP BY kind;
```
