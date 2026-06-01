"""
L3.2 starter — minimal trace emitter.

Wrap your agent loop with `with span("step", trace_id=...):` or use
`@trace("model_call")` on functions. Events go to stdout as JSON lines —
pipe them into Loki, Honeycomb, Langfuse, or a file:

  python your_agent.py | tee traces.jsonl

For real backends, swap `emit()` for an OpenTelemetry exporter or a
Langfuse client.
"""
import json
import sys
import time
import uuid
from contextlib import contextmanager
from functools import wraps


def emit(event: dict) -> None:
    sys.stdout.write(json.dumps(event) + "\n")
    sys.stdout.flush()


def trace(kind: str):
    def deco(fn):
        @wraps(fn)
        def wrap(*args, **kwargs):
            t0 = time.time()
            try:
                out = fn(*args, **kwargs)
                emit({
                    "kind": kind,
                    "fn": fn.__name__,
                    "latency_ms": int((time.time() - t0) * 1000),
                    "error": None,
                })
                return out
            except Exception as e:
                emit({
                    "kind": kind,
                    "fn": fn.__name__,
                    "latency_ms": int((time.time() - t0) * 1000),
                    "error": str(e),
                })
                raise
        return wrap
    return deco


@contextmanager
def span(kind: str, **fields):
    t0 = time.time()
    trace_id = fields.get("trace_id") or str(uuid.uuid4())
    try:
        yield trace_id
        emit({"kind": kind, "trace_id": trace_id, "latency_ms": int((time.time() - t0) * 1000), "error": None, **fields})
    except Exception as e:
        emit({"kind": kind, "trace_id": trace_id, "latency_ms": int((time.time() - t0) * 1000), "error": str(e), **fields})
        raise


# Example usage:
if __name__ == "__main__":
    with span("agent_run", trace_id=str(uuid.uuid4())) as tid:
        with span("model_call", trace_id=tid, model="claude-sonnet-4-6"):
            time.sleep(0.1)
        with span("tool_call", trace_id=tid, tool="read_file"):
            time.sleep(0.05)
