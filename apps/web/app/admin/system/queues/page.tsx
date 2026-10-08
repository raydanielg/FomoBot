"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader, StatusDot } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"

import { useAdminQueues } from "@/hooks/admin"

export default function AdminQueuesPage() {
  const queues = useAdminQueues()
  const workers = queues.data?.workers ?? []

  return (
    <AdminShell crumbs={["System", "Queues"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Background jobs"
          description="Celery workers — refreshes every 15s."
          actions={
            <Badge variant="outline" className="gap-1.5">
              <StatusDot status={queues.data?.online ? "connected" : "error"} />
              {queues.data?.online ? `${workers.length} workers online` : "No workers online"}
            </Badge>
          }
        />

        <AdminTable
          loading={queues.isLoading}
          data={workers.map((w) => ({ ...w, id: w.name }))}
          empty={{
            title: "No workers online",
            description: "Start celery with: celery -A config worker -l info",
          }}
          columns={[
            { header: "Worker", render: (w) => <span className="font-mono text-xs">{w.name}</span> },
            { header: "Active tasks", render: (w) => w.active },
            { header: "Scheduled", render: (w) => w.scheduled },
            { header: "Reserved", render: (w) => w.reserved },
          ]}
        />
      </div>
    </AdminShell>
  )
}
