# PHASES.md

Project roadmap by phase.

---

## Phase I — Initialization (complete)

Scaffold the project: directory structure, virtual environment, package
installation, and documentation.

**Goal**: `npm run dev` starts a working FastAPI backend + React frontend.

- [x] Directory structure and venv
- [x] Reference docs seeded
- [x] Project documentation (AGENTS.md, TASKS.md, TODO.md, DECISIONS.md)
- [x] `docs/library/` created
- [x] FastAPI backend scaffold (pyproject.toml, ruff, mypy)
- [x] React + Vite + TypeScript + Tailwind + shadcn/ui frontend scaffold
- [x] Verified end-to-end dev pipeline (CORS + Vite proxy + health check)
- [x] README.md with architecture decision rationale
- [x] Pre-commit hooks (ruff, mypy, eslint)
- [x] Unified `pnpm run dev` start command

---

## Phase II — JSON Config Analyzer (complete)

Upload or paste an `opencode.json`, get a security/coverage audit.

- [x] Parse and validate config (JSON/JSONC with comment stripping)
- [x] Report missing recommended settings with explanations
- [x] Flag security risks with severity and remediation links
- [x] Show diff between original and optimized config
- [x] Config upload (paste, file upload, drag-and-drop)
- [x] Audit results with severity badges, missing settings, optimization display
- [x] OpenCode JSON Schema validation
- [x] Export/download optimized config
- [x] "Clear All Data" button functionality

---

## Phase III — Skill Analyzer & Maker (complete)

Analyze existing skills and provide a builder for creating new ones.

- [x] Parse SKILL.md frontmatter and validate name, description, required fields
- [x] Content quality report (word count, heading structure, trigger section, examples)
- [x] File structure checks (SKILL.md filename, directory name match)
- [x] Completeness score with per-category breakdown
- [x] Skill template matrix with 5 templates (tool-setup, workflow, analyzer, code-gen, docs)
- [x] Copy template to clipboard for scaffolding new skills

---

## Phase IV — Tool, Command, MCP Analyzers (complete)

Same analyzer/maker pattern for tools, slash commands, and MCP servers.

- [x] Command analyzer: YAML frontmatter validation, content quality scoring,
  argument/shell/file-ref detection
- [x] MCP server analyzer: type validation, required field checks,
  hardcoded secret detection in env/headers/oauth
- [x] Tool permissions: permission value validation, security-sensitive tool
  flagging, missing critical permission detection
- [x] Frontend: three analyzer components with paste/upload, score badges,
  per-server/per-tool card layout

---

## Phase V — Dashboard (in progress)

Unified homescreen with metrics and feature access.

- [x] Header with app name, logo, settings (existing from earlier phases)
- [x] Sidebar navigation for all features (existing, added Dashboard as first entry)
- [x] Central area showing implementation status per feature
- [x] Stats summary cards (total features, implemented, phases complete)
- [x] Feature grid with status badges and descriptions
- [x] Phase roadmap timeline with visual status indicators
- [x] Data-driven from backend `GET /api/dashboard`
- [ ] Search and filtering for features
- [ ] Activity feed / recent audit log
- [ ] Export dashboard as report
