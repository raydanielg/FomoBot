"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminStat, AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

const PUBLIC_ROUTES = [
  "/", "/docs", "/blog", "/about", "/contact", "/security", "/privacy", "/terms",
  "/whatsapp-bot", "/whatsapp-automation", "/whatsapp-api", "/whatsapp-webhooks",
  "/whatsapp-otp", "/whatsapp-api-for-developers", "/whatsapp-customer-support",
  "/whatsapp-notifications", "/whatsapp-chatbot", "/whatsapp-business-automation",
  "/solutions/ecommerce", "/solutions/logistics", "/solutions/healthcare", "/solutions/education",
]

interface RouteHealth {
  path: string
  status: number
  title: string
  description: string
  canonical: string
  jsonLd: boolean
}

function parseHealth(path: string, html: string, status: number): RouteHealth {
  return {
    path,
    status,
    title: /<title[^>]*>([^<]+)<\/title>/.exec(html)?.[1]?.trim() ?? "",
    description: /<meta name="description" content="([^"]+)"/.exec(html)?.[1] ?? "",
    canonical: /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? "",
    jsonLd: /<script type="application\/ld\+json">/.test(html),
  }
}

export default function AdminSeoPage() {
  const [rows, setRows] = React.useState<RouteHealth[] | null>(null)
  const [checking, setChecking] = React.useState(false)

  const runCheck = React.useCallback(async () => {
    setChecking(true)
    const out: RouteHealth[] = []
    for (const path of PUBLIC_ROUTES) {
      try {
        const res = await fetch(path)
        out.push(parseHealth(path, await res.text(), res.status))
      } catch {
        out.push({ path, status: 0, title: "", description: "", canonical: "", jsonLd: false })
      }
    }
    setRows(out)
    setChecking(false)
  }, [])

  React.useEffect(() => { void runCheck() }, [runCheck])

  const missing = rows?.filter((r) => r.status !== 200 || !r.title || !r.description || !r.canonical) ?? []

  return (
    <AdminShell crumbs={["SEO"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="SEO"
          description="Public-route health — titles, descriptions, canonicals, structured data."
          actions={
            <Button size="sm" variant="outline" disabled={checking} onClick={() => void runCheck()}>
              {checking ? "Checking…" : "Re-run checks"}
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-4">
          {rows === null ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
          ) : (
            <>
              <AdminStat label="Public routes" value={rows.length} />
              <AdminStat label="Healthy" value={rows.length - missing.length} />
              <AdminStat label="Issues" value={missing.length} />
              <AdminStat
                label="With JSON-LD"
                value={rows.filter((r) => r.jsonLd).length}
              />
            </>
          )}
        </div>

        <AdminTable
          loading={rows === null}
          data={(rows ?? []).map((r) => ({ ...r, id: r.path }))}
          empty={{ title: "No routes checked yet" }}
          columns={[
            { header: "Route", render: (r) => <span className="font-mono text-xs">{r.path}</span> },
            { header: "HTTP", render: (r) => (
              <Badge variant={r.status === 200 ? "outline" : "destructive"}>{r.status || "ERR"}</Badge>
            )},
            { header: "Title", render: (r) => (
              <span className={`block max-w-64 truncate ${r.title ? "" : "text-destructive"}`}>
                {r.title || "missing"}
              </span>
            )},
            { header: "Description", render: (r) => (
              <span className={`block max-w-64 truncate text-muted-foreground ${r.description ? "" : "text-destructive"}`}>
                {r.description || "missing"}
              </span>
            )},
            { header: "Canonical", render: (r) =>
              r.canonical
                ? <span className="font-mono text-xs text-muted-foreground">✓</span>
                : <span className="text-destructive">missing</span> },
            { header: "JSON-LD", render: (r) => r.jsonLd ? "✓" : <span className="text-destructive">missing</span> },
          ]}
        />
      </div>
    </AdminShell>
  )
}
