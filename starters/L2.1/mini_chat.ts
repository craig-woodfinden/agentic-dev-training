/**
 * L2.1 starter -- multi-turn streaming chat CLI.
 *
 * Run:
 *   npm install
 *   export ANTHROPIC_API_KEY="sk-ant-..."   # bash/zsh
 *   $env:ANTHROPIC_API_KEY = "sk-ant-..."   # PowerShell
 *   npx ts-node mini_chat.ts
 *
 * Type messages, press Enter. /reset clears history. Ctrl-C to quit.
 *
 * The module asks you to:
 *   - extend this to count tokens and cost per turn
 *   - break it on purpose (max_tokens=1, rate limits, oversize context)
 *   - confirm the retry loop handles each failure
 */
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();
const MODEL = "claude-sonnet-4-6";
const SYSTEM = "You are a concise senior engineer. Be specific. Skip the fluff.";

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callWithRetry(
  messages: Anthropic.Messages.MessageParam[],
  maxAttempts = 3
): Promise<{ text: string; usage: Anthropic.Messages.Usage }> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      let full = "";
      let usage!: Anthropic.Messages.Usage;

      const stream = await client.messages.stream({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        messages,
      });

      process.stdout.write("claude> ");
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          process.stdout.write(chunk.delta.text);
          full += chunk.delta.text;
        }
      }
      console.log();

      const final = await stream.finalMessage();
      usage = final.usage;
      return { text: full, usage };
    } catch (err) {
      const wait = Math.pow(2, attempt) * 1000;
      if (err instanceof Anthropic.RateLimitError) {
        console.error(`\n[rate limited -- sleeping ${wait / 1000}s]`);
      } else if (err instanceof Anthropic.APIError) {
        console.error(`\n[api error ${err.constructor.name} -- sleeping ${wait / 1000}s]`);
      } else {
        throw err;
      }
      await sleep(wait);
    }
  }
  throw new Error("retries exhausted");
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const messages: Anthropic.Messages.MessageParam[] = [];
  let totalIn = 0;
  let totalOut = 0;

  console.log("mini-chat -- type /reset to clear, Ctrl-C to quit\n");

  const prompt = (): Promise<string> =>
    new Promise((resolve) => rl.question("you> ", resolve));

  rl.on("close", () => process.exit(0));

  while (true) {
    const user = (await prompt()).trim();
    if (!user) continue;
    if (user === "/reset") {
      messages.length = 0;
      totalIn = totalOut = 0;
      console.log("[history cleared]");
      continue;
    }

    messages.push({ role: "user", content: user });
    const { text, usage } = await callWithRetry(messages);
    messages.push({ role: "assistant", content: text });

    totalIn += usage.input_tokens;
    totalOut += usage.output_tokens;
    console.log(
      `[turn: in ${usage.input_tokens}, out ${usage.output_tokens} | ` +
      `total: in ${totalIn}, out ${totalOut}]\n`
    );
  }
}

main().catch(console.error);
