import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UserState, Module, ModuleCompletion } from "../types.ts";

const MODULE_ORDER = [
  "L1.1","L1.2","L1.3","L1.4",
  "L2.1","L2.2","L2.3","L2.4",
  "L3.1","L3.2","L3.3","L3.4",
];

function validateArtifact(code: string, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Required.";
  if (code === "L1.1") {
    if (trimmed.length < 20) return "Describe the hallucination in at least 20 characters.";
    return null;
  }
  const isGitHub =
    trimmed.startsWith("https://github.com/") ||
    trimmed.startsWith("https://gist.github.com/");
  if (!isGitHub) return "Must be a GitHub URL (https://github.com/… or https://gist.github.com/…).";
  return null;
}

function artifactPlaceholder(code: string): string {
  if (code === "L1.1") return "Describe the hallucination you found — prompt, what was claimed, what was wrong.";
  return "https://github.com/your-org/your-repo/…";
}

function artifactHint(code: string): string {
  if (code === "L1.1") return "No code link needed for this module — describe the hallucination you manufactured in your own words.";
  return "Must be a GitHub link (repo, branch, PR, commit, or gist).";
}

type ModuleStatus = "completed" | "current" | "locked";

function getStatus(
  code: string,
  firstModule: string | null,
  completions: Record<string, ModuleCompletion>
): ModuleStatus {
  if (!firstModule) return "locked";
  const startIdx = MODULE_ORDER.indexOf(firstModule);
  const idx = MODULE_ORDER.indexOf(code);
  if (idx < startIdx) return "locked";
  if (completions[code]) return "completed";
  const nextIncomplete = MODULE_ORDER.slice(startIdx).find((c) => !completions[c]);
  return code === nextIncomplete ? "current" : "locked";
}

function extractDoneWhen(markdown: string): string {
  const match = markdown.match(/## Done when\n([\s\S]*)$/);
  return match?.[1]?.trim() ?? "";
}

interface Props {
  user: UserState;
  updateUser: (patch: Partial<UserState>) => void;
}

export default function MyModules({ user, updateUser }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [starters, setStarters] = useState<string[]>([]);
  const [artifact, setArtifact] = useState("");
  const [doneChecked, setDoneChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const completions = user.moduleCompletions ?? {};

  useEffect(() => {
    fetch("/api/modules")
      .then((r) => r.json())
      .then((data: Module[]) => {
        const startIdx = user.firstModule ? MODULE_ORDER.indexOf(user.firstModule) : 0;
        const relevantCodes = new Set(MODULE_ORDER.slice(Math.max(startIdx, 0)));
        const filtered = data
          .filter((m) => relevantCodes.has(m.code))
          .sort((a, b) => MODULE_ORDER.indexOf(a.code) - MODULE_ORDER.indexOf(b.code));
        setModules(filtered);
        const current = filtered.find((m) => getStatus(m.code, user.firstModule, completions) === "current");
        const first = filtered.find((m) => getStatus(m.code, user.firstModule, completions) === "completed") ?? filtered[0];
        setSelectedId((current ?? first)?.id ?? "");
      })
      .catch(() => {});
  }, [user.firstModule]);

  useEffect(() => {
    if (!selectedId) return;
    setArtifact("");
    setDoneChecked(false);
    setSubmitMsg(null);
    fetch(`/api/modules/${encodeURIComponent(selectedId)}`)
      .then((r) => r.json())
      .then((data: { content: string }) => setContent(data.content))
      .catch(() => {});
    const code = selectedId.split("-")[0];
    fetch(`/api/starters/${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((data: { files: string[] }) => setStarters(data.files))
      .catch(() => {});
  }, [selectedId]);

  async function handleComplete() {
    if (!user.name || !selectedId) return;
    const code = selectedId.split("-")[0];
    setSubmitting(true);
    try {
      const r = await fetch("/api/complete-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, moduleCode: code, artifact: artifact.trim() }),
      });
      const data = (await r.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        const newCompletions: Record<string, ModuleCompletion> = {
          ...completions,
          [code]: { artifact: artifact.trim(), completedAt: new Date().toISOString() },
        };
        updateUser({ moduleCompletions: newCompletions });
        setSubmitMsg({ ok: true, text: data.message ?? `${code} marked as complete.` });
        const nextCode = MODULE_ORDER[MODULE_ORDER.indexOf(code) + 1];
        if (nextCode) {
          const nextModule = modules.find((m) => m.code === nextCode);
          if (nextModule) setTimeout(() => setSelectedId(nextModule.id), 1500);
        }
      } else {
        setSubmitMsg({ ok: false, text: data.message ?? "Something went wrong." });
      }
    } catch {
      setSubmitMsg({ ok: false, text: "Could not reach the server." });
    } finally {
      setSubmitting(false);
    }
  }

  if (!user.onboarded) {
    return (
      <>
        <h1>My modules</h1>
        <div className="alert alert-warning">Take the placement quiz first -- the modules need to know your level.</div>
      </>
    );
  }

  if (modules.length === 0) {
    return (
      <>
        <h1>My modules</h1>
        <div className="alert alert-info">
          {user.levelShort === "L4"
            ? "Level 4 is the sustaining role -- no modules to complete. See the Engineer lead playbook."
            : `No modules found for ${user.levelShort}.`}
        </div>
      </>
    );
  }

  const selectedModule = modules.find((m) => m.id === selectedId);
  const selectedCode = selectedId.split("-")[0];
  const selectedStatus = selectedModule
    ? getStatus(selectedModule.code, user.firstModule, completions)
    : "locked";
  const doneWhen = extractDoneWhen(content);
  const completion = completions[selectedCode];
  const completedCount = modules.filter((m) => completions[m.code]).length;

  return (
    <>
      <h1>My modules</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        {completedCount} of {modules.length} modules complete.
      </p>

      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* Left: module list */}
        <div style={{ width: "200px", flexShrink: 0 }}>
          {modules.map((m) => {
            const status = getStatus(m.code, user.firstModule, completions);
            const isSelected = m.id === selectedId;
            const isClickable = status !== "locked";

            let bg = "#fff";
            let border = "1px solid var(--iq-border)";
            let color = "var(--iq-ink)";
            if (isSelected) { bg = "var(--iq-navy)"; border = "1px solid var(--iq-navy)"; color = "#fff"; }
            else if (status === "completed") { bg = "#f0fdf4"; border = "1px solid #bbf7d0"; }
            else if (status === "locked") { bg = "var(--iq-grey)"; color = "#9ca3af"; }

            return (
              <div
                key={m.id}
                onClick={() => isClickable && setSelectedId(m.id)}
                style={{ padding: "10px 12px", marginBottom: "4px", borderRadius: "6px", cursor: isClickable ? "pointer" : "default", background: bg, border, color }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "2px", opacity: 0.7 }}>
                  {status === "completed" ? "✓ " : ""}{m.code}
                </div>
                <div style={{ fontSize: "0.8rem", lineHeight: "1.3" }}>{m.title}</div>
              </div>
            );
          })}
        </div>

        {/* Right: module content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {starters.length > 0 && (
            <details className="expander" style={{ marginBottom: "16px" }}>
              <summary>Starter files for {selectedCode}</summary>
              <div className="expander-body">
                <ul className="file-list">
                  {starters.map((f) => <li key={f}>starters/{selectedCode}/{f}</li>)}
                </ul>
              </div>
            </details>
          )}

          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>

          <hr />

          {/* Assessment / completion section */}
          {selectedStatus === "completed" && completion && (
            <div className="alert alert-success">
              <strong>{selectedCode} completed</strong> on {new Date(completion.completedAt).toLocaleDateString("en-AU")}.
              <br />
              <span style={{ fontSize: "0.85rem" }}>Artifact: <code>{completion.artifact}</code></span>
            </div>
          )}

          {selectedStatus === "current" && (
            <div style={{ background: "var(--iq-grey)", border: "1px solid var(--iq-border)", borderRadius: "8px", padding: "24px" }}>
              <h2 style={{ marginTop: 0 }}>Complete this module</h2>
              <p style={{ color: "#555", marginBottom: "20px" }}>
                Check the criteria below, paste a link or path to what you built, then submit to unlock the next module.
              </p>

              {doneWhen && (
                <div style={{ background: "#fff", border: "1px solid var(--iq-border)", borderRadius: "6px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: "#888", marginBottom: "8px" }}>DONE WHEN</div>
                  <div className="markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{doneWhen}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", fontSize: "0.95rem" }}>
                  <input
                    type="checkbox"
                    checked={doneChecked}
                    onChange={(e) => setDoneChecked(e.target.checked)}
                    style={{ marginTop: "3px", flexShrink: 0 }}
                  />
                  <span>I confirm I meet all the criteria above.</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {selectedCode === "L1.1" ? "What hallucination did you find?" : "Artifact — GitHub link to what you built"}
                </label>
                <input
                  className="form-input"
                  value={artifact}
                  onChange={(e) => setArtifact(e.target.value)}
                  placeholder={artifactPlaceholder(selectedCode)}
                />
                {artifact.trim() && validateArtifact(selectedCode, artifact) && (
                  <div className="form-hint" style={{ color: "var(--iq-pink)", marginTop: "4px" }}>
                    {validateArtifact(selectedCode, artifact)}
                  </div>
                )}
                {(!artifact.trim() || !validateArtifact(selectedCode, artifact)) && (
                  <div className="form-hint">{artifactHint(selectedCode)}</div>
                )}
              </div>

              <button
                className="btn btn-primary"
                onClick={handleComplete}
                disabled={!doneChecked || !!validateArtifact(selectedCode, artifact) || submitting}
              >
                {submitting ? "Saving..." : `Mark ${selectedCode} complete and unlock next`}
              </button>

              {submitMsg && (
                <div className={`alert ${submitMsg.ok ? "alert-success" : "alert-error"}`} style={{ marginTop: "16px" }}>
                  {submitMsg.text}
                </div>
              )}
            </div>
          )}

          {selectedStatus === "locked" && (
            <div className="alert alert-info">Complete the previous module to unlock this one.</div>
          )}
        </div>
      </div>
    </>
  );
}
