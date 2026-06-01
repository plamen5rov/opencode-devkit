import { useMemo, useState } from "react"
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  Search,
  Terminal,
  Wand2,
  Puzzle,
  FileJson,
  Clock,
} from "lucide-react"
import { getDashboard } from "@/lib/api"
import { getActivityLog, ACTIVITY_LABELS } from "@/lib/activity"
import type { ActivityEntry } from "@/lib/activity"
import type { FeatureInfo } from "@/lib/data/features"
import { FeatureCard } from "@/components/dashboard/FeatureCard"
import { PhaseTimeline } from "@/components/dashboard/PhaseTimeline"

const ACTIVITY_ICONS: Record<ActivityEntry["type"], React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  config: FileJson,
  skill: Wand2,
  command: Terminal,
  mcp: Activity,
  tool: Puzzle,
}

function StatsCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

function exportDashboard(data: ReturnType<typeof getDashboard>): void {
  const lines = [
    "# OpenCode DevKit — Dashboard Report",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "## Metrics",
    `- **Total Features**: ${data.total_features}`,
    `- **Implemented**: ${data.implemented_features} / ${data.total_features}`,
    `- **Phases Complete**: ${data.completed_phases} / ${data.total_phases}`,
    "",
    "## Features",
    "| Feature | Phase | Description |",
    "|---------|-------|-------------|",
    ...data.features.map((f) => `| ${f.label} | ${f.phase} | ${f.description.slice(0, 80)}${f.description.length > 80 ? "..." : ""} |`),
    "",
    "## Roadmap",
    ...data.phases.flatMap((p) => [
      `### ${p.name} (${p.status})`,
      p.description,
      "",
    ]),
  ]

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `opencode-devkit-report-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function Dashboard() {
  const data = useMemo(() => getDashboard(), [])
  const [search, setSearch] = useState("")
  const [activity] = useState<ActivityEntry[]>(() => getActivityLog().slice(0, 10))

  const filteredFeatures = useMemo(() => {
    if (!search.trim()) return data.features
    const q = search.toLowerCase()
    return data.features.filter(
      (f: FeatureInfo) =>
        f.label.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.phase.toLowerCase().includes(q),
    )
  }, [data.features, search])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Overview of OpenCode DevKit features and project roadmap
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => exportDashboard(data)}
        >
          <Download className="size-3" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total Features" value={data.total_features} icon={ClipboardList} />
        <StatsCard label="Implemented" value={`${data.implemented_features} / ${data.total_features}`} icon={CheckCircle2} />
        <StatsCard label="Phases Complete" value={`${data.completed_phases} / ${data.total_phases}`} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredFeatures.map((f) => (
              <FeatureCard key={f.id} feature={f} />
            ))}
            {filteredFeatures.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full">No features match &ldquo;{search}&rdquo;</p>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Roadmap</h3>
            <div className="rounded-lg border bg-card p-4">
              <PhaseTimeline phases={data.phases} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium">Recent Activity</h3>
          {activity.length === 0 ? (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                <span>No activity yet. Run an analysis to see entries here.</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card">
              {activity.map((entry) => {
                const Icon = ACTIVITY_ICONS[entry.type] ?? FileText
                return (
                  <div key={entry.id} className="flex items-start gap-3 border-b p-3 last:border-b-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded bg-muted">
                      <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium">{ACTIVITY_LABELS[entry.type]}</div>
                      <div className="text-xs text-muted-foreground truncate">{entry.message}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LayoutDashboard className="size-3" />
        <span>{data.title} v{data.version}</span>
      </div>
    </div>
  )
}
