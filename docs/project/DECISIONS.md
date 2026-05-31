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
