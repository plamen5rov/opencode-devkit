# PHASES.md

Project roadmap by phase.

---

## Phase I — Initialization (current)

Scaffold the project: directory structure, virtual environment, package
installation, and documentation.

**Goal**: `npm run dev` starts a working FastAPI backend + React frontend.

- [x] Directory structure and venv
- [x] Reference docs seeded
- [x] Project documentation (AGENTS.md, TASKS.md, TODO.md, DECISIONS.md)
- [x] `docs/library/` created
- [ ] FastAPI backend scaffold
- [ ] React + Vite + TypeScript + Tailwind + shadcn/ui frontend scaffold
- [ ] Verified end-to-end dev pipeline

---

## Phase II — JSON Config Analyzer

Upload or paste an `opencode.json`, get a security/coverage audit.

- Parse and validate config against schema
- Report missing recommended settings with explanations
- Flag security risks with severity and remediation links
- Show diff between original and optimized config

---

## Phase III — Skill Analyzer & Maker

Analyze existing skills and provide a builder for creating new ones.

- Parse SKILL.md frontmatter and content
- Report completeness (description, permissions, prompt quality)
- Skill template matrix with options, descriptions, examples

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
