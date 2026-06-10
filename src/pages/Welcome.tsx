import type { UserState } from "../types.ts";

export default function Welcome({ user }: { user: UserState }) {

  return (
    <>
      <h1>Agentic Development Training</h1>
      <p>
        A self-paced pathway from your first deliberate use of an AI coding assistant through to
        shipping production agents with evals, observability, and rollback plans.
      </p>

      <div className="metrics">
        <div className="metric-card">
          <div className="metric-label">Modules</div>
          <div className="metric-value">12 across 3 levels</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Time per week</div>
          <div className="metric-value">~90 min &middot; self-paced</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Check-ins</div>
          <div className="metric-value">15 min, 1:1 with the lead</div>
        </div>
      </div>

      <hr />

      <h2>How this works</h2>
      <ol style={{ paddingLeft: "24px", lineHeight: "1.8" }}>
        <li><strong>Take the placement quiz</strong> in the sidebar. Five minutes. It tells you which level to start on.</li>
        <li><strong>The app sets up your cohort folder automatically</strong> when you finish the quiz.</li>
        <li><strong>Work through your level's modules</strong> in the <em>My modules</em> page. One per week is the default.</li>
        <li><strong>Reach out to the engineer lead</strong> to book a 15-minute check-in when you finish each module.</li>
        <li><strong>Move up a level</strong> when all four exit criteria are met and the lead signs you off.</li>
      </ol>

      <hr />

      <h2>The four levels at a glance</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Profile</th>
            <th>Capstone</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1 -- Novice</strong></td>
            <td>Used AI tools casually, no daily workflow yet.</td>
            <td>Ship a real PR with Claude Code + 600-word retro.</td>
          </tr>
          <tr>
            <td><strong>2 -- Practitioner</strong></td>
            <td>Confident daily user, has called the API once.</td>
            <td>Build the next small internal tool with tool use + a 10-case eval suite.</td>
          </tr>
          <tr>
            <td><strong>3 -- Proficient</strong></td>
            <td>Has shipped an LLM feature, hit a production surprise.</td>
            <td>Ship a production agent with evals in CI, observability, safety, and a rollback plan.</td>
          </tr>
          <tr>
            <td><strong>4 -- Expert</strong></td>
            <td>Architect, mentor, standard-setter.</td>
            <td>No capstone -- sustaining role.</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
