# OpenCode DevKit

> A modular AI-assisted development layer for analyzing, auditing, and optimizing OpenCode configurations.

## Overview

OpenCode DevKit ingests `opencode.json` config files and provides structured audits: security risks, missing settings, skill completeness, and more. It is built as a full-stack web application with a FastAPI backend and a React/Vite frontend.

**Current status**: Phase II complete — the JSON Config Analyzer is live with security auditing (7 rules), missing settings detection (7 checks), config optimization, JSON Schema validation, and config diffing. Phase III (Skill Analyzer) is next.

## Tech Stack

| Layer | Technology | Rationale |
| ------- | ----------- | ----------- |
| Backend | FastAPI (Python 3.10+) | Strong typing, async-first, auto-generated OpenAPI docs |
| Frontend | React + Vite + TypeScript | HMR for fast iteration, TS for safety |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first CSS, accessible component primitives |
| Python packaging | `pyproject.toml` | Modern standard; see [Decision: pyproject.toml](#decision-pyprojecttoml-over-requirementstxt) |
| JS package manager | pnpm | Efficient disk usage, strict dependency resolution; see [Decision: pnpm](#decision-pnpm-over-npm-or-yarn) |
| Project layout | Separate `backend/` and `frontend/` | Simplicity over monorepo tooling; see [Decision: project layout](#decision-separate-directories-over-monorepo-tools) |

## Quickstart

### Prerequisites

- Python 3.10+ with a virtual environment
- Node.js 22+ and pnpm 11+

### Setup

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd opencode-devkit

# 2. Activate the Python venv
source .devkit/bin/activate

# 3. Install Python dependencies
pip install -e backend/

# 4. Install frontend dependencies
pnpm install
```

### Run both servers

```bash
pnpm run dev
```

This starts the FastAPI backend on `http://localhost:8000` and the Vite frontend on `http://localhost:5173` concurrently. Open `http://localhost:5173` in your browser — the dashboard header shows a green dot when the API is connected.

### Run individually

```bash
pnpm run dev:backend    # FastAPI on :8000
pnpm run dev:frontend   # Vite on :5173
```

### Lint and typecheck

```bash
pnpm run lint           # ruff (backend) + eslint (frontend)
pnpm run typecheck      # mypy (backend) + tsc (frontend)
```

## Project Structure

```text
.
├── backend/                # FastAPI application
│   ├── pyproject.toml      # Python dependencies and tool configs
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point, CORS config
│   │   ├── data/
│   │   │   ├── rules.py    # Security rules, recommended settings, optimizations
│   │   │   └── schema.py   # OpenCode JSON Schema for validation
│   │   ├── schemas/
│   │   │   └── config.py   # Pydantic models for audit/diff responses
│   │   ├── services/
│   │   │   └── config_analyzer.py  # JSON/JSONC parser, analysis, diff engine
│   │   └── routers/
│   │       ├── health.py   # GET /api/health
│   │       └── config.py   # POST /api/config/audit, POST /api/config/diff
│   └── tests/
├── frontend/               # React + Vite application
│   ├── package.json
│   ├── vite.config.ts      # Vite config with Tailwind plugin and API proxy
│   ├── src/
│   │   ├── main.tsx        # React entry
│   │   ├── App.tsx         # Dashboard shell (header, sidebar, health check)
│   │   ├── index.css       # Tailwind v4 entry + shadcn theme variables
│   │   ├── lib/
│   │   │   ├── utils.ts    # cn() utility (clsx + tailwind-merge)
│   │   │   └── api.ts      # API client (auditConfig, diffConfig)
│   │   ├── types/
│   │   │   └── config.ts   # TypeScript interfaces for API contracts
│   │   └── components/
│   │       ├── ui/         # shadcn/ui components (button, card, tabs)
│   │       └── config-analyzer/  # ConfigUpload, AuditResults, DiffView, ConfigAnalyzer
│   └── components.json     # shadcn/ui config
├── docs/
│   ├── project/            # Planning docs (PHASES, TASKS, DECISIONS, TODO)
│   ├── knowledge/          # OpenCode official reference docs (read-only)
│   └── library/            # Sample skills, commands, tools (reference)
├── .opencode/              # Project-specific OpenCode agents, skills, commands
├── package.json            # Root scripts (dev, lint, typecheck)
├── DONE.md                 # Session-based changelog
└── AGENTS.md               # Agent instruction file
```

## Configuration

### Environment variables

None required for Phase I. The backend runs on `localhost:8000` and the frontend proxies `/api` requests to it via Vite's dev server proxy.

### CORS

The FastAPI backend allows requests from `http://localhost:5173` (the Vite dev server). In development, the Vite proxy makes CORS unnecessary, but the middleware is configured as a safety net for direct API access.

## Contributing

See `AGENTS.md` for agent workflow rules and `docs/project/TASKS.md` for active tasks.

### Dev environment quick-check

```bash
pnpm run typecheck && pnpm run lint && pnpm -C frontend run build
```

All three must pass before committing.

## Roadmap

| Phase | Feature | Status |
| ------- | --------- | -------- |
| I | Scaffold backend and frontend, end-to-end communication | Done |
| II | JSON Config Analyzer (parse, security audit, diff) | Done |
| III | Skill Analyzer & Maker | Planned |
| IV | Tool, Command, and MCP Analyzers | Planned |
| V | Unified Dashboard + Settings | Planned |

See `docs/project/PHASES.md` for full details.

## Architecture Decisions

This section explains **why** we chose certain tools and patterns. These are also recorded in `docs/project/DECISIONS.md` for quick reference.

### Decision: `pyproject.toml` over `requirements.txt`

**What they are:**

- `requirements.txt` is a simple flat list of package names, optionally pinned with `==`. It has been the Python ecosystem default for decades.
- `pyproject.toml` is a modern, structured file that serves as a single source of truth for project metadata, dependencies, and tool configuration.

**Why `pyproject.toml` wins:**

| Aspect | requirements.txt | pyproject.toml |
| -------- | ----------------- | ---------------- |
| Project metadata (name, version, description) | Not supported | Built-in |
| Dev vs. production dependencies | Requires separate files (`requirements-dev.txt`) | Supported via `[project.optional-dependencies]` |
| Tool configuration (ruff, mypy, pytest) | Separate config files per tool | Configured inline under `[tool.*]` |
| Build and packaging info | Not supported | Supported for creating installable packages |
| Ecosystem adoption | Legacy default | PEP 517/518/621 standard — the modern way |

By using `pyproject.toml`, we get dependency groups, tool configs, and project metadata in one file — no need for `setup.py`, `setup.cfg`, `requirements-dev.txt`, separate `ruff.toml`, or `mypy.ini`.

### Decision: pnpm over npm or yarn

**What they are:**

- npm is Node.js's default package manager. It installs packages in a flat `node_modules/`.
- yarn was created to improve speed and determinism over npm.
- pnpm uses a content-addressable, symlinked store. Every package version is stored exactly once on disk and hard-linked into projects.

**Why pnpm wins:**

| Aspect | npm | yarn | pnpm |
| -------- | ----- | ------ | ------ |
| Disk usage | Duplicates packages per project | Similar to npm (with Plug'n'Play option) | Single global store + symlinks — **up to 10x less disk** |
| Install speed | Baseline | Faster than classic npm | Comparable to yarn, often faster on CI |
| Strictness | Allows hoisting and phantom dependencies | Moderate (strict option available) | **Strict by default** — code can only `require()` declared deps |
| Lockfile format | `package-lock.json` | `yarn.lock` | `pnpm-lock.yaml` (most readable and diff-friendly) |
| Workspace support | Basic | Good | Best-in-class with consistent filtering flags (`-C`, `--filter`) |

The key advantage for this project is **strict dependency resolution**. pnpm catches missing imports at install time rather than waiting for a runtime crash, which aligns with the project's audit-first philosophy.

### Decision: separate directories over monorepo tools

**What they are:**

- A monorepo (via Turborepo, Nx, or pnpm workspaces) places both backend and frontend under one tooling umbrella with shared scripts, caching, and orchestration.
- Separate directories keep the Python backend and JS frontend as independent, self-contained projects, connected by a thin root `package.json` with conveniences scripts.

**Why separate directories win for this project:**

| Aspect | Monorepo (Turborepo/Nx) | Separate directories |
| -------- | ------------------------- | --------------------- |
| Setup complexity | Requires learning and configuring a monorepo tool | Zero additional tooling — just a root `package.json` |
| Tooling overlap | Forces JS-centric tooling on the Python backend | Each stack uses its own native tools |
| Learning curve | High — caching, pipelines, dependency graph | Minimal — standard `pnpm -C frontend` and shell commands |
| Scale | Better for 5+ packages with cross-dependencies | Perfect for a single backend + single frontend |
| Onboarding | Slower — devs must understand the monorepo tool | Immediate — run two servers, that's it |

For a project with exactly two applications (one Python, one JS), the monorepo tooling overhead is not justified. Should the project grow to include shared libraries, we can revisit this decision and adopt pnpm workspaces with minimal migration effort.

## License

MIT
