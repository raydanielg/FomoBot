"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { timeAgo } from "@/lib/format"
import { useAdminSessions } from "@/hooks/admin"

function sessionHealth(s: { state: string; reconnect_attempts: number; last_error: string }) {
  if (s.state === "connected" && s.reconnect_attempts === 0) return "healthy"
  if (s.state === "connected") return "unstable"
  if (s.state === "error") return "error"
  return s.state
}

export default function AdminSessionsPage() {
  const [page, setPage] = React.useState(1)
  const sessions = useAdminSessions({ page })

  return (
    <AdminShell crumbs={["WhatsApp sessions"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="WhatsApp sessions"
          description="Live view of every provider session. Refreshes every 10s."
        />

        <AdminTable
          loading={sessions.isLoading}
          data={sessions.data?.results}
          page={sessions.data?.page}
          totalPages={sessions.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No sessions", description: "Sessions appear when bots request a QR connection." }}
          columns={[
            { header: "Bot", render: (s) => (
              <div>
                <p className="font-medium">{s.bot_name}</p>
                <p className="text-xs text-muted-foreground">{s.organization_name}</p>
              </div>
            )},
            { header: "Phone", render: (s) => <span className="font-mono text-xs">{s.phone_number || "—"}</span> },
            { header: "Provider", render: (s) => <Badge variant="outline">{s.provider}</Badge> },
            { header: "State", render: (s) => {
              const h = sessionHealth(s)
              return (
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1.5 capitalize",
                    h === "healthy" && "text-primary-foreground",
                    h === "unstable" && "text-amber-400",
                    (h === "error" || h === "disconnected") && "text-destructive"
                  )}
                >
                  {s.state}
                </Badge>
              )
            }},
            { header: "Heartbeat", render: (s) => (
              <span className="text-muted-foreground">
                {s.last_heartbeat_at ? timeAgo(s.last_heartbeat_at) + " ago" : "—"}
              </span>
            )},
            { header: "Reconnects", render: (s) => s.reconnect_attempts },
            { header: "Last error", render: (s) => (
              <span className="block max-w-48 truncate text-xs text-muted-foreground">
                {s.last_error || "—"}
              </span>
            )},
          ]}
        />
      </div>
    </AdminShell>
  )
}
