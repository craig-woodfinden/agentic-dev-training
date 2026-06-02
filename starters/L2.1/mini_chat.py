"""
L2.1 starter -- multi-turn streaming chat CLI.

Run:
  pip install anthropic
  export ANTHROPIC_API_KEY="sk-ant-..."
  python mini_chat.py

Type messages, press Enter. /reset clears history. Ctrl-D / Ctrl-C to quit.

The module asks you to:
  - extend this to count tokens and cost per turn
  - break it on purpose (max_tokens=1, rate limits, oversize context)
  - confirm the retry loop handles each failure
"""
import sys
import time
import anthropic

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-6"
SYSTEM = "You are a concise senior engineer. Be specific. Skip the fluff."


def call_with_retry(messages, max_attempts: int = 3):
    """Stream a response, retrying on transient errors with exponential backoff."""
    for attempt in range(max_attempts):
        try:
            with client.messages.stream(
                model=MODEL,
                max_tokens=1024,
                system=SYSTEM,
                messages=messages,
            ) as stream:
                print("claude> ", end="", flush=True)
                full = ""
                for text in stream.text_stream:
                    print(text, end="", flush=True)
                    full += text
                print()
                final = stream.get_final_message()
            return full, final.usage
        except anthropic.RateLimitError as e:
            wait = 2 ** attempt
            print(f"\n[rate limited -- sleeping {wait}s]", file=sys.stderr)
            time.sleep(wait)
        except anthropic.APIError as e:
            wait = 2 ** attempt
            print(f"\n[api error {type(e).__name__} -- sleeping {wait}s]", file=sys.stderr)
            time.sleep(wait)
    raise RuntimeError("retries exhausted")


def main() -> None:
    messages: list[dict] = []
    total_in = total_out = 0
    print("mini-chat -- type /reset to clear, Ctrl-D to quit\n")
    while True:
        try:
            user = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not user:
            continue
        if user == "/reset":
            messages = []
            total_in = total_out = 0
            print("[history cleared]")
            continue
        messages.append({"role": "user", "content": user})
        full, usage = call_with_retry(messages)
        messages.append({"role": "assistant", "content": full})
        total_in += usage.input_tokens
        total_out += usage.output_tokens
        print(f"[turn: in {usage.input_tokens}, out {usage.output_tokens} | "
              f"total: in {total_in}, out {total_out}]\n")


if __name__ == "__main__":
    main()
