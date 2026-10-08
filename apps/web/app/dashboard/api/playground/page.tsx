"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { CopyButton } from "@/components/copy-button"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, SentIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"

import { tokenStore } from "@/lib/api/client"

const PRESETS: Record<string, { method: string; path: string; body?: string }> = {
  "Send message": {
    method: "POST",
    path: "/messages/send/",
    body: JSON.stringify(
      { bot_id: "<bot_id>", to: "2557XXXXXXXX", type: "text", text: "Hello" },
      null,
      2
    ),
  },
  "List bots": { method: "GET", path: "/bots/" },
  "List conversations": { method: "GET", path: "/conversations/" },
  "List contacts": { method: "GET", path: "/contacts/" },
  "Overview stats": { method: "GET", path: "/dashboard/overview/" },
  "Unread count": { method: "GET", path: "/notifications/unread_count/" },
}

const BASE = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export default function PlaygroundPage() {
  const [method, setMethod] = React.useState("POST")
  const [path, setPath] = React.useState("/messages/send/")
  const [body, setBody] = React.useState(PRESETS["Send message"]!.body ?? "")
  const [sending, setSending] = React.useState(false)
  const [result, setResult] = React.useState<{
    status: number
    ms: number
    requestId: string
    json: unknown
  } | null>(null)

  function applyPreset(name: string) {
    const p = PRESETS[name]
    if (!p) return
    setMethod(p.method)
    setPath(p.path)
    setBody(p.body ?? "")
  }

  async function send() {
    setSending(true)
    setResult(null)
    const started = performance.now()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    const access = tokenStore.getAccess()
    if (access) headers.Authorization = `Bearer ${access}`
    const org = tokenStore.getOrg()
    if (org) headers["X-Organization-ID"] = org
    try {
      const res = await fetch(`${BASE()}/api/v1${path}`, {
        method,
        headers,
        body: method === "GET" || !body ? undefined : body,
      })
      const json = await res.json().catch(() => null)
      setResult({
        status: res.status,
        ms: Math.round(performance.now() - started),
        requestId: res.headers.get("X-Request-ID") ?? "",
        json,
      })
    } catch (e) {
      setResult({
        status: 0,
        ms: Math.round(performance.now() - started),
        requestId: "",
        json: { error: String(e) },
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardShell crumb="API Playground">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="API playground"
          description="Try FomoBot endpoints against your workspace — authenticated as you."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request</CardTitle>
              <CardDescription>Pick a preset or write your own.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel>Endpoint</FieldLabel>
                <Select
                  onValueChange={(v) => {
                    if (typeof v === "string") applyPreset(v)
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Choose a preset…" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(PRESETS).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex gap-2">
                <Select value={method} onValueChange={(v) => setMethod(v ?? method)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["GET", "POST", "PATCH", "DELETE"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    /api/v1
                  </span>
                  <Input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="ps-14 font-mono text-xs"
                  />
                </div>
              </div>
              {method !== "GET" && (
                <Field>
                  <FieldLabel>Body (JSON)</FieldLabel>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={9}
                    className="font-mono text-xs"
                    spellCheck={false}
                  />
                </Field>
              )}
              <Button onClick={send} disabled={sending} className="self-start">
                {sending ? (
                  <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
                )}
                Send request
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Response
                {result && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-mono",
                        result.status >= 400 || result.status === 0
                          ? "border-destructive/40 text-destructive"
                          : "border-primary/40"
                      )}
                    >
                      {result.status || "ERR"}
                    </Badge>
                    <span className="text-xs font-normal text-muted-foreground">
                      {result.ms}ms
                    </span>
                  </div>
                )}
              </CardTitle>
              {result?.requestId && (
                <CardDescription className="flex items-center gap-2 font-mono text-xs">
                  req: {result.requestId}
                  <CopyButton value={result.requestId} size="icon-sm" variant="ghost" />
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {result ? (
                <pre className="max-h-96 overflow-auto rounded-lg bg-muted/60 p-3 font-mono text-xs leading-relaxed">
                  {JSON.stringify(result.json, null, 2)}
                </pre>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  Send a request to see the response here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
