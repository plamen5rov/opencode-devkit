const STORAGE_KEY = "odk-activity-log"
const MAX_ENTRIES = 50

export interface ActivityEntry {
  id: string
  type: "config" | "skill" | "command" | "mcp" | "tool"
  message: string
  timestamp: string
}

export function getActivityLog(): ActivityEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ActivityEntry[]
  } catch {
    return []
  }
}

export function logActivity(type: ActivityEntry["type"], message: string): void {
  try {
    const entries = getActivityLog()
    entries.unshift({
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date().toISOString(),
    })
    if (entries.length > MAX_ENTRIES) entries.length = MAX_ENTRIES
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    /* storage may be unavailable */
  }
}

export function clearActivityLog(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export const ACTIVITY_LABELS: Record<ActivityEntry["type"], string> = {
  config: "JSON Config",
  skill: "Skill",
  command: "Command",
  mcp: "MCP",
  tool: "Tool",
}
