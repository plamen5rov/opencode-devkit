# AGENTS.md

## What this is

A full-stack web app (FastAPI + React/Vite/TypeScript/Tailwind/shadcn/ui)
for auditing, analyzing, and optimizing OpenCode config files.

**Current status: Phase II complete. JSON Config Analyzer is live.**

---

## Key files

| File | Purpose |
| ---- | ------- |
| `docs/project/OpenCode-DevKit-Project.md` | Vision, features, stack, phases |
| `docs/project/PHASES.md` | Phase-by-phase roadmap |
| `docs/project/TASKS.md` | Active task checklist for current phase |
| `docs/project/TODO.md` | Pending items and deferred ideas |
| `docs/project/DECISIONS.md` | Architecture decision log |
| `docs/project/ERRORS.md` | Structured error log with root causes and lessons |
| `docs/project/additional-files.md` | Why CHANGELOG/PHASES/DECISIONS belong |
| `docs/knowledge/` | Copies of official OpenCode docs — read-only, don't edit |
| `docs/library/` | Sample skills, commands, tools for reference |
| `opencode.json` | Project-specific OpenCode config |
| `.opencode/` | Project-specific agents, commands, skills |
| `AGENTS.md` | This file |
| `DONE.md` | Session-based changelog |
| `README.md` | Project README with quickstart and decision rationale |

---

## Dev environment

- Python venv at `.devkit/` (Python 3.10, gitignored)
- Activate: `source .devkit/bin/activate`
- Backend dev server: `pnpm run dev:backend` (FastAPI on :8000)
- Frontend dev server: `pnpm run dev:frontend` (Vite on :5173)
- Both together: `pnpm run dev`
- Lint: `pnpm run lint` (ruff + eslint)
- Typecheck: `pnpm run typecheck` (mypy + tsc)

---

## Conventions

### Ask, don't guess

When requirements are unclear: STOP and ask. Never invent missing requirements
or silently choose a direction.

### Document sync

When you change anything, update all affected project docs:
`AGENTS.md`, `README.md`, `docs/project/TASKS.md`, `docs/project/TODO.md`,
`DONE.md`, `docs/project/PHASES.md`, `docs/project/ERRORS.md`, etc.

Documentation must never lag behind implementation or decisions.

### Error logging

When you make a mistake that causes a bug or requires rework, log it in
`docs/project/ERRORS.md` with: date, symptom, root cause, fix applied,
and lesson learned. Do this after the fix is committed — not before.

This is mandatory. A bug that takes multiple attempts to fix MUST be logged.

### Commit often

After every major batch of changes, without being reminded:

1. Update `DONE.md` with dated bullets
2. Stage all changes (`git add -A`)
3. Write a conventional commit (`feat:`, `docs:`, `chore:`, etc.)
4. Push to remote (`git push`)

Do this proactively — do not wait for the user to ask.

### Permissions

Do not ask for permission on routine actions: edit, read, glob, grep, git,
python3, mkdir, markdownlint, ruff, mypy, npm, npx, pnpm, tsc, eslint.
Test/verify commands (lint, typecheck, format) are pre-granted.

Only ask for hazardous actions: removing files (`rm`, `rmdir`), installing
packages (`pip install`, `pnpm add`), or running unfamiliar commands.
The `opencode.json` already encodes these rules.

### Markdown quality

All `.md` files follow CommonMark/GFM best practices (blank lines around
headings, lists, and fenced code blocks; no trailing spaces; single trailing
newline). Use the `markdown-lint` skill when writing or editing `.md` files.

### .gitignore hygiene

After installing ANY new software package (pip install, pnpm add, etc.), check
whether new artifacts need to be added to `.gitignore`. Typical culprits:

- `node_modules/` — every new pnpm/node project
- `dist/`, `build/` — build output directories
- `__pycache__/`, `.pytest_cache/`, `.mypy_cache/` — Python bytecode and tool
  caches
- `.env`, `.env.*` — environment files that may contain secrets
- Lockfiles in unexpected locations

Run `git status` before every commit and verify no generated files, caches, or
secrets would be pushed. Add missing patterns to `.gitignore` before staging.

---

## Recommended skills

| Skill | When to use |
| ----- | ----------- |
| `markdown-lint` | Writing or editing any `.md` file |
| `opencode-config` | Working with any `opencode.json` file |
| `readme-guide` | Writing or improving `README.md` |
| `graphify` | Building/querying the project knowledge graph |
| `done-md-logger` / `github-commit` | After each commit |
| `readme-update` | After commit+push, check if README needs updating |

## Useful slash commands

| Command | Purpose |
| ------- | ------- |
| `/graphify` | Build or query the knowledge graph |
| `/log-n-push` | Update DONE.md, commit, push |
| `/session-recap` | Summarize session: what changed, what remains |
| `/pr-summary` | Summarize changes for a PR or handoff |
| `/repo-scan` | Inspect repo structure and report findings |
| `/update-relevant-files` | Audit all project docs for stale references after changes |
