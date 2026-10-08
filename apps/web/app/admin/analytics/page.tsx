"use client"

import { AdminShell } from "@/components/admin-shell"
import { AdminStat } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { useAdminOverview } from "@/hooks/admin"

export default function AdminAnalyticsPage() {
  const overview = useAdminOverview()
  const o = overview.data

  return (
    <AdminShell crumbs={["Analytics"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Platform analytics"
          description="High-level metrics across the whole platform."
        />
        {overview.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : o ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStat label="Total users" value={o.users.total} />
            <AdminStat label="Verified users" value={o.users.verified} sub={`${Math.round((o.users.verified / Math.max(o.users.total, 1)) * 100)}%`} />
            <AdminStat label="Bots connected" value={o.bots.connected} sub={`of ${o.bots.total}`} />
            <AdminStat label="Active sessions" value={o.sessions.active} />
            <AdminStat label="Messages today" value={o.messages.today} />
            <AdminStat label="Total messages" value={o.messages.total} />
            <AdminStat label="Failed messages" value={o.messages.failed} />
            <AdminStat label="Failed logins today" value={o.security.failed_logins_today} />
          </div>
        ) : null}
      </div>
    </AdminShell>
  )
}
