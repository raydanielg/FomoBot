"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyState, PageHeader, StatusDot } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Loading03Icon,
  MoreHorizontalIcon,
  SentIcon,
  WebhookIcon,
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
import { Field, FieldDescription, FieldLabel } from "@workspace/ui/components/field"
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
import { timeAgo } from "@/lib/format"
import {
  useBots,
  useWebhookDeliveries,
  useWebhookMutations,
  useWebhooks,
} from "@/hooks/api"
import type { Webhook } from "@/types/api"

const EVENTS = [
  "message.received", "message.sent", "message.delivered", "message.read",
  "message.failed", "bot.connected", "bot.disconnected", "bot.qr_required",
  "bot.session_expired", "contact.created", "contact.updated",
  "conversation.created", "conversation.updated",
]

export default function WebhooksPage() {
  const [creating, setCreating] = React.useState(false)
  const [deliveriesFor, setDeliveriesFor] = React.useState<Webhook | null>(null)
  const [deleting, setDeleting] = React.useState<Webhook | null>(null)
  const webhooks = useWebhooks()
  const mutations = useWebhookMutations()
  const rows = webhooks.data?.results ?? []

  return (
    <DashboardShell crumb="Webhooks">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Webhooks"
          description="Get HTTP callbacks when events happen in your workspace."
          actions={
            <Button onClick={() => setCreating(true)}>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Add webhook
            </Button>
          }
        />

        {webhooks.isLoading ? (
          <div className="rounded-xl border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="m-4 h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={WebhookIcon} strokeWidth={2} className="size-6" />}
            title="No webhooks yet"
            description="Add an endpoint to receive message and bot events in real time."
            action={
              <Button onClick={() => setCreating(true)}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Add webhook
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Failures</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.name}</TableCell>
                    <TableCell className="max-w-56">
                      <span className="block truncate font-mono text-xs text-muted-foreground">
                        {w.url}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {w.subscribed_events.includes("*")
                        ? "All events"
                        : `${w.subscribed_events.length} events`}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm capitalize">
                        <StatusDot status={w.status} />
                        {w.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {w.consecutive_failures > 0 ? (
                        <Badge variant="outline" className="border-destructive/40 text-destructive">
                          {w.consecutive_failures} failed
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon" aria-label="Webhook actions" />}
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => setDeliveriesFor(w)}>
                            View deliveries
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              mutations.test.mutate(w.id, {
                                onSuccess: () => toast.success("Test event queued"),
                                onError: (e) => toast.error(errorMessage(e)),
                              })
                            }
                          >
                            Test webhook
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleting(w)}
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
        )}
      </div>

      <CreateWebhookDialog
        open={creating}
        onOpenChange={setCreating}
        busy={mutations.create.isPending}
        onCreate={(body) =>
          mutations.create.mutate(body, {
            onSuccess: () => {
              toast.success("Webhook created")
              setCreating(false)
            },
            onError: (e) => toast.error(errorMessage(e)),
          })
        }
      />

      <DeliveriesDialog
        webhook={deliveriesFor}
        onClose={() => setDeliveriesFor(null)}
        onReplay={(deliveryId) =>
          deliveriesFor &&
          mutations.replayDelivery.mutate(
            { id: deliveriesFor.id, deliveryId },
            {
              onSuccess: () => toast.success("Delivery re-queued"),
              onError: (e) => toast.error(errorMessage(e)),
            }
          )
        }
      />

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete webhook?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.name}&quot; will stop receiving events
              immediately.
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
                    toast.success("Webhook deleted")
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

function DeliveriesDialog({
  webhook,
  onClose,
  onReplay,
}: {
  webhook: Webhook | null
  onClose: () => void
  onReplay: (deliveryId: string) => void
}) {
  const deliveries = useWebhookDeliveries(webhook?.id ?? "")
  return (
    <Dialog open={!!webhook} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deliveries — {webhook?.name}</DialogTitle>
          <DialogDescription>Recent event deliveries to this endpoint.</DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(deliveries.data?.results ?? []).map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.event}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 capitalize">
                      <StatusDot status={d.status} />
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{d.response_status ?? "—"}</TableCell>
                  <TableCell>{d.attempt_count}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {timeAgo(d.created_at)} ago
                  </TableCell>
                  <TableCell>
                    {d.status === "failed" && (
                      <Button variant="ghost" size="xs" onClick={() => onReplay(d.id)}>
                        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
                        Replay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!deliveries.isLoading && deliveries.data?.results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No deliveries yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CreateWebhookDialog({
  open,
  onOpenChange,
  onCreate,
  busy,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (body: { name: string; url: string; bot: string | null; subscribed_events: string[]; status: string }) => void
  busy: boolean
}) {
  const bots = useBots({ page_size: 50 })
  const [name, setName] = React.useState("")
  const [url, setUrl] = React.useState("")
  const [bot, setBot] = React.useState("")
  const [events, setEvents] = React.useState<Set<string>>(new Set(["*"]))

  React.useEffect(() => {
    if (open) {
      setName("")
      setUrl("")
      setBot("")
      setEvents(new Set(["*"]))
    }
  }, [open])

  function toggle(e: string) {
    setEvents((prev) => {
      if (e === "*") return prev.has("*") ? new Set() : new Set(["*"])
      const next = new Set(prev)
      next.delete("*")
      if (next.has(e)) next.delete(e)
      else next.add(e)
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add webhook</DialogTitle>
          <DialogDescription>
            FomoBot signs each request — keep the secret we generate safe.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onCreate({
              name,
              url,
              bot: bot || null,
              subscribed_events: [...events],
              status: "active",
            })
          }}
          className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pe-1"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="w-name">Name</FieldLabel>
              <Input
                id="w-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="CRM sync"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Bot</FieldLabel>
              <Select value={bot} onValueChange={(v) => setBot(v ?? "")}>
                <SelectTrigger><SelectValue placeholder="All bots" /></SelectTrigger>
                <SelectContent>
                  {(bots.data?.results ?? []).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="w-url">Endpoint URL</FieldLabel>
            <Input
              id="w-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/fomobot"
              required
            />
            <FieldDescription>Must be HTTPS in production.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Events</FieldLabel>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-3">
              {["*", ...EVENTS].map((ev) => (
                <label key={ev} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={events.has(ev)} onCheckedChange={() => toggle(ev)} />
                  <span className="font-mono text-[11px]">{ev === "*" ? "all events" : ev}</span>
                </label>
              ))}
            </div>
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !name.trim() || !url.trim() || events.size === 0}>
              {busy && <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />}
              Add webhook
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
