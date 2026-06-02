/**
 * L2.3 starter -- minimal eval runner.
 *
 * Reads evals.csv with columns: category, input, expected.
 * Runs your prompt over each row. Writes results.csv with pass/fail.
 *
 * Edit YOUR_PROMPT below to be the prompt you're testing.
 *
 * Run:
 *   npm install
 *   npx ts-node run_evals.ts
 */
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as readline from "readline";

const client = new Anthropic();
const MODEL = "claude-haiku-4-5";

const YOUR_PROMPT =
  "Extract decisions, owners, and open questions from the text below. " +
  "Return strict JSON only.\n\n" +
  "TEXT:\n{input}";

interface EvalRow {
  category: string;
  input: string;
  expected: string;
}

async function runPrompt(inputText: string): Promise<string> {
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: YOUR_PROMPT.replace("{input}", inputText),
      },
    ],
  });
  return resp.content[0].type === "text" ? resp.content[0].text : "";
}

function grade(output: string, expected: string): boolean {
  // Substring grade -- simple on purpose. Upgrade to LLM-as-judge in L3.4.
  return output.toLowerCase().includes(expected.toLowerCase());
}

function parseCsv(content: string): EvalRow[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    return {
      category: vals[headers.indexOf("category")] ?? "",
      input: vals[headers.indexOf("input")] ?? "",
      expected: vals[headers.indexOf("expected")] ?? "",
    };
  });
}

(async () => {
  if (!fs.existsSync("evals.csv")) {
    console.log("No evals.csv in cwd. Copy evals.example.csv and edit.");
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync("evals.csv", "utf-8"));
  let passed = 0;
  const results: string[] = ["category,input,expected,passed,output"];

  for (const row of rows) {
    const output = await runPrompt(row.input);
    const ok = grade(output, row.expected);
    if (ok) passed++;
    results.push(
      [row.category, row.input, row.expected, ok, output]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    console.log(
      `[${ok ? "PASS" : "FAIL"}] ${row.category.padEnd(14)} ${row.input.slice(0, 60)}`
    );
  }

  fs.writeFileSync("results.csv", results.join("\n"));
  console.log(`\n${passed}/${rows.length} passed (${Math.round((100 * passed) / rows.length)}%)`);
})();
