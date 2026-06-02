# Placement quiz

Ten questions, ~5 minutes. Pick the option that honestly describes what you do today -- not what you could do if you had to, and not what you did once last year.

Score yourself at the end, or run `python score_quiz.py` for an interactive version.

---

### 1. Have you called an LLM API (Anthropic, OpenAI, etc.) directly from code?

- (0) Never.
- (1) Once or twice in a throwaway script.
- (2) A few times for personal projects or internal tools.
- (3) Yes, in production code I shipped.

### 2. Do you use an agentic CLI (Claude Code, Cursor agents, etc.) for real work?

- (0) I haven't tried one.
- (1) I've tried it but don't use it regularly.
- (2) I use it for most coding tasks.
- (3) I customise hooks, slash commands, or sub-agents.

### 3. Have you implemented tool use / function calling?

- (0) No.
- (1) I've read about it but not implemented it.
- (2) I've defined a tool and parsed model calls.
- (3) I've designed tool schemas for production agents.

### 4. Have you written evals for LLM output?

- (0) No.
- (1) Manual rubric, eyeballed.
- (2) 10+ test cases I run before shipping.
- (3) Eval suite running in CI, with judge models.

### 5. Have you shipped an LLM-backed feature to production?

- (0) No.
- (1) A small internal tool with basic logging.
- (2) A user-facing feature.
- (3) Multiple, with observability and rollback plans.

### 6. When a prompt isn't working, how do you debug?

- (0) Reword and try again.
- (1) I have a personal set of prompt patterns I try.
- (2) I run regression cases and look at structured output.
- (3) I trace tool calls and inspect reasoning steps.

### 7. Have you read the Anthropic API docs and Agent SDK docs?

- (0) No.
- (1) Skimmed.
- (2) Read the parts I use.
- (3) Yes, including model cards and system updates.

### 8. Could you teach a colleague how to use Claude Code effectively?

- (0) No.
- (1) The basics.
- (2) Yes, with my own examples.
- (3) I've already done this -- the team uses my workflows.

### 9. When you build with an LLM, how do you handle prompt injection / unsafe inputs?

- (0) I don't think about it.
- (1) I know what it is but haven't defended against it.
- (2) I sanitise inputs and scope tool permissions.
- (3) I design system-wide guardrails and run injection tests.

### 10. Could you architect a multi-step agent (planner + executor + tools + memory)?

- (0) No.
- (1) I could describe one but not build it.
- (2) I've built simple ones.
- (3) I architect them and mentor others on the patterns.

---

## Scoring

Add up the numbers next to your answers. Total is 0-30.

| Score   | Start at                    | What that means                                                                 |
|---------|-----------------------------|---------------------------------------------------------------------------------|
| 0 - 8   | **Level 1 -- Novice**        | You've used AI tools casually. Time to build a daily, deliberate workflow.       |
| 9 - 16  | **Level 2 -- Practitioner**  | You're a confident daily user. Time to call the API, design tools, write evals.  |
| 17 - 24 | **Level 3 -- Proficient**    | You can build LLM features. Time to architect, observe, secure, and scale them.  |
| 25 - 30 | **Level 4 -- Expert**        | You're ready to architect cross-team systems and mentor others.                  |

**Not sure?** Round down. The first module of any level is fast for someone who already knows the material, and you'll only level up faster.
