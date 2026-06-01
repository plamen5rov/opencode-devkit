export interface FeatureInfo {
  id: string
  label: string
  icon: string
  description: string
  implemented: boolean
  phase: string
}

export interface PhaseInfo {
  name: string
  status: string
  description: string
  features: string[]
}

export const FEATURES: FeatureInfo[] = [
  {
    id: "json-config",
    label: "JSON Config",
    icon: "FileJson",
    description: "Audit opencode.json for security risks, missing settings, and optimization opportunities with full schema validation.",
    implemented: true,
    phase: "II",
  },
  {
    id: "skill-analyzer",
    label: "Skill Analyzer",
    icon: "Wand2",
    description: "Analyze SKILL.md files for completeness, validate frontmatter, and browse built-in skill templates for scaffolding new skills.",
    implemented: true,
    phase: "III",
  },
  {
    id: "command-analyzer",
    label: "Command Analyzer",
    icon: "Terminal",
    description: "Validate slash-command .md frontmatter, detect argument/shell/file references, and score content quality.",
    implemented: true,
    phase: "IV",
  },
  {
    id: "mcp-analyzer",
    label: "MCP Analyzer",
    icon: "Activity",
    description: "Audit MCP server configurations for type validity, required fields, and hardcoded secrets in environment/headers/OAuth.",
    implemented: true,
    phase: "IV",
  },
  {
    id: "tool-analyzer",
    label: "Tool Analyzer",
    icon: "Puzzle",
    description: "Audit tool permission rules, flag security-sensitive tools, and detect missing critical permissions.",
    implemented: true,
    phase: "IV",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    description: "Unified homescreen with metrics summary, feature implementation grid, and roadmap view.",
    implemented: true,
    phase: "V",
  },
]

export const PHASES: PhaseInfo[] = [
  {
    name: "Phase I — Initialization",
    status: "complete",
    description: "Scaffold the project: directory structure, virtual environment, package installation, FastAPI backend, React frontend, dev pipeline, documentation.",
    features: ["—"],
  },
  {
    name: "Phase II — JSON Config Analyzer",
    status: "complete",
    description: "Upload/paste opencode.json, get security audits (7 rules), missing settings (7 checks), optimization suggestions (3 rules), recursive diff, schema validation.",
    features: ["json-config"],
  },
  {
    name: "Phase III — Skill Analyzer & Maker",
    status: "complete",
    description: "Analyze SKILL.md files for YAML frontmatter validity, content quality, file structure checks, and browse 5 built-in skill templates.",
    features: ["skill-analyzer"],
  },
  {
    name: "Phase IV — Tool, Command, MCP Analyzers",
    status: "complete",
    description: "Command frontmatter validation, MCP server config auditing with secret detection, tool permission auditing with security-sensitive flagging.",
    features: ["command-analyzer", "mcp-analyzer", "tool-analyzer"],
  },
  {
    name: "Phase V — Dashboard",
    status: "complete",
    description: "Unified homescreen with metrics summary cards, feature implementation grid, phase roadmap timeline.",
    features: ["dashboard"],
  },
]
