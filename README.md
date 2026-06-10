# Agentic Development Training

The training pathway for our engineering team -- covering everything from your first deliberate use of GitHub Copilot through to shipping production agents with evals, observability, and rollback plans.

**Self-paced.** Each engineer works through modules on their own time (~75 min/week) and submits a self-assessment in the app to unlock the next module. ~90 min/week total, spread however suits you.

---

## Quickstart -- run the local app

The fastest path for an engineer joining the cohort:

**bash / zsh (Mac, Linux) or PowerShell (Windows) -- same commands**
```bash
git clone <this-repo>
cd agentic-dev-training
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. From there:

1. **Take the placement quiz** -- 10 questions, ~5 min. The app sets your starting level.
2. **Your cohort folder is created automatically** -- type your name, click the button.
3. **Work through your modules** in the *My modules* page -- each one renders inline with starter files listed alongside.
4. **Submit your self-assessment** at the bottom of each module -- tick the criteria, paste your GitHub link, and the next module unlocks automatically.
5. **Commit and push** the changes the app makes to your `cohort-2026Q3/<your-name>/` folder.

When you're done, close the browser tab and stop the server with `Ctrl-C` in the terminal.

### Don't want to use the app?

Open the module markdown files directly from [`modules/`](./modules/) in your editor, and read [`placement-quiz.md`](./placement-quiz.md) to find your starting level.

---

## What's in here

```
.
├── README.md                ← this file
├── src/                     ← React webapp source (TypeScript)
├── server.ts                ← Express API server (serves modules, cohort data)
├── package.json             ← Node deps (npm install to set up)
├── pathway.md               ← the whole program in markdown
├── placement-quiz.md        ← the 10-question quiz, read-only
├── modules/                 ← the 12 module session-in-a-box files
├── starters/                ← runnable starter code, one folder per module (TypeScript)
└── cohort-2026Q3/           ← active cohort
    ├── README.md            ← cohort tracker
    └── _template/           ← copied to <your-name>/ when you onboard
```

---

## The four levels at a glance

| Level | Profile | Capstone |
|---|---|---|
| **1 -- Novice** | Used AI tools casually, no daily workflow yet. | Ship a real PR with GitHub Copilot + 600-word retro. |
| **2 -- Practitioner** | Confident daily user, has called the API once. | Build the next small internal tool with tool use + a 10-case eval suite. |
| **3 -- Proficient** | Has shipped an LLM feature, hit a production surprise. | Ship a production agent with evals in CI, observability, safety, and a rollback plan. |
| **4 -- Expert** | Architect, mentor, standard-setter. | No capstone -- sustaining role. |

Full descriptions and exit criteria in [`pathway.md`](./pathway.md).

---

## Owning this curriculum

Modules will evolve as we run cohorts. Changes go through PR, reviewed by the program owner.

- **Program owner:** *fill in*
- **Standing technical advisor (Level 4-ish):** *fill in*

---

## License / sharing

Internal. Don't paste team-specific code or production prompts into external tools without redacting first.
