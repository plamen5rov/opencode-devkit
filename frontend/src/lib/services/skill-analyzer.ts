import yaml from "js-yaml"
import { SKILL_TEMPLATES } from "@/lib/data/templates"
import type {
  CompletenessReport,
  ContentQualityReport,
  FileStructureReport,
  FrontmatterReport,
  NameValidation,
  SkillFrontmatter,
  SkillTemplate,
} from "@/types/skill"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const KNOWN_FIELDS = new Set(["name", "description", "license", "compatibility", "metadata"])

const VALID_NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const NAME_MIN = 1
const NAME_MAX = 64

const SECTION_TRIGGER_RE = /#+\s*(trigger|when\s+to\s+use|usage|when\s+this\s+skill)/i

/* ------------------------------------------------------------------ */
/*  Name validation                                                    */
/* ------------------------------------------------------------------ */

function validateName(name: string | null): NameValidation {
  if (!name) return { valid: false, value: null, issues: ["missing name"] }
  const issues: string[] = []
  if (name.length < NAME_MIN) issues.push(`name must be at least ${NAME_MIN} character(s)`)
  if (name.length > NAME_MAX) issues.push(`name must be at most ${NAME_MAX} characters (got ${name.length})`)
  if (name[0] === "-" || name[name.length - 1] === "-") issues.push("name must not start or end with '-'")
  if (name.includes("--")) issues.push("name must not contain consecutive '--'")
  if (!VALID_NAME_RE.test(name)) issues.push("name must be lowercase alphanumeric with single hyphen separators")
  return { valid: issues.length === 0, value: name, issues }
}

/* ------------------------------------------------------------------ */
/*  Frontmatter parsing                                                */
/* ------------------------------------------------------------------ */

function parseFrontmatter(text: string): FrontmatterReport {
  const emptyFields: SkillFrontmatter = {
    name: null,
    description: null,
    license: null,
    compatibility: null,
    metadata: null,
  }

  const stripped = text.trimStart()
  if (!stripped.startsWith("---")) {
    return { present: false, valid_yaml: false, fields: emptyFields }
  }

  const secondDelim = stripped.indexOf("---", 3)
  if (secondDelim === -1) {
    return {
      present: true,
      valid_yaml: false,
      parse_error: "Unterminated frontmatter: missing closing ---",
      fields: emptyFields,
    }
  }

  const rawYaml = stripped.slice(3, secondDelim).trim()
  if (!rawYaml) {
    return {
      present: true,
      valid_yaml: false,
      parse_error: "Empty frontmatter block",
      fields: emptyFields,
    }
  }

  let parsed: unknown
  try {
    parsed = yaml.load(rawYaml)
  } catch (e) {
    return {
      present: true,
      valid_yaml: false,
      parse_error: `YAML parse error: ${e instanceof Error ? e.message : e}`,
      fields: emptyFields,
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      present: true,
      valid_yaml: false,
      parse_error: `Frontmatter must be a YAML mapping, got ${Array.isArray(parsed) ? "array" : typeof parsed}`,
      fields: emptyFields,
    }
  }

  const d = parsed as Record<string, unknown>

  let metadata: Record<string, string> | null = null
  const rawMeta = d.metadata
  if (rawMeta && typeof rawMeta === "object" && !Array.isArray(rawMeta)) {
    metadata = Object.fromEntries(Object.entries(rawMeta as Record<string, unknown>).map(([k, v]) => [k, String(v)]))
  }

  const fields: SkillFrontmatter = {
    name: "name" in d ? String(d.name) : null,
    description: "description" in d ? String(d.description) : null,
    license: "license" in d ? String(d.license) : null,
    compatibility: "compatibility" in d ? String(d.compatibility) : null,
    metadata,
  }

  const missingRequired: string[] = []
  if (fields.name === null) missingRequired.push("name")
  if (fields.description === null) missingRequired.push("description")

  const unknownFields = Object.keys(d).filter((k) => !KNOWN_FIELDS.has(k))

  const nameVal = validateName(fields.name)

  return {
    present: true,
    valid_yaml: true,
    fields,
    name_validation: nameVal,
    missing_required: missingRequired,
    unknown_fields: unknownFields,
  }
}

/* ------------------------------------------------------------------ */
/*  Content analysis                                                   */
/* ------------------------------------------------------------------ */

function analyzeContent(text: string): ContentQualityReport {
  const stripped = text.trimStart()
  let content = ""

  if (stripped.startsWith("---")) {
    const secondDelim = stripped.indexOf("---", 3)
    if (secondDelim !== -1) content = stripped.slice(secondDelim + 3).trim()
  }

  if (!content) {
    return {
      has_content: false,
      word_count: 0,
      sections: [],
      has_when_to_use: false,
      has_examples: false,
      issues: ["No content after frontmatter — skill has no instructions"],
      score: 0,
    }
  }

  const words = content.split(/\s+/)
  const wordCount = words.length

  const headingMatches = content.match(/^#{1,6}\s+(.+)$/gm)
  const headings = headingMatches ? headingMatches.map((h) => h.replace(/^#+\s+/, "")) : []

  const hasWhenToUse = SECTION_TRIGGER_RE.test(content)
  const hasExamples = content.includes("```") || content.toLowerCase().includes("example")

  const issues: string[] = []
  let score = 40

  if (wordCount < 50) {
    issues.push("Content is very short (<50 words) — consider adding more detail")
  } else if (wordCount >= 200) {
    score += 20
  } else if (wordCount >= 100) {
    score += 10
  }

  if (headings.length === 0) {
    issues.push("No headings found — structure your skill with sections")
  } else if (headings.length >= 3) {
    score += 10
  }

  if (!hasWhenToUse) {
    issues.push("No trigger/usage section found — add a section describing when the skill should be loaded")
  } else {
    score += 15
  }

  if (!hasExamples) {
    issues.push("No code examples found — examples help agents understand the skill")
  } else {
    score += 15
  }

  score = Math.max(0, Math.min(100, score))

  return {
    has_content: true,
    word_count: wordCount,
    sections: headings,
    has_when_to_use: hasWhenToUse,
    has_examples: hasExamples,
    issues,
    score,
  }
}

/* ------------------------------------------------------------------ */
/*  File structure check                                               */
/* ------------------------------------------------------------------ */

function analyzeFileStructure(filename: string): FileStructureReport {
  const issues: string[] = []
  const filenameOk = filename === "SKILL.md"
  if (!filenameOk) issues.push(`File should be named SKILL.md (got ${filename})`)
  return { filename, filename_ok: filenameOk, directory_matches_name: null, issues }
}

/* ------------------------------------------------------------------ */
/*  Full analysis                                                      */
/* ------------------------------------------------------------------ */

export function analyzeSkill(raw: string, filename = "SKILL.md"): CompletenessReport {
  const fmReport = parseFrontmatter(raw)
  const contentReport = analyzeContent(raw)
  const fileReport = analyzeFileStructure(filename)

  let score = 0
  if (fmReport.valid_yaml) {
    score += 30
    if (!fmReport.missing_required || fmReport.missing_required.length === 0) score += 15
    if (fmReport.name_validation?.valid) score += 15
  } else if (fmReport.present) {
    score += 10
  }

  score += Math.floor(contentReport.score / 2)
  score = Math.max(0, Math.min(100, score))

  const parts: string[] = []
  if (fmReport.valid_yaml && (!fmReport.missing_required || fmReport.missing_required.length === 0) && fmReport.name_validation?.valid) {
    parts.push("Frontmatter is valid and complete")
  } else if (fmReport.present) {
    parts.push("Frontmatter needs fixes")
  } else {
    parts.push("Frontmatter is missing")
  }

  if (contentReport.score >= 60) {
    parts.push("content is well-structured")
  } else if (contentReport.has_content) {
    parts.push("content needs improvement")
  } else {
    parts.push("no content")
  }

  return {
    overall_score: score,
    summary: parts.join("; "),
    frontmatter: fmReport,
    content_quality: contentReport,
    file_structure: fileReport,
  }
}

/* ------------------------------------------------------------------ */
/*  Templates                                                          */
/* ------------------------------------------------------------------ */

export function getTemplates(): SkillTemplate[] {
  return SKILL_TEMPLATES
}
