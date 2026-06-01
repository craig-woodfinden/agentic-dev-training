# L3.4 starter
- `judge.py` — eval runner supporting both substring and LLM-as-judge grading. Exits non-zero below threshold.
- `evals.example.csv` — sample CSV with mixed graders.
- `ci-workflow.yml` — drop into `.github/workflows/evals.yml` in your real repo.
- Wire it in, then break a prompt and watch CI catch it.
