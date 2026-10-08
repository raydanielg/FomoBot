"use client"

import * as React from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { CopyButton } from "@/components/copy-button"
import { EmptyState, PageHeader, StatusDot } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Alert02Icon,
  Key01Icon,
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
import { timeAgo } from "@/lib/format"
import { useApiKeyMutations, useApiKeys } from "@/hooks/api"
import type { APIKey } from "@/types/api"

const SCOPES = [
  "messages:read", "messages:write",
  "contacts:read", "contacts:write",
  "conversations:read", "conversations:write",
  "webhooks:read", "webhooks:write",
  "bots:read", "bots:write",
  "logs:read", "templates:read", "templates:write",
]

export default function ApiKeysPage() {
  const [creating, setCreating] = React.useState(false)
  const [revealed, setRevealed] = React.useState<{ key: string; name: string } | null>(null)
  const [revoking, setRevoking] = React.useState<APIKey | null>(null)
  const keys = useApiKeys()
  const mutations = useApiKeyMutations()
  const rows = keys.data?.results ?? []

  return (
    <DashboardShell crumb="API Keys">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="API keys"
          description="Use FomoBot API credentials to connect your application."
          actions={
            <Button onClick={() => setCreating(true)}>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Create API key
            </Button>
          }
        />

        {keys.isLoading ? (
          <div className="rounded-xl border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="m-4 h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<HugeiconsIcon icon={Key01Icon} strokeWidth={2} className="size-6" />}
            title="No API keys yet"
            description="Create a key to call the FomoBot API from your app or server."
            action={
              <Button onClick={() => setCreating(true)}>
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
                Create API key
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {k.prefix}…
                    </TableCell>
                    <TableCell>
                      <Badge variant={k.environment === "live" ? "default" : "secondary"}>
                        {k.environment}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-40">
                      <span className="block truncate font-mono text-xs text-muted-foreground">
                        {k.scopes.join(", ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {k.last_used_at ? timeAgo(k.last_used_at) + " ago" : "Never"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm capitalize">
                        <StatusDot status={k.status} />
                        {k.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon" aria-label="Key actions" />}
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() =>
                              mutations.rotate.mutate(k.id, {
                                onSuccess: (res) =>
                                  setRevealed({ key: res.api_key, name: k.name }),
                                onError: (e) => toast.error(errorMessage(e)),
                              })
                            }
                          >
                            Rotate key
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setRevoking(k)}
                          >
                            Revoke
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

      <CreateKeyDialog
        open={creating}
        onOpenChange={setCreating}
        busy={mutations.create.isPending}
        onCreate={(body) =>
          mutations.create.mutate(body, {
            onSuccess: (res) => {
              setCreating(false)
              setRevealed({ key: res.api_key, name: res.name })
            },
            onError: (e) => toast.error(errorMessage(e)),
          })
        }
      />

      <Dialog open={!!revealed} onOpenChange={() => setRevealed(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>
            <DialogDescription>
              Save this key now — you won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
              <code className="flex-1 break-all font-mono text-xs">{revealed?.key}</code>
              <CopyButton value={revealed?.key ?? ""} size="icon-sm" variant="ghost" />
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="mt-0.5 size-4 shrink-0" />
              Store it somewhere safe. Anyone with this key can call the API as
              your organization.
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setRevealed(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!revoking} onOpenChange={() => setRevoking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke &quot;{revoking?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Applications using this key will immediately stop working. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() =>
                revoking &&
                mutations.revoke.mutate(revoking.id, {
                  onSuccess: () => {
                    toast.success("API key revoked")
                    setRevoking(null)
                  },
                  onError: (e) => toast.error(errorMessage(e)),
                })
              }
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}

function CreateKeyDialog({
  open,
  onOpenChange,
  onCreate,
  busy,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreate: (body: { name: string; environment: string; scopes: string[] }) => void
  busy: boolean
}) {
  const [name, setName] = React.useState("")
  const [env, setEnv] = React.useState("live")
  const [scopes, setScopes] = React.useState<Set<string>>(new Set(["*"]))

  React.useEffect(() => {
    if (open) {
      setName("")
      setEnv("live")
      setScopes(new Set(["*"]))
    }
  }, [open])

  function toggleScope(s: string) {
    setScopes((prev) => {
      const next = new Set(prev)
      if (s === "*") return next.has("*") ? new Set() : new Set(["*"])
      next.delete("*")
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <DialogDescription>
            Choose what this key is allowed to do.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onCreate({ name, environment: env, scopes: [...scopes] })
          }}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel htmlFor="k-name">Name</FieldLabel>
            <Input
              id="k-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production backend"
              required
            />
          </Field>
          <Field>
            <FieldLabel>Environment</FieldLabel>
            <Select value={env} onValueChange={(v) => setEnv(v ?? env)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="test">Test</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Scopes</FieldLabel>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3">
              {["*", ...SCOPES].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={scopes.has(s)}
                    onCheckedChange={() => toggleScope(s)}
                  />
                  <span className="font-mono text-xs">{s === "*" ? "All scopes" : s}</span>
                </label>
              ))}
            </div>
          </Field>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy || !name.trim() || scopes.size === 0}>
              {busy && <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-4 animate-spin" />}
              Create key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
