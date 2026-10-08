"use client"

import * as React from "react"
import Link from "next/link"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreHorizontalIcon,
  SearchIcon,
  UserCheckIcon,
  UserBlockIcon,
} from "@hugeicons/core-free-icons"
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
import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"

import { errorMessage, tokenStore } from "@/lib/api/client"
import { initials, timeAgo } from "@/lib/format"
import { useAdminUserActions, useAdminUsers } from "@/hooks/admin"
import type { AdminUser } from "@/lib/api/admin"

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [suspending, setSuspending] = React.useState<AdminUser | null>(null)
  const [suspendReason, setSuspendReason] = React.useState("")
  const [impersonating, setImpersonating] = React.useState<AdminUser | null>(null)

  const users = useAdminUsers({ search: search || undefined, page })
  const actions = useAdminUserActions()

  return (
    <AdminShell crumbs={["Users"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Users"
          description="Every account on the platform."
          actions={
            <div className="relative">
              <HugeiconsIcon icon={SearchIcon} strokeWidth={2} className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search email or name…"
                className="w-56 ps-8"
              />
            </div>
          }
        />

        <AdminTable
          loading={users.isLoading}
          data={users.data?.results}
          page={users.data?.page}
          totalPages={users.data?.total_pages}
          onPage={setPage}
          empty={{ title: "No users found" }}
          columns={[
            {
              header: "User",
              render: (u) => (
                <Link href={`/admin/users/${u.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{initials(u.full_name || u.email)}</AvatarFallback>
                  </Avatar>
                  <span>
                    {u.full_name || "—"}
                    <span className="block text-xs font-normal text-muted-foreground">{u.email}</span>
                  </span>
                </Link>
              ),
            },
            {
              header: "Status",
              render: (u) => (
                <Badge variant={u.is_active ? "outline" : "destructive"} className="capitalize">
                  {u.is_active ? "active" : "suspended"}
                </Badge>
              ),
            },
            {
              header: "Verified",
              render: (u) =>
                u.is_email_verified ? (
                  <HugeiconsIcon icon={UserCheckIcon} strokeWidth={2} className="size-4 text-primary-foreground" />
                ) : (
                  <span className="text-xs text-muted-foreground">pending</span>
                ),
            },
            { header: "Orgs", render: (u) => u.organization_count },
            { header: "Bots", render: (u) => u.bot_count },
            {
              header: "Last login",
              render: (u) => (
                <span className="text-muted-foreground">
                  {u.last_login_at ? timeAgo(u.last_login_at) + " ago" : "Never"}
                </span>
              ),
            },
            {
              header: "Created",
              render: (u) => (
                <span className="text-muted-foreground">
                  {new Date(u.date_joined).toLocaleDateString()}
                </span>
              ),
            },
            {
              header: "",
              className: "w-10",
              render: (u) => (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="User actions" />}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem render={<Link href={`/admin/users/${u.id}`} />}>
                      View detail
                    </DropdownMenuItem>
                    {!u.is_email_verified && (
                      <DropdownMenuItem
                        onClick={() =>
                          actions.verifyEmail.mutate(u.id, {
                            onSuccess: () => toast.success("Email marked verified"),
                            onError: (e) => toast.error(errorMessage(e)),
                          })
                        }
                      >
                        Mark email verified
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() =>
                        actions.resetPassword.mutate(
                          { id: u.id },
                          {
                            onSuccess: () => toast.success("Password reset to random — share securely"),
                            onError: (e) => toast.error(errorMessage(e)),
                          }
                        )
                      }
                    >
                      Reset password
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        actions.forceLogout.mutate(u.id, {
                          onSuccess: () => toast.success("Sessions revoked"),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      Force logout
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setImpersonating(u)}>
                      Impersonate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {u.is_active ? (
                      <DropdownMenuItem className="text-destructive" onClick={() => setSuspending(u)}>
                        <HugeiconsIcon icon={UserBlockIcon} strokeWidth={2} />
                        Suspend
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() =>
                          actions.activate.mutate(u.id, {
                            onSuccess: () => toast.success("User activated"),
                            onError: (e) => toast.error(errorMessage(e)),
                          })
                        }
                      >
                        Activate
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
        />
      </div>

      <AlertDialog open={!!suspending} onOpenChange={() => setSuspending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {suspending?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be signed out and cannot use the platform until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Reason (required for audit)…"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={!suspendReason.trim()}
              onClick={() =>
                suspending &&
                actions.suspend.mutate(
                  { id: suspending.id, reason: suspendReason },
                  {
                    onSuccess: () => {
                      toast.success("User suspended")
                      setSuspending(null)
                      setSuspendReason("")
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Suspend user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!impersonating} onOpenChange={() => setImpersonating(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Impersonate {impersonating?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll get a session token for this user. The action is recorded
              in the audit log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                impersonating &&
                actions.impersonate.mutate(impersonating.id, {
                  onSuccess: (res) => {
                    const data = res as { tokens: { access: string; refresh: string } }
                    tokenStore.setTokens(data.tokens.access, data.tokens.refresh)
                    toast.success(`Now impersonating ${impersonating.email}`)
                    window.location.href = "/dashboard"
                  },
                  onError: (e) => toast.error(errorMessage(e)),
                })
              }
            >
              Impersonate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
