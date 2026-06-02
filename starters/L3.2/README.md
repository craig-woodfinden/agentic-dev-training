# L3.2 starter
- `instrument.py` -- minimal trace emitter (decorator + context manager) writing JSONL to stdout.
- `dashboard.md` -- required panels + example queries.
- `alerts.md` -- the three alerts every production agent needs.
- Pipe traces to a file: `python your_agent.py | tee traces.jsonl`, or swap `emit()` for an OTel exporter / Langfuse client.
