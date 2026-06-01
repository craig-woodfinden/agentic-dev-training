---
description: Summarise the diff against main as a PR description.
allowed-tools: Bash(git diff:*), Bash(git log:*)
---

Run `git fetch origin main` and then `git diff origin/main...HEAD --stat` plus
`git log origin/main..HEAD --oneline`.

Write a PR description in this shape:

## What
One paragraph on what changes and why.

## How
Bullet list of the meaningful changes.

## Risk
What could break. What you tested.

## Test plan
What the reviewer should run.
