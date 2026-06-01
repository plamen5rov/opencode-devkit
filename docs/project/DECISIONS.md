# DECISIONS.md

Architecture decisions and rationale. Each entry records *what* was chosen,
*why*, and *when* — so context survives across sessions and contributors.

---

## Client-side only (no backend)

**Date**: 2026-06-01
**Reason**: All analyzers are deterministic computation — no database, no
secrets, no external API calls needed. Moving everything client-side eliminates:

- A server to host and maintain
- CORS configuration
- Vite API proxy
- Dual-language tooling (Python + TypeScript)
- Virtual environment management

The .git history retains the original FastAPI backend code.

**Result**: Pure static site deployable to GitHub Pages via `pnpm run build`.

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

## JS package manager: pnpm (not npm or yarn)

**Date**: 2026-05-31
**Reason**: Strict dependency resolution catches missing imports at install time;
content-addressable global store saves disk space (up to 10x); best-in-class
monorepo workspace support if the project grows.

Alternatives considered:

- npm — allows phantom dependencies and hoisting, less strict
- yarn — faster than classic npm but similar dependency resolution model

---

## Changelog: `DONE.md` (not `CHANGELOG.md`)

**Date**: 2026-05-31
**Reason**: Simpler, session-oriented logging. Conventional `CHANGELOG.md` can
be added later if the project grows to need release-versioned changelogs.

---

## Knowledge docs: `docs/knowledge/` (not root `knowledge/`)

**Date**: 2026-05-31
**Reason**: Per project spec; keeps all documentation under a single `docs/`
tree for simpler navigation and tooling.

---

## Historical: Python decisions (FastAPI, pyproject.toml, venv)

These decisions were made during Phases I-V when the project had a FastAPI
backend. The backend was removed in Phase VI (2026-06-01) in favor of a
client-side-only architecture. The following are kept for historical context:

- **FastAPI** (2026-05-31): Strong typing (Pydantic), API-first design, async
  support. Chosen because the project was originally a full-stack app. Removed
  when the deterministic nature of all analyzers made a server unnecessary.

- **pyproject.toml** (2026-05-31): Single file for project metadata,
  dependencies, and tool configs. Superseded by `package.json` after migration.

- **venv location `.devkit/`** (2026-05-31): Distinct from `.venv/` to avoid
  conflicts. Removed along with the Python backend.

- **Separate `backend/` and `frontend/` layout** (2026-05-31): Kept Python
  and JS independent. Simplified to a single frontend directory in Phase VI.
