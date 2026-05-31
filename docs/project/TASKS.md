# TASKS.md

Active task breakdown for the current phase.

## Phase I — Initialization (complete)

- [x] Create project directory structure
- [x] Set up Python virtual environment (`.devkit/`)
- [x] Create GitHub repo and push initial commit
- [x] Seed `docs/knowledge/` with official OpenCode reference docs
- [x] Write `AGENTS.md` with project-specific guidance
- [x] Create project `opencode.json` with instructions and permissions
- [x] Create `docs/library/` with subdirectories
- [x] Create project documentation files (PHASES, TASKS, TODO, DECISIONS)
- [x] Install FastAPI backend scaffold (`backend/`, pyproject.toml, ruff, mypy)
- [x] Install React + Vite + TypeScript + Tailwind + shadcn/ui frontend scaffold (`frontend/`)
- [x] Wire up backend ↔ frontend communication (CORS + Vite proxy + health check)
- [x] Verify dev server and HMR work end-to-end
- [x] Write proper README.md with architecture decision rationale
- [x] Add pre-commit hooks (ruff, mypy, eslint)
- [x] Create unified `pnpm run dev` start command (concurrently)

## Phase II — JSON Config Analyzer (next)

- [ ] Parse and validate opencode.json against schema
- [ ] Report missing recommended settings with explanations
- [ ] Flag security risks with severity and remediation links
- [ ] Show diff between original and optimized config
