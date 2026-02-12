# Git-AI locations on this Mac (~/**)

Scan date: 2026-02-11. **Scope:** all of `~/` (and `/Volumes/2T-Xx`), same approach as iterm2: every folder scanned, organized by top-level root and depth.  
*(Sources: grep by path, glob, mdfind; `find` from home hit permission errors on some dirs.)*

**Design (what lives where):** `~/.git-ai/docs/WHAT_LIVES_WHERE.md`  
**Index from install dir:** `~/.git-ai/docs/LOCATIONS_INDEX.md`  
**Install dir README:** `~/.git-ai/README.md`

---

## Root: `/Users/steven`

### Depth 1 (direct children of home)
| Path | Type | Note |
|------|------|------|
| `/Users/steven/.git-ai` | dir | **Install**: bin, config, internal, hooks, skills, libexec (see [~/.git-ai](#inside-git-ai-depth-under-install) below) |
| `/Users/steven/git-ai` | dir | Empty (no children); likely clone/placeholder |
| `~/prompt-analysis-skill.md` | file | Doc re prompt-analysis skill (home root) |
| `~/ECOSYSTEM_OPTIMIZATION_REVIEW.md` | file | Mentions git-ai (home root) |
| `~/.system-now-vs-what-would-be.md` | file | Refs git-ai (home root) |
| `~/.zshrc-areas.md` | file | Refs git-ai (home root) |
| `~/.zshrc` | file | git-ai installer block: `PATH=.../.git-ai/bin:$PATH` |
| `~/.bashrc` | file | Same (git-ai installer) |

### Depth 2
| Path | Type | Note |
|------|------|------|
| `/Users/steven/iterm2` | dir | **Full git-ai–tracked repo**: `.git/ai/`, docs, Ai-Merge-GitHub (see [~/iterm2](#root-userssteveniterm2---full-section) below) |
| `/Users/steven/pythons` | dir | **Git-ai–tracked repo**: `.git/ai/`, `meta_agent.py` uses git-ai (see [~/pythons](#root-usersstevenpythons---full-section) below) |
| `/Users/steven/iterm2/docs` | dir | Contains `git-ai-overview-and-uses.md`, `plans/2026-02-10-git-ai-brainstorm-design.md` |
| `/Users/steven/.vscode/extensions/git-ai.git-ai-vscode-0.1.17` | dir | VS Code git-ai extension (changelog, readme) |
| `/Users/steven/.claude` | dir | settings.json, history.jsonl, CLAUDE.md, shell-snapshots, plans — refs to git-ai hooks/paths |
| `/Users/steven/Documents` | dir | Clipboard exports, PasTe .zshrc, Grok tab backup with AvaTar-ArTs/git-ai (see [~/Documents](#root-usersstevendocuments) below) |
| `/Users/steven/grok` | dir | Tab backups: 2 filenames with "git-ai"; others may contain git-ai in JSON (see [~/grok](#root-usersstevengrok) below) |
| `/Users/steven/.config/fish/config.fish` | file | git-ai installer: `fish_add_path -g ".../.git-ai/bin"` |

### Depth 3
| Path | Type | Note |
|------|------|------|
| `/Users/steven/.cursor/extensions/git-ai.git-ai-vscode-0.1.17-universal` | dir | Cursor/VS Code git-ai extension |
| `/Users/steven/.config/opencode/plugin` | dir | Contains `git-ai.ts` (OpenCode plugin) |
| `/Users/steven/grok/TabSessionManager - Backup/Auto Save - Regularly` | dir | Tab backup JSON with "git-ai" in filename |
| `/Users/steven/grok/TabSessionManager - Backup/Auto Save - Window closed` | dir | Tab backup JSON with "git-ai" in filename |
| `/Users/steven/ice-tracker/.git/ai` | dir | Repo-local git-ai working logs and notes (this project) |
| `/Users/steven/iterm2/.git/ai` | dir | **iterm2 repo git-ai data**: working_logs, checkpoints, blobs (iterm2 is git-ai–tracked) |
| `/Users/steven/iterm2/Ai-Merge-GitHub` | dir | Docs and scripts mentioning git-ai (DEPLOYMENT_*.md, GITHUB_INTEGRATION.md, deploy_to_github.sh) |
| `/Users/steven/iterm2/docs/plans` | dir | Contains `2026-02-10-git-ai-brainstorm-design.md` |

### Depth 4
| Path | Type | Note |
|------|------|------|
| `/Users/steven/iterm2/docs/plans/2026-02-10-git-ai-brainstorm-design.md` | file | Doc (brainstorm + writing-skills + ~/.git-ai) |
| `/Users/steven/iterm2/docs/git-ai-overview-and-uses.md` | file | Doc (overview, install, relation to ~/.git-ai) |
| `/Users/steven/iterm2/docs/DEEP_DIVE_ITERM2_DIRS.md` | file | Mentions git-ai docs in plans/ and docs/ |
| `/Users/steven/iterm2/docs/ecosystem_inventory_2026-02-10.json` | file | Inventory; lists `cursor-ecosystem/.cursor/extensions/git-ai.git-ai-vscode-*` paths |
| `/Users/steven/iterm2/docs/agent_ops/steven_top_level.txt` | file | Inventory line: `.git-ai` in home |
| `/Users/steven/iterm2/docs/agent_ops/steven_inventory.txt` | file | Same |
| `/Users/steven/ice-tracker/docs/GIT_AI_RESEARCH.md` | file | Research notes (this repo) |
| `/Users/steven/ice-tracker/docs/GIT_AI_LOCATIONS_BY_DEPTH.md` | file | This file |
| `/Users/steven/ice-tracker/docs/GIT_AI_RUN_ON_ICE_TRACKER.md` | file | What can/should be run on this repo (commands, CI, optional scripts) |
| `/Users/steven/ice-tracker/docs/DOCS_INDEX.md` | file | What stays in this repo vs what we link to (~/.git-ai) |
| `/Users/steven/ice-tracker/scripts/git-ai-stats-release.sh` | file | Optional: git-ai stats for a range (e.g. since tag) |
| `/Users/steven/iterm2/ecosystem_enabled_disabled.md` | file | Mentions git-ai |
| `/Users/steven/.git-ai/skills/prompt-analysis/SKILL.md` | file | Prompt-analysis skill doc |
| `/Users/steven/.git-ai/token-usage.md` | file | Token-usage plan (install) |
| `/Users/steven/.vscode/extensions/git-ai.git-ai-vscode-0.1.17/changelog.md` | file | Extension changelog |
| `/Users/steven/.vscode/extensions/git-ai.git-ai-vscode-0.1.17/readme.md` | file | Extension readme |
| `~/Library/Application Support/Cursor/User/History/.../*.md` | file | Cursor editor history (some entries mention git-ai) |
| `/Users/steven/mcPHooker/docs/wiring.md` | file | Refs git-ai |
| `/Users/steven/mcPHooker/docs/knowledge-base.md` | file | Refs git-ai |
| `/Users/steven/mcPHooker/docs/findings.md` | file | Refs git-ai |

### Depth 5+
| Path | Type | Note |
|------|------|------|
| `/Users/steven/grok/.../2026-02-10 14-23-22 - git-ai--github-workflows... .json` | file | Tab backup |
| `/Users/steven/grok/.../2026-02-09 15-29-43 - git-ai-project-git-ai-... .json` | file | Tab backup |
| `/Users/steven/ice-tracker/.git/ai/working_logs/.../blobs/...` | dir/file | Git-ai checkpoint blobs (this repo) |
| `/Users/steven/ice-tracker/.git/refs/notes/ai` | refs | Git notes for AI attribution (this repo) |
| `/Users/steven/iterm2/.git/ai/working_logs/<sha>/checkpoints.jsonl` | file | Git-ai checkpoints (iterm2 repo) |
| `/Users/steven/iterm2/.git/ai/working_logs/<sha>/blobs/*` | file | Checkpoint blobs (git-ai brainstorm/overview content) |
| `/Users/steven/iterm2/.git/refs/notes/ai` | refs | Git notes for AI attribution (iterm2 repo) |
| `/Users/steven/iterm2/.git/worktrees/*/ai` | dir | Git-ai data in worktrees (iterm2_prompt-engineering-exploration, iterm2-plan-worktree) |
| `/Users/steven/iterm2/better-way.txt` | file | Many refs: ~/git-ai, ~/.git-ai, /dir add .git-ai, meta_agent + git-ai prompts |
| `/Users/steven/iterm2/ai-merge-codex-lack.txt` | file | git-ai checkpoint claude/gemini commands, paths to .git-ai/bin |
| `/Users/steven/iterm2/docs-02-10-16:59.csv` | file | Lists git-ai-overview-and-uses.md, 2026-02-10-git-ai-brainstorm-design.md |
| `/Users/steven/iterm2/ 🚀 The Ultimate AI Ecosystem.txt` | file | Refs: git-ai extension, symlink to ~/.git-ai/skills/prompt-analysis, checkpoint commands |
| `/Users/steven/iterm2/cursor-ecosystem/.cursor/extensions/git-ai.git-ai-vscode-*` | dir | (If present) Copy of git-ai extension under iterm2 cursor-ecosystem |
| `/Users/steven/pythons/.git/ai/working_logs/<sha>/blobs/*` | file | Git-ai checkpoint blobs (pythons repo) |
| `/Users/steven/pythons/meta_agent.py` | file | Uses `git-ai --repo-path`, `git-ai prompts exec` for refactor/analyze flow |
| `/Users/steven/pythons/comprehensive_meta.csv` | file | Describes meta_agent.py + git-ai |
| `/Users/steven/Documents/paste-clipboard-FULL-export/clipboard_*.md` | file | Path lists include `.git-ai` |
| `/Users/steven/Documents/PasTe-Export/.zshrc` | file | git-ai installer PATH block |
| `/Users/steven/Documents/Grok-Conversations/.../*.json` | file | Tab backup with AvaTar-ArTs/git-ai title/url |

---

## Root: `/Users/steven/iterm2` — full section

**iterm2** is a git-ai–tracked repo with its own `.git/ai`, notes, and worktrees. It also contains docs, logs, and subprojects that reference git-ai and ~/.git-ai.

| Location | Type | Description |
|----------|------|-------------|
| **`.git/ai/`** | dir | Working logs, checkpoints, blobs (commits 58b4e6a..., 5f5f617b...) |
| **`.git/refs/notes/ai`** | refs | AI attribution notes for iterm2 |
| **`.git/worktrees/*/ai`** | dir | Git-ai data in worktrees (prompt-engineering-exploration, plan/worktree) |
| **`docs/git-ai-overview-and-uses.md`** | file | Overview, install, relation to ~/.git-ai and prompt-analysis |
| **`docs/plans/2026-02-10-git-ai-brainstorm-design.md`** | file | Brainstorm: writing-skills + superpowers with ~/.git-ai (Options A/B/C) |
| **`docs/DEEP_DIVE_ITERM2_DIRS.md`** | file | Mentions git-ai docs in plans/ and docs/ |
| **`docs/ecosystem_inventory_2026-02-10.json`** | file | Lists `cursor-ecosystem/.cursor/extensions/git-ai.git-ai-vscode-*` |
| **`docs/agent_ops/steven_top_level.txt`** | file | Inventory: `.git-ai` in home |
| **`docs/agent_ops/steven_inventory.txt`** | file | Same |
| **`docs-02-10-16:59.csv`** | file | Lists git-ai doc filenames and paths |
| **`better-way.txt`** | file | ~/git-ai, ~/.git-ai, /dir add .git-ai, meta_agent + git-ai prompts/exec |
| **`ai-merge-codex-lack.txt`** | file | `/Users/steven/.git-ai/bin/git-ai checkpoint claude|gemini` |
| **` 🚀 The Ultimate AI Ecosystem.txt`** | file | git-ai extension, symlink to ~/.git-ai/skills/prompt-analysis, checkpoint hooks |
| **`Ai-Merge-GitHub/`** | dir | DEPLOYMENT_*.md, GITHUB_INTEGRATION.md, deploy_to_github.sh — git-ai integration notes |
| **`cursor-ecosystem/.cursor/extensions/git-ai.git-ai-vscode-*`** | dir | (If present) Git-ai extension copy under iterm2 |

---

## Root: `/Users/steven/pythons` — full section

**pythons** is a git-ai–tracked repo. It contains a meta-agent script that runs a refactor phase then uses git-ai to analyze prompts/acceptance.

| Location | Type | Description |
|----------|------|-------------|
| **`.git/ai/`** | dir | Working logs, checkpoints, blobs (e.g. commit f9e1590a...) |
| **`meta_agent.py`** | file | Calls `git-ai --repo-path`, `git-ai prompts`, `git-ai prompts exec` for analyze step; refs in docstrings and error messages |
| **`comprehensive_meta.csv`** | file | Row describing meta_agent: "analyze phase using `git-ai`" |

---

## Root: `/Users/steven/Documents`

| Location | Type | Description |
|----------|------|-------------|
| **`paste-clipboard-FULL-export/clipboard_2026-01-18.md`** | file | Path list includes `/Users/steven/.git-ai` |
| **`paste-clipboard-FULL-export/clipboard_2026-01-22.md`** | file | Path list includes `.git-ai`; line with `.git-ai/bin` |
| **`PasTe-Export/.zshrc`** | file | "# Added by git-ai installer" + `PATH=.../.git-ai/bin:$PATH` |
| **`Grok-Conversations/TabSessionManager - Backup/.../*.json`** | file | Tab backup with title/url "AvaTar-ArTs/git-ai" |

---

## Root: `/Users/steven/grok`

Tab backup JSONs under `TabSessionManager - Backup/` (Auto Save - Regularly, Window closed, Browser exited). Two files have **"git-ai" in the filename**; others may contain git-ai in URL/title inside the JSON.

| Filename pattern | Note |
|------------------|------|
| `... - git-ai--github-workflows at main · GPTJunkie-git-ai #regular - [...].json` | Filename |
| `... - git-ai-project-git-ai- A Git extension for tracking... #winClose - [...].json` | Filename |

---

## Root: `/Users/steven/.claude`

Multiple files reference git-ai (hooks, paths, or context): **settings.json**, **history.jsonl**, **CLAUDE.md**, **CLAUDE.md.UPDATED**, **plans/snug-waddling-seal.md**, and several **shell-snapshots/snapshot-zsh-*.sh**. Content includes git-ai checkpoint commands and `~/.git-ai` paths.

---

## Root: `/Users/steven/.vscode`

| Location | Type | Description |
|----------|------|-------------|
| **`extensions/git-ai.git-ai-vscode-0.1.17/`** | dir | Git-ai VS Code extension (changelog.md, readme.md; version 0.1.17 vs Cursor’s 0.1.17-universal) |

---

## Root: `/Users/steven/mcPHooker`

| Location | Type | Description |
|----------|------|-------------|
| **`docs/wiring.md`** | file | Refs git-ai |
| **`docs/knowledge-base.md`** | file | Refs git-ai |
| **`docs/findings.md`** | file | Refs git-ai |

---

## Root: `/Volumes/2T-Xx`

### Depth 3
| Path | Type | Note |
|------|------|------|
| `/Volumes/2T-Xx/us.sitesucker.mac.sitesucker-pro/topai.tools/t` | dir | Contains `worgit-ai.html` (saved page) |

### Depth 4
| Path | Type | Note |
|------|------|------|
| `/Volumes/2T-Xx/Github-Repos/structures/AvaTar-ArTs/git-ai` | dir | Structure/stub repo (`.structure` only) |

### Depth 5
| Path | Type | Note |
|------|------|------|
| `/Volumes/2T-Xx/us.sitesucker.mac.sitesucker-pro/topai.tools/t/worgit-ai.html` | file | Saved HTML |

---

## Inside `~/.git-ai` (depth under install)

| Depth | Path | Note |
|-------|------|------|
| 1 | `bin/`, `internal/`, `hooks/`, `skills/`, `config.json`, etc. | Top level of install |
| 2 | `bin/git-ai`, `bin/git`, `bin/git-og` | Binaries and symlinks |
| 2 | `hooks/cursor-checkpoint.sh` | Wrapper for Cursor |
| 2 | `internal/db`, `internal/distinct_id`, ... | DB and state |
| 2 | `token-usage.md` | Token-usage / resolve plan (written by Cursor cli-config) |
| 2 | `README.md` | What lives here vs elsewhere; links to docs/ and ice-tracker locations |
| 3 | `docs/WHAT_LIVES_WHERE.md` | Design: install vs IDE vs per-repo vs project |
| 3 | `docs/LOCATIONS_INDEX.md` | Short index to key git-ai locations on this machine |
| 3 | `skills/prompt-analysis/SKILL.md` | Prompt-analysis skill doc |

---

## Summary (~/**)

- **Active install**: `~/.git-ai` (depth 1); Cursor hooks → `~/.git-ai/hooks/cursor-checkpoint.sh`; extension in `~/.cursor/extensions/git-ai.git-ai-vscode-*`; OpenCode plugin in `~/.config/opencode/plugin/git-ai.ts`.
- **Git-ai–tracked repos under ~**: **ice-tracker** (this repo), **iterm2** (docs, Ai-Merge-GitHub, worktrees), **pythons** (meta_agent.py + `.git/ai`).
- **Home root files**: `prompt-analysis-skill.md`, `ECOSYSTEM_OPTIMIZATION_REVIEW.md`, `.system-now-vs-what-would-be.md`, `.zshrc-areas.md` (refs to git-ai).
- **~/iterm2**: Full section above; docs, better-way.txt, ai-merge-codex-lack.txt, Ultimate AI Ecosystem.txt, cursor-ecosystem extension copy.
- **~/pythons**: Full section above; meta_agent.py, comprehensive_meta.csv, `.git/ai`.
- **~/Documents**: Clipboard exports (path lists with .git-ai), PasTe-Export .zshrc (git-ai PATH), Grok-Conversations tab (AvaTar-ArTs/git-ai).
- **~/grok**: Tab backups; 2 filenames with "git-ai", others may contain git-ai in JSON.
- **~/.claude**: settings.json, history.jsonl, CLAUDE.md, shell-snapshots, plans — refs to git-ai.
- **~/.vscode**: `extensions/git-ai.git-ai-vscode-0.1.17` (extension copy).
- **~/mcPHooker**: docs/wiring.md, knowledge-base.md, findings.md (refs git-ai).
- **Library/Application Support/Cursor/User/History**: Some editor history files mention git-ai.
- **Other**: `~/git-ai` (empty dir), `AvaTar-ArTs/git-ai` on 2T-Xx (structure repo), `/Volumes/2T-Xx/.../worgit-ai.html`.
