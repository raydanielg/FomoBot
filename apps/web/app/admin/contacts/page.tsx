"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"

import { api } from "@/lib/api/client"
import { timeAgo } from "@/lib/format"
import { useQuery } from "@tanstack/react-query"
import type { AdminContact } from "@/lib/api/admin-ext"
import type { Paginated } from "@/types/api"

export default function AdminContactsPage() {
  const [page, setPage] = React.useState(1)
  const contacts = useQuery({
    queryKey: ["admin", "contacts", page],
    queryFn: () => api<Paginated<AdminContact>>(`/admin/contacts/`, { params: { page } }),
  })

  return (
    <AdminShell crumbs={["Contacts"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader title="Contacts" description="All contacts across organizations." />

        <AdminTable
          loading={contacts.isLoading}
          data={contacts.data?.results}
          page={contacts.data?.page}
          totalPages={contacts.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No contacts" }}
          columns={[
            { header: "Contact", render: (c) => (
              <div>
                <p className="font-medium">{c.name || c.profile_name || "—"}</p>
                <p className="font-mono text-xs text-muted-foreground">{c.phone_number}</p>
              </div>
            )},
            { header: "Organization", render: (c) => <span className="text-muted-foreground">{c.organization_name}</span> },
            { header: "Country", render: (c) => c.country || "—" },
            { header: "Tags", render: (c) => (
              <span className="flex flex-wrap gap-1">
                {(c.tags ?? []).slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                ))}
              </span>
            )},
            { header: "Last seen", render: (c) => (
              <span className="text-muted-foreground">{c.last_seen_at ? timeAgo(c.last_seen_at) + " ago" : "—"}</span>
            )},
          ]}
        />
      </div>
    </AdminShell>
  )
}
