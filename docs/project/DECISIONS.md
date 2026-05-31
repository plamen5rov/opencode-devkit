# DECISIONS.md

Architecture decisions and rationale. Each entry records *what* was chosen,
*why*, and *when* — so context survives across sessions and contributors.

---

## Backend: FastAPI

**Date**: 2026-05-31
**Reason**: Strong typing (Pydantic), API-first design, async support, and
OpenAPI auto-generation align with the JSON-centric, API-heavy nature of the
config analyzer.

Alternatives considered:

- Django — too heavy for an API-only backend
- Flask — less structured, manual OpenAPI setup

---

## Frontend: React + Vite + TypeScript + Tailwind + shadcn/ui

**Date**: 2026-05-31
**Reason**: Vite for fast dev server and HMR; TypeScript for type safety
matching the config-analyzer domain; Tailwind for utility-first styling;
shadcn/ui for accessible, composable components that accelerate dashboard
development.

Alternatives considered:

- Next.js — unnecessary SSR for a single-page config dashboard
- CSS modules — more verbose than Tailwind for rapid prototyping

---

## Python venv location: `.devkit/`

**Date**: 2026-05-31
**Reason**: Distinct from the common `.venv/` name to avoid conflicts with
OpenCode-managed venvs and to signal this is a devkit-specific environment.

---

## Knowledge docs: `docs/knowledge/` (not root `knowledge/`)

**Date**: 2026-05-31
**Reason**: Per project spec; keeps all documentation under a single `docs/`
tree for simpler navigation and tooling.

---

## Changelog: `DONE.md` (not `CHANGELOG.md`)

**Date**: 2026-05-31
**Reason**: Simpler, session-oriented logging. Conventional `CHANGELOG.md` can
be added later if the project grows to need release-versioned changelogs.

---

## Python packaging: `pyproject.toml` (not `requirements.txt`)

**Date**: 2026-05-31
**Reason**: Single file for project metadata, dependencies (with dev groups via
`[project.optional-dependencies]`), and tool configs (ruff, mypy, pytest) —
replacing `setup.py`, `setup.cfg`, `requirements-dev.txt`, and separate tool
config files.

Alternatives considered:

- `requirements.txt` — flat list only, requires separate files for dev deps
  and tool configs; no project metadata support

---

## JS package manager: pnpm (not npm or yarn)

**Date**: 2026-05-31
**Reason**: Strict dependency resolution catches missing imports at install time;
content-addressable global store saves disk space (up to 10x); best-in-class
monorepo workspace support if the project grows.

Alternatives considered:

- npm — allows phantom dependencies and hoisting, less strict
- yarn — faster than classic npm but similar dependency resolution model

---

## Project layout: separate `backend/` and `frontend/` (not monorepo)

**Date**: 2026-05-31
**Reason**: Only two applications — a Python backend and a JS frontend.
Monorepo tools (Turborepo, Nx) add unnecessary complexity for this scale.
A thin root `package.json` with convenience scripts keeps things simple
while remaining easy to migrate to pnpm workspaces later.

Alternatives considered:

- Turborepo/Nx — powerful but heavy; requires JS-centric tooling that doesn't
  benefit the Python backend
- Full pnpm workspaces — overkill for two packages with different runtimes
