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

## Phase III — Skill Analyzer & Maker (complete)

- [x] Backend: Pydantic schemas (SkillFrontmatter, CompletenessReport, SkillTemplate, etc.)
- [x] Backend: YAML frontmatter parser with name/description validation
- [x] Backend: Content quality analyzer (word count, headings, trigger section, examples)
- [x] Backend: File structure checks (SKILL.md filename, directory-name match)
- [x] Backend: Completeness scoring engine (frontmatter 40, content 40, file 20)
- [x] Backend: Built-in template matrix (5 templates: tool-setup, workflow, analyzer, code-gen, docs)
- [x] Backend: `POST /api/skill/analyze` and `GET /api/skill/templates` endpoints
- [x] Frontend: TypeScript types for skill API responses
- [x] Frontend: `analyzeSkill()` and `getSkillTemplates()` API client functions
- [x] Frontend: SkillAnalyzer component with paste/upload, score badges, report cards
- [x] Frontend: Template browser with expandable frontmatter/sections and copy-to-clipboard
- [x] Frontend: Integrated into dashboard sidebar with `implemented: true`

## Phase IV — Tool, Command, MCP Analyzers (complete)

- [x] Backend: Combined schemas for all three analyzers (phase4.py)
- [x] Backend: Command analyzer — YAML frontmatter parser, content quality scoring,
  $ARGUMENTS/shell/file-ref detection
- [x] Backend: MCP analyzer — local/remote type validation, required field checks,
  hardcoded secret detection in env/headers/oauth
- [x] Backend: Tool analyzer — permission value validation, security-sensitive tool
  flagging, missing critical permission detection
- [x] Backend: `POST /api/command/analyze`, `POST /api/mcp/analyze`,
  `POST /api/tool/analyze` endpoints
- [x] Frontend: TypeScript types for all three API responses
- [x] Frontend: `analyzeCommand()`, `analyzeMCP()`, `analyzeTools()` API functions with
  shared `postForm` helper
- [x] Frontend: CommandAnalyzer component — paste/upload .md, frontmatter + content
  report, score badge
- [x] Frontend: MCPAnalyzer component — per-server cards with type/command/security
  checks, overall score
- [x] Frontend: ToolAnalyzer component — permission rules table, security-sensitive
  badges, missing-critical alert, legend
- [x] Frontend: All three integrated into dashboard sidebar with `implemented: true`
