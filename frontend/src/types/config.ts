export interface SecurityIssue {
  severity: "critical" | "high" | "medium" | "low"
  setting: string
  title: string
  description: string
  remediation: string
  learn_more_url: string | null
}

export interface MissingSetting {
  severity: "recommended" | "optional"
  setting: string
  title: string
  description: string
  example: string
  learn_more_url: string | null
}

export interface Optimization {
  setting: string
  original: unknown
  recommended: unknown
  reason: string
}

export interface SchemaValidationError {
  path: string
  message: string
}

export interface ConfigAuditResult {
  is_valid_jsonc: boolean
  validation_errors: string[]
  schema_errors: SchemaValidationError[]
  security_issues: SecurityIssue[]
  security_summary: Record<string, number>
  missing_settings: MissingSetting[]
  optimizations: Optimization[]
  optimized_config: Record<string, unknown> | null
}

export interface ConfigAuditResponse {
  status: string
  result: ConfigAuditResult
}

export interface DiffusionEntry {
  path: string
  change: "added" | "removed" | "changed"
  original: unknown
  modified: unknown
  description: string
}

export interface ConfigDiffResult {
  changes: DiffusionEntry[]
}

export interface ConfigDiffResponse {
  status: string
  result: ConfigDiffResult
}

export interface ConfigDiffRequest {
  original: Record<string, unknown>
  modified: Record<string, unknown>
}
