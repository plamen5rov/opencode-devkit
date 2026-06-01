import { CheckCircle2, Clock } from "lucide-react"
import type { FeatureInfo } from "@/types/dashboard"

export function FeatureCard({ feature: f }: { feature: FeatureInfo }) {

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        f.implemented
          ? "bg-card hover:border-primary/50"
          : "cursor-not-allowed opacity-50"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className={`flex size-8 items-center justify-center rounded-md ${f.implemented ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"}`}>
          {f.implemented ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}
        </div>
        <div>
          <div className="text-sm font-medium">{f.label}</div>
          <div className="text-xs text-muted-foreground">Phase {f.phase}</div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
    </div>
  )
}
