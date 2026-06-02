/**
 * L1.2 starter -- run the same task through five different prompt patterns.
 *
 * Edit INPUT below to be a real piece of messy text from your work
 * (Teams chat, meeting notes, customer email -- anonymise if needed).
 *
 * Each PATTERN is a different prompt design. Run them all, compare the
 * outputs. Save your winner to ../../cohort-2026Q3/<your-name>/L1.2-prompt-v1.txt
 *
 * Run:
 *   npx ts-node try_pattern.ts 1     # runs pattern 1 only
 *   npx ts-node try_pattern.ts all   # runs all five
 */
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-haiku-4-5";

const INPUT = `
PASTE YOUR MESSY TEXT HERE.

A long Teams chat, a meeting note, a customer email, a JIRA comment.
Anonymise it if needed.
`;

const EXAMPLE_INPUT = `We discussed shipping the auth flow this Friday. Ana
will own the backend changes and asks for an extra reviewer. We still
don't know if SSO is in scope -- leaving that to next standup.`;

const EXAMPLE_OUTPUT = {
  decisions: ["Ship auth flow this Friday"],
  owners: ["Ana -- backend changes"],
  open_questions: ["Is SSO in scope?"],
};

const PATTERNS: Record<string, { label: string; system: string | null; user: string; prefill: string | null }> = {
  "1": {
    label: "Bare instruction",
    system: null,
    user: `Summarise the decisions, owners, and open questions from this text: ${INPUT}`,
    prefill: null,
  },
  "2": {
    label: "Instruction + format spec",
    system: null,
    user:
      "Extract decisions, owners, and open questions from the text below. " +
      "Return strict JSON with keys decisions (list of strings), owners " +
      "(list of strings), open_questions (list of strings). No prose.\n\n" +
      `TEXT:\n${INPUT}`,
    prefill: null,
  },
  "3": {
    label: "Few-shot example",
    system: null,
    user:
      "Extract decisions, owners, and open questions as strict JSON.\n\n" +
      `EXAMPLE INPUT:\n${EXAMPLE_INPUT}\n\n` +
      `EXAMPLE OUTPUT:\n${JSON.stringify(EXAMPLE_OUTPUT)}\n\n` +
      `NOW DO THE SAME FOR THIS INPUT:\n${INPUT}`,
    prefill: null,
  },
  "4": {
    label: "System prompt + role",
    system:
      "You are an analyst who extracts structured information from " +
      "meeting notes. You always return strict JSON with keys " +
      "decisions, owners, open_questions. You never add prose.",
    user: INPUT,
    prefill: null,
  },
  "5": {
    label: "System prompt + prefill",
    system:
      "You are an analyst who extracts structured information from " +
      "meeting notes. Return strict JSON with keys decisions, owners, " +
      "open_questions.",
    user: INPUT,
    prefill: '{"decisions": [',
  },
};

async function run(patternId: string): Promise<void> {
  const p = PATTERNS[patternId];
  console.log(`\n=== Pattern ${patternId}: ${p.label} ===`);

  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: p.user },
  ];
  if (p.prefill) {
    messages.push({ role: "assistant", content: p.prefill });
  }

  const params: Anthropic.Messages.MessageCreateParamsNonStreaming = {
    model: MODEL,
    max_tokens: 600,
    messages,
  };
  if (p.system) params.system = p.system;

  const resp = await client.messages.create(params);
  const raw = resp.content[0].type === "text" ? resp.content[0].text : "";
  const out = (p.prefill ?? "") + raw;
  console.log(out);
  console.log(`--- in: ${resp.usage.input_tokens}, out: ${resp.usage.output_tokens}`);
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.log("usage: npx ts-node try_pattern.ts [1|2|3|4|5|all]");
    process.exit(1);
  }
  if (arg === "all") {
    for (const k of Object.keys(PATTERNS)) await run(k);
  } else {
    await run(arg);
  }
})();
