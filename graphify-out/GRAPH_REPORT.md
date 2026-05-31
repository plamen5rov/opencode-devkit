# Graph Report - .  (2026-05-31)

## Corpus Check
- Corpus is ~18,137 words - fits in a single context window. You may not need a graph.

## Summary
- 79 nodes · 106 edges · 11 communities detected
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.76)
- Token cost: 43,210 input · 9,328 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Structure & Phases|Project Structure & Phases]]
- [[_COMMUNITY_Agents & Runtime Config|Agents & Runtime Config]]
- [[_COMMUNITY_Documentation Conventions|Documentation Conventions]]
- [[_COMMUNITY_MCP & Custom Extensions|MCP & Custom Extensions]]
- [[_COMMUNITY_LSP & Code Formatters|LSP & Code Formatters]]
- [[_COMMUNITY_Permissions & Skills|Permissions & Skills]]
- [[_COMMUNITY_Instructions & Rules System|Instructions & Rules System]]
- [[_COMMUNITY_ACP & Editor Support|ACP & Editor Support]]
- [[_COMMUNITY_Built-in Tools & Search|Built-in Tools & Search]]
- [[_COMMUNITY_Isolated Decisions|Isolated Decisions]]
- [[_COMMUNITY_Isolated Sessions|Isolated Sessions]]

## God Nodes (most connected - your core abstractions)
1. `OpenCode Config System` - 29 edges
2. `OpenCode DevKit` - 21 edges
3. `AGENTS.md (Project)` - 10 edges
4. `Phase I — Initialization` - 7 edges
5. `Tool/Command/MCP Analyzer` - 6 edges
6. `Skill Analyzer & Maker` - 5 edges
7. `Dashboard Homescreen` - 5 edges
8. `AGENTS.md Rules System (OpenCode)` - 5 edges
9. `MCP Server System` - 5 edges
10. `Document Sync Convention` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md (Project)` --semantically_similar_to--> `AGENTS.md Rules System (OpenCode)`  [INFERRED] [semantically similar]
  AGENTS.md → knowledge/rules.md
- `DONE.md Change Log` --semantically_similar_to--> `CHANGELOG.md`  [INFERRED] [semantically similar]
  DONE.md → docs/project/additional-files.md
- `opencode.json (Project)` --instance_of--> `OpenCode Config System`  [INFERRED]
  AGENTS.md → knowledge/config-main.md
- `Plan Agent (Primary)` --conceptually_related_to--> `Skill Analyzer & Maker`  [INFERRED]
  knowledge/agents-config.md → docs/project/OpenCode-DevKit-Project.md
- `Phase II — JSON Config Implementation` --depends_on--> `OpenCode Config System`  [INFERRED]
  docs/project/OpenCode-DevKit-Project.md → knowledge/config-main.md

## Hyperedges (group relationships)
- **OpenCode integrates with ACP-compatible editors** — acp, zed_editor, jetbrains_ides [EXTRACTED 1.00]
- **Phase I scaffold creates core project resources** — phase_i_initialization, python_venv, knowledge_directory, docs_library_directory, agents_md_project, opencode_json_project [EXTRACTED 1.00]
- **OpenCode Config System governs all extension subsystems** — opencode_config_system, mcp_system, lsp_system, formatter_system, custom_commands, custom_tools_system, agent_skills_system [EXTRACTED 1.00]

## Communities

### Community 0 - "Project Structure & Phases"
Cohesion: 0.19
Nodes (16): Dashboard Homescreen, docs/library/ Directory, docs/project/ Directory, FastAPI, JSON Config Analyzer, knowledge/ Directory, OpenCode DevKit, opencode.json (Project) (+8 more)

### Community 1 - "Agents & Runtime Config"
Cohesion: 0.13
Nodes (16): Build Agent (Primary), Explore Agent (Subagent), General Agent (Subagent), Scout Agent (Subagent), AI SDK, Context Compaction System, Config Precedence Order, Config Variable Substitution ({env:}, {file:}) (+8 more)

### Community 2 - "Documentation Conventions"
Cohesion: 0.21
Nodes (11): AGENTS.md (Project), Ask, Don't Guess Convention, CHANGELOG.md, Document Sync Convention, DONE.md Change Log, done-md-logger Skill, github-commit Skill, markdown-lint Skill (+3 more)

### Community 3 - "MCP & Custom Extensions"
Cohesion: 0.2
Nodes (10): Context7 MCP Server, Custom Slash Commands, Custom Tools System, Grep by Vercel MCP, MCP Server System, Phase IV — Tool Analyzer, Sentry MCP Server, Tool/Command/MCP Analyzer (+2 more)

### Community 4 - "LSP & Code Formatters"
Cohesion: 0.29
Nodes (7): Formatter System, Pyright LSP, LSP Server System, TypeScript LSP, Prettier Formatter, Ruff Formatter, TypeScript

### Community 5 - "Permissions & Skills"
Cohesion: 0.33
Nodes (6): Plan Agent (Primary), Agent Skills System (SKILL.md), Permission System, Phase III — Skill Analyzer, Skill Analyzer & Maker, Skill Permissions

### Community 6 - "Instructions & Rules System"
Cohesion: 0.5
Nodes (4): AGENTS.md Rules System (OpenCode), Claude Code Compatibility, Custom Instructions (instructions field), /init Command

### Community 7 - "ACP & Editor Support"
Cohesion: 0.67
Nodes (3): Agent Client Protocol (ACP), JetBrains IDEs, Zed Editor

### Community 8 - "Built-in Tools & Search"
Cohesion: 0.67
Nodes (3): Built-in Tools (bash, edit, write, read, grep, glob, etc.), Exa AI Web Search, ripgrep

### Community 9 - "Isolated Decisions"
Cohesion: 1.0
Nodes (1): DECISIONS.md

### Community 10 - "Isolated Sessions"
Cohesion: 1.0
Nodes (1): SESSION.md

## Knowledge Gaps
- **35 isolated node(s):** `Vite`, `Tailwind CSS`, `shadcn/ui`, `docs/project/ Directory`, `markdown-lint Skill` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Isolated Decisions`** (1 nodes): `DECISIONS.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Isolated Sessions`** (1 nodes): `SESSION.md`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `OpenCode Config System` connect `Agents & Runtime Config` to `Project Structure & Phases`, `Documentation Conventions`, `MCP & Custom Extensions`, `LSP & Code Formatters`, `Permissions & Skills`, `Instructions & Rules System`, `ACP & Editor Support`, `Built-in Tools & Search`?**
  _High betweenness centrality (0.625) - this node is a cross-community bridge._
- **Why does `OpenCode DevKit` connect `Project Structure & Phases` to `Documentation Conventions`, `MCP & Custom Extensions`, `LSP & Code Formatters`, `Permissions & Skills`?**
  _High betweenness centrality (0.337) - this node is a cross-community bridge._
- **Why does `AGENTS.md (Project)` connect `Documentation Conventions` to `Project Structure & Phases`, `Instructions & Rules System`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `OpenCode Config System` (e.g. with `Phase II — JSON Config Implementation` and `opencode.json (Project)`) actually correct?**
  _`OpenCode Config System` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Vite`, `Tailwind CSS`, `shadcn/ui` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Agents & Runtime Config` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._