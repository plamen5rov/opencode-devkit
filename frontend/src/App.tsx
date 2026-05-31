import { useEffect, useState } from "react"
import { Activity, Code2, FileJson, Puzzle, Settings, Terminal, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfigAnalyzer } from "@/components/config-analyzer/ConfigAnalyzer"

const features = [
  { id: "json-config", label: "JSON Config", icon: FileJson, implemented: true },
  { id: "skill-analyzer", label: "Skill Analyzer", icon: Wand2, implemented: false },
  { id: "command-analyzer", label: "Command Analyzer", icon: Terminal, implemented: false },
  { id: "tool-analyzer", label: "Tool Analyzer", icon: Puzzle, implemented: false },
  { id: "mcp-analyzer", label: "MCP Analyzer", icon: Activity, implemented: false },
]

function App() {
  const [activeFeature, setActiveFeature] = useState(features[0].id)
  const [backendStatus, setBackendStatus] = useState<"loading" | "ok" | "error">("loading")
  const [clearKey, setClearKey] = useState(0)

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") setBackendStatus("ok")
        else setBackendStatus("error")
      })
      .catch(() => setBackendStatus("error"))
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold">
            <Code2 className="size-5" />
            <span>OpenCode DevKit</span>
          </div>
          <span
            className={`size-2 rounded-full ${
              backendStatus === "loading"
                ? "bg-yellow-400"
                : backendStatus === "ok"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
            title={
              backendStatus === "loading"
                ? "Connecting..."
                : backendStatus === "ok"
                  ? "API connected"
                  : "API disconnected"
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setClearKey((k) => k + 1)}>
            Clear All Data
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 border-r p-3 flex flex-col gap-1">
          {features.map((f) => (
            <Button
              key={f.id}
              variant={activeFeature === f.id ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setActiveFeature(f.id)}
            >
              <f.icon className="size-4" />
              {f.label}
            </Button>
          ))}
        </aside>

        <main className="flex-1 overflow-auto p-6">
          {activeFeature === "json-config" ? (
            <ConfigAnalyzer key={clearKey} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.id} className={f.implemented ? "" : "opacity-50"}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <f.icon className="size-4" />
                      <CardTitle className="text-sm">{f.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {f.implemented ? "Ready" : "Coming soon — Phase II+"}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
