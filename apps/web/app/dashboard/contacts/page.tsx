"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyState, PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Contact01Icon,
  MoreHorizontalIcon,
  SearchIcon,
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
import { Checkbox } from "@workspace/ui/components/checkbox"
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
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
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
import { useContactMutations, useContacts } from "@/hooks/api"
import type { Contact } from "@/types/api"

export default function ContactsPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [creating, setCreating] = React.useState(false)
  const [deleting, setDeleting] = React.useState<Contact | null>(null)

  const contacts = useContacts({ search: search || undefined, page })
  const mutations = useContactMutations()

  const rows = contacts.data?.results ?? []
  const totalPages = contacts.data?.total_pages ?? 1

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <DashboardShell crumb="Contacts">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Contacts"
          description="People your bots talk to on WhatsApp."
          actions={
            <>
              <div className="relative">
                <HugeiconsIcon icon={SearchIcon} strokeWidth={2} className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Search contacts…"
                  className="w-44 ps-8"
                />
              </div>
              <Button onClick={() => setCreating(true)}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Add contact
              </Button>
            </>
          }
        />

        {contacts.isLoading ? (
          <div className="rounded-xl border border-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="m-4 h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={Contact01Icon} strokeWidth={2} className="size-6" />}
            title={search ? "No contacts match" : "No contacts yet"}
            description="Contacts appear automatically when people message your bots — or add them manually."
            action={
              <Button variant="outline" onClick={() => setCreating(true)}>
                Add contact
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox
                        aria-label="Select all"
                        checked={rows.length > 0 && selected.size === rows.length}
                        onCheckedChange={(v) =>
                          setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())
                        }
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Last seen</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <Checkbox
                          aria-label={`Select ${c.name || c.phone_number}`}
                          checked={selected.has(c.id)}
                          onCheckedChange={() => toggle(c.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[10px]">
                              {initials(c.name || c.profile_name || c.phone_number)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {c.name || c.profile_name || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.phone_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.tags.length === 0 ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : (
                            c.tags.slice(0, 3).map((t) => (
                              <Badge key={t} variant="outline" className="text-[10px]">
                                {t}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.last_seen_at ? timeAgo(c.last_seen_at) + " ago" : "Never"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon" aria-label="Contact actions" />}
                          >
                            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard
                                  .writeText(c.phone_number)
                                  .then(() => toast.success("Phone copied"))
                              }
                            >
                              Copy phone
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleting(c)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Page {contacts.data?.page} of {totalPages} · {contacts.data?.count} contacts
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateContactDialog
        open={creating}
        onOpenChange={setCreating}
        onCreate={(body) =>
          mutations.create.mutate(body, {
            onSuccess: () => {
              toast.success("Contact added")
              setCreating(false)
            },
            onError: (e) => toast.error(errorMessage(e)),
          })
        }
        busy={mutations.create.isPending}
      />

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name || deleting?.phone_number} will be removed. Their
              conversation history stays.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                deleting &&
                mutations.remove.mutate(deleting.id, {
                  onSuccess: () => {
                    toast.success("Contact deleted")
                    setDeleting(null)
                  },
                  onError: (e) => toast.error(errorMessage(e)),
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}

function CreateContactDialog({
  open,
  onOpenChange,
  onCreate,
  busy,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (body: { phone_number: string; name: string }) => void
  busy: boolean
}) {
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    if (open) {
      setName("")
      setPhone("")
      setError(undefined)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add contact</DialogTitle>
          <DialogDescription>
            Add someone your bots can message on WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!/^[+\d][\d\s-]{5,}$/.test(phone.trim())) {
              setError("Enter a valid phone number, e.g. 2557XXXXXXXX")
              return
            }
            onCreate({ phone_number: phone.trim(), name: name.trim() })
          }}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel htmlFor="c-name">Name</FieldLabel>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amina Juma"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="c-phone">Phone</FieldLabel>
            <Input
              id="c-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="2557XXXXXXXX"
              aria-invalid={!!error}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !phone.trim()}>
              {busy && <HugeiconsIcon icon={Add01Icon} strokeWidth={2} className="animate-spin" />}
              Add contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
