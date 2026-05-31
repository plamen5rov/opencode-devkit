import { useState, useCallback, useRef, type DragEvent } from "react"
import { FileUp, ClipboardPaste, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  onAnalyze: (content: string) => void
  loading: boolean
}

export function ConfigUpload({ onAnalyze, loading }: Props) {
  const [content, setContent] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        const text = reader.result as string
        setContent(text)
        onAnalyze(text)
      }
      reader.readAsText(file)
    },
    [onAnalyze],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setContent(text)
      onAnalyze(text)
    } catch {
      // clipboard access denied
    }
  }, [onAnalyze])

  return (
    <Card
      className="cursor-pointer transition-colors"
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upload or paste an opencode.json</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
        >
          <textarea
            className="w-full rounded-md border bg-transparent p-3 font-mono text-xs leading-relaxed"
            style={{ minHeight: "180px", maxHeight: "500px", resize: "vertical", overflow: "auto" }}
            rows={12}
            placeholder='Paste your opencode.json content here, or use the buttons below...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
              disabled={loading}
            >
              <ClipboardPaste className="mr-1 size-3" />
              Paste from clipboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Upload className="mr-1 size-3" />
              Upload file
            </Button>
            <Button
              size="sm"
              onClick={() => onAnalyze(content)}
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <Loader2 className="mr-1 size-3 animate-spin" />
              ) : (
                <FileUp className="mr-1 size-3" />
              )}
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.jsonc"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
