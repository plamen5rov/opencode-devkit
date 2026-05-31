import { useState } from "react"
import type { ConfigAuditResult } from "@/types/config"
import { auditConfig, diffConfig } from "@/lib/api"
import { ConfigUpload } from "@/components/config-analyzer/ConfigUpload"
import { AuditResults } from "@/components/config-analyzer/AuditResults"
import { DiffView } from "@/components/config-analyzer/DiffView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ConfigDiffResult } from "@/types/config"

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
          // JSONC with comments can't be reparsed by JSON.parse — skip diff
          setDiffResult(null)
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <ConfigUpload onAnalyze={handleAnalyze} loading={loading} />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {result && result.is_valid_jsonc && (
        <Tabs defaultValue="audit">
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
          <TabsContent value="audit" className="mt-4">
            <AuditResults
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
