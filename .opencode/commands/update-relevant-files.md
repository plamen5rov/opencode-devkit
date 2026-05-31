---
description: Check that all project documentation files (AGENTS.md, README.md, TASKS.md, PHASES.md, TODO.md, DONE.md, ERRORS.md, DECISIONS.md) reflect the latest changes — audit and fix stale references.
---

# Update Relevant Files

After making code, config, or documentation changes, verify that all
project tracking files are up to date.

## Files to check

| File | What to verify |
| ---- | -------------- |
| `AGENTS.md` | Status line, key files table, conventions, dev commands |
| `README.md` | Overview, status, roadmap table, project structure, dependencies |
| `docs/project/TASKS.md` | Current phase tasks marked done/in-progress |
| `docs/project/PHASES.md` | Phase status, feature checklist |
| `docs/project/TODO.md` | Deferred items marked complete where applicable |
| `docs/project/DECISIONS.md` | New architecture decisions recorded |
| `docs/project/ERRORS.md` | Bugs fixed this session logged with root cause + lesson |
| `DONE.md` | Dated bullet for this batch of changes |

## Procedure

1. Read each file listed above (skip if unchanged by this session).
2. Identify stale or missing information.
3. Fix every stale reference — mark phases complete, add new files to
   structure trees, update status lines, record decisions and errors.
4. Run `npx markdownlint-cli2` on every changed `.md` file.
5. Commit the documentation updates separately or alongside the changes
   that triggered them.

## Rule

Documentation must never lag behind implementation. If you changed it in
code, reflect it in docs. If you made a decision, log it. If you fixed
a bug that took multiple attempts, log it in ERRORS.md.
