# AGENTS.md

## What this is

A full-stack web app (FastAPI + React/Vite/TypeScript/Tailwind/shadcn/ui)
for auditing, analyzing, and optimizing OpenCode config files.

**Current status: Phase I — Initialization. No production code exists yet.**

---

## Key files

| File | Purpose |
| ---- | ------- |
| `docs/project/OpenCode-DevKit-Project.md` | Vision, features, stack, phases |
| `docs/project/additional-files.md` | Why CHANGELOG/PHASES/DECISIONS belong |
| `knowledge/` | Copies of official OpenCode docs — **read-only, do not edit** |
| `opencode.json` | Project-specific OpenCode config |
| `AGENTS.md` | This file |
| `README.md` | Needs writing (currently placeholder) |

---

## Dev environment

- Python venv at `.devkit/` (Python 3.10, gitignored)
- Activate: `source .devkit/bin/activate`
- No build, test, lint, or typecheck commands exist yet — they will be
  scaffolded during Phase I

---

## Conventions

### Ask, don't guess

When requirements are unclear: STOP and ask. Never invent missing requirements
or silently choose a direction.

### Document sync

When you change anything, update all affected project docs:
`AGENTS.md`, `README.md`, `docs/project/TASKS.md`, `docs/project/TODO.md`,
`CHANGELOG.md`, `docs/project/PHASES.md`, etc.

Documentation must never lag behind implementation or decisions.

### Commit often

After every major batch of changes, without being reminded:
1. Update `DONE.md` with dated bullets
2. Stage all changes (`git add -A`)
3. Write a conventional commit (`feat:`, `docs:`, `chore:`, etc.)
4. Push to remote (`git push`)

Do this proactively — do not wait for the user to ask.

### Markdown quality

All `.md` files follow CommonMark/GFM best practices (blank lines around
headings, lists, and fenced code blocks; no trailing spaces; single trailing
newline). Use the `markdown-lint` skill when writing or editing `.md` files.

---

## Recommended skills

| Skill | When to use |
| ----- | ----------- |
| `markdown-lint` | Writing or editing any `.md` file |
| `opencode-config` | Working with any `opencode.json` file |
| `readme-guide` | Writing or improving `README.md` |
| `done-md-logger` / `github-commit` | After each commit |
