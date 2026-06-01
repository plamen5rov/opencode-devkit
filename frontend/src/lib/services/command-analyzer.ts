import yaml from "js-yaml"
import type { CommandReport, CommandFrontmatter } from "@/types/phase4"

const KNOWN_FIELDS = new Set(["description", "agent", "model", "subtask"])
const ARGUMENT_RE = /\$ARGUMENTS|\$\d+/

export function analyzeCommand(raw: string, filename: string): CommandReport {
  const name = filename.toLowerCase().endsWith(".md") ? filename.replace(/\.md$/i, "") : filename
  const issues: string[] = []

  let frontmatterValid = false
  let frontmatterError: string | null = null
  const fields: CommandFrontmatter = { description: null, agent: null, model: null, subtask: null }
  const missingRequired: string[] = []

  const stripped = raw.trimStart()
  let body = stripped

  if (stripped.startsWith("---")) {
    const secondDelim = stripped.indexOf("---", 3)
    if (secondDelim === -1) {
      frontmatterError = "Unterminated frontmatter"
    } else {
      const rawYaml = stripped.slice(3, secondDelim).trim()
      body = stripped.slice(secondDelim + 3).trim()
      if (rawYaml) {
        try {
          const parsed = yaml.load(rawYaml)
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            const d = parsed as Record<string, unknown>
            frontmatterValid = true
            if (typeof d.description === "string") {
              fields.description = d.description
            } else {
              missingRequired.push("description")
            }
            if (typeof d.agent === "string") fields.agent = d.agent
            if (typeof d.model === "string") fields.model = d.model
            if (typeof d.subtask === "boolean") fields.subtask = d.subtask
            else if ("subtask" in d) fields.subtask = Boolean(d.subtask)
            const unknown = Object.keys(d).filter((k) => !KNOWN_FIELDS.has(k))
            if (unknown.length) issues.push(`Unknown frontmatter fields: ${unknown.join(", ")}`)
          } else {
            frontmatterError = "Frontmatter must be a YAML mapping"
          }
        } catch (e) {
          frontmatterError = `YAML parse error: ${e instanceof Error ? e.message : e}`
        }
      } else {
        frontmatterError = "Empty frontmatter block"
      }
    }
  } else {
    frontmatterError = "No YAML frontmatter found (must start with ---)"
  }

  const hasContent = body.trim().length > 0
  const wordCount = hasContent ? body.trim().split(/\s+/).length : 0
  const usesArguments = ARGUMENT_RE.test(body)
  const usesShell = body.includes("!`")
  const usesFileRefs = body.includes("@") && !body.trim().startsWith("```")

  if (!hasContent) {
    issues.push("No command body (prompt text) after frontmatter")
  } else if (wordCount < 10) {
    issues.push("Command body is very short (<10 words) — add more detail")
  }

  if (!usesArguments && !usesShell && !usesFileRefs) {
    issues.push("Command body does not use $ARGUMENTS, !`shell`, or @file references")
  }

  let score = 0
  if (frontmatterValid) {
    score += 30
    if (missingRequired.length === 0) score += 15
  }
  if (hasContent) score += 15
  if (wordCount >= 20) score += 15
  if (usesArguments) score += 10
  if (usesShell) score += 10
  if (usesFileRefs) score += 5

  score = Math.max(0, Math.min(100, score))

  return {
    name,
    description: fields.description,
    frontmatter_valid: frontmatterValid,
    frontmatter_error: frontmatterError,
    fields,
    missing_required: missingRequired,
    has_content: hasContent,
    content_word_count: wordCount,
    uses_arguments: usesArguments,
    uses_shell: usesShell,
    uses_file_refs: usesFileRefs,
    issues,
    score,
  }
}
