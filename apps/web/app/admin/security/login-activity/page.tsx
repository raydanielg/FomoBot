"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"

import { timeAgo } from "@/lib/format"
import { useAdminLoginActivity } from "@/hooks/admin"
import type { AdminLoginActivity } from "@/lib/api/admin"

export default function LoginActivityPage() {
  const activity = useAdminLoginActivity()
  const rows = Array.isArray(activity.data) ? activity.data : (activity.data?.results ?? [])

  return (
    <AdminShell crumbs={["Security", "Login activity"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Login activity"
          description="Recent authentication attempts across the platform."
        />

        <AdminTable
          loading={activity.isLoading}
          data={rows as AdminLoginActivity[]}
          empty={{ title: "No login activity" }}
          columns={[
            { header: "Time", render: (a) => <span className="text-muted-foreground">{timeAgo(a.created_at)} ago</span> },
            { header: "Email", render: (a) => <span className="font-medium">{a.email}</span> },
            { header: "Result", render: (a) => (
              <Badge variant={a.result === "success" ? "outline" : "destructive"} className="capitalize">
                {a.result}
              </Badge>
            )},
            { header: "IP", render: (a) => <span className="font-mono text-xs">{a.ip_address ?? "—"}</span> },
            { header: "Agent", render: (a) => (
              <span className="block max-w-72 truncate text-xs text-muted-foreground">{a.user_agent || "—"}</span>
            )},
          ]}
        />
      </div>
    </AdminShell>
  )
}
