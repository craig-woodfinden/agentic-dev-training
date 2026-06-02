"""
Local frontend for the Agentic Development training program.

Run:
    pip install -r requirements.txt
    streamlit run app.py

Then open the URL Streamlit prints (usually http://localhost:8501).

The app gives engineers a browser UI for: taking the placement quiz, setting up
their cohort folder, browsing and reading their level's modules, and booking
check-ins with the engineer lead.
"""
from __future__ import annotations

import datetime
import pathlib
import re
import shutil
import urllib.parse

import streamlit as st

# ---------- paths ----------
REPO_ROOT = pathlib.Path(__file__).resolve().parent
COHORT_DIR = REPO_ROOT / "cohort-2026Q3"
MODULES_DIR = REPO_ROOT / "modules"
STARTERS_DIR = REPO_ROOT / "starters"
PATHWAY_FILE = REPO_ROOT / "pathway.md"
PLAYBOOK_FILE = COHORT_DIR / "engineer-lead-playbook.md"

# ---------- quiz content ----------
QUESTIONS = [
    ("Have you called an LLM API (Anthropic, OpenAI, etc.) directly from code?", [
        "Never.",
        "Once or twice in a throwaway script.",
        "A few times for personal projects or internal tools.",
        "Yes, in production code I shipped.",
    ]),
    ("Do you use an agentic CLI (Claude Code, Cursor agents, etc.) for real work?", [
        "I haven't tried one.",
        "I've tried it but don't use it regularly.",
        "I use it for most coding tasks.",
        "I customise hooks, slash commands, or sub-agents.",
    ]),
    ("Have you implemented tool use / function calling?", [
        "No.",
        "I've read about it but not implemented it.",
        "I've defined a tool and parsed model calls.",
        "I've designed tool schemas for production agents.",
    ]),
    ("Have you written evals for LLM output?", [
        "No.",
        "Manual rubric, eyeballed.",
        "10+ test cases I run before shipping.",
        "Eval suite running in CI, with judge models.",
    ]),
    ("Have you shipped an LLM-backed feature to production?", [
        "No.",
        "A small internal tool with basic logging.",
        "A user-facing feature.",
        "Multiple, with observability and rollback plans.",
    ]),
    ("When a prompt isn't working, how do you debug?", [
        "Reword and try again.",
        "I have a personal set of prompt patterns I try.",
        "I run regression cases and look at structured output.",
        "I trace tool calls and inspect reasoning steps.",
    ]),
    ("Have you read the Anthropic API docs and Agent SDK docs?", [
        "No.",
        "Skimmed.",
        "Read the parts I use.",
        "Yes, including model cards and system updates.",
    ]),
    ("Could you teach a colleague how to use Claude Code effectively?", [
        "No.",
        "The basics.",
        "Yes, with my own examples.",
        "I've already done this — the team uses my workflows.",
    ]),
    ("When you build with an LLM, how do you handle prompt injection / unsafe inputs?", [
        "I don't think about it.",
        "I know what it is but haven't defended against it.",
        "I sanitise inputs and scope tool permissions.",
        "I design system-wide guardrails and run injection tests.",
    ]),
    ("Could you architect a multi-step agent (planner + executor + tools + memory)?", [
        "No.",
        "I could describe one but not build it.",
        "I've built simple ones.",
        "I architect them and mentor others on the patterns.",
    ]),
]


def level_for(score: int) -> tuple[str, str, str, str]:
    """Returns (short, full, blurb, first_module)."""
    if score <= 8:
        return ("L1", "Level 1 — Novice",
                "You've used AI tools casually. Start with the L1 modules to build a daily, deliberate workflow.",
                "L1.1")
    if score <= 16:
        return ("L2", "Level 2 — Practitioner",
                "You're a confident daily user. Start with the L2 modules to learn the API, tool use, and evals.",
                "L2.1")
    if score <= 24:
        return ("L3", "Level 3 — Proficient",
                "You can build LLM features. Time to architect, observe, secure, and scale them.",
                "L3.1")
    return ("L4", "Level 4 — Expert",
            "You're ready to architect cross-team systems and mentor others. See the Level 4 section in pathway.md.",
            "—")


# ---------- helpers ----------
def list_engineers() -> list[dict]:
    """Read all engineer folders in cohort-2026Q3/ (excluding _template)."""
    if not COHORT_DIR.is_dir():
        return []
    out = []
    for child in sorted(COHORT_DIR.iterdir()):
        if child.is_dir() and not child.name.startswith("_"):
            status = child / "status.md"
            if status.is_file():
                text = status.read_text()
                level_m = re.search(r"\*\*Starting level:\*\*\s*(\S+)", text)
                score_m = re.search(r"\*\*Quiz score:\*\*\s*(.+)", text)
                started_m = re.search(r"\*\*Started:\*\*\s*(\S+)", text)
                out.append({
                    "name": child.name,
                    "level": (level_m.group(1).strip() if level_m else "?"),
                    "score": (score_m.group(1).strip() if score_m else "?"),
                    "started": (started_m.group(1).strip() if started_m else "?"),
                    "folder": child,
                })
    return out


def modules_for_level(level_short: str) -> list[pathlib.Path]:
    if level_short == "L4":
        return []
    if not MODULES_DIR.is_dir():
        return []
    prefix = level_short + "."
    return sorted(p for p in MODULES_DIR.iterdir() if p.name.startswith(prefix))


def module_code(path: pathlib.Path) -> str:
    """e.g. 'L1.1-mental-model-of-llms.md' -> 'L1.1'"""
    return path.name.split("-", 1)[0]


def module_title(path: pathlib.Path) -> str:
    """Read the first '# Title' line from the module file."""
    text = path.read_text()
    m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    return m.group(1).strip() if m else path.stem


def onboard_engineer(name: str, score: int, level_short: str, first_module: str) -> tuple[bool, str]:
    """Create the engineer's folder, fill status.md, update cohort README. Returns (ok, message)."""
    if not re.match(r"^[a-z0-9_-]+$", name):
        return False, "Name must be lowercase letters, numbers, hyphens, or underscores only."

    template = COHORT_DIR / "_template"
    if not template.is_dir():
        return False, f"Can't find {template}. Are you running this from the repo root?"

    dest = COHORT_DIR / name
    created = False
    if not dest.exists():
        shutil.copytree(template, dest)
        created = True

    # Update status.md
    today = datetime.date.today().isoformat()
    status_path = dest / "status.md"
    text = status_path.read_text()
    text = text.replace(
        "- **Starting level:** *L1 / L2 / L3 (from `score_quiz.py`)*",
        f"- **Starting level:** {level_short}",
    )
    text = text.replace(
        "- **Quiz score:** *e.g. 7 / 30*",
        f"- **Quiz score:** {score} / 30",
    )
    text = text.replace(
        "- **Started:** *YYYY-MM-DD*",
        f"- **Started:** {today}",
    )
    status_path.write_text(text)

    # Update cohort README
    readme_path = COHORT_DIR / "README.md"
    readme = readme_path.read_text()
    new_row = f"| {name} | {score}/30 | {level_short} | {first_module} | — | not started |"
    existing = re.compile(rf"^\| {re.escape(name)} \|.*\|\s*$", re.MULTILINE)
    if existing.search(readme):
        readme = existing.sub(new_row, readme)
    else:
        placeholder = re.compile(r"^\| \*name\* \|.*\|\s*$", re.MULTILINE)
        if placeholder.search(readme):
            readme = placeholder.sub(new_row, readme, count=1)
        else:
            return True, ("Folder ready, but cohort table has no empty rows. "
                          f"Add this row manually:\n\n  {new_row}")
    readme_path.write_text(readme)

    msg = ("Folder created. Status filled in. Cohort table updated."
           if created else
           "Folder already existed — status and cohort table updated.")
    return True, msg


def mark_module_in_progress(name: str, module_code_str: str) -> None:
    """Best-effort update of the engineer's row in the cohort table to show their current module."""
    readme_path = COHORT_DIR / "README.md"
    if not readme_path.is_file():
        return
    readme = readme_path.read_text()
    # Find the engineer's row and bump 'Current module' (column 4)
    row_re = re.compile(rf"^\| {re.escape(name)} \|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|\s*$", re.MULTILINE)
    def _sub(m):
        return f"| {name} |{m.group(1)}|{m.group(2)}| {module_code_str} |{m.group(4)}|{m.group(5)}|"
    new = row_re.sub(_sub, readme, count=1)
    if new != readme:
        readme_path.write_text(new)


# ---------- session state ----------
if "quiz_done" not in st.session_state:
    st.session_state.quiz_done = False
if "score" not in st.session_state:
    st.session_state.score = None
if "level_short" not in st.session_state:
    st.session_state.level_short = None
if "level_full" not in st.session_state:
    st.session_state.level_full = None
if "first_module" not in st.session_state:
    st.session_state.first_module = None
if "name" not in st.session_state:
    st.session_state.name = None
if "onboarded" not in st.session_state:
    st.session_state.onboarded = False

# Recover identity if we've onboarded before (look for a folder matching a chosen name)
def _try_recover_identity():
    if st.session_state.name and (COHORT_DIR / st.session_state.name).is_dir():
        st.session_state.onboarded = True


# ---------- page config ----------
st.set_page_config(
    page_title="Indiqator · Agentic Dev Training",
    page_icon="https://indiqator.com.au/app/uploads/2025/07/cropped-Indiqator-favicon-512px-1-270x270.png",
    layout="wide",
)

# ---------- brand styling (Indiqator palette) ----------
# Primary accent: #E6157D (gauge arc pink). Navy: #1E2761. Ink: #0E1733.
# Theme colors come from .streamlit/config.toml; this block adds the polish.
st.markdown(
    """
    <style>
      :root {
        --iq-pink: #E6157D;
        --iq-pink-soft: #FDE7F2;
        --iq-navy: #1E2761;
        --iq-ink: #0E1733;
        --iq-grey: #F4F6FA;
      }
      /* App title — pink underline accent, navy ink */
      .stApp h1 {
        color: var(--iq-ink) !important;
        border-bottom: 4px solid var(--iq-pink);
        display: inline-block;
        padding-bottom: 6px;
        margin-bottom: 16px;
        line-height: 1.15;
      }
      /* Section headings — navy */
      .stApp h2, .stApp h3 {
        color: var(--iq-navy) !important;
      }
      /* Sidebar brand block */
      [data-testid="stSidebar"] .indiqator-brand {
        font-weight: 800;
        font-size: 1.05rem;
        letter-spacing: 0.12em;
        color: var(--iq-ink);
        padding: 2px 0 0 0;
      }
      [data-testid="stSidebar"] .indiqator-brand .dot {
        color: var(--iq-pink);
      }
      [data-testid="stSidebar"] .indiqator-tag {
        font-size: 0.78rem;
        color: var(--iq-navy);
        opacity: 0.75;
        letter-spacing: 0.04em;
        margin-bottom: 14px;
      }
      /* Primary button (uses theme primaryColor but adds hover polish) */
      .stButton > button[kind="primary"] {
        background: var(--iq-pink);
        border: 1px solid var(--iq-pink);
        color: #fff;
        font-weight: 600;
      }
      .stButton > button[kind="primary"]:hover {
        background: #C2126A;
        border-color: #C2126A;
      }
      /* Metric numbers — pink accent */
      [data-testid="stMetricValue"] {
        color: var(--iq-pink);
      }
      /* Info / success / warning callouts — tone down to brand palette */
      [data-testid="stAlertContainer"][kind="info"],
      [data-testid="stAlert"] [data-baseweb="notification"][role="alert"]:has(svg[aria-label*="Info"]) {
        background: var(--iq-pink-soft);
        border-left: 4px solid var(--iq-pink);
      }
      /* Tabs / radio chip — focus state */
      [data-baseweb="radio"] [aria-checked="true"] + div {
        color: var(--iq-pink);
      }
      /* Dataframe header tint */
      .stDataFrame thead tr th {
        background: var(--iq-grey) !important;
        color: var(--iq-ink) !important;
      }
      /* Module / form expanders */
      [data-testid="stExpander"] > details > summary {
        font-weight: 600;
        color: var(--iq-navy);
      }
      /* Hide the streamlit default footer + main menu */
      footer { visibility: hidden; }
      #MainMenu { visibility: hidden; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ---------- sidebar ----------
st.sidebar.markdown(
    '<div class="indiqator-brand">INDIQ<span class="dot">/</span>TOR</div>'
    '<div class="indiqator-tag">Agentic Dev Training</div>',
    unsafe_allow_html=True,
)
_try_recover_identity()
if st.session_state.onboarded:
    st.sidebar.success(
        f"**{st.session_state.name}** · {st.session_state.level_short or '?'}"
    )
else:
    st.sidebar.info("Take the placement quiz to get started.")

PAGES = ["Welcome", "Placement quiz", "My modules", "Check-in helper",
         "Cohort status", "Engineer lead playbook"]
page = st.sidebar.radio("Where to?", PAGES, label_visibility="collapsed")

st.sidebar.divider()
st.sidebar.caption(
    "Local dev server. Close the tab when done. To restart, run "
    "`streamlit run app.py` from the repo root."
)


# ---------- pages ----------
def page_welcome() -> None:
    st.title("Agentic Development Training")
    st.markdown(
        "A self-paced pathway from your first deliberate use of an AI coding "
        "assistant through to shipping production agents with evals, "
        "observability, and rollback plans."
    )

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Modules", "12 across 3 levels")
    with col2:
        st.metric("Time per week", "~90 min · self-paced")
    with col3:
        st.metric("Check-ins", "15 min, 1:1 with the lead")

    st.divider()

    st.subheader("How this works")
    st.markdown(
        """
1. **Take the placement quiz** in the sidebar. Five minutes. It tells you which level to start on.
2. **The app sets up your cohort folder automatically** when you finish the quiz.
3. **Work through your level's modules** in the *My modules* page. One per week is the default.
4. **Reach out to the engineer lead** to book a 15-minute check-in when you finish each module. The *Check-in helper* page tells you what to bring.
5. **Move up a level** when all four exit criteria are met and the lead signs you off.
        """
    )

    st.divider()

    st.subheader("Where the cohort is right now")
    engineers = list_engineers()
    if engineers:
        rows = [(e["name"], e["level"], e["score"], e["started"]) for e in engineers]
        st.dataframe(
            {"Engineer": [r[0] for r in rows],
             "Level": [r[1] for r in rows],
             "Score": [r[2] for r in rows],
             "Started": [r[3] for r in rows]},
            use_container_width=True, hide_index=True,
        )
    else:
        st.info("No engineers in the cohort yet. Be the first — take the quiz.")


def page_quiz() -> None:
    st.title("Placement quiz")
    st.caption("Ten questions, ~5 minutes. Answer honestly — what you do today, not what you could do if you had to.")

    if st.session_state.quiz_done and not st.button("Retake the quiz"):
        # Show results + onboard form
        score = st.session_state.score
        level_short = st.session_state.level_short
        level_full = st.session_state.level_full
        first_module = st.session_state.first_module

        st.success(f"**Total score: {score} / 30**")
        st.subheader(level_full)
        st.markdown({
            "L1": "You've used AI tools casually. Start with the L1 modules to build a daily, deliberate workflow.",
            "L2": "You're a confident daily user. Start with the L2 modules to learn the API, tool use, and evals.",
            "L3": "You can build LLM features. Time to architect, observe, secure, and scale them.",
            "L4": "You're ready to architect cross-team systems and mentor others.",
        }.get(level_short, ""))

        st.divider()

        if level_short == "L4":
            st.info("Since you placed at Level 4, there's no cohort folder to set up. "
                    "See the *Engineer lead playbook* page and the Level 4 section in pathway.md.")
            return

        st.subheader("Set up your cohort folder")
        if st.session_state.onboarded:
            st.success(f"You're already onboarded as **{st.session_state.name}**.")
            st.markdown("Head to **My modules** in the sidebar to get started.")
            return

        with st.form("onboard"):
            name = st.text_input(
                "Your name (lowercase, used as folder name — e.g. 'alex' or 'alex-w')",
                value=st.session_state.name or "",
                help="Letters, numbers, hyphens, underscores only.",
            )
            submitted = st.form_submit_button("Set up my folder")

        if submitted:
            name = name.strip().lower()
            if not name:
                st.error("Please enter a name.")
                return
            ok, msg = onboard_engineer(name, score, level_short, first_module)
            if ok:
                st.success(msg)
                st.session_state.name = name
                st.session_state.onboarded = True
                st.markdown(
                    "**Last step — commit and push from your terminal:**\n\n"
                    "```bash\n"
                    "git add cohort-2026Q3/\n"
                    f'git commit -m "Add {name} to cohort — placed at {level_short}"\n'
                    "git push\n"
                    "```\n\n"
                    "Then head to **My modules** to start."
                )
            else:
                st.error(msg)
        return

    # Quiz form
    with st.form("quiz"):
        answers = []
        for i, (q, opts) in enumerate(QUESTIONS):
            st.markdown(f"**{i+1}. {q}**")
            choice = st.radio(
                f"Q{i+1}",
                options=range(len(opts)),
                format_func=lambda j, opts=opts: f"({j}) {opts[j]}",
                index=None,
                key=f"q{i}",
                label_visibility="collapsed",
            )
            answers.append(choice)
            st.write("")

        submitted = st.form_submit_button("Calculate my level", type="primary")

    if submitted:
        if None in answers:
            st.error("Please answer all 10 questions.")
            return
        score = sum(answers)
        level_short, level_full, _, first_module = level_for(score)
        st.session_state.quiz_done = True
        st.session_state.score = score
        st.session_state.level_short = level_short
        st.session_state.level_full = level_full
        st.session_state.first_module = first_module
        st.rerun()


def page_my_modules() -> None:
    st.title("My modules")

    if not st.session_state.onboarded:
        st.warning("Take the placement quiz first — the modules need to know your level.")
        return

    level_short = st.session_state.level_short
    name = st.session_state.name
    modules = modules_for_level(level_short)

    if not modules:
        st.info(f"No modules found for {level_short}.")
        return

    st.markdown(f"You're on **{level_short}**. Pick this week's module:")

    # Module picker
    codes = [module_code(m) for m in modules]
    labels = [f"{module_code(m)} — {module_title(m)}" for m in modules]
    selected_label = st.selectbox("Module", labels, index=0, label_visibility="collapsed")
    selected_idx = labels.index(selected_label)
    selected_module = modules[selected_idx]
    selected_code = codes[selected_idx]

    # Show "open this module" action
    starter_folder = STARTERS_DIR / selected_code
    if starter_folder.is_dir():
        with st.expander(f"📁 Starter files for {selected_code}", expanded=False):
            for f in sorted(starter_folder.iterdir()):
                if f.name == "__pycache__":
                    continue
                st.code(str(f.relative_to(REPO_ROOT)), language=None)
            st.caption("Open these in your editor or run them from the terminal.")

    if st.button(f"I'm starting {selected_code} → mark on my row", help="Updates 'Current module' in the cohort table."):
        mark_module_in_progress(name, selected_code)
        st.success(f"Cohort table updated — you're on {selected_code}.")

    st.divider()

    # Render the module markdown
    st.markdown(selected_module.read_text())

    st.divider()

    # Check-in shortcut
    st.subheader("Ready for your check-in?")
    st.markdown(
        "Once you've worked through the *Do* section and run the *Self-check*, head to the "
        "**Check-in helper** page in the sidebar — it shows what to bring, then reach out to your engineer lead directly."
    )


def page_checkin_helper() -> None:
    st.title("Check-in helper")
    if not st.session_state.onboarded:
        st.warning("Take the placement quiz first.")
        return

    level_short = st.session_state.level_short
    name = st.session_state.name
    modules = modules_for_level(level_short)

    if not modules:
        st.info("No modules at your level.")
        return

    codes = [module_code(m) for m in modules]
    labels = [f"{module_code(m)} — {module_title(m)}" for m in modules]
    selected_label = st.selectbox("Which module did you just finish?", labels, index=0)
    selected_idx = labels.index(selected_label)
    selected_code = codes[selected_idx]
    selected_module = modules[selected_idx]

    # Pull the module's check-in section out of the markdown so the engineer
    # sees exactly what to bring without having to scroll back through the module.
    module_text = selected_module.read_text()
    checkin_match = re.search(
        r"## Check-in with your engineer lead.*?(?=\n## |\Z)",
        module_text, re.DOTALL,
    )
    selfcheck_match = re.search(
        r"## Self-check before your check-in.*?(?=\n## |\Z)",
        module_text, re.DOTALL,
    )

    st.info(
        f"**Reach out to your engineer lead** to set up a 15-minute check-in for {selected_code}. "
        "Use whatever channel your team uses — Teams chat, walk-up, calendar invite. "
        "The lead will confirm a time."
    )

    if selfcheck_match:
        with st.expander("Self-check — make sure you can answer these first", expanded=True):
            # Strip the leading `## Self-check ...` heading line for cleaner display
            body = re.sub(r"^## .+\n", "", selfcheck_match.group(0)).strip()
            st.markdown(body)

    if checkin_match:
        with st.expander("What to bring to the check-in", expanded=True):
            body = re.sub(r"^## .+\n", "", checkin_match.group(0)).strip()
            st.markdown(body)

    st.markdown("---")
    st.markdown("**The check-in itself takes 15 minutes:**")
    st.markdown(
        """
- 2 min — you name the module, the lead opens your status.md
- 5–7 min — you walk through what you built. You drive, they listen.
- 3–5 min — they ask 2–3 probe questions from the module's check-in section.
- 1–2 min — they sign you off in your status.md.
        """
    )


def page_cohort_status() -> None:
    st.title("Cohort status")
    engineers = list_engineers()
    if not engineers:
        st.info("No engineers in the cohort yet.")
        return

    # Cohort summary
    levels = {}
    for e in engineers:
        levels[e["level"]] = levels.get(e["level"], 0) + 1
    cols = st.columns(len(levels) or 1)
    for i, (lvl, count) in enumerate(sorted(levels.items())):
        cols[i].metric(lvl, f"{count} engineer{'s' if count != 1 else ''}")

    st.divider()

    # Per-engineer table
    st.subheader("All engineers")
    st.dataframe(
        {
            "Engineer": [e["name"] for e in engineers],
            "Level": [e["level"] for e in engineers],
            "Score": [e["score"] for e in engineers],
            "Started": [e["started"] for e in engineers],
        },
        use_container_width=True, hide_index=True,
    )

    st.divider()

    st.subheader("Cohort README (full)")
    readme = COHORT_DIR / "README.md"
    if readme.is_file():
        with st.expander("Show", expanded=False):
            st.markdown(readme.read_text())


def page_lead_playbook() -> None:
    st.title("Engineer lead playbook")
    if not PLAYBOOK_FILE.is_file():
        st.error(f"Can't find {PLAYBOOK_FILE}.")
        return
    st.caption("Operating manual for the engineer running this cohort. "
               "Worth a 10-minute read before the first check-in.")
    st.markdown(PLAYBOOK_FILE.read_text())


# ---------- dispatcher ----------
{
    "Welcome": page_welcome,
    "Placement quiz": page_quiz,
    "My modules": page_my_modules,
    "Check-in helper": page_checkin_helper,
    "Cohort status": page_cohort_status,
    "Engineer lead playbook": page_lead_playbook,
}[page]()
