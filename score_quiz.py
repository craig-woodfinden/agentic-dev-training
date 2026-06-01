#!/usr/bin/env python3
"""
Interactive placement quiz for the Agentic Development training program.

Run:  python score_quiz.py
"""

QUESTIONS = [
    ("Have you called an LLM API (Anthropic, OpenAI, etc.) directly from code?", [
        "Never.",
        "Once or twice in a throwaway script.",
        "A few times for personal projects or internal tools.",
        "Yes, in production code I shipped.",
    ]),
    ("Do you use an agentic CLI (Claude Code, Cursor agents, etc.) for real work?", [
        "I haven't tried one.",
        "I've tried it but don't use it regularly.",
        "I use it for most coding tasks.",
        "I customise hooks, slash commands, or sub-agents.",
    ]),
    ("Have you implemented tool use / function calling?", [
        "No.",
        "I've read about it but not implemented it.",
        "I've defined a tool and parsed model calls.",
        "I've designed tool schemas for production agents.",
    ]),
    ("Have you written evals for LLM output?", [
        "No.",
        "Manual rubric, eyeballed.",
        "10+ test cases I run before shipping.",
        "Eval suite running in CI, with judge models.",
    ]),
    ("Have you shipped an LLM-backed feature to production?", [
        "No.",
        "A small internal tool with basic logging.",
        "A user-facing feature.",
        "Multiple, with observability and rollback plans.",
    ]),
    ("When a prompt isn't working, how do you debug?", [
        "Reword and try again.",
        "I have a personal set of prompt patterns I try.",
        "I run regression cases and look at structured output.",
        "I trace tool calls and inspect reasoning steps.",
    ]),
    ("Have you read the Anthropic API docs and Agent SDK docs?", [
        "No.",
        "Skimmed.",
        "Read the parts I use.",
        "Yes, including model cards and system updates.",
    ]),
    ("Could you teach a colleague how to use Claude Code effectively?", [
        "No.",
        "The basics.",
        "Yes, with my own examples.",
        "I've already done this — the team uses my workflows.",
    ]),
    ("When you build with an LLM, how do you handle prompt injection / unsafe inputs?", [
        "I don't think about it.",
        "I know what it is but haven't defended against it.",
        "I sanitise inputs and scope tool permissions.",
        "I design system-wide guardrails and run injection tests.",
    ]),
    ("Could you architect a multi-step agent (planner + executor + tools + memory)?", [
        "No.",
        "I could describe one but not build it.",
        "I've built simple ones.",
        "I architect them and mentor others on the patterns.",
    ]),
]


def level_for(score: int) -> tuple[str, str]:
    if score <= 8:
        return ("Level 1 — Novice",
                "You've used AI tools casually. Start with the L1 modules to build a daily, deliberate workflow.")
    if score <= 16:
        return ("Level 2 — Practitioner",
                "You're a confident daily user. Start with the L2 modules to learn the API, tool use, and evals.")
    if score <= 24:
        return ("Level 3 — Proficient",
                "You can build LLM features. Start with the L3 modules to architect, observe, secure, and scale them.")
    return ("Level 4 — Expert",
            "You're ready to architect cross-team systems and mentor others. See the Level 4 section in pathway.md.")


def ask(i: int, question: str, options: list[str]) -> int:
    print(f"\n[{i}/10] {question}")
    for n, opt in enumerate(options):
        print(f"  ({n}) {opt}")
    while True:
        choice = input("  Your answer (0-3): ").strip()
        if choice in {"0", "1", "2", "3"}:
            return int(choice)
        print("  Please enter 0, 1, 2, or 3.")


def main() -> None:
    print("=" * 60)
    print("AGENTIC DEVELOPMENT — PLACEMENT QUIZ")
    print("=" * 60)
    print("Ten questions, ~5 minutes. Answer honestly — what you do today,")
    print("not what you could do if you had to.")
    total = 0
    for i, (q, opts) in enumerate(QUESTIONS, start=1):
        total += ask(i, q, opts)
    level, note = level_for(total)
    print("\n" + "=" * 60)
    print(f"Total score:  {total} / 30")
    print(f"Start at:     {level}")
    print("=" * 60)
    print(note)
    print()
    print("Next steps:")
    print("  1. Open pathway.md and read the section for your level.")
    print("  2. Copy cohort-2026Q3/_template → cohort-2026Q3/<your-name>/")
    print("  3. Open this week's module from modules/.")
    print("  4. See you at the weekly session.")
    print()


if __name__ == "__main__":
    main()
