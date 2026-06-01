import { useState, useCallback } from "react"
import type { ToolPermissionReport } from "@/types/phase4"
import { analyzeTools } from "@/lib/api"
import { Upload, AlertTriangle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function PermissionBadge({ permission }: { permission: string | null }) {
  if (!permission) return <span className="text-xs text-muted-foreground">not set</span>
  const colors: Record<string, string> = {
    allow: "bg-green-500/10 text-green-600",
    ask: "bg-yellow-500/10 text-yellow-600",
    deny: "bg-red-500/10 text-red-600",
  }
  return (
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${colors[permission] ?? "bg-muted text-muted-foreground"}`}>
      {permission}
    </span>
  )
}

function ToolRow({ tool }: { tool: ToolPermissionReport }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        {tool.is_security_sensitive && <Shield className="size-3.5 text-red-400" />}
        <code className="text-sm">{tool.tool_name}</code>
        {tool.is_wildcard && <span className="text-xs text-muted-foreground">(wildcard)</span>}
      </div>
      <div className="flex items-center gap-2">
        {tool.recommendation && (
          <AlertTriangle className="size-3.5 text-yellow-500" />
        )}
        <PermissionBadge permission={tool.permission} />
      </div>
    </div>
  )
}

export function ToolAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tools, setTools] = useState<ToolPermissionReport[] | null>(null)
  const [missingCritical, setMissingCritical] = useState<string[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [content, setContent] = useState("")

  const handleAnalyze = useCallback(async () => {
    setError(null)
    setTools(null)
    setMissingCritical([])
    if (!content.trim()) {
      setError("Please paste an opencode.json or permission section first.")
      return
    }
    setLoading(true)
    try {
      const res = await analyzeTools(content)
      setTools(res.tools)
      setMissingCritical(res.missing_critical)
      setOverallScore(res.overall_score)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed")
    } finally {
      setLoading(false)
    }
  }, [content])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Upload className="size-4" />
            Paste opencode.json (or just the &quot;permission&quot; section)
          </div>
          <textarea
            className="w-full h-40 resize-none rounded-md border bg-background px-3 py-2 text-sm font-mono"
            placeholder={`{\n  "permission": {\n    "edit": "ask",\n    "bash": "ask",\n    "webfetch": "allow",\n    "*": "ask"\n  }\n}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center gap-3">
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

      {tools !== null && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {tools.length} tool permission entr{tools.length !== 1 ? "ies" : "y"}
            </p>
            <span className="text-sm text-muted-foreground">
              Score: <span className={`font-bold ${overallScore >= 80 ? "text-green-500" : overallScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>{overallScore}</span>
            </span>
          </div>

          {missingCritical.length > 0 && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="py-3">
                <div className="flex items-start gap-2 text-sm text-red-500">
                  <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium">Missing security-sensitive permissions:</span>
                    <span className="ml-1">{missingCritical.join(", ")}</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      These tools can modify files or run commands — add explicit permission rules.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Permission Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {tools.length === 0 ? (
                <p className="text-sm text-muted-foreground">No permission rules found.</p>
              ) : (
                <div className="divide-y">
                  {tools.map((t, i) => (
                    <ToolRow key={i} tool={t} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 font-medium">allow</span> Always allowed
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 font-medium">ask</span> User prompted
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 font-medium">deny</span> Blocked
            </div>
            <div className="flex items-center gap-1">
              <Shield className="size-3 text-red-400" /> Security-sensitive
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
