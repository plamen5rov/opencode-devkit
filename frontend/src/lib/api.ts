import type {
  ConfigAuditResponse,
  ConfigDiffResponse,
} from "@/types/config"
import type { SkillAnalyzeResponse, SkillTemplateResponse } from "@/types/skill"

export async function auditConfig(raw: string): Promise<ConfigAuditResponse> {
  const res = await fetch("/api/config/audit", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: raw,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Audit failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function diffConfig(
  original: Record<string, unknown>,
  modified: Record<string, unknown>,
): Promise<ConfigDiffResponse> {
  const res = await fetch("/api/config/diff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ original, modified }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Diff failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function analyzeSkill(
  content: string,
  filename: string = "SKILL.md",
): Promise<SkillAnalyzeResponse> {
  const formData = new FormData()
  formData.append("content", content)
  formData.append("filename", filename)
  const res = await fetch("/api/skill/analyze", {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Skill analysis failed: ${res.status} ${text}`)
  }
  return res.json()
}

export async function getSkillTemplates(): Promise<SkillTemplateResponse> {
  const res = await fetch("/api/skill/templates")
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch templates: ${res.status} ${text}`)
  }
  return res.json()
}
