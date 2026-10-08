"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { EmptyState, PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  DocumentCodeIcon,
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
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { timeAgo } from "@/lib/format"
import { useTemplateMutations, useTemplates } from "@/hooks/api"
import type { MessageTemplate } from "@/types/api"

export default function TemplatesPage() {
  const [creating, setCreating] = React.useState(false)
  const [editing, setEditing] = React.useState<MessageTemplate | null>(null)
  const [deleting, setDeleting] = React.useState<MessageTemplate | null>(null)
  const templates = useTemplates()
  const mutations = useTemplateMutations()
  const rows = templates.data?.results ?? []

  return (
    <DashboardShell crumb="Templates">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Message templates"
          description="Reusable messages with {{variables}} for broadcasts and automations."
          actions={
            <Button onClick={() => setCreating(true)}>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              New template
            </Button>
          }
        />

        {templates.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={DocumentCodeIcon} strokeWidth={2} className="size-6" />}
            title="No templates yet"
            description="Create a reusable message like 'Hello {{name}}, your order is ready.'"
            action={
              <Button onClick={() => setCreating(true)}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                New template
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((t) => (
              <div
                key={t.id}
                className="group flex flex-col rounded-xl border border-border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {timeAgo(t.updated_at)} ago
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-sm" aria-label="Template actions" />}
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => setEditing(t)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleting(t)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2 line-clamp-3 flex-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {t.content}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {t.variables.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No variables</span>
                  ) : (
                    t.variables.map((v) => (
                      <Badge key={v} variant="outline" className="font-mono text-[10px]">
                        {`{{${v}}}`}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TemplateDialog
        key={editing?.id ?? "new"}
        open={creating || !!editing}
        onOpenChange={(v) => {
          if (!v) {
            setCreating(false)
            setEditing(null)
          }
        }}
        template={editing}
        busy={mutations.create.isPending || mutations.update.isPending}
        onSubmit={(body) => {
          if (editing) {
            mutations.update.mutate(
              { id: editing.id, ...body },
              {
                onSuccess: () => {
                  toast.success("Template updated")
                  setEditing(null)
                },
                onError: (e) => toast.error(errorMessage(e)),
              }
            )
          } else {
            mutations.create.mutate(body, {
              onSuccess: () => {
                toast.success("Template created")
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
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.name}&quot; will be permanently removed.
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
                    toast.success("Template deleted")
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

function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSubmit,
  busy,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  template: MessageTemplate | null
  onSubmit: (body: { name: string; content: string; language: string }) => void
  busy: boolean
}) {
  const [name, setName] = React.useState(template?.name ?? "")
  const [content, setContent] = React.useState(template?.content ?? "")
  const [language, setLanguage] = React.useState(template?.language ?? "en")

  const variables = React.useMemo(
    () => Array.from(new Set([...content.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]!))),
    [content]
  )

  const preview = React.useMemo(
    () =>
      content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, v: string) => {
        const samples: Record<string, string> = {
          name: "Amina",
          order_id: "FB-1042",
          date: "Oct 12",
        }
        return samples[v] ?? `[${v}]`
      }),
    [content]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{template ? "Edit template" : "New template"}</DialogTitle>
          <DialogDescription>
            Use {"{{name}}"}-style variables — they&apos;re filled when the
            template is sent.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit({ name, content, language })
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="t-name">Template name</FieldLabel>
              <Input
                id="t-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="order_received"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="t-lang">Language</FieldLabel>
              <Input
                id="t-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="en"
                required
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="t-content">Message</FieldLabel>
            <Textarea
              id="t-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Hello {{name}},\nYour order {{order_id}} has been received."}
              rows={4}
              required
            />
          </Field>
          {variables.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              Variables:
              {variables.map((v) => (
                <Badge key={v} variant="outline" className="font-mono text-[10px]">
                  {`{{${v}}}`}
                </Badge>
              ))}
            </div>
          )}
          {content.trim() && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Preview</p>
              <p className="whitespace-pre-wrap text-sm">{preview}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !name.trim() || !content.trim()}>
              {busy && (
                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />
              )}
              {template ? "Save changes" : "Create template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
