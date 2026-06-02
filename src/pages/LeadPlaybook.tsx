import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LeadPlaybook() {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/playbook")
      .then((r) => {
        if (!r.ok) throw new Error("Playbook not found.");
        return r.json();
      })
      .then((data: { content: string }) => setContent(data.content))
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <h1>Engineer lead playbook</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Operating manual for the engineer running this cohort. Worth a 10-minute read before the first check-in.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {!content && !error && <p>Loading...</p>}
      {content && (
        <div className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </>
  );
}
