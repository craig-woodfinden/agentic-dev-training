# Agentic Development Training

The training pathway for our engineering team — covering everything from your first deliberate use of an AI coding assistant through to shipping production agents with evals, observability, and rollback plans.

**Self-paced.** Each engineer works through modules on their own time (~75 min/week), then books a **15-minute check-in** with the engineer lead. The lead signs off. They move on. ~90 min/week total, spread however suits you.

---

## Quickstart — run the local app

The fastest path for an engineer joining the cohort:

```bash
git clone <this-repo>
cd agentic-dev-training

# install dependencies (one time)
python -m venv .venv
source .venv/bin/activate          # on Windows: .venv\Scripts\activate
pip install -r requirements.txt

# launch the local app
streamlit run app.py
```

Streamlit will print a URL (usually `http://localhost:8501`) and open it in your browser. From there:

1. **Take the placement quiz** — 10 questions, ~5 min.
2. **The app sets up your cohort folder automatically** — type your name, click the button.
3. **Browse your level's modules** in the *My modules* page — each one renders inline with starter files listed alongside.
4. **Book a check-in** with the engineer lead via the *Check-in helper* — it generates the Slack DM for you.
5. **Commit and push** the changes the app makes to your `cohort-2026Q3/<your-name>/` folder.

When you're done, close the browser tab and stop the server with `Ctrl-C` in the terminal.

### Don't want to use the app?

You can do everything from the command line instead:

```bash
python score_quiz.py     # interactive CLI version — same outcome
```

And then open the module markdown files directly from [`modules/`](./modules/) in your editor.

---

## What's in here

```
.
├── README.md                ← this file
├── app.py                   ← local Streamlit frontend (recommended)
├── score_quiz.py            ← CLI quiz + auto-onboard (fallback)
├── pathway.md               ← the whole program in markdown
├── placement-quiz.md        ← the 10-question quiz, read-only
├── requirements.txt         ← Python deps
├── modules/                 ← the 12 module session-in-a-box files
├── starters/                ← runnable starter code, one folder per module
└── cohort-2026Q3/           ← active cohort
    ├── README.md            ← cohort tracker
    ├── engineer-lead-playbook.md   ← the lead's operating manual
    └── _template/           ← copied to <your-name>/ when you onboard
```

---

## Quickstart for the engineer lead

If you've been named the lead for this cohort, **read [`cohort-2026Q3/engineer-lead-playbook.md`](./cohort-2026Q3/engineer-lead-playbook.md) before the first check-in.** Or open the app and select *Engineer lead playbook* in the sidebar — same content, rendered. It covers:

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

- **Program owner:** Craig Woodfinden
- **Engineer lead (this cohort):** James Grant
- **Standing technical advisor (Level 4-ish):** James Cook

---

## License / sharing

Internal. Don't paste team-specific code or production prompts into external tools without redacting first.
