"""
L2.4 starter -- run the same eval set against three models.

Builds on L2.3. Reads evals.csv, runs each row against Haiku, Sonnet, and Opus,
writes model_comparison.csv with pass rate, tokens, latency per model.

Update YOUR_PROMPT to match your L2.3 prompt.

Run:
  python compare_models.py
"""
import csv
import time
import anthropic

client = anthropic.Anthropic()

MODELS = ["claude-haiku-4-5", "claude-sonnet-4-6", "claude-opus-4-6"]

YOUR_PROMPT = (
    "Extract decisions, owners, and open questions from the text below. "
    "Return strict JSON only.\n\n"
    "TEXT:\n{input}"
)


def run(model: str, input_text: str) -> tuple[str, int, int, int]:
    t0 = time.time()
    resp = client.messages.create(
        model=model,
        max_tokens=512,
        messages=[{"role": "user", "content": YOUR_PROMPT.format(input=input_text)}],
    )
    ms = int((time.time() - t0) * 1000)
    return resp.content[0].text, resp.usage.input_tokens, resp.usage.output_tokens, ms


def grade(output: str, expected: str) -> bool:
    return expected.lower() in output.lower()


def main() -> None:
    with open("evals.csv", newline="") as f:
        rows = list(csv.DictReader(f))

    summary: dict[str, dict] = {m: {"passed": 0, "total": 0, "in": 0, "out": 0, "ms": []} for m in MODELS}

    with open("model_comparison.csv", "w", newline="") as out:
        w = csv.writer(out)
        w.writerow(["model", "category", "input", "passed", "in_tok", "out_tok", "ms", "output"])
        for row in rows:
            for m in MODELS:
                text, in_tok, out_tok, ms = run(m, row["input"])
                ok = grade(text, row["expected"])
                w.writerow([m, row["category"], row["input"], ok, in_tok, out_tok, ms, text])
                s = summary[m]
                s["total"] += 1
                s["passed"] += int(ok)
                s["in"] += in_tok
                s["out"] += out_tok
                s["ms"].append(ms)
                print(f"[{m:24}] {'PASS' if ok else 'FAIL'}  {ms}ms  {row['input'][:50]}")

    print("\n=== summary ===")
    for m in MODELS:
        s = summary[m]
        ms_med = sorted(s["ms"])[len(s["ms"]) // 2]
        print(f"{m:24}  pass {s['passed']}/{s['total']}  in {s['in']:>6} tok  out {s['out']:>6} tok  median {ms_med}ms")

    print("\nLook up pricing at https://docs.claude.com/en/docs/about-claude/pricing")
    print("Compute cost = (in_tok * input_price + out_tok * output_price) / 1_000_000")


if __name__ == "__main__":
    main()
