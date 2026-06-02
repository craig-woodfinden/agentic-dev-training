"""
L1.1 starter -- your first Anthropic API call.

Run:
  pip install anthropic
  export ANTHROPIC_API_KEY="sk-ant-..."
  python hello_claude.py

Then change `temperature` and `max_tokens` and re-run. The module asks you
to notice what changes.
"""
import anthropic

client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=200,
    temperature=0.7,
    messages=[
        {"role": "user", "content": "Write a four-line poem about debugging at 2am."}
    ],
)

print(resp.content[0].text)
print(f"\n--- in: {resp.usage.input_tokens} tokens, out: {resp.usage.output_tokens} tokens")

# Things to try:
# 1) Set temperature=0.0 and run twice. Are outputs identical? Why?
# 2) Set temperature=1.0 and run twice. What changed?
# 3) Drop max_tokens to 20. Graceful or cut off?
# 4) Ask Claude to "name three real Anthropic papers from 2024 with arXiv links".
#    Do NOT trust the answer. Try to verify one of them.
