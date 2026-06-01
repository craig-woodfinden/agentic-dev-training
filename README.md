# Agentic Development Training

The training pathway for our engineering team — covering everything from your first deliberate use of an AI coding assistant through to shipping production agents with evals, observability, and rollback plans.

Designed for a six-person team meeting for **90 minutes a week**, all together, no homework outside the session.

---

## How to use this repo

1. **Take the placement quiz.** Run `python score_quiz.py` and answer 10 questions (~5 minutes). It tells you which level to start on. The quiz is also in [`placement-quiz.md`](./placement-quiz.md) if you'd rather read it.

2. **Read the pathway.** Open [`pathway.md`](./pathway.md). It's the whole program in eight pages — quiz, the four levels, capstones, and how the weekly session runs.

3. **Each week, open that week's module.** Module files live in [`modules/`](./modules/). The current cohort's plan is in [`cohort-2026Q3/README.md`](./cohort-2026Q3/README.md).

4. **Use the starter code.** Every module has a matching folder in [`starters/`](./starters/) with runnable code, requirements, and templates. Pull the starter, modify it as the module asks, save your work in your personal cohort folder.

5. **Commit your work to your cohort folder.** Each engineer has a folder under `cohort-2026Q3/<your-name>/`. Notes, prompts, capstones — push them as you go.

---

## What's in here

```
.
├── README.md                ← this file
├── pathway.md               ← the whole program in markdown
├── placement-quiz.md        ← the 10-question quiz
├── score_quiz.py            ← interactive quiz scorer
├── requirements.txt         ← Python deps used across modules
├── modules/                 ← the 12 module session-in-a-box files
├── starters/                ← runnable starter code, one folder per module
└── cohort-2026Q3/           ← active cohort: tracker + per-engineer folders
```

---

## Quickstart

```bash
git clone <this-repo>
cd agentic-dev-training

# set your API key
export ANTHROPIC_API_KEY="sk-ant-..."

# create a virtual env and install deps
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# take the placement quiz
python score_quiz.py

# create your cohort folder
cp -r cohort-2026Q3/_template cohort-2026Q3/<your-name>

# read the pathway
open pathway.md   # or `cat pathway.md`, or open in your editor
```

---

## The four levels at a glance

| Level | Profile | Capstone |
|---|---|---|
| **1 — Novice** | Used AI tools casually, no daily workflow yet. | Ship a real PR with Claude Code + 600-word retro. |
| **2 — Practitioner** | Confident daily user, has called the API once. | Build the next small internal tool with tool use + a 10-case eval suite. |
| **3 — Proficient** | Has shipped an LLM feature, hit a production surprise. | Ship a production agent with evals in CI, observability, safety, and a rollback plan. |
| **4 — Expert** | Architect, mentor, standard-setter. | No capstone — sustaining role. |

Full descriptions and exit criteria in [`pathway.md`](./pathway.md).

---

## Owning this curriculum

Modules will evolve as we run cohorts. Changes go through PR, reviewed by the program owner.

- **Program owner:** *fill in*
- **Standing technical advisor (Level 4-ish):** *fill in*
- **Cohort lead this week:** see [`cohort-2026Q3/README.md`](./cohort-2026Q3/README.md)

---

## License / sharing

Internal. Don't paste team-specific code or production prompts into external tools without redacting first.
