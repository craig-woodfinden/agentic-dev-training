"""
L2.2 starter — tool-using agent that answers questions about a local repo.

Usage:
  pip install anthropic
  export ANTHROPIC_API_KEY="sk-ant-..."
  python repo_agent.py /path/to/your/repo "Where is rate-limit handling?"

What the module asks you to do:
  - try several different questions and watch which tools the model picks
  - REMOVE the max_steps cap and see whether the model loops forever
  - REMOVE the path security check (DON'T COMMIT) and ask it to read /etc/passwd
  - make a tool description deliberately misleading; observe behaviour
Then put the safety checks back!
"""
import pathlib
import sys
import anthropic

MAX_STEPS = 10
MAX_BYTES = 50_000

TOOLS = [
    {
        "name": "list_files",
        "description": (
            "List files in the given directory of the repo. Use this to "
            "discover what code exists before reading it. Returns up to 100 "
            "file paths."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path relative to repo root. Empty string means repo root."}
            },
            "required": ["path"],
        },
    },
    {
        "name": "read_file",
        "description": (
            "Read the contents of a file in the repo. Use after list_files "
            "to inspect code. Files larger than 50KB are truncated."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path relative to repo root."}
            },
            "required": ["path"],
        },
    },
]


def make_tools(repo_root: pathlib.Path):
    def list_files(path: str) -> dict:
        p = (repo_root / path).resolve()
        if not str(p).startswith(str(repo_root)):
            return {"error": "path escapes repo"}
        if not p.exists():
            return {"error": f"path does not exist: {path}"}
        return {"files": [str(f.relative_to(repo_root)) for f in p.glob("*")][:100]}

    def read_file(path: str) -> dict:
        p = (repo_root / path).resolve()
        if not str(p).startswith(str(repo_root)):
            return {"error": "path escapes repo"}
        try:
            return {"content": p.read_text()[:MAX_BYTES]}
        except Exception as e:
            return {"error": str(e)}

    return {"list_files": list_files, "read_file": read_file}


def main() -> None:
    if len(sys.argv) < 3:
        print('usage: python repo_agent.py /path/to/repo "your question"')
        sys.exit(1)
    repo_root = pathlib.Path(sys.argv[1]).resolve()
    question = sys.argv[2]
    tools = make_tools(repo_root)

    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": question}]

    for step in range(MAX_STEPS):
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=TOOLS,
            messages=messages,
        )
        messages.append({"role": "assistant", "content": resp.content})

        if resp.stop_reason != "tool_use":
            text_block = next((b for b in resp.content if getattr(b, "type", None) == "text"), None)
            print("\n=== final answer ===\n")
            print(text_block.text if text_block else "<no text block>")
            return

        tool_results = []
        for block in resp.content:
            if getattr(block, "type", None) == "tool_use":
                print(f"[step {step}] tool: {block.name}  args: {block.input}")
                fn = tools.get(block.name)
                result = fn(**block.input) if fn else {"error": f"unknown tool {block.name}"}
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(result),
                })
        messages.append({"role": "user", "content": tool_results})

    print(f"\n[stopped at max_steps={MAX_STEPS} — agent did not finish]")


if __name__ == "__main__":
    main()
