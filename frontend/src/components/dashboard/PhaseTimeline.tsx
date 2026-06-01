import { CheckCircle2, Clock, Loader2 } from "lucide-react"
import type { PhaseInfo } from "@/types/dashboard"

const STATUS_STYLES: Record<string, { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string; label: string }> = {
  complete: { icon: CheckCircle2, color: "text-emerald-500", label: "Complete" },
  "in-progress": { icon: Loader2, color: "text-blue-500", label: "In progress" },
  upcoming: { icon: Clock, color: "text-muted-foreground", label: "Upcoming" },
}

export function PhaseTimeline({ phases }: { phases: PhaseInfo[] }) {
  return (
    <div className="space-y-0">
      {phases.map((p, i) => {
        const status = STATUS_STYLES[p.status] ?? STATUS_STYLES.upcoming
        const Icon = status.icon

        return (
          <div key={p.name} className="relative flex gap-4 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={`flex size-7 items-center justify-center rounded-full border-2 ${p.status === "complete" ? "border-emerald-500 bg-emerald-500/10" : p.status === "in-progress" ? "border-blue-500 bg-blue-500/10" : "border-muted-foreground/30 bg-muted"}`}>
                <Icon className={`size-3.5 ${status.color} ${p.status === "in-progress" ? "animate-spin" : ""}`} />
              </div>
              {i < phases.length - 1 && (
                <div className={`mt-1 w-px flex-1 ${p.status === "complete" ? "bg-emerald-500/40" : "bg-border"}`} />
              )}
            </div>
            <div className="-mt-0.5 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{p.name}</span>
                <span className={`text-xs ${status.color}`}>{status.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
