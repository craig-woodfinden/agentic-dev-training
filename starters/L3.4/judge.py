"""
L3.4 starter -- LLM-as-judge eval runner.

Reads evals.csv with columns: category, input, expected_or_rubric, grader.
- grader=substring: simple contains-check (cheap, deterministic)
- grader=judge: send to a judge model with a rubric, expect 0/1/2 score

Run:
  python judge.py --threshold 0.85
Exit code 1 if below threshold -- wire this into CI.
"""
import argparse
import csv
import json
import sys
import anthropic

client = anthropic.Anthropic()

CANDIDATE_MODEL = "claude-haiku-4-5"
JUDGE_MODEL = "claude-sonnet-4-6"  # NOT Haiku -- too lenient as a judge

YOUR_PROMPT = (
    "Extract decisions, owners, and open questions from the text below. "
    "Return strict JSON only.\n\n"
    "TEXT:\n{input}"
)

JUDGE_PROMPT = """You are grading a model's output. Be strict.

Question to the model:
{input}

Rubric for a good answer:
{rubric}

Model output:
{output}

Reply with strict JSON only:
{{"score": <0|1|2>, "reason": "<one sentence>"}}

0 = wrong or misses the point. 1 = partially right. 2 = correct and well-formed.
"""


def run_candidate(input_text: str) -> str:
    resp = client.messages.create(
        model=CANDIDATE_MODEL,
        max_tokens=512,
        messages=[{"role": "user", "content": YOUR_PROMPT.format(input=input_text)}],
    )
    return resp.content[0].text


def grade_substring(output: str, expected: str) -> int:
    return 2 if expected.lower() in output.lower() else 0


def grade_judge(input_text: str, rubric: str, output: str) -> tuple[int, str]:
    resp = client.messages.create(
        model=JUDGE_MODEL,
        max_tokens=200,
        messages=[{"role": "user", "content": JUDGE_PROMPT.format(input=input_text, rubric=rubric, output=output)}],
    )
    text = resp.content[0].text.strip()
    try:
        verdict = json.loads(text)
        return int(verdict.get("score", 0)), verdict.get("reason", "")
    except Exception:
        return 0, f"judge returned unparseable response: {text[:120]}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--threshold", type=float, default=0.85)
    ap.add_argument("--evals", default="evals.csv")
    args = ap.parse_args()

    with open(args.evals, newline="") as f:
        rows = list(csv.DictReader(f))

    total = max_possible = 0
    with open("results.csv", "w", newline="") as out:
        w = csv.writer(out)
        w.writerow(["category", "grader", "score", "max", "input", "output", "reason"])
        for row in rows:
            output = run_candidate(row["input"])
            grader = row.get("grader", "substring")
            if grader == "judge":
                score, reason = grade_judge(row["input"], row["expected_or_rubric"], output)
                max_score = 2
            else:
                score = grade_substring(output, row["expected_or_rubric"])
                reason = ""
                max_score = 2
            total += score
            max_possible += max_score
            w.writerow([row["category"], grader, score, max_score, row["input"], output, reason])
            print(f"[{grader:9}] {score}/{max_score}  {row['category']:14} {row['input'][:60]}")

    pass_rate = total / max_possible
    print(f"\n{total}/{max_possible} points ({100*pass_rate:.1f}%) -- threshold {100*args.threshold:.0f}%")
    if pass_rate < args.threshold:
        print("FAIL")
        sys.exit(1)
    print("PASS")


if __name__ == "__main__":
    main()
