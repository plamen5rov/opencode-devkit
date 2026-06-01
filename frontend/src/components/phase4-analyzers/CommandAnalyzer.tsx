import { useState, useCallback } from "react"
import type { CommandReport } from "@/types/phase4"
import { analyzeCommand } from "@/lib/api"
import { Upload, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
  return (
    <span className={`text-2xl font-bold ${color}`}>{score}
      <span className="text-sm text-muted-foreground font-normal"> / 100</span>
    </span>
  )
}

export function CommandAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<CommandReport | null>(null)
  const [content, setContent] = useState("")
  const [filename, setFilename] = useState("command.md")

  const handleAnalyze = useCallback(() => {
    setError(null)
    setReport(null)
    if (!content.trim()) {
      setError("Please paste or upload a command .md file first.")
      return
    }
    setLoading(true)
    try {
      const report = analyzeCommand(content, filename)
      setReport(report)
    } finally {
      setLoading(false)
    }
  }, [content, filename])

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFilename(file.name)
    const reader = new FileReader()
    reader.onload = () => setContent(reader.result as string)
    reader.readAsText(file)
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Upload className="size-4" />
            Paste or upload command .md
          </div>
          <textarea
            className="w-full h-40 resize-none rounded-md border bg-background px-3 py-2 text-sm font-mono"
            placeholder={`---\ndescription: Run tests with coverage\nagent: build\n---\nRun the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">/{report.name}</CardTitle>
                <ScoreBadge score={report.score} />
              </div>
              {report.description && (
                <p className="text-sm text-muted-foreground">{report.description}</p>
              )}
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Frontmatter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  {report.frontmatter_valid ? (
                    <CheckCircle className="size-4 text-green-500" />
                  ) : (
                    <XCircle className="size-4 text-red-500" />
                  )}
                  <span>
                    {report.frontmatter_valid
                      ? "Valid YAML"
                      : report.frontmatter_error ?? "Missing"}
                  </span>
                </div>
                {report.frontmatter_valid && (
                  <div className="space-y-1 text-sm">
                    <div><span className="text-muted-foreground">Agent:</span> {report.fields.agent ?? "(default)"}</div>
                    <div><span className="text-muted-foreground">Model:</span> {report.fields.model ?? "(default)"}</div>
                    <div><span className="text-muted-foreground">Subtask:</span> {report.fields.subtask ? "Yes" : "No"}</div>
                  </div>
                )}
                {report.missing_required.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-red-500">
                    <XCircle className="size-3.5 mt-0.5 shrink-0" />
                    <span>Missing: {report.missing_required.join(", ")}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Has body:</span>
                    {report.has_content ? <CheckCircle className="size-3.5 text-green-500" /> : <XCircle className="size-3.5 text-red-500" />}
                  </div>
                  {report.has_content && (
                    <>
                      <div><span className="text-muted-foreground">Words:</span> {report.content_word_count}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">$ARGUMENTS:</span>
                        {report.uses_arguments ? <CheckCircle className="size-3.5 text-green-500" /> : <span className="text-muted-foreground">no</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">!`shell`:</span>
                        {report.uses_shell ? <CheckCircle className="size-3.5 text-green-500" /> : <span className="text-muted-foreground">no</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">@file refs:</span>
                        {report.uses_file_refs ? <CheckCircle className="size-3.5 text-green-500" /> : <span className="text-muted-foreground">no</span>}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {report.issues.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc ml-5">
                    {report.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
