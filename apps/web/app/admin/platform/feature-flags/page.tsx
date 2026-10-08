"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { useAdminFlagActions, useAdminFlags } from "@/hooks/admin"

export default function FeatureFlagsPage() {
  const flags = useAdminFlags()
  const actions = useAdminFlagActions()
  const [open, setOpen] = React.useState(false)
  const [key, setKey] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [rollout, setRollout] = React.useState(100)

  return (
    <AdminShell crumbs={["Platform", "Feature flags"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Feature flags"
          description="Toggle platform features without a deploy."
          actions={<Button size="sm" onClick={() => setOpen(true)}>New flag</Button>}
        />

        <AdminTable
          loading={flags.isLoading}
          data={flags.data?.results}
          empty={{ title: "No feature flags", description: "Create one to gate a feature." }}
          columns={[
            { header: "Key", render: (f) => <span className="font-mono text-xs font-medium">{f.key}</span> },
            { header: "Description", render: (f) => <span className="text-muted-foreground">{f.description || "—"}</span> },
            { header: "Rollout", render: (f) => <Badge variant="outline">{f.rollout_percent}%</Badge> },
            { header: "Enabled", render: (f) => (
              <Switch
                checked={f.enabled}
                disabled={actions.update.isPending}
                onCheckedChange={(enabled) =>
                  actions.update.mutate(
                    { id: f.id, enabled },
                    {
                      onSuccess: () => toast.success(`${f.key} ${enabled ? "enabled" : "disabled"}`),
                      onError: (e) => toast.error(errorMessage(e)),
                    }
                  )
                }
                aria-label={`Toggle ${f.key}`}
              />
            )},
            { header: "", className: "w-20", render: (f) => (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={actions.remove.isPending}
                onClick={() =>
                  actions.remove.mutate(f.id, {
                    onSuccess: () => toast.success("Flag deleted"),
                    onError: (e) => toast.error(errorMessage(e)),
                  })
                }
              >
                Delete
              </Button>
            )},
          ]}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New feature flag</DialogTitle>
            <DialogDescription>Start disabled, then roll out gradually.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Key</Label>
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                placeholder="new_inbox"
                className="font-mono"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Rollout %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={rollout}
                onChange={(e) => setRollout(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              disabled={!key.trim() || actions.create.isPending}
              onClick={() =>
                actions.create.mutate(
                  { key, description, rollout_percent: rollout, enabled: false },
                  {
                    onSuccess: () => {
                      toast.success("Flag created")
                      setOpen(false); setKey(""); setDescription("")
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
