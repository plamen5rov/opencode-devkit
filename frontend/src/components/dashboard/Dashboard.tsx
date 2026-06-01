import { useMemo } from "react"
import { Activity, CheckCircle2, ClipboardList, LayoutDashboard } from "lucide-react"
import { getDashboard } from "@/lib/api"
import { FeatureCard } from "@/components/dashboard/FeatureCard"
import { PhaseTimeline } from "@/components/dashboard/PhaseTimeline"

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

export function Dashboard() {
  const data = useMemo(() => getDashboard(), [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of OpenCode DevKit features and project roadmap
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard label="Total Features" value={data.total_features} icon={ClipboardList} />
        <StatsCard label="Implemented" value={`${data.implemented_features} / ${data.total_features}`} icon={CheckCircle2} />
        <StatsCard label="Phases Complete" value={`${data.completed_phases} / ${data.total_phases}`} icon={Activity} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Features</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.features.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium">Roadmap</h3>
        <div className="rounded-lg border bg-card p-4">
          <PhaseTimeline phases={data.phases} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <LayoutDashboard className="size-3" />
        <span>{data.title} v{data.version}</span>
      </div>
    </div>
  )
}
