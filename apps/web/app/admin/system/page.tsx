"use client"

import Link from "next/link"

import { AdminShell } from "@/components/admin-shell"
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

import { useAdminHealth } from "@/hooks/admin"

export default function AdminSystemPage() {
  const health = useAdminHealth()

  return (
    <AdminShell crumbs={["System", "Health"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="System health"
          description="Live checks run every 30 seconds."
          actions={
            <Badge variant="outline" className="capitalize">
              {health.data?.overall ?? "checking…"}
            </Badge>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {health.isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            : health.data?.components.map((c) => (
                <Card key={c.key}>
                  <CardHeader className="pb-2">
                    <CardDescription>{c.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 text-sm font-medium capitalize">
                    <StatusDot status={c.status === "operational" ? "connected" : "error"} />
                    {c.status}
                  </CardContent>
                </Card>
              ))}
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Background jobs</CardTitle>
            <CardDescription>Celery workers and queue depth.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" render={<Link href="/admin/system/queues" />}>
              Open queue monitor
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
