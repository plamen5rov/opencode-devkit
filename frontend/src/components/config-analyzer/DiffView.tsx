import { Plus, Minus, Pencil } from "lucide-react"
import type { DiffusionEntry } from "@/types/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  changes: DiffusionEntry[]
  originalLabel?: string
  modifiedLabel?: string
}

const changeIcons: Record<DiffusionEntry["change"], typeof Plus> = {
  added: Plus,
  removed: Minus,
  changed: Pencil,
}

const changeColors: Record<DiffusionEntry["change"], string> = {
  added: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  removed: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
  changed: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
}

export function DiffView({ changes, originalLabel = "Original", modifiedLabel = "Optimized" }: Props) {
  if (changes.length === 0) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          No changes detected between the two configurations.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Configuration Diff ({changes.length} change{changes.length !== 1 ? "s" : ""})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 text-xs font-medium text-muted-foreground">
          <span>{originalLabel}</span>
          <span />
          <span>{modifiedLabel}</span>
        </div>
        {changes.map((entry, i) => {
          const Icon = changeIcons[entry.change]
          const colors = changeColors[entry.change]
          return (
            <div key={i} className={`rounded-md border p-2 ${colors}`}>
              <div className="mb-1 flex items-center gap-1">
                <Icon className="size-3" />
                <code className="text-[11px] font-semibold">{entry.path}</code>
                <span className="rounded bg-background/50 px-1.5 py-0.5 text-[9px] font-medium uppercase">
                  {entry.change}
                </span>
              </div>
              <p className="mb-2 text-[11px]">{entry.description}</p>
              {(entry.change === "changed" || entry.change === "removed") && entry.original !== undefined && (
                <div className="mb-1 flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded bg-red-100 px-1 text-[9px] text-red-700 dark:bg-red-900 dark:text-red-300">
                    -
                  </span>
                  <code className="text-[11px] whitespace-pre-wrap break-all">
                    {JSON.stringify(entry.original, null, 2)}
                  </code>
                </div>
              )}
              {(entry.change === "changed" || entry.change === "added") && entry.modified !== undefined && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 rounded bg-green-100 px-1 text-[9px] text-green-700 dark:bg-green-900 dark:text-green-300">
                    +
                  </span>
                  <code className="text-[11px] whitespace-pre-wrap break-all">
                    {JSON.stringify(entry.modified, null, 2)}
                  </code>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
