"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { PageHeader } from "@/components/page-header"
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
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"

import { errorMessage } from "@/lib/api/client"
import { useAdminBroadcast, useAdminBroadcastEstimate, useAdminOrgs } from "@/hooks/admin"

export default function AdminNotificationsPage() {
  const [audience, setAudience] = React.useState("all")
  const [title, setTitle] = React.useState("")
  const [body, setBody] = React.useState("")
  const [confirming, setConfirming] = React.useState(false)
  const broadcast = useAdminBroadcast()
  const estimate = useAdminBroadcastEstimate(audience)
  const orgs = useAdminOrgs()

  return (
    <AdminShell crumbs={["Notifications"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Send notification"
          description="Broadcast an in-app notification. Everything is audited."
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Composer</CardTitle>
            <CardDescription>
              Audience estimate updates live before you send.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(String(v))}>
                <SelectTrigger aria-label="Audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All active users</SelectItem>
                  {(orgs.data?.results ?? []).map((o) => (
                    <SelectItem key={o.id} value={`org:${o.id}`}>
                      Org — {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Recipients:{" "}
                <span className="font-medium text-foreground">
                  {estimate.isFetching ? "…" : (estimate.data?.recipients ?? "—")}
                </span>
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Scheduled maintenance tonight" />
            </div>
            <div className="grid gap-1.5">
              <Label>Message</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="What should users know?" />
            </div>
            <div className="flex justify-end">
              <Button
                disabled={!title.trim() || !body.trim()}
                onClick={() => setConfirming(true)}
              >
                Send notification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Send to {estimate.data?.recipients ?? "…"} users?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{title}&quot; will be pushed to their notification center
              immediately. This action is audited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={broadcast.isPending}
              onClick={() =>
                broadcast.mutate(
                  { title, body, audience, channel: "in_app" },
                  {
                    onSuccess: (r) => {
                      toast.success(`Sent to ${r.recipients} users`)
                      setConfirming(false)
                      setTitle(""); setBody("")
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Send now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
