"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"

import { api } from "@/lib/api/client"
import { timeAgo } from "@/lib/format"
import { useQuery } from "@tanstack/react-query"
import type { AdminConversation } from "@/lib/api/admin-ext"
import type { Paginated } from "@/types/api"

export default function AdminConversationsPage() {
  const [page, setPage] = React.useState(1)
  const conversations = useQuery({
    queryKey: ["admin", "conversations", page],
    queryFn: () => api<Paginated<AdminConversation>>(`/admin/conversations/`, { params: { page } }),
  })

  return (
    <AdminShell crumbs={["Conversations"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader title="Conversations" description="Platform-wide conversation monitoring." />

        <AdminTable
          loading={conversations.isLoading}
          data={conversations.data?.results}
          page={conversations.data?.page}
          totalPages={conversations.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No conversations" }}
          columns={[
            { header: "Bot", render: (c) => (
              <div>
                <p className="font-medium">{c.bot_name}</p>
                <p className="text-xs text-muted-foreground">{c.organization_name}</p>
              </div>
            )},
            { header: "Status", render: (c) => <Badge variant="outline" className="capitalize">{c.status}</Badge> },
            { header: "Unread", render: (c) => c.unread_count || <span className="text-muted-foreground">0</span> },
            { header: "Last message", render: (c) => (
              <span className="text-muted-foreground">{c.last_message_at ? timeAgo(c.last_message_at) + " ago" : "—"}</span>
            )},
            { header: "Created", render: (c) => (
              <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
            )},
          ]}
        />
      </div>
    </AdminShell>
  )
}
