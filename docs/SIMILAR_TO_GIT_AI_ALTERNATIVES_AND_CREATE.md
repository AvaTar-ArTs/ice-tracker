# Similar to git-ai: alternatives and what you can create

Ways to get **AI code attribution / tracking** without git-ai, or to **build your own** lightweight approach.

---

## 1. Alternative tools (same problem space)

Tools that track which code was written by AI vs humans, with blame/stats and often git notes.

| Tool | Repo | Stack | Editors | Differentiators |
|------|------|--------|---------|------------------|
| **git-ai** (current) | git-ai-project/git-ai | Rust | Cursor, Claude Code, OpenCode | Mature, skills, show-prompt, CI workflow, usegitai.com dashboard. |
| **Agent Blame** | mesa-dot-dev/agentblame | TypeScript, Bun | Cursor, Claude Code, OpenCode | **Browser extension** (Chrome/Firefox) for GitHub PRs: orange line markers, PR summary, hover with tool/model/prompt. **Analytics dashboard** in GitHub Insights. Squash-safe. Requires Bun. |
| **whogitit** | dotsetlabs/whogitit | Rust | Claude Code (hooks) | **Three-way attribution**: AI / AI-modified-by-human / human / original. **Redaction** (API keys, tokens). **Retention** and **audit log**. Export JSON/CSV. GitHub Action for PR comments with prompts. Git pager for diff. |
| **git-ai-tracker** | RaahimNadeem/git-ai-tracker | Rust | Copilot, Cursor | **Git wrapper** (transparent): use `git` and it intercepts. AI% in git notes. PR comments. Copilot + Cursor; no Claude Code. Stats display in terminal. |
| **traceblame** | arjun-krishna1/traceblame | — | Agent Trace | Stub; “Git blame for Agent Trace.” |
| **q-git-ai-tracker** | bugatino/q-git-ai-tracker | TypeScript | Amazon Q (VS Code) | Tracks Amazon Q vs human only. |

**Rough comparison**

- **Want GitHub PR UI (markers + dashboard)?** → Agent Blame (browser extension + Insights).
- **Want redaction + retention + audit?** → whogitit.
- **Want zero config and Copilot focus?** → RaahimNadeem/git-ai-tracker (wrapper).
- **Already on git-ai (Cursor/Claude/OpenCode)?** → Staying with git-ai is consistent; you’d switch for a specific feature (e.g. PR extension, redaction).

---

## 2. Related but different

| Tool / feature | What it does | Relation to attribution |
|----------------|--------------|--------------------------|
| **CommitAI** (ahmetkca/CommitAI) | Generates **commit messages** from `git diff` (OpenAI). | No attribution; improves commit hygiene. |
| **Git-Analyzer** (cruzyjapan) | “AI-powered insights,” evolution of functionality. | Analysis, not line-level who-wrote-what. |
| **GitHub Copilot** (product) | Inline suggestions + Chat. | No built-in git blame for “Copilot wrote this line”; need something like git-ai or Agent Blame. |
| **GitHub / GitLab “signed commits”** | Prove commit came from you. | Provenance of commit, not AI vs human. |
| **Conventional Commits + trailers** | e.g. `AI-Assisted: 70%` in body. | Manual or script-generated; no line-level. |

---

## 3. Things you can create (no full tool)

Lightweight ways to get *some* of the benefit without installing or switching to another attribution tool.

### 3.1 Convention-only (manual)

- **Commit message tag:** e.g. `feat: add API [ai]` or body line `AI-Assisted: ~60%`.
- **Changelog / spreadsheet:** One line per release or sprint: “Rough AI% this period” for your own view.
- **Branch or PR label:** e.g. `ai-heavy` so reviewers know to expect more AI-generated code.

No tool; just discipline. Good for “we want a signal” without line-level accuracy.

### 3.2 Lightweight scripts (semi-automated)

- **Post-commit hook** that appends a trailer from env: e.g. if `CURSOR_SESSION=1` or you set `AI_SESSION=1` before coding, hook adds `AI-Session: yes` to the commit (no line-level, just “this commit had AI assistance”).
- **Pre-commit or post-commit** script that reads a simple log file (e.g. “timestamp, repo, path”) written by a minimal IDE plugin or manual log, and computes a crude “AI%” for the commit (e.g. “N paths touched this session” → estimate) and writes it to git notes or commit body. Requires you or a plugin to write that log.
- **CI job** that, on each PR, runs `git diff main..HEAD` and applies a **heuristic** (e.g. diff size, file types, keyword patterns) to output “Estimated AI involvement: low/medium/high.” Very rough; no real attribution.

### 3.3 Use existing notes from another tool

- If you **switch** to Agent Blame or whogitit, they use **different refs** (e.g. `refs/notes/agentblame`, `refs/notes/whogitit`). You could write a small script that **reads** their notes and prints a one-line summary (e.g. “Agent Blame says 45% AI”) without running git-ai.

### 3.4 Dashboards / exports

- **git-ai** already: `git-ai stats --json`, `git-ai stats main..HEAD`. You can pipe that into a small script or spreadsheet to plot “AI% over time” or “per-release” without any new attribution tool.
- **whogitit** and **Agent Blame** offer PR/export data; you could aggregate that in a simple dashboard (e.g. static HTML or Notion).

---

## 4. Summary

| Goal | Option |
|------|--------|
| **Alternatives to git-ai** | Agent Blame (PR UI + dashboard), whogitit (redaction/retention/export), git-ai-tracker (wrapper + Copilot). |
| **Related but not attribution** | Commit message generators, repo analyzers, signed commits. |
| **Create yourself** | Conventions (tags, labels), env-based “AI session” trailer, heuristic CI estimate, scripts that read another tool’s notes or git-ai JSON. |

For ice-tracker, **sticking with git-ai** is enough for attribution; add **Agent Blame** only if you want the **GitHub PR extension** and **Insights dashboard** without changing your current Cursor/git-ai workflow (they can coexist if you don't mind two systems). Use **"create yourself"** when you want a minimal signal (e.g. "AI-Session: yes" or a rough CI badge) without another full tool.

**Fancier with APIs:** If you load API keys from **`~/.env.d/`** (e.g. GitHub + LLM keys), you can add commit-message generation, PR summaries, changelog generation, review bots, or AI%+LLM release summaries. **Beyond git:** same env.d can power app backends, map/SEO/data scripts, deployment, monitoring, and personal automation. Full list: **`~/.git-ai/docs/WHAT_ELSE_CAN_BE_ADDED.md`** (§6 Fancier with ~/.env.d, §7 Beyond git). Local pointer: [What else can be added](WHAT_ELSE_CAN_BE_ADDED.md). **What stays in this repo:** [DOCS_INDEX.md](DOCS_INDEX.md).
