import Ajv2020 from "ajv/dist/2020"
import addFormats from "ajv-formats"
import OPENCODE_CONFIG_SCHEMA from "@/lib/data/schema"
import { SECURITY_RULES, RECOMMENDED_SETTINGS, OPTIMIZATIONS } from "@/lib/data/rules"
import type {
  ConfigAuditResult,
  ConfigDiffResult,
  DiffusionEntry,
  SchemaValidationError,
  SecurityIssue,
  MissingSetting,
  Optimization,
} from "@/types/config"

/* ------------------------------------------------------------------ */
/*  JSON / JSONC parsing                                              */
/* ------------------------------------------------------------------ */

function sanitize(text: string): string {
  return text
    .replace(/^\ufeff/, "")
    .replace(/[\u200b-\u200f\u2028-\u202f\ufeff\u00a0]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
}

function stripComments(text: string): string {
  const result: string[] = []
  let i = 0
  const n = text.length
  let inString = false
  let stringChar = ""

  while (i < n) {
    const ch = text[i]!

    if (inString) {
      if (ch === "\\") {
        result.push(ch)
        i++
        if (i < n) result.push(text[i]!)
      } else if (ch === stringChar) {
        inString = false
        result.push(ch)
      } else {
        result.push(ch)
      }
      i++
      continue
    }

    if (ch === '"' || ch === "'") {
      inString = true
      stringChar = ch
      result.push(ch)
      i++
      continue
    }

    if (ch === "/" && i + 1 < n) {
      if (text[i + 1] === "/") {
        i += 2
        while (i < n && text[i] !== "\n") i++
        continue
      }
      if (text[i + 1] === "*") {
        i += 2
        while (i + 1 < n && !(text[i] === "*" && text[i + 1] === "/")) i++
        i += 2
        continue
      }
    }

    result.push(ch)
    i++
  }

  return result.join("").replace(/,\s*([}\]])/g, "$1")
}

export function parseConfig(raw: string): { config: Record<string, unknown> | null; errors: string[] } {
  const errors: string[] = []
  let cleaned = sanitize(raw.trim())
  cleaned = stripComments(cleaned)
  try {
    return { config: JSON.parse(cleaned) as Record<string, unknown>, errors }
  } catch (e) {
    errors.push(formatParseError(raw, e as SyntaxError))
  }
  try {
    return { config: JSON.parse(cleaned), errors }
  } catch (e) {
    errors.push(formatParseError(raw, e as SyntaxError))
  }
  return { config: null, errors }
}

function formatParseError(raw: string, e: SyntaxError): string {
  const match = /at line (\d+) column (\d+)/.exec(e.message)
  if (match) {
    const lineNo = parseInt(match[1]!, 10)
    const colNo = parseInt(match[2]!, 10)
    const lines = raw.split("\n")
    if (lineNo >= 1 && lineNo <= lines.length) {
      const line = lines[lineNo - 1]!
      const start = Math.max(0, colNo - 20)
      const end = Math.min(line.length, colNo + 20)
      const snippet = line.slice(start, end)
      const markerIdx = colNo - start - 1
      const marker = " ".repeat(Math.max(0, markerIdx)) + "^"
      return `JSON parse error at line ${lineNo}, col ${colNo}: ${e.message}\n  \u2026${snippet}\u2026\n  ${marker}`
    }
  }
  return `JSON parse error: ${e.message}`
}

/* ------------------------------------------------------------------ */
/*  Schema validation                                                  */
/* ------------------------------------------------------------------ */

let _ajv: Ajv2020 | null = null
let _validate: ReturnType<Ajv2020["compile"]> | null = null

function getValidator() {
  if (!_ajv) {
    _ajv = new Ajv2020({ strict: false })
    addFormats(_ajv)
    _validate = _ajv.compile(OPENCODE_CONFIG_SCHEMA)
  }
  return _validate!
}

function formatSchemaErrors(errors: { instancePath?: string; message?: string }[] | null | undefined): SchemaValidationError[] {
  if (!errors) return []
  return errors.map((e) => ({
    path: e.instancePath || "/",
    message: e.message || "Unknown schema error",
  }))
}

/* ------------------------------------------------------------------ */
/*  Config analysis                                                    */
/* ------------------------------------------------------------------ */

export function analyzeConfig(config: Record<string, unknown>): ConfigAuditResult {
  const schemaErrors: SchemaValidationError[] = []
  const securityIssues: SecurityIssue[] = []
  const missingSettings: MissingSetting[] = []
  const optimizations: Optimization[] = []

  try {
    const validate = getValidator()
    const valid = validate(config)
    if (!valid) schemaErrors.push(...formatSchemaErrors(validate.errors))
  } catch {
    /* schema validation is advisory */
  }

  for (const rule of SECURITY_RULES) {
    try {
      if (rule.check(config)) securityIssues.push({ ...rule.issue })
    } catch { /* ignore */ }
  }

  for (const rule of RECOMMENDED_SETTINGS) {
    try {
      if (rule.check(config)) missingSettings.push({ ...rule.setting })
    } catch { /* ignore */ }
  }

  for (const rule of OPTIMIZATIONS) {
    try {
      if (rule.check(config)) {
        const rec = rule.recommendation
        optimizations.push({
          setting: rec.setting,
          original: config[rec.setting] ?? null,
          recommended: rec.recommended,
          reason: rec.reason,
        })
      }
    } catch { /* ignore */ }
  }

  const securitySummary: Record<string, number> = {}
  for (const issue of securityIssues) {
    securitySummary[issue.severity] = (securitySummary[issue.severity] || 0) + 1
  }

  const optimizedConfig = structuredClone(config) as Record<string, unknown>
  for (const rule of OPTIMIZATIONS) {
    try {
      if (rule.check(config)) {
        const rec = rule.recommendation
        optimizedConfig[rec.setting] = rec.recommended
      }
    } catch { /* ignore */ }
  }

  return {
    is_valid_jsonc: true,
    validation_errors: [],
    schema_errors: schemaErrors,
    security_issues: securityIssues,
    security_summary: securitySummary,
    missing_settings: missingSettings,
    optimizations,
    optimized_config: optimizedConfig,
  }
}

/* ------------------------------------------------------------------ */
/*  Config diff                                                        */
/* ------------------------------------------------------------------ */

export function computeDiff(
  original: Record<string, unknown>,
  modified: Record<string, unknown>,
): ConfigDiffResult {
  const entries: DiffusionEntry[] = []

  function diff(a: unknown, b: unknown, path = ""): void {
    if (typeof a === "object" && a !== null && !Array.isArray(a) && typeof b === "object" && b !== null && !Array.isArray(b)) {
      const aObj = a as Record<string, unknown>
      const bObj = b as Record<string, unknown>
      const allKeys = [...new Set([...Object.keys(aObj), ...Object.keys(bObj)])].sort()
      for (const key of allKeys) {
        const subpath = path ? `${path}.${key}` : key
        if (!(key in bObj)) {
          entries.push({ path: subpath, change: "removed", original: aObj[key], modified: null, description: `Removed '${subpath}'` })
        } else if (!(key in aObj)) {
          entries.push({ path: subpath, change: "added", original: null, modified: bObj[key], description: `Added '${subpath}'` })
        } else {
          diff(aObj[key], bObj[key], subpath)
        }
      }
    } else if (a !== b) {
      entries.push({ path, change: "changed", original: a, modified: b, description: `Changed '${path}'` })
    }
  }

  diff(original, modified)
  return { changes: entries }
}

/* ------------------------------------------------------------------ */
/*  Full audit pipeline                                                */
/* ------------------------------------------------------------------ */

export function auditConfig(raw: string): ConfigAuditResult {
  const { config, errors } = parseConfig(raw)
  if (!config) {
    return {
      is_valid_jsonc: false,
      validation_errors: errors,
      schema_errors: [],
      security_issues: [],
      security_summary: {},
      missing_settings: [],
      optimizations: [],
      optimized_config: null,
    }
  }
  return analyzeConfig(config)
}
