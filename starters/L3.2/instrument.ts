/**
 * L3.2 starter -- minimal trace emitter.
 *
 * Wrap your agent steps with `span()` or use `withTrace()` on async functions.
 * Events go to stdout as JSON lines -- pipe them into Loki, Honeycomb, Langfuse, or a file:
 *
 *   npx ts-node your_agent.ts | tee traces.jsonl
 *
 * For real backends, swap `emit()` for an OpenTelemetry exporter or a Langfuse client.
 */
import { randomUUID } from "crypto";

interface TraceEvent {
  kind: string;
  latency_ms: number;
  error: string | null;
  [key: string]: unknown;
}

function emit(event: TraceEvent): void {
  process.stdout.write(JSON.stringify(event) + "\n");
}

export function withTrace<T>(
  kind: string,
  fields: Record<string, unknown>,
  fn: (traceId: string) => Promise<T>
): Promise<T> {
  const traceId = (fields.trace_id as string | undefined) ?? randomUUID();
  const t0 = Date.now();
  return fn(traceId)
    .then((result) => {
      emit({ kind, trace_id: traceId, latency_ms: Date.now() - t0, error: null, ...fields });
      return result;
    })
    .catch((err: Error) => {
      emit({ kind, trace_id: traceId, latency_ms: Date.now() - t0, error: err.message, ...fields });
      throw err;
    });
}

export function traceMethod(kind: string) {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    _target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const original = descriptor.value!;
    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      const t0 = Date.now();
      try {
        const result = await original.apply(this, args);
        emit({ kind, fn: propertyKey, latency_ms: Date.now() - t0, error: null });
        return result;
      } catch (err) {
        emit({ kind, fn: propertyKey, latency_ms: Date.now() - t0, error: String(err) });
        throw err;
      }
    } as T;
    return descriptor;
  };
}

// Example usage:
async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  const runId = randomUUID();
  await withTrace("agent_run", { trace_id: runId }, async (tid) => {
    await withTrace("model_call", { trace_id: tid, model: "claude-sonnet-4-6" }, async () => {
      await sleep(100);
    });
    await withTrace("tool_call", { trace_id: tid, tool: "read_file" }, async () => {
      await sleep(50);
    });
  });
})();
