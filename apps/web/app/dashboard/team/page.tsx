"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyState, PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  GroupIcon,
  Loading03Icon,
  Mail01Icon,
  MoreHorizontalIcon,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { initials, timeAgo } from "@/lib/format"
import { useAuth } from "@/lib/auth"
import { useOrgMembers, useOrgMutations } from "@/hooks/api"
import type { Membership } from "@/types/api"

const ROLES = ["admin", "developer", "agent", "viewer"]

export default function TeamPage() {
  const { organization, user } = useAuth()
  const members = useOrgMembers(organization?.id)
  const mutations = useOrgMutations()
  const [inviting, setInviting] = React.useState(false)
  const [removing, setRemoving] = React.useState<Membership | null>(null)

  const rows = Array.isArray(members.data)
    ? members.data
    : (members.data?.results ?? [])

  return (
    <DashboardShell crumb="Team">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Team"
          description={`People with access to ${organization?.name ?? "this workspace"}.`}
          actions={
            <Button onClick={() => setInviting(true)}>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Invite member
            </Button>
          }
        />

        {members.isLoading ? (
          <div className="rounded-xl border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="m-4 h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={GroupIcon} strokeWidth={2} className="size-6" />}
            title="Just you for now"
            description="Invite teammates to handle conversations or manage the API."
            action={
              <Button onClick={() => setInviting(true)}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Invite member
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {initials(String(m.user))}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {String(m.user)}
                          {m.user === user?.id && (
                            <span className="text-muted-foreground"> (you)</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.role === "owner" ? "default" : "outline"} className="capitalize">
                        {m.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {m.status}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.joined_at ? timeAgo(m.joined_at) + " ago" : "—"}
                    </TableCell>
                    <TableCell>
                      {m.role !== "owner" && m.user !== user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon" aria-label="Member actions" />}
                          >
                            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {ROLES.map((r) => (
                              <DropdownMenuItem
                                key={r}
                                disabled={r === m.role}
                                onClick={() =>
                                  organization &&
                                  mutations.changeRole.mutate(
                                    { id: organization.id, memberId: m.id, role: r },
                                    {
                                      onSuccess: () => toast.success(`Role updated to ${r}`),
                                      onError: (e) => toast.error(errorMessage(e)),
                                    }
                                  )
                                }
                              >
                                Make {r}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setRemoving(m)}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={inviting} onOpenChange={setInviting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              They&apos;ll get an email invitation to join {organization?.name}.
            </DialogDescription>
          </DialogHeader>
          <InviteForm
            busy={mutations.invite.isPending}
            onSubmit={(email, role) => {
              if (!organization) return
              mutations.invite.mutate(
                { id: organization.id, email, role },
                {
                  onSuccess: () => {
                    toast.success(`Invitation sent to ${email}`)
                    setInviting(false)
                  },
                  onError: (e) => toast.error(errorMessage(e)),
                }
              )
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removing} onOpenChange={() => setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              They&apos;ll immediately lose access to this workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                removing &&
                organization &&
                mutations.removeMember.mutate(
                  { id: organization.id, memberId: removing.id },
                  {
                    onSuccess: () => {
                      toast.success("Member removed")
                      setRemoving(null)
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}

function InviteForm({
  onSubmit,
  busy,
}: {
  onSubmit: (email: string, role: string) => void
  busy: boolean
}) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("agent")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(email, role)
      }}
      className="flex flex-col gap-4"
    >
      <Field>
        <FieldLabel htmlFor="i-email">Email</FieldLabel>
        <div className="relative">
          <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="i-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="ps-9"
            required
          />
        </div>
      </Field>
      <Field>
        <FieldLabel>Role</FieldLabel>
        <Select value={role} onValueChange={(v) => setRole(v ?? role)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin — full access</SelectItem>
            <SelectItem value="developer">Developer — API, webhooks, logs</SelectItem>
            <SelectItem value="agent">Agent — inbox & contacts</SelectItem>
            <SelectItem value="viewer">Viewer — read only</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <DialogFooter>
        <Button type="submit" disabled={busy || !email.trim()}>
          {busy && <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />}
          Send invitation
        </Button>
      </DialogFooter>
    </form>
  )
}
