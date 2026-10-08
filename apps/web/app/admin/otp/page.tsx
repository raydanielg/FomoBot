"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminStat, AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { timeAgo } from "@/lib/format"
import { useAdminOtps, useAdminOtpInvalidate, useAdminOtpStats } from "@/hooks/admin"

export default function AdminOtpPage() {
  const [page, setPage] = React.useState(1)
  const otps = useAdminOtps({ page })
  const stats = useAdminOtpStats()
  const invalidate = useAdminOtpInvalidate()

  return (
    <AdminShell crumbs={["OTP"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="OTP management"
          description="Hashed, expiring verification codes. Raw codes are never stored or shown."
        />

        <div className="grid gap-3 sm:grid-cols-4">
          {stats.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : stats.data && (
                <>
                  <AdminStat label="Requests today" value={stats.data.today} />
                  <AdminStat label="Verified" value={stats.data.verified} />
                  <AdminStat label="Blocked" value={stats.data.failed} />
                  <AdminStat label="Expired" value={stats.data.expired} />
                </>
              )}
        </div>

        <AdminTable
          loading={otps.isLoading}
          data={otps.data?.results}
          page={otps.data?.page}
          totalPages={otps.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No OTP requests yet" }}
          columns={[
            { header: "Identifier", render: (o) => <span className="font-mono text-xs">{o.identifier}</span> },
            { header: "User", render: (o) => o.user_email || "—" },
            { header: "Purpose", render: (o) => <Badge variant="outline" className="font-mono text-xs">{o.purpose}</Badge> },
            { header: "Channel", render: (o) => <span className="capitalize">{o.channel}</span> },
            { header: "Status", render: (o) => (
              <Badge
                variant={o.status === "verified" ? "outline" : o.status === "blocked" ? "destructive" : "secondary"}
                className="capitalize"
              >
                {o.status}
              </Badge>
            )},
            { header: "Attempts", render: (o) => `${o.attempts}/${o.max_attempts}` },
            { header: "Expires", render: (o) => <span className="text-muted-foreground">{timeAgo(o.expires_at)}</span> },
            { header: "", className: "w-10", render: (o) =>
              o.status === "pending" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="OTP actions" />}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        invalidate.mutate(o.id, {
                          onSuccess: () => toast.success("OTP invalidated"),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      Invalidate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null },
          ]}
        />
      </div>
    </AdminShell>
  )
}
