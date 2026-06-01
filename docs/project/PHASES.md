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

## Phase IV — Tool, Command, MCP Analyzers

Same analyzer/maker pattern for tools, slash commands, and MCP servers.

- Tool definitions and permissions
- Command markdown structure
- MCP server configuration and authentication

---

## Phase V — Dashboard

Unified homescreen with metrics and feature access.

- Header with app name, logo, settings
- Sidebar navigation for all features
- Central area showing implementation status per feature
