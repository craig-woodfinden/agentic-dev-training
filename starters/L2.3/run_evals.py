"""
L2.3 starter — minimal eval runner.

Reads evals.csv with columns: category, input, expected.
Runs your prompt over each row. Writes results.csv with pass/fail.

Edit YOUR_PROMPT below to be the prompt you're testing.

Run:
  python run_evals.py
"""
import csv
import sys
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-haiku-4-5"

YOUR_PROMPT = (
    "Extract decisions, owners, and open questions from the text below. "
    "Return strict JSON only.\n\n"
    "TEXT:\n{input}"
)


def run_prompt(input_text: str) -> str:
    resp = client.messages.create(
        model=MODEL,
        max_tokens=512,
        messages=[{"role": "user", "content": YOUR_PROMPT.format(input=input_text)}],
    )
    return resp.content[0].text


def grade(output: str, expected: str, category: str) -> bool:
    """Substring grade — simple on purpose. Upgrade to LLM-as-judge in L3.4."""
    return expected.lower() in output.lower()


def main() -> None:
    try:
        with open("evals.csv", newline="") as f:
            rows = list(csv.DictReader(f))
    except FileNotFoundError:
        print("No evals.csv in cwd. Copy evals.example.csv and edit.")
        sys.exit(1)

    passed = total = 0
    with open("results.csv", "w", newline="") as out:
        w = csv.writer(out)
        w.writerow(["category", "input", "expected", "passed", "output"])
        for row in rows:
            output = run_prompt(row["input"])
            ok = grade(output, row["expected"], row["category"])
            w.writerow([row["category"], row["input"], row["expected"], ok, output])
            total += 1
            passed += int(ok)
            print(f"[{'PASS' if ok else 'FAIL'}] {row['category']:14} {row['input'][:60]}")

    print(f"\n{passed}/{total} passed ({100*passed/total:.0f}%)")


if __name__ == "__main__":
    main()
