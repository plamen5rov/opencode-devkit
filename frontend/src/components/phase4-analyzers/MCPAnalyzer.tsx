import { useState, useCallback } from "react"
import type { MCPServerReport } from "@/types/phase4"
import { analyzeMCP } from "@/lib/api"
import { Upload, AlertTriangle, CheckCircle, XCircle, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
  return <span className={`text-xl font-bold ${color}`}>{score}</span>
}

function ServerCard({ server }: { server: MCPServerReport }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="size-4" />
            <CardTitle className="text-base">{server.name}</CardTitle>
          </div>
          <ScoreBadge score={server.score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Type:</span>
            <code className="text-xs">{server.type ?? "missing"}</code>
            {server.type_valid ? (
              <CheckCircle className="size-3.5 text-green-500" />
            ) : (
              <XCircle className="size-3.5 text-red-500" />
            )}
          </div>
          {server.type === "local" && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Command:</span>
              {server.has_command ? <CheckCircle className="size-3.5 text-green-500" /> : <XCircle className="size-3.5 text-red-500" />}
            </div>
          )}
          {server.type === "remote" && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">URL:</span>
              {server.has_url ? <CheckCircle className="size-3.5 text-green-500" /> : <XCircle className="size-3.5 text-red-500" />}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Enabled:</span>
            {server.has_enabled ? <CheckCircle className="size-3.5 text-green-500" /> : <span className="text-muted-foreground text-xs">not set</span>}
          </div>
        </div>
        {server.config_issues.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">Config issues:</div>
            <ul className="space-y-0.5 text-xs text-muted-foreground list-disc ml-4">
              {server.config_issues.map((issue, i) => <li key={i}>{issue}</li>)}
            </ul>
          </div>
        )}
        {server.security_issues.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium text-red-500 mb-1 flex items-center gap-1">
              <AlertTriangle className="size-3" /> Security:
            </div>
            <ul className="space-y-0.5 text-xs text-red-500 list-disc ml-4">
              {server.security_issues.map((issue, i) => <li key={i}>{issue}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MCPAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [servers, setServers] = useState<MCPServerReport[] | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [content, setContent] = useState("")
  const [serverCount, setServerCount] = useState(0)

  const handleAnalyze = useCallback(() => {
    setError(null)
    setServers(null)
    if (!content.trim()) {
      setError("Please paste an opencode.json or MCP section first.")
      return
    }
    setLoading(true)
    try {
      const result = analyzeMCP(content)
      setServers(result.servers)
      setOverallScore(result.overallScore)
      setServerCount(result.serverCount)
    } catch {
      setError("Analysis failed — check JSON formatting")
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
            Paste opencode.json (or just the &quot;mcp&quot; section)
          </div>
          <textarea
            className="w-full h-40 resize-none rounded-md border bg-background px-3 py-2 text-sm font-mono"
            placeholder={`{\n  "mcp": {\n    "my-server": {\n      "type": "local",\n      "command": ["npx", "-y", "my-mcp-command"],\n      "enabled": true\n    }\n  }\n}`}
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

      {servers && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {serverCount} server{serverCount !== 1 ? "s" : ""} found
            </p>
            {serverCount > 0 && (
              <span className="text-sm text-muted-foreground">
                Overall score: <span className={`font-bold ${overallScore >= 80 ? "text-green-500" : overallScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>{overallScore}</span>
              </span>
            )}
          </div>
          {servers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No MCP servers found in the provided config.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {servers.map((s, i) => (
                <ServerCard key={i} server={s} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
