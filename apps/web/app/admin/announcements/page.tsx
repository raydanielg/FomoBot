"use client"

import * as React from "react"

import { AdminShell } from "@/components/admin-shell"
import { AdminTable } from "@/components/admin-table"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
import { timeAgo } from "@/lib/format"
import { useAdminAnnouncementActions, useAdminAnnouncements } from "@/hooks/admin"

export default function AnnouncementsPage() {
  const announcements = useAdminAnnouncements()
  const actions = useAdminAnnouncementActions()
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [severity, setSeverity] = React.useState("info")

  return (
    <AdminShell crumbs={["Announcements"]}>
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Announcements"
          description="Platform-wide messages pushed to every user."
          actions={<Button size="sm" onClick={() => setOpen(true)}>New announcement</Button>}
        />

        <AdminTable
          loading={announcements.isLoading}
          data={announcements.data?.results}
          empty={{ title: "No announcements" }}
          columns={[
            { header: "Title", render: (a) => <span className="font-medium">{a.title}</span> },
            { header: "Severity", render: (a) => (
              <Badge variant={a.severity === "critical" ? "destructive" : a.severity === "warning" ? "secondary" : "outline"} className="capitalize">
                {a.severity}
              </Badge>
            )},
            { header: "Audience", render: (a) => <span className="capitalize text-muted-foreground">{a.audience}</span> },
            { header: "Status", render: (a) => <Badge variant="outline" className="capitalize">{a.status}</Badge> },
            { header: "Sent", render: (a) => a.sent_count },
            { header: "Created", render: (a) => <span className="text-muted-foreground">{timeAgo(a.created_at)} ago</span> },
            { header: "", className: "w-10", render: (a) =>
              a.status !== "sent" && (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Actions" />}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        actions.publish.mutate(a.id, {
                          onSuccess: (r) => toast.success(r.detail),
                          onError: (e) => toast.error(errorMessage(e)),
                        })
                      }
                    >
                      Publish now
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )},
          ]}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New announcement</DialogTitle>
            <DialogDescription>Saved as draft — publish when ready.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Message</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
            </div>
            <div className="grid gap-1.5">
              <Label>Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(String(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              disabled={!title.trim() || !message.trim() || actions.create.isPending}
              onClick={() =>
                actions.create.mutate(
                  { title, message, severity, audience: "all", channels: ["in_app"] },
                  {
                    onSuccess: () => {
                      toast.success("Announcement drafted")
                      setOpen(false); setTitle(""); setMessage("")
                    },
                    onError: (e) => toast.error(errorMessage(e)),
                  }
                )
              }
            >
              Save draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  )
}
