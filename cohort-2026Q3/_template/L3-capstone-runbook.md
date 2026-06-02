# L3 Capstone -- Production Agent

**Feature name:**
**Production link / docs:**
**Date shipped:**
**Models used:**

## What it does

One paragraph. Who it's for, what it replaces.

## Architecture

- Pattern: ReAct / planner-executor / router / sub-agent / other
- Tools:
- Memory / state:
- Loop cap / stop conditions:

(Attach a diagram or link to one.)

## Evals

- Eval suite location:
- CI job link:
- Current pass rate:
- Threshold to block merge:

## Observability

- Dashboard link:
- Three alerts wired up:
  1. Error rate > 5% over 5 min
  2. Cost spike (>2x rolling avg)
  3. Quality alert (eval drop / tool-use rate drop)

## Failure modes documented

A list with one mitigation per row.

| Failure mode | How we detect | Mitigation |
|---|---|---|
|  |  |  |

## Rollback plan

The exact commands or PR to revert. Should fit in a paragraph.

## Post-launch retro

Once the feature has been live for 4+ weeks, write a one-page retro here:
- What stayed stable
- What surprised us
- Real production traces that became new eval cases
