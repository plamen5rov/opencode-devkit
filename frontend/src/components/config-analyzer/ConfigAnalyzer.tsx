import { useState } from "react"
import type { ConfigAuditResult, ConfigDiffResult } from "@/types/config"
import { auditConfig, diffConfig } from "@/lib/api"
import { ConfigUpload } from "@/components/config-analyzer/ConfigUpload"
import { AuditResults } from "@/components/config-analyzer/AuditResults"
import { DiffView } from "@/components/config-analyzer/DiffView"
import { Download, RotateCcw, Copy, Check } from "lucide-react"

type View = "audit" | "diff" | "optimized"

function downloadJSON(data: Record<string, unknown>, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ConfigAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ConfigAuditResult | null>(null)
  const [diffResult, setDiffResult] = useState<ConfigDiffResult | null>(null)
  const [view, setView] = useState<View>("audit")
  const [copied, setCopied] = useState(false)

  const handleAnalyze = async (content: string) => {
    setError(null)
    setResult(null)
    setDiffResult(null)
    setView("audit")

    if (!content.trim()) {
      setError("Please paste or upload a config file first.")
      return
    }

    setLoading(true)
    try {
      const res = await auditConfig(content)
      setResult(res.result)

      if (!res.result.is_valid_jsonc) {
        setError("Invalid JSON/JSONC: " + res.result.validation_errors.join(", "))
        return
      }

      if (res.result.optimized_config && Object.keys(res.result.optimized_config).length > 0) {
        try {
          const original = JSON.parse(content)
          const diffRes = await diffConfig(original, res.result.optimized_config)
          setDiffResult(diffRes.result)
        } catch {
          setDiffResult(null)
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setError(null)
    setResult(null)
    setDiffResult(null)
    setView("audit")
  }

  const handleCopy = async (json: Record<string, unknown>) => {
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const showDiff = diffResult && diffResult.changes.length > 0
  const showOptimized = Boolean(result?.optimized_config)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ConfigUpload onAnalyze={handleAnalyze} loading={loading} />
        </div>
        {result && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear All Data"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {result && result.is_valid_jsonc && (
        <div className="space-y-3">
          {view === "audit" && (
            <AuditResults
              schemaErrors={result.schema_errors}
              securityIssues={result.security_issues}
              securitySummary={result.security_summary}
              missingSettings={result.missing_settings}
              optimizations={result.optimizations}
            />
          )}

          {view === "diff" && diffResult && (
            <DiffView
              changes={diffResult.changes}
              originalLabel="Original"
              modifiedLabel="Optimized"
            />
          )}

          {view === "optimized" && result.optimized_config && (
            <div>
              <div className="mb-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(result.optimized_config!)}
                  className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadJSON(result.optimized_config!, "opencode-optimized.json")}
                  className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Download className="size-3" />
                  Download
                </button>
              </div>
              <div className="rounded-md border bg-muted/50 p-4">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(result.optimized_config, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("audit")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                view === "audit"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Audit
            </button>
            {showDiff && (
              <button
                type="button"
                onClick={() => setView("diff")}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                  view === "diff"
                    ? "bg-primary text-primary-foreground"
                    : "border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                Diff ({diffResult!.changes.length})
              </button>
            )}
            {showOptimized && (
              <button
                type="button"
                onClick={() => setView("optimized")}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                  view === "optimized"
                    ? "bg-primary text-primary-foreground"
                    : "border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                Optimized
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
