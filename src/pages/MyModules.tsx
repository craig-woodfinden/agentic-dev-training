import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UserState, Module } from "../types.ts";

interface Props {
  user: UserState;
}

export default function MyModules({ user }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [starters, setStarters] = useState<string[]>([]);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/modules")
      .then((r) => r.json())
      .then((data: Module[]) => {
        const level = user.levelShort ?? "L1";
        const filtered = level === "L4" ? [] : data.filter((m) => m.code.startsWith(level + "."));
        setModules(filtered);
        if (filtered.length > 0) setSelectedId(filtered[0].id);
      })
      .catch(() => {});
  }, [user.levelShort]);

  useEffect(() => {
    if (!selectedId) return;
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

  async function markInProgress() {
    if (!user.name || !selectedId) return;
    const code = selectedId.split("-")[0];
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: user.name, moduleCode: code }),
    });
    setProgressMsg(`Cohort table updated -- you're on ${code}.`);
    setTimeout(() => setProgressMsg(null), 4000);
  }

  if (!user.onboarded) {
    return (
      <>
        <h1>My modules</h1>
        <div className="alert alert-warning">
          Take the placement quiz first -- the modules need to know your level.
        </div>
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
  const code = selectedId.split("-")[0];

  return (
    <>
      <h1>My modules</h1>
      <p style={{ marginBottom: "16px" }}>
        You're on <strong>{user.levelShort}</strong>. Pick this week's module:
      </p>

      <div className="form-group">
        <select
          className="form-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.code} -- {m.title}
            </option>
          ))}
        </select>
      </div>

      {starters.length > 0 && (
        <details className="expander" style={{ marginBottom: "16px" }}>
          <summary>Starter files for {code}</summary>
          <div className="expander-body">
            <ul className="file-list">
              {starters.map((f) => (
                <li key={f}>starters/{code}/{f}</li>
              ))}
            </ul>
            <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "8px" }}>
              Open these in your editor or run them from the terminal.
            </p>
          </div>
        </details>
      )}

      {user.name && (
        <div style={{ marginBottom: "16px" }}>
          <button className="btn btn-secondary" onClick={markInProgress}>
            I'm starting {code} -- mark on my row
          </button>
          {progressMsg && (
            <span style={{ marginLeft: "12px", fontSize: "0.85rem", color: "#1FAB3A" }}>
              {progressMsg}
            </span>
          )}
        </div>
      )}

      <hr />

      <div className="markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      <hr />

      <h2>Ready for your check-in?</h2>
      <p>
        Once you've worked through the <em>Do</em> section and run the <em>Self-check</em>, head to the{" "}
        <strong>Check-in helper</strong> page -- it shows what to bring, then reach out to your engineer lead.
      </p>
    </>
  );
}
