# Engineer lead — playbook

You're the engineer lead for the cohort. This file is your operating manual.

The program is **self-paced**. Engineers work through modules on their own time, then book a **15-minute check-in** with you when they're done with a module. You sign them off. They move on.

You don't lecture. You don't run a 90-minute class. You ask sharp questions, sign off real work, and keep the cohort moving.

---

## Your time commitment

Rough numbers for a 6-engineer cohort:

- **Module check-ins:** 6 engineers × 1 module/week × 15 min ≈ **90 minutes/week**
- **Capstone demos:** ~3/quarter × 30–45 min ≈ **1–2 hours/month**
- **Ad-hoc questions in the cohort channel:** **30 min/week**
- **Weekly status nudge (see below):** **15 min/week**

**Total: ~2.5–3 hours/week.** This is meant to be sustainable while you still do real engineering work.

---

## The 15-minute module check-in — the standard format

Engineer books via Slack DM after they've completed a module. They bring the artefacts the module asks for. You run the check-in the same way every time.

| Time | What happens |
|---|---|
| 0:00–0:02 | Engineer names the module. You open their `status.md`. |
| 0:02–0:09 | Engineer walks through what they built. They drive. You listen. |
| 0:09–0:13 | You ask 2–3 probe questions from the module's check-in section. |
| 0:13–0:15 | Sign off (or don't), update their `status.md`, agree the next module. |

**That's it.** If it's running over, end on time and ask the engineer to come back when ready — don't drag it to 30 minutes.

---

## The bar for sign-off

The engineer **passes** the module when:

1. They brought every artefact the module's check-in section asks for.
2. They walked through it without reading off the screen — they can describe what they built and why.
3. They answered your probe questions credibly (not perfectly — credibly).
4. The **Done when** criterion at the bottom of the module is genuinely met.

If any of these fail:

- Be specific. *"The eval suite is there but you can't tell me which case caught the regression — go back and pick that one apart, then come back."*
- Set a date to come back. Usually 2–7 days.
- Don't make a big deal of it. Modules that need a second pass are normal.

---

## Probe-question rules of thumb

The modules list suggested probes. Don't just read them — pick the one the engineer seems least ready for.

Good probes are:
- **Open**, not yes/no. *"Walk me through…"* not *"Did you do X?"*
- **About what they actually did**, not the abstract topic. *"Show me your prompt"* not *"explain prompting"*.
- **One step deeper than they're comfortable.** If they nailed the happy path, push on failure modes.

Bad probes:
- Trick questions or gotchas.
- Quiz-style recall ("what year was the API released?").
- Anything they could pass by reciting the module text.

If they nail every probe in 3 minutes, you're being too easy. Push deeper.
If they freeze on every probe, you're being too hard. Pull back to what they actually did.

---

## Capstone demos — the longer format

Capstones are not a 15-minute check-in. They are the real deliverable for the level.

### L1 capstone (15–20 min, just you + engineer)

- Engineer demos the PR they shipped using Claude Code.
- They walk through their 600-word retro.
- You probe: what went wrong, what would they change.
- Sign off if the retro is honest and concrete.

### L2 capstone (30–45 min, you + 1–2 other engineers from the cohort)

- Engineer demos the small internal tool live, end-to-end.
- They show the eval suite running.
- They give the cost-per-call number.
- The other engineers ask questions. You arbitrate.
- Sign off if the tool works, the evals are real, and the cost is defensible.

### L3 capstone (45–60 min, you + standing technical advisor + interested cohort members)

- Engineer demos the production agent.
- They walk the observability dashboard live.
- They show CI evals.
- They walk the failure-mode catalogue and rollback plan.
- The advisor probes architectural choices. You probe ops readiness.
- Sign off if the feature has been live for 4+ weeks with stable metrics.

---

## Weekly cadence — what you do

### Monday (5 min)

Skim each engineer's `cohort-2026Q3/<name>/status.md`. Note who hasn't booked a check-in in the last 10 days.

### Mid-week

Take check-ins as engineers book them. Try to respond to a booking request within 24 hours.

### Friday (10 min)

Post a short status in the cohort Slack channel:

```
Cohort status — week of <date>

L1: <names> currently on <module>
L2: <names> currently on <module>
L3: <names> currently on <module>

Capstones this week: <names>
Capstones due next: <names>

If you haven't booked a check-in in 10+ days, ping me.
```

Update `cohort-2026Q3/README.md` with the same.

---

## When an engineer goes quiet

A 10-day gap with no booked check-in is your trigger. DM them directly. Two scripts:

**If they're stuck:** *"Hey, noticed you're on L2.2 — anything blocking you? Want me to look at your code, or do you want to skip ahead to L2.3 and come back?"*

**If life is getting in the way:** *"Hey, totally fine if real work is eating the time. Want to pause for a sprint, or downshift to one module every two weeks?"*

Don't lecture. Don't make it big. Most stalls resolve with a single DM.

---

## When you don't know the answer

Common in Level 3 modules, especially observability and safety. Three honest options:

1. **Defer to the standing technical advisor.** They sit above the cohort for exactly this reason.
2. **Say "I don't know — let's figure it out together"** and pull up the docs in the check-in.
3. **Book an external coaching slot** if it's a recurring gap (e.g. agent architecture). A peer at another company or an Anthropic forward-deployed engineer can cover the gap for a couple of months until your team has a real Level 4.

What you should *not* do is bluff. Engineers learn faster from a lead who admits ignorance and looks it up than from one who waves a hand.

---

## The optional all-hands session

If the team wants synchronous time together — and they often will, after a few weeks of self-paced work — schedule an optional 90-minute session every 2–4 weeks. Suggested shape:

- **First 30 min:** themed sharing. Pick one craft theme (prompting, evals, observability). Each engineer talks for 3–4 minutes about what they did at their level around that theme.
- **Middle 45 min:** capstone demos for anyone ready.
- **Last 15 min:** open Q&A. Bring the hardest question you didn't want to ask in a check-in.

This session is **not on the critical path**. Engineers can skip it without falling behind. It exists for team cohesion and cross-level pollination. If attendance drops below 4/6, kill it.

---

## Owning the curriculum

Modules will need to evolve as you run cohorts. If a probe question consistently flops, change it. If a starter file has a bug, fix it. If a real failure mode keeps not being covered, add a new module.

Changes go through PR to this repo. You're the default approver.

---

## Sign-off summary

Use this as the final sanity check before you mark a module complete in an engineer's `status.md`:

- [ ] All required artefacts present
- [ ] Walked through clearly, without reading from the screen
- [ ] Answered 2 of 3 probe questions credibly
- [ ] **Done when** criterion is met

Four of four → sign off.
Three of four → ask them to come back in 2–7 days on the specific gap.
Two or fewer → restart the module.
