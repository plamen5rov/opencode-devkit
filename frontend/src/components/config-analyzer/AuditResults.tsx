import { ShieldAlert, Info, TriangleAlert, AlertTriangle } from "lucide-react"
import type { SecurityIssue, MissingSetting, Optimization } from "@/types/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const severityConfig: Record<string, { icon: typeof ShieldAlert; color: string; bg: string }> = {
  critical: { icon: ShieldAlert, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
  high: { icon: TriangleAlert, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950" },
  medium: { icon: AlertTriangle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950" },
  low: { icon: Info, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
}

const missingSeverityConfig: Record<string, string> = {
  recommended: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
  optional: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
}

function SeverityBadgeIcon({ severity }: { severity: string }) {
  const config = severityConfig[severity] ?? severityConfig.low
  const Icon = config.icon
  return <Icon className={`size-4 ${config.color}`} />
}

interface AuditResultsProps {
  securityIssues: SecurityIssue[]
  securitySummary: Record<string, number>
  missingSettings: MissingSetting[]
  optimizations: Optimization[]
}

export function AuditResults({
  securityIssues,
  securitySummary,
  missingSettings,
  optimizations,
}: AuditResultsProps) {
  if (securityIssues.length === 0 && missingSettings.length === 0 && optimizations.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="pt-6 text-sm text-green-700 dark:text-green-300">
          No issues found. Your config looks good!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {securityIssues.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ShieldAlert className="size-4 text-red-500" />
              Security Issues ({securityIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(securitySummary).length > 0 && (
              <div className="mb-3 flex gap-2 text-xs">
                {Object.entries(securitySummary).map(([sev, count]) => (
                  <span key={sev} className={`rounded-full px-2 py-0.5 font-medium ${severityConfig[sev]?.bg ?? ""} ${severityConfig[sev]?.color ?? ""}`}>
                    {sev}: {count}
                  </span>
                ))}
              </div>
            )}
            {securityIssues.map((issue, i) => {
              const sev = severityConfig[issue.severity] ?? severityConfig.low
              return (
                <div key={i} className={`rounded-md border p-3 ${sev.bg}`}>
                  <div className="flex items-start gap-2">
                    <SeverityBadgeIcon severity={issue.severity} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{issue.title}</p>
                      <code className="text-xs text-muted-foreground">{issue.setting}</code>
                      <p className="text-xs text-muted-foreground">{issue.description}</p>
                      <pre className="whitespace-pre-wrap rounded bg-muted p-2 text-xs">
                        {issue.remediation}
                      </pre>
                      {issue.learn_more_url && (
                        <a
                          href={issue.learn_more_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline"
                        >
                          Learn more
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {missingSettings.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Info className="size-4 text-blue-500" />
              Missing Settings ({missingSettings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missingSettings.map((setting, i) => (
              <div
                key={i}
                className={`rounded-md border p-3 ${missingSeverityConfig[setting.severity] ?? ""}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{setting.title}</p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase">
                      {setting.severity}
                    </span>
                  </div>
                  <code className="text-xs text-muted-foreground">{setting.setting}</code>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                  <pre className="whitespace-pre-wrap rounded bg-muted p-2 text-xs">
                    {setting.example}
                  </pre>
                  {setting.learn_more_url && (
                    <a
                      href={setting.learn_more_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline"
                    >
                      Learn more
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {optimizations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recommended Optimizations ({optimizations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {optimizations.map((opt, i) => (
              <div key={i} className="rounded-md border p-3">
                <code className="text-xs font-semibold">{opt.setting}</code>
                <p className="mt-1 text-xs text-muted-foreground">{opt.reason}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px]">Current</span>
                  <code className="text-xs line-through text-muted-foreground">
                    {JSON.stringify(opt.original)}
                  </code>
                  <span className="text-xs">→</span>
                  <span className="rounded bg-green-50 px-2 py-0.5 text-[10px] text-green-700 dark:bg-green-950 dark:text-green-300">
                    Recommended
                  </span>
                  <code className="text-xs font-medium text-green-700 dark:text-green-300">
                    {JSON.stringify(opt.recommended)}
                  </code>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
