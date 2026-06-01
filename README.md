# OpenCode DevKit

> Client-side tools for auditing, analyzing, and optimizing OpenCode configurations.

## Overview

OpenCode DevKit is a static web app that audits `opencode.json` configurations, validates SKILL.md files, analyzes slash commands and MCP server configs, and audits tool permissions — all running entirely in the browser with no backend server required.

**Current status**: Phase VI complete — fully client-side. All five analyzers plus dashboard live as a static site, deployable to GitHub Pages.

## Tech Stack

| Layer | Technology | Rationale |
| ------- | ----------- | ----------- |
| Framework | React + Vite + TypeScript | HMR for fast iteration, TS for safety |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first CSS, accessible component primitives |
| YAML parsing | js-yaml | Parse YAML frontmatter in SKILL.md and command files |
| Schema validation | ajv + ajv-formats | Validate configs against OpenCode JSON Schema in-browser |
| Package manager | pnpm | Efficient disk usage, strict dependency resolution |

## Quickstart

### Prerequisites

- Node.js 22+ and pnpm 11+

### Setup

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd opencode-devkit

# 2. Install dependencies
pnpm install
```

### Run

```bash
pnpm run dev
```

Opens `http://localhost:5173` — the app runs entirely in your browser with no server backend.

### Build for production

```bash
pnpm run build
```

Outputs static files to `frontend/dist/`, ready for GitHub Pages or any static host.

### Lint and typecheck

```bash
pnpm run lint       # eslint
pnpm run typecheck  # tsc
```

## Project Structure

```text
.
├── frontend/               # React + Vite application
│   ├── package.json
│   ├── vite.config.ts      # Vite config with Tailwind plugin
│   ├── src/
│   │   ├── main.tsx        # React entry
│   │   ├── App.tsx         # Dashboard shell (header, sidebar, theme)
│   │   ├── index.css       # Tailwind v4 + shadcn theme variables
│   │   ├── lib/
│   │   │   ├── api.ts      # API client (re-exports from services + data)
│   │   │   ├── data/       # Static data: features, phases, rules, schema, templates
│   │   │   └── services/   # Business logic: config, skill, command, MCP, tool analyzers
│   │   ├── types/          # TypeScript interfaces for all analyzers
│   │   └── components/
│   │       ├── ui/         # shadcn/ui components (button, card, tabs)
│   │       ├── config-analyzer/  # ConfigUpload, AuditResults, DiffView, ConfigAnalyzer
│   │       ├── skill-analyzer/   # SkillAnalyzer with paste/upload + template browser
│   │       ├── phase4-analyzers/ # CommandAnalyzer, MCPAnalyzer, ToolAnalyzer
│   │       └── dashboard/  # Dashboard, FeatureCard, PhaseTimeline
├── docs/
│   ├── project/            # Planning docs (PHASES, TASKS, DECISIONS, TODO, ERRORS)
│   ├── knowledge/          # OpenCode official reference docs (read-only)
│   └── library/            # Sample skills, commands, tools (reference)
├── .opencode/              # Project-specific OpenCode agents, skills, commands
├── package.json            # Root scripts (dev, build, lint, typecheck)
├── DONE.md                 # Session-based changelog
└── AGENTS.md               # Agent instruction file
```

## Dependencies

| Package | Role |
| ------- | ---- |
| react / react-dom | UI framework |
| vite | Build tool + dev server |
| tailwindcss / @tailwindcss/vite | Utility-first CSS |
| js-yaml | YAML frontmatter parsing |
| ajv / ajv-formats | JSON Schema validation |
| @base-ui/react | Headless component primitives |
| class-variance-authority | Component variant API |
| clsx / tailwind-merge | Class name utilities |
| lucide-react | Icon library |
| shadcn | Component code generation |
| tw-animate-css | Tailwind CSS animation plugin |
| typescript | Type system (dev) |
| eslint / typescript-eslint | Linting (dev) |
| @vitejs/plugin-react | React Fast Refresh / HMR (dev) |
| @types/js-yaml | Type stubs for js-yaml (dev) |

## Roadmap

| Phase | Feature | Status |
| ------- | --------- | -------- |
| I | Scaffold backend and frontend, end-to-end communication | Done |
| II | JSON Config Analyzer (parse, security audit, diff) | Done |
| III | Skill Analyzer & Maker (frontmatter, content quality, templates) | Done |
| IV | Tool, Command, and MCP Analyzers | Done |
| V | Dashboard with metrics, feature grid, roadmap timeline | Done |
| VI | Client-side migration — remove FastAPI, all logic in browser | Done |

See `docs/project/PHASES.md` for full details.

## Architecture Decisions

This section explains **why** we chose certain tools and patterns. These are also recorded in `docs/project/DECISIONS.md`.

### Decision: Client-side only (no backend)

**Date**: 2026-06-01
**Reason**: All analyzers are deterministic computation — no database, no secrets, no external API calls. Moving everything client-side eliminates a server to host, CORS, API proxy, and dual-language tooling. The app becomes a pure static site deployable to GitHub Pages.

Alternatives considered:

- FastAPI backend — added hosting complexity, dual-language maintenance, CORS config, and proxy setup for no benefit given the deterministic nature of the analyzers.

### Decision: `pyproject.toml` over `requirements.txt` (historical)

This decision was for the original Python backend, now removed in Phase VI. Kept as historical context in `docs/project/DECISIONS.md`.

### Decision: pnpm over npm or yarn

**What they are:**

- npm is Node.js's default package manager. It installs packages in a flat `node_modules/`.
- yarn was created to improve speed and determinism over npm.
- pnpm uses a content-addressable, symlinked store.

**Why pnpm wins:** Strict dependency resolution catches missing imports at install time; content-addressable global store saves disk space (up to 10x); best-in-class with consistent filtering flags. The key advantage is strictness — it catches missing imports at install time rather than waiting for runtime crashes, aligning with the project's audit-first philosophy.

### Decision: separate directories over monorepo tools (historical)

Previously justified by the Python/JS split. Now simplified to a single frontend directory with a thin root `package.json`. Kept for historical context.

## License

MIT
