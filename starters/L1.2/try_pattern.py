"""
L1.2 starter — run the same task through five different prompt patterns.

Edit INPUT below to be a real piece of messy text from your work
(Slack thread, meeting notes, customer email — anonymise if needed).

Each PATTERN is a different prompt design. Run them all, compare the
outputs. Save your winner to ../../cohort-2026Q3/<your-name>/L1.2-prompt-v1.txt

Run:
  python try_pattern.py 1     # runs pattern 1 only
  python try_pattern.py all   # runs all five
"""
import sys
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-haiku-4-5"

INPUT = """
PASTE YOUR MESSY TEXT HERE.

A long Slack thread, a meeting note, a customer email, a JIRA comment.
Anonymise it if needed.
"""

EXAMPLE_INPUT = """We discussed shipping the auth flow this Friday. Ana
will own the backend changes and asks for an extra reviewer. We still
don't know if SSO is in scope — leaving that to next standup."""

EXAMPLE_OUTPUT = {
    "decisions": ["Ship auth flow this Friday"],
    "owners": ["Ana — backend changes"],
    "open_questions": ["Is SSO in scope?"],
}

PATTERNS = {
    "1": {
        "label": "Bare instruction",
        "system": None,
        "user": f"Summarise the decisions, owners, and open questions from this text: {INPUT}",
        "prefill": None,
    },
    "2": {
        "label": "Instruction + format spec",
        "system": None,
        "user": (
            "Extract decisions, owners, and open questions from the text below. "
            "Return strict JSON with keys decisions (list of strings), owners "
            "(list of strings), open_questions (list of strings). No prose.\n\n"
            f"TEXT:\n{INPUT}"
        ),
        "prefill": None,
    },
    "3": {
        "label": "Few-shot example",
        "system": None,
        "user": (
            "Extract decisions, owners, and open questions as strict JSON.\n\n"
            f"EXAMPLE INPUT:\n{EXAMPLE_INPUT}\n\n"
            f"EXAMPLE OUTPUT:\n{EXAMPLE_OUTPUT}\n\n"
            f"NOW DO THE SAME FOR THIS INPUT:\n{INPUT}"
        ),
        "prefill": None,
    },
    "4": {
        "label": "System prompt + role",
        "system": (
            "You are an analyst who extracts structured information from "
            "meeting notes. You always return strict JSON with keys "
            "decisions, owners, open_questions. You never add prose."
        ),
        "user": INPUT,
        "prefill": None,
    },
    "5": {
        "label": "System prompt + prefill",
        "system": (
            "You are an analyst who extracts structured information from "
            "meeting notes. Return strict JSON with keys decisions, owners, "
            "open_questions."
        ),
        "user": INPUT,
        "prefill": '{"decisions": [',
    },
}


def run(pattern_id: str) -> None:
    p = PATTERNS[pattern_id]
    print(f"\n=== Pattern {pattern_id}: {p['label']} ===")
    messages = [{"role": "user", "content": p["user"]}]
    if p["prefill"]:
        messages.append({"role": "assistant", "content": p["prefill"]})
    kwargs = {
        "model": MODEL,
        "max_tokens": 600,
        "messages": messages,
    }
    if p["system"]:
        kwargs["system"] = p["system"]
    resp = client.messages.create(**kwargs)
    out = (p["prefill"] or "") + resp.content[0].text
    print(out)
    print(f"--- in: {resp.usage.input_tokens}, out: {resp.usage.output_tokens}")


def main() -> None:
    if len(sys.argv) < 2:
        print("usage: python try_pattern.py [1|2|3|4|5|all]")
        sys.exit(1)
    if sys.argv[1] == "all":
        for k in PATTERNS:
            run(k)
    else:
        run(sys.argv[1])


if __name__ == "__main__":
    main()
