"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyState, PageHeader, StatusDot } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ArrowDown01Icon,
  Delete02Icon,
  Flowchart01Icon,
  Loading03Icon,
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
import {
  Field,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { useAutomationMutations, useAutomations, useBots } from "@/hooks/api"
import type {
  Automation,
  AutomationAction,
  AutomationCondition,
} from "@/types/api"

const TRIGGERS: Record<string, string> = {
  "message.received": "Message received",
  "message.sent": "Message sent",
  "contact.created": "Contact created",
  "conversation.created": "Conversation created",
  "bot.connected": "Bot connected",
  "bot.disconnected": "Bot disconnected",
}

const OPERATORS: Record<string, string> = {
  equals: "equals",
  not_equals: "does not equal",
  contains: "contains",
  not_contains: "does not contain",
  starts_with: "starts with",
  exists: "exists",
}

const ACTION_TYPES: Record<string, { label: string; field: string; placeholder: string }> = {
  send_message: { label: "Send message", field: "text", placeholder: "Message text…" },
  send_template: { label: "Send template", field: "template_id", placeholder: "Template ID" },
  add_tag: { label: "Add tag", field: "tag", placeholder: "vip" },
  remove_tag: { label: "Remove tag", field: "tag", placeholder: "vip" },
  assign_conversation: { label: "Assign conversation", field: "user_id", placeholder: "User ID" },
  call_webhook: { label: "Call webhook", field: "url", placeholder: "https://…" },
  delay: { label: "Delay", field: "seconds", placeholder: "60" },
}

export default function AutomationsPage() {
  const [creating, setCreating] = React.useState(false)
  const [editing, setEditing] = React.useState<Automation | null>(null)
  const [deleting, setDeleting] = React.useState<Automation | null>(null)
  const automations = useAutomations()
  const mutations = useAutomationMutations()
  const bots = useBots({ page_size: 50 })
  const rows = automations.data?.results ?? []
  const botName = (id: string | null) =>
    bots.data?.results.find((b) => b.id === id)?.name ?? "All bots"

  return (
    <DashboardShell crumb="Automations">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Automations"
          description="Rules that run when events happen — e.g. auto-reply to keywords."
          actions={
            <Button onClick={() => setCreating(true)}>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Create automation
            </Button>
          }
        />

        {automations.isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={Flowchart01Icon} strokeWidth={2} className="size-6" />}
            title="No automations yet"
            description='Example: WHEN a message is received → IF it contains "price" → THEN send your price list.'
            action={
              <Button onClick={() => setCreating(true)}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Create automation
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {rows.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 rounded-xl border border-border p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <HugeiconsIcon icon={Flowchart01Icon} strokeWidth={2} className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{a.name}</p>
                    <Badge variant="outline" className="gap-1.5 capitalize">
                      <StatusDot status={a.status} />
                      {a.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    When {TRIGGERS[a.trigger_type] ?? a.trigger_type} · {botName(a.bot)} ·{" "}
                    {a.actions.length} {a.actions.length === 1 ? "action" : "actions"} ·{" "}
                    ran {a.run_count}×
                  </p>
                </div>
                <Switch
                  aria-label="Enable automation"
                  checked={a.status === "active"}
                  onCheckedChange={(v) =>
                    mutations.update.mutate(
                      { id: a.id, status: v ? "active" : "paused" },
                      { onError: (e) => toast.error(errorMessage(e)) }
                    )
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" aria-label="Automation actions" />}
                  >
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => setEditing(a)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleting(a)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      <AutomationDialog
        key={editing?.id ?? "new"}
        open={creating || !!editing}
        onOpenChange={(v) => {
          if (!v) {
            setCreating(false)
            setEditing(null)
          }
        }}
        automation={editing}
        bots={bots.data?.results ?? []}
        busy={mutations.create.isPending || mutations.update.isPending}
        onSubmit={(body) => {
          if (editing) {
            mutations.update.mutate(
              { id: editing.id, ...body },
              {
                onSuccess: () => {
                  toast.success("Automation updated")
                  setEditing(null)
                },
                onError: (e) => toast.error(errorMessage(e)),
              }
            )
          } else {
            mutations.create.mutate(body, {
              onSuccess: () => {
                toast.success("Automation created")
                setCreating(false)
              },
              onError: (e) => toast.error(errorMessage(e)),
            })
          }
        }}
      />

      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete automation?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.name}&quot; will stop running immediately.
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
                    toast.success("Automation deleted")
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

function AutomationDialog({
  open,
  onOpenChange,
  automation,
  bots,
  onSubmit,
  busy,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  automation: Automation | null
  bots: { id: string; name: string }[]
  onSubmit: (body: Record<string, unknown>) => void
  busy: boolean
}) {
  const [name, setName] = React.useState(automation?.name ?? "")
  const [trigger, setTrigger] = React.useState(automation?.trigger_type ?? "message.received")
  const [bot, setBot] = React.useState(automation?.bot ?? "")
  const [conditions, setConditions] = React.useState<AutomationCondition[]>(
    automation?.conditions ?? []
  )
  const [actions, setActions] = React.useState<AutomationAction[]>(
    automation?.actions?.map((a) => ({ ...a })) ?? [
      { action_type: "send_message", config: {}, order: 0 },
    ]
  )

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name,
      trigger_type: trigger,
      bot: bot || null,
      status: automation?.status ?? "active",
      conditions,
      actions: actions.map((a, i) => ({ ...a, order: i })),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{automation ? "Edit automation" : "Create automation"}</DialogTitle>
          <DialogDescription>
            When an event happens, if the conditions match, run the actions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pe-1">
          <Field>
            <FieldLabel htmlFor="a-name">Name</FieldLabel>
            <Input
              id="a-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Price enquiry auto-reply"
              required
            />
          </Field>

          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">WHEN</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={trigger} onValueChange={(v) => setTrigger(v ?? trigger)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TRIGGERS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bot} onValueChange={(v) => setBot(v ?? "")}>
                <SelectTrigger><SelectValue placeholder="All bots" /></SelectTrigger>
                <SelectContent>
                  {bots.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">IF</p>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() =>
                  setConditions((c) => [
                    ...c,
                    { field: "text", operator: "contains", value: "", case_insensitive: true },
                  ])
                }
              >
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Add condition
              </Button>
            </div>
            {conditions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No conditions — runs on every matching event.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {conditions.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={c.field}
                      onChange={(e) =>
                        setConditions((cs) => cs.map((x, j) => (j === i ? { ...x, field: e.target.value } : x)))
                      }
                      placeholder="text"
                      className="w-24 font-mono text-xs"
                    />
                    <Select
                      value={c.operator}
                      onValueChange={(v) =>
                        setConditions((cs) => cs.map((x, j) => (j === i ? { ...x, operator: v ?? x.operator } : x)))
                      }
                    >
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(OPERATORS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={c.value}
                      onChange={(e) =>
                        setConditions((cs) => cs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                      }
                      placeholder='"price"'
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove condition"
                      onClick={() => setConditions((cs) => cs.filter((_, j) => j !== i))}
                    >
                      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">THEN</p>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() =>
                  setActions((a) => [...a, { action_type: "send_message", config: {}, order: a.length }])
                }
              >
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Add action
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {actions.map((a, i) => {
                const cfg = ACTION_TYPES[a.action_type]
                return (
                  <div key={i} className="flex flex-col gap-2 rounded-md bg-muted/40 p-2.5">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                      <Select
                        value={a.action_type}
                        onValueChange={(v) =>
                          setActions((as) => as.map((x, j) => (j === i ? { ...x, action_type: v ?? x.action_type } : x)))
                        }
                      >
                        <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(ACTION_TYPES).map(([v, o]) => (
                            <SelectItem key={v} value={v}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove action"
                        onClick={() => setActions((as) => as.filter((_, j) => j !== i))}
                        disabled={actions.length === 1}
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                      </Button>
                    </div>
                    {cfg?.field === "text" ? (
                      <Textarea
                        value={String(a.config.text ?? "")}
                        onChange={(e) =>
                          setActions((as) =>
                            as.map((x, j) => (j === i ? { ...x, config: { ...x.config, text: e.target.value } } : x))
                          )
                        }
                        placeholder={cfg.placeholder}
                        rows={2}
                      />
                    ) : cfg ? (
                      <Input
                        value={String(a.config[cfg.field] ?? "")}
                        onChange={(e) =>
                          setActions((as) =>
                            as.map((x, j) => (j === i ? { ...x, config: { ...x.config, [cfg.field]: e.target.value } } : x))
                          )
                        }
                        placeholder={cfg.placeholder}
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !name.trim()}>
              {busy && <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />}
              {automation ? "Save changes" : "Create automation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
