#!/usr/bin/env python3
"""
Interactive placement quiz for the Agentic Development training program.

Run:  python score_quiz.py

After scoring, the script will offer to set up your personal cohort folder
automatically -- create cohort-2026Q3/<your-name>/, fill in your status.md,
and add your row to the cohort table. You just need to commit and push.
"""
import datetime
import pathlib
import re
import shutil
import sys

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
        "I've already done this -- the team uses my workflows.",
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


def level_for(score: int) -> tuple[str, str, str, str]:
    """Returns (level_short, level_full, description, first_module)."""
    if score <= 8:
        return ("L1", "Level 1 -- Novice",
                "You've used AI tools casually. Start with the L1 modules to build a daily, deliberate workflow.",
                "L1.1")
    if score <= 16:
        return ("L2", "Level 2 -- Practitioner",
                "You're a confident daily user. Start with the L2 modules to learn the API, tool use, and evals.",
                "L2.1")
    if score <= 24:
        return ("L3", "Level 3 -- Proficient",
                "You can build LLM features. Start with the L3 modules to architect, observe, secure, and scale them.",
                "L3.1")
    return ("L4", "Level 4 -- Expert",
            "You're ready to architect cross-team systems and mentor others. See the Level 4 section in pathway.md.",
            "--")


def ask(i: int, question: str, options: list[str]) -> int:
    print(f"\n[{i}/10] {question}")
    for n, opt in enumerate(options):
        print(f"  ({n}) {opt}")
    while True:
        choice = input("  Your answer (0-3): ").strip()
        if choice in {"0", "1", "2", "3"}:
            return int(choice)
        print("  Please enter 0, 1, 2, or 3.")


def onboard(score: int, level_short: str, level_full: str, first_module: str) -> None:
    """Optional onboarding flow -- create the engineer's cohort folder and update trackers."""
    print()
    print("=" * 60)
    print("SET UP YOUR COHORT FOLDER AUTOMATICALLY?")
    print("=" * 60)
    print("If you say yes, this script will:")
    print("  1. Create cohort-2026Q3/<your-name>/")
    print("  2. Fill in your status.md (score, level, start date)")
    print("  3. Add your row to the cohort table in README.md")
    print("After that, you just commit and push.")
    print()
    answer = input("Set it up now? (Y/n): ").strip().lower()
    if answer in {"n", "no"}:
        print_manual_instructions(score, level_short, first_module)
        return

    # Find repo root
    repo_root = pathlib.Path(__file__).resolve().parent
    cohort_dir = repo_root / "cohort-2026Q3"
    template = cohort_dir / "_template"
    if not template.is_dir():
        print(f"\n⚠  Can't find {template}. Run this script from the repo root.")
        print_manual_instructions(score, level_short, first_module)
        return

    # Ask for name
    while True:
        name = input("\nYour name (lowercase, used as folder name -- e.g. 'alex' or 'alex-w'): ").strip().lower()
        if not name:
            print("Skipping onboarding.")
            print_manual_instructions(score, level_short, first_module)
            return
        if not re.match(r"^[a-z0-9_-]+$", name):
            print("  Please use only lowercase letters, numbers, hyphens, underscores.")
            continue
        break

    # Create folder
    dest = cohort_dir / name
    if dest.exists():
        ans = input(f"\ncohort-2026Q3/{name}/ already exists. Update status.md only? (y/N): ").strip().lower()
        if ans not in {"y", "yes"}:
            print("Skipping.")
            return
    else:
        shutil.copytree(template, dest)
        print(f"✓ Created cohort-2026Q3/{name}/")

    # Update status.md
    today = datetime.date.today().isoformat()
    status_path = dest / "status.md"
    text = status_path.read_text()
    text = text.replace(
        "- **Starting level:** *L1 / L2 / L3 (from `score_quiz.py`)*",
        f"- **Starting level:** {level_short}",
    )
    text = text.replace(
        "- **Quiz score:** *e.g. 7 / 30*",
        f"- **Quiz score:** {score} / 30",
    )
    text = text.replace(
        "- **Started:** *YYYY-MM-DD*",
        f"- **Started:** {today}",
    )
    status_path.write_text(text)
    print(f"✓ Filled in cohort-2026Q3/{name}/status.md")

    # Update cohort README
    readme_path = cohort_dir / "README.md"
    readme = readme_path.read_text()
    new_row = f"| {name} | {score}/30 | {level_short} | {first_module} | -- | not started |"

    # If engineer already in table, update their row
    existing = re.compile(rf"^\| {re.escape(name)} \|.*\|\s*$", re.MULTILINE)
    if existing.search(readme):
        readme = existing.sub(new_row, readme)
        readme_path.write_text(readme)
        print(f"✓ Updated your row in cohort-2026Q3/README.md")
    else:
        # Replace the first placeholder row
        placeholder = re.compile(r"^\| \*name\* \|.*\|\s*$", re.MULTILINE)
        if placeholder.search(readme):
            readme = placeholder.sub(new_row, readme, count=1)
            readme_path.write_text(readme)
            print(f"✓ Added your row to cohort-2026Q3/README.md")
        else:
            print(f"⚠  Cohort table has no empty rows. Add this line yourself:")
            print(f"   {new_row}")

    # Final instructions
    print()
    print("=" * 60)
    print("ALL SET. ONE LAST STEP -- COMMIT AND PUSH.")
    print("=" * 60)
    print()
    print("Run these three commands:")
    print()
    print("  git add cohort-2026Q3/")
    print(f'  git commit -m "Add {name} to cohort -- placed at {level_short}"')
    print("  git push")
    print()
    print(f"Then open modules/{first_module}-*.md and get started.")
    print(f"Book your first check-in with the engineer lead when you're done.")
    print()


def print_manual_instructions(score: int, level_short: str, first_module: str) -> None:
    """Print the steps to do it by hand if the engineer skipped the onboard flow."""
    print()
    print("OK, to set up manually:")
    print()
    print("  1. cp -r cohort-2026Q3/_template cohort-2026Q3/<your-name>")
    print(f"  2. Edit cohort-2026Q3/<your-name>/status.md -- fill in score ({score}/30), level ({level_short}), today's date")
    print(f"  3. Edit cohort-2026Q3/README.md -- add your row to the table")
    print( "  4. git add . && git commit -m \"Add <name> to cohort\" && git push")
    print()
    print(f"Your first module is modules/{first_module}-*.md")
    print()


def main() -> None:
    print("=" * 60)
    print("AGENTIC DEVELOPMENT -- PLACEMENT QUIZ")
    print("=" * 60)
    print("Ten questions, ~5 minutes. Answer honestly -- what you do today,")
    print("not what you could do if you had to.")
    total = 0
    for i, (q, opts) in enumerate(QUESTIONS, start=1):
        total += ask(i, q, opts)
    level_short, level_full, note, first_module = level_for(total)
    print()
    print("=" * 60)
    print(f"Total score:  {total} / 30")
    print(f"Start at:     {level_full}")
    print("=" * 60)
    print(note)

    # Onboarding flow (only for L1-L3 -- L4s don't need a cohort folder)
    if level_short in {"L1", "L2", "L3"}:
        onboard(total, level_short, level_full, first_module)
    else:
        print()
        print("Since you placed at Level 4, see the Level 4 section in pathway.md")
        print("for the sustaining-role description. No cohort folder needed.")
        print()


if __name__ == "__main__":
    main()
