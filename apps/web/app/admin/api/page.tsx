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
import { useApiRequestLogs } from "@/hooks/api"
import type { ApiRequestLog } from "@/types/api"

export default function AdminApiPage() {
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<ApiRequestLog | null>(null)
  const logs = useApiRequestLogs({ page })

  return (
    <AdminShell crumbs={["Platform", "API & Logs"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="API requests"
          description="Requests made through API keys. Secrets are never stored."
        />

        <AdminTable
          loading={logs.isLoading}
          data={logs.data?.results}
          page={logs.data?.page}
          totalPages={logs.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No API requests yet" }}
          columns={[
            { header: "Time", render: (l) => <span className="text-muted-foreground">{timeAgo(l.created_at)} ago</span> },
            { header: "Method", render: (l) => <Badge variant="secondary" className="font-mono text-xs">{l.method}</Badge> },
            { header: "Endpoint", render: (l) => (
              <button
                className="max-w-72 truncate text-start font-mono text-xs hover:underline"
                onClick={() => setSelected(l)}
              >
                {l.endpoint}
              </button>
            )},
            { header: "Status", render: (l) => (
              <span className={l.status_code >= 400 ? "text-destructive" : "text-primary-foreground"}>
                {l.status_code}
              </span>
            )},
            { header: "ms", render: (l) => <span className="text-muted-foreground">{l.response_ms ?? "—"}</span> },
            { header: "IP", render: (l) => <span className="font-mono text-xs text-muted-foreground">{l.ip_address ?? "—"}</span> },
          ]}
        />
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono text-sm">
                  {selected.method} {selected.endpoint}
                </SheetTitle>
                <SheetDescription>
                  {new Date(selected.created_at).toLocaleString()} · {selected.response_ms ?? "—"}ms
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-6 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Request ID</span>
                  <span className="flex items-center gap-1 font-mono text-xs">
                    {selected.request_id}
                    <CopyButton value={selected.request_id} aria-label="Copy request ID" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={selected.status_code >= 400 ? "destructive" : "outline"}>
                    {selected.status_code}
                  </Badge>
                </div>
                {selected.error_code && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Error code</span>
                    <span className="font-mono text-xs text-destructive">{selected.error_code}</span>
                  </div>
                )}
                {selected.ip_address && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">IP</span>
                    <span className="font-mono text-xs">{selected.ip_address}</span>
                  </div>
                )}
                {selected.user_agent && (
                  <div>
                    <p className="mb-1.5 text-muted-foreground">User agent</p>
                    <p className="break-all font-mono text-xs">{selected.user_agent}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminShell>
  )
}
