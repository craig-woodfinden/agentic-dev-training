/**
 * L3.4 starter -- LLM-as-judge eval runner.
 *
 * Reads evals.csv with columns: category, input, expected_or_rubric, grader.
 * - grader=substring: simple contains-check (cheap, deterministic)
 * - grader=judge: send to a judge model with a rubric, expect 0/1/2 score
 *
 * Run:
 *   npm install
 *   npx ts-node judge.ts --threshold 0.85
 * Exit code 1 if below threshold -- wire this into CI.
 */
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();

const CANDIDATE_MODEL = "claude-haiku-4-5";
const JUDGE_MODEL = "claude-sonnet-4-6"; // NOT Haiku -- too lenient as a judge

const YOUR_PROMPT =
  "Extract decisions, owners, and open questions from the text below. " +
  "Return strict JSON only.\n\n" +
  "TEXT:\n{input}";

const JUDGE_PROMPT = `You are grading a model's output. Be strict.

Question to the model:
{input}

Rubric for a good answer:
{rubric}

Model output:
{output}

Reply with strict JSON only:
{"score": <0|1|2>, "reason": "<one sentence>"}

0 = wrong or misses the point. 1 = partially right. 2 = correct and well-formed.`;

interface EvalRow {
  category: string;
  input: string;
  expected_or_rubric: string;
  grader: string;
}

async function runCandidate(inputText: string): Promise<string> {
  const resp = await client.messages.create({
    model: CANDIDATE_MODEL,
    max_tokens: 512,
    messages: [{ role: "user", content: YOUR_PROMPT.replace("{input}", inputText) }],
  });
  return resp.content[0].type === "text" ? resp.content[0].text : "";
}

function gradeSubstring(output: string, expected: string): number {
  return output.toLowerCase().includes(expected.toLowerCase()) ? 2 : 0;
}

async function gradeJudge(
  inputText: string,
  rubric: string,
  output: string
): Promise<{ score: number; reason: string }> {
  const resp = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: JUDGE_PROMPT.replace("{input}", inputText)
          .replace("{rubric}", rubric)
          .replace("{output}", output),
      },
    ],
  });
  const text = (resp.content[0].type === "text" ? resp.content[0].text : "").trim();
  try {
    const verdict = JSON.parse(text) as { score: number; reason: string };
    return { score: verdict.score ?? 0, reason: verdict.reason ?? "" };
  } catch {
    return { score: 0, reason: `judge returned unparseable response: ${text.slice(0, 120)}` };
  }
}

function parseCsv(content: string): EvalRow[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    return {
      category: vals[headers.indexOf("category")] ?? "",
      input: vals[headers.indexOf("input")] ?? "",
      expected_or_rubric: vals[headers.indexOf("expected_or_rubric")] ?? "",
      grader: vals[headers.indexOf("grader")] ?? "substring",
    };
  });
}

(async () => {
  const args = process.argv.slice(2);
  const thresholdIdx = args.indexOf("--threshold");
  const threshold = thresholdIdx >= 0 ? parseFloat(args[thresholdIdx + 1]) : 0.85;
  const evalsIdx = args.indexOf("--evals");
  const evalsFile = evalsIdx >= 0 ? args[evalsIdx + 1] : "evals.csv";

  const rows = parseCsv(fs.readFileSync(evalsFile, "utf-8"));
  let total = 0;
  let maxPossible = 0;
  const csvRows = ["category,grader,score,max,input,output,reason"];

  for (const row of rows) {
    const output = await runCandidate(row.input);
    let score: number;
    let reason = "";
    const maxScore = 2;

    if (row.grader === "judge") {
      const verdict = await gradeJudge(row.input, row.expected_or_rubric, output);
      score = verdict.score;
      reason = verdict.reason;
    } else {
      score = gradeSubstring(output, row.expected_or_rubric);
    }

    total += score;
    maxPossible += maxScore;

    csvRows.push(
      [row.category, row.grader, score, maxScore, row.input, output, reason]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    console.log(
      `[${row.grader.padEnd(9)}] ${score}/${maxScore}  ${row.category.padEnd(14)} ${row.input.slice(0, 60)}`
    );
  }

  fs.writeFileSync("results.csv", csvRows.join("\n"));

  const passRate = total / maxPossible;
  console.log(
    `\n${total}/${maxPossible} points (${(100 * passRate).toFixed(1)}%) -- threshold ${(100 * threshold).toFixed(0)}%`
  );
  if (passRate < threshold) {
    console.log("FAIL");
    process.exit(1);
  }
  console.log("PASS");
})();
