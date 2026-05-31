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

## Phase II — JSON Config Analyzer (complete)

- [x] Backend: Pydantic schemas for audit/diff (ConfigAuditResponse, SecurityIssue, MissingSetting, etc.)
- [x] Backend: Security rules engine (7 rules: permissions, bash, API keys, share, autoupdate, snapshots, MCP)
- [x] Backend: Missing settings detection (7 checks: model, small_model, instructions, permissions, compaction, watcher, server)
- [x] Backend: Config optimization suggestions (autoupdate→notify, add permissions, add $schema)
- [x] Backend: Recursive config diff engine
- [x] Backend: `POST /api/config/audit` and `POST /api/config/diff` endpoints
- [x] Frontend: TypeScript types matching API responses
- [x] Frontend: API client (`lib/api.ts`)
- [x] Frontend: ConfigUpload component (paste, file upload, drag-and-drop)
- [x] Frontend: AuditResults component (severity badges, security issues, missing settings, optimizations)
- [x] Frontend: DiffView component (added/removed/changed with color-coded entries)
- [x] Frontend: ConfigAnalyzer orchestrator with tabs (audit, diff, optimized config)
- [x] Frontend: Integrated into dashboard sidebar with `implemented: true`
- [x] OpenCode config JSON Schema validation (jsonschema library, stored in backend/app/data/schema.py)
- [x] Config export/download button for optimized config
- [x] Clear All Data functionality
