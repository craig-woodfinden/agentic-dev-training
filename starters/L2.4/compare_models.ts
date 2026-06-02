/**
 * L2.4 starter -- run the same eval set against three models.
 *
 * Builds on L2.3. Reads evals.csv, runs each row against Haiku, Sonnet, and Opus,
 * writes model_comparison.csv with pass rate, tokens, latency per model.
 *
 * Update YOUR_PROMPT to match your L2.3 prompt.
 *
 * Run:
 *   npm install
 *   npx ts-node compare_models.ts
 */
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();

const MODELS = ["claude-haiku-4-5", "claude-sonnet-4-6", "claude-opus-4-5"];

const YOUR_PROMPT =
  "Extract decisions, owners, and open questions from the text below. " +
  "Return strict JSON only.\n\n" +
  "TEXT:\n{input}";

interface EvalRow {
  category: string;
  input: string;
  expected: string;
}

async function run(
  model: string,
  inputText: string
): Promise<{ text: string; inTok: number; outTok: number; ms: number }> {
  const t0 = Date.now();
  const resp = await client.messages.create({
    model,
    max_tokens: 512,
    messages: [{ role: "user", content: YOUR_PROMPT.replace("{input}", inputText) }],
  });
  const ms = Date.now() - t0;
  const text = resp.content[0].type === "text" ? resp.content[0].text : "";
  return { text, inTok: resp.usage.input_tokens, outTok: resp.usage.output_tokens, ms };
}

function grade(output: string, expected: string): boolean {
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
  const rows = parseCsv(fs.readFileSync("evals.csv", "utf-8"));
  const summary: Record<string, { passed: number; total: number; inTok: number; outTok: number; ms: number[] }> =
    Object.fromEntries(MODELS.map((m) => [m, { passed: 0, total: 0, inTok: 0, outTok: 0, ms: [] }]));

  const csvRows = ["model,category,input,passed,in_tok,out_tok,ms,output"];

  for (const row of rows) {
    for (const m of MODELS) {
      const { text, inTok, outTok, ms } = await run(m, row.input);
      const ok = grade(text, row.expected);
      csvRows.push(
        [m, row.category, row.input, ok, inTok, outTok, ms, text]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
      const s = summary[m];
      s.total++;
      if (ok) s.passed++;
      s.inTok += inTok;
      s.outTok += outTok;
      s.ms.push(ms);
      console.log(`[${m.padEnd(24)}] ${ok ? "PASS" : "FAIL"}  ${ms}ms  ${row.input.slice(0, 50)}`);
    }
  }

  fs.writeFileSync("model_comparison.csv", csvRows.join("\n"));

  console.log("\n=== summary ===");
  for (const m of MODELS) {
    const s = summary[m];
    const msMedian = [...s.ms].sort((a, b) => a - b)[Math.floor(s.ms.length / 2)];
    console.log(
      `${m.padEnd(24)}  pass ${s.passed}/${s.total}  in ${String(s.inTok).padStart(6)} tok  out ${String(s.outTok).padStart(6)} tok  median ${msMedian}ms`
    );
  }

  console.log("\nLook up pricing at https://docs.claude.com/en/docs/about-claude/pricing");
  console.log("Compute cost = (in_tok * input_price + out_tok * output_price) / 1_000_000");
})();
