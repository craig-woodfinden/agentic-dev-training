# Agent architecture sketch — <name of the problem>

Fill one of these in per problem. Aim for half a page, not five.

## The problem
One paragraph. Inputs, expected outputs, who/what it serves.

## Pattern chosen
- [ ] Router (classify, dispatch)
- [ ] ReAct (think-act loop)
- [ ] Planner-executor (plan first, then run)
- [ ] Sub-agents (decompose to specialists)

Why this pattern? One paragraph.

## Components
- Models (which model for which step):
- Tools (name + one-line purpose each):
- Memory / retrieval (if any):

## Stop conditions
- Step cap:
- Confidence threshold:
- Required human confirmation steps:

## One expected failure mode
What you think will go wrong first, and how the design handles it.

## What you'd switch to if this is wrong
The runner-up pattern and the one trigger that would make you switch.
