import { useState } from "react"
import type { ConfigAuditResult, ConfigDiffResult } from "@/types/config"
import { auditConfig, diffConfig } from "@/lib/api"
import { ConfigUpload } from "@/components/config-analyzer/ConfigUpload"
import { AuditResults } from "@/components/config-analyzer/AuditResults"
import { DiffView } from "@/components/config-analyzer/DiffView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RotateCcw } from "lucide-react"

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

  const handleAnalyze = async (content: string) => {
    setError(null)
    setResult(null)
    setDiffResult(null)

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
  }

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
            className="inline-flex size-10 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
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
        <Tabs defaultValue="audit">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              {diffResult && diffResult.changes.length > 0 && (
                <TabsTrigger value="diff">
                  Diff ({diffResult.changes.length})
                </TabsTrigger>
              )}
              {result.optimized_config && (
                <TabsTrigger value="optimized">Optimized Config</TabsTrigger>
              )}
            </TabsList>
            {result.optimized_config && (
              <button
                type="button"
                onClick={() => downloadJSON(result.optimized_config!, "opencode-optimized.json")}
                className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Download className="size-3" />
                Download
              </button>
            )}
          </div>
          <TabsContent value="audit" className="mt-4">
            <AuditResults
              schemaErrors={result.schema_errors}
              securityIssues={result.security_issues}
              securitySummary={result.security_summary}
              missingSettings={result.missing_settings}
              optimizations={result.optimizations}
            />
          </TabsContent>
          {diffResult && (
            <TabsContent value="diff" className="mt-4">
              <DiffView
                changes={diffResult.changes}
                originalLabel="Original"
                modifiedLabel="Optimized"
              />
            </TabsContent>
          )}
          {result.optimized_config && (
            <TabsContent value="optimized" className="mt-4">
              <div className="rounded-md border bg-muted/50 p-4">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(result.optimized_config, null, 2)}
                </pre>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}
