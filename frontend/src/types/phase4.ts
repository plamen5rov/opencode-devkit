export interface CommandFrontmatter {
  description: string | null
  agent: string | null
  model: string | null
  subtask: boolean | null
}

export interface CommandReport {
  name: string
  description: string | null
  frontmatter_valid: boolean
  frontmatter_error: string | null
  fields: CommandFrontmatter
  missing_required: string[]
  has_content: boolean
  content_word_count: number
  uses_arguments: boolean
  uses_shell: boolean
  uses_file_refs: boolean
  issues: string[]
  score: number
}

export interface CommandAnalyzeResponse {
  status: string
  report: CommandReport
}

export interface MCPServerReport {
  name: string
  type: string | null
  type_valid: boolean
  has_command: boolean
  has_url: boolean
  has_enabled: boolean
  security_issues: string[]
  config_issues: string[]
  score: number
}

export interface MCPAnalyzeResponse {
  status: string
  server_count: number
  servers: MCPServerReport[]
  overall_score: number
}

export interface ToolPermissionReport {
  tool_name: string
  permission: string | null
  is_wildcard: boolean
  is_security_sensitive: boolean
  recommendation: string | null
}

export interface ToolAnalyzeResponse {
  status: string
  tool_count: number
  tools: ToolPermissionReport[]
  missing_critical: string[]
  overall_score: number
}
