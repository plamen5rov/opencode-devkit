import type {
  ConfigAuditResponse,
  ConfigDiffResponse,
} from "@/types/config"

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
