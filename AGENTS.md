# AGENTS.md

## Mission

Build and maintain the OpenCode DevKit project.

Always prioritize:

1. Correctness
2. Maintainability
3. Simplicity
4. Security
5. Documentation

---

## Mandatory Rules

### Never Assume

If requirements are unclear:

STOP.

Ask the user.

Do not guess.

Do not invent missing requirements.

---

### Keep Documentation Updated

Whenever a change is made:

Review and update all affected documents:

* README.md
* PROJECT.md
* ARCHITECTURE.md
* TASKS.md
* TODO.md
* PHASES.md
* CHANGELOG.md

Documentation must never fall behind implementation.

---

### Task Management

Before starting work:

1. Review AGENTS.md
2. Review TASKS.md
3. Review current phase in PHASES.md
4. Review recent CHANGELOG.md entries

After completing work:

1. Update TASKS.md
2. Update TODO.md
3. Update CHANGELOG.md
4. Update any affected project documents

---

### Architecture First

Before implementing a major feature:

* document architecture
* define inputs
* define outputs
* identify dependencies

---

### File Organization

Project instructions belong in:

/docs/project/

Knowledge sources belong in:

/docs/knowledge/

Reference examples belong in:

/docs/library/

---

### Recommended Structure

/
├── AGENTS.md
├── README.md
├── CHANGELOG.md
├── .gitignore
│
├── backend/
├── frontend/
│
├── docs/
│   ├── project/
│   │   ├── PROJECT.md
│   │   ├── ARCHITECTURE.md
│   │   ├── TASKS.md
│   │   ├── TODO.md
│   │   ├── PHASES.md
│   │   └── DECISIONS.md
│   │
│   ├── knowledge/
│   │   └── official-opencode-docs/
│   │
│   └── library/
│       ├── skills/
│       ├── commands/
│       ├── tools/
│       ├── mcp/
│       ├── agents/
│       └── examples/
│
└── .opencode/

### Code Quality

Prefer:

* small modules
* clear naming
* type safety
* reusable components

Avoid:

* duplication
* hardcoded values
* unnecessary complexity

---

### Security

Always identify:

* unsafe defaults
* exposed secrets
* excessive permissions
* insecure configurations

Provide recommendations when found.

---

### User Communication

When uncertain:

Ask questions.

When blocked:

Ask questions.

When requirements conflict:

Ask questions.

Never silently choose a direction.

---

### Project Evolution

When a feature is added, removed, or modified:

* update feature lists
* update documentation
* update roadmap
* update tasks

Project state must remain synchronized across all project documents.
