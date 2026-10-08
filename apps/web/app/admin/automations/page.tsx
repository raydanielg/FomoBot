"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"

import { timeAgo } from "@/lib/format"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { AdminAutomation } from "@/lib/api/admin-ext"
import type { Paginated } from "@/types/api"

export default function AdminAutomationsPage() {
  const [page, setPage] = React.useState(1)
  const automations = useQuery({
    queryKey: ["admin", "automations", page],
    queryFn: () => api<Paginated<AdminAutomation>>(`/admin/automations/`, { params: { page } }),
  })

  return (
    <AdminShell crumbs={["Automations"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Automations"
          description="Every customer automation rule on the platform."
        />

        <AdminTable
          loading={automations.isLoading}
          data={automations.data?.results}
          page={automations.data?.page}
          totalPages={automations.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No automations yet" }}
          columns={[
            { header: "Name", render: (a) => <span className="font-medium">{a.name}</span> },
            { header: "Organization", render: (a) => <span className="text-muted-foreground">{a.organization_name}</span> },
            { header: "Trigger", render: (a) => <Badge variant="secondary" className="font-mono text-xs">{a.trigger_type}</Badge> },
            { header: "Status", render: (a) => <Badge variant="outline" className="capitalize">{a.status}</Badge> },
            { header: "Runs", render: (a) => a.run_count },
            { header: "Created", render: (a) => <span className="text-muted-foreground">{timeAgo(a.created_at)} ago</span> },
          ]}
        />
      </div>
    </AdminShell>
  )
}
