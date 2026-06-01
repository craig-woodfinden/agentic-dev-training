# Agentic Development Training

The training pathway for our engineering team — covering everything from your first deliberate use of an AI coding assistant through to shipping production agents with evals, observability, and rollback plans.

**Self-paced.** Each engineer works through modules on their own time (~75 min/week), then books a **15-minute check-in** with the engineer lead. The lead signs off. They move on. ~90 min/week total, spread however suits you.

---

## How to use this repo

1. **Take the placement quiz.** Run `python score_quiz.py` and answer 10 questions (~5 minutes). It tells you which level to start on. The quiz is also in [`placement-quiz.md`](./placement-quiz.md) if you'd rather read it.

2. **Read the pathway.** Open [`pathway.md`](./pathway.md). It's the whole program — quiz, the four levels, capstones, and how the self-paced model works.

3. **Each week, open that week's module.** Module files live in [`modules/`](./modules/). Each is one page, runnable in ~75 minutes, with the starter code in [`starters/`](./starters/).

4. **Run the self-check, then book a 15-minute check-in with the engineer lead** (Slack DM). The lead's playbook is in [`cohort-2026Q3/engineer-lead-playbook.md`](./cohort-2026Q3/engineer-lead-playbook.md).

5. **Commit your work to your cohort folder.** Each engineer has a folder under `cohort-2026Q3/<your-name>/`. Notes, prompts, capstones, sign-off log — push them as you go.

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
└── cohort-2026Q3/           ← active cohort
    ├── README.md            ← cohort tracker
    ├── engineer-lead-playbook.md   ← the lead's operating manual
    └── _template/           ← copy this to <your-name>/ to join
```

---

## Quickstart for engineers

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

# read the pathway and your level's first module
open pathway.md
open modules/L1.1-mental-model-of-llms.md   # whichever module you're starting on
```

---

## Quickstart for the engineer lead

If you've been named the lead for this cohort, **read [`cohort-2026Q3/engineer-lead-playbook.md`](./cohort-2026Q3/engineer-lead-playbook.md) before the first check-in.** It covers:

- The 15-minute check-in format and sign-off bar
- How to run each level's capstone demo (15 min for L1, up to 60 min for L3)
- The weekly cadence (~2.5–3 hrs/week)
- What to do when an engineer goes quiet
- When to call in external coaching

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
- **Engineer lead (this cohort):** *fill in*
- **Standing technical advisor (Level 4-ish):** *fill in*

---

## License / sharing

Internal. Don't paste team-specific code or production prompts into external tools without redacting first.
