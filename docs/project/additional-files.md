# Additional Files Worth Adding

## CHANGELOG.md

Separate file.

Purpose:

session-by-session changes
easy review of progress
context recovery after long pauses

Example:

``` markdown
# CHANGELOG

## 2026-05-31

### Added

- Initial FastAPI setup
- React frontend scaffold

### Modified

- AGENTS.md

### Removed

- obsolete prototype files
```

## PHASES.md

Separate file.

Purpose:

Long-term roadmap.

Example:

``` markdown
Phase I - Project Initialization
Phase II - JSON Config Analyzer
Phase III - Skill Analyzer
Phase IV - Tool Analyzer
Phase V - Dashboard Metrics
```

## DECISIONS.md

Very useful.

Many AI coding projects fail because the model forgets why something was chosen.

Example:

``` markdown
# Decisions

## Backend

Chosen: FastAPI

Reason:
- strong typing
- API-first
- async support

Date:
2026-05-31
```

This becomes extremely valuable after a few months.

## SESSION.md

Optional but powerful.

Current focus only.

Example:

``` markdown
Current Goal:
Implement JSON Config Analyzer

Current Branch:
feature/json-analyzer

Blocked By:
Need schema definition
```

Think of it as a short-term memory file.
