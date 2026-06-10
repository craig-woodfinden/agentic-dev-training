import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import type { UserState } from "./types.ts";
import { EMPTY_USER } from "./types.ts";
import Welcome from "./pages/Welcome.tsx";
import Quiz from "./pages/Quiz.tsx";
import MyModules from "./pages/MyModules.tsx";
import CohortStatus from "./pages/CohortStatus.tsx";

const STORAGE_KEY = "iq-agentic-user";

function loadUser(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserState;
  } catch {
    // ignore
  }
  return EMPTY_USER;
}

export function saveUser(user: UserState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export default function App() {
  const [user, setUser] = useState<UserState>(loadUser);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  function updateUser(patch: Partial<UserState>) {
    setUser((prev) => ({ ...prev, ...patch }));
  }

  const logoSrc = "/assets/Indiqator.jpg";

  return (
    <HashRouter>
      <div className="layout">
        <nav className="sidebar">
          <div className="sidebar-brand">
            <img
              src={logoSrc}
              alt="Indiqator"
              className="sidebar-logo"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="sidebar-wordmark">
              INDIQ<span>/</span>TOR
            </div>
            <div className="sidebar-tag">Agentic Dev Training</div>
          </div>

          {user.onboarded ? (
            <div className="sidebar-user">
              {user.name} &middot; {user.levelShort ?? "?"}
            </div>
          ) : (
            <div className="sidebar-user-hint">Take the placement quiz to get started.</div>
          )}

          <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/" end>
            Welcome
          </NavLink>
          <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/quiz">
            Placement quiz
          </NavLink>
          <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/modules">
            My modules
          </NavLink>
          <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/cohort">
            My status
          </NavLink>

          <div className="sidebar-footer">
            Local dev server. Close the tab when done.<br />
            Restart: <code>npm run dev</code>
          </div>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/" element={<Welcome user={user} />} />
            <Route path="/quiz" element={<Quiz user={user} updateUser={updateUser} />} />
            <Route path="/modules" element={<MyModules user={user} updateUser={updateUser} />} />
            <Route path="/cohort" element={<CohortStatus user={user} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
