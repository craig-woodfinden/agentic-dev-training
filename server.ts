import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const REPO_ROOT = __dirname;
const MODULES_DIR = path.join(REPO_ROOT, "modules");
const COHORT_DIR = path.join(REPO_ROOT, "cohort-2026Q3");
const STARTERS_DIR = path.join(REPO_ROOT, "starters");
const PLAYBOOK_FILE = path.join(COHORT_DIR, "engineer-lead-playbook.md");

app.use(cors());
app.use(express.json());

// GET /api/modules -- list all modules
app.get("/api/modules", (_req, res) => {
  const files = fs
    .readdirSync(MODULES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const code = f.split("-")[0];
      const fullText = fs.readFileSync(path.join(MODULES_DIR, f), "utf-8");
      const titleMatch = fullText.match(/^#\s+(.+)$/m);
      return {
        id: f.replace(".md", ""),
        code,
        filename: f,
        title: titleMatch ? titleMatch[1].trim() : f,
      };
    });
  res.json(files);
});

// GET /api/modules/:id -- read module content
app.get("/api/modules/:id", (req, res) => {
  const filepath = path.join(MODULES_DIR, req.params.id + ".md");
  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json({ content: fs.readFileSync(filepath, "utf-8") });
});

// GET /api/starters/:code -- list starter files for a module code
app.get("/api/starters/:code", (req, res) => {
  const starterDir = path.join(STARTERS_DIR, req.params.code);
  if (!fs.existsSync(starterDir)) {
    res.json({ files: [] });
    return;
  }
  const files = fs
    .readdirSync(starterDir)
    .filter((f) => !f.startsWith("__") && !f.startsWith("."))
    .sort();
  res.json({ files });
});

// GET /api/cohort -- list engineers and their status
app.get("/api/cohort", (_req, res) => {
  if (!fs.existsSync(COHORT_DIR)) {
    res.json({ engineers: [] });
    return;
  }
  const engineers = fs
    .readdirSync(COHORT_DIR)
    .filter((name) => {
      const p = path.join(COHORT_DIR, name);
      return fs.statSync(p).isDirectory() && !name.startsWith("_");
    })
    .sort()
    .flatMap((name) => {
      const statusPath = path.join(COHORT_DIR, name, "status.md");
      if (!fs.existsSync(statusPath)) return [];
      const text = fs.readFileSync(statusPath, "utf-8");
      const levelM = text.match(/\*\*Starting level:\*\*\s*(\S+)/);
      const scoreM = text.match(/\*\*Quiz score:\*\*\s*(.+)/);
      const startedM = text.match(/\*\*Started:\*\*\s*(\S+)/);
      return [
        {
          name,
          level: levelM ? levelM[1].trim() : "?",
          score: scoreM ? scoreM[1].trim() : "?",
          started: startedM ? startedM[1].trim() : "?",
        },
      ];
    });
  res.json({ engineers });
});

// POST /api/onboard -- create engineer folder
app.post("/api/onboard", (req, res) => {
  const { name, score, levelShort, firstModule } = req.body as {
    name: string;
    score: number;
    levelShort: string;
    firstModule: string;
  };

  if (!/^[a-z0-9_-]+$/.test(name)) {
    res.status(400).json({ error: "Name must be lowercase letters, numbers, hyphens, or underscores only." });
    return;
  }

  const template = path.join(COHORT_DIR, "_template");
  if (!fs.existsSync(template)) {
    res.status(500).json({ error: "Template folder not found." });
    return;
  }

  const dest = path.join(COHORT_DIR, name);
  let created = false;
  if (!fs.existsSync(dest)) {
    copyDirSync(template, dest);
    created = true;
  }

  const today = new Date().toISOString().split("T")[0];
  const statusPath = path.join(dest, "status.md");
  let statusText = fs.readFileSync(statusPath, "utf-8");
  statusText = statusText.replace(
    "- **Starting level:** *L1 / L2 / L3 (from `score_quiz.py`)*",
    `- **Starting level:** ${levelShort}`
  );
  statusText = statusText.replace(
    "- **Quiz score:** *e.g. 7 / 30*",
    `- **Quiz score:** ${score} / 30`
  );
  statusText = statusText.replace(
    "- **Started:** *YYYY-MM-DD*",
    `- **Started:** ${today}`
  );
  fs.writeFileSync(statusPath, statusText);

  const readmePath = path.join(COHORT_DIR, "README.md");
  let readme = fs.readFileSync(readmePath, "utf-8");
  const escaped = name.replace(/[-]/g, "\\$&");
  const newRow = `| ${name} | ${score}/30 | ${levelShort} | ${firstModule} | -- | not started |`;
  const existingRe = new RegExp(`^\\| ${escaped} \\|.*\\|\\s*$`, "m");
  if (existingRe.test(readme)) {
    readme = readme.replace(existingRe, newRow);
  } else {
    const placeholderRe = /^\| \*name\* \|.*\|\s*$/m;
    if (placeholderRe.test(readme)) {
      readme = readme.replace(placeholderRe, newRow);
    }
  }
  fs.writeFileSync(readmePath, readme);

  res.json({
    ok: true,
    created,
    message: created
      ? "Folder created. Status filled in. Cohort table updated."
      : "Folder already existed -- status and cohort table updated.",
  });
});

// POST /api/complete-module -- record a completed module and unlock the next
app.post("/api/complete-module", (req, res) => {
  const { name, moduleCode, artifact } = req.body as {
    name: string;
    moduleCode: string;
    artifact: string;
  };

  if (!name || !moduleCode) {
    res.status(400).json({ ok: false, message: "Missing name or moduleCode." });
    return;
  }

  if (moduleCode !== "L1.1") {
    const isGitHub =
      typeof artifact === "string" &&
      (artifact.startsWith("https://github.com/") || artifact.startsWith("https://gist.github.com/"));
    if (!isGitHub) {
      res.status(400).json({ ok: false, message: "Artifact must be a GitHub URL (https://github.com/… or https://gist.github.com/…)." });
      return;
    }
  } else {
    if (!artifact || artifact.trim().length < 20) {
      res.status(400).json({ ok: false, message: "Describe the hallucination in at least 20 characters." });
      return;
    }
  }

  const engineerDir = path.join(COHORT_DIR, name);
  if (!fs.existsSync(engineerDir)) {
    res.status(404).json({ ok: false, message: "Engineer folder not found. Complete the placement quiz first." });
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  // Append completion record to status.md
  const statusPath = path.join(engineerDir, "status.md");
  if (fs.existsSync(statusPath)) {
    let status = fs.readFileSync(statusPath, "utf-8");
    const completionLine = `- **${moduleCode}** completed ${today} — ${artifact}`;
    if (status.includes("## Completed modules")) {
      status = status.replace("## Completed modules\n", `## Completed modules\n${completionLine}\n`);
    } else {
      status += `\n\n## Completed modules\n${completionLine}\n`;
    }
    fs.writeFileSync(statusPath, status);
  }

  // Advance current module in cohort README
  const MODULE_ORDER = ["L1.1","L1.2","L1.3","L1.4","L2.1","L2.2","L2.3","L2.4","L3.1","L3.2","L3.3","L3.4"];
  const currentIdx = MODULE_ORDER.indexOf(moduleCode);
  const nextModule = currentIdx >= 0 && currentIdx < MODULE_ORDER.length - 1
    ? MODULE_ORDER[currentIdx + 1]
    : "complete";

  const readmePath = path.join(COHORT_DIR, "README.md");
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, "utf-8");
    const escaped = name.replace(/[-]/g, "\\$&");
    const rowRe = new RegExp(
      `^\\| ${escaped} \\|([^|]+)\\|([^|]+)\\|[^|]+\\|([^|]+)\\|([^|]+)\\|\\s*$`,
      "m"
    );
    readme = readme.replace(rowRe, (_m, c1, c2, c4, c5) =>
      `| ${name} |${c1}|${c2}| ${nextModule} |${c4}|${c5}|`
    );
    fs.writeFileSync(readmePath, readme);
  }

  res.json({
    ok: true,
    message: nextModule === "complete"
      ? `${moduleCode} complete. You've finished all modules -- well done.`
      : `${moduleCode} complete. Next up: ${nextModule}.`,
  });
});

// POST /api/progress -- update current module for an engineer
app.post("/api/progress", (req, res) => {
  const { name, moduleCode } = req.body as { name: string; moduleCode: string };
  const readmePath = path.join(COHORT_DIR, "README.md");
  if (!fs.existsSync(readmePath)) {
    res.json({ ok: true });
    return;
  }
  let readme = fs.readFileSync(readmePath, "utf-8");
  const escaped = name.replace(/[-]/g, "\\$&");
  const rowRe = new RegExp(
    `^\\| ${escaped} \\|([^|]+)\\|([^|]+)\\|[^|]+\\|([^|]+)\\|([^|]+)\\|\\s*$`,
    "m"
  );
  readme = readme.replace(rowRe, (_m, c1, c2, c4, c5) =>
    `| ${name} |${c1}|${c2}| ${moduleCode} |${c4}|${c5}|`
  );
  fs.writeFileSync(readmePath, readme);
  res.json({ ok: true });
});

// GET /api/playbook -- read the engineer lead playbook
app.get("/api/playbook", (_req, res) => {
  if (!fs.existsSync(PLAYBOOK_FILE)) {
    res.status(404).json({ error: "Playbook not found." });
    return;
  }
  res.json({ content: fs.readFileSync(PLAYBOOK_FILE, "utf-8") });
});

function copyDirSync(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "dist/client");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API server: http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`Frontend dev server: http://localhost:5173`);
  } else {
    console.log(`App: http://localhost:${PORT}`);
  }
});
