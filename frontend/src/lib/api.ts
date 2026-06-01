import { auditConfig, computeDiff } from "@/lib/services/config-analyzer"
import { analyzeSkill, getTemplates } from "@/lib/services/skill-analyzer"
import { analyzeCommand } from "@/lib/services/command-analyzer"
import { analyzeMCPServers } from "@/lib/services/mcp-analyzer"
import { analyzeTools as doAnalyzeTools } from "@/lib/services/tool-analyzer"
import { FEATURES, PHASES } from "@/lib/data/features"
import type { ConfigDiffResult } from "@/types/config"
import type { SkillTemplate } from "@/types/skill"
import type { MCPServerReport, ToolPermissionReport } from "@/types/phase4"
import type { DashboardResponse } from "@/types/dashboard"

export { auditConfig }

export function diffConfig(
  original: Record<string, unknown>,
  modified: Record<string, unknown>,
): ConfigDiffResult {
  return computeDiff(original, modified)
}

export { analyzeSkill }

export function getSkillTemplates(): SkillTemplate[] {
  return getTemplates()
}

export { analyzeCommand }

export function analyzeMCP(configJson: string): {
  servers: MCPServerReport[]
  overallScore: number
  serverCount: number
} {
  let mcpConfig: Record<string, unknown> | null = null
  try {
    const parsed = JSON.parse(configJson) as Record<string, unknown>
    if (parsed.mcp && typeof parsed.mcp === "object" && !Array.isArray(parsed.mcp)) {
      mcpConfig = parsed.mcp as Record<string, unknown>
    } else if (
      Object.values(parsed).some(
        (v) => v && typeof v === "object" && !Array.isArray(v) && typeof (v as Record<string, unknown>).type === "string",
      )
    ) {
      mcpConfig = parsed
    }
  } catch { /* parse failure handled by caller */ }
  const { servers, overallScore } = analyzeMCPServers(mcpConfig)
  return { servers, overallScore, serverCount: servers.length }
}

export function analyzeTools(configJson: string): {
  tools: ToolPermissionReport[]
  missingCritical: string[]
  overallScore: number
} {
  let permissions: Record<string, unknown> | null = null
  try {
    const parsed = JSON.parse(configJson) as Record<string, unknown>
    if (parsed.permission && typeof parsed.permission === "object" && !Array.isArray(parsed.permission)) {
      permissions = parsed.permission as Record<string, unknown>
    } else if (typeof parsed.bash === "string") {
      permissions = parsed
    }
  } catch { /* parse failure handled by caller */ }
  const { tools, missingCritical, overallScore } = doAnalyzeTools(permissions)
  return { tools, missingCritical, overallScore }
}

export function getDashboard(): DashboardResponse {
  return {
    title: "OpenCode DevKit",
    version: "0.1.0",
    total_features: FEATURES.length,
    implemented_features: FEATURES.filter((f) => f.implemented).length,
    completed_phases: PHASES.filter((p) => p.status === "complete").length,
    total_phases: PHASES.length,
    features: FEATURES,
    phases: PHASES,
  }
}
