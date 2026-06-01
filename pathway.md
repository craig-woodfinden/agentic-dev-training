# Agentic Development — Training Pathway

Take the 5-minute quiz. Land on a level. 90 minutes a week, all six of you in the room. Move up by demoing real work.

---

## How to use this document

1. Take the placement quiz in [`placement-quiz.md`](./placement-quiz.md) (or run `python score_quiz.py`). It tells you which level to start on.
2. Block 90 minutes on the team calendar every week. All six of you, same time, protected like an on-call shift.
3. Work through your level's four modules in the session, one per week. No homework — the work happens in the room.
4. Your capstone is real project work that uses the level's skills. Demo it to the team. Move up when the four exit criteria are met.

---

## Level 1 — Novice

> "I've used ChatGPT a few times" → "I drive an AI assistant every day and trust my own review of its output."

| | |
|---|---|
| **You** | You've used AI tools casually but don't yet have a daily, deliberate workflow. You may not have called an LLM API directly. |
| **Time** | One 90-minute session per week — protected on the team calendar. Four modules, one per session. No homework outside the session. |
| **Pace** | A single mixed cohort — the whole engineering team in one room. ~5–6 weeks per level. |

### The four modules

- **L1.1 — A working mental model of LLMs** — tokens, context, sampling, hallucination — enough theory to make the rest of the program land.
- **L1.2 — Prompting fundamentals** — five concrete prompt patterns applied to one real task. Walk away with one reusable prompt.
- **L1.3 — Daily Claude Code workflow** — stand up Claude Code on a real repo. Write a CLAUDE.md and one slash command you'll keep.
- **L1.4 — Reviewing AI-generated code** — a five-point checklist for AI diffs. Find a real issue someone else missed.

### Capstone

Ship one real PR end-to-end using Claude Code. Small but real. Then write a 600-word retro about what you prompted, what went wrong, and what you corrected.

- **You'll demo:** 10 minutes at the weekly cohort session. Show the PR, walk the cohort through the prompt log, share one thing you nearly missed.
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
| **Time** | One 90-minute session per week. |
| **Pace** | ~5–6 weeks for the level. |

### The four modules

- **L2.1 — The Anthropic API** — build a streaming multi-turn chat CLI. Survive forced rate limits without crashing.
- **L2.2 — Tool use & function calling** — build a small agent that uses two tools to answer questions about a repo. Break it on purpose.
- **L2.3 — Building your first eval set** — author 10 graded cases for a real prompt and use them to catch a regression.
- **L2.4 — Model and cost selection** — run the same eval against Haiku, Sonnet, and Opus. Write a one-page model decision memo.

### Capstone

The next small internal tool your team needs — built with at least one custom tool/function call and a 10-case eval suite. The capstone is real work, not a side project. Ship it where teammates will actually use it (internal CLI, Slack bot, or skill).

- **You'll demo:** Five-minute live demo to the team at your weekly session. Show the working tool, the eval pass rate, and your per-call cost estimate.
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
| **Time** | One 90-minute session per week. Deeper modules may span two sessions. |
| **Pace** | ~6–8 weeks for the level. |

### The four modules

- **L3.1 — Agent architecture patterns** — design three agents for three different problems. Pick between ReAct, planner-executor, router, and sub-agent.
- **L3.2 — Production observability** — instrument a real agent with structured traces. Stand up a one-screen dashboard. Define three alerts.
- **L3.3 — Safety and guardrails** — attack your own agent five ways. Add three guardrails. Write a one-page safety doc.
- **L3.4 — Evals at scale** — upgrade your eval set with LLM-as-judge, wire it into CI, and backfill from production traces.

### Capstone

Ship one agentic feature to production with: at least one tool call, evals running in CI, an observability dashboard, a documented failure-mode catalogue, and a written rollback plan. The feature must run live for at least four weeks before sign-off.

- **You'll demo:** Engineering leadership review with at least one Expert in the room. Walk the dashboard, the eval CI, and the failure-mode doc.
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

Common in teams of 4–8 engineers. Your most senior engineer plays the Level 4 role while growing into it — running the weekly session, reviewing capstones, and being the standing technical advisor. The gap that stays visible is architectural review of production agents: consider booking a few hours a month with an external coach until you have your own Expert in place.

---

## How the program runs

Designed for a six-person engineering team with 90 minutes of protected time per week. No homework — the work happens in the session. Capstones live inside real project work, not on top of it.

### One — The 90-minute weekly session

Same time, same place (or video call), every week. All six of you. On the team calendar, treated like an on-call shift — missing it needs a reason.

A typical session:

- **0:00–0:10** — round the room. Each engineer: one thing the new skills helped with in real work this week, one thing that didn't go to plan. ~90 seconds each.
- **0:10–1:20** — module work. Read together, then do the hands-on exercise. Pair up where it makes sense. Engineers may be on different modules based on level — that's fine, you work in the same room.
- **1:20–1:30** — show-and-tell. Anyone with something working shares it for two minutes. Capstone demos happen here when they're due.

*Deeper modules (especially in Level 3) sometimes fill the whole 90 minutes. That's expected — move the round-the-room to a Slack thread that week and use the full session for the work.*

### Two — One mixed cohort

You don't have enough engineers to split into separate Novice / Practitioner / Proficient cohorts and still have real conversation in each. So you don't. The whole team is one cohort.

When engineers are on different modules in a given week, that's a feature: the Novice working through prompting fundamentals and the Proficient working on observability both share what they did. The senior engineer explaining their dashboard in plain English to the junior is itself a Level 3-going-on-4 skill.

### Three — Session lead rotates

Six people, six rotations every six weeks. The week's lead keeps time, runs the round-the-room, and signs off any capstone demo that week. Your most senior engineer is the standing technical advisor on every session — they don't have to be the named lead each week.

---

## Capstones happen in real work, not on the side

Each capstone is a way of applying the level's skills to something you'd be doing anyway:

- **Level 1:** use Claude Code on the next real PR you'd ship. The 600-word retro is the capstone deliverable.
- **Level 2:** the next small internal tool the team needs — build it with the new API, tool-use, and eval skills.
- **Level 3:** the next agentic feature on your product roadmap — ship it with the observability, safety, and eval discipline you've practiced.

Demo at the weekly session. The team is your reviewer pool. You move up when the four exit criteria are met — the lead that week confirms.

---

## How long this takes

- Four modules per level, one per session = ~4 weeks of module work per level.
- Plus a capstone wrap (usually 1–2 sessions of demo + review).
- So roughly 5–6 weeks per level, per engineer. An engineer placed at Level 1 reaches Level 3 in 4–5 months. An engineer placed at Level 2 gets there in 2–3 months.

---

## If you stall

Stalling is normal, not a failure. With six people, even one engineer drifting is felt — so the response is fast and small, not formal.

- **A module didn't fit in 90 minutes:** split it across two sessions. The pace serves the team; the team doesn't serve the pace.
- **Real work is eating the session time:** protect the slot more firmly, or pause the program for a sprint rather than letting it half-die. Half-running is worse than pausing.
- **Placement was wrong:** drop the engineer down one level for the rest of the level. No formal demotion, no ceremony. They'll move faster from the right starting point.
