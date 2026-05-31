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

## ERRORS.md

Very useful.

AI coding agents make mistakes. Without an error log, the same mistakes get
repeated across sessions because the model has no memory of what went wrong
before.

Each entry records:

- Date
- Symptom (what the user saw)
- Root cause (why it happened)
- Fix applied (what resolved it)
- Lesson learned (how to prevent recurrence)

Example:

```markdown
## 2026-05-31 — Regex comment stripper ate `//` in URLs

- **Symptom**: Configs with `$schema` URLs produced parse errors
- **Root cause**: `re.sub(r"//.*", "", text)` treated `://` as a comment
- **Fix**: State-machine parser that tracks string context
- **Lesson**: Never use flat regex for structured formats
```

This is mandatory for bugs that take multiple attempts to fix.
