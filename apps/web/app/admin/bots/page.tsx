"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { botStatusMeta, timeAgo } from "@/lib/format"
import { useAdminBotActions, useAdminBots } from "@/hooks/admin"

export default function AdminBotsPage() {
  const [page, setPage] = React.useState(1)
  const bots = useAdminBots({ page })
  const actions = useAdminBotActions()

  const run = (id: string, action: keyof typeof actions, label: string) =>
    actions[action].mutate(id, {
      onSuccess: () => toast.success(label),
      onError: (e) => toast.error(errorMessage(e)),
    })

  return (
    <AdminShell crumbs={["Bots"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader title="Bots" description="Every WhatsApp bot across all organizations." />

        <AdminTable
          loading={bots.isLoading}
          data={bots.data?.results}
          page={bots.data?.page}
          totalPages={bots.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No bots on the platform" }}
          columns={[
            { header: "Bot", render: (b) => (
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.phone_number || "no phone"}</p>
              </div>
            )},
            { header: "Organization", render: (b) => <span className="text-muted-foreground">{b.organization_name}</span> },
            { header: "Status", render: (b) => {
              const meta = botStatusMeta(b.connection_status)
              return (
                <Badge variant="outline" className={cn("gap-1.5", meta.className)}>
                  <span className={cn("size-1.5 rounded-full", meta.dot)} />
                  {meta.label}
                </Badge>
              )
            }},
            { header: "Bot state", render: (b) => <span className="capitalize text-muted-foreground">{b.status}</span> },
            { header: "Session", render: (b) => <span className="font-mono text-xs text-muted-foreground">{b.session_state ?? "—"}</span> },
            { header: "Last seen", render: (b) => <span className="text-muted-foreground">{b.last_seen_at ? timeAgo(b.last_seen_at) + " ago" : "Never"}</span> },
            { header: "", className: "w-10", render: (b) => (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Bot actions" />}>
                  <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => run(b.id, "reconnect", "Reconnecting…")}>
                    Reconnect
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => run(b.id, "disconnect", "Disconnected")}>
                    Disconnect
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => run(b.id, "logout", "Session logged out")}>
                    Force logout
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {b.status === "active" ? (
                    <DropdownMenuItem className="text-destructive" onClick={() => run(b.id, "disable", "Bot disabled")}>
                      Disable bot
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => run(b.id, "enable", "Bot enabled")}>
                      Enable bot
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )},
          ]}
        />
      </div>
    </AdminShell>
  )
}
