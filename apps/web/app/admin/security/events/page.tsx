"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"

import { timeAgo } from "@/lib/format"
import { useAdminSecurityEvents } from "@/hooks/admin"

export default function SecurityEventsPage() {
  const [page, setPage] = React.useState(1)
  const events = useAdminSecurityEvents({ page })

  return (
    <AdminShell crumbs={["Security", "Events"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Security events"
          description="Failed logins, abuse, rate-limit hits and permission changes."
        />

        <AdminTable
          loading={events.isLoading}
          data={events.data?.results}
          page={events.data?.page}
          totalPages={events.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No security events", description: "The platform is quiet." }}
          columns={[
            { header: "Time", render: (e) => <span className="text-muted-foreground">{timeAgo(e.created_at)} ago</span> },
            { header: "Event", render: (e) => <Badge variant="secondary" className="font-mono text-xs">{e.kind}</Badge> },
            { header: "User", render: (e) => e.user_email || "—" },
            { header: "Detail", render: (e) => (
              <span className="block max-w-80 truncate text-muted-foreground">{e.detail}</span>
            )},
            { header: "IP", render: (e) => <span className="font-mono text-xs">{e.ip_address ?? "—"}</span> },
          ]}
        />
      </div>
    </AdminShell>
  )
}
