# What can or should be run on ~/ice-tracker (Git AI)

Based on what’s set up elsewhere (iterm2, pythons, .claude, Ai-Merge-GitHub): what applies to this repo.

**First-time install (once per machine):** `curl -sSL https://usegitai.com/install.sh | bash` — see [../git-ai-xeo-links.md](../git-ai-xeo-links.md) for prompt-analysis and xEo skills links.

**Verified on this repo:** Git AI is installed in **`~/.git-ai`** (`which git` → `~/.git-ai/bin/git`, `git-ai --version` 1.1.2). The path **`/Users/steven/iterm2/.git`** is the *iterm2 project’s* `.git` directory (that repo’s refs/notes/ai and .git/ai); the single Git AI install in `~/.git-ai` is used for all repos, including ice-tracker. On ice-tracker: **`git-ai status`** shows working-tree checkpoints (Cursor), **`git-ai blame README.md`** shows line-level attribution, **`git-ai stats --json`** works; **`.github/workflows/git-ai.yaml`** is present (CI for squash-merge). This repo’s `.git/ai` and `refs/notes/ai` are populated when you commit and push.

---

## Already in place — run anytime

| Command / action | Purpose |
|------------------|--------|
| **`git-ai status`** | After AI edits: see you vs AI %, recent checkpoints. Verifies Cursor hooks are recording. |
| **`git-ai blame <file>`** | Line-level AI attribution (e.g. `git-ai blame app/page.tsx`). |
| **`git-ai stats`** | Stats for HEAD. |
| **`git-ai stats --json`** | Same, machine-readable (for scripting). |
| **`git-ai diff HEAD`** | Last commit with 🤖/👤 annotations. |
| **`git-ai diff main..branch`** | PR-style diff with AI attribution. |
| **`git-ai show HEAD`** | Raw authorship log for last commit. |
| **`git-ai show-prompt <id>`** | Look up prompt by ID (get id from blame). |
| **`./scripts/push-avatararts.sh`** | Push to GitHub (notes go with push). |
| **Cursor** | Hooks in `~/.cursor/hooks.json` call `~/.git-ai/hooks/cursor-checkpoint.sh`; any agent edit in this repo is checkpointed automatically. |

No extra setup needed for the above.

---

## Should add (recommended)

### 1. Git AI CI workflow (if you squash-merge PRs)

If you merge PRs with **Squash and merge** or **Rebase and merge** on GitHub, the merged commit is created on GitHub and doesn’t run git-ai locally, so authorship notes are lost unless CI fixes them.

**Run once in ice-tracker:**

```bash
cd ~/ice-tracker
git-ai ci github install
```

This adds `.github/workflows/git-ai.yaml`. It runs when a PR is closed (merged); it reconstructs authorship for the squash/rebase commit and pushes notes. Coexists with your existing `ci.yml` (build).

**When to skip:** If you only ever merge via normal merge (no squash/rebase) or don’t use PRs, you can skip this.

---

### 2. Optional: prompt storage in notes (for this repo)

Right now prompts are in local SQLite only (`prompt_storage` default). If you want prompts to sync with the repo (so `git-ai blame` hover and `show-prompt` work for others who clone), you can enable notes for this repo only:

```bash
git-ai config set --add exclude_prompts_in_repositories "*"   # exclude all by default
git-ai config set prompt_storage notes
# Then allow only this repo (so prompts go in notes here only):
git-ai config set --add exclude_prompts_in_repositories "!"  # clear, then add exception
# Or per-repo: allow ice-tracker by remote URL
git-ai config set allow_repositories "https://github.com/AvaTar-ArTs/ice-tracker.git"
```

Simpler option: leave `prompt_storage` as default; only enable `notes` if you explicitly want prompts in the repo (and no secrets in prompts).

---

## Optional (nice to have)

| What | How |
|------|-----|
| **Stats for a release** | Before tagging a release: `git-ai stats v0.1.0..HEAD --json --ignore "*.lock" "package-lock.json"`; attach the JSON or summary to release notes. |
| **Small script** | e.g. `scripts/git-ai-stats-release.sh` that runs the above and prints a one-liner (see below). |
| **Prompt analysis** | From Claude Code (or another agent) with `/plugin add ~/.git-ai/skills`, then **`/git-ai:prompt-analysis`**. Example asks: “Grade my prompts from the last 30 days” , or "Categorize by work type" / "Compare to team" / "last 90 days" for longer range. [Docs](https://usegitai.com/docs/cli/prompt-analysis). |
| **Dashboard** | `git-ai login` and `git-ai dashboard` (usegitai.com/me) — global stats, not repo-specific. |

---

## What not to run here (belongs elsewhere)

- **meta_agent.py** — That’s in ~/pythons: refactor + git-ai analyze. Ice-tracker doesn’t need the same script; if you ever want “refactor then stats,” you can run `git-ai status` and `git-ai stats` manually after a refactor.
- **Moving extensions or .git/ai** — IDE extensions stay in `~/.cursor`, `~/.vscode`; `.git/ai` stays in this repo. See `~/.git-ai/docs/WHAT_LIVES_WHERE.md`.

---

## Quick copy-paste

**Verify setup:**
```bash
cd ~/ice-tracker
which git          # should be ~/.git-ai/bin/git
git-ai status      # after an AI edit, should show checkpoints
```

**Add CI for squash-merge (recommended):**
```bash
cd ~/ice-tracker
git-ai ci github install
git add .github/workflows/git-ai.yaml
git commit -m "ci: add git-ai workflow for squash/rebase merge"
./scripts/push-avatararts.sh
```

**Stats for last N commits (e.g. before release):**
```bash
git-ai stats HEAD~10..HEAD --ignore "*.lock" "package-lock.json"
```

---

**Related:** [What else can be added](WHAT_ELSE_CAN_BE_ADDED.md). **Git AI + xEo links:** [../git-ai-xeo-links.md](../git-ai-xeo-links.md) (install, prompt-analysis, [xEo](https://github.com/GPTJunkie/xEo) skills repo). (pointer to `~/.git-ai/docs/WHAT_ELSE_CAN_BE_ADDED.md`). **What stays here vs ~/.git-ai:** [DOCS_INDEX.md](DOCS_INDEX.md).
