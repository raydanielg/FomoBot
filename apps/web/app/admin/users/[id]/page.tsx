"use client"

import * as React from "react"
import { useParams } from "next/navigation"

import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { initials, timeAgo } from "@/lib/format"
import {
  useAdminUser,
  useAdminUserActions,
  useAdminUserNotes,
} from "@/hooks/admin"

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAdminUser(id)
  const notes = useAdminUserNotes(id)
  const actions = useAdminUserActions(id)
  const [note, setNote] = React.useState("")

  const u = user.data

  return (
    <AdminShell crumbs={["Users", u?.email ?? "…"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        {user.isLoading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : u && (
          <>
            <PageHeader
              title={u.full_name || u.email}
              description={u.email}
              actions={
                <div className="flex gap-2">
                  {u.is_active ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        actions.suspend.mutate({ id: u.id, reason: "suspended from admin" }, {
                          onSuccess: () => toast.success("Suspended"),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => actions.activate.mutate(u.id, { onSuccess: () => toast.success("Activated") })}>
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      actions.forceLogout.mutate(u.id, { onSuccess: () => toast.success("Sessions revoked") })
                    }
                  >
                    Force logout
                  </Button>
                </div>
              }
            />

            <div className="flex items-start gap-4 rounded-xl border border-border p-4">
              <Avatar className="size-14">
                <AvatarFallback className="text-lg">{initials(u.full_name || u.email)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={u.is_active ? "outline" : "destructive"} className="mt-1 capitalize">
                    {u.is_active ? "active" : "suspended"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email verified</p>
                  <p className="mt-1 font-medium">{u.is_email_verified ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last login</p>
                  <p className="mt-1 font-medium">{u.last_login_at ? timeAgo(u.last_login_at) + " ago" : "Never"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="mt-1 font-medium">{new Date(u.date_joined).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Failed logins</p>
                  <p className="mt-1 font-medium">{u.failed_login_attempts}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last IP</p>
                  <p className="mt-1 font-mono text-xs font-medium">{u.last_login_ip ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">2FA</p>
                  <p className="mt-1 font-medium">{u.totp_enabled ? "Enabled" : "Off"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Staff</p>
                  <p className="mt-1 font-medium">{u.is_staff ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>{u.organizations?.length ?? 0} memberships</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {(u.organizations ?? []).map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{o.name}</span>
                      <Badge variant="outline" className="capitalize">{o.role}</Badge>
                    </div>
                  ))}
                  {!u.organizations?.length && (
                    <p className="text-sm text-muted-foreground">No organizations.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bots</CardTitle>
                  <CardDescription>{u.bots?.length ?? 0} owned</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {(u.bots ?? []).map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{b.name}</span>
                      <Badge variant="outline" className="capitalize">{b.status}</Badge>
                    </div>
                  ))}
                  {!u.bots?.length && <p className="text-sm text-muted-foreground">No bots.</p>}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Internal notes</CardTitle>
                <CardDescription>Never visible to the user.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!note.trim()) return
                    actions.addNote.mutate(
                      { id: u.id, body: note },
                      { onSuccess: () => { setNote(""); toast.success("Note added") } }
                    )
                  }}
                >
                  <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. customer reported morning disconnects"
                  />
                  <Button size="sm" disabled={actions.addNote.isPending}>Add</Button>
                </form>
                {(notes.data ?? []).map((n) => (
                  <div key={n.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p>{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {n.author_email} · {timeAgo(n.created_at)} ago
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminShell>
  )
}
