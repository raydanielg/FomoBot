"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"

import { timeAgo } from "@/lib/format"
import { useAdminMessages } from "@/hooks/admin"

const STATUS_TONE: Record<string, string> = {
  read: "text-blue-400",
  delivered: "text-primary-foreground",
  sent: "text-muted-foreground",
  failed: "text-destructive",
  queued: "text-amber-400",
}

export default function AdminMessagesPage() {
  const [page, setPage] = React.useState(1)
  const [direction, setDirection] = React.useState<string>("")
  const [status, setStatus] = React.useState<string>("")

  const messages = useAdminMessages({
    page,
    direction: direction || undefined,
    status: status || undefined,
  })

  return (
    <AdminShell crumbs={["Messages"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Message explorer"
          description="Every message across the platform."
          actions={
            <div className="flex gap-2">
              <Select value={direction} onValueChange={(v) => { setDirection(v === "all" ? "" : String(v)); setPage(1) }}>
                <SelectTrigger className="w-32" aria-label="Direction">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => { setStatus(v === "all" ? "" : String(v)); setPage(1) }}>
                <SelectTrigger className="w-32" aria-label="Status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        <AdminTable
          loading={messages.isLoading}
          data={messages.data?.results}
          page={messages.data?.page}
          totalPages={messages.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No messages match these filters" }}
          columns={[
            { header: "Time", render: (m) => <span className="text-muted-foreground">{timeAgo(m.created_at)} ago</span> },
            { header: "Bot", render: (m) => (
              <div>
                <p className="font-medium">{m.bot_name}</p>
                <p className="text-xs text-muted-foreground">{m.organization_name}</p>
              </div>
            )},
            { header: "Direction", render: (m) => (
              <Badge variant={m.direction === "inbound" ? "secondary" : "outline"} className="capitalize">
                {m.direction}
              </Badge>
            )},
            { header: "Type", render: (m) => <span className="text-muted-foreground">{m.message_type}</span> },
            { header: "Content", render: (m) => (
              <span className="block max-w-64 truncate text-muted-foreground">{m.text || `[${m.message_type}]`}</span>
            )},
            { header: "Status", render: (m) => (
              <span className={`capitalize ${STATUS_TONE[m.status] ?? ""}`}>{m.status}</span>
            )},
            { header: "Provider ID", render: (m) => (
              <span className="font-mono text-xs text-muted-foreground">{m.provider_message_id || "—"}</span>
            )},
          ]}
        />
      </div>
    </AdminShell>
  )
}
