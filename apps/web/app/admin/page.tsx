"use client"

import Link from "next/link"

import { AdminShell } from "@/components/admin-shell"
import { AdminStat } from "@/components/admin-table"
import { PageHeader, StatusDot } from "@/components/page-header"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

import { timeAgo } from "@/lib/format"
import {
  useAdminAudit,
  useAdminHealth,
  useAdminOverview,
} from "@/hooks/admin"

export default function AdminOverviewPage() {
  const overview = useAdminOverview()
  const health = useAdminHealth()
  const audit = useAdminAudit({ page_size: 8 })
  const o = overview.data

  return (
    <AdminShell crumbs={["Overview"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Platform overview"
          description="Monitor users, bots, messages and system health."
          actions={
            <Button variant="outline" size="sm" render={<Link href="/admin/notifications" />}>
              Send announcement
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {overview.isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : o && (
                <>
                  <AdminStat label="Total users" value={o.users.total} sub={`${o.users.new_today} new today`} />
                  <AdminStat label="Active today" value={o.users.active_today} />
                  <AdminStat label="Verified emails" value={o.users.verified} />
                  <AdminStat label="Organizations" value={o.organizations.total} />
                  <AdminStat label="Bots" value={o.bots.total} sub={`${o.bots.connected} connected`} />
                  <AdminStat label="WA sessions live" value={o.sessions.active} />
                  <AdminStat label="Messages today" value={o.messages.today} />
                  <AdminStat label="Failed messages" value={o.messages.failed} />
                  <AdminStat label="Webhook failures" value={o.webhooks.failed} />
                  <AdminStat label="OTP requests today" value={o.otp.today} />
                </>
              )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>System health</CardTitle>
                <CardDescription>Live component status</CardDescription>
              </div>
              <Badge variant="outline" className="capitalize">
                {health.data?.overall ?? "checking…"}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              {(health.data?.components ?? []).map((c) => (
                <div key={c.key} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{c.name}</span>
                  <span className="flex items-center gap-2 capitalize text-muted-foreground">
                    <StatusDot status={c.status === "operational" ? "connected" : "error"} />
                    {c.status}
                  </span>
                </div>
              ))}
              {health.isLoading && <Skeleton className="h-32 w-full" />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Recent audit activity</CardTitle>
                <CardDescription>Sensitive admin actions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" render={<Link href="/admin/security/audit-logs" />}>
                View all
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {(audit.data?.results ?? []).map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <span className="font-medium">{a.actor_email || "system"}</span>
                    <span className="text-muted-foreground"> {a.action} </span>
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {a.target_type}:{a.target_id.slice(0, 12)}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {timeAgo(a.created_at)} ago
                  </span>
                </div>
              ))}
              {!audit.isLoading && audit.data?.results.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No admin actions recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={cn("flex flex-wrap gap-2")}>
          {[
            ["Users", "/admin/users"],
            ["Bots", "/admin/bots"],
            ["Sessions", "/admin/sessions"],
            ["Security events", "/admin/security/events"],
            ["Feature flags", "/admin/platform/feature-flags"],
            ["Queues", "/admin/system/queues"],
          ].map(([label, href]) => (
            <Button key={href} variant="outline" size="sm" render={<Link href={href!} />}>
              {label}
            </Button>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
