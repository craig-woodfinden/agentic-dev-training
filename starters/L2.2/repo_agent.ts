/**
 * L2.2 starter -- tool-using agent that answers questions about a local repo.
 *
 * Usage:
 *   npm install
 *   export ANTHROPIC_API_KEY="sk-ant-..."   # bash/zsh
 *   $env:ANTHROPIC_API_KEY = "sk-ant-..."   # PowerShell
 *   npx ts-node repo_agent.ts /path/to/your/repo "Where is rate-limit handling?"
 *
 * What the module asks you to do:
 *   - try several different questions and watch which tools the model picks
 *   - REMOVE the max_steps cap and see whether the model loops forever
 *   - REMOVE the path security check (DON'T COMMIT) and ask it to read /etc/passwd
 *   - make a tool description deliberately misleading; observe behaviour
 * Then put the safety checks back!
 */
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const MAX_STEPS = 10;
const MAX_BYTES = 50_000;

const TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "list_files",
    description:
      "List files in the given directory of the repo. Use this to " +
      "discover what code exists before reading it. Returns up to 100 file paths.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path relative to repo root. Empty string means repo root.",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "read_file",
    description:
      "Read the contents of a file in the repo. Use after list_files " +
      "to inspect code. Files larger than 50KB are truncated.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Path relative to repo root." },
      },
      required: ["path"],
    },
  },
];

function makeTools(repoRoot: string) {
  function listFiles(filePath: string): Record<string, unknown> {
    const p = path.resolve(repoRoot, filePath);
    if (!p.startsWith(repoRoot)) return { error: "path escapes repo" };
    if (!fs.existsSync(p)) return { error: `path does not exist: ${filePath}` };
    const entries = fs.readdirSync(p).slice(0, 100);
    return { files: entries.map((e) => path.relative(repoRoot, path.join(p, e))) };
  }

  function readFile(filePath: string): Record<string, unknown> {
    const p = path.resolve(repoRoot, filePath);
    if (!p.startsWith(repoRoot)) return { error: "path escapes repo" };
    try {
      const content = fs.readFileSync(p, "utf-8").slice(0, MAX_BYTES);
      return { content };
    } catch (e) {
      return { error: String(e) };
    }
  }

  return { list_files: listFiles, read_file: readFile };
}

async function main(): Promise<void> {
  if (process.argv.length < 4) {
    console.log('usage: npx ts-node repo_agent.ts /path/to/repo "your question"');
    process.exit(1);
  }
  const repoRoot = path.resolve(process.argv[2]);
  const question = process.argv[3];
  const tools = makeTools(repoRoot);

  const client = new Anthropic();
  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: question },
  ];

  for (let step = 0; step < MAX_STEPS; step++) {
    const resp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools: TOOLS,
      messages,
    });
    messages.push({ role: "assistant", content: resp.content });

    if (resp.stop_reason !== "tool_use") {
      const textBlock = resp.content.find((b) => b.type === "text");
      console.log("\n=== final answer ===\n");
      console.log(textBlock?.type === "text" ? textBlock.text : "<no text block>");
      return;
    }

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    for (const block of resp.content) {
      if (block.type === "tool_use") {
        console.log(`[step ${step}] tool: ${block.name}  args: ${JSON.stringify(block.input)}`);
        const fn = tools[block.name as keyof typeof tools];
        const result = fn
          ? fn((block.input as Record<string, string>).path)
          : { error: `unknown tool ${block.name}` };
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }

  console.log(`\n[stopped at max_steps=${MAX_STEPS} -- agent did not finish]`);
}

main().catch(console.error);
