# Agentic Development — Training Pathway

Take the 5-minute quiz. Land on a level. Work through one module a week at your own pace, then a 15-minute check-in with the engineer lead. Move up by demoing real work.

---

## How to use this document

1. Take the placement quiz in [`placement-quiz.md`](./placement-quiz.md) (or run `python score_quiz.py`). It tells you which level to start on.
2. Block ~75 minutes on your own calendar each week for module work. Plus a 15-minute check-in with the engineer lead. Total ~90 min/week — but spread however suits you.
3. Work through your level's four modules at your own pace (one per week is the default). Each module is self-contained and runnable from the [`starters/`](./starters/) folder.
4. After each module, run the self-check, book a 15-minute check-in with the lead, walk them through what you built. They sign you off.
5. Your capstone is real project work that uses the level's skills. Demo it to the lead (and 1–2 others for L2/L3). Move up when the four exit criteria are met.

---

## Level 1 — Novice

> "I've used ChatGPT a few times" → "I drive an AI assistant every day and trust my own review of its output."

| | |
|---|---|
| **You** | You've used AI tools casually but don't yet have a daily, deliberate workflow. You may not have called an LLM API directly. |
| **Time** | ~75 min of self-paced module work + 15-min check-in with the engineer lead = ~90 min/week. One module per week is the default. |
| **Pace** | Self-paced. Roughly 5–6 weeks per level (4 modules + capstone). |

### The four modules

- **L1.1 — A working mental model of LLMs** — tokens, context, sampling, hallucination — enough theory to make the rest of the program land.
- **L1.2 — Prompting fundamentals** — five concrete prompt patterns applied to one real task. Walk away with one reusable prompt.
- **L1.3 — Daily Claude Code workflow** — stand up Claude Code on a real repo. Write a CLAUDE.md and one slash command you'll keep.
- **L1.4 — Reviewing AI-generated code** — a five-point checklist for AI diffs. Find a real issue someone else missed.

### Capstone

Ship one real PR end-to-end using Claude Code. Small but real. Then write a 600-word retro about what you prompted, what went wrong, and what you corrected.

- **You'll demo:** 15–20 min, 1:1 with the engineer lead. Show the PR, walk them through the prompt log, share one thing you nearly missed.
- **You'll hand in:** Merged PR + prompt log + 600-word retro.

### You're ready for the next level when…

- You have a repeatable AI-assisted workflow you can describe in two minutes.
- You've merged three PRs assisted by an AI tool and can name the corrections you made on each.
- You've called the Anthropic API at least once with a short script and read back the response.
- You've presented your capstone retro to the cohort.

---

## Level 2 — Practitioner

> "I use AI tools well" → "I can ship a small LLM-backed feature with evals."

| | |
|---|---|
| **You** | You're a confident daily user of AI tools and have called the API at least once. You haven't yet shipped a feature in production that depends on an LLM. |
| **Time** | ~75 min self-paced + 15-min check-in = ~90 min/week. |
| **Pace** | Self-paced. ~5–6 weeks for the level (4 modules + capstone). |

### The four modules

- **L2.1 — The Anthropic API** — build a streaming multi-turn chat CLI. Survive forced rate limits without crashing.
- **L2.2 — Tool use & function calling** — build a small agent that uses two tools to answer questions about a repo. Break it on purpose.
- **L2.3 — Building your first eval set** — author 10 graded cases for a real prompt and use them to catch a regression.
- **L2.4 — Model and cost selection** — run the same eval against Haiku, Sonnet, and Opus. Write a one-page model decision memo.

### Capstone

The next small internal tool your team needs — built with at least one custom tool/function call and a 10-case eval suite. The capstone is real work, not a side project. Ship it where teammates will actually use it (internal CLI, Teams bot, or skill).

- **You'll demo:** 30–45 min, with the engineer lead and 1–2 other cohort engineers. Show the working tool, the eval pass rate, and your per-call cost estimate.
- **You'll hand in:** Working tool, eval CSV/JSONL, runner script, README with cost-per-call.

### You're ready for the next level when…

- Capstone code is reviewed and merged by a Proficient or Expert engineer.
- Your eval suite has caught at least three real regressions during the build.
- You can teach a Novice module to the next cohort.
- You can explain — with a number — which model you chose and why.

---

## Level 3 — Proficient

> "I can ship a small feature" → "I architect, operate, and improve agentic systems in production."

| | |
|---|---|
| **You** | You've shipped at least one LLM-backed feature, have working evals, and have hit at least one production surprise. Ready to take responsibility for an agentic system. |
| **Time** | ~75 min self-paced + 15-min check-in = ~90 min/week. Deeper modules may need two weeks. |
| **Pace** | Self-paced. ~6–8 weeks for the level. |

### The four modules

- **L3.1 — Agent architecture patterns** — design three agents for three different problems. Pick between ReAct, planner-executor, router, and sub-agent.
- **L3.2 — Production observability** — instrument a real agent with structured traces. Stand up a one-screen dashboard. Define three alerts.
- **L3.3 — Safety and guardrails** — attack your own agent five ways. Add three guardrails. Write a one-page safety doc.
- **L3.4 — Evals at scale** — upgrade your eval set with LLM-as-judge, wire it into CI, and backfill from production traces.

### Capstone

Ship one agentic feature to production with: at least one tool call, evals running in CI, an observability dashboard, a documented failure-mode catalogue, and a written rollback plan. The feature must run live for at least four weeks before sign-off.

- **You'll demo:** 45–60 min, with the engineer lead and the standing technical advisor (and any interested cohort members). Walk the dashboard live, show CI evals, walk the failure-mode doc and rollback plan.
- **You'll hand in:** Live feature + CI evals + dashboard + failure-mode doc + rollback runbook + post-launch retro.

### You're ready for the next level when…

- Production feature has been live for 4+ weeks with stable quality metrics.
- You've led at least one post-incident review of an agent failure (production or staging).
- You've mentored at least one Level 1 or Level 2 engineer through their level transition.
- You've contributed at least one reusable artefact (prompt, eval template, MCP server, skill) to the team's shared library.

---

## Level 4 — Expert (sustaining)

> Once you're here, growth is breadth and influence — not another rung. The work is to keep the rest of the program running.

### What you do at this level

- Architect cross-team agent systems. Review critical agent PRs.
- Own the team's prompt library, eval harness, MCP servers, and shared skills.
- Read model cards, papers, and Anthropic releases. Translate the relevant 10% into team practice.
- Coach at least one Proficient engineer per quarter through their capstone.
- Write up or talk about one piece of practice per quarter, internally or externally.

### Rituals you run

- Monthly research roundup — one paper or model-card change, 30 minutes, you present.
- Quarterly architecture review — every active agent feature gets eyes from two Experts.
- Quarterly program retro — what to add to modules, what to retire.

*There is no capstone. There is no "graduation". You stay sharp by doing the work and bringing others up with you.*

### If your team is small and nobody is at Level 4 yet

Common in teams of 4–8 engineers. Your most senior engineer plays the Level 4 role while growing into it — taking check-ins, running capstone demos, and being the standing technical advisor. The gap that stays visible is architectural review of production agents: consider booking a few hours a month with an external coach until you have your own Expert in place.

---

## How the program runs

The program is **self-paced**. Each engineer works through modules on their own time, then books a **15-minute check-in** with the engineer lead when they're done with a module. The lead signs them off. They move on. Capstones live inside real project work, not on top of it.

### One — Self-paced modules with a 15-minute check-in

Each module is a one-page session-in-a-box: a short read, a hands-on exercise with runnable starter code, a self-check, and a check-in section that tells you what to bring and what the lead will ask.

The rhythm per engineer:

1. **Block ~75 minutes during the week** for the module itself. This is protected time on your own calendar, not a group session.
2. **Run through the self-check** at the end of the module. If you can't answer the questions cleanly, re-read the relevant section.
3. **Book a 15-minute check-in** with the engineer lead.
4. **Walk the lead through what you built** for 5–7 minutes. They ask 2–3 probe questions and sign you off.

Total time per engineer per module: ~90 minutes (75 of work, 15 of check-in). One module a week is the default pace.

### Two — The engineer lead

One named lead runs the cohort. Their job is to take 15-minute module check-ins, run capstone demos, and answer questions in the team chat. They do **not** lecture, run a class, or grade in detail.

Time commitment for the lead: ~2.5–3 hours per week (six engineers × one check-in × 15 min, plus capstones and ad-hoc questions). The full playbook is in [`cohort-2026Q3/engineer-lead-playbook.md`](./cohort-2026Q3/engineer-lead-playbook.md).

For a small team, the lead is usually your most senior engineer until someone else grows into the role.

### Three — Capstones happen in real work

Each capstone applies the level's skills to something you'd be doing anyway:

- **Level 1:** use Claude Code on the next real PR you'd ship. The 600-word retro is the capstone deliverable. Demoed 1:1 with the lead (15–20 min).
- **Level 2:** the next small internal tool the team needs — build it with the new API, tool-use, and eval skills. Demoed to the lead plus 1–2 other engineers (30–45 min).
- **Level 3:** the next agentic feature on your product roadmap — ship it with the observability, safety, and eval discipline you've practiced. Demoed to the lead plus the standing technical advisor (45–60 min). Must be live for 4+ weeks.

You move up when the four exit criteria are met — the lead confirms during the capstone demo.

### Four — Optional all-hands every 2–4 weeks

A 90-minute team session every 2–4 weeks is optional but recommended once the team is past the first couple of modules. Shape: 30 min of themed sharing across levels, 45 min of capstone demos, 15 min of open Q&A. It exists for team cohesion and cross-level pollination — it is **not** on the critical path, and engineers can skip it without falling behind.

---

## How long this takes

- One module per week (self-paced) × four modules per level = ~4 weeks of module work per level.
- Plus a capstone (real work — runs in parallel with normal projects, demo in 1–2 sessions).
- So roughly **5–6 weeks per level, per engineer**. An engineer placed at Level 1 reaches Level 3 in 4–5 months. An engineer placed at Level 2 gets there in 2–3 months.

---

## If you stall

Stalling is normal, not a failure. The lead watches for it and DMs you fast. Two scripts they'll use:

- **Stuck on a module:** *"Want me to look at your code, or do you want to skip this module for now and come back?"*
- **Real work is eating the time:** *"Want to pause for a sprint, or downshift to one module every two weeks?"*

The point is to keep you moving, not to gate you. If you haven't booked a check-in in 10 days, expect a ping.

Other common scenarios:

- **A module felt too easy:** tell the lead, skip ahead. Probably means your placement was a level too low.
- **A module felt too hard:** tell the lead. Two options — slow down on this one, or drop to the level below for the rest of the level. No formal demotion, no ceremony. You'll move faster from the right starting point.
