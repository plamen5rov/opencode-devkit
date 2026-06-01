import type { MCPServerReport } from "@/types/phase4"

const SECRET_PATTERNS = ["password", "passwd", "secret", "api_key", "apikey", "token", "credential", "private_key"]

function hasHardcodedSecrets(obj: Record<string, unknown>): boolean {
  for (const [k, v] of Object.entries(obj)) {
    const kl = k.toLowerCase()
    if (SECRET_PATTERNS.some((p) => kl.includes(p))) return true
    if (typeof v === "string") {
      const vl = v.toLowerCase()
      if (vl.startsWith("{env:")) continue
      if (v.length > 20 && SECRET_PATTERNS.some((p) => kl.includes(p))) return true
    }
  }
  return false
}

function checkEnvForSecrets(env: Record<string, unknown> | null): string[] {
  const issues: string[] = []
  if (!env) return issues
  for (const [k, v] of Object.entries(env)) {
    const vs = String(v)
    if (vs.startsWith("{env:")) continue
    if (vs.length > 20 || ["token", "secret", "password", "key", "credential"].some((p) => k.toLowerCase().includes(p))) {
      issues.push(`Environment variable '${k}' may contain a hardcoded secret. Use \${env:NAME} instead`)
    }
  }
  return issues
}

export function analyzeMCPServers(mcpConfig: Record<string, unknown> | null): {
  servers: MCPServerReport[]
  overallScore: number
} {
  if (!mcpConfig || typeof mcpConfig !== "object") return { servers: [], overallScore: 0 }

  const servers: MCPServerReport[] = []

  for (const [name, config] of Object.entries(mcpConfig)) {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      servers.push({
        name,
        type: null,
        type_valid: false,
        has_command: false,
        has_url: false,
        has_enabled: false,
        security_issues: [],
        config_issues: ["Server config must be an object"],
        score: 0,
      })
      continue
    }

    const cfg = config as Record<string, unknown>
    const report: MCPServerReport = {
      name,
      type: null,
      type_valid: false,
      has_command: false,
      has_url: false,
      has_enabled: false,
      security_issues: [],
      config_issues: [],
      score: 0,
    }
    const configIssues: string[] = []
    const securityIssues: string[] = []

    const serverType = cfg.type
    report.type = typeof serverType === "string" ? serverType : null

    if (serverType === "local") {
      report.type_valid = true
      const cmd = cfg.command
      if (Array.isArray(cmd) && cmd.length > 0) {
        report.has_command = true
      } else {
        configIssues.push("Local MCP server requires a 'command' array")
      }

      const env = cfg.environment
      if (env && typeof env === "object" && !Array.isArray(env)) {
        securityIssues.push(...checkEnvForSecrets(env as Record<string, unknown>))
      } else if (env !== undefined && env !== null) {
        configIssues.push("'environment' must be an object if present")
      }
    } else if (serverType === "remote") {
      report.type_valid = true
      const url = cfg.url
      if (typeof url === "string" && url.length > 0) {
        report.has_url = true
      } else {
        configIssues.push("Remote MCP server requires a 'url' string")
      }

      const headers = cfg.headers
      if (headers && typeof headers === "object" && !Array.isArray(headers)) {
        if (hasHardcodedSecrets(headers as Record<string, unknown>)) {
          securityIssues.push("Headers may contain hardcoded secrets. Use ${env:NAME} for sensitive values")
        }
      } else if (headers !== undefined && headers !== null) {
        configIssues.push("'headers' must be an object if present")
      }

      const oauth = cfg.oauth
      if (oauth && typeof oauth === "object" && !Array.isArray(oauth) && hasHardcodedSecrets(oauth as Record<string, unknown>)) {
        securityIssues.push("OAuth config may contain hardcoded secrets. Use ${env:NAME} for clientSecret")
      }
    } else {
      if (serverType === undefined || serverType === null) {
        configIssues.push("Missing required field 'type' (must be 'local' or 'remote')")
      } else {
        configIssues.push(`Unknown MCP type '${String(serverType)}' (must be 'local' or 'remote')`)
      }
    }

    if ("enabled" in cfg) {
      report.has_enabled = true
    } else {
      configIssues.push("Missing 'enabled' field — set to true/false explicitly for clarity")
    }

    const timeout = cfg.timeout
    if (timeout !== undefined && timeout !== null && (typeof timeout !== "number" || timeout <= 0)) {
      configIssues.push("'timeout' must be a positive number (ms)")
    }

    let score = 0
    if (report.type_valid) score += 25
    if (report.has_command || report.has_url) score += 25
    if (report.has_enabled) score += 25
    if (securityIssues.length === 0) {
      score += 25
    } else {
      score += 25
      score -= Math.min(securityIssues.length * 10, 25)
    }
    score = Math.max(0, Math.min(100, score))

    report.config_issues = configIssues
    report.security_issues = securityIssues
    report.score = score

    servers.push(report)
  }

  const overallScore = servers.length > 0
    ? Math.round(servers.reduce((sum, s) => sum + (s.score ?? 0), 0) / servers.length)
    : 0

  return { servers, overallScore }
}
