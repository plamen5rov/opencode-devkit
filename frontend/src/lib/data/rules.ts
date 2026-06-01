import type { SecurityIssue, MissingSetting } from "@/types/config"

export interface SecurityRule {
  check: (config: Record<string, unknown>) => boolean
  issue: SecurityIssue
}

export interface RecommendedSettingRule {
  check: (config: Record<string, unknown>) => boolean
  setting: MissingSetting
}

export interface OptimizationRule {
  check: (config: Record<string, unknown>) => boolean
  recommendation: {
    setting: string
    recommended: unknown
    reason: string
  }
}

function bashIsAllowAll(config: Record<string, unknown>): boolean {
  const perm = config.permission as Record<string, unknown> | undefined
  if (perm && typeof perm.bash === "object" && perm.bash !== null) {
    const bash = perm.bash as Record<string, unknown>
    return bash["*"] === "allow"
  }
  return false
}

function hasApiKeysInConfig(config: Record<string, unknown>): boolean {
  const providers = config.provider as Record<string, unknown> | undefined
  if (!providers || typeof providers !== "object") return false
  for (const cfg of Object.values(providers)) {
    if (cfg && typeof cfg === "object") {
      const options = (cfg as Record<string, unknown>).options as Record<string, unknown> | undefined
      if (options && typeof options.apiKey === "string") return true
    }
  }
  return false
}

export const SECURITY_RULES: SecurityRule[] = [
  {
    check: (c) => !c.permission,
    issue: {
      severity: "high",
      setting: "permission",
      title: "No permission rules configured",
      description:
        "Without a permission config, OpenCode defaults to allowing all tool operations. Any agent can run shell commands, edit files, and make network requests without approval.",
      remediation: 'Add a "permission" section with at minimum a catch-all "ask" rule:\n"permission": {"*": "ask"}',
      learn_more_url: "https://opencode.ai/docs/permissions",
    },
  },
  {
    check: (c) => {
      const perm = c.permission
      return perm === "allow" || (typeof perm === "object" && perm !== null && (perm as Record<string, unknown>)["*"] === "allow")
    },
    issue: {
      severity: "critical",
      setting: "permission.*",
      title: "All permissions set to 'allow'",
      description:
        "Setting all permissions to 'allow' means any tool can run without approval. This is equivalent to having no permission config at all, leaving the system vulnerable to malicious or accidental destructive operations.",
      remediation: "Change the catch-all rule to 'ask' and whitelist only trusted commands:\n\"permission\": {\"*\": \"ask\", \"bash\": {\"*\": \"ask\", \"git *\": \"allow\"}}",
      learn_more_url: "https://opencode.ai/docs/permissions",
    },
  },
  {
    check: bashIsAllowAll,
    issue: {
      severity: "critical",
      setting: "permission.bash",
      title: "Bash tool allows all commands",
      description:
        "When the bash permission allows all commands, an agent can execute arbitrary shell commands including destructive operations like 'rm -rf', 'curl | sh', or credential exfiltration.",
      remediation: "Restrict bash to specific safe commands:\n\"permission\": {\"bash\": {\"*\": \"ask\", \"git *\": \"allow\", \"npm *\": \"allow\"}}",
      learn_more_url: "https://opencode.ai/docs/permissions#granular-rules-object-syntax",
    },
  },
  {
    check: (c) => c.share === "auto",
    issue: {
      severity: "medium",
      setting: "share",
      title: "Auto-sharing conversations enabled",
      description:
        "Auto-sharing sends every new conversation to a web URL. This may inadvertently expose sensitive code, credentials, or internal discussions.",
      remediation: 'Change to "manual" (share only when explicitly asked) or "disabled":\n"share": "manual"',
      learn_more_url: "https://opencode.ai/docs/share",
    },
  },
  {
    check: (c) => c.autoupdate === true,
    issue: {
      severity: "medium",
      setting: "autoupdate",
      title: "Automatic updates enabled",
      description:
        "OpenCode will download and apply updates automatically on startup. In controlled environments, unvetted updates may introduce breaking changes or unapproved functionality.",
      remediation: 'Use "notify" to receive update notifications without auto-install:\n"autoupdate": "notify"',
      learn_more_url: "https://opencode.ai/docs/config#autoupdate",
    },
  },
  {
    check: (c) => c.snapshot === false,
    issue: {
      severity: "low",
      setting: "snapshot",
      title: "Snapshots disabled",
      description:
        "Without snapshots, file changes made by agents cannot be rolled back within the session. A buggy or malicious agent could permanently damage project files with no undo option.",
      remediation: 'Enable snapshots (the default) or explicitly set:\n"snapshot": true',
      learn_more_url: "https://opencode.ai/docs/config#snapshot",
    },
  },
  {
    check: hasApiKeysInConfig,
    issue: {
      severity: "critical",
      setting: "provider.*.options.apiKey",
      title: "API keys hardcoded in config",
      description:
        "Hardcoding API keys in your opencode.json is dangerous — if committed to a public repo, anyone can use your credentials to make API calls on your behalf and accrue charges.",
      remediation: 'Use environment variable substitution instead:\n"apiKey": "{env:ANTHROPIC_API_KEY}"',
      learn_more_url: "https://opencode.ai/docs/config#env-vars",
    },
  },
  {
    check: (c) => {
      if (!c.mcp || typeof c.mcp !== "object") return false
      for (const v of Object.values(c.mcp as Record<string, unknown>)) {
        if (v && typeof v === "object" && (v as Record<string, unknown>).type === "remote" && (v as Record<string, unknown>).enabled !== false) return true
      }
      return false
    },
    issue: {
      severity: "medium",
      setting: "mcp.*.enabled",
      title: "Remote MCP servers enabled",
      description:
        "Remote MCP servers connect to external services that may have access to sensitive data or operations. Ensure each enabled server is trusted and needed.",
      remediation: "Review enabled MCP servers and disable any that are not necessary. Set enabled: false for unused servers.",
      learn_more_url: "https://opencode.ai/docs/mcp-servers",
    },
  },
]

export const RECOMMENDED_SETTINGS: RecommendedSettingRule[] = [
  {
    check: (c) => !c.model,
    setting: {
      severity: "recommended",
      setting: "model",
      title: "No primary model configured",
      description:
        "Specifying a model ensures consistent behavior across sessions. Without it, OpenCode falls back to its default, which may change across versions.",
      example: '"model": "anthropic/claude-sonnet-4-5"',
      learn_more_url: "https://opencode.ai/docs/config#models",
    },
  },
  {
    check: (c) => !c.small_model,
    setting: {
      severity: "optional",
      setting: "small_model",
      title: "No small model configured",
      description:
        "A small model handles lightweight tasks like title generation, reducing cost and latency for simple operations.",
      example: '"small_model": "anthropic/claude-haiku-4-5"',
      learn_more_url: "https://opencode.ai/docs/config#models",
    },
  },
  {
    check: (c) => !c.instructions,
    setting: {
      severity: "recommended",
      setting: "instructions",
      title: "No instructions configured",
      description:
        "Instructions files (AGENTS.md, CONTRIBUTING.md) give the model project-specific context, conventions, and rules. Without them, agents work with generic guidance only.",
      example: '"instructions": ["AGENTS.md", "CONTRIBUTING.md"]',
      learn_more_url: "https://opencode.ai/docs/config#instructions",
    },
  },
  {
    check: (c) => !c.permission,
    setting: {
      severity: "recommended",
      setting: "permission",
      title: "No permission rules configured",
      description:
        "Permission rules let you control which tools agents can use and when they need approval. The default is permissive — better to define explicit boundaries.",
      example: '"permission": {"*": "ask", "bash": {"*": "ask", "git *": "allow"}}',
      learn_more_url: "https://opencode.ai/docs/permissions",
    },
  },
  {
    check: (c) => !c.compaction,
    setting: {
      severity: "optional",
      setting: "compaction",
      title: "No compaction settings configured",
      description:
        "Compaction controls how context is managed when the token limit is reached. Tuning these can improve performance in long sessions.",
      example: '"compaction": {"auto": true, "prune": true, "reserved": 10000}',
      learn_more_url: "https://opencode.ai/docs/config#compaction",
    },
  },
  {
    check: (c) => !c.watcher,
    setting: {
      severity: "optional",
      setting: "watcher",
      title: "No watcher ignore patterns configured",
      description:
        "The file watcher monitors project files for changes. Excluding noisy directories like node_modules/ reduces CPU usage.",
      example: '"watcher": {"ignore": ["node_modules/**", "dist/**", ".git/**"]}',
      learn_more_url: "https://opencode.ai/docs/config#watcher",
    },
  },
  {
    check: (c) => !c.server,
    setting: {
      severity: "optional",
      setting: "server",
      title: "No server config",
      description:
        "If you use 'opencode serve' or 'opencode web', configuring server settings (port, CORS, mDNS) is important for correct operation.",
      example: '"server": {"port": 4096, "cors": ["http://localhost:5173"]}',
      learn_more_url: "https://opencode.ai/docs/config#server",
    },
  },
]

export const OPTIMIZATIONS: OptimizationRule[] = [
  {
    check: (c) => c.autoupdate === true,
    recommendation: {
      setting: "autoupdate",
      recommended: "notify",
      reason: "Use notify instead of true to receive update alerts without automatic installs",
    },
  },
  {
    check: (c) => {
      const perm = c.permission
      return perm !== null && typeof perm === "object" && Object.keys(perm as Record<string, unknown>).length === 0
    },
    recommendation: {
      setting: "permission",
      recommended: { "*": "ask" },
      reason: "Add explicit permission defaults for safety",
    },
  },
  {
    check: (c) => {
      const schema = c.$schema
      if (schema == null) return true
      return typeof schema === "string" && schema.endsWith("/config.json")
    },
    recommendation: {
      setting: "$schema",
      recommended: "https://opencode.ai/config.json",
      reason: "Adding $schema enables IDE validation and autocompletion",
    },
  },
]
