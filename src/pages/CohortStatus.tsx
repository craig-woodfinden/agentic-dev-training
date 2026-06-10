import { useEffect, useState } from "react";
import type { Engineer, UserState } from "../types.ts";

interface Props {
  user: UserState;
}

export default function CohortStatus({ user }: Props) {
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.name) {
      setLoading(false);
      return;
    }
    fetch("/api/cohort")
      .then((r) => r.json())
      .then((data: { engineers: Engineer[] }) => {
        setEngineer(data.engineers.find((e) => e.name === user.name) ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.name]);

  if (!user.onboarded) {
    return (
      <>
        <h1>My status</h1>
        <div className="alert alert-warning">Take the placement quiz first to see your status.</div>
      </>
    );
  }

  if (loading) return <><h1>My status</h1><p>Loading...</p></>;

  if (!engineer) {
    return (
      <>
        <h1>My status</h1>
        <div className="alert alert-info">No status on record yet — complete the placement quiz to get started.</div>
      </>
    );
  }

  return (
    <>
      <h1>My status</h1>
      <div className="metrics">
        <div className="metric-card">
          <div className="metric-label">Level</div>
          <div className="metric-value">{engineer.level}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Score</div>
          <div className="metric-value">{engineer.score}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Started</div>
          <div className="metric-value">{engineer.started}</div>
        </div>
      </div>
    </>
  );
}
