import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserState } from "../types.ts";

const QUESTIONS: [string, string[]][] = [
  [
    "Have you called an LLM API (Anthropic, OpenAI, etc.) directly from code?",
    ["Never.", "Once or twice in a throwaway script.", "A few times for personal projects or internal tools.", "Yes, in production code I shipped."],
  ],
  [
    "Do you use an agentic CLI (Claude Code, Cursor agents, etc.) for real work?",
    ["I haven't tried one.", "I've tried it but don't use it regularly.", "I use it for most coding tasks.", "I customise hooks, slash commands, or sub-agents."],
  ],
  [
    "Have you implemented tool use / function calling?",
    ["No.", "I've read about it but not implemented it.", "I've defined a tool and parsed model calls.", "I've designed tool schemas for production agents."],
  ],
  [
    "Have you written evals for LLM output?",
    ["No.", "Manual rubric, eyeballed.", "10+ test cases I run before shipping.", "Eval suite running in CI, with judge models."],
  ],
  [
    "Have you shipped an LLM-backed feature to production?",
    ["No.", "A small internal tool with basic logging.", "A user-facing feature.", "Multiple, with observability and rollback plans."],
  ],
  [
    "When a prompt isn't working, how do you debug?",
    ["Reword and try again.", "I have a personal set of prompt patterns I try.", "I run regression cases and look at structured output.", "I trace tool calls and inspect reasoning steps."],
  ],
  [
    "Have you read the Anthropic API docs and Agent SDK docs?",
    ["No.", "Skimmed.", "Read the parts I use.", "Yes, including model cards and system updates."],
  ],
  [
    "Could you teach a colleague how to use Claude Code effectively?",
    ["No.", "The basics.", "Yes, with my own examples.", "I've already done this -- the team uses my workflows."],
  ],
  [
    "When you build with an LLM, how do you handle prompt injection / unsafe inputs?",
    ["I don't think about it.", "I know what it is but haven't defended against it.", "I sanitise inputs and scope tool permissions.", "I design system-wide guardrails and run injection tests."],
  ],
  [
    "Could you architect a multi-step agent (planner + executor + tools + memory)?",
    ["No.", "I could describe one but not build it.", "I've built simple ones.", "I architect them and mentor others on the patterns."],
  ],
];

function levelFor(score: number): { short: string; full: string; blurb: string; firstModule: string } {
  if (score <= 8)
    return { short: "L1", full: "Level 1 -- Novice", blurb: "You've used AI tools casually. Start with the L1 modules to build a daily, deliberate workflow.", firstModule: "L1.1" };
  if (score <= 16)
    return { short: "L2", full: "Level 2 -- Practitioner", blurb: "You're a confident daily user. Start with the L2 modules to learn the API, tool use, and evals.", firstModule: "L2.1" };
  if (score <= 24)
    return { short: "L3", full: "Level 3 -- Proficient", blurb: "You can build LLM features. Time to architect, observe, secure, and scale them.", firstModule: "L3.1" };
  return { short: "L4", full: "Level 4 -- Expert", blurb: "You're ready to architect cross-team systems and mentor others. See the Level 4 section in pathway.md.", firstModule: "--" };
}

interface Props {
  user: UserState;
  updateUser: (patch: Partial<UserState>) => void;
}

export default function Quiz({ user, updateUser }: Props) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [onboarding, setOnboarding] = useState(false);
  const [onboardMsg, setOnboardMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [retaking, setRetaking] = useState(false);
  const [prevLevelShort, setPrevLevelShort] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answers.some((a) => a === null)) {
      alert("Please answer all 10 questions.");
      return;
    }
    const score = answers.reduce<number>((s, a) => s + (a ?? 0), 0);
    const level = levelFor(score);
    updateUser({
      score,
      levelShort: level.short,
      levelFull: level.full,
      firstModule: level.firstModule,
    });
    if (user.onboarded && user.name) {
      try {
        await fetch("/api/onboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: user.name, score, levelShort: level.short, firstModule: level.firstModule }),
        });
      } catch {
        // silent — local state is updated regardless
      }
    }
    setRetaking(false);
    setSubmitted(true);
  }

  async function handleOnboard(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;
    setOnboarding(true);
    try {
      const r = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          score: user.score,
          levelShort: user.levelShort,
          firstModule: user.firstModule,
        }),
      });
      const data = (await r.json()) as { ok: boolean; message: string };
      if (data.ok) {
        updateUser({ name: trimmed, onboarded: true });
        setOnboardMsg({ ok: true, text: data.message });
      } else {
        setOnboardMsg({ ok: false, text: data.message ?? "Something went wrong." });
      }
    } catch {
      setOnboardMsg({ ok: false, text: "Could not reach the server. Make sure `npm run dev` is running." });
    } finally {
      setOnboarding(false);
    }
  }

  // Show results if submitted or if user already has a score and isn't mid-retake
  const showResults = submitted || (user.score !== null && !retaking);

  if (showResults) {
    const score = user.score!;
    const levelShort = user.levelShort!;
    const levelFull = user.levelFull!;
    return (
      <>
        <h1>Placement quiz</h1>
        {submitted && prevLevelShort && (
          <div className={`alert ${prevLevelShort !== levelShort ? "alert-success" : "alert-info"}`} style={{ marginBottom: "16px" }}>
            {prevLevelShort !== levelShort
              ? `Level updated: ${prevLevelShort} → ${levelShort}`
              : "Level confirmed — same placement as before."}
          </div>
        )}

        <div className="alert alert-success" style={{ fontWeight: 600, fontSize: "1rem" }}>
          Total score: {score} / 30
        </div>
        <h2>{levelFull}</h2>
        <p>{levelFor(score).blurb}</p>

        <button className="btn btn-secondary" style={{ marginBottom: "24px" }} onClick={() => { setPrevLevelShort(levelShort); setRetaking(true); setSubmitted(false); setAnswers(Array(QUESTIONS.length).fill(null)); }}>
          Retake the quiz
        </button>

        <hr />

        {levelShort === "L4" ? (
          <div className="alert alert-info">
            Since you placed at Level 4, there's no cohort folder to set up. See the <em>Engineer lead playbook</em> page and the Level 4 section in pathway.md.
          </div>
        ) : user.onboarded ? (
          <div className="alert alert-success">
            You're already onboarded as <strong>{user.name}</strong>. Head to <em>My modules</em> to get started.
          </div>
        ) : (
          <>
            <h2>Set up your cohort folder</h2>
            <form onSubmit={handleOnboard}>
              <div className="form-group">
                <label className="form-label">
                  Your name (lowercase, used as folder name -- e.g. "alex" or "alex-w")
                </label>
                <input
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. alex or alex-w"
                  pattern="[a-z0-9_-]+"
                />
                <div className="form-hint">Letters, numbers, hyphens, underscores only.</div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={onboarding}>
                {onboarding ? "Setting up..." : "Set up my folder"}
              </button>
            </form>

            {onboardMsg && (
              <div className={`alert ${onboardMsg.ok ? "alert-success" : "alert-error"}`} style={{ marginTop: "16px" }}>
                {onboardMsg.text}
                {onboardMsg.ok && (
                  <>
                    <br /><br />
                    <strong>Last step -- commit and push from your terminal:</strong>
                    <div className="code-block">{`git add cohort-2026Q3/\ngit commit -m "Add ${user.name} to cohort -- placed at ${levelShort}"\ngit push`}</div>
                    <button className="btn btn-primary" style={{ marginTop: "12px" }} onClick={() => navigate("/modules")}>
                      Go to My modules
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <h1>Placement quiz</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Ten questions, ~5 minutes. Answer honestly -- what you do today, not what you could do if you had to.
      </p>

      <form onSubmit={handleSubmit}>
        {QUESTIONS.map(([question, options], qi) => (
          <div className="radio-group" key={qi}>
            <div className="radio-question">{qi + 1}. {question}</div>
            {options.map((opt, oi) => (
              <label className="radio-option" key={oi}>
                <input
                  type="radio"
                  name={`q${qi}`}
                  value={oi}
                  checked={answers[qi] === oi}
                  onChange={() => {
                    const next = [...answers];
                    next[qi] = oi;
                    setAnswers(next);
                  }}
                />
                ({oi}) {opt}
              </label>
            ))}
          </div>
        ))}

        <button className="btn btn-primary" type="submit">
          Calculate my level
        </button>
      </form>
    </>
  );
}
