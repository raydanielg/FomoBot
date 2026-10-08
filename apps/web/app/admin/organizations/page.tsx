"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon, SearchIcon } from "@hugeicons/core-free-icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { timeAgo } from "@/lib/format"
import { useAdminOrgActions, useAdminOrgs, useAdminPlans } from "@/hooks/admin"
import type { AdminOrg } from "@/lib/api/admin"

export default function AdminOrgsPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [suspending, setSuspending] = React.useState<AdminOrg | null>(null)
  const orgs = useAdminOrgs({ search: search || undefined, page })
  const plans = useAdminPlans()
  const actions = useAdminOrgActions()

  return (
    <AdminShell crumbs={["Organizations"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Organizations"
          description="Workspaces belonging to your customers."
          actions={
            <div className="relative">
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search organizations…"
                className="w-56 ps-8"
              />
            </div>
          }
        />

        <AdminTable
          loading={orgs.isLoading}
          data={orgs.data?.results}
          page={orgs.data?.page}
          totalPages={orgs.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No organizations" }}
          columns={[
            { header: "Organization", render: (o) => (
              <div>
                <p className="font-medium">{o.name}</p>
                <p className="text-xs text-muted-foreground">{o.slug}</p>
              </div>
            )},
            { header: "Owner", render: (o) => <span className="text-muted-foreground">{o.owner_email}</span> },
            { header: "Members", render: (o) => o.member_count },
            { header: "Bots", render: (o) => o.bot_count },
            { header: "Plan", render: (o) => <Badge variant="outline" className="uppercase">{o.plan_code || "free"}</Badge> },
            { header: "Status", render: (o) => (
              <Badge variant={o.status === "active" ? "outline" : "destructive"} className="capitalize">{o.status}</Badge>
            )},
            { header: "Created", render: (o) => <span className="text-muted-foreground">{timeAgo(o.created_at)} ago</span> },
            { header: "", className: "w-10", render: (o) => (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Org actions" />}>
                  <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change plan</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {(plans.data?.results ?? []).map((p) => (
                        <DropdownMenuItem
                          key={p.id}
                          disabled={p.code === o.plan_code}
                          onClick={() =>
                            actions.changePlan.mutate(
                              { id: o.id, plan: p.code },
                              {
                                onSuccess: () => toast.success(`Plan → ${p.code}`),
                                onError: (e) => toast.error(errorMessage(e)),
                              }
                            )
                          }
                        >
                          {p.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  {o.status === "active" ? (
                    <DropdownMenuItem className="text-destructive" onClick={() => setSuspending(o)}>
                      Suspend organization
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        actions.activate.mutate(o.id, {
                          onSuccess: () => toast.success("Organization activated"),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      Activate
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )},
          ]}
        />
      </div>

      <AlertDialog open={!!suspending} onOpenChange={() => setSuspending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {suspending?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              All {suspending?.member_count} members will lose access and {suspending?.bot_count} bots will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                suspending &&
                actions.suspend.mutate(suspending.id, {
                  onSuccess: () => {
                    toast.success("Organization suspended")
                    setSuspending(null)
                  },
                  onError: (e) => toast.error(errorMessage(e)),
                })
              }
            >
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
