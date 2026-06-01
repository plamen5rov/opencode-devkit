import type { ToolPermissionReport } from "@/types/phase4"

const BUILT_IN_TOOLS = new Set(["bash", "edit", "write", "read", "glob", "grep", "webfetch", "websearch", "skill", "todowrite", "question", "lsp", "apply_patch", "task"])
const SECURITY_SENSITIVE_TOOLS = new Set(["bash", "edit", "write", "apply_patch", "webfetch"])
const PERMISSION_VALUES = new Set(["allow", "ask", "deny"])

export function analyzeTools(permissions: Record<string, unknown> | null): {
  tools: ToolPermissionReport[]
  missingCritical: string[]
  overallScore: number
} {
  if (!permissions || typeof permissions !== "object") {
    return { tools: [], missingCritical: [], overallScore: 0 }
  }

  const tools: ToolPermissionReport[] = []

  for (const [key, value] of Object.entries(permissions)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      tools.push({
        tool_name: key,
        permission: null,
        is_wildcard: key.includes("*"),
        is_security_sensitive: key === "bash" || SECURITY_SENSITIVE_TOOLS.has(key),
        recommendation: "Sub-permission rules detected — review individual entries",
      })
      continue
    }

    const perm = typeof value === "string" ? value : null
    const isWildcard = key.includes("*")
    const isSensitive = SECURITY_SENSITIVE_TOOLS.has(key) || (BUILT_IN_TOOLS.has(key) && key.startsWith("bash"))

    let recommendation: string | null = null
    if (perm && !PERMISSION_VALUES.has(perm)) {
      recommendation = `'${perm}' is not a valid permission (use allow/ask/deny)`
    } else if (isSensitive && perm === "allow") {
      recommendation = `'${key}' is security-sensitive — consider changing to 'ask'`
    } else if (isSensitive && perm === null) {
      recommendation = `'${key}' is security-sensitive — add an explicit permission`
    }

    tools.push({
      tool_name: key,
      permission: perm && PERMISSION_VALUES.has(perm) ? perm : perm,
      is_wildcard: isWildcard,
      is_security_sensitive: isSensitive,
      recommendation,
    })
  }

  const covered = new Set(tools.map((t) => t.tool_name))
  const missingCritical: string[] = []
  for (const tool of [...SECURITY_SENSITIVE_TOOLS].sort()) {
    const coveredByWildcard = [...covered].some((name) => name.endsWith("*") && tool.startsWith(name.slice(0, -1)))
    if (!covered.has(tool) && !coveredByWildcard) missingCritical.push(tool)
  }

  const overallScore = tools.length > 0
    ? Math.max(0, 100 - missingCritical.length * 20 - tools.filter((t) => t.recommendation && t.recommendation.includes("not a valid permission")).length * 15)
    : 0

  return { tools, missingCritical, overallScore }
}
