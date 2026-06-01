export interface SkillFrontmatter {
  name: string | null
  description: string | null
  license: string | null
  compatibility: string | null
  metadata: Record<string, string> | null
}

export interface NameValidation {
  valid: boolean
  value: string | null
  issues: string[]
}

export interface FrontmatterReport {
  present: boolean
  valid_yaml: boolean
  parse_error?: string | null
  fields: SkillFrontmatter
  name_validation?: NameValidation
  missing_required?: string[]
  unknown_fields?: string[]
}

export interface ContentQualityReport {
  has_content: boolean
  word_count: number
  sections: string[]
  has_when_to_use: boolean
  has_examples: boolean
  issues: string[]
  score: number
}

export interface FileStructureReport {
  filename: string
  filename_ok: boolean
  directory_matches_name: boolean | null
  issues: string[]
}

export interface CompletenessReport {
  overall_score: number
  summary: string
  frontmatter: FrontmatterReport
  content_quality: ContentQualityReport
  file_structure: FileStructureReport
}

export interface SkillAnalyzeResponse {
  status: string
  report: CompletenessReport
}

export interface TemplateSection {
  title: string
  description: string
  example: string
}

export interface SkillTemplate {
  id: string
  name: string
  description: string
  suggested_name: string
  frontmatter: string
  sections: TemplateSection[]
}

export interface SkillTemplateResponse {
  status: string
  templates: SkillTemplate[]
}
