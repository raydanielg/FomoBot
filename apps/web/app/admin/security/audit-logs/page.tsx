"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { CopyButton } from "@/components/copy-button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"

import { timeAgo } from "@/lib/format"
import { useAdminAudit } from "@/hooks/admin"
import type { AdminAuditEntry } from "@/lib/api/admin"

export default function AdminAuditPage() {
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<AdminAuditEntry | null>(null)
  const audit = useAdminAudit({ page })

  return (
    <AdminShell crumbs={["Security", "Audit logs"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Audit logs"
          description="Immutable record of every sensitive action. Click a row for detail."
        />

        <AdminTable
          loading={audit.isLoading}
          data={audit.data?.results}
          page={audit.data?.page}
          totalPages={audit.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No audit entries" }}
          columns={[
            { header: "Time", render: (a) => <span className="text-muted-foreground">{timeAgo(a.created_at)} ago</span> },
            { header: "Actor", render: (a) => <span className="font-medium">{a.actor_email || "system"}</span> },
            { header: "Action", render: (a) => <Badge variant="secondary" className="font-mono text-xs">{a.action}</Badge> },
            { header: "Target", render: (a) => (
              <button
                className="font-mono text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setSelected(a)}
              >
                {a.target_type}:{a.target_id.slice(0, 14)}…
              </button>
            )},
            { header: "IP", render: (a) => <span className="font-mono text-xs text-muted-foreground">{a.ip_address ?? "—"}</span> },
          ]}
        />
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-base">{selected.action}</SheetTitle>
                <SheetDescription>
                  {selected.actor_email} · {new Date(selected.created_at).toLocaleString()}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Log ID</span>
                  <span className="flex items-center gap-1 font-mono text-xs">
                    {selected.id.slice(0, 18)}…
                    <CopyButton value={selected.id} aria-label="Copy log ID" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-mono text-xs">{selected.target_type}:{selected.target_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">IP address</span>
                  <span className="font-mono text-xs">{selected.ip_address ?? "—"}</span>
                </div>
                <div>
                  <p className="mb-1.5 text-muted-foreground">Metadata</p>
                  <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {JSON.stringify(selected.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminShell>
  )
}
