import { useEffect, useState } from "react";
import type { Engineer } from "../types.ts";

export default function CohortStatus() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cohort")
      .then((r) => r.json())
      .then((data: { engineers: Engineer[] }) => setEngineers(data.engineers))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><h1>Cohort status</h1><p>Loading...</p></>;

  if (engineers.length === 0) {
    return (
      <>
        <h1>Cohort status</h1>
        <div className="alert alert-info">No engineers in the cohort yet.</div>
      </>
    );
  }

  const levelCounts: Record<string, number> = {};
  for (const e of engineers) {
    levelCounts[e.level] = (levelCounts[e.level] ?? 0) + 1;
  }

  return (
    <>
      <h1>Cohort status</h1>

      <div className="metrics" style={{ marginBottom: "24px" }}>
        {Object.entries(levelCounts).sort().map(([lvl, count]) => (
          <div className="metric-card" key={lvl}>
            <div className="metric-label">{lvl}</div>
            <div className="metric-value">{count} engineer{count !== 1 ? "s" : ""}</div>
          </div>
        ))}
      </div>

      <h2>All engineers</h2>
      <table>
        <thead>
          <tr>
            <th>Engineer</th>
            <th>Level</th>
            <th>Score</th>
            <th>Started</th>
          </tr>
        </thead>
        <tbody>
          {engineers.map((e) => (
            <tr key={e.name}>
              <td>{e.name}</td>
              <td>{e.level}</td>
              <td>{e.score}</td>
              <td>{e.started}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
