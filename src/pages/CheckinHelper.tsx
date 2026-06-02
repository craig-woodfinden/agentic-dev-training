import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UserState, Module } from "../types.ts";

interface Props {
  user: UserState;
}

function extractSection(markdown: string, heading: string): string {
  const re = new RegExp(`## ${heading}[\\s\\S]*?(?=\\n## |$)`, "m");
  const match = re.exec(markdown);
  if (!match) return "";
  return match[0].replace(/^## .+\n/, "").trim();
}

export default function CheckinHelper({ user }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch("/api/modules")
      .then((r) => r.json())
      .then((data: Module[]) => {
        const level = user.levelShort ?? "L1";
        const filtered = data.filter((m) => m.code.startsWith(level + "."));
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
  }, [selectedId]);

  if (!user.onboarded) {
    return (
      <>
        <h1>Check-in helper</h1>
        <div className="alert alert-warning">Take the placement quiz first.</div>
      </>
    );
  }

  const selfCheck = extractSection(content, "Self-check before your check-in");
  const checkinSection = extractSection(content, "Check-in with your engineer lead");

  return (
    <>
      <h1>Check-in helper</h1>

      <div className="form-group">
        <label className="form-label">Which module did you just finish?</label>
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

      <div className="alert alert-info">
        <strong>Reach out to your engineer lead</strong> to set up a 15-minute check-in for{" "}
        {selectedId.split("-")[0]}. Use whatever channel your team uses -- Teams chat, walk-up, calendar
        invite. The lead will confirm a time.
      </div>

      {selfCheck && (
        <details className="expander" open>
          <summary>Self-check -- make sure you can answer these first</summary>
          <div className="expander-body markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selfCheck}</ReactMarkdown>
          </div>
        </details>
      )}

      {checkinSection && (
        <details className="expander" open>
          <summary>What to bring to the check-in</summary>
          <div className="expander-body markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{checkinSection}</ReactMarkdown>
          </div>
        </details>
      )}

      <hr />

      <strong>The check-in itself takes 15 minutes:</strong>
      <ul style={{ paddingLeft: "24px", marginTop: "10px", lineHeight: "1.8" }}>
        <li>2 min -- you name the module, the lead opens your status.md</li>
        <li>5-7 min -- you walk through what you built. You drive, they listen.</li>
        <li>3-5 min -- they ask 2-3 probe questions from the module's check-in section.</li>
        <li>1-2 min -- they sign you off in your status.md.</li>
      </ul>
    </>
  );
}
