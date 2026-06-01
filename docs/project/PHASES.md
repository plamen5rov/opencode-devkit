# PHASES.md

Project roadmap by phase.

---

## Phase I — Initialization (complete)

Scaffold the project: directory structure, virtual environment, package
installation, and documentation.

**Goal**: `pnpm run dev` starts a working FastAPI backend + React frontend.

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

## Phase V — Dashboard (complete)

Unified homescreen with metrics and feature access.

- [x] Header with app name, logo, settings (existing from earlier phases)
- [x] Sidebar navigation for all features (existing, added Dashboard as first entry)
- [x] Central area showing implementation status per feature
- [x] Stats summary cards (total features, implemented, phases complete)
- [x] Feature grid with status badges and descriptions
- [x] Phase roadmap timeline with visual status indicators
- [x] Data-driven from backend (then moved to static in Phase VI)

---

## Phase VI — Client-Side Migration (complete)

Remove FastAPI backend, move all logic to browser, enable pure static deploy.

- [x] Installed js-yaml, ajv, ajv-formats for client-side equivalents
- [x] Ported 4 static data files (features, templates, schema, rules) to TypeScript
- [x] Ported 5 analyzer services (config, skill, command, MCP, tool) to TypeScript
- [x] Rewrote all components to use synchronous, direct imports (no fetch)
- [x] Removed backend/ directory, Python venv, and all Python tooling
- [x] Simplified root configs: package.json, opencode.json, .gitignore, pre-commit
- [x] Removed Vite API proxy — no backend to proxy to
- [x] All checks pass: tsc (zero), eslint (zero), markdownlint (zero)

---

## Phase VII — Dashboard Polish (complete)

Search, activity feed, and export for the dashboard landing page.

- [x] SessionStorage-backed activity log module shared across all analyzers
- [x] All 5 analyzers log activity entries after successful analysis
- [x] Dashboard search/filter input filters feature grid in real-time
- [x] Activity feed sidebar showing 10 most recent actions with type icons
- [x] Export dashboard as markdown report (.md download)
- [x] Empty-state for activity feed (no analyses run yet)
