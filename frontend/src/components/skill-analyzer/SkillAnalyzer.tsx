import { useState, useCallback } from "react"
import type { CompletenessReport, SkillTemplate } from "@/types/skill"
import { analyzeSkill, getSkillTemplates } from "@/lib/api"
import { logActivity } from "@/lib/activity"
import { FileText, Upload, AlertTriangle, CheckCircle, XCircle, Info, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type View = "report" | "templates"

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-500"
  if (score >= 50) return "text-yellow-500"
  return "text-red-500"
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function IssueList({ title, issues, icon: Icon }: { title: string; issues: string[]; icon: typeof AlertTriangle }) {
  if (issues.length === 0) return null
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="size-3.5" />
        {title}
      </div>
      <ul className="ml-5 space-y-0.5 text-sm text-muted-foreground list-disc">
        {issues.map((issue, i) => (
          <li key={i}>{issue}</li>
        ))}
      </ul>
    </div>
  )
}

export function SkillAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<CompletenessReport | null>(null)
  const [templates, setTemplates] = useState<SkillTemplate[] | null>(null)
  const [view, setView] = useState<View>("report")
  const [content, setContent] = useState("")
  const [filename, setFilename] = useState("SKILL.md")

  const handleAnalyze = useCallback((text: string, fname: string) => {
    setError(null)
    setReport(null)
    setView("report")

    if (!text.trim()) {
      setError("Please paste or upload a SKILL.md file first.")
      return
    }

    setLoading(true)
    try {
      const report = analyzeSkill(text, fname)
      setReport(report)
      logActivity("skill", `Analyzed skill: score ${report.overall_score}/100`)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    handleAnalyze(content, filename)
  }, [content, filename, handleAnalyze])

  const handleLoadTemplates = useCallback(() => {
    setView("templates")
    if (templates) return
    setError(null)
    setLoading(true)
    try {
      const temps = getSkillTemplates()
      setTemplates(temps)
    } finally {
      setLoading(false)
    }
  }, [templates])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFilename(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setContent(reader.result as string)
    }
    reader.readAsText(file)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setView("report")}
          className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${
            view === "report"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Report
        </button>
        <button
          type="button"
          onClick={handleLoadTemplates}
          className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${
            view === "templates"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Templates
        </button>
      </div>

      {view === "report" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="size-4" />
                  Paste or upload SKILL.md
                </div>
                <textarea
                  className="w-full h-40 resize-none rounded-md border bg-background px-3 py-2 text-sm font-mono"
                  placeholder="---&#10;name: my-skill&#10;description: Does something useful&#10;---&#10;&#10;# My Skill&#10;Instructions here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <FileText className="size-4" />
                  <span className="text-muted-foreground">Filename:</span>
                  <input
                    type="text"
                    className="w-40 rounded border bg-background px-2 py-1 text-sm font-mono"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                  />
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <Upload className="size-4" />
                  Upload file
                  <input type="file" accept=".md" className="hidden" onChange={handleFile} />
                </label>
                <div className="flex-1" />
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {report && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Completeness Report</CardTitle>
                    <ScoreBadge score={report.overall_score} label="/ 100" />
                  </div>
                  <p className="text-sm text-muted-foreground">{report.summary}</p>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Frontmatter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      {report.frontmatter.valid_yaml ? (
                        <CheckCircle className="size-4 text-green-500" />
                      ) : report.frontmatter.present ? (
                        <XCircle className="size-4 text-red-500" />
                      ) : (
                        <XCircle className="size-4 text-red-500" />
                      )}
                      <span>
                        {report.frontmatter.valid_yaml
                          ? "Valid YAML"
                          : report.frontmatter.present
                            ? `Invalid: ${report.frontmatter.parse_error}`
                            : "Missing"}
                      </span>
                    </div>
                    {report.frontmatter.valid_yaml && (
                      <div className="space-y-1 text-sm">
                        <div><span className="text-muted-foreground">Name:</span> {report.frontmatter.fields.name ?? "(missing)"}</div>
                        <div><span className="text-muted-foreground">Description:</span> {report.frontmatter.fields.description?.slice(0, 80)}{(report.frontmatter.fields.description?.length ?? 0) > 80 ? "..." : ""}</div>
                        {report.frontmatter.fields.license && <div><span className="text-muted-foreground">License:</span> {report.frontmatter.fields.license}</div>}
                        {report.frontmatter.fields.compatibility && <div><span className="text-muted-foreground">Compatibility:</span> {report.frontmatter.fields.compatibility}</div>}
                        {report.frontmatter.fields.metadata && Object.keys(report.frontmatter.fields.metadata).length > 0 && (
                          <div>
                            <span className="text-muted-foreground">Metadata:</span>
                            {Object.entries(report.frontmatter.fields.metadata).map(([k, v]) => (
                              <span key={k} className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">{k}={v}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <IssueList title="Name issues" issues={report.frontmatter.name_validation?.issues ?? []} icon={AlertTriangle} />
                    <IssueList title="Missing required" issues={report.frontmatter.missing_required ?? []} icon={XCircle} />
                    <IssueList
                      title="Unknown fields"
                      issues={(report.frontmatter.unknown_fields?.length ?? 0) > 0
                        ? [`Unrecognized frontmatter fields: ${report.frontmatter.unknown_fields!.join(", ")} (they are ignored by OpenCode)`]
                        : []}
                      icon={Info}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Content Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ScoreBadge score={report.content_quality.score} label="/ 100" />
                    <div className="space-y-1 text-sm">
                      <div><span className="text-muted-foreground">Word count:</span> {report.content_quality.word_count}</div>
                      <div><span className="text-muted-foreground">Sections:</span> {report.content_quality.sections.length > 0 ? report.content_quality.sections.join(", ") : "none"}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Usage section:</span>
                        {report.content_quality.has_when_to_use ? <CheckCircle className="size-3.5 text-green-500" /> : <XCircle className="size-3.5 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Has examples:</span>
                        {report.content_quality.has_examples ? <CheckCircle className="size-3.5 text-green-500" /> : <XCircle className="size-3.5 text-red-500" />}
                      </div>
                    </div>
                    <IssueList title="Content issues" issues={report.content_quality.issues} icon={Info} />
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">File Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {report.file_structure.filename_ok ? (
                        <CheckCircle className="size-4 text-green-500" />
                      ) : (
                        <XCircle className="size-4 text-red-500" />
                      )}
                      <span>Filename: <code>{report.file_structure.filename}</code></span>
                    </div>
                    {report.file_structure.directory_matches_name === false && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <XCircle className="size-4" />
                        <span>Directory name does not match skill name in frontmatter</span>
                      </div>
                    )}
                    <IssueList title="File issues" issues={report.file_structure.issues} icon={AlertTriangle} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "templates" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a template to scaffold a new SKILL.md with the right frontmatter and section structure.
          </p>
          {templates ? (
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((t) => (
                <Card key={t.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                    <div className="space-y-1 text-sm">
                      <span className="text-muted-foreground">Suggested name:</span>{" "}
                      <code>{t.suggested_name}</code>
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">Frontmatter</summary>
                      <pre className="mt-2 rounded bg-muted p-2 text-xs overflow-auto">{t.frontmatter}</pre>
                    </details>
                    {t.sections.length > 0 && (
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium">Sections ({t.sections.length})</summary>
                        <ul className="mt-2 space-y-2">
                          {t.sections.map((s, i) => (
                            <li key={i} className="rounded border p-2">
                              <div className="font-medium">{s.title}</div>
                              <div className="text-xs text-muted-foreground">{s.description}</div>
                              <pre className="mt-1 rounded bg-muted p-1.5 text-xs overflow-auto">{s.example}</pre>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const full = `${t.frontmatter}\n\n${t.sections.map((s) => `## ${s.title}\n${s.example}`).join("\n\n")}\n`
                        navigator.clipboard.writeText(full)
                      }}
                    >
                      <Download className="size-3.5 mr-1.5" />
                      Copy template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading templates...</p>
          )}
        </div>
      )}
    </div>
  )
}
